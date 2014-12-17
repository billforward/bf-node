var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

var Q = testBase.Q;
var _ = testBase._;
var moment = testBase.moment;
var sinon = testBase.sinon;

context(testBase.getContext(), function () {
	afterEach(function () {
		if (BillForward.Imports.httpinvoke.restore) {
			BillForward.Imports.httpinvoke.restore();
		}
	});
	describe('CancellationAmendment', function () {
		describe('::create', function () {
			var promise;
			var plannedActioningTime;
			before(function() {
				plannedActioningTime = "2014-12-17T12:25:13.478Z";
				var inputTime = moment(plannedActioningTime).toDate();

				var deferred = Q.defer();

				sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
					if (verb === 'GET') {
						// getting subscription
						options.finished(false, mocks.getSubscriptionByID, 200, options.headers);
					} else {
						// creating amendment
						deferred.resolve(options.input);
						options.finished(false, mocks.createCancellationAmendment, 200, options.headers);
					}
				});

				BillForward.Subscription.getByID("whatever").then(function(subscription) {
					var amendment = BillForward.CancellationAmendment.construct(subscription, "whenever", inputTime);

					return BillForward.CancellationAmendment.create(amendment);
				});

				promise = deferred.promise;
			});
			it('should finish', function () {
				return promise
				.should.be.fulfilled;
			});
			it('should send JSON in required order', function () {
				return promise
				.should.eventually.satisfy(function(request) {
					return _.keys(request)[0] === '@type';
				});
			});
			it('should have expected actioning time', function () {
				return promise
				.should.eventually
				.have.property('actioningTime')
					.that.equals(plannedActioningTime);
			});
		});
	});
});

var mocks = {
	createCancellationAmendment: {
		"executionTime": 1378205,
		"results": [
			{
				"@type": "CancellationAmendment",
				"id": "82EAD04F-9058-4B3E-B45D-E0B9D5F73225",
				"subscriptionID": "DCE1DF3E-B05F-4AF6-8819-ABAFE9E8A080",
				"amendmentType": "Cancellation",
				"actioningTime": "2014-10-13T16:54:31Z",
				"actionedTime": "2014-10-13T16:54:32Z",
				"state": "Pending",
				"deleted": false,
				"source": "PHP library test",
				"serviceEnd": "Immediate"
			}
		]
	},
	getSubscriptionByID: {
	  "executionTime": 186905384,
	  "results": [
	    {
	      "@type": "subscription",
	      "id": "4A8F93AE-A779-4203-A5E9-073813EB4C1E",
	      "accountID": "417FBB05-2C4C-4A94-85F3-058D02B2CE0E",
	      "productID": "30125066-1A83-407F-B5B4-668B8281CFCC",
	      "productRatePlanID": "86CC2F24-7931-4315-BD63-6BF364CA7572",
	      "organizationID": "EEEE0FD7-2075-11E3-A2A1-FA163E414B4F",
	      "name": "New Sub",
	      "description": "Sub",
	      "type": "Subscription",
	      "state": "Cancelled",
	      "initalPeriodStart": "2014-01-15T13:37:00Z",
	      "currentPeriodStart": "2014-01-15T13:37:00Z",
	      "currentPeriodEnd": "2014-02-12T13:37:00Z",
	      "inTrialPeriod": false,
	      "successfulPeriods": 0,
	      "expiryNotificationSent": true,
	      "created": "2014-01-15T13:37:00Z",
	      "updated": "2014-02-12T13:37:00Z",
	      "changedBy": "System",
	      "pricingComponentValueChanges": [
	        {
	          "id": "5B23E40C-2CE3-11E3-894A-FA163E717A7F",
	          "pricingComponentID": "A31D963C-5390-402E-A093-1890686F85B3",
	          "subscriptionID": "4A8F93AE-A779-4203-A5E9-073813EB4C1E",
	          "organizationID": "EEEE0FD7-2075-11E3-A2A1-FA163E414B4F",
	          "value": 2,
	          "created": "2014-02-09T23:37:49Z",
	          "updated": "2014-02-09T23:37:49Z",
	          "changedBy": "80FCD030-4020-4CFC-92DE-AE7B147A90E0"
	        }
	      ],
	      "pricingComponentValues": [
	        {
	          "id": "0AF8C2E8-9E28-46A4-AFCF-346D4AC9E95C",
	          "pricingComponentID": "A31D963C-5390-402E-A093-1890686F85B3",
	          "subscriptionID": "4A8F93AE-A779-4203-A5E9-073813EB4C1E",
	          "organizationID": "EEEE0FD7-2075-11E3-A2A1-FA163E414B4F",
	          "value": 4,
	          "created": "2014-01-15T13:37:00Z",
	          "updated": "2014-01-15T13:37:00Z",
	          "changedBy": "80FCD030-4020-4CFC-92DE-AE7B147A90E0"
	        },
	        {
	          "id": "FFFFB45C-B3C5-4DDF-9909-BB695B318CBC",
	          "pricingComponentID": "B91E653B-5390-402E-A093-1890686F85B3",
	          "subscriptionID": "4A8F93AE-A779-4203-A5E9-073813EB4C1E",
	          "organizationID": "EEEE0FD7-2075-11E3-A2A1-FA163E414B4F",
	          "value": 2,
	          "created": "2014-01-15T13:37:00Z",
	          "updated": "2014-01-15T13:37:00Z",
	          "changedBy": "80FCD030-4020-4CFC-92DE-AE7B147A90E0"
	        }
	      ],
	      "paymentMethodSubscriptionLinks": [
	        {
	          "id": "9AAC0248-7552-4E7C-BFB8-7575690FE1EA",
	          "subscriptionID": "4A8F93AE-A779-4203-A5E9-073813EB4C1E",
	          "organizationID": "EEEE0FD7-2075-11E3-A2A1-FA163E414B4F",
	          "paymentMethodID": "5B1D0ACD-70F0-4BCF-AA3E-B876183B1AC7",
	          "created": "2014-01-15T13:37:00Z",
	          "updated": "2014-01-15T13:37:00Z",
	          "changedBy": "System"
	        },
	        {
	          "id": "42BBAB25-A646-465F-9DCC-BD63F4AAA0D0",
	          "subscriptionID": "4A8F93AE-A779-4203-A5E9-073813EB4C1E",
	          "organizationID": "EEEE0FD7-2075-11E3-A2A1-FA163E414B4F",
	          "paymentMethodID": "D9863E6E-F0F5-4D72-88FF-9B54482E8AB2",
	          "created": "2014-01-15T13:37:00Z",
	          "updated": "2014-01-15T13:37:00Z",
	          "changedBy": "System"
	        }
	      ]
	    }
	  ]
	},	
};