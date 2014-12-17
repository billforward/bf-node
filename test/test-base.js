var path = require("path");
var config = require('./config/config');

var BillForward = require('../bin');
var models = require('./models')(BillForward);

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
exports.models = models;

exports.assert = assert
exports.sinon = sinon;

exports.Q = Q;
exports._ = _;

// situational
var WebHookFilter = (function(webhook) {
	function WebHookFilter(filter) {
		this.filter = filter;
		this.deferred = Q.defer();
	};
	WebHookFilter.prototype.getPromise = function() {
		return this.deferred.promise;
	}
	WebHookFilter.prototype.callFilter = function() {
		try {
			var args = _.values(arguments);
			if (this.filter.apply(this.filter, args))
			this.deferred.resolve(args);
		} catch(e) {
		}
	}
	return WebHookFilter;
})();

var WebhookListener = (function(){
	function WebhookListener() {
		// this.queue = [];
		this.subscribers = [];
		this.readyDeferred = Q.defer();
	};
	WebhookListener.prototype.getReadyDeferred = function(callback) {
		return this.readyDeferred;
	};
	WebhookListener.prototype.subscribe = function(callback) {
		// console.log('subscribed');
		// console.log(this.subscribers);
		var args = _.values(arguments).slice(1);
		this.subscribers.push({
			callback: callback,
			args: args
		});
		return this.readyDeferred.promise;
	};
	WebhookListener.prototype.unsubscribe = function(callback) {
		// console.log('subscribed');
		_.pull(this.subscribers, callback);
	};
	WebhookListener.prototype.parse = function(webhook) {
		if (webhook.entity)
		webhook.entity = JSON.parse(webhook.entity);
		if (webhook.changes)
		webhook.changes = JSON.parse(webhook.changes);
		return webhook;
	};
	WebhookListener.prototype.resolveUponMatch = function(webhookFilter) {
		return (function(webhook) {
			
		})(webhook);
	};
	WebhookListener.prototype.enqueue = function(webhook) {
		var parsed = this.parse(webhook);
		
		// console.log('enqueued');
		// this.queue.push(webhook);
		this.notifySubscribers(parsed);
	};
	WebhookListener.prototype.notifySubscribers = function(item) {
		// console.log(item);
		_.forEach(this.subscribers, function(subscriber) {
			if (subscriber.callback instanceof WebHookFilter) {
				subscriber.callback.callFilter.apply(subscriber.callback, [item].concat(subscriber.args));
			} else {
				subscriber.callback.apply(subscriber.callback, [item].concat(subscriber.args));
			}
		});
	};
	return WebhookListener;
})();
var listener = new WebhookListener();

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.post('/webhook', function (req, res) {
	// console.log("Invoked!");
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
	listener.getReadyDeferred().resolve();
});

var keepAlive = config.keepAlive;
var enableWebhooksTests = config.enableWebhooksTests;
exports.keepAlive = keepAlive;
exports.enableWebhooksTests = enableWebhooksTests;

exports.webhookListener = listener;
exports.WebHookFilter = WebHookFilter;

var context = '';
exports.getContext = function() {
	return context;
};

exports.setContext = function(newContext) {
	context = newContext;
};