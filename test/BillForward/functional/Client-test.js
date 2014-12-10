var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Client', function () {
		describe('#request', function () {
			context('unauthorised', function () {
				var unauthorisedClient;
				before(function() {
					var urlRoot = testBase.client.getUrlRoot();
					var defunctToken = "zalgo";
					unauthorisedClient = new BillForward.Client(defunctToken, urlRoot)
				})
				it('should reject', function () {
					return unauthorisedClient.request("GET", "accounts")
					.should.be.rejected;
				});
			});
			context('authorised', function () {
				it('should accept', function () {
					return client.request("GET", "accounts")
					.should.be.fulfilled;
				});
			});
		});
	});
});