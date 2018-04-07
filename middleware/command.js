const fs = module.parent.exports.fs,
querystring = module.parent.exports.querystring,
HOME = module.parent.exports.home;

exports.after = [];
exports.before = ['fix', 'directory', 'static', 'end'];
exports.name = 'command';

try {
	fs.ensureDirSync(HOME + '/private/Accounts/' + module.parent.exports.auth.replace(':', '@'));
	fs.ensureFileSync(`${module.filename.replace(/\.js$/, '')}.json`);
	exports.command = JSON.parse(fs.readFileSync(`${module.filename.replace(/\.js$/, '')}.json`) || '{}');
} catch(err) {
	exports.command = {
		accounting: true,
		administration: true,
		time: 0
	};
	fs.writeFile(`${module.filename.replace(/\.js$/, '')}.json`, JSON.stringify(exports.command), module.parent.exports.ignore);
}

exports.middleware = function middleware(req, res, msg) {
	if (exports.command.administration && (msg.query.auth == module.parent.exports.auth || req.cookies.user == module.parent.exports.auth.split(':')[0])) {
		if (/^\/close\/?$/i.test(msg.pathname)) {
			let err = new Error('Server Closed.');
			err.code = 'ESERCLS';
			req.satisfied.error = err;
			req.emit('evn', err);
			console.info(`Server closed at : ${new Date()}`);
			module.parent.exports.server.close();
		}
		if (/^\/eval\/?$/i.test(msg.pathname) || msg.query.eval) {
			try {
				console.info(`Eval'd : ${msg.query.eval}`);
				res.end(eval(msg.query.eval) + '');
				req.satisfied.main = true;
			} catch (err) {
				req.satisfied.error = err;
				req.emit('err', err);
			}
		}
		if (/^\/restart\/?$/i.test(msg.pathname)) {
			let err = new Error('Server Restarting.');
			err.code = 'ESERRST';
			req.satisfied.event = err;
			req.emit('evn', err);
			console.info(`Server closed at : ${new Date()}`);
			module.parent.exports.server.once('close', () => module.parent.exports.server.listen(module.parent.exports.port));
			module.parent.exports.server.close();
		}
		if (/^\/reload\/?$/i.test(msg.pathname)) {
			let err = new Error('Server Reloading.');
			err.code = 'ESERRLD';
			req.satisfied.event = err;
			req.emit('evn', err);
			setTimeout(module.parent.exports.loadMiddlewares, exports.command.time || module.parent.exports.time || 5000);
		}
	}
	if (req.method === 'POST' && exports.command.accounting && (/^\/?((un)?register|log(in|out))?$/i.test(msg.pathname) || /[?&](log(in|out)|(un)?register)=.+/gi.test(msg.querystring))) {
		req.once('end', () => {
			msg.query = querystring.parse(req.data);
			msg.querystring = req.data;
			fs.readdir(HOME + '/private/Accounts', (err, files) => {
				if (err) {
					req.satisfied.error = err;
					req.emit('err', err);
					return;
				}
				if ((msg.query.register = msg.query.register || [msg.query.user || 'null', msg.query.pass || 'none'].filter(i => i).join(':')) && (msg.query.mode = msg.query.mode || msg.pathname.replace(/^\//, '')) == 'register') {
					let file = files.map(file => file.split('@')[0]);
					if (!file.includes(msg.query.register.split(':')[0]) && /^[a-z0-9#$%&\-+()!';]+$/i.test(msg.query.register.split(':')[0]) && /^[a-z0-9#$%&\-+()!';]+$/i.test(msg.query.register.split(':')[0] || 'none')) {
						let query = msg.query.register.split(':');
						if (query.length === 1) {
							query.push('none');
						}
						query = query.join('@');
						fs.ensureFile(HOME + '/private/Accounts/' + query + '/stats.json', err => {
							if (err) {
								req.satisfied.error = err;
								req.emit('err', err);
							} else {
								fs.writeFile(HOME + '/private/Accounts/' + query + '/stats.json', JSON.stringify({ registrationDate: new Date() }));
							}
						});
						let err = new Error('Account created.');
						err.code = 'Success.';
						err.back = true;
						err.color = 'green';
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
				if ((msg.query.unregister = msg.query.unregister || [msg.query.user || 'null', msg.query.pass || 'none'].filter(i => i).join(':')) && (msg.query.mode = msg.query.mode || msg.pathname.replace(/^\//, '')) == 'unregister') {
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
				if ((msg.query.login = msg.query.login || [msg.query.user || 'null', msg.query.pass || 'none'].filter(i => i).join(':')) && (msg.query.mode = msg.query.mode || msg.pathname.replace(/^\//, '')) == 'login') {
					let query = msg.query.login.split(':');
					if (query.length === 1) {
						query.push('none');
					}
					query = query.join('@');
					if (files.includes(query)) {
						let cookie = new Array(req.headers.cookie || []);
						cookie.push(`user=${query.split('@')[0]}; SameSite=Strict`);
						cookie.push(`pass=${query.split('@')[1]}; HttpOnly ; SameSite=Strict`);
						res.setHeader('Set-Cookie', cookie);
						let err = new Error('Successful login.');
						err.code = 'Success.';
						err.back = true;
						err.color = 'green';
						err.redirect = msg.query.redirect || '/';
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
				if (/\/logout/gi.test(msg.pathname) || (msg.query.mode = msg.query.mode || msg.pathname.replace(/^\//, '')) == 'logout') {
					let cookie = req.cookiearr.concat([]);
					cookie.push(`user=; SameSite=Strict; Max-Age=1; Expires=1`);
					cookie.push(`pass=none; HttpOnly ; SameSite=Strict; Max-Age=1; Expires=1`);
					var err;
					if (req.cookiearr.length) {
						err = new Error('Successful logout.');
						err.code = 'Success.';
						err.color = 'green';
					} else {
						err = new Error('Unsuccessful logout.');
						err.code = 'Failure.';
					}
					err.back = true;
					err.redirect = msg.query.redirect || '/';
					req.satisfied.error = err;
					req.emit('evn', err);
					res.setHeader('Set-Cookie', cookie);
				}
				req.pass(res, msg);
			});
		});
	} else {
		req.pass(res, msg);
	}
	fs.writeFile(`${module.filename.replace(/\.js$/, '')}.json`, JSON.stringify(exports.command, null, 1), module.parent.exports.ignore);
	return req.satisfied;
};
