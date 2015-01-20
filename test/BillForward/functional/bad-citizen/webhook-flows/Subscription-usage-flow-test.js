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
									'creditEnabled':                  true
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
									currentPeriodEndAscribed:  new WebHookFilter(function(webhook, subscription) {
										if (webhook.domain === 'Subscription')
										if (webhook.action === 'Updated')
										if (webhook.entity.id === subscription.id)
										return _.find(webhook.changes.auditFieldChanges, function(auditFieldChange) {
											return auditFieldChange.attributeName === 'currentPeriodEnd';
										}) !== undefined;
									}),
									pendingInvoiceRaised:  new WebHookFilter(function(webhook, subscription) {
										if (webhook.domain === 'Invoice')
										if (webhook.action === 'Pending')
										if (webhook.entity.subscriptionID === subscription.id)
										return true;
									})
								};

								parentClosure.promises.subscriptionActivated = parentClosure.promises.subscription
								.then(function(subscription) {
									return Q.all([
										webhookListener.subscribe(webhookFilters.paymentAwaited, subscription),
										webhookListener.subscribe(webhookFilters.pendingInvoiceRaised, subscription),
										webhookListener.subscribe(webhookFilters.paymentPaid, subscription),
										webhookListener.subscribe(webhookFilters.currentPeriodEndAscribed, subscription)
										])
									.then(function() {
										return subscription.activate();
									});
								});

								parentClosure.promises.issueInvoice = webhookFilters.pendingInvoiceRaised.getPromise()
								.then(function(webhook) {
									// console.dir(webhook);
									var notification = webhook[0];
									var invoice = new BillForward.Invoice(notification.entity);
									// console.log(invoice);

									webhookFilters.pendingInvoiceIssued = new WebHookFilter(function(webhook, invoice) {
										if (webhook.domain === 'Invoice')
										if (webhook.action === 'Unpaid')
										if (webhook.entity.id === invoice.id)
										return true;
									});

									return webhookListener.subscribe(webhookFilters.pendingInvoiceIssued, invoice)
									.then(function() {
										return invoice.issue();
									})
								});
							});
							after(function() {
								_.forEach(callbacks, webhookListener.unsubscribe);
							});
							it("changes state to 'AwaitingPayment'", function() {
								return webhookFilters.paymentAwaited.getPromise()
								.should.be.fulfilled;
							});
							it("changes state to 'Paid'", function() {
								return webhookFilters.paymentPaid.getPromise()
								.should.be.fulfilled;
							});
							describe("An invoice", function() {
								it("is raised in 'Pending' state", function() {
									// since usage components are present, invoice will pend confirmation
									return webhookFilters.pendingInvoiceRaised.getPromise()
									.should.be.fulfilled;
								});
								it("is promoted to 'Unpaid' state", function() {
									return webhookFilters.pendingInvoiceIssued.getPromise()
									.should.be.fulfilled;
								});
							});
							context("once active", function() {
								this.timeout(getNewTimeout());

								// var actioningTime = moment().add(1, 'month').toDate();
								// var actioningTime = moment().toDate();

								var callbacks;
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

									parentClosure.promises.modifyUsage = webhookFilters.currentPeriodEndAscribed.getPromise()
									.then(function(currentPeriodEndAscribed, paymentPaid) {
											var notification = currentPeriodEndAscribed[0];
											var subscription = new BillForward.Subscription(notification.entity);

											var nameToValueMap = {
												"Bandwidth": 50
											};
											return subscription.modifyUsage(nameToValueMap);
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
									return parentClosure.promises.modifyUsage
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