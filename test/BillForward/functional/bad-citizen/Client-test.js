var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

var Q = testBase.Q;
var _ = testBase._;

context(testBase.getContext(), function () {
	describe('Client', function () {
		describe('#request', function () {
			context('given multiple entities exist', function() {
				var promises = {};
				var models = {};
				before(function() {
					models.account1 = new BillForward.Account();
					models.account2 = new BillForward.Account();

					promises.account1 = BillForward.Account.create(models.account1);
					promises.account2 = BillForward.Account.create(models.account2);

					promises.allAccounts = Q.all([
						promises.account1,
						promises.account2
						]);
				});
				it('creates all entities correctly', function () {
					return promises.allAccounts
					.should.be.fulfilled;
				});
				context('using query parameter', function() {
					var recordsToFetch = 2;
					before(function() {
						promises.getTwoAccounts = promises.allAccounts
						.then(function() {
							return BillForward.Account.getAll({
								records: recordsToFetch
							});
						});
					});
					it('GET succeeds', function () {
						return promises.getTwoAccounts
						.should.be.fulfilled;
					});
					it('GET fetches expected number of entities', function () {
						return promises.getTwoAccounts
						.should.eventually.have.length(recordsToFetch);
					});
				});
			});
		});
	});
});