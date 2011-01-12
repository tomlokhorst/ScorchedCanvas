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
  starfield: [],
  
  updatePlayer: function(player, update) {
    console.log(update);
    // confirmed by server but determined by user
    player.name = update.name || player.name;
    player.color = update.color || player.color;
    
    // remember for when we're starting a new game later
    localStorage["player_name"] = player.name;
    localStorage["player_color"] = player.color;
    
    
    // determined by server
    player.health = update.health || player.health;
    player.score = update.score || player.score;
    player.angle = update.angle || player.angle;
    player.barrelAngle = update.barrelAngle || player.barrelAngle;
    player.pos = update.pos || player.pos;
    
    player.computeVectors();
  }
  
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

