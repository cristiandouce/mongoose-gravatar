# mongoose-gravatar

  Mongoose plugin to dynamically generate gravatar urls.

  [![Build Status](https://travis-ci.org/cristiandouce/mongoose-gravatar.png?branch=master)](https://travis-ci.org/cristiandouce/mongoose-gravatar)

## Installation

```
  $ npm install mongoose-gravatar
```

## Usage example

```js
  var gravatar = require('mongoose-gravatar');
  var UserSchema = new Schema({ email: String });

  // Extend User's Schema with gravatar plugin
  UserSchema.plugin(gravatar);

  // or... provide some default options for plugin
  var options = { secure: true, default: "retro", size: 245 };
  UserSchema.plugin(gravatar, options);

  // ...

  var author = new User({ email: 'jorge@ups.com'});

  // retrieves a normal gravatar url
  author.gravatar()
  // out: 'http://www.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8'

  // retrieves a secure (https) gravatar url
  author.gravatar({ secure: true })
  // out: 'https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8'
  
  // sets size to 150px width and height
  author.gravatar({ size: 150 });
  // out: 'http://www.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?s=150'

  // With provided options at plugin level...
  author.gravatar()
  // out: https://secure.gravatar.com/avatar/23463b99b62a72f26ed677cc556c44e8?d=retro&s=245
```

## API options list
The following are the list of options allowed for `.gravatar()` model method.
* `secure`: Compiles a secure url for gravatars. Check `gravatar.com` [docs](http://en.gravatar.com/site/implement/images/#secure-images) for more info.
* `email`: Returns a gravatar url for a different email than the model's.
* `size`: Determines the size of the image delivered by `gravatar.com`. Check `gravatar.com` [docs](http://en.gravatar.com/site/implement/images/#size) for more info.
* `default`: Sets a default image when email has no avatar registered at `gravatar.com`. Check `gravatar.com` [docs](http://en.gravatar.com/site/implement/images/#default-image) for more info.
* `forcedefault`: Forces default image. Check `gravatar.com` [docs](http://en.gravatar.com/site/implement/images/#force-default) for more info.
* `rating`: Sets self-rated image policy. Check `gravatar.com` [docs](http://en.gravatar.com/site/implement/images/#rating) for more info.


## Test

```
  $ npm install --dev
  $ make test
```
## License

  MIT
