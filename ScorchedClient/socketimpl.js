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
			
			$.each(msg.players, function(i, player) {
				world.players.push({
					id: player.id,
					health: 100,
					score: 0,
					angle: Math.PI / 2,
					color: player.color, 
					pos: player.pos
				});
			});
		}
		else if (msg.type == "newPlayer") {
			world.players.push({ 
				id: player.id,
				name: player.name,
				health: 100,
				score: 0,
				angle: Math.PI / 2,
				color: player.color,
				pos: player.pos
			});
		}
		else if (msg.type == "quitPlayer") {
			world.players = $.grep(world.players, function(player) { return player.id != msg.id; });
		}
		else if (msg.type == "gameUpdate") {
			var updateItem = function(i, update) {
				if (update.type == "updatePlayer") {
					
					var filtered = $.grep(world.players, function(player) { return player.id == update.id; });
					
					assert(filtered.length == 0, "Kan player " + update.id + " niet vinden");
					
					var player = filtered[0];
					player.name = update.name || player.name;
					player.health = update.health || player.health;
					player.score = update.score || player.score;
					player.angle = update.angle || player.angle;
					player.color = update.color || player.color;
					player.pos = update.pos || player.pos;
				}
				else if (update.type == "fire") {
					world.bullets.push({ id: update.id, weaponType: world.weaponType, arc: world.arc });
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
