var testBase = require('./_test-base');

var BillForward = testBase.BillForward;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('#new', function () {
			context('blank entity', function() {
				var testProp = 'sup';
				var testVal = 'yo';

				var model;
				before(function() {
					var account = new BillForward.Account();
					
					account[testProp] = testVal;

					model = account;
				});
				it('should serialize correctly', function () {
					var serialized = model.serialize();

					model.should.have.property(testProp).that.equals(testVal);
					serialized.should.have.property(testProp).that.equals(testVal);

					serialized.should.not.have.property('_client').and
					.should.not.have.property('_exemptFromSerialization');
				});
			});
			context('nested entity', function() {
				var testProp = 'sup';
				var testVal = 'yo';

				var testDeepProp = 'Walpurgisnacht';
				var testDeepVal = 'grief seed';

				var model;
				before(function() {
					var profile = new BillForward.Profile();
					var account = new BillForward.Account({
						'profile': profile
					});
					
					account[testProp] = testVal;
					profile[testDeepProp] = testDeepVal;

					model = account;
				});
				it('should serialize correctly', function () {
					var serialized = model.serialize();

					model.should.have.property(testProp).that.equals(testVal);
					serialized.should.have.property(testProp).that.equals(testVal);

					model.should.have.property('profile').that
					.is.an.instanceof(BillForward.Profile).and
					.with.property('serialize');

					serialized.profile.should.have.property(testDeepProp).that.equals(testDeepVal);

					serialized.should.not.have.property('_client').and
					.should.not.have.property('_exemptFromSerialization').and
					.should.not.have.property('_registeredEntities').and
					.should.not.have.property('_registeredEntityArrays');

					serialized.profile.should.not.have.property('_client').and
					.should.not.have.property('_exemptFromSerialization').and
					.should.not.have.property('_registeredEntities').and
					.should.not.have.property('_registeredEntityArrays');

					var deepSerialized = model.profile.serialize();

					deepSerialized.should.have.property(testDeepProp).that.equals(testDeepVal);

					deepSerialized.should.not.have.property('_client').and
					.should.not.have.property('_exemptFromSerialization').and
					.should.not.have.property('_registeredEntities').and
					.should.not.have.property('_registeredEntityArrays');
				});
			});
		});
	});
});