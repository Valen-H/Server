#!/usr/bin/env node

const http = exports.http = require('http'),
url = exports.url = require('./lib/url-extra'),
fs = exports.fs = require('fs-extra'),
event = exports.error = require('./event.js'),
readline = exports.readline = require('readline'),
string_decoder = exports.string_decoder = require('string_decoder'),
querystring = exports.querystring = require('querystring'),
child_process = exports.child_process = require('child_process'),
chalk = exports.chalk = require('chalk'),
crypto = exports.crypto = require('crypto'),
socket = exports.socket = require('socket.io');

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
//-----

const PORT = exports.port = process.env.port || process.env.npm_config_port || 8080,
HOME = exports.home = fs.realpathSync(process.env.home || process.env.npm_config_home || process.cwd()),
WARES = exports.wares = eval(process.env.wares || process.env.npm_config_wares || "Symbol('ALL')"),
INDEX = exports.index = process.env.index || process.env.npm_config_index || 'index',
TIME = exports.time = (process.env.time || process.env.npm_config_time || 7000) * 1,
AUTH = exports.auth = process.env.auth || process.env.npm_config_auth || 'admin:root',
ignore = exports.ignore = () => {};

var midnames = exports.midnames = [];
var middlewares = exports.middlewares = [], imid,
middlewaresO = exports.middlewaresO = {};

fs.ensureDirSync('middleware');
fs.ensureDirSync(HOME + '/middlewares');
fs.ensureFileSync('builtin/.noind');
fs.ensureDirSync(HOME + '/public');
fs.ensureDirSync(HOME + '/private/Accounts/' + AUTH.replace(':', '@'));
if (!fs.readdirSync(HOME + '/middlewares').length) {
	fs.copySync('middleware', HOME + '/middlewares');
}

var rl = exports.rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.comm = rl.exe = false;
rl.on('line', exports.list = line => {
	if (rl.comm) {
		line = '# ' + line;
	} else if (rl.exe) {
		line = 'e ' + line;
	}
	if (/^((re)?load|rel)$/i.test(line)) {
		loadMiddlewares();
	} else if (/^((re)?start|res)$/i.test(line)) {
		exports.rl.close();
		restart();
	} else if (/^exi?t?$/i.test(line)) {
		rl.pause();
		rl.close();
	} else if (/^(stop|close|cls)$/i.test(line)) {
		server.close();
	} else if (/^q(ui)?t$/i.test(line)) {
		process.exit();
	} else if (/^clea[nr]$/i.test(line)) {
		console.clear();
	} else if (/^up(time)?/i.test(line)) {
		console.info(chalk`{dim.yellowBright Up since : ${process.uptime()} sec.}`);
	} else if (/^#$/i.test(line)) {
		rl.comm = true;
		console.info(chalk`{dim.yellow Shell session engaged.}`);
	} else if (/^# ?#{1,2}$/i.test(line)) {
		rl.comm = false;
		console.info(chalk`{dim.yellow Shell session disengaged.}`);
	} else if (/^ev?a?l?$/i.test(line)) {
		rl.exe = true;
		console.info(chalk`{dim.yellow REPL session engaged.}`);
	} else if (/^ev?a?l? ?(ev?a?l?){1,2}$/i.test(line)) {
		rl.exe = false;
		console.info(chalk`{yellow REPL session disengaged.}`);
	} else if (/^# .(?!#{1,2})/i.test(line)) {
		const proc = child_process.spawn(line.split(' ')[1], line.split(' ').slice(2).concat(line.split(' ')[1] == 'ls' ? ['--color=auto'] : []), {
			cwd: process.cwd(),
			silent: true,
			detached: false,
			shell: true,
			stdio: 'inherit'
		});
		proc.on('error', console.error);
		proc.on('close', code => {
			if (code) {
				code = chalk`{red ${code}}`;
			} else {
				code = chalk`{cyan ${code}}`;
			}
			console.log(chalk`{grey.dim.bgYellow.bold child process exited with code ${code}.}`);
			rl.resume();
		});
		rl.pause();
	} else if (/^ev?a?l? ./i.test(line)) {
		line = line.replace(/^ev?a?l? /i, '');
		try {
			console.log(eval(line));
		} catch(err) {
			console.error(chalk`{dim.bgRed ${err}}`);
		}
	}
});

