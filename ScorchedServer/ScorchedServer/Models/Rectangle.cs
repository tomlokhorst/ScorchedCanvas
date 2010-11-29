using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScorchedServer.Models
{
  public class Rectangle
  {
    public Vector LeftTop { get; private set; }
    public Vector RightTop { get; private set; }
    public Vector LeftBottom { get; private set; }
    public Vector RightBottom { get; private set; }

    public double Width { get; private set; }
    public double Height { get; private set; }
    public Vector Center { get; private set; }

    public Vector CenterTop { get; private set; }
    public Vector CenterLeft { get; private set; }
    public Vector CenterRight { get; private set; }
    public Vector CenterBottom { get; private set; }

    private Rectangle(double top, double left, double right, double bottom)
    {
      LeftTop = Vector.FromCart(left, top);
      RightTop = Vector.FromCart(right, top);
      LeftBottom = Vector.FromCart(left, bottom);
      RightBottom = Vector.FromCart(right, bottom);

      Width = right - left;
      Height = top - bottom;
      Center = Vector.FromCart(left + Width / 2, bottom + Height / 2);

      CenterTop = Vector.FromCart(Center.X, top);
      CenterLeft = Vector.FromCart(left, Center.Y);
      CenterRight = Vector.FromCart(right, Center.Y);
      CenterBottom = Vector.FromCart(Center.X, bottom);
    }

    public static Rectangle FromCenter(Vector center, double width, double height)
    {
      var top    = center.Y + height / 2;
      var left   = center.X - width / 2;
      var right  = center.X + width / 2;
      var bottom = center.Y - height / 2;

      return new Rectangle(top, left, right, bottom);
    }

    public static Rectangle FromPoints(double top, double left, double right, double bottom)
    {
      return new Rectangle(top, left, right, bottom);
    }

    public static Rectangle FromVectors(Vector v1, Vector v2)
    {
      var top    = v1.Y > v2.Y ? v1.Y : v2.Y;
      var left   = v1.X < v2.X ? v1.X : v2.X;
      var right  = v1.X > v2.X ? v1.X : v2.X;
      var bottom = v1.Y < v2.Y ? v1.Y : v2.Y;

      return new Rectangle(top, left, right, bottom);
    }
  }
}