/*
	strength:
		extreme : correct superpath
		extended : assume extension 'n' stuff...
		basic : autocorrect small common mistypes
*/
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

exports.after = ['command', 'security', 'event', 'socket'];
exports.before = ['static', 'directory', 'end'];
exports.name = 'fix';
exports.alive = true;

var store = exports.store = {
	strength: 'extreme' || 'extended' || 'basic'
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
	if (!msg.satisfied.main) {
		fs.stat(parent.home + '/public' + msg.pathname, async (err, stat) => {
			if (!err && stat.isDirectory() && !msg.pathname.endsWith('/')) {
				msg.pathname += '/';
				res.writeHead(302, parent.htt.STATUS_CODES['302'], {
					'Location': msg.pathname
				});
				res.end('Redirecting...');
			} else if (!err) {
				msg.pass();
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
					nar.push('-t-' + fix);
					nar.push('-d-t-' + fix);
					nar.push('-f-t-' + fix);
					nar.push('-t-f-' + fix);
					nar.push('-t-d-' + fix);
					nar.push('-d-f-' + fix);
					nar.push('-f-d-' + fix);
					nar.push('-t-f-d-' + fix);
					nar.push('-t-d-f-' + fix);
					nar.push('-f-t-d-' + fix);
					nar.push('-f-d-t-' + fix);
					nar.push('-d-f-t-' + fix);
					nar.push('-d-t-f-' + fix);
				});
				fixes = nar.flt();
				if (store.strength === 'extended' || store.strength === 'extreme') {
					try {
						var files = await dir(PUBLIC + msg.directory);
						files.filter(file =>
						msg.fileraw.includes(file) ||
						msg.fileraw.toUpperCase().includes(file.toUpperCase()) ||
						file.includes(msg.filename) ||
						file.toUpperCase().includes(msg.filename.toUpperCase())
						).forEach(i => fixes.push(i));
					} catch(err) { }
				}
				var counter = 0;
				tick();
				function tick() {
					if (counter >= fixes.length) return msg.pass();
					fs.stat(parent.home + '/public' + msg.pathname.replace(msg.fileraw, fixes[counter]), (err, stat) => {
						if (err) return tick(++counter);
						var temp = msg.pathname.replace(msg.fileraw, fixes[counter++]);
						msg = Object.assign(msg, url.parse(req.url = req.url.replace(msg.pathname, temp), true));
						if (!err && stat.isDirectory() && !msg.pathname.endsWith('/')) {
							msg.pathname += '/';
							res.writeHead(302, parent.htt.STATUS_CODES['302'], {
								'Location': msg.pathname
							});
							res.end('Redirecting...');
						} else {
							msg.pass();
						}
					});
				} //tick
			}
		});
	} else {
		msg.pass();
	}
	return msg.satisfied;
};

const dir = exports.dir = async function dir(dr) {
	return new Promise((rsl, rjc) => {
		fs.readdir(dr, (err, files) => {
			if (err) rjc(err);
			rsl(files);
		});
	});
};

//TODO : SCAN SUPERPATH TOO
