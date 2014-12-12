var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('#new', function () {
			context('Blank Entity', function() {
				it('should succeed', function () {
					var account = new BillForward.Account({});
				});
			});
			context('Nested Entity', function() {
				it('should succeed', function () {
					var profile = new BillForward.Profile({});
					var account = new BillForward.Account({});
					account.foo = 'sup';
					account.bar = 'yo';
					account.profile = profile;
					profile.Walpurgisnacht = 'grief seed';
					console.log(account.toString());
				});
			});
		});
	});
});