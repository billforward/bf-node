var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var Q = BillForward.Imports.Q;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('all required entities for chargeable Subscription created', function() {
				var models = {};
				var promises = {};
				before(function() {
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
						profile: models.profile
					});
					promises.account = BillForward.Account.create(models.account);

					/*promises.creditNote = promises.account
					.then(function(account) {
						models.creditNote = new BillForward.CreditNote({
							'accountID': account.id, // predicated on account's first being created
							'nominalValue': 100,
							'currency': 'USD'
						});
						return BillForward.CreditNote.create(models.creditNote);
					});*/

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


					// create a product
					models.product = new BillForward.Product({
						'productType': 'recurring',
						'state': 'prod',
						'name': 'Monthly recurring',
						'description': 'Purchaseables to which customer has a non-renewing, monthly entitlement',
						'durationPeriod': 'months',
						'duration': 1
					});
					promises.product = BillForward.Product.create(models.product)



					// make product rate plan..
					// requires:
					// - product,
					// - pricing components..
					// .. - which require pricing component tiers

					models.component1Tiers = [
						new BillForward.PricingComponentTier({
							'lowerThreshold': 0,
							'upperThreshold': 0,
							'pricingType': 'unit',
							'price': 0
						}),
						new BillForward.PricingComponentTier({
							'lowerThreshold': 1,
							'upperThreshold': 10,
							'pricingType': 'unit',
							'price': 1
						}),
						new BillForward.PricingComponentTier({
							'lowerThreshold': 11,
							'upperThreshold': 1000,
							'pricingType': 'unit',
							'price': 0.5
						})
					];

					models.component2Tiers = [
						new BillForward.PricingComponentTier({
							'lowerThreshold': 0,
							'upperThreshold': 0,
							'pricingType': 'unit',
							'price': 0
						}),
						new BillForward.PricingComponentTier({
							'lowerThreshold': 1,
							'upperThreshold': 10,
							'pricingType': 'unit',
							'price': 0.10
						}),
						new BillForward.PricingComponentTier({
							'lowerThreshold': 11,
							'upperThreshold': 1000,
							'pricingType': 'unit',
							'price': 0.05
						})
					];

					promises.ratePlan = Q
					.spread([
						promises.unitOfMeasure1,
						promises.unitOfMeasure2,
						promises.product
						],
						function(unitOfMeasure1, unitOfMeasure2, product) {
						// create 'in advance' ('subscription') pricing components, based on these tiers
						models.pricingComponents = [
							new BillForward.PricingComponent({
								'@type': 'tieredPricingComponent',
								'chargeModel': 'tiered',
								'name': 'CPU',
								'description': 'CPU consumed',
								'unitOfMeasureID': unitOfMeasure1.id, // predicated on unit of measure's first being created
								'chargeType': 'subscription',
								'upgradeMode': 'immediate',
								'downgradeMode': 'immediate',
								'defaultQuantity': 1,
								'tiers': models.component1Tiers
							}),
							new BillForward.PricingComponent({
								'@type': 'tieredPricingComponent',
								'chargeModel': 'tiered',
								'name': 'Bandwidth',
								'description': 'Bandwidth consumed',
								'unitOfMeasureID': unitOfMeasure2.id,
								'chargeType': 'subscription',
								'upgradeMode': 'immediate',
								'downgradeMode': 'immediate',
								'defaultQuantity': 10,
								'tiers': models.component2Tiers
							})
						];

						models.ratePlan = new BillForward.ProductRatePlan({
							'currency': 'USD',
							'name': 'Sound Plan',
							'pricingComponents': models.pricingComponents,
							'productID': product.id,
						});

						return BillForward.ProductRatePlan.create(models.ratePlan);
					});
				});
				it('rate plan should be created', function () {
					return promises.ratePlan
					.should.be.fulfilled;
				});
			});
		});
	});
});