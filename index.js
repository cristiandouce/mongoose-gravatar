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

module.exports = function plugin(schema, options) {
  options = options || {};
  schema.methods.gravatar = function(settings) {
    settings = settings || {};
    complete(settings, options);
    return gravatar.call(this, settings);
  }
};

/**
 * Creates a gravatar url
 * from `settings` provided
 *
 * @param {Object|undefined} settings
 * @return {String} gravatar's API image `url`
 * @api private
 */

function gravatar(settings) {
  var email = settings.email || this.email || "example@example.com";
  var host = (settings.secure ? "secure" : "www") + ".gravatar.com";
  var protocol = settings.secure ? "https" : "http";
  var pathname = "/avatar/" + md5(email);
  var params = {
    s: settings.size,
    d: settings.default,
    f: settings.forcedefault,
    r: settings.rating
  };  

  return url.format({
    protocol: protocol,
    host: host,
    pathname: pathname,
    query: clear(params)
  });
};

/**
 * Creates an MD5 enctryption hash
 * with provided `word` parameter
 *
 * @param {String} word
 * @return {String} hashed `word`
 * @api private
 */

function md5(word) {
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
  var names = keys(obj);
  names.forEach(function(n) {
    if (null == obj[n]) delete obj[n];
  });
  return obj;
}

/**
 * Completes missing keys in `settings` object
 * from the ones comming from `options` object
 * as default values for `gravatar` function.
 *
 * @param {Object} settings
 * @param {Object} options
 * @return {Objsect} completed `settings` object
 * @api private
 */

function complete (settings, options) {
  var defaults = keys(options);

  for (var i = 0; i < defaults.length; i++) {
    var key = defaults[i];

    if (null == settings[key] && null != options[key]) {
      settings[key] = options[key];
    }
  };

  return settings;
};