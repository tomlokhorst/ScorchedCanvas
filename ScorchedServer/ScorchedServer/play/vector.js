function Vector(x, y)
{
  this.x = x;
  this.y = y;

  this.add = function(dx, dy)
  {
    var that = dx;
 
    if (that instanceof Vector)
      return Vector.fromCart(this.x + that.x, this.y + that.y);
    else
      return Vector.fromCart(this.x + dx, this.y + dy);
  }

  this.subtract = function (dx, dy)
  {
    var that = dx;
 
    if (that instanceof Vector)
      return Vector.fromCart(this.x - that.x, this.y - that.y);
    else
      return Vector.fromCart(this.x - dx, this.y - dy);
  }
  
  this.scale = function(factor)
  {
 	  return Vector.fromCart(x * factor, y * factor);
  }
  
  this.rotate = function(angle, origin)
  {
    origin = origin || Vector.origin;
    var delta = this.subtract(origin);

    var dx = Math.cos(angle) * delta.x - Math.sin(angle) * delta.y;
    var dy = Math.sin(angle) * delta.x + Math.cos(angle) * delta.y;
  
    return new Vector(origin.x + dx, origin.y + dy);
  }
  
  this.toString = function ()
  {
    return "{ x: " + this.x + ", y: " + this.y + "}";
  }
}


Vector.fromPolar = function(th, r)
{
	return new Vector(Math.cos(th) * r, Math.sin(th) * r);
}

Vector.fromCart = function(x, y)
{
	return new Vector(x, y);
}

Vector.origin = Vector.fromCart(0, 0);

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

function vectorSpaceRotate(obj, angle, origin)
{
  var copy = {};
  for (var v in obj)
    if (obj[v] instanceof Vector)
      copy[v] = obj[v].rotate(angle, origin);
    else
      copy[v] = obj[v];

  return copy;
}

