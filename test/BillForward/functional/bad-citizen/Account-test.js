var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('model constructed', function() {
				var model;
				before(function() {
					model = new BillForward.Account({});
				});
				it('should succeed', function () {
					return BillForward.Account.create(model)
					.should.be.fulfilled;
				});
			});
		});
	});
});