// Only internal representation. Doesn't get sent around.
var world = {
	landscape: [10, 20, 30, 20, 30, 30, 10, 0, 10, 20, 30],
	players: [{ id: 1, name: "aap", health: 40, score: 2000, angle: Math.PI / 2, color: "#FF0000", pos: { x: 100, y: 15 } },
		      { id: 2, name: "aad", health: 90, score: 1000, angle: 0.1, color: "#0000FF", pos: { x: 400, y: 26 } }],
	bullets: [],
	guiAim : 0,
	guiAngle: 45,
	guiPower: 10,
	guiPoint: { x:0, y:0 }
};
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