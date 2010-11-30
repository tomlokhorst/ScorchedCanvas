using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;
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

    public IEnumerable<Vector> Shape()
    {
      return basicShape().Select(v => v.Rotate(this.angle, this.position));
    }

    private IEnumerable<Vector> basicShape()
    {
      double dx = Settings.Default.tankWidth / 2;
      double dy = Settings.Default.tankHeight / 2;

      yield return Vector.FromCart(this.position.X + dx, this.position.Y + dy);
      yield return Vector.FromCart(this.position.X - dx, this.position.Y + dy);
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

    internal object getLastShot(IEnumerable<Player> players)
    {
      if (lastShot == null)
        return null;

      var tanks = players.Select(p => p.GetRectangle());

      Func<Rectangle, bool> collision = r => tanks.Any(t => overlap(r, t));

      var rectangles = lastShot.Zip(lastShot.Skip(1), Rectangle.FromVectors);

      var limitedShots = rectangles.TakeWhile(r => !collision(r)).Select(r => r.LeftTop);

      var arc = limitedShots.Take(1000).ToArray();

      // In case you shout yourself.
      if (arc.Length == 0)
        return null;

      var o = new { type = "fire", playerId = id, arc = arc.Select(v => new { x = v.X, y = v.Y }) };
      return o;
    }

    internal IEnumerable<object> getPlayersHitPlusWin(IEnumerable<Player> players)
    {
      if (lastShot == null)
        yield break;

      var playersPlusTanks = players.Select(p => Tuple.Create(p, p.GetRectangle()));

      Func<Rectangle, IEnumerable<Player>> collide = r =>
        playersPlusTanks.SelectMany(pt => overlap(r, pt.Item2) ? new[] { pt.Item1 } : Enumerable.Empty<Player>());

      var rectangles = lastShot.Zip(lastShot.Skip(1), Rectangle.FromVectors);

      var playersHit = rectangles.Take(1000).SelectMany(collide);

      foreach (var p in playersHit)
      {
        p.health -= 0.1;

        yield return new { type = "updatePlayer", player = p };
      }
    }

    internal bool overlap(Rectangle r1, Rectangle r2)
    {
      return (r1.LeftTop.X < r2.RightBottom.X && r1.RightBottom.X > r2.LeftTop.X &&
            r1.LeftTop.Y > r2.RightBottom.Y && r1.RightBottom.Y < r2.LeftTop.Y);
    }
  }
}
