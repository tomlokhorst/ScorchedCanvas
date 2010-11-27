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
		renderer._flip(renderer.drawTitle)(updateDelta);
		renderer.drawLandscape(updateDelta);
		renderer.drawPlayers(updateDelta);
		renderer.drawExplosions(updateDelta);
		renderer.drawBullets(updateDelta);		
		renderer.drawUI(updateDelta);
		renderer.drawCountdown(updateDelta);

		renderer.lastTimeDrawn = now;
		setTimeout(renderer.render, 40);
	},
	
	// 256 color background 
	drawBackground: function(tick) {
		var ctx = renderer.ctx;
		var steps = 32;
		var stepSize = config.screenSize.height/steps;
		
		for( var step=steps ; step>=0 ; step--) {
			var color = step/steps * 255;
			ctx.fillStyle = rgba(color, 128 + color/2, 128 + color/2);
			ctx.fillRect(0, step * stepSize, config.screenSize.width, (step+1) * stepSize);
		}
	},
  
	drawTitle: function(tick) {
		var ctx = renderer.ctx;
		ctx.font = "48px sans-serif";
		ctx.fillStyle = rgba(255, 255, 255, 0.8);
		
		var centerx = config.screenSize.width / 2;
		var text = "The Mother of All Games";
		ctx.fillText(text, centerx - ctx.measureText(text).width / 2,  64);
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

	drawPlayers : function(updateDelta) {
		var ctx = renderer.ctx;
		for ( var i = 0; i < world.players.length; i++) {
			var player = world.players[i];

			var tank = {};
			tank.top = player.pos + config.tankHeight;
			tank.left = player.pos - (config.tankWidth / 2);
			tank.right = tank.left + config.tankWidth;
			tank.bottom = player.posy;
			tank.center = {};
			tank.center.x = player.pos;
			tank.center.y = tank.bottom + (config.tankHeight / 2);
			tank.health = {};
			tank.health.x = tank.left;
			tank.barrel = {};
			tank.health.y = tank.bottom - config.healthIndicatorBottomMargin;
			tank.health.l = Math.floor(config.tankWidth * player.health);
			tank.barrel.x = Math.cos(player.angle) * config.barrelLength;
			tank.barrel.y = Math.sin(player.angle) * config.barrelLength;

			// barrel
			ctx.strokeStyle = "#888";
			ctx.lineWidth = config.barrelThickness;
			ctx.beginPath();
			ctx.moveTo(tank.center.x, tank.center.y);
			ctx.lineTo(tank.center.x + tank.barrel.x,
					   tank.center.y + tank.barrel.y);
			ctx.stroke();
			
			// new Tank
			
			ctx.fillStyle = player.color;
			ctx.beginPath();
			ctx.moveTo(tank.left, tank.bottom);
			ctx.lineTo(tank.left + config.tankWidth, tank.bottom);
			ctx.lineTo(tank.left + config.tankWidth - config.tankGapWidth, tank.bottom + config.tankHeight);
			ctx.lineTo(tank.left + config.tankGapWidth, tank.bottom + config.tankHeight);
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(tank.left+(config.tankWidth/2), tank.bottom-(config.tankHeight) + 1 , 2*config.tankWidth/4, Math.PI - (Math.PI / 3.5), 2 * Math.PI + (Math.PI / 3.5), true);
			ctx.fill();

			// me circle
			if(player == world.me) {
				if(player.glow == null) player.glow = 0;
				player.glow += updateDelta / 4;
				var glow = Math.abs((player.glow % 512) - 256);
				ctx.strokeStyle = rgba(glow, glow, 255);
				ctx.beginPath();
				ctx.arc(player.pos, player.posy + 5, 25, 0, 2 * Math.PI, false);
				ctx.stroke();
			}
			
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
			bullet.step += updateDelta / 40;
			
			if (bullet.step < bullet.arc.length) {
				var bulletCoord = bullet.arc[Math.floor(bullet.step)];
				var ctx = renderer.ctx;
				ctx.fillStyle = "red";
				ctx.beginPath();
				ctx.arc(bulletCoord.x, bulletCoord.y, 3, 0, 2 * Math.PI, false);
				ctx.fill();
			}
			else if (bullet.collision) {
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
	  var ctx = renderer.ctx;
	  
		$.each(world.explosions, function(i, exp) {
			exp.duration += updateDelta;
			var alpha = exp.duration / 500;	
			var radgrad = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, 50);
			radgrad.addColorStop(0, rgba(255, 255, 0, 1 - alpha));
			radgrad.addColorStop(1, rgba(255, 0, 0, 1 - alpha));
			ctx.fillStyle = radgrad;
			ctx.beginPath();
			ctx.arc(exp.x, exp.y, 50, 0, Math.PI*2, false);
			ctx.fill();
			
			
			// skake
			if (exp.shake)
      {
        ctx.translate(0, -exp.shake);
        //renderer.shakex = renderer.shakey = 0;
      }
      
      if (exp.duration < 500)
      {
			  exp.shake = -exp.shake || 7;
			  exp.shake *= 0.9
			  			  
        ctx.translate(0, exp.shake);
        console.log( exp.shake);
      }
      else 
      {
        exp.shake = null;
      }
		});
		
		world.explosions = $.grep(world.explosions, function(exp) { return exp.duration < 500; });
	},

	drawUI : function(tick) {
		if (world.guiAim) {
			//renderer._drawAimArc(1);
			renderer._lastAim = +new Date;

			// position, velocity, acceleration, mass
			var pos = new Vector(world.me.pos, world.me.posy);
			var vel = Vector.fromPolar(world.guiAngle, world.guiPower);
			var acc = new Vector(0,-1);
			renderer.drawTrace(pos,vel, acc, 100);
		} else {
			var fade = new Date - renderer._lastAim;
			if (fade < 200) {
				//renderer._drawAimArc((200 - fade) / 200);
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

		if (countdown <= 3000)
			renderer._drawFinalSeconds(countdown);

		if (countdown <= 10000)
			renderer._drawRoundProgress(countdown);
	},

	_drawFinalSeconds : function(countdown) {
		// TODO optimize this function. It seems to slow down the rendering a lot...
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
		ctx.fillText(text, centerx - ctx.measureText(text).width / 2, centery	+ fontSize / 3);

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
		
		ctx.fillStyle = rgba(255,0,0, 0.7);
		ctx.fillRect(x,y,width,height*count);
	},

	drawTrace : function(p, v, a, m, time) { // position, velocity, accelleration, mass
		time = time || 1000;
		var path = new Array();

		var ctx = renderer.ctx;
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		path.push(p);

		var dt = 10;

		for ( var i = 0; i < time; i++) {
			var dv = a.scale(dt / m);
			p = p.add(v, dt);
			p = p.add(dv, dt / 2);
			v = v.add(dv);
			ctx.lineTo(p.x, p.y);
			path.push(p);
		}

		ctx.stroke();
		return path;
	},
	
	_flip : function(f) {
		return function(tick) {
			var ctx = renderer.ctx;
			ctx.save();
			ctx.translate(0, +config.screenSize.height);
			ctx.scale(1, -1);
			f(tick);
			ctx.restore();
		}
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
