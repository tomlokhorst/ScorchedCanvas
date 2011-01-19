using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Tmoag
{
  public struct LineSegment
  {
    public Vector V1 { get; private set; }
    public Vector V2 { get; private set; }

    public LineSegment(Vector v1, Vector v2)
      : this()
    {
      this.V1 = v1;
      this.V2 = v2;
    }

    // Code from: http://local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/
    public Vector? Intersection(LineSegment that)
    {
      double d =
         (that.V2.Y - that.V1.Y) * (this.V2.X - this.V1.X)
         -
         (that.V2.X - that.V1.X) * (this.V2.Y - this.V1.Y);
      
      double n_a =
         (that.V2.X - that.V1.X) * (this.V1.Y - that.V1.Y)
         -
         (that.V2.Y - that.V1.Y) * (this.V1.X - that.V1.X);
      
      double n_b =
         (this.V2.X - this.V1.X) * (this.V1.Y - that.V1.Y)
         -
         (this.V2.Y - this.V1.Y) * (this.V1.X - that.V1.X);
      
      // parallel lines
      if (d == 0)
         return null;
      
      double ua = n_a / d;
      double ub = n_b / d;
      
      if (ua >= 0d && ua <= 1d && ub >= 0d && ub <= 1d)
      {
         double x = this.V1.X + (ua * (this.V2.X - this.V1.X));
         double y = this.V1.Y + (ua * (this.V2.Y - this.V1.Y));
         return Vector.FromCart(x, y);
      }
      return null;
    }

    public override String ToString()
    {
      return string.Format("{{ Vector: {0}, Vector: {1} }}", this.V1, this.V2);
    }

    public static LineSegment FromVectors(Vector v1, Vector v2)
    {
      return new LineSegment(v1, v2);
    }

    public static IEnumerable<LineSegment> ClosedPath(IEnumerable<Vector> vs)
    {
      Vector first = Vector.Origin(); // To satisfy compiler
      Vector? prev = null;

      foreach (Vector v in vs)
      {
        if (prev != null)
          yield return new LineSegment((Vector)prev, v);
        else
          first = v;

        prev = v;
      }

      yield return new LineSegment((Vector)prev, first);
    }
  }
}

