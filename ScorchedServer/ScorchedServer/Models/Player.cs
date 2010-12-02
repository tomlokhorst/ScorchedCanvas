﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ScorchedServer.Properties;

namespace ScorchedServer.Models
{
  public class Player
  {
    public int id { get; set; }
    public string name { get; set; }
    public Vector position { get; set; }
    public double pos { get; set; } // x position
    public string color { get; set; }
    public double health { get; set; }
    public int score { get; set; }
    public double angle { get; set; }
    public double barrelAngle { get; set; }
    private FireRequest lastFireRequest;

    private IEnumerable<Vector> lastShot;

    public Player()
    {
      angle = Convert.ToInt32(Math.PI / 2);
    }
    
    public Rectangle GetRectangle()
    {
      // TODO : Rectangle should be rotated to match player angle.
      // Collission detection should be changed to line intersection.
      var posBellow = Vector.FromCart(this.position.X, this.position.Y - Settings.Default.tankHeight / 2);
      return Rectangle.FromCenter(posBellow, Settings.Default.tankWidth, Settings.Default.tankHeight);
    }

    public IEnumerable<Vector> Shape
    {
      get
      {
        return basicShape().Select(v => v.Rotate(this.angle, this.position));
      }
    }

    private IEnumerable<Vector> basicShape()
    {
      double dx = Settings.Default.tankWidth / 2;
      double dy = Settings.Default.tankHeight / 2;

      yield return Vector.FromCart(this.position.X + dx - Settings.Default.tankGapWidth, this.position.Y + dy);
      yield return Vector.FromCart(this.position.X - dx + Settings.Default.tankGapWidth, this.position.Y + dy);
      yield return Vector.FromCart(this.position.X - dx, this.position.Y - dy);
      yield return Vector.FromCart(this.position.X + dx, this.position.Y - dy);
    }

    public void shoot(FireRequest fr)
    {
      lastFireRequest = fr;

      lastShot = Shot.Trace(position, Vector.FromPolar(fr.angle, fr.power), Vector.FromCart(0, -0.01));
    }

    internal void clearLastShot()
    {
      lastShot = null;
    }

    internal IEnumerable<object> getLastShotAndPlayerHit(IEnumerable<Player> players)
    {
      if (lastShot == null)
        yield break;

      var tanks = from p in players
                  where p != this
                  select new Tuple<Player, IEnumerable<LineSegment>>(p, LineSegment.ClosedPath(p.Shape));
      var lineSegments = lastShot.Zip<Vector, Vector, LineSegment>(lastShot.Skip(1), LineSegment.FromVectors).Take(1000);

      var arc = new List<Vector>();
      Player other = null;

      foreach (var ls in lineSegments)
      {
        var t = intersect(ls, tanks);

        if (t == null)
        {
          arc.Add(ls.V1);
        }
        else
        {
          arc.Add(t.Item2);
          other = t.Item1;

          break;
        }
      }

      if (other != null)
      {
        yield return new { type = "fire", playerId = id, arc = arc.Select(v => new { x = v.X, y = v.Y }) };

        other.health -= 0.1;
        yield return new { type = "updatePlayer", player = other };
      }
    }

    internal Tuple<Player, Vector> intersect(LineSegment ls1, IEnumerable<Tuple<Player, IEnumerable<LineSegment>>> tanks)
    {
       return (from tank in tanks
               from ls2 in tank.Item2
               let intersection = ls1.Intersection(ls2)
               where intersection != null
               select new Tuple<Player, Vector>(tank.Item1, (Vector)intersection)
              ).FirstOrDefault();
    }

    //internal object getLastShot(IEnumerable<Player> players)
    //{
    //  if (lastShot == null)
    //    return null;

    //  var tanks = from p in players
    //              where p != this
    //              select new { player = p, lines = LineSegment.ClosedPath(p.Shape) };

    //  Func<LineSegment, bool> collision = l1 => tanks.Any(tank => tank.lines.Any(l2 => l1.Intersection(l2) != null));

    //  var lineSegments = lastShot.Zip(lastShot.Skip(1), LineSegment.FromVectors);

    //  var limitedShots = lineSegments.TakeWhile(r => !collision(r)).Select(l => l.V1);

    //  var arc = limitedShots.Take(1000).ToArray();

    //  var o = new { type = "fire", playerId = id, arc = arc.Select(v => new { x = v.X, y = v.Y }) };
    //  return o;
    //}

    //internal IEnumerable<object> getPlayersHitPlusWin(IEnumerable<Player> players)
    //{
    //  if (lastShot == null)
    //    yield break;

    //  var playersPlusTanks = players.Select(p => Tuple.Create(p, p.GetRectangle()));

    //  Func<Rectangle, IEnumerable<Player>> collide = r =>
    //    playersPlusTanks.SelectMany(pt => overlap(r, pt.Item2) ? new[] { pt.Item1 } : Enumerable.Empty<Player>());

    //  var rectangles = lastShot.Zip(lastShot.Skip(1), Rectangle.FromVectors);

    //  var playersHit = rectangles.Take(1000).SelectMany(collide);

    //  foreach (var p in playersHit)
    //  {
    //    p.health -= 0.1;

    //    yield return new { type = "updatePlayer", player = p };
    //  }
    //}

    //internal bool overlap(Rectangle r1, Rectangle r2)
    //{
    //  return (r1.LeftTop.X < r2.RightBottom.X && r1.RightBottom.X > r2.LeftTop.X &&
    //        r1.LeftTop.Y > r2.RightBottom.Y && r1.RightBottom.Y < r2.LeftTop.Y);
    //}
  }

  public static class Linq
  {
    public static IEnumerable<C> Zip<A, B, C>(this IEnumerable<A> xs, IEnumerable<B> ys, Func<A, B, C> f)
    {
      var exs = xs.GetEnumerator();
      var eys = ys.GetEnumerator();

      while (exs.MoveNext() && eys.MoveNext())
        yield return f(exs.Current, eys.Current);
    }
  }

  public class Tuple<A, B>
  {
    public A Item1;
    public B Item2;

    public Tuple(A a, B b)
    {
      Item1 = a;
      Item2 = b;
    }

    public static Tuple<C, D> Create<C, D>(C x, D y)
    {
      return new Tuple<C, D>(x, y);
    }
  }
}

