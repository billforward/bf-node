var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::getByID', function () {
			context('not exist', function () {
				it('should complain', function () {
					return BillForward.Account.getByID("wup")
					.should.be.rejected;
				});
			});
		});
	});
});