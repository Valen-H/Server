### Folders  
  * **middlewares/** -> Contains all active middlewares plus a runtime-made `order.json` file that designates the middleware execution order and prevents middleware copying from `middleware/`, if empty (initially) the server will auto-copy the middlewares from the folder `middleware`  
  * **middleware/** -> Contains all builtin middlewares  
  * **builtin/** -> contains all builtin html templates  
  * **public/** -> Contains all server pages  
  * **private/** -> Contains all server-hidden data such as `Accounts/`  
  * **lib/** -> Contains all modules  
  
### Environment  
  * **port** -> Server port  
  * **home** -> Server main path  
  * **index** -> Statically served directories homepage  
  * **wares** -> Middlewares to be used, defaults to `Symbol('ALL')`  
### Builtins  
  * **command.js** -> Contains commands which can be executed by respective url, like : `http://localhost:8080/close?auth=admin:root`  
  * **fix.js** -> Url autocorrection utility, e.g: suppose our server has a file called `file.htm` but the user requests for `FILE.html`, the server assumes and corrects the url as long as request content has not already been served.  
  * **static.js** -> Serves content under `/public` folder directly to the user. If user requests for a directory and that directory contains an index page (whose name is designated by `process.env.index` which defaults at `index` and applies for `.htm|.html|.js` filetypes), then that page is server instead of directory index list as long as that directory does not contain a `.noind` file and request content is not already served.  
  * **directory.js** -> Lists all files of a directory and prints on the `builtin/directory.html` page (by replacing `&&list&&` with the list and `&&dir&&` in the template with the directory path) as long as the directory does not contain a `.nodir` file and request content has not already been served.  
  * **end.js** -> It makes sure that all unfinished responses are terminated.  
  
> All files/folders whose names start by `d-` are blocked from static serving, in case of middlewares, their execution is omitted.  
  
### Command-Line  
  * **reload** -> Forces middlewares to reload.  
  * **exit** -> Close commandline.  
  * **stop|close** -> Close server.  
  * **quit** -> Close process.  
  * **clear|clean** -> Clear console.  
  * *Everything else gets evaluated by `eval`*  
  
> In case of a fatal error, the `error.js` middleware, which is the only middleware outside of the respective folder, responds with the template `builtin/error.html` by replacing `&&code&&` with the error code and `&&msg&&` with the error message.  
  
> ***All environmental variables can be placed inside `.npmrc` instead!***  