var socket;

(function() {
	socket = new NepSocket(config.socketUrl);
	socket.onopen = function(e) { /* Not implemented */ };
	socket.onclose = function(e) { /* Not implemented */ };
	socket.onmessage = function(msg) {

	
	  console.log('onmessage:' + msg.type);
		console.log(msg);
		
		if (msg.type == 'gameInit') {			
			world.landscape = msg.landscape;
			world.playerId = msg.playerId;
			world.nextRound = +new Date + msg.nextRound;
			$.each(msg.players, function(i, player) {
				var p = new Player( {
					id: player.id,
					health: player.health,
					score: player.score,
					angle: player.barrelAngle ? player.angle : 0,
					barrelAngle: player.barrelAngle || player.angle,
					color: player.color, 
					pos: player.pos,
					posy: world.landscape[player.pos]
				});
serverSideComputeOptimalAngle(p);
				world.players.push(p);
				  
				if (player.id == world.playerId)
					world.me = p;
			});
		}
		else if (msg.type == 'newPlayer') {
		  var p = new Player( { 
				id: msg.player.id,
				name: msg.player.name,
				health: msg.player.health,
				score: msg.player.score,
			  angle: player.barrelAngle ? player.angle : 0,
		    barrelAngle: player.barrelAngle || player.angle,
				color: msg.player.color,
				pos: msg.player.pos,
				posy: world.landscape[msg.player.pos]
			});
serverSideComputeOptimalAngle(p);
			world.players.push(p);
		}
		else if (msg.type == 'quitPlayer') {
		  if (msg.playerId == world.me.id)
		    world.gameover = true;
			world.players = $.grep(world.players, function(player) { return player.id != msg.playerId; });
		}
		else if (msg.type == 'gameUpdate') {
			world.nextRound = +new Date + config.roundTime;
		  
			$.each(msg.state,  function(i, update) {
				if (update.type == 'updatePlayer') {
					
					var filtered = $.grep(world.players, function(player) { return player.id == update.player.id; });
					
					if (filtered.length == 0) return;
					//assert(filtered.length == 0, 'Kan player ' + update.player.id + ' niet vinden');
					
					var player = filtered[0];
					player.name = update.player.name || player.name;
					player.health = update.player.health || player.health;
					console.log("socket health" + player.health);
					player.score = update.player.score || player.score;
			    player.angle = update.player.barrelAngle ? update.player.angle : 0;
			    player.barrelAngle = update.player.barrelAngle || update.player.angle || player.barrelAngle || player.barrelAngle,
					player.color = update.player.color || player.color;
					player.pos = update.player.pos || player.pos;
serverSideComputeOptimalAngle(player);
				}
				else if (update.type == 'fire') {
					world.bullets.push({ id: update.playerId, arc: update.arc, step: 0, collision: true });
				}
				else {
					console.log('UNIMPLEMENTED: ' + update.type);
				}
			});
		}
		else if(msg.type == 'aim') {
			for(var i=0; i<world.players.length; i++) {
				if(world.players[i].id == msg.playerId) {
					world.players[i].barrelAngle = msg.barrelAngle || msg.angle;
				}
			}
		}
		else {
			console.log('UNIMPLEMENTED: ' + msg.type);
		}
	};
	socket.onerror = function(e) { /* Not implemented */ };
})();

// This code must be moved to server side
function serverSideComputeOptimalAngle(p)
{
  p.position = Vector.fromCart(p.pos, p.posy);
  p.rect = Rectangle.fromCenter(p.position, config.tankWidth, config.tankHeight);

  var dx0 ;
  var dy0;
  var a0;
  var alpha;

  for (var i = -80; i < 80; i++)
  {
    alpha = i * Math.PI / 180;
    var rect = p.rect.rotate(alpha, p.position);

    var dx1 = p.rect.centerRight.x - rect.centerRight.x;
    var dy1 = world.landscape[Math.round(rect.centerRight.x)] - rect.centerRight.y;
    var a1 = Math.atan2(dy1, dx1);

    if (dx0 === undefined)
    {
      dx0 = dx1;
      dy0 = a1;
      a0 = a1;
    }

    if ((a1 * Math.PI * 180) < 2 && a1 != 0)
    {
      break;
    }
    else
    {
      dx0 = dx1;
      dy0 = a1;
      a0 = a1;
    }
  }

  p.angle = alpha > 0 ? alpha - Math.PI / 6 : alpha + Math.PI / 6;
}

