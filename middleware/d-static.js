const fs = module.parent.exports.fs,
parent = module.parent.exports,
chalk = module.parent.exports.chalk,
PUBLIC = module.parent.exports.home + '/public',
url = module.parent.exports.url;
const STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = ['command', 'fix', 'security'];
exports.before = ['directory', 'end'];
exports.name = 'static';

exports.store = {
	exclusions: []
};

try {
	fs.ensureFileSync(STORE);
	exports.store = JSON.parse(fs.readFileSync(STORE));
} catch (err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

fs.ensureFileSync('builtin/.noind');

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main && !req.satisfied.error) {
		fs.stat(PUBLIC + msg.pathname, (err, stat) => {
			if (!err && stat.isFile() && !msg.pathname.includes('-d-') && !msg.filename.startsWith('.no') && !exports.store.exclusions.some(exc => msg.pathname.startsWith(exc))) {
				fs.createReadStream(PUBLIC + msg.pathname).pipe(res);
				req.satisfied.main = true;
			} else if (err || msg.pathname.includes('-d-') || msg.filename.startsWith('.no')) {
				err = err || new Error('No such file or directory.');
				err.code = err.code || 'ENOENT';
				req.satisfied.error = err;
				req.emit('err', err);
			} else if (stat.isDirectory()) {
				fs.readdir(PUBLIC + msg.pathname, (err, files) => {
					var out = true;
					if (files.includes(module.parent.exports.index + '.js')) {
						out = require(PUBLIC + msg.pathname + module.parent.exports.index + '.js')(req, res, msg);
					}
					var tp;
					if (out && (files.includes(module.parent.exports.index + (tp = '.html')) || files.includes(module.parent.exports.index + (tp = '.htm'))) && !files.includes('.noind')) {
						fs.createReadStream(PUBLIC + msg.pathname + module.parent.exports.index + tp).pipe(res);
						req.satisfied.main = true;
						req.pass(res, msg);
					} else if (files.includes('.noind')) {
						fs.readFile(PUBLIC + msg.pathname + '.noind', (err, data) => {
							if (err) {
								req.satisfied.error = err;
								req.emit('err', err);
								return;
							}
							let file = (data.toString() || 'ALL').split('\n');
							fs.stat(PUBLIC + msg.pathname + module.parent.exports.index + tp, (err, stat) => {
								if (!err && stat.isFile() && !file.includes(PUBLIC + msg.pathname + module.parent.exports.index + tp) && !file.includes('ALL')) {
									fs.createReadStream(PUBLIC + msg.pathname + module.parent.exports.index + tp).pipe(res);
									req.satisfied.main = true;
								}
								req.pass(res, msg);
							});
						});
					} else {
						req.pass(res, msg);
					}
				});
			} else {
				req.pass(res, msg);
			}
		});
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};
