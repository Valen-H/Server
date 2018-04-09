const fs = module.parent.exports.fs,
parent = module.parent.exports,
chalk = module.parent.exports.chalk,
PUBLIC = module.parent.exports.home + '/public',
url = module.parent.exports.url;
const STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = ['fix', 'static', 'command', 'security'];
exports.before = ['end'];
exports.name = 'directory';

fs.ensureFileSync('builtin/.nodir');

exports.store = {
	exclusions: ['SRC', 'Resources']
};

try {
	fs.ensureFileSync(STORE);
	exports.store = JSON.parse(fs.readFileSync(STORE));
} catch (err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main && !msg.pathname.includes('-d-') && !req.satisfied.event && !exports.store.exclusions.some(exc => msg.pathname.startsWith(exc))) {
		var e = false;
		fs.stat(PUBLIC + msg.pathname, (err, stat) => {
			if (!err && stat.isDirectory()) {
				fs.readdir(PUBLIC + msg.pathname, (err, files) => {
					files = files.filter(file => !file.includes('-d-'));
					if (err) {
						req.satisfied.error = err;
						req.emit('err', err);
					} else if (files.includes('.nodir')) {
						fs.readFile(PUBLIC + msg.pathname + '.nodir', (err, data) => {
							if (err) {
								req.satisfied.error = err;
								req.emit('err', err);
								return;
							}
							let file = (data.toString() || 'ALL').split('\n');
							var temp = "\t<li value='&t'><a href='&t'>&t</a></li>\n";
							var list = [];
							files.filter(fil => !(file.includes(fil) || file.includes('ALL') || fil.startsWith('.no'))).forEach(file => {
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
								req.pass(res, msg);
							});
						});
					} else {
						var temp = "\t<li value='&t'><a href='&t'>&t</a></li>\n";
						var list = [];
						files.filter(file => !file.startsWith('.no')).forEach(file => {
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
							req.pass(res, msg);
						});
					}
				});
			} else if (err) {
				req.satisfied.error = err;
				req.emit('err', err);
			} else {
				req.pass(res, msg);
			}
		});
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};
