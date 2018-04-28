#!/usr/bin/env node

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //!!!

//SWITCH TO HTTP IF NO .pem'S

const http = exports.http = require('https'),
htt = exports.htt = require('http'),
path = exports.path = require('path'),
url = exports.url = require('./lib/url-extra'),
fs = exports.fs = require('fs-extra'),
readline = exports.readline = require('readline'),
string_decoder = exports.string_decoder = require('string_decoder'),
querystring = exports.querystring = require('querystring'),
child_process = exports.child_process = require('child_process'),
chalk = exports.chalk = require('chalk'),
stream = exports.stream = require('stream'),
events = exports.event = require('events'),
Console = exports.Console = require('console').Console,
crypto = exports.crypto = require('crypto'),
stripAnsi = chalk.strip = exports.stripAnsi = require('strip-ansi'),
mod = exports.mod = require('./lib/nodemodule');

if (require.main === module) {
	mod.expose();
}

http.globalAgent.options.rejectUnauthorized = false;

delete console;

const logstream = exports.logstream = new stream.Duplex({
	write(chunk, encoding, callback) {
		if (!logstream.data) logstream.data = '';
		logstream.data += chunk;
		process.stdout.write(chunk, encoding);
		log.write(chunk, encoding, callback);
		process.stdout.emit('data', chunk, encoding, callback);
		log.emit('data', chunk, encoding, callback);
		logstream.emit('data', chunk, encoding, callback);
	},
	read(size) {
		return logstream.data.slice(0, size);
	}
});

console = this.console = global.console = new Console(logstream);
console.stream = logstream;
console.read = logstream.read;

const PORT = exports.port = (process.env.port || process.env.npm_config_port || 8080) * 1,
HOME = exports.home = fs.realpathSync(process.env.home || process.env.npm_config_home || process.cwd()),
WARES = exports.wares = eval(process.env.wares || process.env.npm_config_wares || "Symbol('ALL')"),
INDEX = exports.index = process.env.index || process.env.npm_config_index || 'index',
TIME = exports.time = (process.env.time || process.env.npm_config_time || 6000) * 1,
AUTH = exports.auth = process.env.auth || process.env.npm_config_auth || 'admin:root',
BCLOG = exports.bclog = (process.env.bclog || process.env.npm_config_bclog || 100) * 1,
NAME = exports.name = process.env.name || process.env.npm_config_name || 'Server',
LOG = exports.LOG = HOME + '/' + (process.env.log || process.env.npm_config_log || 'log.log'),
ESC = exports.esc = String.fromCharCode(0x1B),
DEL = exports.del = String.fromCharCode(8) + String.fromCharCode(0),
TAB = exports.tab = String.fromCharCode(9),
ignore = exports.ignore = (...p) => {},
log = exports.log = fs.createWriteStream(LOG, {
	flags: 'a+'
}),
cert = exports.cert = fs.readFileSync('cert.pem'),
key = exports.key = fs.readFileSync('private.pem'),
ca = exports.ca = fs.readFileSync('clientcert.pem');

process.stdout.write(String.fromCharCode(0x1B) + '[7h'); //enable terminal text wrap
log.write('\n ' + '-'.repeat(process.stdout.columns - 2) + ' \n');

var midnames = exports.midnames = [];
var middlewares = exports.middlewares = [], imid,
middlewaresO = exports.middlewaresO = {}, loadMiddlewares;

fs.ensureDirSync('middleware');
fs.ensureDirSync(HOME + '/middlewares');
fs.ensureFileSync('builtin/.noind');
fs.ensureDirSync(HOME + '/public');
fs.ensureDirSync(HOME + '/private/Accounts/' + AUTH.replace(':', '@'));
if (!fs.readdirSync(HOME + '/middlewares').length) {
	fs.copySync('middleware', HOME + '/middlewares');
}

