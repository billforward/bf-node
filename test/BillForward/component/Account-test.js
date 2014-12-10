var testBase = require('../../test-base.js');

var BillForward = testBase.BillForward;
var client = testBase.client;

describe('Account', function () {
	describe('::create', function () {
		context('model constructed', function() {
			var model;
			before(function() {
				model = new BillForward.Account({});
			});
			it('should succeed', function () {
				return BillForward.Account.create(model)
				.should.be.fulfilled;
			});
		});
	});
});