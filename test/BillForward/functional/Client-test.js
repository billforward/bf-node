var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Client', function () {
		describe('#request', function () {
			context('unauthorised', function () {
				var unauthorisedClient;

				var promise;
				before(function() {
					var urlRoot = testBase.client.getUrlRoot();
					var defunctToken = "zalgo";
					unauthorisedClient = new BillForward.Client(defunctToken, urlRoot)
					promise = unauthorisedClient.request("GET", "accounts");
				})
				it('should reject', function () {
					return promise
					.should.be.rejected;
				});
			});
			context('authorised', function () {
				var promise;
				before(function() {
					promise = client.request("GET", "accounts");
				})
				it('should accept', function () {
					return promise
					.should.be.fulfilled;
				});
			});
		});
	});
});