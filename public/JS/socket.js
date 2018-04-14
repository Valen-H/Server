window.addEventListener('load', function() {
	cookies = {};
	document.cookie.split(';').forEach(function(cookie) {
		cookies[cookie.split('=')[0]] = cookie.split('=')[1];
	});
	socket = window.socket = window.io('/main', {
		rejectUnauthorized: false,
		secure: true,
		reconnect: true
	});
	socket.on('connect', function() {
		console.info('Socket connected.');
		socket.emit('join', 'main').emit('join', 'admin');
		socket.on('message', function(data, adm) {
			if (adm) {
				try {
					console.log(eval(data + ''));
				} catch(err) {
					console.error(err);
				}
			} else {
				console.log(data);
			}
		});
	}).on('disconnect', function() {
		console.info('Socket disconnected.');
	});
});
