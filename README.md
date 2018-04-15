## Folders/Files  
  * **/** -> Contains the log file (Default : `log.log`), https certificates and other build utilities...  
  * **middlewares/** -> Contains all active middlewares plus a runtime-made **order.json** file that designates the middleware execution order and prevents middleware copying from `middleware/`, if empty (initially) the server will auto-copy the middlewares from the folder `middleware`.  
    * **/order.json** -> A runtime-made **order.json** file that designates the middleware execution order and prevents middleware copying from `middleware/`, if empty (initially) the server will auto-copy the middlewares from the folder `middleware`. It is an admin-informative file that does not affect execution.  
    * **midstore/** -> This is where middlewares keep their config data.  
  * **middleware/** -> Contains all builtin middlewares.  
  * **builtin/** -> Contains all builtin templates.  
  * **public/** -> Contains all server pages.  
  * **lib/** -> Contains all extra modules.  
  * **private/** -> Contains all server-hidden data such as `Accounts/` and logs.  
    * **/up.txt** -> Server startup Date.  
    * **/down.txt** -> Server close Date.  
    * **Accounts/** -> Account data.  
      * **Accounts/xx@yy/stats.json** -> Account info.  
    * **Admin/** -> Admin utils.  
  
## Environment  
  * **port** -> Server port. Defaults to `8080`.  
  * **home** -> Server main path. Defaults to `./`.  
  * **index** -> Statically served directories homepage. Defaults to `index`.  
  * **wares** -> Middlewares to be used, defaults to `Symbol('ALL')`.  
  * **auth** -> Admin user:pass key. Defaults to `admin:root`.  
  * **time** -> Default timeout for incomplete requests, redirections and other timing functions. Defaults to `6000`.  
  * **log** -> Log File. Defaults to `log.log`  
  
## Builtins (In Execution order)  
  * **security.js** -> POST DOS protection and other security stuff.  
  * **event.js** -> Request event controlling module. Handles the `msg.satisfied.event = {color,code,message,type,syscall,errno,back,intr,redirect,alert,times}` object. `request.emit('evn', err)`. Config :  
    * **page** -> Template page to serve event on (Default : `builtin/event.html`). `&&type&&` -> event type, `&&msg&&` -> event message, `&&col&&` -> event color, `&&code&&` -> event code, `&&list&&` -> directory contents, `&&back&&` -> boolean whether to redirect to previous page, `&&redi&&` -> redirection url, `&&ale&&` -> user alert, `&&intr&&` -> redirection interval, `&&times&&` -> number of pages to backtrack.  
  * **command.js** -> Contains commands which can be executed by respective url or console command, like :  
    * `https://localhost:port/close` -> Close server.  
    * `https://localhost:port/reload` -> Reload middlewares.  
    * `https://localhost:port/restart` -> Restart server (Sessions are cleared!).  
    * `https://localhost:port/admin` -> Admin panel.  
    * `https://localhost:port/eval?eval=code` -> Evaluate JavaScript.  
    * `https://localhost:port/ban?user=name` -> Ban account.  
    * POST : `https://localhost:port?register=user:pass` or `https://localhost:port?mode=register&user=username&pass=password`  
    * POST : `https://localhost:port?unregister=user:pass` or `https://localhost:port?mode=unregister&user=username&pass=password`  
    * POST : `https://localhost:port?login=user:pass` or `https://localhost:port?mode=login&user=username&pass=password`  
    * POST (cookie-job) : `https://localhost:port?logout`  
  this middleware controls a `private/Accounts` folder with registered server accounts to be controlled by requests in the above order and a `private/Admin` which contains the admin panel. It automatically generates a `middleware/command.json` file for further setting (as other modules), the following all default to `true` :  
    * **administration** -> Whether administration GET commands will be enabled (`close?auth=admin:pass, restart?auth=admin:pass, reload?auth=admin:pass, eval?auth=admin:pass, ban?auth=admin:pass&user=name`). `auth` parameter is optional for logged-in admin.  
    * **accounting** -> Whether the inner POST accounting system will be enabled (`register, unregister, login, logout`).  
    * **time** -> Redirection intervals (Defaults to 4000).  
    * **page** -> Administration panel location controlled by *socket.js*.  
  * **socket.js** -> Contains a realtime websocket module (`socket.io.js`) that offers administration capabilities to the admin and utilities to the user. This module in **co-operation** with *command.js* controls a page (`private/Admin/panel.html`) with administration utilities.  
    * **Namespaces>Channels** :  
      * **/main** :  
        * **main** -> Main channel.  
        * **admin** -> Admin beacon.  
      * **/admin** :  
        * **admin** -> Admin beacon.  
        * **logs** -> Logs beacon.  
    * **Commands** :  
      * **Client** :  
        * **admin** -> `socket.emit('close'), socket.emit('restart'), socket.emit('reload'), socket.send('"eval"')`.  
        * **main** -> `socket.emit('join', 'main'), socket.emit('join', 'admin')`  
      * **Server** :  
        * **admin** -> `socket.to('logs').send('logdata')`.  
        * **main** -> `socket.emit('joined', 'main'), socket.emit('left', 'admin')`  
  * **fix.js** -> Url autocorrection utility, e.g: suppose our server has a file called `file.htm` but the user requests for `FILE.html`, the server assumes and corrects the url as long as request content has not already been served. Modes (declared in `middlewares/fix.json`) :   
    * **extreme** -> Corrects filenames, direnames and upper/super-dirnames with assumptions.  
    * **extended** -> Corrects filenames, direnames with assumptions.  
    * **basic** -> Corrects filenames and direnames slightly  
  * **static.js** -> Similar to `d-static` but also translates `<& code &>` with its evaluated output unless a `.notmp` file is specified. Config (`middlewares/midstore/static.json`) :  
    * **templateDirs** -> Which directories/files to translate.  
    * **exclusions** -> Which files not to statically serve.  
  * ***d-static-deprecated.js*** -> Disabled by default (`d-`) due to `template-static` usage. Serves content under `/public` folder directly to the user. If user requests for a directory and that directory contains an index page (whose name is designated by `process.env.index` which defaults at `index` and applies for `.htm|.html|.js` filetypes), then that page is server instead of directory index list as long as that directory does not contain a `.noind` file and request content is not already served (same functionality applies for all `.no` files).  
    * **exclusions** -> Which files not to statically serve.  
  * **directory.js** -> Lists all files of a directory and prints on its template page as long as the directory does not contain a `.nodir` file and request content has not already been served.  
    * **exclusions** -> Which directories not to index.  
    * **page** -> Template page to serve indexing on (Default : `builtin/directory.html`). `&&dir&&` -> directory name, `&&list&&` -> directory contents.  
  * **end.js** -> It makes sure that all unfinished responses are terminated.  
  
