## Folders/Files  
  * **middlewares/** -> Contains all active middlewares plus a runtime-made `order.json` file that designates the middleware execution order and prevents middleware copying from `middleware/`, if empty (initially) the server will auto-copy the middlewares from the folder `middleware`.  
  * **middleware/** -> Contains all builtin middlewares.  
  * **builtin/** -> contains all builtin html templates.  
  * **public/** -> Contains all server pages.  
  * **private/** -> Contains all server-hidden data such as `Accounts/` and logs.  
  * **lib/** -> Contains all modules.  
  * **private/up.txt** -> Server startup Date.  
  * **private/Accounts/aa@bb/stat.json** -> Account data.  
  
## Environment  
  * **port** -> Server port. Defaults to `8080`.  
  * **home** -> Server main path. Defaults to `./`.  
  * **index** -> Statically served directories homepage. Defaults to `index`.  
  * **wares** -> Middlewares to be used, defaults to `Symbol('ALL')`.  
  * **auth** -> Admin user:pass key. Defaults to `admin:root`.  
  * **time** -> Default timeout for incomplete requests, redirections and other timing functions. Defaults to `7000`.    
  
## Builtins  
  * **command.js** -> Contains commands which can be executed by respective url or console command, like :  
    * `http://localhost:8080/close?auth=admin:root`  
    * `http://localhost:8080/reload?auth=admin:root`  
    * `http://localhost:8080/restart?auth=admin:root`  
    * `http://localhost:port/?login=admin:root&from=reg`  
  this middleware controls a `private/Accounts` folder with registered server accounts to be controlled by ***POST*** `register=account:password, unregister=account:password, login=account:password, logout=true (affects currently loged-in account)` or `mode=register|login|logout|unregister, user=user, pass=password` requests in that order. It automatically generates a `middleware/command.json` file for further setting (as other modules), the following all default to `true` :  
    * **administration** -> Whether administration GET commands will be enabled (`close?auth=admin:pass, restart?auth=admin:pass, reload?auth=admin:pass, eval?auth=admin:pass, ban?auth=admin:pass&user=name`). `auth` parameter is optional for logged-in admin.  
    * **accounting** -> Whether the inner POST accounting system will be enabled (`register, unregister, login, logout`).  
  * **fix.js** -> Url autocorrection utility, e.g: suppose our server has a file called `file.htm` but the user requests for `FILE.html`, the server assumes and corrects the url as long as request content has not already been served. Modes (declared in `middlewares/fix.json`) :   
    * **extreme** -> Corrects filenames, direnames and upper/super-dirnames with assumptions.  
    * **extended** -> Corrects filenames, direnames with assumptions.  
    * **basic** -> Corrects filenames and direnames slightly  
  * **template-static** -> Similar to `static` but also translates `<& code &>` with its evaluated output.  
  * **d-static.js** -> Disabled by default (`d-`) due to `template-static` usage. Serves content under `/public` folder directly to the user. If user requests for a directory and that directory contains an index page (whose name is designated by `process.env.index` which defaults at `index` and applies for `.htm|.html|.js` filetypes), then that page is server instead of directory index list as long as that directory does not contain a `.noind` file and request content is not already served.  
  * **directory.js** -> Lists all files of a directory and prints on the `builtin/directory.html` page (by replacing `&&list&&` with the list and `&&dir&&` in the template with the directory path) as long as the directory does not contain a `.nodir` file and request content has not already been served.  
  * **end.js** -> It makes sure that all unfinished responses are terminated.  
  
> All middlewares whose names start with `d-` will have themselves excluded from the middleware list.  
  
## Command-Line  
  * **reload|rel|load** -> Forces middlewares to reload.  
  * **start|restart|res** -> Force whole-server restart.  
  * **exit|exi|ex** -> Close commandline.  
  * **stop|close|cls** -> Close server.  
  * **quit|qt** -> Close process.  
  * **clear|clean** -> Clear console.  
  * **# *command*** -> Executes local commands.  
  * **#** -> Toggles Shell.  
  * **eval *expression*** -> Evaluate expression with `eval`.  
  * ***command.js***  
    * **reg|regist|register user[@pass]** -> Register new user.  
    * **ban user** -> Ban user.  
    * **[user]list** -> List accounts.  
  
> `npm test` will install the `serve` shortcut binary and commence `npm start`.  
  
## Features  
  * Files/Folders with names containing `-d-` (plus its subfolders) are excluded from directory indexing and static serving.  
  * Files/Folders with names containing `-f-` (plus its subfolders) are excluded from the templating engine.  
  * Folders containing a `.nodir` file are excluded from directory indexing, if that file is not empty, only files listed inside are excluded.  
  * Folders containing a `.noind` file are excluded from static serving, if that file is not empty, only files listed inside are excluded.  
  * Folders containing a `.notmp` file are excluded from templating engine, if that file is not empty, only files listed inside are excluded.  
  * If any `.no` file contains the word `ALL` on one line then all contents of that directory are affected.  
  * All custom middlewares must have the following content :  
    ```javascript
    exports.name = 'middleware';
    exports.after = ['command'];
    exports.before = ['end'];
    exports.middleware = function middleware(request, response, message) {
    	if (error) {
    		request.satisfied.error = error;
    		request.emit('err', error);
    	} else {
    		request.satisfied.main = true;
    		response.write('');
    		request.pass(response, message);
    	}
    	return message.satisfied;
    };
    ```  
  * `request.satisfied` is a property (object) that holds several other properties used by middlewares to determine their operations. Like : `main` -> whether the response is being served, `event` -> whether an error or event occured.  
  
> In case of a fatal error, the `event.js` middleware, which is the only middleware outside of the respective folder, responds with the template `builtin/event.html` by replacing `&&code&&` with the error code, `&&msg&&` with the error message, `&&col&&` with the errorcode color, `&&back&&` with a boolean determining whether the browser should go back in history (previous page or `&&times&&` steps back), `&&ale&&` with a custom alert to the user, &&intr&& with redirection/action interval and `&&redi&&` with a redirect url.  
  
> ***All environmental variables can be placed inside `.npmrc` instead!***  