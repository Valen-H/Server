# url-extra  
 ## An extension of the builtin `url` module.  
  
  ```javascript  
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
  ```  
  
> **By editing one of the properties of the Url object returned by url.parse, the whole object gets rebuilded!**