const rl = exports.rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: AUTH + '>',
	completer: function(line) {
		rl.comps = rl.comps.sort();
		return [rl.comps.filter(cmp => (cmp.includes(line) && line.length > 5) || cmp.startsWith(line)), line];
	}
});
rl.handled = rl.adm = rl.comm = rl.exe = false;
rl.block = {};
rl.count = 1;
rl.comps = ['#', 'eval', 'reload', 'restart', 'quit', 'exit', 'clean', 'uptime', 'cert', 'nocolors', 'colors', 'close'];
rl.tick = function() {
	if (--rl.count <= 0) {
		rl.count = rl.listenerCount('line');
		rl.handled = false;
		return true;
	}
	return false;
};
rl.tick();
rl.on('line', exports.line = async line => {
	if (rl.block.main || rl.handled) {
		rl.tick();
		return;
	} else if (rl.comm) {
		line = '# ' + line;
	} else if (rl.exe) {
		line = 'e ' + line;
	}
	if (!line) {
		rl.handled = true;
		fs.createReadStream(LOG).pipe(process.stdout);
	} else if (/^((re)?load|rel)$/i.test(line)) {
		rl.handled = true;
		loadMiddlewares();
	} else if (/^((re)?start|res)$/i.test(line)) {
		rl.handled = true;
		restart();
	} else if (/^exi?t?$/i.test(line)) {
		rl.handled = true;
		rl.close();
	} else if (/^(stop|close|cls)$/i.test(line)) {
		rl.handled = true;
		server.close();
	} else if (/^q(ui)?t$/i.test(line)) {
		rl.handled = true;
		process.exit();
	} else if (/^clea[nr]$/i.test(line)) {
		rl.handled = true;
		process.stdout.write(String.fromCharCode(0x1B) + '[2J'); //Erase screen
		console.log('\n'.repeat(process.stdout.rows * 2));
		console.clear();
		fs.truncate(LOG, () => {
			console.log(chalk`Logs erased.\n{grey ${new Date()}}`);
		});
	} else if (/^up(time)?/i.test(line)) {
		rl.handled = true;
		console.info(chalk`{dim.yellowBright Up since : ${process.uptime()} sec.}`);
	} else if (/^e(v(al?)?)?$/i.test(line)) {
		rl.exe = true;
		rl.handled = true;
		console.info(chalk`{dim.yellow REPL session engaged.}`);
	} else if (/^e(v(al?)?)? ?(e(v(al?)?)?){1,2}$/i.test(line)) {
		rl.exe = false;
		rl.handled = true;
		console.info(chalk`{yellow REPL session disengaged.}`);
	} else if (/^e(v(al?)?)? (?!(e(v(al?)?)?){1,2}$)/i.test(line)) {
		rl.handled = true;
		line = line.replace(/^e(v(al?)?)? /i, '');
		try {
			console.log(eval(line));
		} catch(err) {
			console.error(chalk`{dim.bgRed ${err}}`);
		}
	} else if (/^#$/i.test(line)) {
		rl.comm = true;
		rl.handled = true;
		console.info(chalk`{dim.yellow Shell session engaged.}`);
	} else if (/^# ?#{1,2}$/i.test(line)) {
		rl.comm = false;
		rl.handled = true;
		console.info(chalk`{dim.yellow Shell session disengaged.}`);
	} else if (/^# (?!#{1,2}$)/i.test(line)) {
		rl.handled = true;
		const proc = child_process.spawn(line.split(' ')[1], line.split(' ').slice(2).concat(/(^|\W|\b| )ls( |\W|\b|$)/g.test(line.split(' ').slice(1).join(' ')) ? ['--color=auto'] : []), {
			cwd: process.cwd(),
			detached: false,
			stdio: 'inherit',
			shell: true
		});
		proc.on('error', console.error);
		proc.on('close', code => {
			if (code) {
				code = chalk`{red ${code}}`;
			} else {
				code = chalk`{cyan.dim ${code}}`;
			}
			console.log(chalk`\n{grey.dim.bgYellow.bold child process exited with code ${code}.}`);
			rl.resume();
		});
		rl.pause();
	} else if (/^cert$/i.test(line)) {
		rl.handled = true;
		console.log(chalk.cyanBright.dim('Forging...'));
		await require('./lib/certs.js')();
		console.log(chalk.yellow.dim('Certificates created.'));
	} else if (/^(no)?col(ou?rs?)?$/i.test(line)) {
		rl.handled = true;
		chalk.enabled = !/^no/i.test(line);
		var cols = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'];
		var text = `Colors ${chalk.enabled ? 'Enabled' : 'Disabled'}.`;
		text = text.split('').map(t => chalk`{${cols.rnd()}Bright.bold ${t}}`).join('');
		console.log(text);
	}
	rl.tick();
});

