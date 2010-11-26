/*
richten
schieten
health
punten
countdown
fixed landscape
kogels
tanks
*/

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
};
function Player(){}
Player.prototype = {
	aap: {
	}
};

function Landscape(){}
Landscape.prototype = {
	aap: {
	}
};

function Round(){}
Round.prototype = {
	aap: {
	}
};

var canvas, ctx = null;
var width, height, ttop, right, bottom, left;


$(document).ready(function() {

	canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	
	canvas.width = width = innerWidth;
	canvas.height = height = innerHeight;
	
	ctx.scale(1, -1);
	ctx.translate(0, -height);
	//ctx.fillRect(30, 30, 20, 20);
	
	draw();
});


function draw(tick) {
  drawLandscape([10, 20, 30, 20, 30, 30, 10, 0, 10, 20, 30]);
  drawPlayers([{ id: 2, name: "aad", health: 90, score: 1000, angle: 24 }]);
  drawBullets(tick);
  drawExplosions(tick);
  drawUI(tick);
}

function drawLandscape(landscape) {
	var xStep = width / landscape.length;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	for (var x = 0, i = 0; i < landscape.length; x += xStep, i++) {
		var y = landscape[i];
		ctx.lineTo(x, y);
	}
	ctx.lineTo(x, 0);
	ctx.fill();
}

function drawPlayers() {
	
}

function drawBullets(tick) {
}

function drawExplosions(tick) {
}

function drawUI() {
}