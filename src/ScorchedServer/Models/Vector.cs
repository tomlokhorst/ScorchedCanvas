using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
  public struct Vector
  {
    public double X { get; private set; }
    public double Y { get; private set; }

    private Vector(double x, double y)
      : this()
    {
      X = x;
      Y = y;
    }

    public double Theta()
    {
      return Math.Atan2(X, Y);
    }

    public double Radius()
    {
      return Math.Sqrt(X * X + Y * Y);
    }

    public Vector Add(double dx, double dy)
    {
      return FromCart(this.X + dx, this.Y + dy);
    }

    public Vector Rotate(double angle)
    {
      return Rotate(angle, Vector.Origin());
    }

    public Vector Rotate(double angle, Vector origin)
    {
      var delta = this - origin;

      var dx = Math.Cos(angle) * delta.X - Math.Sin(angle) * delta.Y;
      var dy = Math.Sin(angle) * delta.X + Math.Cos(angle) * delta.Y;

      return new Vector(origin.X + dx, origin.Y + dy);
    }

    public override String ToString()
    {
      return string.Format("{{ X: {0}, Y: {1} }}", this.X, this.Y);
    }

    public static Vector FromCart(double x, double y)
    {
      return new Vector(x, y);
    }

    public static Vector FromPolar(double th, double r)
    {
      return new Vector(Math.Cos(th) * r, Math.Sin(th) * r);
    }

    public static Vector operator +(Vector v1, Vector v2)
    {
      return Vector.FromCart(v1.X + v2.X, v1.Y + v2.Y);
    }

    public static Vector operator -(Vector v1, Vector v2)
    {
      return Vector.FromCart(v1.X - v2.X, v1.Y - v2.Y);
    }

    public static Vector operator *(Vector v1, double factor)
    {
      return Vector.FromCart(v1.X * factor, v1.Y * factor);
    }

    public static Vector Origin()
    {
      return Vector.FromCart(0, 0);
    }
  }
}

