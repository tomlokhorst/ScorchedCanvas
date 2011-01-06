using System;
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

      yield return new { type = "fire", playerId = id, arc = arc.Select(v => new { x = v.X, y = v.Y }) };

      if (other != null)
      {

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
  }
}

