/** @module nodemodule */

/**
 * @file nodemodule.js
 * @author ValentinHacker
 * @copyright ValentinHacker 2018
 */

/**
 * @external Object
 */
/**
 * @external Math
 */
/**
 * @external Array
 */
/**
 * @external Number
 */
/**
 * @external String
 */
/**
 * @external Function
 */
/**
 * @external Boolean
 */
 
/**
 * @todo finish documentation
 * @todo do full checkup
 * @todo upgrade/correct
 */
 
if (typeof module == 'undefined') {
	var exports = module = {};
}

if (typeof global == 'undefined') global = this;
if (!global.alert) {
	global.alert = global.console.log;
}

/**
 * Expose globals.
 * 
 * @example
 * 
 * expose()
 * 
 * @since 1.1.2
 * @static
 * @function expose
 */

const expose = exports.expose = function expose() {
	for (var par in module) {
		global[par] = global[par] || module[par];
	}
	for (var par in Math) {
		global[par] = global[par] || Math[par];
	}
};

'use strict';

/**
 * Functionality.
 * 
 * @deprecated
 * @type {string}
 * @static
 */
var auto = exports.auto = "strict";
/*  <true> : manual becomes automated,
	strict : getters/setters,
	heavy : slow funcs replace normal funcs,
	light : fast funcs replace normal ones,
	global : module conquers global namespace
*/

/**
 * Alternative of {@link auto}.
 * 
 * @enum AUTO
 * @static
 * @readonly
 * @deprecated
 */
const AUTO = exports.AUTO = new Object();
Object.defineProperties(AUTO, /** @lends AUTO */ {
	/** @memberof AUTO */
	STRICT: {
		value: 1,
		writable: false,
		configurable: false
	},
	/** @memberof AUTO */
	HEAVY: {
		value: 2,
		writable: false,
		configurable: false
	},
	/** @memberof AUTO */
	LIGHT: {
		value: 4,
		writable: false,
		configurable: false
	},
	/** @memberof AUTO */
	GLOBAL: {
		value: 8,
		writable: false,
		configurable: false
	}
});
/**
 * Functionality *Bitwise*.
 * 
 * @see {@link auto}
 * @deprecated
 * @static
 * @type {AUTO}
 */
var Auto = exports.Auto = AUTO.STRICT;
/*
	Auto |= Constant //add once
	Auto ^= Constant //toggle
	(Auto & Constant) == Constant //check
	Auto &= ~Constant //remove once
*/

/**
 * Switch functionality
 * 
 * @example
 * 
 * swt('strict');
 * 
 * @deprecated
 * @function swt
 * @param {string} auto - Append flag to {@link auto}.
 * @return {string} auto
 */
const swt = exports.swt = function swt(a) {
	if (a) auto = auto.toString() + a;
	if (!/strict/gmi.test(auto.toString()) && (Auto & AUTO.STRICT) != AUTO.STRICT) {
		try {
			if (!Object.prototype._ins) {
				Object.defineProperty(Object.prototype, '_ins', {
					configurable: false,
					get value() {
						return this.ins();
					}
				});
			}
			if (!Object.prototype._Ins) {
				Object.defineProperty(Object.prototype, '_Ins', {
					configurable: false,
					get value() {
						return this.Ins();
					}
				});
			}
			if (!Object.prototype._names) {
				Object.defineProperty(Object.prototype, '_names', {
					configurable: false,
					get value() {
						return this.names();
					}
				});
			}
			if (!Object.prototype._values) {
				Object.defineProperty(Object.prototype, '_values', {
					configurable: false,
					get value() {
						return this.values();
					}
				});
			}
			if (!Object.prototype._keys) {
				Object.defineProperty(Object.prototype, '_keys', {
					configurable: false,
					get value() {
						return this.keys();
					}
				});
			}
			if (!Object.prototype.string) {
				Object.defineProperty(Object.prototype, 'string', {
					configurable: false,
					get value() {
						return this.toString();
					}
				});
			}
			if (!Object.prototype._last) {
				Object.defineProperty(Object.prototype, '_last', {
					configurable: false,
					get value() {
						return this.last();
					}
				});
			}
			if (!Object.prototype._first) {
				Object.defineProperty(Object.prototype, '_first', {
					configurable: false,
					get value() {
						return this.first();
					}
				});
			}
			if (!Object.prototype._alt) {
				Object.defineProperty(Object.prototype, '_alt', {
					configurable: false,
					get value() {
						return this.alt();
					}
				});
			}
		} catch(e) { }
	}
	if (!/global/gmi.test(auto.toString()) && (Auto & AUTO.GLOBAL) != AUTO.GLOBAL) {
		try {
			expose();
		} catch(err) { }
	}
	return auto;
};
try {
swt();
if (!exports._rnd) {
	Object.defineProperty(exports, '_rnd', {
		get value() {
			return rnd();
		},
		configurable: false
	});
}
if (!Array.prototype.datatype) {
	Object.defineProperty(Array.prototype, "datatype", {
		configurable: false,
		get value() {
			var type = 0;
			for (var stp = 0; stp < this.length; stp++) {
				if ((typeof this[stp] == "number" && !type) || (typeof this[stp] == "string" && type < 2) || ((this[stp] instanceof Array) && type < 3) || ((this[stp] instanceof Object) && type < 4)) {
					type++
				}
			}
			return type == 1 ? "Number" : (type == 2 ? "String" : (type == 3 ? "Array" : "Object"));
		},
		set value(val) {
			var cls = eval(val || this.datatype),
			nar = [];
			this.forEach((function(val, ind, arr) {
				nar.push(new cls(val));
			}).bind(this));
			this.inh(nar);
		}
	});
}
[Array, String, Number, Boolean, Function].forEach(function(each) {
	if (!each.prototype._ins) {
		Object.defineProperty(each.prototype, '_ins', {
			configurable: false,
			get value() {
				return this.ins();
			}
		});
	}
	if (!each.prototype._Ins) {
		Object.defineProperty(each.prototype, '_Ins', {
			configurable: false,
			get value() {
				return this.Ins();
			}
		});
	}
	if (!each.prototype._names) {
		Object.defineProperty(each.prototype, '_names', {
			configurable: false,
			get value() {
				return this.names();
			}
		});
	}
	if (!each.prototype._values) {
		Object.defineProperty(each.prototype, '_values', {
			configurable: false,
			get value() {
				return this.values();
			}
		});
	}
	if (!each.prototype._keys) {
		Object.defineProperty(each.prototype, '_keys', {
			configurable: false,
			get value() {
				return this.keys();
			}
		});
	}
	if (!each.prototype.string) {
		Object.defineProperty(each.prototype, 'string', {
			configurable: false,
			get value() {
				return this.toString();
			}
		});
	}
	if (!each.prototype._last) {
		Object.defineProperty(each.prototype, '_last', {
			configurable: false,
			get value() {
				return this.last();
			}
		});
	}
	if (!each.prototype._first) {
		Object.defineProperty(each.prototype, '_first', {
			configurable: false,
			get value() {
				return this.first();
			}
		});
	}
	if (!each.prototype._alt) {
		Object.defineProperty(each.prototype, '_alt', {
			configurable: false,
			get value() {
				return this.alt();
			}
		});
	}
});
if (!Array.prototype._sum) {
	Object.defineProperty(Array.prototype, "_sum", {
		configurable: false,
		get value() {
			return this.sum();
		}
	});
}
if (!Array.prototype._fac) {
	Object.defineProperty(Array.prototype, "_fac", {
		configurable: false,
		get value() {
			return this.fac();
		}
	});
}
if (!Array.prototype._copy) {
	Object.defineProperty(Array.prototype, "_copy", {
		configurable: false,
		get value() {
			return this.copy();
		}
	});
}
if (!Array.prototype._cmp) {
	Object.defineProperty(Array.prototype, "_cmp", {
		configurable: false,
		get value() {
			return this.cmp();
		}
	});
}
if (!Array.prototype._rnd) {
	Object.defineProperty(Array.prototype, "_rnd", {
		configurable: false,
		get value() {
			return this.rnd();
		}
	});
}
if (!Array.prototype._shf) {
	Object.defineProperty(Array.prototype, "_shf", {
		configurable: false,
		get value() {
			return this.shf();
		}
	});
}
if (!Array.prototype._max) {
	Object.defineProperty(Array.prototype, "_max", {
		configurable: false,
		get value() {
			return this.max();
		}
	});
}
if (!Array.prototype._min) {
	Object.defineProperty(Array.prototype, "_min", {
		configurable: false,
		get value() {
			return this.min();
		}
	});
}
if (!String.prototype._bool) {
	Object.defineProperty(String.prototype, "_bool", {
		configurable: false,
		get value() {
			return this.bool();
		}
	});
}
if (!Number.prototype._sign) {
	Object.defineProperty(Number.prototype, "_sign", {
		configurable: false,
		get value() {
			return this.sig();
		}
	});
}
} catch(err) { }

