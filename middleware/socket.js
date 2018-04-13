const parent = module.parent.exports,
fs = parent.fs,
chalk = parent.chalk,
PUBLIC = parent.home + '/public',
PRIVATE = parent.home + '/private',
BUILTIN = parent.home + '/builtin',
url = parent.url,
HOME = parent.home,
rl = parent.rl,
STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = ['security', 'event', 'command'];
exports.before = ['fix', 'directory', 'static', 'end'];
exports.name = 'socket';
exports.alive = true;

var store = exports.store = {
	enabled: true,
	pingTimeout: 30000,
	pingInterval: 5000,
	cookie: true
},
io = exports.io = {},
list;

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

rl.count++;
rl.on('line', list = line => {
	if (rl.block.socket || rl.handled) {
		rl.tick();
		return;
	}
	if (parent.rl.adm) {
		line = 'adm ' + line;
	}
	if (/^adm(in)?$/i.test(line)) {
		rl.handled = true;
		rl.adm = true;
		rl.removeListener('line', list);
		rl.prependListener('line', list);
		console.info(chalk`{yellow Admin session engaged.}`);
	} else if (/^adm(in)? ?(adm(in)?){1,2}$/i.test(line)) {
		rl.handled = true;
		rl.adm = false;
		rl.removeListener('line', list);
		rl.on('line', list);
		console.info(chalk`{yellow Admin session disengaged.}`);
	} else if (/^adm(in)? (?!(adm(in)?){1,2}$)/i.test(line)) {
		rl.handled = true;
		line = line.split(' ').slice(1).join(' ');
		if (/^((re)?load|rel)$/i.test(line)) {
			console.info(chalk.grey('Reloading all clients...'));
			exports.io.to('admin').send('location.reload()', true);
		} else if (/^(ki[ck]{1,2})$/i.test(line)) {
			io.to('admin').send('location = "about:blank"', true);
		} else {
			io.to('admin').send(line, true);
		}
	}
	rl.tick();
});

exports.middleware = function middleware(req, res, msg) {
	if (store.enabled) {
		exports.alive = store.enabled = false;
		io = exports.io = parent.socket(parent.server, {
			pingTimeout: store.pingTimeout,
			pingInterval: store.pingInterval,
			cookie: store.cookie
		}).of('/main').on('connection', soc => {
			soc.on('join', room => {
				soc.join(room);
				parent.log.write(chalk`{grey ${soc.handshake.address} joined ${room}.}\n`);
			});
			soc.handshake.cookies = {};
			soc.handshake.cookiearr = (soc.handshake.headers.cookie || ';').split(';').filter(i => i).flt();
			(soc.handshake.headers.cookie || ';').split(';').filter(cook => cook.includes('=')).forEach(cookie => soc.handshake.cookies[cookie.split('=')[0].trim()] = cookie.split('=')[1]);
			if ([soc.handshake.cookies.user, soc.handshake.cookies.pass].join(':') == parent.auth) {
				soc.on('message', msg => {
					try {
						console.info(chalk.dim.green(`Through socket : '${msg}'`));
						console.log(eval(msg));
					} catch(err) {
						console.error(chalk.bgRed(err));
					}
				}).on('close', () => {
					parent.server.close(() => {
						console.info(chalk.grey('through socket.'));
					});
				}).on('reload', () => {
					parent.reload();
					console.info(chalk.grey('through socket.'));
				}).on('restart', () => {
					parent.restart();
					console.info(chalk.grey('through socket.'));
				});
			}
			parent.log.write(chalk`{grey ${soc.handshake.address} connected.\n${new Date}}\n`);
		});
	}
	msg.pass();
	return msg.satisfied;
};
