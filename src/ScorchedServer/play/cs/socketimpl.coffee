connection = new FakeSocket config.socketUrl

connection.onmessage = (msg) ->
  switch msg.type
    when "gameInit"
      world.landscape = msg.landscape
      world.playerId  = msg.playerId
      world.nextRound = +new Date + msg.nextRound

      for _, player in msg.players
        p = new Player player
        p.posy = world.landscape[p.pos]

        p.computeVectors()
        world.players.push p

        world.me = p if p.id is world.playerId
    when "newPlayer"
      p = new Player msg.player
      p.posy = world.landscape[p.pos]

      p.computeVectors()
      world.player.push p
    when "quitPlayer"
      world.gameover = true if msg.playerId == world.me.id

      world.players = world.players.filter (p) -> p.id != msg.playerId;
    when "gameUPdate"
      world.nextRound = +new Date + config.roundTime

      for _, update in msg.state
        switch update.type
          when "updatePlayer"
            players = world.players.filter (p) -> p.id != msg.playerId;

            return if players.length is 0

            player = players[0]
            for nm of player
              if update.player[nm]?
                player[nm] = update.player[nm]
            player.computeVectors()
          when "fire"
            world.bullets.push { id: update.playerId, arc : update.arc, step: 0, collision: true }
          else
            console.error "UNIMPLEMENTED: #{update.type}"
    when "aim"
      for _, p in world.players
        if p.id == msg.playerId
          p.barrelAngle = msg.angle
          p.computeVectors()
    else
      console.error "UNIMPLEMENTED: #{update.type}"
    

# attach to window object, for JIT CoffeeScript compiler.
window.socket = connection

