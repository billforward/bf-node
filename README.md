BillForward Node.js client library
===================

This client library provides (via Node) easy access to the BillForward API.

Install
-------------------------
So far the library is still being architected.

#####From JavaScript
Grab the `index.js` from `/bin`. Put it somewhere in your source tree.

#####From NPM
In future we will publish the package so you can install like so:

```
npm install --no-dev BillForward
```


Include
-------------------------
So far the library is still being architected.

#####From JavaScript

Having installed `index.js` to your source tree, include like so:

```js
var BillForward = require('path/to/index.js');
```

#####From Node
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
Run:
```
npm test
```