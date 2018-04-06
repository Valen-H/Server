const fs = module.parent.exports.fs;

exports.after = ['fix', 'static', 'command'];
exports.before = ['end'];
exports.name = 'directory';

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main && !msg.filename.startsWith('d-') && !req.satisfied.error) {
		var e = false;
		fs.stat(module.parent.exports.home + '/public' + msg.pathname, (err, stat) => {
			if (!err && stat.isDirectory()) {
				fs.readdir(module.parent.exports.home + '/public' + msg.pathname, (err, files) => {
					files = files.filter(file => !file.startsWith('d-') || file == '.noind');
					if (err || files.includes('.nodir')) {
						let err = err || new Error('No such file or directory.');
						err.code = err.code || 'ENOENT';
						err.errno = err.errno ? err.errno : -2;
						req.satisfied.error = err;
						req.emit('err', err);
						return;
					}
					var temp = "\t<li value='&t'><a href='&t'>&t</a></li>\n";
					var list = [];
					files.forEach(file => {
						list.push(temp.replace(/&t/gi, file));
					});
					fs.readFile(module.parent.exports.home + '/builtin/directory.html', (err, data) => {
						if (err) {
							req.satisfied.error = err;
							req.emit('err', err);
							return;
						}
						req.satisfied.main = true;
						res.end(data.toString().replace(/&&list&&/gi, list.join('')).replace(/&&dir&&/gi, msg.pathname));
					});
				});
			} else if (err) {
				req.satisfied.error = err;
				req.emit('err', err);
			}
		});
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};
