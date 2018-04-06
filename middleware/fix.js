const fs = module.parent.exports.fs,
url = module.parent.exports.url;

exports.after = [];
exports.before = ['static', 'directory', 'end'];
exports.name = 'fix';

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main) {
		fs.stat(module.parent.exports.home + '/public' + msg.pathname, (err, stat) => {
			if (!err && stat.isDirectory() && !msg.pathname.endsWith('/')) {
				msg.pathname += '/';
				res.writeHead(302, module.parent.exports.http.STATUS_CODES['302'], {
					'Location': msg.pathname
				});
				res.end('Redirecting...');
			} else if (!err) {
				req.pass(res, msg);
			} else {
				var v1 = msg.filename;
				v1 = v1[0].toUpperCase() + v1.slice(1);
				var v2 = msg.filename;
				v2 = v2[0].toLowerCase() + v2.slice(1);
				var fixes = [[v2, msg.extension].join('.'), [v1, msg.extension].join('.'), [msg.filename.toUpperCase(), msg.extension].join('.'), [msg.filename.toLowerCase(), msg.extension].join('.')];
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
