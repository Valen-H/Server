/*
	strength:
		extreme : correct superpath
		extended : assume extension 'n' stuff...
		basic : autocorrect small common mistypes
*/

const fs = module.parent.exports.fs,
chalk = module.parent.exports.chalk,
parent = module.parent.exports,
url = module.parent.exports.url;
const STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json';

exports.after = ['command', 'security'];
exports.before = ['static', 'directory', 'end'];
exports.name = 'fix';

exports.fix = {
	strength: 'extreme' || 'extended' || 'basic'
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
	if (!req.satisfied.main) {
		fs.stat(module.parent.exports.home + '/public' + msg.pathname, async (err, stat) => {
			if (!err && stat.isDirectory() && !msg.pathname.endsWith('/')) {
				msg.pathname += '/';
				res.writeHead(302, module.parent.exports.http.STATUS_CODES['302'], {
					'Location': msg.pathname
				});
				res.end('Redirecting...');
			} else if (!err) {
				req.pass(res, msg);
			} else {
				var v1 = msg.filename, fixes;
				v1 = v1[0].toUpperCase() + v1.slice(1);
				var v2 = msg.filename;
				v2 = v2[0].toLowerCase() + v2.slice(1);
				if (msg.extension) {
					fixes = [[v2, msg.extension].join('.'), [v1, msg.extension].join('.'), [msg.filename.toUpperCase(), msg.extension].join('.'), [msg.filename.toLowerCase(), msg.extension].join('.')];
				} else {
					fixes = [v2, v1, msg.filename.toUpperCase(), msg.filename.toLowerCase()];
				}
				if (/^html?$/i.test(msg.extension)) {
					var nfx = [];
					fixes.forEach(fix => {
						nfx.push(fix);
						nfx.push(fix.replace(/\.[^.]+?$/, '.html'));
						nfx.push(fix.replace(/\.[^.]+?$/, '.htm'));
					});
					fixes = nfx;
				}
				fixes = fixes.flt();
				var nar = fixes;
				fixes.forEach(fix => {
					nar.push('-d-' + fix);
					nar.push('-f-' + fix);
					nar.push('-d-f-' + fix);
					nar.push('-f-d-' + fix);
				});
				fixes = nar.flt();
				if (exports.fix.strength === 'extended' || exports.fix.strength === 'extreme') {
					try {
						var files = await dir(module.parent.exports.home + '/public' + msg.directory);
						files.filter(file =>
						msg.file.includes(file) ||
						msg.file.toUpperCase().includes(file.toUpperCase()) ||
						file.includes(msg.filename) ||
						file.toUpperCase().includes(msg.filename.toUpperCase())
						).forEach(i => fixes.push(i));
					} catch(err) {}
				}
				var counter = 0;
				tick();
				function tick() {
					if (counter >= fixes.length) return req.pass(res, msg);
					fs.stat(module.parent.exports.home + '/public' + msg.pathname.replace(msg.file, fixes[counter]), (err, stat) => {
						if (err) return tick(++counter);
						var temp = msg.pathname.replace(msg.file, fixes[counter++]);
						msg = url.parse(req.url = req.url.replace(msg.pathname, temp), true);
						if (!err && stat.isDirectory() && !msg.pathname.endsWith('/')) {
							msg.pathname += '/';
							res.writeHead(302, module.parent.exports.http.STATUS_CODES['302'], {
								'Location': msg.pathname
							});
							res.end('Redirecting...');
						} else {
							req.pass(res, msg);
						}
					});
				} //tick
			}
		});
	} else {
		req.pass(res, msg);
	}
	return req.satisfied;
};

var dir = async function dir(dr) {
	return new Promise((rsl, rjc) => {
		fs.readdir(dr, (err, files) => {
			if (err) rjc(err);
			rsl(files);
		});
	});
};

//TODO : SCAN SUPERPATH TOO
