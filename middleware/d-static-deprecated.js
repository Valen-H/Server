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

exports.after = ['command', 'fix', 'security', 'event', 'socket'];
exports.before = ['directory', 'end'];
exports.name = 'static';

var store = exports.store = {
	exclusions: []
};

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

fs.ensureFileSync('builtin/.noind');

exports.middleware = function middleware(req, res, msg) {
	if (!msg.satisfied.main && !msg.satisfied.error) {
		fs.stat(PUBLIC + msg.pathname, async (err, stat) => {
			if (!err && stat.isFile() && !msg.pathname.includes('-d-') && !msg.filename.startsWith('.no') && !store.exclusions.some(exc => msg.pathname.startsWith(exc)) && !(await readind(msg.pathname))) {
				fs.createReadStream(PUBLIC + msg.pathname).pipe(res);
				msg.satisfied.main = true;
			} else if (err || msg.pathname.includes('-d-') || msg.filename.startsWith('.no') || (await readind(msg.pathname)) || store.exclusions.some(exc => msg.pathname.startsWith(exc))) {
				err = err || new Error('No such file or directory.');
				err.code = err.code || 'ENOENT';
				msg.satisfied.error = err;
				req.emit('err', err);
			} else if (stat.isDirectory()) {
				fs.readdir(PUBLIC + msg.pathname, (err, files) => {
					var out = true;
					if (files.includes(parent.index + '.js')) {
						out = require(PUBLIC + msg.pathname + parent.index + '.js')(req, res, msg);
					}
					var tp;
					if (out && (files.includes(parent.index + (tp = '.html')) || files.includes(parent.index + (tp = '.htm'))) && !files.includes('.noind')) {
						fs.createReadStream(PUBLIC + msg.pathname + parent.index + tp).pipe(res);
						msg.satisfied.main = true;
						msg.pass();
					} else if (files.includes('.noind')) {
						fs.readFile(PUBLIC + msg.pathname + '.noind', (err, data) => {
							if (err) {
								msg.satisfied.error = err;
								req.emit('err', err);
								return;
							}
							let file = (data.toString() || 'ALL').split('\n');
							fs.stat(PUBLIC + msg.pathname + parent.index + tp, (err, stat) => {
								if (!err && stat.isFile() && !file.includes(PUBLIC + msg.pathname + parent.index + tp) && !file.includes('ALL')) {
									fs.createReadStream(PUBLIC + msg.pathname + parent.index + tp).pipe(res);
									msg.satisfied.main = true;
								}
								msg.pass();
							});
						});
					} else {
						msg.pass();
					}
				});
			} else {
				msg.pass();
			}
		});
	} else {
		msg.pass();
	}
	return msg.satisfied;
};

const readind = exports.readind = async function readind(file) {
	return new Promise((rsl, rjc) => {
		var dir = parent.path.normalize(PUBLIC + parent.path.dirname(parent.path.normalize(file)) + '/.noind');
		fs.readFile(dir, (err, data) => {
			if (err) {
				rsl(false);
			} else {
				rsl(data.toString().split('\n').includes('ALL') || data.toString().split('\n').includes(parent.path.basename(file)));
			}
		});
	});
};
