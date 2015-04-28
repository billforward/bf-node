var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

var Q = testBase.Q;

var getNewTimeout;
var webhookListener;
var WebHookFilter;
if (testBase.enableWebhooksTests) {
	// var keepAlive = testBase.keepAlive;
	webhookListener = testBase.webhookListener;
	WebHookFilter = testBase.WebHookFilter;
	getNewTimeout = testBase.getIncrementedGlobalKeepAlive;
}

context(testBase.getContext(), function () {
	(testBase.enableWebhooksTests ? context : context.skip)('Listening for webhooks', function() {
		if (getNewTimeout) {
			this.timeout(getNewTimeout());
		}
  		context('Webhook triggered manually', function() {
			describe('The webhook server', function() {
				var callback;
				var promise;
				before(function() {
					//promise = Q.delay(keepAlive);
					var deferred = Q.defer();

					callback = function(webhook) {
						var pretty = JSON.stringify(webhook, null, "\t");
						// console.log(pretty);
						deferred.resolve(webhook);
					};

					webhookListener.subscribe(callback);

					promise = deferred.promise;
				});
				after(function() {
					webhookListener.unsubscribe(callback);
				});
				it('receives a webhook', function() {
					return promise.should.be.fulfilled;
				});
			});
		});
	});
});