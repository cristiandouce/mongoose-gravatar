/**
 * Module dependencies.
 */

var crypto = require('crypto');
var url = require('url');
var keys = Object.keys;

/**
 * Mongoose plugin exposure
 *
 * @param {MongooseSchema} schema
 * @param {Object} options
 * @api public
 */

module.exports = function plugin (schema, options) {
  options = options || {
    property: 'email'
  };

  schema.methods.gravatar = function (settings) {
    settings = settings || {};
    merge(settings, options);
    return gravatar.call(this, settings);
  };
};

/**
 * Creates a gravatar url
 * from `settings` provided
 *
 * @param {Object|undefined} settings
 * @return {String} gravatar's API image `url`
 * @api private
 */

function gravatar (settings) {
  var email = settings.email || this[(settings.property || 'email')] || "example@example.com";
  var host = (settings.secure ? "secure" : "www") + ".gravatar.com";
  var protocol = settings.secure ? "https" : "http";
  var pathname = "/avatar/" + md5(email);
  var params = clear({
    s: settings.size,
    d: settings.default,
    f: settings.forcedefault,
    r: settings.rating
  });

  return url.format({
    protocol: protocol,
    host: host,
    pathname: pathname,
    query: params
  });
}

/**
 * Creates an MD5 enctryption hash
 * with provided `word` parameter
 *
 * @param {String} word
 * @return {String} hashed `word`
 * @api private
 */

function md5 (word) {
  return crypto.createHash('md5').update(word).digest("hex");
}

/**
 * Clears undefined or invalid vars from
 * a queryString params object
 *
 * @param {Object} obj
 * @return {Object} reduced object
 * @api private
 */

function clear (obj) {
  var output = {};

  keys(obj).forEach(function (key) {
    if (obj[key] != null) {
      output[key] = obj[key];
    }
  });

  return output;
}

/**
 * Merge missing keys in `settings` object
 * from the ones coming from `options` object
 * as default values for `gravatar` function.
 *
 * @param {Object} settings
 * @param {Object} options
 * @return {Objsect} completed `settings` object
 * @api private
 */

function merge (settings, options) {
  var defaults = keys(options);
  var length = defaults.length;
  var i = 0;

  for (; i < length; i++) {
    var key = defaults[i];

    if (settings[key] == null && options[key] != null) {
      settings[key] = options[key];
    }
  }

  return settings;
}
