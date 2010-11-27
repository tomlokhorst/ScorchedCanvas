using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

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
    private FireRequest lastFireRequest;

    private IEnumerable<Vector> lastShot;

    public Player()
    {
      angle = Convert.ToInt32(Math.PI / 2);
    }
    
    public Rectangle GetRectangle()
    {
      var tankHeight = 16;
      var tankWidth = 32;

      return new Rectangle
      {
        LeftTop = Vector.FromCart(position.X - tankWidth / 2, position.Y + tankHeight),
        RightBottom = Vector.FromCart(position.X + tankWidth / 2, position.Y)
      };
    }


    public void shoot(FireRequest fr)
    {
      lastFireRequest = fr;

      lastShot = Shot.Trace(position, Vector.FromPolar(fr.angle, fr.power), Vector.FromCart(0, -0.01));
        //.TakeWhile(v => (Convert.ToInt32(v.X) > Landscape.fakeLandscape.Length && Convert.ToInt32(v.X) >= 0) ? false : Convert.ToInt32(v.Y) >= Landscape.fakeLandscape[Convert.ToInt32(v.X)]);
    }

    internal object getLastShot(IEnumerable<Player> players)
    {
      if (lastShot == null)
        return null;
      
      var tanks = players.Select(p => p.GetRectangle());

      Func<Rectangle, bool> collision = r => tanks.Any(t => overlap(r, t));

      var rectangles = lastShot.Zip(lastShot.Skip(1), (v1, v2) => new Rectangle { LeftTop = v1, RightBottom = v2 });

      var limitedShots = rectangles.TakeWhile(r => !collision(r)).Select(r => r.LeftTop);

      var o = new { type = "fire", playerId = id, arc = limitedShots.Take(1000).Select(v => new { x = v.X, y = v.Y}) };
      lastShot = null;
      return o;
    }

    internal bool overlap(Rectangle r1, Rectangle r2)
    {
      return (r1.LeftTop.X < r2.RightBottom.X && r1.RightBottom.X > r2.LeftTop.X &&
            r1.LeftTop.Y > r2.RightBottom.Y && r1.RightBottom.Y < r2.LeftTop.Y);
    }
  }
}