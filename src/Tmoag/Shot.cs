using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tmoag
{
  public class Shot
  {
    public string Weapon { get; set; }
    public Vector Origin { get; set; }
    public double Angle { get; set; }
    public double Power { get; set; }

    // p = start position
    // v = start velocity
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
