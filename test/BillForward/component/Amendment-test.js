var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

var Q = testBase.Q;
var _ = testBase._;
var sinon = testBase.sinon;

context(testBase.getContext(), function () {
	afterEach(function () {
		if (BillForward.Imports.httpinvoke.restore) {
			BillForward.Imports.httpinvoke.restore();
		}
	});
	describe('CancellationAmendment', function () {
		describe('::create', function () {
			context('blank entity constructed', function() {
				var promise;
				before(function() {
					var deferred = Q.defer();

					sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
						//console.log(options.input);
						deferred.resolve(options.input);
						options.finished(false, mocks.createCancellationAmendment, 200, options.headers);
					});

					var amendment = new BillForward.CancellationAmendment({
						'subscriptionID': "sup, yo",
						'serviceEnd': "whenever"
					});

					BillForward.CancellationAmendment.create(amendment);

					promise = deferred.promise;
				});
				it('should finish', function () {
					return promise
					.should.be.fulfilled;
				});
				it('should send correct request', function () {
					return promise
					.should.eventually.satisfy(function(request) {
						return _.keys(request)[0] === '@type';
					});
				});
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
	}
};