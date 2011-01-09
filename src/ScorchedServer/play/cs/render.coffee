renderer =
  canvas            : null
  ctx               : null
  backgroundCanvas  : null
  backgroundCtx     : null
  tick              : 0
  lastTimeDrawn     : new Date().valueOf()

  init: (canvas) ->
    renderer.canvas        = canvas
    renderer.canvas.width  = config.screenSize.width
    renderer.canvas.height = config.screenSize.height

    renderer.ctx = renderer.canvas.getContext "2d"
    renderer.ctx.scale 1, -1
    renderer.ctx.translate 0, -config.screenSize.height

    renderer.backgroundCanvas         = document.createElement "canvas"
    renderer.backgroundCanvas.width   = renderer.canvas.width
    renderer.backgroundCanvas.height  = renderer.canvas.height
    renderer.backgroundCtx            = renderer.backgroundCanvas.getContext "2d"

    renderer.drawBackground()

  render: ->
    now         = new Date().valueOf()
    updateDelta = now - renderer.lastTimeDrawn

    document.title = "FPS: " + Math.floor(1000 / updateDelta)

    if not renderer.firstLanscape and world.landscape.length
      renderer.firstLanscape = true
      renderer.drawLandscape()

    renderer.ctx.drawImage renderer.backgroundCanvas, 0, 0

    renderer.drawBullets updateDelta

    renderer._flip(renderer.drawTitle)(updateDelta)
 
    renderer.drawUI updateDelta unless world.gameover

    renderer.drawPlayers    updateDelta
    renderer.drawExplosions updateDelta

    renderer.drawCountdown updateDelta unless world.gameover

    renderer.lastTimeDrawn = now 
    setTimeout renderer.render, 40

  drawBackground: (tick) ->
    ctx = renderer.backgroundCtx

    ctx.fillStyle = "#141428"
    ctx.fillRect 0, 0, config.screenSize.width, config.screenSize.height

    for line, y in world.starfield
      for b, x in line
        if b
          alpha         = (y / config.screenSize.height) - .2;
          ctx.fillStyle = rgba 255, 255, 255, alpha
          ctx.fillRect x, y, 1, 1

  drawLandscape: ->
    ctx = renderer.backgroundCtx

    ctx.fillStyle = "#248C24"
    ctx.beginPath()
    ctx.moveTo 0, 0

    for y, x in world.landscape
      ctx.lineTo x, y

    ctx.lineTo x, 0
    ctx.fill()

  drawTitle: (updateDelta) ->
    ctx = renderer.ctx

    ctx.font = "48px sans-serif"
    ctx.fillStyle = rgba 255, 255, 255, 0.8

    centerx = config.screenSize.width / 2;
    unless world.gameover
      text = "The Mother of All Games";
      ctx.fillText(text, centerx - ctx.measureText(text).width / 2, 64)

      angle   = 90 - (world.guiAngle / Math.PI * 180)
      power   = world.guiPower * 10
      subText = angle.toFixed(0) + " degrees / " + "power " + power.toFixed(0)

      ctx.font = "24px sans-serif"
      ctx.fillText(subText, centerx - ctx.measureText(subText).width / 2, 100)
    else
      text = "Game Over"

      renderer._titleGlow ?= 0
      renderer._titleGlow += updateDelta / 4

      glow          = Math.abs((renderer._titleGlow % 512) - 256)
      ctx.fillStyle = rgba(glow, glow, 255)
      ctx.fillText(text, centerx - ctx.measureText(text).width / 2, 64)

      subText   = "reload to play again"
      ctx.font  = "24px sans-serif"
      ctx.fillText(subText, centerx - ctx.measureText(subText).width / 2, 100)

  drawPlayers: (updateDelta) ->
    ctx = renderer.ctx

    for player in world.players
      tank = player.tank;

      # tank body
      ctx.fillStyle = player.color

      ctx.beginPath()
      ctx.moveTo(tank.body.leftBottom.x, tank.body.leftBottom.y)
      ctx.lineTo(tank.body.rightBottom.x, tank.body.rightBottom.y)
      ctx.lineTo(tank.body.rightTop.x, tank.body.rightTop.y)
      ctx.lineTo(tank.body.leftTop.x, tank.body.leftTop.y)
      ctx.fill()

      # tank barrel
      ctx.strokeStyle = player.color
      ctx.lineWidth = config.barrelThickness

      ctx.beginPath()
      ctx.moveTo(tank.barrel.start.x, tank.barrel.start.y)
      ctx.lineTo(tank.barrel.end.x, tank.barrel.end.y)
      ctx.stroke()

      # tank turret
      ctx.beginPath()
      ctx.arc(tank.turret.center.x, tank.turret.center.y, tank.turret.radius, tank.turret.startAngle, tank.turret.endAngle, tank.turret.anticlockwise)
      ctx.fill()

      # health
      ctx.strokeStyle = rgba(255, 0, 0, 0.7)

      ctx.beginPath()
      ctx.moveTo(tank.health.start.x, tank.health.start.y)
      ctx.lineTo(tank.health.middle.x, tank.health.middle.y)
      ctx.stroke()

      # health bar background
      ctx.strokeStyle = rgba(255, 155, 155, 0.7)

      ctx.beginPath()
      ctx.moveTo(tank.health.middle.x, tank.health.middle.y)
      ctx.lineTo(tank.health.end.x, tank.health.end.y)
      ctx.stroke()

      # me circle
      if player is world.me
        player.glow ?= 0;
        player.glow += updateDelta / 4

        glow            = Math.abs((player.glow % 512) - 256)
        ctx.strokeStyle = rgba(glow, glow, 255)

        ctx.beginPath()
        ctx.arc(player.pos, player.posy + 5, 25, 0, 2 * Math.PI, false)
        ctx.stroke()


  drawBullets: (updateDelta) ->
    ctx = renderer.ctx

    for bullet in world.bullets
      bullet.step += updateDelta / 40;

      if bullet.step < bullet.arc.length
        bulletCoord   = bullet.arc[Math.floor(bullet.step)]
        ctx.fillStyle = "red"

        ctx.beginPath()
        ctx.arc(bulletCoord.x, bulletCoord.y, 3, 0, 2 * Math.PI, false)
        ctx.fill()
      else if bullet.collision and bullet.arc.length > 0
        lastCoord = bullet.arc[bullet.arc.length - 1]
        world.explosions.push
          x         : lastCoord.x,
          y         : lastCoord.y,
          duration  : 0

    world.bullets = world.bullets.filter (bullet) -> bullet.step < bullet.arc.length

  drawExplosions: (updateDelta) ->
    ctx = renderer.ctx

    for exp in world.explosions
      exp.duration += updateDelta

      alpha   = exp.duration / 500
      radgrad = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, 50)

      radgrad.addColorStop(0, rgba(255, 255, 0, 1 - alpha))
      radgrad.addColorStop(1, rgba(255, 0, 0, 1 - alpha))

      ctx.fillStyle = radgrad

      ctx.beginPath()
      ctx.arc(exp.x, exp.y, 50, 0, Math.PI * 2, false)
      ctx.fill()

      if exp.shake
        ctx.translate(0, -exp.shake)
        #renderer.shakex = renderer.shakey = 0

      if exp.duration < 500
        exp.shake   = -exp.shake || 7;
        exp.shake  *= 0.9;
        ctx.translate(0, exp.shake)
      else
        exp.shake = null

    world.explosions = world.explosions.filter (exp) -> exp.duration < 500

  drawUI: (tick) ->
    # position, velocity, acceleration, mass
    pos = Vector.fromCart world.me.pos, world.me.posy
    vel = Vector.fromPolar world.guiAngle, world.guiPower
    acc = Vector.fromCart 0, -1

    if world.guiAim
      #renderer._drawAimArc(1);
      renderer._lastAim = +new Date

      renderer.drawTrace(pos, vel, acc, 100, undefined, 1)
    else
      fade = new Date - renderer._lastAim
      if fade < 200
        #renderer._drawAimArc((200 - fade) / 200)
        renderer.drawTrace(pos, vel, acc, 100, undefined, (200 - fade) / 200)

  _drawAimArc: (alpha) ->
    centerx = config.screenSize.width / 2
    centery = config.screenSize.height / 2

    x = world.guiPoint.x
    y = world.guiPoint.y

    ctx = renderer.ctx

    ctx.beginPath()
    ctx.moveTo(centerx, 0)
    ctx.lineTo(x, y)
    ctx.stroke()

    radgrad = ctx.createRadialGradient(centerx, 0, 0, centerx, 0, world.guiPower)
    radgrad.addColorStop(0, rgba(255, 255, 255, alpha * 0.1))
    radgrad.addColorStop(1, rgba(0, 0, 255, alpha * 0.5))

    ctx.fillStyle = radgrad
    ctx.beginPath()
    ctx.arc(centerx, 0, world.guiPower, 0, -Math.PI, false)
    ctx.fill()

  drawCountdown: (tick) ->
    countdown = world.nextRound - new Date()

    if (countdown <= 3000)
      renderer._drawFinalSeconds(countdown)

    if (countdown <= 10000)
      renderer._drawRoundProgress(countdown)

  _drawFinalSeconds: (countdown) ->
    # TODO optimize this function. It seems to slow down the rendering a lot...
    count = countdown / 1000 # countdown between 0..10
    text  = Math.ceil(count)
    ctx   = this.ctx

    ratio = (count % 1);
    return if ratio == 0

    ctx.save()
    renderer.ctx.translate(0, +config.screenSize.height)
    ctx.scale(1, -1)

    fontSize      = 180 / ratio
    ctx.font      = ~ ~fontSize + "px sans-serif"
    ctx.fillStyle = rgba(255, 0, 0, ratio)

    centerx = config.screenSize.width / 2
    centery = config.screenSize.height / 2
    ctx.fillText(text, centerx - ctx.measureText(text).width / 2, centery + fontSize / 3)

    ctx.restore()

  _drawRoundProgress: (countdown) ->
    return if countdown < 0

    x = config.screenSize.width * 0.95
    y = config.screenSize.height * 0.05

    width  = config.screenSize.width * 0.025
    height = config.screenSize.height * 0.90

    ctx   = this.ctx
    count = countdown / 10000 # countdown between 0..1

    ctx.fillStyle = rgba(255, 0, 0, 0.7)
    ctx.fillRect(x, y, width, height * count)

  drawTrace: (p, v, a, m, time, alpha) ->
    ctx = renderer.ctx

    # position, velocity, accelleration, mass
    time ?= 16
    path  = []

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    path.push(p)

    dt   = 10
    minX = config.screenSize.width
    maxX = 0

    for _ in [1..time]
      dv = a.scale(dt / m)
      p = p.add(v.scale(dt))
      p = p.add(dv.scale(dt / 2))
      v = v.add(dv)
      ctx.lineTo(p.x, p.y)
      path.push(p)

      if p.y > 0 and p.x < minX
        minX = p.x
      if p.y > 0 and p.x > maxX
        maxX = p.x

    gradientEnd = if maxX - world.me.pos > world.me.pos - minX then maxX else minX
    gradient    = ctx.createLinearGradient(world.me.pos, world.me.posy, gradientEnd, world.me.posy + 400)

    gradient.addColorStop(0, rgba(255, 255, 255, alpha))
    gradient.addColorStop(.4, rgba(255, 255, 255, 0))
    ctx.strokeStyle = gradient
    ctx.lineWidth   = 2
    ctx.stroke()

    path

  _flip: (f) -> (tick) ->
    ctx = renderer.ctx

    ctx.save()
    ctx.translate 0, +config.screenSize.height
    ctx.scale 1, -1
    f tick
    ctx.restore()

rgba = (r, g, b, a) ->
  "rgba(" + ~~r + "," + ~~g + "," + ~~b + "," + (a ? 1)  + ")"

# attach to window object, for JIT CoffeeScript compiler.
window.renderer = renderer

