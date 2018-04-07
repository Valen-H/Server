const fs = module.parent.exports.fs,
PUBLIC = module.parent.exports.home + '/public';

exports.after = ['command', 'fix'];
exports.before = ['directory', 'end'];
exports.name = 'static';

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main && !req.satisfied.error) {
		fs.stat(PUBLIC + msg.pathname, (err, stat) => {
			if (!err && stat.isFile() && !msg.pathname.includes('-d-') && !msg.filename.startsWith('.no')) {
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