> All middlewares whose names start with `d-` will have themselves excluded from the middleware list.  
  
## Command-Line  
> `a|b` -> a or b, `[a]b` -> b or ab  
  * **reload|rel|load** -> Forces middlewares to reload.  
  * **start|restart|res** -> Force whole-server restart.  
  * **exit|exi|ex** -> Close commandline.  
  * **stop|close|cls** -> Close server.  
  * **quit|qt** -> Close process.  
  * **clear|clean** -> Clear console.  
  * **# *command*** -> Executes local commands.  
  * **#** -> Toggles Shell.  
  * **e** -> Toggles REPL.  
  * **eval *expression*** -> Evaluate expression with `eval`.  
  * *command.js*  
    * **reg|regist|register user[@pass]** -> Register new user.  
    * **ban user** -> Ban user.  
    * **[user]list** -> List accounts.  
  * *socket.js*  
    * **adm[in]** -> Toggles Admin session.  
    * **adm[in] message** -> *Eval*s message to all clients connected to `admin` *room*.  
    * **adm[in] rel[oad]** -> Reloads all clients connected to `admin` *room*.  
    * **adm[in] kick** -> Kicks (to `about:blank`) all clients connected to `admin` *room*.  
  * **color** -> Toggle console colors.  
  * **cert** -> Create selfsigned SSL certificates on root.  
    
> `npm test` will install the `serve` shortcut binary.  
  
## Features  
  * Files/Folders with names containing `-d-` (plus its subfolders) are excluded from directory indexing and static serving.  
  * Files/Folders with names containing `-f-` (plus its subfolders) are excluded from the templating engine.  
  * Folders containing a `.nodir` file are excluded from directory indexing, if that file is not empty, only files listed inside are excluded.  
  * Folders containing a `.noind` file are excluded from index serving, if that file is not empty, only files listed inside are excluded from static + index serving.  
  * Folders containing a `.notmp` file are excluded from templating engine, if that file is not empty, only files listed inside are excluded.  
  * If any `.no` file contains the word `ALL` **on one line** then all contents of that directory are affected.  
  * All custom middlewares must follow the following pattern :  
    ```javascript
	const parent = module.parent.exports,
	fs = parent.fs,
	chalk = parent.chalk,
	PUBLIC = parent.home + '/public',
	PRIVATE = parent.home + '/private',
	BUILTIN = parent.home + '/builtin',
	HOME = parent.home,
	url = parent.url,
	STORE = url.parse(module.filename).directory + '/midstore/' + url.parse(module.filename).filename + '.json',
	rl = parent.rl;
	
	exports.name = 'middleware';
	exports.after = ['command'];
	exports.before = ['end'];
	exports.alive = true;
	
	var store = exports.store = {
		exclude: []
	};
	
	try {
		fs.ensureFileSync(STORE);
		store = exports.store = JSON.parse(fs.readFileSync(STORE));
	} catch(err) {
		fs.writeFile(STORE, JSON.stringify(exports.store || '{}'), err => {
			if (!err) console.info(chalk`{green ${module.filename} Initialized.}`);
		});
	}
	
	exports.middleware = function middleware(request, response, message) {
		if (error) {
			message.satisfied.error = error;
			request.emit('err', error); //event.js
			exports.remove(); //remove middleware from list
		} else {
			message.satisfied.main = true;
			response.write('');
			message.pass();
		}
		return message.satisfied;
	};
	
	exports.remove = function(bool = !exports.alive) {
		return exports.alive = !!bool;
	};
	```  
  * `message.satisfied` is a property (object) that holds several other properties used by middlewares to determine their operations. Like : `main` -> whether the response is being served, `event` -> whether an error or event occured (`event.js`).  
  
> ***All environmental variables can be placed inside `.npmrc` instead!***  