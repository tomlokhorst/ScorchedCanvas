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
			tank.health = {};
			tank.health.x = tank.rect.left;
			tank.health.y = tank.bottom - config.healthIndicatorBottomMargin;
			tank.health.l = Math.floor(config.tankWidth * player.health);
			tank.barrel = {};
			tank.barrel.start = tank.center;
			tank.barrel.end = tank.center.move(config.barrelLength, 0).rotate(player.barrelAngle, tank.barrel.start);
			tank.turret = {};
			tank.turret.center = Vector.fromCart(tank.center.x, tank.rect.bottom - tank.rect.height + 1);
			tank.turret.radius = 2 * config.tankWidth / 4;
			tank.turret.startAngle = Math.PI - (Math.PI / 3.5);
			tank.turret.endAngle = 2 * Math.PI + (Math.PI / 3.5);
			tank.turret.anticlockwise = true;
			if (player.id == world.me.id)
			  world.me.tank = tank;

			// Rotate tank
			tank.body = vectorSpaceRotate(tank.body, player.angle, tank.center);
			tank.barrel = vectorSpaceRotate(tank.barrel, player.angle, tank.center);
			tank.turret = vectorSpaceRotate(tank.turret, player.angle, tank.center);
			tank.turret.startAngle + player.angle;
			tank.turret.endAngle + player.angle;

			
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
			//console.log(player.health);
			
			ctx.strokeStyle = rgba(255,0,0,0.7);;
			ctx.beginPath();
			ctx.moveTo(tank.health.x, tank.health.y);
			ctx.lineTo(tank.health.x + tank.health.l, tank.health.y);
			ctx.stroke();
		  
			// health bar background
      
			ctx.strokeStyle = rgba(255,155,155,0.7);
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

function Vector(x, y)
{
  this.x = x;
  this.y = y;
  
  this.add = function(that, factor)
  {
    if (factor === undefined)
    {
      factor = 1;
    }
    return new Vector(this.x + that.x * factor, this.y + that.y * factor);
  }

  // Convenience function
  this.move = function(dx, dy)
  {
    return this.add(Vector.fromCart(dx, dy));
  }
  
  this.scale = function(factor)
  {
 	  return new Vector(x * factor, y * factor);
  }
  
  this.rotate = function(angle, origin)
  {
    origin = origin || Vector.origin;
  
    var dx = this.x - origin.x;
    var dy = this.y - origin.y;
  
    var dist = Math.sqrt(dx * dx + dy * dy);
    var a1 = Math.atan2(dy, dx);
    var a2 = a1 + angle;
    var dx2 = Math.cos(a2) * dist;
    var dy2 = Math.sin(a2) * dist;
  
    return new Vector(origin.x + dx2, origin.y + dy2);
  }
  
  this.toString = function ()
  {
    return "Vector { x: " + this.x + ", y: " + this.y + "}";
  }
}



Vector.fromPolar = function(th, r)
{
	return Vector.fromCart(Math.cos(th) * r, Math.sin(th) * r);
}

Vector.fromCart = function(x, y)
{
	return new Vector(x, y);
}

Vector.origin = Vector.fromCart(0, 0);

// Immutable
function Rectangle(top, left, right, bottom)
{
  this.top         = top;
  this.left        = left;
  this.right       = right;
  this.bottom      = bottom;
  this.leftTop     = Vector.fromCart(left, top);
  this.rightTop    = Vector.fromCart(right, top);
  this.leftBottom  = Vector.fromCart(left, bottom);
  this.rightBottom = Vector.fromCart(right, bottom);

  this.width  = this.right - this.left;
  this.height = this.top - this.bottom;
  this.center = Vector.fromCart(this.left + this.width / 2, this.bottom + this.height /2);

  this.rotate = function(angle, origin)
  {
    origin =
        origin && origin.x !== undefined && origin.y !== undefined ? origin
      : origin == "top"  ? Vector.fromCart(this.center.x, this.top)
      : origin == "left" ? Vector.fromCart(this.left, this.center.y)
      : origin == "right" ? Vector.fromCart(this.right, this.center.y)
      : origin == "bottom" ? Vector.fromCart(this.center.x, this.bottom)
      : origin == "leftTop" ? this.leftTop
      : origin == "rightTop" ? this.rightTop
      : origin == "leftBottom" ? this.leftBottom
      : origin == "rightBottom" ? this.rightBottom
      : this.center;

    var v1 = this.leftTop.rotate(angle, origin);
    var v2 = this.rightBottom.rotate(angle, origin);

    return Rectangle.fromVectors(v1, v2);
  }

  this.toString = function ()
  {
    return "Rectangle { top: " + this.top + ", left: " + this.left +  ", right: " + this.right +  ", bottom: " + this.bottom + "}";
  }
}

Rectangle.fromPoints = function (top, left, right, bottom)
{
  return new Rectangle(top, left, right, bottom);
}

Rectangle.fromCenter = function (center, width, height)
{
  var top    = center.y + height / 2;
  var left   = center.x - width / 2;
  var right  = center.x + width / 2;
  var bottom = center.y - height / 2;

  return new Rectangle(top, left, right, bottom);
}

Rectangle.fromVectors = function (v1, v2)
{
  var top    = v1.y > v2.y ? v1.y : v2.y;
  var left   = v1.x < v2.x ? v1.x : v2.x;
  var right  = v1.x > v2.x ? v1.x : v2.x;
  var bottom = v1.y < v2.y ? v1.y : v2.y;

  return new Rectangle(top, left, right, bottom);
}

function vectorSpaceRotate(obj, angle, origin)
{
  var copy = {};
  for (var v in obj)
    if (obj[v] instanceof Vector)
      copy[v] = obj[v].rotate(angle, origin);
    else
      copy[v] = obj[v];

  return copy;
}

