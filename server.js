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
socket = exports.socket = require('socket.io'),
stream = exports.stream = require('stream'),
events = exports.event = require('events'),
Console = exports.Console = require('console').Console,
dgram = exports.dgram = require('dgram'),
stripAnsi = chalk.strip = exports.stripAnsi = require('strip-ansi');

http.globalAgent.options.rejectUnauthorized = false;

//----- TAKEN FROM nodemodule PROJECT
Array.prototype.inherit = Array.prototype.inh = function(array) {
	var arr = array.length > this.length ? array : this;
	arr.forEach((function (val, ind, arr) {
		this[ind] = array[ind];
		while (this[this.length - 1] === undefined && this.length) {
			this.pop();
		}
	}).bind(this));
	return this;
};
Array.prototype.flt = function() {
	var nar = [];
	this.forEach(function (val) {
		nar.add(val);
	});
	return this.inh(nar);
};
Array.prototype.add = function add(elm) {
	if (!this.includes(elm)) {
		this.push(elm);
	}
	return this;
};
Array.prototype.rmv = String.prototype.rmv = function (elm, n) {
	var arr = this.split("");
	if (typeof elm != "number" && this.indexOf(elm) < 0) {
		return this;
	}
	arr.splice(typeof elm == "number" && !n ? elm : this.indexOf(elm), 1);
	if (this instanceof String) {
		return arr.join("");
	}
	return arr;
};
function rnd(frm, to, rd) {
	if (frm === undefined) {
		return "#" + ((Math.random() * 16777215) | 0).toString(16);
	} else {
		to = to === undefined ? frm : to;
		frm = frm == to ? 0 : frm;
		var tmp = [Math.min(frm, to), Math.max(frm, to)];
		frm = tmp[0];
		to = tmp[1];
		return !rd ? (Math.random() * (to - frm) + frm) | 0 : (Math.random() * (to - frm) + frm);
	}
} //rnd
Array.prototype.rnd = function (rd) {
	var ind = rnd(0, this.length - 1);
	if (rd) {
		return ind;
	}
	return this[ind];
};
//----- WARNING

delete console;
console = this.console = global.console = new Console(new stream.Duplex({
	write(chunk, encoding, callback) {
		process.stdout.write(chunk, encoding);
		log.write(chunk, encoding, callback);
		log.emit('data', chunk, encoding, callback);
	}
})); //EXPORTABLE

const PORT = exports.port = process.env.port || process.env.npm_config_port || 8080,
HOME = exports.home = fs.realpathSync(process.env.home || process.env.npm_config_home || process.cwd()),
WARES = exports.wares = eval(process.env.wares || process.env.npm_config_wares || "Symbol('ALL')"),
INDEX = exports.index = process.env.index || process.env.npm_config_index || 'index',
TIME = exports.time = (process.env.time || process.env.npm_config_time || 6000) * 1,
AUTH = exports.auth = process.env.auth || process.env.npm_config_auth || 'admin:root',
BCLOG = exports.bclog = process.env.bclog || process.env.npm_config_bclog || 100;
LOG = exports.LOG = HOME + '/' + (process.env.log || process.env.npm_config_log || 'log.log'),
ignore = exports.ignore = (...p) => {},
log = exports.log = fs.createWriteStream(LOG, {
	flags: 'a+'
}),
cert = fs.readFileSync('cert.pem'),
key = fs.readFileSync('private.pem'),
ca = fs.readFileSync('clientcert.pem');

log.write('\n ' + '-'.repeat(30) + ' \n');

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

const rl = exports.rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.handled = rl.adm = rl.comm = rl.exe = false;
rl.block = {};
rl.count = 1;
rl.tick = function() {
	if (--rl.count <= 0) {
		rl.count = rl.listenerCount('line');
		rl.handled = false;
		return true;
	}
	return false;
};
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
		console.log('\n'.repeat(50));
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
			console.log(chalk`{grey.dim.bgYellow.bold child process exited with code ${code}.}`);
			rl.resume();
		});
		rl.pause();
	} else if (/^cert$/i.test(line)) {
		console.log(chalk.cyanBright.dim('Forging...'));
		await require('./lib/certs.js')();
		console.log(chalk.yellow.dim('Certificates created.'));
	} else if (/^(no)?col(ou?r)?$/i.test(line)) {
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
	middlewares = [];
	rl.removeAllListeners()
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
},
restart = exports.restart = function restart() {
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
};

loadMiddlewares();

const server = exports.server = http.createServer({
	key: fs.readFileSync('private.pem'),
	cert: fs.readFileSync('cert.pem'),
	ca: [fs.readFileSync('clientcert.pem')],
	rejectUnauthorized: false,
	requestCert: true
}, (req, res) => {
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
	req.cookies = {};
	req.dec = new string_decoder.StringDecoder();
	req.end = false;
	req.data = '';
	req.on('data', data => req.data += req.dec.write(data));
	req.once('end', () => {
		req.end = true;
		req.data += req.dec.end();
		req.data = querystring.unescape(req.data);
	});
	req.cookiearr = (req.headers.cookie || ';').split(';').filter(i => i).flt();
	(req.headers.cookie || ';').split(';').filter(cook => cook.includes('=')).forEach(cookie => req.cookies[cookie.split('=')[0].trim()] = cookie.split('=')[1]);
	setTimeout((req, res, msg) => {
		if (!msg.satisfied.main && !res.finished) {
			let err = new Error('Connection timed out.');
			err.code = 'ETIME';
			msg.satisfied.error = err;
			req.emit('err', err);
		}
	}, TIME, req, res, msg);
	msg.middle = - 1;
	msg.pass = function() {
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
	res.pass = req.pass = function() {
		this.msg.pass();
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

//----- DANGEROUS
process.removeAllListeners();
process.on('unhandledRejection', err => {
	console.warn(chalk`{dim.grey ${err}}`);
});
process.on('uncaughtException', err => {
	console.error(chalk`{dim.bgRed ${err.stack}}`);
});
