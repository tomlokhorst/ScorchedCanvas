class Vector
  constructor: (@x, @y) ->

  add: (dx, dy) ->
    if dx instanceof Vector
      that = dx
      Vector.fromCart @x + that.x, @y + that.y
    else
      Vector.fromCart @x + dx, @y + dy

  subtract: (dx, dy) ->
    if dx instanceof Vector
      that = dx
      Vector.fromCart @x - that.x, @y - that.y
    else
      Vector.fromCart @x - dx, @y - dy

  scale: (factor) ->
    Vector.fromCart @x * factor, @y * factor

  rotate: (angle, orgin = Vector.origin) ->
    delta = @subtract origin

    dx = Math.cos angle * delta.x - Math.sin angle * delta.y
    dy = Math.sin angle * delta.x + Math.cos angle * delta.y

    new Vector origin.x + dx, origin.y + dy

  toString: ->
    "{ x: #{@x}, y: #{@y} }"


Vector.fromPolar = (th, r) ->
  new Vector (Math.cos th * r), (Math.sin th * r)


Vector.fromCart = (x, y) ->
  new Vector x, y

Vector.origin = Vector.fromCart 0, 0