const mid = exports.mid = fs.watch(HOME + '/middlewares', { recursive: true }, (type, file) => {
	if (file.endsWith('.js') || file.includes('midstore')) loadMiddlewares();
}),
watch = exports.watch = fs.watch(HOME, (type, file) => {
	if (type == 'change' && file.endsWith('.js')) restart();
}),
reload = exports.reload = loadMiddlewares = exports.loadMiddlewares = async function loadMiddlewares() {
	server.emit('reloading');
	middlewares = [];
	rl.removeAllListeners();
	rl.comps = ['#', 'eval', 'reload', 'restart', 'quit', 'exit', 'clean', 'uptime', 'cert', 'nocolors', 'colors', 'close'];
	rl.count = 1;
	rl.on('line', exports.line);
	fs.readdirSync(HOME + '/middlewares').flt().filter(mwar => mwar.endsWith('.js') && !mwar.startsWith('d-') && (typeof WARES === 'symbol' || WARES.includes(mwar.replace(/\.js$/, '')))).flt().forEach(mwar => {
		try {
			delete require.cache[require.resolve(HOME + '/middlewares/' + mwar)];
			middlewares.push(require(HOME + '/middlewares/' + mwar) || 'null');
		} catch (err) {
			console.error(chalk`{dim.bgRed ${mwar + ' : \n\t' + err.stack}}\n{gray ${new Date}}`);
		}
	});
	do {
		imid = middlewares.filter(mw => mw && mw.middleware).flt().concat([]);
		midnames = [];
		middlewares.flt().forEach((mwar, ind) => {
			var apr = ind;
			midnames.push(mwar.name);
			middlewares.flt().forEach((mw, ind) => {
				var tmp = apr;
				if ((ind > apr && mwar.after.includes(mw.name)) || (ind < apr && mwar.before.includes(mw.name))) {
					apr = ind;
					middlewares[ind].priority = tmp;
				}
			});
			middlewares[ind].priority = apr;
		});
		middlewares = middlewares.filter(mw => mw && mw.middleware).flt().sort((m1, m2) => m1.priority - m2.priority);
	} while (imid.some((i, ind) => i.name != middlewares[ind].name))
	middlewares.forEach(md => middlewaresO[md.name] = md);
	fs.writeFileSync(HOME + '/middlewares/order.json', JSON.stringify(middlewares.flt().map(mwar => mwar.name).join('>')));
	midnames = midnames.flt();
	http.get({
		port: PORT,
		cert: cert,
		key: key,
		ca: ca,
		path: '/startup',
		agent: false
	}, ignore);
	console.info(chalk`{grey Middlewares reloaded...\n${new Date}}`);
	server.emit('reloaded');
},
restart = exports.restart = async function restart() {
	server.emit('restarting');
	console.info(chalk.whiteBright.dim.bold.underline('Server Restarting...') + '\n' + chalk.gray(new Date));
	rl.close();
	watch.close();
	mid.close();
	server.close();
	http.get({
		port: PORT,
		headers: {Cookie: `user=${AUTH.split(':')[0]}; pass=${AUTH.split(':')[1]}`},
		auth: AUTH,
		cert: cert,
		key: key,
		ca: ca,
		path: '/close',
		agent: false
	}, ignore).on('error', ignore);
	exports.child = child_process.spawn(process.argv[0], process.argv.slice(1), {
		cwd: process.cwd(),
		env: process.env,
		argv0: process.argv[0],
		stdio: 'inherit'
	});
	if (process.disconnect) process.exit();
},
server = exports.server = http.createServer({
	key: fs.readFileSync('private.pem'),
	cert: fs.readFileSync('cert.pem'),
	ca: [fs.readFileSync('clientcert.pem')],
	rejectUnauthorized: false,
	requestCert: true
}, async (req, res) => {
	req.url = querystring.unescape(req.url);
	var msg = req.msg = url.parse(req.url, true);
	msg.satisfied = {
		main: false,
		set error(value) {
			this.event = value;
		},
		get error() {
			return this.event;
		},
		event: null
	};
	res.satisfied = req.satisfied = msg.satisfied;
	req.res = res;
	req.msg = msg;
	res.req = req;
	res.msg = msg;
	msg.req = req;
	msg.res = res;
	req.dec = new string_decoder.StringDecoder();
	req.end = false;
	req.data = await (async () => {
		return new Promise((rsl, rjc) => {
			req.data = '';
			req.on('data', data => req.data += req.dec.write(data));
			req.once('end', () => {
				req.end = true;
				req.data += req.dec.end();
				req.data = querystring.unescape(req.data);
				rsl(req.data);
			});
		});
	})();
	req.cookies = {};
	req.cookiearr = (req.headers.cookie || ';').split(';').filter(i => i).flt();
	req.cookiearr.filter(cook => cook.includes('=')).forEach(cookie => req.cookies[cookie.split('=')[0].trim()] = cookie.split('=')[1]);
	setTimeout(async (req, res, msg) => {
		if (!msg.satisfied.main && !res.finished) {
			let err = new Error('Connection timed out.');
			err.code = 'ETIMEDOUT';
			msg.satisfied.error = err;
			req.emit('err', err);
		}
	}, TIME, req, res, msg);
	msg.middle = - 1;
	msg.pass = async function() {
		var [req, res, msg] = [this.req, this.res, this];
		try {
			if (middlewares[this.middle + 1]) {
				if (!middlewares[++this.middle].alive) {
					middlewares.slice(this.middle, 1);
					msg.pass();
				} else {
					middlewares[this.middle].middleware(req, res, msg);
				}
			}
		} catch(err) {
			console.error(chalk`{dim.red ${err.stack}}\n{gray ${new Date}}`);
			msg.satisfied.error = err;
			req.emit('err', err);
		}
	};
	res.pass = req.pass = async function() {
		return this.msg.pass();
	};
	msg.pass();
}).listen(PORT, BCLOG).on('error', err => {
	http.get({
		port: PORT,
		headers: {Cookie: `user=${AUTH.split(':')[0]}; pass=${AUTH.split(':')[1]}`},
		auth: AUTH,
		cert: cert,
		key: key,
		ca: ca,
		path: '/close',
		agent: false
	}, (req, res) => {
		var lis;
		server.listen(PORT, BCLOG);
	}).on('error', err => {
		setTimeout(server.listen, TIME, PORT, BCLOG);
	}).end();
}).on('connect', (req, socket, head) => {
	console.log(`${socket.remoteAddress} Connected.`);
}).once('listening', () => {
	fs.writeFile(HOME + '/private/up.txt', new Date(), ignore);
}).on('listening', () => {
	console.log(chalk`Server bound to port {bold.greenBright ${PORT}}\n{gray.dim ${new Date}}`);
	http.get({
		port: PORT,
		cert: cert,
		key: key,
		ca: ca,
		agent: false
	}, ignore).on('error', ignore);
}).on('close', () => {
	fs.writeFile(HOME + '/private/down.txt', new Date(), ignore);
	console.log(chalk`Server Closed.\n{gray.dim ${new Date}}`);
});
exports.sessions = {};
loadMiddlewares();
server.emit('restarted');

