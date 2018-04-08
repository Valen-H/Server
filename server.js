#!/usr/bin/env node
const http = exports.http = require('http'),
url = exports.url = require('./lib/url-extra'),
fs = exports.fs = require('fs-extra'),
event = exports.error = require('./event.js'),
readline = exports.readline = require('readline'),
string_decoder = exports.string_decoder = require('string_decoder'),
querystring = exports.querystring = require('querystring'),
child_process = exports.child_process = require('child_process'),
chalk = exports.chalk = require('chalk');

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
//-----

const PORT = exports.port = process.env.port || process.env.npm_config_port || 8080,
HOME = exports.home = fs.realpathSync(process.env.home || process.env.npm_config_home || process.cwd()),
WARES = exports.wares = eval(process.env.wares || process.env.npm_config_wares || "Symbol('ALL')"),
INDEX = exports.index = process.env.index || process.env.npm_config_index || 'index',
TIME = exports.time = (process.env.time || process.env.npm_config_time || 7000) * 1,
AUTH = exports.auth = process.env.auth || process.env.npm_config_auth || 'admin:root',
ignore = exports.ignore = () => {};

var midnames = [];
var middlewares = [], imid;

fs.ensureDirSync('middleware');
fs.ensureDirSync(HOME + '/middlewares');
fs.ensureFileSync('builtin/.noind');
fs.ensureDirSync(HOME + '/public');
fs.ensureDirSync(HOME + '/private/Accounts/' + AUTH.replace(':', '@'));
if (!fs.readdirSync(HOME + '/middlewares').length) {
	fs.copySync('middleware', HOME + '/middlewares');
}

var loadMiddlewares = exports.loadMiddlewares = async function loadMiddlewares() {
	middlewares = [];
	fs.readdirSync(HOME + '/middlewares').flt().filter(mwar => mwar.endsWith('.js') && !mwar.startsWith('d-') && (typeof WARES === 'symbol' || WARES.includes(mwar.replace(/\.js$/, '')))).flt().forEach(mwar => {
		try {
			delete require.cache[require.resolve(HOME + '/middlewares/' + mwar)];
			middlewares.push(require(HOME + '/middlewares/' + mwar) || 'null');
		} catch(err) {
			console.error(chalk`{dim.bgRed ${err}}`);
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
	fs.writeFileSync(HOME + '/middlewares/order.json', JSON.stringify(middlewares.flt().map(mwar => mwar.name).join('>')));
	midnames = midnames.flt();
	console.info(chalk`{grey Middlewares reloaded...}`);
};

loadMiddlewares();

const server = exports.server = http.createServer((req, res) => {
	req.url = querystring.unescape(req.url);
	const msg = url.parse(req.url, true);
	req.satisfied = {main: false, set error(value) {this.event = value}, get error() {return this.event}, event: null};
	req.once('err', err => {
		event(req, res, msg);
	}).on('evn', err => {
		event(req, res, msg);
	});
	res.setHeader('Set-Cookie', req.headers.cookie || []);
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
}).listen(PORT, ignore).on('error', console.error).on('connect', (req, socket, head) => {
	console.log(`${socket.remoteAddress} Connected.`);
}).once('listening', () => {
	fs.writeFile(HOME + '/private/up.txt', new Date(), ignore);
}).on('listening', () => console.log(chalk`Server bound to port {greenBright ${PORT}}`));

const rl = exports.rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.on('line', line => {
	if (/^((re)?load|rel)$/i.test(line)) {
		loadMiddlewares();
	} else if (/^((re)?start|res)$/i.test(line)) {
		server.close();
		rl.close();
		delete require.cache[require.resolve(module.filename)];
		with (global) {
			exports = require(module.filename);
		}
	} else if (/^exi?t?$/i.test(line)) {
		rl.close();
	} else if (/^(stop|close|cls)$/i.test(line)) {
		server.close();
	} else if (/^q(ui)?t$/i.test(line)) {
		process.exit();
	} else if (/^clea[nr]$/i.test(line)) {
		console.clear();
	} else if (/^# /i.test(line)) {
		const proc = child_process.spawn(line.split(' ')[1], line.split(' ').slice(2).concat(line.split(' ')[1] == 'ls' ? ['--color=auto'] : []), {
			cwd: process.cwd(),
			silent: true,
			detached: false,
			/*gid: process.getgid(),
			uid: process.getuid(),*/
			shell: true,
			stdio: 'inherit'
		});
		/*proc.stdout.on('data', data => {
			console.log(`stdout: ${data}`);
		});
		proc.stderr.on('data', data => {
			console.log(`stderr: ${data}`);
		});*/
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
	} else {
		try {
			console.log(eval(line));
		} catch(err) {
			console.error(err);
		}
	}
});

process.on('unhandledRejection', err => {
	console.warn(chalk`{dim.grey ${err}}`);
});
