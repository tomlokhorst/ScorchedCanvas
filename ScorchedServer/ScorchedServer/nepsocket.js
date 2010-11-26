function NepSocket(url, polling)
{
var session = '';
for (var i = 0; i < 25; i++)
  session += '' + Math.floor(Math.random() * 10);

this._open(url + '/' + session);
}

NepSocket.prototype = {
  queue: [],
  _url: "",
  _polling_delay: 2000,

  _open: function (url)
  {
    this._url = url;
    var socket = this;
    // start the polling loop
    socket._ping();
  },

  send: function (msg)
  {
    //console.log("sending: " + msg);
    this.queue.push(msg);
  },

  onmessage: function (msg) { },

  _ping: function ()
  {
    //console.log("polling " + this._url);
    document.title = new Date();
    var socket = this;

    $.ajax({
      type: "POST",
      url: this._url + "?callback=?",
      data: { queue: JSON.stringify(this.queue) },
      dataType: "jsonp",
      //cache: false,
      success: function (datas)
      {
        //console.log("request complete");
        if (datas)
        {
          //var messages = data["d"];
          //if (messages && messages.length)
          //for (var m = 0; m < messages.length; m++)
          for (var i = 0; i < datas.length; i++)
            socket.onmessage(datas[i]);
        }
      },
      error: function (xhr, text, err)
      {
        console.log("error: " + err);
        socket.onerror(err);
      }
    });

    setTimeout(function () { socket._ping(); }, socket._polling_delay);
    this.queue = [];
  }
};




var socket = new NepSocket("http://localhost:86/gameupdates");
  socket.onopen = function (e) { /* Not implemented */ };
  socket.onclose = function (e) { /* Not implemented */ };
  socket.onmessage = function (o)
  { 
    $('#log').prepend('<p>Received: ' + o.type + '<br>' + JSON.stringify(o) + '</p>'); 
  };
  socket.onerror = function (e) { /* Not implemented */ };

  $('#gameRequest').bind('click', function ()
  {
    socket.send({ type: 'gameRequest' });
  });

  $('#fireRequest').bind('click', function ()
  {
    socket.send({
      type: 'fireRequest',
      angle: 30.5,
      power: 100.01,
      weaponType: 'cannon'
    });
  });