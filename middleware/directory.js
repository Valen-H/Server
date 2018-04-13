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

exports.after = ['fix', 'static', 'command', 'security', 'event', 'socket'];
exports.before = ['end'];
exports.name = 'directory';
exports.alive = true;

fs.ensureFileSync('builtin/.nodir');

var store = exports.store = {
	exclusions: ['SRC', 'Resources'],
	page: BUILTIN + '/directory.html'
};

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

exports.middleware = function middleware(req, res, msg) {
	if (!msg.satisfied.main && !msg.pathname.includes('-d-') && !msg.satisfied.event && !store.exclusions.some(exc => msg.pathname.startsWith(exc))) {
		var e = false;
		fs.stat(PUBLIC + msg.pathname, (err, stat) => {
			if (!err && stat.isDirectory()) {
				fs.readdir(PUBLIC + msg.pathname, (err, files) => {
					files = files.filter(file => !file.includes('-d-'));
					if (err) {
						msg.satisfied.error = err;
						req.emit('err', err);
					} else if (files.includes('.nodir')) {
						fs.readFile(PUBLIC + msg.pathname + '.nodir', (err, data) => {
							if (err) {
								msg.satisfied.error = err;
								req.emit('err', err);
								return;
							}
							let file = (data.toString() || 'ALL').split('\n');
							var temp = "\t<li value='&t'><a href='&t'>&t</a></li>\n";
							var list = [];
							files.filter(fil => !(file.includes(fil) || file.includes('ALL') || fil.startsWith('.no'))).forEach(file => {
								list.push(temp.replace(/&t/gi, file));
							});
							fs.readFile(store.page, (err, data) => {
								if (err) {
									msg.satisfied.error = err;
									req.emit('err', err);
									return;
								}
								msg.satisfied.main = true;
								res.end(data.toString().replace(/&&list&&/gi, list.join('')).replace(/&&dir&&/gi, msg.pathname));
								msg.pass();
							});
						});
					} else {
						var temp = "\t<li value='&t'><a href='&t'>&t</a></li>\n";
						var list = [];
						files.filter(file => !file.startsWith('.no')).forEach(file => {
							list.push(temp.replace(/&t/gi, file));
						});
						fs.readFile(store.page, (err, data) => {
							if (err) {
								msg.satisfied.error = err;
								req.emit('err', err);
								return;
							}
							msg.satisfied.main = true;
							res.end(data.toString().replace(/&&list&&/gi, list.join('')).replace(/&&dir&&/gi, msg.pathname));
							msg.pass();
						});
					}
				});
			} else if (err) {
				msg.satisfied.error = err;
				req.emit('err', err);
			} else {
				msg.pass();
			}
		});
	} else {
		msg.pass();
	}
	return msg.satisfied;
};
