var renderer = {	
	canvas: null,
	ctx: null,
	tick: 0,
	
	init: function(canvas) {
		renderer.canvas = canvas;
		renderer.canvas.width = config.screenSize.width;
		renderer.canvas.height = config.screenSize.height;
		
		renderer.ctx = renderer.canvas.getContext("2d");
		renderer.ctx.scale(1, -1);
		renderer.ctx.translate(0, -config.screenSize.height);
	},
	
	render: function() {
		renderer.tick++;
		
		renderer.drawLandscape(renderer.tick);
		renderer.drawPlayers(renderer.tick);
		renderer.drawBullets(renderer.tick);
		renderer.drawExplosions(renderer.tick);
		renderer.drawUI(renderer.tick);
		
		setTimeout(renderer.render, 50);
	},
	
	drawLandscape: function(tick) {
		var ctx = renderer.ctx;
		var xStep = config.screenSize.width / world.landscape.length;
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		for (var x = 0, i = 0; i < world.landscape.length; x += xStep, i++) {
			var y = world.landscape[i];
			ctx.lineTo(x, y);
		}
		ctx.lineTo(x, 0);
		ctx.fill();
	},
	
	drawPlayers: function(tick) {
		var ctx = renderer.ctx;
		for (var i = 0; i < world.players.length; i++) {
			var player = world.players[i];
			
			var tank      = {};
			tank.top      = player.pos.x + config.tankHeight,
			tank.left     = player.pos.x - (config.tankWidth / 2);
			tank.right    = tank.left + config.tankWidth;
			tank.bottom   = player.pos.y;
			tank.center   = {};
			tank.center.x = player.pos.x;
			tank.center.y = player.pos.y + (config.tankHeight / 2);
			tank.health   = {};
			tank.health.x = tank.left;
			tank.barrel   = {};
			tank.health.y = tank.bottom + config.tankHeight + config.healthIndicatorBottomMargin;
			tank.barrel.x = Math.cos(player.angle) * config.barrelLength;
			tank.barrel.y = Math.sin(player.angle) * config.barrelLength;
			
			// debug
			if (config.debug) {
				ctx.fillStyle = "red";
				ctx.fillRect(player.pos.x, player.pos.y, tank.width, tank.height);
			}
			
			// tank
			ctx.fillStyle = "hotpink";
			ctx.fillRect(tank.left, tank.bottom, config.tankWidth, config.tankHeight);
			
			// health
			ctx.strokeStyle = "darkgreen";
			ctx.beginPath();
			ctx.moveTo(tank.health.x, tank.health.y);
			ctx.lineTo(tank.health.x + config.tankWidth, tank.health.y);
			ctx.stroke();
			
			// barrel
			ctx.strokeStyle = "hotpink";
			ctx.lineWidth = config.barrelThickness;
			ctx.beginPath();
			ctx.moveTo(tank.center.x, tank.center.y);
			ctx.lineTo(tank.center.x + tank.barrel.x, tank.center.y + tank.barrel.y);
			ctx.stroke();
		}
	},
	
	drawBullets: function(tick) {
	},

	drawExplosions: function(tick) {
	},

	drawUI: function(tick) {
	  var centerx = config.screenSize.width/2;
	  var centery = config.screenSize.height/2;
	  
	  var x= world.guiPoint.x;
	  var y= world.guiPoint.y;
	  
	  var ctx = renderer.ctx;
	  ctx.beginPath();
    ctx.moveTo(centerx, centery);
    ctx.lineTo(x, y)
    ctx.stroke();
	}
};




/*
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
};*/