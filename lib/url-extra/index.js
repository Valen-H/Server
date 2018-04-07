const url = require('url'),
querystring = require('querystring'),
path = require('path');

function assign() {
  const args = [].slice.call(arguments).filter(i => i);
  const dest = args.shift();
  args.forEach(src => {
    Object.keys(src).forEach(key => {
      dest[key] = src[key];
    });
  });
  return dest;
} //assign
assign(exports, url);

exports.parse = function(urlString, parseQueryString = true, slashesDenoteHost) {
	var ur = url.parse(urlString, parseQueryString = true, slashesDenoteHost);
	ur.querystring = querystring.stringify(ur.query);
	ur.queryobject = querystring.parse(ur.querystring);
	ur.pathobject = path.parse(path.normalize(ur.pathname));
	ur.file = path.basename(ur.pathname) || ur.pathobject.base;
	ur.filename = ur.pathobject.name || ur.file;
	ur.extension = path.extname(ur.pathname).replace(/^\./, '') || ur.pathobject.ext;
	ur.directory = path.dirname(ur.pathname) || ur.pathobject.root;
	return ur;
};

exports.Url = function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.querystring = null;
  this.queryobject = null;
  this.pathname = null;
  this.path = null;
  this.pathobject = null;
  this.href = null;
  this.file = null;
  this.filename = null;
  this.extension = null;
  this.directory = null;
};

/*exports.URL = class URL {
  constructor(input, base) {
    // toUSVString is not needed.
    input = `${input}`;
    if (base !== undefined &&
        (!base[searchParams] || !base[searchParams][searchParams])) {
      base = new URL(base);
    }
    parse(this, input, base);
  }

  get [special]() {
    return (this[context].flags & URL_FLAGS_SPECIAL) !== 0;
  }

  get [cannotBeBase]() {
    return (this[context].flags & URL_FLAGS_CANNOT_BE_BASE) !== 0;
  }

  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
  get [cannotHaveUsernamePasswordPort]() {
    const { host, scheme } = this[context];
    return ((host == null || host === '') ||
            this[cannotBeBase] ||
            scheme === 'file:');
  }

  [util.inspect.custom](depth, opts) {
    if (this == null ||
        Object.getPrototypeOf(this[context]) !== URLContext.prototype) {
      throw new errors.TypeError('ERR_INVALID_THIS', 'URL');
    }

    if (typeof depth === 'number' && depth < 0)
      return opts.stylize('[Object]', 'special');

    var ctor = getConstructorOf(this);

    var obj = Object.create({
      constructor: ctor === null ? URL : ctor
    });

    obj.href = this.href;
    obj.origin = this.origin;
    obj.protocol = this.protocol;
    obj.username = this.username;
    obj.password = this.password;
    obj.host = this.host;
    obj.hostname = this.hostname;
    obj.port = this.port;
    obj.pathname = this.pathname;
    obj.search = this.search;
    obj.searchParams = this.searchParams;
    obj.hash = this.hash;
    obj.file = this.file;
    obj.filename = this.filename;
    obj.extension = this.extension;

    if (opts.showHidden) {
      obj.cannotBeBase = this[cannotBeBase];
      obj.special = this[special];
      obj[context] = this[context];
    }

    return util.inspect(obj, opts);
  }
}*/
