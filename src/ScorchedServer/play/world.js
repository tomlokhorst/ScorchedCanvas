// Only internal representation. Doesn't get sent around.
var world = {
  landscape: [],
  players: [],
  me: {},
  bullets: [],
  explosions: [],
  playerId: null,
  bullets: [],
  guiAim : false,
  guiAngle: 45,
  guiPower: 10,
  guiPoint: { x:0, y:0 },
  nextRound: null,
  gameover: false,
  starfield: []
};


for (var y = 0; y < config.screenSize.height; y++)
{
  world.starfield[y] = [];
  for (var x = 0; x < config.screenSize.width; x++)
  {
    world.starfield[y][x] = ((Math.random() * 200) < 1);
  }
}

// Lanscape generator:
/*
world.landscape = [];
for ( var i = 0; i < 800; i++) {
  world.landscape.push(Math.sin((i + 20) / 50) * 50 + 150
      + Math.sin((i + 80) / 100) * 100);
};
*/

