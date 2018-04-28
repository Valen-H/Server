const parent = module.parent.exports,
fs = parent.fs,
chalk = parent.chalk,
HOME = parent.home,
PUBLIC = HOME + '/public',
PRIVATE = HOME + '/private',
BUILTIN = HOME + '/builtin',
AUTH = parent.auth,
url = parent.url,
rl = parent.rl,
ignore = parent.ignore,
querystring = parent.querystring,
STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = ['security', 'event'];
exports.before = ['socket', 'fix', 'directory', 'static', 'end'];
exports.name = 'command';
exports.alive = true;

var store = exports.store = {
	accounting: true,
	administration: true,
	time: 4000,
	path: PRIVATE + '/Admin/panel.html'
};

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

fs.ensureDirSync(PRIVATE + '/Accounts/' + AUTH.replace(':', '@'));
fs.ensureDirSync(PRIVATE + '/Admin');
fs.copySync(BUILTIN + '/panel.html', store.path);

rl.count++;
rl.comps = rl.comps.concat(['register ', 'ban ', 'list']);
if (store.administration) parent.rl.on('line', line => {
	if (rl.block.command || rl.handled) {
		rl.tick();
		return;
	}
	if (/^ban .+$/i.test(line)) {
		rl.handled = true;
		var user = line.split(' ').slice(1).join(' ').split('@')[0];
		fs.readdir(PRIVATE + '/Accounts', (err, files) => {
			fs.remove(PRIVATE + '/Accounts/' + files.filter(file => file.startsWith(user + '@'))[0], err => {
				if (err || !files.filter(file => file.startsWith(user + '@')).length) {
					console.error(chalk`{magenta.italic ${err || 'Invalid Username.'}}`);
				} else {
					console.info(chalk`User '${user}' has been {redBright.bold Banned}.`);
				}
			});
		});
	} else if (/^reg(ist(er)?)? .+$/i.test(line)) {
		rl.handled = true;
		fs.readdir(PRIVATE + '/Accounts', async (err, files) => {
			var user = line.split(' ').slice(1).join(' ');
			if (!user.includes('@')) {
				user += '@none';
			}
			if (files.includes(user) || files.some(file => file.split('@')[0] == user.split('@')[0])) {
				console.error(chalk`{magenta.italic User Exists.}`);
				return;
			}
			fs.ensureFile(PRIVATE + '/Accounts/' + user + '/stats.json', err => {
				if (err) {
					console.error(chalk`{magenta.italic ${err}}`);
				} else {
					fs.writeFile(PRIVATE + '/Accounts/' + user + '/stats.json', JSON.stringify({
						registration: {
							date: new Date()
						},
						login: {
							last: new Date()
						},
						logout: {
							last: null
						}
					}), err => {
						console.info(chalk`User '${user}' has been {greenBright.bold Registered}.`);
					});
				}
			});
		});
	} else if (/^(user)?list$/i.test(line)) {
		rl.handled = true;
		fs.readdir(PRIVATE + '/Accounts', (err, files) => {
			console.log(chalk`{bold ${files.join('\n')}}`);
		});
	}
	rl.tick();
});

var sessions = parent.sessions = exports.sessions = parent.sessions || {};
try {
	Object.defineProperty(sessions, 'admin', {
		get() {
			for (let prop in this) {
				if (this[prop] == AUTH) {
					return prop;
				}
			}
		},
		enumerable: false,
		configurable: false
	});
} catch(err) { }

