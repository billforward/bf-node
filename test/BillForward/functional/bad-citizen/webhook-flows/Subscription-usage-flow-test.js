var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var testModels = testBase.models;

var Q = testBase.Q;
var _ = testBase._;
var moment = testBase.moment;

if (testBase.enableWebhooksTests) {
	// var keepAlive = testBase.keepAlive;
	var webhookListener = testBase.webhookListener;
	var WebHookFilter = testBase.WebHookFilter;
	var getNewTimeout = testBase.getIncrementedGlobalKeepAlive;
} else {
	getNewTimeout = function() {};
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
					models.product = testModels.FastProduct();
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
								'description': 'CPU entitlement for the period',
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
								'description': 'Bandwidth consumed during the period',
								'unitOfMeasureID': unitOfMeasure2.id,
								'chargeType': 'usage',
								'upgradeMode': 'immediate',
								'downgradeMode': 'immediate',
								'defaultQuantity': 10,
								'tiers': models.component2Tiers
							})
						];

						models.ratePlan = new BillForward.ProductRatePlan({
							'currency': 'USD',
							'name': 'Gold Membership',
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
									'pricingComponentValues':         models.pricingComponentValues,
									// 'creditEnabled':                  true
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
				  		this.timeout(getNewTimeout());
						describe('The subscription', function() {
							var parentClosure = {
								promises: promises
							};
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
									paymentPaid: new WebHookFilter(function(webhook, subscription) {
										if (webhook.domain === 'Subscription')
										if (webhook.action === 'Paid')
										if (webhook.entity.id === subscription.id)
										return true;
									}),
									pendingInvoiceRaised:  new WebHookFilter(function(webhook, subscription) {
										if (webhook.domain === 'Invoice')
										if (webhook.action === 'Pending')
										if (webhook.entity.subscriptionID === subscription.id)
										return true;
									})
								};

								parentClosure.promises.subscription
								.then(function(subscription) {
									return webhookListener.subscribe(webhookFilters.paymentAwaited, subscription)
									.then(function() {
										return webhookListener.subscribe(webhookFilters.pendingInvoiceRaised, subscription);
									})
									.then(function() {
										return webhookListener.subscribe(webhookFilters.paymentPaid, subscription);
									})
									.then(function() {
										return subscription.activate();
									});
								});

								webhookFilters.pendingInvoiceRaised.getPromise()
								.then(function(webhook) {
									var notification = webhook[0];
									var invoice = new BillForward.Invoice(notification.entity);
									console.log(invoice.toString());
								});
							});
							after(function() {
								_.forEach(callbacks, webhookListener.unsubscribe);
							});
							it("changes state to 'AwaitingPayment'", function() {
								return webhookFilters.paymentAwaited.getPromise()
								.should.be.fulfilled;
							});
							it("raises pending invoice", function() {
								// since usage components are present, invoice will pend confirmation
								return webhookFilters.pendingInvoiceRaised.getPromise()
								.should.be.fulfilled;
							});
							it("changes state to 'Paid'", function() {
								return webhookFilters.paymentPaid.getPromise()
								.should.be.fulfilled;
							});
							context("once active", function() {
								this.timeout(getNewTimeout());

								// var actioningTime = moment().add(1, 'month').toDate();
								// var actioningTime = moment().toDate();

								var parentClosure = {
									parentClosure: parentClosure
								};
								var promises = {};

								var callbacks;
								var webhookFilters;
								before(function() {
									/*webhookFilters = {
										cancelled: new WebHookFilter(function(webhook, subscription) {
											if (webhook.domain === 'Subscription')
											if (webhook.action === 'Cancelled')
											if (webhook.entity.id === subscription.id)
											return true;
										})
									};*/

									/*parentClosure.promises.subscription
									.then(function(subscription) {
										return webhookListener.subscribe(webhookFilters.cancelled, subscription)
										.then(function() {
											return subscription.cancel("AtPeriodEnd", actioningTime);
										});
									});*/

									promises.modifyUsage = Q.spread([
										webhookFilters.paymentAwaited.getPromise(),
										parentClosure.parentClosure.promises.subscription
										],
										function(webhookArgs, subscription) {
											var nameToValueMap = {
												"Bandwidth": 7
											};
											return subscription.modifyUsage(nameToValueMap)
											.then(function(subscription) {
												return subscription.save();	
											});
										});

									/*webhookFilters.paymentAwaited.getPromise()
									.then(function(webhook) {
										console.log(arguments);
										return webhook.subscriptionID
									})*/
								});
								/*after(function() {
									_.forEach(callbacks, webhookListener.unsubscribe);
								});*/
								it("can modify its usage", function() {
									return promises.modifyUsage
									.should.be.fulfilled;
								});
								/*context("future cancellation queued", function() {
									this.timeout(getNewTimeout());
									var parentClosure = {
										callbacks: callbacks,
										webhookFilters: webhookFilters,
										parentClosure: parentClosure
									};


								});*/
							});
						});
					});
				});
			});
		});
	});
});