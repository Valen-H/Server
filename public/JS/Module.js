err = "";
try {
	var t = [],
		coor = [],
		empty = tick = function () {},
		tmp = this;
	module = new Object();
	X = innerWidth;
	Y = innerHeight;
	Xx = screen.width;
	Yy = screen.height;
	Dif = Xx > Yy ? Yy : Xx;
	dif = X > Y ? Y : X;
	doc = document;
	loc = location;
	csl = console;
	nav = navigator;
	Win = this;
	if (typeof auto == "undefined") auto = true;
	/*  <true> : manual becomes automated,
		strict : getters/setters,
		heavy : slow funcs replace normal funcs,
		light : fast funcs replace normal ones,
		nocenter : transform funcs do not affect each other,
		fill : canvas auto ctx.fill(), 
		stroke : canvas auto ctx.stroke(),
		full : canvas auto fullscreen, 
		unlock : canvas funcs keep previous path,
		lock : canvas funcs always begin new paths - auto initial centering
	*/
	if (typeof Auto == "undefined") Auto = new Number(0);
	/*
		Auto |= Constant //add once
		Auto ^= Constant //toggle
		(Auto & Constant) == Constant //check
		Auto &= ~Constant //remove once
	*/
	Sec = Millis = millis = 0;
	AUTO = new Object(), nul = function () {};
	mobile = /android|iphone|ipod|ipad|tablet|smartphone|ios/gmi.test(UA = navigator.userAgent), falseReg = /^(false|null|""|''|0|off|no|[]|{}|``|undefined|NaN|)$/gmi;
	Object.defineProperties(AUTO, {
		STRICT: {
			value: 1,
			writable: false,
			configurable: false
		},
		HEAVY: {
			value: 2,
			writable: false,
			configurable: false
		},
		LIGHT: {
			value: 4,
			writable: false,
			configurable: false
		},
		NOCENTER: {
			value: 8,
			writable: false,
			configurable: false
		},
		FILL: {
			value: 16,
			writable: false,
			configurable: false
		},
		STROKE: {
			value: 32,
			writable: false,
			configurable: false
		},
		FULL: {
			value: 64,
			writable: false,
			configurable: false
		},
		UNLOCK: {
			value: 128,
			writable: false,
			configurable: false
		},
		LOCK: {
			value: 256,
			writable: false,
			configurable: false
		}
	});
	alph = "abcdefghijklmnopqrtsuvwxyz";
	ALPH = alph.toUpperCase();
	Alph = (alph + ALPH + "0123456789");
	online = navigator.onLine;
	dat = "";
	crd = [];
	prefix = ["moz", "webkit", "o", "ms", "khtml", "ie"];
	addEventListener("resize", rel);
	addEventListener("load", rel);
	addEventListener("load", win)
	addEventListener("online", rel);
	addEventListener("offline", rel);
	addEventListener("error", function (e) {
		err += e.message + "\t" + e.fileName + "\t" + e.lineNumber + "\n";
	});
	addEventListener("load", tick = function tick() {
		var remlist = [];
		ele("node").concat(ele(".node")).forEach(function (val) {
			if (eval(val.getAttribute("data-stop"))) {
				if (/^\d+$/gmi.test(val.getAttribute("data-stop"))) {
					val.setAttribute("data-stop", val.getAttribute("data-stop") - 1);
				}
				return "paused";
			}
			val.innerHTML = eval(val.getAttribute("data-func").replace("this", "val"));
			if (val.getAttribute("data-del")) {
				remlist.push(val);
			}
		});
		remlist.forEach(rem);
		setTimeout(tick, 1);
		setTimeout(rel);
	});

	function rel() {
		if (auto) {
			X = innerWidth;
			Y = innerHeight;
			dif = X > Y ? Y : X;
			online = navigator.onLine;
			body = doc.body;
			head = doc.head;
			queryAll = document.querySelectorAll;
			query = document.querySelector;
		}
	} //rel
	function Cor(e) {
		if (!e) {
			ele("#corcor").style.display = "none";
			return;
		}
		if (e.touches) {
			crd = [e.touches[e.touches.length - 1].clientX, e.touches[e.touches.length - 1].clientY];
		} else {
			crd = [e.clientX, e.clientY];
		}
		if (ele("#corcor") && (e.type == "mousemove" || e.type == "touchmove")) {
			e.preventDefault();
		}
		if (e.type == "touchstart" || e.type == "mousedown") {
			Millis = millis = 0;
			t = setInterval(function () {
				Millis += 1;
				millis += 1;
			}, 1);
		} else if (e.type == "touchend" || e.type == "mouseup") {
			clearInterval(t);
		} else if (e.type == "touchmove" || e.type == "mousemove") {
			millis = 0;
		}
	} //cor
	addEventListener("touchstart", Cor);
	addEventListener("touchmove", Cor);
	addEventListener("mousedown", Cor);
	addEventListener("mousemove", Cor);

	function win(comm) {
		Win = comm = comm ? comm : Win;
		dat = doc.documentElement.outerHTML;
		return eval(comm);
	} //win
	function act(elem, mode) {
		if (!elem) {
			act(doc.head);
			act(ele());
			return;
		} else if (typeof elem === "string" && !/(\$|#|%|&)/gmi.test(elem.toString())) {
			elem = ele(elem);
			if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
				mas("act(@)", elem);
				return;
			}
		} else if (/(\$|#|%|&)/gmi.test(elem.toString())) {
			act(doc.head, elem);
			act(ele(), elem);
			return;
		}
		mode = !mode ? "#$%" : mode;
		var pat;
		if (/\$/gmi.test(mode) && (pat = elem.innerHTML.match(/\${2}(.|\n)*?\${2}/gmi))) {
			for (var stp = 0; stp < pat.length; stp++) {
				elem.innerHTML = elem.innerHTML.replace(pat[stp], "<node data-func=\"" + pat[stp].replace(/(^\${2}|\${2}$)/gmi, "") + "\"></node>");
			}
		}
		if (/%/gmi.test(mode) && (pat = elem.innerHTML.match(/%{2}(.|\n)*?%{2}/gmi))) {
			for (var stp = 0; stp < pat.length; stp++) {
				elem.innerHTML = elem.innerHTML.replace(pat[stp], eval(pat[stp].replace(/(^%{2}|%{2}$)/gmi, "")));
			}
		}
		if (/#/gmi.test(mode) && (pat = elem.innerHTML.match(/#{2}(.|\n)*?#{2}/gmi))) {
			for (var stp = 0; stp < pat.length; stp++) {
				elem.innerHTML = elem.innerHTML.replace(pat[stp], "");
				eval(pat[stp].replace(/(^#{2}|#{2}$)/gmi, ""));
			}
		}
		if (/&/gmi.test(mode) && (pat = elem.innerHTML.match(/&{2}(.|\n)*?&{2}/gmi))) {
			for (var stp = 0; stp < pat.length; stp++) {
				var rep = pat[stp].replace(/&(?!\\(?!\\))/gmi, "");
				prefix.forEach(function (val) {
					rep += pat[stp].replace(/(^&{2}|&{2}$)/gmi, "").replace(/&(?!\\(?!\\))/gmi, "-" + val + "-");
				});
				elem.innerHTML = elem.innerHTML.replace(pat[stp], rep);
			}
		}
	} //act
	HTMLElement.prototype.act = String.prototype.act = function (mode) {
		mode = !mode ? "#$%" : mode;
		if (typeof this == "string" || this instanceof String) {
			if (/(#|\$|%|&)/gmi.test(this)) {
				act(mode, this);
			} else {
				act(this, mode);
			}
			return;
		}
		act(this, mode);
	};
	Array.prototype.act = NodeList.prototype.act = function (mode) {
		mode = !mode ? "#$%" : mode;
		this.forEach(function (val) {
			act(val, mode);
		});
	};

	function ele(val, bl, comm, pr) {
		var com;
		if (!bl) {
			bl = doc;
		} else if (typeof bl == "string") {
			bl = ele(bl);
			if (bl.length !== undefined && /Node|,/gmi.test(bl.toString())) {
				var nar = [];
				bl.forEach(function (va) {
					nar.push(ele(val, va, comm));
				});
				return nar;
			}
		}
		if (val === undefined) {
			return bl.body;
		} else if (!val) {
			val = "*[0]";
		} else if (val.match(/,(?!\\(?!\\))/)) {
			val = val.split(",");
			com = [];
			for (var stp = 0; stp < val.length; stp++) {
				com.concat(ele(val[stp], bl));
			}
			return com;
		}
		var bo = true,
			par = val.match(/^(.|\.|#| |\*)(?!\\(?!\\)).*?(?=(#|\.| |$|\*|,)(?!\\(?!\\)))/mi)[0];
		if (par.match(/\[(?!\\(?!\\)).*?-(?!\\(?!\\)).*?\](?!\\(?!\\))/gmi) && !pr) {
			com = [];
			var ind = par.match(/\[.*?\]/mi)[0].replace(/(\[|\])(?!\\(?!\\))/gmi, "").split("-");
			par = par.replace(/\[.*?\]/mi, "");
			for (var stp = 0; stp < ind.length; stp++) {
				com = com.concat(ele(par + "[" + ind[stp] + "]"));
			}
			return com;
		}
		if (par.match(/^#(?!\\(?!\\))/gmi) && !pr) {
			com = bl.getElementById(par.replace(/^#(?!\\)/mi, ""));
		} else if (par.match(/^\.(?!\\(?!\\))/mi) && !pr) {
			if (par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/mi)) {
				com = bl.getElementsByClassName(par.replace(/(^\.|\[(?!\\(?!\\)).+?\])(?!\\(?!\\))/gmi, ""))[Number(par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/mi)[0].replace(/^\[(?!\\(?!\\))/mi, ""))];
			} else {
				bo = false;
				com = bl.getElementsByClassName(par.replace(/^\.(?!\\(?!\\))/mi, ""));
			}
		} else if (par.match(/^\*(?!\\(?!\\))/) && !pr) {
			if (par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/gmi)) {
				com = bl.childNodes[Number(par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/mi)[0].replace(/^\[(?!\\(?!\\))/mi, ""))];
			} else {
				bo = false;
				com = bl.childNodes;
			}
		} else if (par.match(/^( (?!(\\|[<>+*~:]|\[|\])(?!\\)))?/mi) && !pr) {
			if (par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/mi)) {
				com = bl.getElementsByTagName(par.replace(/(^ |\[(?!\\(?!\\)).+?\])(?!\\(?!\\))/gmi, ""))[Number(par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/mi)[0].replace(/^\[(?!\\(?!\\))/mi, ""))];
			} else {
				bo = false;
				com = bl.getElementsByTagName(par.replace(/^( (?!\\(?!\\)))?/mi, ""));
			}
		} else if (par.match(/^@(?!\\(?!\\))/gmi) && !pr) {
			if (par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/gmi)) {
				com = bl.getElementsByName(par.replace(/^@(?!\\(?!\\))/mi, ""))[Number(par.match(/\[(?!\\(?!\\))\d+?(?=\](?!\\(?!\\)))/mi)[0].replace(/^\[(?!\\(?!\\))/mi, ""))];
			} else {
				bo = false;
				com = bl.getElementsByName(par.replace(/^@(?!\\(?!\\))/mi, ""));
			}
		} else {
			com = bl.querySelectorAll(val);
			bo = false;
			par = val;
		}
		if (val.replace(par, "") != "") {
			if (bo) {
				com = ele(val.replace(par, ""), com);
			} else {
				var con = [];
				for (var mat = 0; mat < com.length; mat++) {
					con.push(ele(val.replace(par, ""), com[mat]));
				}
				com = cmp(con).filter(function (n) {
					return n !== undefined;
				});
			}
		}
		if ((!bo) && comm) {
			com = cmp(com).filter(function (n) {
				return eval(comm.replace(/@(?!\\(?!\\))/gmi, "n").replace(/\\(?!\\(?!\\))/gmi, ""));
			});
		} else if (!bo) {
			com = cmp(com);
		}
		return com;
	} //ele
	String.prototype.ele = HTMLElement.prototype.ele = function (val, bl, com) {
		return ele(val, !bl && com ? this : bl, com);
	};
	Array.prototype.ele = NodeList.prototype.ele = function (val, com) {
		var nar = [];
		this.forEach(function (va) {
			nar = nar.concat(ele(val, va, com));
		});
		return nar;
	};

	function mas(pat, arr, cond) {
		if (cond === undefined) {
			cond = "true";
		}
		if (typeof arr != "object" || arr.length === undefined) {
			arr = [arr];
		}
		var ret = [];
		for (var mat = 0; mat < arr.length; mat++) {
			if (eval(cond.replace(/@(?!\\(?!\\))/gmi, "arr[mat]"))) {
				ret[mat] = eval(pat.replace(/@(?!\\(?!\\))/gmi, "arr[mat]").replace(/\\(?!\\(?!\\))/gmi, ""));
			}
		}
		return ret;
	} //mas
	Array.prototype.mas = NodeList.prototype.mas = function (pat, cond) {
		return mas(pat, this, cond);
	};
	//deprecated?
	function cmp(arr) {
		var nar = [];
		for (var mat = 0; mat < arr.length; mat++) {
			if (arr[mat] !== undefined) {
				if (typeof arr[mat] !== "object" || arr[mat].length === undefined) {
					nar.push(arr[mat]);
				} else {
					nar = nar.concat(cmp(arr[mat]));
				}
			}
		}
		return nar;
	} //cmp
	NodeList.prototype.cmp = Array.prototype.cmp = function (dpt, rev) {
		var nar = [];
		if (!rev) {
			if (!dpt) {
				return this.inh(cmp(this));
			}
			while (dpt-- > 0) {
				this.each(function (val, ind, arr) {
					if (typeof val == "object") {
						nar = nar.concat(val);
					} else {
						nar.push(val);
					}
				});
				this.inh(nar);
				nar = [];
			}
		} else {
			while (dpt-- > 0) {
				rep(this.length / rev, (function (stp) {
					nar.push(this.slice(stp * rev, rev + stp * rev));
				}).bind(this));
			}
			this.inh(nar);
			nar = [];
		}
		return this;
	};

	function dbg(tr) {
		if (tr === undefined) {
			tr = !ele("#dbgdbg");
		}
		if (ele("#dbgdbg")) {
			doc.body.removeChild(ele("#dbgdbg"));
		}
		if (!tr) {
			return;
		}
		tr = crt("button");
		tr.style.position = "fixed";
		tr.style.top = tr.style.left = "7%";
		tr.innerHTML = "Debug";
		tr.style.zIndex = 10000;
		tr.id = "dbgdbg";
		tr.onclick = function () {
			eval("try{" + prompt("Run Command ( hlp() )") + "}catch(E){alert(E);}");
		};
	} //dbg
	function cor(tr, d) {
		if (tr === undefined) {
			tr = !ele("#corcor");
		}
		if (ele("#corcor") && !tr) {
			ele().removeChild(ele("#corcor"));
			return;
		}
		if (tr && !ele("#corcor")) {
			tr = ele().appendChild(doc.createElement("coord"));
			tr.style.borderRadius = "50%";
			tr.style.backgroundColor = "blue";
			tr.style.position = "absolute";
			tr.style.pointerEvents = "none";
			tr.style.zIndex = "10000";
			tr.style.opacity = .6;
			tr.style.display = d ? "none" : "inline-block";
			tr.id = "corcor";
			var T = setInterval(function () {
				if (ele("#corcor")) {
					ele("#corcor").innerHTML = crd;
					ele("#corcor").style.top = crd[1] + 5 + "px";
					ele("#corcor").style.left = crd[0] + 5 + "px";
				} else {
					clearInterval(T);
				}
			}, 1);
		}
	} //cor
	function src(elem) {
		if (elem === undefined) {
			elem = doc.documentElement;
		}
		if (typeof elem === "string") {
			elem = ele(elem);
			if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
				console.warn("Error (Lists prohibited) :\n\n" + elem);
				return;
			}
		}
		if (!ele("#srcsrc")) {
			doc.write("<textarea id='srcsrc' style='position:fixed;top:0%;left:0%;width:100%;height:100%;resize:none;' noresize>" + elem.outerHTML + "</textarea>");
			doc.close();
			dbg(true);
			ele("#dbgdbg").innerHTML = "Back";
			ele("#dbgdbg").onclick = function () {
				src(false);
			};
		} else {
			doc.write(ele("#srcsrc").value);
			doc.close();
			dbg(true);
		}
	} //src
	HTMLElement.prototype.src = String.prototype.src = function () {
		return src(this);
	};

	function xtr(elem, typ) {
		elem = !elem ? doc.documentElement : elem;
		if (typeof elem == "string") {
			elem = ele(elem);
			if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
				console.warn("Error (Lists prohibited) :\n\n" + elem);
				return;
			}
		}
		if (!typ) {
			t.forEach(function (tt) {
				clearInterval(tt)
			});
			mas("doc.write([@,'<br>-----------<br>'].join(''))", mas("@.replace(/(src|href)=(\"|\')?/gmi,'')", elem.outerHTML.match(/(src|href)=(\"|\')?.+?(?=(\"|\'|( *?)?\>))/gmi)));
			doc.close();
			dbg(true);
			ele("#dbgdbg").innerHTML = "Reload";
			ele("#dbgdbg").onclick = function () {
				loc.reload();
			};
		} else {
			return elem.outerHTML.match(/(src|href)=(\"|\')?.+?(?=(\"|\'|( *?)?\>))/gmi);
		}
	} //xtr  USES MAS()
	HTMLElement.prototype.xtr = String.prototype.xtr = function (typ) {
		return xtr(this, typ);
	};

	function mul(elem, comm) {
		comm = comm ? comm : "";
		if (typeof elem == "string") {
			elem = ele(elem);
			if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
				elem.forEach(function (val) {
					mul(val, comm);
				});
				return;
			}
		} else if (elem === undefined) {
			elem = ele();
		}
		if (/;+/m.test(comm)) {
			for (var stp = 0; stp < comm.split(";").length; stp++) {
				mul(elem, comm.split(";")[stp]);
			}
			return;
		}
		eval("elem.style." + comm.replace("@", ""));
		for (var stp = 0; stp < prefix.length; stp++) {
			eval("elem.style." + prefix[stp] + comm.charAt(0).toUpperCase() + comm.replace(/^./gmi, "").replace(/@(?!\\(?!\\))/gmi, "-" + prefix[stp] + "-").replace(/\\(?!\\)/gmi, ""));
		}
	} //mul
	NodeList.prototype.mul = Array.prototype.mul = String.prototype.mul = HTMLElement.prototype.mul = function (comm) {
		mul(this, comm);
	};

	function tog(elem, milli, init, comm) {
		elem = elem ? elem : ele();
		if (typeof elem == "string" || !elem.getAttribute) {
			elem = ele(elem);
		}
		if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
			elem.forEach(function (val) {
				tog(val, milli, init, comm);
			});
			return;
		}
		if (!elem.getAttribute("data-tog")) {
			comm = comm ? comm : "";
			var op = Number(elem.style.opacity = !elem.style.opacity ? 1 : elem.style.opacity);
			milli = milli ? milli : 1;
			init = init !== undefined ? init : (100 - 100 * Math.round(elem.style.opacity));
			init = per(init, 1);
			elem.setAttribute("data-tog", true);
			var t = setInterval(function () {
				elem.style.opacity = op += (init - elem.style.opacity) / milli;
				if (init >= elem.style.opacity) {
					milli -= milli / 1000;
				} else {
					milli += milli / 2000;
				}
				if (elem.style.opacity <= .01) {
					elem.style.opacity = 0;
					elem.style.display = "none";
				} else if (elem.style.opacity >= .99) {
					elem.style.opacity = 1;
				} else {
					elem.style.display = "";
				}
				if (elem.style.opacity >= init - .01 && elem.style.opacity <= init + .01) {
					elem.style.opacity = init;
					elem.removeAttribute("data-tog");
					eval(comm);
					clearInterval(t);
				}
			}, 1);
		}
	} //tog
	NodeList.prototype.tog = Array.prototype.tog = String.prototype.tog = HTMLElement.prototype.tog = function (milli, init, comm, cust) {
		tog(!cust ? this : milli, !cust ? milli : init, !cust ? init : comm, !cust ? comm : cust);
	};

	function exp(elem, milli, init, comm) {
		elem = elem ? elem : ele();
		if (typeof elem == "string" || !elem.getAttribute) {
			elem = ele(elem);
		}
		if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
			elem.forEach(function (val) {
				exp(val, milli, init, comm);
			});
			return;
		}
		if (!elem.getAttribute("data-exp")) {
			var size = [/px/gm.test(elem.style.width) ? elem.style.width.match(/^.+?(?=px)/gm)[0] : elem.offsetWidth, /px/gm.test(elem.style.height) ? elem.style.height.match(/^.+?(?=px)/gm)[0] : elem.offsetHeight];
			elem.style.width = size[0] + "px";
			elem.style.height = size[1] + "px";
			milli = milli ? milli : .8;
			init = init === undefined ? size : [init[0], init[1]];
			if (elem.style.display == "none") {
				elem.style.width = elem.style.height = "";
			}
			elem.setAttribute("data-exp", true);
			var t = setInterval(function () {
				elem.style.width = (size[0] -= (size[0] - init[0]) / milli) + "px";
				elem.style.height = (size[1] -= (size[1] - init[1]) / milli) + "px";
				if (size[0] - init[0] > 0 && size[1] - init[1] > 0) {
					milli += milli / 600;
				} else {
					milli -= milli / 500;
				}
				if (size[0] < 2 || size[1] < 2) {
					elem.style.display = "none";
				} else if (elem.style.display == "none") {
					elem.style.display = "";
				}
				if (size[0] - init[0] <= 2 && size[0] - init[0] >= -2 && size[1] - init[1] <= 2 && size[1] - init[1] >= -2) {
					elem.style.width = init[0] + "px";
					elem.style.height = init[1] + "px";
					elem.removeAttribute("data-exp")
					eval(comm);
					clearInterval(t);
				}
			}, 1);
		}
	} //exp
	NodeList.prototype.exp = Array.prototype.exp = String.prototype.exp = HTMLElement.prototype.exp = function (milli, init, comm, cust) {
		exp(!cust ? this : milli, !cust ? milli : init, !cust ? init : comm, !cust ? comm : cust);
	};

	function tra(elem, milli, init, comm) {
		elem = elem ? elem : ele();
		if (typeof elem == "string" || !elem.getAttribute) {
			elem = ele(elem);
		}
		if (elem.length !== undefined && /Node|,/gmi.test(elem.toString())) {
			elem.forEach(function (val) {
				tra(val, milli, init, comm);
			});
			return;
		}
		if (!elem.getAttribute("data-tra")) {
			if (!/absolute|fixed/.test(elem.style.position)) {
				elem.style.position = "absolute";
			}
			var pos = [/px/gm.test(elem.style.left) ? elem.style.left.match(/^.+?(?=px)/gm)[0] : elem.offsetLeft, /px/gm.test(elem.style.top) ? elem.style.top.match(/^.+?(?=px)/gm)[0] : elem.offsetTop];
			elem.style.left = pos[0] + "px";
			elem.style.top = pos[1] + "px";
			milli = milli ? milli : .5;
			init = init === undefined ? pos : [init[0], init[1]];
			elem.setAttribute("data-tra", true);
			var t = setInterval(function () {
				elem.style.left = (pos[0] -= (pos[0] - init[0]) / milli) + "px";
				elem.style.top = (pos[1] -= (pos[1] - init[1]) / milli) + "px";
				milli += milli / 20000;
				if (pos[0] - init[0] <= 1 && pos[0] - init[0] >= -1 && pos[1] - init[1] <= 1 && pos[1] - init[1] >= -1) {
					elem.style.left = init[0] + "px";
					elem.style.top = init[1] + "px";
					elem.removeAttribute("data-tra");
					eval(comm);
					clearInterval(t);
				}
			}, 1);
		}
	} //tra
	NodeList.prototype.tra = Array.prototype.tra = String.prototype.tra = HTMLElement.prototype.tra = function (milli, init, comm, cust) {
		tra(!cust ? this : milli, !cust ? milli : init, !cust ? init : comm, !cust ? comm : cust);
	};

	function rnd(frm, to, rd) {
		if (frm === undefined) {
			return "#" + ((Math.random() * 16777215) | 0).toString(16);
		} else {
			to = to === undefined ? frm : to;
			frm = frm == to ? 0 : frm;
			var tmp = [Math.min(frm, to), Math.max(frm, to)];
			frm = tmp[0];
			to = tmp[1];
			return !rd ? (Math.random() * (to - frm) + frm) | 0 : (Math.random() * (to - frm) + frm);
		}
	} //rnd
	Math.rnd = rnd;
	Number.prototype.rnd = function (frm, rd) {
		rnd(frm, this, rd);
	};
	Array.prototype.rnd = function (rd) {
		var ind = rnd(0, this.length - 1);
		if (rd) {
			return ind;
		}
		return this[ind];
	};
	Object.defineProperty(window, "Rnd", {
		get: function () {
			return rnd()
		}
	});

	function swt(a) {
		if (a) auto = auto.toString() + a
		if (/heavy/gmi.test(auto.toString()) || (Auto & AUTO.HEAVY) == AUTO.HEAVY) {
			rnd = function (frm, to, rd) {
				if (frm === undefined) {
					return "rgba(" + Math.rnd(255) + "," + Math.rnd(255) + "," + Math.rnd(255) + "," + Math.rnd(0, 1, 1) + ")";
				} else {
					to = to === undefined ? frm : to;
					frm = frm == to ? 0 : frm;
					var tmp = [Math.min(frm, to), Math.max(frm, to)];
					frm = tmp[0];
					to = tmp[1];
					return !rd || [frm, to].every(function (val) {
						return !/\./gmi.test(val.toString())
					}) ? Math.round(Math.random() * (to - frm) + frm) : (Math.random() * (to - frm) + frm);
				}
			};
		} else if (/light/gmi.test(auto.toString()) || (Auto & AUTO.LIGHT) == AUTO.LIGHT) {
			rnd = function (frm, to, rd) {
				if (frm === undefined) {
					return "#" + Math.round(Math.random() * 16777215).toString(16);
				} else {
					return !rd ? Math.round(Math.random() * (to - frm) + frm) : (Math.random() * (to - frm) + frm);
				}
			};
		}
		if ((!/strict/gmi.test(auto.toString()) && (Auto & AUTO.STRICT) != AUTO.STRICT) && Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
			try {
				if (!Object.prototype._ins) {
					Object.defineProperty(Object.prototype, "_ins", {
						enumerable: false
					});
					Object.prototype.__defineGetter__("_ins", function () {
						return ins(this)
					});
				}
				if (!Object.prototype._Ins) Object.prototype.__defineGetter__("_Ins", function () {
					return Ins(this)
				});
				if (!Object.prototype._prp) Object.prototype.__defineGetter__("_prp", function () {
					return Object.getOwnPropertyNames(this)
				});
				if (!Object.prototype.Values) Object.prototype.__defineGetter__("Values", function () {
					return this.values()
				});
				if (!Object.prototype.Keys) Object.prototype.__defineGetter__("Keys", function () {
					return Object.keys(this)
				});
				if (!Object.prototype.Names) Object.prototype.__defineGetter__("Names", function () {
					return Object.names(this)
				});
				if (!Object.prototype.string) Object.prototype.__defineGetter__("string", function () {
					return this.toString()
				});
				if (!Object.prototype.Last) Object.prototype.__defineGetter__("Last", function () {
					return this.last()
				});
				if (!Object.prototype.First) Object.prototype.__defineGetter__("First", function () {
					return this.first()
				});
				if (!Object.prototype.Alt) Object.prototype.__defineGetter__("Alt", function () {
					return this.alt()
				});
			}
			catch (e) {}
		}
		return auto;
	} //swt
	swt();
	if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
		if (!Array.prototype.datatype) {
			Array.prototype.__defineGetter__("datatype", function () {
				var type = 0;
				for (var stp = 0; stp < this.length; stp++) {
					if ((typeof this[stp] == "number" && !type) || (typeof this[stp] == "string" && type < 2) || ((this[stp] instanceof Array) && type < 3) || ((this[stp] instanceof Object) && type < 4)) {
						type++
					}
				}
				return type == 1 ? "Number" : (type == 2 ? "String" : (type == 3 ? "Array" : "Object"));
			});
			Array.prototype.__defineSetter__("datatype", function () {
				var cls = eval(this.datatype),
					nar = [];
				this.forEach((function (val, ind, arr) {
					nar.push(new cls(val));
				}).bind(this));
				this.inh(nar);
				return this;
			});
		}
		try {
			if (!Object.prototype._ins)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("_ins", function () {
					return ins(this)
				})
			});
			if (!Object.prototype._Ins)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("_Ins", function () {
					return Ins(this)
				})
			});
			if (!Object.prototype._prp)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("_prp", function () {
					return Object.getOwnPropertyNames(this)
				})
			});
			if (!Object.prototype.Values)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("Values", function () {
					return this.values()
				})
			});
			if (!Object.prototype.Keys)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("Keys", function () {
					return Object.keys(this)
				})
			});
			if (!Object.prototype.Names)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("Names", function () {
					return Object.names(this)
				})
			});
			if (!Object.prototype.string)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("string", function () {
					return this.toString()
				})
			});
			if (!Object.prototype.Last)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("Last", function () {
					return this.last()
				})
			});
			if (!Object.prototype.First)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("First", function () {
					return this.first()
				})
			});
			if (!Object.prototype.Alt)[Array, String, Number].forEach(function (each) {
				each.prototype.__defineGetter__("Alt", function () {
					return this.alt()
				})
			});
		}
		catch (ig) {}
		if (!Array.prototype.Sum) Array.prototype.__defineGetter__("Sum", function () {
			return this.sum()
		});
		if (!Array.prototype.Fac) Array.prototype.__defineGetter__("Fac", function () {
			return this.fac()
		});
		if (!Array.prototype.Pure) Array.prototype.__defineGetter__("Pure", function () {
			return this.pure()
		});
		if (!Array.prototype.Cmp) Array.prototype.__defineGetter__("Cmp", function () {
			return cmp(this)
		});
		if (!Array.prototype.Rnd) Array.prototype.__defineGetter__("Rnd", function () {
			return this.rnd()
		});
		if (!Array.prototype.Shf) Array.prototype.__defineGetter__("Shf", function () {
			return this.clone().shf()
		});
		if (!Array.prototype.Max) Array.prototype.__defineGetter__("Max", function () {
			return this.max()
		});
		if (!Array.prototype.Min) Array.prototype.__defineGetter__("Min", function () {
			return this.min()
		});
		if (!String.prototype.Bool) String.prototype.__defineGetter__("Bool", function () {
			return this.bool()
		});
		if (!Number.prototype.Sig) Number.prototype.__defineGetter__("Sig", function () {
			return this.sig()
		});
	} else {
		console.warn("Object.prototype.__defineGetter__  and/or  Object.prototype.__defineGetter__  is/are deprecated.");
	}

	function dst(x, y, d) {
		if (x !== undefined && y !== undefined && d === undefined) {
			return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		} else if (d !== undefined && (x !== null || y !== null) && (x === null || y === null)) {
			return Math.sqrt(Math.pow(d, 2) - Math.pow(y !== null ? y : (x !== null ? x : 0)));
		} else if (x !== undefined && y !== undefined && d !== undefined) {
			return Math.atan2(y, x) * 180 / Math.PI;
		}
		console.warn("Invalid arguments in dst()");
		return false;
	} //dst
	Math.dst = dst;
	Number.prototype.dst = function (a) {
		if (a === undefined) {
			return Math.cbrt(this);
		}
		return Math.sqrt(Math.pow(this, 2) - Math.pow(a, 2));
	};

	function Dst(x, y, X, Y, d) {
		return dst(x - X, y - Y, d);
	} //Dst
	Math.Dst = Dst;

	function dst3(x, y, z, d) {
		if (d === undefined) {
			return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
		} else if ((x !== undefined && y !== undefined) && (x !== null && y !== null) && d === undefined) {
			return Math.sqrt(Math.pow(d, 2) - Math.pow(y, 2) - Math.pow(x, 2));
		} else if ((x !== undefined && z !== undefined) && (x !== null && z !== null) && d === undefined) {
			return Math.sqrt(Math.pow(d, 2) - Math.pow(z, 2) - Math.pow(x, 2));
		} else if ((z !== undefined && y !== undefined) && (y !== null && z !== null) && d === undefined) {
			return Math.sqrt(Math.pow(d, 2) - Math.pow(y, 2) - Math.pow(z, 2));
		} else if ([x, y, z, d].every(function (val) {
				return val !== undefined
			})) {
			return [Math.atan2(y, z) * 180 / Math.PI, Math.atan2(z, x) * 180 / Math.PI, Math.atan2(y, x) * 180 / Math.PI];
		}
		console.warn("Invalid arguments in dst3()");
		return false;
	} //dst3
	Math.dst3 = dst3;

	function Dst3(x, y, z, X, Y, Z, d) {
		return dst3(x - X, y - Y, z - Z, d);
	} //Dst3
	Math.Dst3 = Dst3;

	function col(x, y, X, Y, dx, dy, dX, dY, r, s) {
		if (dY !== undefined && r === undefined && s === undefined) {
			var bx = Math.min(x, X, x + dx, X + dX);
			var by = Math.min(y, Y, y + dy, Y + dY);
			var Bx = Math.max(x, X, x + dx, X + dX);
			var By = Math.max(y, Y, y + dy, Y + dY);
			return Math.abs(Bx - bx) <= dx + dX && Math.abs(By - by) <= dy + dY;
			//box-box x,y,X,Y,dx,dy,dX,dY
		} else if (dX !== undefined && r === undefined && s === undefined) {
			return dst(x + X / 2 - dx, y + Y / 2 - dy) <= dX + dst(X / 2, Y / 2);
			//box-circle 7
		} else if (r === undefined && s === undefined) {
			return dst(x - Y, y - (dx ? dx : 0)) <= X + (dy ? dy : 0);
			//circle/point-circle/point <=6 >=4
		} else if (s !== undefined) {
			var o1 = (180 - (360 / dx)) / 2;
			var p1 = Lim((dst(dy - x, dX - y, 1) - Y), 0, 360) % (360 / dx);
			var r1 = X / Math.sin(deg(180 - p1 - o1)) * Math.sin(deg(o1));
			var o2 = (180 - (360 / s)) / 2;
			var p2 = Lim((dst(x - dy, y - dX, 1) - r), 0, 360) % (360 / s);
			var r2 = R / Math.sin(deg(180 - p2 - o2)) * Math.sin(deg(o2));
			return dst(x - dy, y - dX) <= r1 + r2;
			//polygon-polygon 10
		} else if (r == 1) {
			var o1 = (180 - (360 / dx)) / 2;
			var p1 = Lim((dst(dy - x, dX - y, 1) - Y), 0, 360) % (360 / dx);
			var r1 = X / Math.sin(deg(180 - p1 - o1)) * Math.sin(deg(o1));
			return dst(x - dy, y - dX) <= r1 + dY;
			//polygon-circle 9
		} else if (r == 2) {
			var x1 = x,
				y1 = y,
				x2 = X,
				y2 = Y,
				X1 = dx,
				Y1 = dy,
				X2 = dX,
				Y2 = dY;
			if (x1 != x2 && X1 != X2) {
				var l = (y1 - y2) / (x1 - x2),
					L = (Y1 - Y2) / (X1 - X2);
				var v = y1 - l * x1,
					V = Y1 - l * X1;
				if (l != L) {
					var x = (V - v) / (l - L);
					var y = l * x + v;
					if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && x >= Math.min(X1, X2) && x <= Math.max(X1, X2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2) && y >= Math.min(Y1, Y2) && y <= Math.max(Y1, Y2)) {
						return true;
					} else {
						return false;
					}
				} else if (v == V) {
					return true;
				} else {
					return false;
				}
			}
			if ((x1 == x2 || X1 == X2) && (x1 != x2 || X1 != X2)) {
				var h = x1 != x2 ? [x1, y1, x2, y2] : [X1, Y1, X2, Y2];
				var x = x1 == x2 ? x1 : X1;
				var l = (h[2] - h[3]) / (h[0] - h[1])
				var y = h[1] - l * h[0];
				if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && x >= Math.min(X1, X2) && x <= Math.max(X1, X2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2) && y >= Math.min(Y1, Y2) && y <= Math.max(Y1, Y2)) {
					return true;
				}
				return false;
			} else if (x1 == x2 && X1 == X2 && x1 == X1) {
				var x = x1;
				if (y1 <= Math.max(Y1, Y2) || y1 >= Math.min(Y1, Y2) || y2 <= Math.max(Y1, Y2) || y2 >= Math.min(Y1, Y2)) {
					return true;
				}
				return false;
			}
			//line-line 9
		}
		return false;
		//TODO: 3D  O_O
	} //col
	Math.col = col;

	function col3(x, y, z, r, X, Y, Z, R) {
		return Dst3(x, y, z, X, Y, Z) <= r + R;
		//circle/point-circle/point
	} //col3
	Math.col3 = col3;

	function cn() {
		var can = doc.head.appendChild(doc.createElement("script"));
		can.src = "https://dl.dropboxusercontent.com/s/iqx2kzfiguvp44y/Canvas.js?dl=1&raw=1";
		can = doc.head.appendChild(doc.createElement("link"));
		can.href = "https://dl.dropboxusercontent.com/s/fvnin56m7ujzd5u/Main.css?dl=1&raw=1";
		can.rel = "stylesheet";
	} //cn
	//^deprecated
	function rep(cnt, com, ini) {
		var val = [];
		for (var stp = (ini ? ini : 0); stp < cnt + (ini ? ini : 0); stp++) {
			if (typeof com == "string") {
				val.push(eval(com.replace(/@(?!\\(?!\\))/gmi, stp).replace(/\\(?!\\(?!\\))/gmi, "")));
			} else {
				val.push(com(stp));
			}
		}
		return val.filter(function (va) {
			return va !== undefined;
		});
	} //rep
	Number.prototype.rep = String.prototype.rep = Function.prototype.rep = function (cnt, ini) {
		return rep(typeof this == "number" ? this : cnt, typeof this == "number" ? cnt : this, ini);
	};

	function deg(dg, rd) {
		if (typeof dg != "string" && !rd) {
			return (dg / 180) * Math.PI;
			//rad
		} else {
			return (Number(dg.toString().replace("π", Math.PI)) / Math.PI) * 180;
		}
	} //deg
	Number.prototype.deg = function (rd) {
		return deg(this, rd);
	};
	Math.deg = deg;

	function fon(tg) {
		if (ele("#mmax")) {
			if (tg) {
				ele("#mmax").rem();
			}
			return;
		}
		fl = crt("meta", document.head);
		fl.name = "viewport";
		fl.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
		fl.id = "mmax";
	} //fon
	//^deprecated
	function per(pr, mx, gr) {
		var gr = gr || 100;
		return pr * mx / gr;
	} //per
	Math.per = per;
	Number.prototype.per = function (pr, gr) {
		return per(!isNaN(pr) ? pr : 1, this, gr ? gr : 100);
	};

	function crt(e, el) {
		if (typeof el == "string") {
			el = ele(el);
		} else if (e instanceof Array) {
			var nar = [];
			e.forEach(function (val) {
				nar.push(crt(val, el));
			});
			return nar;
		} else if ((el instanceof Array) || (el instanceof NodeList)) {
			var nar = [];
			el.forEach(function (val) {
				nar.push(crt(e, val));
			});
			return nar;
		}
		return (el || ele()).appendChild(document.createElement(e));
	} //crt
	HTMLElement.prototype.crt = NodeList.prototype.crt = function (e) {
		return crt(e, this);
	};
	Array.prototype.crt = String.prototype.crt = function (el) {
		return crt(this, el);
	};

	function ajx(u, f, p, d, syn, user, pass) {
		var aj = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
		if (syn === undefined) {
			aj.open(p || "GET", u);
		} else if (user === undefined) {
			aj.open(p || "GET", u, syn);
		} else {
			aj.open(p || "GET", u, syn, user, pass);
		}
		aj.onload = f;
		aj.send(d ? d : null);
		aj.src = u;
		return aj;
	} //ajx
	[String, Array, Number].forEach(function (val) {
		val.prototype.wrp = function (wr) {
			if (this instanceof String || this instanceof Number) {
				return wr + "" + this + wr;
			} else {
				this.each(function (va, ind) {
					this[ind] = wr + "" + this[ind] + wr;
				});
				return this;
			}
		};
	});

	function con(comm, init) {
		try {
			if (typeof comm == "string") {
				if (eval(comm) === true) {
					return;
				}
			} else {
				if (comm() === true) {
					return;
				}
			}
		}
		catch (e) {}
		setTimeout(con, init || 1, comm || " ", init || 1);
	} //con
	Number.prototype.con = String.prototype.con = Function.prototype.con = function (init) {
		return con(typeof this == "number" ? init : this, typeof this == "number" ? this : init);
	};
	NodeList.prototype.rem = Array.prototype.rem = HTMLElement.prototype.rem = String.prototype.rem = function () {
		rem(this);
	};

	function rem(el) {
		if (typeof el == "string") {
			el = ele(el);
		} else if ((el instanceof Array) || (el instanceof NodeList)) {
			var nar = [];
			el.forEach(function (val) {
				nar.push(rem(val));
			});
			return nar;
		}
		return el.parentNode.removeChild(el);
	} //rem
	function ins(el) {
		var arr = [];
		for (prop in el) {
			if (!/^_?ins$/.test(prop.toString())) {
				arr.push(typeof prop == "object" ? Ins(prop) : prop);
			}
		}
		return arr;
	} //ins
	function Ins(el) {
		return JSON.stringify(el, null, 2) || el;
	} //Ins
	Object.prototype.prp = function (ind) {
		return this[Object.keys(this)[ind ? Number(ind) : 0]];
	};
	Object.prototype.Prp = function (ind) {
		return Object.keys(this)[ind ? Number(ind) : 0];
	};
	Array.prototype.values = Object.prototype.values = function () {
		return Object.keys(this).filter(function (val) {
			return val != "Values" ? true : false
		}).map((function (val) {
			return this[val];
		}).bind(this));
	};
	Object.prototype.keys = function () {
		return Object.keys(this);
	};
	Object.values = function values(obj) {
		return obj.values();
	};
	Object.names = function names(obj) {
		return Object.getOwnPropertyNames(obj);
	};
	Object.prototype.ins = function () {
		return ins(this);
	};
	Object.prototype.Ins = function () {
		return Ins(this);
	};

	function dup(str, tim) {
		tim = tim ? tim : 0;
		var st = str ? str : "";
		while (tim--) {
			if (typeof str != "object") {
				str += st.toString();
			} else {
				str = str.concat(st);
			}
		}
		return str;
	} //dup
	//^deprecated
	Array.prototype.dup = String.prototype.dup = Number.prototype.dup = function (tim) {
		return dup(this, tim);
	};
	if (!String.prototype.repeat) {
		String.prototype.repeat = String.prototype.dup;
	} else {
		String.prototype.dup = String.prototype.repeat;
	}

	function alt(bool) {
		return !Boolean(bool);
	} //alt
	Object.prototype.alt = function () {
		return alt(this);
	};

	function sig(n) {
		n = Number(n);
		if (!n) {
			return 0;
		}
		return n / Math.abs(n);
	} //sig
	String.prototype.sig = Number.prototype.sig = function () {
		return sig(this);
	};
	if (!Math.sign) {
		Math.sign = sig;
	}
	Math.sum = Number.prototype.sum = function (lst) {
		lst = lst ? lst : (Number(this) || "")
		var acc = 0;
		while (lst) {
			acc += lst;
			lst--;
		}
		return acc;
	};
	Array.prototype.sum = function () {
		var tmp = 0;
		this.forEach(function (val) {
			tmp += val;
		});
		return tmp;
	};
	//^deprecated+fac
	if (!Array.prototype.reduce) {
		Array.prototype.reduce = Array.prototype.sum;
	}
	Math.fac = function (lst) {
		var acc = 1;
		while (lst) {
			acc *= lst;
			lst--;
		}
		return acc;
	};
	Array.prototype.fac = function () {
		var tmp = 0;
		this.forEach(function (val) {
			tmp *= val;
		});
		return tmp;
	};
	Array.prototype.rmv = String.prototype.rmv = function (elm, n) {
		var arr = this.split("");
		if (typeof elm != "number" && this.indexOf(elm) < 0) {
			return this;
		}
		arr.splice(typeof elm == "number" && !n ? elm : this.indexOf(elm), 1);
		if (this instanceof String) {
			return arr.join("");
		}
		return arr;
	};
	Array.prototype.add = function add(elm) {
		if (!this.has(elm)) {
			this.push(elm);
		}
	};
	Array.prototype.has = function has(elm) {
		return this.indexOf(elm) >= 0;
	};
	if (!Array.prototype.includes) {
		Array.prototype.includes = Array.prototype.has;
	}
	Array.prototype.togg = function (elm) {
		if (this.has(elm)) {
			return this.rmv(elm);
		}
		return this.add(elm);
	};
	Array.prototype.flt = function () {
		var nar = [];
		this.forEach(function (val) {
			nar.add(val);
		});
		return this.inh(nar);
	};

	function flt(elm) {
		var nar = [];
		elm.forEach(function (val) {
			nar.add(val);
		});
		return nar;
	} //flt
	Array.prototype.pure = function () {
		return this.concat([]) || [];
	};
	if (!Array.prototype.clone) {
		Array.prototype.clone = Array.prototype.pure;
	}
	//^deprecated
	Array.prototype.inherit = Array.prototype.inh = function (array) {
		this.each((function (val, ind, arr) {
			this[ind] = array[ind];
			while (this.last() === undefined && this.length) {
				this.pop();
			}
		}).bind(this));
		return this;
	};
	if (!Array.prototype.copy) {
		Array.prototype.copy = function (ar) {
			if (!ar) {
				return this.clone();
			}
			return this.inh(ar);
		};
	}
	Image.prototype.data = function () {
		var can = document.createElement("canvas");
		can.width = this.width;
		can.height = this.height;
		var ctx = can.getContext("2d");
		ctx.drawImage(this, 0, 0);
		return can.toDataURL();
	};
	Array.prototype.shf = Array.prototype.shf = function () {
		var i = this.length,
			j, temp;
		if (!i) {
			return this;
		}
		while (--i) {
			j = rnd(i);
			temp = this[i];
			this[i] = this[j];
			this[j] = temp;
		}
		return this;
	};
	String.prototype.shf = Number.prototype.shf = function () {
		return this.split("").shf();
	};

	function lim(n, m, M) {
		n = Number(n);
		m = Number(m);
		M = Number(M);
		return n < m ? m : (n > M ? M : n);
	}
	Math.lim = lim;
	Object.prototype.lim = String.prototype.lim = Number.prototype.lim = function (min, max) {
		return lim(this, min, max || "0");
	};
	Array.prototype.lim = function (min, max) {
		this.forEach(function (val, ind) {
			this[ind] = lim(val, min, max);
		});
		return this;
	};

	function Lim(n, m, M) {
		n = Number(n);
		m = Number(m);
		M = Number(M);
		return n < m ? M - Math.abs(m - n) % m : (n > M ? m + Math.abs(M - n) % M : n);
	}
	Math.Lim = Lim;
	Object.prototype.Lim = String.prototype.Lim = Number.prototype.Lim = function (min, max) {
		return Lim(this, min, max || "0");
	};
	Array.prototype.Lim = function (min, max) {
		this.forEach(function (val, ind) {
			this[ind] = Lim(val, min, max);
		});
		return this;
	};

	function bool(dt) {
		return falseReg.test(dt);
	} //bool
	Object.prototype.bool = function () {
		return bool(this.toString());
	};

	function par(fun, num, nam, cod) {
		var arr = rep(num, function (st) {
			return nam + (st + 1);
		});
		return eval(fun + "=function " + fun + "(" + arr.join(",") + "," + nam + "," + nam + "0){" + nam + "=[" + arr.join(",") + "];" + nam + "0=['" + fun + "'," + num + "];" + (typeof cod == "string" ? cod : "return (" + cod + ")()") + "}");
	} //par
	//^deprecated
	Min = Math.Min = function Min(n) {
		return Math.min.apply(Math, n);
	};
	Max = Math.Max = function Max(n) {
		return Math.max.apply(Math, n);
	};
	Array.prototype.max = function () {
		return Max(this);
	};
	Array.prototype.min = function () {
		return Min(this);
	};
	anl = Math.anl = function anl(n, a, b, A, B) {
		var df = 100 * (n - Math.min(a, b)) / (Math.max(a, b) - Math.min(a, b));
		return Math.min(A, B) + per(df, Math.max(A, B) - Math.min(A, B));
	} //anl
	Number.prototype.anl = function (a, b, A, B) {
		return anl(this, a, b, A, B);
	}; {
		min = Math.min;
		max = Math.max;
		sqrt = Math.sqrt;
		cbrt = Math.cbrt;
		sin = Math.sin;
		cos = Math.cos;
		pow = Math.pow;
	}
	if (Math._prp) {
		Math._prp.forEach((function (val, ind, arr) {
			if (!this[val]) {
				this[val] = Math[val];
			}
		}).bind(this));
	}

	function xor(a, b) {
		return (a || b) && !(a && b);
	} //xor
	Boolean.prototype.xor = function (a) {
		return xor(this, a);
	};
	Object.prototype.last = function (off) {
		return this[Object.keys(this)[Object.keys(this).length - 1 - (off ? off : 0)]];
	};
	Object.prototype.first = function (off) {
		return this[Object.keys(this)[off ? off : 0]];
	};
	if (!Array.prototype.fill) {
		Array.prototype.fill = function (vl, frm, to) {
			if (frm === undefined) {
				this.forEach(function (val, ind) {
					this[ind] = vl;
				})
			} else {
				for (var stp = frm; stp <= to !== undefined ? to : (this.length - 1); stp++) {
					this[stp] = vl;
				}
			}
			return this;
		};
	}
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function (c, l) {
			var reg = new RegExp("^" + c);
			return reg.test(this.slice(l ? l : 0));
		};
	}
	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function (c, l) {
			var reg = new RegExp(c + "$");
			return reg.test(this.slice(0, l ? l : this.length));
		};
	}
	if (!String.prototype.includes) {
		String.prototype.includes = function (c, l) {
			var reg = new RegExp(c);
			return reg.test(this.slice(l ? l : 0));
		};
	}
	Array.prototype.split = function (s, j) {
		return this.join(j ? j : "").split(s ? s : "");
	};
	String.prototype.join = function (j, s) {
		return this.split(s ? s : "").join(j ? j : "");
	};
	if (!String.prototype.toString) {
		String.prototype.toString = function () {
			return this;
		};
	}
	try {
		requestAnimation = requestFrame = animationFrame = requestAnimationFrame = webkitRequestAnimationFrame || mozRequestAnimationFrame || oRequestAnimationFrame || khtmlRequestAnimationFrame || msRequestAnimationFrame || ieRequestAnimationFrame || requestAnimationFrame || setTimeout;
		if (!frame) {
			frame = animationFrame;
		}
		if (!Frame) {
			Frame = animationFrame;
		}
		if (!animation) {
			animation = animationFrame;
		}
		cancelFrame = webkitCancelAnimationFrame || cancelAnimationFrame;
		Fullscreen = requestFullScreen = webkitRequestFullScreen || mozRequestFullScreen || oRequestFullScreen || khtmlRequestFullScreen || msRequestFullScreen || ieRequestFullScreen || requestFullScreen || empty;
	}
	catch (e) {}
	if (!escape) {
		escape = encodeURI || encodeURIComponent;
	}
	if (!unescape) {
		unescape = decodeURI || decodeURIComponent;
	}
	Object.prototype.each = Object.prototype.foreach = Object.prototype.forEach = Array.prototype.each = Array.prototype.forEach;
	Number.prototype.forEach = function (func) {
		return this.toString().forEach(func);
	};
	String.prototype.each = function (c) {
		return c(this);
	};
	input = ask = prompt;
	accept = choose = confirm;
	popup = Alert = alert;
	String.prototype.splice = function (str, end) {
		return this.split("").splice(str, end ? end : (this.length - str)).join("");
	};
	Array.prototype.split = function () {
		return this;
	};
	Matrix = function Matrix(array) {
		if (!(this instanceof Matrix)) {
			return new Matrix(array);
		}
		array.each(function (val, ind, arr) {
			while (val.length < arr[0].length) {
				val.push(0);
			}
		});
		this.m = array;
		this.row = this.m.length;
		this.column = this.m[0].length;
		this.values = cmp(this.m);
		Object.defineProperty(this, "_m", {
			get: function () {
				return this.values.copy().cmp(1, this.row = this.m.length)
			},
			set: function (val) {
				this.m = val;
				this.values = cmp(this.m);
				this.row = this.m.length;
				this.column = this.m[0].length
			}
		});
		Object.defineProperty(this, "_row", {
			get: function () {
				return this.m.length
			},
			set: function (val) {
				this.m = this.values.copy().cmp(1, this.values.length / val);
				this.row = this.m.length;
				this.column = this.m[0].length
			}
		});
		Object.defineProperty(this, "_column", {
			get: function () {
				return this.m[0].length
			},
			set: function (val) {
				this.m = this.values.copy().cmp(1, this.column = val);
				this.row = this.m.length
			}
		});
		Object.defineProperty(this, "_values", {
			get: function () {
				return cmp(this.m)
			},
			set: function (val) {
				this.values = val;
				this.m = this.values.copy().cmp(1, this.column);
				this.row = this.m.length;
				this.column = this.m[0].length
			}
		});
		this.add = function (ad) {
			if (!(ad instanceof Matrix)) {
				this._values = this._values.map(function (val) {
					return val + ad * 1;
				});
			} else if (ad._row == 1 && ad._column == this._column) {
				this._values = this._values.map(function (val, ind) {
					return val + ad._values[ind % ad._column] * 1;
				});
			} else if (ad._row == this._row && ad._column == this._column) {
				this._values = this._values.map(function (val, ind) {
					return val + ad._values[ind] * 1;
				});
			}
			return this;
		};
		this.mult = this.multiply = function (ad) {
			if (!(ad instanceof Matrix)) {
				this._values = this._values.map(function (val) {
					return val * ad;
				});
			} else if (ad._row == 1 && ad._column == this._column) {
				this._values = this._values.map(function (val, ind) {
					return val * ad._values[ind % ad._column];
				});
				this._m = this._values.clone().cmp(1, this._column);
				return this._values.sum;
			} else if (ad._row == this._row && ad._column == this._column) {
				this._values = this._values.map(function (val, ind) {
					return val * ad._values[ind];
				});
				this._m = this._values.clone().cmp(1, this._column);
				return this._values.sum;
			}
			return this;
		};
		this.trans = this.transpose = function () {
			var tmp = this._row,
				nar = [];
			this._row = this._column;
			this._column = tmp;
			rep(this._row, function (stp) {
				nar.push([]);
			});
			this._m.each(function (val, ind) {
				val.each(function (va, id) {
					nar[id][ind] = va;
				});
			});
			this._m = nar;
			return this;
		};
		return this;
	} //Matrix
	function D(x, y, z) {
		this.dx = this.X = this.x = x;
		this.dy = this.Y = this.y = y;
		this.s = this.S = 1;
		this.Z = this.z = z;
		this.c = [0, 0, 0, 0, 0, 0];
		this.e = {
			x: 0,
			y: 0,
			z: 0,
			fl: 250,
			vp: 500
		};
		this.t = function (c, fl) {
			this.c = c || this.c;
			var x = deg(this.c[3]),
				y = deg(this.c[4]),
				z = deg(this.c[5]),
				X = this.x - this.c[0],
				Y = this.y - this.c[1],
				Z = this.z - this.c[2];
			var nc = [Math.cos(y) * (Math.sin(z) * Y + Math.cos(z) * X) - Math.sin(y) * Z, Math.sin(x) * (Math.cos(y) * Z + Math.sin(y) * (Math.sin(z) * Y + Math.cos(z) * X)) + Math.cos(x) * (Math.cos(z) * Y - Math.sin(z) * X), Math.cos(x) * (Math.cos(y) * Z + Math.sin(y) * (Math.sin(z) * Y + Math.cos(z) * X)) - Math.sin(x) * (Math.cos(z) * Y - Math.sin(z) * X)];
			this.X = nc[0];
			this.Y = nc[1];
			this.Z = nc[2];
			if (fl) {
				this.S = fl / (fl + this.Z);
			}
			this.T({
				x: c[0],
				y: c[1],
				z: c[2]
			});
			return nc;
		};
		this.T = function (e) {
			this.e = e || this.e;
			if (this.Z) {
				this.dx = this.e.z / this.Z * this.X - this.e.x;
				this.dy = this.e.z / this.Z * this.Y - this.e.y;
			}
			return [this.dx, this.dy];
		};
		this.i = function (d) {
			d = d || this;
			this.x = d.X;
			this.y = d.Y;
			this.z = d.Z;
			return d;
		};
		return this;
	} //D
	function hlp() {
		//<script src=https://dl.dropboxusercontent.com/s/i8vpm0vlhrlc1en/Module.js?dl=1&raw=1></script>
		alert(hlp);
		/* rel() -> reload vars
		Experimental: win(command <String>) -> save current page state & custom commands (globals: dat = page data,Win = command(s)).
		Experimental: HTMLElement.act([mode|"#$%" <String>]) -> translate pseudocode : $$code$$ -> dynamically updated node - innerHTML = result of code - 'e' current element - strings must use single-quotes,%%code%% -> replaced with code's value,##code## -> single-run code - no returns,&&CSS$$ auto vendor-prefixes - e.x.:&&&filter:invert(90%);&transform:rotate(45deg);&&-- arguement is the owner-element of the pseudocode -- put pseudo-code inside HTML comments if you face any problems with translation...
		Experimental: ele([cssQuery <String>, parent <HTMLElement>, condition <String>, stopPropagation <Boolean>]) object -> css query to a node e.x.: ele("#id.class tag[1],body*"), condition's @ is replaced to iteration object.
		Experimental: Deprecated: Array.mas(command <String>, condition <String>) array -> run command for each element of the array - element will take the place of "@" symbol(s) in command (you can append escape sequences to it to prohibit translation) e.x.: mas("clr(@,500)",ele("**")).
		Array.cmp[([depth <Number>, reversed <Number>])] -> converts multi-dimensional array to single-dinensional or opposite with specified depth.
		Experimental: dbg([show/hide <Boolean>]) -> show/hide debugging button (triggers console) - undefined = toggle.
		Experimental: cor([start/stop <Boolean>, show/hide <Boolean>]) -> show/hide cursor coordinates (coordinates are stored inside global "crd",window events inside array coor[touchstart,touchmove,touchend,mousemove]).
		Experimental: HTMLElement.src() -> shows source code of element and allows editing.
		Experimental: HTMLElement.xtr() -> extracts href/src resources from element.
		Experimental: [(NodeList|Array|HTMLElement).]mul([element <HTMLElement>, ]command <String>) -> runs a CSS style for all vendors (prefixes) - vendor prefix will take the position of "@" symbol(s) on right-hand of assignment e.x.: transform="rotate(45deg)".
		Experimental: [(NodeList|Array|HTMLElement).]tog([element <HTMLElement>, ]cmilliseconds <Number>, value <Number>[, callback <String>]) -> toggle visibility of an element.
		Experimental: [(NodeList|Array|HTMLElement).]exp([element <HTMLElement>, ]cmilliseconds <Number>, value <Number>[, callback <String>]) -> expand/collapse element.
		Experimental: [(NodeList|Array|HTMLElement).]tra([element <HTMLElement>, ]cmilliseconds <Number>, value <Number>[, callback <String>]) -> reposition element.
		[Array.]rnd([from <Number>, to <Number>, non-rounded <Boolean>])|Rnd|Array.Rnd -> random number/element,leave arg(s) blank for random HEX.
		swt([append <String>]) -> refresh specific funcs and append flags on auto switch.
		[Math.]dst(x <Number>, y <Number>[, d <Number>]) -> provide (x,y) to calculate distance with pythagorean,provide (x||y,d) to calculate the missing parameter, (x,y,1) for degrees.
		[Math.]Dst(x1 <Number>, x2 <Number>, y1 <Number>, y2 <Number>) -> dst between 2 objects.
		[Math.]dst3(x <Number>, y <Number>, z <Number>, d <Number>) -> 3D dst.
		[Math.]Dst3(x <Number>, y <Number>, z <Number>, X <Number>, Y <Number>, Z <Number>) -> Dst between 2 objects.
		[Math.]col(x <Number>, y <Number>, X <Number>, Y <Number>, dx <Number>, dy <Number>, dX <Number>, dY <Number>) -> check if boxes collide.
		[Math.]col(X <Number>, Y <Number>, dx <Number>, dy <Number>, x <Number>, y <Number>, r <Number>) -> box-circle.
		[Math.]col(x <Number>, y <Number>, r <Number>, X <Number>, Y <Number>, R <Number>) -> circle-circle.
		[Math.]col(x <Number>, y <Number>, r <Number>, X <Number>, Y <Number>) -> circle-point.
		[Math.]col(x <Number>, y <Number>, r <Number>, ro <Number>, s <Number>, X <Number>, Y <Number>, R <Number>, RO <Number>, S <Number>) -> perfect polygon collisions.
		[Math.]col3(x <Number>, y <Number>, z <Number>, r <Number>, X <Number>, Y <Number>, Z <Number>, R <Number>) -> 3D spheres.
		Experimental: Deprecated: cn() -> import canvas module and css extension.
		[(Number|String|Function).]rep([count <Number>, command <Function>, intial <Number>]) -> repeat a command.
		[(Math|Number).]deg([degrees <Number>, radians <Boolean>]) -> convert degrees <=> radians.
		Experimental: fon() -> adjust viewport to fullscreen.
		[(Number|Math).]anl([number <Number>, ]min <Number>, max <Number>, Min <Number>, Max <Number>) -> number from range [min,max] to range [Min,Max] analogically.
		[(Math|Number).]per([number <Number>, ]percentance <Number>[, scale=100 <Number>]) -> returns percentance of number.
		[(String|NodeList|Array|HTMLElement).]crt([elementType <String|Array>, parent=document <HTMLElement|NodeList>]) -> create an html element and append on parent.
		Experimental: ajx(URL <String>[, onloadFunction <Function>, method="GET" <String>, data <String>, synchronous <Boolean>, username <String>, password <String>]) -> perform an AJAX request.
		(String|Array|Number).wrp(wrap <String>) -> wrap between.
		[(Function|String|Number).]con([command <Function>, ]interval <Number>) -> run a command constantly, like setInterval but ignores first interval cooldown time.
		[(String|NodeList|Array|HTMLElement).]rem([element <HTMLElement|Array|NodeList|String>]) -> remove html element from its parent.
		Object.((ins|Ins)()|_ins|_Ins) -> inspect object enumerable properties or stringify non circular struct.
		Object.((prp|Prp)(index <Number>)|_prp) -> grab object property (value|key) by index.
		Object.(keys()|Keys) -> an alternative of Object.keys(object)
		Object.(values()|Values) -> an alternative of Object.values(object)
		Deprecated: String.dup(times <Number>) -> repeat string pattern. Pollyfill of String.repeat.
		[Boolean.](alt([boolean  <Boolean>])|Alt) -> alternate boolean value.
		Number.(sig()|Sig)|[Math.]sig(number <Number>) -> signum (+1/-1/0).
		(Array|String).rmv(index) -> remove item from array/string.
		(String|Array|Number).wrp(wr) -> wrap between.
		Deprecated: Array.(pure()|Pure) -> grab array value instead of pointer.
		Image.(data()|Data) -> export image as base64.
		Array.(shf()|Shf) -> shuffle.
		Object.(last(index <Number>)|Last) -> last element.
		Object.(first(index <Number>)|First) -> first element.
		(Number|Math).lim(min <Number>, max <Number>) -> limit number range.
		(Number|Math).Lim(min <Number>, max <Number>) -> circular limit.
		(Number|Array).(sum()|Sum) -> sum of range (0,this).
		(Number|Array).(fac()|Fac) -> factorial of range.
		[Object.](bool([item <Object>])|Bool) -> boolean representation.
		par(function <String>, number <Number>, name <String>, code <String>) -> create number with specific number of params... E.x. : par("func",5,"param",function(){alert(param2)}||"alert(param2)") - func=function func(param1,param2,param3,param4,param5,param,param0){alert(param2)}.
		Math.(Max|Min)(numarray <Array>)|Array.((min|max)()|(Min|Max)) -> max/min num of array.
		Array.fill(value <Object>[, from <Number>, to <Number>]) -> fill polyfill.
		[Boolean.]xor(a <Boolean>[, b <Boolean>]) -> a or b but not both.
		Array.add(element <Object>) -> add element if not already in array.
		Array.has(element <Object>) -> check if array has element.
		Array.togg(element <Object>) -> toggle array element.
		Array.flt() -> array elements become unique.
		Array.inh(array <Array>) -> inherit on real array.
		Matrix(2Darray <Array>) -> math matrix class, m : array, values : singledimensional m, row : row length , column : column length, trans() : transpose, mult(<Matrix|Number>) : multiply, add(<Matrix|Number>) : add.
		D(x <Number>,y <Number>,z <Number>) -> 3D point, t(camera <Array>), T(distance <Object>), i().
		err -> errors
		X -> page width
		Y -> page height
		Xx -> screen width
		Yy -> screen height
		Dif -> smallest dimension of screen
		dif -> smallest dimension of page
		doc -> document
		loc -> location
		csl -> console
		nav -> navigator
		Win -> window or last load command
		dat -> page savedata
		auto -> mode switch, strict = no getters
		Auto -> like auto but bitwise
		AUTO -> Auto's constants
		nul -> function(){}
		Sec -> uptime
		alph -> "abcdefghijklmnopqrtsuvwxyz"
		ALPH -> alph.toUpperCase()
		Alph -> (alph+ALPH+"0123456789")
		online -> online
		prefix -> ["moz","webkit","o","ms","khtml","ie"]
		mobile -> mobile/pc bool
		UA -> user agent
		Rnd -> random HEX color
		cor -> realtime coordinates of cursor ( of cor() ) */
	} //hlp
}
catch (a) {
	err += a + "\n"
}
