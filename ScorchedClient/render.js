var renderer = {
	canvas : null,
	ctx : null,
	tick : 0,
	lastTimeDrawn: new Date().valueOf(),

	init : function(canvas) {
		renderer.canvas = canvas;
		renderer.canvas.width = config.screenSize.width;
		renderer.canvas.height = config.screenSize.height;
		renderer.ctx = renderer.canvas.getContext("2d");
		renderer.ctx.scale(1, -1);
		renderer.ctx.translate(0, -config.screenSize.height);
		renderer.render();
	},
	
	render: function() {
		var now = new Date().valueOf();
		var updateDelta = now - renderer.lastTimeDrawn;
	
		//renderer.ctx.clearRect(0, 0, config.screenSize.width, config.screenSize.height);
		renderer.drawBackground(updateDelta);
		renderer.drawLandscape(updateDelta);
		renderer.drawPlayers(updateDelta);
		renderer.drawExplosions(updateDelta);
		renderer.drawBullets(updateDelta);		
		renderer.drawUI(updateDelta);
		renderer.drawCountdown(updateDelta);

		renderer.lastTimeDrawn = now;
		setTimeout(renderer.render, 16);
	},
	
	// 256 color background 
	drawBackground: function(tick) {
	  var ctx = this.ctx;
	  var steps = 32;
	  var stepSize = config.screenSize.height/steps;
	  
	  for( var step=steps ; step>=0 ; step--)
	  {
	    var color = step/steps * 255;
	    ctx.fillStyle = rgba(color, 64 + color/2, 64 + color/2);
	    ctx.fillRect(0, step * stepSize, config.screenSize.width, (step+1) * stepSize);
	  }
  },

	drawLandscape : function(tick) {
		var ctx = renderer.ctx;
		ctx.fillStyle = rgba(64,255,64);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		for ( var x = 0; x < world.landscape.length; x++) {
			var y = world.landscape[x];
			ctx.lineTo(x, y);
		}
		ctx.lineTo(x, 0);
		ctx.fill();
	},

	drawPlayers : function(tick) {
		var ctx = renderer.ctx;
		for ( var i = 0; i < world.players.length; i++) {
			var player = world.players[i];

			var tank = {};
			tank.top = player.pos + config.tankHeight, tank.left = player.pos
					- (config.tankWidth / 2);
			tank.right = tank.left + config.tankWidth;
			tank.bottom = world.landscape[player.pos];
			tank.center = {};
			tank.center.x = player.pos;
			tank.center.y = tank.bottom + (config.tankHeight / 2);
			tank.health = {};
			tank.health.x = tank.left;
			tank.barrel = {};
			tank.health.y = tank.bottom - config.healthIndicatorBottomMargin;
			tank.health.l = Math
					.floor(config.tankWidth * (player.health / 100));
			tank.barrel.x = Math.cos(player.angle) * config.barrelLength;
			tank.barrel.y = Math.sin(player.angle) * config.barrelLength;

			// debug
			if (config.debug) {
				ctx.fillStyle = "red";
				ctx.fillRect(player.pos.x, player.pos.y, tank.width,
						tank.height);
			}


			// barrel
			ctx.strokeStyle = "darkgrey";
			ctx.lineWidth = config.barrelThickness;
			ctx.beginPath();
			ctx.moveTo(tank.center.x, tank.center.y);
			ctx.lineTo(tank.center.x + tank.barrel.x, tank.center.y
					+ tank.barrel.y);
			ctx.stroke();
			
			// tank
			ctx.fillStyle = player.color;
			ctx.fillRect(tank.left, tank.bottom, config.tankWidth,
					config.tankHeight);

			// health
			ctx.strokeStyle = "darkgreen";
			ctx.beginPath();
			ctx.moveTo(tank.health.x, tank.health.y);
			ctx.lineTo(tank.health.x + tank.health.l, tank.health.y);
			ctx.stroke();
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(tank.health.x + tank.health.l, tank.health.y);
			ctx.lineTo(tank.right, tank.health.y);
			ctx.stroke();

		}
	},
	
	drawBullets: function(updateDelta) {
		$.each(world.bullets, function(i, bullet) {
			if (bullet.step === undefined) {
				bullet.step = 0;
				// mock
				bullet.arc = renderer.drawTrace(Vector.origin, Vector.fromPolar(Math.PI / 3, 1), Vector.fromCart(0, -0.001), 1);
				bullet.collision = true;
			}

			bullet.step += updateDelta / 15;
			
			if (bullet.step < bullet.arc.length) {
				var bulletCoord = bullet.arc[Math.floor(bullet.step)];
				var ctx = renderer.ctx;
				ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.arc(bulletCoord.x, bulletCoord.y, 3, 0, 2 * Math.PI, false);
				ctx.fill();
			}
			else if (bullet.collision)
			{
				var lastCoord = bullet.arc[bullet.arc.length - 1];
				world.explosions.push({
					x: lastCoord.x,
					y: lastCoord.y,
					duration: 0
				});
			}
		});
		
		world.bullets = $.grep(world.bullets, function(bullet) { return bullet.step < bullet.arc.length; });
	},

	drawExplosions: function(updateDelta) {
		$.each(world.explosions, function(i, exp) {
			exp.duration += updateDelta;
			var alpha = exp.duration / 3000;
			var ctx = renderer.ctx;
			ctx.fillStyle = rgba(255, 0, 0, 1 - alpha);
			ctx.fillRect(100, 100, 100, 100);
		});
		
		world.explosions = $.grep(world.explosions, function(exp) { return exp.duration < 3000; });
	},

	drawUI : function(tick) {
		if (world.guiAim) {
			renderer._drawAimArc(1);
			renderer._lastAim = +new Date;
		} else {
			var fade = new Date - renderer._lastAim;
			if (fade < 200) {
				renderer._drawAimArc((200 - fade) / 200);
			}
		}
	},

	_drawAimArc : function(alpha) {
		var centerx = config.screenSize.width / 2;
		var centery = config.screenSize.height / 2;

		var x = world.guiPoint.x;
		var y = world.guiPoint.y;

		var ctx = renderer.ctx;
		ctx.beginPath();
		ctx.moveTo(centerx, 0);
		ctx.lineTo(x, y);
		ctx.stroke();

		var radgrad = ctx.createRadialGradient(centerx, 0, 0, centerx, 0,
				world.guiPower);
		radgrad.addColorStop(0, rgba(255, 255, 255, alpha * 0.1));
		radgrad.addColorStop(1, rgba(0, 0, 255, alpha * 0.5));
		ctx.fillStyle = radgrad;
		ctx.beginPath();
		ctx.arc(centerx, 0, world.guiPower, 0, -Math.PI, false);
		ctx.fill();
	},
	
	drawCountdown : function(tick) {
		if (world.waiting)
			return;

		var countdown = world.nextRound - new Date();

		document.title = "nog " + countdown + "sec";

		if (countdown <= 3000)
			renderer._drawFinalSeconds(countdown);

		if (countdown <= 10000)
			renderer._drawRoundProgress(countdown);
	},

	_drawFinalSeconds : function(countdown) {
		var count = countdown / 1000; // countdown between 0..10
		var text = Math.ceil(count);
		var ctx = this.ctx;

		var ratio = (count % 1);
		if(ratio == 0) return;

		ctx.save();
		renderer.ctx.translate(0, +config.screenSize.height);
		ctx.scale(1, -1);

		var fontSize = 180 / ratio;
		ctx.font = ~~fontSize + "px sans-serif";
		ctx.fillStyle = rgba(255, 0, 0, ratio);

		var centerx = config.screenSize.width / 2;
		var centery = config.screenSize.height / 2;
		ctx.fillText(text, centerx - ctx.measureText(text).width / 2, centery
				+ fontSize / 3);

		ctx.restore();
	},
  
  _drawRoundProgress: function(countdown) {
    if(countdown < 0) return;
    var x = config.screenSize.width * 0.95;
    var y = config.screenSize.height * 0.05;
    
    var width = config.screenSize.width * 0.025;
    var height = config.screenSize.height * 0.90;
    
    var ctx = this.ctx;
    var count = countdown/10000; //countdown between 0..1
    
    ctx.fillStyle = rgba(255,0,0);
    ctx.fillRect(x,y,width,height*count);
  },

	drawTrace : function(p, v, a, m) { // position, velocity, accelleration, mass
		var path = new Array();

		var ctx = renderer.ctx;
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		path.push(p);

		var dt = 10;

		for ( var i = 0; i < 1000; i++) {
			var dv = a.scale(dt / m);
			p = p.add(v, dt);
			p = p.add(dv, dt / 2);
			v = v.add(dv);
			ctx.lineTo(p.x, p.y);
			path.push(p);
		}

		ctx.stroke();
		return path;
	}

};

function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.add = function(that, factor) {
		if (factor === undefined) {
			factor = 1;
		}
		return new Vector(this.x + that.x * factor, this.y + that.y * factor);
	}

	this.scale = function(factor) {
		return new Vector(x * factor, y * factor);
	}
}

Vector.fromPolar = function(th, r) {
	return Vector.fromCart(Math.cos(th) * r, Math.sin(th) * r);
};

Vector.fromCart = function(x, y) {
	return new Vector(x, y);
};

Vector.origin = Vector.fromCart(0, 0);
