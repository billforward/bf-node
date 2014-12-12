var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('#new', function () {
			context('Blank Entity', function() {
				it('should serialize correctly', function () {
					var account = new BillForward.Account({});

					var testProp = 'sup';
					var testVal = 'yo';
					account[testProp] = testVal;

					var serialized = account.serialize();

					account.should.have.property(testProp).that.equals(testVal);
					serialized.should.have.property(testProp).that.equals(testVal);

					serialized.should.not.have.property('_client').and.
					should.not.have.property('_exemptFromSerialization');
				});
			});
			context('Nested Entity', function() {
				it('should serialize correctly', function () {
					var profile = new BillForward.Profile({});
					var account = new BillForward.Account({});

					var testProp = 'sup';
					var testVal = 'yo';
					account[testProp] = testVal;
					account.profile = profile;

					var nestedTestProp = 'Walpurgisnacht';
					var nestedTestVal = 'grief seed';
					profile[nestedTestProp] = nestedTestVal;

					var serialized = account.serialize();

					account.should.have.property(testProp).that.equals(testVal);
					serialized.should.have.property(testProp).that.equals(testVal);

					account.profile.should.have.property(nestedTestProp).that.equals(nestedTestVal);
					serialized.profile.should.have.property(nestedTestProp).that.equals(nestedTestVal);

					serialized.should.not.have.property('_client').and.
					should.not.have.property('_exemptFromSerialization');

					serialized.should.not.have.property('_exemptFromSerialization').and.
					should.not.have.property('_client');
				});
			});
		});
	});
});