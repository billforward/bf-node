var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('#new', function () {
			it('should succeed', function () {
				var account = new BillForward.Account({});
			});
		});
	});
});