/**
 * Null function.
 * 
 * @static
 * @const
 * @function nul
 */
const nul = exports.nul = function() {},
/**
 * Falsey values RegExp.
 * 
 * @static
 * @type {RegExp}
 * @const
 */
falseReg = exports.falseReg = /^(false|null|""|''|0|off|no|[]|{}|``|)$/gi,
/**
 * Latin lowercase letterstring.
 * 
 * @static
 * @type {string}
 * @const
 * @summary abcdefghijklmnopqrstuvwxyz
 */
alph = exports.alph = "abcdefghijklmnopqrtsuvwxyz",
/**
 * Latin uppercase letterstring.
 * 
 * @static
 * @type {string}
 * @const
 * @summary ABCDEFGHIJKLMNOPQRSTUVWXYZ
 */
ALPH = exports.ALPH = alph.toUpperCase(),
/**
 * Latin letterstring and numbers.
 * 
 * @static
 * @type {string}
 * @const
 * @summary 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
 */
Alph = exports.Alph = (alph + ALPH + "0123456789");

/**
 * Array single-dimensionizer. **Does not edit original**.
 * 
 * @function cmp
 * @example
 * 
 * cmp([1, 2, 3, 4, 5]); //[1, 2, 3, 4, 5]
 * cmp([[1, 2], [3], [[4]]]); //[1, 2, 3, 4]
 * 
 * @static
 * @param {Array} arr - Target Array.
 * @return {Array} - New Array.
 */
const cmp = exports.cmp = function cmp(arr) {
	var nar = [];
	for (var mat = 0; mat < arr.length; mat++) {
		if (arr[mat] !== undefined) {
			if (!(arr[mat] instanceof Array) || arr[mat].length === undefined) {
				nar.push(arr[mat]);
			} else {
				nar = nar.concat(cmp(arr[mat]));
			}
		}
	}
	return nar;
};

/**
 * Array single/multi-dimensionizer. **Edits original**.
 * 
 * @example
 * 
 * [1, 2, 3, 4, 5].cmp(1,3); //[[1, 2, 3], [4, 5]]
 * [[1, 2], [3], [[4]]].cmp(); //[1, 2, 3, 4]
 * 
 * @function external:Array#cmp
 * @see {@link cmp}
 * @todo Add depth.
 * @param {number} times - Times to multiplicate.
 * @param {number} length - Length to split.
 * @param {number} [depth] - Depth of pairs.
 * @return {Array} this
 */
