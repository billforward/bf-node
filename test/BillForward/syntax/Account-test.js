var testBase = require('../../test-base.js');

var BillForward = testBase.BillForward;

describe('Account', function () {
	describe('#new', function () {
		it('should succeed', function () {
			var account = new BillForward.Account({});
		});
	});
});