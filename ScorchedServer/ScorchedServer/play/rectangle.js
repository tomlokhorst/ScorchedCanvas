// Immutable
function Rectangle(top, left, right, bottom)
{
  this.top         = top;
  this.left        = left;
  this.right       = right;
  this.bottom      = bottom;
  this.leftTop     = Vector.fromCart(left, top);
  this.rightTop    = Vector.fromCart(right, top);
  this.leftBottom  = Vector.fromCart(left, bottom);
  this.rightBottom = Vector.fromCart(right, bottom);

  this.width  = this.right - this.left;
  this.height = this.top - this.bottom;
  this.center = Vector.fromCart(this.left + this.width / 2, this.bottom + this.height /2);

  this.centerTop    = Vector.fromCart(this.center.x, top);
  this.centerLeft   = Vector.fromCart(left, this.center.y);
  this.centerRight  = Vector.fromCart(right, this.center.y);
  this.centerBottom = Vector.fromCart(this.center.x, bottom);

  this.rotate = function(angle, origin)
  {
    var v1 = this.leftTop.rotate(angle, origin);
    var v2 = this.rightBottom.rotate(angle, origin);

    return Rectangle.fromVectors(v1, v2);
  }

  this.toString = function ()
  {
    return "Rectangle { top: " + this.top + ", left: " + this.left +  ", right: " + this.right +  ", bottom: " + this.bottom + "}";
  }
}

Rectangle.fromPoints = function (top, left, right, bottom)
{
  return new Rectangle(top, left, right, bottom);
}

Rectangle.fromCenter = function (center, width, height)
{
  var top    = center.y + height / 2;
  var left   = center.x - width / 2;
  var right  = center.x + width / 2;
  var bottom = center.y - height / 2;

  return new Rectangle(top, left, right, bottom);
}

Rectangle.fromVectors = function (v1, v2)
{
  var top    = v1.y > v2.y ? v1.y : v2.y;
  var left   = v1.x < v2.x ? v1.x : v2.x;
  var right  = v1.x > v2.x ? v1.x : v2.x;
  var bottom = v1.y < v2.y ? v1.y : v2.y;

  return new Rectangle(top, left, right, bottom);
}

