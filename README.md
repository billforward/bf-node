Node Mocha Skeleton
-------------------

NMS demonstrates the approach I've gradually developed for structuring my Node.JS libraries:

* it provides ready-to-run examples of the __mocha__ testing framework.
* it demonstrates the usage of __underscore__, as a way to prettify array and object manipulation.
* it demonstrates the usage of optimist, a great library for simplifying the building of command-line applications.

Basic Directory Structure
=========================

* __lib/__ this is where all of your applications code will be stored. I approach my design in an OOP manner; hello.js contains a Hello class, banana.js a Banana class, etc.
* __test/__ mocha will discover any tests that you place in this directory. There is generally a corresponding library file for each test, e.g., hello.js has a corresponding hello-test.js.
* __bin/__ files within this folder expose a command-line-interface to your application. When _npm install -g_ is run, these scripts will be installed globally.
* __package.json__ this file severs several purposes: it provides meta-information surrounding your project: author, version, description, etc; it describes the directory structure of your project; it describes your project's dependencies, (running _npm install_ will install the dependencies described in package.json).
* __Makefile__ the make file is used to run the Mocha test framework. _npm test_ looks for this Makefile, and uses it to execute Mocha's test suite.
* __README.md__ a great README file is an important part of any project, take some time to learn the ins and outs of markdown.

Library Dependencies
====================

There are a few libraries that I pull into almost every Node.JS project that I begin:

* __(mocha)[https://github.com/visionmedia/mocha]__ mocha is a light-weight testing framework for JavaScript. It provides both BDD and TDD interfaces, allowing you to choose whichever you feel more comfortable with.
* __underscore__ underscore provides functional programming constructs: map, reduce, extend, etc. It really helps to cleanup the logic surrounding array and object manipulation my applications.
* __optimist__ optimst is a simple, powerful, command-line-argument parser.


Copyright
---------

Copyright (c) 2012 Benjamin Coe. See LICENSE.txt for further details.