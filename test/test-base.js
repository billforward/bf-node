var path = require("path");
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
exports.client = BillForward.Client.makeDefault(config.accessToken, config.urlRoot, config.requestLogging, config.responseLogging, config.errorLogging);
exports.assert = assert
exports.sinon = sinon;
// just grab Q from BillForward lol
exports.Q = BillForward.Imports.Q;
exports._ = BillForward.Imports._;

var context = '';
exports.getContext = function() {
	return context;
};

exports.setContext = function(newContext) {
	context = newContext;
};