Array.prototype.cmp = Array.prototype.cmp || function (dpt, rev, inn) {
	var nar = [];
	if (!rev) {
		if (!dpt) {
			return this.inh(cmp(this));
		}
		while (dpt-- > 0) {
			this.each(function(val, ind, arr) {
				if (val instanceof Array) {
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
			rep(this.length / rev, (function(stp) {
				nar.push(this.slice(stp * rev, rev + stp * rev));
			}).bind(this));
		}
		this.inh(nar);
		nar = [];
	}
	return this;
};

/**
 * String single/multi-dimensionizer. **Does not edit original**.
 * 
 * @function external:String#cmp
 * @see {@link cmp}
 * @param {number} times - Times to multiplicate.
 * @param {number} length - Length to split.
 * @param {number} [depth] - Depth of pairs.
 * @return {Array} this.split('')
 */
String.prototype.cmp = String.prototype.cmp || function (dpt, rev, inn) {
	return this.split('').cmp(dpt, rev, inn);
};

/*const rnd = exports.rnd = function rnd(frm, to, rd) {
	if (frm === undefined) {
		return "#" + Math.round(Math.random() * 16777215).toString(16);
	} else {
		to = to === undefined ? frm : to;
		frm = frm == to ? 0 : frm;
		var tmp = [Math.min(frm, to), Math.max(frm, to)];
		frm = tmp[0];
		to = tmp[1];
		return !rd ? Math.round(Math.random() * (to - frm) + frm) : (Math.random() * (to - frm) + frm);
	}
};*/

/**
 * Random.
 * @function rnd
 * @example
 * 
 * rnd(100); //from 0 to 100 rounded
 * rnd(10, 100); //from 10 to 100 rounded
 * rnd(10, 100, 1); //from 10 to 100 double
 * rnd(); //HEX color : '#ffeeaa'
 * 
 * @static
 * @param {number} [frm] - From.
 * @param {number} [to] - To.
 * @param {boolean} [rd] - Not-Rounded?
 * @return {(string|number)} Returns random number, or hex colorstring if no parameters.
 */
const rnd = exports.rnd = function rnd(frm, to, rd) {
	if (frm === undefined) {
		return "#" + Math.round(Math.random() * 16777215).toString(16);
	} else {
		to = to === undefined ? frm : to;
		frm = frm == to ? 0 : frm;
		var tmp = [Math.min(frm, to), Math.max(frm, to)];
		frm = tmp[0] ? tmp[0] : 0;
		to = tmp[1];
		return !rd || [frm, to].every(function(val) {
			return !/\./gmi.test(val.toString())
		}) ? Math.round(Math.random() * (to - frm) + frm) : (Math.random() * (to - frm) + frm);
	}
};

/**
 * Random.
 * @function external:Math.rnd
 * @example
 * 
 * Math.rnd(100); //from 0 to 100 rounded
 * Math.rnd(10, 100); //from 10 to 100 rounded
 * Math.rnd(10, 100, 1); //from 10 to 100 double
 * Math.rnd(); //HEX color : '#ffeeaa'
 * 
 * @see {@link rnd}
 * @param {number} [from] - From.
 * @param {number} [to] - To.
 * @param {boolean} [rd] - Not-Rounded?
 * @return {(string|number)} Returns random number, or hex colorstring if no parameters.
 */
Math.rnd = Math.rnd || rnd;

/**
 * Random.
 * @function external:Number#rnd
 * @example
 * 
 * 100..rnd(); //from 0 to 100 rounded
 * 100..rnd(10); //from 10 to 100 rounded
 * 100..rnd(10, 1); //from 10 to 100 double
 * 
 * @see {@link rnd}
 * @param {number} [from] - From.
 * @param {number} [to] - To.
 * @param {boolean} [rd] - Not-Rounded?
 * @return {(string|number)} Returns random number, or hex colorstring if no parameters.
 */
Number.prototype.rnd = Number.prototype.rnd || function (frm, rd) {
	return rnd(frm, this, rd);
};

/**
 * Random.
 * @function external:Array#rnd
 * @example
 * 
 * [1, 2, 5].rnd(); //Random element of array
 * 
 * @see {@link rnd}
 * @param {number} [from] - From indice.
 * @param {number} [to] - To indice.
 * @param {boolean} [rd] - Return Indice.
 * @return {*} Returns random item of array, or indice when 'rd' is 'true'.
 */
Array.prototype.rnd = Array.prototype.rnd || function (frm, to, rd) {
	var ind = rnd(frm ? frm : 0, to || (this.length - 1));
	if (rd) {
		return ind;
	}
	return this[ind];
};

/**
 * Random.
 * @function external:String#rnd
 * @example
 * 
 * "abcde".rnd(); //Random element of stringarray
 * 
 * @see {@link rnd}
 * @param {number} [from] - From indice.
 * @param {number} [to] - To indice.
 * @param {boolean} [rd] - Return Indice.
 * @return {*} Returns random item of stringarray, or indice when 'rd' is 'true'.
 */
String.prototype.rnd = String.prototype.rnd || function (frm, to, rd) {
	return this.split('').rnd(frm, to, rd);
};

/**
 * Distance calculator.
 * 
 * @example
 * 
 * dst(1, 1); //Distance from (0, 0) to (1, 1)
 * dst(1, null, 1) //Calculate Y from X and Distance
 * dst(null, 1, 1) //Calculate X from Y and Distance
 * dst(1, 2, true) //Calculate angle of view from (0, 0) to (1, 2) [in degrees]
 * 
 * @summary Pythagorean Hypotineuse
 * @function dst
 * @static
 * @param {number} [x] - X-coordinate.
 * @param {number} [y] - Y-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {number} Missing parameter.
 */
const dst = exports.dst = function dst(x, y, d) {
	if (x !== undefined && y !== undefined && d === undefined) {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	} else if (d !== undefined && (x !== null || y !== null) && (x === null || y === null)) {
		return Math.sqrt(Math.pow(d, 2) - Math.pow(y !== null ? y : (x !== null ? x : 0)));
	} else if (x !== undefined && y !== undefined && d !== undefined) {
		return Math.atan2(y, x) * 180 / Math.PI;
	}
	console.warn("Invalid arguments passed to dst()");
	return 0;
};

/**
 * Distance calculator.
 * 
 * @example
 * 
 * Math.dst(1, 1); //Distance from (0, 0) to (1, 1)
 * Math.dst(1, null, 1) //Calculate Y from X and Distance
 * Math.dst(null, 1, 1) //Calculate X from Y and Distance
 * Math.dst(1, 2, true) //Calculate angle of view from (0, 0) to (1, 2) [in degrees]
 * 
 * @see {@link dst}
 * @function external:Math.dst
 * @static
 * @param {number} [x] - X-coordinate.
 * @param {number} [y] - Y-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {number} Missing parameter.
 */
Math.dst = Math.dst || dst;

/**
 * Distance calculator.
 * 
 * @example
 * 
 * 1..dst(2); //Distance from (0, 0) to (1, 2)
 * 1..dst(); //Cube root of 1
 * 
 * @see {@link dst}
 * @function external:Number#dst
 * @param {number} [a] - Other coordinate.
 * @return {number} Distance.
 */
Number.prototype.dst = Number.prototype.dst || function (a) {
	if (a === undefined) {
		return Math.cbrt(this);
	}
	return Math.sqrt(Math.pow(this, 2) - Math.pow(a, 2));
};

/**
 * Distance calculator.
 * 
 * @example
 * 
 * Dst(1, 1, 2, 2); //Distance from (1, 1) to (2, 2)
 * Dst(1, 1, 2, 2, true) //Calculate angle of view from (1, 1) to (2, 2) [in degrees]
 * 
 * @see {@link dst}
 * @variation 2
 * @function Dst
 * @static
 * @param {number} [x] - From-X-coordinate.
 * @param {number} [y] - From-Y-coordinate.
 * @param {number} [X] - To-X-coordinate.
 * @param {number} [Y] - To-Y-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {number} Distance.
 */
const Dst = exports.Dst = function Dst(x, y, X, Y, d) {
	return dst(x - X, y - Y, d);
};

/**
 * Distance calculator.
 * 
 * @example
 * 
 * Math.Dst(1, 1, 2, 2); //Distance from (1, 1) to (2, 2)
 * Math.Dst(1, 1, 2, 2, true) //Calculate angle of view from (1, 1) to (2, 2) [in degrees]
 * 
 * @see {@link dst}
 * @variation 2
 * @function external:Math.Dst
 * @static
 * @see {@link Dst}
 * @param {number} [x] - From-X-coordinate.
 * @param {number} [y] - From-Y-coordinate.
 * @param {number} [X] - To-X-coordinate.
 * @param {number} [Y] - To-Y-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {number} Distance.
 */
Math.Dst = Math.Dst || Dst;

/**
 * Distance calculator 3D.
 * 
 * @example
 * 
 * dst3(1, 1, 1); //Distance from (0, 0, 0) to (1, 1, 1)
 * dst3(1, 1, 1, true) //Calculate angle of view from (0, 0, 0) to (1, 1, 1) [in degrees]
 * 
 * @function dst3
 * @static
 * @param {number} [x] - X-coordinate.
 * @param {number} [y] - Y-coordinate.
 * @param {number} [z] - Z-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {(number|number[])} Distance/AngleArray.
 */
const dst3 = exports.dst3 = function dst3(x, y, z, d) {
	if (d === undefined) {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
	} else if ((x !== undefined && y !== undefined) && (x !== null && y !== null) && d === undefined) {
		return Math.sqrt(Math.pow(d, 2) - Math.pow(y, 2) - Math.pow(x, 2));
	} else if ((x !== undefined && z !== undefined) && (x !== null && z !== null) && d === undefined) {
		return Math.sqrt(Math.pow(d, 2) - Math.pow(z, 2) - Math.pow(x, 2));
	} else if ((z !== undefined && y !== undefined) && (y !== null && z !== null) && d === undefined) {
		return Math.sqrt(Math.pow(d, 2) - Math.pow(y, 2) - Math.pow(z, 2));
	} else if ([x, y, z, d].every(function(val) {
			return val !== undefined
		})) {
		return [Math.atan2(y, z) * 180 / Math.PI, Math.atan2(z, x) * 180 / Math.PI, Math.atan2(y, x) * 180 / Math.PI];
	}
	console.warn("Invalid arguments passed to dst3()");
	return 0;
};

/**
 * Distance calculator 3D.
 * 
 * @example
 * 
 * Math.dst3(1, 1, 1); //Distance from (0, 0, 0) to (1, 1, 1)
 * Math.dst3(1, 1, 1, true) //Calculate angle of view from (0, 0, 0) to (1, 1, 1) [in degrees]
 * 
 * @function external:Math.dst3
 * @static
 * @see {@link dst3}
 * @param {number} [x] - X-coordinate.
 * @param {number} [y] - Y-coordinate.
 * @param {number} [z] - Z-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {(number|number[])} Distance/AngleArray.
 */
Math.dst3 = Math.dst3 || dst3;

/**
 * Distance calculator 3D.
 * 
 * @example
 * 
 * Dst3(1, 1, 1, 2, 2, 2); //Distance from (1, 1, 1) to (2, 2, 2)
 * Dst3(1, 1, 1, 2, 2, 2, true) //Calculate angle of view from (1, 1, 1) to (2, 2, 2) [in degrees]
 * 
 * @variation 2
 * @function Dst3
 * @static
 * @param {number} [x] - From-X-coordinate.
 * @param {number} [y] - From-Y-coordinate.
 * @param {number} [z] - From-Z-coordinate.
 * @param {number} [X] - To-X-coordinate.
 * @param {number} [Y] - To-Y-coordinate.
 * @param {number} [Z] - To-Z-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {(number|number[])} Distance/AngleArray.
 */
const Dst3 = exports.Dst3 = function Dst3(x, y, z, X, Y, Z, d) {
	return dst3(x - X, y - Y, z - Z, d);
};

/**
 * Distance calculator 3D.
 * 
 * @example
 * 
 * Math.Dst3(1, 1, 1, 2, 2, 2); //Distance from (1, 1, 1) to (2, 2, 2)
 * Math.Dst3(1, 1, 1, 2, 2, 2, true) //Calculate angle of view from (1, 1, 1) to (2, 2, 2) [in degrees]
 * 
 * @variation 2
 * @see {@link Dst3}
 * @function external:Math.Dst3
 * @static
 * @param {number} [x] - From-X-coordinate.
 * @param {number} [y] - From-Y-coordinate.
 * @param {number} [z] - From-Z-coordinate.
 * @param {number} [X] - To-X-coordinate.
 * @param {number} [Y] - To-Y-coordinate.
 * @param {number} [Z] - To-Z-coordinate.
 * @param {(number|boolean)} [d] - Distance/Angle-Mode.
 * @return {(number|number[])} Distance/AngleArray.
 */
Math.Dst3 = Math.Dst3 || Dst3;

/**
 * Collision detection.
 * 
 * @example
 * 
 * col(x, y, X, Y, dx, dy, dX, dY) // box-box : (x, y) with size (dx, dy) collides with (X, Y) with size (dX, dY)
 * col(x, y, dx, dy, X, Y, r) // box-circle : (x, y) with size (dx, dy) collides with (X, Y) with radius (r)
 * col(x, y, dx, X, Y) // circle-point : (x, y) with size (dx, dy) collides with (X, Y)
 * ...
 * 
 * @static
 * @function col
 * @param {number} x - x1
 * @param {number} y - y1
 * @param {number} X - x2
 * @param {number} Y - y2
 * @param {number} [dx] - dx1
 * @param {number} [dy] - dy1
 * @param {number} [dX] - dx2
 * @param {number} [dY] - dy2
 * @param {number} [r] - radius
 * @param {number} [s] - size
 * @return {boolean} Collides?
 */
const col = exports.col = function col(x, y, X, Y, dx, dy, dX, dY, r, s) {
	if (dY !== undefined && r === undefined && s === undefined) {
		var bx = Math.min(x, X, x + dx, X + dX);
		var by = Math.min(y, Y, y + dy, Y + dY);
		var Bx = Math.max(x, X, x + dx, X + dX);
		var By = Math.max(y, Y, y + dy, Y + dY);
		return Math.abs(Bx - bx) <= dx + dX && Math.abs(By - by) <= dy + dY;
		//box-box x,y,X,Y,dx,dy,dX,dY 8
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
};

/**
 * Collision detection.
 * 
 * @example
 * 
 * Math.col(x, y, X, Y, dx, dy, dX, dY) // box-box : (x, y) with size (dx, dy) collides with (X, Y) with size (dX, dY)
 * Math.col(x, y, dx, dy, X, Y, r) // box-circle : (x, y) with size (dx, dy) collides with (X, Y) with radius (r)
 * Math.col(x, y, dx, X, Y) // circle-point : (x, y) with size (dx, dy) collides with (X, Y)
 * ...
 * 
 * @static
 * @see {@link col}
 * @function external:Math.col
 * @param {number} x - x1
 * @param {number} y - y1
 * @param {number} X - x2
 * @param {number} Y - y2
 * @param {number} [dx] - dx1
 * @param {number} [dy] - dy1
 * @param {number} [dX] - dx2
 * @param {number} [dY] - dy2
 * @param {number} [r] - radius
 * @param {number} [s] - size
 * @return {boolean} Collides?
 */
Math.col = Math.col || col;

/**
 * Collision detection 3D.
 * 
 * @example
 * 
 * col3(x, y, r, X, Y, R) // circle-point : (x, y) with radius (r) collides with (X, Y) with radius (R)?
 * 
 * @todo Add more shapes.
 * @static
 * @function col3
 * @param {number} x - x1
 * @param {number} y - y1
 * @param {number} z - z1
 * @param {number} [r=0] - radius1
 * @param {number} X - x2
 * @param {number} Y - y2
 * @param {number} Z - z2
 * @param {number} [R=0] - radius2
 * @return {boolean} Collides?
 */
const col3 = exports.col3 = function col3(x, y, z, r, X, Y, Z, R) {
	return Dst3(x, y, z, X, Y, Z) <= r + R;
	//circle/point-circle/point
};

/**
 * Collision detection 3D.
 * 
 * @example
 * 
 * Math.col3(x, y, r, X, Y, R) // circle-point : (x, y) with radius (r) collides with (X, Y) with radius (R)?
 * 
 * @static
 * @see {@link col3}
 * @function external:Math.col3
 * @param {number} x - x1
 * @param {number} y - y1
 * @param {number} z - z1
 * @param {number} [r=0] - radius1
 * @param {number} X - x2
 * @param {number} Y - y2
 * @param {number} Z - z2
 * @param {number} [R=0] - radius2
 * @return {boolean} Collides?
 */
Math.col3 = Math.col3 || col3;

/**
 * Repeat
 * 
 * @example
 * 
 * rep(5, func) // Execute func 5 times
 * 
 * @static
 * @function rep
 * @param {number} times - Times.
 * @param {(string|Function)} command - Function.
 * @param {number} [ini=0] - From/Initial.
 * @return {Array} Outputs of executions.
 */
const rep = exports.rep = function rep(cnt, com, ini) {
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
};

/**
 * Repeat
 * 
 * @example
 * 
 * 'func()'.rep(5) // Execute func 5 times
 * 
 * @static
 * @function external:String#rep
 * @param {number} times - Times.
 * @param {(string|Function)} command - Function.
 * @param {number} [ini=0] - From/Initial.
 * @return {Array} Outputs of executions.
 */
/**
 * Repeat
 * 
 * @example
 * 
 * func.rep(5) // Execute func 5 times
 * 
 * @variation 2
 * @static
 * @function external:Function#rep
 * @param {number} times - Times.
 * @param {(string|Function)} command - Function.
 * @param {number} [ini=0] - From/Initial.
 * @return {Array} Outputs of executions.
 */
String.prototype.rep = Function.prototype.rep = Function.prototype.rep || function (cnt, ini) {
	return rep(cnt, this, ini);
};

/**
 * Angle
 * 
 * @example
 * 
 * deg('2π', true) //3.14... (π)
 * deg(3.14) //180
 * 
 * @static
 * @function deg
 * @summary Rad to Deg converter.
 * @param {number} dg - Angle.
 * @param {boolean} [rad=false] - Radians?
 * @return {number} Angle
 */
const deg = exports.deg = function deg(dg, rd) {
	if (typeof dg != "string" && !rd) {
		return (dg / 180) * Math.PI;
		//rad
	} else {
		return (Number(dg.toString().replace("π", Math.PI)) / Math.PI) * 180;
	}
};

/**
 * Angle
 * 
 * @example
 * 
 * 3.14..deg() //180
 * 
 * @static
 * @see {@link deg}
 * @function external:Number#deg
 * @summary Rad to Deg converter.
 * @param {boolean} [rad=false] - Radians?
 * @return {number} Angle
 */
Number.prototype.deg = Number.prototype.deg || function (rd) {
	return deg(this, rd);
};

/**
 * Angle
 * 
 * @example
 * 
 * Math.deg('2π', true) //3.14... (π)
 * Math.deg(3.14) //180
 * 
 * @static
 * @function external:Math.deg
 * @summary Rad to Deg converter.
 * @param {number} dg - Angle.
 * @param {boolean} [rad=false] - Radians?
 * @return {number} Angle
 */
Math.deg = Math.deg || deg;

/**
 * Percent
 * 
 * @example
 * 
 * per(5, 10) //50
 * per(5, 10, 50) //25
 * 
 * @static
 * @function per
 * @param {number} pr - Percent
 * @param {number} mx - Max
 * @param {number} [gr=100] - Base
 * @return {number} Percentance
 */
const per = exports.per = function per(pr, mx, gr) {
	var gr = gr || 100;
	return (pr / mx) * gr;
};

/**
 * Percent
 * 
 * @example
 * 
 * Math.per(5, 10) //50
 * Math.per(5, 10, 50) //25
 * 
 * @static
 * @see {@link per}
 * @function external:Math.per
 * @param {number} pr - Percent
 * @param {number} mx - Max
 * @param {number} [gr=100] - Base
 * @return {number} Percentance
 */
Math.per = Math.per || per;

/**
 * Percent
 * 
 * @example
 * 
 * 5..per(10) //50
 * 5..per(10, 50) //25
 * 
 * @see {@link per}
 * @function external:Number#per
 * @param {number} mx - Max
 * @param {number} [gr=100] - Base
 * @return {number} Percentance
 */
Number.prototype.per = Number.prototype.per || function (pr, gr) {
	return per(!isNaN(pr) ? pr : 1, this, gr ? gr : 100);
};

/**
 * Keep executing function on interval until it returns true.
 * 
 * @example
 * 
 * con(ping, 5000) //calls ping() every 5 seconds until ping returns true
 * 
 * @static
 * @function con
 * @summary Continuus
 * @param {(string|Function)} comm - Command
 * @param {number} milli - Milliseconds
 * @return {Timeout}
 */
const con = exports.con = function con(comm, init) {
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
	catch (e) { }
	return setTimeout(con, init || 1, comm || " ", init || 1);
};

/**
 * Keep executing function on interval until it returns true.
 * 
 * @example
 * 
 * 'ping()'.con(5000) //calls ping() every 5 seconds until ping returns true
 * 
 * @variation 2
 * @function external:String#con
 * @summary Continuus
 * @param {number} milli - Milliseconds
 * @return {Timeout}
 */
/**
 * Keep executing function on interval until it returns true.
 * 
 * @example
 * 
 * ping.con(5000) //calls ping() every 5 seconds until ping returns true
 * 
 * @function external:Function#con
 * @summary Continuus
 * @param {number} milli - Milliseconds
 * @return {Timeout}
 */
Function.prototype.con = String.prototype.con = Function.prototype.con || function (init) {
	return con(this, init);
};

/**
 * Inspect element enumerable properties.
 * 
 * @example
 * 
 * ins(obj);
 * 
 * @deprecated
 * @static
 * @function ins
 * @summary Inspect
 * @param {Object} el - Element
 * @return {Array} Properties
 */
const ins = exports.ins = function ins(el) {
	var arr = [];
	for (var prop in el) {
		arr.push(prop);
	}
	return arr;
};

/**
 * Inspect element enumerable properties.
 * 
 * @example
 * 
 * obj.ins();
 * 
 * @deprecated
 * @function external:Object#ins
 * @summary Inspect
 * @return {Array} Properties
 */
Object.prototype.ins = Object.prototype.ins || function () {
	return ins(this);
};

/**
 * JSON stringify object.
 * 
 * @example
 * 
 * Ins(obj);
 * 
 * @deprecated
 * @static
 * @function Ins
 * @param {Object} el - Element
 * @return {string} Object
 */
const Ins = exports.Ins = function Ins(el) {
	return JSON.stringify(el);
};

/**
 * JSON stringify object.
 * 
 * @example
 * 
 * obj.Ins();
 * 
 * @deprecated
 * @function external:Object#Ins
 * @return {string} Object
 */
Object.prototype.Ins = Object.prototype.Ins || function () {
	return Ins(this);
};

/**
 * Fetch property by index.
 * 
 * @example
 * 
 * prp(obj, 2);
 * 
 * @static
 * @function prp
 * @param {Object} el - Object
 * @param {number} [ind=0] - Index
 * @return {*}
 */
const prp = exports.prp = function prp(el, ind) {
	return el[el.Prp(ind)];
};

/**
 * Fetch property by index.
 * 
 * @example
 * 
 * obj.prp(2);
 * 
 * @param {number} [ind=0] - Index
 * @function external:Object#prp
 * @return {*}
 */
Object.prototype.prp = Object.prototype.prp || function (ind) {
	return prp(this, ind);
};

/**
 * Fetch property **name** by index.
 * 
 * @example
 * 
 * Prp(obj, 2);
 * 
 * @static
 * @param {Object} el - Object
 * @param {number} [ind=0] - Index
 * @function Prp
 * @return {string} Property name.
 */
 const Prp = exports.Prp = function Prp(el, ind) {
 	return Object.keys(el)[ind ? Number(ind) : 0];
 };
 
/**
 * Fetch property **name** by index.
 * 
 * @example
 * 
 * obj.Prp(2);
 * 
 * @param {number} [ind=0] - Index
 * @function external:Object#Prp
 * @return {string} Property name.
 */
Object.prototype.Prp = Object.prototype.Prp || function (ind) {
	return Object.keys(this)[ind ? Number(ind) : 0];
};

/**
 * Fetch object values.
 * 
 * @example
 * 
 * obj.values();
 * 
 * @function external:Object#values
 * @return {Array} Object values.
 */
Object.prototype.values = Object.prototype.values || function () {
	return Object.values(this);
};

/**
 * Fetch object values.
 * 
 * @example
 * 
 * Object.values(obj);
 * 
 * @static
 * @function external:Object.values
 * @return {Array} Object values.
 */
Object.values = Object.values || function values(obj) {
	return obj.values();
};

/**
 * Fetch object properties.
 * 
 * @example
 * 
 * obj.names();
 * 
 * @function external:Object#names
 * @return {Array} Object properties.
 */
Object.prototype.names = Object.prototype.names || function names() {
	return Object.getOwnPropertyNames(this);
};

/**
 * Fetch object values.
 * 
 * @example
 * 
 * Object.names(obj);
 * 
 * @static
 * @function external:Object.names
 * @return {Array} Object properties.
 */
Object.names = Object.names || Object.getOwnPropertyNames;

/**
 * Fetch object keys.
 * 
 * @example
 * 
 * obj.keys();
 * 
 * @function external:Object#keys
 * @return {Array} Object properties.
 */
Object.prototype.keys = Object.prototype.keys || function () {
	return Object.keys(this);
};

if (!Object.entries) {
	Object.entries = function(obj) {
		var ownProps = Object.keys(obj),
		i = ownProps.length,
		resArray = new Array(i);
		while (i--) {
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		}
		return resArray;
	};
}

if (!String.prototype.repeat) {
	String.prototype.repeat = function repeat(tim) {
		var str = this;
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
	};
}

if (!Array.prototype.repeat) {
	Array.prototype.repeat = function repeat(tim) {
		var str = this;
		tim = tim ? tim : 0;
		var st = str ? str : "";
		while (--tim) {
			str = str.concat(st);
		}
		return str;
	};
}

/**
 * Alternate boolean.
 * 
 * @example
 * 
 * alt(true) //false
 * 
 * @static
 * @param {boolean} bool - Boolean
 * @function alt
 * @return {boolean} Alternate
 */
const alt = exports.alt = function alt(bool) {
	return !!bool;
};

/**
 * Alternate boolean.
 * 
 * @example
 * 
 * let a = true;
 * a.alt() //false
 * 
 * @see {@link alt}
 * @function external:Object#alt
 * @return {boolean} Alternate
 */
/**
 * Alternate boolean.
 * 
 * @example
 * 
 * let a = true;
 * a.alt() //false
 * 
 * @see {@link alt}
 * @function external:Boolean#alt
 * @return {boolean} Alternate
 */
Object.prototype.alt = Object.prototype.alt || function () {
	return alt(this);
};

/**
 * Number signum.
 * 
 * @example
 * 
 * sig(-100) //-1
 * 
 * @static
 * @deprecated
 * @function sig
 * @param {number} n - Number
 * @return {number} -1/0/1
 */
const sig = exports.sig = function sig(n) {
	n = Number(n);
	if (!n) {
		return 0;
	}
	return n / Math.abs(n);
};

/**
 * Number signum.
 * 
 * @example
 * 
 * 5..sig() //1
 * 
 * @function external:Number#sig
 * @return {number} -1/0/1
 */
String.prototype.sig = Number.prototype.sign = Number.prototype.sig = Number.prototype.sign || String.prototype.sig || function () {
	return sig(this);
};

if (!Math.sign) {
	Math.sign = sig;
}

/**
 * Recursive sum.
 * 
 * @example
 * 
 * sum(3) //3+2+1
 * 
 * @deprecated
 * @function external:Number#sum
 * @param {number} n - Number
 * @return {number} Sum
 */
 /**
 * Recursive sum.
 * 
 * @example
 * 
 * Math.sum(3) //3+2+1
 * 
 * @static
 * @function external:Math.sum
 * @param {number} n - Number
 * @return {number} Sum
 */
Math.sum = Number.prototype.sum = Math.sum || Number.prototype.sum || function (lst) {
	lst = lst ? lst : (Number(this) || "");
	var acc = 0;
	while (lst) {
		acc += lst;
		lst--;
	}
	return acc;
};

/**
 * Sum of elements.
 * 
 * @example
 * 
 * [1, 2, 3].sum(console.log) //1 3 6
 * 
 * @deprecated
 * @function external:Array#reduce
 * @param {number} func - Callback
 * @return {number} Sum
 */
Array.prototype.sum = Array.prototype.sum || function (func) {
	var tmp = 0;
	this.forEach(function(val, ind, arr) {
		tmp += val;
		if (func) {
			return func(tmp, val, ind, arr);
		}
	});
	return tmp;
};

if (!Array.prototype.reduce) {
	Array.prototype.reduce = Array.prototype.sum;
}

if (!Array.prototype.reduceRight) {
	Array.prototype.reduceRight = function (func) {
		return this.reverse().reduce(func);
	};
}

/**
 * Factorial of elements.
 * 
 * @example
 * 
 * Math.fac(5) //5*4*3*2*1
 * 
 * @deprecated
 * @function external:Math.fac
 * @param {number} num - Number
 * @return {number} Product
 */
Math.fac = Math.fac || function (lst) {
	var acc = 1;
	while (lst) {
		acc *= lst;
		lst--;
	}
	return acc;
};

/**
 * Factorial of elements.
 * 
 * @example
 * 
 * [5, 4, 3].fac() //5*4*3
 * 
 * @deprecated
 * @function external:Array#fac
 * @return {number} Product
 */
Array.prototype.fac = Array.prototype.fac || function () {
	var tmp = 0;
	this.forEach(function (val) {
		tmp *= val;
	});
	return tmp;
};

/**
 * Remove element. **Does not edit original**.
 * 
 * @example
 * 
 * rmv(['a', 2, 3], 'a') //[2, 3]
 * rmv(['a', 2, 3], 0, true) //[2, 3]
 * 
 * @function rmv
 * @param {*} el - Object
 * @param {*} elm - Element to remove.
 * @param {boolean} [i=false] - Index mode?
 * @return {*} this
 */
const rmv = exports.rmv = function rmv(el, elm, i) {
	var arr = el.split("").concat([]);
	if (typeof elm != "number" && arr.indexOf(elm) < 0) {
		return arr;
	}
	if (arr.includes(elm) || i !== undefined) {
		return arr.splice(typeof elm == "number" && !i ? elm : arr.indexOf(elm), 1);
	}
	if (this instanceof String) {
		return arr.join("");
	}
	return arr;
};

/**
 * Remove element. **Edits original**.
 * 
 * @example
 * 
 * "a23".rmv('a') //[2, 3]
 * "a23".rmv(0, true) //[2, 3]
 * 
 * @function external:String#rmv
 * @param {*} el - Element
 * @param {boolean} [i=false] - Index mode?
 * return {string} this
 */
/**
 * Remove element. **Edits original**.
 * 
 * @example
 * 
 * ['a', 2, 3].rmv('a') //[2, 3]
 * ['a', 2, 3].rmv(0, true) //[2, 3]
 * 
 * @function external:Array#rmv
 * @param {*} el - Element
 * @param {boolean} [i=false] - Index mode?
 * @return {boolean} Removed?
 */
Array.prototype.rmv = String.prototype.rmv = Array.prototype.rmv || function (elm, n) {
	var arr = this.split("");
	if (typeof elm != "number" && arr.indexOf(elm) < 0) {
		return false;
	}
	if (arr.includes(elm) || n !== undefined) {
		arr.splice(typeof elm == "number" && n ? elm : arr.indexOf(elm), 1);
	} else {
		return false;
	}
	if (this instanceof String) {
		return arr.join("");
	} else {
		return true;
	}
};

/**
 * Add unique element. **Does not edit original**.
 * 
 * @example
 * 
 * add(['a', 2, 3], 'a') //['a', 2, 3]
 * add(['a', 2, 3], 'b', 1) //['a', 'b', 2, 3]
 * 
 * @since 1.1.1
 * @function add
 * @param {Array} el - Object
 * @param {*} elm - Element to add.
 * @param {number} [i=this.length] - Index
 * @return {Array} this
 */
const add = exports.add = function add(el, elm, i) {
	el = el.split('').concat([]);
	if (!el.includes(elm) && i === undefined) {
		el.push(elm);
	} else if (!el.includes(elm)) {
		el.inh(el.slice(0, i * 1).concat(elm).concat(el.slice(i * 1)));
	}
	return el;
};

/**
 * Add unique element. **Edits original**.
 * 
 * @example
 * 
 * ['a', 2, 3].add('a') //['a', 2, 3]
 * ['a', 2, 3].add('b', 1) //['a', 'b', 2, 3]
 * 
 * @function external:Array#add
 * @param {*} el - Element
 * @param {number} [i=this.length] - Index
 * @return {boolean} Added?
 */
Array.prototype.add = Array.prototype.add || function add(elm, i) {
	if (!this.includes(elm) && i === undefined) {
		this.push(elm);
		return true;
	} else if (!this.includes(elm)) {
		this.inh(this.slice(0, i * 1).concat(elm).concat(this.slice(i * 1)));
		return true;
	}
	return false;
};

/**
 * Add element. **Edits original**.
 * 
 * @example
 * 
 * ['a', 2, 3].put('a') //['a', 2, 3, 'a']
 * ['a', 2, 3].put('b', 1) //['a', 'b', 2, 3]
 * 
 * @since 1.1.1
 * @see {@link put}
 * @function external:Array#put
 * @param {*} el - Element
 * @param {number} [i=this.length] - Index
 * @return {Array} this
 */
Array.prototype.put = Array.prototype.put || function (elm, i) {
	return this.inh(put(this.concat([]), elm, i));
};

/**
 * Add element. **Does not edit original**.
 * 
 * @example
 * 
 * put(['a', 2, 3], 'a') //['a', 2, 3, 'a']
 * put(['a', 2, 3], 'b', 1) //['a', 'b', 2, 3]
 * 
 * @since 1.1.1
 * @function put
 * @param {*} el - Object
 * @param {*} elm - Element to add
 * @param {number} [i=this.length] - Index
 * @return {Array} this
 */
const put = exports.put = function put(el, elm, i) {
	el = el.split('').concat([]);
	i = i ? i : el.length;
	return el.slice(0, i * 1).concat(elm).concat(el.slice(i * 1));
};

if (!Array.prototype.includes) {
	Array.prototype.includes = function has(elm) {
		return this.indexOf(elm) >= 0;
	};
}

/**
 * Toggle unique element. **Edits original**.
 * 
 * @example
 * 
 * ['a', 2, 3].tog('a') //[2, 3]
 * ['a', 2, 3].tog('b', 1) //['a', 'b', 2, 3]
 * 
 * @see {@link tog}
 * @function external:Array#tog
 * @param {*} el - Element
 * @param {number} [i=this.length] - Index
 * @return {Array} this
 */
Array.prototype.tog = Array.prototype.tog || function (elm, i) {
	return this.inh(tog(this.concat([]), elm, i));
};

/**
 * Toggle unique element. **Does not edit original**.
 * 
 * @example
 * 
 * tog(['a', 2, 3], 'a') //[2, 3]
 * tog(['a', 2, 3], 'b', 1) //['a', 'b', 2, 3]
 * 
 * @since 1.1.1
 * @function tog
 * @param {Array} el - Object
 * @param {*} elm - Element to toggle.
 * @param {number} [i=this.length] - Index
 * @return {*} this
 */
const tog = exports.tog = function tog(el, elm, i) {
	el = el.split('').concat([]);
	i = i ? i : el.length;
	if (el.includes(elm)) {
		el.rmv(elm, i);
	} else {
		el.add(elm, i);
	}
	return el;
};

/**
 * Make elements unique. **Edits original**.
 * 
 * @example
 * 
 * ['a', 2, 3, 'a'].flt() //['a', 2, 3]
 * ['a', 2, 3].flt() //['a', 2, 3]
 * 
 * @see {@link flt}
 * @function external:Array#flt
 * @return {Array} this
 */
Array.prototype.flt = Array.prototype.flt || function () {
	return this.inh(flt(this));
};

/**
 * Make elements unique. **Does not edit original**.
 * 
 * @example
 * 
 * flt(['a', 2, 3, 'a']) //['a', 2, 3]
 * flt(['a', 2, 3]) //['a', 2, 3]
 * 
 * @static
 * @since 1.1.1
 * @function flt
 * @param {Array} this
 * @return {Array} this
 */
const flt = exports.flt = function flt(elm) {
	var nar = [];
	elm.split('').forEach(function(val) {
		nar.add(val);
	});
	return nar;
};

if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject != 'undefined') {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
        }
        
        function F() {}
        F.prototype = proto;
        
        return new F();
    };
}

/**
 * Create object copy.
 * 
 * @example
 * 
 * [1, 2, 3].copy()
 * 
 * @function external:Object#copy
 * @return {Object} New object.
 */
Object.prototype.copy = Object.prototype.copy || function copy() {
	return Object.create(this);
};

if (!Array.prototype.clone) {
	Array.prototype.clone = Object.prototype.copy;
}

if (!Array.prototype.copy) {
	Array.prototype.copy = function copy(ar) {
		if (!ar) {
			return this.clone();
		}
		return this.inh(ar);
	};
}

/**
 * Inherit an array's items into another original array.
 * 
 * @example
 * 
 * [1, 2, 3].inh([3, 4]) //[3, 4]
 * 
 * @function external:Array#inh
 * @param {Array} arr - Array to inherit from.
 * @return {Array} this
 */
Array.prototype.inherit = Array.prototype.inh = Array.prototype.inherit || function inh(array) {
	var arr = array.length > this.length ? array : this;
	arr.forEach((function(val, ind, arr) {
		this[ind] = array[ind];
		while (this.last() === undefined && this.length) {
			this.pop();
		}
	}).bind(this));
	return this;
};

/**
 * Shuffle array items. **Edits original**.
 * 
 * @example
 * 
 * [1, 2, 3].shf();
 * 
 * @function external:Array#shf
 * @return {Array} this
 */
Array.prototype.shf = Array.prototype.shf || function shuffle() {
	var i = this.length, j, temp;
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

/**
 * Shuffle characters.
 * 
 * @example
 * 
 * "123".shf();
 * 
 * @function external:String#shf
 * @return {string}
 */
/**
 * Shuffle digits.
 * 
 * @example
 * 
 * 123..shf();
 * 
 * @function external:Number#shf
 * @return {number}
 */
String.prototype.shf = Number.prototype.shf = String.prototype.shf || Number.prototype.shf || function () {
	var t = this.string.split('').shf().join('');
	if (this instanceof Number) {
		return t * 1;
	}
	return t;
};

/**
 * Limit.
 * 
 * @example
 * 
 * lim(5, 10, 20) //10
 * 
 * @static
 * @function lim
 * @param {number} n - Number
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
const lim = exports.lim = function lim(n, m, M) {
	n = Number(n);
	m = Number(m);
	M = Number(M);
	return n < m ? m : (n > M ? M : n);
};

/**
 * Limit.
 * 
 * @example
 * 
 * Math.lim(5, 10, 20) //10
 * 
 * @function external:Math.lim
 * @param {number} n - Number
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
Math.lim = Math.lim || lim;

/**
 * Limit.
 * 
 * @example
 * 
 * 5..lim(10, 20) //10
 * 
 * @function external:Number#lim
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
/**
 * Limit.
 * 
 * @example
 * 
 * '5'.lim(10, 20) //10
 * 
 * @function external:String#lim
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
String.prototype.lim = Number.prototype.lim = Number.prototype.lim || String.prototype.lim || function (min, max) {
	return lim(this, min, max || this);
};

/**
 * Limit. **Edits original**.
 * 
 * @example
 * 
 * [5, 9, 11].lim(10, 20) //[10, 10, 11]
 * 
 * @function external:Array#lim
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {Array} Number limited inside range m-M
 */
Array.prototype.lim = Array.prototype.lim || function (min, max) {
	this.forEach(function(val, ind) {
		if (typeof val == 'number') this[ind] = lim(val, min, max);
	});
	return this;
};

/**
 * Circular Limit.
 * 
 * @example
 * 
 * lim(30, 10, 20) //10 not 20!
 * 
 * @static
 * @function Lim
 * @param {number} n - Number
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
const Lim = exports.Lim = function Lim(n, m, M) {
	n = Number(n);
	m = Number(m);
	M = Number(M);
	return n < m ? M - Math.abs(m - n) % m : (n > M ? m + Math.abs(M - n) % M : n);
};

/**
 * Circular Limit.
 * 
 * @example
 * 
 * Math.lim(30, 10, 20) //10 not 20!
 * 
 * @function external:Math.Lim
 * @param {number} n - Number
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
Math.Lim = Math.Lim || Lim;

/**
 * Circular Limit.
 * 
 * @example
 * 
 * 30..lim(10, 20) //10 not 20!
 * 
 * @function external:Number#Lim
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
/**
 * Circular Limit.
 * 
 * @example
 * 
 * "30".lim(10, 20) //10 not 20!
 * 
 * @function external:String#Lim
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
String.prototype.Lim = Number.prototype.Lim = Number.prototype.Lim || String.prototype.Lim || function (min, max) {
	return Lim(this, min, max || Number(0));
};

/**
 * Circular Limit. **Edits original**.
 * 
 * @example
 * 
 * [30, 10, 15].lim(10, 20) //[10, 10, 15]
 * 
 * @function external:Array#Lim
 * @param {number} m - Minimum
 * @param {number} M - Maximum
 * @return {number} Number limited inside range m-M
 */
Array.prototype.Lim = Array.prototype.Lim || function (min, max) {
	this.forEach(function(val, ind) {
		if (typeof val == 'number') this[ind] = Lim(val, min, max);
	});
	return this;
};

/**
 * String logical boolean.
 * 
 * @example
 * 
 * bool('true') //true
 * bool(123) //true
 * bool('false') //false
 * 
 * @static
 * @function bool
 * @param {string} dt - Input
 * @return {boolean}
 */
const bool = exports.bool = function bool(dt) {
	return !falseReg.test(dt.toString());
};

/**
 * String logical boolean.
 * 
 * @example
 * 
 * 'true'.bool() //true
 * '123'.bool() //true
 * 'false'.bool() //false
 * 
 * @function external:String#bool
 * @return {boolean}
 */
String.prototype.bool = String.prototype.bool || function () {
	return bool(this.toString());
};

/**
 * Make function with custom number of parameters.
 * 
 * @example
 * 
 * par("a", 5, 'b', "alert(b4)") //function a(b1, b2, b3, b4, b5) {code}
 * 
 * @deprecated
 * @static
 * @function par
 * @param {string} func - Function name
 * @param {number} num - Parameters length
 * @param {string} name - Parameters name
 * @param {string} code - Function code
 * @return {Function}
 */
const par = exports.par = function par(fun, num, nam, cod) {
	var arr = rep(num, function(st) {
		return nam + (st + 1);
	});
	return eval("function " + fun + "(" + arr.join(",") + "," + nam + "," + nam + "0){" + nam + "=[" + arr.join(",") + "];" + nam + "0=['" + fun + "'," + num + "];" + (typeof cod == "string" ? cod : "return (" + cod + ")()") + "}");
};

/**
 * Minimum.
 * 
 * @example
 * 
 * min([1, 2, 3, 4]) //1
 * 
 * @static
 * @function min
 * @param {Array} n - Numbers
 * @return {number}
 */
/**
 * Minimum.
 * 
 * @example
 * 
 * Math.min([1, 2, 3, 4]) //1
 * 
 * @function external:Math.min
 * @override
 * @param {Array} n - Numbers
 * @return {number}
 */
const min = exports.min = Math.Min = function min(n) {
	return Math.min.apply(Math, n);
};

/**
 * Maximum.
 * 
 * @example
 * 
 * max([1, 2, 3, 4]) //4
 * 
 * @static
 * @function max
 * @param {Array} n - Numbers
 * @return {number}
 */
/**
 * Maximum.
 * 
 * @example
 * 
 * Math.max([1, 2, 3, 4]) //4
 * 
 * @function external:Math.max
 * @override
 * @param {Array} n - Numbers
 * @return {number}
 */
const max = exports.max = Math.Max = function max(n) {
	return Math.max.apply(Math, n);
};

/**
 * Maximum.
 * 
 * @example
 * 
 * [1, 2, 3, 4].max() //4
 * 
 * @see {@link max}
 * @function external:Array#max
 * @return {number}
 */
Array.prototype.max = Array.prototype.max || function () {
	return max(this);
};

/**
 * Minimum.
 * 
 * @example
 * 
 * [1, 2, 3, 4].min() //1
 * 
 * @see {@link min}
 * @function external:Array#min
 * @return {number}
 */
Array.prototype.min = Array.prototype.min || function () {
	return min(this);
};

/**
 * Analogy.
 * 
 * @example
 * 
 * anl(5, 1, 10, 10, 20) //15
 * 
 * @static
 * @function anl
 * @param {number} n - Number
 * @param {number} a - Initial range minimum
 * @param {number} b - Initial range maximum
 * @param {number} A - New range minimum
 * @param {number} B - New range maximum
 * @return {number}
 */
/**
 * Analogy.
 * 
 * @example
 * 
 * Math.anl(5, 1, 10, 10, 20) //15
 * 
 * @function external:Math.anl
 * @see {@link anl}
 * @override
 * @param {number} n - Number
 * @param {number} a - Initial range minimum
 * @param {number} b - Initial range maximum
 * @param {number} A - New range minimum
 * @param {number} B - New range maximum
 * @return {number}
 */
const anl = exports.anl = Math.anl = function anl(n, a, b, A, B) {
	var df = 100 * (n - Math.min(a, b)) / (Math.max(a, b) - Math.min(a, b));
	return Math.min(A, B) + per(df, Math.max(A, B) - Math.min(A, B));
};

/**
 * Analogy.
 * 
 * @example
 * 
 * 5..anl(1, 10, 10, 20) //15
 * 
 * @see {@link anl}
 * @function external:Number#anl
 * @param {number} a - Initial range minimum
 * @param {number} b - Initial range maximum
 * @param {number} A - New range minimum
 * @param {number} B - New range maximum
 * @return {number}
 */
Number.prototype.anl = Number.prototype.anl || function (a, b, A, B) {
	return anl(this, a, b, A, B);
};

/**
 * Analogy. **Edits original**.
 * 
 * @example
 * 
 * [5, 8].anl(1, 10, 10, 20) //[15, 18]
 * 
 * @see {@link anl}
 * @since 1.1.2
 * @function external:Array#anl
 * @param {number} a - Initial range minimum
 * @param {number} b - Initial range maximum
 * @param {number} A - New range minimum
 * @param {number} B - New range maximum
 * @return {Array} this
 */
Array.prototype.anl = Array.prototype.anl || function(a, b, A, B) {
	this.forEach(function(val, ind) {
		if (typeof val == 'number') this[ind] = anl(val, a, b, A, B);
	});
	return this;
};

/**
 * Last.
 * 
 * @example
 * 
 * [5, 8].last() //8
 * 
 * @function external:Object#last
 * @param {number} [off=this.length-1] - Last index
 * @return {*}
 */
Object.prototype.last = Object.prototype.last || function last(off) {
	return this[Object.keys(this)[Object.keys(this).length - 1 - (off ? off : 0)]];
};

/**
 * First.
 * 
 * @example
 * 
 * [5, 8].first() //5
 * 
 * @function external:Object#first
 * @param {number} [off=0] - First index
 * @return {*}
 */
Object.prototype.first = Object.prototype.first || function (off) {
	return this[Object.keys(this)[off ? off : 0]];
};

if (!Array.prototype.fill) {
	Array.prototype.fill = function fill(vl, frm, to) {
		if (frm === undefined) {
			this.forEach(function(val, ind) {
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

String.prototype.starts = String.prototype.startsWith;

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (c, l) {
		var reg = new RegExp(c + "$");
		return reg.test(this.slice(0, l ? l : this.length));
	};
}

String.prototype.ends = String.prototype.endsWith;

if (!String.prototype.includes) {
	String.prototype.includes = function (c, l) {
		var reg = new RegExp(c);
		return reg.test(this.slice(l ? l : 0));
	};
}

/**
 * Split. **Does not edit original**.
 * 
 * @example
 * 
 * [5, 8].split('.', '5') //[, '.8']
 * 
 * @function external:Array#split
 * @param {number} [split=''] - Split char
 * @param {number} [join=''] - Join char
 * @return {Array} this
 */
Array.prototype.split = Array.prototype.split || function split(s, j) {
	if (!j) return this;
	return this.join(j ? j : '').split(s ? s : '');
};

/**
 * Join.
 * 
 * @example
 * 
 * "58".split('.') //'5.8'
 * 
 * @function external:String#join
 * @param {number} [join=''] - Join char
 * @param {number} [split=''] - Split char
 * @return {string} this
 */
String.prototype.join = String.prototype.join || function join(j, s) {
	if (!s) return this;
	return this.split(s ? s : '').join(j ? j : '');
};

if (!String.prototype.toString) {
	String.prototype.toString = function toString() {
		return this.split('').join('');
	};
}

if (!escape) {
	const escape = exports.escape = encodeURI || encodeURIComponent;
}

if (!unescape) {
	const unescape = exports.unescape = decodeURI || decodeURIComponent;
}

/**
 * For Each.
 * 
 * @example
 * 
 * [5, 8].forEach((val, ind, arr) => {})
 * 
 * @function external:Object#forEach
 * @param {Function} [func] - Callback
 * @return {Object} this
 */
Object.prototype.each = Object.prototype.foreach = Object.prototype.forEach = Array.prototype.forEach;

/**
 * For Each.
 * 
 * @example
 * 
 * 58.forEach((val, ind, arr) => {})
 * 
 * @function external:Number#forEach
 * @param {Function} [func] - Callback
 * @return {Number} this
 */
Number.prototype.forEach = Number.prototype.forEach || function forEach(func) {
	return this.toString().forEach(func);
};

/**
 * Splice.
 * 
 * @example
 * 
 * '58'.splice(0, 1) //5
 * 
 * @function external:String#splice
 * @param {number} start - Start
 * @param {number} end - End
 * @return {string}
 */
String.prototype.splice = String.prototype.splice || function (str, end) {
	return this.split('').splice(str, end ? end : (this.length - str)).join('');
};

/**
 * XOR.
 * 
 * @example
 * 
 * xor(true, true) //false
 * xor(true, false) //true
 * xor(false, false) //false
 * 
 * @function xor
 * @static
 * @param {boolean} a - First
 * @param {boolean} b - Second
 * @return {boolean} One or other but not both.
 */
const xor = exports.xor = function xor(a, b) {
	return (a || b) && !(a && b);
};

/**
 * XOR.
 * 
 * @example
 * 
 * true.xor(true) //false
 * false.xor(true) //true
 * false.xor(false) //false
 * 
 * @see {@link xor}
 * @function external:Boolean#xor
 * @param {boolean} b - Second
 * @return {boolean} One or other but not both.
 */
Boolean.prototype.xor = Boolean.prototype.xor || function (a) {
	return xor(this, a);
};

/*Matrix = function Matrix(array) {
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
			return this._values.Sum;
		} else if (ad._row == this._row && ad._column == this._column) {
			this._values = this._values.map(function (val, ind) {
				return val * ad._values[ind];
			});
			this._m = this._values.clone().cmp(1, this._column);
			return this._values.Sum;
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
function Mix(baseClass, ...mixins) {
	class base extends baseClass {
		constructor(...args) {
			super(...args);
			mixins.forEach(mixin => {
				copyProps(this, (new mixin));
			});
		}
	} //base
	function copyProps(target, source) {
		Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source)).forEach(prop => {
			if (!prop.toString().match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
				Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
		});
	} //copyProps
	mixins.forEach((mixin) => {
		copyProps(base.prototype, mixin.prototype);
		copyProps(base, mixin);
	});
	return base;
} //Mix*/

/**
 * Help.
 * 
 * @example
 * 
 * hlp()
 * 
 * @function hlp
 * @deprecated
 * @static
 */
const hlp = exports.hlp = function hlp() {
	global.alert(hlp.toString());
	/*
	[Array.]cmp([array]) -> converts multi-dimensional array to single-dinensional
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
	[(Number|String|Function).]rep([count <Number>, command <Function>, intial <Number>]) -> repeat a command.
	[(Math|Number).]deg([degrees <Number>, radians <Boolean>]) -> convert degrees <=> radians.
	[(Number|Math).]anl([number <Number>, ]min <Number>, max <Number>, Min <Number>, Max <Number>) -> number from range [min,max] to range [Min,Max] analogically.
	[(Math|Number).]per([number <Number>, ]percentance <Number>[, scale=100 <Number>]) -> returns percentance of number.
	(String|Array|Number).wrp(wrap <String>) -> wrap between.
	[(Function|String|Number).]con([command <Function>, ]interval <Number>) -> run a command constantly, like setInterval but ignores first interval cooldown time.
	Object.((ins|Ins)()|_ins|_Ins) -> inspect object enumerable properties or stringify non circular struct.
	Object.((prp|Prp)(index <Number>)|_prp) -> grab object property (value|key) by index.
	Object.(keys()|_keys) -> an alternative of Object.keys(object)
	Object.(values()|_values) -> an alternative of Object.values(object)
	Deprecated: String.dup(times <Number>) -> repeat string pattern. Pollyfill of String.repeat.
	[Boolean.](alt([boolean  <Boolean>])|Alt) -> alternate boolean value.
	Number.(sig()|_sig)|[Math.]sig(number <Number>) -> signum (+1/-1/0).
	(Array|String).rmv(index) -> remove item from array/string.
	(String|Array|Number).wrp(wr) -> wrap between.
	Deprecated: Array.clone() -> grab array value instead of pointer.
	Array.(shf()|_shf) -> shuffle.
	Object.(last(index <Number>)|Last) -> last element.
	Object.(first(index <Number>)|First) -> first element.
	(Number|Math).lim(min <Number>, max <Number>) -> limit number range.
	(Number|Math).Lim(min <Number>, max <Number>) -> circular limit.
	(Number|Array).(sum()|_sum) -> sum of range (0,this).
	(Number|Array).(fac()|_fac) -> factorial of range.
	[Object.](bool([item <Object>])|Bool) -> boolean representation.
	par(function <String>, number <Number>, name <String>, code <String>) -> create number with specific number of params... E.x. : par("func",5,"param",function(){alert(param2)}||"alert(param2)") - func=function func(param1,param2,param3,param4,param5,param,param0){alert(param2)}.
	Math.(Max|Min)(numarray <Array>)|Array.((min|max)()|(Min|Max)) -> max/min num of array.
	Array.fill(value <Object>[, from <Number>, to <Number>]) -> fill polyfill.
	[Boolean.]xor(a <Boolean>[, b <Boolean>]) -> a or b but not both.
	Array.add(elm <Object>) -> add element if not already in array.
	Array.has(elm <Object>) -> check if array has element.
	Array.tog(element <Object>) -> toggle array element.
	Array.flt() -> array elements become unique.
	Array.inh(array <Array>) -> inherit on real array.
	Matrix(2Darray <Array>) -> math matrix class, m : array, values : singledimensional m, row : row length , column : column length, trans() : transpose, mult(<Matrix|Number>) : multiply, add(<Matrix|Number>) : add.
	D(x <Number>,y <Number>,z <Number>) -> 3D point, t(camera <Array>), T(distance <Object>), i().
	auto -> mode switch, strict = no getters
	Auto -> like auto but bitwise
	AUTO -> Auto's constants
	nul -> function(){}
	alph -> "abcdefghijklmnopqrtsuvwxyz"
	ALPH -> alph.toUpperCase()
	Alph -> (alph+ALPH+"0123456789")
	*/
};
