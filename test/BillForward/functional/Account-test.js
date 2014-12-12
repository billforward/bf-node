var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::getByID', function () {
			context('not exist', function () {
				var promise;
				before(function() {
					promise = BillForward.Account.getByID("wup");
				});
				it('should complain', function () {
					return promise
					.should.be.rejected;
				});
			});
		});
	});
});