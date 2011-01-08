connection = new FakeSocket config.socketUrl

connection.onmessage = (msg) ->
  switch msg.type
    when "gameInit"
      world.landscape = msg.landscape
      world.playerId  = msg.playerId
      world.nextRound = +new Date + msg.nextRound

      for player in msg.players
        p = new Player player
        p.posy = world.landscape[p.pos]

        p.updateVectors()
        world.players.push p

        if p.id is world.playerId
          world.me = p
    when "newPlayer"
      p = new Player msg.player
      p.posy = world.landscape[p.pos]

      p.updateVectors()
      world.players.push p
    when "quitPlayer"
      if msg.playerId == world.me.id
        world.gameover = true

      world.players = world.players.filter (p) -> p.id isnt msg.playerId
    when "gameUpdate"
      world.nextRound = +new Date + config.roundTime

      for update in msg.state
        switch update.type
          when "updatePlayer"
            players = world.players.filter (p) -> p.id is update.player.id

            return if players.length is 0

            player = players[0]
            for nm, _ of player
              if update.player[nm]?
                player[nm] = update.player[nm]

            player.updateVectors()
          when "fire"
            world.bullets.push 
              id        : update.playerId
              arc       : update.arc
              step      : 0
              collision : true
          else
            console.error "Unknown state: #{update.type}", update
    when "aim"
      for p in world.players
        if p.id is msg.playerId
          p.barrelAngle = msg.angle
          p.updateVectors()
    else
      console.error "Unknown message: #{update.type}"
    

# attach to window object, for JIT CoffeeScript compiler.
window.socket = connection

