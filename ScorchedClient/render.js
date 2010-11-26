var renderer = {	
	canvas: null,
	ctx: null,
	tick: 0,
	
	init: function() {
		renderer.canvas = $("#canvas")[0];
		renderer.canvas.width = config.screenSize.width;
		renderer.canvas.height = config.screenSize.height;
		renderer.ctx = renderer.canvas.getContext("2d");
		renderer.ctx.scale(1, -1);
		renderer.ctx.translate(0, -config.screenSize.height);
		renderer.render();
	},
	
	render: function() {
		renderer.tick++;
		
		renderer.drawLandscape(renderer.tick);
		renderer.drawPlayers(renderer.tick);
		renderer.drawBullets(renderer.tick);
		renderer.drawExplosions(renderer.tick);
		renderer.drawUI(renderer.tick);
		
		setTimeout(renderer.render, 1000);
	},
	
	drawLandscape: function(tick) {
		var ctx = renderer.ctx;
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.moveTo(0, 0);
		for (var x = 0; x < world.landscape.length; x++) {
			var y = world.landscape[x];
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
			tank.top      = player.pos + config.tankHeight,
			tank.left     = player.pos - (config.tankWidth / 2);
			tank.right    = tank.left + config.tankWidth;
			tank.bottom   = world.landscape[player.pos];
			tank.center   = {};
			tank.center.x = player.pos;			
			tank.center.y = tank.bottom + (config.tankHeight / 2);
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
			ctx.fillStyle = player.color;
			ctx.fillRect(tank.left, tank.bottom, config.tankWidth, config.tankHeight);
			
			// health
			ctx.strokeStyle = "darkgreen";
			ctx.beginPath();
			ctx.moveTo(tank.health.x, tank.health.y);
			ctx.lineTo(tank.health.x + config.tankWidth, tank.health.y);
			ctx.stroke();
			
			// barrel
			ctx.strokeStyle = "darkgrey";
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
	}
};