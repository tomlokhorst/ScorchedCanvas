class Player
  constructor: (options) ->
    @id           = options.id;
    @name         = options.name
    @health       = options.health
    @score        = options.score
    @angle        = options.angle
    @barrelAngle  = options.barrelAngle
    @color        = options.color
    @shape        = options.shape
    @pos          = options.pos
    @posy         = options.posy

  computeVectors: ->
    position  = Vector.fromCart @pos, @posy
    rect      = Rectangle.fromCenter position, config.tankWidth, config.tankHeight
    healthY   = rect.bottom - config.healthIndicatorBottomMargin

    @tank =
      center  : position
      rect    : rect
      body:
        leftTop     : rect.leftTop.add   config.tankGapWidth, 0
        rightTop    : rect.rightTop.add -config.tankGapWidth, 0
        leftBottom  : rect.leftBottom
        rightBottom : rect.rightBottom
      barrel:
        start : position
        end   : position.add(config.barrelLength, 0).rotate @barrelAngle - @angle, @position
      turret:
        center        : Vector.fromCart position.x, rect.bottom - rect.height + 1
        radius        : 2 * config.tankWidth / 4
        startAngle    : Math.PI - (Math.PI / 3.5)
        endAngle      : 2 * Math.PI + (Math.PI / 3.5)
        anticlockwise : true
      health:
        y      : healthY
        start  : Vector.fromCart rect.left                              , healthY
        middle : Vector.fromCart rect.left + config.tankWidth * @health , healthY
        end    : Vector.fromCart rect.left + config.tankWidth           , healthY

    world.me.tank = @tank if @id is world.me.id

    # Rotate tank for @angle
    @tank.body               = vectorSpaceRotate @tank.body,   this.angle, position
    @tank.barrel             = vectorSpaceRotate @tank.barrel, this.angle, position
    @tank.turret             = vectorSpaceRotate @tank.turret, this.angle, position
    @tank.turret.startAngle += @angle;
    @tank.turret.endAngle   += @angle;
    @tank.health             = vectorSpaceRotate @tank.health, this.angle, position


# attach to window object, for JIT CoffeeScript compiler.
window.Player = Player

