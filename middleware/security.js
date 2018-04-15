const parent = module.parent.exports,
fs = parent.fs,
chalk = parent.chalk,
PUBLIC = parent.home + '/public',
PRIVATE = parent.home + '/private',
url = parent.url,
BUILTIN = parent.home + '/builtin',
HOME = parent.home,
rl = parent.rl,
STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = [];
exports.before = ['socket', 'command', 'fix', 'directory', 'static', 'end'];
exports.name = 'security';
exports.alive = true;

var store = exports.store = {
	cooldown: 500
};

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

var reqarr = exports.reqarr = [], reqlist = {};

exports.middleware = function middleware(req, res, msg) {
	if (reqlist[req.socket.remoteAddress] && (req.method == 'POST' || (req.method == 'GET' && !req.headers.referer))) {
		let err = new Error('Cooldown...');
		err.code = 'ECOOL'; //ETIMEDOUT
		msg.satisfied.error = err;
		req.emit('err', err);
		req.destroy(err);
	} else if (req.method == 'POST') {
		reqarr.add(req);
		reqlist[req.socket.remoteAddress] = true;
		setTimeout(req => delete reqlist[req.socket.remoteAddress], store.cooldown, req);
		req.on('close', () => {
			reqarr.rmv(req);
		});
		msg.pass();
	} else {
		msg.pass();
	}
	return req.satisfied;
};
