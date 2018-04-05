const fs = module.parent.exports.fs;

exports.after = [];
exports.before = ['directory', 'end'];
exports.name = 'static';

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main) {
		fs.stat(module.parent.exports.home + '/public' + msg.pathname, (err, stat) => {
			if (!err && stat.isFile() && !msg.filename.startsWith('d-') && !msg.filename.startsWith('.no')) {
				fs.createReadStream(module.parent.exports.home + '/public' + msg.pathname).pipe(res);
				req.satisfied.main = true;
			} else if (err || msg.filename.startsWith('d-') || msg.filename.startsWith('.no')) {
				let err = new Error('No such file or directory.');
				err.code = 'ENOENT';
				req.satisfied.error = err;
				req.emit('err', err);
			} else if (stat.isDirectory()) {
				fs.readdir(module.parent.exports.home + '/public' + msg.pathname, (err, files) => {
					var out = true;
					if (files.includes(module.parent.exports.index + '.js')) {
						out = require(module.parent.exports.home + '/public' + msg.pathname + '.js')(req, res, msg);
					}
					if (out && (files.includes(module.parent.exports.index + '.html') || files.includes(module.parent.exports.index + '.htm')) && !files.includes('.noind')) {
						fs.createReadStream(module.parent.exports.home + '/public/' + module.parent.exports.index + '.html').pipe(res);
						req.satisfied.main = true;
					} else {
						req.pass(res, msg);
					}
				});
			}
		});
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};
