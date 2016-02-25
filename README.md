BillForward Node.js client library
===================

This client library provides (via Node) easy access to the BillForward API.

Install
-------------------------
###Via npm

Install to your node application like so:

```
npm install billforward --save
```

###Via GitHub

Install to your node application like so:

```
npm install git+ssh://git@github.com:billforward/bf-node.git --save
```

You may need to add your SSH public key to your GitHub profile.

Include
-------------------------
Include like this:

```js
var BillForward = require('billforward');
```

Note that lower-case is used for the package name, but StudlyCaps is preferred for the namespace.

Invoke
-------------------------
Once the `BillForward` library is included, you can invoke it. First you need credentials with which to connect to BillForward.

###Use credentials to connect to BillForward
####Step 1. Getting BillForward credentials
[Login](https://app-sandbox.billforward.net/login/#/) to (or [Register](https://app-sandbox.billforward.net/register/#/)) your BillForward Sandbox account.

[Grab a Private API token](https://app-sandbox.billforward.net/setup/#/personal/api-keys).

####Step 2. Connect to BillForward using BillForward.Client

You can instantiate the BillForward Client now. It is static, so you only need to do this once:

```js
var config = {
  urlRoot:     "https://api-sandbox.billforward.net:443/v1/",
  accessToken: "INSERT_ACCESS_TOKEN_HERE"
};

BillForward.Client.makeDefault(config);
```

####Step 3. Make API calls

With the BillForward Client configured, you can now make an API call:

```js
BillForward.Account.getAll()        // get accounts
.then(function(accounts) {
  console.log(accounts[0].profile.toString());  // print profile of an account
})
.catch(function(err) {
  console.error(err);
});
```

We use [promises](https://github.com/kriskowal/q). Everything is async.

##Error Handling

All errors we throw are instances of at least `BFError` (which inherits from JavaScript's built-in `Error`).

Errors may be more specific still, and inherit further from `BFError`.

A comprehensive list of errors is available in [`lib/BillForward/Error.ts`](https://github.com/billforward/bf-node/blob/master/lib/BillForward/Error.ts).

You can check for errors like so:

```js
BillForward.Account.getByID("not here mate")
.catch(function(e) {
  if (e instanceof BillForward.BFError)
    console.error("Something went wrong"); // prints
  if (e instanceof BillForward.BFNoResultsError)
    console.error("Also we know it's because there were no results"); // prints
  if (e instanceof BillForward.BFMalformedAPIResponseError)
    console.error("It's not this; why are you checking?"); // doesn't print
  console.error(e.toString(), e.stack);
})
.done(); // 'done' at end of promise chain makes sure unhandled exceptions are thrown too
```

You can also follow stack traces further up the promise chain if you enable `longStack` in your client's config:

```js
var config = {
  urlRoot:     "https://api-sandbox.billforward.net:443/v1/",
  accessToken: "INSERT_ACCESS_TOKEN_HERE",
  longStack:   true
};

BillForward.Client.makeDefault(config);
```

You can also enable more tracing in your config:

```js
var config = {
  urlRoot:     "https://api-sandbox.billforward.net:443/v1/",
  accessToken: "INSERT_ACCESS_TOKEN_HERE",
  requestLogging: true, // print the REST responses we send
  responseLogging: true, // print the REST responses we receive
  errorLogging: true // print errors occurring during REST conversations
};
```

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


## Releases

### `npm`

#### Minor release

Finish your commit, then run:

```bash
npm version patch
npm publish
git push origin master --follow-tags
```

Or run `sh ./npm-release-minor.sh`

#### Major release

Finish your commit, then run:

```bash
npm version major
npm publish
git push origin master --follow-tags
```

Or run `sh ./npm-release-major.sh`