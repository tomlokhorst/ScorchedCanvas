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

