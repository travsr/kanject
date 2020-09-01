// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/jquery/dist/jquery.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"Components/Utils.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Utils.js
 * @description A class that contains a set of static functions that can be used throughout the app
 * @author travsr
 */
var Utils = /*#__PURE__*/function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "getPlatform",

    /**
     * Return the platform (firefox vs chrome)
     */
    value: function getPlatform() {
      if (typeof browser !== "undefined") {
        return "firefox";
      } else if (typeof chrome !== "undefined") {
        return "chrome";
      } else {
        return "unknown";
      }
    }
    /** 
     * Return the api object
     */

  }, {
    key: "getPlatform",
    value: function getPlatform() {
      if (typeof browser !== "undefined") {
        return browser;
      } else if (typeof chrome !== "undefined") {
        return chrome;
      } else {
        return {};
      }
    }
  }]);

  return Utils;
}();
},{}],"data/kanji.json":[function(require,module,exports) {
module.exports = {
  "10": ["十", "じゅう, と, とお", "10, ten"],
  "11": ["十一", "じゅういち, ジュウイチ", "11, eleven; Hodgson's hawk-cuckoo (Cuculus fugax)"],
  "12": ["十二", "じゅうに", "12, twelve"],
  "13": ["十三", "じゅうさん", "13, thirteen"],
  "14": ["十四", "じゅうし, じゅうよん", "14, fourteen"],
  "15": ["十五", "じゅうご", "15, fifteen"],
  "16": ["十六", "じゅうろく", "16, sixteen"],
  "18": ["十八", "じゅうはち", "18, eighteen"],
  "19": ["十九", "じゅうきゅう", "19, nineteen"],
  "200": ["二百", "にひゃく", "two hundred, 200"],
  "300": ["三百", "さんびゃく", "300, three hundred; 300 mon, trifling amount, two-bit item; shyster"],
  "3000": ["三千", "さんぜん", "3000; many"],
  "day": ["日", "ひ", "day, days; sun, sunshine, sunlight; case (esp. unfortunate), event"],
  "days": ["日", "ひ", "day, days; sun, sunshine, sunlight; case (esp. unfortunate), event"],
  "sun": ["日", "ひ", "day, days; sun, sunshine, sunlight; case (esp. unfortunate), event"],
  "sunshine": ["日", "ひ", "day, days; sun, sunshine, sunlight; case (esp. unfortunate), event"],
  "sunlight": ["日", "ひ", "day, days; sun, sunshine, sunlight; case (esp. unfortunate), event"],
  "case esp. unfortunate": ["日", "ひ", "day, days; sun, sunshine, sunlight; case (esp. unfortunate), event"],
  "event": ["種目", "しゅもく", "event, item of business"],
  "the same day": ["同日", "どうじつ", "the same day"],
  "japan-america": ["日米", "にちべい", "Japan-America"],
  "japanese person": ["日本人", "にほんじん, にっぽんじん", "Japanese person, Japanese people"],
  "japanese people": ["日本人", "にほんじん, にっぽんじん", "Japanese person, Japanese people"],
  "every day": ["毎日", "まいにち", "every day"],
  "previous day": ["前日", "ぜんじつ, まえび", "previous day, the day before"],
  "the day before": ["前日", "ぜんじつ, まえび", "previous day, the day before"],
  "all days": ["全日", "ぜんじつ", "all days"],
  "schedule": ["予定", "よてい", "plans, arrangement, schedule, program, programme, expectation, estimate"],
  "program": ["学部", "がくぶ", "department of a university; undergraduate (course, program, etc.)"],
  "programme": ["予定", "よてい", "plans, arrangement, schedule, program, programme, expectation, estimate"],
  "agenda": ["議題", "ぎだい", "topic of discussion, agenda"],
  "japanese language": ["日本語", "にほんご, にっぽんご", "Japanese (language)"],
  "today": ["今日", "こんにち, きょう, こんち, こんじつ", "today, this day"],
  "this day": ["今日", "こんにち, きょう, こんち, こんじつ", "today, this day"],
  "one": ["一つ", "ひとつ", "one; for one thing (often used in itemized lists); (after a noun) only; (with a verb in negative form) (not) even; just (i.e. \"just try it\")"],
  "for one thing often used in itemized lists": ["一つ", "ひとつ", "one; for one thing (often used in itemized lists); (after a noun) only; (with a verb in negative form) (not) even; just (i.e. \"just try it\")"],
  "after a noun only": ["一つ", "ひとつ", "one; for one thing (often used in itemized lists); (after a noun) only; (with a verb in negative form) (not) even; just (i.e. \"just try it\")"],
  "with a verb in negative form not even": ["一つ", "ひとつ", "one; for one thing (often used in itemized lists); (after a noun) only; (with a verb in negative form) (not) even; just (i.e. \"just try it\")"],
  "just i.e. just try it": ["一つ", "ひとつ", "one; for one thing (often used in itemized lists); (after a noun) only; (with a verb in negative form) (not) even; just (i.e. \"just try it\")"],
  "january": ["一月", "いちがつ", "January"],
  "general": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "liberal": ["一般", "いっぱん", "general, liberal, universal, ordinary, average"],
  "universal": ["一般", "いっぱん", "general, liberal, universal, ordinary, average"],
  "ordinary": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "average": ["一般", "いっぱん", "general, liberal, universal, ordinary, average"],
  "best": ["一番", "いちばん", "best, first, number one; game, round, bout, fall, event (in a meet)"],
  "first": ["最初", "さいしょ", "beginning, outset, first, onset"],
  "number one": ["一番", "いちばん", "best, first, number one; game, round, bout, fall, event (in a meet)"],
  "game": ["回戦", "かいせん", "match, game"],
  "round": ["一番", "いちばん", "best, first, number one; game, round, bout, fall, event (in a meet)"],
  "bout": ["試合", "しあい", "match, game, bout, contest"],
  "fall": ["低下", "ていか", "fall, decline, lowering, deterioration, degradation"],
  "event in a meet": ["一番", "いちばん", "best, first, number one; game, round, bout, fall, event (in a meet)"],
  "one part": ["一部", "いちぶ", "one part, one portion, one section, some; one copy (e.g. of a document)"],
  "one portion": ["一部", "いちぶ", "one part, one portion, one section, some; one copy (e.g. of a document)"],
  "one section": ["一部", "いちぶ", "one part, one portion, one section, some; one copy (e.g. of a document)"],
  "some": ["一部", "いちぶ", "one part, one portion, one section, some; one copy (e.g. of a document)"],
  "one copy e.g. of a document": ["一部", "いちぶ", "one part, one portion, one section, some; one copy (e.g. of a document)"],
  "one esp. of two": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "the other": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "one way": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "the other way": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "one direction": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "the other direction": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "one side": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "the other side": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "one party": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "the other party": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "on the one hand": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "on the other hand": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "whereas": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "although": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "but at the same time": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "meanwhile": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "in turn": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "after noun": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "adjective-stem or plain verb just keeps": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "being inclined to ...": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "tending to be ...": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "tending to do ...": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "ntinuously ...": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "just keeps on ...ing": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "only": ["一方", "いっぽう", "one (esp. of two), the other, one way, the other way, one direction, the other direction, one side, the other side, one party, the other party; on the one hand, on the other hand; whereas, although, but at the same time, meanwhile, in turn; (after noun, adjective-stem or plain verb) just keeps, being inclined to ..., tending to be ..., tending to do ..., ntinuously ..., just keeps on ...ing, only"],
  "eleven": ["十一", "じゅういち, ジュウイチ", "11, eleven; Hodgson's hawk-cuckoo (Cuculus fugax)"],
  "hodgson's hawk-cuckoo cuculus fugax": ["十一", "じゅういち, ジュウイチ", "11, eleven; Hodgson's hawk-cuckoo (Cuculus fugax)"],
  "november": ["十一月", "じゅういちがつ", "November"],
  "unity": ["統一", "とういつ", "unity, consolidation, uniformity, unification, compatible"],
  "consolidation": ["統一", "とういつ", "unity, consolidation, uniformity, unification, compatible"],
  "uniformity": ["統一", "とういつ", "unity, consolidation, uniformity, unification, compatible"],
  "unification": ["統合", "とうごう", "integration, unification, synthesis; integrated, built-in"],
  "compatible": ["統一", "とういつ", "unity, consolidation, uniformity, unification, compatible"],
  "one hour": ["一時", "いちじ, いっとき", "one hour, short time, once, a time, temporarily, at one time, twelfth part of a day"],
  "short time": ["時半", "じはん", "about an hour, short time; half past (the hour)"],
  "once": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "a time": ["一時", "いちじ, いっとき", "one hour, short time, once, a time, temporarily, at one time, twelfth part of a day"],
  "temporarily": ["一時", "いちじ, いっとき", "one hour, short time, once, a time, temporarily, at one time, twelfth part of a day"],
  "at one time": ["一時", "いちじ, いっとき", "one hour, short time, once, a time, temporarily, at one time, twelfth part of a day"],
  "twelfth part of a day": ["一時", "いちじ, いっとき", "one hour, short time, once, a time, temporarily, at one time, twelfth part of a day"],
  "country": ["田園", "でんえん, でんおん", "country, rural districts; cultivated land, fields"],
  "the state": ["国", "くに", "country, (the) state; region; province (of Japan); home (i.e. hometown, home country); land, earth"],
  "region": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "province of japan": ["国", "くに", "country, (the) state; region; province (of Japan); home (i.e. hometown, home country); land, earth"],
  "home i.e. hometown": ["国", "くに", "country, (the) state; region; province (of Japan); home (i.e. hometown, home country); land, earth"],
  "home country": ["国", "くに", "country, (the) state; region; province (of Japan); home (i.e. hometown, home country); land, earth"],
  "land": ["地", "ち", "earth, ground, land, soil; place; territory; bottom (of a package, book, etc.)"],
  "earth": ["地", "ち", "earth, ground, land, soil; place; territory; bottom (of a package, book, etc.)"],
  "foreign country": ["外国", "がいこく", "foreign country"],
  "foreigner": ["外国人", "がいこくじん", "foreigner"],
  "south korea": ["韓国", "かんこく", "(South) Korea"],
  "state": ["様子", "ようす", "aspect, state, appearance"],
  "nation": ["民族", "みんぞく", "people, race, nation"],
  "national diet": ["国会", "こっかい", "National Diet, parliament, congress"],
  "parliament": ["議会", "ぎかい", "Diet, congress, parliament"],
  "congress": ["議会", "ぎかい", "Diet, congress, parliament"],
  "international": ["国際", "こくさい", "international"],
  "internal": ["内部", "ないぶ", "interior, inside, internal"],
  "domestic": ["国内", "こくない", "internal, domestic"],
  "nationality": ["国民", "こくみん", "nation, nationality, people, citizen"],
  "people": ["人民", "じんみん", "people, public"],
  "citizen": ["市民", "しみん", "citizen, townspeople"],
  "un": ["国連", "こくれん", "UN, United Nations"],
  "united nations": ["国連", "こくれん", "UN, United Nations"],
  "committee": ["委員会", "いいんかい", "committee, commission, board, panel, committee meeting"],
  "commission": ["委員会", "いいんかい", "committee, commission, board, panel, committee meeting"],
  "board": ["委員会", "いいんかい", "committee, commission, board, panel, committee meeting"],
  "panel": ["委員会", "いいんかい", "committee, commission, board, panel, committee meeting"],
  "committee meeting": ["委員会", "いいんかい", "committee, commission, board, panel, committee meeting"],
  "member": ["会員", "かいいん", "member, the membership"],
  "the membership": ["会員", "かいいん", "member, the membership"],
  "meeting": ["会合", "かいごう", "meeting, assembly; association; (astronomical) conjunction"],
  "conference": ["協議", "きょうぎ", "conference, consultation, discussion, negotiation"],
  "session": ["会議", "かいぎ", "meeting, conference, session, assembly, council, convention, congress"],
  "assembly": ["会合", "かいごう", "meeting, assembly; association; (astronomical) conjunction"],
  "council": ["会議", "かいぎ", "meeting, conference, session, assembly, council, convention, congress"],
  "convention": ["規約", "きやく", "agreement, rules, code, protocol, convention"],
  "interview": ["会見", "かいけん", "interview, audience"],
  "audience": ["入り", "いり", "entering; setting (of the sun); containing, content, audience; income; beginning"],
  "company": ["相手", "あいて", "companion, partner, company; other party, addressee; opponent (sports, etc.)"],
  "corporation": ["法人", "ほうじん", "corporate body, corporation, (legal) person, (juridical) person"],
  "workplace": ["職場", "しょくば", "one's post, place of work, workplace"],
  "conversation": ["対話", "たいわ", "interactive, interaction, conversation, dialogue"],
  "discussion": ["相談", "そうだん", "consultation, discussion"],
  "president of a society": ["会長", "かいちょう", "president (of a society), chairman"],
  "chairman": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "diet": ["議会", "ぎかい", "Diet, congress, parliament"],
  "association": ["団体", "だんたい", "organization, organisation, association"],
  "society": ["社会", "しゃかい", "society, public"],
  "organization": ["主催", "しゅさい", "organization, organisation, sponsorship"],
  "organisation": ["首長", "しゅちょう", "head (of organization, organisation), chief"],
  "individual": ["個人", "こじん", "individual, private person, personal, private"],
  "private person": ["個人", "こじん", "individual, private person, personal, private"],
  "personal": ["個人", "こじん", "individual, private person, personal, private"],
  "private": ["民間", "みんかん", "private, civilian, civil, popular, folk, unofficial"],
  "three people": ["三人", "さんにん, みたり", "three people"],
  "human being": ["人間", "にんげん", "human being, man, person; character (of a person)"],
  "man": ["人間", "にんげん", "human being, man, person; character (of a person)"],
  "person": ["人間", "にんげん", "human being, man, person; character (of a person)"],
  "character of a person": ["人間", "にんげん", "human being, man, person; character (of a person)"],
  "popular": ["民間", "みんかん", "private, civilian, civil, popular, folk, unofficial"],
  "popular feeling": ["人気", "にんき", "popular, popular feeling, business conditions"],
  "business conditions": ["人気", "にんき", "popular, popular feeling, business conditions"],
  "population": ["住民", "じゅうみん", "citizens, inhabitants, residents, population"],
  "common talk": ["人口", "じんこう", "population; common talk"],
  "each person": ["人々", "ひとびと, にんにん", "each person, people, men, human, everybody"],
  "men": ["人々", "ひとびと, にんにん", "each person, people, men, human, everybody"],
  "human": ["人々", "ひとびと, にんにん", "each person, people, men, human, everybody"],
  "everybody": ["全員", "ぜんいん", "all members (unanimity), all hands, the whole crew, everyone, everybody"],
  "two persons": ["二人", "ふたり, ににん", "two persons, two people, pair, couple"],
  "two people": ["二人", "ふたり, ににん", "two persons, two people, pair, couple"],
  "pair": ["二人", "ふたり, ににん", "two persons, two people, pair, couple"],
  "couple": ["二人", "ふたり, ににん", "two persons, two people, pair, couple"],
  "witness": ["証人", "しょうにん", "witness"],
  "year": ["年", "とし", "year; age"],
  "age": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "last year": ["前年", "ぜんねん", "the preceding year, the previous year, last year"],
  "the preceding year": ["前年", "ぜんねん", "the preceding year, the previous year, last year"],
  "the previous year": ["前年", "ぜんねん", "the preceding year, the previous year, last year"],
  "year period of": ["年間", "ねんかん", "year (period of)"],
  "next year": ["来年", "らいねん", "next year"],
  "this year": ["今年", "ことし, こんねん", "this year"],
  "whole year": ["周年", "しゅうねん", "whole year, anniversary"],
  "anniversary": ["周年", "しゅうねん", "whole year, anniversary"],
  "boys": ["少年", "しょうねん", "boys, juveniles"],
  "juveniles": ["少年", "しょうねん", "boys, juveniles"],
  "annuity": ["年金", "ねんきん", "annuity, pension"],
  "pension": ["年金", "ねんきん", "annuity, pension"],
  "pupil in ... year": ["年生", "ねんせい", "pupil in ... year, student in ... year"],
  "student in ... year": ["年生", "ねんせい", "pupil in ... year, student in ... year"],
  "big": ["大きな", "おおきな", "big, large, great"],
  "large": ["大きな", "おおきな", "big, large, great"],
  "great": ["大きな", "おおきな", "big, large, great"],
  "magnification": ["拡大", "かくだい", "magnification, enlargement, expansion"],
  "enlargement": ["拡大", "かくだい", "magnification, enlargement, expansion"],
  "expansion": ["拡大", "かくだい", "magnification, enlargement, expansion"],
  "greatest": ["最大", "さいだい", "greatest, largest, maximum"],
  "largest": ["最大", "さいだい", "greatest, largest, maximum"],
  "maximum": ["最大", "さいだい", "greatest, largest, maximum"],
  "very": ["実に", "じつに, まことに, げに, しんに", "indeed, really, absolutely, truly, actually, very, quite"],
  "much": ["大いに", "おおいに", "very, much, greatly, a lot of"],
  "greatly": ["大いに", "おおいに", "very, much, greatly, a lot of"],
  "a lot of": ["大いに", "おおいに", "very, much, greatly, a lot of"],
  "tournament": ["大会", "たいかい", "convention, tournament, mass meeting, rally"],
  "mass meeting": ["大会", "たいかい", "convention, tournament, mass meeting, rally"],
  "rally": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "post-secondary education institution": ["大学", "だいがく", "post-secondary education institution, incl. university, college, etc.; the Great Learning - one of the Four Books"],
  "incl. university": ["大学", "だいがく", "post-secondary education institution, incl. university, college, etc.; the Great Learning - one of the Four Books"],
  "college": ["大学", "だいがく", "post-secondary education institution, incl. university, college, etc.; the Great Learning - one of the Four Books"],
  "etc.": ["首相", "しゅしょう", "Prime Minister, Chancellor (Germany, Austria, etc.), Premier"],
  "the great learning - one of the four books": ["大学", "だいがく", "post-secondary education institution, incl. university, college, etc.; the Great Learning - one of the Four Books"],
  "front castle gate": ["大手", "おおて, おおで", "front castle gate; both arms open, outstretched arms; major companies"],
  "both arms open": ["大手", "おおて, おおで", "front castle gate; both arms open, outstretched arms; major companies"],
  "outstretched arms": ["大手", "おおて, おおで", "front castle gate; both arms open, outstretched arms; major companies"],
  "major companies": ["大手", "おおて, おおで", "front castle gate; both arms open, outstretched arms; major companies"],
  "former ministry of finance succeeded by zaimushou in 2000": ["大蔵省", "おおくらしょう", "(former) Ministry of Finance (succeeded by zaimushou in 2000)"],
  "president": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "chief executive": ["大統領", "だいとうりょう", "president, chief executive"],
  "full width": ["大幅", "おおはば", "full width, large scale, drastic"],
  "large scale": ["大幅", "おおはば", "full width, large scale, drastic"],
  "drastic": ["大幅", "おおはば", "full width, large scale, drastic"],
  "ten": ["十", "じゅう, と, とお", "10, ten"],
  "nineteen": ["十九", "じゅうきゅう", "19, nineteen"],
  "october": ["十月", "じゅうがつ", "October"],
  "fifteen": ["十五", "じゅうご", "15, fifteen"],
  "thirteen": ["十三", "じゅうさん", "13, thirteen"],
  "twelve": ["十二", "じゅうに", "12, twelve"],
  "december": ["十二月", "じゅうにがつ", "December"],
  "eighteen": ["十八", "じゅうはち", "18, eighteen"],
  "two": ["二つ", "ふたつ", "two"],
  "february": ["二月", "にがつ", "February"],
  "two hundred": ["二百", "にひゃく", "two hundred, 200"],
  "two out e.g. in baseball": ["二死", "にし", "two out (e.g. in baseball), two down (and one to go)"],
  "two down and one to go": ["二死", "にし", "two out (e.g. in baseball), two down (and one to go)"],
  "second base": ["二塁", "にるい", "second base"],
  "two-base hit": ["二塁打", "にるいだ", "two-base hit, double"],
  "double": ["二塁打", "にるいだ", "two-base hit, double"],
  "foundation": ["設立", "せつりつ", "establishment, foundation, incorporation (of a business)"],
  "basis": ["基調", "きちょう", "basis, keynote"],
  "standard": ["基本", "きほん", "foundation, basis, standard"],
  "head office": ["本社", "ほんしゃ, ほんじゃ", "head office, main office, headquarters; main shrine; this company, this shrine"],
  "main office": ["本社", "ほんしゃ, ほんじゃ", "head office, main office, headquarters; main shrine; this company, this shrine"],
  "headquarters": ["本部", "ほんぶ", "headquarters"],
  "main shrine": ["本社", "ほんしゃ, ほんじゃ", "head office, main office, headquarters; main shrine; this company, this shrine"],
  "this company": ["本社", "ほんしゃ, ほんじゃ", "head office, main office, headquarters; main shrine; this company, this shrine"],
  "this shrine": ["本社", "ほんしゃ, ほんじゃ", "head office, main office, headquarters; main shrine; this company, this shrine"],
  "mere": ["本の", "ほんの", "mere, only, just"],
  "just": ["本の", "ほんの", "mere, only, just"],
  "plenary session": ["本会議", "ほんかいぎ", "plenary session, regular session"],
  "regular session": ["本会議", "ほんかいぎ", "plenary session, regular session"],
  "the person himself": ["本人", "ほんにん", "the person himself"],
  "truth": ["本当", "ほんとう, ほんと", "truth, reality"],
  "reality": ["本当", "ほんとう, ほんと", "truth, reality"],
  "home run baseball": ["本塁打", "ほんるいだ", "home run (baseball)"],
  "centre": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "central": ["中央", "ちゅうおう", "centre, central, center, middle"],
  "center": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "middle": ["中間", "ちゅうかん", "middle, midway, interim"],
  "china": ["中国", "ちゅうごく", "China; South-west most region of Honshu, middle of a country, the Hiroshima area"],
  "south-west most region of honshu": ["中国", "ちゅうごく", "China; South-west most region of Honshu, middle of a country, the Hiroshima area"],
  "middle of a country": ["中国", "ちゅうごく", "China; South-west most region of Honshu, middle of a country, the Hiroshima area"],
  "the hiroshima area": ["中国", "ちゅうごく", "China; South-west most region of Honshu, middle of a country, the Hiroshima area"],
  "heart": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "core": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "focus": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "pivot": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "emphasis": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "balance": ["中心", "ちゅうしん", "center, centre, middle, heart, core, focus, pivot, emphasis, balance"],
  "among other things": ["中でも", "なかでも", "among (other things), inter alia; above all (else)"],
  "inter alia": ["中でも", "なかでも", "among (other things), inter alia; above all (else)"],
  "above all else": ["中でも", "なかでも", "among (other things), inter alia; above all (else)"],
  "midway": ["中間", "ちゅうかん", "middle, midway, interim"],
  "interim": ["中間", "ちゅうかん", "middle, midway, interim"],
  "middle east": ["中東", "ちゅうとう", "Middle East"],
  "on the way": ["途中", "とちゅう", "on the way, en route; in the middle of, midway"],
  "en route": ["途中", "とちゅう", "on the way, en route; in the middle of, midway"],
  "in the middle of": ["途中", "とちゅう", "on the way, en route; in the middle of, midway"],
  "concentration": ["集中", "しゅうちゅう", "concentration, convergence, centralization, integration, gathering together"],
  "convergence": ["集中", "しゅうちゅう", "concentration, convergence, centralization, integration, gathering together"],
  "centralization": ["集中", "しゅうちゅう", "concentration, convergence, centralization, integration, gathering together"],
  "integration": ["統合", "とうごう", "integration, unification, synthesis; integrated, built-in"],
  "gathering together": ["集中", "しゅうちゅう", "concentration, convergence, centralization, integration, gathering together"],
  "middle school": ["中学", "ちゅうがく", "middle school, junior high school"],
  "junior high school": ["中学", "ちゅうがく", "middle school, junior high school"],
  "junior high school student": ["中学生", "ちゅうがくせい", "junior high school student, middle school pupil"],
  "middle school pupil": ["中学生", "ちゅうがくせい", "junior high school student, middle school pupil"],
  "chief": ["首長", "しゅちょう", "head (of organization, organisation), chief"],
  "head": ["首脳", "しゅのう", "head, brains, leading spirit"],
  "committee chairman": ["委員長", "いいんちょう", "committee chairman"],
  "speaker e.g. of assembly": ["議長", "ぎちょう", "chairman, speaker (e.g. of assembly), president (e.g. of council, senate, etc.), moderator (e.g. of a newsgroup)"],
  "president e.g. of council": ["議長", "ぎちょう", "chairman, speaker (e.g. of assembly), president (e.g. of council, senate, etc.), moderator (e.g. of a newsgroup)"],
  "senate": ["議長", "ぎちょう", "chairman, speaker (e.g. of assembly), president (e.g. of council, senate, etc.), moderator (e.g. of a newsgroup)"],
  "moderator e.g. of a newsgroup": ["議長", "ぎちょう", "chairman, speaker (e.g. of assembly), president (e.g. of council, senate, etc.), moderator (e.g. of a newsgroup)"],
  "company president": ["社長", "しゃちょう", "company president, manager, director"],
  "manager": ["経営者", "けいえいしゃ", "manager, proprietor"],
  "director": ["理事", "りじ", "director, board of directors"],
  "growth": ["発展", "はってん", "development, growth"],
  "grow to adulthood": ["成長", "せいちょう", "growth, grow to adulthood"],
  "secretary government": ["長官", "ちょうかん", "secretary (government), director, chief"],
  "eldest son": ["長男", "ちょうなん", "eldest son"],
  "head chief": ["部長", "ぶちょう", "head (chief, director) of a section or department; head of a (school) club, head of a (school) team"],
  "director of a section or department": ["部長", "ぶちょう", "head (chief, director) of a section or department; head of a (school) club, head of a (school) team"],
  "head of a school club": ["部長", "ぶちょう", "head (chief, director) of a section or department; head of a (school) club, head of a (school) team"],
  "head of a school team": ["部長", "ぶちょう", "head (chief, director) of a section or department; head of a (school) club, head of a (school) team"],
  "extension": ["延長", "えんちょう", "extension, elongation, prolongation, lengthening; Enchou era (923.4.11-931.4.26)"],
  "elongation": ["延長", "えんちょう", "extension, elongation, prolongation, lengthening; Enchou era (923.4.11-931.4.26)"],
  "prolongation": ["延長", "えんちょう", "extension, elongation, prolongation, lengthening; Enchou era (923.4.11-931.4.26)"],
  "lengthening": ["延長", "えんちょう", "extension, elongation, prolongation, lengthening; Enchou era (923.4.11-931.4.26)"],
  "enchou era 923.4.11-931.4.26": ["延長", "えんちょう", "extension, elongation, prolongation, lengthening; Enchou era (923.4.11-931.4.26)"],
  "to take out": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to get out": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to put out": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to reveal": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to show": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to submit e.g. thesis": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to turn in": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to publish": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to make public": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to send e.g. letter": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to produce a sound": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to start fire": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to serve food": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "to begin": ["出す", "だす", "to take out, to get out; to put out, to reveal, to show; to submit (e.g. thesis), to turn in; to publish, to make public; to send (e.g. letter); to produce (a sound), to start (fire); to serve (food); to begin"],
  "person's origin town": ["出身", "しゅっしん", "person's origin (town, city, country, etc.); institution from which one graduated; director in charge of employee relations"],
  "city": ["市立", "しりつ, いちりつ", "municipal, city"],
  "institution from which one graduated": ["出身", "しゅっしん", "person's origin (town, city, country, etc.); institution from which one graduated; director in charge of employee relations"],
  "director in charge of employee relations": ["出身", "しゅっしん", "person's origin (town, city, country, etc.); institution from which one graduated; director in charge of employee relations"],
  "export": ["輸出", "ゆしゅつ, しゅしゅつ", "export; efferent (medical)"],
  "efferent medical": ["輸出", "ゆしゅつ, しゅしゅつ", "export; efferent (medical)"],
  "stage appearance": ["出場", "しゅつじょう", "(stage) appearance, participation, performance"],
  "participation": ["関与", "かんよ", "participation, taking part in, participating in, being concerned in"],
  "performance": ["出場", "しゅつじょう", "(stage) appearance, participation, performance"],
  "advance": ["進出", "しんしゅつ", "advance, step forward"],
  "step forward": ["進出", "しんしゅつ", "advance, step forward"],
  "coming out": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "going out": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "outflow": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "efflux": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "rising of the sun or moon": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "attending work": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "appearing on stage": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "one's turn to go on": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "start": ["開始", "かいし", "start, commencement, beginning, initiation"],
  "beginning": ["最初", "さいしょ", "beginning, outset, first, onset"],
  "origins": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "background": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "person or item originating from ...": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "graduate of ...": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "native of ...": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "member of ... lineage": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "architectural member that projects outward": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "highest point of the stern of a ship": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "amount comprising something": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "amount of time or effort required to do something": ["出", "で", "coming out, going out, outflow, efflux, rising (of the sun or moon); attending (work), appearing (on stage), one's turn to go on; start, beginning; origins, background, person (or item) originating from ..., graduate of ..., native of ..., member of ... (lineage); architectural member that projects outward; highest point of the stern of a ship; amount (comprising something), amount of time or effort required to do something"],
  "production e.g. play": ["演出", "えんしゅつ", "production (e.g. play), direction"],
  "direction": ["方", "ほう", "side, direction, way"],
  "to act in a play": ["出演", "しゅつえん", "performance, stage appearance; to act (in a play)"],
  "attendance": ["出席", "しゅっせき", "attendance, presence, appearance; to attend, to be present, to appear"],
  "presence": ["出席", "しゅっせき", "attendance, presence, appearance; to attend, to be present, to appear"],
  "appearance": ["表面", "ひょうめん", "surface, outside, face, appearance"],
  "to attend": ["出席", "しゅっせき", "attendance, presence, appearance; to attend, to be present, to appear"],
  "to be present": ["出席", "しゅっせき", "attendance, presence, appearance; to attend, to be present, to appear"],
  "to appear": ["出席", "しゅっせき", "attendance, presence, appearance; to attend, to be present, to appear"],
  "going on horseback": ["出馬", "しゅつば", "going on horseback; going in person; running for election"],
  "going in person": ["出馬", "しゅつば", "going on horseback; going in person; running for election"],
  "running for election": ["出馬", "しゅつば", "going on horseback; going in person; running for election"],
  "three": ["三つ", "みっつ", "three"],
  "march": ["三月", "さんがつ", "March"],
  "thirty": ["三十", "さんじゅう, みそ", "thirty"],
  "many": ["三千", "さんぜん", "3000; many"],
  "three hundred": ["三百", "さんびゃく", "300, three hundred; 300 mon, trifling amount, two-bit item; shyster"],
  "300 mon": ["三百", "さんびゃく", "300, three hundred; 300 mon, trifling amount, two-bit item; shyster"],
  "trifling amount": ["三百", "さんびゃく", "300, three hundred; 300 mon, trifling amount, two-bit item; shyster"],
  "two-bit item": ["三百", "さんびゃく", "300, three hundred; 300 mon, trifling amount, two-bit item; shyster"],
  "shyster": ["三百", "さんびゃく", "300, three hundred; 300 mon, trifling amount, two-bit item; shyster"],
  "last day of month": ["三十日", "みそか, つごもり, みそ", "last day of month"],
  "third base": ["三塁", "さんるい", "third base"],
  "simultaneously": ["同時", "どうじ", "simultaneous(ly), concurrent, same time, synchronous, together"],
  "concurrent": ["同時", "どうじ", "simultaneous(ly), concurrent, same time, synchronous, together"],
  "same time": ["同時", "どうじ", "simultaneous(ly), concurrent, same time, synchronous, together"],
  "synchronous": ["同時", "どうじ", "simultaneous(ly), concurrent, same time, synchronous, together"],
  "together": ["同時", "どうじ", "simultaneous(ly), concurrent, same time, synchronous, together"],
  "the same firm": ["同社", "どうしゃ", "the same firm"],
  "doing together as equals": ["共同", "きょうどう", "doing together (as equals), sharing, common (land, etc.), joint (statement, etc.), cooperation, co-operation, collaboration, association"],
  "sharing": ["分け", "わけ", "sharing, division; draw, tie"],
  "common land": ["共同", "きょうどう", "doing together (as equals), sharing, common (land, etc.), joint (statement, etc.), cooperation, co-operation, collaboration, association"],
  "joint statement": ["共同", "きょうどう", "doing together (as equals), sharing, common (land, etc.), joint (statement, etc.), cooperation, co-operation, collaboration, association"],
  "cooperation": ["協調", "きょうちょう", "cooperation, conciliation, harmony; firm (market) tone"],
  "co-operation": ["共同", "きょうどう", "doing together (as equals), sharing, common (land, etc.), joint (statement, etc.), cooperation, co-operation, collaboration, association"],
  "collaboration": ["協力", "きょうりょく", "cooperation, collaboration"],
  "same city": ["同市", "どうし", "same city"],
  "cooperative body": ["共同体", "きょうどうたい", "cooperative body, cooperative system, collective, community"],
  "cooperative system": ["共同体", "きょうどうたい", "cooperative body, cooperative system, collective, community"],
  "collective": ["共同体", "きょうどうたい", "cooperative body, cooperative system, collective, community"],
  "community": ["共同体", "きょうどうたい", "cooperative body, cooperative system, collective, community"],
  "the same prefecture": ["同県", "どうけん", "the same prefecture"],
  "the same country": ["同国", "どうこく", "the same country, the same province, the said country"],
  "the same province": ["同国", "どうこく", "the same country, the same province, the said country"],
  "the said country": ["同国", "どうこく", "the same country, the same province, the said country"],
  "the said ministry": ["同省", "どうしょう", "the said ministry, the same ministry"],
  "the same ministry": ["同省", "どうしょう", "the said ministry, the same ministry"],
  "the same political party": ["同党", "どうとう", "the same political party"],
  "time": ["時間", "じかん", "time; hours"],
  "hour": ["時", "とき", "time, hour; occasion, moment"],
  "occasion": ["時", "とき", "time, hour; occasion, moment"],
  "moment": ["時", "とき", "time, hour; occasion, moment"],
  "hours": ["時間", "じかん", "time; hours"],
  "season": ["時期", "じき", "time, season, period; soon, shortly"],
  "period": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "soon": ["今", "いま", "now, the present time, just now, soon, immediately, (one) more"],
  "shortly": ["時期", "じき", "time, season, period; soon, shortly"],
  "epoch": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "era": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "the times": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "those days": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "oldness": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "ancientness": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "antiquity": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "antique": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "period piece": ["時代", "じだい", "period, epoch, era, age; the times, those days; oldness, ancientness, antiquity; antique, period piece"],
  "at that time": ["当時", "とうじ", "at that time, in those days"],
  "in those days": ["当時", "とうじ", "at that time, in those days"],
  "events of the day": ["時事", "じじ", "events of the day, current affairs"],
  "current affairs": ["時事", "じじ", "events of the day, current affairs"],
  "about an hour": ["時半", "じはん", "about an hour, short time; half past (the hour)"],
  "half past the hour": ["時半", "じはん", "about an hour, short time; half past (the hour)"],
  "temporary": ["暫定", "ざんてい", "tentative, temporary"],
  "special": ["臨時", "りんじ", "temporary, special, extraordinary"],
  "extraordinary": ["臨時", "りんじ", "temporary, special, extraordinary"],
  "rule": ["主義", "しゅぎ", "doctrine, rule, principle"],
  "government": ["与党", "よとう", "government party, (ruling) party in power, government"],
  "administration": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "financial affairs": ["財政", "ざいせい", "financial affairs, public finance"],
  "public finance": ["財政", "ざいせい", "financial affairs, public finance"],
  "political world": ["政界", "せいかい", "political world"],
  "political administration": ["政権", "せいけん", "(political) administration, political power"],
  "political power": ["権力", "けんりょく", "(political) power, authority, influence"],
  "political measures": ["政策", "せいさく", "political measures, policy"],
  "policy": ["方針", "ほうしん", "objective, plan, policy"],
  "politics": ["政治", "せいじ", "politics, government"],
  "politician": ["政治家", "せいじか", "politician, statesman"],
  "statesman": ["政治家", "せいじか", "politician, statesman"],
  "member of political party": ["政党", "せいとう", "(member of) political party"],
  "thing": ["事", "こと", "thing, matter, fact, circumstances, business, reason, experience"],
  "matter": ["内容", "ないよう", "subject, contents, matter, substance, detail, import"],
  "fact": ["事実", "じじつ", "fact, truth, reality"],
  "circumstances": ["事情", "じじょう", "circumstances, consideration, conditions, situation, reasons"],
  "business": ["経済", "けいざい", "economics, business, finance, economy"],
  "reason": ["理由", "りゆう", "reason, pretext, motive"],
  "experience": ["経験", "けいけん", "experience"],
  "executive secretary": ["幹事", "かんじ", "executive secretary, coordinator, organizer, person in charge of making arrangements"],
  "coordinator": ["幹事", "かんじ", "executive secretary, coordinator, organizer, person in charge of making arrangements"],
  "organizer": ["幹事", "かんじ", "executive secretary, coordinator, organizer, person in charge of making arrangements"],
  "person in charge of making arrangements": ["幹事", "かんじ", "executive secretary, coordinator, organizer, person in charge of making arrangements"],
  "article": ["記事", "きじ", "article, news story, report, account"],
  "news story": ["記事", "きじ", "article, news story, report, account"],
  "report": ["記事", "きじ", "article, news story, report, account"],
  "account": ["記事", "きじ", "article, news story, report, account"],
  "military affairs": ["軍事", "ぐんじ", "military affairs"],
  "work": ["業務", "ぎょうむ", "business, affairs, duties, work, procedure, task, action, function"],
  "job": ["仕事", "しごと", "work, job, business, occupation, employment, vocation, task; work"],
  "occupation": ["仕事", "しごと", "work, job, business, occupation, employment, vocation, task; work"],
  "employment": ["仕事", "しごと", "work, job, business, occupation, employment, vocation, task; work"],
  "vocation": ["仕事", "しごと", "work, job, business, occupation, employment, vocation, task; work"],
  "task": ["課題", "かだい", "subject, theme, task, challenge, issue"],
  "project": ["事業", "じぎょう", "project, enterprise, business, industry, operations"],
  "enterprise": ["事業", "じぎょう", "project, enterprise, business, industry, operations"],
  "industry": ["事業", "じぎょう", "project, enterprise, business, industry, operations"],
  "operations": ["営業", "えいぎょう", "business, trade, sales, operations"],
  "affair": ["事件", "じけん", "event, affair, incident, case, plot, trouble, scandal"],
  "incident": ["事故", "じこ", "accident, incident, trouble; circumstances, reasons"],
  "case": ["事件", "じけん", "event, affair, incident, case, plot, trouble, scandal"],
  "plot": ["事件", "じけん", "event, affair, incident, case, plot, trouble, scandal"],
  "trouble": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "scandal": ["事件", "じけん", "event, affair, incident, case, plot, trouble, scandal"],
  "accident": ["事故", "じこ", "accident, incident, trouble; circumstances, reasons"],
  "reasons": ["事情", "じじょう", "circumstances, consideration, conditions, situation, reasons"],
  "consideration": ["事情", "じじょう", "circumstances, consideration, conditions, situation, reasons"],
  "conditions": ["事情", "じじょう", "circumstances, consideration, conditions, situation, reasons"],
  "situation": ["立場", "たちば", "standpoint, position, situation"],
  "for one's self": ["自ら", "みずから", "for one's self, personally"],
  "personally": ["自身", "じしん", "by oneself, personally"],
  "self-defence force": ["自衛隊", "じえいたい", "self-defence force, self-defense force; Japan Self-Defence Force, JSDF"],
  "self-defense force": ["自衛隊", "じえいたい", "self-defence force, self-defense force; Japan Self-Defence Force, JSDF"],
  "japan self-defence force": ["自衛隊", "じえいたい", "self-defence force, self-defense force; Japan Self-Defence Force, JSDF"],
  "jsdf": ["自衛隊", "じえいたい", "self-defence force, self-defense force; Japan Self-Defence Force, JSDF"],
  "by oneself": ["自身", "じしん", "by oneself, personally"],
  "nature": ["自然", "しぜん", "nature, spontaneity; naturally, spontaneously"],
  "spontaneity": ["自然", "しぜん", "nature, spontaneity; naturally, spontaneously"],
  "naturally": ["自然", "しぜん", "nature, spontaneity; naturally, spontaneously"],
  "spontaneously": ["自然", "しぜん", "nature, spontaneity; naturally, spontaneously"],
  "one's home": ["自宅", "じたく", "one's home"],
  "automobile": ["自動車", "じどうしゃ", "automobile"],
  "myself": ["自分", "じぶん", "myself, yourself, oneself, himself, herself; I, me"],
  "yourself": ["自分", "じぶん", "myself, yourself, oneself, himself, herself; I, me"],
  "oneself": ["自分", "じぶん", "myself, yourself, oneself, himself, herself; I, me"],
  "himself": ["自分", "じぶん", "myself, yourself, oneself, himself, herself; I, me"],
  "herself": ["自分", "じぶん", "myself, yourself, oneself, himself, herself; I, me"],
  "i": ["自分", "じぶん", "myself, yourself, oneself, himself, herself; I, me"],
  "me": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "freedom": ["自由", "じゆう", "freedom, liberty, as it pleases you"],
  "liberty": ["自由", "じゆう", "freedom, liberty, as it pleases you"],
  "as it pleases you": ["自由", "じゆう", "freedom, liberty, as it pleases you"],
  "liberal democratic party": ["自民党", "じみんとう", "Liberal Democratic Party, LDP"],
  "ldp": ["自民党", "じみんとう", "Liberal Democratic Party, LDP"],
  "to perform": ["行う", "おこなう", "to perform, to do, to conduct oneself, to carry out"],
  "to do": ["行う", "おこなう", "to perform, to do, to conduct oneself, to carry out"],
  "to conduct oneself": ["行う", "おこなう", "to perform, to do, to conduct oneself, to carry out"],
  "to carry out": ["行う", "おこなう", "to perform, to do, to conduct oneself, to carry out"],
  "line i.e. of text": ["行", "ぎょう", "line (i.e. of text), row, verse; carya (austerities); samskara (formations); running script (a semi-cursive style of kanji)"],
  "row": ["行", "ぎょう", "line (i.e. of text), row, verse; carya (austerities); samskara (formations); running script (a semi-cursive style of kanji)"],
  "verse": ["一連", "いちれん", "series, chain, sequence; two reams (i.e. 1000 sheets of paper); verse, stanza"],
  "carya austerities": ["行", "ぎょう", "line (i.e. of text), row, verse; carya (austerities); samskara (formations); running script (a semi-cursive style of kanji)"],
  "samskara formations": ["行", "ぎょう", "line (i.e. of text), row, verse; carya (austerities); samskara (formations); running script (a semi-cursive style of kanji)"],
  "running script a semi-cursive style of kanji": ["行", "ぎょう", "line (i.e. of text), row, verse; carya (austerities); samskara (formations); running script (a semi-cursive style of kanji)"],
  "bank": ["銀行", "ぎんこう", "bank"],
  "action": ["行動", "こうどう", "action, conduct, behaviour, behavior, mobilization, mobilisation"],
  "conduct": ["行動", "こうどう", "action, conduct, behaviour, behavior, mobilization, mobilisation"],
  "behaviour": ["行動", "こうどう", "action, conduct, behaviour, behavior, mobilization, mobilisation"],
  "behavior": ["行動", "こうどう", "action, conduct, behaviour, behavior, mobilization, mobilisation"],
  "mobilization": ["行動", "こうどう", "action, conduct, behaviour, behavior, mobilization, mobilisation"],
  "mobilisation": ["行動", "こうどう", "action, conduct, behaviour, behavior, mobilization, mobilisation"],
  "present": ["現行", "げんこう", "present, current, in operation"],
  "current": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "in operation": ["現行", "げんこう", "present, current, in operation"],
  "act": ["行為", "こうい", "act, deed, conduct"],
  "deed": ["行為", "こうい", "act, deed, conduct"],
  "one's whereabouts": ["行方", "ゆくえ", "(one's) whereabouts; course, direction"],
  "course": ["行方", "ゆくえ", "(one's) whereabouts; course, direction"],
  "issue publications": ["発行", "はっこう", "issue (publications), publishing; raising an event (software)"],
  "publishing": ["発行", "はっこう", "issue (publications), publishing; raising an event (software)"],
  "raising an event software": ["発行", "はっこう", "issue (publications), publishing; raising an event (software)"],
  "travel": ["旅行", "りょこう", "travel, trip"],
  "trip": ["旅行", "りょこう", "travel, trip"],
  "public": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "socialist party": ["社会党", "しゃかいとう", "Socialist Party"],
  "company employee": ["社員", "しゃいん", "company employee; company stockholders (esp. in legal contexts), members of a corporation"],
  "company stockholders esp. in legal contexts": ["社員", "しゃいん", "company employee; company stockholders (esp. in legal contexts), members of a corporation"],
  "members of a corporation": ["社員", "しゃいん", "company employee; company stockholders (esp. in legal contexts), members of a corporation"],
  "executive vice-president": ["副社長", "ふくしゃちょう", "executive vice-president"],
  "democratic socialist party": ["民社党", "みんしゃとう", "Democratic Socialist Party"],
  "one's company": ["自社", "じしゃ", "one's company, company one works for; in-house, belonging to the company"],
  "company one works for": ["自社", "じしゃ", "one's company, company one works for; in-house, belonging to the company"],
  "in-house": ["自社", "じしゃ", "one's company, company one works for; in-house, belonging to the company"],
  "belonging to the company": ["自社", "じしゃ", "one's company, company one works for; in-house, belonging to the company"],
  "opinion": ["意見", "いけん", "opinion, view"],
  "view": ["意見", "いけん", "opinion, view"],
  "review": ["見直し", "みなおし", "review, reconsideration, revision"],
  "reconsideration": ["見直し", "みなおし", "review, reconsideration, revision"],
  "revision": ["見直し", "みなおし", "review, reconsideration, revision"],
  "viewpoint": ["見方", "みかた", "viewpoint"],
  "perspective": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "unobstructed view": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "outlook": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "forecast": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "prospect": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "insight": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "foresight": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "visibility": ["見通し", "みとおし", "perspective, unobstructed view, outlook, forecast, prospect, insight, foresight, visibility"],
  "point of view": ["見解", "けんかい", "opinion, point of view"],
  "prospects": ["見込み", "みこみ", "forecast, prospects, expectation, hope"],
  "expectation": ["予定", "よてい", "plans, arrangement, schedule, program, programme, expectation, estimate"],
  "hope": ["見込み", "みこみ", "forecast, prospects, expectation, hope"],
  "discovery": ["発見", "はっけん", "discovery, detection, finding"],
  "detection": ["発見", "はっけん", "discovery, detection, finding"],
  "finding": ["発見", "はっけん", "discovery, detection, finding"],
  "splendid": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "magnificent": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "beautiful": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "admirable": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "praiseworthy act": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "feat": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "commendable deed": ["見事", "みごと", "splendid, magnificent, beautiful, admirable; praiseworthy act, feat, commendable deed"],
  "to be found": ["見つかる", "みつかる", "to be found, to be discovered"],
  "to be discovered": ["見つかる", "みつかる", "to be found, to be discovered"],
  "september": ["九月", "くがつ", "September"],
  "may": ["五月", "ごがつ", "May"],
  "this month": ["今月", "こんげつ", "this month"],
  "april": ["四月", "しがつ", "April"],
  "july": ["七月", "しちがつ", "July"],
  "division": ["分野", "ぶんや", "field, sphere, realm, division, branch"],
  "draw": ["分け", "わけ", "sharing, division; draw, tie"],
  "tie": ["五分", "ごぶ", "half, 50%, tie, evenness; 5 parts, 5%"],
  "to divide": ["分ける", "わける", "to divide, to separate, to make distinctions, to differentiate (between)"],
  "to separate": ["分ける", "わける", "to divide, to separate, to make distinctions, to differentiate (between)"],
  "to make distinctions": ["分ける", "わける", "to divide, to separate, to make distinctions, to differentiate (between)"],
  "to differentiate between": ["分ける", "わける", "to divide, to separate, to make distinctions, to differentiate (between)"],
  "portion": ["部分", "ぶぶん", "portion, section, part"],
  "section": ["地区", "ちく", "district, section, sector"],
  "part": ["部分", "ぶぶん", "portion, section, part"],
  "field": ["部門", "ぶもん", "class, group, category, department, field, branch"],
  "sphere": ["分野", "ぶんや", "field, sphere, realm, division, branch"],
  "realm": ["分野", "ぶんや", "field, sphere, realm, division, branch"],
  "branch": ["部門", "ぶもん", "class, group, category, department, field, branch"],
  "plenty": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "enough": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "sufficient": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "satisfactory": ["好調", "こうちょう", "favourable, favorable, promising, satisfactory, in good shape"],
  "adequate": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "division into ten": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "perfectly": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "thoroughly": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "fully": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "in full": ["十分", "じゅうぶん", "plenty, enough, sufficient, satisfactory, adequate; division into ten; perfectly, thoroughly, fully, in full"],
  "disposal": ["処理", "しょり", "processing, dealing with, treatment, disposition, disposal"],
  "dealing": ["処分", "しょぶん", "disposal, dealing, punishment"],
  "punishment": ["処分", "しょぶん", "disposal, dealing, punishment"],
  "half": ["五分", "ごぶ", "half, 50%, tie, evenness; 5 parts, 5%"],
  "amount left over": ["残った分", "のこったぶん", "amount left over"],
  "feeling": ["気分", "きぶん", "feeling, mood"],
  "mood": ["気分", "きぶん", "feeling, mood"],
  "member of the diet": ["議員", "ぎいん", "member of the Diet, congress or parliament"],
  "congress or parliament": ["議員", "ぎいん", "member of the Diet, congress or parliament"],
  "consultation": ["相談", "そうだん", "consultation, discussion"],
  "negotiation": ["協議", "きょうぎ", "conference, consultation, discussion, negotiation"],
  "resolution": ["決議", "けつぎ", "resolution, vote, decision"],
  "vote": ["決議", "けつぎ", "resolution, vote, decision"],
  "decision": ["決意", "けつい", "decision, determination"],
  "deliberation": ["審議", "しんぎ", "deliberation"],
  "argument": ["論議", "ろんぎ", "discussion, argument, debate"],
  "debate": ["論議", "ろんぎ", "discussion, argument, debate"],
  "cabinet meeting": ["閣議", "かくぎ", "cabinet meeting"],
  "parliamentary seat": ["議席", "ぎせき", "parliamentary seat"],
  "behind": ["後ろ", "うしろ", "back, behind, rear"],
  "rear": ["後ろ", "うしろ", "back, behind, rear"],
  "after": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "later": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "after one's death": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "remainder": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "the rest": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "descendant": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "successor": ["後継", "こうけい", "successor"],
  "heir": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "past/previous": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "more i.e. five more minutes": ["後", "あと", "behind, rear; after, later; after one's death; remainder, the rest; descendant, successor, heir; past/previous; more (i.e. five more minutes)"],
  "afternoon": ["午後", "ごご", "afternoon, p.m."],
  "p.m.": ["午後", "ごご", "afternoon, p.m."],
  "back": ["後ろ", "うしろ", "back, behind, rear"],
  "from now on": ["今後", "こんご", "from now on, hereafter"],
  "hereafter": ["今後", "こんご", "from now on, hereafter"],
  "last": ["最終", "さいしゅう", "last, final, closing"],
  "end": ["最後", "さいご", "last, end, conclusion; (after -tara form or -ta form followed by \"ga\") no sooner than, right after (often having negative consequences); one's final moments"],
  "conclusion": ["最後", "さいご", "last, end, conclusion; (after -tara form or -ta form followed by \"ga\") no sooner than, right after (often having negative consequences); one's final moments"],
  "after -tara form or -ta form followed by ga no sooner than": ["最後", "さいご", "last, end, conclusion; (after -tara form or -ta form followed by \"ga\") no sooner than, right after (often having negative consequences); one's final moments"],
  "right after often having negative consequences": ["最後", "さいご", "last, end, conclusion; (after -tara form or -ta form followed by \"ga\") no sooner than, right after (often having negative consequences); one's final moments"],
  "one's final moments": ["最後", "さいご", "last, end, conclusion; (after -tara form or -ta form followed by \"ga\") no sooner than, right after (often having negative consequences); one's final moments"],
  "postwar period": ["戦後", "せんご", "postwar period, period after Second World War"],
  "period after second world war": ["戦後", "せんご", "postwar period, period after Second World War"],
  "second half": ["後半", "こうはん", "second half, latter half"],
  "latter half": ["後半", "こうはん", "second half, latter half"],
  "immediately following": ["直後", "ちょくご", "immediately following"],
  "support": ["対応", "たいおう", "interaction, correspondence, coping with, dealing with, support"],
  "backing": ["後援", "こうえん", "support, backing"],
  "morning": ["午前", "ごぜん", "morning, a.m."],
  "a.m.": ["午前", "ごぜん", "morning, a.m."],
  "last time": ["前回", "ぜんかい", "last time, last installment, last instalment, last session"],
  "last installment": ["前回", "ぜんかい", "last time, last installment, last instalment, last session"],
  "last instalment": ["前回", "ぜんかい", "last time, last installment, last instalment, last session"],
  "last session": ["前回", "ぜんかい", "last time, last installment, last instalment, last session"],
  "preamble": ["前提", "ぜんてい", "preamble, premise, reason, prerequisite, condition, assumption, hypothesis"],
  "premise": ["前提", "ぜんてい", "preamble, premise, reason, prerequisite, condition, assumption, hypothesis"],
  "prerequisite": ["前提", "ぜんてい", "preamble, premise, reason, prerequisite, condition, assumption, hypothesis"],
  "condition": ["制約", "せいやく", "limitation, restriction, condition, constraints"],
  "assumption": ["前提", "ぜんてい", "preamble, premise, reason, prerequisite, condition, assumption, hypothesis"],
  "hypothesis": ["前提", "ぜんてい", "preamble, premise, reason, prerequisite, condition, assumption, hypothesis"],
  "just before": ["直前", "ちょくぜん", "just before"],
  "name": ["名目", "めいもく, みょうもく", "name, title, appellation, (something) nominal; (under the) pretext (of), pretense"],
  "full name": ["氏名", "しめい", "full name, identity"],
  "given name": ["名前", "なまえ", "name, full name; given name, first name"],
  "first name": ["名前", "なまえ", "name, full name; given name, first name"],
  "first half": ["前半", "ぜんはん, ぜんぱん", "first half"],
  "ago": ["以前", "いぜん", "ago, since, before, previous"],
  "since": ["以前", "いぜん", "ago, since, before, previous"],
  "before": ["以前", "いぜん", "ago, since, before, previous"],
  "previous": ["以前", "いぜん", "ago, since, before, previous"],
  "prior": ["事前", "じぜん", "prior, beforehand, in advance"],
  "beforehand": ["事前", "じぜん", "prior, beforehand, in advance"],
  "in advance": ["事前", "じぜん", "prior, beforehand, in advance"],
  "townspeople": ["市民", "しみん", "citizen, townspeople"],
  "citizens": ["住民", "じゅうみん", "citizens, inhabitants, residents, population"],
  "inhabitants": ["住民", "じゅうみん", "citizens, inhabitants, residents, population"],
  "residents": ["住民", "じゅうみん", "citizens, inhabitants, residents, population"],
  "civilian": ["民間", "みんかん", "private, civilian, civil, popular, folk, unofficial"],
  "civil": ["民間", "みんかん", "private, civilian, civil, popular, folk, unofficial"],
  "folk": ["民間", "みんかん", "private, civilian, civil, popular, folk, unofficial"],
  "unofficial": ["民間", "みんかん", "private, civilian, civil, popular, folk, unofficial"],
  "democracy": ["民主", "みんしゅ", "democracy, popular sovereignty; democratic"],
  "popular sovereignty": ["民主", "みんしゅ", "democracy, popular sovereignty; democratic"],
  "democratic": ["民主", "みんしゅ", "democracy, popular sovereignty; democratic"],
  "race": ["民族", "みんぞく", "people, race, nation"],
  "to live": ["生きる", "いきる", "to live, to exist"],
  "to exist": ["生きる", "いきる", "to live, to exist"],
  "student esp. a university student": ["学生", "がくせい", "student (esp. a university student)"],
  "living": ["生活", "せいかつ", "living, life (one's daily existence), livelihood"],
  "life one's daily existence": ["生活", "せいかつ", "living, life (one's daily existence), livelihood"],
  "livelihood": ["生活", "せいかつ", "living, life (one's daily existence), livelihood"],
  "production": ["生産", "せいさん", "production, manufacture"],
  "manufacture": ["生産", "せいさん", "production, manufacture"],
  "ministry of health and welfare now ministry of health": ["厚生省", "こうせいしょう", "Ministry of Health and Welfare (now Ministry of Health, Labour and Welfare)"],
  "labour and welfare": ["厚生省", "こうせいしょう", "Ministry of Health and Welfare (now Ministry of Health, Labour and Welfare)"],
  "rebirth": ["新生", "しんせい", "rebirth, new birth, nascent"],
  "new birth": ["新生", "しんせい", "rebirth, new birth, nascent"],
  "nascent": ["新生", "しんせい", "rebirth, new birth, nascent"],
  "human life i.e. conception to death": ["人生", "じんせい", "(human) life (i.e. conception to death)"],
  "pupil": ["生徒", "せいと", "pupil"],
  "teacher": ["先生", "せんせい", "teacher, master, doctor; with names of teachers, etc. as an honorific"],
  "master": ["先生", "せんせい", "teacher, master, doctor; with names of teachers, etc. as an honorific"],
  "doctor": ["先生", "せんせい", "teacher, master, doctor; with names of teachers, etc. as an honorific"],
  "with names of teachers": ["先生", "せんせい", "teacher, master, doctor; with names of teachers, etc. as an honorific"],
  "etc. as an honorific": ["先生", "せんせい", "teacher, master, doctor; with names of teachers, etc. as an honorific"],
  "taxonomical tribe": ["連", "れん", "(taxonomical) tribe; quinella (quiniela); party, company, group; two reams (i.e. 1000 sheets of paper)"],
  "quinella quiniela": ["連", "れん", "(taxonomical) tribe; quinella (quiniela); party, company, group; two reams (i.e. 1000 sheets of paper)"],
  "party": ["連", "れん", "(taxonomical) tribe; quinella (quiniela); party, company, group; two reams (i.e. 1000 sheets of paper)"],
  "group": ["部門", "ぶもん", "class, group, category, department, field, branch"],
  "two reams i.e. 1000 sheets of paper": ["一連", "いちれん", "series, chain, sequence; two reams (i.e. 1000 sheets of paper); verse, stanza"],
  "relation": ["関連", "かんれん", "relation, connection, relevance"],
  "connection": ["関連", "かんれん", "relation, connection, relevance"],
  "relevance": ["関連", "かんれん", "relation, connection, relevance"],
  "union": ["組合", "くみあい", "association, union"],
  "alliance": ["連立", "れんりつ", "alliance, coalition"],
  "combination": ["連合", "れんごう", "union, alliance, combination"],
  "serial": ["連続", "れんぞく", "serial, consecutive, continuity, occurring in succession, continuing"],
  "consecutive": ["連続", "れんぞく", "serial, consecutive, continuity, occurring in succession, continuing"],
  "continuity": ["連続", "れんぞく", "serial, consecutive, continuity, occurring in succession, continuing"],
  "occurring in succession": ["連続", "れんぞく", "serial, consecutive, continuity, occurring in succession, continuing"],
  "continuing": ["連続", "れんぞく", "serial, consecutive, continuity, occurring in succession, continuing"],
  "commonwealth": ["連邦", "れんぽう", "commonwealth, federation of states"],
  "federation of states": ["連邦", "れんぽう", "commonwealth, federation of states"],
  "coalition": ["連立", "れんりつ", "alliance, coalition"],
  "league": ["連盟", "れんめい", "league, union, alliance"],
  "to contact": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "to get in touch": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "contacting": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "getting in touch": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "communication": ["交通", "こうつう", "communication, transportation, traffic, intercourse"],
  "call": ["訪問", "ほうもん", "call, visit"],
  "message": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "coordination": ["総合", "そうごう", "synthesis, coordination, putting together, integration, composite; comprehensive"],
  "junction": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "intercalary": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "intercalaris": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "internuncial": ["連絡", "れんらく", "to contact, to get in touch; contacting, getting in touch, communication, call, message; connection, coordination, junction; intercalary, intercalaris, internuncial"],
  "series": ["一連", "いちれん", "series, chain, sequence; two reams (i.e. 1000 sheets of paper); verse, stanza"],
  "chain": ["一連", "いちれん", "series, chain, sequence; two reams (i.e. 1000 sheets of paper); verse, stanza"],
  "sequence": ["一連", "いちれん", "series, chain, sequence; two reams (i.e. 1000 sheets of paper); verse, stanza"],
  "stanza": ["一連", "いちれん", "series, chain, sequence; two reams (i.e. 1000 sheets of paper); verse, stanza"],
  "five": ["五つ", "いつつ", "five"],
  "the olympics": ["五輪", "ごりん", "the Olympics"],
  "fifty": ["五十", "ごじゅう, いそ, い", "fifty"],
  "50%": ["五分", "ごぶ", "half, 50%, tie, evenness; 5 parts, 5%"],
  "evenness": ["五分", "ごぶ", "half, 50%, tie, evenness; 5 parts, 5%"],
  "5 parts": ["五分", "ごぶ", "half, 50%, tie, evenness; 5 parts, 5%"],
  "5%": ["五分", "ごぶ", "half, 50%, tie, evenness; 5 parts, 5%"],
  "the 53 toukaidou stages": ["五十三次", "ごじゅうさんつぎ", "the 53 Toukaidou stages"],
  "the five senses": ["五感", "ごかん", "the five senses"],
  "the japanese syllabary": ["五十音", "ごじゅうおん", "the Japanese syllabary"],
  "departure": ["発", "はつ", "departure, departing (from ...), departing (at time ...); beginning; issued by (e.g. document); counter for gunshots, counter for blows (punches)"],
  "departing from ...": ["発", "はつ", "departure, departing (from ...), departing (at time ...); beginning; issued by (e.g. document); counter for gunshots, counter for blows (punches)"],
  "departing at time ...": ["発", "はつ", "departure, departing (from ...), departing (at time ...); beginning; issued by (e.g. document); counter for gunshots, counter for blows (punches)"],
  "issued by e.g. document": ["発", "はつ", "departure, departing (from ...), departing (at time ...); beginning; issued by (e.g. document); counter for gunshots, counter for blows (punches)"],
  "counter for gunshots": ["発", "はつ", "departure, departing (from ...), departing (at time ...); beginning; issued by (e.g. document); counter for gunshots, counter for blows (punches)"],
  "counter for blows punches": ["発", "はつ", "departure, departing (from ...), departing (at time ...); beginning; issued by (e.g. document); counter for gunshots, counter for blows (punches)"],
  "development": ["動き", "うごき", "movement, activity, trend, development, change"],
  "exploitation": ["開発", "かいはつ", "development, exploitation"],
  "utterance": ["発言", "はつげん", "utterance, speech, proposal"],
  "speech": ["発言", "はつげん", "utterance, speech, proposal"],
  "proposal": ["提言", "ていげん", "proposal, motion"],
  "announcement": ["宣言", "せんげん", "declaration, proclamation, announcement"],
  "publication": ["発表", "はっぴょう", "announcement, publication"],
  "to repel": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "to oppose": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "to revolt": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "to react sharply against": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "opposition": ["対立", "たいりつ", "confrontation, opposition, antagonism"],
  "rebellion": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "resistance": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "backlash": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "recovery e.g. in stock prices": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "rebound": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "to rally": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "to recover": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "to rebound": ["反発", "はんぱつ", "to repel, to oppose, to revolt, to react sharply (against); opposition, rebellion, resistance, backlash; rally, recovery (e.g. in stock prices), rebound; to rally, to recover, to rebound"],
  "vigor": ["活発", "かっぱつ", "vigor, vigour, active, lively"],
  "vigour": ["活発", "かっぱつ", "vigor, vigour, active, lively"],
  "active": ["活発", "かっぱつ", "vigor, vigour, active, lively"],
  "lively": ["活発", "かっぱつ", "vigor, vigour, active, lively"],
  "nuclear power plant": ["原発", "げんぱつ", "nuclear power plant, nuclear power supply"],
  "nuclear power supply": ["原発", "げんぱつ", "nuclear power plant, nuclear power supply"],
  "forerunner": ["先発", "せんぱつ", "forerunner, advance party, going on ahead; being in a (team sports) match or game from the start, starting"],
  "advance party": ["先発", "せんぱつ", "forerunner, advance party, going on ahead; being in a (team sports) match or game from the start, starting"],
  "going on ahead": ["先発", "せんぱつ", "forerunner, advance party, going on ahead; being in a (team sports) match or game from the start, starting"],
  "being in a team sports match or game from the start": ["先発", "せんぱつ", "forerunner, advance party, going on ahead; being in a (team sports) match or game from the start, starting"],
  "starting": ["先発", "せんぱつ", "forerunner, advance party, going on ahead; being in a (team sports) match or game from the start, starting"],
  "space between": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "gap": ["開き", "ひらき", "opening, gap; dried and opened fish"],
  "interval": ["期間", "きかん", "period, term, interval"],
  "distance": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "time between": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "pause": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "break": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "span temporal or spatial": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "stretch": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "period while": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "relationship between": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "among": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "members within": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "due to": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "because of": ["間", "あいだ", "space (between), gap, interval, distance; time (between), pause, break; span (temporal or spatial), stretch, period (while); relationship (between, among); members (within, among); due to, because of"],
  "before long": ["間もなく", "まもなく", "soon, before long, in a short time; (after verb) lacking time to ..., without time to ..."],
  "in a short time": ["間もなく", "まもなく", "soon, before long, in a short time; (after verb) lacking time to ..., without time to ..."],
  "after verb lacking time to ...": ["間もなく", "まもなく", "soon, before long, in a short time; (after verb) lacking time to ..., without time to ..."],
  "without time to ...": ["間もなく", "まもなく", "soon, before long, in a short time; (after verb) lacking time to ..., without time to ..."],
  "term": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "fellow": ["仲間", "なかま", "company, fellow, colleague, associate, comrade, mate, group, circle of friends, partner"],
  "colleague": ["仲間", "なかま", "company, fellow, colleague, associate, comrade, mate, group, circle of friends, partner"],
  "associate": ["仲間", "なかま", "company, fellow, colleague, associate, comrade, mate, group, circle of friends, partner"],
  "comrade": ["仲間", "なかま", "company, fellow, colleague, associate, comrade, mate, group, circle of friends, partner"],
  "mate": ["仲間", "なかま", "company, fellow, colleague, associate, comrade, mate, group, circle of friends, partner"],
  "circle of friends": ["仲間", "なかま", "company, fellow, colleague, associate, comrade, mate, group, circle of friends, partner"],
  "partner": ["相手", "あいて", "companion, partner, company; other party, addressee; opponent (sports, etc.)"],
  "space": ["空間", "くうかん", "space, room, airspace"],
  "room": ["部屋", "へや", "room; sumo stable"],
  "airspace": ["空間", "くうかん", "space, room, airspace"],
  "interaction": ["対話", "たいわ", "interactive, interaction, conversation, dialogue"],
  "correspondence": ["通信", "つうしん", "correspondence, communication, transmission, news, signal"],
  "coping with": ["対応", "たいおう", "interaction, correspondence, coping with, dealing with, support"],
  "dealing with": ["処理", "しょり", "processing, dealing with, treatment, disposition, disposal"],
  "counter-plan": ["対策", "たいさく", "counter-plan, counter-measure"],
  "counter-measure": ["対策", "たいさく", "counter-plan, counter-measure"],
  "target": ["目標", "もくひょう", "mark, objective, target"],
  "object of worship": ["対象", "たいしょう", "target, object (of worship, study, etc.), subject (of taxation, etc.)"],
  "study": ["対象", "たいしょう", "target, object (of worship, study, etc.), subject (of taxation, etc.)"],
  "subject of taxation": ["対象", "たいしょう", "target, object (of worship, study, etc.), subject (of taxation, etc.)"],
  "antagonism": ["対立", "たいりつ", "confrontation, opposition, antagonism"],
  "hostility": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "contrast": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "objection": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "dissension": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "reverse": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "opposite": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "vice versa": ["反対", "はんたい", "opposition, resistance, antagonism, hostility, contrast, objection, dissension, reverse, opposite, vice versa"],
  "confrontation": ["対立", "たいりつ", "confrontation, opposition, antagonism"],
  "interactive": ["対話", "たいわ", "interactive, interaction, conversation, dialogue"],
  "dialogue": ["対話", "たいわ", "interactive, interaction, conversation, dialogue"],
  "with respect to japan": ["対日", "たいにち", "with respect to Japan, with Japan"],
  "with japan": ["対日", "たいにち", "with respect to Japan, with Japan"],
  "committee of the national diet": ["国対", "こくたい", "Committee of the National Diet"],
  "absolutely": ["実に", "じつに, まことに, げに, しんに", "indeed, really, absolutely, truly, actually, very, quite"],
  "unconditionally": ["絶対", "ぜったい", "absolutely, unconditionally; absolute, unconditional, unmistakable; absoluteness"],
  "absolute": ["絶対", "ぜったい", "absolutely, unconditionally; absolute, unconditional, unmistakable; absoluteness"],
  "unconditional": ["絶対", "ぜったい", "absolutely, unconditionally; absolute, unconditional, unmistakable; absoluteness"],
  "unmistakable": ["絶対", "ぜったい", "absolutely, unconditionally; absolute, unconditional, unmistakable; absoluteness"],
  "absoluteness": ["絶対", "ぜったい", "absolutely, unconditionally; absolute, unconditional, unmistakable; absoluteness"],
  "external": ["対外", "たいがい", "external, foreign"],
  "foreign": ["海外", "かいがい", "foreign, abroad, overseas"],
  "doomed": ["上がったり", "あがったり", "doomed, in a bad state, poor (e.g. business)"],
  "in a bad state": ["上がったり", "あがったり", "doomed, in a bad state, poor (e.g. business)"],
  "poor e.g. business": ["上がったり", "あがったり", "doomed, in a bad state, poor (e.g. business)"],
  "historical": ["史上", "しじょう", "historical"],
  "as a matter of fact": ["事実上", "じじつじょう", "(as a) matter of fact, actually, in reality"],
  "actually": ["事実上", "じじつじょう", "(as a) matter of fact, actually, in reality"],
  "in reality": ["事実上", "じじつじょう", "(as a) matter of fact, actually, in reality"],
  "rise in price": ["上げ", "あげ", "rise in price, making a tuck"],
  "making a tuck": ["上げ", "あげ", "rise in price, making a tuck"],
  "rising": ["上昇", "じょうしょう", "rising, ascending, climbing"],
  "ascending": ["上昇", "じょうしょう", "rising, ascending, climbing"],
  "climbing": ["上昇", "じょうしょう", "rising, ascending, climbing"],
  "elevation": ["向上", "こうじょう", "elevation, rise, improvement, advancement, progress"],
  "rise": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "improvement": ["回復", "かいふく", "recovery (from illness), improvement, rehabilitation, restoration, convalescence"],
  "advancement": ["向上", "こうじょう", "elevation, rise, improvement, advancement, progress"],
  "progress": ["向上", "こうじょう", "elevation, rise, improvement, advancement, progress"],
  "ascent": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "slope": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "freshly-drawn green tea esp. in sushi shops": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "advance income": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "crop yield": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "death": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "spinning": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "completion": ["成立", "せいりつ", "coming into existence, arrangements, establishment, conclusion, completion"],
  "stop": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "finish": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "after rain": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "ex official": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "end results e.g. of crafts like painting": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "pottery": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "how something comes out": ["上がり", "あがり", "ascent, rise, slope; freshly-drawn green tea (esp. in sushi shops); advance income, crop yield; death, spinning, completion, stop, finish; after (rain), ex (official, etc.); (end) results (e.g. of crafts like painting, pottery, etc.), how something comes out"],
  "superior rank not class": ["上位", "じょうい", "superior (rank not class); higher order (e.g. byte); host computer (of connected device)"],
  "higher order e.g. byte": ["上位", "じょうい", "superior (rank not class); higher order (e.g. byte); host computer (of connected device)"],
  "host computer of connected device": ["上位", "じょうい", "superior (rank not class); higher order (e.g. byte); host computer (of connected device)"],
  "above ground": ["地上", "ちじょう", "above ground"],
  "developing country": ["途上国", "とじょうこく", "developing country"],
  "management": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "executive staff": ["幹部", "かんぶ", "management, (executive) staff, leaders, leadership, top brass, upper echelons"],
  "leaders": ["幹部", "かんぶ", "management, (executive) staff, leaders, leadership, top brass, upper echelons"],
  "leadership": ["幹部", "かんぶ", "management, (executive) staff, leaders, leadership, top brass, upper echelons"],
  "top brass": ["幹部", "かんぶ", "management, (executive) staff, leaders, leadership, top brass, upper echelons"],
  "upper echelons": ["幹部", "かんぶ", "management, (executive) staff, leaders, leadership, top brass, upper echelons"],
  "class": ["部門", "ぶもん", "class, group, category, department, field, branch"],
  "category": ["部門", "ぶもん", "class, group, category, department, field, branch"],
  "department": ["部門", "ぶもん", "class, group, category, department, field, branch"],
  "department of a university": ["学部", "がくぶ", "department of a university; undergraduate (course, program, etc.)"],
  "undergraduate course": ["学部", "がくぶ", "department of a university; undergraduate (course, program, etc.)"],
  "interior": ["内部", "ないぶ", "interior, inside, internal"],
  "inside": ["内部", "ないぶ", "interior, inside, internal"],
  "sumo stable": ["部屋", "へや", "room; sumo stable"],
  "force": ["武力", "ぶりょく", "armed might, military power, the sword, force"],
  "unit": ["部隊", "ぶたい", "force, unit, corps, echelon, element"],
  "corps": ["部隊", "ぶたい", "force, unit, corps, echelon, element"],
  "echelon": ["部隊", "ぶたい", "force, unit, corps, echelon, element"],
  "element": ["部隊", "ぶたい", "force, unit, corps, echelon, element"],
  "east": ["東", "ひがし, ひむかし, ひんがし", "east"],
  "tokyo current capital of japan": ["東京", "とうきょう", "Tokyo (current capital of Japan)"],
  "region south of tokyo on pacific ocean side of japan": ["東海", "とうかい", "region south of Tokyo on Pacific Ocean side of Japan, eastern sea"],
  "eastern sea": ["東海", "とうかい", "region south of Tokyo on Pacific Ocean side of Japan, eastern sea"],
  "north-east": ["東北", "とうほく, ひがしきた", "north-east; Northern most six prefectures of Honshu"],
  "northern most six prefectures of honshu": ["東北", "とうほく, ひがしきた", "north-east; Northern most six prefectures of Honshu"],
  "eastern europe": ["東欧", "とうおう", "Eastern Europe"],
  "east and west": ["東西", "とうざい", "East and West; whole country; Orient and Occident, Western and Eastern; Your attention, please!"],
  "whole country": ["全国", "ぜんこく, ぜんごく", "country-wide, nation-wide, whole country, national"],
  "orient and occident": ["東西", "とうざい", "East and West; whole country; Orient and Occident, Western and Eastern; Your attention, please!"],
  "western and eastern": ["東西", "とうざい", "East and West; whole country; Orient and Occident, Western and Eastern; Your attention, please!"],
  "your attention": ["東西", "とうざい", "East and West; whole country; Orient and Occident, Western and Eastern; Your attention, please!"],
  "please!": ["東西", "とうざい", "East and West; whole country; Orient and Occident, Western and Eastern; Your attention, please!"],
  "south-east": ["東南", "とうなん, ひがしみなみ", "south-east"],
  "toshiba company": ["東芝", "とうしば", "Toshiba (company)"],
  "orient": ["東洋", "とうよう", "Orient"],
  "a patient": ["患者", "かんじゃ", "(a) patient"],
  "authorized people": ["関係者", "かんけいしゃ", "authorized people, authorised people, person(s) concerned"],
  "authorised people": ["関係者", "かんけいしゃ", "authorized people, authorised people, person(s) concerned"],
  "persons concerned": ["関係者", "かんけいしゃ", "authorized people, authorised people, person(s) concerned"],
  "reporter": ["記者", "きしゃ", "reporter"],
  "trader": ["業者", "ぎょうしゃ", "trader, merchant"],
  "merchant": ["業者", "ぎょうしゃ", "trader, merchant"],
  "suspect person": ["容疑者", "ようぎしゃ", "suspect (person)"],
  "young man": ["男子", "だんし", "youth, young man"],
  "youth": ["男子", "だんし", "youth, young man"],
  "lad": ["若者", "わかもの", "young man, youth, lad"],
  "consumer": ["消費者", "しょうひしゃ", "consumer"],
  "laborer labourer": ["労働者", "ろうどうしゃ", "laborer (labourer), blue-collar worker"],
  "blue-collar worker": ["労働者", "ろうどうしゃ", "laborer (labourer), blue-collar worker"],
  "scholar": ["学者", "がくしゃ", "scholar"],
  "proprietor": ["経営者", "けいえいしゃ", "manager, proprietor"],
  "party political": ["党", "とう", "party (political); faction, -ite"],
  "faction": ["党", "とう", "party (political); faction, -ite"],
  "-ite": ["党", "とう", "party (political); faction, -ite"],
  "communist party": ["共産党", "きょうさんとう", "Communist Party"],
  "new political party": ["新党", "しんとう", "new (political) party"],
  "opposition party": ["野党", "やとう", "opposition party, political opposition, opposition"],
  "political opposition": ["野党", "やとう", "opposition party, political opposition, opposition"],
  "government party": ["与党", "よとう", "government party, (ruling) party in power, government"],
  "ruling party in power": ["与党", "よとう", "government party, (ruling) party in power, government"],
  "party leader": ["党首", "とうしゅ", "party leader"],
  "party-internal": ["党内", "とうない", "party-internal"],
  "ground": ["地", "ち", "earth, ground, land, soil; place; territory; bottom (of a package, book, etc.)"],
  "soil": ["土地", "とち", "plot of land, lot, soil"],
  "place": ["場所", "ばしょ", "place, location"],
  "territory": ["地", "ち", "earth, ground, land, soil; place; territory; bottom (of a package, book, etc.)"],
  "bottom of a package": ["地", "ち", "earth, ground, land, soil; place; territory; bottom (of a package, book, etc.)"],
  "book": ["地", "ち", "earth, ground, land, soil; place; territory; bottom (of a package, book, etc.)"],
  "actual place": ["現地", "げんち", "actual place, local"],
  "local": ["現地", "げんち", "actual place, local"],
  "area": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "the earth": ["地球", "ちきゅう", "the earth"],
  "district": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "sector": ["地区", "ちく", "district, section, sector"],
  "home area": ["地元", "じもと", "home area, home town; local"],
  "home town": ["地元", "じもと", "home area, home town; local"],
  "locality": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "province": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "countryside": ["田舎", "いなか", "rural area, countryside, the sticks; hometown"],
  "rural area": ["田舎", "いなか", "rural area, countryside, the sticks; hometown"],
  "coast esp. as seen from the water": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "person singing ballads in noh": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "person in charge of music in a japanese dance performance": ["地方", "ちほう, じかた", "area, locality, district, region, province; countryside, rural area; coast (esp. as seen from the water); person singing ballads in Noh, person in charge of music in a Japanese dance performance"],
  "plot of land": ["土地", "とち", "plot of land, lot, soil"],
  "lot": ["土地", "とち", "plot of land, lot, soil"],
  "base": ["基地", "きち", "base"],
  "district public prosecutor's office": ["地検", "ちけん", "District Public Prosecutor's Office"],
  "0.18039 litres liters": ["合", "ごう", "0.18039 litres (liters); 0.3306 metres square (meters); one-tenth of the way from the base to the summit of a mountain; (astronomical) conjunction; counter for covered containers; counter for matches, battles, etc."],
  "0.3306 metres square meters": ["合", "ごう", "0.18039 litres (liters); 0.3306 metres square (meters); one-tenth of the way from the base to the summit of a mountain; (astronomical) conjunction; counter for covered containers; counter for matches, battles, etc."],
  "one-tenth of the way from the base to the summit of a mountain": ["合", "ごう", "0.18039 litres (liters); 0.3306 metres square (meters); one-tenth of the way from the base to the summit of a mountain; (astronomical) conjunction; counter for covered containers; counter for matches, battles, etc."],
  "astronomical conjunction": ["会合", "かいごう", "meeting, assembly; association; (astronomical) conjunction"],
  "counter for covered containers": ["合", "ごう", "0.18039 litres (liters); 0.3306 metres square (meters); one-tenth of the way from the base to the summit of a mountain; (astronomical) conjunction; counter for covered containers; counter for matches, battles, etc."],
  "counter for matches": ["合", "ごう", "0.18039 litres (liters); 0.3306 metres square (meters); one-tenth of the way from the base to the summit of a mountain; (astronomical) conjunction; counter for covered containers; counter for matches, battles, etc."],
  "battles": ["合", "ごう", "0.18039 litres (liters); 0.3306 metres square (meters); one-tenth of the way from the base to the summit of a mountain; (astronomical) conjunction; counter for covered containers; counter for matches, battles, etc."],
  "agreement": ["合意", "ごうい", "agreement, consent, mutual understanding"],
  "consent": ["合意", "ごうい", "agreement, consent, mutual understanding"],
  "mutual understanding": ["合意", "ごうい", "agreement, consent, mutual understanding"],
  "match": ["回戦", "かいせん", "match, game"],
  "contest": ["試合", "しあい", "match, game, bout, contest"],
  "synthesis": ["統合", "とうごう", "integration, unification, synthesis; integrated, built-in"],
  "putting together": ["総合", "そうごう", "synthesis, coordination, putting together, integration, composite; comprehensive"],
  "composite": ["総合", "そうごう", "synthesis, coordination, putting together, integration, composite; comprehensive"],
  "comprehensive": ["総合", "そうごう", "synthesis, coordination, putting together, integration, composite; comprehensive"],
  "enquiry": ["調査", "ちょうさ", "investigation, examination, inquiry, enquiry, survey"],
  "inquiry": ["調査", "ちょうさ", "investigation, examination, inquiry, enquiry, survey"],
  "enq": ["問い合わせ", "といあわせ", "enquiry, inquiry, ENQ, query, interrogation"],
  "query": ["問い", "とい", "question, query"],
  "interrogation": ["問い合わせ", "といあわせ", "enquiry, inquiry, ENQ, query, interrogation"],
  "integrated": ["統合", "とうごう", "integration, unification, synthesis; integrated, built-in"],
  "built-in": ["統合", "とうごう", "integration, unification, synthesis; integrated, built-in"],
  "to come together": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to merge": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to unite": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to meet": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to fit": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to match": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to suit": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to agree with": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to be correct": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to be profitable": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to be equitable": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "after the -masu stem of a verb to do ... to each other": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "to do ... together": ["合う", "あう, おう", "to come together, to merge, to unite, to meet; to fit, to match, to suit, to agree with, to be correct; to be profitable, to be equitable; (after the -masu stem of a verb) to do ... to each other, to do ... together"],
  "town market": ["市場", "いちば", "(town) market; (the) marketplace"],
  "the marketplace": ["市場", "いちば", "(town) market; (the) marketplace"],
  "within a city": ["市内", "しない", "(within a) city, local"],
  "town": ["都市", "とし", "town, city, municipal, urban"],
  "municipal": ["市立", "しりつ, いちりつ", "municipal, city"],
  "urban": ["都市", "とし", "town, city, municipal, urban"],
  "mayor": ["市長", "しちょう", "mayor"],
  "cities": ["市町村", "しちょうそん", "cities, towns and villages, municipalities"],
  "towns and villages": ["市町村", "しちょうそん", "cities, towns and villages, municipalities"],
  "municipalities": ["市町村", "しちょうそん", "cities, towns and villages, municipalities"],
  "city councillor": ["市議", "しぎ", "city councillor, city councilor, city assemblyman"],
  "city councilor": ["市議", "しぎ", "city councillor, city councilor, city assemblyman"],
  "city assemblyman": ["市議", "しぎ", "city councillor, city councilor, city assemblyman"],
  "in the city": ["市中", "しちゅう", "in the city"],
  "karma i.e. actions committed in a former life": ["業", "ごう", "karma (i.e. actions committed in a former life)"],
  "undertaking": ["企業", "きぎょう", "enterprise, undertaking, corporation, business"],
  "operation": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "manufacturing": ["作業", "さぎょう", "work, operation, manufacturing, fatigue duty"],
  "fatigue duty": ["作業", "さぎょう", "work, operation, manufacturing, fatigue duty"],
  "agriculture": ["農業", "のうぎょう", "agriculture"],
  "trade": ["営業", "えいぎょう", "business, trade, sales, operations"],
  "sales": ["営業", "えいぎょう", "business, trade, sales, operations"],
  "affairs": ["業務", "ぎょうむ", "business, affairs, duties, work, procedure, task, action, function"],
  "duties": ["業務", "ぎょうむ", "business, affairs, duties, work, procedure, task, action, function"],
  "procedure": ["手続き", "てつづき", "procedure, (legal) process, formalities"],
  "function": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "within": ["以内", "いない", "within, inside of, less than"],
  "while": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "amongst": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "between": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "we referring to one's in-group": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "i.e. company": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "my spouse": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "imperial palace grounds": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "emperor": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "i primarily used by women and children": ["内", "うち", "inside, within; while; among, amongst, between; we (referring to one's in-group, i.e. company, etc.); my spouse; imperial palace grounds; emperor; I (primarily used by women and children), me"],
  "metropolitan area": ["都内", "とない", "metropolitan area"],
  "cabinet": ["内閣", "ないかく", "cabinet, (government) ministry"],
  "government ministry": ["内閣", "ないかく", "cabinet, (government) ministry"],
  "subject": ["主題", "しゅだい", "subject, theme, motif"],
  "contents": ["内容", "ないよう", "subject, contents, matter, substance, detail, import"],
  "substance": ["実", "じつ, じち", "truth, reality; sincerity, honesty, fidelity; content, substance; (good) result"],
  "detail": ["内容", "ないよう", "subject, contents, matter, substance, detail, import"],
  "import": ["輸入", "ゆにゅう, しゅにゅう", "importation, import, introduction"],
  "inside of": ["以内", "いない", "within, inside of, less than"],
  "less than": ["以内", "いない", "within, inside of, less than"],
  "within the prefecture": ["県内", "けんない", "within the prefecture"],
  "foreign minister": ["外相", "がいしょう", "Foreign Minister"],
  "prime minister": ["首相", "しゅしょう", "Prime Minister, Chancellor (Germany, Austria, etc.), Premier"],
  "chancellor germany": ["首相", "しゅしょう", "Prime Minister, Chancellor (Germany, Austria, etc.), Premier"],
  "austria": ["首相", "しゅしょう", "Prime Minister, Chancellor (Germany, Austria, etc.), Premier"],
  "premier": ["首相", "しゅしょう", "Prime Minister, Chancellor (Germany, Austria, etc.), Premier"],
  "companion": ["相手", "あいて", "companion, partner, company; other party, addressee; opponent (sports, etc.)"],
  "other party": ["相手", "あいて", "companion, partner, company; other party, addressee; opponent (sports, etc.)"],
  "addressee": ["相手", "あいて", "companion, partner, company; other party, addressee; opponent (sports, etc.)"],
  "opponent sports": ["相手", "あいて", "companion, partner, company; other party, addressee; opponent (sports, etc.)"],
  "minister of finance": ["蔵相", "ぞうしょう", "Minister of Finance"],
  "mutual": ["双方", "そうほう", "two way, both parties, mutual, both"],
  "reciprocal": ["相互", "そうご", "mutual, reciprocal"],
  "market price": ["相場", "そうば", "market price, speculation, estimation"],
  "speculation": ["一六勝負", "いちろくしょうぶ", "gambling, speculation"],
  "estimation": ["相場", "そうば", "market price, speculation, estimation"],
  "befitting": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "becoming": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "worthy of": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "proportionate": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "in keeping with": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "suitable": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "considerable": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "substantial": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "to be worthy of": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "to be proportionate to": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "to correspond to in meaning": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "to be equivalent": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "extremely": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "considerably": ["相当", "そうとう", "befitting, becoming, worthy of, proportionate, in keeping with, suitable; considerable, substantial; to be worthy of, to be proportionate to; to correspond to (in meaning, function, etc.), to be equivalent; extremely, considerably"],
  "sumo wrestling": ["相撲", "すもう, すまい", "sumo wrestling; sumo wrestler, rikishi"],
  "sumo wrestler": ["相撲", "すもう, すまい", "sumo wrestling; sumo wrestler, rikishi"],
  "rikishi": ["相撲", "すもう, すまい", "sumo wrestling; sumo wrestler, rikishi"],
  "real situation": ["真相", "しんそう", "truth, real situation"],
  "orientation": ["方向", "ほうこう", "direction, orientation, bearing, way; course (e.g. of action)"],
  "bearing": ["方向", "ほうこう", "direction, orientation, bearing, way; course (e.g. of action)"],
  "way": ["方法", "ほうほう", "method, process, manner, way, means, technique"],
  "course e.g. of action": ["方向", "ほうこう", "direction, orientation, bearing, way; course (e.g. of action)"],
  "objective": ["目標", "もくひょう", "mark, objective, target"],
  "plan": ["方針", "ほうしん", "objective, plan, policy"],
  "method": ["方法", "ほうほう", "method, process, manner, way, means, technique"],
  "process": ["方法", "ほうほう", "method, process, manner, way, means, technique"],
  "manner": ["方法", "ほうほう", "method, process, manner, way, means, technique"],
  "means": ["方法", "ほうほう", "method, process, manner, way, means, technique"],
  "technique": ["手法", "しゅほう", "technique"],
  "way of thinking": ["考え方", "かんがえかた", "way of thinking"],
  "two way": ["双方", "そうほう", "two way, both parties, mutual, both"],
  "both parties": ["双方", "そうほう", "two way, both parties, mutual, both"],
  "both": ["双方", "そうほう", "two way, both parties, mutual, both"],
  "side": ["方", "ほう", "side, direction, way"],
  "four": ["四つ", "よっつ", "four"],
  "fourteen": ["十四", "じゅうし, じゅうよん", "14, fourteen"],
  "forty": ["四十", "よんじゅう, しじゅう, よそ", "forty"],
  "four hundred": ["四百", "よんひゃく", "four hundred"],
  "four balls": ["四球", "しきゅう", "four balls, base on balls (baseball), a walk"],
  "base on balls baseball": ["四球", "しきゅう", "four balls, base on balls (baseball), a walk"],
  "a walk": ["四球", "しきゅう", "four balls, base on balls (baseball), a walk"],
  "four thousand": ["四千", "よんせん", "four thousand"],
  "the 47 ronin": ["四十七士", "しじゅうしちし", "The 47 Ronin"],
  "quarter of a year": ["四半期", "しはんき", "quarter (of a year)"],
  "arrangement": ["約束", "やくそく", "arrangement, promise, appointment, pact, engagement; convention, rule"],
  "pact": ["約束", "やくそく", "arrangement, promise, appointment, pact, engagement; convention, rule"],
  "determination": ["決意", "けつい", "decision, determination"],
  "plans": ["予定", "よてい", "plans, arrangement, schedule, program, programme, expectation, estimate"],
  "estimate": ["予定", "よてい", "plans, arrangement, schedule, program, programme, expectation, estimate"],
  "stability": ["安定", "あんてい", "stability, equilibrium"],
  "equilibrium": ["安定", "あんてい", "stability, equilibrium"],
  "tentative": ["暫定", "ざんてい", "tentative, temporary"],
  "constant": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "literal": ["定数", "ていすう", "constant; literal"],
  "fixed": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "settled": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "definite": ["具体的", "ぐたいてき", "concrete, tangible, definite, specific"],
  "uniform": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "regularized": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "regularised": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "defined": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "standardized": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "standardised": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "certain": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "prescribed": ["一定", "いってい, いちじょう", "fixed, settled, constant, definite, uniform, regularized, regularised, defined, standardized, standardised, certain, prescribed"],
  "regulation": ["調整", "ちょうせい", "regulation, adjustment, tuning, modification, alteration"],
  "provisions": ["規定", "きてい", "regulation, provisions"],
  "designation": ["指定", "してい", "designation, specification, assignment, appointment, pointing at"],
  "specification": ["指定", "してい", "designation, specification, assignment, appointment, pointing at"],
  "assignment": ["指定", "してい", "designation, specification, assignment, appointment, pointing at"],
  "appointment": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "pointing at": ["指定", "してい", "designation, specification, assignment, appointment, pointing at"],
  "fixed term": ["定期", "ていき", "fixed term; fixed-term commutation pass; fixed-term deposit"],
  "fixed-term commutation pass": ["定期", "ていき", "fixed term; fixed-term commutation pass; fixed-term deposit"],
  "fixed-term deposit": ["定期", "ていき", "fixed term; fixed-term commutation pass; fixed-term deposit"],
  "now": ["現在", "げんざい", "now, current, present, present time, as of"],
  "the present time": ["今", "いま", "now, the present time, just now, soon, immediately, (one) more"],
  "just now": ["今", "いま", "now, the present time, just now, soon, immediately, (one) more"],
  "immediately": ["今", "いま", "now, the present time, just now, soon, immediately, (one) more"],
  "one more": ["今", "いま", "now, the present time, just now, soon, immediately, (one) more"],
  "this time": ["今回", "こんかい", "now, this time, lately"],
  "lately": ["今回", "こんかい", "now, this time, lately"],
  "next time": ["今度", "こんど", "now, this time, next time, another time"],
  "another time": ["今度", "こんど", "now, this time, next time, another time"],
  "this season": ["今季", "こんき", "this season"],
  "this spring": ["今春", "こんしゅん", "this spring, spring this year"],
  "spring this year": ["今春", "こんしゅん", "this spring, spring this year"],
  "counter for occurrences": ["回", "かい", "counter for occurrences; counter for innings (baseball)"],
  "counter for innings baseball": ["回", "かい", "counter for occurrences; counter for innings (baseball)"],
  "recovery from illness": ["回復", "かいふく", "recovery (from illness), improvement, rehabilitation, restoration, convalescence"],
  "rehabilitation": ["回復", "かいふく", "recovery (from illness), improvement, rehabilitation, restoration, convalescence"],
  "restoration": ["回復", "かいふく", "recovery (from illness), improvement, rehabilitation, restoration, convalescence"],
  "convalescence": ["回復", "かいふく", "recovery (from illness), improvement, rehabilitation, restoration, convalescence"],
  "reply": ["回答", "かいとう", "reply, answer"],
  "answer": ["回答", "かいとう", "reply, answer"],
  "one time": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "one round": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "one game": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "one bout": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "one heat": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "one inning": ["一回", "いっかい", "once, one time, one round, one game, one bout, one heat, one inning"],
  "collection": ["回収", "かいしゅう", "collection, recovery"],
  "recovery": ["回収", "かいしゅう", "collection, recovery"],
  "number of times": ["回数", "かいすう", "number of times, frequency, count"],
  "frequency": ["回数", "かいすう", "number of times, frequency, count"],
  "count": ["回数", "かいすう", "number of times, frequency, count"],
  "next time occasion": ["次回", "じかい", "next time (occasion)"],
  "new": ["新規", "しんき", "new, fresh; new customer; new rules or regulations"],
  "fresh": ["新規", "しんき", "new, fresh; new customer; new rules or regulations"],
  "novel": ["新た", "あらた", "new, fresh, novel; newly, freshly, re-"],
  "newly": ["新た", "あらた", "new, fresh, novel; newly, freshly, re-"],
  "freshly": ["新た", "あらた", "new, fresh, novel; newly, freshly, re-"],
  "re-": ["新た", "あらた", "new, fresh, novel; newly, freshly, re-"],
  "newspaper": ["新聞", "しんぶん", "newspaper"],
  "new face": ["新人", "しんじん", "new face, newcomer; modern humans (from Cro-Magnon man onwards)"],
  "newcomer": ["新人", "しんじん", "new face, newcomer; modern humans (from Cro-Magnon man onwards)"],
  "modern humans from cro-magnon man onwards": ["新人", "しんじん", "new face, newcomer; modern humans (from Cro-Magnon man onwards)"],
  "bullet train very high speed": ["新幹線", "しんかんせん", "bullet train (very high speed), Shinkansen"],
  "shinkansen": ["新幹線", "しんかんせん", "bullet train (very high speed), Shinkansen"],
  "reform": ["革新", "かくしん", "reform, innovation"],
  "innovation": ["革新", "かくしん", "reform, innovation"],
  "latest": ["最近", "さいきん", "latest, most recent, nowadays"],
  "newest": ["最新", "さいしん", "latest, newest, late-breaking (news)"],
  "late-breaking news": ["最新", "さいしん", "latest, newest, late-breaking (news)"],
  "new customer": ["新規", "しんき", "new, fresh; new customer; new rules or regulations"],
  "new rules or regulations": ["新規", "しんき", "new, fresh; new customer; new rules or regulations"],
  "actual spot": ["現場", "げんば, げんじょう", "actual spot, scene, scene of the crime"],
  "scene": ["現場", "げんば, げんじょう", "actual spot, scene, scene of the crime"],
  "scene of the crime": ["現場", "げんば, げんじょう", "actual spot, scene, scene of the crime"],
  "location": ["場所", "ばしょ", "place, location"],
  "standpoint": ["立場", "たちば", "standpoint, position, situation"],
  "position": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "factory": ["工場", "こうじょう, こうば", "factory, plant, mill, workshop"],
  "plant": ["工場", "こうじょう, こうば", "factory, plant, mill, workshop"],
  "mill": ["工場", "こうじょう, こうば", "factory, plant, mill, workshop"],
  "workshop": ["工場", "こうじょう, こうば", "factory, plant, mill, workshop"],
  "assembly hall": ["会場", "かいじょう", "assembly hall, meeting place, the grounds"],
  "meeting place": ["会場", "かいじょう", "assembly hall, meeting place, the grounds"],
  "the grounds": ["会場", "かいじょう", "assembly hall, meeting place, the grounds"],
  "theatre": ["劇場", "げきじょう", "theatre, theater, playhouse"],
  "theater": ["劇場", "げきじょう", "theatre, theater, playhouse"],
  "playhouse": ["劇場", "げきじょう", "theatre, theater, playhouse"],
  "setting e.g. of novel": ["場面", "ばめん", "scene, setting (e.g. of novel)"],
  "one's post": ["職場", "しょくば", "one's post, place of work, workplace"],
  "place of work": ["職場", "しょくば", "one's post, place of work, workplace"],
  "money": ["金子", "きんす", "money, funds"],
  "financing": ["金融", "きんゆう", "financing, credit transacting, loaning of money, circulation of money"],
  "credit transacting": ["金融", "きんゆう", "financing, credit transacting, loaning of money, circulation of money"],
  "loaning of money": ["金融", "きんゆう", "financing, credit transacting, loaning of money, circulation of money"],
  "circulation of money": ["金融", "きんゆう", "financing, credit transacting, loaning of money, circulation of money"],
  "interest rates": ["金利", "きんり", "interest rates"],
  "donation": ["献金", "けんきん", "donation, contribution, offering"],
  "contribution": ["献金", "けんきん", "donation, contribution, offering"],
  "offering": ["献金", "けんきん", "donation, contribution, offering"],
  "funds": ["金子", "きんす", "money, funds"],
  "capital": ["資金", "しきん", "funds, capital"],
  "fund": ["基金", "ききん", "fund, foundation"],
  "fee": ["料金", "りょうきん", "fee, charge, fare"],
  "charge": ["料金", "りょうきん", "fee, charge, fare"],
  "fare": ["料金", "りょうきん", "fee, charge, fare"],
  "amount of money": ["高", "たか, だか", "quantity, amount, volume, number, amount of money"],
  "financial institutions": ["金融機関", "きんゆうきかん", "financial institutions, banking facilities"],
  "banking facilities": ["金融機関", "きんゆうきかん", "financial institutions, banking facilities"],
  "committee member": ["委員", "いいん", "committee member"],
  "staff member": ["職員", "しょくいん", "staff member, personnel"],
  "personnel": ["職員", "しょくいん", "staff member, personnel"],
  "member of national diet": ["国会議員", "こっかいぎいん", "member of National Diet, Diet member"],
  "diet member": ["国会議員", "こっかいぎいん", "member of National Diet, Diet member"],
  "all members unanimity": ["全員", "ぜんいん", "all members (unanimity), all hands, the whole crew, everyone, everybody"],
  "all hands": ["全員", "ぜんいん", "all members (unanimity), all hands, the whole crew, everyone, everybody"],
  "the whole crew": ["全員", "ぜんいん", "all members (unanimity), all hands, the whole crew, everyone, everybody"],
  "everyone": ["全員", "ぜんいん", "all members (unanimity), all hands, the whole crew, everyone, everybody"],
  "officer": ["役員", "やくいん", "officer, official, executive, staff"],
  "official": ["役員", "やくいん", "officer, official, executive, staff"],
  "executive": ["役員", "やくいん", "officer, official, executive, staff"],
  "staff": ["役員", "やくいん", "officer, official, executive, staff"],
  "nine": ["九つ", "ここのつ", "nine"],
  "kyushu southernmost of the four main islands of japan": ["九州", "きゅうしゅう", "Kyushu (southernmost of the four main islands of Japan)"],
  "ninety": ["九十", "きゅうじゅう, くじゅう", "ninety"],
  "multiplication table": ["九九", "くく", "multiplication table, times table"],
  "times table": ["九九", "くく", "multiplication table, times table"],
  "ambulance and fire brigade emergency tel. no. in japan": ["一一九番", "ひゃくじゅうきゅうばん", "ambulance and fire brigade emergency tel. no. (in Japan)"],
  "the 1900s": ["千九百年代", "せんきゅうひゃくねんだい", "the 1900s"],
  "ninefold": ["九重", "ここのえ", "ninefold, imperial palace, the Court"],
  "imperial palace": ["九重", "ここのえ", "ninefold, imperial palace, the Court"],
  "the court": ["九重", "ここのえ", "ninefold, imperial palace, the Court"],
  "entering": ["入り", "いり", "entering; setting (of the sun); containing, content, audience; income; beginning"],
  "setting of the sun": ["入り", "いり", "entering; setting (of the sun); containing, content, audience; income; beginning"],
  "containing": ["入り", "いり", "entering; setting (of the sun); containing, content, audience; income; beginning"],
  "content": ["実", "じつ, じち", "truth, reality; sincerity, honesty, fidelity; content, substance; (good) result"],
  "income": ["収入", "しゅうにゅう", "income, receipts, revenue"],
  "importation": ["輸入", "ゆにゅう, しゅにゅう", "importation, import, introduction"],
  "introduction": ["導入", "どうにゅう", "introduction, bringing in, leading in, installation"],
  "purchase": ["購入", "こうにゅう", "purchase, buy"],
  "buy": ["購入", "こうにゅう", "purchase, buy"],
  "receipts": ["収入", "しゅうにゅう", "income, receipts, revenue"],
  "revenue": ["収入", "しゅうにゅう", "income, receipts, revenue"],
  "bringing in": ["導入", "どうにゅう", "introduction, bringing in, leading in, installation"],
  "leading in": ["導入", "どうにゅう", "introduction, bringing in, leading in, installation"],
  "installation": ["導入", "どうにゅう", "introduction, bringing in, leading in, installation"],
  "intervention": ["介入", "かいにゅう", "intervention"],
  "receiving": ["受け入れ", "うけいれ", "receiving, acceptance"],
  "acceptance": ["受け入れ", "うけいれ", "receiving, acceptance"],
  "bid": ["入札", "にゅうさつ", "bid, bidding"],
  "bidding": ["入札", "にゅうさつ", "bid, bidding"],
  "becoming a member": ["加入", "かにゅう", "becoming a member, joining, entry, admission, subscription, affiliation, adherence, signing"],
  "joining": ["加入", "かにゅう", "becoming a member, joining, entry, admission, subscription, affiliation, adherence, signing"],
  "entry": ["項目", "こうもく", "(data) item, entry"],
  "admission": ["加入", "かにゅう", "becoming a member, joining, entry, admission, subscription, affiliation, adherence, signing"],
  "subscription": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "affiliation": ["加入", "かにゅう", "becoming a member, joining, entry, admission, subscription, affiliation, adherence, signing"],
  "adherence": ["加入", "かにゅう", "becoming a member, joining, entry, admission, subscription, affiliation, adherence, signing"],
  "signing": ["調印", "ちょういん", "signature, signing, sealing"],
  "coming": ["参入", "さんにゅう", "coming, visiting, going"],
  "visiting": ["参入", "さんにゅう", "coming, visiting, going"],
  "going": ["参入", "さんにゅう", "coming, visiting, going"],
  "selection": ["選考", "せんこう", "selection, screening"],
  "choice": ["選", "せん", "selection, choice, election; compilation, editing"],
  "election": ["選挙", "せんきょ", "election"],
  "compilation": ["選", "せん", "selection, choice, election; compilation, editing"],
  "editing": ["選", "せん", "selection, choice, election; compilation, editing"],
  "to choose": ["選ぶ", "えらぶ", "to choose, to select"],
  "to select": ["選ぶ", "えらぶ", "to choose, to select"],
  "player in game": ["選手", "せんしゅ", "player (in game), team member"],
  "team member": ["選手", "せんしゅ", "player (in game), team member"],
  "championship": ["選手権", "せんしゅけん", "championship, title (of champion)"],
  "title of champion": ["選手権", "せんしゅけん", "championship, title (of champion)"],
  "general election of the lower house": ["総選挙", "そうせんきょ", "general election (of the lower house)"],
  "being elected": ["当選", "とうせん", "being elected; being selected (to win a prize, etc.); winning (in a lottery, raffle, etc.)"],
  "being selected to win a prize": ["当選", "とうせん", "being elected; being selected (to win a prize, etc.); winning (in a lottery, raffle, etc.)"],
  "winning in a lottery": ["当選", "とうせん", "being elected; being selected (to win a prize, etc.); winning (in a lottery, raffle, etc.)"],
  "raffle": ["当選", "とうせん", "being elected; being selected (to win a prize, etc.); winning (in a lottery, raffle, etc.)"],
  "nomination": ["予選", "よせん", "nomination, primary, preliminary contest"],
  "primary": ["予選", "よせん", "nomination, primary, preliminary contest"],
  "preliminary contest": ["予選", "よせん", "nomination, primary, preliminary contest"],
  "small electoral district": ["小選挙区", "しょうせんきょく", "small electoral district, single-member constituency"],
  "single-member constituency": ["小選挙区", "しょうせんきょく", "small electoral district, single-member constituency"],
  "screening": ["選考", "せんこう", "selection, screening"],
  "national": ["全国", "ぜんこく, ぜんごく", "country-wide, nation-wide, whole country, national"],
  "coming into existence": ["成立", "せいりつ", "coming into existence, arrangements, establishment, conclusion, completion"],
  "arrangements": ["成立", "せいりつ", "coming into existence, arrangements, establishment, conclusion, completion"],
  "establishment": ["確立", "かくりつ", "establishment"],
  "independence e.g. independence day": ["独立", "どくりつ", "independence (e.g. Independence Day), self-support"],
  "self-support": ["独立", "どくりつ", "independence (e.g. Independence Day), self-support"],
  "private establishment": ["私立", "しりつ, わたくしりつ", "private (establishment)"],
  "incorporation of a business": ["設立", "せつりつ", "establishment, foundation, incorporation (of a business)"],
  "standing abreast": ["並立", "へいりつ", "standing abreast"],
  "holding a meeting": ["開催", "かいさい", "holding a meeting, open an exhibition"],
  "open an exhibition": ["開催", "かいさい", "holding a meeting, open an exhibition"],
  "commencement": ["開始", "かいし", "start, commencement, beginning, initiation"],
  "initiation": ["開始", "かいし", "start, commencement, beginning, initiation"],
  "open": ["開放", "かいほう", "open, throw open, liberalization, liberalisation"],
  "throw open": ["開放", "かいほう", "open, throw open, liberalization, liberalisation"],
  "liberalization": ["開放", "かいほう", "open, throw open, liberalization, liberalisation"],
  "liberalisation": ["開放", "かいほう", "open, throw open, liberalization, liberalisation"],
  "open to the public": ["公開", "こうかい", "open to the public"],
  "expansion opposite of compression": ["展開", "てんかい", "development; expansion (opposite of compression)"],
  "raising the curtain": ["開幕", "かいまく", "raising the curtain"],
  "reopening": ["再開", "さいかい", "reopening, resumption, restarting"],
  "resumption": ["再開", "さいかい", "reopening, resumption, restarting"],
  "restarting": ["再開", "さいかい", "reopening, resumption, restarting"],
  "opening": ["開き", "ひらき", "opening, gap; dried and opened fish"],
  "dried and opened fish": ["開き", "ひらき", "opening, gap; dried and opened fish"],
  "opening of a meeting": ["開会", "かいかい", "opening of a meeting"],
  "hand": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "arm": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "forepaw": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "foreleg": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "handle": ["取っ手", "とって, はしゅ", "handle, grip, knob"],
  "worker": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "help": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "care": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "effort": ["努力", "どりょく", "great effort, exertion, endeavour, endeavor, effort"],
  "trick": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "move": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "workmanship": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "handwriting": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "kind": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "type": ["代表", "だいひょう", "representative, representation, delegation, type, example, model"],
  "sort": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "one's hands": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "one's possession": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "ability to cope": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "hand of cards": ["手", "て", "hand, arm; forepaw, foreleg; handle; hand, worker, help; trouble, care, effort; means, way, trick, move, technique, workmanship; hand, handwriting; kind, type, sort; one's hands, one's possession; ability to cope; hand (of cards)"],
  "baseball pitcher": ["投手", "とうしゅ", "(baseball) pitcher"],
  "young person": ["若手", "わかて", "young person"],
  "legal process": ["手続き", "てつづき", "procedure, (legal) process, formalities"],
  "formalities": ["手続き", "てつづき", "procedure, (legal) process, formalities"],
  "grip": ["取っ手", "とって, はしゅ", "handle, grip, knob"],
  "knob": ["取っ手", "とって, はしゅ", "handle, grip, knob"],
  "singer": ["歌手", "かしゅ", "singer"],
  "america": ["米国", "べいこく", "America, USA"],
  "usa": ["米国", "べいこく", "America, USA"],
  "all-america": ["全米", "ぜんべい", "all-America, pan-American"],
  "pan-american": ["全米", "ぜんべい", "all-America, pan-American"],
  "relating to the usa": ["対米", "たいべい", "relating to the USA, toward America, with America"],
  "toward america": ["対米", "たいべい", "relating to the USA, toward America, with America"],
  "with america": ["対米", "たいべい", "relating to the USA, toward America, with America"],
  "visit to america": ["訪米", "ほうべい", "visit to America"],
  "central and south america": ["中南米", "ちゅうなんべい", "Central and South America"],
  "south america": ["南米", "なんべい", "South America"],
  "rice price": ["米価", "べいか", "rice price"],
  "anti-american": ["反米", "はんべい", "anti-American"],
  "rice": ["米穀", "べいこく", "rice"],
  "influence": ["権力", "けんりょく", "(political) power, authority, influence"],
  "power": ["勢力", "せいりょく", "influence, power, might, strength, potency, force, energy"],
  "might": ["勢力", "せいりょく", "influence, power, might, strength, potency, force, energy"],
  "strength": ["勢力", "せいりょく", "influence, power, might, strength, potency, force, energy"],
  "potency": ["勢力", "せいりょく", "influence, power, might, strength, potency, force, energy"],
  "energy": ["勢力", "せいりょく", "influence, power, might, strength, potency, force, energy"],
  "great effort": ["努力", "どりょく", "great effort, exertion, endeavour, endeavor, effort"],
  "exertion": ["努力", "どりょく", "great effort, exertion, endeavour, endeavor, effort"],
  "endeavour": ["努力", "どりょく", "great effort, exertion, endeavour, endeavor, effort"],
  "endeavor": ["努力", "どりょく", "great effort, exertion, endeavour, endeavor, effort"],
  "authority": ["権力", "けんりょく", "(political) power, authority, influence"],
  "atomic energy": ["原子力", "げんしりょく", "atomic energy"],
  "real ability": ["実力", "じつりょく", "(real) ability, true strength, merit, efficiency, competency; arms, force"],
  "true strength": ["実力", "じつりょく", "(real) ability, true strength, merit, efficiency, competency; arms, force"],
  "merit": ["実力", "じつりょく", "(real) ability, true strength, merit, efficiency, competency; arms, force"],
  "efficiency": ["実力", "じつりょく", "(real) ability, true strength, merit, efficiency, competency; arms, force"],
  "competency": ["実力", "じつりょく", "(real) ability, true strength, merit, efficiency, competency; arms, force"],
  "arms": ["実力", "じつりょく", "(real) ability, true strength, merit, efficiency, competency; arms, force"],
  "ability": ["能力", "のうりょく", "ability, faculty"],
  "faculty": ["能力", "のうりょく", "ability, faculty"],
  "armed might": ["武力", "ぶりょく", "armed might, military power, the sword, force"],
  "military power": ["武力", "ぶりょく", "armed might, military power, the sword, force"],
  "the sword": ["武力", "ぶりょく", "armed might, military power, the sword, force"],
  "gangster organization organisation": ["暴力団", "ぼうりょくだん", "gangster organization (organisation), crime syndicate, yakuza (Japanese mafia), band of thugs, group of hoodlums"],
  "crime syndicate": ["暴力団", "ぼうりょくだん", "gangster organization (organisation), crime syndicate, yakuza (Japanese mafia), band of thugs, group of hoodlums"],
  "yakuza japanese mafia": ["暴力団", "ぼうりょくだん", "gangster organization (organisation), crime syndicate, yakuza (Japanese mafia), band of thugs, group of hoodlums"],
  "band of thugs": ["暴力団", "ぼうりょくだん", "gangster organization (organisation), crime syndicate, yakuza (Japanese mafia), band of thugs, group of hoodlums"],
  "group of hoodlums": ["暴力団", "ぼうりょくだん", "gangster organization (organisation), crime syndicate, yakuza (Japanese mafia), band of thugs, group of hoodlums"],
  "influential": ["有力", "ゆうりょく", "influential, prominent; strong, likely, plausible, potent"],
  "prominent": ["有力", "ゆうりょく", "influential, prominent; strong, likely, plausible, potent"],
  "strong": ["有力", "ゆうりょく", "influential, prominent; strong, likely, plausible, potent"],
  "likely": ["有力", "ゆうりょく", "influential, prominent; strong, likely, plausible, potent"],
  "plausible": ["有力", "ゆうりょく", "influential, prominent; strong, likely, plausible, potent"],
  "potent": ["有力", "ゆうりょく", "influential, prominent; strong, likely, plausible, potent"],
  "school": ["学校", "がっこう", "school"],
  "medical science": ["医学", "いがく", "medical science, medicine"],
  "medicine": ["医学", "いがく", "medical science, medicine"],
  "science": ["科学", "かがく", "science"],
  "literature": ["文学", "ぶんがく", "literature"],
  "learning": ["学", "がく", "learning, scholarship, erudition, knowledge"],
  "scholarship": ["学", "がく", "learning, scholarship, erudition, knowledge"],
  "erudition": ["学", "がく", "learning, scholarship, erudition, knowledge"],
  "knowledge": ["学", "がく", "learning, scholarship, erudition, knowledge"],
  "academy": ["学園", "がくえん", "academy, campus"],
  "campus": ["学園", "がくえん", "academy, campus"],
  "to ask": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "to question": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "to inquire": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "to charge i.e. with a crime": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "to accuse": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "to care about": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "without regard to with negative verb": ["問う", "とう", "to ask, to question, to inquire; to charge (i.e. with a crime), to accuse; to care (about); without regard to (with negative verb)"],
  "counter for questions": ["問", "もん", "counter for questions"],
  "question": ["題", "だい", "title, subject, theme, topic; problem (on a test), question; counter for questions (on a test)"],
  "visit": ["訪問", "ほうもん", "call, visit"],
  "problem": ["問題", "もんだい", "problem, question"],
  "summons": ["喚問", "かんもん", "summons"],
  "doubt": ["疑問", "ぎもん", "question, problem, doubt, guess"],
  "guess": ["疑問", "ぎもん", "question, problem, doubt, guess"],
  "adviser": ["顧問", "こもん", "adviser, advisor, consultant"],
  "advisor": ["顧問", "こもん", "adviser, advisor, consultant"],
  "consultant": ["顧問", "こもん", "adviser, advisor, consultant"],
  "height": ["高さ", "たかさ", "height"],
  "senior high school": ["高校", "こうこう", "senior high school"],
  "highest": ["最高", "さいこう", "highest, supreme, the most"],
  "supreme": ["最高", "さいこう", "highest, supreme, the most"],
  "the most": ["最高", "さいこう", "highest, supreme, the most"],
  "high-valued yen": ["円高", "えんだか", "high-valued yen, exchange in favor (favour) of the yen"],
  "exchange in favor favour of the yen": ["円高", "えんだか", "high-valued yen, exchange in favor (favour) of the yen"],
  "quantity": ["高", "たか, だか", "quantity, amount, volume, number, amount of money"],
  "amount": ["高", "たか, だか", "quantity, amount, volume, number, amount of money"],
  "volume": ["高", "たか, だか", "quantity, amount, volume, number, amount of money"],
  "number": ["高", "たか, だか", "quantity, amount, volume, number, amount of money"],
  "high": ["高い", "たかい", "high, tall; expensive"],
  "tall": ["高い", "たかい", "high, tall; expensive"],
  "expensive": ["高い", "たかい", "high, tall; expensive"],
  "to rise": ["高まる", "たかまる", "to rise, to swell, to be promoted"],
  "to swell": ["高まる", "たかまる", "to rise, to swell, to be promoted"],
  "to be promoted": ["高まる", "たかまる", "to rise, to swell, to be promoted"],
  "high official": ["高官", "こうかん", "high official"],
  "senior high school student": ["高校生", "こうこうせい", "senior high school student"],
  "advanced old age": ["高齢", "こうれい", "advanced (old) age"],
  "substitute": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "deputy": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "proxy": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "alternate": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "relief": ["交代", "こうたい", "alternation, change, relief, relay, shift, substitution (sports, etc.)"],
  "compensation": ["代わり", "かわり, がわり", "substitute, deputy, proxy, alternate, relief, compensation, second helping; in place of, as a substitute for"],
  "second helping": ["代わり", "かわり, がわり", "substitute, deputy, proxy, alternate, relief, compensation, second helping; in place of, as a substitute for"],
  "in place of": ["代わり", "かわり, がわり", "substitute, deputy, proxy, alternate, relief, compensation, second helping; in place of, as a substitute for"],
  "as a substitute for": ["代わり", "かわり, がわり", "substitute, deputy, proxy, alternate, relief, compensation, second helping; in place of, as a substitute for"],
  "representative": ["代表", "だいひょう", "representative, representation, delegation, type, example, model"],
  "representation": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "delegation": ["代表", "だいひょう", "representative, representation, delegation, type, example, model"],
  "example": ["代表", "だいひょう", "representative, representation, delegation, type, example, model"],
  "model": ["代表", "だいひょう", "representative, representation, delegation, type, example, model"],
  "nowadays": ["現代", "げんだい", "nowadays, modern era, modern times, present-day"],
  "modern era": ["現代", "げんだい", "nowadays, modern era, modern times, present-day"],
  "modern times": ["現代", "げんだい", "nowadays, modern era, modern times, present-day"],
  "present-day": ["現代", "げんだい", "nowadays, modern era, modern times, present-day"],
  "generation": ["世代", "せだい", "generation, the world, the age"],
  "the world": ["世代", "せだい", "generation, the world, the age"],
  "the age": ["世代", "せだい", "generation, the world, the age"],
  "present day": ["近代", "きんだい", "present day, modern times"],
  "agency": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "agent": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "attorney": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "acting principal": ["代理", "だいり", "representation, agency, proxy, deputy, agent, attorney, substitute, alternate, acting (principal, etc.)"],
  "alternation": ["交代", "こうたい", "alternation, change, relief, relay, shift, substitution (sports, etc.)"],
  "change": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "relay": ["交代", "こうたい", "alternation, change, relief, relay, shift, substitution (sports, etc.)"],
  "shift": ["交代", "こうたい", "alternation, change, relief, relay, shift, substitution (sports, etc.)"],
  "substitution sports": ["交代", "こうたい", "alternation, change, relief, relay, shift, substitution (sports, etc.)"],
  "representing others in a conference": ["代議", "だいぎ", "representing others in a conference"],
  "acting as agent": ["代行", "だいこう", "acting as agent"],
  "obvious": ["明らか", "あきらか", "obvious, evident, clear, plain"],
  "evident": ["明らか", "あきらか", "obvious, evident, clear, plain"],
  "clear": ["明らか", "あきらか", "obvious, evident, clear, plain"],
  "plain": ["明らか", "あきらか", "obvious, evident, clear, plain"],
  "declaration": ["宣言", "せんげん", "declaration, proclamation, announcement"],
  "statement": ["言", "げん, こと", "word, remark, statement"],
  "proclamation": ["宣言", "せんげん", "declaration, proclamation, announcement"],
  "explanation": ["説明", "せつめい", "explanation, exposition"],
  "exposition": ["説明", "せつめい", "explanation, exposition"],
  "unknown": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "obscure": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "indistinct": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "uncertain": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "ambiguous": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "ignorant": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "lack of wisdom": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "anonymous": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "unidentified": ["不明", "ふめい", "unknown, obscure, indistinct, uncertain, ambiguous, ignorant, lack of wisdom, anonymous, unidentified"],
  "clear up": ["明確", "めいかく", "clear up, clarify, define"],
  "clarify": ["明確", "めいかく", "clear up, clarify, define"],
  "define": ["明確", "めいかく", "clear up, clarify, define"],
  "new komeito japanese political party": ["公明党", "こうめいとう", "New Komeito (Japanese political party), New Clean Government Party, Justice Party"],
  "new clean government party": ["公明党", "こうめいとう", "New Komeito (Japanese political party), New Clean Government Party, Justice Party"],
  "justice party": ["公明党", "こうめいとう", "New Komeito (Japanese political party), New Clean Government Party, Justice Party"],
  "clarification": ["解明", "かいめい", "clarification, elucidation, explication"],
  "elucidation": ["解明", "かいめい", "clarification, elucidation, explication"],
  "explication": ["解明", "かいめい", "clarification, elucidation, explication"],
  "fairness": ["公明", "こうめい", "fairness, justice"],
  "justice": ["公明", "こうめい", "fairness, justice"],
  "indication": ["表示", "ひょうじ", "indication, expression, display, presentation"],
  "manifestation": ["表れ", "あらわれ", "embodiment, manifestation, materialization, materialisation, expression, indication"],
  "demonstration": ["表明", "ひょうめい", "declaration, indication, representation, manifestation, demonstration, expression, announcement, assertion"],
  "expression": ["表現", "ひょうげん", "expression, presentation; representation, notation"],
  "assertion": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "early dawn": ["未明", "みめい", "early dawn, grey of morning, gray of morning"],
  "grey of morning": ["未明", "みめい", "early dawn, grey of morning, gray of morning"],
  "gray of morning": ["未明", "みめい", "early dawn, grey of morning, gray of morning"],
  "sincerity": ["実", "じつ, じち", "truth, reality; sincerity, honesty, fidelity; content, substance; (good) result"],
  "honesty": ["実", "じつ, じち", "truth, reality; sincerity, honesty, fidelity; content, substance; (good) result"],
  "fidelity": ["実", "じつ, じち", "truth, reality; sincerity, honesty, fidelity; content, substance; (good) result"],
  "good result": ["実", "じつ, じち", "truth, reality; sincerity, honesty, fidelity; content, substance; (good) result"],
  "by the way": ["実は", "じつは", "as a matter of fact, by the way, to tell you the truth, to be honest, frankly"],
  "to tell you the truth": ["実は", "じつは", "as a matter of fact, by the way, to tell you the truth, to be honest, frankly"],
  "to be honest": ["実は", "じつは", "as a matter of fact, by the way, to tell you the truth, to be honest, frankly"],
  "frankly": ["実は", "じつは", "as a matter of fact, by the way, to tell you the truth, to be honest, frankly"],
  "indeed": ["実に", "じつに, まことに, げに, しんに", "indeed, really, absolutely, truly, actually, very, quite"],
  "really": ["実に", "じつに, まことに, げに, しんに", "indeed, really, absolutely, truly, actually, very, quite"],
  "truly": ["実に", "じつに, まことに, げに, しんに", "indeed, really, absolutely, truly, actually, very, quite"],
  "quite": ["実に", "じつに, まことに, げに, しんに", "indeed, really, absolutely, truly, actually, very, quite"],
  "enforcement": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "implementation": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "putting into practice practise": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "carrying out": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "working e.g. working parameters": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "enactment": ["実施", "じっし", "enforcement, implementation, putting into practice (practise), carrying out, operation, working (e.g. working parameters), enactment"],
  "certainty": ["確実", "かくじつ", "certainty, reliability, soundness"],
  "reliability": ["確実", "かくじつ", "certainty, reliability, soundness"],
  "soundness": ["確実", "かくじつ", "certainty, reliability, soundness"],
  "experiment": ["実験", "じっけん", "experiment"],
  "implementation e.g. of a system": ["実現", "じつげん", "implementation (e.g. of a system), materialization, materialisation, realization, realisation"],
  "materialization": ["実現", "じつげん", "implementation (e.g. of a system), materialization, materialisation, realization, realisation"],
  "materialisation": ["実現", "じつげん", "implementation (e.g. of a system), materialization, materialisation, realization, realisation"],
  "realization": ["実現", "じつげん", "implementation (e.g. of a system), materialization, materialisation, realization, realisation"],
  "realisation": ["実現", "じつげん", "implementation (e.g. of a system), materialization, materialisation, realization, realisation"],
  "yen": ["円", "えん, まる", "Yen, money; circle"],
  "circle": ["円形", "えんけい, まるがた", "round shape, circle; circular form"],
  "cheap yen": ["円安", "えんやす", "cheap yen"],
  "yen exchange rate": ["円相場", "えんそうば", "yen exchange rate"],
  "whole district": ["一円", "いちえん", "whole district, one yen, throughout"],
  "one yen": ["一円", "いちえん", "whole district, one yen, throughout"],
  "throughout": ["一円", "いちえん", "whole district, one yen, throughout"],
  "smooth": ["円滑", "えんかつ, えんこつ", "smooth, undisturbed, uninterrupted, harmonious"],
  "undisturbed": ["円滑", "えんかつ, えんこつ", "smooth, undisturbed, uninterrupted, harmonious"],
  "uninterrupted": ["円滑", "えんかつ, えんこつ", "smooth, undisturbed, uninterrupted, harmonious"],
  "harmonious": ["円滑", "えんかつ, えんこつ", "smooth, undisturbed, uninterrupted, harmonious"],
  "round shape": ["円形", "えんけい, まるがた", "round shape, circle; circular form"],
  "circular form": ["円形", "えんけい, まるがた", "round shape, circle; circular form"],
  "round table": ["円卓", "えんたく", "round table"],
  "perfection": ["円満", "えんまん", "perfection, harmony, peace, smoothness, completeness, satisfaction, integrity"],
  "harmony": ["協調", "きょうちょう", "cooperation, conciliation, harmony; firm (market) tone"],
  "peace": ["円満", "えんまん", "perfection, harmony, peace, smoothness, completeness, satisfaction, integrity"],
  "smoothness": ["円満", "えんまん", "perfection, harmony, peace, smoothness, completeness, satisfaction, integrity"],
  "completeness": ["円満", "えんまん", "perfection, harmony, peace, smoothness, completeness, satisfaction, integrity"],
  "satisfaction": ["円満", "えんまん", "perfection, harmony, peace, smoothness, completeness, satisfaction, integrity"],
  "integrity": ["円満", "えんまん", "perfection, harmony, peace, smoothness, completeness, satisfaction, integrity"],
  "cylinder": ["円筒", "えんとう", "cylinder"],
  "barrier": ["関", "せき", "barrier, gate"],
  "gate": ["関", "せき", "barrier, gate"],
  "concern": ["関心", "かんしん", "concern, interest"],
  "interest": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "mechanism": ["機関", "きかん", "mechanism, facility, engine; agency, organisation, institution, organ"],
  "facility": ["機関", "きかん", "mechanism, facility, engine; agency, organisation, institution, organ"],
  "engine": ["機関", "きかん", "mechanism, facility, engine; agency, organisation, institution, organ"],
  "institution": ["機関", "きかん", "mechanism, facility, engine; agency, organisation, institution, organ"],
  "organ": ["機関", "きかん", "mechanism, facility, engine; agency, organisation, institution, organ"],
  "kansai south-western half of japan": ["関西", "かんさい, かんせい", "Kansai (south-western half of Japan, including Osaka)"],
  "including osaka": ["関西", "かんさい, かんせい", "Kansai (south-western half of Japan, including Osaka)"],
  "customs": ["関税", "かんぜい", "customs, duty, tariff"],
  "duty": ["関税", "かんぜい", "customs, duty, tariff"],
  "tariff": ["関税", "かんぜい", "customs, duty, tariff"],
  "taking part in": ["関与", "かんよ", "participation, taking part in, participating in, being concerned in"],
  "participating in": ["関与", "かんよ", "participation, taking part in, participating in, being concerned in"],
  "being concerned in": ["関与", "かんよ", "participation, taking part in, participating in, being concerned in"],
  "always": ["決まって", "きまって", "always, without fail, usually, regularly"],
  "without fail": ["決まって", "きまって", "always, without fail, usually, regularly"],
  "usually": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "regularly": ["決まって", "きまって", "always, without fail, usually, regularly"],
  "never": ["決して", "けっして, けして", "never, by no means, decidedly, indisputably"],
  "by no means": ["決して", "けっして, けして", "never, by no means, decidedly, indisputably"],
  "decidedly": ["決して", "けっして, けして", "never, by no means, decidedly, indisputably"],
  "indisputably": ["決して", "けっして, けして", "never, by no means, decidedly, indisputably"],
  "settlement": ["解決", "かいけつ", "settlement, solution, resolution"],
  "solution": ["解決", "かいけつ", "settlement, solution, resolution"],
  "judicial decision": ["判決", "はんけつ", "judicial decision, judgement, judgment, sentence, decree"],
  "judgement": ["判決", "はんけつ", "judicial decision, judgement, judgment, sentence, decree"],
  "judgment": ["判決", "はんけつ", "judicial decision, judgement, judgment, sentence, decree"],
  "sentence": ["判決", "はんけつ", "judicial decision, judgement, judgment, sentence, decree"],
  "decree": ["判決", "はんけつ", "judicial decision, judgement, judgment, sentence, decree"],
  "balance sheet": ["決算", "けっさん", "balance sheet, settlement of accounts"],
  "settlement of accounts": ["決算", "けっさん", "balance sheet, settlement of accounts"],
  "decision of a contest": ["決勝", "けっしょう", "decision of a contest, finals (in sports)"],
  "finals in sports": ["決勝", "けっしょう", "decision of a contest, finals (in sports)"],
  "child": ["子供", "こども", "child, children"],
  "young animal": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "young woman": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "young geisha": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "offshoot": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "new shares": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "bird egg": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "after a noun or -masu stem -er often of young women": ["子", "こ", "child; young (animal); young woman, young geisha; offshoot; interest; new shares; bird egg; (after a noun or -masu stem) -er (often of young women)"],
  "children": ["子供", "こども", "child, children"],
  "woman": ["女子", "じょし, おなご", "woman, girl"],
  "girl": ["女子", "じょし, おなご", "woman, girl"],
  "aspect": ["様子", "ようす", "aspect, state, appearance"],
  "son": ["息子", "むすこ, そく", "son; penis"],
  "penis": ["息子", "むすこ, そく", "son; penis"],
  "first of the sexagenary cycle": ["甲子", "かっし", "first of the sexagenary cycle"],
  "gene": ["遺伝子", "いでんし", "gene, genetic"],
  "genetic": ["遺伝子", "いでんし", "gene, genetic"],
  "motion": ["提言", "ていげん", "proposal, motion"],
  "confusion": ["動", "どう", "motion, change, confusion"],
  "movement": ["移動", "いどう", "removal, migration, movement; mobile (e.g. communications)"],
  "activity": ["活動", "かつどう", "action, activity"],
  "trend": ["動向", "どうこう", "trend, tendency, movement, attitude"],
  "exercise": ["運動", "うんどう", "motion, exercise"],
  "animal": ["動物", "どうぶつ", "animal"],
  "real estate": ["不動産", "ふどうさん", "real estate"],
  "tendency": ["動向", "どうこう", "trend, tendency, movement, attitude"],
  "attitude": ["動向", "どうこう", "trend, tendency, movement, attitude"],
  "removal": ["移動", "いどう", "removal, migration, movement; mobile (e.g. communications)"],
  "migration": ["移動", "いどう", "removal, migration, movement; mobile (e.g. communications)"],
  "mobile e.g. communications": ["移動", "いどう", "removal, migration, movement; mobile (e.g. communications)"],
  "imperial capital esp. kyoto": ["京", "きょう, けい", "imperial capital (esp. Kyoto); final word of an iroha-uta; 10^16, 10,000,000,000,000,000, ten quadrillion (American), (obs) ten thousand billion (British)"],
  "final word of an iroha-uta": ["京", "きょう, けい", "imperial capital (esp. Kyoto); final word of an iroha-uta; 10^16, 10,000,000,000,000,000, ten quadrillion (American), (obs) ten thousand billion (British)"],
  "10^16": ["京", "きょう, けい", "imperial capital (esp. Kyoto); final word of an iroha-uta; 10^16, 10,000,000,000,000,000, ten quadrillion (American), (obs) ten thousand billion (British)"],
  "10,000,000,000,000,000": ["京", "きょう, けい", "imperial capital (esp. Kyoto); final word of an iroha-uta; 10^16, 10,000,000,000,000,000, ten quadrillion (American), (obs) ten thousand billion (British)"],
  "ten quadrillion american": ["京", "きょう, けい", "imperial capital (esp. Kyoto); final word of an iroha-uta; 10^16, 10,000,000,000,000,000, ten quadrillion (American), (obs) ten thousand billion (British)"],
  "obs ten thousand billion british": ["京", "きょう, けい", "imperial capital (esp. Kyoto); final word of an iroha-uta; 10^16, 10,000,000,000,000,000, ten quadrillion (American), (obs) ten thousand billion (British)"],
  "beijing china": ["北京", "ぺきん", "Beijing (China), Peking"],
  "peking": ["北京", "ぺきん", "Beijing (China), Peking"],
  "kyoto": ["京都", "きょうと", "Kyoto"],
  "tokyo stock exchange": ["東京証券取引所", "とうきょうしょうけんとりひきじょ", "Tokyo Stock Exchange, TSE"],
  "tse": ["東京証券取引所", "とうきょうしょうけんとりひきじょ", "Tokyo Stock Exchange, TSE"],
  "the capital": ["帝京", "ていきょう", "the capital"],
  "nagoya and environs": ["中京", "ちゅうきょう", "Nagoya and environs"],
  "being in tokyo": ["在京", "ざいきょう", "being in Tokyo"],
  "proceeding to the capital tokyo": ["上京", "じょうきょう", "proceeding to the capital (Tokyo)"],
  "train line tokyo - narita": ["京成", "けいせい", "train line Tokyo - Narita"],
  "safety": ["安全", "あんぜん", "safety; security"],
  "security": ["安全", "あんぜん", "safety; security"],
  "whole": ["全体", "ぜんたい", "whole, entirety, whatever (is the matter)"],
  "entirety": ["全体", "ぜんたい", "whole, entirety, whatever (is the matter)"],
  "whatever is the matter": ["全体", "ぜんたい", "whole, entirety, whatever (is the matter)"],
  "country-wide": ["全国", "ぜんこく, ぜんごく", "country-wide, nation-wide, whole country, national"],
  "nation-wide": ["全国", "ぜんこく, ぜんごく", "country-wide, nation-wide, whole country, national"],
  "security guarantee e.g. military security": ["安全保障", "あんぜんほしょう", "security guarantee (e.g. military security, network security, etc.)"],
  "network security": ["安全保障", "あんぜんほしょう", "security guarantee (e.g. military security, network security, etc.)"],
  "whole surface": ["全面", "ぜんめん", "whole surface, entire"],
  "entire": ["全部", "ぜんぶ", "all, entire, whole, altogether"],
  "heart failure": ["心不全", "しんふぜん", "heart failure"],
  "all": ["全部", "ぜんぶ", "all, entire, whole, altogether"],
  "altogether": ["全部", "ぜんぶ", "all, entire, whole, altogether"],
  "all one's power": ["全力", "ぜんりょく", "all one's power, whole energy"],
  "whole energy": ["全力", "ぜんりょく", "all one's power, whole energy"],
  "purpose": ["意思", "いし", "intention, purpose"],
  "goal": ["目的", "もくてき", "purpose, goal, aim, objective, intention"],
  "aim": ["目的", "もくてき", "purpose, goal, aim, objective, intention"],
  "intention": ["意思", "いし", "intention, purpose"],
  "mark": ["目標", "もくひょう", "mark, objective, target"],
  "notice": ["注目", "ちゅうもく", "notice, attention, observation"],
  "attention": ["注目", "ちゅうもく", "notice, attention, observation"],
  "observation": ["注目", "ちゅうもく", "notice, attention, observation"],
  "data item": ["項目", "こうもく", "(data) item, entry"],
  "title": ["題", "だい", "title, subject, theme, topic; problem (on a test), question; counter for questions (on a test)"],
  "appellation": ["名目", "めいもく, みょうもく", "name, title, appellation, (something) nominal; (under the) pretext (of), pretense"],
  "something nominal": ["名目", "めいもく, みょうもく", "name, title, appellation, (something) nominal; (under the) pretext (of), pretense"],
  "under the pretext of": ["名目", "めいもく, みょうもく", "name, title, appellation, (something) nominal; (under the) pretext (of), pretense"],
  "pretense": ["名目", "めいもく, みょうもく", "name, title, appellation, (something) nominal; (under the) pretext (of), pretense"],
  "item of business": ["種目", "しゅもく", "event, item of business"],
  "eyeball": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "special feature": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "centerpiece": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "showpiece": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "drawcard": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "special program": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "loss leader": ["目玉", "めだま", "eyeball; special feature, centerpiece, showpiece, drawcard; special program, loss leader"],
  "before one's very eyes": ["目前", "もくぜん", "before one's very eyes, under one's nose, imminence, close at hand"],
  "under one's nose": ["目前", "もくぜん", "before one's very eyes, under one's nose, imminence, close at hand"],
  "imminence": ["目前", "もくぜん", "before one's very eyes, under one's nose, imminence, close at hand"],
  "close at hand": ["目前", "もくぜん", "before one's very eyes, under one's nose, imminence, close at hand"],
  "before one's eyes": ["目の前", "めのまえ", "before one's eyes, immediate, imminent"],
  "immediate": ["目の前", "めのまえ", "before one's eyes, immediate, imminent"],
  "imminent": ["目の前", "めのまえ", "before one's eyes, immediate, imminent"],
  "list of articles": ["品目", "ひんもく", "list of articles"],
  "surface": ["表面", "ひょうめん", "surface, outside, face, appearance"],
  "face i.e. the visible side of an object": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "front of a building": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "obverse side i.e. head of a coin": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "outside": ["表面", "ひょうめん", "surface, outside, face, appearance"],
  "exterior": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "first half of an innings": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "top of an inning": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "cover for tatami mats": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "foreground": ["表", "おもて", "surface; face (i.e. the visible side of an object); front (of a building, etc.), obverse side (i.e. \"head\") of a coin; outside, exterior; appearance; public; first half (of an innings), top (of an inning); cover (for tatami mats, etc.); foreground"],
  "presentation": ["表現", "ひょうげん", "expression, presentation; representation, notation"],
  "notation": ["表現", "ひょうげん", "expression, presentation; representation, notation"],
  "facial expression": ["表情", "ひょうじょう", "facial expression"],
  "embodiment": ["表れ", "あらわれ", "embodiment, manifestation, materialization, materialisation, expression, indication"],
  "display": ["表示", "ひょうじ", "indication, expression, display, presentation"],
  "face": ["表面", "ひょうめん", "surface, outside, face, appearance"],
  "official announcement": ["公表", "こうひょう", "official announcement, proclamation"],
  "battle": ["戦闘", "せんとう", "battle, fight, combat"],
  "fight": ["戦闘", "せんとう", "battle, fight, combat"],
  "struggle": ["戦い", "たたかい", "battle, fight, struggle, conflict"],
  "conflict": ["戦い", "たたかい", "battle, fight, struggle, conflict"],
  "war": ["戦争", "せんそう", "war"],
  "tactics": ["戦略", "せんりゃく", "strategy, tactics"],
  "strategy": ["戦略", "せんりゃく", "strategy, tactics"],
  "military or naval operations": ["作戦", "さくせん", "tactics, strategy; military or naval operations"],
  "combat": ["戦闘", "せんとう", "battle, fight, combat"],
  "armistice": ["停戦", "ていせん", "armistice, ceasefire"],
  "ceasefire": ["停戦", "ていせん", "armistice, ceasefire"],
  "cold war": ["冷戦", "れいせん", "cold war"],
  "challenge": ["課題", "かだい", "subject, theme, task, challenge, issue"],
  "defiance": ["挑戦", "ちょうせん", "challenge, defiance"],
  "sutra": ["経", "きょう", "sutra, Buddhist scriptures"],
  "buddhist scriptures": ["経", "きょう", "sutra, Buddhist scriptures"],
  "economics": ["経済", "けいざい", "economics, business, finance, economy"],
  "finance": ["経済", "けいざい", "economics, business, finance, economy"],
  "economy": ["経済", "けいざい", "economics, business, finance, economy"],
  "federation of economic organizations organisation": ["経団連", "けいだんれん", "Federation of Economic Organizations (Organisation)"],
  "expenses": ["経費", "けいひ", "expenses, cost, outlay"],
  "cost": ["経費", "けいひ", "expenses, cost, outlay"],
  "outlay": ["経費", "けいひ", "expenses, cost, outlay"],
  "details": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "whole story": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "sequence of events": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "chronology": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "particulars": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "how it started": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "how things got this way": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "complications": ["経緯", "けいい, いきさつ", "details, whole story, sequence of events, chronology, particulars, how it started, how things got this way; complications, position"],
  "economic": ["経済的", "けいざいてき", "economic, economical"],
  "economical": ["経済的", "けいざいてき", "economic, economical"],
  "in accordance with ...": ["通り", "どおり", "in accordance with ..., following ...; .. Street, .. Avenue"],
  "following ...": ["通り", "どおり", "in accordance with ..., following ...; .. Street, .. Avenue"],
  ".. street": ["通り", "どおり", "in accordance with ..., following ...; .. Street, .. Avenue"],
  ".. avenue": ["通り", "どおり", "in accordance with ..., following ...; .. Street, .. Avenue"],
  "transmission": ["通信", "つうしん", "correspondence, communication, transmission, news, signal"],
  "news": ["通信", "つうしん", "correspondence, communication, transmission, news, signal"],
  "signal": ["通信", "つうしん", "correspondence, communication, transmission, news, signal"],
  "commonness": ["共通", "きょうつう", "commonness, community"],
  "transportation": ["交通", "こうつう", "communication, transportation, traffic, intercourse"],
  "traffic": ["交通", "こうつう", "communication, transportation, traffic, intercourse"],
  "intercourse": ["交通", "こうつう", "communication, transportation, traffic, intercourse"],
  "currency": ["通貨", "つうか", "currency"],
  "common": ["通常", "つうじょう", "common, general, normal, usual"],
  "normal": ["通常", "つうじょう", "common, general, normal, usual"],
  "usual": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "normally": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "generally": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "train that stops at every station": ["普通", "ふつう", "general, ordinary, usual; normally, generally, usually; train that stops at every station"],
  "former ministry of international trade and industry now ministry of economy": ["通産省", "つうさんしょう", "(former) Ministry of International Trade and Industry (now Ministry of Economy, Trade and Industry), MITI"],
  "trade and industry": ["通産省", "つうさんしょう", "(former) Ministry of International Trade and Industry (now Ministry of Economy, Trade and Industry), MITI"],
  "miti": ["通産省", "つうさんしょう", "(former) Ministry of International Trade and Industry (now Ministry of Economy, Trade and Industry), MITI"],
  "total": ["通算", "つうさん", "total"],
  "other esp. places and things": ["外", "ほか", "other (esp. places and things), the rest"],
  "abroad": ["海外", "かいがい", "foreign, abroad, overseas"],
  "overseas": ["海外", "かいがい", "foreign, abroad, overseas"],
  "diplomacy": ["外交", "がいこう", "diplomacy"],
  "ministry of foreign affairs": ["外務省", "がいむしょう", "Ministry of Foreign Affairs"],
  "foreign affairs": ["外務", "がいむ", "foreign affairs"],
  "inside and outside": ["内外", "ないがい, うちそと", "inside and outside, domestic and foreign, approximately, interior and exterior"],
  "domestic and foreign": ["内外", "ないがい, うちそと", "inside and outside, domestic and foreign, approximately, interior and exterior"],
  "approximately": ["内外", "ないがい, うちそと", "inside and outside, domestic and foreign, approximately, interior and exterior"],
  "interior and exterior": ["内外", "ないがい, うちそと", "inside and outside, domestic and foreign, approximately, interior and exterior"],
  "unexpected": ["意外", "いがい", "unexpected, surprising"],
  "surprising": ["意外", "いがい", "unexpected, surprising"],
  "most": ["最も", "もっとも", "most, extremely"],
  "most recent": ["最近", "さいきん", "latest, most recent, nowadays"],
  "final": ["最終", "さいしゅう", "last, final, closing"],
  "closing": ["最終", "さいしゅう", "last, final, closing"],
  "outset": ["最初", "さいしょ", "beginning, outset, first, onset"],
  "onset": ["最初", "さいしょ", "beginning, outset, first, onset"],
  "supreme court": ["最高裁", "さいこうさい", "Supreme Court"],
  "least": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "lowest": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "worst": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "nasty": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "disgusting": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "horrible": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "yuck!": ["最低", "さいてい", "least, lowest, worst; nasty, disgusting, horrible, yuck!"],
  "finally": ["最終的", "さいしゅうてき", "finally"],
  "so to speak": ["言わば", "いわば", "so to speak, so to call it, as it were"],
  "so to call it": ["言わば", "いわば", "so to speak, so to call it, as it were"],
  "as it were": ["言わば", "いわば", "so to speak, so to call it, as it were"],
  "to say": ["言う", "いう, ゆう", "to say; to call (i.e. to give a name)"],
  "to call i.e. to give a name": ["言う", "いう, ゆう", "to say; to call (i.e. to give a name)"],
  "word": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "remark": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "language": ["言語", "げんご, ごんご", "language"],
  "dialect": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "words": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "phrase": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "manner of speaking": ["言葉", "ことば, けとば", "language, dialect; word, words, phrase, term, expression, remark; speech, (manner of) speaking"],
  "evidence": ["証言", "しょうげん", "evidence, testimony"],
  "testimony": ["証言", "しょうげん", "evidence, testimony"],
  "single word": ["一言", "ひとこと, いちげん, いちごん", "single word"],
  "family name": ["氏", "うじ", "family name, lineage, birth"],
  "lineage": ["氏", "うじ", "family name, lineage, birth"],
  "birth": ["氏", "うじ", "family name, lineage, birth"],
  "identity": ["氏名", "しめい", "full name, identity"],
  "the said person": ["同氏", "どうし", "the said person, he, she, same person"],
  "he": ["氏", "し", "Mr; clan; he, him; Mr; counter for people"],
  "she": ["同氏", "どうし", "the said person, he, she, same person"],
  "same person": ["同氏", "どうし", "the said person, he, she, same person"],
  "both persons": ["両氏", "りょうし", "both persons"],
  "genji the character in the genji monogatari": ["源氏", "げんじ", "Genji (the character in the Genji Monogatari); the Minamoto family"],
  "the minamoto family": ["源氏", "げんじ", "Genji (the character in the Genji Monogatari); the Minamoto family"],
  "clan": ["氏", "し", "Mr; clan; he, him; Mr; counter for people"],
  "family": ["氏族", "しぞく", "clan, family"],
  "shrine parishioner": ["氏子", "うじこ", "shrine parishioner"],
  "boyfriend": ["彼氏", "かれし", "boyfriend"],
  "mr": ["氏", "し", "Mr; clan; he, him; Mr; counter for people"],
  "him": ["氏", "し", "Mr; clan; he, him; Mr; counter for people"],
  "counter for people": ["氏", "し", "Mr; clan; he, him; Mr; counter for people"],
  "shinto god": ["氏神", "うじがみ", "Shinto god, patron god"],
  "patron god": ["氏神", "うじがみ", "Shinto god, patron god"],
  "present time": ["現在", "げんざい", "now, current, present, present time, as of"],
  "as of": ["現在", "げんざい", "now, current, present, present time, as of"],
  "present condition": ["現状", "げんじょう", "present condition, existing state, status quo"],
  "existing state": ["現状", "げんじょう", "present condition, existing state, status quo"],
  "status quo": ["現状", "げんじょう", "present condition, existing state, status quo"],
  "cash": ["現金", "げんきん", "cash, ready money, mercenary, self-interested"],
  "ready money": ["現金", "げんきん", "cash, ready money, mercenary, self-interested"],
  "mercenary": ["現金", "げんきん", "cash, ready money, mercenary, self-interested"],
  "self-interested": ["現金", "げんきん", "cash, ready money, mercenary, self-interested"],
  "principle": ["主義", "しゅぎ", "doctrine, rule, principle"],
  "logic": ["理", "り", "reason, principle, logic; general principle (as opposed to individual concrete phenomenon); (in neo-Confucianism) the underlying principles of the cosmos"],
  "general principle as opposed to individual concrete phenomenon": ["理", "り", "reason, principle, logic; general principle (as opposed to individual concrete phenomenon); (in neo-Confucianism) the underlying principles of the cosmos"],
  "in neo-confucianism the underlying principles of the cosmos": ["理", "り", "reason, principle, logic; general principle (as opposed to individual concrete phenomenon); (in neo-Confucianism) the underlying principles of the cosmos"],
  "control": ["管理", "かんり", "control, management (e.g. of a business)"],
  "management e.g. of a business": ["管理", "かんり", "control, management (e.g. of a business)"],
  "board of directors": ["理事", "りじ", "director, board of directors"],
  "pretext": ["理由", "りゆう", "reason, pretext, motive"],
  "motive": ["理由", "りゆう", "reason, pretext, motive"],
  "processing": ["処理", "しょり", "processing, dealing with, treatment, disposition, disposal"],
  "treatment": ["処理", "しょり", "processing, dealing with, treatment, disposition, disposal"],
  "disposition": ["処理", "しょり", "processing, dealing with, treatment, disposition, disposal"],
  "leader": ["総理", "そうり", "prime minister, leader, overseer (of national affairs), president"],
  "overseer of national affairs": ["総理", "そうり", "prime minister, leader, overseer (of national affairs), president"],
  "understanding": ["理解", "りかい", "understanding, comprehension"],
  "comprehension": ["理解", "りかい", "understanding, comprehension"],
  "cooking": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "cookery": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "cuisine": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "dealing with something": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "handling": ["料理", "りょうり", "cooking, cookery, cuisine; dealing with something, handling, administration, management"],
  "idea": ["意向", "いこう", "intention, idea, inclination"],
  "investigation": ["調査", "ちょうさ", "investigation, examination, inquiry, enquiry, survey"],
  "inspection": ["調べ", "しらべ", "investigation, inspection, examination; tune, note, melody"],
  "examination": ["調査", "ちょうさ", "investigation, examination, inquiry, enquiry, survey"],
  "tune": ["調べ", "しらべ", "investigation, inspection, examination; tune, note, melody"],
  "note": ["調べ", "しらべ", "investigation, inspection, examination; tune, note, melody"],
  "melody": ["調べ", "しらべ", "investigation, inspection, examination; tune, note, melody"],
  "survey": ["調査", "ちょうさ", "investigation, examination, inquiry, enquiry, survey"],
  "adjustment": ["調整", "ちょうせい", "regulation, adjustment, tuning, modification, alteration"],
  "tuning": ["調整", "ちょうせい", "regulation, adjustment, tuning, modification, alteration"],
  "modification": ["調整", "ちょうせい", "regulation, adjustment, tuning, modification, alteration"],
  "alteration": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "conciliation": ["協調", "きょうちょう", "cooperation, conciliation, harmony; firm (market) tone"],
  "firm market tone": ["協調", "きょうちょう", "cooperation, conciliation, harmony; firm (market) tone"],
  "favourable": ["順調", "じゅんちょう", "favourable, favorable, doing well, OK, all right"],
  "favorable": ["順調", "じゅんちょう", "favourable, favorable, doing well, OK, all right"],
  "promising": ["好調", "こうちょう", "favourable, favorable, promising, satisfactory, in good shape"],
  "in good shape": ["好調", "こうちょう", "favourable, favorable, promising, satisfactory, in good shape"],
  "supply": ["調達", "ちょうたつ", "supply, provision, raising"],
  "provision": ["調達", "ちょうたつ", "supply, provision, raising"],
  "raising": ["調達", "ちょうたつ", "supply, provision, raising"],
  "doing well": ["順調", "じゅんちょう", "favourable, favorable, doing well, OK, all right"],
  "ok": ["順調", "じゅんちょう", "favourable, favorable, doing well, OK, all right"],
  "all right": ["順調", "じゅんちょう", "favourable, favorable, doing well, OK, all right"],
  "signature": ["調印", "ちょういん", "signature, signing, sealing"],
  "sealing": ["調印", "ちょういん", "signature, signing, sealing"],
  "keynote": ["基調", "きちょう", "basis, keynote"],
  "flippant": ["上っ調子", "うわっちょうし", "flippant, frivolous, shallow"],
  "frivolous": ["上っ調子", "うわっちょうし", "flippant, frivolous, shallow"],
  "shallow": ["上っ調子", "うわっちょうし", "flippant, frivolous, shallow"],
  "body": ["体", "からだ, しんたい", "body; health"],
  "health": ["体", "からだ, しんたい", "body; health"],
  "concrete": ["具体", "ぐたい", "concrete, tangible, material"],
  "tangible": ["具体", "ぐたい", "concrete, tangible, material"],
  "specific": ["具体的", "ぐたいてき", "concrete, tangible, definite, specific"],
  "order": ["体制", "たいせい", "order, system, structure, set-up, organization, organisation"],
  "system": ["体制", "たいせい", "order, system, structure, set-up, organization, organisation"],
  "structure": ["体制", "たいせい", "order, system, structure, set-up, organization, organisation"],
  "set-up": ["体制", "たいせい", "order, system, structure, set-up, organization, organisation"],
  "self-governing body": ["自治体", "じちたい", "self-governing body, municipality, autonomous entity"],
  "municipality": ["自治体", "じちたい", "self-governing body, municipality, autonomous entity"],
  "autonomous entity": ["自治体", "じちたい", "self-governing body, municipality, autonomous entity"],
  "personal experience": ["体験", "たいけん", "personal experience"],
  "corpse": ["遺体", "いたい", "corpse, remains"],
  "remains": ["遺体", "いたい", "corpse, remains"],
  "material": ["具体", "ぐたい", "concrete, tangible, material"],
  "strengthen": ["強化", "きょうか", "strengthen, intensify, reinforce, solidify, enhancement"],
  "intensify": ["強化", "きょうか", "strengthen, intensify, reinforce, solidify, enhancement"],
  "reinforce": ["強化", "きょうか", "strengthen, intensify, reinforce, solidify, enhancement"],
  "solidify": ["強化", "きょうか", "strengthen, intensify, reinforce, solidify, enhancement"],
  "enhancement": ["強化", "きょうか", "strengthen, intensify, reinforce, solidify, enhancement"],
  "culture": ["文化", "ぶんか", "culture, civilization, civilisation; Bunka era (1804.2.11-1818.4.22)"],
  "civilization": ["文化", "ぶんか", "culture, civilization, civilisation; Bunka era (1804.2.11-1818.4.22)"],
  "civilisation": ["文化", "ぶんか", "culture, civilization, civilisation; Bunka era (1804.2.11-1818.4.22)"],
  "bunka era 1804.2.11-1818.4.22": ["文化", "ぶんか", "culture, civilization, civilisation; Bunka era (1804.2.11-1818.4.22)"],
  "variation": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "mutation": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "transition": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "transformation": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "transfiguration": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "metamorphosis": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "variety": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "diversity": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "inflection": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "declension": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "conjugation": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "sidestepping sumo": ["変化", "へんか", "change, variation, alteration, mutation, transition, transformation, transfiguration, metamorphosis; variety, diversity; inflection, declension, conjugation; sidestepping (sumo)"],
  "suffer deterioration": ["悪化", "あっか", "(suffer) deterioration, growing worse, aggravation, degeneration, corruption"],
  "growing worse": ["悪化", "あっか", "(suffer) deterioration, growing worse, aggravation, degeneration, corruption"],
  "aggravation": ["悪化", "あっか", "(suffer) deterioration, growing worse, aggravation, degeneration, corruption"],
  "degeneration": ["悪化", "あっか", "(suffer) deterioration, growing worse, aggravation, degeneration, corruption"],
  "corruption": ["悪化", "あっか", "(suffer) deterioration, growing worse, aggravation, degeneration, corruption"],
  "chemistry": ["化学", "かがく, ばけがく", "chemistry; chemical company (e.g. Acme Chemical Co.)"],
  "chemical company e.g. acme chemical co.": ["化学", "かがく, ばけがく", "chemistry; chemical company (e.g. Acme Chemical Co.)"],
  "oxidation": ["酸化", "さんか", "oxidation"],
  "make-up": ["化粧", "けしょう, けわい, けそう", "make-up, cosmetics"],
  "cosmetics": ["化粧", "けしょう, けわい, けそう", "make-up, cosmetics"],
  "rationalization": ["合理化", "ごうりか", "rationalization, rationalisation, rationalize, rationalise"],
  "rationalisation": ["合理化", "ごうりか", "rationalization, rationalisation, rationalize, rationalise"],
  "rationalize": ["合理化", "ごうりか", "rationalization, rationalisation, rationalize, rationalise"],
  "rationalise": ["合理化", "ごうりか", "rationalization, rationalisation, rationalize, rationalise"],
  "internationalization": ["国際化", "こくさいか", "internationalization, internationalisation, i18n (in IT)"],
  "internationalisation": ["国際化", "こくさいか", "internationalization, internationalisation, i18n (in IT)"],
  "i18n in it": ["国際化", "こくさいか", "internationalization, internationalisation, i18n (in IT)"],
  "regularization": ["本格化", "ほんかくか", "regularization, regularisation, getting up speed, proceeding at full tilt"],
  "regularisation": ["本格化", "ほんかくか", "regularization, regularisation, getting up speed, proceeding at full tilt"],
  "getting up speed": ["本格化", "ほんかくか", "regularization, regularisation, getting up speed, proceeding at full tilt"],
  "proceeding at full tilt": ["本格化", "ほんかくか", "regularization, regularisation, getting up speed, proceeding at full tilt"],
  "high rice field": ["上田", "じょうでん", "high rice field, very fertile rice field"],
  "very fertile rice field": ["上田", "じょうでん", "high rice field, very fertile rice field"],
  "water-filled paddy field": ["水田", "すいでん", "(water-filled) paddy field"],
  "oil field": ["油田", "ゆでん", "oil field"],
  "the sticks": ["田舎", "いなか", "rural area, countryside, the sticks; hometown"],
  "hometown": ["田舎", "いなか", "rural area, countryside, the sticks; hometown"],
  "mulberry plantation": ["桑田", "そうでん", "mulberry plantation"],
  "rural districts": ["田園", "でんえん, でんおん", "country, rural districts; cultivated land, fields"],
  "cultivated land": ["田園", "でんえん, でんおん", "country, rural districts; cultivated land, fields"],
  "fields": ["田園", "でんえん, でんおん", "country, rural districts; cultivated land, fields"],
  "fields of rice and other crops": ["田畑", "たはた, でんぱた, たはたけ", "fields (of rice and other crops)"],
  "rice planting": ["田植え", "たうえ", "rice planting"],
  "favorable voting constituency favourable": ["票田", "ひょうでん", "(favorable voting) constituency (favourable)"],
  "a new rice field": ["新田", "しんでん", "a new rice field"],
  "authorities": ["当局", "とうきょく", "authorities; this office"],
  "this office": ["当局", "とうきょく", "authorities; this office"],
  "at first": ["当初", "とうしょ", "at first"],
  "in charge": ["担当", "たんとう", "(in) charge"],
  "hit": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "success": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "reaching the mark": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "per ...": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "vicinity": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "neighborhood": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "neighbourhood": ["当たり", "あたり", "hit, success, reaching the mark, per ..., vicinity, neighborhood, neighbourhood"],
  "urgent": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "pressing": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "impending": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "to confront an issue": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "to face up to something": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "for the meantime": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "at present": ["当面", "とうめん", "current, urgent, pressing, impending; to confront (an issue), to face (up to something); for the meantime, at present"],
  "person in charge": ["担当者", "たんとうしゃ", "person in charge, person responsible, one in charge, responsible party, contact (person)"],
  "person responsible": ["担当者", "たんとうしゃ", "person in charge, person responsible, one in charge, responsible party, contact (person)"],
  "one in charge": ["担当者", "たんとうしゃ", "person in charge, person responsible, one in charge, responsible party, contact (person)"],
  "responsible party": ["担当者", "たんとうしゃ", "person in charge, person responsible, one in charge, responsible party, contact (person)"],
  "contact person": ["担当者", "たんとうしゃ", "person in charge, person responsible, one in charge, responsible party, contact (person)"],
  "eight": ["八", "はち, や", "eight"],
  "august": ["八月", "はちがつ", "August"],
  "eighty": ["八十", "はちじゅう, やそ", "eighty"],
  "the thirty-eighth parallel": ["三十八度線", "さんじゅうはちどせん", "the Thirty-eighth Parallel"],
  "180 degrees": ["百八十度", "ひゃくはちじゅうど", "180 degrees, complete change"],
  "complete change": ["百八十度", "ひゃくはちじゅうど", "180 degrees, complete change"],
  "hachiman god of war": ["八幡", "はちまん", "Hachiman (God of War); Hachiman shrine; certainly"],
  "hachiman shrine": ["八幡", "はちまん", "Hachiman (God of War); Hachiman shrine; certainly"],
  "certainly": ["八幡", "はちまん", "Hachiman (God of War); Hachiman shrine; certainly"],
  "no. 18": ["十八番", "じゅうはちばん, おはこ", "No. 18, eighteenth; repertoire of 18 kabuki plays; one's favourite stunt (favorite), one's specialty"],
  "eighteenth": ["十八番", "じゅうはちばん, おはこ", "No. 18, eighteenth; repertoire of 18 kabuki plays; one's favourite stunt (favorite), one's specialty"],
  "repertoire of 18 kabuki plays": ["十八番", "じゅうはちばん, おはこ", "No. 18, eighteenth; repertoire of 18 kabuki plays; one's favourite stunt (favorite), one's specialty"],
  "one's favourite stunt favorite": ["十八番", "じゅうはちばん, おはこ", "No. 18, eighteenth; repertoire of 18 kabuki plays; one's favourite stunt (favorite), one's specialty"],
  "one's specialty": ["十八番", "じゅうはちばん, おはこ", "No. 18, eighteenth; repertoire of 18 kabuki plays; one's favourite stunt (favorite), one's specialty"],
  "multilayered": ["八重", "やえ", "multilayered, doubled"],
  "doubled": ["八重", "やえ", "multilayered, doubled"],
  "8th note": ["八分音符", "はちぶおんぷ", "8th note"],
  "six": ["六つ", "むっつ, むつ", "six"],
  "june": ["六月", "ろくがつ", "June"],
  "sixty": ["六十", "ろくじゅう, むそ", "sixty"],
  "64th note": ["六十四分音符", "ろくじゅうしぶおんぷ", "64th note"],
  "sixteen": ["十六", "じゅうろく", "16, sixteen"],
  "hexagon": ["六角", "ろっかく", "hexagon"],
  "around the clock": ["四六時中", "しろくじちゅう", "around the clock, day and night (Note: 4 x 6 = 24)"],
  "day and night note: 4 x 6 = 24": ["四六時中", "しろくじちゅう", "around the clock, day and night (Note: 4 x 6 = 24)"],
  "pawnshop": ["一六銀行", "いちろくぎんこう", "pawnshop"],
  "gambling": ["一六勝負", "いちろくしょうぶ", "gambling, speculation"],
  "contract": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "compact": ["契約", "けいやく", "contract, compact, agreement"],
  "treaty": ["条約", "じょうやく", "treaty, pact"],
  "public commitment or promise": ["公約", "こうやく", "public commitment or promise"],
  "promise": ["約束", "やくそく", "arrangement, promise, appointment, pact, engagement; convention, rule"],
  "engagement": ["婚約", "こんやく", "engagement, betrothal"],
  "reservation": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "booking": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "advance order": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "pledge": ["予約", "よやく", "reservation, appointment, booking, advance order; contract, subscription, pledge"],
  "limitation": ["制約", "せいやく", "limitation, restriction, condition, constraints"],
  "restriction": ["制約", "せいやく", "limitation, restriction, condition, constraints"],
  "constraints": ["制約", "せいやく", "limitation, restriction, condition, constraints"],
  "rules": ["規約", "きやく", "agreement, rules, code, protocol, convention"],
  "code": ["規約", "きやく", "agreement, rules, code, protocol, convention"],
  "protocol": ["規約", "きやく", "agreement, rules, code, protocol, convention"],
  "betrothal": ["婚約", "こんやく", "engagement, betrothal"],
  "conclusion of a treaty": ["締約", "ていやく", "conclusion of a treaty"],
  "cancellation of contract": ["解約", "かいやく", "cancellation of contract"],
  "mainly": ["主に", "おもに", "mainly, primarily"],
  "primarily": ["主に", "おもに", "mainly, primarily"],
  "chief mourner": ["喪主", "もしゅ", "chief mourner"],
  "doctrine": ["主義", "しゅぎ", "doctrine, rule, principle"],
  "sponsorship": ["主催", "しゅさい", "organization, organisation, sponsorship"],
  "governor": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "top student": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "head of the class": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "top seat": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "first desk in orchestra": ["主席", "しゅせき", "head, chief; chairman, governor, president; top student, head of the class; top seat, first desk (in orchestra)"],
  "claim": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "request": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "insistence": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "advocacy": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "contention": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "tenet": ["主張", "しゅちょう", "claim, request, insistence, assertion, advocacy, emphasis, contention, opinion, tenet"],
  "housewife": ["主婦", "しゅふ", "housewife, mistress (of the house), homemaker"],
  "mistress of the house": ["主婦", "しゅふ", "housewife, mistress (of the house), homemaker"],
  "homemaker": ["主婦", "しゅふ", "housewife, mistress (of the house), homemaker"],
  "main": ["主要", "しゅよう", "chief, main, principal, major"],
  "principal": ["主要", "しゅよう", "chief, main, principal, major"],
  "major": ["主要", "しゅよう", "chief, main, principal, major"],
  "democratic people's republic of korea north korea": ["朝鮮民主主義人民共和国", "ちょうせんみんしゅしゅぎじんみんきょうわこく", "Democratic People's Republic of Korea (North Korea), DPRK"],
  "dprk": ["朝鮮民主主義人民共和国", "ちょうせんみんしゅしゅぎじんみんきょうわこく", "Democratic People's Republic of Korea (North Korea), DPRK"],
  "theme": ["主題", "しゅだい", "subject, theme, motif"],
  "issue": ["課題", "かだい", "subject, theme, task, challenge, issue"],
  "topic": ["題", "だい", "title, subject, theme, topic; problem (on a test), question; counter for questions (on a test)"],
  "problem on a test": ["題", "だい", "title, subject, theme, topic; problem (on a test), question; counter for questions (on a test)"],
  "counter for questions on a test": ["題", "だい", "title, subject, theme, topic; problem (on a test), question; counter for questions (on a test)"],
  "the point at issue": ["問題点", "もんだいてん", "the point at issue"],
  "topic of discussion": ["議題", "ぎだい", "topic of discussion, agenda"],
  "social problem": ["社会問題", "しゃかいもんだい", "social problem"],
  "motif": ["主題", "しゅだい", "subject, theme, motif"],
  "homework": ["宿題", "しゅくだい", "homework"],
  "under esp. influence or guidance": ["下", "もと", "under (esp. influence or guidance)"],
  "to hang": ["下げる", "さげる", "to hang, to lower, to move back, to wear, to dismiss, to grant"],
  "to lower": ["下げる", "さげる", "to hang, to lower, to move back, to wear, to dismiss, to grant"],
  "to move back": ["下げる", "さげる", "to hang, to lower, to move back, to wear, to dismiss, to grant"],
  "to wear": ["下げる", "さげる", "to hang, to lower, to move back, to wear, to dismiss, to grant"],
  "to dismiss": ["下げる", "さげる", "to hang, to lower, to move back, to wear, to dismiss, to grant"],
  "to grant": ["下げる", "さげる", "to hang, to lower, to move back, to wear, to dismiss, to grant"],
  "reduction": ["引き下げ", "ひきさげ", "reduction, cut"],
  "cut": ["引き下げ", "ひきさげ", "reduction, cut"],
  "down-train going away from tokyo": ["下り", "くだり", "down-train (going away from Tokyo); down-slope, downward going"],
  "down-slope": ["下り", "くだり", "down-train (going away from Tokyo); down-slope, downward going"],
  "downward going": ["下り", "くだり", "down-train (going away from Tokyo); down-slope, downward going"],
  "lower house": ["下院", "かいん", "lower house, lower (legislative) body"],
  "lower legislative body": ["下院", "かいん", "lower house, lower (legislative) body"],
  "alighting from train": ["下車", "げしゃ", "alighting (from train, bus, etc.), getting off"],
  "bus": ["下車", "げしゃ", "alighting (from train, bus, etc.), getting off"],
  "getting off": ["下車", "げしゃ", "alighting (from train, bus, etc.), getting off"],
  "basement": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "cellar": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "underground place": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "underground": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "below ground": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "secret": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "under cover": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "underground railway": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "subway": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "metro": ["地下", "ちか", "basement, cellar, underground place; underground, below ground; secret, under cover; underground (railway), subway, metro"],
  "decline": ["低下", "ていか", "fall, decline, lowering, deterioration, degradation"],
  "lowering": ["低下", "ていか", "fall, decline, lowering, deterioration, degradation"],
  "deterioration": ["低下", "ていか", "fall, decline, lowering, deterioration, degradation"],
  "degradation": ["低下", "ていか", "fall, decline, lowering, deterioration, degradation"],
  "not exceeding": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "and downward": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "... and below": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "below e.g. standard": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "under e.g. a level": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "the below-mentioned": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "the following": ["以下", "いか, いげ", "not exceeding, and downward, ... and below; below (e.g. standard), under (e.g. a level); the below-mentioned, the following, the rest"],
  "your highness": ["殿下", "でんか, てんが", "your Highness, his (or her) Highness"],
  "his or her highness": ["殿下", "でんか, てんが", "your Highness, his (or her) Highness"],
  "neck": ["首", "くび, クビ", "neck; head; unemployed person"],
  "unemployed person": ["首", "くび, クビ", "neck; head; unemployed person"],
  "brains": ["首脳", "しゅのう", "head, brains, leading spirit"],
  "leading spirit": ["首脳", "しゅのう", "head, brains, leading spirit"],
  "capital city": ["首都", "しゅと", "capital city, metropolis"],
  "metropolis": ["首都", "しゅと", "capital city, metropolis"],
  "the capital city often tokyo area typically within 50 km of city's centre center": ["首都圏", "しゅとけん", "the capital city (often Tokyo) area (typically within 50 km of city's centre) (center)"],
  "first place": ["首位", "しゅい", "first place, head position, leading position"],
  "head position": ["首位", "しゅい", "first place, head position, leading position"],
  "leading position": ["首位", "しゅい", "first place, head position, leading position"],
  "tanka": ["一首", "いっしゅ", "tanka, poem"],
  "poem": ["一首", "いっしゅ", "tanka, poem"],
  "ruler": ["元首", "げんしゅ", "ruler, sovereign"],
  "sovereign": ["元首", "げんしゅ", "ruler, sovereign"],
  "head of organization": ["首長", "しゅちょう", "head (of organization, organisation), chief"],
  "meaning": ["意義", "いぎ", "meaning, significance"],
  "significance": ["意義", "いぎ", "meaning, significance"],
  "inclination": ["意向", "いこう", "intention, idea, inclination"],
  "consciousness": ["意識", "いしき", "consciousness; awareness, sense; mano-vijnana (mental consciousness, cognizer of sensory information)"],
  "awareness": ["意識", "いしき", "consciousness; awareness, sense; mano-vijnana (mental consciousness, cognizer of sensory information)"],
  "sense": ["意識", "いしき", "consciousness; awareness, sense; mano-vijnana (mental consciousness, cognizer of sensory information)"],
  "mano-vijnana mental consciousness": ["意識", "いしき", "consciousness; awareness, sense; mano-vijnana (mental consciousness, cognizer of sensory information)"],
  "cognizer of sensory information": ["意識", "いしき", "consciousness; awareness, sense; mano-vijnana (mental consciousness, cognizer of sensory information)"],
  "will": ["意欲", "いよく", "will, desire, ambition"],
  "desire": ["意欲", "いよく", "will, desire, ambition"],
  "ambition": ["意欲", "いよく", "will, desire, ambition"],
  "constitution": ["憲法", "けんぽう", "constitution"],
  "bill law": ["法案", "ほうあん", "bill (law)"],
  "corporate body": ["法人", "ほうじん", "corporate body, corporation, (legal) person, (juridical) person"],
  "legal person": ["法人", "ほうじん", "corporate body, corporation, (legal) person, (juridical) person"],
  "juridical person": ["法人", "ほうじん", "corporate body, corporation, (legal) person, (juridical) person"],
  "law": ["法律", "ほうりつ", "law"],
  "administration of justice": ["司法", "しほう", "administration of justice"],
  "courtroom": ["法廷", "ほうてい", "courtroom"],
  "legality": ["法的", "ほうてき", "legality"],
  "legislation": ["立法", "りっぽう", "legislation, lawmaking"],
  "lawmaking": ["立法", "りっぽう", "legislation, lawmaking"]
};
},{}],"content.js":[function(require,module,exports) {
"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

var _Utils = _interopRequireDefault(require("./Components/Utils"));

var _kanji = _interopRequireDefault(require("./data/kanji.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

console.log("Kanject Loaded.");
console.log("Kanject: Scanning words."); // remove any old containers

(0, _jquery.default)('.kan-container, .kan-spacer').remove();

var elements = _toConsumableArray((0, _jquery.default)('p'));

elements.forEach(function (el) {
  console.log();
  var words = (0, _jquery.default)(el).text().toLowerCase().trim().split(' ');
  var wordsUpper = (0, _jquery.default)(el).text().trim().split(' ');
  (0, _jquery.default)(el).html('');
  words.forEach(function (word, i) {
    if (_kanji.default[word]) {
      console.log("Word found: " + word);
      console.log(_kanji.default[word]);
      var symbol = _kanji.default[word][0];
      var reading = _kanji.default[word][1]; // $('<div class="kan-spacer"></div>').appendTo(el);
      // $(`<div class="kan-container">
      //     <div class="kan-reading">` + reading + `</div>
      //     <div class="kan-symbol">` + symbol + `</div>
      //     <div class="kan-word">` + word + `</div>
      // </div>`).appendTo(el);

      (0, _jquery.default)('<span style="text-decoration: underline;">' + wordsUpper[i] + '</span>').appendTo(el);
      (0, _jquery.default)('<span> ' + symbol + '</span>').appendTo(el);
      (0, _jquery.default)('<span> (' + reading + ') </span>').appendTo(el);
      (0, _jquery.default)('<span> </span>').appendTo(el);
      (0, _jquery.default)("<div class=\"kan-container\">\n                     <div class=\"kan-reading\">" + reading + "</div>\n                     <div class=\"kan-symbol\">" + symbol + "</div>\n                     <div class=\"kan-word\">" + word + "</div>\n                 </div>").insertAfter(el);
    } else {
      (0, _jquery.default)('<span>' + wordsUpper[i] + '</span>').appendTo(el);
      (0, _jquery.default)('<span> </span>').appendTo(el);
    }
  });
});
console.log("Kanject: Scan complete");
},{"jquery":"../node_modules/jquery/dist/jquery.js","./Components/Utils":"Components/Utils.js","./data/kanji.json":"data/kanji.json"}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49160" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","content.js"], null)