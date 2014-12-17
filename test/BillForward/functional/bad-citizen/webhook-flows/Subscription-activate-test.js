var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var testModels = testBase.models;

var Q = testBase.Q;
var _ = testBase._;

if (testBase.enableWebhooksTests) {
	var keepAlive = testBase.keepAlive;
	var webhookListener = testBase.webhookListener;
	var WebHookFilter = testBase.WebHookFilter;
}

context(testBase.getContext(), function () {
	describe('Subscription', function () {
		describe('::create', function () {
			context('given all dependent entities created', function() {
				var models = {};
				var promises = {};
				before(function() {
					// create an account
					// requires (optionally):
					// - profile
					// - - addresses
					models.account = testModels.Account();
					promises.account = BillForward.Account.create(models.account);

					promises.creditNote = promises.account
					.then(function(account) {
						models.creditNote = new BillForward.CreditNote({
							'accountID': account.id, // predicated on account's first being created
							'nominalValue': 100,
							'currency': 'USD'
						});
						return BillForward.CreditNote.create(models.creditNote);
					});

					// create a unit of measure
					models.unitOfMeasure1 = testModels.UnitOfMeasure();
					promises.unitOfMeasure1 = BillForward.UnitOfMeasure.create(models.unitOfMeasure1)

					// create another unit of measure
					models.unitOfMeasure2 = testModels.UnitOfMeasure2();
					promises.unitOfMeasure2 = BillForward.UnitOfMeasure.create(models.unitOfMeasure2)


					// create a product
					models.product = testModels.Product();
					promises.product = BillForward.Product.create(models.product)



					// make product rate plan..
					// requires:
					// - product,
					// - pricing components..
					// .. - which require pricing component tiers

					models.component1Tiers = testModels.PricingComponentTiers();

					models.component2Tiers = testModels.PricingComponentTiers2();

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
				describe('the dependent entities', function () {
					it('are created succesfully', function () {
						return Q
						.all(_.values(promises))
						.should.be.fulfilled;
					});
				});
				describe('the subscription', function () {
					before(function() {
						// make subscription..
						// requires:
						// - account [we have this already]
						// - product rate plan [we have this already]
						// - pricing component value instances (for every pricing component on the PRP)
						// - payment method subscription links (for every payment method on the account)

						promises.subscription = Q
						.spread([
							promises.account,
							promises.ratePlan,
							],
							function(account, ratePlan) {
								// create PaymentMethodSubscriptionLink to each payment method on account
								models.paymentMethodLinks = _.map(account.paymentMethods, function(paymentMethod) {
									return new BillForward.PaymentMethodSubscriptionLink({
										'paymentMethodID': paymentMethod.id
									});
								});

								models.pricingComponentValues = _.map(ratePlan.pricingComponents, function(pricingComponent) {
									return new BillForward.PricingComponentValue({
										'pricingComponentID': pricingComponent.id,
										'value': 13 // set all to same value for this example
									});
								});

								models.subscription = new BillForward.Subscription({
									'type':                           'Subscription',
									'productRatePlanID':              ratePlan.id,
									'accountID':                      account.id,
									'name':                           'Memorable Subscription',
									'description':                    'Memorable Subscription Description',
									'paymentMethodSubscriptionLinks': models.paymentMethodLinks,
									'pricingComponentValues':         models.pricingComponentValues
								});

								return BillForward.Subscription.create(models.subscription);
							})
					});
					it('is created succesfully', function () {
						return Q
						.all(_.values(promises))
						.should.be.fulfilled;
					});
					(testBase.enableWebhooksTests ? context : context.skip)('Webhooks permitting', function() {
				  		this.timeout(keepAlive);
						describe('The subscription', function() {
							var callbacks;
							var webhookFilters;
							before(function() {
								webhookFilters = {
									paymentAwaited: new WebHookFilter(function(webhook, subscription) {
										if (webhook.domain === 'Subscription')
										if (webhook.action === 'AwaitingPayment')
										if (webhook.entity.id === subscription.id)
										return true;
									}),
									unpaidInvoiceRaised:  new WebHookFilter(function(webhook, subscription) {
										if (webhook.domain === 'Invoice')
										if (webhook.action === 'Unpaid')
										if (webhook.entity.subscriptionID === subscription.id)
										return true;
									})
								};

								promises.subscription
								.then(function(subscription) {
									return webhookListener.subscribe(webhookFilters.paymentAwaited, subscription)
									.then(function() {
										return webhookListener.subscribe(webhookFilters.unpaidInvoiceRaised, subscription);
									})
									.then(function() {
										return subscription.activate();
									});
								});
							});
							after(function() {
								_.forEach(callbacks, function(callback) {
									webhookListener.unsubscribe(callback);
								});
							});
							it("changes state", function() {
								return webhookFilters.paymentAwaited.getPromise()
								.should.be.fulfilled;
							});
							it("raises invoice", function() {
								return webhookFilters.unpaidInvoiceRaised.getPromise()
								.should.be.fulfilled;
							});
						});
					});
				});
			});
		});
	});
});