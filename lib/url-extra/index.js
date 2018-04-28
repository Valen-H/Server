'use extra';

const url = require('url'),
querystring = require('querystring'),
path = require('path'),
util = require('util');

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

const proxx = {
	set(target, property, value, receiver) {
		switch (property) {
			case 'slashes':
				target.slashes = !!value;
				value = receiver.href;
			case 'href':
				Object.assign(target, exports.parse(value));
				break;
			case 'protocolfull':
				value = value ? value.replace(/:\/{1,2}$/, '') : null;
			case 'protocolraw':
				value = value ? value + ':' : null;
			case 'protocol':
				Object.assign(target, exports.parse((value ? value : '') + (receiver.slashes ? '//' : '') + (receiver.auth ? receiver.auth + '@' : '') + (receiver.host ? receiver.host : '') + (receiver.path ? receiver.path : '') + (receiver.hash ? receiver.hash : '')));
				break;
			case 'auth':
				Object.assign(target, exports.parse((receiver.protocol ? receiver.protocol : '') + (receiver.slashes ? '//' : '') + (value ? value + '@' : '') + (receiver.host ? receiver.host : '') + (receiver.path ? receiver.path : '') + (receiver.hash ? receiver.hash : '')));
				break;
			case 'port':
				target.port = value * 1;
				value = receiver.hostname;
			case 'hostname':
				value = value ? value + (receiver.port ? ':' + receiver.port : '') : null;
			case 'host':
				Object.assign(target, exports.parse((receiver.protocol ? receiver.protocol : '') + (receiver.slashes ? '//' : '') + (receiver.auth ? receiver.auth + '@' : '') + (value ? value : '') + (receiver.path ? receiver.path : '') + (receiver.hash ? receiver.hash : '')));
				break;
			case 'querystringraw':
			case 'querystring':
				value = value ? '?' + value : null;
			case 'searchraw':
			case 'search':
				target.search = value ? value : null;
				value = receiver.pathname;
			case 'pathname':
				value = value ? value + receiver.search : null;
			case 'path':
				Object.assign(target, exports.parse((receiver.protocol ? receiver.protocol : '') + (receiver.slashes ? '//' : '') + (receiver.auth ? receiver.auth + '@' : '') + (receiver.host ? receiver.host : '') + (value ? value : '') + (receiver.hash ? receiver.hash : '')));
				break;
			case 'hashraw':
				value = value ? '#' + value : null;
			case 'hash':
				Object.assign(target, exports.parse((receiver.protocol ? receiver.protocol : '') + (receiver.slashes ? '//' : '') + (receiver.auth ? receiver.auth + '@' : '') + (receiver.host ? receiver.host : '') + (receiver.path ? receiver.path : '') + (value ? value : '')));
				break;
			case 'extensionraw':
				value = value ? value.replace(/^\./, '') : null;
			case 'extension':
				target.extension = value ? value : null;
				value = receiver.filename;
			case 'filename':
				value = value ? value + '.' + receiver.extension : null;
			case 'fileraw':
				value = value ? '/' + value : null;
			case 'file':
				value = receiver.pathname.replace(new RegExp(receiver.file.replace(/\\/g, '\\\\') + '$', ''), value ? value : '');
				value = value ? value + receiver.search : null;
				Object.assign(target, exports.parse((receiver.protocol ? receiver.protocol : '') + (receiver.slashes ? '//' : '') + (receiver.auth ? receiver.auth + '@' : '') + (receiver.host ? receiver.host : '') + (value ? value : '') + (receiver.hash ? receiver.hash : '')));
				break;
			case 'directory':
				value = receiver.pathname.replace(new RegExp('^' + receiver.directory.replace(/\\/g, '\\\\'), ''), value ? value : '');
				value = value ? value + receiver.search : null;
				Object.assign(target, exports.parse((receiver.protocol ? receiver.protocol : '') + (receiver.slashes ? '//' : '') + (receiver.auth ? receiver.auth + '@' : '') + (receiver.host ? receiver.host : '') + (value ? value : '') + (receiver.hash ? receiver.hash : '')));
				break;
			default:
				target[property] = value;
		}
	}
};

