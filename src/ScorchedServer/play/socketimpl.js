var socket;

(function() {
    
  socket = new NepSocket(config.socketUrl);
  socket.onopen = function() {
    updatePlayer({
      name: localStorage["player_name"],
      coor: localStorage["player_color"]
    })
  } ;
  socket.onclose = function(e) { 
    console.log("connection closed");
    console.log(e);
   }
  socket.onmessage = function(msg)
  {
    if (msg.type == 'gameInit') {      
      world.landscape = msg.landscape;
      world.playerId = msg.playerId;
      world.nextRound = +new Date + msg.nextRound;
      $.each(msg.players, function(i, player) {
        console.log("player # " + player.id + ": " + player.name);
        var p = new Player( {
          id: player.id,
          name: player.name,
          health: player.health,
          score: player.score,
          angle: player.angle,
          barrelAngle: player.barrelAngle,
          color: player.color,
          shape: player.Shape,
          pos: player.pos,
          posy: world.landscape[player.pos]
        });
        p.computeVectors();
        world.players.push(p);
          
        if (player.id == world.playerId)
          world.me = p;
      });
    }
    else if (msg.type == 'newPlayer') {
    //debugger
      var p = new Player( { 
        id: msg.player.id,
        name: msg.player.name,
        health: msg.player.health,
        score: msg.player.score,
        angle: msg.player.angle,
        barrelAngle: msg.player.barrelAngle,
        color: msg.player.color,
        pos: msg.player.pos,
        posy: world.landscape[msg.player.pos]
      });
      p.computeVectors();
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
          console.log("updateplayer");
          var filtered = $.grep(world.players, function(player) { return player.id == update.player.id; });
          
          if (filtered.length == 0) return;

          var player = filtered[0];
          
          world.updatePlayer(player, update.player);
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
      $(world.players).each(function (_, player)
      {
        if (player.id == msg.playerId)
        {
          player.barrelAngle = msg.angle;
          player.computeVectors();
        }
      });
    }
    else {
      console.log('UNIMPLEMENTED: ' + msg.type);
    }
  };
  socket.onerror = function(e) { /* Not implemented */ };
})();

