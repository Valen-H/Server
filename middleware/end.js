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

exports.before = [];
exports.after = ['fix', 'static', 'directory', 'command', 'socket', 'security'];
exports.name = 'end';
exports.alive = true;

var store = exports.store = {};

try {
	fs.ensureFileSync(STORE);
	store = exports.store = JSON.parse(fs.readFileSync(STORE));
} catch(err) {
	fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
		if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
	});
}

exports.middleware = function middleware(req, res, msg) {
	if (!msg.satisfied.main && !res.finished && !msg.satisfied.error) {
		res.end();
		msg.satisfied.main = 'end';
	}
	msg.pass();
	return msg.satisfied;
};
