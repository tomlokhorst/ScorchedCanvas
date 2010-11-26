using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
    public class Vector
    {
        private readonly double _x;
        private readonly double _y;

        public double X { get { return _x; } }
        public double Y { get { return _y; } }

        public double Theta { get { return Math.Atan2(X, Y); } }
        public double Radius { get { return Math.Sqrt(X * X + Y * Y); } }

        private Vector(double x, double y)
        {
            _x = x;
            _y = y;
        }

        public static Vector FromCart(double x, double y)
        {
            return new Vector(x, y);
        }

        public static Vector FromPolar(double th, double r)
        {
            return new Vector(Math.Cos(th) * r, Math.Sin(th) * r);
        }

        public Vector Add(Vector that)
        {
            return Add(that, 1);
        }

        public Vector Add(Vector that, double factor)
        {
            return FromCart(this.X + that.X * factor, this.Y + that.Y * factor);
        }

        public Vector Scale(double factor)
        {
            return FromCart(this.X * factor, this.Y * factor);
        }
    }
}