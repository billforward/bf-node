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
npm install --no-dev BillForward
```


Include
-------------------------
So far the library is still being architected.

#####Now

Having installed `index.js` to your source tree, include like so:

```js
var BillForward = require('path/to/index.js');
```

######TypeScript

If you're using TypeScript, you can benefit from our declarations:

```js
///<reference path='../path/to/index.d.ts' />
///<reference path="../typings/node/node.d.ts" />

import BillForward = require('BillForward');
```

You should provide a `node.d.ts` of your own version of Node. You can generate this using the node package `tsd`.

#####Future
In future, once the package is available, you would install and then include like this:

```js
var BillForward = require('BillForward');
```


Invoke
-------------------------
There's nothing to see here yet.

Develop
-------------------------
Git clone this repository.

Install dependencies:
```
npm install
```

Launch a Grunt server to watch your changes to TypeScript:

```
grunt watch
```

Edit any .ts file in `lib`, then save it.

Grunt will see the change and regenerate `bin/index.js`.

Test
-------------------------
We use Mocha as our testrunner, and Sinon as our test framework.

Sinon lets you control time, mock, stub, and write in BDD style.

Run all tests:
```
npm test
```