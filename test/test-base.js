var path = require("path");
var config = require('./config/config');

var BillForward = require('../bin');
var sinon = require("sinon");
var chai = require('chai');
var express = require('express');
var bodyParser = require('body-parser');

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
exports.assert = assert
exports.sinon = sinon;

exports.Q = Q;
exports._ = _;

// situational
var WebhookListener = (function(){
	function WebhookListener() {
		// this.queue = [];
		this.subscribers = [];
	};
	WebhookListener.prototype.subscribe = function(callback) {
		// console.log('subscribed');
		this.subscribers.push(callback);
	};
	WebhookListener.prototype.enqueue = function(webhook) {
		// console.log('enqueued');
		// this.queue.push(webhook);
		this.notifySubscribers(webhook);
	};
	WebhookListener.prototype.notifySubscribers = function(item) {
		// console.log(item);
		_.forEach(this.subscribers, function(callback) {
			callback(item);
		});
	};
	return WebhookListener;
})();
var listener = new WebhookListener();

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.post('/webhook', function (req, res) {
	console.log("Invoked!");
	// console.log(req.body);
	listener.enqueue(req.body);
	// res.json(req.body);
	res.status(200).send('sup');
});

app.use(function(req, res, next){
	res.status(404).send('Sorry cant find that!');
});
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(config.webhookPort, function() {
	console.log('listening for webhooks on port: '+config.webhookPort);
});

var keepAlive = config.keepAlive;
exports.keepAlive = keepAlive;
exports.webhookListener = listener;

var context = '';
exports.getContext = function() {
	return context;
};

exports.setContext = function(newContext) {
	context = newContext;
};