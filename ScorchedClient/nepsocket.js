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
	_polling_delay: 500,

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
		data: this.queue.length ? { "d": this.queue} : null,
		dataType: "jsonp",
		//cache: false,
		success: function (data)
		{
		  //console.log("request complete");
		  $('#log').append('<p>sup ' + data.type + ' </p>');
		  if (data)
		  {
			//var messages = data["d"];
			//if (messages && messages.length)
			  //for (var m = 0; m < messages.length; m++)
				socket.onmessage(data);
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




var socket = new NepSocket("http://tom.q42.local:85/gameupdates");
  socket.onopen = function (e) { /* Not implemented */ };
  socket.onclose = function (e) { /* Not implemented */ };
  socket.onmessage = function (o)
  { 
    $('#log').append('<p>Received: ' + o.type + '</p>'); 
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
      angle: 30,
      power: 100,
      weaponType: 'cannon'
    });
  });