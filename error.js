const fs = module.parent.exports.fs;

module.exports = function error(req, res, msg) {
	if (req.satisfied.error && !req.satisfied.main) {
		fs.readFile(module.parent.exports.home + '/builtin/error.html', (err, data) => {
			if (err) return console.error(err);
			res.end(data.toString().replace(/&&code&&/gi, req.satisfied.error.code).replace(/&&msg&&/gi, req.satisfied.error.message));
			req.satisfied.main = 'error';
		});
	}
	return req.satisfied;
};
