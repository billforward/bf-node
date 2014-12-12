var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('blank entity constructed', function() {
				var model;
				before(function() {
					model = new BillForward.Account({});
				});
				it('should have expected property', function () {
					return BillForward.Account.create(model)
					.should.be.fulfilled.and
					.eventually.have.property('id');
				});
			});
			context('nested entity constructed', function() {
				var testDeepProp = 'email';
				var testDeepValue = 'sup@yo.com';

				var model;
				before(function() {
					var account = new BillForward.Account({});
					var profile = new BillForward.Profile({});

					account.profile = profile;
					profile[testDeepProp] = testDeepValue;

					model = account;
				});
				it('should have expected deep property', function () {
					return BillForward.Account.create(model)
					.should.be.fulfilled.and
					.should.eventually.have.property('profile')
					.with.deep.property(testDeepProp).that.equals(testDeepValue);
				});
			});
		});
	});
});