class Rectangle
  constructor: (@top, @left, @right, @bottom) ->
    @leftTop     = Vector.fromCart @left,  @top
    @rightTop    = Vector.fromCart @right, @top
    @leftBottom  = Vector.fromCart @left,  @bottom
    @rightBottom = Vector.fromCart @right, @bottom

    @width  = @right - @left;
    @height = @top - @bottom;
    @center = Vector.fromCart (@left + @width / 2), (@bottom + @height / 2)

    @centerTop    = Vector.fromCart @center.x, @top
    @centerLeft   = Vector.fromCart @left,     @center.y
    @centerRight  = Vector.fromCart @right,    @center.y
    @centerBottom = Vector.fromCart @center.x, @bottom

  rotate: (angle, origin) ->
    v1 = @leftTop.rotate     angle, origin
    v2 = @rightBottom.rotate angle, origin

    Rectangle.fromVectors v1, v2

  toString: () ->
    "Rectangle { top: #{@top}, left: #{@left}, right: #{@right}, bottom: #{@bottom} }"

Rectangle.fromPoints = (top, left, right, bottom) ->
  new Rectangle top, left, right, bottom

Rectangle.fromCenter = (center, width, height) ->
  top    = center.y + height / 2;
  left   = center.x - width  / 2;
  right  = center.x + width  / 2;
  bottom = center.y - height / 2;

  new Rectangle top, left, right, bottom

Rectangle.fromVector = (v1, v2) ->
  top    = if v1.y > v2.y then v1.y else v2.y
  left   = if v1.x < v2.x then v1.x else v2.x
  right  = if v1.x > v2.x then v1.x else v2.x
  bottom = if v1.y < v2.y then v1.y else v2.y

  new Rectangle top, left, right, bottom

# attach to window object, for JIT CoffeeScript compiler.
window.Rectangle = Rectangle

