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
		renderer.render();
	},
	
	render: function() {
		renderer.tick++;
		
		renderer.ctx.clearRect(0,0,config.screenSize.width,config.screenSize.height);
		renderer.drawLandscape(renderer.tick);
		renderer.drawPlayers(renderer.tick);
		renderer.drawBullets(renderer.tick);
		renderer.drawExplosions(renderer.tick);
		renderer.drawUI(renderer.tick);

		// var v = Vector.fromPolar(Math.PI / 3, 4);
		// var a = Vector.fromCart(0, -0.01);
		// renderer.drawTrace(Vector.origin, v, a, 1);
		
		setTimeout(renderer.render, 50);
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
			tank.health.l = Math.floor(config.tankWidth * (player.health / 100));
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
			ctx.lineTo(tank.health.x + tank.health.l, tank.health.y);
			ctx.stroke();
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(tank.health.x  + tank.health.l, tank.health.y);
			ctx.lineTo(tank.right, tank.health.y);
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
		$.each(world.bullets, function(i, bullet) {
		//"funky_bomb", // "cannon" / "nuke" / "mirv"	
		});		
	},

	drawExplosions: function(tick) {
	},

	drawUI: function(tick) {
	  if(world.guiAim) {
	    renderer._drawAimArc(1);
      renderer._lastAim = +new Date;      
    } else {
      var fade = new Date - renderer._lastAim;
      if( fade < 200) {
        renderer._drawAimArc( (200-fade)/200 );
      }
    }
	},
	
	_drawAimArc: function(alpha)  {
  	var centerx = config.screenSize.width/2;
  	var centery = config.screenSize.height/2;

	  var x= world.guiPoint.x;
    var y= world.guiPoint.y;

  	var ctx = renderer.ctx;
  	ctx.beginPath();
    ctx.moveTo(centerx, 0);
    ctx.lineTo(x, y);
    ctx.stroke();

    var radgrad = ctx.createRadialGradient(centerx,0,0,centerx,0, world.guiPower);
    radgrad.addColorStop(0, rgba(255, 255, 255 , alpha * 0.1));
    radgrad.addColorStop(1, rgba(0, 0, 255, alpha * 0.5));
    ctx.fillStyle = radgrad;
	  ctx.beginPath();    
    ctx.arc(centerx,0, world.guiPower , 0, -Math.PI);
    ctx.fill();
	},

	drawTrace: function (p, v, a, m) { // position, velocity, accelleration, mass
	    var ctx = renderer.ctx;
	    ctx.beginPath();
	    ctx.moveTo(p.x, p.y);

	    var dt = 10;

	    for (var i = 0; i < 1000; i++) {
	        var dv = a.scale(dt / m);
	        p = p.add(v, dt);
	        p = p.add(dv, dt / 2);
	        v = v.add(dv);
	        ctx.lineTo(p.x, p.y);
	    }

	    ctx.stroke();
	}

};

function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.add = function (that, factor) {
        if (factor === undefined) {
            factor = 1;
        }
        return new Vector(this.x + that.x * factor, this.y + that.y * factor);
    }

    this.scale = function (factor) {
        return new Vector(x * factor, y * factor);
    }
}

Vector.fromPolar = function (th, r) {
    return Vector.fromCart(Math.cos(th) * r, Math.sin(th) * r);
};

Vector.fromCart = function (x, y) {
    return new Vector(x, y);
};

Vector.origin = Vector.fromCart(0, 0);
