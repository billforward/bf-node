var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

var Q = testBase.Q;
var amqp = testBase.amqp;
var keepAlive = testBase.keepAlive;
var webhookListener = testBase.webhookListener;

context(testBase.getContext(), function () {
	context('Listening for webhooks', function() {
  		this.timeout(keepAlive);
		describe('The webhook server', function() {
			var promise;
			before(function() {
				//promise = Q.delay(keepAlive);
				var deferred = Q.defer();

				webhookListener.subscribe(function(webhook) {
					webhook.entity = JSON.parse(webhook.entity);
					if (webhook.changes)
					webhook.changes = JSON.parse(webhook.changes);
					var pretty = JSON.stringify(webhook, null, "\t");
					console.log(pretty);
					deferred.resolve(webhook);
				});

				promise = deferred.promise;
			});
			it('times out', function() {
				return promise.should.be.fulfilled;
			});
		});
	});
});