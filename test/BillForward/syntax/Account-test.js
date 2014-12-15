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
				describe('the entity', function() {
					it('should have expected properties', function () {
						var serialized = model.serialize();

						model.should.have.property(testProp).that.equals(testVal);
						serialized.should.have.property(testProp).that.equals(testVal);
					});
					it('should not have unexpected properties', function () {
						var serialized = model.serialize();

						serialized.should.not.have.property('_client').and
						.should.not.have.property('_exemptFromSerialization');
					});
				});
			});
			context('with nested entity', function() {
				var testProp = 'sup';
				var testVal = 'yo';

				var testDeepProp = 'Walpurgisnacht';
				var testDeepVal = 'grief seed';

				var model;
				var serialized;
				before(function() {
					var profile = new BillForward.Profile();
					var account = new BillForward.Account({
						'profile': profile
					});
					
					account[testProp] = testVal;
					profile[testDeepProp] = testDeepVal;

					model = account;
					serialized = model.serialize();
				});
				describe('the parent entity', function() {
					it('should have expected properties', function () {
						model.should.have.property(testProp).that.equals(testVal);
						serialized.should.have.property(testProp).that.equals(testVal);

						model.should.have.property('profile').that
						.is.an.instanceof(BillForward.Profile).and
						.with.property('serialize');
					});
					it('should not have unexpected properties', function () {
						serialized.should.not.have.property('_client').and
						.should.not.have.property('_exemptFromSerialization').and
						.should.not.have.property('_registeredEntities').and
						.should.not.have.property('_registeredEntityArrays');
					});
				});
				describe('the nested entity', function() {
					it('should have expected properties', function () {
						serialized.profile.should.have.property(testDeepProp).that.equals(testDeepVal);
					});
					it('should not have unexpected properties', function () {
						serialized.profile.should.not.have.property('_client').and
						.should.not.have.property('_exemptFromSerialization').and
						.should.not.have.property('_registeredEntities').and
						.should.not.have.property('_registeredEntityArrays');
					});
				});
				describe('the deeply nested entity', function() {
					var deepSerialized;
					before(function() {
						deepSerialized = model.profile.serialize();
					});
					it('should have expected properties', function () {
						serialized.profile.should.have.property(testDeepProp).that.equals(testDeepVal);
					});
					it('should not have unexpected properties', function () {
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
});