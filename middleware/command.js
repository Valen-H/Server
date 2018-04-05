exports.after = [];
exports.before = ['fix', 'directory', 'static', 'end'];
exports.name = 'command';

exports.middleware = function middleware(req, res, msg) {
	if (msg.query.auth == (process.env.admin || process.env.npm_config_admin)) {
		if (/^\/close$/i.test(msg.pathname)) {
			res.end('<h1>Server Closed.</h1>');
			req.satisfied.main = true;
			console.info(`Server closed at : ${new Date()}`);
			module.parent.exports.server.close();
		}
	}
	req.pass(res, msg);
	return req.satisfied;
};
