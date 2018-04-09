const fs = module.parent.exports.fs,
HOME = module.parent.exports.home,
chalk = module.parent.exports.chalk,
parent = module.parent.exports,
url = module.parent.exports.url;
const STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = [];
exports.before = ['command', 'fix', 'directory', 'static', 'end'];
exports.name = 'security';
var store = exports.store = {
	enabled: true,
	cooldown: 500
};

try {
	fs.ensureFileSync(STORE);
	exports.store = JSON.parse(fs.readFileSync(STORE));
} catch (err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

var reqarr = exports.reqarr = [], reqlist = {};

exports.middleware = function middleware(req, res, msg) {
	if (reqlist[req.socket.remoteAddress] && req.method == 'POST') {
		let err = new Error('Cooldown...');
		err.code = 'ECOOL';
		req.satisfied.error = err;
		req.emit('err', err);
		req.destroy(err);
	} else if (req.method == 'POST') {
		reqarr.add(req);
		reqlist[req.socket.remoteAddress] = true;
		setTimeout(req => delete reqlist[req.socket.remoteAddress], store.cooldown, req);
		req.on('close', () => {
			reqarr.rmv(req);
		});
		req.pass(res, msg);
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};
