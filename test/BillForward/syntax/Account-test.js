var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('#new', function () {
			context('blank entity', function() {
				it('should serialize correctly', function () {
					var account = new BillForward.Account({});

					var testProp = 'sup';
					var testVal = 'yo';
					account[testProp] = testVal;

					var serialized = account.serialize();

					account.should.have.property(testProp).that.equals(testVal);
					serialized.should.have.property(testProp).that.equals(testVal);

					serialized.should.not.have.property('_client').and
					.should.not.have.property('_exemptFromSerialization');
				});
			});
			context('nested entity', function() {
				it('should serialize correctly', function () {
					var profile = new BillForward.Profile({});
					var account = new BillForward.Account({});

					var testProp = 'sup';
					var testVal = 'yo';
					account[testProp] = testVal;
					account.profile = profile;

					var testDeepProp = 'Walpurgisnacht';
					var testDeepVal = 'grief seed';
					profile[testDeepProp] = testDeepVal;

					var serialized = account.serialize();

					account.should.have.property(testProp).that.equals(testVal);
					serialized.should.have.property(testProp).that.equals(testVal);

					account.profile.should.have.property(testDeepProp).that.equals(testDeepVal);
					serialized.profile.should.have.property(testDeepProp).that.equals(testDeepVal);

					serialized.should.not.have.property('_client').and
					.should.not.have.property('_exemptFromSerialization');

					serialized.should.not.have.property('_exemptFromSerialization').and
					.should.not.have.property('_client');
				});
			});
		});
	});
});