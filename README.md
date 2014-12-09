BillForward Node.js client library
===================

This client library provides (via Node) easy access to the BillForward API.

Install
-------------------------
So far the library is still being architected.

#####Now
Grab the `index.js` from `/bin`. Put it somewhere in your source tree.

#####Future
In future we will publish the package so you can install like so:

```
npm install --no-dev BillForward --save
```


Include
-------------------------
So far the library is still being architected.

#####Now

Having installed `index.js` to your source tree, include like so:

```js
var BillForward = require('path/to/index.js');
```

#####Future
In future, once the package is available, you would install and then include like this:

```js
var BillForward = require('BillForward');
```


#####TypeScript

If you're using TypeScript, you can benefit from our declarations:

```js
///<reference path='../path/to/index.d.ts' />
///<reference path="../typings/node/node.d.ts" />

import BillForward = require('BillForward');
```

You should provide a `node.d.ts` of your own version of Node. You can generate this using the node package `tsd`.


Invoke
-------------------------
At the time of writing, there's not much to see. The expected syntax can be divulged though.

Once BillForward is included, you can fetch an account like so:

```js
BillForward.Account.getByID("EEEE0FD7-2075-11E3-A2A1-FA163E414B4F")
.then(function(account) {
	console.log(account); // the account
});
```

We use promises. Everything is async.

Develop
-------------------------
Git clone this repository.

Install dependencies:
```
npm install
```

#####Build TypeScript
You shouldn't need to do this, because we check in a built version.

Nevertheless.. the curious can rebuild all TypeScript using Grunt:

```
grunt ts
```

Useful if you feel like deleting `bin/`.

#####Watch TypeScript
Launch a Grunt server to watch your changes to TypeScript:

```
grunt watch
```

Edit any .ts file in `lib`, then save it.

Grunt will see the change and regenerate `bin/index.js`.

Test
-------------------------
We use Sinon for mocking, Chai for assertions, and Mocha as our testrunner.

Test settings (including BillForward credentials) are loaded from the file `test/config/config.json`.

You will have to make this file yourself; you can base it on the template `test/config/config.example.json`.

Run all tests:

```
npm test
```

Run one test file:

```
mocha -u bdd $file
```

I run test files using a custom Sublime build script:

```js
  {
      "cmd": ["mocha", "--no-colors", "-u", "bdd", "$file"],
      "file_regex": "(.*\\.js?)\\s\\(([0-9]+)\\,([0-9]+)\\)\\:\\s(...*?)$",
      "selector": "source.js",
      "osx": {
         "path": "/usr/local/bin:/opt/local/bin"
      },
      "windows": {
          "cmd": ["mocha.cmd", "-u", "bdd", "$file"]
      }
  }
```