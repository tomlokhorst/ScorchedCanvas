class FakeSocket
  constructor: (url) ->
    session = (Math.floor Math.random() * 9 for _ in [1..25]).join("")

    @_url = url + "/" + session
    @_ping()

  _queue        : []
  _pollingDelay : 500

  send: (msg) ->
    @_queue.push msg

  onmessage: ->

  onerror: ->

  _ping: ->
    $.ajax
      type      : "POST"
      url       : @_url + "?callback=?"
      data      : { queue: JSON.stringify @_queue }
      dataType  : "jsonp"
      success: (datas) =>
        for data in datas
          @onmessage data
      error: (_, text, err) =>
        console.error text
        @onerror err
     
    setTimeout (=> @_ping()), @_pollingDelay

    @_queue = []

# attach to window object, for JIT CoffeeScript compiler.
window.FakeSocket = FakeSocket

