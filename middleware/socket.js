const parent = module.parent.exports,
fs = parent.fs,
chalk = parent.chalk,
PUBLIC = parent.home + '/public',
PRIVATE = parent.home + '/private',
BUILTIN = parent.home + '/builtin',
socket = exports.socket = require('socket.io'),
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
	cookie: true,
	logs: true
},
io = {},
adm = exports.adm = {},
chat = exports.chat = {},
list;
parent.io = exports.io = {};

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

fs.ensureDirSync(PUBLIC + '/JS');
fs.ensureDirSync(PUBLIC + '/CSS');
fs.ensureDirSync(PUBLIC + '/HTML');
fs.ensureDirSync(PUBLIC + '/SRC');
fs.copySync(HOME + '/node_modules/socket.io-client/dist/socket.io.js', PUBLIC + '/JS/socket.io.js');
fs.copySync(HOME + '/node_modules/socket.io-client/dist/socket.io.js.map', PUBLIC + '/JS/socket.io.js.map');
fs.copySync(BUILTIN + '/chat.html', PUBLIC + '/chat.html');

rl.count++;
rl.comps = rl.comps.concat(['admin']);
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
			io.to('admin').send('location.reload()', true);
		} else if (/^ki[ck]{1,2}$/i.test(line)) {
			console.info(chalk.gray('Kicking all clients...'));
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
		parent.io = exports.io = socket(parent.server, {
			pingTimeout: store.pingTimeout,
			pingInterval: store.pingInterval,
			cookie: store.cookie
		});
		var func;
		(io = exports.io.of('/main')).on('connect', func = soc => {
			soc.handshake.cookies = {};
			soc.handshake.cookiearr = (soc.handshake.headers.cookie || ';').split(';').filter(i => i).flt();
			(soc.handshake.headers.cookie || ';').split(';').filter(cook => cook.includes('=')).forEach(cookie => soc.handshake.cookies[cookie.split('=')[0].trim()] = cookie.split('=')[1]);
			if (parent.sessions[(soc.handshake.cookies || {}).session] == parent.auth) {
				console.log(chalk`{grey ${soc.handshake.address} connected as Admin.}`);
				soc.on('message', (...msg) => {
					try {
						if (store.logs) {
							console.info(chalk.dim.green(`Through socket : '${msg}'`));
							console.log(eval("'use strict';\n" + msg[0].toString()));
						} else {
							eval(msg[0].toString());
						}
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
			soc.to('main').on('listAddr', so => {
				var comp = [];
				for (s in io.sockets) {
					comp.add(io.sockets[s].handshake.address);
				}
				so(comp);
			});
			soc.to('admin').broadcast.volatile.emit('joined', Object.keys(io.sockets).length);
			soc.on('join', room => {
				soc.to('main').broadcast.volatile.emit('joined', Object.keys(io.sockets).length, room);
				soc.join(room);
			});
			soc.on('leave', room => {
				soc.to('main').broadcast.volatile.emit('left', Object.keys(io.sockets).length, room);
				soc.leave(room);
			});
			soc.on('quit', () => {
				delete parent.sessions[soc.handshake.cookies.session];
			});
		}).on('disconnect', soc => {
			soc.broadcast.volatile.emit('left', Object.keys(io.sockets).length);
		});
		
		(adm = exports.adm = exports.io.of('/admin')).on('connect', func).on('disconnect', soc => {
			console.log(chalk`{grey Admin ${soc.handshake.address} disconnected.\n${new Date}}`);
		});
		parent.log.on('data', data => adm.to('logs').volatile.send(chalk.strip(data.toString())));
		
		(chat = exports.chat = exports.io.of('/chat')).on('connect', soc => {
			soc.handshake.cookies = {};
			soc.handshake.cookiearr = (soc.handshake.headers.cookie || ';').split(';').filter(i => i).flt();
			(soc.handshake.headers.cookie || ';').split(';').filter(cook => cook.includes('=')).forEach(cookie => soc.handshake.cookies[cookie.split('=')[0].trim()] = cookie.split('=')[1]);
			soc.broadcast.volatile.emit('connected', soc.handshake.address);
			soc.on('message', (...p) => {
				soc.volatile.send(...p, (parent.sessions[(soc.handshake.cookies || {}).session] || ':').split(':')[0] || soc.handshake.address);
				soc.broadcast.volatile.send(...p, (parent.sessions[(soc.handshake.cookies || {}).session] || ':').split(':')[0] || soc.handshake.address);
			});
		}).on('disconnect', soc => {
			soc.broadcast.volatile.emit('disconnected', soc.handshake.address);
		});
	}
	msg.pass();
	return msg.satisfied;
};
