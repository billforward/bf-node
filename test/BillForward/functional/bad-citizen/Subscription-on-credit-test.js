var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('all required entities for chargeable Subscription created', function() {

				var promise;
				before(function() {
					var models = {};
					var promises = {};

					// create an account
					// requires (optionally):
					// - profile
					// - - addresses
					models.address = new BillForward.Address({
					    'addressLine1': 'address line 1',
					    'addressLine2': 'address line 2',
					    'addressLine3': 'address line 3',
					    'city': 'London',
					    'country': 'Gensokyo',
					    'province': 'London',
					    'postcode': 'SW1 1AS',
					    'landline': '02000000000',
					    'primaryAddress': true
					});
					models.profile = new BillForward.Profile({
						'email': 'u.n.owen@was.her',
	  					'firstName': 'U.N.',
	  					'lastName': 'Owen',
						'addresses': [models.address]
					});
					models.account = new BillForward.Account({
						profile: profileModel
					});

					promises.account = BillForward.Account.create(models.account);

					models.creditNote = new BillForward.CreditNote({
						'accountID': account.id,
						'nominalValue': 100,
						'currency': 'USD'
					});

					promises.creditNote = BillForward.CreditNote.create(models.creditNote);

					// create a unit of measure
					models.unitOfMeasure1 = new BillForward.UnitOfMeasure({
						'name': 'CPU',
						'displayedAs': 'Cycles',
						'roundingScheme': 'UP',
					});

					promises.unitOfMeasure1 = BillForward.UnitOfMeasure.create(models.unitOfMeasure1)

					// create another unit of measure
					models.unitOfMeasure2 = new BillForward.UnitOfMeasure({
						'name': 'Bandwidth',
						'displayedAs': 'Mbps',
						'roundingScheme': 'UP',
					});
					
					promises.unitOfMeasure2 = BillForward.UnitOfMeasure.create(models.unitOfMeasure2)

					

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