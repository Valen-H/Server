#!/usr/bin/env node
const http = exports.http = require('http'),
url = exports.url = require('./lib/url-extra'),
fs = exports.fs = require('fs-extra'),
error = require('./error.js'),
readline = require('readline');

//----- TAKEN BY nodemodule PROJECT
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
ignore = exports.ignore = () => {};

var midnames = [];
var middlewares = [], imid;

fs.ensureDirSync('middleware');
fs.ensureDirSync(HOME + '/middlewares');
fs.ensureFileSync('builtin/.noind');
fs.ensureDirSync(HOME + '/public');
if (!fs.readdirSync(HOME + '/middlewares').length) {
	fs.copySync('middleware', HOME + '/middlewares');
}

function loadMiddlewares() {
	fs.readdirSync(HOME + '/middlewares').filter(mwar => mwar.endsWith('.js') && !mwar.startsWith('d-') && (typeof WARES === 'symbol' || WARES.includes(mwar.replace(/\.js$/, '')))).forEach(mwar => middlewares.push(require(HOME + '/middlewares/' + mwar)));
	
	do {
		imid = middlewares.concat([]);
		midnames = [];
		
		middlewares.forEach((mwar, ind) => {
			var apr = ind;
			midnames.push(mwar.name);
			middlewares.forEach((mw, ind) => {
				var tmp = apr;
				if ((ind > apr && mwar.after.includes(mw.name)) || (ind < apr && mwar.before.includes(mw.name))) {
					apr = ind;
					middlewares[ind].priority = tmp;
				}
			});
			middlewares[ind].priority = apr;
		});
		middlewares = middlewares.sort((m1, m2) => m1.priority - m2.priority);
	} while (imid.some((i, ind) => i.name != middlewares[ind].name))
	fs.writeFileSync(HOME + '/middlewares/order.json', JSON.stringify(middlewares.map(mwar => mwar.name).join('>')));
} //loadMiddlewares
loadMiddlewares();

const server = exports.server = http.createServer((req, res) => {
	const msg = url.parse(req.url, true);
	req.satisfied = {main: false, error: null};
	req.on('err', err => {
		error(req, res, msg);
	});
	setTimeout((req, res, msg) => {
		if (!req.satisfied.main && !res.finished) {
			let err = new Error('Connection timed out.');
			err.code = 'ETIME';
			req.satisfied.error = err;
			error(req, res, msg);
		}
	}, 7000, req, res, msg);
	req.middle = 0;
	req.pass = function(res, msg) {
		if (middlewares[this.middle + 1]) middlewares[++this.middle].middleware(req, res, msg);
	};
	middlewares[0].middleware(req, res, msg);
}).listen(PORT, () => console.log(`Server bound to port ${PORT}`)).on('error', console.error).on('connect', (req, socket, head) => {
	console.log(`${socket.remoteAddress} Connected.`);
}).once('listening', () => {
	fs.writeFile(HOME + '/public/up.txt', new Date(), ignore);
});

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.on('line', line => {
	if (/^(re)?load$/i.test(line)) {
		loadMiddlewares();
		console.info('Middlewares loaded.');
	} else if (/^exit$/i.test(line)) {
		rl.close();
	} else if (/^stop$/i.test(line)) {
		server.close();
	} else if (/^quit$/i.test(line)) {
		process.exit();
	} else if (/^clea[nr]$/i.test(line)) {
		console.clear();
	} else {
		console.log(eval(line));
	}
});
