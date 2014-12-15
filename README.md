BillForward Node.js client library
===================

This client library provides (via Node) easy access to the BillForward API.

Install
-------------------------
This is a private repostory, not yet published to NPM. You will need to authenticate to install this package..

Add your SSH public key to your GitHub profile.

Install to your node application like so:

```
npm install git+ssh://git@github.com:billforward/bf-node.git --save
```

Include
-------------------------
Include like this:

```js
var BillForward = require('BillForward');
```

Invoke
-------------------------
Once BillForward is included, you can fetch an account like so:

```js
var config = {
  "urlRoot":     "https://api-sandbox.billforward.net:443/v1/",
  "accessToken": "INSERT_ACCESS_TOKEN_HERE"
};

BillForward.Client.makeDefault(config.accessToken, config.urlRoot);

BillForward.Account.getAll()        // get accounts
.then(function(accounts) {
  console.log(accounts[0].profile.toString());  // print profile of an account
})
.catch(function(err) {
  console.log(err);
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

Test settings (including BillForward credentials) are loaded from the file `config.json` in `test/config`.

You will have to make this file yourself; you can base it on the template `config.example.json`.

Run all tests:

```
npm test
```

Run one test file:

```
mocha -u bdd $file
```

#####Sublime build!
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