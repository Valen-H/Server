window.addEventListener('load', function() {
	socket = window.socket = window.io('/main', {
		rejectUnauthorized: false,
		secure: true
	});
	socket.emit('join', 'main').emit('join', 'admin');
	socket.on('message', function(data, adm) {
		if (adm) {
			try {
				console.log(eval(data));
			} catch (err) {
				console.error(err);
			}
		} else {
			console.log(data);
		}
	});
});
