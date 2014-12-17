var path = require("path");
var config = require('./config/config');

var BillForward = require('../bin');
var models = require('./models')(BillForward);

var moment = require('moment');

var sinon = require("sinon");
var chai = require('chai');

chai.use(require("chai-as-promised"));
chai.use(require("sinon-chai"));
chai.should();

var assert = require('assert');
require('mocha-sinon');

// just grab Q from BillForward lol
var Q = BillForward.Imports.Q;
var _ = BillForward.Imports._;

exports.BillForward = BillForward;
exports.client = BillForward.Client.makeDefault(config.accessToken, config.urlRoot, config.requestLogging, config.responseLogging, config.errorLogging);
exports.models = models;

exports.assert = assert
exports.sinon = sinon;

exports.Q = Q;
exports._ = _;
exports.moment = moment;

var context = '';
exports.getContext = function() {
	return context;
};

exports.setContext = function(newContext) {
	context = newContext;
};

var enableWebhooksTests = config.enableWebhooksTests;
exports.enableWebhooksTests = enableWebhooksTests;

// situational
if (enableWebhooksTests) {
	var webhookUtils = require("./webhook-utils")(Q, _, config);
	
	exports.webhookListener = webhookUtils.webhookListener;
	exports.WebHookFilter = webhookUtils.WebHookFilter;
	exports.getIncrementedGlobalKeepAlive = webhookUtils.getIncrementedGlobalKeepAlive;
}