var socket;

(function() {
	socket = new NepSocket(config.socketUrl);
	socket.onopen = function(e) { /* Not implemented */ };
	socket.onclose = function(e) { /* Not implemented */ };
	socket.onmessage = function(msg) {

	
		console.log('onmessage:' + msg.type);
		console.log(msg);
		
		if (msg.type == "gameInit") {			
			world.landscape = msg.landscape;
			world.playerId = msg.playerId;
			$.each(msg.players, function(i, player) {
				world.players.push({
					id: player.id,
					health: player.health,
					score: player.score,
					angle: player.angle,
					color: player.color, 
					pos: player.pos
				});
			});
		}
		else if (msg.type == "newPlayer") {
			world.players.push({ 
				id: msg.player.id,
				name: msg.player.name,
				health: msg.player.health,
				score: msg.player.score,
				angle: msg.player.angle,
				color: msg.player.color,
				pos: msg.player.pos
			});
		}
		else if (msg.type == "quitPlayer") {
			world.players = $.grep(world.players, function(player) { return player.id != msg.id; });
		}
		else if (msg.type == "gameUpdate") {
			var updateItem = function(i, update) {
				if (update.type == "updatePlayer") {
					
					var filtered = $.grep(world.players, function(player) { return player.id == update.player.id; });
					
					assert(filtered.length == 0, "Kan player " + update.player.id + " niet vinden");
					
					var player = filtered[0];
					player.name = update.player.name || player.name;
					player.health = update.player.health || player.health;
					player.score = update.player.score || player.score;
					player.angle = update.player.angle || player.angle;
					player.color = update.player.color || player.color;
					player.pos = update.player.pos || player.pos;
				}
				else if (update.type == "fire") {
					world.bullets.push({ id: update.playerId, weaponType: world.weaponType, arc: world.arc });
				}
				else {
					console.log("UNIMPLEMENTED: " + update.type);
				}
			};
			
			/*
			 HOTFIX voor server (stuurt geen array als er maar 1 element in de array staat, Tom kijkt of ie het kan fixen)
			*/
			if (msg.state.length)
				$.each(msg.state, updateItem);
			else
				updateItem(0, msg.state);
			
		}
	};
	socket.onerror = function(e) { /* Not implemented */ };
})();