var mid = exports.mid = fs.watch(HOME + '/middlewares', {recursive: true}, (type, file) => {
	if (type == 'change' && file.endsWith('.js')) loadMiddlewares();
}),
watch = exports.watch = fs.watch(HOME, (type, file) => {
	if (type == 'change' && file.endsWith('.js')) restart();
});

var loadMiddlewares = exports.loadMiddlewares = async function loadMiddlewares() {
	middlewares = [];
	rl.removeAllListeners()
	rl.on('line', exports.list);
	fs.readdirSync(HOME + '/middlewares').flt().filter(mwar => mwar.endsWith('.js') && !mwar.startsWith('d-') && (typeof WARES === 'symbol' || WARES.includes(mwar.replace(/\.js$/, '')))).flt().forEach(mwar => {
		try {
			delete require.cache[require.resolve(HOME + '/middlewares/' + mwar)];
			middlewares.push(require(HOME + '/middlewares/' + mwar) || 'null');
		} catch (err) {
			console.error(chalk`{dim.bgRed ${mwar + ' : ' + err}}`);
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
	console.info(chalk`{grey Middlewares reloaded...}`);
},
restart = exports.restart = function restart() {
	exports.rl.close();
	exports.watch.close();
	exports.mid.close();
	/*exports.server.once('close', () => {
		delete require.cache[require.resolve(module.filename)];
		exports = require(module.filename);
		exports.rl.comm = rl.comm;
	});*/
	exports.server.close();
	child_process.spawn(process.argv[0], process.argv.slice(1), {
		cwd: process.cwd(),
		env: process.env,
		argv0: process.argv[0],
		shell: true,
		stdio: 'inherit',
		detached: true
	});
	if (process.disconnect) process.exit();
};

loadMiddlewares();

var server = exports.server = http.createServer((req, res) => {
	req.url = querystring.unescape(req.url);
	var msg = url.parse(req.url, true);
	req.satisfied = {main: false, set error(value) {this.event = value}, get error() {return this.event}, event: null};
	req.once('err', err => {
		event(req, res, msg);
	}).on('evn', err => {
		event(req, res, msg);
	});
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
		if (!req.satisfied.main && !res.finished) {
			let err = new Error('Connection timed out.');
			err.code = 'ETIME';
			req.satisfied.error = err;
			event(req, res, msg);
		}
	}, TIME, req, res, msg);
	req.middle = 0;
	req.pass = function(res, msg) {
		try {
			if (middlewares[this.middle + 1]) middlewares[++this.middle].middleware(req, res, msg);
		} catch(err) {
			console.error(chalk`{dim.red ${err}}`);
			req.satisfied.error = err;
			req.emit('err', err);
		}
	};
	middlewares[0].middleware(req, res, msg);
}).listen(PORT, ignore).on('error', ignore).on('connect', (req, socket, head) => {
	console.log(`${socket.remoteAddress} Connected.`);
}).once('listening', () => {
	fs.writeFile(HOME + '/private/up.txt', new Date(), ignore);
}).on('listening', () => console.log(chalk`Server bound to port {greenBright ${PORT}}`)).on('close', () => {
	console.log('Server Closed.');
});

var io = exports.io = socket(server, {
	pingTimeout: 30000,
	pingInterval: 5000,
	cookie: true
});

/*const reqpar = exports.reqpar = function(data, raw = true) {
	var headers = {};
	data = data.split('\r\n').filter(i => i && i.includes(':')).flt();
	data.forEach(dat => {
		headers[raw ? dat.split(':')[0] : dat.split(':')[0].replace(/-/g, '').replace(/^./, c => c.toLowerCase())] = dat.split(':').slice(1).join(':').trim();
	});
	return headers;
},
sha1 = exports.sha1 = function(val) {
	var shasum = crypto.createHash('sha1');
	shasum.update(val);
	return shasum.digest('hex');
};*/

//----- DANGEROUS
process.removeAllListeners();
process.on('unhandledRejection', err => {
	console.warn(chalk`{dim.grey ${err}}`);
});
process.on('uncaughtException', err => {
	console.error(chalk`{dim.bgRed ${err}}`);
});
