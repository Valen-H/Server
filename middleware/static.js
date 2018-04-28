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

exports.after = ['command', 'fix', 'security'];
exports.before = ['directory', 'end'];
exports.name = 'static';
exports.alive = true;

var store = exports.store = {
	templateDirs: ['/'],
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

fs.ensureFileSync('builtin/.notmp');
fs.ensureFileSync('builtin/.noind');

exports.middleware = function middleware(req, res, msg) {
	if (!msg.satisfied.main && !msg.satisfied.error) {
		fs.stat(PUBLIC + msg.pathname, async (err, stat) => {
			if (!err && stat.isFile() && !msg.pathname.includes('-d-') && !msg.filename.startsWith('.no') && !store.exclusions.some(exc => msg.pathname.startsWith(exc)) && !(await readind(msg.pathname))) {
				fs.readFile(PUBLIC + msg.pathname, async (err, data) => {
					/*
						is file
						File exists
						does not start with .no
						does not include -d-
						does not belong to exclusions
						does not belong to .noind
					*/
					
					const mimes = exports.mimes = {
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
					}; //obsolete?
					if (err) {
						req.emit('err', err);
					} else {
						if ((await readdir(PUBLIC + msg.directory)).includes(msg.filename + '.js')) {
							delete require.cache[require.resolve(PUBLIC + msg.directory + '/' + msg.filename + '.js')];
							if (msg.extension != 'js' && !await require(PUBLIC + msg.directory + '/' + msg.filename + '.js')(msg)) {
								let err = new Error('No such file or directory.');
								err.code = 'ENOENT';
								req.emit('err', err);
								return;
							}
						}
						//Execute js file on same dir with same name
						
						if ((mimes[msg.extension || 'html'] || 'text/plain').startsWith('text') && store.templateDirs.some(exc => msg.pathname.startsWith(exc))) {
							var trns = readtmp(PUBLIC + msg.directory, msg.fileraw);
							res.end(sendtmp(data, trns, req, res, msg), 'buffer');
						} else {
							fs.createReadStream(PUBLIC + msg.pathname).pipe(res);
						}
						//if not text file, pass raw
						
					}
					msg.satisfied.main = true;
					msg.pass();
				});
			} else if (err || msg.pathname.includes('-d-') || msg.filename.startsWith('.no') || (await readind(msg.pathname)) || store.exclusions.some(exc => msg.pathname.startsWith(exc))) {
				/*
					File/Folder does not exist or
					starts with .no or
					includes -d- or
					belongs to exclusions or
					is in .noind
				*/
				
				err = err || new Error('No such file or directory.');
				err.code = err.code || 'ENOENT';
				req.emit('err', err);
			} else if (stat.isDirectory()) {
				//is folder
				fs.readdir(PUBLIC + msg.pathname, async (err, files) => {
					var out = true;
					if (files.includes(parent.index + '.js')) {
						delete require.cache[require.resolve(PUBLIC + msg.directory + parent.index + '.js')];
						out = await require(PUBLIC + msg.directory + parent.index + '.js')(msg);
					}
					//Execute index js of dir
					
					if (msg.extension != 'js' && files.includes(msg.filename + '.js')) {
						delete require.cache[require.resolve(PUBLIC + msg.directory + '/' + msg.filename + '.js')];
						out = await require(PUBLIC + msg.directory + '/' + msg.filename + '.js')(msg);
					}
					//Execute js file on same dir with same name
					
					var tp;
					if (out && (files.includes(parent.index + (tp = '.html')) || files.includes(parent.index + (tp = '.htm'))) && !files.includes('.noind')) {
						//if contains index, out and not contain .noind
						fs.readFile(PUBLIC + msg.pathname + parent.index + tp, async (err, data) => {
							if (err) {
								req.emit('err', err);
								//if no index - contradict
							} else if (store.templateDirs.some(exc => msg.pathname.startsWith(exc))) {
								var trns = readtmp(PUBLIC + msg.directory, msg.fileraw);
								res.end(sendtmp(data, trns, req, res, msg), 'buffer');
								//if in templateDirs
							} else {
								fs.createReadStream(PUBLIC + msg.pathname + parent.index + tp).pipe(res);
								//raw
							}
							msg.satisfied.main = true;
							msg.pass();
						});
					} else if (out && files.includes('.noind')) {
						//if .noind and out
						fs.readFile(PUBLIC + msg.pathname + '.noind', (err, data) => {
							if (err) {
								//no .noind - contradict
								req.emit('err', err);
								return;
							}
							let file = (data.toString() || 'ALL').split('\n');
							fs.stat(PUBLIC + msg.pathname + parent.index + tp, (err, stat) => {
								if (!err && stat.isFile() && !file.includes(PUBLIC + msg.pathname + parent.index + tp) && !file.includes('ALL')) {
									fs.readFile(PUBLIC + msg.pathname + parent.index + tp, (err, data) => {
										if (err) {
											req.emit('err', err);
											//if no index
										} else if (store.templateDirs.some(exc => msg.pathname.startsWith(exc))) {
											var trns = readtmp(PUBLIC + msg.directory, msg.fileraw);
											res.end(sendtmp(data, trns, req, res, msg), 'buffer');
											//if in templateDirs
										} else {
											fs.createReadStream(PUBLIC + msg.pathname + parent.index + tp).pipe(res);
											//raw
										}
										msg.satisfied.main = true;
										msg.pass();
									});
								} else {
									//if is dir
									msg.pass();
								}
							});
						});
					} else {
						//if not contains index and .noind), or false out
						msg.pass();
					}
				});
			} else {
				//contradict
				msg.pass();
			}
		});
	} else {
		//served
		msg.pass();
	}
	return msg.satisfied;
};

const readtmp = exports.readtmp = async function readtmp(dir, file) {
	return new Promise((rsl, rjc) => {
		fs.readdir(dir, (err, files) => {
			if (err) rjc(err);
			if (files.includes('.notmp')) {
				fs.readFile(dir + '/.notmp', (err, data) => {
					if (err) rjc(err);
					rsl(!(data.toString().split('\n').includes('ALL') || data.toString().split('\n').includes(file) || !data.toString()));
				});
			} else {
				rsl(true);
			}
		});
	});
},
readind = exports.readind = async function readind(file) {
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
},
sendtmp = exports.sendtmp = function sendtmp(data, trns = true, req, res, msg) {
	return data.toString().replace(/<&(.|\n)*?&>/gm, mt => {
		try {
			return trns ? eval("'use strict';\n" + mt.replace(/(^<&|&>$)/g, '')) : mt;
		} catch(err) {
			return err;
		}
	});
},
readdir = exports.readdir = async function readdir(dir) {
	return new Promise((rsl, rjc) => {
		fs.readdir(dir, (err, files) => {
			if (err) rjc(err);
			rsl(files);
		});
	});
};
