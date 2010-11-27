function NepSocket(url, polling) {
	var session = '';
	for ( var i = 0; i < 25; i++)
		session += '' + Math.floor(Math.random() * 10);

	this._open(url + '/' + session);
}

NepSocket.prototype = {
	queue : [],
	_url : "",
	_polling_delay : 500,

	_open : function(url) {
		this._url = url;
		var socket = this;
		// start the polling loop
		socket._ping();
	},

	send : function(msg) {
		//console.log('sending: ');
		//console.log(msg);
		this.queue.push(msg);
	},

	onmessage : function(msg) {
	},

	_ping : function() {
		// console.log("polling " + this._url);
		var socket = this;

		$.ajax({
		  type: "POST",
		  url: this._url + "?callback=?",
		  data: { queue: JSON.stringify(this.queue) },
		  dataType: "jsonp",
			// cache: false,
			success : function(datas) {
				// console.log("request complete");
				$.each(datas, function(i, data) {
					socket.onmessage(data);
				});
			},
			error : function(xhr, text, err) {
				console.log("error: " + text);
				socket.onerror(err);
			}
		});

		setTimeout(function() {
			socket._ping();
		}, socket._polling_delay);
		this.queue = [];
	}
};
