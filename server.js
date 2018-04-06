#!/usr/bin/env node
const http = exports.http = require('http'),
url = exports.url = require('./lib/url-extra'),
fs = exports.fs = require('fs-extra'),
event = exports.error = require('./event.js'),
readline = exports.readline = require('readline');

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
		delete require.cache[require.resolve(HOME + '/middlewares/' + mwar)];
		middlewares.push(require(HOME + '/middlewares/' + mwar))
	});
	
	do {
		imid = middlewares.flt().concat([]);
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
		middlewares = middlewares.flt().sort((m1, m2) => m1.priority - m2.priority);
	} while (imid.some((i, ind) => i.name != middlewares[ind].name))
	fs.writeFileSync(HOME + '/middlewares/order.json', JSON.stringify(middlewares.flt().map(mwar => mwar.name).join('>')));
	midnames = midnames.flt();
	console.info('Middlewares reloaded...');
};
loadMiddlewares();

const server = exports.server = http.createServer((req, res) => {
	const msg = url.parse(req.url, true);
	req.satisfied = {main: false, set error(value) {this.event = value}, get error() {return this.event}, event: null};
	req.once('err', err => {
		event(req, res, msg);
	}).on('evn', err => {
		event(req, res, msg);
	});
	res.setHeader('Set-Cookie', new Array(req.headers.cookie || []));
	setTimeout((req, res, msg) => {
		if (!req.satisfied.main && !res.finished) {
			let err = new Error('Connection timed out.');
			err.code = 'ETIME';
			req.satisfied.error = err;
			event(req, res, msg);
		}
	}, TIME, req, res, msg);
	req.middle = 0;
	try {
		req.pass = function(res, msg) {
			if (middlewares[this.middle + 1]) middlewares[++this.middle].middleware(req, res, msg);
		};
		middlewares[0].middleware(req, res, msg);
	} catch (err) {
		req.satisfied.error = err;
		event(req, res, msg);
	}
}).listen(PORT, ignore).on('error', console.error).on('connect', (req, socket, head) => {
	console.log(`${socket.remoteAddress} Connected.`);
}).once('listening', () => {
	fs.writeFile(HOME + '/private/up.txt', new Date(), ignore);
}).on('listening', () => console.log(`Server bound to port ${PORT}`));

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.on('line', line => {
	if (/^(re)?load$/i.test(line)) {
		loadMiddlewares();
		console.info('Middlewares loaded.');
	} else if (/^exit$/i.test(line)) {
		rl.close();
	} else if (/^(stop|close)$/i.test(line)) {
		server.close();
	} else if (/^quit$/i.test(line)) {
		process.exit();
	} else if (/^clea[nr]$/i.test(line)) {
		console.clear();
	} else {
		console.log(eval(line));
	}
});

process.on('unhandledRejection', ignore);
