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
  schema.methods.gravatar = gravatar;
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
    s: settings.size || settings.s,
    d: settings.default || settings.d,
    f: settings.forcedefault || settings.f,
    r: settings.rating || settings.r
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