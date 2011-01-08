# draws the aim UI.
# handles the mouse events for aiming (mousemove) and firing (mouseup)

UI =
  canvas      : null
  socket      : null

  init: (canvas, socket) ->
    UI.canvas = canvas
    UI.socket = socket

    $(document).bind "mousemove"  , UI.aim
    $(document).bind "touchmove"  , UI.aim
    $(document).bind "mouseup"    , UI.fire
    $(document).bind "touchend"   , UI.fire
    $(document).bind "mousedown"  , UI.startAim
    $(document).bind "touchstart" , UI.startAim

  # get the x,y coords relative to the canvas,
  # in canvas pixels, corrected for css scaling
  getCanvasCoord: (e) ->
    # get coords relative to the page
    touches = e.originalEvent.touches

    # check if we're on a touch device
    if touches?.length
      pageX = touches[0].pageX
      pageY = touches[0].pageY
    else
      pageX = e.pageX
      pageY = e.pageY

    # correct for:
    # 1. the offset of the canvas element
    # 2. screen pixels vs canvas pixels
    #    (there is a difference when the canvas is scaled using css)
    c = $ UI.canvas

    offset    = c.offset()
    horRatio  = c.attr("width") / c.width()
    vertRatio = c.attr("height") / c.height()

    canvasX = horRatio * (pageX - offset.left)
    canvasY = config.screenSize.height - vertRatio * (pageY - offset.top)
     
    return { x: canvasX, y: canvasY }

  startAim: (e) ->
    world.guiAim = true
    UI.aim e

  # update aiming
  aim: (e) ->
    e.preventDefault()

    pos = UI.getCanvasCoord e

    world.guiPoint = pos

    dx = pos.x - world.me.pos
    dy = pos.y - world.me.posy

    world.guiAngle = Math.atan2 dy, dx
    world.guiPower = Math.sqrt(dx * dx + dy * dy) / 100

  # calculate angle / power from current aim
  fire: (e) ->
    e.preventDefault()

    return if world.gameover

    world.guiAim = false

    UI.socket.send
      type        : "fireRequest"
      angle       : world.guiAngle
      barrelAngle : world.guiAngle,
      power       : world.guiPower,
      weaponType  : "cannon"

# attach to window object, for JIT CoffeeScript compiler.
window.UI = UI

