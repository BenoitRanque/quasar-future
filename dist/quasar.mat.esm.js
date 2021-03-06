/*!
 * Quasar Framework v0.15.0
 * (c) 2016-present Razvan Stoenescu
 * Released under the MIT License.
 */
var version = "0.15.0";

function offset (el) {
  if (el === window) {
    return {top: 0, left: 0}
  }
  var ref = el.getBoundingClientRect();
  var top = ref.top;
  var left = ref.left;

  return {top: top, left: left}
}

function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

function height (el) {
  if (el === window) {
    return viewport().height
  }
  return parseFloat(style(el, 'height'))
}

function width (el) {
  if (el === window) {
    return viewport().width
  }
  return parseFloat(style(el, 'width'))
}

function css (element, css) {
  var style = element.style;

  Object.keys(css).forEach(function (prop) {
    style[prop] = css[prop];
  });
}

function viewport () {
  var
    e = window,
    a = 'inner';

  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  }
}

function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState === 'complete') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false);
}

var prefix = ['-webkit-', '-moz-', '-ms-', '-o-'];
function cssTransform (val) {
  var o = {transform: val};
  prefix.forEach(function (p) {
    o[p + 'transform'] = val;
  });
  return o
}


var dom = Object.freeze({
	offset: offset,
	style: style,
	height: height,
	width: width,
	css: css,
	viewport: viewport,
	ready: ready,
	cssTransform: cssTransform
});

/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-operators */

function getUserAgent () {
  return (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
}

function getMatch (userAgent, platformMatch) {
  var match = /(edge)\/([\w.]+)/.exec(userAgent) ||
    /(opr)[\/]([\w.]+)/.exec(userAgent) ||
    /(vivaldi)[\/]([\w.]+)/.exec(userAgent) ||
    /(chrome)[\/]([\w.]+)/.exec(userAgent) ||
    /(iemobile)[\/]([\w.]+)/.exec(userAgent) ||
    /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+)/.exec(userAgent) ||
    /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent) ||
    /(msie) ([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) ||
    [];

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    versionNumber: match[4] || match[2] || '0',
    platform: platformMatch[0] || ''
  }
}

function getPlatformMatch (userAgent) {
  return /(ipad)/.exec(userAgent) ||
    /(ipod)/.exec(userAgent) ||
    /(windows phone)/.exec(userAgent) ||
    /(iphone)/.exec(userAgent) ||
    /(kindle)/.exec(userAgent) ||
    /(silk)/.exec(userAgent) ||
    /(android)/.exec(userAgent) ||
    /(win)/.exec(userAgent) ||
    /(mac)/.exec(userAgent) ||
    /(linux)/.exec(userAgent) ||
    /(cros)/.exec(userAgent) ||
    /(playbook)/.exec(userAgent) ||
    /(bb)/.exec(userAgent) ||
    /(blackberry)/.exec(userAgent) ||
    []
}

function getPlatform () {
  var
    userAgent = getUserAgent(),
    platformMatch = getPlatformMatch(userAgent),
    matched = getMatch(userAgent, platformMatch),
    browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
    browser.ipod || browser.kindle || browser.playbook || browser.silk || browser['windows phone']) {
    browser.mobile = true;
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }

  if (browser['windows phone']) {
    browser.winphone = true;
    delete browser['windows phone'];
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if (browser.rv || browser.iemobile) {
    matched.browser = 'ie';
    browser.ie = true;
  }

  // Edge is officially known as Microsoft Edge, so rewrite the key to match
  if (browser.edge) {
    matched.browser = 'edge';
    browser.edge = true;
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if (browser.safari && browser.blackberry || browser.bb) {
    matched.browser = 'blackberry';
    browser.blackberry = true;
  }

  // Playbook browsers are marked as Safari on Playbook
  if (browser.safari && browser.playbook) {
    matched.browser = 'playbook';
    browser.playbook = true;
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera';
    browser.opera = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    matched.browser = 'android';
    browser.android = true;
  }

  // Kindle browsers are marked as Safari on Kindle
  if (browser.safari && browser.kindle) {
    matched.browser = 'kindle';
    browser.kindle = true;
  }

  // Kindle Silk browsers are marked as Safari on Kindle
  if (browser.safari && browser.silk) {
    matched.browser = 'silk';
    browser.silk = true;
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi';
    browser.vivaldi = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;

  if (window && window.process && window.process.versions && window.process.versions.electron) {
    browser.electron = true;
  }
  else if (document.location.href.indexOf('chrome-extension://') === 0) {
    browser.chromeExt = true;
  }
  else if (
    window._cordovaNative ||
    window.cordova ||
    document.location.href.indexOf('http://') === -1
  ) {
    browser.cordova = true;
  }

  return browser
}

var Platform = {
  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;

    if (this.__installed) { return }
    this.__installed = true;

    Platform.is = getPlatform();
    Platform.has = {
      touch: (function () { return !!('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints > 0; })()
    };
    Platform.within = {
      iframe: window.self !== window.top
    };

    $q.platform = Platform;
  }
};

var History = {
  __history: [],
  add: function () {},
  remove: function () {},

  __installed: false,
  install: function install () {
    var this$1 = this;

    if (this.__installed || !Platform.is.cordova) {
      return
    }

    this.__installed = true;
    this.add = function (definition) {
      this$1.__history.push(definition);
    };
    this.remove = function (definition) {
      var index = this$1.__history.indexOf(definition);
      if (index >= 0) {
        this$1.__history.splice(index, 1);
      }
    };

    document.addEventListener('deviceready', function () {
      document.addEventListener('backbutton', function () {
        if (this$1.__history.length) {
          this$1.__history.pop().handler();
        }
        else {
          window.history.back();
        }
      }, false);
    });
  }
};

/* eslint-disable no-extend-native, one-var, no-self-compare */

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchEl, startFrom) {
    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false
    }
    var n = parseInt(startFrom, 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    }
    else {
      k = len + n;
      if (k < 0) { k = 0; }
    }
    var curEl;
    while (k < len) {
      curEl = O[k];
      if (searchEl === curEl ||
         (searchEl !== searchEl && curEl !== curEl)) { // NaN !== NaN
        return true
      }
      k++;
    }
    return false
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str, position) {
    position = position || 0;
    return this.substr(position, str.length) === str
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (str, position) {
    var subjectString = this.toString();

    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= str.length;

    var lastIndex = subjectString.indexOf(str, position);

    return lastIndex !== -1 && lastIndex === position
  };
}

if (typeof Element.prototype.matches !== 'function') {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches (selector) {
    var
      element = this,
      elements = (element.document || element.ownerDocument).querySelectorAll(selector),
      index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return Boolean(elements[index])
  };
}

if (typeof Element.prototype.closest !== 'function') {
  Element.prototype.closest = function closest (selector) {
    var el = this;
    while (el && el.nodeType === 1) {
      if (el.matches(selector)) {
        return el
      }
      el = el.parentNode;
    }
    return null
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function value (predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined')
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }

      var value;
      var
        list = Object(this),
        length = list.length >>> 0,
        thisArg = arguments[1];

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value
        }
      }
      return undefined
    }
  });
}

var langEn = {
  lang: 'en-us',
  label: {
    clear: 'Clear',
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    set: 'Set',
    select: 'Select',
    reset: 'Reset',
    remove: 'Remove',
    update: 'Update',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh'
  },
  date: {
    days: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    daysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: false
  },
  pullToRefresh: {
    pull: 'Pull down to refresh',
    release: 'Release to refresh',
    refresh: 'Refreshing...'
  },
  table: {
    noData: 'No data available',
    noResults: 'No matching records found',
    loader: 'Loading...',
    selectedRows: function (rows) { return rows > 1 ? (rows + " selected row(s).") : ((rows === 0 ? 'No' : '1') + " selected rows."); },
    rowsPerPage: 'Rows per page:',
    allRows: 'All',
    pagination: function (start, end, total) { return (start + "-" + end + " of " + total); },
    columns: 'Columns'
  },
  editor: {
    url: 'URL',
    bold: 'Bold',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    underline: 'Underline',
    unorderedList: 'Unordered List',
    orderedList: 'Ordered List',
    subscript: 'Subscript',
    superscript: 'Superscript',
    hyperlink: 'Hyperlink',
    toggleFullscreen: 'Toggle Fullscreen',
    quote: 'Quote',
    left: 'Left align',
    center: 'Center align',
    right: 'Right align',
    justify: 'Justify align',
    print: 'Print',
    outdent: 'Decrease indentation',
    indent: 'Increase indentation',
    removeFormat: 'Remove formatting',
    formatting: 'Formatting',
    fontSize: 'Font Size',
    align: 'Align',
    hr: 'Insert Horizontal Rule',
    undo: 'Undo',
    redo: 'Redo',
    header1: 'Header 1',
    header2: 'Header 2',
    header3: 'Header 3',
    header4: 'Header 4',
    header5: 'Header 5',
    header6: 'Header 6',
    paragraph: 'Paragraph',
    code: 'Code',
    size1: 'Very small',
    size2: 'A bit small',
    size3: 'Normal',
    size4: 'Medium-large',
    size5: 'Big',
    size6: 'Very big',
    size7: 'Maximum',
    defaultFont: 'Default Font'
  }
};

var i18n = {
  __installed: false,
  install: function install (ref) {
    var this$1 = this;
    var $q = ref.$q;
    var Vue = ref.Vue;
    var lang = ref.lang;

    if (this.__installed) { return }
    this.__installed = true;

    this.set = function (lang) {
      if ( lang === void 0 ) lang = langEn;

      lang.set = this$1.set;

      Vue.set($q, 'i18n', lang);
      this$1.name = lang.lang;
      this$1.lang = lang;
    };

    this.set(lang);
  }
};

function addBodyClasses () {
  var cls = [
    "mat",
    Platform.is.desktop ? 'desktop' : 'mobile',
    Platform.has.touch ? 'touch' : 'no-touch',
    ("platform-" + (Platform.is.ios ? 'ios' : 'mat'))
  ];

  Platform.within.iframe && cls.push('within-iframe');
  Platform.is.cordova && cls.push('cordova');
  Platform.is.electron && cls.push('electron');

  document.body.classList.add.apply(document.body.classList, cls);
}

var install = function (_Vue, opts) {
  if ( opts === void 0 ) opts = {};

  if (this.__installed) {
    return
  }
  this.__installed = true;

  var $q = {
    version: version,
    theme: "mat"
  };

  // required plugins
  Platform.install({ $q: $q });
  History.install();
  i18n.install({ $q: $q, Vue: _Vue, lang: opts.i18n });

  // inject body classes
  ready(addBodyClasses);

  if (opts.directives) {
    Object.keys(opts.directives).forEach(function (key) {
      var d = opts.directives[key];
      if (d.name !== undefined && !d.name.startsWith('q-')) {
        _Vue.directive(d.name, d);
      }
    });
  }

  if (opts.components) {
    Object.keys(opts.components).forEach(function (key) {
      var c = opts.components[key];
      if (c.name !== undefined && c.name.startsWith('q-')) {
        _Vue.component(c.name, c);
      }
    });
  }

  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(function (key) {
      var p = opts.plugins[key];
      if (typeof p.install === 'function') {
        p.install({ $q: $q, Vue: _Vue });
      }
    });
  }

  _Vue.prototype.$q = $q;
};

var QApp = {
  name: 'q-app',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass;

    data.staticClass = "q-app" + (classes ? (" " + classes) : '');
    return h('div', data, ctx.children)
  }
};

var handlers = [];

var EscapeKey = {
  __installed: false,
  __install: function __install () {
    this.__installed = true;
    window.addEventListener('keyup', function (evt) {
      if (handlers.length === 0) {
        return
      }

      if (evt.which === 27 || evt.keyCode === 27) {
        handlers[handlers.length - 1]();
      }
    });
  },

  register: function register (handler) {
    if (Platform.is.desktop) {
      if (!this.__installed) {
        this.__install();
      }

      handlers.push(handler);
    }
  },

  pop: function pop () {
    if (Platform.is.desktop) {
      handlers.pop();
    }
  }
};

var toString = Object.prototype.toString;
var hasOwn = Object.prototype.hasOwnProperty;
var class2type = {};

'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(function (name) {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

function type (obj) {
  return obj === null ? String(obj) : class2type[toString.call(obj)] || 'object'
}

function isPlainObject (obj) {
  if (!obj || type(obj) !== 'object') {
    return false
  }

  if (obj.constructor &&
    !hasOwn.call(obj, 'constructor') &&
    !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  var key;
  for (key in obj) {}

  return key === undefined || hasOwn.call(obj, key)
}

function extend () {
  var arguments$1 = arguments;

  var
    options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }

  if (Object(target) !== target && type(target) !== 'function') {
    target = {};
  }

  if (length === i) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    if ((options = arguments$1[i]) !== null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = type(copy) === 'array'))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && type(src) === 'array' ? src : [];
          }
          else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target
}

// Needs:
// __show()
// __hide()
// Calling this.showPromiseResolve, this.hidePromiseResolve
// avoid backbutton with setting noShowingHistory
var ModelToggleMixin = {
  props: {
    value: Boolean
  },
  data: function data () {
    return {
      showing: false
    }
  },
  watch: {
    value: function value (val) {
      var this$1 = this;

      if (this.disable && val) {
        this.$emit('input', false);
        return
      }

      this.$nextTick(function () {
        if (this$1.value !== this$1.showing) {
          this$1[val ? 'show' : 'hide']();
        }
      });
    }
  },
  methods: {
    toggle: function toggle (evt) {
      if (!this.disable) {
        return this[this.showing ? 'hide' : 'show'](evt)
      }
    },
    show: function show (evt) {
      var this$1 = this;

      if (this.disable) {
        return Promise.reject(new Error())
      }

      if (this.showing) {
        return this.showPromise || Promise.resolve(evt)
      }

      if (this.hidePromise) {
        this.hidePromiseReject();
      }

      this.showing = true;
      if (this.value === false) {
        this.$emit('input', true);
      }

      if (this.$options.modelToggle === void 0 || this.$options.modelToggle.history) {
        this.__historyEntry = {
          handler: this.hide
        };
        History.add(this.__historyEntry);
      }

      if (!this.__show) {
        this.$emit('show');
        return Promise.resolve(evt)
      }

      this.showPromise = new Promise(function (resolve, reject) {
        this$1.showPromiseResolve = function () {
          this$1.showPromise = null;
          this$1.$emit('show');
          resolve(evt);
        };
        this$1.showPromiseReject = function () {
          this$1.showPromise = null;
          reject(new Error());
        };
      });

      this.__show(evt);
      return this.showPromise || Promise.resolve(evt)
    },
    hide: function hide (evt) {
      var this$1 = this;

      if (this.disable) {
        return Promise.reject(new Error())
      }

      if (!this.showing) {
        return this.hidePromise || Promise.resolve(evt)
      }

      if (this.showPromise) {
        this.showPromiseReject();
      }

      this.showing = false;
      if (this.value === true) {
        this.$emit('input', false);
      }

      if (this.__historyEntry) {
        History.remove(this.__historyEntry);
        this.__historyEntry = null;
      }

      if (!this.__hide) {
        this.$emit('hide');
        return Promise.resolve()
      }

      this.hidePromise = new Promise(function (resolve, reject) {
        this$1.hidePromiseResolve = function () {
          this$1.hidePromise = null;
          this$1.$emit('hide');
          resolve();
        };
        this$1.hidePromiseReject = function () {
          this$1.hidePromise = null;
          reject(new Error());
        };
      });

      this.__hide(evt);
      return this.hidePromise || Promise.resolve(evt)
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.showing) {
      this.showPromise && this.showPromiseReject();
      this.hidePromise && this.hidePromiseReject();
      this.$emit('input', false);
      this.__hide && this.__hide();
    }
  }
};

/*
 * Also import the necessary CSS into the app.
 *
 * Example:
 * import 'quasar-extras/animate/bounceInLeft.css'
 */

var QTransition = {
  name: 'q-transition',
  functional: true,
  props: {
    name: String,
    enter: String,
    leave: String,
    group: Boolean
  },
  render: function render (h, ctx) {
    var
      prop = ctx.props,
      data = ctx.data;

    if (prop.name) {
      data.props = {
        name: prop.name
      };
    }
    else if (prop.enter && prop.leave) {
      data.props = {
        enterActiveClass: ("animated " + (prop.enter)),
        leaveActiveClass: ("animated " + (prop.leave))
      };
    }
    else {
      return ctx.children
    }

    return h(("transition" + (ctx.props.group ? '-group' : '')), data, ctx.children)
  }
};

var positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
};
var positionCSS = {
    maxHeight: '80vh',
    height: 'auto'
  };

function additionalCSS (position) {
  var css = {};

  if (['left', 'right'].includes(position)) {
    css.maxWidth = '90vw';
  }
  return css
}

var openedModalNumber = 0;

var QModal = {
  name: 'q-modal',
  mixins: [ModelToggleMixin],
  props: {
    position: {
      type: String,
      default: '',
      validator: function validator (val) {
        return val === '' || ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },
    transition: String,
    enterClass: String,
    leaveClass: String,
    positionClasses: {
      type: String,
      default: 'flex-center'
    },
    contentClasses: [Object, Array, String],
    contentCss: [Object, Array, String],
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    },
    minimized: Boolean,
    maximized: Boolean
  },
  watch: {
    $route: function $route () {
      this.hide();
    }
  },
  computed: {
    modalClasses: function modalClasses () {
      var cls = this.position
        ? positions[this.position]
        : this.positionClasses;
      if (this.maximized) {
        return ['maximized', cls]
      }
      else if (this.minimized) {
        return ['minimized', cls]
      }
      return cls
    },
    modalTransition: function modalTransition () {
      if (this.position) {
        return ("q-modal-" + (this.position))
      }
      if (this.enterClass === void 0 && this.leaveClass === void 0) {
        return this.transition || 'q-modal'
      }
    },
    modalCss: function modalCss () {
      if (this.position) {
        var css = Array.isArray(this.contentCss)
          ? this.contentCss
          : [this.contentCss];

        css.unshift(extend(
          {},
          positionCSS,
          additionalCSS(this.position)
        ));

        return css
      }

      return this.contentCss
    }
  },
  methods: {
    __dismiss: function __dismiss () {
      var this$1 = this;

      if (this.noBackdropDismiss) {
        return
      }
      this.hide().then(function () {
        this$1.$emit('dismiss');
      });
    },
    __show: function __show () {
      var this$1 = this;

      var body = document.body;

      body.appendChild(this.$el);
      body.classList.add('with-modal');

      EscapeKey.register(function () {
        if (!this$1.noEscDismiss) {
          this$1.hide().then(function () {
            this$1.$emit('escape-key');
          });
        }
      });

      openedModalNumber++;

      var content = this.$refs.content;
      content.scrollTop = 0
      ;['modal-scroll', 'layout-view'].forEach(function (c) {
        [].slice.call(content.getElementsByClassName(c)).forEach(function (el) {
          el.scrollTop = 0;
        });
      });
    },
    __hide: function __hide () {
      EscapeKey.pop();
      openedModalNumber--;

      if (openedModalNumber === 0) {
        var body = document.body;

        body.classList.remove('with-modal');
        body.style.paddingRight = this.bodyPadding;
      }
    }
  },
  mounted: function mounted () {
    if (this.value) {
      this.show();
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  render: function render (h) {
    var this$1 = this;

    return h(QTransition, {
      props: {
        name: this.modalTransition,
        enter: this.enterClass,
        leave: this.leaveClass
      },
      on: {
        afterEnter: function () {
          this$1.showPromise && this$1.showPromiseResolve();
        },
        enterCancelled: function () {
          this$1.showPromise && this$1.showPromiseReject();
        },
        afterLeave: function () {
          this$1.hidePromise && this$1.hidePromiseResolve();
        },
        leaveCancelled: function () {
          this$1.hidePromise && this$1.hidePromiseReject();
        }
      }
    }, [
      h('div', {
        staticClass: 'modal fullscreen row',
        'class': this.modalClasses,
        on: {
          click: this.__dismiss
        },
        directives: [{
          name: 'show',
          value: this.showing
        }]
      }, [
        h('div', {
          ref: 'content',
          staticClass: 'modal-content scroll',
          style: this.modalCss,
          'class': this.contentClasses,
          on: {
            click: function click (e) {
              e.stopPropagation();
            },
            touchstart: function touchstart (e) {
              e.stopPropagation();
            }
          }
        }, [ this.$slots.default ])
      ])
    ])
  }
};

var QModalLayout = {
  name: 'q-modal-layout',
  functional: true,
  props: {
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],

    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],

    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
  },
  render: function render (h, ctx) {
    var
      child = [],
      props = ctx.props,
      slots = ctx.slots();

    if (slots.header || ("mat" !== 'ios' && slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-header',
        style: props.headerStyle,
        'class': props.headerClass
      }, [
        slots.header,
        slots.navigation
      ]));
    }

    child.push(h('div', {
      staticClass: 'q-modal-layout-content col scroll',
      style: props.contentStyle,
      'class': props.contentClass
    }, [
      slots.default
    ]));

    if (slots.footer || ("mat" === 'ios' && slots.navigation)) {
      child.push(h('div', {
        staticClass: 'q-layout-footer',
        style: props.footerStyle,
        'class': props.footerClass
      }, [
        slots.footer,
        null
      ]));
    }

    return h('div', {
      staticClass: 'q-modal-layout column absolute-full'
    }, child)
  }
};

var QIcon = {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String,
    size: String
  },
  render: function render (h, ctx) {
    var name, text;
    var
      prop = ctx.props,
      data = ctx.data,
      cls = ctx.data.staticClass,
      icon = prop.mat && "mat" === 'mat'
        ? prop.mat
        : (prop.ios && "mat" === 'ios' ? prop.ios : ctx.props.name);

    if (!icon) {
      name = '';
    }
    else if (icon.startsWith('fa-')) {
      name = "fa " + icon;
    }
    else if (icon.startsWith('bt-')) {
      name = "bt " + icon;
    }
    else if (icon.startsWith('ion-') || icon.startsWith('icon-')) {
      name = "" + icon;
    }
    else if (icon.startsWith('mdi-')) {
      name = "mdi " + icon;
    }
    else {
      name = 'material-icons';
      text = icon.replace(/ /g, '_');
    }

    data.staticClass = (cls ? cls + ' ' : '') + "q-icon" + (name.length ? (" " + name) : '') + (prop.color ? (" text-" + (prop.color)) : '');

    if (!data.hasOwnProperty('attrs')) {
      data.attrs = {};
    }
    data.attrs['aria-hidden'] = 'true';

    if (prop.size) {
      var style = "font-size: " + (prop.size) + ";";
      data.style = data.style
        ? [data.style, style]
        : style;
    }

    return h('i', data, text ? [text, ctx.children] : [' ', ctx.children])
  }
};

function textStyle (n) {
  return n === void 0 || n < 2
    ? {}
    : {overflow: 'hidden', display: '-webkit-box', '-webkit-box-orient': 'vertical', '-webkit-line-clamp': n}
}

var list = ['icon', 'label', 'sublabel', 'image', 'avatar', 'letter', 'stamp'];

function getType (prop) {
  var len = list.length;
  for (var i = 0; i < len; i++) {
    if (prop[list[i]]) {
      return list[i]
    }
  }
  return ''
}

function itemClasses (prop) {
  return {
    'q-item': true,
    'q-item-division': true,
    'relative-position': true,
    'q-item-dark': prop.dark,
    'q-item-dense': prop.dense,
    'q-item-sparse': prop.sparse,
    'q-item-separator': prop.separator,
    'q-item-inset-separator': prop.insetSeparator,
    'q-item-multiline': prop.multiline,
    'q-item-highlight': prop.highlight,
    'q-item-link': prop.to || prop.link
  }
}

var ItemMixin = {
  props: {
    dark: Boolean,
    dense: Boolean,
    sparse: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    multiline: Boolean,
    highlight: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  }
};

var routerLinkEventName = 'qrouterlinkclick';

var evt;

try {
  evt = new Event(routerLinkEventName);
}
catch (e) {
  // IE doesn't support `new Event()`, so...`
  evt = document.createEvent('Event');
  evt.initEvent(routerLinkEventName, true, false);
}

var RouterLinkMixin = {
  props: {
    to: [String, Object],
    exact: Boolean,
    append: Boolean,
    replace: Boolean
  },
  data: function data () {
    return {
      routerLinkEventName: routerLinkEventName
    }
  }
};

var QItem = {
  name: 'q-item',
  functional: true,
  mixins: [ItemMixin, {props: RouterLinkMixin.props}],
  props: {
    active: Boolean,
    link: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = itemClasses(prop);

    if (prop.to !== void 0) {
      data.props = prop;
    }
    else {
      cls.active = prop.active;
    }

    data.class = data.class ? [data.class, cls] : cls;

    return h(prop.to ? 'router-link' : prop.tag, data, ctx.children)
  }
};

var QItemSeparator = {
  name: 'q-item-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass;

    data.staticClass = "q-item-separator-component" + (ctx.props.inset ? ' q-item-separator-inset-component' : '') + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

function text (h, name, val, n) {
  n = parseInt(n, 10);
  return h('div', {
    staticClass: ("q-item-" + name + (n === 1 ? ' ellipsis' : '')),
    style: textStyle(n),
    domProps: { innerHTML: val }
  })
}

var QItemMain = {
  name: 'q-item-main',
  functional: true,
  props: {
    label: String,
    labelLines: [String, Number],
    sublabel: String,
    sublabelLines: [String, Number],
    inset: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props,
      child = [];

    if (prop.label) {
      child.push(text(h, 'label', prop.label, prop.labelLines));
    }
    if (prop.sublabel) {
      child.push(text(h, 'sublabel', prop.sublabel, prop.sublabelLines));
    }

    child.push(ctx.children);
    data.staticClass = "q-item-main q-item-section" + (prop.inset ? ' q-item-main-inset' : '') + (classes ? (" " + classes) : '');

    return h(prop.tag, data, child)
  }
};

var QItemSide = {
  name: 'q-item-side',
  functional: true,
  props: {
    right: Boolean,

    icon: String,
    inverted: Boolean,

    avatar: String,
    letter: {
      type: String,
      validator: function (v) { return v.length === 1; }
    },
    image: String,
    stamp: String,

    color: String,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass;

    data.staticClass = "q-item-side q-item-side-" + (prop.right ? 'right' : 'left') + " q-item-section" + (prop.color ? (" text-" + (prop.color)) : '') + (cls ? (" " + cls) : '');

    if (prop.image) {
      if (!data.hasOwnProperty('attrs')) {
        data.attrs = {};
      }
      data.attrs.src = prop.image;
      data.staticClass += ' q-item-image';
      return h('img', data)
    }

    var child = [];

    if (prop.stamp) {
      child.push(h('div', {
        staticClass: 'q-item-stamp',
        domProps: {
          innerHTML: prop.stamp
        }
      }));
    }
    if (prop.icon) {
      child.push(h(QIcon, {
        props: { name: prop.icon },
        staticClass: 'q-item-icon',
        class: { 'q-item-icon-inverted': prop.inverted }
      }));
    }
    if (prop.avatar) {
      child.push(h('img', {
        attrs: { src: prop.avatar },
        staticClass: 'q-item-avatar'
      }));
    }
    if (prop.letter) {
      child.push(h(
        'div',
        { staticClass: 'q-item-letter' },
        prop.letter
      ));
    }

    child.push(ctx.children);
    return h(prop.tag, data, child)
  }
};

var QItemTile = {
  name: 'q-item-tile',
  functional: true,
  props: {
    icon: String,
    inverted: Boolean,

    image: Boolean,
    avatar: Boolean,
    letter: Boolean,
    stamp: Boolean,

    label: Boolean,
    sublabel: Boolean,
    lines: [Number, String],

    color: String,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      type = getType(prop),
      icon = prop.icon || prop.invertedIcon;

    data.staticClass = "q-item-" + type + (prop.color ? (" text-" + (prop.color)) : '') + (cls ? (" " + cls) : '');

    if (icon) {
      data.props = { name: icon };
      if (prop.inverted) {
        data.staticClass += ' q-item-icon-inverted';
      }
      return h(QIcon, data, ctx.children)
    }
    if ((prop.label || prop.sublabel) && prop.lines) {
      if (prop.lines === '1' || prop.lines === 1) {
        data.staticClass += ' ellipsis';
      }
      data.style = [data.style, textStyle(prop.lines)];
    }

    return h(prop.tag, data, ctx.children)
  }
};

function push (child, h, name, slot, replace, conf) {
  var defaultProps = { props: { right: conf.right } };

  if (slot && replace) {
    child.push(h(name, defaultProps, slot));
    return
  }

  var v = false;
  for (var p in conf) {
    if (conf.hasOwnProperty(p)) {
      v = conf[p];
      if (v !== void 0 && v !== true) {
        child.push(h(name, { props: conf }));
        break
      }
    }
  }

  slot && child.push(h(name, defaultProps, slot));
}

var QItemWrapper = {
  name: 'q-item-wrapper',
  functional: true,
  props: {
    cfg: {
      type: Object,
      default: function () { return ({}); }
    },
    slotReplace: Boolean
  },
  render: function render (h, ctx) {
    var
      cfg = ctx.props.cfg,
      replace = ctx.props.slotReplace,
      slot = ctx.slots(),
      child = [];

    push(child, h, QItemSide, slot.left, replace, {
      icon: cfg.icon,
      color: cfg.leftColor,
      avatar: cfg.avatar,
      letter: cfg.letter,
      image: cfg.image
    });

    push(child, h, QItemMain, slot.main, replace, {
      label: cfg.label,
      sublabel: cfg.sublabel,
      labelLines: cfg.labelLines,
      sublabelLines: cfg.sublabelLines,
      inset: cfg.inset
    });

    push(child, h, QItemSide, slot.right, replace, {
      right: true,
      icon: cfg.rightIcon,
      color: cfg.rightColor,
      avatar: cfg.rightAvatar,
      letter: cfg.rightLetter,
      image: cfg.rightImage,
      stamp: cfg.stamp
    });

    if (slot.default) {
      child.push(slot.default);
    }

    ctx.data.props = cfg;
    return h(QItem, ctx.data, child)
  }
};

var QList = {
  name: 'q-list',
  functional: true,
  props: {
    noBorder: Boolean,
    dark: Boolean,
    dense: Boolean,
    sparse: Boolean,
    striped: Boolean,
    stripedOdd: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    multiline: Boolean,
    highlight: Boolean,
    link: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props;

    data.class = {
      'q-list': true,
      'no-border': prop.noBorder,
      'q-list-dark': prop.dark,
      'q-list-dense': prop.dense,
      'q-list-sparse': prop.sparse,
      'q-list-striped': prop.striped,
      'q-list-striped-odd': prop.stripedOdd,
      'q-list-separator': prop.separator,
      'q-list-inset-separator': prop.insetSeparator,
      'q-list-multiline': prop.multiline,
      'q-list-highlight': prop.highlight,
      'q-list-link': prop.link
    };

    return h(
      'div',
      data,
      ctx.children
    )
  }
};

var QListHeader = {
  name: 'q-list-header',
  functional: true,
  props: {
    inset: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      prop = ctx.props;

    data.staticClass = "q-list-header " + (prop.inset ? ' q-list-header-inset' : '') + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

var QActionSheet = {
  name: 'q-action-sheet',
  props: {
    value: Boolean,
    title: String,
    grid: Boolean,
    actions: Array,
    dismissLabel: String
  },
  computed: {
    contentCss: function contentCss () {
      
    }
  },
  render: function render (h) {
    var this$1 = this;

    var
      child = [],
      title = this.$slots.title || this.title;

    if (title) {
      child.push(
        h('div', {
          staticClass: 'q-actionsheet-title column justify-center'
        }, [ title ])
      );
    }

    child.push(
      h(
        'div',
        { staticClass: 'q-actionsheet-body scroll' },
        this.actions
          ? [
            this.grid
              ? h('div', { staticClass: 'q-actionsheet-grid row wrap items-center justify-between' }, this.__getActions(h))
              : h(QList, { staticClass: 'no-border', props: { link: true } }, this.__getActions(h))
          ]
          : [ this.$slots.default ]
      )
    );

    return h(QModal, {
      ref: 'modal',
      props: {
        value: this.value,
        position: 'bottom',
        contentCss: this.contentCss
      },
      on: {
        input: function (val) {
          this$1.$emit('input', val);
        },
        show: function () {
          this$1.$emit('show');
        },
        hide: function () {
          this$1.$emit('hide');
        },
        dismiss: function () {
          this$1.__onCancel();
        },
        'escape-key': function () {
          this$1.hide().then(function () {
            this$1.$emit('escape-key');
            this$1.__onCancel();
          });
        }
      }
    }, child)
  },
  methods: {
    show: function show () {
      return this.$refs.modal.show()
    },
    hide: function hide () {
      return this.$refs.modal.hide()
    },
    __getActions: function __getActions (h) {
      var this$1 = this;

      return this.actions.map(function (action) { return action.label
        ? h(this$1.grid ? 'div' : QItem, {
          staticClass: this$1.grid
            ? 'q-actionsheet-grid-item cursor-pointer relative-position column inline flex-center'
            : null,
          'class': action.classes,
          domProps: { tabindex: '0' },
          on: {
            click: function () { return this$1.__onOk(action); },
            keydown: function (e) { return this$1.__onOk(action); }
          }
        }, this$1.grid
          ? [
            action.icon ? h(QIcon, { props: { name: action.icon, color: action.color } }) : null,
            action.avatar ? h('img', { domProps: { src: action.avatar }, staticClass: 'avatar' }) : null,
            h('span', [ action.label ])
          ]
          : [
            h(QItemSide, { props: { icon: action.icon, color: action.color, avatar: action.avatar } }),
            h(QItemMain, { props: { inset: true, label: action.label } })
          ]
        )
        : h(QItemSeparator, { staticClass: 'col-12' }); }
      )
    },
    __onOk: function __onOk (action) {
      var this$1 = this;

      this.hide().then(function () {
        this$1.$emit('ok', action);
      });
    },
    __onCancel: function __onCancel () {
      var this$1 = this;

      this.hide().then(function () {
        this$1.$emit('cancel');
      });
    }
  }
};

var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];

function humanStorageSize (bytes) {
  var u = 0;

  while (Math.abs(bytes) >= 1024 && u < units.length - 1) {
    bytes /= 1024;
    ++u;
  }

  return ((bytes.toFixed(1)) + " " + (units[u]))
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function between (v, min, max) {
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, v))
}

function normalizeToInterval (v, min, max) {
  if (max <= min) {
    return min
  }

  var size = (max - min + 1);

  var index = v % size;
  if (index < min) {
    index = size + index;
  }

  return index
}

function pad (v, length, char) {
  if ( length === void 0 ) length = 2;
  if ( char === void 0 ) char = '0';

  var val = '' + v;
  return val.length >= length
    ? val
    : new Array(length - val.length + 1).join(char) + val
}


var format = Object.freeze({
	humanStorageSize: humanStorageSize,
	capitalize: capitalize,
	between: between,
	normalizeToInterval: normalizeToInterval,
	pad: pad
});

var xhr = XMLHttpRequest;
var send = xhr.prototype.send;

function translate (ref) {
  var p = ref.p;
  var pos = ref.pos;
  var active = ref.active;
  var horiz = ref.horiz;
  var reverse = ref.reverse;

  var x = 1, y = 1;

  if (horiz) {
    if (reverse) { x = -1; }
    if (pos === 'bottom') { y = -1; }
    return cssTransform(("translate3d(" + (x * (p - 100)) + "%, " + (active ? 0 : y * -200) + "%, 0)"))
  }

  if (reverse) { y = -1; }
  if (pos === 'right') { x = -1; }
  return cssTransform(("translate3d(" + (active ? 0 : x * -200) + "%, " + (y * (p - 100)) + "%, 0)"))
}

function inc (p, amount) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * (5 - 3 + 1) + 3;
    }
    else if (p < 65) {
      amount = Math.random() * 3;
    }
    else if (p < 85) {
      amount = Math.random() * 2;
    }
    else if (p < 99) {
      amount = 0.5;
    }
    else {
      amount = 0;
    }
  }
  return between(p + amount, 0, 100)
}

function highjackAjax (startHandler, endHandler) {
  xhr.prototype.send = function () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    startHandler();

    this.addEventListener('abort', endHandler, false);
    this.addEventListener('readystatechange', function () {
      if (this$1.readyState === 4) {
        endHandler();
      }
    }, false);

    send.apply(this, args);
  };
}

function restoreAjax () {
  xhr.prototype.send = send;
}

var QAjaxBar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-loading-bar shadow-1",class:[_vm.position, _vm.animate ? '' : 'no-transition'],style:(_vm.containerStyle)},[_c('div',{staticClass:"q-loading-bar-inner",class:("bg-" + (_vm.color))})])},staticRenderFns: [],
  name: 'q-ajax-bar',
  props: {
    position: {
      type: String,
      default: 'top',
      validator: function validator (val) {
        return ['top', 'right', 'bottom', 'left'].includes(val)
      }
    },
    size: {
      type: String,
      default: '4px'
    },
    color: {
      type: String,
      default: 'red'
    },
    speed: {
      type: Number,
      default: 250
    },
    delay: {
      type: Number,
      default: 1000
    },
    reverse: Boolean
  },
  data: function data () {
    return {
      animate: false,
      active: false,
      progress: 0,
      calls: 0
    }
  },
  computed: {
    containerStyle: function containerStyle () {
      var o = translate({
        p: this.progress,
        pos: this.position,
        active: this.active,
        horiz: this.horizontal,
        reverse: this.reverse
      });
      o[this.sizeProp] = this.size;
      return o
    },
    horizontal: function horizontal () {
      return this.position === 'top' || this.position === 'bottom'
    },
    sizeProp: function sizeProp () {
      return this.horizontal ? 'height' : 'width'
    }
  },
  methods: {
    start: function start () {
      var this$1 = this;

      this.calls++;
      if (!this.active) {
        this.progress = 0;
        this.active = true;
        this.animate = false;
        this.$emit('start');
        this.timer = setTimeout(function () {
          this$1.animate = true;
          this$1.move();
        }, this.delay);
      }
      else if (this.closing) {
        this.closing = false;
        clearTimeout(this.timer);
        this.progress = 0;
        this.move();
      }
    },
    increment: function increment (amount) {
      if (this.active) {
        this.progress = inc(this.progress, amount);
      }
    },
    stop: function stop () {
      var this$1 = this;

      this.calls = Math.max(0, this.calls - 1);
      if (this.calls > 0) {
        return
      }

      clearTimeout(this.timer);

      if (!this.animate) {
        this.active = false;
        return
      }
      this.closing = true;
      this.progress = 100;
      this.$emit('stop');
      this.timer = setTimeout(function () {
        this$1.closing = false;
        this$1.active = false;
      }, 1050);
    },
    move: function move () {
      var this$1 = this;

      this.timer = setTimeout(function () {
        this$1.increment();
        this$1.move();
      }, this.speed);
    }
  },
  mounted: function mounted () {
    highjackAjax(this.start, this.stop);
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
    restoreAjax();
  }
};

var typeIcon = {
  positive: 'check_circle',
  negative: 'warning',
  info: 'info',
  warning: 'priority_high'
};

function getEvent (e) {
  return e || window.event
}

function rightClick (e) {
  e = getEvent(e);

  if (e.which) {
    return e.which === 3
  }
  if (e.button) {
    return e.button === 2
  }

  return false
}

function getEventKey (e) {
  e = getEvent(e);
  return e.which || e.keyCode
}

function position (e) {
  var posx, posy;
  e = getEvent(e);

  if (e.touches && e.touches[0]) {
    e = e.touches[0];
  }
  else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0];
  }

  if (e.clientX || e.clientY) {
    posx = e.clientX;
    posy = e.clientY;
  }
  else if (e.pageX || e.pageY) {
    posx = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
    posy = e.pageY - document.body.scrollTop - document.documentElement.scrollTop;
  }

  return {
    top: posy,
    left: posx
  }
}

function targetElement (e) {
  var target;
  e = getEvent(e);

  if (e.target) {
    target = e.target;
  }
  else if (e.srcElement) {
    target = e.srcElement;
  }

  // defeat Safari bug
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  return target
}

// Reasonable defaults
var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;

function getMouseWheelDistance (e) {
  var
    sX = 0, sY = 0, // spinX, spinY
    pX = 0, pY = 0; // pixelX, pixelY

  // Legacy
  if ('detail' in e) { sY = e.detail; }
  if ('wheelDelta' in e) { sY = -e.wheelDelta / 120; }
  if ('wheelDeltaY' in e) { sY = -e.wheelDeltaY / 120; }
  if ('wheelDeltaX' in e) { sX = -e.wheelDeltaX / 120; }

  // side scrolling on FF with DOMMouseScroll
  if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in e) { pY = e.deltaY; }
  if ('deltaX' in e) { pX = e.deltaX; }

  if ((pX || pY) && e.deltaMode) {
    if (e.deltaMode === 1) { // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    }
    else { // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
  if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

  /*
   * spinX  -- normalized spin speed (use for zoom) - x plane
   * spinY  -- " - y plane
   * pixelX -- normalized distance (to pixels) - x plane
   * pixelY -- " - y plane
   */
  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY
  }
}


var event = Object.freeze({
	rightClick: rightClick,
	getEventKey: getEventKey,
	position: position,
	targetElement: targetElement,
	getMouseWheelDistance: getMouseWheelDistance
});

function showRipple (evt, el, stopPropagation) {
  if (stopPropagation) {
    evt.stopPropagation();
  }

  var
    container = document.createElement('span'),
    animNode = document.createElement('span');

  container.appendChild(animNode);
  container.className = 'q-ripple-container';

  var size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight;
  size = (size * 2) + "px";
  animNode.className = 'q-ripple-animation';
  css(animNode, { width: size, height: size });

  el.appendChild(container);

  var
    offset$$1 = el.getBoundingClientRect(),
    pos = position(evt),
    x = pos.left - offset$$1.left,
    y = pos.top - offset$$1.top;

  animNode.classList.add('q-ripple-animation-enter', 'q-ripple-animation-visible');
  css(animNode, cssTransform(("translate(-50%, -50%) translate(" + x + "px, " + y + "px) scale(.001)")));

  setTimeout(function () {
    animNode.classList.remove('q-ripple-animation-enter');
    css(animNode, cssTransform(("translate(-50%, -50%) translate(" + x + "px, " + y + "px)")));
    setTimeout(function () {
      animNode.classList.remove('q-ripple-animation-visible');
      setTimeout(function () {
        animNode.parentNode.remove();
      }, 300);
    }, 400);
  }, 25);
}

function shouldAbort (ref) {
  var mat = ref.mat;
  var ios = ref.ios;

  return (
    (mat && "mat" !== 'mat') ||
    (ios && "mat" !== 'ios')
  )
}

var Ripple = {
  name: 'ripple',
  inserted: function inserted (el, ref) {
    var value = ref.value;
    var modifiers = ref.modifiers;

    if (shouldAbort(modifiers)) {
      return
    }

    var ctx = {
      enabled: value !== false,
      click: function click (evt) {
        if (ctx.enabled) {
          showRipple(evt, el, modifiers.stop);
        }
      }
    };

    el.__qripple = ctx;
    el.addEventListener('click', ctx.click, false);
  },
  update: function update (el, ref) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    if (el.__qripple && value !== oldValue) {
      el.__qripple.enabled = value !== false;
    }
  },
  unbind: function unbind (el, ref) {
    var modifiers = ref.modifiers;

    if (shouldAbort(modifiers)) {
      return
    }

    var ctx = el.__qripple;
    el.removeEventListener('click', ctx.click, false);
    delete el.__qripple;
  }
};

var BtnMixin = {
  components: {
    QIcon: QIcon
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    disable: Boolean,
    label: [Number, String],
    noCaps: Boolean,
    noWrap: Boolean,
    icon: String,
    iconRight: String,
    round: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    small: Boolean,
    big: Boolean,
    color: String,
    glossy: Boolean,
    compact: Boolean,
    noRipple: Boolean
  },
  computed: {
    size: function size () {
      return ("q-btn-" + (this.small ? 'small' : (this.big ? 'big' : 'standard')))
    },
    shape: function shape () {
      return ("q-btn-" + (this.round ? 'round' : 'rectangle'))
    },
    isDisabled: function isDisabled () {
      return this.disable || this.loading
    },
    hasRipple: function hasRipple () {
      return "mat" === 'mat' && !this.noRipple && !this.isDisabled
    },
    classes: function classes () {
      var
        cls = [this.shape, this.size],
        color = this.toggled ? this.toggleColor : this.color;

      if (this.toggled) {
        cls.push('q-btn-toggle-active');
      }
      if (this.compact) {
        cls.push('q-btn-compact');
      }

      if (this.flat) {
        cls.push('q-btn-flat');
      }
      else if (this.outline) {
        cls.push('q-btn-outline');
      }
      else if (this.push) {
        cls.push('q-btn-push');
      }

      this.isDisabled && cls.push('disabled');
      this.noCaps && cls.push('q-btn-no-uppercase');
      this.rounded && cls.push('q-btn-rounded');
      this.glossy && cls.push('glossy');

      if (color) {
        if (this.flat || this.outline) {
          cls.push(("text-" + color));
        }
        else {
          cls.push(("bg-" + color));
          cls.push("text-white");
        }
      }

      return cls
    }
  }
};

var mixin = {
  props: {
    color: String,
    size: {
      type: [Number, String],
      default: '1rem'
    }
  },
  computed: {
    classes: function classes () {
      if (this.color) {
        return ("text-" + (this.color))
      }
    }
  }
};

var DefaultSpinner = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner q-spinner-mat",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"25 25 50 50"}},[_c('circle',{staticClass:"path",attrs:{"cx":"50","cy":"50","r":"20","fill":"none","stroke":"currentColor","stroke-width":"3","stroke-miterlimit":"10"}})])},staticRenderFns: [],
  name: 'q-spinner-mat',
  mixins: [mixin]
};

var audio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 55 80","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"matrix(1 0 0 -1 0 80)"}},[_c('rect',{attrs:{"width":"10","height":"20","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"4.3s","values":"20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"15","width":"10","height":"80","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"80;55;33;5;75;23;73;33;12;14;60;80","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"30","width":"10","height":"50","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1.4s","values":"50;34;78;23;56;23;34;76;80;54;21;50","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"45","width":"10","height":"30","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"30;45;13;80;56;72;45;76;34;23;67;30","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-audio',
  mixins: [mixin]
};

var ball = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 57 57","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_c('circle',{attrs:{"cx":"5","cy":"50","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;5;50;50","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","values":"5;27;49;5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"27","cy":"5","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","from":"5","to":"5","values":"5;50;50;5","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","from":"27","to":"27","values":"27;49;5;27","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"49","cy":"50","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;50;5;50","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","from":"49","to":"49","begin":"0s","dur":"2.2s","values":"49;5;27;49","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-ball',
  mixins: [mixin]
};

var bars = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 135 140","xmlns":"http://www.w3.org/2000/svg"}},[_c('rect',{attrs:{"y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"30","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"60","width":"15","height":"140","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"90","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"120","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-bars',
  mixins: [mixin]
};

var circles = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 135 135","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"-360 67 67","dur":"2.5s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"360 67 67","dur":"8s","repeatCount":"indefinite"}})],1)])},staticRenderFns: [],
  name: 'q-spinner-circles',
  mixins: [mixin]
};

var comment = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('rect',{attrs:{"x":"0","y":"0","width":"100","height":"100","fill":"none"}}),_c('path',{attrs:{"d":"M78,19H22c-6.6,0-12,5.4-12,12v31c0,6.6,5.4,12,12,12h37.2c0.4,3,1.8,5.6,3.7,7.6c2.4,2.5,5.1,4.1,9.1,4 c-1.4-2.1-2-7.2-2-10.3c0-0.4,0-0.8,0-1.3h8c6.6,0,12-5.4,12-12V31C90,24.4,84.6,19,78,19z","fill":"currentColor"}}),_c('circle',{attrs:{"cx":"30","cy":"47","r":"5","fill":"#fff"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","values":"0;1;1","keyTimes":"0;0.2;1","dur":"1s","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"50","cy":"47","r":"5","fill":"#fff"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","values":"0;0;1;1","keyTimes":"0;0.2;0.4;1","dur":"1s","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"70","cy":"47","r":"5","fill":"#fff"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","values":"0;0;1;1","keyTimes":"0;0.4;0.6;1","dur":"1s","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-comment',
  mixins: [mixin]
};

var cube = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('rect',{attrs:{"x":"0","y":"0","width":"100","height":"100","fill":"none"}}),_c('g',{attrs:{"transform":"translate(25 25)"}},[_c('rect',{attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.9"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)]),_c('g',{attrs:{"transform":"translate(75 25)"}},[_c('rect',{attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.8"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0.1s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)]),_c('g',{attrs:{"transform":"translate(25 75)"}},[_c('rect',{staticClass:"cube",attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.7"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0.3s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)]),_c('g',{attrs:{"transform":"translate(75 75)"}},[_c('rect',{staticClass:"cube",attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.6"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0.2s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-cube',
  mixins: [mixin]
};

var dots = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 120 30","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"15","cy":"15","r":"15"}},[_c('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"60","cy":"15","r":"9","fill-opacity":".3"}},[_c('animate',{attrs:{"attributeName":"r","from":"9","to":"9","begin":"0s","dur":"0.8s","values":"9;15;9","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":".5","to":".5","begin":"0s","dur":"0.8s","values":".5;1;.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"105","cy":"15","r":"15"}},[_c('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-dots',
  mixins: [mixin]
};

var facebook = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","xmlns":"http://www.w3.org/2000/svg","preserveAspectRatio":"xMidYMid"}},[_c('g',{attrs:{"transform":"translate(20 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":"currentColor","opacity":"0.6"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)]),_c('g',{attrs:{"transform":"translate(50 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":"currentColor","opacity":"0.8"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.1s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)]),_c('g',{attrs:{"transform":"translate(80 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":"currentColor","opacity":"0.9"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.2s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-facebook',
  mixins: [mixin]
};

var gears = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(-20,-20)"}},[_c('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":"currentColor"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"90 50 50","to":"0 50 50","dur":"1s","repeatCount":"indefinite"}})],1)]),_c('g',{attrs:{"transform":"translate(20,20) rotate(15 50 50)"}},[_c('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":"currentColor"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"90 50 50","dur":"1s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-gears',
  mixins: [mixin]
};

var grid = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 105 105","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"12.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"12.5","cy":"52.5","r":"12.5","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"100ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"300ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"52.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"600ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"800ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"52.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"400ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"12.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"700ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"500ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"200ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-grid',
  mixins: [mixin]
};

var hearts = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 140 64","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.716-6.002 11.47-7.65 17.304-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('path',{attrs:{"d":"M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.593-2.32 17.308 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0.7s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('path',{attrs:{"d":"M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"}})])},staticRenderFns: [],
  name: 'q-spinner-hearts',
  mixins: [mixin]
};

var hourglass = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',[_c('path',{staticClass:"glass",attrs:{"fill":"none","stroke":"currentColor","stroke-width":"5","stroke-miterlimit":"10","d":"M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"}}),_c('clipPath',{attrs:{"id":"uil-hourglass-clip1"}},[_c('rect',{staticClass:"clip",attrs:{"x":"15","y":"20","width":"70","height":"25"}},[_c('animate',{attrs:{"attributeName":"height","from":"25","to":"0","dur":"1s","repeatCount":"indefinite","vlaues":"25;0;0","keyTimes":"0;0.5;1"}}),_c('animate',{attrs:{"attributeName":"y","from":"20","to":"45","dur":"1s","repeatCount":"indefinite","vlaues":"20;45;45","keyTimes":"0;0.5;1"}})])]),_c('clipPath',{attrs:{"id":"uil-hourglass-clip2"}},[_c('rect',{staticClass:"clip",attrs:{"x":"15","y":"55","width":"70","height":"25"}},[_c('animate',{attrs:{"attributeName":"height","from":"0","to":"25","dur":"1s","repeatCount":"indefinite","vlaues":"0;25;25","keyTimes":"0;0.5;1"}}),_c('animate',{attrs:{"attributeName":"y","from":"80","to":"55","dur":"1s","repeatCount":"indefinite","vlaues":"80;55;55","keyTimes":"0;0.5;1"}})])]),_c('path',{staticClass:"sand",attrs:{"d":"M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z","clip-path":"url(#uil-hourglass-clip1)","fill":"currentColor"}}),_c('path',{staticClass:"sand",attrs:{"d":"M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z","clip-path":"url(#uil-hourglass-clip2)","fill":"currentColor"}}),_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"180 50 50","repeatCount":"indefinite","dur":"1s","values":"0 50 50;0 50 50;180 50 50","keyTimes":"0;0.7;1"}})],1)])},staticRenderFns: [],
  name: 'q-spinner-hourglass',
  mixins: [mixin]
};

var infinity = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('path',{attrs:{"d":"M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z","fill":"none","stroke":"currentColor","stroke-width":"8","stroke-dasharray":"10.691205342610678 10.691205342610678","stroke-dashoffset":"0"}},[_c('animate',{attrs:{"attributeName":"stroke-dashoffset","from":"0","to":"21.382410685221355","begin":"0","dur":"2s","repeatCount":"indefinite","fill":"freeze"}})])])},staticRenderFns: [],
  name: 'q-spinner-infinity',
  mixins: [mixin]
};

var QSpinner_ios = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"stroke":"currentColor","fill":"currentColor","viewBox":"0 0 64 64"}},[_c('g',{attrs:{"stroke-width":"4","stroke-linecap":"round"}},[_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(180)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":"1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(210)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":"0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(240)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(270)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(300)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(330)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(0)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(30)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(60)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(90)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(120)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(150)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":"1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-ios',
  mixins: [mixin]
};

var oval = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_c('circle',{attrs:{"stroke-opacity":".5","cx":"18","cy":"18","r":"18"}}),_c('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"1s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-oval',
  mixins: [mixin]
};

var pie = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M0 50A50 50 0 0 1 50 0L50 50L0 50","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"0.8s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M50 0A50 50 0 0 1 100 50L50 50L50 0","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"1.6s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M100 50A50 50 0 0 1 50 100L50 50L100 50","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"2.4s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M50 100A50 50 0 0 1 0 50L50 50L50 100","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"3.2s","repeatCount":"indefinite"}})],1)])},staticRenderFns: [],
  name: 'q-spinner-pie',
  mixins: [mixin]
};

var puff = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 44 44","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"fill":"none","fill-rule":"evenodd","stroke-width":"2"}},[_c('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_c('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"0s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_c('animate',{attrs:{"attributeName":"r","begin":"-0.9s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"-0.9s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-puff',
  mixins: [mixin]
};

var radio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"scale(0.55)"}},[_c('circle',{attrs:{"cx":"30","cy":"150","r":"30","fill":"currentColor"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_c('path',{attrs:{"d":"M90,150h30c0-49.7-40.3-90-90-90v30C63.1,90,90,116.9,90,150z","fill":"currentColor"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.1","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_c('path',{attrs:{"d":"M150,150h30C180,67.2,112.8,0,30,0v30C96.3,30,150,83.7,150,150z","fill":"currentColor"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.2","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})])])])},staticRenderFns: [],
  name: 'q-spinner-radio',
  mixins: [mixin]
};

var rings = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 45 45","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"fill":"none","fill-rule":"evenodd","transform":"translate(1 1)","stroke-width":"2"}},[_c('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_c('animate',{attrs:{"attributeName":"r","begin":"1.5s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"1.5s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-width","begin":"1.5s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_c('animate',{attrs:{"attributeName":"r","begin":"3s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"3s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-width","begin":"3s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"8"}},[_c('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.5s","values":"6;1;2;3;4;5;6","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-rings',
  mixins: [mixin]
};

var tail = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_c('defs',[_c('linearGradient',{attrs:{"x1":"8.042%","y1":"0%","x2":"65.682%","y2":"23.865%","id":"a"}},[_c('stop',{attrs:{"stop-color":"currentColor","stop-opacity":"0","offset":"0%"}}),_c('stop',{attrs:{"stop-color":"currentColor","stop-opacity":".631","offset":"63.146%"}}),_c('stop',{attrs:{"stop-color":"currentColor","offset":"100%"}})],1)],1),_c('g',{attrs:{"transform":"translate(1 1)","fill":"none","fill-rule":"evenodd"}},[_c('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18","stroke":"url(#a)","stroke-width":"2"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})],1),_c('circle',{attrs:{"fill":"currentColor","cx":"36","cy":"18","r":"1"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-tail',
  mixins: [mixin]
};

var QSpinner = {
  mixins: [DefaultSpinner],
  name: 'q-spinner'
};

var QBtn = {
  name: 'q-btn',
  mixins: [BtnMixin],
  props: {
    value: Boolean,
    loader: Boolean,
    percentage: Number,
    darkPercentage: Boolean,
    waitForRipple: Boolean
  },
  data: function data () {
    return {
      loading: this.value || false
    }
  },
  watch: {
    value: function value (val) {
      if (this.loading !== val) {
        this.loading = val;
      }
    }
  },
  computed: {
    hasPercentage: function hasPercentage () {
      return this.percentage !== void 0
    },
    width: function width () {
      return ((between(this.percentage, 0, 100)) + "%")
    }
  },
  methods: {
    click: function click (e) {
      var this$1 = this;

      this.$el.blur();

      if (this.isDisabled) {
        return
      }

      clearTimeout(this.timer);
      var trigger = function () {
        if (this$1.loader !== false || this$1.$slots.loading) {
          this$1.loading = true;
          this$1.$emit('input', true);
        }
        this$1.$emit('click', e, function () {
          this$1.loading = false;
          this$1.$emit('input', false);
        });
      };

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 350);
      }
      else {
        trigger();
      }
    }
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
  },
  render: function render (h) {
    return h('button', {
      staticClass: 'q-btn row inline flex-center q-focusable q-hoverable relative-position',
      'class': this.classes,
      on: { click: this.click },
      directives: this.hasRipple
        ? [{
          name: 'ripple',
          value: true
        }]
        : null
    }, [
      h('div', { staticClass: 'desktop-only q-focus-helper' }),

      this.loading && this.hasPercentage
        ? h('div', {
          staticClass: 'q-btn-progress absolute-full',
          'class': { 'q-btn-dark-progress': this.darkPercentage },
          style: { width: this.width }
        })
        : null,

      h('span', {
        staticClass: 'q-btn-inner row col flex-center',
        'class': {
          'no-wrap': this.noWrap,
          'text-no-wrap': this.noWrap
        }
      },
      this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [
          this.icon
            ? h('q-icon', {
              'class': { 'on-left': this.label && !this.round },
              props: { name: this.icon }
            })
            : null,

          this.label && !this.round ? h('span', [ this.label ]) : null,

          this.$slots.default,

          this.iconRight && !this.round
            ? h('q-icon', {
              staticClass: 'on-right',
              props: { name: this.iconRight }
            })
            : null
        ]
      )
    ])
  }
};

var QBtnToggle = {
  name: 'q-btn-toggle',
  mixins: [BtnMixin],
  model: {
    prop: 'toggled',
    event: 'change'
  },
  props: {
    toggled: {
      type: Boolean,
      required: true
    },
    toggleColor: {
      type: String,
      required: true
    }
  },
  methods: {
    click: function click (e) {
      var this$1 = this;

      this.$el.blur();

      if (this.isDisabled) {
        return
      }

      clearTimeout(this.timer);
      var trigger = function () {
        var state = !this$1.toggled;
        this$1.$emit('change', state);
        this$1.$emit('click', e, state);
      };

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 350);
      }
      else {
        trigger();
      }
    }
  },
  render: function render (h) {
    return h('button', {
      staticClass: 'q-btn q-btn-toggle row inline flex-center q-focusable q-hoverable relative-position',
      'class': this.classes,
      on: { click: this.click },
      directives: this.hasRipple
        ? [{
          name: 'ripple',
          value: true
        }]
        : null
    }, [
      h('div', { staticClass: 'desktop-only q-focus-helper' }),

      h('span', {
        staticClass: 'q-btn-inner row col flex-center',
        'class': {
          'no-wrap': this.noWrap,
          'text-no-wrap': this.noWrap
        }
      }, [
        this.icon
          ? h('q-icon', {
            'class': { 'on-left': this.label && !this.round },
            props: { name: this.icon }
          })
          : null,

        this.label && !this.round ? h('span', [ this.label ]) : null,

        this.$slots.default,

        this.iconRight && !this.round
          ? h('q-icon', {
            staticClass: 'on-right',
            props: { name: this.iconRight }
          })
          : null
      ])
    ])
  }
};

var QBtnGroup = {
  name: 'q-btn-group',
  functional: true,
  props: {
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      moreCls = ['outline', 'flat', 'rounded', 'push'].filter(function (t) { return prop[t]; }).map(function (t) { return ("q-btn-group-" + t); }).join(' ');

    data.staticClass = "q-btn-group row no-wrap inline" + (cls ? (" " + cls) : '') + (moreCls ? (" " + moreCls) : '');

    return h('div', data, ctx.children)
  }
};

function getAnchorPosition (el, offset) {
  var ref = el.getBoundingClientRect();
  var top = ref.top;
  var left = ref.left;
  var right = ref.right;
  var bottom = ref.bottom;
  var a = {
      top: top,
      left: left,
      width: el.offsetWidth,
      height: el.offsetHeight
    };

  if (offset) {
    a.top -= offset[1];
    a.left -= offset[0];
    if (bottom) {
      bottom += offset[1];
    }
    if (right) {
      right += offset[0];
    }
    a.width += offset[0];
    a.height += offset[1];
  }

  a.right = right || a.left + a.width;
  a.bottom = bottom || a.top + a.height;
  a.middle = a.left + ((a.right - a.left) / 2);
  a.center = a.top + ((a.bottom - a.top) / 2);

  return a
}

function getTargetPosition (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

function getOverlapMode (anchor, target, median) {
  if ([anchor, target].indexOf(median) >= 0) { return 'auto' }
  if (anchor === target) { return 'inclusive' }
  return 'exclusive'
}

function getPositions (anchor, target) {
  var
    a = extend({}, anchor),
    t = extend({}, target);

  var positions = {
    x: ['left', 'right'].filter(function (p) { return p !== t.horizontal; }),
    y: ['top', 'bottom'].filter(function (p) { return p !== t.vertical; })
  };

  var overlap = {
    x: getOverlapMode(a.horizontal, t.horizontal, 'middle'),
    y: getOverlapMode(a.vertical, t.vertical, 'center')
  };

  positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle');
  positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center');

  if (overlap.y !== 'auto') {
    a.vertical = a.vertical === 'top' ? 'bottom' : 'top';
    if (overlap.y === 'inclusive') {
      t.vertical = t.vertical;
    }
  }

  if (overlap.x !== 'auto') {
    a.horizontal = a.horizontal === 'left' ? 'right' : 'left';
    if (overlap.y === 'inclusive') {
      t.horizontal = t.horizontal;
    }
  }

  return {
    positions: positions,
    anchorPos: a
  }
}

function applyAutoPositionIfNeeded (anchor, target, selfOrigin, anchorOrigin, targetPosition) {
  var ref = getPositions(anchorOrigin, selfOrigin);
  var positions = ref.positions;
  var anchorPos = ref.anchorPos;

  if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
    var newTop = anchor[anchorPos.vertical] - target[positions.y[0]];
    if (newTop + target.bottom <= window.innerHeight) {
      targetPosition.top = newTop;
    }
    else {
      newTop = anchor[anchorPos.vertical] - target[positions.y[1]];
      if (newTop + target.bottom <= window.innerHeight) {
        targetPosition.top = newTop;
      }
    }
  }
  if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
    var newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]];
    if (newLeft + target.right <= window.innerWidth) {
      targetPosition.left = newLeft;
    }
    else {
      newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]];
      if (newLeft + target.right <= window.innerWidth) {
        targetPosition.left = newLeft;
      }
    }
  }
  return targetPosition
}

function parseHorizTransformOrigin (pos) {
  return pos === 'middle' ? 'center' : pos
}

function getTransformProperties (ref) {
  var selfOrigin = ref.selfOrigin;

  var
    vert = selfOrigin.vertical,
    horiz = parseHorizTransformOrigin(selfOrigin.horizontal);

  return {
    'transform-origin': vert + ' ' + horiz + ' 0px'
  }
}

function setPosition (ref) {
  var el = ref.el;
  var anchorEl = ref.anchorEl;
  var anchorOrigin = ref.anchorOrigin;
  var selfOrigin = ref.selfOrigin;
  var maxHeight = ref.maxHeight;
  var event = ref.event;
  var anchorClick = ref.anchorClick;
  var touchPosition = ref.touchPosition;
  var offset = ref.offset;

  var anchor;
  el.style.maxHeight = maxHeight || '65vh';

  if (event && (!anchorClick || touchPosition)) {
    var ref$1 = position(event);
    var top = ref$1.top;
    var left = ref$1.left;
    anchor = {top: top, left: left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1};
  }
  else {
    anchor = getAnchorPosition(anchorEl, offset);
  }

  var target = getTargetPosition(el);
  var targetPosition = {
    top: anchor[anchorOrigin.vertical] - target[selfOrigin.vertical],
    left: anchor[anchorOrigin.horizontal] - target[selfOrigin.horizontal]
  };

  targetPosition = applyAutoPositionIfNeeded(anchor, target, selfOrigin, anchorOrigin, targetPosition);

  el.style.top = Math.max(0, targetPosition.top) + 'px';
  el.style.left = Math.max(0, targetPosition.left) + 'px';
}

function positionValidator (pos) {
  var parts = pos.split(' ');
  if (parts.length !== 2) {
    return false
  }
  if (!['top', 'center', 'bottom'].includes(parts[0])) {
    console.error('Anchor/Self position must start with one of top/center/bottom');
    return false
  }
  if (!['left', 'middle', 'right'].includes(parts[1])) {
    console.error('Anchor/Self position must end with one of left/middle/right');
    return false
  }
  return true
}

function offsetValidator (val) {
  if (!val) { return true }
  if (val.length !== 2) { return false }
  if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
    return false
  }
  return true
}

function parsePosition (pos) {
  var parts = pos.split(' ');
  return {vertical: parts[0], horizontal: parts[1]}
}

function debounce (fn, wait, immediate) {
  if ( wait === void 0 ) wait = 250;

  var timeout;

  function debounced () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var later = function () {
      timeout = null;
      if (!immediate) {
        fn.apply(this$1, args);
      }
    };

    clearTimeout(timeout);
    if (immediate && !timeout) {
      fn.apply(this, args);
    }
    timeout = setTimeout(later, wait);
  }

  debounced.cancel = function () {
    clearTimeout(timeout);
  };

  return debounced
}

function frameDebounce (fn) {
  var wait = false;

  return function () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (wait) { return }

    wait = true;
    window.requestAnimationFrame(function () {
      fn.apply(this$1, args);
      wait = false;
    });
  }
}

function getScrollTarget (el) {
  return el.closest('.scroll') || window
}

function getScrollHeight (el) {
  return (el === window ? document.body : el).scrollHeight
}

function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

function animScrollTo (el, to, duration) {
  if (duration <= 0) {
    return
  }

  var pos = getScrollPosition(el);

  window.requestAnimationFrame(function () {
    setScroll(el, pos + (to - pos) / duration * 16);
    if (el.scrollTop !== to) {
      animScrollTo(el, to, duration - 16);
    }
  });
}

function setScroll (scrollTarget, offset$$1) {
  if (scrollTarget === window) {
    document.documentElement.scrollTop = offset$$1;
    document.body.scrollTop = offset$$1;
    return
  }
  scrollTarget.scrollTop = offset$$1;
}

function setScrollPosition (scrollTarget, offset$$1, duration) {
  if (duration) {
    animScrollTo(scrollTarget, offset$$1, duration);
    return
  }
  setScroll(scrollTarget, offset$$1);
}

var size;
function getScrollbarWidth () {
  if (size !== undefined) {
    return size
  }

  var
    inner = document.createElement('p'),
    outer = document.createElement('div');

  css(inner, {
    width: '100%',
    height: '200px'
  });
  css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;

  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild(outer);
  size = w1 - w2;

  return size
}


var scroll = Object.freeze({
	getScrollTarget: getScrollTarget,
	getScrollHeight: getScrollHeight,
	getScrollPosition: getScrollPosition,
	animScrollTo: animScrollTo,
	setScrollPosition: setScrollPosition,
	getScrollbarWidth: getScrollbarWidth
});

var QPopover = {
  name: 'q-popover',
  mixins: [ModelToggleMixin],
  props: {
    anchor: {
      type: String,
      default: 'bottom left',
      validator: positionValidator
    },
    self: {
      type: String,
      default: 'top left',
      validator: positionValidator
    },
    fit: Boolean,
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {
      /*
        for handling anchor outside of Popover
        example: context menu component
      */
      type: Boolean,
      default: true
    },
    offset: {
      type: Array,
      validator: offsetValidator
    },
    disable: Boolean
  },
  watch: {
    $route: function $route () {
      this.hide();
    }
  },
  computed: {
    transformCSS: function transformCSS () {
      return getTransformProperties({selfOrigin: this.selfOrigin})
    },
    anchorOrigin: function anchorOrigin () {
      return parsePosition(this.anchor)
    },
    selfOrigin: function selfOrigin () {
      return parsePosition(this.self)
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-popover animate-scale',
      style: this.transformCSS,
      on: {
        click: function click (e) { e.stopPropagation(); }
      }
    }, this.$slots.default)
  },
  created: function created () {
    var this$1 = this;

    this.__updatePosition = frameDebounce(function () { this$1.reposition(); });
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.anchorEl = this$1.$el.parentNode;
      this$1.anchorEl.removeChild(this$1.$el);
      if (this$1.anchorEl.classList.contains('q-btn-inner')) {
        this$1.anchorEl = this$1.anchorEl.parentNode;
      }
      if (this$1.anchorClick) {
        this$1.anchorEl.classList.add('cursor-pointer');
        this$1.anchorEl.addEventListener('click', this$1.toggle);
      }
    });
    if (this.value) {
      this.show();
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.anchorClick && this.anchorEl) {
      this.anchorEl.removeEventListener('click', this.toggle);
    }
  },
  methods: {
    __show: function __show (evt) {
      var this$1 = this;

      document.body.appendChild(this.$el);
      EscapeKey.register(function () { this$1.hide(); });
      this.scrollTarget = getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.__updatePosition);
      window.addEventListener('resize', this.__updatePosition);
      this.reposition(evt);

      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        document.body.addEventListener('click', this$1.__bodyHide, true);
        document.body.addEventListener('touchstart', this$1.__bodyHide, true);
        this$1.showPromise && this$1.showPromiseResolve();
      }, 0);
    },
    __bodyHide: function __bodyHide (evt) {
      if (
        evt && evt.target &&
        (this.$el.contains(evt.target) || (this.anchorClick && this.anchorEl.contains(evt.target)))
      ) {
        return
      }

      this.hide(evt);
    },
    __hide: function __hide (evt) {
      clearTimeout(this.timer);

      document.body.removeEventListener('click', this.__bodyHide, true);
      document.body.removeEventListener('touchstart', this.__bodyHide, true);
      this.scrollTarget.removeEventListener('scroll', this.__updatePosition);
      window.removeEventListener('resize', this.__updatePosition);
      EscapeKey.pop();

      document.body.removeChild(this.$el);
      this.hidePromise && this.hidePromiseResolve();
    },
    reposition: function reposition (event) {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.fit) {
          this$1.$el.style.minWidth = width(this$1.anchorEl) + 'px';
        }
        var ref = this$1.anchorEl.getBoundingClientRect();
        var top = ref.top;
        var ref$1 = viewport();
        var height$$1 = ref$1.height;
        if (top < 0 || top > height$$1) {
          return this$1.hide()
        }
        setPosition({
          event: event,
          el: this$1.$el,
          offset: this$1.offset,
          anchorEl: this$1.anchorEl,
          anchorOrigin: this$1.anchorOrigin,
          selfOrigin: this$1.selfOrigin,
          maxHeight: this$1.maxHeight,
          anchorClick: this$1.anchorClick,
          touchPosition: this$1.touchPosition
        });
      });
    }
  }
};

var QBtnDropdown = {
  name: 'q-btn-dropdown',
  mixins: [BtnMixin],
  props: {
    value: Boolean,
    label: String,
    split: Boolean
  },
  render: function render (h) {
    var this$1 = this;

    var
      Popover = h(
        QPopover,
        {
          ref: 'popover',
          props: {
            fit: true,
            anchorClick: !this.split,
            anchor: 'bottom right',
            self: 'top right'
          },
          on: {
            show: function (e) {
              this$1.$emit('show', e);
              this$1.$emit('input', true);
            },
            hide: function (e) {
              this$1.$emit('hide', e);
              this$1.$emit('input', false);
            }
          }
        },
        this.$slots.default
      ),
      Icon = h(
        'q-icon',
        {
          props: {
            name: 'arrow_drop_down'
          },
          staticClass: 'transition-generic',
          'class': {
            'rotate-180': this.showing,
            'on-right': !this.split,
            'q-btn-dropdown-arrow': !this.split
          }
        }
      ),
      child = [Popover];

    var getBtn = function () {
      return h(
        QBtn,
        {
          props: {
            disable: this$1.disable,
            noCaps: this$1.noCaps,
            noWrap: this$1.noWrap,
            icon: this$1.icon,
            label: this$1.label,
            iconRight: this$1.split ? this$1.iconRight : null,
            round: this$1.round,
            outline: this$1.outline,
            flat: this$1.flat,
            rounded: this$1.rounded,
            push: this$1.push,
            small: this$1.small,
            big: this$1.big,
            color: this$1.color,
            glossy: this$1.glossy,
            compact: this$1.compact,
            noRipple: this$1.noRipple,
            waitForRipple: this$1.waitForRipple
          },
          staticClass: ("" + (this$1.split ? 'q-btn-dropdown-current' : 'q-btn-dropdown q-btn-dropdown-simple')),
          on: {
            click: function (e) {
              if (!this$1.disable) {
                this$1.$emit('click', e);
              }
            }
          }
        },
        this$1.split ? null : child
      )
    };

    if (!this.split) {
      child.push(Icon);
      return getBtn()
    }

    return h(
      QBtnGroup,
      {
        props: {
          outline: this.outline,
          flat: this.flat,
          rounded: this.rounded,
          push: this.push
        },
        staticClass: 'q-btn-dropdown q-btn-dropdown-split no-wrap'
      },
      [
        getBtn(),
        h(
          QBtn,
          {
            props: {
              round: this.round,
              flat: this.flat,
              rounded: this.rounded,
              push: this.push,
              small: this.small,
              big: this.big,
              color: this.color,
              glossy: this.glossy,
              noRipple: this.noRipple,
              waitForRipple: this.waitForRipple
            },
            staticClass: 'q-btn-dropdown-arrow',
            on: {
              click: function () {
                if (!this$1.disable) {
                  this$1.show();
                }
              }
            }
          },
          [ Icon ]
        ),
        child
      ]
    )
  },
  methods: {
    show: function show () {
      return this.$refs.popover.show()
    },
    hide: function hide () {
      return this.$refs.popover.hide()
    }
  }
};

var QBtnToggleGroup = {
  name: 'q-btn-toggle-group',
  components: {
    QBtnGroup: QBtnGroup,
    QBtnToggle: QBtnToggle
  },
  props: {
    value: {
      required: true
    },
    color: String,
    toggleColor: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: function (v) { return v.every(function (opt) { return ('label' in opt || 'icon' in opt) && 'value' in opt; }); }
    },
    disable: Boolean,
    noCaps: Boolean,
    noWrap: Boolean,
    outline: Boolean,
    flat: Boolean,
    compact: Boolean,
    rounded: Boolean,
    push: Boolean,
    small: Boolean,
    big: Boolean,
    glossy: Boolean,
    noRipple: Boolean,
    waitForRipple: Boolean
  },
  computed: {
    val: function val () {
      var this$1 = this;

      return this.options.map(function (opt) { return opt.value === this$1.value; })
    }
  },
  methods: {
    set: function set (value, opt) {
      if (value !== this.value) {
        this.$emit('input', value);
        this.$emit('change', value, opt);
      }
    }
  },
  render: function render (h) {
    var this$1 = this;

    return h(QBtnGroup, {
      staticClass: 'q-btn-toggle-group',
      props: {
        outline: this.outline,
        flat: this.flat,
        rounded: this.rounded,
        push: this.push
      }
    },
    this.options.map(
      function (opt, i) { return h(QBtnToggle, {
        key: ("" + (opt.label) + (opt.icon) + (opt.iconRight)),
        on: { change: function () { return this$1.set(opt.value, opt); } },
        props: {
          toggled: this$1.val[i],
          label: opt.label,
          color: opt.color || this$1.color,
          toggleColor: opt.toggleColor || this$1.toggleColor,
          icon: opt.icon,
          iconRight: opt.iconRight,
          noCaps: this$1.noCaps,
          noWrap: this$1.noWrap,
          outline: this$1.outline,
          flat: this$1.flat,
          rounded: this$1.rounded,
          push: this$1.push,
          glossy: this$1.glossy,
          small: this$1.small,
          big: this$1.big,
          compact: this$1.compact,
          noRipple: this$1.noRipple,
          waitForRipple: this$1.waitForRipple
        }
      }); }
    ))
  }
};

var QAlert = {
  name: 'q-alert',
  props: {
    type: {
      type: String,
      validator: function (v) { return ['positive', 'negative', 'warning', 'info'].includes(v); }
    },
    color: {
      type: String,
      default: 'negative'
    },
    textColor: String,
    message: String,
    detail: String,
    icon: String,
    avatar: String,
    actions: Array
  },
  computed: {
    computedIcon: function computedIcon () {
      return this.icon
        ? this.icon
        : typeIcon[this.type || this.color]
    },
    classes: function classes () {
      return ("bg-" + (this.type || this.color) + " text-" + (this.textColor || 'white'))
    }
  },
  render: function render (h) {
    var side = [];

    if (this.avatar) {
      side.push(
        h('img', {
          staticClass: 'avatar',
          domProps: { src: this.avatar }
        })
      );
    }
    else if (this.icon || this.type) {
      side.push(
        h(QIcon, {
          props: { name: this.computedIcon }
        })
      );
    }

    return h('div', [
      h('div', {
        staticClass: 'q-alert row no-wrap shadow-2',
        'class': this.classes
      }, [
        side.length
          ? h('div', { staticClass: 'q-alert-side row col-auto flex-center' }, side)
          : null,
        h('div', {
          staticClass: 'q-alert-content col self-center'
        }, [
          h('div', this.$slots.default || this.message),
          this.detail ? h('div', { staticClass: 'q-alert-detail' }, [ this.detail ]) : null
        ]),
        this.actions && this.actions.length
          ? h('div', {
            staticClass: 'q-alert-actions col-auto xs-gutter flex-center'
          },
          this.actions.map(function (action) { return h('div', [
              h(QBtn, {
                props: {
                  flat: true,
                  compact: true
                },
                on: {
                  click: function () { return action.handler(); }
                }
              }, [ action.label ])
            ]); }
          ))
          : null
      ])
    ])
  }
};

var filter = function (terms, ref) {
  var field = ref.field;
  var list = ref.list;

  var token = terms.toLowerCase();
  return list.filter(function (item) { return ('' + item[field]).toLowerCase().startsWith(token); })
};

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

var uid = function () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
};

function prevent (e) {
  e.preventDefault();
  e.stopPropagation();
}

var QAutocomplete = {
  name: 'q-autocomplete',
  props: {
    minCharacters: {
      type: Number,
      default: 1
    },
    maxResults: {
      type: Number,
      default: 6
    },
    debounce: {
      type: Number,
      default: 500
    },
    filter: {
      type: Function,
      default: filter
    },
    staticData: Object,
    separator: Boolean
  },
  inject: {
    __input: {
      default: function default$1 () {
        console.error('QAutocomplete needs to be child of QInput or QSearch');
      }
    },
    __inputDebounce: { default: null }
  },
  data: function data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
      width: 0,
      enterKey: false,
      timer: null
    }
  },
  watch: {
    '__input.val': function _input_val () {
      if (this.enterKey) {
        this.enterKey = false;
      }
      else {
        this.__delayTrigger();
      }
    }
  },
  computed: {
    computedResults: function computedResults () {
      return this.maxResults && this.results.length > 0
        ? this.results.slice(0, this.maxResults)
        : []
    },
    computedWidth: function computedWidth () {
      return {minWidth: this.width}
    },
    searching: function searching () {
      return this.searchId.length > 0
    }
  },
  methods: {
    trigger: function trigger () {
      var this$1 = this;

      if (!this.__input.hasFocus()) {
        return
      }
      var terms = this.__input.val;
      this.width = width(this.inputEl) + 'px';
      var searchId = uid();
      this.searchId = searchId;

      if (terms.length < this.minCharacters) {
        this.searchId = '';
        this.__clearSearch();
        this.hide();
        return
      }

      if (this.staticData) {
        this.searchId = '';
        this.results = this.filter(terms, this.staticData);
        if (this.$q.platform.is.desktop) {
          this.selectedIndex = 0;
        }
        this.$refs.popover.show();
        return
      }

      this.hide();
      this.__input.loading = true;
      this.$emit('search', terms, function (results) {
        if (this$1.searchId !== searchId) {
          return
        }

        this$1.__clearSearch();

        if (!this$1.results || this$1.results === results) {
          return
        }

        if (Array.isArray(results) && results.length > 0) {
          this$1.results = results;
          if (this$1.$refs && this$1.$refs.popover) {
            if (this$1.$q.platform.is.desktop) {
              this$1.selectedIndex = 0;
            }
            this$1.$refs.popover.show();
          }
          return
        }

        this$1.hide();
      });
    },
    hide: function hide () {
      this.results = [];
      this.selectedIndex = -1;
      return this.$refs.popover.hide()
    },
    __clearSearch: function __clearSearch () {
      clearTimeout(this.timer);
      this.__input.loading = false;
      this.searchId = '';
    },
    setValue: function setValue (result) {
      var suffix = this.__inputDebounce ? 'Debounce' : '';
      this[("__input" + suffix)].set(this.staticData ? result[this.staticData.field] : result.value);

      this.$emit('selected', result);
      this.__clearSearch();
      this.hide();
    },
    move: function move (offset$$1) {
      this.selectedIndex = normalizeToInterval(
        this.selectedIndex + offset$$1,
        0,
        this.computedResults.length - 1
      );
    },
    setCurrentSelection: function setCurrentSelection () {
      this.enterKey = true;
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex]);
      }
    },
    __delayTrigger: function __delayTrigger () {
      this.__clearSearch();
      if (!this.__input.hasFocus()) {
        return
      }
      if (this.staticData) {
        this.trigger();
        return
      }
      this.timer = setTimeout(this.trigger, this.debounce);
    },
    __handleKeypress: function __handleKeypress (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          this.__moveCursor(-1, e);
          break
        case 40: // down
          this.__moveCursor(1, e);
          break
        case 13: // enter
          this.setCurrentSelection();
          prevent(e);
          break
        case 27: // escape
          this.__clearSearch();
          break
      }
    },
    __moveCursor: function __moveCursor (offset$$1, e) {
      prevent(e);

      if (!this.$refs.popover.showing) {
        this.trigger();
      }
      else {
        this.move(offset$$1);
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.__input.register();
    if (this.__inputDebounce) {
      this.__inputDebounce.setChildDebounce(true);
    }
    this.$nextTick(function () {
      this$1.inputEl = this$1.__input.getEl();
      this$1.inputEl.addEventListener('keyup', this$1.__handleKeypress);
    });
  },
  beforeDestroy: function beforeDestroy () {
    this.__clearSearch();
    this.__input.unregister();
    if (this.__inputDebounce) {
      this.__inputDebounce.setChildDebounce(false);
    }
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.__handleKeypress);
      this.hide();
    }
  },
  render: function render (h) {
    var this$1 = this;

    return h(QPopover, {
      ref: 'popover',
      props: {
        fit: true,
        offset: [0, 10],
        anchorClick: false
      },
      on: {
        show: function () { return this$1.$emit('show'); },
        hide: function () { return this$1.$emit('hide'); }
      }
    }, [
      h(QList, {
        props: {
          noBorder: true,
          link: true,
          separator: this.separator
        },
        style: this.computedWidth
      },
      this.computedResults.map(function (result, index) { return h(QItemWrapper, {
        key: result.id || JSON.stringify(result),
        'class': { active: this$1.selectedIndex === index },
        props: { cfg: result },
        on: {
          click: function () { this$1.setValue(result); }
        }
      }); }))
    ])
  }
};

var QCard = {
  name: 'q-card',
  functional: true,
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean,
    color: String
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props;

    var cls = ['q-card'];
    if (prop.square) {
      cls.push('no-border-radius');
    }
    if (prop.flat) {
      cls.push('no-shadow');
    }
    if (prop.inline) {
      cls.push('inline-block');
    }
    if (prop.color) {
      cls.push(("bg-" + (prop.color) + " text-white q-card-dark"));
    }

    data.staticClass = "" + (cls.join(' ')) + (classes ? (" " + classes) : '');

    return h(
      'div',
      data,
      ctx.children
    )
  }
};

var QCardTitle = {
  name: 'q-card-title',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = ctx.data.staticClass,
      slots = ctx.slots();

    data.staticClass = "q-card-primary q-card-container row no-wrap" + (cls ? (" " + cls) : '');
    return h(
      'div',
      data,
      [
        h('div', {staticClass: 'col column'}, [
          h('div', {staticClass: 'q-card-title'}, slots.default),
          h('div', {staticClass: 'q-card-subtitle'}, slots.subtitle)
        ]),
        h('div', {staticClass: 'col-auto self-center q-card-title-extra'}, slots.right)
      ]
    )
  }
};

var QCardMain = {
  name: 'q-card-main',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass;

    data.staticClass = "q-card-main q-card-container" + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

var QCardActions = {
  name: 'q-card-actions',
  functional: true,
  props: {
    vertical: Boolean,
    align: {
      type: String,
      default: 'start',
      validator: function (v) { return ['start', 'center', 'end', 'around', 'between'].includes(v); }
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props;

    data.staticClass = "q-card-actions " +
      "q-card-actions-" + (prop.vertical ? 'vert column justify-start' : 'horiz row') + " " +
      (prop.vertical ? 'items' : 'justify') + "-" + (prop.align) +
      "" + (classes ? (" " + classes) : '');

    return h('div', data, ctx.children)
  }
};

var QCardMedia = {
  name: 'q-card-media',
  functional: true,
  props: {
    overlayPosition: {
      type: String,
      default: 'bottom',
      validator: function (v) { return ['top', 'bottom', 'full'].includes(v); }
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots();
    var child = [slots.default];

    data.staticClass = "q-card-media relative-position" + (cls ? (" " + cls) : '');

    if (slots.overlay) {
      child.push(h(
        'div',
        {
          staticClass: ("q-card-media-overlay absolute-" + (ctx.props.overlayPosition))
        },
        slots.overlay
      ));
    }

    return h('div', data, child)
  }
};

var QCardSeparator = {
  name: 'q-card-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass;

    data.staticClass = "q-card-separator" + (ctx.props.inset ? ' inset' : '') + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

function getDirection (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      horizontal: true,
      vertical: true
    }
  }

  var dir = {};['horizontal', 'vertical'].forEach(function (direction) {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });

  return dir
}

function updateClasses (el, dir, scroll) {
  el.classList.add('q-touch');

  if (!scroll) {
    if (dir.horizontal && !dir.vertical) {
      el.classList.add('q-touch-y');
      el.classList.remove('q-touch-x');
    }
    else if (!dir.horizontal && dir.vertical) {
      el.classList.add('q-touch-x');
      el.classList.remove('q-touch-y');
    }
  }
}

function processChanges (evt, ctx, isFinal) {
  var
    direction,
    pos = position(evt),
    distX = pos.left - ctx.event.x,
    distY = pos.top - ctx.event.y,
    absDistX = Math.abs(distX),
    absDistY = Math.abs(distY);

  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else if (!ctx.direction.horizontal && ctx.direction.vertical) {
    direction = distY < 0 ? 'up' : 'down';
  }
  else if (absDistX >= absDistY) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else {
    direction = distY < 0 ? 'up' : 'down';
  }

  return {
    evt: evt,
    position: pos,
    direction: direction,
    isFirst: ctx.event.isFirst,
    isFinal: Boolean(isFinal),
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
    },
    delta: {
      x: pos.left - ctx.event.lastX,
      y: pos.top - ctx.event.lastY
    }
  }
}

function shouldTrigger (ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) {
    return true
  }
  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    return Math.abs(changes.delta.x) > 0
  }
  if (!ctx.direction.horizontal && ctx.direction.vertical) {
    return Math.abs(changes.delta.y) > 0
  }
}

var TouchPan = {
  name: 'touch-pan',
  bind: function bind (el, binding) {
    var mouse = !binding.modifiers.nomouse;

    var ctx = {
      handler: binding.value,
      scroll: binding.modifiers.scroll,
      direction: getDirection(binding.modifiers),

      mouseStart: function mouseStart (evt) {
        if (mouse) {
          document.addEventListener('mousemove', ctx.mouseMove);
          document.addEventListener('mouseup', ctx.mouseEnd);
        }
        ctx.start(evt);
      },
      start: function start (evt) {
        var pos = position(evt);
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical,
          isFirst: true,
          lastX: pos.left,
          lastY: pos.top
        };
      },
      mouseMove: function mouseMove (evt) {
        ctx.event.prevent = true;
        ctx.move(evt);
      },
      move: function move (evt) {
        if (ctx.event.prevent) {
          if (!ctx.scroll) {
            evt.preventDefault();
          }
          var changes = processChanges(evt, ctx, false);
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes);
            ctx.event.lastX = changes.position.left;
            ctx.event.lastY = changes.position.top;
            ctx.event.isFirst = false;
          }
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        var
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y;

        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else if (Math.abs(distX) < Math.abs(distY)) {
          ctx.event.prevent = true;
        }
      },
      mouseEnd: function mouseEnd (evt) {
        if (mouse) {
          document.removeEventListener('mousemove', ctx.mouseMove);
          document.removeEventListener('mouseup', ctx.mouseEnd);
        }
        ctx.end(evt);
      },
      end: function end (evt) {
        if (!ctx.event.prevent || ctx.event.isFirst) {
          return
        }

        ctx.handler(processChanges(evt, ctx, true));
      }
    };

    el.__qtouchpan = ctx;
    updateClasses(el, ctx.direction, ctx.scroll);
    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart);
    }
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchpan.handler = binding.value;
    }
  },
  unbind: function unbind (el, binding) {
    var ctx = el.__qtouchpan;
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.mouseStart);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    delete el.__qtouchpan;
  }
};

function isDate (v) {
  return Object.prototype.toString.call(v) === '[object Date]'
}



function isNumber (v) {
  return typeof v === 'number' && isFinite(v)
}

var linear = function (t) { return t; };

var easeInQuad = function (t) { return t * t; };
var easeOutQuad = function (t) { return t * (2 - t); };
var easeInOutQuad = function (t) { return t < 0.5
  ? 2 * t * t
  : -1 + (4 - 2 * t) * t; };

var easeInCubic = function (t) { return Math.pow( t, 3 ); };
var easeOutCubic = function (t) { return 1 + Math.pow( (t - 1), 3 ); };
var easeInOutCubic = function (t) { return t < 0.5
  ? 4 * Math.pow( t, 3 )
  : 1 + (t - 1) * Math.pow( (2 * t - 2), 2 ); };

var easeInQuart = function (t) { return Math.pow( t, 4 ); };
var easeOutQuart = function (t) { return 1 - Math.pow( (t - 1), 4 ); };
var easeInOutQuart = function (t) { return t < 0.5
  ? 8 * Math.pow( t, 4 )
  : 1 - 8 * Math.pow( (t - 1), 4 ); };

var easeInQuint = function (t) { return Math.pow( t, 5 ); };
var easeOutQuint = function (t) { return 1 + Math.pow( (t - 1), 5 ); };
var easeInOutQuint = function (t) { return t < 0.5
  ? 16 * Math.pow( t, 5 )
  : 1 + 16 * Math.pow( (t - 1), 5 ); };

var easeInCirc = function (t) { return -1 * Math.sqrt(1 - Math.pow( t, 2 )) + 1; };
var easeOutCirc = function (t) { return Math.sqrt(-1 * (t - 2) * t); };
var easeInOutCirc = function (t) { return t < 0.5
  ? 0.5 * (1 - Math.sqrt(1 - 4 * t * t))
  : 0.5 * (1 + Math.sqrt(-3 + 8 * t - 4 * t * t)); };

var overshoot = function (t) { return -1 * (Math.pow( Math.E, (-6.3 * t) )) * (Math.cos(5 * t)) + 1; };

/* -- Material Design curves -- */

/**
 * Faster ease in, slower ease out
 */
var standard = function (t) { return t < 0.4031
  ? 12 * Math.pow( t, 4 )
  : 1 / 1290 * (11 * Math.sqrt(-40000 * t * t + 80000 * t - 23359) - 129); };

var decelerate = easeOutCubic;
var accelerate = easeInCubic;
var sharp = easeInOutQuad;


var easing = Object.freeze({
	linear: linear,
	easeInQuad: easeInQuad,
	easeOutQuad: easeOutQuad,
	easeInOutQuad: easeInOutQuad,
	easeInCubic: easeInCubic,
	easeOutCubic: easeOutCubic,
	easeInOutCubic: easeInOutCubic,
	easeInQuart: easeInQuart,
	easeOutQuart: easeOutQuart,
	easeInOutQuart: easeInOutQuart,
	easeInQuint: easeInQuint,
	easeOutQuint: easeOutQuint,
	easeInOutQuint: easeInOutQuint,
	easeInCirc: easeInCirc,
	easeOutCirc: easeOutCirc,
	easeInOutCirc: easeInOutCirc,
	overshoot: overshoot,
	standard: standard,
	decelerate: decelerate,
	accelerate: accelerate,
	sharp: sharp
});

var ids = {};

function start (ref) {
  var name = ref.name;
  var duration = ref.duration; if ( duration === void 0 ) duration = 300;
  var to = ref.to;
  var from = ref.from;
  var apply = ref.apply;
  var done = ref.done;
  var cancel = ref.cancel;
  var easing = ref.easing;

  var id = name;
  var start = performance.now();

  if (id) {
    stop(id);
  }
  else {
    id = uid();
  }

  var delta = easing || linear;
  var handler = function () {
    var progress = (performance.now() - start) / duration;
    if (progress > 1) {
      progress = 1;
    }

    var newPos = from + (to - from) * delta(progress);
    apply(newPos, progress);

    if (progress === 1) {
      delete ids[id];
      done && done(newPos);
      return
    }

    anim.last = {
      pos: newPos,
      progress: progress
    };
    anim.timer = window.requestAnimationFrame(handler);
  };

  var anim = ids[id] = {
    cancel: cancel,
    timer: window.requestAnimationFrame(handler)
  };

  return id
}

function stop (id) {
  if (!id) {
    return
  }
  var anim = ids[id];
  if (anim && anim.timer) {
    cancelAnimationFrame(anim.timer);
    anim.cancel && anim.cancel(anim.last);
    delete ids[id];
  }
}


var animate = Object.freeze({
	start: start,
	stop: stop
});

var FullscreenMixin = {
  data: function data () {
    return {
      inFullscreen: false
    }
  },
  watch: {
    $route: function $route () {
      this.__exitFullscreen();
    }
  },
  methods: {
    toggleFullscreen: function toggleFullscreen () {
      if (this.inFullscreen) {
        this.exitFullscreen();
      }
      else {
        this.setFullscreen();
      }
    },
    setFullscreen: function setFullscreen () {
      if (this.inFullscreen) {
        return
      }

      this.inFullscreen = true;
      this.container = this.$el.parentNode;
      this.container.replaceChild(this.fullscreenFillerNode, this.$el);
      document.body.appendChild(this.$el);
      document.body.classList.add('with-mixin-fullscreen');

      this.__historyFullscreen = {
        handler: this.exitFullscreen
      };
      History.add(this.__historyFullscreen);
    },
    exitFullscreen: function exitFullscreen () {
      if (!this.inFullscreen) {
        return
      }

      if (this.__historyFullscreen) {
        History.remove(this.__historyFullscreen);
        this.__historyFullscreen = null;
      }
      this.container.replaceChild(this.$el, this.fullscreenFillerNode);
      document.body.classList.remove('with-mixin-fullscreen');
      this.inFullscreen = false;
    }
  },
  created: function created () {
    this.fullscreenFillerNode = document.createElement('span');
  },
  beforeDestroy: function beforeDestroy () {
    this.exitFullscreen();
  }
};

var QCarousel = {
  name: 'q-carousel',
  mixins: [FullscreenMixin],
  directives: {
    TouchPan: TouchPan
  },
  props: {
    value: Number,
    color: {
      type: String,
      default: 'primary'
    },
    height: String,
    arrows: Boolean,
    infinite: Boolean,
    animation: {
      type: [Number, Boolean],
      default: true
    },
    easing: Function,
    swipeEasing: Function,
    noSwipe: Boolean,
    autoplay: [Number, Boolean],
    handleArrowKeys: Boolean,
    quickNav: Boolean,
    quickNavIcon: {
      type: String,
      default: 'lens'
    }
  },
  provide: function provide () {
    return {
      'carousel': this
    }
  },
  data: function data () {
    return {
      position: 0,
      slide: 0,
      positionSlide: 0,
      slidesNumber: 0,
      animUid: false
    }
  },
  watch: {
    value: function value (v) {
      if (v !== this.slide) {
        this.goToSlide(v);
      }
    },
    autoplay: function autoplay () {
      this.__planAutoPlay();
    },
    infinite: function infinite () {
      this.__planAutoPlay();
    },
    handleArrowKeys: function handleArrowKeys (v) {
      this.__setArrowKeys(v);
    }
  },
  computed: {
    trackPosition: function trackPosition () {
      return cssTransform(("translateX(" + (this.position) + "%)"))
    },
    infiniteLeft: function infiniteLeft () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide < 0
    },
    infiniteRight: function infiniteRight () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide >= this.slidesNumber
    },
    canGoToPrevious: function canGoToPrevious () {
      return this.infinite ? this.slidesNumber > 1 : this.slide > 0
    },
    canGoToNext: function canGoToNext () {
      return this.infinite ? this.slidesNumber > 1 : this.slide < this.slidesNumber - 1
    },
    computedStyle: function computedStyle () {
      if (!this.inFullscreen && this.height) {
        return ("height: " + (this.height))
      }
    },
    slotScope: function slotScope () {
      return {
        slide: this.slide,
        slidesNumber: this.slidesNumber,
        percentage: this.slidesNumber < 2
          ? 100
          : 100 * this.slide / (this.slidesNumber - 1),
        goToSlide: this.goToSlide,
        previous: this.previous,
        next: this.next,
        color: this.color,
        inFullscreen: this.inFullscreen,
        toggleFullscreen: this.toggleFullscreen,
        canGoToNext: this.canGoToNext,
        canGoToPrevious: this.canGoToPrevious
      }
    }
  },
  methods: {
    previous: function previous () {
      return this.canGoToPrevious
        ? this.goToSlide(this.slide - 1)
        : Promise.resolve()
    },
    next: function next () {
      return this.canGoToNext
        ? this.goToSlide(this.slide + 1)
        : Promise.resolve()
    },
    goToSlide: function goToSlide (slide, fromSwipe) {
      var this$1 = this;
      if ( fromSwipe === void 0 ) fromSwipe = false;

      return new Promise(function (resolve, reject) {
        var
          direction = '',
          pos;

        this$1.__cleanup();

        var finish = function () {
          this$1.$emit('input', this$1.slide);
          this$1.$emit('slide-direction', direction);
          this$1.__planAutoPlay();
          resolve();
        };

        if (this$1.slidesNumber < 2) {
          this$1.slide = 0;
          this$1.positionSlide = 0;
          pos = 0;
        }
        else {
          if (!this$1.hasOwnProperty('initialPosition')) {
            this$1.position = -this$1.slide * 100;
          }
          direction = slide > this$1.slide ? 'next' : 'previous';
          if (this$1.infinite) {
            this$1.slide = normalizeToInterval(slide, 0, this$1.slidesNumber - 1);
            pos = normalizeToInterval(slide, -1, this$1.slidesNumber);
            if (!fromSwipe) {
              this$1.positionSlide = pos;
            }
          }
          else {
            this$1.slide = between(slide, 0, this$1.slidesNumber - 1);
            this$1.positionSlide = this$1.slide;
            pos = this$1.slide;
          }
        }

        pos = pos * -100;

        if (!this$1.animation) {
          this$1.position = pos;
          finish();
          return
        }

        this$1.animationInProgress = true;

        this$1.animUid = start({
          from: this$1.position,
          to: pos,
          duration: isNumber(this$1.animation) ? this$1.animation : 300,
          easing: fromSwipe
            ? this$1.swipeEasing || decelerate
            : this$1.easing || standard,
          apply: function (pos) {
            this$1.position = pos;
          },
          done: function () {
            if (this$1.infinite) {
              this$1.position = -this$1.slide * 100;
              this$1.positionSlide = this$1.slide;
            }
            this$1.animationInProgress = false;
            finish();
          }
        });
      })
    },
    stopAnimation: function stopAnimation () {
      stop(this.animUid);
      this.animationInProgress = false;
    },
    __pan: function __pan (event) {
      var this$1 = this;

      if (this.infinite && this.animationInProgress) {
        return
      }
      if (event.isFirst) {
        this.initialPosition = this.position;
        this.__cleanup();
      }

      var delta = (event.direction === 'left' ? -1 : 1) * event.distance.x;

      if (
        (this.infinite && this.slidesNumber < 2) ||
        (
          !this.infinite &&
          (
            (this.slide === 0 && delta > 0) ||
            (this.slide === this.slidesNumber - 1 && delta < 0)
          )
        )
      ) {
        delta = delta / 10;
      }

      this.position = this.initialPosition + delta / this.$refs.track.offsetWidth * 100;
      this.positionSlide = (event.direction === 'left' ? this.slide + 1 : this.slide - 1);

      if (event.isFinal) {
        this.goToSlide(
          event.distance.x < 100
            ? this.slide
            : this.positionSlide,
          true
        ).then(function () {
          delete this$1.initialPosition;
        });
      }
    },
    __planAutoPlay: function __planAutoPlay () {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.autoplay) {
          clearTimeout(this$1.timer);
          this$1.timer = setTimeout(
            this$1.next,
            isNumber(this$1.autoplay) ? this$1.autoplay : 5000
          );
        }
      });
    },
    __cleanup: function __cleanup () {
      this.stopAnimation();
      clearTimeout(this.timer);
    },
    __handleArrowKey: function __handleArrowKey (e) {
      var key = getEventKey(e);

      if (key === 37) { // left arrow key
        this.previous();
      }
      else if (key === 39) { // right arrow key
        this.next();
      }
    },
    __setArrowKeys: function __setArrowKeys (/* boolean */ state) {
      var op = (state === true ? 'add' : 'remove') + "EventListener";
      document[op]('keydown', this.__handleArrowKey);
    },
    __registerSlide: function __registerSlide () {
      this.slidesNumber++;
    },
    __unregisterSlide: function __unregisterSlide () {
      this.slidesNumber--;
    },
    __getScopedSlots: function __getScopedSlots (h) {
      var this$1 = this;

      if (this.slidesNumber === 0) {
        return
      }
      var slots = this.$scopedSlots;
      if (slots) {
        return Object.keys(slots)
          .filter(function (key) { return key.startsWith('control-'); })
          .map(function (key) { return slots[key](this$1.slotScope); })
      }
    },
    __getQuickNav: function __getQuickNav (h) {
      var this$1 = this;

      if (this.slidesNumber === 0 || !this.quickNav) {
        return
      }

      var
        slot = this.$scopedSlots['quick-nav'],
        items = [];

      if (slot) {
        var loop = function ( i ) {
          items.push(slot({
            slide: i,
            before: i < this$1.slide,
            current: i === this$1.slide,
            after: i > this$1.slide,
            color: this$1.color,
            goToSlide: function (slide) { this$1.goToSlide(slide || i); }
          }));
        };

        for (var i = 0; i < this.slidesNumber; i++) loop( i );
      }
      else {
        var loop$1 = function ( i ) {
          items.push(h(QBtn, {
            key: i,
            'class': { inactive: i !== this$1.slide },
            props: {
              icon: this$1.quickNavIcon,
              round: true,
              small: true,
              flat: true,
              color: this$1.color
            },
            on: {
              click: function () {
                this$1.goToSlide(i);
              }
            }
          }));
        };

        for (var i$1 = 0; i$1 < this.slidesNumber; i$1++) loop$1( i$1 );
      }

      return h('div', {
        staticClass: 'q-carousel-quick-nav absolute-bottom scroll text-center',
        'class': ("text-" + (this.color))
      }, items)
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-carousel',
      style: this.computedStyle,
      'class': { fullscreen: this.inFullscreen }
    }, [
      h('div', {
        staticClass: 'q-carousel-inner',
        directives: this.noSwipe
          ? null
          : [{
            name: 'touch-pan',
            modifiers: { horizontal: true },
            value: this.__pan
          }]
      }, [
        h('div', {
          ref: 'track',
          staticClass: 'q-carousel-track',
          style: this.trackPosition,
          'class': {
            'infinite-left': this.infiniteLeft,
            'infinite-right': this.infiniteRight
          }
        }, [
          h('div', { staticClass: 'q-carousel-slide', style: ("flex: 0 0 " + (100) + "%"), directives: [{ name: 'show', value: this.infiniteRight }] }),
          this.$slots.default,
          h('div', { staticClass: 'q-carousel-slide', style: ("flex: 0 0 " + (100) + "%"), directives: [{ name: 'show', value: this.infiniteLeft }] })
        ])
      ]),
      this.arrows ? h(QBtn, {
        staticClass: 'q-carousel-left-arrow absolute',
        props: { color: this.color, icon: 'chevron_left', round: true, small: true, flat: true },
        directives: [{ name: 'show', value: this.canGoToPrevious }],
        on: { click: this.previous }
      }) : null,
      this.arrows ? h(QBtn, {
        staticClass: 'q-carousel-right-arrow absolute',
        props: { color: this.color, icon: 'chevron_right', round: true, small: true, flat: true },
        directives: [{ name: 'show', value: this.canGoToNext }],
        on: { click: this.next }
      }) : null,
      this.__getQuickNav(h),
      this.__getScopedSlots(h),
      this.$slots.control
    ])
  },
  mounted: function mounted () {
    var this$1 = this;

    this.__planAutoPlay();
    if (this.handleArrowKeys) {
      this.__setArrowKeys(true);
    }
    this.__stopSlideNumberNotifier = this.$watch('slidesNumber', function (val) {
      this$1.$emit('slides-number', val);
      if (this$1.value >= val) {
        this$1.$emit('input', val - 1);
      }
    }, { immediate: true });
  },
  beforeDestroy: function beforeDestroy () {
    this.__cleanup();
    this.__stopSlideNumberNotifier();
    if (this.handleArrowKeys) {
      this.__setArrowKeys(false);
    }
  }
};

var QCarouselSlide = {
  name: 'q-carousel-slide',
  inject: {
    carousel: {
      default: function default$1 () {
        console.error('QCarouselSlide needs to be child of QCarousel');
      }
    }
  },
  props: {
    imgSrc: String
  },
  computed: {
    computedStyle: function computedStyle () {
      var style = {};
      if (this.imgSrc) {
        style.backgroundImage = "url(" + (this.imgSrc) + ")";
        style.backgroundSize = "cover";
        style.backgroundPosition = "50%";
      }
      if (!this.carousel.inFullscreen && this.carousel.height) {
        style.maxHeight = this.carousel.height;
      }
      return style
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-carousel-slide relative-position scroll',
      style: this.computedStyle
    }, this.$slots.default)
  },
  created: function created () {
    this.carousel.__registerSlide();
  },
  beforeDestroy: function beforeDestroy () {
    this.carousel.__unregisterSlide();
  }
};

var QCarouselControl = {
  name: 'q-carousel-control',
  props: {
    position: {
      type: String,
      default: 'bottom-right'
    },
    offset: {
      type: Array,
      default: function () { return [18, 18]; }
    }
  },
  computed: {
    computedClass: function computedClass () {
      return ("absolute-" + (this.position))
    },
    computedStyle: function computedStyle () {
      return {
        margin: ((this.offset[1]) + "px " + (this.offset[0]) + "px")
      }
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-carousel-control absolute',
      style: this.computedStyle,
      'class': this.computedClass
    }, this.$slots.default)
  }
};

var QChatMessage = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-message",class:{ 'q-message-sent': _vm.sent, 'q-message-received': !_vm.sent }},[(_vm.label)?_c('p',{staticClass:"q-message-label text-center",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),(_vm.avatar)?_c('div',{staticClass:"q-message-container row items-end no-wrap"},[_vm._t("avatar",[_c('img',{staticClass:"q-message-avatar",attrs:{"src":_vm.avatar}})]),_vm._v(" "),_c('div',{class:_vm.sizeClass},[(_vm.name)?_c('div',{staticClass:"q-message-name",domProps:{"innerHTML":_vm._s(_vm.name)}}):_vm._e(),_vm._v(" "),_vm._l((_vm.text),function(msg){return _c('div',{key:msg,staticClass:"q-message-text",class:_vm.messageClass},[_c('span',{staticClass:"q-message-text-content",class:_vm.textClass},[_c('div',{domProps:{"innerHTML":_vm._s(msg)}}),_vm._v(" "),(_vm.stamp)?_c('div',{staticClass:"q-message-stamp",domProps:{"innerHTML":_vm._s(_vm.stamp)}}):_vm._e()])])}),_vm._v(" "),(!_vm.text || !_vm.text.length)?_c('div',{staticClass:"q-message-text",class:_vm.messageClass},[_c('span',{staticClass:"q-message-text-content",class:_vm.textClass},[_vm._t("default"),_vm._v(" "),(_vm.stamp)?_c('div',{staticClass:"q-message-stamp",domProps:{"innerHTML":_vm._s(_vm.stamp)}}):_vm._e()],2)]):_vm._e()],2)],2):_vm._e()])},staticRenderFns: [],
  name: 'q-chat-message',
  props: {
    sent: Boolean,
    label: String,

    bgColor: String,
    textColor: String,

    name: String,
    avatar: String,
    text: Array,
    stamp: String,
    size: String
  },
  computed: {
    textClass: function textClass () {
      if (this.textColor) {
        return ("text-" + (this.textColor))
      }
    },
    messageClass: function messageClass () {
      if (this.bgColor) {
        return ("text-" + (this.bgColor))
      }
    },
    sizeClass: function sizeClass () {
      if (this.size) {
        return ("col-" + (this.size))
      }
    }
  }
};

var Mixin = {
  props: {
    value: {
      type: [Boolean, Array],
      required: true
    },
    val: {}
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (val) {
        if (this.value !== val) {
          this.$emit('input', val);
        }
      }
    },
    isArray: function isArray () {
      return Array.isArray(this.value)
    },
    index: function index () {
      if (this.isArray) {
        return this.model.indexOf(this.val)
      }
    },
    isActive: function isActive () {
      return this.isArray
        ? this.model.indexOf(this.val) > -1
        : this.model
    }
  },
  methods: {
    toggle: function toggle (withBlur) {
      if (withBlur !== false) {
        this.$el.blur();
      }

      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index !== -1) {
          this.unselect();
        }
        else {
          this.select();
        }
        return
      }
      this.model = !this.model;
      this.__onChange();
    },
    select: function select () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index === -1) {
          this.model.push(this.val);
          this.__onChange();
        }
        return
      }
      this.model = true;
      this.__onChange();
    },
    unselect: function unselect () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index > -1) {
          this.model.splice(this.index, 1);
          this.__onChange();
        }
        return
      }
      this.model = false;
      this.__onChange();
    },
    __change: function __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle();
      }
      else {
        this.__onChange();
      }
    },
    __onChange: function __onChange () {
      var this$1 = this;

      var ref = this.$refs.ripple;
      if (ref) {
        ref.classList.add('active');
        setTimeout(function () {
          ref.classList.remove('active');
        }, 10);
      }
      this.$nextTick(function () {
        this$1.$emit('change', this$1.model);
      });
    }
  }
};

var OptionMixin = {
  props: {
    label: String,
    leftLabel: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    keepColor: Boolean,
    dark: Boolean,
    disable: Boolean
  },
  computed: {
    innerClasses: function innerClasses () {
      if (this.isActive || this.indeterminate) {
        return ['active', ("text-" + (this.color))]
      }
      else {
        var color = this.keepColor
          ? this.color
          : (this.dark ? 'light' : 'dark');

        return ("text-" + color)
      }
    }
  }
};

var QCheckbox = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-checkbox q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center",class:{disabled: _vm.disable, reverse: _vm.leftLabel},attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.toggle($event);},"focus":function($event){_vm.$emit('focus');},"blur":function($event){_vm.$emit('blur');},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.toggle(false);}}},[_c('div',{staticClass:"q-option-inner relative-position",class:_vm.innerClasses},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"checkbox","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":Array.isArray(_vm.model)?_vm._i(_vm.model,_vm.val)>-1:(_vm.model)},on:{"click":function($event){$event.stopPropagation();},"change":[function($event){var $$a=_vm.model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=_vm.val,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.model=$$a.concat([$$v]));}else{$$i>-1&&(_vm.model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.model=$$c;}},_vm.__change]}}),_vm._v(" "),_c('div',{staticClass:"q-focus-helper"}),_vm._v(" "),_c('q-icon',{staticClass:"q-checkbox-icon cursor-pointer",style:(_vm.uncheckedStyle),attrs:{"name":_vm.uncheckedIcon}}),_vm._v(" "),_c('q-icon',{staticClass:"q-checkbox-icon cursor-pointer absolute-full",style:(_vm.indeterminateStyle),attrs:{"name":_vm.indeterminateIcon}}),_vm._v(" "),_c('q-icon',{staticClass:"q-checkbox-icon cursor-pointer absolute-full",style:(_vm.checkedStyle),attrs:{"name":_vm.checkedIcon}}),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{ref:"ripple",staticClass:"q-radial-ripple"}):_vm._e()],1),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"q-option-label",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-checkbox',
  mixins: [Mixin, OptionMixin],
  components: {
    QIcon: QIcon
  },
  props: {
    indeterminate: Boolean,
    checkedIcon: {
      type: String,
      default: 'check_box'
    },
    uncheckedIcon: {
      type: String,
      default: 'check_box_outline_blank'
    },
    indeterminateIcon: {
      type: String,
      default: 'indeterminate_check_box'
    }
  },
  computed: {
    checkedStyle: function checkedStyle () {
      return this.isActive
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    indeterminateStyle: function indeterminateStyle () {
      return this.indeterminate
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    uncheckedStyle: function uncheckedStyle () {
      return this.isActive
        ? {transition: 'opacity 650ms cubic-bezier(0.23, 1, 0.32, 1) 150ms', opacity: 0}
        : {transition: 'opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1) 200ms', opacity: 1}
    }
  }
};

var QChip = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-chip row no-wrap inline items-center",class:_vm.classes,on:{"mousedown":_vm.__onMouseDown,"touchstart":_vm.__onMouseDown,"click":_vm.__onClick}},[(_vm.icon || _vm.avatar)?_c('div',{staticClass:"q-chip-side chip-left row flex-center",class:{'chip-detail': _vm.detail}},[(_vm.icon)?_c('q-icon',{attrs:{"name":_vm.icon}}):(_vm.avatar)?_c('img',{attrs:{"src":_vm.avatar}}):_vm._e()],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-chip-main"},[_vm._t("default")],2),_vm._v(" "),(_vm.iconRight)?_c('q-icon',{staticClass:"on-right",attrs:{"name":_vm.iconRight}}):_vm._e(),_vm._v(" "),(_vm.closable)?_c('div',{staticClass:"q-chip-side chip-right row flex-center"},[(_vm.closable)?_c('q-icon',{staticClass:"cursor-pointer",attrs:{"name":"cancel"},on:{"click":function($event){$event.stopPropagation();_vm.$emit('hide');}}}):_vm._e()],1):_vm._e()],1)},staticRenderFns: [],
  name: 'q-chip',
  components: {
    QIcon: QIcon
  },
  props: {
    small: Boolean,
    tag: Boolean,
    square: Boolean,
    floating: Boolean,
    pointing: {
      type: String,
      validator: function (v) { return ['up', 'right', 'down', 'left'].includes(v); }
    },
    color: String,
    icon: String,
    iconRight: String,
    avatar: String,
    closable: Boolean,
    detail: Boolean
  },
  computed: {
    classes: function classes () {
      var cls = [{
        tag: this.tag,
        square: this.square,
        floating: this.floating,
        pointing: this.pointing,
        small: this.small || this.floating
      }];
      this.pointing && cls.push(("pointing-" + (this.pointing)));
      if (this.color) {
        cls.push(("bg-" + (this.color)));
        cls.push("text-white");
      }
      return cls
    }
  },
  methods: {
    __onClick: function __onClick (e) {
      this.$emit('click', e);
    },
    __onMouseDown: function __onMouseDown (e) {
      this.$emit('focus', e);
    }
  }
};

var marginal = {
  type: Array,
  validator: function (v) { return v.every(function (i) { return 'icon' in i; }); }
};

var align = {
  left: 'start',
  center: 'center',
  right: 'end'
};

var FrameMixin = {
  components: {
    QIcon: QIcon
  },
  props: {
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    error: Boolean,
    warning: Boolean,
    disable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    align: {
      type: String,
      default: 'left',
      validator: function (v) { return ['left', 'center', 'right'].includes(v); }
    }
  },
  computed: {
    labelIsAbove: function labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    alignClass: function alignClass () {
      return ("justify-" + (align[this.align]))
    }
  }
};

var InputMixin = {
  props: {
    autofocus: Boolean,
    name: String,
    maxLength: [Number, String],
    maxHeight: Number,
    placeholder: String,
    loading: Boolean
  },
  data: function data () {
    return {
      focused: false,
      timer: null
    }
  },
  computed: {
    inputPlaceholder: function inputPlaceholder () {
      if ((!this.floatLabel && !this.stackLabel) || this.labelIsAbove) {
        return this.placeholder
      }
    }
  },
  methods: {
    focus: function focus () {
      if (!this.disable) {
        this.$refs.input.focus();
      }
    },
    blur: function blur () {
      this.$refs.input.blur();
    },
    select: function select () {
      this.$refs.input.select();
    },

    __onFocus: function __onFocus (e) {
      clearTimeout(this.timer);
      this.focused = true;
      this.$emit('focus', e);
    },
    __onInputBlur: function __onInputBlur (e) {
      var this$1 = this;

      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        this$1.__onBlur(e);
      }, 200);
    },
    __onBlur: function __onBlur (e) {
      this.focused = false;
      this.$emit('blur', e);
      if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
        this.$emit('input', this.model);
        this.$emit('change', this.model);
      }
    },
    __onKeydown: function __onKeydown (e) {
      this.$emit('keydown', e);
    },
    __onKeyup: function __onKeyup (e) {
      this.$emit('keyup', e);
    },
    __onClick: function __onClick (e) {
      this.focus();
      this.$emit('click', e);
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      var input = this$1.$refs.input;
      if (this$1.autofocus && input) {
        input.focus();
      }
    });
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
  }
};

var QInputFrame = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-if row no-wrap items-center relative-position",class:_vm.classes,attrs:{"tabindex":_vm.focusable && !_vm.disable ? 0 : null},on:{"click":_vm.__onClick}},[(_vm.before)?_vm._l((_vm.before),function(item){return _c('q-icon',{key:item.icon,staticClass:"q-if-control q-if-control-before",class:{hidden: _vm.__additionalHidden(item, _vm.hasError, _vm.hasWarning, _vm.length)},attrs:{"name":item.icon},on:{"mousedown":_vm.__onMouseDown,"touchstart":_vm.__onMouseDown,"click":function($event){_vm.__baHandler($event, item);}}})}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-if-inner col row no-wrap items-center relative-position"},[(_vm.label)?_c('div',{staticClass:"q-if-label ellipsis full-width absolute self-start",class:{'q-if-label-above': _vm.labelIsAbove},domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),(_vm.prefix)?_c('span',{staticClass:"q-if-addon q-if-addon-left",class:_vm.addonClass,domProps:{"innerHTML":_vm._s(_vm.prefix)}}):_vm._e(),_vm._v(" "),_vm._t("default"),_vm._v(" "),(_vm.suffix)?_c('span',{staticClass:"q-if-addon q-if-addon-right",class:_vm.addonClass,domProps:{"innerHTML":_vm._s(_vm.suffix)}}):_vm._e()],2),_vm._v(" "),_vm._t("after"),_vm._v(" "),(_vm.after)?_vm._l((_vm.after),function(item){return _c('q-icon',{key:item.icon,staticClass:"q-if-control",class:{hidden: _vm.__additionalHidden(item, _vm.hasError, _vm.hasWarning, _vm.length)},attrs:{"name":item.icon},on:{"mousedown":_vm.__onMouseDown,"touchstart":_vm.__onMouseDown,"click":function($event){_vm.__baHandler($event, item);}}})}):_vm._e()],2)},staticRenderFns: [],
  name: 'q-input-frame',
  mixins: [FrameMixin],
  props: {
    topAddons: Boolean,
    focused: Boolean,
    length: Number,
    focusable: Boolean,
    additionalLength: Boolean
  },
  data: function data () {
    return {
      field: {}
    }
  },
  inject: {
    __field: { default: null }
  },
  computed: {
    label: function label () {
      return this.stackLabel || this.floatLabel
    },
    addonClass: function addonClass () {
      return {
        'q-if-addon-visible': this.labelIsAbove,
        'self-start': this.topAddons
      }
    },
    classes: function classes () {
      var cls = [{
        'q-if-has-label': this.label,
        'q-if-focused': this.focused,
        'q-if-error': this.hasError,
        'q-if-warning': this.hasWarning,
        'q-if-disabled': this.disable,
        'q-if-focusable': this.focusable && !this.disable,
        'q-if-inverted': this.inverted,
        'q-if-dark': this.dark || this.inverted
      }];

      var color = this.hasError ? 'negative' : this.hasWarning ? 'warning' : this.color;
      if (this.inverted) {
        cls.push(("bg-" + color));
        cls.push("text-white");
      }
      else {
        cls.push(("text-" + color));
      }
      return cls
    },
    hasError: function hasError () {
      return !!(this.field.error || this.error)
    },
    hasWarning: function hasWarning () {
      // error is the higher priority
      return !!(!this.hasError && (this.field.warning || this.warning))
    }
  },
  methods: {
    __onClick: function __onClick (e) {
      this.$emit('click', e);
    },
    __onMouseDown: function __onMouseDown (e) {
      var this$1 = this;

      this.$nextTick(function () { return this$1.$emit('focus', e); });
    },
    __additionalHidden: function __additionalHidden (item, hasError, hasWarning, length) {
      if (item.condition !== void 0) {
        return item.condition === false
      }
      return (
        (item.content !== void 0 && !item.content === (length > 0)) ||
        (item.error !== void 0 && !item.error === hasError) ||
        (item.warning !== void 0 && !item.warning === hasWarning)
      )
    },
    __baHandler: function __baHandler (evt, item) {
      if (!item.allowPropagation) {
        evt.stopPropagation();
      }
      if (item.handler) {
        item.handler(evt);
      }
    }
  },
  created: function created () {
    if (this.__field) {
      this.field = this.__field;
      this.field.__registerInput(this);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput();
    }
  }
};

var QChipsInput = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{staticClass:"q-chips-input",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.inverted ? _vm.frameColor || _vm.color : _vm.color,"focused":_vm.focused,"length":_vm.length,"additional-length":_vm.input.length > 0},on:{"click":_vm.__onClick}},[_c('div',{staticClass:"col row items-center group q-input-chips"},[_vm._l((_vm.model),function(label,index){return _c('q-chip',{key:label,attrs:{"small":"","closable":!_vm.disable,"color":_vm.color},on:{"focus":_vm.__clearTimer,"hide":function($event){_vm.remove(index);}}},[_vm._v(" "+_vm._s(label)+" ")])}),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.input),expression:"input"}],ref:"input",staticClass:"col q-input-target",class:[("text-" + (_vm.align))],attrs:{"name":_vm.name,"placeholder":_vm.inputPlaceholder,"disabled":_vm.disable,"max-length":_vm.maxLength},domProps:{"value":(_vm.input)},on:{"focus":_vm.__onFocus,"blur":_vm.__onInputBlur,"keydown":_vm.__handleKey,"keyup":_vm.__onKeyup,"input":function($event){if($event.target.composing){ return; }_vm.input=$event.target.value;}}})],2),_vm._v(" "),(!_vm.disable)?_c('q-icon',{staticClass:"q-if-control self-end",class:{invisible: !_vm.input.length},attrs:{"slot":"after","name":"send"},on:{"mousedown":_vm.__clearTimer,"touchstart":_vm.__clearTimer,"click":function($event){_vm.add();}},slot:"after"}):_vm._e()],1)},staticRenderFns: [],
  name: 'q-chips-input',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame: QInputFrame,
    QChip: QChip
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    frameColor: String
  },
  data: function data () {
    return {
      input: '',
      model: [].concat( this.value )
    }
  },
  watch: {
    value: function value (v) {
      if (Array.isArray(v)) {
        this.model = [].concat( v );
      }
      else {
        this.model = [];
      }
    }
  },
  computed: {
    length: function length () {
      return this.model
        ? this.model.length
        : 0
    }
  },
  methods: {
    add: function add (value) {
      if ( value === void 0 ) value = this.input;

      clearTimeout(this.timer);
      this.focus();
      if (!this.disable && value) {
        this.model.push(value);
        this.$emit('input', this.model);
        this.input = '';
      }
    },
    remove: function remove (index) {
      clearTimeout(this.timer);
      this.focus();
      if (!this.disable && index >= 0 && index < this.length) {
        this.model.splice(index, 1);
        this.$emit('input', this.model);
      }
    },
    __clearTimer: function __clearTimer () {
      var this$1 = this;

      this.$nextTick(function () { return clearTimeout(this$1.timer); });
    },
    __handleKey: function __handleKey (e) {
      // ENTER key
      if (e.which === 13 || e.keyCode === 13) {
        this.add();
      }
      // Backspace key
      else if (e.which === 8 || e.keyCode === 8) {
        if (!this.input.length && this.length) {
          this.remove(this.length - 1);
        }
      }
      else {
        this.__onKeydown(e);
      }
    },
    __onClick: function __onClick () {
      this.focus();
    }
  }
};

function getHeight (el, style$$1) {
  var initial = {
    visibility: el.style.visibility,
    maxHeight: el.style.maxHeight
  };

  css(el, {
    visibility: 'hidden',
    maxHeight: ''
  });
  var height$$1 = style$$1.height;
  css(el, initial);

  return parseFloat(height$$1)
}

function parseSize (padding) {
  return padding.split(' ').map(function (t) {
    var unit = t.match(/[a-zA-Z]+/) || '';
    if (unit) {
      unit = unit[0];
    }
    return [parseFloat(t), unit]
  })
}

function toggleSlide (el, showing, done) {
  var store = el.__qslidetoggle || {};
  function anim () {
    store.uid = start({
      to: showing ? 100 : 0,
      from: store.pos !== null ? store.pos : showing ? 0 : 100,
      apply: function apply (pos) {
        store.pos = pos;
        css(el, {
          maxHeight: ((store.height * pos / 100) + "px"),
          padding: store.padding ? store.padding.map(function (t) { return (t[0] * pos / 100) + t[1]; }).join(' ') : '',
          margin: store.margin ? store.margin.map(function (t) { return (t[0] * pos / 100) + t[1]; }).join(' ') : ''
        });
      },
      done: function done$1 () {
        store.uid = null;
        store.pos = null;
        done();
        css(el, store.css);
      }
    });
    el.__qslidetoggle = store;
  }

  if (store.uid) {
    stop(store.uid);
    return anim()
  }

  store.css = {
    overflowY: el.style.overflowY,
    maxHeight: el.style.maxHeight,
    padding: el.style.padding,
    margin: el.style.margin
  };
  var style$$1 = window.getComputedStyle(el);
  if (style$$1.padding && style$$1.padding !== '0px') {
    store.padding = parseSize(style$$1.padding);
  }
  if (style$$1.margin && style$$1.margin !== '0px') {
    store.margin = parseSize(style$$1.margin);
  }
  store.height = getHeight(el, style$$1);
  store.pos = null;
  el.style.overflowY = 'hidden';
  anim();
}

var slideAnimation = {
  enter: function enter (el, done) {
    toggleSlide(el, true, done);
  },
  leave: function leave (el, done) {
    toggleSlide(el, false, done);
  }
};

var QSlideTransition = {
  name: 'q-slide-transition',
  functional: true,
  props: {
    appear: Boolean
  },
  render: function render (h, ctx) {
    var data = {
      props: {
        mode: 'out-in',
        css: false,
        appear: ctx.props.appear
      },
      on: slideAnimation
    };
    return h('transition', data, ctx.children)
  }
};

var eventName = 'q:collapsible:close';

var QCollapsible = {
  name: 'q-collapsible',
  mixins: [ModelToggleMixin],
  modelToggle: {
    history: false
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    disable: Boolean,
    popup: Boolean,
    indent: Boolean,
    group: String,
    iconToggle: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    noRipple: Boolean,

    dense: Boolean,
    sparse: Boolean,
    multiline: Boolean,

    icon: String,
    rightIcon: String,
    image: String,
    rightImage: String,
    avatar: String,
    rightAvatar: String,
    letter: String,
    rightLetter: String,
    label: String,
    sublabel: String,
    labelLines: [String, Number],
    sublabelLines: [String, Number]
  },
  computed: {
    cfg: function cfg () {
      return {
        link: !this.iconToggle,
        headerStyle: [Array, String, Object],
        headerClass: [Array, String, Object],

        dark: this.dark,
        dense: this.dense,
        sparse: this.sparse,
        multiline: this.multiline,

        icon: this.icon,
        rightIcon: this.rightIcon,
        image: this.image,
        rightImage: this.rightImage,
        avatar: this.avatar,
        rightAvatar: this.rightAvatar,
        letter: this.letter,
        rightLetter: this.rightLetter,

        label: this.label,
        sublabel: this.sublabel,
        labelLines: this.labelLines,
        sublabelLines: this.sublabelLines
      }
    },
    hasRipple: function hasRipple () {
      return "mat" === 'mat' && !this.noRipple
    },
    classes: function classes () {
      return {
        'q-collapsible-opened': this.popup && this.showing,
        'q-collapsible-closed': this.popup && !this.showing,
        'q-item-separator': this.separator,
        'q-item-inset-separator': this.insetSeparator,
        disabled: this.disable
      }
    }
  },
  watch: {
    showing: function showing (val) {
      if (val && this.group) {
        this.$root.$emit(eventName, this);
      }
    }
  },
  methods: {
    __toggleItem: function __toggleItem () {
      if (!this.iconToggle) {
        this.toggle();
      }
    },
    __toggleIcon: function __toggleIcon (e) {
      if (this.iconToggle) {
        e && e.stopPropagation();
        this.toggle();
      }
    },
    __eventHandler: function __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.hide();
      }
    },
    __getToggleSide: function __getToggleSide (h, slot) {
      return [
        h(QItemTile, {
          slot: slot ? 'right' : undefined,
          staticClass: 'cursor-pointer transition-generic relative-position',
          'class': {
            'rotate-180': this.showing,
            invisible: this.disable
          },
          on: {
            click: this.__toggleIcon
          },
          props: { icon: 'keyboard_arrow_down' },
          directives: this.iconToggle && this.hasRipple
            ? [{ name: 'ripple', value: !this.disable }]
            : []
        })
      ]
    },
    __getItemProps: function __getItemProps (wrapper) {
      return {
        props: wrapper
          ? { cfg: this.cfg }
          : { link: !this.iconToggle },
        style: this.headerStyle,
        'class': this.headerClass,
        on: {
          click: this.__toggleItem
        },
        directives: this.hasRipple && !this.iconToggle
          ? [{ name: 'ripple', value: !this.disable }]
          : []
      }
    }
  },
  created: function created () {
    this.$root.$on(eventName, this.__eventHandler);
    if (this.value) {
      this.show();
    }
  },
  beforeDestroy: function beforeDestroy () {
    this.$root.$off(eventName, this.__eventHandler);
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-collapsible q-item-division relative-position',
      'class': this.classes
    }, [
      h('div', {
        staticClass: 'q-collapsible-inner'
      }, [
        this.$slots.header
          ? h(QItem, this.__getItemProps(), [
            this.$slots.header,
            h(QItemSide, { props: { right: true }, staticClass: 'relative-position' }, this.__getToggleSide(h))
          ])
          : h(QItemWrapper, this.__getItemProps(true), this.__getToggleSide(h, true)),

        h(QSlideTransition, [
          h('div', {
            directives: [{ name: 'show', value: this.showing }]
          }, [
            h('div', {
              staticClass: 'q-collapsible-sub-item relative-position',
              'class': { indent: this.indent }
            }, [
              this.$slots.default
            ])
          ])
        ])
      ])
    ])
  }
};

var ContextMenuDesktop = {
  name: 'q-context-menu',
  components: {
    QPopover: QPopover
  },
  props: {
    disable: Boolean
  },
  render: function render (h) {
    var this$1 = this;

    return h(QPopover, {
      ref: 'popover',
      props: {
        anchorClick: false
      },
      on: {
        show: function () { this$1.$emit('show'); },
        hide: function () { this$1.$emit('hide'); }
      }
    }, this.$slots.default)
  },
  methods: {
    hide: function hide () {
      return this.$refs.popover.hide()
    },
    __show: function __show (evt) {
      var this$1 = this;

      if (!evt || this.disable) {
        return
      }
      this.hide();
      evt.preventDefault();
      evt.stopPropagation();
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(function () {
        this$1.$refs.popover.show(evt);
      }, 100);
    }
  },
  mounted: function mounted () {
    this.target = this.$refs.popover.$el.parentNode;
    this.target.addEventListener('contextmenu', this.__show);
  },
  beforeDestroy: function beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.__show);
  }
};

var ContextMenuMobile = {
  name: 'q-context-menu',
  props: {
    disable: Boolean
  },
  methods: {
    hide: function hide () {
      this.target.classList.remove('non-selectable');
      return this.$refs.dialog.hide()
    },
    __show: function __show () {
      if (!this.disable && this.$refs.dialog) {
        this.$refs.dialog.show();
      }
    },
    __touchStartHandler: function __touchStartHandler (evt) {
      var this$1 = this;

      this.target.classList.add('non-selectable');
      this.touchTimer = setTimeout(function () {
        evt.preventDefault();
        evt.stopPropagation();
        setTimeout(function () {
          this$1.__cleanup();
          this$1.__show();
        }, 10);
      }, 600);
    },
    __cleanup: function __cleanup () {
      this.target.classList.remove('non-selectable');
      clearTimeout(this.touchTimer);
    }
  },
  render: function render (h) {
    var this$1 = this;

    return h(QModal, {
      ref: 'dialog',
      props: {
        minimized: true
      },
      on: {
        show: function () { this$1.$emit('show'); },
        hide: function () { this$1.$emit('hide'); }
      }
    }, this.$slots.default)
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.target = this$1.$el.parentNode;
      this$1.target.addEventListener('touchstart', this$1.__touchStartHandler)
      ;['touchcancel', 'touchmove', 'touchend'].forEach(function (evt) {
        this$1.target.addEventListener(evt, this$1.__cleanup);
      });
    });
  },
  beforeDestroy: function beforeDestroy () {
    var this$1 = this;

    this.target.removeEventListener('touchstart', this.__touchStartHandler)
    ;['touchcancel', 'touchmove', 'touchend'].forEach(function (evt) {
      this$1.target.removeEventListener(evt, this$1.__cleanup);
    });
  }
};

var QContextMenu = {
  name: 'q-context-menu',
  functional: true,
  render: function render (h, ctx) {
    return h(
      Platform.is.mobile ? ContextMenuMobile : ContextMenuDesktop,
      ctx.data,
      ctx.children
    )
  }
};

var modelValidator = function (v) {
  var type = typeof v;
  return (
    v === null || v === undefined ||
    type === 'number' || type === 'string' ||
    isDate(v)
  )
};

var inline = {
  value: {
    validator: modelValidator,
    required: true
  },
  type: {
    type: String,
    default: 'date',
    validator: function validator (value) {
      return ['date', 'time', 'datetime'].includes(value)
    }
  },
  color: {
    type: String,
    default: 'primary'
  },
  min: {
    validator: modelValidator,
    default: null
  },
  max: {
    validator: modelValidator,
    default: null
  },
  firstDayOfWeek: Number,
  format24h: {
    type: [Boolean, Number],
    default: 0,
    validator: function (v) { return [true, false, 0].includes(v); }
  }
};

var input = {
  format: String,
  noClear: Boolean,
  placeholder: String,
  clearLabel: String,
  okLabel: String,
  cancelLabel: String
};

/* eslint no-fallthrough: 0 */

var MILLISECONDS_IN_DAY = 86400000;
var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var token = /\[((?:[^\]\\]|\\]|\\)*)\]|d{1,4}|M{1,4}|m{1,2}|w{1,2}|Qo|Do|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]/g;

function formatTimezone (offset, delimeter) {
  if ( delimeter === void 0 ) delimeter = '';

  var
    sign = offset > 0 ? '-' : '+',
    absOffset = Math.abs(offset),
    hours = Math.floor(absOffset / 60),
    minutes = absOffset % 60;

  return sign + pad(hours) + delimeter + pad(minutes)
}

function setMonth (date, newMonth /* 1-based */) {
  var
    test = new Date(date.getFullYear(), newMonth, 0, 0, 0, 0, 0),
    days = test.getDate();

  date.setMonth(newMonth - 1, Math.min(days, date.getDate()));
}

function getChange (date, mod, add) {
  var
    t = new Date(date),
    sign = (add ? 1 : -1);

  Object.keys(mod).forEach(function (key) {
    if (key === 'month') {
      setMonth(t, t.getMonth() + 1 + sign * mod.month);
      return
    }

    var op = key === 'year'
      ? 'FullYear'
      : capitalize(key === 'days' ? 'date' : key);
    t[("set" + op)](t[("get" + op)]() + sign * mod[key]);
  });
  return t
}

function isValid (date) {
  var t = Date.parse(date);
  return isNaN(t) === false
}

function buildDate (mod, utc) {
  return adjustDate(new Date(), mod, utc)
}

function getDayOfWeek (date) {
  var dow = new Date(date).getDay();
  return dow === 0 ? 7 : dow
}

function getWeekOfYear (date) {
  // Remove time components of date
  var thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Change date to Thursday same week
  thursday.setDate(thursday.getDate() - ((thursday.getDay() + 6) % 7) + 3);

  // Take January 4th as it is always in week 1 (see ISO 8601)
  var firstThursday = new Date(thursday.getFullYear(), 0, 4);

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

  // Check if daylight-saving-time-switch occurred and correct for it
  var ds = thursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
  thursday.setHours(thursday.getHours() - ds);

  // Number of weeks between target Thursday and first Thursday
  var weekDiff = (thursday - firstThursday) / (MILLISECONDS_IN_DAY * 7);
  return 1 + Math.floor(weekDiff)
}

function isBetweenDates (date, from, to) {
  var
    d1 = new Date(from).getTime(),
    d2 = new Date(to).getTime(),
    cur = new Date(date).getTime();

  return cur > d1 && cur < d2
}

function addToDate (date, mod) {
  return getChange(date, mod, true)
}
function subtractFromDate (date, mod) {
  return getChange(date, mod, false)
}

function adjustDate (date, mod, utc) {
  var
    t = new Date(date),
    prefix = "set" + (utc ? 'UTC' : '');

  Object.keys(mod).forEach(function (key) {
    if (key === 'month') {
      setMonth(t, mod.month);
      return
    }

    var op = key === 'year'
      ? 'FullYear'
      : key.charAt(0).toUpperCase() + key.slice(1);
    t[("" + prefix + op)](mod[key]);
  });
  return t
}

function startOfDate (date, unit) {
  var t = new Date(date);
  switch (unit) {
    case 'year':
      t.setMonth(0);
    case 'month':
      t.setDate(1);
    case 'day':
      t.setHours(0);
    case 'hour':
      t.setMinutes(0);
    case 'minute':
      t.setSeconds(0);
    case 'second':
      t.setMilliseconds(0);
  }
  return t
}

function endOfDate (date, unit) {
  var t = new Date(date);
  switch (unit) {
    case 'year':
      t.setMonth(11);
    case 'month':
      t.setDate(daysInMonth(date));
    case 'day':
      t.setHours(23);
    case 'hour':
      t.setMinutes(59);
    case 'minute':
      t.setSeconds(59);
    case 'second':
      t.setMilliseconds(59);
  }
  return t
}

function getMaxDate (date) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var t = new Date(date);
  args.forEach(function (d) {
    t = Math.max(t, new Date(d));
  });
  return t
}
function getMinDate (date) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var t = new Date(date);
  args.forEach(function (d) {
    t = Math.min(t, new Date(d));
  });
  return t
}

function getDiff (t, sub, interval) {
  return (
    (t.getTime() - t.getTimezoneOffset() * MILLISECONDS_IN_MINUTE) -
    (sub.getTime() - sub.getTimezoneOffset() * MILLISECONDS_IN_MINUTE)
  ) / interval
}

function getDateDiff (date, subtract, unit) {
  if ( unit === void 0 ) unit = 'days';

  var
    t = new Date(date),
    sub = new Date(subtract);

  switch (unit) {
    case 'years':
      return (t.getFullYear() - sub.getFullYear())

    case 'months':
      return (t.getFullYear() - sub.getFullYear()) * 12 + t.getMonth() - sub.getMonth()

    case 'days':
      return getDiff(startOfDate(t, 'day'), startOfDate(sub, 'day'), MILLISECONDS_IN_DAY)

    case 'hours':
      return getDiff(startOfDate(t, 'hour'), startOfDate(sub, 'hour'), MILLISECONDS_IN_HOUR)

    case 'minutes':
      return getDiff(startOfDate(t, 'minute'), startOfDate(sub, 'minute'), MILLISECONDS_IN_MINUTE)

    case 'seconds':
      return getDiff(startOfDate(t, 'second'), startOfDate(sub, 'second'), 1000)
  }
}

function getDayOfYear (date) {
  return getDateDiff(date, startOfDate(date, 'year'), 'days') + 1
}

function convertDateToFormat (date, example) {
  if (!date) {
    return
  }

  if (isDate(example)) {
    return date
  }
  if (typeof example === 'number') {
    return date.getTime()
  }

  return formatDate(date)
}

function getDateBetween (date, min, max) {
  var t = new Date(date);

  if (min) {
    var low = new Date(min);
    if (t < low) {
      return low
    }
  }

  if (max) {
    var high = new Date(max);
    if (t > high) {
      return high
    }
  }

  return t
}

function isSameDate (date, date2, unit) {
  var
    t = new Date(date),
    d = new Date(date2);

  if (unit === void 0) {
    return t.getTime() === d.getTime()
  }

  switch (unit) {
    case 'second':
      if (t.getUTCSeconds() !== d.getUTCSeconds()) {
        return false
      }
    case 'minute': // intentional fall-through
      if (t.getUTCMinutes() !== d.getUTCMinutes()) {
        return false
      }
    case 'hour': // intentional fall-through
      if (t.getUTCHours() !== d.getUTCHours()) {
        return false
      }
    case 'day': // intentional fall-through
      if (t.getUTCDate() !== d.getUTCDate()) {
        return false
      }
    case 'month': // intentional fall-through
      if (t.getUTCMonth() !== d.getUTCMonth()) {
        return false
      }
    case 'year': // intentional fall-through
      if (t.getUTCFullYear() !== d.getUTCFullYear()) {
        return false
      }
      break
    default:
      throw new Error(("date isSameDate unknown unit " + unit))
  }

  return true
}

function daysInMonth (date) {
  return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate()
}

function getOrdinal (n) {
  if (n >= 11 && n <= 13) {
    return (n + "th")
  }
  switch (n % 10) {
    case 1: return (n + "st")
    case 2: return (n + "nd")
    case 3: return (n + "rd")
  }
  return (n + "th")
}

var formatter = {
  // Year: 00, 01, ..., 99
  YY: function YY (date) {
    return pad(date.getFullYear(), 4).substr(2)
  },

  // Year: 1900, 1901, ..., 2099
  YYYY: function YYYY (date) {
    return pad(date.getFullYear(), 4)
  },

  // Month: 1, 2, ..., 12
  M: function M (date) {
    return date.getMonth() + 1
  },

  // Month: 01, 02, ..., 12
  MM: function MM (date) {
    return pad(date.getMonth() + 1)
  },

  // Month Short Name: Jan, Feb, ...
  MMM: function MMM (date) {
    return i18n.lang.date.monthsShort[date.getMonth()]
  },

  // Month Name: January, February, ...
  MMMM: function MMMM (date) {
    return i18n.lang.date.months[date.getMonth()]
  },

  // Quarter: 1, 2, 3, 4
  Q: function Q (date) {
    return Math.ceil((date.getMonth() + 1) / 3)
  },

  // Quarter: 1st, 2nd, 3rd, 4th
  Qo: function Qo (date) {
    return getOrdinal(this.Q(date))
  },

  // Day of month: 1, 2, ..., 31
  D: function D (date) {
    return date.getDate()
  },

  // Day of month: 1st, 2nd, ..., 31st
  Do: function Do (date) {
    return getOrdinal(date.getDate())
  },

  // Day of month: 01, 02, ..., 31
  DD: function DD (date) {
    return pad(date.getDate())
  },

  // Day of year: 1, 2, ..., 366
  DDD: function DDD (date) {
    return getDayOfYear(date)
  },

  // Day of year: 001, 002, ..., 366
  DDDD: function DDDD (date) {
    return pad(getDayOfYear(date), 3)
  },

  // Day of week: 0, 1, ..., 6
  d: function d (date) {
    return date.getDay()
  },

  // Day of week: Su, Mo, ...
  dd: function dd (date) {
    return this.dddd(date).slice(0, 2)
  },

  // Day of week: Sun, Mon, ...
  ddd: function ddd (date) {
    return i18n.lang.date.daysShort[date.getDay()]
  },

  // Day of week: Sunday, Monday, ...
  dddd: function dddd (date) {
    return i18n.lang.date.days[date.getDay()]
  },

  // Day of ISO week: 1, 2, ..., 7
  E: function E (date) {
    return date.getDay() || 7
  },

  // Week of Year: 1 2 ... 52 53
  w: function w (date) {
    return getWeekOfYear(date)
  },

  // Week of Year: 01 02 ... 52 53
  ww: function ww (date) {
    return pad(getWeekOfYear(date))
  },

  // Hour: 0, 1, ... 23
  H: function H (date) {
    return date.getHours()
  },

  // Hour: 00, 01, ..., 23
  HH: function HH (date) {
    return pad(date.getHours())
  },

  // Hour: 1, 2, ..., 12
  h: function h (date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12
    }
    if (hours > 12) {
      return hours % 12
    }
    return hours
  },

  // Hour: 01, 02, ..., 12
  hh: function hh (date) {
    return pad(this.h(date))
  },

  // Minute: 0, 1, ..., 59
  m: function m (date) {
    return date.getMinutes()
  },

  // Minute: 00, 01, ..., 59
  mm: function mm (date) {
    return pad(date.getMinutes())
  },

  // Second: 0, 1, ..., 59
  s: function s (date) {
    return date.getSeconds()
  },

  // Second: 00, 01, ..., 59
  ss: function ss (date) {
    return pad(date.getSeconds())
  },

  // 1/10 of second: 0, 1, ..., 9
  S: function S (date) {
    return Math.floor(date.getMilliseconds() / 100)
  },

  // 1/100 of second: 00, 01, ..., 99
  SS: function SS (date) {
    return pad(Math.floor(date.getMilliseconds() / 10))
  },

  // Millisecond: 000, 001, ..., 999
  SSS: function SSS (date) {
    return pad(date.getMilliseconds(), 3)
  },

  // Meridiem: AM, PM
  A: function A (date) {
    return this.H(date) < 12 ? 'AM' : 'PM'
  },

  // Meridiem: am, pm
  a: function a (date) {
    return this.H(date) < 12 ? 'am' : 'pm'
  },

  // Meridiem: a.m., p.m
  aa: function aa (date) {
    return this.H(date) < 12 ? 'a.m.' : 'p.m.'
  },

  // Timezone: -01:00, +00:00, ... +12:00
  Z: function Z (date) {
    return formatTimezone(date.getTimezoneOffset(), ':')
  },

  // Timezone: -0100, +0000, ... +1200
  ZZ: function ZZ (date) {
    return formatTimezone(date.getTimezoneOffset())
  },

  // Seconds timestamp: 512969520
  X: function X (date) {
    return Math.floor(date.getTime() / 1000)
  },

  // Milliseconds timestamp: 512969520900
  x: function x (date) {
    return date.getTime()
  }
};

function formatDate (val, mask) {
  if ( mask === void 0 ) mask = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

  if (!val) {
    return
  }

  var date = new Date(val);

  return mask.replace(token, function (match, text) {
    if (match in formatter) {
      return formatter[match](date)
    }
    return text === void 0
      ? match
      : text.split('\\]').join(']')
  })
}


var date = Object.freeze({
	isValid: isValid,
	buildDate: buildDate,
	getDayOfWeek: getDayOfWeek,
	getWeekOfYear: getWeekOfYear,
	isBetweenDates: isBetweenDates,
	addToDate: addToDate,
	subtractFromDate: subtractFromDate,
	adjustDate: adjustDate,
	startOfDate: startOfDate,
	endOfDate: endOfDate,
	getMaxDate: getMaxDate,
	getMinDate: getMinDate,
	getDateDiff: getDateDiff,
	getDayOfYear: getDayOfYear,
	convertDateToFormat: convertDateToFormat,
	getDateBetween: getDateBetween,
	isSameDate: isSameDate,
	daysInMonth: daysInMonth,
	formatter: formatter,
	formatDate: formatDate
});

var DateMixin = {
  props: inline,
  computed: {
    model: {
      get: function get () {
        var date = this.value
          ? new Date(this.value)
          : (this.defaultSelection ? new Date(this.defaultSelection) : startOfDate(new Date(), 'day'));

        return getDateBetween(
          date,
          this.pmin,
          this.pmax
        )
      },
      set: function set (val) {
        var date = getDateBetween(val, this.pmin, this.pmax);
        if (!isSameDate(this.value, date)) {
          var val$1 = convertDateToFormat(date, this.value);
          this.$emit('input', val$1);
          this.$emit('change', val$1);
        }
      }
    },
    pmin: function pmin () {
      return this.min ? new Date(this.min) : null
    },
    pmax: function pmax () {
      return this.max ? new Date(this.max) : null
    },
    typeHasDate: function typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime: function typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year: function year () {
      return this.model.getFullYear()
    },
    month: function month () {
      return this.model.getMonth() + 1
    },
    day: function day () {
      return this.model.getDate()
    },
    minute: function minute () {
      return this.model.getMinutes()
    },

    yearInterval: function yearInterval () {
      var
        min = this.pmin !== null ? this.pmin.getFullYear() : 1950,
        max = this.pmax !== null ? this.pmax.getFullYear() : 2050;
      return Math.max(1, max - min + 1)
    },
    yearMin: function yearMin () {
      return this.pmin !== null ? this.pmin.getFullYear() - 1 : 1949
    },
    monthInterval: function monthInterval () {
      var
        min = this.pmin !== null && this.pmin.getFullYear() === this.model.getFullYear() ? this.pmin.getMonth() : 0,
        max = this.pmax !== null && this.pmax.getFullYear() === this.model.getFullYear() ? this.pmax.getMonth() : 11;
      return Math.max(1, max - min + 1)
    },
    monthMin: function monthMin () {
      return this.pmin !== null && this.pmin.getFullYear() === this.model.getFullYear()
        ? this.pmin.getMonth()
        : 0
    },

    daysInMonth: function daysInMonth$$1 () {
      return (new Date(this.model.getFullYear(), this.model.getMonth() + 1, 0)).getDate()
    },

    editable: function editable () {
      return !this.disable && !this.readonly
    }
  },

  methods: {
    clear: function clear () {
      if (this.value !== '') {
        this.$emit('input', '');
        this.$emit('change', '');
      }
    },

    toggleAmPm: function toggleAmPm () {
      if (!this.editable) {
        return
      }
      var
        hour = this.model.getHours(),
        offset = this.am ? 12 : -12;

      this.model = new Date(this.model.setHours(hour + offset));
    },

    __parseTypeValue: function __parseTypeValue (type, value) {
      if (type === 'month') {
        return between(value, 1, 12)
      }
      if (type === 'date') {
        return between(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        var
          min = this.pmin ? this.pmin.getFullYear() : 1950,
          max = this.pmax ? this.pmax.getFullYear() : 2050;
        return between(value, min, max)
      }
      if (type === 'hour') {
        return between(value, 0, 23)
      }
      if (type === 'minute') {
        return between(value, 0, 59)
      }
    }
  }
};

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

var QInlineDatetime = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime inline row",class:_vm.classes},[_c('div',{staticClass:"q-datetime-header column col-xs-12 col-md-4 justify-center"},[(_vm.typeHasDate)?_c('div',[_c('div',{staticClass:"q-datetime-weekdaystring col-12"},[_vm._v(_vm._s(_vm.weekDayString))]),_vm._v(" "),_c('div',{staticClass:"q-datetime-datestring row flex-center"},[_c('span',{staticClass:"q-datetime-link small col-auto col-md-12",class:{active: _vm.view === 'month'},on:{"click":function($event){_vm.view = 'month';}}},[_vm._v(" "+_vm._s(_vm.monthString)+" ")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link col-auto col-md-12",class:{active: _vm.view === 'day'},on:{"click":function($event){_vm.view = 'day';}}},[_vm._v(" "+_vm._s(_vm.day)+" ")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link small col-auto col-md-12",class:{active: _vm.view === 'year'},on:{"click":function($event){_vm.view = 'year';}}},[_vm._v(" "+_vm._s(_vm.year)+" ")])])]):_vm._e(),_vm._v(" "),(_vm.typeHasTime)?_c('div',{staticClass:"q-datetime-time row flex-center"},[_c('div',{staticClass:"q-datetime-clockstring col-auto col-md-12"},[_c('span',{staticClass:"q-datetime-link col-auto col-md-12",class:{active: _vm.view === 'hour'},on:{"click":function($event){_vm.view = 'hour';}}},[_vm._v(" "+_vm._s(_vm.__pad(_vm.hour, '  '))+" ")]),_vm._v(" "),_c('span',{staticStyle:{"opacity":"0.6"}},[_vm._v(":")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link col-auto col-md-12",class:{active: _vm.view === 'minute'},on:{"click":function($event){_vm.view = 'minute';}}},[_vm._v(" "+_vm._s(_vm.__pad(_vm.minute))+" ")])]),_vm._v(" "),(!_vm.computedFormat24h)?_c('div',{staticClass:"q-datetime-ampm column col-auto col-md-12 justify-around"},[_c('div',{staticClass:"q-datetime-link",class:{active: _vm.am},on:{"click":function($event){_vm.toggleAmPm();}}},[_vm._v("AM")]),_vm._v(" "),_c('div',{staticClass:"q-datetime-link",class:{active: !_vm.am},on:{"click":function($event){_vm.toggleAmPm();}}},[_vm._v("PM")])]):_vm._e()]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"q-datetime-content col-xs-12 col-md-8 column"},[_c('div',{ref:"selector",staticClass:"q-datetime-selector auto row flex-center"},[(_vm.view === 'year')?_c('div',{staticClass:"q-datetime-view-year full-width full-height"},_vm._l((_vm.yearInterval),function(n){return _c('q-btn',{key:n,staticClass:"q-datetime-btn full-width",class:{active: n + _vm.yearMin === _vm.year},attrs:{"flat":""},on:{"click":function($event){_vm.setYear(n + _vm.yearMin);}}},[_vm._v(" "+_vm._s(n + _vm.yearMin)+" ")])})):_vm._e(),_vm._v(" "),(_vm.view === 'month')?_c('div',{staticClass:"q-datetime-view-month full-width full-height"},_vm._l((_vm.monthInterval),function(index){return _c('q-btn',{key:index,staticClass:"q-datetime-btn full-width",class:{active: _vm.month === index + _vm.monthMin},attrs:{"flat":""},on:{"click":function($event){_vm.setMonth(index + _vm.monthMin, true);}}},[_vm._v(" "+_vm._s(_vm.$q.i18n.date.months[index + _vm.monthMin - 1])+" ")])})):_vm._e(),_vm._v(" "),(_vm.view === 'day')?_c('div',{staticClass:"q-datetime-view-day"},[_c('div',{staticClass:"row items-center content-center"},[_c('q-btn',{attrs:{"round":"","small":"","flat":"","color":_vm.color,"disabled":_vm.beforeMinDays,"icon":"keyboard_arrow_left"},on:{"click":function($event){_vm.setMonth(_vm.month - 1);}}}),_vm._v(" "),_c('div',{staticClass:"col q-datetime-dark"},[_vm._v(" "+_vm._s(_vm.monthStamp)+" ")]),_vm._v(" "),_c('q-btn',{attrs:{"round":"","small":"","flat":"","color":_vm.color,"disabled":_vm.afterMaxDays,"icon":"keyboard_arrow_right"},on:{"click":function($event){_vm.setMonth(_vm.month + 1);}}})],1),_vm._v(" "),_c('div',{staticClass:"q-datetime-weekdays row items-center justify-start"},_vm._l((_vm.headerDayNames),function(day){return _c('div',[_vm._v(_vm._s(day))])})),_vm._v(" "),_c('div',{staticClass:"q-datetime-days row wrap items-center justify-start content-center"},[_vm._l((_vm.fillerDays),function(fillerDay){return _c('div',{staticClass:"q-datetime-fillerday"})}),_vm._v(" "),_vm._l((_vm.beforeMinDays),function(fillerDay){return (_vm.min)?_c('div',{staticClass:"row items-center content-center justify-center disabled"},[_vm._v(" "+_vm._s(fillerDay)+" ")]):_vm._e()}),_vm._v(" "),_vm._l((_vm.daysInterval),function(monthDay){return _c('div',{staticClass:"row items-center content-center justify-center cursor-pointer",class:{ 'q-datetime-day-active': monthDay === _vm.day, 'q-datetime-day-today': monthDay === _vm.today },on:{"click":function($event){_vm.setDay(monthDay);}}},[_c('span',[_vm._v(_vm._s(monthDay))])])}),_vm._v(" "),_vm._l((_vm.afterMaxDays),function(fillerDay){return (_vm.max)?_c('div',{staticClass:"row items-center content-center justify-center disabled"},[_vm._v(" "+_vm._s(fillerDay + _vm.maxDay)+" ")]):_vm._e()})],2)]):_vm._e(),_vm._v(" "),(_vm.view === 'hour' || _vm.view === 'minute')?_c('div',{ref:"clock",staticClass:"column items-center content-center justify-center"},[(_vm.view === 'hour')?_c('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_c('div',{staticClass:"q-datetime-clock-center"}),_vm._v(" "),_c('div',{staticClass:"q-datetime-clock-pointer",style:(_vm.clockPointerStyle)},[_c('span')]),_vm._v(" "),(_vm.computedFormat24h)?_c('div',_vm._l((24),function(n){return _c('div',{staticClass:"q-datetime-clock-position fmt24",class:[("q-datetime-clock-pos-" + (n-1)), (n - 1) === _vm.hour ? 'active' : '']},[_c('span',[_vm._v(_vm._s(n - 1))])])})):_c('div',_vm._l((12),function(n){return _c('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + n, n === _vm.hour ? 'active' : '']},[_c('span',[_vm._v(_vm._s(n))])])}))])]):_vm._e(),_vm._v(" "),(_vm.view === 'minute')?_c('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_c('div',{staticClass:"q-datetime-clock-center"}),_vm._v(" "),_c('div',{staticClass:"q-datetime-clock-pointer",style:(_vm.clockPointerStyle)},[_c('span')]),_vm._v(" "),_vm._l((12),function(n){return _c('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === _vm.minute ? 'active' : '']},[_c('span',[_vm._v(_vm._s((n - 1) * 5))])])})],2)]):_vm._e()]):_vm._e()]),_vm._v(" "),_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-inline-datetime',
  mixins: [DateMixin],
  props: {
    defaultSelection: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean
  },
  components: {
    QBtn: QBtn
  },
  directives: {
    Ripple: Ripple
  },
  data: function data () {
    var view;

    switch (this.type) {
      case 'time':
        view = 'hour';
        break
      case 'date':
      default:
        view = 'day';
        break
    }

    return {
      view: view,
      dragging: false,
      centerClockPos: 0
    }
  },
  watch: {
    value: function value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour';
      }
    },
    view: function view (value) {
      if (value !== 'year' && value !== 'month') {
        return
      }

      var
        view = this.$refs.selector,
        rows = value === 'year' ? this.year - this.yearMin : this.month - this.monthMin;

      this.$nextTick(function () {
        view.scrollTop = rows * height(view.children[0].children[0]) - height(view) / 2.5;
      });
    }
  },
  computed: {
    classes: function classes () {
      var cls = [];
      if (this.disable) {
        cls.push('disabled');
      }
      if (this.readonly) {
        cls.push('readonly');
      }
      if (this.color) {
        cls.push(("text-" + (this.color)));
      }
      return cls
    },
    computedFormat24h: function computedFormat24h () {
      return this.format24h !== 0
        ? this.format24h
        : this.$q.i18n.date.format24h
    },
    computedFirstDayOfWeek: function computedFirstDayOfWeek () {
      return this.firstDayOfWeek !== void 0
        ? this.firstDayOfWeek
        : this.$q.i18n.date.firstDayOfWeek
    },
    headerDayNames: function headerDayNames () {
      var
        days = this.$q.i18n.date.daysShort,
        first = this.computedFirstDayOfWeek;

      return first > 0
        ? days.slice(first, 7).concat(days.slice(0, first))
        : days
    },

    monthString: function monthString () {
      return ("" + (this.$q.i18n.date.monthsShort[this.month - 1]))
    },
    monthStamp: function monthStamp () {
      return ((this.$q.i18n.date.months[this.month - 1]) + " " + (this.year))
    },
    weekDayString: function weekDayString () {
      return this.$q.i18n.date.days[this.model.getDay()]
    },

    fillerDays: function fillerDays () {
      var days = (new Date(this.model.getFullYear(), this.model.getMonth(), 1).getDay() - this.computedFirstDayOfWeek);
      if (days < 0) {
        days += 7;
      }
      return days
    },
    beforeMinDays: function beforeMinDays () {
      if (this.pmin === null || !isSameDate(this.pmin, this.model, 'month')) {
        return false
      }
      return this.pmin.getDate() - 1
    },
    afterMaxDays: function afterMaxDays () {
      if (this.pmax === null || !isSameDate(this.pmax, this.model, 'month')) {
        return false
      }
      return this.daysInMonth - this.maxDay
    },
    maxDay: function maxDay () {
      return this.pmax !== null ? this.pmax.getDate() : this.daysInMonth
    },
    daysInterval: function daysInterval () {
      var after = this.pmax === null || this.afterMaxDays === false ? 0 : this.afterMaxDays;
      if (this.beforeMinDays || after) {
        var min = this.beforeMinDays ? this.beforeMinDays + 1 : 1;
        return Array.apply(null, {length: this.daysInMonth - min - after + 1}).map(function (day, index) {
          return index + min
        })
      }
      return this.daysInMonth
    },

    hour: function hour () {
      var h = this.model.getHours();
      return this.computedFormat24h
        ? h
        : convertToAmPm(h)
    },
    minute: function minute () {
      return this.model.getMinutes()
    },
    am: function am () {
      return this.model.getHours() <= 11
    },
    clockPointerStyle: function clockPointerStyle () {
      var
        divider = this.view === 'minute' ? 60 : (this.computedFormat24h ? 24 : 12),
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180;

      return cssTransform(("rotate(" + degrees + "deg)"))
    },
    today: function today () {
      var today = new Date();
      return isSameDate(today, this.model, 'month')
        ? today.getDate()
        : -1
    }
  },
  methods: {
    /* date */
    setYear: function setYear (value) {
      if (this.editable) {
        this.view = 'day';
        this.model = new Date(this.model.setFullYear(this.__parseTypeValue('year', value)));
      }
    },
    setMonth: function setMonth (value) {
      if (this.editable) {
        this.view = 'day';
        this.model = adjustDate(this.model, {month: value});
      }
    },
    setDay: function setDay (value) {
      if (this.editable) {
        this.model = new Date(this.model.setDate(this.__parseTypeValue('date', value)));
      }
    },

    setHour: function setHour (value) {
      if (!this.editable) {
        return
      }

      value = this.__parseTypeValue('hour', value);

      if (!this.computedFormat24h && value < 12 && !this.am) {
        value += 12;
      }

      this.model = new Date(this.model.setHours(value));
    },
    setMinute: function setMinute (value) {
      if (!this.editable) {
        return
      }

      this.model = new Date(this.model.setMinutes(this.__parseTypeValue('minute', value)));
    },

    /* helpers */
    __pad: function __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __dragStart: function __dragStart (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      var
        clock = this.$refs.clock,
        clockOffset = offset(clock);

      this.centerClockPos = {
        top: clockOffset.top + height(clock) / 2,
        left: clockOffset.left + width(clock) / 2
      };

      this.dragging = true;
      this.__updateClock(ev);
    },
    __dragMove: function __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__updateClock(ev);
    },
    __dragStop: function __dragStop (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
      this.view = 'minute';
    },
    __updateClock: function __updateClock (ev) {
      var
        pos = position(ev),
        height$$1 = Math.abs(pos.top - this.centerClockPos.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - this.centerClockPos.top), 2) +
          Math.pow(Math.abs(pos.left - this.centerClockPos.left), 2)
        ),
        angle = Math.asin(height$$1 / distance) * (180 / Math.PI);

      if (pos.top < this.centerClockPos.top) {
        angle = this.centerClockPos.left < pos.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = this.centerClockPos.left < pos.left ? angle + 90 : 270 - angle;
      }

      if (this.view === 'hour') {
        this.setHour(Math.round(angle / (this.computedFormat24h ? 15 : 30)));
      }
      else {
        this.setMinute(Math.round(angle / 6));
      }
    }
  }
};

var contentCSS = {
    maxWidth: '95vw',
    maxHeight: '98vh'
  };

var QDatetime = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{staticClass:"q-datetime-input",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"focused":_vm.focused,"focusable":"","length":_vm.actualValue.length},nativeOn:{"click":function($event){_vm.show($event);},"focus":function($event){_vm.__onFocus($event);},"blur":function($event){_vm.__onBlur($event);}}},[_c('div',{staticClass:"col row items-center q-input-target",class:_vm.alignClass,domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._v(" "),(_vm.usingPopover)?_c('q-popover',{ref:"popup",attrs:{"offset":[0, 10],"disable":_vm.disable,"anchor-click":false,"max-height":"100vh"},on:{"show":_vm.__onFocus,"hide":_vm.__onHide}},[_c('q-inline-datetime',{ref:"target",staticClass:"no-border",attrs:{"default-selection":_vm.defaultSelection,"type":_vm.type,"min":_vm.min,"max":_vm.max,"format24h":_vm.format24h,"first-day-of-week":_vm.firstDayOfWeek,"color":_vm.color},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}},[_c('div',{staticClass:"row q-datetime-controls modal-buttons-top"},[(!_vm.noClear && _vm.model)?_c('q-btn',{attrs:{"color":_vm.color,"flat":"","wait-for-ripple":"","label":_vm.clearLabel || _vm.$q.i18n.label.clear},on:{"click":_vm.clear}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"col"}),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":"","wait-for-ripple":"","label":_vm.cancelLabel || _vm.$q.i18n.label.cancel},on:{"click":_vm.hide}}),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":"","wait-for-ripple":"","label":_vm.okLabel || _vm.$q.i18n.label.ok},on:{"click":function($event){_vm.hide(), _vm.__update();}}})],1)])],1):_c('q-modal',{ref:"popup",staticClass:"with-backdrop",class:_vm.classNames,attrs:{"transition":_vm.transition,"position-classes":_vm.position,"content-css":_vm.contentCSS},on:{"show":_vm.__onFocus,"hide":_vm.__onHide}},[_c('q-inline-datetime',{ref:"target",staticClass:"no-border",class:{'full-width': _vm.$q.theme === 'ios'},attrs:{"default-selection":_vm.defaultSelection,"type":_vm.type,"min":_vm.min,"max":_vm.max,"format24h":_vm.format24h,"first-day-of-week":_vm.firstDayOfWeek,"color":_vm.color},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}},[_c('div',{staticClass:"modal-buttons modal-buttons-top row full-width"},[(!_vm.noClear && _vm.model)?_c('q-btn',{attrs:{"color":_vm.color,"flat":"","wait-for-ripple":"","label":_vm.clearLabel || _vm.$q.i18n.label.clear},on:{"click":_vm.clear}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"col"}),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":"","wait-for-ripple":"","label":_vm.cancelLabel || _vm.$q.i18n.label.cancel},on:{"click":_vm.hide}}),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":"","wait-for-ripple":"","label":_vm.okLabel || _vm.$q.i18n.label.ok},on:{"click":function($event){_vm.hide(), _vm.__update();}}})],1)])],1),_vm._v(" "),_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"arrow_drop_down"},slot:"after"})],1)},staticRenderFns: [],
  name: 'q-datetime',
  mixins: [FrameMixin],
  components: {
    QInputFrame: QInputFrame,
    QPopover: QPopover,
    QModal: QModal,
    QInlineDatetime: QInlineDatetime,
    QBtn: QBtn
  },
  props: extend(
    {
      defaultSelection: [String, Number, Date],
      displayValue: String
    },
    input,
    inline
  ),
  data: function data () {
    var data = this.usingPopover ? {} : {
      contentCSS: contentCSS,
      position: 'flex-center',
      transition: 'q-modal',
      classNames: 'minimized'
    };
    data.model = this.value;
    data.focused = false;
    return data
  },
  computed: {
    usingPopover: function usingPopover () {
      return this.$q.platform.is.desktop && !this.$q.platform.within.iframe
    },
    actualValue: function actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.value) {
        return this.placeholder || ''
      }

      var format;

      if (this.format) {
        format = this.format;
      }
      else if (this.type === 'date') {
        format = 'YYYY-MM-DD';
      }
      else if (this.type === 'time') {
        format = 'HH:mm';
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss';
      }

      return formatDate(this.value, format, /* for reactiveness */ this.$q.i18n.date)
    }
  },
  methods: {
    show: function show () {
      if (!this.disable) {
        this.__setModel();
        return this.$refs.popup.show()
      }
    },
    hide: function hide () {
      this.focused = false;
      return this.$refs.popup.hide()
    },
    clear: function clear () {
      if (this.value !== '') {
        this.$emit('input', '');
        this.$emit('change', '');
      }
      this.$refs.popup.hide();
    },

    __onFocus: function __onFocus () {
      this.focused = true;
      this.$emit('focus');
    },
    __onBlur: function __onBlur (e) {
      var this$1 = this;

      this.__onHide();
      setTimeout(function () {
        var el = document.activeElement;
        if (el !== document.body && !this$1.$refs.popup.$el.contains(el)) {
          this$1.hide();
        }
      }, 1);
    },
    __onHide: function __onHide () {
      this.focused = false;
      this.$emit('blur');
    },
    __setModel: function __setModel () {
      this.model = this.value;
    },
    __update: function __update () {
      var val = this.model || this.$refs.target.model;
      if (!isSameDate(this.value, val)) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  }
};

var QDatetimeRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime-range no-wrap",class:_vm.classes},[_c('q-datetime',{staticClass:"col q-datetime-range-left",class:_vm.className,style:(_vm.css),attrs:{"default-selection":_vm.defaultFrom,"type":_vm.type,"min":_vm.min,"max":_vm.value.to || _vm.max,"format":_vm.format,"no-clear":_vm.noClear,"clear-label":_vm.clearLabel,"ok-label":_vm.okLabel,"cancel-label":_vm.cancelLabel,"float-label":_vm.floatLabel,"stack-label":_vm.stackLabel,"placeholder":_vm.placeholder,"disable":_vm.disable,"error":_vm.error,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"align":_vm.align,"format24h":_vm.format24h,"first-day-of-week":_vm.firstDayOfWeek},on:{"change":_vm.__onChange},model:{value:(_vm.value.from),callback:function ($$v) {_vm.$set(_vm.value, "from", $$v);},expression:"value.from"}}),_vm._v(" "),_c('q-datetime',{staticClass:"col q-datetime-range-right",class:_vm.className,style:(_vm.css),attrs:{"default-selection":_vm.defaultTo,"type":_vm.type,"min":_vm.value.from || _vm.min,"max":_vm.max,"format":_vm.format,"no-clear":_vm.noClear,"clear-label":_vm.clearLabel,"ok-label":_vm.okLabel,"cancel-label":_vm.cancelLabel,"float-label":_vm.floatLabelTo,"stack-label":_vm.stackLabelTo,"placeholder":_vm.placeholderTo,"disable":_vm.disable,"error":_vm.error,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"align":_vm.align,"format24h":_vm.format24h,"first-day-of-week":_vm.firstDayOfWeek},on:{"change":_vm.__onChange},model:{value:(_vm.value.to),callback:function ($$v) {_vm.$set(_vm.value, "to", $$v);},expression:"value.to"}})],1)},staticRenderFns: [],
  name: 'q-datetime-range',
  mixins: [FrameMixin],
  components: {
    QDatetime: QDatetime
  },
  props: extend(
    input,
    inline,
    {
      value: {
        type: Object,
        validator: function (val) { return 'from' in val && 'to' in val; },
        required: true
      },
      className: [String, Object],
      css: [String, Object],
      defaultFrom: [String, Number, Date],
      defaultTo: [String, Number, Date],
      vertical: Boolean,
      floatLabelTo: String,
      stackLabelTo: String,
      placeholderTo: String
    }
  ),
  computed: {
    classes: function classes () {
      return this.vertical ? null : 'row'
    }
  },
  methods: {
    __onChange: function __onChange () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit('input', this$1.value);
        this$1.$emit('change', this$1.value);
      });
    }
  }
};

var inputTypes = [
  'text', 'textarea', 'email',
  'tel', 'file', 'number',
  'password', 'url', 'time', 'date'
];

function getSize (el) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

var QResizeObservable = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"absolute-full overflow-hidden invisible",staticStyle:{"z-index":"-1"}},[_c('div',{ref:"expand",staticClass:"absolute-full overflow-hidden invisible",on:{"scroll":_vm.onResize}},[_c('div',{ref:"expandChild",staticClass:"absolute-top-left transition-0",staticStyle:{"width":"100000px","height":"100000px"}})]),_vm._v(" "),_c('div',{ref:"shrink",staticClass:"absolute-full overflow-hidden invisible",on:{"scroll":_vm.onResize}},[_c('div',{staticClass:"absolute-top-left transition-0",staticStyle:{"width":"200%","height":"200%"}})])])},staticRenderFns: [],
  name: 'q-resize-observable',
  methods: {
    onResize: function onResize () {
      var size = getSize(this.$el.parentNode);

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit);
      }

      this.size = size;
    },
    emit: function emit () {
      this.timer = null;
      this.reset();
      this.$emit('resize', this.size);
    },
    reset: function reset () {
      var ref = this.$refs;
      if (ref.expand) {
        ref.expand.scrollLeft = 100000;
        ref.expand.scrollTop = 100000;
      }
      if (ref.shrink) {
        ref.shrink.scrollLeft = 100000;
        ref.shrink.scrollTop = 100000;
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.size = {};
      this$1.onResize();
    });
  },
  beforeDestroy: function beforeDestroy () {
    window.cancelAnimationFrame(this.timer);
    this.$emit('resize', {width: 0, height: 0});
  }
};

var QScrollObservable = {
  name: 'q-scroll-observable',
  render: function render () {},
  data: function data () {
    return {
      pos: 0,
      dir: 'down',
      dirChanged: false,
      dirChangePos: 0
    }
  },
  methods: {
    getPosition: function getPosition () {
      return {
        position: this.pos,
        direction: this.dir,
        directionChanged: this.dirChanged,
        inflexionPosition: this.dirChangePos
      }
    },
    trigger: function trigger () {
      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit);
      }
    },
    emit: function emit () {
      var
        pos = Math.max(0, getScrollPosition(this.target)),
        delta = pos - this.pos,
        dir = delta < 0 ? 'up' : 'down';

      this.dirChanged = this.dir !== dir;
      if (this.dirChanged) {
        this.dir = dir;
        this.dirChangePos = this.pos;
      }

      this.timer = null;
      this.pos = pos;
      this.$emit('scroll', this.getPosition());
    }
  },
  mounted: function mounted () {
    this.target = getScrollTarget(this.$el.parentNode);
    this.target.addEventListener('scroll', this.trigger);
    this.trigger();
  },
  beforeDestroy: function beforeDestroy () {
    this.target.removeEventListener('scroll', this.trigger);
  }
};

var QWindowResizeObservable = {
  name: 'q-window-resize-observable',
  render: function render () {},
  methods: {
    trigger: function trigger () {
      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit);
      }
    },
    emit: function emit () {
      this.timer = null;
      this.$emit('resize', viewport());
    }
  },
  created: function created () {
    this.emit();
  },
  mounted: function mounted () {
    window.addEventListener('resize', this.trigger);
  },
  beforeDestroy: function beforeDestroy () {
    window.removeEventListener('resize', this.trigger);
  }
};

var QInput = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{staticClass:"q-input",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"warning":_vm.warning,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"focused":_vm.focused,"length":_vm.length,"top-addons":_vm.isTextarea},on:{"click":_vm.__onClick,"focus":_vm.__onFocus}},[_vm._t("before"),_vm._v(" "),(_vm.isTextarea)?[_c('div',{staticClass:"col row relative-position"},[_c('q-resize-observable',{on:{"resize":function($event){_vm.__updateArea();}}}),_vm._v(" "),_c('textarea',{ref:"shadow",staticClass:"col q-input-target q-input-shadow absolute-top",attrs:{"rows":_vm.minRows},domProps:{"value":_vm.model}}),_vm._v(" "),_c('textarea',_vm._b({ref:"input",staticClass:"col q-input-target q-input-area",attrs:{"name":_vm.name,"placeholder":_vm.inputPlaceholder,"disabled":_vm.disable,"readonly":_vm.readonly,"maxlength":_vm.maxLength,"rows":_vm.minRows},domProps:{"value":_vm.model},on:{"input":_vm.__set,"focus":_vm.__onFocus,"blur":_vm.__onInputBlur,"keydown":_vm.__onKeydown,"keyup":_vm.__onKeyup}},'textarea',_vm.attributes,false))],1)]:_c('input',_vm._b({ref:"input",staticClass:"col q-input-target",class:[("text-" + (_vm.align))],attrs:{"name":_vm.name,"placeholder":_vm.inputPlaceholder,"pattern":_vm.pattern,"disabled":_vm.disable,"readonly":_vm.readonly,"maxlength":_vm.maxLength,"min":_vm.min,"max":_vm.max,"step":_vm.inputStep,"type":_vm.inputType},domProps:{"value":_vm.model},on:{"input":_vm.__set,"focus":_vm.__onFocus,"blur":_vm.__onInputBlur,"keydown":_vm.__onKeydown,"keyup":_vm.__onKeyup}},'input',_vm.attributes,false)),_vm._v(" "),(_vm.isPassword && !_vm.noPassToggle && _vm.length)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":_vm.showPass ? 'visibility' : 'visibility_off'},on:{"mousedown":_vm.__clearTimer,"touchstart":_vm.__clearTimer,"click":_vm.togglePass},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.editable && _vm.clearable && _vm.length)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"cancel"},on:{"mousedown":_vm.__clearTimer,"touchstart":_vm.__clearTimer,"click":_vm.clear},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.isLoading)?_c('q-spinner',{staticClass:"q-if-control",attrs:{"slot":"after","size":"24px"},slot:"after"}):_vm._e(),_vm._v(" "),_vm._t("after"),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-input',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame: QInputFrame,
    QSpinner: QSpinner,
    QResizeObservable: QResizeObservable
  },
  props: {
    value: { required: true },
    type: {
      type: String,
      default: 'text',
      validator: function (t) { return inputTypes.includes(t); }
    },
    minRows: Number,
    clearable: Boolean,
    noPassToggle: Boolean,
    readonly: Boolean,
    attributes: Object,

    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    maxDecimals: Number,
    upperCase: Boolean
  },
  data: function data () {
    var this$1 = this;

    return {
      showPass: false,
      model: this.value,
      shadow: {
        val: this.model,
        set: this.__set,
        loading: false,
        hasFocus: function () {
          return document.activeElement === this$1.$refs.input
        },
        register: function () {
          this$1.watcher = this$1.$watch('model', function (val) {
            this$1.shadow.val = val;
          });
        },
        unregister: function () {
          this$1.watcher();
        },
        getEl: function () {
          return this$1.$refs.input
        }
      }
    }
  },
  watch: {
    value: function value (v) {
      this.model = v;
    }
  },
  provide: function provide () {
    return {
      __input: this.shadow
    }
  },
  computed: {
    isNumber: function isNumber () {
      return this.type === 'number'
    },
    isPassword: function isPassword () {
      return this.type === 'password'
    },
    isTextarea: function isTextarea () {
      return this.type === 'textarea'
    },
    isLoading: function isLoading () {
      return this.loading || this.shadow.loading
    },
    pattern: function pattern () {
      if (this.isNumber) {
        return '[0-9]*'
      }
    },
    inputStep: function inputStep () {
      if (this.isNumber) {
        return this.step
      }
    },
    inputType: function inputType () {
      return this.isPassword
        ? (this.showPass ? 'text' : 'password')
        : this.type
    },
    length: function length () {
      return this.model !== null && this.model !== undefined
        ? ('' + this.model).length
        : 0
    },
    editable: function editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    togglePass: function togglePass () {
      this.showPass = !this.showPass;
      clearTimeout(this.timer);
      this.focus();
    },
    clear: function clear () {
      clearTimeout(this.timer);
      this.focus();
      if (this.editable) {
        this.model = this.isNumber ? null : '';
        this.$emit('input', this.model);
      }
    },

    __clearTimer: function __clearTimer () {
      var this$1 = this;

      this.$nextTick(function () { return clearTimeout(this$1.timer); });
    },

    __set: function __set (e) {
      var val = e.target ? e.target.value : e;

      if (this.isNumber) {
        val = parseFloat(val);
        if (isNaN(val)) {
          // Number.isInteger(this.maxDecimals)
          val = null;
        }
        else if (Number.isInteger(this.maxDecimals)) {
          val = parseFloat(val.toFixed(this.maxDecimals));
        }
      }
      else if (this.upperCase) {
        val = val.toUpperCase();
      }

      if (val !== this.model) {
        this.$emit('input', val);
      }
      this.model = val;
    },
    __updateArea: function __updateArea () {
      var shadow = this.$refs.shadow;
      if (shadow) {
        var h = shadow.scrollHeight;
        var max = this.maxHeight || h;
        this.$refs.input.style.minHeight = (between(h, 19, max)) + "px";
      }
    }
  },
  mounted: function mounted () {
    this.__updateArea = frameDebounce(this.__updateArea);
    if (this.isTextarea) {
      this.__updateArea();
      this.watcher = this.$watch('model', this.__updateArea);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.watcher !== void 0) {
      this.watcher();
    }
  }
};

var QRadio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-radio q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center",class:{disabled: _vm.disable, reverse: _vm.leftLabel},attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.select($event);},"focus":function($event){_vm.$emit('focus');},"blur":function($event){_vm.$emit('blur');},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.select(false);}}},[_c('div',{staticClass:"q-option-inner relative-position",class:_vm.innerClasses},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"radio","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":_vm._q(_vm.model,_vm.val)},on:{"click":function($event){$event.stopPropagation();},"change":[function($event){_vm.model=_vm.val;},_vm.__change]}}),_vm._v(" "),_c('div',{staticClass:"q-focus-helper"}),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('q-icon',{staticClass:"q-radio-unchecked absolute-full cursor-pointer",attrs:{"name":_vm.uncheckedIcon}}):_vm._e(),_vm._v(" "),_c('q-icon',{staticClass:"q-radio-checked cursor-pointer absolute-full",attrs:{"name":_vm.checkedIcon}}),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{ref:"ripple",staticClass:"q-radial-ripple"}):_vm._e()],1),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"q-option-label",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-radio',
  mixins: [OptionMixin],
  components: {
    QIcon: QIcon
  },
  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },
    checkedIcon: {
      type: String,
      default: 'radio_button_checked'
    },
    uncheckedIcon: {
      type: String,
      default: 'radio_button_unchecked'
    }
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (val) {
        if (val !== this.value) {
          this.$emit('input', val);
        }
      }
    },
    isActive: function isActive () {
      return this.model === this.val
    }
  },
  methods: {
    select: function select (withBlur) {
      if (withBlur !== false) {
        this.$el.blur();
      }

      if (!this.disable && this.model !== this.val) {
        this.model = this.val;
        this.__onChange(this.val);
      }
    },
    __change: function __change (e) {
      this.__onChange(this.value);
    },
    __onChange: function __onChange (val) {
      var ref = this.$refs.ripple;
      if (val && ref) {
        ref.classList.add('active');
        setTimeout(function () {
          ref.classList.remove('active');
        }, 10);
      }
      this.$emit('change', val);
    }
  }
};

function getDirection$1 (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      left: true, right: true, up: true, down: true, horizontal: true, vertical: true
    }
  }

  var dir = {};['left', 'right', 'up', 'down', 'horizontal', 'vertical'].forEach(function (direction) {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });
  if (dir.horizontal) {
    dir.left = dir.right = true;
  }
  if (dir.vertical) {
    dir.up = dir.down = true;
  }
  if (dir.left || dir.right) {
    dir.horizontal = true;
  }
  if (dir.up || dir.down) {
    dir.vertical = true;
  }

  return dir
}

function updateClasses$1 (el, dir) {
  el.classList.add('q-touch');

  if (dir.horizontal && !dir.vertical) {
    el.classList.add('q-touch-y');
    el.classList.remove('q-touch-x');
  }
  else if (!dir.horizontal && dir.vertical) {
    el.classList.add('q-touch-x');
    el.classList.remove('q-touch-y');
  }
}

var TouchSwipe = {
  name: 'touch-swipe',
  bind: function bind (el, binding) {
    var mouse = !binding.modifiers.nomouse;

    var ctx = {
      handler: binding.value,
      direction: getDirection$1(binding.modifiers),

      start: function start (evt) {
        var pos = position(evt);
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical
        };
        if (mouse) {
          document.addEventListener('mousemove', ctx.move);
          document.addEventListener('mouseup', ctx.end);
        }
      },
      move: function move (evt) {
        var
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y;

        if (ctx.event.prevent) {
          evt.preventDefault();
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
      },
      end: function end (evt) {
        if (mouse) {
          document.removeEventListener('mousemove', ctx.move);
          document.removeEventListener('mouseup', ctx.end);
        }

        var
          direction,
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y;

        if (distX !== 0 || distY !== 0) {
          if (Math.abs(distX) >= Math.abs(distY)) {
            direction = distX < 0 ? 'left' : 'right';
          }
          else {
            direction = distY < 0 ? 'up' : 'down';
          }

          if (ctx.direction[direction]) {
            ctx.handler({
              evt: evt,
              direction: direction,
              duration: new Date().getTime() - ctx.event.time,
              distance: {
                x: Math.abs(distX),
                y: Math.abs(distY)
              }
            });
          }
        }
      }
    };

    el.__qtouchswipe = ctx;
    updateClasses$1(el, ctx.direction);
    if (mouse) {
      el.addEventListener('mousedown', ctx.start);
    }
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchswipe.handler = binding.value;
    }
  },
  unbind: function unbind (el, binding) {
    var ctx = el.__qtouchswipe;
    el.removeEventListener('mousedown', ctx.start);
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    delete el.__qtouchswipe;
  }
};

var QToggle = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-swipe",rawName:"v-touch-swipe.horizontal",value:(_vm.__swipe),expression:"__swipe",modifiers:{"horizontal":true}}],staticClass:"q-toggle q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center",class:{disabled: _vm.disable, reverse: _vm.leftLabel},attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.toggle($event);},"focus":function($event){_vm.$emit('focus');},"blur":function($event){_vm.$emit('blur');},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.toggle(false);}}},[_c('div',{staticClass:"q-option-inner relative-position",class:_vm.innerClasses},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"checkbox","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":Array.isArray(_vm.model)?_vm._i(_vm.model,_vm.val)>-1:(_vm.model)},on:{"click":function($event){$event.stopPropagation();},"change":[function($event){var $$a=_vm.model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=_vm.val,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.model=$$a.concat([$$v]));}else{$$i>-1&&(_vm.model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.model=$$c;}},_vm.__change]}}),_vm._v(" "),_c('div',{staticClass:"q-focus-helper"}),_vm._v(" "),_c('div',{staticClass:"q-toggle-base",class:_vm.baseClass}),_vm._v(" "),_c('div',{staticClass:"q-toggle-handle row flex-center"},[(_vm.currentIcon)?_c('q-icon',{staticClass:"q-toggle-icon",attrs:{"name":_vm.currentIcon,"color":_vm.iconColor}}):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{ref:"ripple",staticClass:"q-radial-ripple"}):_vm._e()],1)]),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"q-option-label",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-toggle',
  components: {
    QIcon: QIcon
  },
  directives: {
    TouchSwipe: TouchSwipe
  },
  mixins: [Mixin, OptionMixin],
  props: {
    icon: String,
    checkedIcon: String,
    uncheckedIcon: String
  },
  computed: {
    currentIcon: function currentIcon () {
      return (this.isActive ? this.checkedIcon : this.uncheckedIcon) || this.icon
    },
    iconColor: function iconColor () {
      return this.isActive ? 'white' : 'dark'
    },
    baseClass: function baseClass () {
      
    }
  },
  methods: {
    __swipe: function __swipe (evt) {
      if (evt.direction === 'left') {
        this.unselect();
      }
      else if (evt.direction === 'right') {
        this.select();
      }
    }
  }
};

var clone = function (data) {
  return JSON.parse(JSON.stringify(data))
};

var QOptionGroup = {
  name: 'q-option-group',
  inject: {
    __field: { default: null }
  },
  components: {
    QRadio: QRadio,
    QCheckbox: QCheckbox,
    QToggle: QToggle
  },
  props: {
    value: {
      required: true
    },
    type: {
      default: 'radio',
      validator: function (v) { return ['radio', 'checkbox', 'toggle'].includes(v); }
    },
    color: String,
    keepColor: Boolean,
    dark: Boolean,
    indeterminate: Boolean,
    options: {
      type: Array,
      validator: function validator (opts) {
        return opts.every(function (opt) { return 'value' in opt && 'label' in opt; })
      }
    },
    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },
  computed: {
    component: function component () {
      return ("q-" + (this.type))
    },
    model: {
      get: function get () {
        return clone(this.value)
      },
      set: function set (value) {
        this.$emit('input', value);
      }
    },
    length: function length () {
      return this.value
        ? (this.type === 'radio' ? 1 : this.value.length)
        : 0
    }
  },
  methods: {
    __onChange: function __onChange (val) {
      if (this.type !== 'radio') {
        this.$emit('input', val);
      }
      this.$emit('change', val);
    },
    __onFocus: function __onFocus () {
      this.$emit('focus');
    },
    __onBlur: function __onBlur () {
      this.$emit('blur');
    }
  },
  created: function created () {
    var isArray = Array.isArray(this.value);
    if (this.type === 'radio') {
      if (isArray) {
        console.error('q-option-group: model should not be array');
      }
    }
    else if (!isArray) {
      console.error('q-option-group: model should be array in your case');
    }
    if (this.__field) {
      this.field = this.__field;
      this.field.__registerInput(this, true);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput();
    }
  },
  render: function render (h) {
    var this$1 = this;

    return h(
      'div',
      {
        staticClass: 'q-option-group group',
        'class': { 'q-option-group-inline-opts': this.inline }
      },
      this.options.map(
        function (opt) { return h('div', [
          h(this$1.component, {
            props: {
              value: this$1.model,
              val: opt.value,
              disable: this$1.disable || opt.disable,
              label: opt.label,
              leftLabel: opt.leftLabel,
              color: opt.color || this$1.color,
              checkedIcon: opt.checkedIcon,
              uncheckedIcon: opt.uncheckedIcon,
              indeterminateIcon: opt.indeterminateIcon,
              indeterminate: opt.indeterminate,
              dark: opt.dark || this$1.dark,
              keepColor: opt.keepColor || this$1.keepColor
            },
            on: {
              input: function (val) {
                this$1.model = val;
              },
              focus: this$1.__onFocus,
              blur: this$1.__onBlur,
              change: this$1.__onChange
            }
          })
        ]); }
      )
    )
  }
};

var QDialog = {
  name: 'q-dialog',
  props: {
    value: Boolean,
    title: String,
    message: String,
    prompt: Object,
    options: Object,
    ok: {
      type: [String, Boolean],
      default: true
    },
    cancel: [String, Boolean],
    stackButtons: Boolean,
    preventClose: Boolean,
    position: String,
    color: {
      type: String,
      default: 'primary'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var
      child = [],
      title = this.$slots.title || this.title,
      msg = this.$slots.message || this.message;

    if (title) {
      child.push(
        h('div', {
          staticClass: 'modal-header'
        }, [ title ])
      );
    }
    if (msg) {
      child.push(
        h('div', {
          staticClass: 'modal-body modal-scroll'
        }, [ msg ])
      );
    }

    child.push(
      h(
        'div',
        { staticClass: 'modal-body modal-scroll' },
        this.hasForm
          ? (this.prompt ? this.__getPrompt(h) : this.__getOptions(h))
          : [ this.$slots.default ]
      )
    );

    if (this.$scopedSlots.buttons) {
      child.push(
        h('div', {
          staticClass: 'modal-buttons',
          'class': {
            row: !this.stackButtons,
            column: this.stackButtons
          }
        }, [
          this.$scopedSlots.buttons({
            ok: this.__onOk,
            cancel: this.__onCancel
          })
        ])
      );
    }
    else if (this.ok || this.cancel) {
      child.push(
        h(
          'div',
          { staticClass: 'modal-buttons row' },
          this.__getButtons(h)
        )
      );
    }

    return h(QModal, {
      ref: 'modal',
      props: {
        value: this.value,
        minimized: true,
        noBackdropDismiss: this.preventClose,
        noEscDismiss: this.preventClose,
        position: this.position
      },
      on: {
        input: function (val) {
          this$1.$emit('input', val);
        },
        show: function () {
          this$1.$emit('show');

          if (!this$1.$q.platform.is.desktop) {
            return
          }

          var node = this$1.$refs.modal.$el.getElementsByTagName('INPUT');
          if (node.length) {
            node[0].focus();
            return
          }

          node = this$1.$refs.modal.$el.getElementsByTagName('BUTTON');
          if (node.length) {
            node[node.length - 1].focus();
          }
        },
        hide: function () {
          this$1.$emit('hide');
        },
        dismiss: function () {
          this$1.$emit('cancel');
        },
        'escape-key': function () {
          this$1.hide().then(function () {
            this$1.$emit('escape-key');
            this$1.$emit('cancel');
          });
        }
      }
    }, child)
  },
  computed: {
    hasForm: function hasForm () {
      return this.prompt || this.options
    },
    okLabel: function okLabel () {
      return this.ok === true
        ? this.$q.i18n.label.ok
        : this.ok
    },
    cancelLabel: function cancelLabel () {
      return this.cancel === true
        ? this.$q.i18n.label.cancel
        : this.cancel
    }
  },
  methods: {
    show: function show () {
      return this.$refs.modal.show()
    },
    hide: function hide () {
      var this$1 = this;

      var data;

      return this.$refs.modal.hide().then(function () {
        if (this$1.hasForm) {
          data = clone(this$1.__getData());
        }
        return data
      })
    },
    __getPrompt: function __getPrompt (h) {
      var this$1 = this;

      return [
        h(QInput, {
          style: 'margin-bottom: 10px',
          props: {
            value: this.prompt.model,
            type: this.prompt.type || 'text',
            color: this.color,
            noPassToggle: true
          },
          on: {
            change: function (v) { this$1.prompt.model = v; }
          }
        })
      ]
    },
    __getOptions: function __getOptions (h) {
      var this$1 = this;

      return [
        h(QOptionGroup, {
          props: {
            value: this.options.model,
            type: this.options.type,
            color: this.color,
            inline: this.options.inline,
            options: this.options.items
          },
          on: {
            change: function (v) { this$1.options.model = v; }
          }
        })
      ]
    },
    __getButtons: function __getButtons (h) {
      var child = [];

      if (this.cancel) {
        child.push(h(QBtn, {
          props: { color: this.color, flat: true, label: this.cancelLabel, waitForRipple: true },
          on: { click: this.__onCancel }
        }));
      }
      if (this.ok) {
        child.push(h(QBtn, {
          props: { color: this.color, flat: true, label: this.okLabel, waitForRipple: true },
          on: { click: this.__onOk }
        }));
      }

      return child
    },
    __onOk: function __onOk () {
      var this$1 = this;

      return this.hide().then(function (data) {
        this$1.$emit('ok', data);
      })
    },
    __onCancel: function __onCancel () {
      var this$1 = this;

      return this.hide().then(function () {
        this$1.$emit('cancel');
      })
    },
    __getData: function __getData () {
      if (this.prompt) {
        return this.prompt.model
      }
      if (this.options) {
        return this.options.model
      }
    }
  }
};

var QTooltip = {
  name: 'q-tooltip',
  mixins: [ModelToggleMixin],
  props: {
    anchor: {
      type: String,
      default: 'top middle',
      validator: positionValidator
    },
    self: {
      type: String,
      default: 'bottom middle',
      validator: positionValidator
    },
    offset: {
      type: Array,
      validator: offsetValidator
    },
    delay: {
      type: Number,
      default: 0
    },
    maxHeight: String,
    disable: Boolean
  },
  watch: {
    $route: function $route () {
      this.hide();
    }
  },
  computed: {
    anchorOrigin: function anchorOrigin () {
      return parsePosition(this.anchor)
    },
    selfOrigin: function selfOrigin () {
      return parsePosition(this.self)
    },
    transformCSS: function transformCSS () {
      return getTransformProperties({
        selfOrigin: this.selfOrigin
      })
    }
  },
  methods: {
    __show: function __show () {
      clearTimeout(this.timer);

      document.body.appendChild(this.$el);
      this.scrollTarget = getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.hide);
      window.addEventListener('resize', this.__debouncedUpdatePosition);
      if (this.$q.platform.is.mobile) {
        document.body.addEventListener('click', this.hide, true);
      }

      this.__updatePosition();
      this.showPromise && this.showPromiseResolve();
    },
    __hide: function __hide () {
      clearTimeout(this.timer);

      this.scrollTarget.removeEventListener('scroll', this.hide);
      window.removeEventListener('resize', this.__debouncedUpdatePosition);
      document.body.removeChild(this.$el);
      if (this.$q.platform.is.mobile) {
        document.body.removeEventListener('click', this.hide, true);
      }

      this.hidePromise && this.hidePromiseResolve();
    },
    __updatePosition: function __updatePosition () {
      setPosition({
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight
      });
    },
    __delayShow: function __delayShow () {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.show, this.delay);
    },
    __delayHide: function __delayHide () {
      clearTimeout(this.timer);
      this.hide();
    }
  },
  render: function render (h) {
    return h('span', {
      staticClass: 'q-tooltip animate-scale',
      style: this.transformCSS
    }, [ this.$slots.default ])
  },
  created: function created () {
    var this$1 = this;

    this.__debouncedUpdatePosition = debounce(function () {
      this$1.__updatePosition();
    }, 70);
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      /*
        The following is intentional.
        Fixes a bug in Chrome regarding offsetHeight by requiring browser
        to calculate this before removing from DOM and using it for first time.
      */
      this$1.$el.offsetHeight; // eslint-disable-line

      this$1.anchorEl = this$1.$el.parentNode;
      this$1.anchorEl.removeChild(this$1.$el);
      if (this$1.anchorEl.classList.contains('q-btn-inner')) {
        this$1.anchorEl = this$1.anchorEl.parentNode;
      }
      if (this$1.$q.platform.is.mobile) {
        this$1.anchorEl.addEventListener('click', this$1.show);
      }
      else {
        this$1.anchorEl.addEventListener('mouseenter', this$1.__delayShow);
        this$1.anchorEl.addEventListener('focus', this$1.__delayShow);
        this$1.anchorEl.addEventListener('mouseleave', this$1.__delayHide);
        this$1.anchorEl.addEventListener('blur', this$1.__delayHide);
      }

      if (this$1.value) {
        this$1.show();
      }
    });
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
    if (!this.anchorEl) {
      return
    }
    if (this.$q.platform.is.mobile) {
      this.anchorEl.removeEventListener('click', this.show);
    }
    else {
      this.anchorEl.removeEventListener('mouseenter', this.__delayShow);
      this.anchorEl.removeEventListener('focus', this.__delayShow);
      this.anchorEl.removeEventListener('mouseleave', this.__delayHide);
      this.anchorEl.removeEventListener('blur', this.__delayHide);
    }
  }
};

function run (e, btn, vm) {
  if (btn.handler) {
    btn.handler(e, vm, vm.caret);
  }
  else {
    vm.runCmd(btn.cmd, btn.param);
  }
}

function getBtn (h, vm, btn, clickHandler) {
  var
    child = [],
    events = {
      click: function click (e) {
        clickHandler && clickHandler();
        run(e, btn, vm);
      }
    };

  if (btn.tip && vm.$q.platform.is.desktop) {
    var Key = btn.key
      ? h('div', [h('small', ("(CTRL + " + (String.fromCharCode(btn.key)) + ")"))])
      : null;
    child.push(h(QTooltip, { props: {delay: 1000} }, [
      h('div', { domProps: { innerHTML: btn.tip } }),
      Key
    ]));
  }

  if (btn.type === void 0) {
    return h(QBtnToggle, {
      props: extend({
        icon: btn.icon,
        label: btn.label,
        toggled: btn.toggled ? btn.toggled(vm) : btn.cmd && vm.caret.is(btn.cmd, btn.param),
        color: vm.color,
        toggleColor: vm.toggleColor,
        disable: btn.disable ? btn.disable(vm) : false
      }, vm.buttonProps),
      on: events
    }, child)
  }
  if (btn.type === 'no-state') {
    return h(QBtn, {
      props: extend({
        icon: btn.icon,
        color: vm.color,
        label: btn.label,
        disable: btn.disable ? btn.disable(vm) : false
      }, vm.buttonProps),
      on: events
    }, child)
  }
}

function getDropdown (h, vm, btn) {
  var
    label = btn.label,
    icon = btn.icon,
    noIcons = btn.list === 'no-icons',
    onlyIcons = btn.list === 'only-icons',
    Items;

  function closeDropdown () {
    Dropdown.componentInstance.hide();
  }

  if (onlyIcons) {
    Items = btn.options.map(function (btn) {
      var active = btn.type === void 0
        ? vm.caret.is(btn.cmd, btn.param)
        : false;

      if (active) {
        label = btn.tip;
        icon = btn.icon;
      }
      return getBtn(h, vm, btn, closeDropdown)
    });
    Items = [
      h(
        QBtnGroup,
        { props: vm.buttonProps, staticClass: 'relative-position q-editor-toolbar-padding' },
        Items
      )
    ];
  }
  else {
    Items = btn.options.map(function (btn) {
      var disable = btn.disable ? btn.disable(vm) : false;
      var active = btn.type === void 0
        ? vm.caret.is(btn.cmd, btn.param)
        : false;

      if (active) {
        label = btn.tip;
        icon = btn.icon;
      }

      return h(
        QItem,
        {
          props: { active: active, link: !disable },
          staticClass: disable ? 'disabled' : '',
          on: {
            click: function click (e) {
              if (disable) { return }
              closeDropdown();
              vm.$refs.content.focus();
              vm.caret.restore();
              run(e, btn, vm);
            }
          }
        },
        [
          noIcons ? '' : h(QItemSide, {props: {icon: btn.icon}}),
          h(QItemMain, {
            props: {
              label: btn.htmlTip || btn.tip
            }
          })
        ]
      )
    });
    Items = [ h(QList, { props: { separator: true } }, [ Items ]) ];
  }

  var Dropdown = h(
    QBtnDropdown,
    {
      props: extend({
        noCaps: true,
        noWrap: true,
        color: btn.highlight && label !== btn.label ? vm.toggleColor : vm.color,
        label: btn.fixedLabel ? btn.label : label,
        icon: btn.fixedIcon ? btn.icon : icon
      }, vm.buttonProps)
    },
    Items
  );
  return Dropdown
}

function getToolbar (h, vm) {
  if (vm.caret) {
    return vm.buttons.map(function (group) { return h(
      QBtnGroup,
      { props: vm.buttonProps, staticClass: 'relative-position' },
      group.map(function (btn) {
        if (btn.type === 'slot') {
          return vm.$slots[btn.slot]
        }

        if (btn.type === 'dropdown') {
          return getDropdown(h, vm, btn)
        }

        return getBtn(h, vm, btn)
      })
    ); })
  }
}

function getFonts (defaultFont, defaultFontLabel, fonts) {
  if ( fonts === void 0 ) fonts = {};

  var aliases = Object.keys(fonts);
  if (aliases.length === 0) {
    return {}
  }

  var def = {
    default_font: {
      cmd: 'fontName',
      param: defaultFont,
      icon: 'font_download',
      tip: defaultFontLabel
    }
  };

  aliases.forEach(function (alias) {
    var name = fonts[alias];
    def[alias] = {
      cmd: 'fontName',
      param: name,
      icon: 'font_download',
      tip: name,
      htmlTip: ("<font face=\"" + name + "\">" + name + "</font>")
    };
  });

  return def
}

function getBlockElement (el, parent) {
  if (parent && el === parent) {
    return null
  }

  var
    style = window.getComputedStyle
      ? window.getComputedStyle(el)
      : el.currentStyle,
    display = style.display;

  if (display === 'block' || display === 'table') {
    return el
  }

  return getBlockElement(el.parentNode)
}

function isChildOf (el, parent) {
  if (!el) {
    return false
  }
  while ((el = el.parentNode)) {
    if (el === document.body) {
      return false
    }
    if (el === parent) {
      return true
    }
  }
  return false
}

var Caret = function Caret (el, vm) {
  this.el = el;
  this.vm = vm;
};

var prototypeAccessors = { selection: { configurable: true },hasSelection: { configurable: true },range: { configurable: true },parent: { configurable: true },blockParent: { configurable: true } };

prototypeAccessors.selection.get = function () {
  if (!this.el) {
    return
  }
  var sel = document.getSelection();
  // only when the selection in element
  if (isChildOf(sel.anchorNode, this.el) && isChildOf(sel.focusNode, this.el)) {
    return sel
  }
};

prototypeAccessors.hasSelection.get = function () {
  return this.selection
    ? this.selection.toString().length > 0
    : null
};

prototypeAccessors.range.get = function () {
  var sel = this.selection;

  if (!sel) {
    return
  }

  return sel.rangeCount
    ? sel.getRangeAt(0)
    : null
};

prototypeAccessors.parent.get = function () {
  var range = this.range;
  if (!range) {
    return
  }

  var node = range.startContainer;
  return node.nodeType === document.ELEMENT_NODE
    ? node
    : node.parentNode
};

prototypeAccessors.blockParent.get = function () {
  var parent = this.parent;
  if (!parent) {
    return
  }
  return getBlockElement(parent, this.el)
};

Caret.prototype.save = function save (range) {
    if ( range === void 0 ) range = this.range;

  this._range = range;
};

Caret.prototype.restore = function restore (range) {
    if ( range === void 0 ) range = this._range;

  var
    r = document.createRange(),
    sel = document.getSelection();

  if (range) {
    r.setStart(range.startContainer, range.startOffset);
    r.setEnd(range.endContainer, range.endOffset);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  else {
    sel.selectAllChildren(this.el);
    sel.collapseToEnd();
  }
};

Caret.prototype.hasParent = function hasParent (name, spanLevel) {
  var el = spanLevel
    ? this.parent
    : this.blockParent;

  return el
    ? el.nodeName.toLowerCase() === name.toLowerCase()
    : false
};

Caret.prototype.hasParents = function hasParents (list) {
  var el = this.parent;
  return el
    ? list.includes(el.nodeName.toLowerCase())
    : false
};

Caret.prototype.is = function is (cmd, param) {
  switch (cmd) {
    case 'formatBlock':
      if (param === 'DIV' && this.parent === this.el) {
        return true
      }
      return this.hasParent(param, param === 'PRE')
    case 'link':
      return this.hasParent('A', true)
    case 'fontSize':
      return document.queryCommandValue(cmd) === param
    case 'fontName':
      var res = document.queryCommandValue(cmd);
      return res === ("\"" + param + "\"") || res === param
    case 'fullscreen':
      return this.vm.inFullscreen
    default:
      var state = document.queryCommandState(cmd);
      return param ? state === param : state
  }
};

Caret.prototype.getParentAttribute = function getParentAttribute (attrib) {
  if (this.parent) {
    return this.parent.getAttribute(attrib)
  }
};

Caret.prototype.can = function can (name) {
  if (name === 'outdent') {
    return this.hasParents(['blockquote', 'li'])
  }
  if (name === 'indent') {
    var parentName = this.parent ? this.parent.nodeName.toLowerCase() : false;
    if (parentName === 'blockquote') {
      return false
    }
    if (parentName === 'li') {
      var previousEl = this.parent.previousSibling;
      return previousEl && previousEl.nodeName.toLowerCase() === 'li'
    }
    return false
  }
};

Caret.prototype.apply = function apply (cmd, param, done) {
    var this$1 = this;
    if ( done === void 0 ) done = function () {};

  if (cmd === 'formatBlock') {
    if (['BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE'].includes(param) && this.is(cmd, param)) {
      cmd = 'outdent';
      param = null;
    }
  }
  else if (cmd === 'print') {
    done();
    var win = window.open();
    win.document.write(("\n        <!doctype html>\n        <html>\n          <head>\n            <title>Print - " + (document.title) + "</title>\n          </head>\n          <body>\n            <div>" + (this.el.innerHTML) + "</div>\n          </body>\n        </html>\n      "));
    win.print();
    win.close();
    return
  }
  else if (cmd === 'link') {
    var link = this.getParentAttribute('href');
    if (link && this.range) {
      this.range.selectNodeContents(this.parent);
    }
    this.save();
    // TODO
    this.$q.dialog({
      title: 'Link',
      message: this.selection ? this.selection.toString() : null,
      prompt: {
        type: 'text',
        label: 'URL',
        model: link || 'http://'
      },
      buttons: [
        {
          label: link ? 'Remove' : 'Cancel',
          handler: function () {
            if (link) {
              this$1.restore();
              document.execCommand('unlink');
              done();
            }
          }
        },
        {
          label: link ? 'Update' : 'Create',
          handler: function (data) {
            this$1.restore();
            document.execCommand('createLink', false, data.url);
            done();
          }
        }
      ]
    });
    return
  }
  else if (cmd === 'fullscreen') {
    this.vm.toggleFullscreen();
    done();
    return
  }

  document.execCommand(cmd, false, param);
  done();
};

Object.defineProperties( Caret.prototype, prototypeAccessors );

var QEditor = {
  name: 'q-editor',
  mixins: [FullscreenMixin],
  props: {
    value: {
      type: String,
      required: true
    },
    readonly: Boolean,
    disable: Boolean,
    minHeight: {
      type: String,
      default: '10rem'
    },
    maxHeight: String,
    height: String,
    color: String,
    toggleColor: {
      type: String,
      default: 'primary'
    },
    toolbarColor: {
      type: String,
      default: 'grey-4'
    },
    contentColor: {
      type: String,
      default: 'white'
    },
    flat: Boolean,
    outline: Boolean,
    push: Boolean,
    definitions: Object,
    fonts: Object,
    toolbar: {
      type: Array,
      validator: function (v) { return v.length > 0 && v.every(function (group) { return group.length; }); },
      default: function default$1 () {
        return [
          ['left', 'center', 'right', 'justify'],
          ['bold', 'italic', 'underline', 'strike'],
          ['undo', 'redo']
        ]
      }
    }
  },
  computed: {
    editable: function editable () {
      return !this.readonly && !this.disable
    },
    buttonProps: function buttonProps () {
      return {
        outline: this.outline,
        flat: this.flat,
        push: this.push,
        small: true,
        compact: true
      }
    },
    buttonDef: function buttonDef () {
      var e = this.$q.i18n.editor;

      return {
        bold: {cmd: 'bold', icon: 'format_bold', tip: e.bold, key: 66},
        italic: {cmd: 'italic', icon: 'format_italic', tip: e.italic, key: 73},
        strike: {cmd: 'strikeThrough', icon: 'strikethrough_s', tip: e.strikethrough, key: 83},
        underline: {cmd: 'underline', icon: 'format_underlined', tip: e.underline, key: 85},
        unordered: {cmd: 'insertUnorderedList', icon: 'format_list_bulleted', tip: e.unorderedList},
        ordered: {cmd: 'insertOrderedList', icon: 'format_list_numbered', tip: e.orderedList},
        subscript: {cmd: 'subscript', icon: 'vertical_align_bottom', tip: e.subscript, htmlTip: 'x<subscript>2</subscript>'},
        superscript: {cmd: 'superscript', icon: 'vertical_align_top', tip: e.superscript, htmlTip: 'x<superscript>2</superscript>'},
        link: {cmd: 'link', icon: 'link', tip: e.hyperlink, key: 76},
        fullscreen: {cmd: 'fullscreen', icon: 'fullscreen', tip: e.toggleFullscreen, key: 70},

        quote: {cmd: 'formatBlock', param: 'BLOCKQUOTE', icon: 'format_quote', tip: e.quote, key: 81},
        left: {cmd: 'justifyLeft', icon: 'format_align_left', tip: e.left},
        center: {cmd: 'justifyCenter', icon: 'format_align_center', tip: e.center},
        right: {cmd: 'justifyRight', icon: 'format_align_right', tip: e.right},
        justify: {cmd: 'justifyFull', icon: 'format_align_justify', tip: e.justify},

        print: {type: 'no-state', cmd: 'print', icon: 'print', tip: e.print, key: 80},
        outdent: {type: 'no-state', disable: function (vm) { return vm.caret && !vm.caret.can('outdent'); }, cmd: 'outdent', icon: 'format_indent_decrease', tip: e.outdent},
        indent: {type: 'no-state', disable: function (vm) { return vm.caret && !vm.caret.can('indent'); }, cmd: 'indent', icon: 'format_indent_increase', tip: e.indent},
        removeFormat: {type: 'no-state', cmd: 'removeFormat', icon: 'format_clear', tip: e.removeFormat},
        hr: {type: 'no-state', cmd: 'insertHorizontalRule', icon: 'remove', tip: e.hr},
        undo: {type: 'no-state', cmd: 'undo', icon: 'undo', tip: e.undo, key: 90},
        redo: {type: 'no-state', cmd: 'redo', icon: 'redo', tip: e.redo, key: 89},

        h1: {cmd: 'formatBlock', param: 'H1', icon: 'format_size', tip: e.header1, htmlTip: ("<h1>" + (e.header1) + "</h1>")},
        h2: {cmd: 'formatBlock', param: 'H2', icon: 'format_size', tip: e.header2, htmlTip: ("<h2>" + (e.header2) + "</h2>")},
        h3: {cmd: 'formatBlock', param: 'H3', icon: 'format_size', tip: e.header3, htmlTip: ("<h3>" + (e.header3) + "</h3>")},
        h4: {cmd: 'formatBlock', param: 'H4', icon: 'format_size', tip: e.header4, htmlTip: ("<h4>" + (e.header4) + "</h4>")},
        h5: {cmd: 'formatBlock', param: 'H5', icon: 'format_size', tip: e.header5, htmlTip: ("<h5>" + (e.header5) + "</h5>")},
        h6: {cmd: 'formatBlock', param: 'H6', icon: 'format_size', tip: e.header6, htmlTip: ("<h6>" + (e.header6) + "</h6>")},
        p: {cmd: 'formatBlock', param: 'DIV', icon: 'format_size', tip: e.paragraph},
        code: {cmd: 'formatBlock', param: 'PRE', icon: 'code', tip: ("<code>" + (e.code) + "</code>")},

        'size-1': {cmd: 'fontSize', param: '1', icon: 'filter_1', tip: e.size1, htmlTip: ("<font size=\"1\">" + (e.size1) + "</font>")},
        'size-2': {cmd: 'fontSize', param: '2', icon: 'filter_2', tip: e.size2, htmlTip: ("<font size=\"2\">" + (e.size2) + "</font>")},
        'size-3': {cmd: 'fontSize', param: '3', icon: 'filter_3', tip: e.size3, htmlTip: ("<font size=\"3\">" + (e.size3) + "</font>")},
        'size-4': {cmd: 'fontSize', param: '4', icon: 'filter_4', tip: e.size4, htmlTip: ("<font size=\"4\">" + (e.size4) + "</font>")},
        'size-5': {cmd: 'fontSize', param: '5', icon: 'filter_5', tip: e.size5, htmlTip: ("<font size=\"5\">" + (e.size5) + "</font>")},
        'size-6': {cmd: 'fontSize', param: '6', icon: 'filter_6', tip: e.size6, htmlTip: ("<font size=\"6\">" + (e.size6) + "</font>")},
        'size-7': {cmd: 'fontSize', param: '7', icon: 'filter_7', tip: e.size7, htmlTip: ("<font size=\"7\">" + (e.size7) + "</font>")}
      }
    },
    buttons: function buttons () {
      var def = this.definitions || this.fonts
        ? extend(true, {}, this.buttonDef, this.definitions || {}, getFonts(this.defaultFont, this.$q.i18n.editor.defaultFont, this.fonts))
        : this.buttonDef;

      return this.toolbar.map(
        function (group) { return group.map(function (token) {
          if (token.options) {
            return {
              type: 'dropdown',
              icon: token.icon,
              label: token.label,
              fixedLabel: token.fixedLabel,
              fixedIcon: token.fixedIcon,
              highlight: token.highlight,
              list: token.list,
              options: token.options.map(function (item) { return def[item]; })
            }
          }

          var obj = def[token];

          if (obj) {
            return token.handler
              ? extend(true, { type: 'no-state' }, obj)
              : obj
          }
          else {
            return {
              type: 'slot',
              slot: token
            }
          }
        }); }
      )
    },
    keys: function keys () {
      var
        k = {},
        add = function (btn) {
          if (btn.key) {
            k[btn.key] = {
              cmd: btn.cmd,
              param: btn.param
            };
          }
        };

      this.buttons.forEach(function (group) {
        group.forEach(function (token) {
          if (token.options) {
            token.options.forEach(add);
          }
          else {
            add(token);
          }
        });
      });
      return k
    }
  },
  data: function data () {
    return {
      editWatcher: true
    }
  },
  watch: {
    value: function value (v) {
      if (this.editWatcher) {
        this.$refs.content.innerHTML = v;
      }
      else {
        this.editWatcher = true;
      }
    }
  },
  methods: {
    onInput: function onInput (e) {
      if (this.editWatcher) {
        this.editWatcher = false;
        this.$emit('input', this.$refs.content.innerHTML);
      }
    },
    onKeydown: function onKeydown (e) {
      var key = getEventKey(e);
      this.refreshToolbar();

      if (!e.ctrlKey) {
        return
      }

      var target = this.keys[key];
      if (target !== void 0) {
        var cmd = target.cmd;
        var param = target.param;
        e.preventDefault();
        e.stopPropagation();
        this.runCmd(cmd, param, false);
      }
    },
    runCmd: function runCmd (cmd, param, update) {
      var this$1 = this;
      if ( update === void 0 ) update = true;

      this.focus();
      this.caret.apply(cmd, param, function () {
        this$1.focus();
        if (update) {
          this$1.refreshToolbar();
        }
      });
    },
    refreshToolbar: function refreshToolbar () {
      var this$1 = this;

      setTimeout(function () {
        this$1.$forceUpdate();
      }, 1);
    },
    focus: function focus () {
      this.$refs.content.focus();
    },
    getContentEl: function getContentEl () {
      return this.$refs.content
    }
  },
  created: function created () {
    document.execCommand('defaultParagraphSeparator', false, 'div');
    this.defaultFont = window.getComputedStyle(document.body).fontFamily;
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.caret = new Caret(this$1.$refs.content, this$1);
      this$1.$refs.content.innerHTML = this$1.value;
      this$1.$nextTick(this$1.refreshToolbar);
    });
  },
  render: function render (h) {
    var this$1 = this;

    return h(
      'div',
      { staticClass: 'q-editor' },
      [
        h(
          'div',
          {
            staticClass: 'q-editor-inner',
            style: {
              height: this.inFullscreen ? '100vh' : null
            },
            'class': {
              disabled: this.disable,
              fullscreen: this.inFullscreen,
              column: this.inFullscreen
            }
          },
          [
            this.readonly ? '' : h(
              'div',
              {
                staticClass: ("q-editor-toolbar q-editor-toolbar-padding overflow-auto row no-wrap bg-" + (this.toolbarColor)),
                'class': {
                  'q-editor-toolbar-separator': !this.outline && !this.push
                }
              },
              getToolbar(h, this)
            ),
            h(
              'div',
              {
                ref: 'content',
                staticClass: ("q-editor-content bg-" + (this.contentColor)),
                style: this.inFullscreen
                  ? {}
                  : { minHeight: this.minHeight, height: this.height, maxHeight: this.maxHeight },
                class: {
                  col: this.inFullscreen,
                  'overflow-auto': this.inFullscreen
                },
                attrs: { contenteditable: this.editable },
                on: {
                  input: this.onInput,
                  keydown: this.onKeydown,
                  click: this.refreshToolbar,
                  blur: function () {
                    this$1.caret.save();
                  }
                }
              }
            )
          ]
        )
      ]
    )
  }
};

var FabMixin = {
  props: {
    outline: Boolean,
    push: Boolean,
    flat: Boolean,
    color: String,
    glossy: Boolean
  }
};

var QFab = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-fab z-fab row inline justify-center",class:{'q-fab-opened': _vm.showing}},[_c('q-btn',{class:{glossy: _vm.glossy},attrs:{"round":"","outline":_vm.outline,"push":_vm.push,"flat":_vm.flat,"color":_vm.color},on:{"click":_vm.toggle}},[_vm._t("tooltip"),_vm._v(" "),_c('q-icon',{staticClass:"q-fab-icon absolute-full row flex-center full-width full-height",attrs:{"name":_vm.icon}}),_vm._v(" "),_c('q-icon',{staticClass:"q-fab-active-icon absolute-full row flex-center full-width full-height",attrs:{"name":_vm.activeIcon}})],2),_vm._v(" "),_c('div',{staticClass:"q-fab-actions flex no-wrap inline items-center",class:("q-fab-" + (_vm.direction))},[_vm._t("default")],2)],1)},staticRenderFns: [],
  name: 'q-fab',
  mixins: [FabMixin, ModelToggleMixin],
  components: {
    QBtn: QBtn,
    QIcon: QIcon
  },
  provide: function provide () {
    return {
      __qFabClose: this.hide
    }
  },
  props: {
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  watch: {
    $route: function $route () {
      this.hide();
    }
  },
  created: function created () {
    if (this.value) {
      this.show();
    }
  }
};

var QFabAction = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-btn',{attrs:{"round":"","small":"","outline":_vm.outline,"push":_vm.push,"flat":_vm.flat,"color":_vm.color,"glossy":_vm.glossy,"icon":_vm.icon},on:{"click":_vm.click}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-fab-action',
  mixins: [FabMixin],
  components: {
    QBtn: QBtn
  },
  inject: {
    __qFabClose: {
      default: function default$1 () {
        console.error('QFabAction needs to be child of QFab');
      }
    }
  },
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  methods: {
    click: function click (e) {
      var this$1 = this;

      this.__qFabClose().then(function () {
        this$1.$emit('click', e);
      });
    }
  }
};

var QField = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-field row no-wrap items-start",class:{ 'q-field-floating': _vm.childHasLabel, 'q-field-no-label': !this.label && !this.$slots.label, 'q-field-with-error': _vm.hasError, 'q-field-with-warning': _vm.hasWarning, 'q-field-dark': _vm.isDark }},[(_vm.icon)?_c('q-icon',{staticClass:"q-field-icon q-field-margin",attrs:{"name":_vm.icon}}):(_vm.insetIcon)?_c('div',{staticClass:"q-field-icon"}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"row col"},[(_vm.hasLabel)?_c('div',{staticClass:"q-field-label col-xs-12 q-field-margin",class:("col-sm-" + (_vm.labelWidth))},[_c('div',{staticClass:"q-field-label-inner row items-center"},[(_vm.label)?_c('span',{domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("label")],2)]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-field-content col-xs-12 col-sm"},[_vm._t("default"),_vm._v(" "),(_vm.hasBottom)?_c('div',{staticClass:"q-field-bottom row no-wrap",class:{'q-field-no-input': _vm.hasNoInput}},[(_vm.hasError && _vm.errorLabel)?_c('div',{staticClass:"q-field-error col",domProps:{"innerHTML":_vm._s(_vm.errorLabel)}}):(_vm.hasWarning && _vm.warningLabel)?_c('div',{staticClass:"q-field-warning col",domProps:{"innerHTML":_vm._s(_vm.warningLabel)}}):(_vm.helper)?_c('div',{staticClass:"q-field-helper col",domProps:{"innerHTML":_vm._s(_vm.helper)}}):_c('div',{staticClass:"col"}),_vm._v(" "),(_vm.counter)?_c('div',{staticClass:"q-field-counter col-auto"},[_vm._v(_vm._s(_vm.counter))]):_vm._e()]):_vm._e()],2)])],1)},staticRenderFns: [],
  name: 'q-field',
  components: {
    QIcon: QIcon
  },
  props: {
    labelWidth: {
      type: Number,
      default: 5,
      validator: function validator (val) {
        return val >= 1 && val < 12
      }
    },
    inset: {
      type: String,
      validator: function validator (val) {
        return ['icon', 'label', 'full'].includes(val)
      }
    },
    label: String,
    count: {
      type: [Number, Boolean],
      default: false
    },
    error: Boolean,
    errorLabel: String,
    warning: Boolean,
    warningLabel: String,
    helper: String,
    icon: String,
    dark: Boolean
  },
  data: function data () {
    return {
      input: {}
    }
  },
  computed: {
    hasError: function hasError () {
      return this.input.error || this.error
    },
    hasWarning: function hasWarning () {
      return !this.hasError && (this.input.warning || this.warning)
    },
    hasBottom: function hasBottom () {
      return (this.hasError && this.errorLabel) ||
        (this.hasWarning && this.warningLabel) ||
        this.helper ||
        this.count
    },
    hasLabel: function hasLabel () {
      return this.label || this.$slots.label || ['label', 'full'].includes(this.inset)
    },
    childHasLabel: function childHasLabel () {
      return this.input.floatLabel || this.input.stackLabel
    },
    isDark: function isDark () {
      return this.input.dark || this.dark
    },
    insetIcon: function insetIcon () {
      return ['icon', 'full'].includes(this.inset)
    },
    hasNoInput: function hasNoInput () {
      return !this.input.$options || this.input.__needsBottom
    },
    counter: function counter () {
      if (this.count) {
        var length = this.input.length || '0';
        return Number.isInteger(this.count)
          ? (length + " / " + (this.count))
          : length
      }
    }
  },
  provide: function provide () {
    return {
      __field: this
    }
  },
  methods: {
    __registerInput: function __registerInput (vm, needsBottom) {
      vm.__needsBottom = needsBottom;
      this.input = vm;
    },
    __unregisterInput: function __unregisterInput () {
      this.input = {};
    }
  }
};

var QFieldReset = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-field-reset',
  data: function data () {
    return {}
  },
  provide: function provide () {
    return {
      __field: undefined
    }
  }
};

var QInfiniteScroll = {
  name: 'q-infinite-scroll',
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: Boolean,
    offset: {
      type: Number,
      default: 0
    }
  },
  data: function data () {
    return {
      index: 0,
      fetching: false,
      working: true
    }
  },
  methods: {
    poll: function poll () {
      if (this.fetching || !this.working) {
        return
      }

      var
        containerHeight = height(this.scrollContainer),
        containerBottom = offset(this.scrollContainer).top + containerHeight,
        triggerPosition = offset(this.element).top + height(this.element) - (this.offset || containerHeight);

      if (triggerPosition < containerBottom) {
        this.loadMore();
      }
    },
    loadMore: function loadMore () {
      var this$1 = this;

      if (this.fetching || !this.working) {
        return
      }

      this.index++;
      this.fetching = true;
      this.handler(this.index, function (stopLoading) {
        this$1.fetching = false;
        if (stopLoading) {
          this$1.stop();
          return
        }
        if (this$1.element.closest('body')) {
          this$1.poll();
        }
      });
    },
    reset: function reset () {
      this.index = 0;
    },
    resume: function resume () {
      this.working = true;
      this.scrollContainer.addEventListener('scroll', this.poll);
      this.poll();
    },
    stop: function stop () {
      this.working = false;
      this.scrollContainer.removeEventListener('scroll', this.poll);
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.poll = debounce(this$1.poll, 50);
      this$1.element = this$1.$refs.content;

      this$1.scrollContainer = this$1.inline ? this$1.$el : getScrollTarget(this$1.$el);
      if (this$1.working) {
        this$1.scrollContainer.addEventListener('scroll', this$1.poll);
      }

      this$1.poll();
    });
  },
  beforeDestroy: function beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.poll);
  },
  render: function render (h) {
    return h('div', { staticClass: 'q-infinite-scroll' }, [
      h('div', {
        ref: 'content',
        staticClass: 'q-infinite-scroll-content'
      }, [ this.$slots.default ]),
      h('div', {
        staticClass: 'q-infinite-scroll-message',
        directives: [{
          name: 'show',
          value: this.fetching
        }]
      }, [
        this.$slots.message
      ])
    ])
  }
};

var QInnerLoading = {
  name: 'q-inner-loading',
  props: {
    dark: Boolean,
    visible: Boolean,
    size: {
      type: [String, Number],
      default: 42
    },
    color: String
  },
  render: function render (h) {
    if (!this.visible) {
      return
    }

    return h('div', {
      staticClass: 'q-inner-loading animate-fade absolute-full column flex-center',
      'class': { dark: this.dark }
    }, [
      this.$slots.default ||
      h(QSpinner, {
        props: {
          size: this.size,
          color: this.color
        }
      })
    ])
  }
};

var QKnob = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-knob non-selectable",class:_vm.classes,style:({width: _vm.size, height: _vm.size})},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan",value:(_vm.__pan),expression:"__pan"}],on:{"click":function($event){_vm.__onInput($event, undefined, true);}}},[_c('svg',{attrs:{"viewBox":"0 0 100 100"}},[_c('path',{class:("text-" + (_vm.trackColor)),attrs:{"d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":"currentColor","stroke-width":_vm.lineWidth,"fill-opacity":"0"}}),_vm._v(" "),_c('path',{style:(_vm.svgStyle),attrs:{"stroke-linecap":"round","fill-opacity":"0","d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":"currentColor","stroke-width":_vm.lineWidth}})]),_vm._v(" "),_c('div',{staticClass:"q-knob-label row flex-center content-center"},[(!_vm.$slots.default)?_c('span',[_vm._v(_vm._s(_vm.model))]):_vm._t("default")],2)])])},staticRenderFns: [],
  name: 'q-knob',
  directives: {
    TouchPan: TouchPan
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: String,
    trackColor: {
      type: String,
      default: 'grey-3'
    },
    lineWidth: {
      type: String,
      default: '6px'
    },
    size: {
      type: String,
      default: '100px'
    },
    step: {
      type: Number,
      default: 1
    },
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    classes: function classes () {
      var cls = [];
      if (this.disable) {
        cls.push('disabled');
      }
      if (!this.readonly) {
        cls.push('cursor-pointer');
      }
      if (this.color) {
        cls.push(("text-" + (this.color)));
      }
      return cls
    },
    svgStyle: function svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.model - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    editable: function editable () {
      return !this.disable && !this.readonly
    }
  },
  data: function data () {
    return {
      model: this.value,
      dragging: false
    }
  },
  watch: {
    value: function value (value$1) {
      if (value$1 < this.min) {
        this.$emit('input', this.min);
        this.model = this.min;
      }
      else if (value$1 > this.max) {
        this.$emit('input', this.max);
        this.model = this.max;
      }
      else {
        this.model = value$1;
      }
    }
  },
  methods: {
    __pan: function __pan (event) {
      if (!this.editable) {
        return
      }
      if (event.isFinal) {
        this.__dragStop(event.evt);
      }
      else if (event.isFirst) {
        this.__dragStart(event.evt);
      }
      else {
        this.__dragMove(event.evt);
      }
    },
    __dragStart: function __dragStart (ev) {
      if (!this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();

      this.centerPosition = this.__getCenter();

      this.dragging = true;
      this.__onInput(ev);
    },
    __dragMove: function __dragMove (ev) {
      if (!this.dragging || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__onInput(ev, this.centerPosition);
    },
    __dragStop: function __dragStop (ev) {
      if (!this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
      this.__onInput(ev, this.centerPosition, true);
    },
    __onInput: function __onInput (ev, center, emitChange) {
      if ( center === void 0 ) center = this.__getCenter();

      if (!this.editable) {
        return
      }
      var
        pos = position(ev),
        height$$1 = Math.abs(pos.top - center.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - center.top), 2) +
          Math.pow(Math.abs(pos.left - center.left), 2)
        ),
        angle = Math.asin(height$$1 / distance) * (180 / Math.PI);

      if (pos.top < center.top) {
        angle = center.left < pos.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = center.left < pos.left ? angle + 90 : 270 - angle;
      }

      var
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step;

      var val = between(
        model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0),
        this.min,
        this.max
      );

      if (this.model !== val) {
        this.model = val;
        this.$emit('input', val);
      }
      if (emitChange && this.value !== val) {
        this.$emit('change', val);
      }
    },
    __getCenter: function __getCenter () {
      var knobOffset = offset(this.$el);
      return {
        top: knobOffset.top + height(this.$el) / 2,
        left: knobOffset.left + width(this.$el) / 2
      }
    }
  }
};

var QLayout = {
  name: 'q-layout',
  provide: function provide () {
    return {
      layout: this
    }
  },
  props: {
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: function (v) { return /^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(v.toLowerCase()); }
    }
  },
  data: function data () {
    var ref = viewport();
    var height$$1 = ref.height;
    var width$$1 = ref.width;

    return {
      height: height$$1, // window height
      width: width$$1, // window width

      header: {
        size: 0,
        offset: 0,
        space: true
      },
      right: {
        size: 300,
        offset: 0,
        space: false
      },
      footer: {
        size: 0,
        offset: 0,
        space: true
      },
      left: {
        size: 300,
        offset: 0,
        space: false
      },

      scrollHeight: 0,
      scroll: {
        position: 0,
        direction: 'down'
      }
    }
  },
  computed: {
    rows: function rows () {
      var rows = this.view.toLowerCase().split(' ');
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    }
  },
  render: function render (h) {
    return h('div', { staticClass: 'q-layout' }, [
      h(QScrollObservable, {
        on: { scroll: this.__onPageScroll }
      }),
      h(QResizeObservable, {
        on: { resize: this.__onLayoutResize }
      }),
      h(QWindowResizeObservable, {
        on: { resize: this.__onWindowResize }
      }),
      this.$slots.default
    ])
  },
  methods: {
    __animate: function __animate () {
      var this$1 = this;

      if (this.timer) {
        clearTimeout(this.timer);
      }
      else {
        document.body.classList.add('q-layout-animate');
      }
      this.timer = setTimeout(function () {
        document.body.classList.remove('q-layout-animate');
        this$1.timer = null;
      }, 150);
    },
    __onPageScroll: function __onPageScroll (data) {
      this.scroll = data;
      this.$emit('scroll', data);
    },
    __onLayoutResize: function __onLayoutResize () {
      this.scrollHeight = getScrollHeight(this.$el);
      this.$emit('scrollHeight', this.scrollHeight);
    },
    __onWindowResize: function __onWindowResize (ref) {
      var height$$1 = ref.height;
      var width$$1 = ref.width;

      if (this.height !== height$$1) {
        this.height = height$$1;
      }
      if (this.width !== width$$1) {
        this.width = width$$1;
      }
    }
  }
};

var bodyClassBelow = 'with-layout-drawer-opened';
var bodyClassAbove = 'with-layout-drawer-opened-above';
var duration = 150;

var QLayoutDrawer = {
  name: 'q-layout-drawer',
  inject: {
    layout: {
      default: function default$1 () {
        console.error('QLayoutDrawer needs to be child of QLayout');
      }
    }
  },
  mixins: [ModelToggleMixin],
  directives: {
    TouchPan: TouchPan
  },
  props: {
    overlay: Boolean,
    rightSide: Boolean,
    breakpoint: {
      type: Number,
      default: 992
    },
    behavior: {
      type: String,
      validator: function (v) { return ['default', 'desktop', 'mobile'].includes(v); },
      default: 'default'
    }
  },
  data: function data () {
    var
      largeScreenState = this.value !== void 0 ? this.value : true,
      showing = this.behavior !== 'mobile' && this.breakpoint < this.layout.width && !this.overlay
        ? largeScreenState
        : false;

    if (this.value !== void 0 && this.value !== showing) {
      this.$emit('input', showing);
    }

    return {
      showing: showing,
      belowBreakpoint: (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && this.breakpoint >= this.layout.width)
      ),
      largeScreenState: largeScreenState,
      mobileOpened: false,

      size: 300,
      inTransit: false,
      position: 0,
      percentage: 0
    }
  },
  watch: {
    belowBreakpoint: function belowBreakpoint (val, old) {
      if (this.mobileOpened) {
        return
      }

      if (val) { // from lg to xs
        if (!this.overlay) {
          this.largeScreenState = this.showing;
        }
        // ensure we close it for small screen
        this.hide();
      }
      else if (!this.overlay) { // from xs to lg
        this[this.largeScreenState ? 'show' : 'hide']();
      }
    },
    behavior: function behavior (val) {
      this.__updateLocal('belowBreakpoint', (
        val === 'mobile' ||
        (val !== 'desktop' && this.breakpoint >= this.layout.width)
      ));
    },
    breakpoint: function breakpoint (val) {
      this.__updateLocal('belowBreakpoint', (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && val >= this.layout.width)
      ));
    },
    'layout.width': function layout_width (val) {
      this.__updateLocal('belowBreakpoint', (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && this.breakpoint >= val)
      ));
    },
    offset: function offset$$1 (val) {
      this.__update('offset', val);
    },
    onScreenOverlay: function onScreenOverlay () {
      if (this.animateOverlay) {
        this.layout.__animate();
      }
    },
    onLayout: function onLayout (val) {
      this.__update('space', val);
      this.layout.__animate();
    },
    $route: function $route () {
      if (this.mobileOpened) {
        this.hide();
        return
      }
      if (this.onScreenOverlay) {
        this.hide();
      }
    }
  },
  computed: {
    side: function side () {
      return this.rightSide ? 'right' : 'left'
    },
    offset: function offset$$1 () {
      return this.showing && !this.mobileOpened
        ? this.size
        : 0
    },
    fixed: function fixed () {
      return this.overlay || this.layout.view.indexOf(this.rightSide ? 'R' : 'L') > -1
    },
    onLayout: function onLayout () {
      return this.showing && !this.mobileView && !this.overlay
    },
    onScreenOverlay: function onScreenOverlay () {
      return this.showing && !this.mobileView && this.overlay
    },
    backdropClass: function backdropClass () {
      return {
        'q-layout-backdrop-transition': !this.inTransit,
        'no-pointer-events': !this.inTransit && !this.showing
      }
    },
    mobileView: function mobileView () {
      return this.belowBreakpoint || this.mobileOpened
    },
    headerSlot: function headerSlot () {
      return this.overlay
        ? false
        : (this.rightSide
          ? this.layout.rows.top[2] === 'r'
          : this.layout.rows.top[0] === 'l'
        )
    },
    footerSlot: function footerSlot () {
      return this.overlay
        ? false
        : (this.rightSide
          ? this.layout.rows.bottom[2] === 'r'
          : this.layout.rows.bottom[0] === 'l'
        )
    },
    backdropStyle: function backdropStyle () {
      return { backgroundColor: ("rgba(0,0,0," + (this.percentage * 0.4) + ")") }
    },
    belowClass: function belowClass () {
      return {
        'fixed': true,
        'on-top': true,
        'on-screen': this.showing,
        'off-screen': !this.showing,
        'transition-generic': !this.inTransit,
        'top-padding': this.fixed || this.headerSlot
      }
    },
    belowStyle: function belowStyle () {
      if (this.inTransit) {
        return cssTransform(("translateX(" + (this.position) + "px)"))
      }
    },
    aboveClass: function aboveClass () {
      var onScreen = this.onLayout || this.onScreenOverlay;
      return {
        'off-screen': !onScreen,
        'on-screen': onScreen,
        'fixed': this.fixed || !this.onLayout,
        'top-padding': this.fixed || this.headerSlot
      }
    },
    aboveStyle: function aboveStyle () {
      var css$$1 = {};

      if (this.layout.header.space && !this.headerSlot) {
        if (this.fixed) {
          css$$1.top = (this.layout.header.offset) + "px";
        }
        else if (this.layout.header.space) {
          css$$1.top = (this.layout.header.size) + "px";
        }
      }

      if (this.layout.footer.space && !this.footerSlot) {
        if (this.fixed) {
          css$$1.bottom = (this.layout.footer.offset) + "px";
        }
        else if (this.layout.footer.space) {
          css$$1.bottom = (this.layout.footer.size) + "px";
        }
      }

      return css$$1
    },
    computedStyle: function computedStyle () {
      return this.mobileView ? this.belowStyle : this.aboveStyle
    },
    computedClass: function computedClass () {
      return this.mobileView ? this.belowClass : this.aboveClass
    }
  },
  render: function render (h) {
    var child = [];

    if (this.mobileView) {
      child.push(h('div', {
        staticClass: ("q-layout-drawer-opener fixed-" + (this.side)),
        directives: [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__openByTouch
        }]
      }));
      child.push(h('div', {
        staticClass: 'fullscreen q-layout-backdrop',
        'class': this.backdropClass,
        style: this.backdropStyle,
        on: { click: this.hide },
        directives: [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__closeByTouch
        }]
      }));
    }

    return h('div', { staticClass: 'q-drawer-container' }, child.concat([
      h('aside', {
        staticClass: ("q-layout-drawer q-layout-drawer-" + (this.side) + " scroll q-layout-transition"),
        'class': this.computedClass,
        style: this.computedStyle,
        directives: this.mobileView ? [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__closeByTouch
        }] : null
      }, [
        this.$slots.default,
        h(QResizeObservable, {
          on: { resize: this.__onResize }
        })
      ])
    ]))
  },
  created: function created () {
    var this$1 = this;

    if (this.onLayout) {
      this.__update('space', true);
      this.__update('offset', this.offset);
    }

    this.$nextTick(function () {
      this$1.animateOverlay = true;
    });
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
    this.__update('size', 0);
    this.__update('space', false);
  },
  methods: {
    __openByTouch: function __openByTouch (evt) {
      if (!this.belowBreakpoint) {
        return
      }
      var
        width$$1 = this.size,
        position = between(evt.distance.x, 0, width$$1);

      if (evt.isFinal) {
        var opened = position >= Math.min(75, width$$1);
        this.inTransit = false;
        if (opened) { this.show(); }
        else { this.percentage = 0; }
        return
      }

      this.position = this.rightSide
        ? Math.max(width$$1 - position, 0)
        : Math.min(0, position - width$$1);

      this.percentage = between(position / width$$1, 0, 1);

      if (evt.isFirst) {
        document.body.classList.add(bodyClassBelow);
        this.inTransit = true;
      }
    },
    __closeByTouch: function __closeByTouch (evt) {
      if (!this.mobileOpened) {
        return
      }
      var
        width$$1 = this.size,
        position = evt.direction === this.side
          ? between(evt.distance.x, 0, width$$1)
          : 0;

      if (evt.isFinal) {
        var opened = Math.abs(position) < Math.min(75, width$$1);
        this.inTransit = false;
        if (opened) { this.percentage = 1; }
        else { this.hide(); }
        return
      }

      this.position = (this.rightSide ? 1 : -1) * position;
      this.percentage = between(1 - position / width$$1, 0, 1);

      if (evt.isFirst) {
        this.inTransit = true;
      }
    },
    __show: function __show () {
      var this$1 = this;

      if (this.belowBreakpoint) {
        this.mobileOpened = true;
        this.percentage = 1;
      }

      document.body.classList.add(this.belowBreakpoint ? bodyClassBelow : bodyClassAbove);

      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        if (this$1.showPromise) {
          this$1.showPromise.then(function () {
            document.body.classList.remove(bodyClassAbove);
          });
          this$1.showPromiseResolve();
        }
      }, duration);
    },
    __hide: function __hide () {
      var this$1 = this;

      this.mobileOpened = false;
      this.percentage = 0;
      document.body.classList.remove(bodyClassAbove, bodyClassBelow);

      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        this$1.hidePromise && this$1.hidePromiseResolve();
      }, duration);
    },

    __onResize: function __onResize (ref) {
      var width$$1 = ref.width;

      this.__update('size', width$$1);
      this.__updateLocal('size', width$$1);
    },
    __update: function __update (prop, val) {
      if (this.layout[this.side][prop] !== val) {
        this.layout[this.side][prop] = val;
      }
    },
    __updateLocal: function __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val;
      }
    }
  }
};

var QLayoutFooter = {
  name: 'q-layout-footer',
  inject: {
    layout: {
      default: function default$1 () {
        console.error('QLayoutFooter needs to be child of QLayout');
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    reveal: Boolean
  },
  data: function data () {
    return {
      size: 0,
      revealed: true
    }
  },
  watch: {
    value: function value (val) {
      this.__update('space', val);
      this.__updateLocal('revealed', true);
      this.layout.__animate();
    },
    offset: function offset (val) {
      this.__update('offset', val);
    },
    revealed: function revealed () {
      this.layout.__animate();
    },
    'layout.scroll': function layout_scroll () {
      this.__updateRevealed();
    },
    'layout.scrollHeight': function layout_scrollHeight () {
      this.__updateRevealed();
    },
    size: function size () {
      this.__updateRevealed();
    }
  },
  computed: {
    fixed: function fixed () {
      return this.reveal || this.layout.view.indexOf('F') > -1
    },
    offset: function offset () {
      if (!this.value) {
        return 0
      }
      if (this.fixed) {
        return this.revealed ? this.size : 0
      }
      var offset = this.layout.height + this.layout.scroll.position + this.size - this.layout.scrollHeight;
      return offset > 0 ? offset : 0
    },
    computedClass: function computedClass () {
      return {
        'fixed-bottom': this.fixed,
        'absolute-bottom': !this.fixed,
        'hidden': !this.value && !this.fixed,
        'q-layout-footer-hidden': !this.value || (this.fixed && !this.revealed)
      }
    },
    computedStyle: function computedStyle () {
      var
        view = this.layout.rows.bottom,
        css = {};

      if (view[0] === 'l' && this.layout.left.space) {
        css.marginLeft = (this.layout.left.size) + "px";
      }
      if (view[2] === 'r' && this.layout.right.space) {
        css.marginRight = (this.layout.right.size) + "px";
      }

      return css
    }
  },
  render: function render (h) {
    return h('footer', {
      staticClass: 'q-layout-footer q-layout-transition',
      'class': this.computedClass,
      style: this.computedStyle
    }, [
      h(QResizeObservable, {
        on: { resize: this.__onResize }
      }),
      this.$slots.default
    ])
  },
  created: function created () {
    this.__update('space', this.value);
  },
  destroyed: function destroyed () {
    this.__update('size', 0);
    this.__update('space', false);
  },
  methods: {
    __onResize: function __onResize (ref) {
      var height = ref.height;

      this.__updateLocal('size', height);
      this.__update('size', height);
    },
    __update: function __update (prop, val) {
      if (this.layout.footer[prop] !== val) {
        this.layout.footer[prop] = val;
      }
    },
    __updateLocal: function __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val;
      }
    },
    __updateRevealed: function __updateRevealed () {
      if (!this.reveal) {
        return
      }
      var
        scroll = this.layout.scroll,
        scrollHeight = this.layout.scrollHeight,
        height = this.layout.height;

      this.__updateLocal('revealed',
        scroll.direction === 'up' ||
        scroll.position - scroll.inflexionPosition < 100 ||
        scrollHeight - height - scroll.position < this.size + 300
      );
    }
  }
};

var QLayoutHeader = {
  name: 'q-layout-header',
  inject: {
    layout: {
      default: function default$1 () {
        console.error('QLayoutHeader needs to be child of QLayout');
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    revealOffset: {
      type: Number,
      default: 250
    }
  },
  data: function data () {
    return {
      size: 0,
      revealed: true
    }
  },
  watch: {
    value: function value (val) {
      this.__update('space', val);
      this.__updateLocal('revealed', true);
      this.layout.__animate();
    },
    offset: function offset (val) {
      this.__update('offset', val);
    },
    revealed: function revealed () {
      this.layout.__animate();
    },
    'layout.scroll': function layout_scroll (scroll) {
      if (!this.reveal) {
        return
      }
      this.__updateLocal('revealed',
        scroll.direction === 'up' ||
        scroll.position <= this.revealOffset ||
        scroll.position - scroll.inflexionPosition < 100
      );
    }
  },
  computed: {
    fixed: function fixed () {
      return this.reveal || this.layout.view.indexOf('H') > -1
    },
    offset: function offset () {
      if (!this.value) {
        return 0
      }
      if (this.fixed) {
        return this.revealed ? this.size : 0
      }
      var offset = this.size - this.layout.scroll.position;
      return offset > 0 ? offset : 0
    },
    computedClass: function computedClass () {
      return {
        'fixed-top': this.fixed,
        'absolute-top': !this.fixed,
        'q-layout-header-hidden': !this.value || (this.fixed && !this.revealed)
      }
    },
    computedStyle: function computedStyle () {
      var
        view = this.layout.rows.top,
        css = {};

      if (view[0] === 'l' && this.layout.left.space) {
        css.marginLeft = (this.layout.left.size) + "px";
      }
      if (view[2] === 'r' && this.layout.right.space) {
        css.marginRight = (this.layout.right.size) + "px";
      }

      return css
    }
  },
  render: function render (h) {
    return h('header', {
      staticClass: 'q-layout-header q-layout-transition',
      'class': this.computedClass,
      style: this.computedStyle
    }, [
      h(QResizeObservable, {
        on: { resize: this.__onResize }
      }),
      this.$slots.default
    ])
  },
  created: function created () {
    this.__update('space', this.value);
  },
  destroyed: function destroyed () {
    this.__update('size', 0);
    this.__update('space', false);
  },
  methods: {
    __onResize: function __onResize (ref) {
      var height = ref.height;

      this.__updateLocal('size', height);
      this.__update('size', height);
    },
    __update: function __update (prop, val) {
      if (this.layout.header[prop] !== val) {
        this.layout.header[prop] = val;
      }
    },
    __updateLocal: function __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val;
      }
    }
  }
};

var QPage = {
  name: 'q-page',
  inject: {
    pageContainer: {
      default: function default$1 () {
        console.error('QPage needs to be child of QPageContainer');
      }
    },
    layout: {}
  },
  props: {
    padding: Boolean
  },
  computed: {
    computedStyle: function computedStyle () {
      var offset =
        (this.layout.header.space ? this.layout.header.size : 0) +
        (this.layout.footer.space ? this.layout.footer.size : 0);

      return {
        minHeight: offset ? ("calc(100vh - " + offset + "px)") : '100vh'
      }
    },
    computedClass: function computedClass () {
      if (this.padding) {
        return 'layout-padding'
      }
    }
  },
  render: function render (h) {
    return h('main', {
      staticClass: 'q-layout-page',
      style: this.computedStyle,
      'class': this.computedClass
    }, [
      this.$slots.default
    ])
  }
};

var QPageContainer = {
  name: 'q-page-container',
  inject: {
    layout: {
      default: function default$1 () {
        console.error('QPageContainer needs to be child of QLayout');
      }
    }
  },
  provide: {
    pageContainer: true
  },
  computed: {
    computedStyle: function computedStyle () {
      var css = {};

      if (this.layout.header.space) {
        css.paddingTop = (this.layout.header.size) + "px";
      }
      if (this.layout.right.space) {
        css.paddingRight = (this.layout.right.size) + "px";
      }
      if (this.layout.footer.space) {
        css.paddingBottom = (this.layout.footer.size) + "px";
      }
      if (this.layout.left.space) {
        css.paddingLeft = (this.layout.left.size) + "px";
      }

      return css
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-layout-page-container q-layout-transition',
      style: this.computedStyle
    }, [
      this.$slots.default
    ])
  }
};

var QPageSticky = {
  name: 'q-page-sticky',
  inject: {
    layout: {
      default: function default$1 () {
        console.error('QPageSticky needs to be child of QLayout');
      }
    }
  },
  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: function (v) { return [
        'top-right', 'top-left',
        'bottom-right', 'bottom-left',
        'top', 'right', 'bottom', 'left'
      ].includes(v); }
    },
    offset: {
      type: Array,
      validator: function (v) { return v.length === 2; }
    }
  },
  computed: {
    attach: function attach () {
      var pos = this.position;

      return {
        top: pos.indexOf('top') > -1,
        right: pos.indexOf('right') > -1,
        bottom: pos.indexOf('bottom') > -1,
        left: pos.indexOf('left') > -1,
        vertical: pos === 'top' || pos === 'bottom',
        horizontal: pos === 'left' || pos === 'right'
      }
    },
    top: function top () {
      return this.layout.header.offset
    },
    right: function right () {
      return this.layout.right.offset
    },
    bottom: function bottom () {
      return this.layout.footer.offset
    },
    left: function left () {
      return this.layout.left.offset
    },
    computedStyle: function computedStyle () {
      var
        attach = this.attach,
        transforms = [];

      if (attach.top && this.top) {
        transforms.push(("translateY(" + (this.top) + "px)"));
      }
      else if (attach.bottom && this.bottom) {
        transforms.push(("translateY(" + (-this.bottom) + "px)"));
      }

      if (attach.left && this.left) {
        transforms.push(("translateX(" + (this.left) + "px)"));
      }
      else if (attach.right && this.right) {
        transforms.push(("translateX(" + (-this.right) + "px)"));
      }

      var css$$1 = transforms.length
        ? cssTransform(transforms.join(' '))
        : {};

      if (this.offset) {
        css$$1.margin = (this.offset[1]) + "px " + (this.offset[0]) + "px";
      }

      if (attach.vertical) {
        if (this.left) {
          css$$1.left = (this.left) + "px";
        }
        if (this.right) {
          css$$1.right = (this.right) + "px";
        }
      }
      else if (attach.horizontal) {
        if (this.top) {
          css$$1.top = (this.top) + "px";
        }
        if (this.bottom) {
          css$$1.bottom = (this.bottom) + "px";
        }
      }

      return css$$1
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-page-sticky q-layout-transition z-fixed',
      'class': ("fixed-" + (this.position)),
      style: this.computedStyle
    }, [
      this.$slots.default
    ])
  }
};

var QPagination = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-pagination",class:{disabled: _vm.disable}},[_c('q-btn',{attrs:{"disable":_vm.value === _vm.min,"color":_vm.color,"flat":"","small":"","icon":"first_page"},on:{"click":function($event){_vm.set(_vm.min);}}}),_vm._v(" "),_c('q-btn',{attrs:{"disable":_vm.value === _vm.min,"color":_vm.color,"flat":"","small":"","icon":"keyboard_arrow_left"},on:{"click":function($event){_vm.setByOffset(-1);}}}),_vm._v(" "),_c('q-input',{ref:"input",staticClass:"inline",style:({width: ((_vm.inputPlaceholder.length) + "rem")}),attrs:{"type":"number","min":_vm.min,"max":_vm.max,"color":_vm.color,"placeholder":_vm.inputPlaceholder,"disable":_vm.disable},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.__update($event);},"blur":_vm.__update},model:{value:(_vm.newPage),callback:function ($$v) {_vm.newPage=$$v;},expression:"newPage"}}),_vm._v(" "),_c('q-btn',{attrs:{"disable":_vm.value === _vm.max,"color":_vm.color,"flat":"","small":"","icon":"keyboard_arrow_right"},on:{"click":function($event){_vm.setByOffset(1);}}}),_vm._v(" "),_c('q-btn',{attrs:{"disable":_vm.value === _vm.max,"color":_vm.color,"flat":"","small":"","icon":"last_page"},on:{"click":function($event){_vm.set(_vm.max);}}})],1)},staticRenderFns: [],
  name: 'q-pagination',
  components: {
    QBtn: QBtn,
    QInput: QInput
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    disable: Boolean
  },
  data: function data () {
    return {
      newPage: ''
    }
  },
  methods: {
    set: function set (value) {
      if (!this.disable) {
        this.model = value;
      }
    },
    setByOffset: function setByOffset (offset) {
      if (!this.disable) {
        this.model = this.value + offset;
      }
    },
    __normalize: function __normalize (value) {
      return between(parseInt(value, 10), 1, this.max)
    },
    __update: function __update () {
      var parsed = parseInt(this.newPage, 10);
      if (parsed) {
        this.model = parsed;
      }

      this.newPage = '';
    }
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (value) {
        if (!value) {
          return
        }
        if (value < this.min || value > this.max) {
          return
        }
        if (this.value !== value) {
          this.$emit('input', value);
          this.$emit('change', value);
        }
      }
    },
    inputPlaceholder: function inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
};

var QParallax = {
  name: 'q-parallax',
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator: function validator (value) {
        return value >= 0 && value <= 1
      }
    }
  },
  data: function data () {
    return {
      imageHasBeenLoaded: false,
      scrolling: false
    }
  },
  watch: {
    src: function src () {
      this.imageHasBeenLoaded = false;
    },
    height: function height$$1 () {
      this.__updatePos();
    }
  },
  methods: {
    __processImage: function __processImage () {
      this.imageHasBeenLoaded = true;
      this.__onResize();
    },
    __onResize: function __onResize () {
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      if (this.scrollTarget === window) {
        this.viewportHeight = viewport().height;
      }
      this.imageHeight = height(this.image);
      this.__updatePos();
    },
    __updatePos: function __updatePos () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      var containerTop, containerHeight, containerBottom, top, bottom;

      if (this.scrollTarget === window) {
        containerTop = 0;
        containerHeight = this.viewportHeight;
        containerBottom = containerHeight;
      }
      else {
        containerTop = offset(this.scrollTarget).top;
        containerHeight = height(this.scrollTarget);
        containerBottom = containerTop + containerHeight;
      }
      top = offset(this.container).top;
      bottom = top + this.height;

      if (bottom > containerTop && top < containerBottom) {
        var percentScrolled = (containerBottom - top) / (this.height + containerHeight);
        this.__setPos(Math.round((this.imageHeight - this.height) * percentScrolled * this.speed));
      }
    },
    __setPos: function __setPos (offset$$1) {
      css(this.$refs.img, cssTransform(("translate3D(-50%," + offset$$1 + "px, 0)")));
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-parallax',
      style: { height: ((this.height) + "px") }
    }, [
      h('div', {
        staticClass: 'q-parallax-image absolute-full'
      }, [
        h('img', {
          ref: 'img',
          domProps: {
            src: this.src
          },
          'class': { ready: this.imageHasBeenLoaded },
          on: {
            load: this.__processImage
          }
        })
      ]),

      h('div', {
        staticClass: 'q-parallax-text absolute-full column flex-center'
      }, [
        this.imageHasBeenLoaded
          ? this.$slots.default
          : this.$slots.loading
      ])
    ])
  },
  created: function created () {
    this.__setPos = frameDebounce(this.__setPos);
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.container = this$1.$el;
      this$1.image = this$1.$refs.img;

      this$1.scrollTarget = getScrollTarget(this$1.$el);
      this$1.resizeHandler = debounce(this$1.__onResize, 50);

      window.addEventListener('resize', this$1.resizeHandler);
      this$1.scrollTarget.addEventListener('scroll', this$1.__updatePos);
      this$1.__onResize();
    });
  },
  beforeDestroy: function beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler);
    this.scrollTarget.removeEventListener('scroll', this.__updatePos);
  }
};

function width$1 (val) {
  return { width: (val + "%") }
}

var QProgress = {
  name: 'q-progress',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    color: String,
    stripe: Boolean,
    animate: Boolean,
    indeterminate: Boolean,
    buffer: Number,
    height: {
      type: String,
      default: '4px'
    }
  },
  computed: {
    model: function model () {
      return between(this.percentage, 0, 100)
    },
    bufferModel: function bufferModel () {
      return between(this.buffer || 0, 0, 100 - this.model)
    },
    bufferStyle: function bufferStyle () {
      return width$1(this.bufferModel)
    },
    trackStyle: function trackStyle () {
      return width$1(this.buffer ? 100 - this.buffer : 100)
    },
    computedClass: function computedClass () {
      if (this.color) {
        return ("text-" + (this.color))
      }
    },
    computedStyle: function computedStyle () {
      return { height: this.height }
    },
    modelClass: function modelClass () {
      return {
        animate: this.animate,
        stripe: this.stripe,
        indeterminate: this.indeterminate
      }
    },
    modelStyle: function modelStyle () {
      return width$1(this.model)
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-progress',
      style: this.computedStyle,
      'class': this.computedClass
    }, [
      this.buffer && !this.indeterminate
        ? h('div', {
          staticClass: 'q-progress-buffer',
          style: this.bufferStyle
        })
        : null,

      h('div', {
        staticClass: 'q-progress-track',
        style: this.trackStyle
      }),

      h('div', {
        staticClass: 'q-progress-model',
        style: this.modelStyle,
        'class': this.modelClass
      })
    ])
  }
};

var QPullToRefresh = {
  name: 'q-pull-to-refresh',
  directives: {
    TouchPan: TouchPan
  },
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: String,
    releaseMessage: String,
    refreshMessage: String,
    refreshIcon: {
      type: String,
      default: 'refresh'
    },
    inline: Boolean,
    disable: Boolean
  },
  data: function data () {
    var height$$1 = 65;

    return {
      state: 'pull',
      pullPosition: -height$$1,
      height: height$$1,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  computed: {
    message: function message () {
      switch (this.state) {
        case 'pulled':
          return this.releaseMessage || this.$q.i18n.label.pullToRefresh.release
        case 'refreshing':
          return this.refreshMessage || this.$q.i18n.label.pullToRefresh.refresh
        case 'pull':
        default:
          return this.pullMessage || this.$q.i18n.label.pullToRefresh.pull
      }
    },
    style: function style$$1 () {
      return cssTransform(("translateY(" + (this.pullPosition) + "px)"))
    }
  },
  methods: {
    __pull: function __pull (event) {
      if (this.disable) {
        return
      }

      if (event.isFinal) {
        this.scrolling = false;
        this.pulling = false;
        if (this.scrolling) {
          return
        }
        if (this.state === 'pulled') {
          this.state = 'refreshing';
          this.__animateTo(0);
          this.trigger();
        }
        else if (this.state === 'pull') {
          this.__animateTo(-this.height);
        }
        return
      }
      if (this.animating || this.scrolling || this.state === 'refreshing') {
        return true
      }

      var top = getScrollPosition(this.scrollContainer);
      if (top !== 0 || (top === 0 && event.direction !== 'down')) {
        this.scrolling = true;
        if (this.pulling) {
          this.pulling = false;
          this.state = 'pull';
          this.__animateTo(-this.height);
        }
        return true
      }

      event.evt.preventDefault();
      this.pulling = true;
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85));
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull';
    },
    __animateTo: function __animateTo (target, done, previousCall) {
      var this$1 = this;

      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating);
      }

      this.pullPosition -= (this.pullPosition - target) / 7;

      if (this.pullPosition - target > 1) {
        this.animating = window.requestAnimationFrame(function () {
          this$1.__animateTo(target, done, true);
        });
      }
      else {
        this.animating = window.requestAnimationFrame(function () {
          this$1.pullPosition = target;
          this$1.animating = false;
          done && done();
        });
      }
    },
    trigger: function trigger () {
      var this$1 = this;

      this.handler(function () {
        this$1.__animateTo(-this$1.height, function () {
          this$1.state = 'pull';
        });
      });
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.scrollContainer = this$1.inline ? this$1.$el.parentNode : getScrollTarget(this$1.$el);
    });
  },
  render: function render (h) {
    return h('div', { staticClass: 'pull-to-refresh' }, [
      h('div', {
        staticClass: 'pull-to-refresh-container',
        style: this.style,
        directives: [{
          name: 'touch-pan',
          modifiers: {
            vertical: true,
            scroll: true
          },
          value: this.__pull
        }]
      }, [
        h('div', { staticClass: 'pull-to-refresh-message row flex-center' }, [
          h(QIcon, {
            'class': { 'rotate-180': this.state === 'pulled' },
            props: { name: 'arrow_downward' },
            directives: [{
              name: 'show',
              value: this.state !== 'refreshing'
            }]
          }),
          h(QIcon, {
            staticClass: 'animate-spin',
            props: { name: this.refreshIcon },
            directives: [{
              name: 'show',
              value: this.state === 'refreshing'
            }]
          }),
          (" " + (this.message))
        ]),
        this.$slots.default
      ])
    ])
  }
};

function getPercentage (event, dragging) {
  return between((position(event).left - dragging.left) / dragging.width, 0, 1)
}

function notDivides (res, decimals) {
  var number = decimals
    ? parseFloat(res.toFixed(decimals))
    : res;

  return number !== parseInt(number, 10)
}

function getModel (percentage, min, max, step, decimals) {
  var
    model = min + percentage * (max - min),
    modulo = (model - min) % step;

  model += (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) - modulo;

  if (decimals) {
    model = parseFloat(model.toFixed(decimals));
  }

  return between(model, min, max)
}

var mixin$1 = {
  components: {
    QChip: QChip
  },
  props: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    step: {
      type: Number,
      default: 1
    },
    decimals: {
      type: Number,
      default: 0
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    square: Boolean,
    color: String,
    fillHandleAlways: Boolean,
    error: Boolean,
    disable: Boolean
  },
  computed: {
    data: function data () {
      return {
        clickDisabled: false
      }
    },
    classes: function classes () {
      var cls = {
        disabled: this.disable,
        'label-always': this.labelAlways,
        'has-error': this.error
      };

      if (!this.error && this.color) {
        cls[("text-" + (this.color))] = true;
      }

      return cls
    },
    labelColor: function labelColor () {
      return this.error
        ? 'negative'
        : this.color || 'primary'
    }
  },
  methods: {
    __pan: function __pan (event) {
      var this$1 = this;

      if (this.disable) {
        return
      }
      if (event.isFinal) {
        this.clickDisabled = true;
        this.$nextTick(function () {
          this$1.clickDisabled = false;
        });
        this.__end(event.evt);
      }
      else if (event.isFirst) {
        this.__setActive(event.evt);
      }
      else if (this.dragging) {
        this.__update(event.evt);
      }
    },
    __click: function __click (event) {
      if (this.disable || this.clickDisabled) {
        return
      }
      this.__setActive(event);
      this.__end(event);
    }
  },
  created: function created () {
    this.__validateProps();
  }
};

var dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
};

var QRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-slider non-selectable",class:_vm.classes,on:{"click":_vm.__click}},[_c('div',{ref:"handle",staticClass:"q-slider-handle-container"},[_c('div',{staticClass:"q-slider-track"}),_vm._v(" "),(_vm.markers)?_vm._l((((_vm.max - _vm.min) / _vm.step + 1)),function(n){return _c('div',{key:n,staticClass:"q-slider-mark",style:({left: (n - 1) * 100 * _vm.step / (_vm.max - _vm.min) + '%'})})}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-slider-track active-track",class:{dragging: _vm.dragging, 'track-draggable': _vm.dragRange || _vm.dragOnlyRange},style:({left: ((_vm.percentageMin * 100) + "%"), width: _vm.activeTrackWidth})}),_vm._v(" "),_c('div',{ref:"handleMin",staticClass:"q-slider-handle q-slider-handle-min",class:{dragging: _vm.dragging, 'handle-at-minimum': !_vm.fillHandleAlways && _vm.model.min === _vm.min},style:({left: ((_vm.percentageMin * 100) + "%"), borderRadius: _vm.square ? '0' : '50%'})},[(_vm.label || _vm.labelAlways)?_c('q-chip',{staticClass:"q-slider-label no-pointer-events",class:{'label-always': _vm.labelAlways},attrs:{"pointing":"down","square":"","color":_vm.leftTooltipColor}},[_vm._v(" "+_vm._s(_vm.leftDisplayValue)+" ")]):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"q-slider-ring"}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"q-slider-handle q-slider-handle-max",class:{dragging: _vm.dragging, 'handle-at-maximum': _vm.model.max === _vm.max},style:({left: ((_vm.percentageMax * 100) + "%"), borderRadius: _vm.square ? '0' : '50%'})},[(_vm.label || _vm.labelAlways)?_c('q-chip',{staticClass:"q-slider-label no-pointer-events",class:{'label-always': _vm.labelAlways},attrs:{"pointing":"down","square":"","color":_vm.rightTooltipColor}},[_vm._v(" "+_vm._s(_vm.rightDisplayValue)+" ")]):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"q-slider-ring"}):_vm._e()],1)],2)])},staticRenderFns: [],
  name: 'q-range',
  directives: {
    TouchPan: TouchPan
  },
  mixins: [mixin$1],
  props: {
    value: {
      type: Object,
      required: true,
      validator: function validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
      }
    },
    dragRange: Boolean,
    dragOnlyRange: Boolean,
    leftLabelColor: String,
    leftLabelValue: String,
    rightLabelColor: String,
    rightLabelValue: String
  },
  data: function data () {
    return {
      model: clone(this.value),
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentageMin: function percentageMin () {
      return this.snap ? (this.model.min - this.min) / (this.max - this.min) : this.currentMinPercentage
    },
    percentageMax: function percentageMax () {
      return this.snap ? (this.model.max - this.min) / (this.max - this.min) : this.currentMaxPercentage
    },
    activeTrackWidth: function activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    },
    leftDisplayValue: function leftDisplayValue () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : this.model.min
    },
    rightDisplayValue: function rightDisplayValue () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : this.model.max
    },
    leftTooltipColor: function leftTooltipColor () {
      return this.leftLabelColor || this.labelColor
    },
    rightTooltipColor: function rightTooltipColor () {
      return this.rightLabelColor || this.labelColor
    }
  },
  watch: {
    'value.min': function value_min (value) {
      this.model.min = value;
    },
    'value.max': function value_max (value) {
      this.model.max = value;
    },
    'model.min': function model_min (value) {
      if (this.dragging) {
        return
      }
      if (value > this.model.max) {
        value = this.model.max;
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min);
    },
    'model.max': function model_max (value) {
      if (this.dragging) {
        return
      }
      if (value < this.model.min) {
        value = this.model.min;
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min);
    },
    min: function min (value) {
      if (this.model.min < value) {
        this.__update({min: value});
      }
      if (this.model.max < value) {
        this.__update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    max: function max (value) {
      if (this.model.min > value) {
        this.__update({min: value});
      }
      if (this.model.max > value) {
        this.__update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    step: function step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive: function __setActive (event) {
      var
        container = this.$refs.handle,
        width = container.offsetWidth,
        sensitivity = (this.dragOnlyRange ? -1 : 1) * this.$refs.handleMin.offsetWidth / (2 * width);

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: width,
        valueMin: this.model.min,
        valueMax: this.model.max,
        percentageMin: this.currentMinPercentage,
        percentageMax: this.currentMaxPercentage
      };

      var
        percentage = getPercentage(event, this.dragging),
        type;

      if (percentage < this.currentMinPercentage + sensitivity) {
        type = dragType.MIN;
      }
      else if (percentage < this.currentMaxPercentage - sensitivity) {
        if (this.dragRange || this.dragOnlyRange) {
          type = dragType.RANGE;
          extend(this.dragging, {
            offsetPercentage: percentage,
            offsetModel: getModel(percentage, this.min, this.max, this.step, this.decimals),
            rangeValue: this.dragging.valueMax - this.dragging.valueMin,
            rangePercentage: this.currentMaxPercentage - this.currentMinPercentage
          });
        }
        else {
          type = this.currentMaxPercentage - percentage < percentage - this.currentMinPercentage
            ? dragType.MAX
            : dragType.MIN;
        }
      }
      else {
        type = dragType.MAX;
      }

      if (this.dragOnlyRange && type !== dragType.RANGE) {
        this.dragging = false;
        return
      }

      this.dragging.type = type;
      this.__update(event);
    },
    __update: function __update (event) {
      var
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals),
        pos;

      switch (this.dragging.type) {
        case dragType.MIN:
          if (percentage <= this.dragging.percentageMax) {
            pos = {
              minP: percentage,
              maxP: this.dragging.percentageMax,
              min: model,
              max: this.dragging.valueMax
            };
          }
          else {
            pos = {
              minP: this.dragging.percentageMax,
              maxP: percentage,
              min: this.dragging.valueMax,
              max: model
            };
          }
          break

        case dragType.MAX:
          if (percentage >= this.dragging.percentageMin) {
            pos = {
              minP: this.dragging.percentageMin,
              maxP: percentage,
              min: this.dragging.valueMin,
              max: model
            };
          }
          else {
            pos = {
              minP: percentage,
              maxP: this.dragging.percentageMin,
              min: model,
              max: this.dragging.valueMin
            };
          }
          break

        case dragType.RANGE:
          var
            percentageDelta = percentage - this.dragging.offsetPercentage,
            minP = between(this.dragging.percentageMin + percentageDelta, 0, 1 - this.dragging.rangePercentage),
            modelDelta = model - this.dragging.offsetModel,
            min = between(this.dragging.valueMin + modelDelta, this.min, this.max - this.dragging.rangeValue);

          pos = {
            minP: minP,
            maxP: minP + this.dragging.rangePercentage,
            min: min,
            max: min + this.dragging.rangeValue
          };
          break
      }

      this.currentMinPercentage = pos.minP;
      this.currentMaxPercentage = pos.maxP;
      this.__updateInput(pos);
    },
    __end: function __end () {
      this.dragging = false;
      this.currentMinPercentage = (this.model.min - this.min) / (this.max - this.min);
      this.currentMaxPercentage = (this.model.max - this.min) / (this.max - this.min);
      if (this.model.min !== this.value.min || this.model.max !== this.value.max) {
        this.$emit('change', this.model);
      }
    },
    __updateInput: function __updateInput (ref) {
      var min = ref.min; if ( min === void 0 ) min = this.model.min;
      var max = ref.max; if ( max === void 0 ) max = this.model.max;

      var val = {min: min, max: max};
      if (this.model.min !== min || this.model.max !== max) {
        this.model = val;
        this.$emit('input', val);
      }
    },
    __validateProps: function __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step);
      }
      else if (notDivides((this.model.min - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.model.min, this.min, this.step);
      }
      else if (notDivides((this.model.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.model.max, this.max, this.step);
      }
    }
  }
};

var QRating = {render: function(){
var obj;
var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-rating row inline items-center no-wrap",class:( obj = { disabled: _vm.disable, editable: _vm.editable }, obj[("text-" + (_vm.color))] = _vm.color, obj),style:(_vm.size ? ("font-size: " + (_vm.size)) : '')},_vm._l((_vm.max),function(index){return _c('q-icon',{key:index,class:{ active: (!_vm.mouseModel && _vm.model >= index) || (_vm.mouseModel && _vm.mouseModel >= index), exselected: _vm.mouseModel && _vm.model >= index && _vm.mouseModel < index, hovered: _vm.mouseModel === index },attrs:{"name":_vm.icon},on:{"click":function($event){_vm.set(index);},"mouseover":function($event){_vm.__setHoverValue(index);},"mouseout":function($event){_vm.mouseModel = 0;}}})}))},staticRenderFns: [],
  name: 'q-rating',
  components: {
    QIcon: QIcon
  },
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    max: {
      type: Number,
      default: 5
    },
    icon: {
      type: String,
      default: 'grade'
    },
    color: String,
    size: String,
    readonly: Boolean,
    disable: Boolean
  },
  data: function data () {
    return {
      mouseModel: 0
    }
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (val) {
        if (this.value !== val) {
          this.$emit('input', val);
          this.$emit('change', val);
        }
      }
    },
    editable: function editable () {
      return !this.readonly && !this.disable
    }
  },
  methods: {
    set: function set (value) {
      if (this.editable) {
        this.model = between(parseInt(value, 10), 1, this.max);
        this.mouseModel = 0;
      }
    },
    __setHoverValue: function __setHoverValue (value) {
      if (this.editable) {
        this.mouseModel = value;
      }
    }
  }
};

var QScrollArea = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$q.platform.is.desktop)?_c('div',{staticClass:"q-scrollarea relative-position",on:{"mouseenter":function($event){_vm.hover = true;},"mouseleave":function($event){_vm.hover = false;}}},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical.nomouse",value:(_vm.__panContainer),expression:"__panContainer",modifiers:{"vertical":true,"nomouse":true}}],ref:"target",staticClass:"scroll relative-position overflow-hidden full-height full-width",on:{"wheel":_vm.__mouseWheel,"mousewheel":_vm.__mouseWheel,"DOMMouseScroll":_vm.__mouseWheel}},[_c('div',{staticClass:"absolute full-width",style:(_vm.mainStyle)},[_vm._t("default"),_vm._v(" "),_c('q-resize-observable',{staticClass:"resize-obs",on:{"resize":_vm.__updateScrollHeight}})],2),_vm._v(" "),_c('q-scroll-observable',{staticClass:"scroll-obs",on:{"scroll":_vm.__updateScroll}})],1),_vm._v(" "),_c('q-resize-observable',{staticClass:"main-resize-obs",on:{"resize":_vm.__updateContainer}}),_vm._v(" "),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__panThumb),expression:"__panThumb",modifiers:{"vertical":true}}],staticClass:"q-scrollarea-thumb absolute-right",class:{'invisible-thumb': _vm.thumbHidden},style:(_vm.style)})],1):_c('div',{staticClass:"q-scroll-area scroll relative-position",style:(_vm.contentStyle)},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-scroll-area',
  components: {
    QResizeObservable: QResizeObservable,
    QScrollObservable: QScrollObservable
  },
  directives: {
    TouchPan: TouchPan
  },
  props: {
    thumbStyle: {
      type: Object,
      default: function () { return ({}); }
    },
    contentStyle: {
      type: Object,
      default: function () { return ({}); }
    },
    contentActiveStyle: {
      type: Object,
      default: function () { return ({}); }
    },
    delay: {
      type: Number,
      default: 1000
    }
  },
  data: function data () {
    return {
      active: false,
      hover: false,
      containerHeight: 0,
      scrollPosition: 0,
      scrollHeight: 0
    }
  },
  computed: {
    thumbHidden: function thumbHidden () {
      return this.scrollHeight <= this.containerHeight || (!this.active && !this.hover)
    },
    thumbHeight: function thumbHeight () {
      return Math.round(between(this.containerHeight * this.containerHeight / this.scrollHeight, 50, this.containerHeight))
    },
    style: function style () {
      var top = this.scrollPercentage * (this.containerHeight - this.thumbHeight);
      return extend({}, this.thumbStyle, {
        top: (top + "px"),
        height: ((this.thumbHeight) + "px")
      })
    },
    mainStyle: function mainStyle () {
      return this.thumbHidden ? this.contentStyle : this.contentActiveStyle
    },
    scrollPercentage: function scrollPercentage () {
      var p = between(this.scrollPosition / (this.scrollHeight - this.containerHeight), 0, 1);
      return Math.round(p * 10000) / 10000
    }
  },
  methods: {
    setScrollPosition: function setScrollPosition$1 (offset, duration) {
      setScrollPosition(this.$refs.target, offset, duration);
    },
    __updateContainer: function __updateContainer (size) {
      if (this.containerHeight !== size.height) {
        this.containerHeight = size.height;
        this.__setActive(true, true);
      }
    },
    __updateScroll: function __updateScroll (scroll) {
      if (this.scrollPosition !== scroll.position) {
        this.scrollPosition = scroll.position;
        this.__setActive(true, true);
      }
    },
    __updateScrollHeight: function __updateScrollHeight (ref) {
      var height = ref.height;

      if (this.scrollHeight !== height) {
        this.scrollHeight = height;
        this.__setActive(true, true);
      }
    },
    __panThumb: function __panThumb (e) {
      e.evt.preventDefault();

      if (e.isFirst) {
        this.refPos = this.scrollPosition;
        this.__setActive(true, true);
        document.body.classList.add('non-selectable');
        if (document.selection) {
          document.selection.empty();
        }
        else if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
      }
      if (e.isFinal) {
        this.__setActive(false);
        document.body.classList.remove('non-selectable');
      }

      var multiplier = (this.scrollHeight - this.containerHeight) / (this.containerHeight - this.thumbHeight);
      this.$refs.target.scrollTop = this.refPos + (e.direction === 'down' ? 1 : -1) * e.distance.y * multiplier;
    },
    __panContainer: function __panContainer (e) {
      if (e.isFirst) {
        this.refPos = this.scrollPosition;
        this.__setActive(true, true);
      }
      if (e.isFinal) {
        this.__setActive(false);
      }

      var pos = this.refPos + (e.direction === 'down' ? -1 : 1) * e.distance.y;
      this.$refs.target.scrollTop = pos;

      if (pos > 0 && pos + this.containerHeight < this.scrollHeight) {
        e.evt.preventDefault();
      }
    },
    __mouseWheel: function __mouseWheel (e) {
      var el = this.$refs.target;
      el.scrollTop += getMouseWheelDistance(e).pixelY;
      if (el.scrollTop > 0 && el.scrollTop + this.containerHeight < this.scrollHeight) {
        e.preventDefault();
      }
    },
    __setActive: function __setActive (active, timer) {
      clearTimeout(this.timer);
      if (active === this.active) {
        if (active && this.timer) {
          this.__startTimer();
        }
        return
      }

      if (active) {
        this.active = true;
        if (timer) {
          this.__startTimer();
        }
      }
      else {
        this.active = false;
      }
    },
    __startTimer: function __startTimer () {
      var this$1 = this;

      this.timer = setTimeout(function () {
        this$1.active = false;
        this$1.timer = null;
      }, this.delay);
    }
  }
};

var QSearch = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input',{ref:"input",staticClass:"q-search",attrs:{"type":_vm.type,"autofocus":_vm.autofocus,"placeholder":_vm.placeholder || _vm.$q.i18n.label.search,"disable":_vm.disable,"error":_vm.error,"align":_vm.align,"float-label":_vm.floatLabel,"stack-label":_vm.stackLabel,"prefix":_vm.prefix,"suffix":_vm.suffix,"inverted":_vm.inverted,"dark":_vm.dark,"max-length":_vm.maxLength,"color":_vm.color,"before":_vm.controlBefore,"after":_vm.controlAfter},on:{"focus":_vm.__onFocus,"blur":_vm.__onBlur,"keyup":_vm.__onKeyup,"keydown":_vm.__onKeydown,"click":_vm.__onClick},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-search',
  mixins: [FrameMixin, InputMixin],
  components: {
    QIcon: QIcon,
    QInput: QInput
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    value: { required: true },
    type: String,
    debounce: {
      type: Number,
      default: 300
    },
    icon: {
      type: String,
      default: 'search'
    },
    placeholder: String
  },
  data: function data () {
    return {
      model: this.value,
      childDebounce: false
    }
  },
  provide: function provide () {
    var this$1 = this;

    return {
      __inputDebounce: {
        set: function (val) {
          if (this$1.model !== val) {
            this$1.model = val;
          }
        },
        setChildDebounce: function (v) {
          this$1.childDebounce = v;
        }
      }
    }
  },
  watch: {
    value: function value (v) {
      this.model = v;
    },
    model: function model (val) {
      var this$1 = this;

      clearTimeout(this.timer);
      if (this.value === val) {
        return
      }
      if (!val && val !== 0) {
        this.model = this.type === 'number' ? null : '';
      }
      this.timer = setTimeout(function () {
        this$1.$emit('input', this$1.model);
      }, this.debounceValue);
    }
  },
  computed: {
    debounceValue: function debounceValue () {
      return this.childDebounce
        ? 0
        : this.debounce
    },
    controlBefore: function controlBefore () {
      return this.before || [{icon: this.icon, handler: this.focus}]
    },
    controlAfter: function controlAfter () {
      return this.after || [{
        icon: this.inverted ? 'clear' : 'cancel',
        content: true,
        handler: this.clear
      }]
    }
  },
  methods: {
    clear: function clear () {
      this.$refs.input.clear();
    }
  }
};

var SelectMixin = {
  components: {
    QIcon: QIcon,
    QInputFrame: QInputFrame,
    QChip: QChip
  },
  mixins: [FrameMixin],
  props: {
    value: {
      required: true
    },
    multiple: Boolean,
    toggle: Boolean,
    chips: Boolean,
    options: {
      type: Array,
      required: true,
      validator: function (v) { return v.every(function (o) { return 'label' in o && 'value' in o; }); }
    },
    frameColor: String,
    displayValue: String,
    clearable: Boolean
  },
  data: function data () {
    return {
      model: clone(this.value),
      terms: '',
      focused: false
    }
  },
  watch: {
    value: function value (val) {
      this.model = clone(val);
    }
  },
  computed: {
    actualValue: function actualValue () {
      var this$1 = this;

      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        var opt$1 = this.options.find(function (opt) { return opt.value === this$1.model; });
        return opt$1 ? opt$1.label : ''
      }

      var opt = this.selectedOptions.map(function (opt) { return opt.label; });
      return opt.length ? opt.join(', ') : ''
    },
    selectedOptions: function selectedOptions () {
      var this$1 = this;

      if (this.multiple) {
        return this.length > 0
          ? this.options.filter(function (opt) { return this$1.model.includes(opt.value); })
          : []
      }
    },
    hasChips: function hasChips () {
      return this.multiple && this.chips
    },
    length: function length () {
      return this.multiple
        ? this.model.length
        : ([null, undefined, ''].includes(this.model) ? 0 : 1)
    },
    additionalLength: function additionalLength () {
      return this.displayValue && this.displayValue.length > 0
    }
  },
  methods: {
    __toggleMultiple: function __toggleMultiple (value, disable) {
      if (disable) {
        return
      }
      var
        model = this.model,
        index = model.indexOf(value);

      if (index > -1) {
        model.splice(index, 1);
      }
      else {
        model.push(value);
      }

      this.$emit('input', model);
    },
    __emit: function __emit (val) {
      if (this.value !== val) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    },
    clear: function clear () {
      this.__emit(this.multiple ? [] : null);
    }
  }
};

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().indexOf(terms) > -1
}

var QSelect = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{ref:"input",staticClass:"q-select",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.frameColor || _vm.color,"focused":_vm.focused,"focusable":"","length":_vm.length,"additional-length":_vm.additionalLength},nativeOn:{"click":function($event){_vm.show($event);},"focus":function($event){_vm.__onFocus($event);},"blur":function($event){_vm.__onBlur($event);}}},[(_vm.hasChips)?_c('div',{staticClass:"col row items-center group q-input-chips",class:_vm.alignClass},_vm._l((_vm.selectedOptions),function(ref){
var label = ref.label;
var value = ref.value;
var optDisable = ref.disable;
return _c('q-chip',{key:label,attrs:{"small":"","closable":!_vm.disable && !optDisable,"color":_vm.color},on:{"hide":function($event){_vm.__toggleMultiple(value, _vm.disable || optDisable);}},nativeOn:{"click":function($event){$event.stopPropagation();}}},[_vm._v(" "+_vm._s(label)+" ")])})):_c('div',{staticClass:"col row items-center q-input-target",class:_vm.alignClass,domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._v(" "),(!_vm.disable && _vm.clearable && _vm.length)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"cancel"},on:{"click":function($event){$event.stopPropagation();_vm.clear($event);}},slot:"after"}):_vm._e(),_vm._v(" "),_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"arrow_drop_down"},slot:"after"}),_vm._v(" "),_c('q-popover',{ref:"popover",staticClass:"column no-wrap",attrs:{"fit":"","disable":_vm.disable,"offset":[0, 10],"anchor-click":false},on:{"show":_vm.__onFocus,"hide":_vm.__onClose}},[_c('q-field-reset',[(_vm.filter)?_c('q-search',{ref:"filter",staticClass:"no-margin",staticStyle:{"min-height":"50px","padding":"10px"},attrs:{"placeholder":_vm.filterPlaceholder || _vm.$q.i18n.label.filter,"debounce":100,"color":_vm.color,"icon":"filter_list"},on:{"input":_vm.reposition},model:{value:(_vm.terms),callback:function ($$v) {_vm.terms=$$v;},expression:"terms"}}):_vm._e()],1),_vm._v(" "),_c('q-list',{staticClass:"no-border scroll",attrs:{"separator":_vm.separator}},[(_vm.multiple)?_vm._l((_vm.visibleOptions),function(opt){return _c('q-item-wrapper',{key:JSON.stringify(opt),class:{'text-faded': opt.disable},attrs:{"cfg":opt,"link":!opt.disable,"slot-replace":""},on:{"!click":function($event){_vm.__toggleMultiple(opt.value, opt.disable);}}},[(_vm.toggle)?_c('q-toggle',{attrs:{"slot":"right","color":_vm.color,"value":_vm.optModel[opt.index],"disable":opt.disable},slot:"right"}):_c('q-checkbox',{attrs:{"slot":"left","color":_vm.color,"value":_vm.optModel[opt.index],"disable":opt.disable},slot:"left"})],1)}):_vm._l((_vm.visibleOptions),function(opt){return _c('q-item-wrapper',{key:JSON.stringify(opt),class:{'text-faded': opt.disable},attrs:{"cfg":opt,"link":!opt.disable,"slot-replace":"","active":_vm.value === opt.value},on:{"!click":function($event){_vm.__singleSelect(opt.value, opt.disable);}}},[(_vm.radio)?_c('q-radio',{attrs:{"slot":"left","color":_vm.color,"value":_vm.value,"val":opt.value,"disable":opt.disable},slot:"left"}):_vm._e()],1)})],2)],1)],1)},staticRenderFns: [],
  name: 'q-select',
  mixins: [SelectMixin],
  components: {
    QFieldReset: QFieldReset,
    QSearch: QSearch,
    QPopover: QPopover,
    QList: QList,
    QItemWrapper: QItemWrapper,
    QCheckbox: QCheckbox,
    QRadio: QRadio,
    QToggle: QToggle
  },
  props: {
    filter: [Function, Boolean],
    filterPlaceholder: String,
    autofocusFilter: Boolean,
    radio: Boolean,
    placeholder: String,
    separator: Boolean
  },
  computed: {
    optModel: function optModel () {
      var this$1 = this;

      if (this.multiple) {
        return this.model.length > 0
          ? this.options.map(function (opt) { return this$1.model.includes(opt.value); })
          : this.options.map(function (opt) { return false; })
      }
    },
    visibleOptions: function visibleOptions () {
      var this$1 = this;

      var opts = clone(this.options).map(function (opt, index) {
        opt.index = index;
        opt.value = this$1.options[index].value;
        return opt
      });
      if (this.filter && this.terms.length) {
        var lowerTerms = this.terms.toLowerCase();
        opts = opts.filter(function (opt) { return this$1.filterFn(lowerTerms, opt); });
      }
      return opts
    },
    filterFn: function filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    },
    activeItemSelector: function activeItemSelector () {
      return this.multiple
        ? (".q-item-side > " + (this.toggle ? '.q-toggle' : '.q-checkbox') + " > .active")
        : ".q-item.active"
    }
  },
  methods: {
    show: function show () {
      if (this.disable) {
        return Promise.reject(new Error())
      }
      return this.$refs.popover.show()
    },
    hide: function hide () {
      return this.$refs.popover.hide()
    },
    reposition: function reposition () {
      var popover = this.$refs.popover;
      if (popover.showing) {
        popover.reposition();
      }
    },

    __onFocus: function __onFocus () {
      this.focused = true;
      if (this.filter && this.autofocusFilter) {
        this.$refs.filter.focus();
      }
      this.$emit('focus');
      var selected = this.$refs.popover.$el.querySelector(this.activeItemSelector);
      if (selected) {
        selected.scrollIntoView();
      }
    },
    __onBlur: function __onBlur (e) {
      var this$1 = this;

      this.__onClose();
      setTimeout(function () {
        var el = document.activeElement;
        if (el !== document.body && !this$1.$refs.popover.$el.contains(el)) {
          this$1.hide();
        }
      }, 1);
    },
    __onClose: function __onClose () {
      this.focused = false;
      this.$emit('blur');
      this.terms = '';
      if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
        this.$emit('change', this.model);
      }
    },
    __singleSelect: function __singleSelect (val, disable) {
      if (disable) {
        return
      }
      this.__emit(val);
      this.hide();
    }
  }
};

var QDialogSelect = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{ref:"input",staticClass:"q-select",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.frameColor || _vm.color,"focused":_vm.focused,"focusable":"","length":_vm.length,"additional-length":_vm.additionalLength},nativeOn:{"click":function($event){_vm.pick($event);},"focus":function($event){_vm.__onFocus($event);},"blur":function($event){_vm.__onBlur($event);}}},[(_vm.hasChips)?_c('div',{staticClass:"col row items-center group q-input-chips",class:_vm.alignClass},_vm._l((_vm.selectedOptions),function(ref){
var label = ref.label;
var value = ref.value;
var optDisable = ref.disable;
return _c('q-chip',{key:label,attrs:{"small":"","closable":!_vm.disable && !optDisable,"color":_vm.color},on:{"hide":function($event){_vm.__toggleMultiple(value, _vm.disable || optDisable);}},nativeOn:{"click":function($event){$event.stopPropagation();}}},[_vm._v(" "+_vm._s(label)+" ")])})):_c('div',{staticClass:"col row items-center q-input-target",class:_vm.alignClass,domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._v(" "),(!_vm.disable && _vm.clearable && _vm.length)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"cancel"},on:{"click":function($event){$event.stopPropagation();_vm.clear($event);}},slot:"after"}):_vm._e(),_vm._v(" "),_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"arrow_drop_down"},slot:"after"})],1)},staticRenderFns: [],
  name: 'q-dialog-select',
  mixins: [SelectMixin],
  props: {
    okLabel: String,
    cancelLabel: String,
    title: {
      type: String,
      default: 'Select'
    },
    message: String
  },
  data: function data () {
    return {
      focused: false
    }
  },
  computed: {
    type: function type () {
      return this.multiple
        ? (this.toggle ? 'toggle' : 'checkbox')
        : 'radio'
    }
  },
  methods: {
    pick: function pick () {
      var this$1 = this;

      if (this.disable) {
        return
      }

      // TODO
      this.dialog = this.$q.dialog({
        title: this.title || this.$q.i18n.label.select,
        message: this.message,
        color: this.color,
        options: {
          type: this.type,
          model: clone(this.value),
          items: this.options
        },
        cancel: this.cancelLabel || true,
        ok: this.okLabel || true
      }).catch(function () {
        this$1.dialog = null;
      }).then(function (data) {
        this$1.dialog = null;
        if (JSON.stringify(this$1.value) !== JSON.stringify(data)) {
          this$1.$emit('input', data);
          this$1.$emit('change', data);
        }
      });
    },
    hide: function hide () {
      return this.dialog
        ? this.dialog.hide()
        : Promise.resolve()
    },

    __onFocus: function __onFocus () {
      this.focused = true;
      this.$emit('focus');
    },
    __onBlur: function __onBlur (e) {
      this.focused = false;
      this.$emit('blur');
    }
  }
};

var QSlider = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-slider non-selectable",class:_vm.classes,on:{"click":_vm.__click}},[_c('div',{ref:"handle",staticClass:"q-slider-handle-container"},[_c('div',{staticClass:"q-slider-track"}),_vm._v(" "),(_vm.markers)?_vm._l((((_vm.max - _vm.min) / _vm.step + 1)),function(n){return _c('div',{key:n,staticClass:"q-slider-mark",style:({left: (n - 1) * 100 * _vm.step / (_vm.max - _vm.min) + '%'})})}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-slider-track active-track",class:{'no-transition': _vm.dragging, 'handle-at-minimum': _vm.model === _vm.min},style:({width: _vm.percentage})}),_vm._v(" "),_c('div',{staticClass:"q-slider-handle",class:{dragging: _vm.dragging, 'handle-at-minimum': !_vm.fillHandleAlways && _vm.model === _vm.min},style:({left: _vm.percentage, borderRadius: _vm.square ? '0' : '50%'})},[(_vm.label || _vm.labelAlways)?_c('q-chip',{staticClass:"q-slider-label no-pointer-events",class:{'label-always': _vm.labelAlways},attrs:{"pointing":"down","square":"","color":_vm.labelColor}},[_vm._v(" "+_vm._s(_vm.displayValue)+" ")]):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"q-slider-ring"}):_vm._e()],1)],2)])},staticRenderFns: [],
  name: 'q-slider',
  directives: {
    TouchPan: TouchPan
  },
  mixins: [mixin$1],
  props: {
    value: {
      type: Number,
      required: true
    },
    labelValue: String
  },
  data: function data () {
    return {
      model: this.value,
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage: function percentage () {
      if (this.snap) {
        return (this.model - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    },
    displayValue: function displayValue () {
      return this.labelValue !== void 0
        ? this.labelValue
        : this.model
    }
  },
  watch: {
    value: function value (value$1) {
      if (this.dragging) {
        return
      }
      if (value$1 < this.min) {
        this.model = this.min;
      }
      else if (value$1 > this.max) {
        this.model = this.max;
      }
      else {
        this.model = value$1;
      }
      this.currentPercentage = (this.model - this.min) / (this.max - this.min);
    },
    min: function min (value) {
      if (this.model < value) {
        this.model = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    max: function max (value) {
      if (this.model > value) {
        this.model = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    step: function step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive: function __setActive (event) {
      var container = this.$refs.handle;

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      };
      this.__update(event);
    },
    __update: function __update (event) {
      var
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals);

      this.currentPercentage = percentage;
      if (model !== this.model) {
        this.$emit('input', model);
        this.model = model;
      }
    },
    __end: function __end () {
      this.dragging = false;
      this.currentPercentage = (this.model - this.min) / (this.max - this.min);
      if (this.value !== this.model) {
        this.$emit('change', this.model);
      }
    },
    __validateProps: function __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step, this.decimals);
      }
    }
  }
};

var StepTab = {
  name: 'q-step-header',
  components: {
    QIcon: QIcon
  },
  directives: {
    Ripple: Ripple
  },
  props: ['vm'],
  computed: {
    classes: function classes () {
      return {
        'step-error': this.vm.error,
        'step-active': this.vm.active,
        'step-done': this.vm.done,
        'step-waiting': this.vm.waiting,
        'step-disabled': this.vm.disable,
        'step-colored': this.vm.active || this.vm.done,
        'items-center': !this.vm.__stepper.vertical,
        'items-start': this.vm.__stepper.vertical,
        'q-stepper-first': this.vm.first,
        'q-stepper-last': this.vm.last
      }
    }
  },
  methods: {
    __select: function __select () {
      this.vm.select();
    }
  },
  render: function render (h) {
    var icon = this.vm.stepIcon
      ? h(QIcon, { props: { name: this.vm.stepIcon } })
      : h('span', [ (this.vm.innerOrder + 1) ]);

    return h('div', {
      staticClass: 'q-stepper-tab col-grow flex no-wrap relative-position',
      'class': this.classes,
      on: {
        click: this.__select
      },
      directives: [{
        name: 'ripple',
        modifiers: {
          mat: true
        },
        value: this.vm.done
      }]
    }, [
      h('div', { staticClass: 'q-stepper-dot row flex-center q-stepper-line relative-position' }, [
        h('span', { staticClass: 'row flex-center' }, [ icon ])
      ]),
      this.vm.title
        ? h('div', {
          staticClass: 'q-stepper-label q-stepper-line relative-position'
        }, [
          h('div', { staticClass: 'q-stepper-title' }, [ this.vm.title ]),
          h('div', { staticClass: 'q-stepper-subtitle' }, [ this.vm.subtitle ])
        ])
        : null
    ])
  }
};

var QStep = {
  name: 'q-step',
  inject: {
    __stepper: {
      default: function default$1 () {
        console.error('QStep needs to be child of QStepper');
      }
    }
  },
  props: {
    name: {
      type: [Number, String],
      default: function default$2 () {
        return uid()
      }
    },
    default: Boolean,
    title: {
      type: String,
      required: true
    },
    subtitle: String,
    icon: String,
    order: [Number, String],
    error: Boolean,
    activeIcon: String,
    errorIcon: String,
    doneIcon: String,
    disable: Boolean
  },
  watch: {
    order: function order () {
      this.__stepper.__sortSteps();
    }
  },
  data: function data () {
    return {
      innerOrder: 0,
      first: false,
      last: false
    }
  },
  computed: {
    stepIcon: function stepIcon () {
      var data = this.__stepper;

      if (this.active) {
        return this.activeIcon || data.activeIcon
      }
      if (this.error) {
        return this.errorIcon || data.errorIcon
      }
      if (this.done && !this.disable) {
        return this.doneIcon || data.doneIcon
      }

      return this.icon
    },
    actualOrder: function actualOrder () {
      return parseInt(this.order || this.innerOrder, 10)
    },
    active: function active () {
      return this.__stepper.step === this.name
    },
    done: function done () {
      return !this.disable && this.__stepper.currentOrder > this.innerOrder
    },
    waiting: function waiting () {
      return !this.disable && this.__stepper.currentOrder < this.innerOrder
    },
    style: function style () {
      var ord = this.actualOrder;
      return {
        '-webkit-box-ordinal-group': ord,
        '-ms-flex-order': ord,
        order: ord
      }
    }
  },
  methods: {
    select: function select () {
      if (this.done) {
        this.__stepper.goToStep(this.name);
      }
    }
  },
  mounted: function mounted () {
    this.__stepper.__registerStep(this);
    if (this.default) {
      this.select();
    }
  },
  beforeDestroy: function beforeDestroy () {
    this.__stepper.__unregisterStep(this);
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-stepper-step',
      style: this.style
    }, [
      this.__stepper.vertical
        ? h(StepTab, { props: { vm: this } })
        : null,
      h(QSlideTransition, [
        this.active
          ? h('div', {
            staticClass: 'q-stepper-step-content'
          }, [
            h('div', { staticClass: 'q-stepper-step-inner' }, [
              this.$slots.default
            ])
          ])
          : null
      ])
    ])
  }
};

var QStepper = {
  name: 'q-stepper',
  components: {
    StepTab: StepTab
  },
  props: {
    value: [Number, String],
    color: String,
    vertical: Boolean,
    alternativeLabels: Boolean,
    contractable: Boolean,
    doneIcon: {
      type: [String, Boolean],
      default: 'check'
    },
    activeIcon: {
      type: [String, Boolean],
      default: 'edit'
    },
    errorIcon: {
      type: [String, Boolean],
      default: 'warning'
    }
  },
  data: function data () {
    return {
      step: this.value || null,
      steps: []
    }
  },
  provide: function provide () {
    return {
      __stepper: this
    }
  },
  watch: {
    value: function value (v) {
      this.goToStep(v);
    }
  },
  computed: {
    classes: function classes () {
      var cls = [
        ("q-stepper-" + (this.vertical ? 'vertical' : 'horizontal'))
      ];
      if (this.color) {
        cls.push(("text-" + (this.color)));
      }
      if (this.contractable) {
        cls.push("q-stepper-contractable");
      }
      return cls
    },
    hasSteps: function hasSteps () {
      return this.steps.length > 0
    },
    currentStep: function currentStep () {
      var this$1 = this;

      if (this.hasSteps) {
        return this.steps.find(function (step) { return step.name === this$1.step; })
      }
    },
    currentOrder: function currentOrder () {
      if (this.currentStep) {
        return this.currentStep.innerOrder
      }
    },
    length: function length () {
      return this.steps.length
    }
  },
  methods: {
    goToStep: function goToStep (step) {
      if (this.step === step || step === void 0) {
        return
      }

      this.step = step;

      if (this.value !== step) {
        this.$emit('input', step);
        this.$emit('step', step);
      }
    },
    next: function next () {
      this.__go(1);
    },
    previous: function previous () {
      this.__go(-1);
    },
    reset: function reset () {
      if (this.hasSteps) {
        this.goToStep(this.steps[0].name);
      }
    },

    __go: function __go (offset) {
      var
        name,
        index = this.currentOrder;

      if (index === void 0) {
        if (!this.hasSteps) {
          return
        }
        name = this.steps[0].name;
      }
      else {
        do {
          index += offset;
        } while (index >= 0 && index < this.length - 1 && this.steps[index].disable)
        if (index < 0 || index > this.length - 1 || this.steps[index].disable) {
          return
        }
        name = this.steps[index].name;
      }

      this.goToStep(name);
    },
    __sortSteps: function __sortSteps () {
      var this$1 = this;

      this.steps.sort(function (a, b) {
        return a.actualOrder - b.actualOrder
      });
      var last = this.steps.length - 1;
      this.steps.forEach(function (step, index) {
        step.innerOrder = index;
        step.first = index === 0;
        step.last = index === last;
      });
      this.$nextTick(function () {
        if (!this$1.steps.some(function (step) { return step.active; })) {
          this$1.goToStep(this$1.steps[0].name);
        }
      });
    },
    __registerStep: function __registerStep (vm) {
      this.steps.push(vm);
      this.__sortSteps();
      return this
    },
    __unregisterStep: function __unregisterStep (vm) {
      this.steps = this.steps.filter(function (step) { return step !== vm; });
    }
  },
  created: function created () {
    this.__sortSteps = frameDebounce(this.__sortSteps);
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-stepper column overflow-hidden relative-position',
      'class': this.classes
    }, [
      this.vertical
        ? null
        : h('div', {
          staticClass: 'q-stepper-header row items-stretch justify-between shadow-1',
          'class': { 'alternative-labels': this.alternativeLabels }
        },
        this.steps.map(function (step) { return h(StepTab, {
          key: step.name,
          props: {
            vm: step
          }
        }); })),
      this.$slots.default
    ])
  }
};

var QStepperNavigation = {
  name: 'q-stepper-navigation',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots();
    var child = [h('div', {staticClass: 'col'}), slots.default];

    data.staticClass = "q-stepper-nav order-last row no-wrap items-center" + (cls ? (" " + cls) : '');

    if (slots.left) {
      child.unshift(slots.left);
    }

    return h('div', data, child)
  }
};

var TabMixin = {
  directives: {
    Ripple: Ripple
  },
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: function default$1 () {
        return uid()
      }
    },
    alert: Boolean,
    count: [Number, String],
    color: String
  },
  inject: {
    data: {
      default: function default$2 () {
        console.error('QTab/QRouteTab components need to be child of QTabs');
      }
    },
    selectTab: {}
  },
  watch: {
    active: function active (val) {
      if (val) {
        this.$emit('select', this.name);
      }
    }
  },
  computed: {
    active: function active () {
      return this.data.tabName === this.name
    },
    classes: function classes () {
      var cls = {
        active: this.active,
        hidden: this.hidden,
        disabled: this.disable,
        'icon-and-label': this.icon && this.label,
        'hide-icon': this.hide === 'icon',
        'hide-label': this.hide === 'label'
      };

      var color = this.data.inverted
        ? this.color || this.data.color
        : this.color;

      if (color) {
        cls[("text-" + color)] = true;
      }

      return cls
    },
    barStyle: function barStyle () {
      if (!this.active || !this.data.highlight) {
        return 'display: none;'
      }
    }
  },
  methods: {
    __getTabContent: function __getTabContent (h) {
      var child = [];

      this.icon && child.push(h(QIcon, {
        staticClass: 'q-tab-icon',
        props: {
          name: this.icon
        }
      }));

      this.label && child.push(h('span', {
        staticClass: 'q-tab-label',
        domProps: {
          innerHTML: this.label
        }
      }));

      if (this.count) {
        child.push(h(QChip, {
          props: {
            floating: true
          }
        }, [ this.count ]));
      }
      else if (this.alert) {
        child.push(h('div', {
          staticClass: 'q-dot'
        }));
      }

      child.push(this.$slots.default);
      {
        child.push(h('div', {
          staticClass: 'q-tabs-bar',
          style: this.barStyle
        }));
      }

      return child
    }
  }
};

var QRouteTab = {
  name: 'q-route-tab',
  mixins: [TabMixin, RouterLinkMixin],
  watch: {
    $route: function $route () {
      this.checkIfSelected();
    }
  },
  methods: {
    select: function select () {
      this.$emit('click', this.name);
      if (!this.disable) {
        this.$el.dispatchEvent(evt);
        this.selectTab(this.name);
      }
    },
    checkIfSelected: function checkIfSelected () {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.$el.classList.contains('router-link-active') || this$1.$el.classList.contains('router-link-exact-active')) {
          this$1.selectTab(this$1.name);
        }
        else if (this$1.active) {
          this$1.selectTab(null);
        }
      });
    }
  },
  created: function created () {
    this.checkIfSelected();
  },
  render: function render (h) {
    return h('router-link', {
      props: {
        tag: 'div',
        to: this.to,
        replace: this.replace,
        append: this.append,
        event: routerLinkEventName
      },
      nativeOn: {
        click: this.select
      },
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      directives: [{
        name: 'ripple',
        modifiers: {
          mat: true
        }
      }]
    }, this.__getTabContent(h))
  }
};

var QTab = {
  name: 'q-tab',
  mixins: [TabMixin],
  props: {
    default: Boolean
  },
  methods: {
    select: function select () {
      this.$emit('click', this.name);
      if (!this.disable) {
        this.selectTab(this.name);
      }
    }
  },
  mounted: function mounted () {
    if (this.default && !this.disable) {
      this.select();
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      on: {
        click: this.select
      },
      directives: [{
        name: 'ripple',
        modifiers: {
          mat: true
        }
      }]
    }, this.__getTabContent(h))
  }
};

var QTabPane = {
  name: 'q-tab-pane',
  inject: {
    data: {
      default: function default$1 () {
        console.error('QTabPane needs to be child of QTabs');
      }
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    keepAlive: Boolean
  },
  data: function data () {
    return {
      shown: false
    }
  },
  computed: {
    active: function active () {
      return this.data.tabName === this.name
    }
  },
  render: function render (h) {
    var node = h('div', {staticClass: 'q-tab-pane', 'class': {hidden: !this.active}}, [this.$slots.default]);
    if (this.keepAlive) {
      if (!this.shown && !this.active) {
        return
      }
      this.shown = true;
      return node
    }
    else {
      this.shown = this.active;
      if (this.active) {
        return node
      }
    }
  }
};

var scrollNavigationSpeed = 5;
var debounceDelay = 50; // in ms

var QTabs = {render: function(){
var obj;
var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-tabs flex no-wrap",class:[ ("q-tabs-position-" + (_vm.position)), ("q-tabs-" + (_vm.inverted ? 'inverted' : 'normal')), _vm.noPaneBorder ? 'q-tabs-no-pane-border' : '', _vm.twoLines ? 'q-tabs-two-lines' : '' ]},[_c('div',{ref:"tabs",staticClass:"q-tabs-head row",class:( obj = {}, obj[("q-tabs-align-" + (_vm.align))] = true, obj.glossy = _vm.glossy, obj[("bg-" + (_vm.color))] = !_vm.inverted && _vm.color, obj)},[_c('div',{ref:"scroller",staticClass:"q-tabs-scroller row no-wrap"},[_vm._t("title"),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"relative-position self-stretch q-tabs-global-bar-container",class:[_vm.inverted && _vm.color ? ("text-" + (_vm.color)) : '', _vm.data.highlight ? 'highlight' : '']},[_c('div',{ref:"posbar",staticClass:"q-tabs-bar q-tabs-global-bar",on:{"transitionend":_vm.__updatePosbarTransition}})]):_vm._e()],2),_vm._v(" "),_c('div',{ref:"leftScroll",staticClass:"row flex-center q-tabs-left-scroll",on:{"mousedown":function($event){_vm.__animScrollTo(0);},"touchstart":function($event){_vm.__animScrollTo(0);},"mouseup":_vm.__stopAnimScroll,"touchend":_vm.__stopAnimScroll}},[_c('q-icon',{attrs:{"name":"chevron_left"}})],1),_vm._v(" "),_c('div',{ref:"rightScroll",staticClass:"row flex-center q-tabs-right-scroll",on:{"mousedown":function($event){_vm.__animScrollTo(9999);},"touchstart":function($event){_vm.__animScrollTo(9999);},"mouseup":_vm.__stopAnimScroll,"touchend":_vm.__stopAnimScroll}},[_c('q-icon',{attrs:{"name":"chevron_right"}})],1)]),_vm._v(" "),_c('div',{staticClass:"q-tabs-panes"},[_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-tabs',
  provide: function provide () {
    return {
      data: this.data,
      selectTab: this.selectTab
    }
  },
  components: {
    QIcon: QIcon
  },
  props: {
    value: String,
    align: {
      type: String,
      default: 'left',
      validator: function (v) { return ['left', 'center', 'right', 'justify'].includes(v); }
    },
    position: {
      type: String,
      default: 'top',
      validator: function (v) { return ['top', 'bottom'].includes(v); }
    },
    color: String,
    inverted: Boolean,
    twoLines: Boolean,
    noPaneBorder: Boolean,
    glossy: Boolean
  },
  data: function data () {
    return {
      currentEl: null,
      posbar: {
        width: 0,
        left: 0
      },
      data: {
        highlight: true,
        tabName: this.value || '',
        color: this.color,
        inverted: this.inverted
      }
    }
  },
  watch: {
    value: function value (name) {
      this.selectTab(name);
    },
    color: function color (v) {
      this.data.color = v;
    },
    inverted: function inverted (v) {
      this.data.inverted = v;
    }
  },
  methods: {
    selectTab: function selectTab (name) {
      if (this.data.tabName === name) {
        return
      }

      this.data.tabName = name;
      this.$emit('select', name);

      if (this.value !== name) {
        this.$emit('input', name);
      }

      var el = this.__getTabElByName(name);

      if (el) {
        this.__scrollToTab(el);
      }

      {
        this.currentEl = el;
        this.__repositionBar();
      }
    },
    __repositionBar: function __repositionBar () {
      var this$1 = this;

      clearTimeout(this.timer);

      var needsUpdate = false;
      var
        ref = this.$refs.posbar,
        el = this.currentEl;

      if (this.data.highlight !== false) {
        this.data.highlight = false;
        needsUpdate = true;
      }

      if (!el) {
        this.finalPosbar = {width: 0, left: 0};
        this.__setPositionBar(0, 0);
        return
      }

      var offsetReference = ref.parentNode.offsetLeft;

      if (needsUpdate && this.oldEl) {
        this.__setPositionBar(
          this.oldEl.getBoundingClientRect().width,
          this.oldEl.offsetLeft - offsetReference
        );
      }

      this.timer = setTimeout(function () {
        var
          width$$1 = el.getBoundingClientRect().width,
          left = el.offsetLeft - offsetReference;

        ref.classList.remove('contract');
        this$1.oldEl = el;
        this$1.finalPosbar = {width: width$$1, left: left};
        this$1.__setPositionBar(
          this$1.posbar.left < left
            ? left + width$$1 - this$1.posbar.left
            : this$1.posbar.left + this$1.posbar.width - left,
          this$1.posbar.left < left
            ? this$1.posbar.left
            : left
        );
      }, 20);
    },
    __setPositionBar: function __setPositionBar (width$$1, left) {
      if ( width$$1 === void 0 ) width$$1 = 0;
      if ( left === void 0 ) left = 0;

      if (this.posbar.width === width$$1 && this.posbar.left === left) {
        this.__updatePosbarTransition();
        return
      }
      this.posbar = {width: width$$1, left: left};
      css(this.$refs.posbar, cssTransform(("translateX(" + left + "px) scaleX(" + width$$1 + ")")));
    },
    __updatePosbarTransition: function __updatePosbarTransition () {
      if (
        this.finalPosbar.width === this.posbar.width &&
        this.finalPosbar.left === this.posbar.left
      ) {
        this.posbar = {};
        if (this.data.highlight !== true) {
          this.data.highlight = true;
        }
        return
      }

      this.$refs.posbar.classList.add('contract');
      this.__setPositionBar(this.finalPosbar.width, this.finalPosbar.left);
    },
    __redraw: function __redraw () {
      if (!this.$q.platform.is.desktop) {
        return
      }
      if (width(this.$refs.scroller) === 0 && this.$refs.scroller.scrollWidth === 0) {
        return
      }
      if (width(this.$refs.scroller) + 5 < this.$refs.scroller.scrollWidth) {
        this.$refs.tabs.classList.add('scrollable');
        this.scrollable = true;
        this.__updateScrollIndicator();
      }
      else {
        this.$refs.tabs.classList.remove('scrollable');
        this.scrollable = false;
      }
    },
    __updateScrollIndicator: function __updateScrollIndicator () {
      if (!this.$q.platform.is.desktop || !this.scrollable) {
        return
      }
      var action = this.$refs.scroller.scrollLeft + width(this.$refs.scroller) + 5 >= this.$refs.scroller.scrollWidth ? 'add' : 'remove';
      this.$refs.leftScroll.classList[this.$refs.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled');
      this.$refs.rightScroll.classList[action]('disabled');
    },
    __getTabElByName: function __getTabElByName (value) {
      var tab = this.$children.find(function (child) { return child.name === value && child.$el && child.$el.nodeType === 1; });
      if (tab) {
        return tab.$el
      }
    },
    __findTabAndScroll: function __findTabAndScroll (name, noAnimation) {
      var this$1 = this;

      setTimeout(function () {
        this$1.__scrollToTab(this$1.__getTabElByName(name), noAnimation);
      }, debounceDelay * 4);
    },
    __scrollToTab: function __scrollToTab (tab, noAnimation) {
      if (!tab || !this.scrollable) {
        return
      }

      var
        contentRect = this.$refs.scroller.getBoundingClientRect(),
        rect = tab.getBoundingClientRect(),
        tabWidth = rect.width,
        offset$$1 = rect.left - contentRect.left;

      if (offset$$1 < 0) {
        if (noAnimation) {
          this.$refs.scroller.scrollLeft += offset$$1;
        }
        else {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset$$1);
        }
        return
      }

      offset$$1 += tabWidth - this.$refs.scroller.offsetWidth;
      if (offset$$1 > 0) {
        if (noAnimation) {
          this.$refs.scroller.scrollLeft += offset$$1;
        }
        else {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset$$1);
        }
      }
    },
    __animScrollTo: function __animScrollTo (value) {
      var this$1 = this;

      this.__stopAnimScroll();
      this.__scrollTowards(value);

      this.scrollTimer = setInterval(function () {
        if (this$1.__scrollTowards(value)) {
          this$1.__stopAnimScroll();
        }
      }, 5);
    },
    __stopAnimScroll: function __stopAnimScroll () {
      clearInterval(this.scrollTimer);
    },
    __scrollTowards: function __scrollTowards (value) {
      var
        scrollPosition = this.$refs.scroller.scrollLeft,
        direction = value < scrollPosition ? -1 : 1,
        done = false;

      scrollPosition += direction * scrollNavigationSpeed;
      if (scrollPosition < 0) {
        done = true;
        scrollPosition = 0;
      }
      else if (
        (direction === -1 && scrollPosition <= value) ||
        (direction === 1 && scrollPosition >= value)
      ) {
        done = true;
        scrollPosition = value;
      }

      this.$refs.scroller.scrollLeft = scrollPosition;
      return done
    }
  },
  created: function created () {
    this.scrollTimer = null;
    this.scrollable = !this.$q.platform.is.desktop;

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.__redraw = debounce(this.__redraw, debounceDelay);
    this.__updateScrollIndicator = debounce(this.__updateScrollIndicator, debounceDelay);
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.$refs.scroller.addEventListener('scroll', this$1.__updateScrollIndicator);
      window.addEventListener('resize', this$1.__redraw);

      if (this$1.data.tabName !== '' && this$1.value) {
        this$1.selectTab(this$1.value);
      }

      this$1.__redraw();
      this$1.__findTabAndScroll(this$1.data.tabName, true);
    });
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
    this.__stopAnimScroll();
    this.$refs.scroller.removeEventListener('scroll', this.__updateScrollIndicator);
    window.removeEventListener('resize', this.__redraw);
    this.__redraw.cancel();
    this.__updateScrollIndicator.cancel();
  }
};

var Top = {
  methods: {
    getTop: function getTop (h) {
      if (this.noTop) {
        return
      }

      var
        top = this.$scopedSlots.top,
        topLeft = this.$scopedSlots['top-left'],
        topRight = this.$scopedSlots['top-right'],
        topSelection = this.$scopedSlots['top-selection'],
        hasSelection = this.selection && topSelection && this.rowsSelectedNumber > 0,
        cls = 'q-table-top relative-position row no-wrap items-center',
        child = [],
        props = {
          hasSelection: hasSelection,
          inFullscreen: this.inFullscreen,
          toggleFullscreen: this.toggleFullscreen
        };

      if (top) {
        return h('div', { staticClass: cls }, [ top(props) ])
      }

      if (hasSelection) {
        child.push(topSelection(props));
      }
      else {
        if (topLeft) {
          child.push(topLeft(props));
        }
        else if (this.title) {
          child.push(h('div', { staticClass: 'q-table-title' }, this.title));
        }
      }

      if (topRight) {
        child.push(h('div', { staticClass: 'q-table-separator col' }));
        child.push(topRight(props));
      }

      if (child.length === 0) {
        return
      }

      return h('div', {
        staticClass: ("" + cls + (hasSelection ? (" text-" + (this.color) + " q-table-top-selection") : ''))
      }, child)
    }
  }
};

var QTh = {
  name: 'q-th',
  functional: true,
  props: {
    props: Object,
    autoWidth: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props.props,
      name = ctx.data.key,
      child = ctx.children,
      autoWidth = ctx.props.autoWidth;
    var
      col,
      cls = data.staticClass;

    if (autoWidth) {
      cls = "q-table-col-auto-width" + (cls ? (" " + cls) : '');
    }

    if (!prop) {
      data.staticClass = cls;
      return h('th', data, ctx.children)
    }

    if (name) {
      col = prop.colsMap[name];
      if (!col) { return }
    }
    else {
      col = prop.col;
    }

    data.staticClass = "" + (col.__thClass) + (cls ? (" " + cls) : '');

    if (col.sortable) {
      data.on = data.on || {};
      data.on.click = function () {
        prop.sort(col);
      };

      var action = col.align === 'right'
        ? 'unshift'
        : 'push';

      child[action](
        h(QIcon, {
          props: { name: 'arrow_upward' },
          staticClass: col.__iconClass
        })
      );
    }

    return h('th', data, ctx.children)
  }
};

var TableHeader = {
  methods: {
    getTableHeader: function getTableHeader (h) {
      if (this.noHeader) {
        return
      }

      var child = [ this.getTableHeaderRow(h) ];

      if (this.loader) {
        child.push(h('tr', { staticClass: 'q-table-progress animate-fade' }, [
          h('td', { attrs: {colspan: '100%'} }, [
            h(QProgress, {
              props: {
                color: this.color,
                indeterminate: true,
                height: '2px'
              }
            })
          ])
        ]));
      }

      return h('thead', child)
    },
    getTableHeaderRow: function getTableHeaderRow (h) {
      var this$1 = this;

      var
        header = this.$scopedSlots.header,
        headerCell = this.$scopedSlots['header-cell'];

      if (header) {
        return header(this.addTableHeaderRowMeta({header: true, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap}))
      }

      var mapFn;

      if (headerCell) {
        mapFn = function (col) { return headerCell({col: col, cols: this$1.computedCols, sort: this$1.sort, colsMap: this$1.computedColsMap}); };
      }
      else {
        mapFn = function (col) { return h(QTh, {
          key: col.name,
          props: {
            props: {
              col: col,
              cols: this$1.computedCols,
              sort: this$1.sort,
              colsMap: this$1.computedColsMap
            }
          }
        }, col.label); };
      }
      var child = this.computedCols.map(mapFn);

      if (this.singleSelection) {
        child.unshift(h('th', { staticClass: 'q-table-col-auto-width' }, [' ']));
      }
      else if (this.multipleSelection) {
        child.unshift(h('th', { staticClass: 'q-table-col-auto-width' }, [
          h(QCheckbox, {
            props: {
              color: this.color,
              value: this.allRowsSelected,
              dark: this.dark,
              indeterminate: this.someRowsSelected
            },
            on: {
              input: function (val) {
                if (this$1.someRowsSelected) {
                  val = false;
                }
                this$1.__updateSelection(
                  this$1.computedRows.map(function (row) { return row[this$1.rowKey]; }),
                  this$1.computedRows,
                  val
                );
              }
            }
          })
        ]));
      }

      return h('tr', child)
    },
    addTableHeaderRowMeta: function addTableHeaderRowMeta (data) {
      var this$1 = this;

      if (this.multipleSelection) {
        Object.defineProperty(data, 'selected', {
          get: function () { return this$1.allRowsSelected; },
          set: function (val) {
            if (this$1.someRowsSelected) {
              val = false;
            }
            this$1.__updateSelection(
              this$1.computedRows.map(function (row) { return row[this$1.rowKey]; }),
              this$1.computedRows,
              val
            );
          }
        });
        data.partialSelected = this.someRowsSelected;
        data.multipleSelect = true;
      }

      return data
    }
  }
};

var TableBody = {
  methods: {
    getTableBody: function getTableBody (h) {
      var this$1 = this;

      var
        body = this.$scopedSlots.body,
        bodyCell = this.$scopedSlots['body-cell'],
        topRow = this.$scopedSlots['top-row'],
        bottomRow = this.$scopedSlots['bottom-row'];
      var
        child = [];

      if (body) {
        child = this.computedRows.map(function (row) {
          var
            key = row[this$1.rowKey],
            selected = this$1.isRowSelected(key);

          return body(this$1.addBodyRowMeta({
            key: key,
            row: row,
            cols: this$1.computedCols,
            colsMap: this$1.computedColsMap,
            __trClass: selected ? 'selected' : ''
          }))
        });
      }
      else {
        child = this.computedRows.map(function (row) {
          var
            key = row[this$1.rowKey],
            selected = this$1.isRowSelected(key),
            child = bodyCell
              ? this$1.computedCols.map(function (col) { return bodyCell(this$1.addBodyCellMetaData({ row: row, col: col })); })
              : this$1.computedCols.map(function (col) {
                var slot = this$1.$scopedSlots[("body-cell-" + (col.name))];
                return slot
                  ? slot(this$1.addBodyCellMetaData({ row: row, col: col }))
                  : h('td', { staticClass: col.__tdClass }, this$1.getCellValue(col, row))
              });

          if (this$1.selection) {
            child.unshift(h('td', { staticClass: 'q-table-col-auto-width' }, [
              h(QCheckbox, {
                props: {
                  value: selected,
                  color: this$1.color,
                  dark: this$1.dark
                },
                on: {
                  input: function (adding) {
                    this$1.__updateSelection([key], [row], adding);
                  }
                }
              })
            ]));
          }

          return h('tr', { key: key, 'class': { selected: selected } }, child)
        });
      }

      if (topRow) {
        child.unshift(topRow({cols: this.computedCols}));
      }
      if (bottomRow) {
        child.push(bottomRow({cols: this.computedCols}));
      }

      return h('tbody', child)
    },
    addBodyRowMeta: function addBodyRowMeta (data) {
      var this$1 = this;

      if (this.selection) {
        Object.defineProperty(data, 'selected', {
          get: function () { return this$1.isRowSelected(data.key); },
          set: function (adding) {
            this$1.__updateSelection([data.key], [data.row], adding);
          }
        });
      }

      Object.defineProperty(data, 'expand', {
        get: function () { return this$1.rowsExpanded[data.key] === true; },
        set: function (val) {
          this$1.$set(this$1.rowsExpanded, data.key, val);
        }
      });

      data.cols = data.cols.map(function (col) {
        var c = Object.assign({}, col);
        Object.defineProperty(c, 'value', {
          get: function () { return this$1.getCellValue(col, data.row); }
        });
        return c
      });

      return data
    },
    addBodyCellMetaData: function addBodyCellMetaData (data) {
      var this$1 = this;

      Object.defineProperty(data, 'value', {
        get: function () { return this$1.getCellValue(data.col, data.row); }
      });
      return data
    },
    getCellValue: function getCellValue (col, row) {
      var val = typeof col.field === 'function' ? col.field(row) : row[col.field];
      return col.format ? col.format(val) : val
    }
  }
};

var Bottom = {
  methods: {
    getBottom: function getBottom (h) {
      if (this.nothingToDisplay) {
        var message = this.filter
          ? this.noResultsLabel || this.$q.i18n.table.noResults
          : (this.loader ? this.loaderLabel || this.$q.i18n.table.loader : this.noDataLabel || this.$q.i18n.table.noData);

        return h('div', { staticClass: 'q-table-bottom row items-center q-table-nodata' }, [
          h(QIcon, {props: {name: 'warning'}}),
          message
        ])
      }

      if (this.noBottom) {
        return
      }

      return h('div', { staticClass: 'q-table-bottom row items-center' },
        this.getPaginationRow(h)
      )
    },
    getPaginationRow: function getPaginationRow (h) {
      var this$1 = this;

      var ref = this.computedPagination;
      var page = ref.page;
      var rowsPerPage = ref.rowsPerPage;
      var paginationLabel = this.paginationLabel || this.$q.i18n.table.pagination;

      return [
        h('div', { staticClass: 'col' }, [
          this.selection && this.rowsSelectedNumber > 0
            ? (this.selectedRowsLabel || this.$q.i18n.table.selectedRows)(this.rowsSelectedNumber)
            : ''
        ]),
        h('div', [
          h('span', { style: {marginRight: '32px'} }, [
            this.rowsPerPageLabel || this.$q.i18n.table.rowsPerPage
          ]),
          h(QSelect, {
            staticClass: 'inline',
            style: {
              margin: '0 15px',
              minWidth: '50px'
            },
            props: {
              color: this.color,
              value: rowsPerPage,
              options: this.computedRowsPerPageOptions,
              dark: this.dark
            },
            on: {
              input: function (rowsPerPage) {
                this$1.setPagination({
                  page: 1,
                  rowsPerPage: rowsPerPage
                });
              }
            }
          }),
          h('span', { style: {margin: '0 32px'} }, [
            rowsPerPage
              ? paginationLabel(this.firstRowIndex + 1, Math.min(this.lastRowIndex, this.computedRowsNumber), this.computedRowsNumber)
              : paginationLabel(1, this.computedRowsNumber, this.computedRowsNumber)
          ]),
          h(QBtn, {
            props: {
              color: this.color,
              round: true,
              icon: 'chevron_left',
              small: true,
              flat: true,
              disable: page === 1
            },
            on: {
              click: function () {
                this$1.setPagination({ page: page - 1 });
              }
            }
          }),
          h(QBtn, {
            props: {
              color: this.color,
              round: true,
              icon: 'chevron_right',
              small: true,
              flat: true,
              disable: this.lastRowIndex === 0 || page * rowsPerPage >= this.computedRowsNumber
            },
            on: {
              click: function () {
                this$1.setPagination({ page: page + 1 });
              }
            }
          })
        ])
      ]
    }
  }
};

function sortDate (a, b) {
  return (new Date(a)) - (new Date(b))
}

var Sort = {
  props: {
    sortMethod: {
      type: Function,
      default: function default$1 (data, sortBy, descending) {
        var col = this.computedCols.find(function (def) { return def.name === sortBy; });
        if (col === null || col.field === void 0) {
          return data
        }

        var
          dir = descending ? -1 : 1,
          val = typeof col.field === 'function'
            ? function (v) { return col.field(v); }
            : function (v) { return v[col.field]; };

        return data.sort(function (a, b) {
          var
            A = val(a),
            B = val(b);

          if (A === null || A === void 0) {
            return -1 * dir
          }
          if (B === null || B === void 0) {
            return 1 * dir
          }
          if (col.sort) {
            return col.sort(A, B) * dir
          }
          if (isNumber(A) && isNumber(B)) {
            return (A - B) * dir
          }
          if (isDate(A) && isDate(B)) {
            return sortDate(A, B) * dir
          }

          var assign;
          (assign = [A, B].map(function (s) { return s.toLowerCase(); }), A = assign[0], B = assign[1]);

          return A < B
            ? -1 * dir
            : (A === B ? 0 : dir)
        })
      }
    }
  },
  computed: {
    columnToSort: function columnToSort () {
      var ref = this.computedPagination;
      var sortBy = ref.sortBy;

      if (sortBy) {
        var col = this.computedCols.find(function (def) { return def.name === sortBy; });
        return col || null
      }
    }
  },
  methods: {
    sort: function sort (col /* String(col name) or Object(col definition) */) {
      if (col === Object(col)) {
        col = col.name;
      }

      var ref = this.computedPagination;
      var sortBy = ref.sortBy;
      var descending = ref.descending;

      if (sortBy !== col) {
        sortBy = col;
        descending = false;
      }
      else if (descending) {
        sortBy = null;
      }
      else {
        descending = true;
      }

      this.setPagination({ sortBy: sortBy, descending: descending, page: 1 });
    }
  }
};

var Filter = {
  props: {
    filter: String,
    filterMethod: {
      type: Function,
      default: function default$1 (rows, terms, cols, cellValue) {
        if ( cols === void 0 ) cols = this.computedCols;
        if ( cellValue === void 0 ) cellValue = this.getCellValue;

        var lowerTerms = terms ? terms.toLowerCase() : '';
        return rows.filter(
          function (row) { return cols.some(function (col) { return (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1; }); }
        )
      }
    }
  },
  computed: {
    hasFilter: function hasFilter () {
      return this.filter !== void 0
    }
  },
  watch: {
    filter: function filter () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.setPagination({ page: 1 });
      });
    }
  }
};

var Pagination = {
  props: {
    pagination: Object,
    rowsPerPageOptions: {
      type: Array,
      default: function () { return [3, 5, 7, 10, 15, 20, 25, 50, 0]; }
    }
  },
  data: function data () {
    return {
      innerPagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 5
      }
    }
  },
  computed: {
    computedPagination: function computedPagination () {
      return Object.assign({}, this.innerPagination, this.pagination)
    },
    firstRowIndex: function firstRowIndex () {
      var ref = this.computedPagination;
      var page = ref.page;
      var rowsPerPage = ref.rowsPerPage;
      return (page - 1) * rowsPerPage
    },
    lastRowIndex: function lastRowIndex () {
      var ref = this.computedPagination;
      var page = ref.page;
      var rowsPerPage = ref.rowsPerPage;
      return page * rowsPerPage
    },
    computedRowsPerPageOptions: function computedRowsPerPageOptions () {
      var this$1 = this;

      return this.rowsPerPageOptions.map(function (count) { return ({
        label: count === 0 ? this$1.$q.i18n.table.allRows : '' + count,
        value: count
      }); })
    }
  },
  methods: {
    setPagination: function setPagination (val) {
      var newPagination = Object.assign({}, this.computedPagination, val);

      if (this.isServerSide) {
        this.requestServerInteraction({
          pagination: newPagination
        });
        return
      }

      if (this.pagination) {
        this.$emit('update:pagination', newPagination);
      }
      else {
        this.innerPagination = newPagination;
      }
    }
  },
  created: function created () {
    this.$emit('update:pagination', Object.assign({}, this.computedPagination));
  }
};

var RowSelection = {
  props: {
    selection: {
      type: String,
      validator: function (v) { return ['single', 'multiple'].includes(v); }
    },
    selected: {
      type: Array,
      default: function () { return []; }
    }
  },
  computed: {
    selectedKeys: function selectedKeys () {
      var this$1 = this;

      var keys = {};
      this.selected.map(function (row) { return row[this$1.rowKey]; }).forEach(function (key) {
        keys[key] = true;
      });
      return keys
    },
    singleSelection: function singleSelection () {
      return this.selection === 'single'
    },
    multipleSelection: function multipleSelection () {
      return this.selection === 'multiple'
    },
    allRowsSelected: function allRowsSelected () {
      var this$1 = this;

      if (this.multipleSelection) {
        return this.computedRows.length > 0 && this.computedRows.every(function (row) { return this$1.selectedKeys[row[this$1.rowKey]] === true; })
      }
    },
    someRowsSelected: function someRowsSelected () {
      var this$1 = this;

      if (this.multipleSelection) {
        return !this.allRowsSelected && this.computedRows.some(function (row) { return this$1.selectedKeys[row[this$1.rowKey]] === true; })
      }
    },
    rowsSelectedNumber: function rowsSelectedNumber () {
      return this.selected.length
    }
  },
  methods: {
    isRowSelected: function isRowSelected (key) {
      return this.selectedKeys[key] === true
    },
    clearSelection: function clearSelection () {
      this.$emit('update:selected', []);
    },
    __updateSelection: function __updateSelection (keys, rows, adding) {
      var this$1 = this;

      if (this.singleSelection) {
        this.$emit('update:selected', adding ? rows : []);
      }
      else {
        this.$emit('update:selected', adding
          ? this.selected.concat(rows)
          : this.selected.filter(function (row) { return !keys.includes(row[this$1.rowKey]); })
        );
      }
    }
  }
};

var ColumnSelection = {
  props: {
    visibleColumns: Array
  },
  computed: {
    computedCols: function computedCols () {
      var this$1 = this;

      var ref = this.computedPagination;
      var sortBy = ref.sortBy;
      var descending = ref.descending;

      var cols = this.visibleColumns
        ? this.columns.filter(function (col) { return col.required || this$1.visibleColumns.includes(col.name); })
        : this.columns;

      return cols.map(function (col) {
        col.align = col.align || 'right';
        col.__iconClass = "q-table-sort-icon q-table-sort-icon-" + (col.align);
        col.__thClass = "text-" + (col.align) + (col.sortable ? ' sortable' : '') + (col.name === sortBy ? (" sorted " + (descending ? 'sort-desc' : '')) : '');
        col.__tdClass = "text-" + (col.align);
        return col
      })
    },
    computedColsMap: function computedColsMap () {
      var names = {};
      this.computedCols.forEach(function (col) {
        names[col.name] = col;
      });
      return names
    }
  }
};

var Expand = {
  data: function data () {
    return {
      rowsExpanded: {}
    }
  }
};

var QTable = {
  name: 'q-table',
  mixins: [
    FullscreenMixin,
    Top,
    TableHeader,
    TableBody,
    Bottom,
    Sort,
    Filter,
    Pagination,
    RowSelection,
    ColumnSelection,
    Expand
  ],
  props: {
    data: {
      type: Array,
      default: function () { return []; }
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    color: {
      type: String,
      default: 'grey-8'
    },
    columns: Array,
    loader: Boolean,
    title: String,
    noTop: Boolean,
    noHeader: Boolean,
    noBottom: Boolean,
    dark: Boolean,
    separator: {
      type: String,
      default: 'horizontal',
      validator: function (v) { return ['horizontal', 'vertical', 'cell', 'none'].includes(v); }
    },
    noDataLabel: String,
    noResultsLabel: String,
    loaderLabel: String,
    selectedRowsLabel: Function,
    rowsPerPageLabel: String,
    paginationLabel: Function,
    tableStyle: {
      type: [String, Array, Object],
      default: ''
    },
    tableClass: {
      type: [String, Array, Object],
      default: ''
    }
  },
  computed: {
    computedRows: function computedRows () {
      var rows = this.data.slice();

      if (rows.length === 0) {
        return []
      }
      if (this.isServerSide) {
        return rows
      }

      var ref = this.computedPagination;
      var sortBy = ref.sortBy;
      var descending = ref.descending;
      var rowsPerPage = ref.rowsPerPage;

      if (this.hasFilter && this.filter) {
        rows = this.filterMethod(rows, this.filter, this.computedCols, this.getCellValue);
      }

      if (this.columnToSort) {
        rows = this.sortMethod(rows, sortBy, descending);
      }

      if (rowsPerPage) {
        rows = rows.slice(this.firstRowIndex, this.lastRowIndex);
      }

      return rows
    },
    computedRowsNumber: function computedRowsNumber () {
      return this.isServerSide
        ? this.computedPagination.rowsNumber || 0
        : this.data.length
    },
    nothingToDisplay: function nothingToDisplay () {
      return this.computedRows.length === 0
    },
    isServerSide: function isServerSide () {
      return this.computedPagination.rowsNumber !== void 0
    }
  },
  render: function render (h) {
    return h('div',
      {
        'class': {
          'q-table-container': true,
          'q-table-dark': this.dark,
          fullscreen: this.inFullscreen,
          scroll: this.inFullscreen
        }
      },
      [
        this.getTop(h),
        h('div', { staticClass: 'q-table-middle scroll', 'class': this.tableClass, style: this.tableStyle }, [
          h('table', { staticClass: ("q-table q-table-" + (this.separator) + "-separator" + (this.dark ? ' q-table-dark' : '')) },
            [
              this.getTableHeader(h),
              this.getTableBody(h)
            ]
          )
        ]),
        this.getBottom(h)
      ]
    )
  },
  methods: {
    requestServerInteraction: function requestServerInteraction (prop) {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit('request', {
          pagination: prop.pagination || this$1.computedPagination,
          filter: prop.filter || this$1.filter,
          getCellValue: this$1.getCellValue
        });
      });
    }
  }
};

var QTr = {
  name: 'q-tr',
  functional: true,
  props: {
    props: Object
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      prop = ctx.props.props;

    if (!prop || prop.header) {
      return h('tr', ctx.data, ctx.children)
    }

    data.staticClass = "" + (prop.__trClass) + (cls ? (" " + cls) : '');

    return h('tr', data, ctx.children)
  }
};

var QTd = {
  name: 'q-td',
  functional: true,
  props: {
    props: Object,
    autoWidth: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props.props,
      name = ctx.data.key,
      autoWidth = ctx.props.autoWidth;

    var
      col,
      cls = data.staticClass;

    if (autoWidth) {
      cls = "q-table-col-auto-width" + (cls ? (" " + cls) : '');
    }

    if (!prop) {
      data.staticClass = cls;
      return h('td', data, ctx.children)
    }

    if (name) {
      col = prop.colsMap[name];
      if (!col) { return }
    }
    else {
      col = prop.col;
    }

    data.staticClass = "" + (col.__tdClass) + (cls ? (" " + cls) : '');

    return h('td', data, ctx.children)
  }
};

var QTableColumns = {
  name: 'q-table-columns',
  props: {
    value: {
      type: Array,
      required: true
    },
    label: String,
    columns: {
      type: Array,
      required: true
    },
    color: String
  },
  computed: {
    computedOptions: function computedOptions () {
      return this.columns.filter(function (col) { return !col.required; }).map(function (col) { return ({
        value: col.name,
        label: col.label
      }); })
    }
  },
  render: function render (h) {
    return h(QSelect, {
      props: {
        multiple: true,
        toggle: true,
        value: this.value,
        options: this.computedOptions,
        displayValue: this.label || this.$q.i18n.table.columns,
        color: this.color
      }
    })
  }
};

var QTimeline = {
  name: 'q-timeline',
  provide: function provide () {
    return {
      __timeline: this
    }
  },
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean
  },
  render: function render (h) {
    return h('ul', {
      staticClass: 'q-timeline',
      'class': { 'q-timeline-dark': this.dark }
    }, [
      this.$slots.default
    ])
  }
};

var QTimelineEntry = {
  name: 'q-timeline-entry',
  inject: {
    __timeline: {
      default: function default$1 () {
        console.error('QTimelineEntry needs to be child of QTimeline');
      }
    }
  },
  props: {
    heading: Boolean,
    tag: {
      type: String,
      default: 'h3'
    },
    side: {
      type: String,
      default: 'right',
      validator: function (v) { return ['left', 'right'].includes(v); }
    },
    icon: String,
    color: String,
    title: String,
    subtitle: String
  },
  computed: {
    colorClass: function colorClass () {
      return ("text-" + (this.color || this.__timeline.color))
    },
    classes: function classes () {
      return [
        ("q-timeline-entry-" + (this.side === 'left' ? 'left' : 'right')),
        this.icon ? 'q-timeline-entry-with-icon' : ''
      ]
    }
  },
  render: function render (h) {
    if (this.heading) {
      return h('div', { staticClass: 'q-timeline-heading' }, [
        h('div'),
        h('div'),
        h(this.tag, { staticClass: 'q-timeline-heading-title' }, [
          this.$slots.default
        ])
      ])
    }

    return h('li', {
      staticClass: "q-timeline-entry",
      'class': this.classes
    }, [
      h('div', { staticClass: 'q-timeline-subtitle' }, [
        h('span', this.subtitle)
      ]),

      h('div', {
        staticClass: 'q-timeline-dot',
        'class': this.colorClass
      }, [
        this.icon
          ? h(QIcon, { props: { name: this.icon } })
          : null
      ]),

      h('div', { staticClass: 'q-timeline-content' }, [
        h('h6', { staticClass: 'q-timeline-title' }, [ this.title ]),
        this.$slots.default
      ])
    ])
  }
};

var QToolbar = {
  name: 'q-toolbar',
  functional: true,
  props: {
    color: String,
    inverted: Boolean,
    glossy: Boolean
  },
  render: function render (h, ctx) {
    var
      cls = ctx.data.staticClass,
      prop = ctx.props;

    var classes = "q-toolbar-" + (prop.inverted ? 'inverted' : 'normal');
    if (prop.color) {
      classes += " " + (prop.inverted ? 'text' : 'bg') + "-" + (prop.color);
    }
    if (prop.glossy) {
      classes += " glossy";
    }

    ctx.data.staticClass = "q-toolbar row no-wrap items-center relative-position " + classes + (cls ? (" " + cls) : '');

    return h(
      'div',
      ctx.data,
      ctx.children
    )
  }
};

var QToolbarTitle = {
  name: 'q-toolbar-title',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots(),
      children = [slots.default];

    if (slots.subtitle) {
      children.push(h('div', { staticClass: 'q-toolbar-subtitle' }, slots.subtitle));
    }
    data.staticClass = "q-toolbar-title" + (cls ? (" " + cls) : '');

    return h('div', data, children)
  }
};

var QTreeItem = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"q-tree-item"},[_c('div',{staticClass:"row inline items-center",class:{'q-tree-link': _vm.hasHandler || _vm.isExpandable}},[_c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat",value:(_vm.hasHandler || _vm.isExpandable),expression:"hasHandler || isExpandable",modifiers:{"mat":true}}],staticClass:"q-tree-label relative-position row items-center",on:{"click":_vm.tap}},[(_vm.item.icon)?_c('q-icon',{staticClass:"on-left",attrs:{"name":_vm.item.icon}}):_vm._e(),_vm._v(" "),(_vm.item.safe)?_c('span',{domProps:{"innerHTML":_vm._s(_vm.item.title)}}):_c('span',[_vm._v(_vm._s(_vm.item.title))])],1),_vm._v(" "),(_vm.isExpandable)?_c('span',{staticClass:"on-right",domProps:{"innerHTML":_vm._s(_vm.item.expanded ? _vm.contractHtml : _vm.expandHtml)},on:{"click":_vm.toggle}}):_vm._e()]),_vm._v(" "),_c('q-slide-transition',[_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.isExpandable && _vm.item.expanded),expression:"isExpandable && item.expanded"}]},_vm._l((_vm.item.children),function(item){return _c('q-tree-item',{key:item.id || item.title,attrs:{"model":item,"contract-html":_vm.contractHtml,"expand-html":_vm.expandHtml}})}))])],1)},staticRenderFns: [],
  name: 'q-tree-item',
  components: {
    QIcon: QIcon,
    QSlideTransition: QSlideTransition
  },
  directives: {
    Ripple: Ripple
  },
  props: ['model', 'contractHtml', 'expandHtml'],
  data: function data () {
    return {
      item: extend({
        expanded: false,
        children: []
      }, this.model)
    }
  },
  watch: {
    model: function model (value) {
      this.item = extend({
        expanded: false,
        children: []
      }, value);
    }
  },
  methods: {
    tap: function tap () {
      if (this.hasHandler) {
        return this.item.handler(this.model)
      }
      this.toggle();
    },
    toggle: function toggle () {
      this.item.expanded = !this.item.expanded;
    }
  },
  computed: {
    isExpandable: function isExpandable () {
      return this.item.children && this.item.children.length > 0
    },
    hasHandler: function hasHandler () {
      return typeof this.item.handler === 'function'
    }
  }
};

var QTree = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-tree"},[_c('ul',_vm._l((_vm.model),function(item){return _c('q-tree-item',{key:item.id || item.title,attrs:{"model":item,"contract-html":_vm.contractHtml,"expand-html":_vm.expandHtml}})}))])},staticRenderFns: [],
  name: 'q-tree',
  components: {
    QTreeItem: QTreeItem
  },
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true,
      default: '<i class="material-icons">remove_circle</i>'
    },
    expandHtml: {
      type: String,
      required: true,
      default: '<i class="material-icons">add_circle</i>'
    }
  }
};

function initFile (file) {
  file.__doneUploading = false;
  file.__failed = false;
  file.__uploaded = 0;
  file.__progress = 0;
}

var QUploader = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-uploader relative-position",on:{"dragover":function($event){$event.preventDefault();$event.stopPropagation();_vm.__onDragOver($event);}}},[_c('q-input-frame',{ref:"input",staticClass:"no-margin",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"before":_vm.before,"after":_vm.after,"color":_vm.color,"align":_vm.align,"inverted":_vm.inverted,"length":_vm.queueLength,"additional-length":""}},[_c('div',{staticClass:"col row items-center q-input-target",domProps:{"innerHTML":_vm._s(_vm.label)}}),_vm._v(" "),(_vm.uploading)?_c('q-spinner',{staticClass:"q-if-control",attrs:{"slot":"after","size":"24px"},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.uploading)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"clear"},on:{"click":_vm.abort},slot:"after"}):_vm._e(),_vm._v(" "),(!_vm.uploading)?_c('q-icon',{staticClass:"q-uploader-pick-button q-if-control relative-position overflow-hidden",attrs:{"slot":"after","name":"add","disabled":_vm.addDisabled},on:{"click":_vm.__pick},slot:"after"},[_c('input',_vm._b({ref:"file",staticClass:"q-uploader-input absolute-full cursor-pointer",attrs:{"type":"file","accept":_vm.extensions},on:{"change":_vm.__add}},'input',{multiple: _vm.multiple},true))]):_vm._e(),_vm._v(" "),(!_vm.hideUploadButton && !_vm.uploading)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"cloud_upload","disabled":_vm.queueLength === 0},on:{"click":_vm.upload},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.hasExpandedContent)?_c('q-icon',{staticClass:"q-if-control generic_transition",class:{'rotate-180': _vm.expanded},attrs:{"slot":"after","name":"keyboard_arrow_down"},on:{"click":function($event){_vm.expanded = !_vm.expanded;}},slot:"after"}):_vm._e()],1),_vm._v(" "),_c('q-slide-transition',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.expanded),expression:"expanded"}]},[_c('div',{staticClass:"q-uploader-files scroll",style:(_vm.filesStyle)},_vm._l((_vm.files),function(file){return _c('q-item',{key:file.name,staticClass:"q-uploader-file"},[(!_vm.hideUploadProgress)?_c('q-progress',{staticClass:"q-uploader-progress-bg absolute-full",attrs:{"color":file.__failed ? 'negative' : 'grey',"percentage":file.__progress}}):_vm._e(),_vm._v(" "),(!_vm.hideUploadProgress)?_c('div',{staticClass:"q-uploader-progress-text absolute"},[_vm._v(" "+_vm._s(file.__progress)+"% ")]):_vm._e(),_vm._v(" "),(file.__img)?_c('q-item-side',{attrs:{"image":file.__img.src}}):_c('q-item-side',{attrs:{"icon":"insert_drive_file","color":_vm.color}}),_vm._v(" "),_c('q-item-main',{attrs:{"label":file.name,"sublabel":file.__size}}),_vm._v(" "),_c('q-item-side',{attrs:{"right":""}},[_c('q-item-tile',{staticClass:"cursor-pointer",attrs:{"icon":file.__doneUploading ? 'done' : 'clear',"color":_vm.color},on:{"click":function($event){_vm.__remove(file);}}})],1)],1)}))])]),_vm._v(" "),(_vm.dnd)?_c('div',{staticClass:"q-uploader-dnd flex row items-center justify-center absolute-full",class:_vm.dndClass,on:{"dragenter":function($event){$event.preventDefault();$event.stopPropagation();},"dragover":function($event){$event.preventDefault();$event.stopPropagation();},"dragleave":function($event){$event.preventDefault();$event.stopPropagation();_vm.__onDragLeave($event);},"drop":function($event){$event.preventDefault();$event.stopPropagation();_vm.__onDrop($event);}}}):_vm._e()],1)},staticRenderFns: [],
  name: 'q-uploader',
  mixins: [FrameMixin],
  components: {
    QInputFrame: QInputFrame,
    QSpinner: QSpinner,
    QIcon: QIcon,
    QProgress: QProgress,
    QItem: QItem,
    QItemSide: QItemSide,
    QItemMain: QItemMain,
    QItemTile: QItemTile,
    QSlideTransition: QSlideTransition
  },
  props: {
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    url: {
      type: String,
      required: true
    },
    urlFactory: {
      type: Function,
      required: false
    },
    additionalFields: {
      type: Array,
      default: function () { return []; }
    },
    method: {
      type: String,
      default: 'POST'
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean,
    hideUploadProgress: Boolean,
    noThumbnails: Boolean,
    autoExpand: Boolean,
    expandStyle: [Array, String, Object],
    expandClass: [Array, String, Object],
    sendRaw: {
      type: Boolean,
      default: false
    }
  },
  data: function data () {
    return {
      queue: [],
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      xhrs: [],
      focused: false,
      dnd: false,
      expanded: false
    }
  },
  computed: {
    queueLength: function queueLength () {
      return this.queue.length
    },
    hasExpandedContent: function hasExpandedContent () {
      return this.files.length > 0
    },
    label: function label () {
      var total = humanStorageSize(this.totalSize);
      return this.uploading
        ? (((this.progress).toFixed(2)) + "% (" + (humanStorageSize(this.uploadedSize)) + " / " + total + ")")
        : ((this.queueLength) + " (" + total + ")")
    },
    progress: function progress () {
      return this.totalSize ? Math.min(99.99, this.uploadedSize / this.totalSize * 100) : 0
    },
    addDisabled: function addDisabled () {
      return !this.multiple && this.queueLength >= 1
    },
    filesStyle: function filesStyle () {
      if (this.maxHeight) {
        return { maxHeight: this.maxHeight }
      }
    },
    dndClass: function dndClass () {
      var cls = [("text-" + (this.color))];
      if (this.inverted) {
        cls.push('inverted');
      }
      return cls
    }
  },
  watch: {
    hasExpandedContent: function hasExpandedContent (v) {
      if (v === false) {
        this.expanded = false;
      }
      else if (this.autoExpand) {
        this.expanded = true;
      }
    }
  },
  methods: {
    __onDragOver: function __onDragOver () {
      this.dnd = true;
    },
    __onDragLeave: function __onDragLeave () {
      this.dnd = false;
    },
    __onDrop: function __onDrop (e) {
      this.dnd = false;

      var
        files = e.dataTransfer.files,
        count = files.length;

      if (count > 0) {
        this.__add(null, this.multiple ? files : [ files[0] ]);
      }
    },
    __add: function __add (e, files) {
      var this$1 = this;

      if (this.addDisabled) {
        return
      }

      files = Array.prototype.slice.call(files || e.target.files);
      this.$refs.file.value = '';

      files = files.filter(function (file) { return !this$1.queue.some(function (f) { return file.name === f.name; }); })
        .map(function (file) {
          initFile(file);
          file.__size = humanStorageSize(file.size);

          if (this$1.noThumbnails || !file.type.startsWith('image')) {
            this$1.queue.push(file);
          }
          else {
            var reader = new FileReader();
            reader.onload = function (e) {
              var img = new Image();
              img.src = e.target.result;
              file.__img = img;
              this$1.queue.push(file);
              this$1.__computeTotalSize();
            };
            reader.readAsDataURL(file);
          }

          return file
        });

      if (files.length > 0) {
        this.files = this.files.concat(files);
        this.$emit('add', files);
        this.__computeTotalSize();
      }
    },
    __computeTotalSize: function __computeTotalSize () {
      this.totalSize = this.queueLength
        ? this.queue.map(function (f) { return f.size; }).reduce(function (total, size) { return total + size; })
        : 0;
    },
    __remove: function __remove (file) {
      var
        name = file.name,
        done = file.__doneUploading;

      if (this.uploading && !done) {
        this.$emit('remove:abort', file, file.xhr);
        file.xhr.abort();
        this.uploadedSize -= file.__uploaded;
      }
      else {
        this.$emit(("remove:" + (done ? 'done' : 'cancel')), file, file.xhr);
      }

      if (!done) {
        this.queue = this.queue.filter(function (obj) { return obj.name !== name; });
      }

      file.__removed = true;
      this.files = this.files.filter(function (obj) { return obj.name !== name; });
      this.__computeTotalSize();
    },
    __removeUploaded: function __removeUploaded () {
      this.files = this.files.filter(function (f) { return !f.__doneUploading; });
      this.__computeTotalSize();
    },
    __pick: function __pick () {
      if (!this.addDisabled && this.$q.platform.is.mozilla) {
        this.$refs.file.click();
      }
    },
    __getUploadPromise: function __getUploadPromise (file) {
      var this$1 = this;

      var
        form = new FormData(),
        xhr = new XMLHttpRequest();

      try {
        this.additionalFields.forEach(function (field) {
          form.append(field.name, field.value);
        });
        form.append('Content-Type', file.type || 'application/octet-stream');
        form.append(this.name, file);
      }
      catch (e) {
        return
      }

      initFile(file);
      file.xhr = xhr;
      return new Promise(function (resolve, reject) {
        xhr.upload.addEventListener('progress', function (e) {
          if (file.__removed) { return }
          e.percent = e.total ? e.loaded / e.total : 0;
          var uploaded = e.percent * file.size;
          this$1.uploadedSize += uploaded - file.__uploaded;
          file.__uploaded = uploaded;
          file.__progress = Math.min(99, parseInt(e.percent * 100, 10));
        }, false);

        xhr.onreadystatechange = function () {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            file.__doneUploading = true;
            file.__progress = 100;
            this$1.$emit('uploaded', file, xhr);
            resolve(file);
          }
          else {
            file.__failed = true;
            this$1.$emit('fail', file, xhr);
            reject(xhr);
          }
        };

        xhr.onerror = function () {
          file.__failed = true;
          this$1.$emit('fail', file, xhr);
          reject(xhr);
        };

        var resolver = this$1.urlFactory
          ? this$1.urlFactory(file)
          : Promise.resolve(this$1.url);

        resolver.then(function (url) {
          xhr.open(this$1.method, url, true);
          if (this$1.headers) {
            Object.keys(this$1.headers).forEach(function (key) {
              xhr.setRequestHeader(key, this$1.headers[key]);
            });
          }

          this$1.xhrs.push(xhr);
          if (this$1.sendRaw) {
            xhr.send(file);
          }
          else {
            xhr.send(form);
          }
        });
      })
    },
    upload: function upload () {
      var this$1 = this;

      var length = this.queueLength;
      if (this.disable || length === 0) {
        return
      }

      var filesDone = 0;
      this.uploadedSize = 0;
      this.uploading = true;
      this.xhrs = [];
      this.$emit('start');

      var solved = function () {
        filesDone++;
        if (filesDone === length) {
          this$1.uploading = false;
          this$1.xhrs = [];
          this$1.queue = this$1.queue.filter(function (f) { return !f.__doneUploading; });
          this$1.__computeTotalSize();
          this$1.$emit('finish');
        }
      };

      this.queue
        .map(function (file) { return this$1.__getUploadPromise(file); })
        .forEach(function (promise) {
          promise.then(solved).catch(solved);
        });
    },
    abort: function abort () {
      this.xhrs.forEach(function (xhr) { xhr.abort(); });
    },
    reset: function reset () {
      this.abort();
      this.files = [];
      this.queue = [];
      this.expanded = false;
      this.__computeTotalSize();
      this.$emit('reset');
    }
  }
};

var QVideo = {
  name: 'q-video',
  functional: true,
  props: {
    src: {
      type: String,
      required: true
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      iframeData = {
        attrs: {
          src: prop.src,
          frameborder: '0',
          allowfullscreen: true
        }
      };

    data.staticClass = "q-video" + (cls ? (" " + cls) : '');

    return h('div', data, [ h('iframe', iframeData) ])
  }
};

function updateBinding (el, ref) {
  var value = ref.value;
  var modifiers = ref.modifiers;

  var ctx = el.__qbacktotop;

  if (!value) {
    ctx.update();
    return
  }

  if (typeof value === 'number') {
    ctx.offset = value;
    ctx.update();
    return
  }

  if (value && Object(value) !== value) {
    console.error('v-back-to-top requires an object {offset, duration} as parameter', el);
    return
  }

  if (value.offset) {
    if (typeof value.offset !== 'number') {
      console.error('v-back-to-top requires a number as offset', el);
      return
    }
    ctx.offset = value.offset;
  }
  if (value.duration) {
    if (typeof value.duration !== 'number') {
      console.error('v-back-to-top requires a number as duration', el);
      return
    }
    ctx.duration = value.duration;
  }

  ctx.update();
}

var backToTop = {
  name: 'back-to-top',
  bind: function bind (el) {
    var ctx = {
      offset: 200,
      duration: 300,
      update: debounce(function () {
        var trigger = getScrollPosition(ctx.scrollTarget) > ctx.offset;
        if (ctx.visible !== trigger) {
          ctx.visible = trigger;
          el.classList[trigger ? 'remove' : 'add']('hidden');
        }
      }, 25),
      goToTop: function goToTop () {
        setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0);
      }
    };
    el.classList.add('hidden');
    el.__qbacktotop = ctx;
  },
  inserted: function inserted (el, binding) {
    var ctx = el.__qbacktotop;
    ctx.scrollTarget = getScrollTarget(el);
    ctx.animate = binding.modifiers.animate;
    updateBinding(el, binding);
    ctx.scrollTarget.addEventListener('scroll', ctx.update);
    window.addEventListener('resize', ctx.update);
    el.addEventListener('click', ctx.goToTop);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding);
    }
  },
  unbind: function unbind (el) {
    var ctx = el.__qbacktotop;
    ctx.scrollTarget.removeEventListener('scroll', ctx.update);
    window.removeEventListener('resize', ctx.update);
    el.removeEventListener('click', ctx.goToTop);
    delete el.__qbacktotop;
  }
};

var goBack = {
  name: 'go-back',
  bind: function bind (el, ref, vnode) {
    var value = ref.value;
    var modifiers = ref.modifiers;

    var ctx = { value: value, position: window.history.length - 1, single: modifiers.single };

    if (Platform.is.cordova) {
      ctx.goBack = function () {
        vnode.context.$router.go(ctx.single ? -1 : ctx.position - window.history.length);
      };
    }
    else {
      ctx.goBack = function () {
        vnode.context.$router.replace(ctx.value);
      };
    }

    el.__qgoback = ctx;
    el.addEventListener('click', ctx.goBack);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qgoback.value = binding.value;
    }
  },
  unbind: function unbind (el) {
    el.removeEventListener('click', el.__qgoback.goBack);
    delete el.__qgoback;
  }
};

function updateBinding$1 (el, selector) {
  var
    ctx = el.__qmove,
    parent = el.parentNode;

  if (!ctx.target) {
    ctx.target = document.querySelector(selector);
  }
  if (ctx.target) {
    if (parent !== ctx.target) {
      ctx.target.appendChild(el);
    }
  }
  else if (parent) {
    parent.removeChild(el);
  }
}

var move = {
  name: 'move',
  bind: function bind (el, ref) {
    var value = ref.value;

    el.__qmove = {};
  },
  update: function update (el, ref) {
    var oldValue = ref.oldValue;
    var value = ref.value;

    if (oldValue !== value) {
      el.__qmove.target = document.querySelector(value);
      updateBinding$1(el, value);
    }
  },
  inserted: function inserted (el, ref) {
    var value = ref.value;

    updateBinding$1(el, value);
  },
  unbind: function unbind (el) {
    var parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
    delete el.__qmove;
  }
};

function updateBinding$2 (el, binding) {
  var ctx = el.__qscrollfire;

  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll-fire requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
    ctx.scroll();
  }
}

var scrollFire = {
  name: 'scroll-fire',
  bind: function bind (el, binding) {
    var ctx = {
      scroll: debounce(function () {
        var containerBottom, elementBottom, fire;

        if (ctx.scrollTarget === window) {
          elementBottom = el.getBoundingClientRect().bottom;
          fire = elementBottom < viewport().height;
        }
        else {
          containerBottom = offset(ctx.scrollTarget).top + height(ctx.scrollTarget);
          elementBottom = offset(el).top + height(el);
          fire = elementBottom < containerBottom;
        }

        if (fire) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
          ctx.handler(el);
        }
      }, 25)
    };

    el.__qscrollfire = ctx;
  },
  inserted: function inserted (el, binding) {
    var ctx = el.__qscrollfire;
    ctx.scrollTarget = getScrollTarget(el);
    updateBinding$2(el, binding);
  },
  update: function update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding$2(el, binding);
    }
  },
  unbind: function unbind (el) {
    var ctx = el.__qscrollfire;
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    delete el.__qscrollfire;
  }
};

function updateBinding$3 (el, binding) {
  var ctx = el.__qscroll;

  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
  }
}

var scroll$1 = {
  name: 'scroll',
  bind: function bind (el, binding) {
    var ctx = {
      scroll: function scroll () {
        ctx.handler(getScrollPosition(ctx.scrollTarget));
      }
    };
    el.__qscroll = ctx;
  },
  inserted: function inserted (el, binding) {
    var ctx = el.__qscroll;
    ctx.scrollTarget = getScrollTarget(el);
    updateBinding$3(el, binding);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding$3(el, binding);
    }
  },
  unbind: function unbind (el) {
    var ctx = el.__qscroll;
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    delete el.__qscroll;
  }
};

function updateBinding$4 (el, binding) {
  var ctx = el.__qtouchhold;

  ctx.duration = parseInt(binding.arg, 10) || 800;

  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value;
  }
}

var touchHold = {
  name: 'touch-hold',
  bind: function bind (el, binding) {
    var mouse = !binding.modifiers.nomouse;

    var ctx = {
      start: function start (evt) {
        var startTime = new Date().getTime();
        ctx.timer = setTimeout(function () {
          if (mouse) {
            document.removeEventListener('mousemove', ctx.mouseAbort);
            document.removeEventListener('mouseup', ctx.mouseAbort);
          }

          ctx.handler({
            evt: evt,
            position: position(evt),
            duration: new Date().getTime() - startTime
          });
        }, ctx.duration);
      },
      mouseStart: function mouseStart (evt) {
        if (mouse) {
          document.addEventListener('mousemove', ctx.mouseAbort);
          document.addEventListener('mouseup', ctx.mouseAbort);
        }
        ctx.start(evt);
      },
      abort: function abort (evt) {
        clearTimeout(ctx.timer);
        ctx.timer = null;
      },
      mouseAbort: function mouseAbort (evt) {
        if (mouse) {
          document.removeEventListener('mousemove', ctx.mouseAbort);
          document.removeEventListener('mouseup', ctx.mouseAbort);
        }
        ctx.abort(evt);
      }
    };

    el.__qtouchhold = ctx;
    updateBinding$4(el, binding);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchend', ctx.abort);
    if (mouse) {
      el.addEventListener('touchmove', ctx.abort);
      el.addEventListener('mousedown', ctx.mouseStart);
    }
  },
  update: function update (el, binding) {
    updateBinding$4(el, binding);
  },
  unbind: function unbind (el, binding) {
    var ctx = el.__qtouchhold;
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('touchend', ctx.abort);
    el.removeEventListener('touchmove', ctx.abort);
    el.removeEventListener('mousedown', ctx.mouseStart);
    document.removeEventListener('mousemove', ctx.mouseAbort);
    document.removeEventListener('mouseup', ctx.mouseAbort);
    delete el.__qtouchhold;
  }
};

var modalFn = function (Component, Vue) {
  return function (props) {
    var node = document.createElement('div');
    document.body.appendChild(node);

    return new Promise(function (resolve, reject) {
      var vm = new Vue({
        el: node,
        data: function data () {
          return { props: props }
        },
        render: function (h) { return h(Component, {
          props: props,
          ref: 'modal',
          on: {
            ok: function (data) {
              resolve(data);
              vm.$destroy();
            },
            cancel: function () {
              reject(new Error());
              vm.$destroy();
            }
          }
        }); },
        mounted: function mounted () {
          this.$refs.modal.show();
        }
      });
    })
  }
};

var actionSheet = {
  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;
    var Vue = ref.Vue;

    if (this.__installed) { return }
    this.__installed = true;

    $q.actionSheet = modalFn(QActionSheet, Vue);
  }
};

/*
 * Credits go to sindresorhus
 */

function rgbToHex (red, green, blue) {
  if (typeof red === 'string') {
    var res = red.match(/\b\d{1,3}\b/g).map(Number);
    red = res[0];
    green = res[1];
    blue = res[2];
  }

  if (
    typeof red !== 'number' ||
    typeof green !== 'number' ||
    typeof blue !== 'number' ||
    red > 255 ||
    green > 255 ||
    blue > 255
  ) {
    throw new TypeError('Expected three numbers below 256')
  }

  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  var num = parseInt(hex, 16);

  return [num >> 16, num >> 8 & 255, num & 255]
}


var colors = Object.freeze({
	rgbToHex: rgbToHex,
	hexToRgb: hexToRgb
});

function getPrimaryHex () {
  var tempDiv = document.createElement('div');
  tempDiv.style.height = '10px';
  tempDiv.style.position = 'absolute';
  tempDiv.style.top = '-100000px';
  tempDiv.className = 'bg-primary';
  document.body.appendChild(tempDiv);
  var primaryColor = window.getComputedStyle(tempDiv).getPropertyValue('background-color');
  document.body.removeChild(tempDiv);

  var rgb = primaryColor.match(/\d+/g);
  return ("#" + (rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))))
}

function setColor (hexColor) {
  // http://stackoverflow.com/a/33193739
  var metaTag = document.createElement('meta');

  if (Platform.is.winphone) {
    metaTag.setAttribute('name', 'msapplication-navbutton-color');
  }
  else if (Platform.is.safari) {
    metaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
  }
  // Chrome, Firefox OS, Opera, Vivaldi
  else {
    metaTag.setAttribute('name', 'theme-color');
  }

  metaTag.setAttribute('content', hexColor);
  document.getElementsByTagName('head')[0].appendChild(metaTag);
}

var addressbarColor = {
  set: function set (hexColor) {
    if (!Platform.is.mobile || Platform.is.cordova) {
      return
    }
    if (!Platform.is.winphone && !Platform.is.safari && !Platform.is.webkit && !Platform.is.vivaldi) {
      return
    }

    ready(function () {
      setColor(hexColor || getPrimaryHex());
    });
  }
};

var appFullscreen = {
  isCapable: null,
  isActive: null,
  __prefixes: {},

  request: function request (target) {
    if ( target === void 0 ) target = document.documentElement;

    if (this.isCapable && !this.isActive) {
      target[this.__prefixes.request]();
    }
  },
  exit: function exit () {
    if (this.isCapable && this.isActive) {
      document[this.__prefixes.exit]();
    }
  },
  toggle: function toggle (target) {
    if (this.isActive) {
      this.exit();
    }
    else {
      this.request(target);
    }
  },

  __installed: false,
  install: function install (ref) {
    var this$1 = this;
    var $q = ref.$q;
    var Vue = ref.Vue;

    if (this.__installed) { return }
    this.__installed = true;

    var request = [
      'requestFullscreen',
      'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'
    ].find(function (request) { return document.documentElement[request]; });

    this.isCapable = request !== undefined;
    if (!this.isCapable) {
      // it means the browser does NOT support it
      return
    }

    var exit = [
      'exitFullscreen',
      'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'
    ].find(function (exit) { return document[exit]; });

    this.__prefixes = {
      request: request,
      exit: exit
    };

    this.isActive = (document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement) !== undefined

    ;[
      'onfullscreenchange',
      'MSFullscreenChange', 'onmozfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(function (evt) {
      document[evt] = function () {
        this$1.isActive = !this$1.isActive;
      };
    });

    Vue.util.defineReactive({}, 'isActive', this);
    $q.fullscreen = this;
  }
};

var appVisibility = {
  isVisible: null,

  __installed: false,
  install: function install (ref) {
    var this$1 = this;
    var $q = ref.$q;
    var Vue = ref.Vue;

    if (this.__installed) { return }
    this.__installed = true;

    var prop, evt;

    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      prop = 'hidden';
      evt = 'visibilitychange';
    }
    else if (typeof document.msHidden !== 'undefined') {
      prop = 'msHidden';
      evt = 'msvisibilitychange';
    }
    else if (typeof document.webkitHidden !== 'undefined') {
      prop = 'webkitHidden';
      evt = 'webkitvisibilitychange';
    }

    var update = function () {
      this$1.isVisible = $q.appVisible = !document[prop];
    };

    update();

    if (evt && typeof document[prop] !== 'undefined') {
      Vue.util.defineReactive({}, 'appVisible', $q);
      document.addEventListener(evt, update, false);
    }
  }
};

function encode (string) {
  return encodeURIComponent(string)
}

function decode (string) {
  return decodeURIComponent(string)
}

function stringifyCookieValue (value) {
  return encode(value === Object(value) ? JSON.stringify(value) : '' + value)
}

function read (string) {
  if (string === '') {
    return string
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  string = decode(string.replace(/\+/g, ' '));

  try {
    string = JSON.parse(string);
  }
  catch (e) {}

  return string
}

function set (key, val, opts) {
  if ( opts === void 0 ) opts = {};

  var time = opts.expires;

  if (typeof opts.expires === 'number') {
    time = new Date();
    time.setMilliseconds(time.getMilliseconds() + opts.expires * 864e+5);
  }

  document.cookie = [
    encode(key), '=', stringifyCookieValue(val),
    time ? '; expires=' + time.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; path=' + opts.path : '',
    opts.domain ? '; domain=' + opts.domain : '',
    opts.secure ? '; secure' : ''
  ].join('');
}

function get (key) {
  var
    result = key ? undefined : {},
    cookies = document.cookie ? document.cookie.split('; ') : [],
    i = 0,
    l = cookies.length,
    parts,
    name,
    cookie;

  for (; i < l; i++) {
    parts = cookies[i].split('=');
    name = decode(parts.shift());
    cookie = parts.join('=');

    if (!key) {
      result[name] = cookie;
    }
    else if (key === name) {
      result = read(cookie);
      break
    }
  }

  return result
}

function remove (key, options) {
  set(key, '', extend(true, {}, options, {
    expires: -1
  }));
}

function has (key) {
  return get(key) !== undefined
}

var cookies = {
  get: get,
  set: set,
  has: has,
  remove: remove,
  all: function () { return get(); },

  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;

    if (this.__installed) { return }
    this.__installed = true;

    $q.cookies = this;
  }
};

var dialog = {
  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;
    var Vue = ref.Vue;

    if (this.__installed) { return }
    this.__installed = true;

    $q.dialog = modalFn(QDialog, Vue);
  }
};

var vm;
var timeout;
var props = {};

var staticClass = 'q-loading animate-fade fullscreen column flex-center z-max';

var Loading = {
  isActive: false,

  show: function show (ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var delay = ref.delay; if ( delay === void 0 ) delay = 500;
    var message = ref.message; if ( message === void 0 ) message = false;
    var spinnerSize = ref.spinnerSize; if ( spinnerSize === void 0 ) spinnerSize = 80;
    var spinnerColor = ref.spinnerColor; if ( spinnerColor === void 0 ) spinnerColor = 'white';
    var messageColor = ref.messageColor; if ( messageColor === void 0 ) messageColor = 'white';
    var spinner = ref.spinner; if ( spinner === void 0 ) spinner = QSpinner;
    var customClass = ref.customClass; if ( customClass === void 0 ) customClass = false;

    props.spinner = spinner;
    props.message = message;
    props.spinnerSize = spinnerSize;
    props.spinnerColor = spinnerColor;
    props.messageColor = messageColor;

    if (customClass && typeof customClass === 'string') {
      props.customClass = " " + (customClass.trim());
    }

    if (this.isActive) {
      vm && vm.$forceUpdate();
      return
    }

    timeout = setTimeout(function () {
      timeout = null;

      var node = document.createElement('div');
      document.body.appendChild(node);
      document.body.classList.add('with-loading');

      vm = new this$1.__Vue({
        name: 'q-loading',
        el: node,
        functional: true,
        render: function render (h) {
          var child = [
            h(props.spinner, {
              props: {
                color: props.spinnerColor,
                size: props.spinnerSize
              }
            })
          ];

          if (message) {
            child.push(h('div', {
              staticClass: ("text-" + (props.messageColor)),
              domProps: {
                innerHTML: props.message
              }
            }));
          }

          return h('div', {staticClass: staticClass + props.customClass}, child)
        }
      });
    }, delay);

    this.isActive = true;
  },
  hide: function hide () {
    if (!this.isActive) {
      return
    }

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    else {
      vm.$destroy();
      document.body.classList.remove('with-loading');
      document.body.removeChild(vm.$el);
      vm = null;
    }

    this.isActive = false;
  },

  __Vue: null,
  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;
    var Vue = ref.Vue;

    if (this.__installed) { return }
    this.__installed = true;

    $q.loading = Loading;
    this.__Vue = Vue;
  }
};

var positionList = [
  'top-left', 'top-right',
  'bottom-left', 'bottom-right',
  'top', 'bottom', 'left', 'right', 'center'
];

var notify = {
  create: function create (opts) {
    return this.__vm.add(opts)
  },

  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;
    var Vue = ref.Vue;

    if (this.__installed) { return }
    this.__installed = true;

    var node = document.createElement('div');
    document.body.appendChild(node);

    this.__vm = new Vue({
      name: 'q-notifications',
      data: {
        notifs: {
          center: [],
          left: [],
          right: [],
          top: [],
          'top-left': [],
          'top-right': [],
          bottom: [],
          'bottom-left': [],
          'bottom-right': []
        }
      },
      methods: {
        add: function add (notif) {
          var this$1 = this;

          if (!notif) {
            console.error('Notify: parameter required');
            return false
          }
          if (typeof notif === 'string') {
            notif = {
              message: notif,
              timeout: 5000,
              position: 'bottom'
            };
          }
          else if (notif.position) {
            if (!positionList.includes(notif.position)) {
              console.error(("Notify: wrong position: " + (notif.position)));
              return false
            }
          }
          else {
            notif.position = 'bottom';
          }

          notif.__uid = uid();

          var action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push';
          this.notifs[notif.position][action](notif);

          var close = function () {
            this$1.remove(notif);
          };

          if (notif.timeout) {
            notif.__timeout = setTimeout(function () {
              close();
            }, notif.timeout + /* show duration */ 1000);
          }

          return close
        },
        remove: function remove (notif) {
          if (notif.__timeout) { clearTimeout(notif.__timeout); }

          var index = this.notifs[notif.position].indexOf(notif);
          if (index !== -1) {
            this.notifs[notif.position].splice(index, 1);
          }
        }
      },
      render: function render (h) {
        var this$1 = this;

        return h('div', { staticClass: 'q-notifications' }, positionList.map(function (pos) {
          var
            vert = ['left', 'center', 'right'].includes(pos) ? 'center' : (pos.indexOf('top') > -1 ? 'top' : 'bottom'),
            align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center'),
            classes = ['left', 'right'].includes(pos) ? ("items-" + (pos === 'left' ? 'start' : 'end') + " justify-center") : (pos === 'center' ? 'flex-center' : ("items-" + align));

          return h(QTransition, {
            key: pos,
            staticClass: ("q-notification-list q-notification-list-" + vert + " fixed column " + classes),
            tag: 'div',
            props: {
              group: true,
              name: ("q-notification-" + pos),
              mode: 'out-in'
            }
          }, this$1.notifs[pos].map(function (notif) {
            return h(QAlert, {
              key: notif.__uid,
              staticClass: 'q-notification',
              props: notif
            }, [ notif.message ])
          }))
        }))
      }
    });

    this.__vm.$mount(node);
    $q.notify = this.create.bind(this);
  }
};

function encode$1 (value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return '__q_date|' + value.toUTCString()
  }
  if (Object.prototype.toString.call(value) === '[object RegExp]') {
    return '__q_expr|' + value.source
  }
  if (typeof value === 'number') {
    return '__q_numb|' + value
  }
  if (typeof value === 'boolean') {
    return '__q_bool|' + (value ? '1' : '0')
  }
  if (typeof value === 'string') {
    return '__q_strn|' + value
  }
  if (typeof value === 'function') {
    return '__q_strn|' + value.toString()
  }
  if (value === Object(value)) {
    return '__q_objt|' + JSON.stringify(value)
  }

  // hmm, we don't know what to do with it,
  // so just return it as is
  return value
}

function decode$1 (value) {
  var type, length, source;

  length = value.length;
  if (length < 9) {
    // then it wasn't encoded by us
    return value
  }

  type = value.substr(0, 8);
  source = value.substring(9);

  switch (type) {
    case '__q_date':
      return new Date(source)

    case '__q_expr':
      return new RegExp(source)

    case '__q_numb':
      return Number(source)

    case '__q_bool':
      return Boolean(source === '1')

    case '__q_strn':
      return '' + source

    case '__q_objt':
      return JSON.parse(source)

    default:
      // hmm, we reached here, we don't know the type,
      // then it means it wasn't encoded by us, so just
      // return whatever value it is
      return value
  }
}

function generateFunctions (fn) {
  return {
    local: fn('local'),
    session: fn('session')
  }
}

var hasStorageItem = generateFunctions(
    function (type) { return function (key) { return window[type + 'Storage'].getItem(key) !== null; }; }
  );
var getStorageLength = generateFunctions(
    function (type) { return function () { return window[type + 'Storage'].length; }; }
  );
var getStorageItem = generateFunctions(function (type) {
    var
      hasFn = hasStorageItem[type],
      storage = window[type + 'Storage'];

    return function (key) {
      if (hasFn(key)) {
        return decode$1(storage.getItem(key))
      }
      return null
    }
  });
var getStorageAtIndex = generateFunctions(function (type) {
    var
      lengthFn = getStorageLength[type],
      getItemFn = getStorageItem[type],
      storage = window[type + 'Storage'];

    return function (index) {
      if (index < lengthFn()) {
        return getItemFn(storage.key(index))
      }
    }
  });
var getAllStorageItems = generateFunctions(function (type) {
    var
      lengthFn = getStorageLength[type],
      storage = window[type + 'Storage'],
      getItemFn = getStorageItem[type];

    return function () {
      var
        result = {},
        key,
        length = lengthFn();

      for (var i = 0; i < length; i++) {
        key = storage.key(i);
        result[key] = getItemFn(key);
      }

      return result
    }
  });
var setStorageItem = generateFunctions(function (type) {
    var storage = window[type + 'Storage'];
    return function (key, value) { storage.setItem(key, encode$1(value)); }
  });
var removeStorageItem = generateFunctions(function (type) {
    var storage = window[type + 'Storage'];
    return function (key) { storage.removeItem(key); }
  });
var clearStorage = generateFunctions(function (type) {
    var storage = window[type + 'Storage'];
    return function () { storage.clear(); }
  });
var storageIsEmpty = generateFunctions(function (type) {
    var getLengthFn = getStorageLength[type];
    return function () { return getLengthFn() === 0; }
  });

var LocalStorage = {
  has: hasStorageItem.local,
  get: {
    length: getStorageLength.local,
    item: getStorageItem.local,
    index: getStorageAtIndex.local,
    all: getAllStorageItems.local
  },
  set: setStorageItem.local,
  remove: removeStorageItem.local,
  clear: clearStorage.local,
  isEmpty: storageIsEmpty.local,

  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;

    if (this.__installed) { return }
    this.__installed = true;

    $q.localStorage = LocalStorage;
  }
};

var SessionStorage = {
  has: hasStorageItem.session,
  get: {
    length: getStorageLength.session,
    item: getStorageItem.session,
    index: getStorageAtIndex.session,
    all: getAllStorageItems.session
  },
  set: setStorageItem.session,
  remove: removeStorageItem.session,
  clear: clearStorage.session,
  isEmpty: storageIsEmpty.session,

  __installed: false,
  install: function install (ref) {
    var $q = ref.$q;

    if (this.__installed) { return }
    this.__installed = true;

    $q.sessionStorage = SessionStorage;
  }
};

var openUrl = function (url, reject) {
  if (Platform.is.cordova && navigator && navigator.app) {
    return navigator.app.loadUrl(url, {
      openExternal: true
    })
  }

  var win = window.open(url, '_blank');

  if (win) {
    win.focus();
    return win
  }
  else {
    reject();
  }
};

var throttle = function (fn, limit) {
  if ( limit === void 0 ) limit = 250;

  var wait = false;

  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (wait) {
      return
    }

    wait = true;
    fn.apply(this, args);
    setTimeout(function () {
      wait = false;
    }, limit);
  }
};

function noop () {}

var index_esm = {
  version: version,
  install: install,
  i18n: i18n,
  theme: "mat"
};

export { QApp, QActionSheet, QAjaxBar, QAlert, QAutocomplete, QBtn, QBtnGroup, QBtnToggle, QBtnDropdown, QBtnToggleGroup, QCard, QCardTitle, QCardMain, QCardActions, QCardMedia, QCardSeparator, QCarousel, QCarouselSlide, QCarouselControl, QChatMessage, QCheckbox, QChip, QChipsInput, QCollapsible, QContextMenu, QDatetime, QDatetimeRange, QInlineDatetime, QDialog, QEditor, QFab, QFabAction, QField, QFieldReset, QIcon, QInfiniteScroll, QInnerLoading, QInput, QInputFrame, QKnob, QLayout, QLayoutDrawer, QLayoutFooter, QLayoutHeader, QPage, QPageContainer, QPageSticky, QItem, QItemSeparator, QItemMain, QItemSide, QItemTile, QItemWrapper, QList, QListHeader, QModal, QModalLayout, QResizeObservable, QScrollObservable, QWindowResizeObservable, QOptionGroup, QPagination, QParallax, QPopover, QProgress, QPullToRefresh, QRadio, QRange, QRating, QScrollArea, QSearch, QSelect, QDialogSelect, QSlideTransition, QSlider, QSpinner, audio as QSpinnerAudio, ball as QSpinnerBall, bars as QSpinnerBars, circles as QSpinnerCircles, comment as QSpinnerComment, cube as QSpinnerCube, dots as QSpinnerDots, facebook as QSpinnerFacebook, gears as QSpinnerGears, grid as QSpinnerGrid, hearts as QSpinnerHearts, hourglass as QSpinnerHourglass, infinity as QSpinnerInfinity, QSpinner_ios as QSpinnerIos, DefaultSpinner as QSpinnerMat, oval as QSpinnerOval, pie as QSpinnerPie, puff as QSpinnerPuff, radio as QSpinnerRadio, rings as QSpinnerRings, tail as QSpinnerTail, QStep, QStepper, QStepperNavigation, QRouteTab, QTab, QTabPane, QTabs, QTable, QTh, QTr, QTd, QTableColumns, QTimeline, QTimelineEntry, QToggle, QToolbar, QToolbarTitle, QTooltip, QTransition, QTree, QUploader, QVideo, backToTop as BackToTop, goBack as GoBack, move as Move, Ripple, scrollFire as ScrollFire, scroll$1 as Scroll, touchHold as TouchHold, TouchPan, TouchSwipe, actionSheet as ActionSheet, addressbarColor as AddressbarColor, appFullscreen as AppFullscreen, appVisibility as AppVisibility, cookies as Cookies, dialog as Dialog, Loading, notify as Notify, Platform, LocalStorage, SessionStorage, animate, clone, colors, date, debounce, frameDebounce, dom, easing, event, extend, filter, format, noop, openUrl as openURL, scroll, throttle, uid };
export default index_esm;