exports.parse = function urlParse(urlString, slashesDenoteHost) {
	var ur = url.parse(urlString, false, slashesDenoteHost);
	ur.protocolraw = (ur.protocol || ':').replace(/:$/, '');
	ur.protocolfull = ur.protocol ? ur.protocol + '//' : null;
	ur.hashraw = (ur.hash || '#').replace(/^#/, '');
	ur.autharray = (ur.auth || ':').split(':');
	ur.query = (ur.search || '?').replace(/^\?/, '');
	ur.querystringraw = ur.query;
	ur.querystring = querystring.unescape(ur.querystringraw);
	ur.queryraw = querystring.parse(ur.querystringraw, null, null, { decodeURIComponent: str => str, maxKeys: 0 });
	ur.query = querystring.parse(ur.querystring);
	ur.searchraw = querystring.unescape(ur.search || '?');
	ur.pathobject = path.parse(path.normalize(ur.pathname = ur.pathname || '/'));
	ur.file = '/' + (path.basename(ur.pathname) || ur.pathobject.base);
	ur.fileraw = path.basename(ur.pathname) || ur.pathobject.base;
	ur.filename = ur.pathobject.name || ur.fileraw;
	ur.extension = (path.extname(ur.pathname) || ur.pathobject.ext).replace(/^\./, '');
	ur.extensionfull = ur.pathobject.ext;
	ur.directory = path.dirname(ur.pathname) || ur.pathobject.root;
	return new Proxy(ur, proxx);
};

const Url = exports.Url = function Url() {
	this.protocol = null; //i
	this.protocolraw = null; //
	this.protocolfull = null; //
	this.slashes = null; //i
	this.auth = null; //i
	this.autharray = null;
	this.host = null; //i
	this.port = null; //i
	this.hostname = null; //i
	this.hash = null; //i
	this.search = null; //i
	this.searchraw = null;
	this.query = null;
	this.querystring = null; //
	this.queryobject = null;
	this.href = null; //i
	this.pathname = null; //i
	this.path = null; //i
	this.pathobject = null;
	this.file = null; //
	this.fileraw = null; //
	this.filename = null; //
	this.directory = null; //
	this.extension = null; //
	this.extensionfull = null; //
};

/*
┌─────────────────────────────────────────────────────────────────────────────┐
│                                    href                                     │
├──────────┬┬───────────┬─────────────────┬───────────────────────────┬───────┤
│ protocol ││   auth    │      host       │           path            │ hash  │
│          ││           ├──────────┬──────┼──────────┬────────────────┤       │
│          ││           │ hostname │ port │ pathname │     search     │       │
│          ││           │          │      │          ├─┬──────────────┤       │
│          ││           │          │      │          │ │    query     │       │
"  http:   // user:pass @ host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          ││           │          │      │          │ │              │       │
└──────────┴┴───────────┴──────────┴──────┴──────────┴─┴──────────────┴───────┘
  Url {
  protocol: 'http:',
  slashes: true,
  auth: 'user:pass',
  host: 'host.com:8080',
  port: '8080',
  hostname: 'host.com',
  hash: '#hash',
  search: '?query=string%21',
  query: { query: 'string!' },
  pathname: '/p/a/t/h/file.txt',
  path: '/p/a/t/h/file.txt?query=string%21',
  href: 'http://user:pass@host.com:8080/p/a/t/h/file.txt?query=string%21#hash',
  protocolraw: 'http',
  protocolfull: 'http://',
  hashraw: 'hash',
  autharray: [ 'user', 'pass' ],
  querystringraw: 'query=string%21',
  querystring: 'query=string!',
  queryraw: { query: 'string%21' },
  searchraw: '?query=string!',
  pathobject: 
   { root: '/',
     dir: '/p/a/t/h',
     base: 'file.txt',
     ext: '.txt',
     name: 'file' },
  file: '/file.txt',
  fileraw: 'file.txt',
  filename: 'file',
  extension: 'txt',
  extensionfull: '.txt',
  directory: '/p/a/t/h' }
*/
