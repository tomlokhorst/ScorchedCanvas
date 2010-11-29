using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Drawing;

namespace ScorchedServer.Models
{
  public class Shot
  {
    public Weapon Weapon { get; set; }
    public Point Origin { get; set; }
    public double Angle { get; set; }
    public double Power { get; set; }

    // p = start position
    // v = star velocity
    // a = acceleration
    public static IEnumerable<Vector> Trace(Vector p, Vector v, Vector a, float mass = 1)
    {
      yield return p;

      int dt = 10;

      while (true)
      {
        Vector dv = a * (dt / mass);
        p = p + v * dt;
        p = p + dv * (dt / 2);
        v = v + dv;
        yield return p;
      }
    }
  }
}
