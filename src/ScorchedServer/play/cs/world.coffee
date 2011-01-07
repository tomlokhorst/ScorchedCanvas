# Only internal representation. Doesn't get sent around.
world =
  landscape:  []
  players:    []
  me:         {}
  bullets:    []
  explosions: []
  playerId:   null
  bullets:    []
  guiAim :    false
  guiAngle:   45
  guiPower:   10
  guiPoint:   { x : 0, y : 0 }
  nextRound:  null
  gameover:   false
  starfield:  Math.random() * 200 < 1 for x in [1..config.screenSize.width] for y in [1..config.screenSize.height]

# # Landscape generator
# world.landscape = (Math.sin((i + 20) / 50) * 50 + 150 + Math.sin((i + 80) / 100) * 100 for [1..880]) 

# attach to window object, for JIT CoffeeScript compiler.
window.world = world

