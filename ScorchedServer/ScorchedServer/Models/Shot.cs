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
        public float Angle { get; set; }
        public float Power { get; set; }

        public static IEnumerable<Vector> Trace(Vector p, Vector v, Vector a, float mass)
        {
            yield return p;

            int dt = 10;
            
            while (true)
            {
                Vector dv = a.Scale(dt / mass);
                p = p.Add(v, dt);
                p = p.Add(dv, dt / 2);
                v = v.Add(dv);
                yield return p;
            }
        }
    }
}
