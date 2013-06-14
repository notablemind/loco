
var LocaleManager = function (name, options) {
  this.name = name;
  options = options || {};
  options.log = options.log || console.error.bind(console);
  this.options = options;
  this.currentLocale = this.baseLocale = options.baseLocale || 'en';
  this.locales = {};
  this.locales[this.baseLocale] = {};
  this.missing = {};
};

LocaleManager.prototype = {
  setLocale: function (locale) {
    this.currentLocale = locale;
  },
  setBaseLocale: function (locale) {
    this.baseLocale = locale;
  },
  add: function (locale, items, options) {
    if (!this.locales[locale]) {
      this.locales[locale] = {};
    }
    options = options || {};
    var base = this.locales[locale];
    if (options.rel) {
      for (var i=0; base && i<options.rel.length; i++) {
        if (!base[options.rel[i]]) {
          base[options.rel[i]] = {};
        }
        base = base[options.rel[i]];
      }
    }
    extendDefault(base, items, !options.default);
  },
  addDefault: function (items, options) {
    options = options || {};
    options.default = true;
    this.add(this.baseLocale, items, options);
  },
  getLoc: function (locale, key, rel, silent) {
    var base = this.locales[locale]
      , parts = (rel || []).concat(key.split('.'));
    while (base && parts.length) {
      base = base[parts.shift()];
    }
    if (!base) {
      if (!silent) {
        var msg = 'Localize string not found: ' + key
        if (this.options.failHard) {
          throw new Error(msg);
        }
        this.options.log(msg);
        this.addMissing(locale, key, rel);
        if (locale !== this.baseLocale) {
          return this.getLoc(this.baseLocale, key, rel, true);
        }
      }
      return '';
    }
    return base;
  },
  // key: str, rel: list of rel path
  get: function (key, rel) {
    return this.getLoc(this.currentLocale, key, rel);
  },
  addMissing: function (locale, key, rel) {
    if (!this.missing[locale]) {
      this.missing[locale] = {};
    }
    var base = this.missing[locale]
      , parts = (rel || []).concat(key.split('.'));
    while (parts.length - 1 > 0) {
      if (!base[parts[0]]) {
        base[parts[0]] = {};
      }
      base = base[parts.shift()];
    }
    base[parts.shift()] = true;
  },
  rel: function (name) {
    var parts = name.split('.')
      , that = this;
    return {
      get: function (key) {
        return that.get(key, parts);
      },
      add: function (locale, items) {
        return that.add(locale, items, {rel: parts});
      },
      addDefault: function (items) {
        return that.add(that.baseLocale, items, {rel: parts, default: true});
      },
      rel: function (sub) {
        return that.rel(sub + '.' + name);
      }
    };
  }
};

// Extend object with items from news, recursively looking into objects
// override: bool
var extendDefault = function(obj, news, override) {
  Object.keys(news).forEach(function(key) {
    if (!obj.hasOwnProperty(key)) {
      obj[key] = news[key];
    } else if (typeof(news[key]) === 'object' && typeof(obj[key]) === 'object') {
      extendDefault(obj[key], news[key], override);
    } else if (override) {
      obj[key] = news[key];
    }
  });
};

var single = new LocaleManager('default')
  , registry = {
      default: single
    };

var getLocales = function (name) {
  if (!name) return single;
  if (!registry[name]) {
    registry[name] = new LocaleManager(name);
  }
  return registry[name];
};

module.exports = function (rel) {
  return single.rel(rel);
};

module.exports.getLocales = getLocales;
module.exports.LocaleManager = LocaleManager;

Object.keys(LocaleManager.prototype).forEach(function(key) {
  module.exports[key] = single[key].bind(single);
});

