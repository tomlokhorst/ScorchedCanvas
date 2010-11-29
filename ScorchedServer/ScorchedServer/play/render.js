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
		
		renderer.drawBackground(updateDelta);
		
		renderer.drawBullets(updateDelta);
		
		renderer.drawLandscape(updateDelta);
		
		renderer._flip(renderer.drawTitle)(updateDelta);
		if (!world.gameover)
		  renderer.drawUI(updateDelta);
		renderer.drawPlayers(updateDelta);
		renderer.drawExplosions(updateDelta);
		
		if (!world.gameover)
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
  
	drawTitle: function(updateDelta) {
		var ctx = renderer.ctx;
		ctx.font = "48px sans-serif";
		ctx.fillStyle = rgba(255, 255, 255, 0.8);
		
		var centerx = config.screenSize.width / 2;
		if (!world.gameover)
		{
		  var text = "The Mother of All Games";
		  ctx.fillText(text, centerx - ctx.measureText(text).width / 2,  64);
		  var angle = 90-(world.guiAngle / Math.PI * 180);
  		var power = world.guiPower * 10;
      var subText = angle.toFixed(0) + " degrees / "+ "power " + power.toFixed(0);
      ctx.font = "24px sans-serif";		
  		ctx.fillText(subText  , centerx - ctx.measureText(subText).width / 2,  100);
    }
		else
		{
		  var text = "Game Over";
		  
		  if(renderer._titleGlow == null) renderer._titleGlow = 0;
			renderer._titleGlow += updateDelta / 4;
			
		  var glow = Math.abs((renderer._titleGlow % 512) - 256);
      ctx.fillStyle = rgba(glow, glow, 255);
		  ctx.fillText(text, centerx - ctx.measureText(text).width / 2,  64);

      var subText = "reload to play again";
      ctx.font = "24px sans-serif";		
  		ctx.fillText(subText  , centerx - ctx.measureText(subText).width / 2,  100);
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

	drawPlayers : function(updateDelta) {
		var ctx = renderer.ctx;
		for ( var i = 0; i < world.players.length; i++) {
			var player = world.players[i];

			var tank = {};
			tank.center = Vector.fromCart(player.pos, player.posy)
			tank.rect = Rectangle.fromCenter(tank.center, config.tankWidth, config.tankHeight);
			tank.body = {};
			tank.body.leftTop = tank.rect.leftTop.move(config.tankGapWidth, 0);
			tank.body.rightTop = tank.rect.rightTop.move(-config.tankGapWidth, 0);
			tank.body.leftBottom = tank.rect.leftBottom;
			tank.body.rightBottom = tank.rect.rightBottom;
			tank.barrel = {};
			tank.barrel.start = tank.center;
			tank.barrel.end = tank.center.move(config.barrelLength, 0).rotate(player.barrelAngle - player.angle, tank.barrel.start);
			tank.turret = {};
			tank.turret.center = Vector.fromCart(tank.center.x, tank.rect.bottom - tank.rect.height + 1);
			tank.turret.radius = 2 * config.tankWidth / 4;
			tank.turret.startAngle = Math.PI - (Math.PI / 3.5);
			tank.turret.endAngle = 2 * Math.PI + (Math.PI / 3.5);
			tank.turret.anticlockwise = true;
			tank.health = {};
			tank.health.y      =  tank.rect.bottom - config.healthIndicatorBottomMargin
			tank.health.start  = Vector.fromCart(tank.rect.left, tank.health.y);
			tank.health.middle = Vector.fromCart(tank.rect.left + config.tankWidth * player.health, tank.health.y);
			tank.health.end    = Vector.fromCart(tank.rect.left + config.tankWidth, tank.health.y)
			if (player.id == world.me.id)
			  world.me.tank = tank;

			// Rotate tank
			tank.body = vectorSpaceRotate(tank.body, player.angle, tank.center);
			tank.barrel = vectorSpaceRotate(tank.barrel, player.angle, tank.center);
			tank.turret = vectorSpaceRotate(tank.turret, player.angle, tank.center);
			tank.turret.startAngle += player.angle;
			tank.turret.endAngle += player.angle;
			tank.health = vectorSpaceRotate(tank.health, player.angle, tank.center);

			
			// tank body
			ctx.fillStyle = player.color;
			ctx.beginPath();
			ctx.moveTo(tank.body.leftBottom.x, tank.body.leftBottom.y);
			ctx.lineTo(tank.body.rightBottom.x, tank.body.rightBottom.y);
			ctx.lineTo(tank.body.rightTop.x, tank.body.rightTop.y);
			ctx.lineTo(tank.body.leftTop.x, tank.body.leftTop.y);
			ctx.fill();

			// tank barrel
			ctx.strokeStyle = player.color; "#888";
			ctx.lineWidth = config.barrelThickness;
			ctx.beginPath();
			ctx.moveTo(tank.barrel.start.x, tank.barrel.start.y);
			ctx.lineTo(tank.barrel.end.x, tank.barrel.end.y);
			ctx.stroke();

			// tank turret
			ctx.beginPath();
			ctx.arc(tank.turret.center.x, tank.turret.center.y, tank.turret.radius, tank.turret.startAngle, tank.turret.endAngle, tank.turret.anticlockwise);
			ctx.fill();
			
			// health
			
			ctx.strokeStyle = rgba(255,0,0,0.7);;
			ctx.beginPath();
			ctx.moveTo(tank.health.start.x, tank.health.start.y);
			ctx.lineTo(tank.health.middle.x, tank.health.middle.y);
			ctx.stroke();
		  
			// health bar background
      
			ctx.strokeStyle = rgba(255,155,155,0.7);
			ctx.beginPath();
			ctx.moveTo(tank.health.middle.x, tank.health.middle.y);
			ctx.lineTo(tank.health.end.x, tank.health.end.y);
			ctx.stroke();

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
			if (exp.shake) {
				ctx.translate(0, -exp.shake);
				//renderer.shakex = renderer.shakey = 0;
			}

			if (exp.duration < 500) {
				exp.shake = -exp.shake || 7;
				exp.shake *= 0.9;
				ctx.translate(0, exp.shake);
			} else {
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
			renderer.drawTrace(pos, vel, acc, 100);
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
		if (ratio == 0) return;

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
		time = time || 16;
		var path = new Array();

		var ctx = renderer.ctx;
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		path.push(p);

		var dt = 10;
		var minX = config.screenSize.width;
		var maxX = 0;
		
		for ( var i = 0; i < time; i++) {
			var dv = a.scale(dt / m);
			p = p.add(v, dt);
			p = p.add(dv, dt / 2);
			v = v.add(dv);
			ctx.lineTo(p.x, p.y);
			path.push(p);
			if(p.y > 0 && p.x < minX) {
				minX = p.x;
			}
			if(p.y > 0 && p.x > maxX) {
				maxX = p.x;
			}
		}

		var gradientEnd = maxX - world.me.pos > world.me.pos - minX ? maxX : minX;
		var gradient = ctx.createLinearGradient(world.me.pos, world.me.posy, gradientEnd, world.me.posy+400);
		gradient.addColorStop(0, rgba(255, 255, 255));
		gradient.addColorStop(.4, rgba(255, 255, 255, 0));
		ctx.strokeStyle = gradient;
		ctx.lineWidth = 2;
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

