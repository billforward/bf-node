var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('all required entities for chargeable Subscription created', function() {

				var promise;
				before(function() {
					var accountModel = new BillForward.Account({
						'profile': new BillForward.Profile({
							'email': 'u.n.owen@was.her',
		  					'firstName': 'U.N.',
		  					'lastName': 'Owen',
							'addresses': [
								new BillForward.Address({
								    'addressLine1': 'address line 1',
								    'addressLine2': 'address line 2',
								    'addressLine3': 'address line 3',
								    'city': 'London',
								    'country': 'Gensokyo',
								    'province': 'London',
								    'postcode': 'SW1 1AS',
								    'landline': '02000000000',
								    'primaryAddress': true
								})
								]
							})
						});

					var account = BillForward.Account.create(accountModel);

					promise = account;
				});
				it('should have expected deep property', function () {
					return promise
					.should.be.fulfilled;
				});
			});
		});
	});
});