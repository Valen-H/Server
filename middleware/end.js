exports.before = [];
exports.after = ['fix', 'static', 'directory', 'command'];
exports.name = 'end';

exports.middleware = function middleware(req, res, msg) {
	if (!req.satisfied.main && !res.finished && !req.satisfied.error) {
		res.end();
		req.satisfied.main = true;
	}
	req.pass(res, msg);
	return req.satisfied;
};
