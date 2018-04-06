const fs = module.parent.exports.fs;

module.exports = function event(req, res, msg) {
	if (req.satisfied.error && !req.satisfied.main) {
		fs.readFile(module.parent.exports.home + '/builtin/event.html', (err, data) => {
			if (err) return console.error(err);
			res.end(data.toString()
			.replace(/&&code&&/gi, req.satisfied.error.code)
			.replace(/&&msg&&/gi, req.satisfied.error.message)
			.replace(/&&type&&/gi, req.satisfied.error.type || 'Event')
			.replace(/&&col&&/gi, req.satisfied.error.color || 'red')
			.replace(/&&back&&/gi, req.satisfied.error.back || 'false')
			.replace(/&&intr&&/gi, req.satisfied.error.intr || 4000)
			.replace(/&&times&&/gi, req.satisfied.error.times)
			.replace(/&&ale&&/gi, req.satisfied.error.alert)
			.replace(/&&redi&&/gi, req.satisfied.error.redirect)
			);
			if (!req.satisfied.main) req.satisfied.main = 'event';
		});
	}
	return req.satisfied;
};
