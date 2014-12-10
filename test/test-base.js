var path = require("path");
// var dir = path.join(__dirname, "config");
//var rel = path.relative('./', dir);

// loads './config/config.json' relative to test execution directory
var config = require('./config/config');

var BillForward = require('../bin');
var sinon = require("sinon");
var chai = require('chai');

chai.use(require("chai-as-promised"));
chai.use(require("sinon-chai"));
chai.should();

var assert = require('assert');
require('mocha-sinon');

exports.BillForward = BillForward;
exports.client = BillForward.Client.makeDefault(config.accessToken, config.urlRoot, config.logging);
exports.assert = assert
exports.sinon = sinon;