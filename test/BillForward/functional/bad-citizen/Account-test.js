var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('blank entity constructed', function() {
				var model;
				before(function() {
					model = new BillForward.Account();
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
					var profile = new BillForward.Profile();
					profile[testDeepProp] = testDeepValue;
					var account = new BillForward.Account({
						'profile': profile
					});

					model = account;
				});
				it('should have expected deep property', function () {
					return BillForward.Account.create(model)
					.should.be.fulfilled.and
					.should.eventually.have.property('profile')
					.with.property(testDeepProp).that.equals(testDeepValue);
				});
			});
			context('nested entity array constructed', function() {
				var testDeepProp = 'country';
				var testDeepValue = 'Gensokyo';

				var model;
				before(function() {
					var address = new BillForward.Address({
					    'addressLine1': 'address line 1',
					    'addressLine2': 'address line 2',
					    'addressLine3': 'address line 3',
					    'city': 'London',
					    'province': 'London',
					    'postcode': 'SW1 1AS',
					    'landline': '02000000000',
					    'primaryAddress': true
					});
					address[testDeepProp] = testDeepValue;
					var profile = new BillForward.Profile({
						'email': 'u.n.owen@was.her',
	  					'firstName': 'U.N.',
	  					'lastName': 'Owen',
						'addresses': [address]
					});
					var account = new BillForward.Account({
						profile: profile
					});

					model = account;
				});
				it('should have expected deep property', function () {
					return BillForward.Account.create(model)
					.should.be.fulfilled.and
					.should.eventually.have.deep.property('profile.addresses')
						.with.property('[0]')
						.with.property(testDeepProp).that.equals(testDeepValue);
				});
			});
		});
	});
});