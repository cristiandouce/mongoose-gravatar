var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gravatar = require('../');
var assert = require('assert');
var crypto = require('crypto');

function md5(word) {
  return crypto.createHash('md5').update(word).digest("hex");
}

// Connect mongoose to mongodb
mongoose.connect('mongodb://localhost/mongoose_test_gravatar');

// Define User and Admin schemas to extend with gravatar plugin
var UserSchema = new Schema({ email: String });
var AdminSchema = new Schema({ email: String });

// Extend User and Admin schemas with gravatar plugin
var options = { default: "mm" };
UserSchema.plugin(gravatar);
AdminSchema.plugin(gravatar, options);

// Register User Model on top of UserSchema
var User = mongoose.model('User', UserSchema);
var Admin = mongoose.model('Admin', AdminSchema);

describe('mongoose-gravatar', function () {
  var email = "";
  var user = {};
  var admin = {};
  var url = "";

  before(function (done) {
    // Wait for mongoose to connect
    mongoose.connection.on('open', function () {
      // Also, clear database before tests
      mongoose.connection.db.dropDatabase(function (err) {
        if (err) return done(err);
        done();
      });
    });
  });

  beforeEach(function(done) {
    email = "example@example.com";
    user = new User({ email: email });
    admin = new Admin({ email: email });
    url = "http://www.gravatar.com/avatar/" + md5(email);
    done();
  });

  describe('.gravatar()', function() {  
    it('should build a base gravatar url without params', function(done) {
      assert.equal(url, user.gravatar());
      done();
    });

    it('should update gravatar when changing email', function(done) {
      assert.equal(url, user.gravatar());

      email = "this@sparta.com";

      assert.notEqual(email, user.email);

      user.email = email;

      assert.notEqual(url, user.gravatar());

      url = "http://www.gravatar.com/avatar/" + md5(email);

      assert.equal(url, user.gravatar())
      done();
    });

    it('should build a base gravatar url with plugin\'s options params', function(done) {
      url = url + "?d=mm";
      assert.equal(url, admin.gravatar());
      done();
    });
  })

  describe('.gravatar(params)', function() {
    it('should use secure url', function (done) {
      url = "https://secure.gravatar.com/avatar/" + md5(email);
      assert.equal(url, user.gravatar({ secure: true }));
      done();
    });

    it('should compile a query string when API params provided', function (done) {
      url = url + "?s=70&r=pg";
      assert.equal(url, user.gravatar({ size: 70, rating: "pg" }));
      done();
    });

    it('should generate different url with an email provided', function (done) {
      email = "this@sparta.com";
      url = "http://www.gravatar.com/avatar/" + md5(email);
      assert.notEqual(email, user.email);
      assert.notEqual(url, user.gravatar());
      assert.equal(url, user.gravatar({ email: email }));
      done();
    });

    it('should override plugin\'s options with API params provided', function (done) {
      url = url + "?d=retro";
      assert.equal(url, admin.gravatar({ default: "retro" }));
      done();
    });
  });

  after(function () {
    // Clear database after tests
    mongoose.connection.db.dropDatabase(function (err) {
      if (err) return done(err);
      done();
    });
  });

});

