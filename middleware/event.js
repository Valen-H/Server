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

exports.after = ['security'];
exports.before = ['fix', 'command', 'socket', 'static', 'directory', 'end'];
exports.name = 'event';
exports.alive = true;

var store = exports.store = {
	page: BUILTIN + '/event.html'
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
	req.once('err', err => {
		req.event();
	}).on('evn', err => {
		req.event();
	});
	msg.event = req.event = function event() {
		var req = this.req || this,
		msg = this.msg || this,
		res = this.res;
		if (msg.satisfied.event && !msg.satisfied.main) {
			fs.readFile(store.page, (err, data) => {
				if (err) return console.error(err);
				res.end(data.toString()
				.replace(/&&code&&/gi, msg.satisfied.error.errno || msg.satisfied.error.code)
				.replace(/&&msg&&/gi, msg.satisfied.error.message)
				.replace(/&&type&&/gi, msg.satisfied.error.type || msg.satisfied.error.code || 'Event')
				.replace(/&&col&&/gi, msg.satisfied.error.color || 'red')
				.replace(/&&back&&/gi, msg.satisfied.error.back || 'false')
				.replace(/&&intr&&/gi, msg.satisfied.error.intr || parent.time)
				.replace(/&&times&&/gi, msg.satisfied.error.times)
				.replace(/&&ale&&/gi, msg.satisfied.error.alert)
				.replace(/&&redi&&/gi, msg.satisfied.error.redirect)
				);
				if (!msg.satisfied.main) msg.satisfied.main = 'event';
			});
		}
		return msg.satisfied;
	};
	msg.pass();
	return msg.satisfied;
};