exports.middleware = async function middleware(req, res, msg) {
	var cc = req.cookiearr.map(c => c + '; HttpOnly; SameSite=Strict; Secure; Expires=Session; path=/');
	res.setHeader('Set-Cookie', cc.flt());
	req.admin = sessions[req.cookies.session] == parent.auth;
	req.acc = sessions[req.cookies.session] || 'null:none';
	req.account = req.acc.split(':');
	fs.ensureFile(PRIVATE + '/Accounts/' + AUTH.replace(':', '@') + '/stats.json', ignore);
	if (store.administration && req.admin) {
		if (/^\/close\/?$/i.test(msg.pathname)) {
			let err = new Error('Server Closed.');
			err.code = 'ESERCLS';
			err.back = true;
			msg.satisfied.error = err;
			req.emit('evn', err);
			parent.server.close(() => {
				console.info(chalk.grey('through web.'));
			});
		}
		if (/^\/eval\/?$/i.test(msg.pathname) || msg.query.eval) {
			try {
				console.log(chalk`{dim.bgGreen Eval'd (through web) : ${msg.query.eval}}`);
				try {
					let dat;
					res.end(dat = eval(msg.query.eval) + '');
					console.info(dat);
				} catch (err) {
					console.error(err);
					msg.satisfied.error = err;
					req.emit('err', err);
				}
				msg.satisfied.main = true;
			} catch (err) {
				msg.satisfied.error = err;
				req.emit('err', err);
			}
		}
		if (/^\/res(tart)?\/?$/i.test(msg.pathname)) {
			let err = new Error('Server Restarting.');
			err.code = 'ESERRST';
			err.back = true;
			msg.satisfied.event = err;
			req.emit('evn', err);
			parent.restart();
			console.info(chalk.dim.grey('through web'));
		}
		if (/^\/rel(oad)?\/?$/i.test(msg.pathname)) {
			let err = new Error('Server Reloading.');
			err.code = 'ESERRLD';
			err.back = true;
			msg.satisfied.event = err;
			req.emit('evn', err);
			parent.loadMiddlewares();
			console.info(chalk.dim.grey('through web'));
		}
		if (/^\/ban\/?$/i.test(msg.pathname) && msg.query.user) {
			var evn = new Error('Account Banned.');
			evn.code = 'EACCBAN';
			evn.color = 'green';
			err.back = true;
			msg.satisfied.event = evn;
			fs.readdir(PRIVATE + '/Accounts', (err, files) => {
				if (err) {
					msg.satisfied.error = err;
					req.emit('err', err);
					return;
				}
				fs.remove(PRIVATE + '/Accounts/' + files.filter(file => file.startsWith(msg.query.user))[0], err => {
					if (err || !files.filter(file => file.startsWith(msg.query.user)).length) {
						evn = new Error('Invalid Account.');
						evn.code = 'ENOACC'; //ENOENT
						delete evn.color;
						msg.satisfied.event = evn;
						req.emit('evn', evn);
						return;
					}
					console.info(chalk`Account '${msg.query.user}' was {redBright.bold Banned} (through web).`);
					req.emit('evn', evn);
				});
			});
		}
		if (/^\/admin\/?$/i.test(msg.pathname)) {
			fs.createReadStream(store.path).pipe(res);
			msg.satisfied.main = true;
			msg.pass();
		}
		//list
	}
	if (req.method === 'POST' && store.accounting && (/^\/?((un)?register|log(in|out))?$/i.test(msg.pathname) || /[?&](log(in|out)|(un)?register)=.+/gi.test(msg.querystring))) {
		//req.once('end', () => {
			msg.query = querystring.parse(req.data);
			msg.querystring = req.data;
			fs.readdir(PRIVATE + '/Accounts', (err, files) => {
				if (err) {
					msg.satisfied.error = err;
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
						fs.ensureFile(PRIVATE + '/Accounts/' + query + '/stats.json', err => {
							if (err) {
								msg.satisfied.error = err;
								req.emit('err', err);
							} else {
								if (req.cookies.session && (req.cookies.session in sessions)) {
									fs.readFile(PRIVATE + '/Accounts/' + sessions[req.cookies.session].replace(':', '@') + '/stats.json', (err, data) => {
										var dat = JSON.parse(data || '{"logout": {}}');
										dat.logout.last = new Date();
										fs.writeFile(PRIVATE + '/Accounts/' + sessions[req.cookies.session].replace(':', '@') + '/stats.json', JSON.stringify(dat), ignore);
									});
								}
								fs.writeFile(PRIVATE + '/Accounts/' + query + '/stats.json', JSON.stringify({
									registration: {
										date: new Date(),
										ip: req.socket.remoteAddress
									},
									login: {
										last: new Date()
									},
									logout: {
										last: null
									}
								}));
							}
						});
						let err = new Error('Account created.');
						err.code = 'Success.';
						err.back = true;
						err.redirect = msg.query.redirect || '/';
						err.color = 'green';
						msg.satisfied.error = err;
						req.emit('evn', err);
						const ciph = parent.crypto.createCipher('aes192', process.env.RANDOM);
						var auth = ciph.update(msg.query.register, 'utf8', 'hex');
						auth += ciph.final('hex');
						let cookie = req.cookiearr.concat([]);
						/*cookie.push(`user=${query.split('@')[0]}; Secure; SameSite=Strict`);
						cookie.push(`pass=${query.split('@')[1]}; Secure; HttpOnly; SameSite=Strict`);*/
						cookie.push(`session=${auth}; Secure; HttpOnly; SameSite=Strict`);
						exports.sessions[auth] = msg.query.register;
						res.setHeader('Set-Cookie', cookie);
					} else {
						let err = new Error('Account name taken or invalid username/password characters passed.');
						err.code = 'Failure.';
						err.back = true;
						msg.satisfied.error = err;
						req.emit('err', err);
					}
				}
				if ((msg.query.unregister = msg.query.unregister || [msg.query.user || 'null', msg.query.pass || 'none'].filter(i => i).join(':')) && (msg.query.mode = msg.query.mode || msg.pathname.replace(/^\//, '')) == 'unregister') {
					if (msg.query.unregister == 'null:none') msg.query.unregister = sessions[req.cookies.session] || msg.query.unregister == 'null:none';
					let query = msg.query.unregister.split(':');
					if (query.length === 1) {
						query.push('none');
					}
					query = query.join('@');
					if (files.includes(query) && msg.query.unregister != AUTH) {
						fs.remove(PRIVATE + '/Accounts/' + query, ignore);
						let err = new Error('Account deleted.');
						err.code = 'Success.';
						err.back = true;
						err.redirect = msg.query.redirect || '/';
						err.color = 'green';
						msg.satisfied.error = err;
						let cookie = req.cookiearr.concat([]);
						/*cookie.push(`user=; Secure; SameSite=Strict; Max-Age=1; Expires=${new Date(0)}`);
						cookie.push(`pass=; Secure; HttpOnly; SameSite=Strict; Max-Age=1; Expires=${new Date(0)}`);*/
						cookie.push(`session=; HttpOnly; Secure; SameSite=Strict; Max-Age=1; Expires=${new Date(0)}`);
						delete sessions[req.cookies.session];
						res.setHeader('Set-Cookie', cookie);
						req.emit('evn', err);
					} else {
						let err = new Error('Account does not exist or invalid username/password passed.');
						err.code = 'Failure.';
						err.back = true;
						msg.satisfied.error = err;
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
						let cookie = req.cookiearr.concat([]);
						const ciph = parent.crypto.createCipher('aes192', process.env.RANDOM);
						var auth = ciph.update(msg.query.login, 'utf8', 'hex');
						auth += ciph.final('hex');
						/*cookie.push(`user=${query.split('@')[0]}; Secure; SameSite=Strict`);
						cookie.push(`pass=${query.split('@')[1]}; Secure; HttpOnly; SameSite=Strict`);*/
						cookie.push(`session=${auth}; Secure; HttpOnly; SameSite=Strict`);
						exports.sessions[auth] = msg.query.login;
						res.setHeader('Set-Cookie', cookie);
						let err = new Error('Successful login.');
						err.code = 'Success.';
						err.back = true;
						err.color = 'green';
						err.redirect = msg.query.redirect || '/';
						msg.satisfied.error = err;
						req.emit('evn', err);
						if (req.cookies.session && (req.cookies.session in sessions)) {
							fs.readFile(PRIVATE + '/Accounts/' + sessions[req.cookies.session].replace(':', '@') + '/stats.json', (err, data) => {
								var dat = JSON.parse(data || '{"logout": {}}');
								dat.logout.last = new Date();
								fs.writeFile(PRIVATE + '/Accounts/' + sessions[req.cookies.session].replace(':', '@') + '/stats.json', JSON.stringify(dat), ignore);
							});
						}
						fs.readFile(PRIVATE + '/Accounts/' + query + '/stats.json', (err, data) => {
							var dat = JSON.parse(data || '{"login": {}}');
							dat.login.last = new Date();
							fs.writeFile(PRIVATE + '/Accounts/' + query + '/stats.json', JSON.stringify(dat), ignore);
						});
					} else {
						let err = new Error('Account name or password is invalid.');
						err.code = 'Failure.';
						err.back = true;
						msg.satisfied.error = err;
						req.emit('err', err);
					}
				}
				if ((/\/logout/gi.test(msg.pathname) || (msg.query.mode = msg.query.mode || msg.pathname.replace(/^\//, '')) == 'logout') && req.cookies.session) {
					let query = sessions[req.cookies.session].split(':') || ['null', 'none'];
					if (query.length === 1) {
						query.push('none');
					}
					query = query.join('@');
					let cookie = req.cookiearr.concat([]);
					/*cookie.push(`user=; HttpOnly; SameSite=Strict; Secure; Max-Age=1; Expires=${new Date(0)}`);
					cookie.push(`pass=; HttpOnly; Secure; SameSite=Strict; Max-Age=1; Expires=${new Date(0)}`);*/
					cookie.push(`session=; HttpOnly; Secure; SameSite=Strict; Max-Age=1; Expires=${new Date(0)}`);
					delete sessions[req.cookies.session];
					res.removeHeader('Set-Cookie');
					res.setHeader('Set-Cookie', cookie);
					var err;
					if (req.cookiearr.length) {
						err = new Error('Successful logout.');
						err.code = 'Success.';
						err.color = 'green';
						fs.readFile(PRIVATE + '/Accounts/' + query + '/stats.json', (err, data) => {
							if (err) {
								err = new Error('Unsuccessful logout.');
								err.code = 'Failure.';
								return;
							}
							var dat = JSON.parse(data || '{"logout": {}}');
							dat.logout.last = new Date();
							fs.writeFile(PRIVATE + '/Accounts/' + query + '/stats.json', JSON.stringify(dat), ignore);
						});
					} else {
						err = new Error('Unsuccessful logout.');
						err.code = 'Failure.';
					}
					err.back = true;
					err.redirect = msg.query.redirect || '/';
					msg.satisfied.error = err;
					req.emit('evn', err);
				}
				msg.pass();
			});
		//});
	} else if (!msg.satisfied.event) {
		msg.pass();
	}
	fs.writeFile(STORE, JSON.stringify(store), ignore);
	return msg.satisfied;
};
