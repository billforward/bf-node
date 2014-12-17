module.exports = function(Q, _, config) {
	var utils = {};
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

	var bodyParser = require('body-parser');
	var express = require('express');

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
	exports.keepAlive = keepAlive;

	var globalKeepAlive = 2000;

	var getIncrementedGlobalKeepAlive = function() {
		// one more long-running test is being added to the test-run
		globalKeepAlive += keepAlive;
		return globalKeepAlive;
	};;

	utils.webhookListener = listener;
	utils.WebHookFilter = WebHookFilter;
	utils.getIncrementedGlobalKeepAlive = getIncrementedGlobalKeepAlive;

	return utils;
};