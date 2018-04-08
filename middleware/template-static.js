const fs = module.parent.exports.fs,
PUBLIC = module.parent.exports.home + '/public';

exports.after = ['command', 'fix'];
exports.before = ['directory', 'end'];
exports.name = 'static';

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main && !req.satisfied.error) {
		fs.stat(PUBLIC + msg.pathname, (err, stat) => {
			if (!err && stat.isFile() && !msg.pathname.includes('-d-') && !msg.filename.startsWith('.no')) {
				fs.readFile(PUBLIC + msg.pathname, (err, data) => {
					var mimes = exports.mimes = {
						bin: 'application/octet-stream',
						htm: 'text/html',
 					   html: 'text/html',
 					   php: 'text/html',
 					   xml: 'text/xml',
	   				 txt: 'text/plain',
	   				 log: 'text/plain',
   					 css: 'text/css',
 	 				  gif: 'image/gif',
   					 jpg: 'image/jpeg',
   					 jpeg: 'image/jpeg',
   					 mp3: 'audio/mpeg',
   					 mp4: 'video/mp4',
  					  png: 'image/png',
  					  bmp: 'image/bitmap',
   					 svg: 'image/svg+xml',
 	 				  js: 'application/javascript',
 	 				  json: 'application/json',
 	 				  ico: 'image/x-icon'
					};
					if (err) {
						req.satisfied.error = err;
						req.emit('err', err);
					} else {
						if ((mimes[msg.extension || 'html'] || 'text/plain').startsWith('text')) {
							res.end(data.toString().replace(/<&(.|\n)*?&>/gm, mt => {
								try {
									return eval("'use strict';\n" + mt.replace(/[<>&]/g, ''));
								} catch(err) {
									return err;
								}
							}), 'buffer');
						} else {
							fs.createReadStream(PUBLIC + msg.pathname).pipe(res);
						}
					}
					req.satisfied.main = true;
					req.pass(res, msg);
				});
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
						fs.readFile(PUBLIC + msg.pathname + module.parent.exports.index + tp, (err, data) => {
							if (err) {
								req.satisfied.error = err;
								req.emit('err', err);
							} else {
								res.end(data.toString().replace(/<&(.|\n)*?&>/gm, mt => {
									try {
										return eval("'use strict';\n" + mt.replace(/[<>&]/g, ''));
									} catch (err) {
										return err;
									}
								}));
							}
							req.satisfied.main = true;
							req.pass(res, msg);
						});
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
									fs.readFile(PUBLIC + msg.pathname + module.parent.exports.index + tp, (err, data) => {
										if (err) {
											req.satisfied.error = err;
											req.emit('err', err);
										} else {
											res.end(data.toString().replace(/<&(.|\n)*?&>/gm, mt => {
												try {
													return eval("'use strict';\n" + mt.replace(/[<>&]/g, ''));
												} catch (err) {
													return err;
												}
											}));
										}
										req.satisfied.main = true;
										req.pass(res, msg);
									});
								} else {
									req.pass(res, msg);
								}
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
