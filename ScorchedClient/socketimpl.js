(function() {
	var socket = new NepSocket(config.socketUrl);
	socket.onopen = function(e) { /* Not implemented */ };
	socket.onclose = function(e) { /* Not implemented */ };
	socket.onmessage = function(msg) {
		console.log('onmessage:' + msg.type);
		console.log(msg);
	};
	socket.onerror = function(e) { /* Not implemented */ };

	$('#gameRequest').bind('click', function() {
		socket.send({
			type : 'gameRequest'
		});
	});

	$('#fireRequest').bind('click', function() {
		socket.send({
			type : 'fireRequest',
			angle : 30,
			power : 100,
			weaponType : 'cannon'
		});
	});	
})();