const readStat = exports.readStat = fs.readStat = async function(file, cb) {
	return new Promise((rsl, rjc) => {
		fs.stat(file, async (err, stat) => {
			if (err) {
				rjc(err);
			} else {
				if (stat.isDirectory() && typeof cb == 'function') {
					cb(await readDir(file), true, rsl);
				} else if (stat.isDirectory()) {
					rsl({
						data: await readDir(file),
						type: 'dir'
					});
				} else if (stat.isFile() && typeof cb == 'function') {
					cb(await readFile(file), false, rsl);
				} else if (stat.isFile()) {
					rsl({
						data: await readFile(file),
						type: 'file'
					});
				} else {
					rjc(stat);
				}
			}
		});
	});
},
readFile = exports.readFile = async function readFile(file) {
	return new Promise((rsl, rjc) => {
		fs.readFile(file, (err, data) => {
			if (err) {
				rjc(err);
			} else {
				rsl(data);
			}
		});
	});
},
readDir = exports.readDir = async function readDir(dir) {
	return new Promise((rsl, rjc) => {
		fs.readdir(dir, (err, files) => {
			if (err) {
				rjc(err);
			} else {
				rsl(files);
			}
		});
	});
};

//----- DANGEROUS
process.removeAllListeners();
process.on('unhandledRejection', err => {
	console.warn(chalk`{dim.grey ${err}}`);
});
process.on('uncaughtException', err => {
	console.error(chalk`{dim.bgRed ${err.stack}}`);
});
