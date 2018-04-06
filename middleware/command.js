const fs = module.parent.exports.fs,
HOME = module.parent.exports.home;

exports.after = [];
exports.before = ['fix', 'directory', 'static', 'end'];
exports.name = 'command';

exports.middleware = function middleware(req, res, msg) {
	if (msg.query.auth == module.parent.exports.auth) {
		if (/^\/close$/i.test(msg.pathname)) {
			let err = new Error('Server Closed.');
			err.code = 'ESERCLS';
			req.satisfied.error = err;
			req.emit('evn', err);
			console.info(`Server closed at : ${new Date()}`);
			module.parent.exports.server.close();
		}
		if (/^\/eval$/i.test(msg.pathname) || msg.query.eval) {
			try {
				console.info(`Eval'd : ${msg.query.eval}`);
				res.end(eval(msg.query.eval) + '');
				req.satisfied.main = true;
			} catch (err) {
				req.satisfied.error = err;
				req.emit('err', err);
			}
		}
		if (/^\/restart$/i.test(msg.pathname)) {
			let err = new Error('Server Restarting.');
			err.code = 'ESERRST';
			req.satisfied.event = err;
			req.emit('evn', err);
			console.info(`Server closed at : ${new Date()}`);
			module.parent.exports.server.once('close', () => module.parent.exports.server.listen(module.parent.exports.port));
			module.parent.exports.server.close();
		}
		if (/^\/reload$/i.test(msg.pathname)) {
			let err = new Error('Server Reloading.');
			err.code = 'ESERRLD';
			req.satisfied.event = err;
			req.emit('evn', err);
			setTimeout(module.parent.exports.loadMiddlewares, module.parent.exports.time);
		}
	}
	if (/^\/((un)?register|log(in|out))?$/i.test(msg.pathname)) {
		fs.readdir(HOME + '/private/Accounts', (err, files) => {
			if (err) {
				req.satisfied.error = err;
				req.emit('err', err);
				req.pass(res, msg);
				return;
			}
			if (msg.query.register) {
				let file = files.map(file => file.split('@')[0]);
				if (!file.includes(msg.query.register.split(':')[0]) && /^[a-z0-9#$%&\-+()!';]+$/i.test(msg.query.register.split(':')[0]) && /^[a-z0-9#$%&\-+()!';]+$/i.test(msg.query.register.split(':')[0] || 'none')) {
					let query = msg.query.register.split(':');
					if (query.length === 1) {
						query.push('none');
					}
					query = query.join('@');
					fs.ensureDir(HOME + '/private/Accounts/' + query, module.parent.exports.ignore);
					let err = new Error('Account created.');
					err.code = 'Success.';
					err.back = true;
					err.color = 'green';
					err.redirect = !msg.query.login ? '/login?from=reg&login=' + query.replace('@', ':') : undefined;
					req.satisfied.error = err;
					req.emit('evn', err);
				} else {
					let err = new Error('Account name taken or invalid username/password characters passed.');
					err.code = 'Failure.';
					err.back = true;
					req.satisfied.error = err;
					req.emit('err', err);
				}
			}
			if (msg.query.unregister) {
				let query = msg.query.unregister.split(':');
				if (query.length === 1) {
					query.push('none');
				}
				query = query.join('@');
				if (files.includes(query)) {
					fs.remove(HOME + '/private/Accounts/' + query, module.parent.exports.ignore);
					let err = new Error('Account deleted.');
					err.code = 'Success.';
					err.back = true;
					err.color = 'green';
					err.redirect = !msg.query.login ? '/logout' : undefined;
					req.satisfied.error = err;
					req.emit('evn', err);
				} else {
					let err = new Error('Account does not exist or invalid username/password passed.');
					err.code = 'Failure.';
					err.back = true;
					req.satisfied.error = err;
					req.emit('err', err);
				}
			}
			if (msg.query.login) {
				let query = msg.query.login.split(':');
				if (query.length === 1) {
					query.push('none');
				}
				query = query.join('@');
				if (files.includes(query)) {
					let cookie = new Array(req.headers.cookie || []);
					cookie.push(`user=${query.split('@')[0]} ; SameSite`);
					cookie.push(`pass=${query.split('@')[1]} ; HttpOnly ; SameSite`);
					res.setHeader('Set-Cookie', cookie);
					let err = new Error('Successful login.');
					err.code = 'Success.';
					err.back = true;
					err.color = 'green';
					err.alert = msg.query.from == 'reg' ? 'Welcome!' : undefined;
					if (msg.query.from == 'reg') {
						err.redirect = '/';
					}
					req.satisfied.error = err;
					req.emit('evn', err);
				} else {
					let err = new Error('Account name or password is invalid.');
					err.code = 'Failure.';
					err.back = true;
					req.satisfied.error = err;
					req.emit('err', err);
				}
			}
			if (/\/logout/gi.test(msg.pathname)) {
				let cookie = new Array(req.headers.cookie || []);
				cookie = cookie.filter(cook => !cook.startsWith('user') && !cook.startsWith('pass'));
				res.setHeader('Set-Cookie', cookie);
				var err;
				if ((new Array(req.headers.cookie || [])).length != cookie.length) {
					err = new Error('Successful logout.');
					err.code = 'Success.';
					err.color = 'green';
				} else {
					err = new Error('Unsuccessful logout.');
					err.code = 'Failure.';
				}
				err.back = true;
				err.redirect = '/';
				req.satisfied.error = err;
				req.emit('evn', err);
			}
			req.pass(res, msg);
			return;
		});
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};
