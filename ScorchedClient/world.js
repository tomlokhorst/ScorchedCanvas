// Only internal representation. Doesn't get sent around.
var world = {
	landscape: [],
	players: [],
	me : {},
	bullets: [],
	explosions: [],
	playerId: null,
	bullets: [],
	guiAim : false,
	guiAngle: 45,
	guiPower: 10,
	guiPoint: { x:0, y:0 },
	nextRound: null,
	waiting: true,
	gameover: false
};

// Lanscape generator:
/*
world.landscape = [];
for ( var i = 0; i < 800; i++) {
	world.landscape.push(Math.sin((i + 20) / 50) * 50 + 150
			+ Math.sin((i + 80) / 100) * 100);
};
*/


/*
var gameInit = {
  type: "gameInitResponse",
  playerid: 2,
  landscape : {
    heights: [12,34,56,678]
  },
  players : [ 
  {
    id: 1,
    name : "aap",
    health: 90,
    score: 1000,
    angle: 24
  },
  {
    id: 2,
    name: "aad",
    health: 90,
    score: 1000,
    angle: 24
  }]
};		
			
var gameInitRequest = {
  type: "gameInitRequest"
};

// sturen bij mouseup / touchend
var fireRequest = {
  type: "fireRequest",
  angle: 30,
  power: 100,
  weaponType: "cannon",
  sessionToken: "xyz"
};

// server
var gameUpdate =  {  
  messages: [
   {
   type: "fire", 
   id: 1,
   angle: 10, 
   power: 200,
   weaponType: "funky_bomb", // "cannon" / "nuke" / "mirv"
   arc: [{x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 6}]
 },
 {
   type: "updatePlayer",
   id: 2,
   name: "aad",
   health: 90,   // 0 == death
   score: 1000,
   angle: 24
 },
 // krijg je ook zelf. bepaalt meteen je kleur en pos
 {
   type: "newPlayer",
   id: 3,
   name: "chees",
   color: "#FF0000",
   pos: 13
 },
 {
   type: "quitPlayer",
   id: 2
 }
  ]
};*/