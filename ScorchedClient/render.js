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
  drawPlayers([{ id: 1, name: "aap", health: 40, score: 2000, angle: Math.PI / 2, color: "#FF0000", pos: { x: 100, y: 15 } },
			   { id: 2, name: "aad", health: 90, score: 1000, angle: 0.1, color: "#0000FF", pos: { x: 400, y: 26 } }]);
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

var debug = false;
var tankWidth = 32, tankHeight = 16;
var healthIndicatorBottomMargin = 5;
var barrelLength = 40;
var barrelTickness = 3;

function drawPlayers(players) {
	for (var i = 0; i < players.length; i++) {
		var player = players[i];
		
		var tank      = {};
		tank.top      = player.pos.x + tankHeight,
		tank.left     = player.pos.x - (tankWidth / 2);
		tank.right    = tank.left + tankWidth;
		tank.bottom   = player.pos.y;
		tank.center   = {};
		tank.center.x = player.pos.x;
		tank.center.y = player.pos.y + (tankHeight / 2);
		tank.width    = tankWidth;
		tank.height   = tankHeight;
		tank.health   = {};
		tank.health.x = tank.left;
		tank.barrel   = {};
		tank.health.y = tank.bottom + tank.height + healthIndicatorBottomMargin;
		tank.barrel.x = Math.cos(player.angle) * barrelLength;
		tank.barrel.y = Math.sin(player.angle) * barrelLength;
		
		// debug
		if (debug) {
			ctx.fillStyle = "red";
			ctx.fillRect(player.pos.x, player.pos.y, tank.width, tank.height);
		}
		
		// tank
		ctx.fillStyle = "hotpink";
		ctx.fillRect(tank.left, tank.bottom, tank.width, tank.height);
		
		// health
		ctx.strokeStyle = "darkgreen";
		ctx.beginPath();
		ctx.moveTo(tank.health.x, tank.health.y);
		ctx.lineTo(tank.health.x + tank.width, tank.health.y);
		ctx.stroke();
		
		// barrel
		ctx.strokeStyle = "hotpink";
		ctx.lineWidth = barrelTickness;
		ctx.beginPath();
		ctx.moveTo(tank.center.x, tank.center.y);
		ctx.lineTo(tank.center.x + tank.barrel.x, tank.center.y + tank.barrel.y);
		ctx.stroke();
	}
}

function drawBullets(tick) {
}

function drawExplosions(tick) {
}

function drawUI() {
}