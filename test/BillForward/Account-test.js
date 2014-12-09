var testBase = require('../test-base.js');

var BillForward = testBase.BillForward;
var client = testBase.client;

describe('Account', function () {
    // An example of synchronous testing in Mocha.
    describe('#getByID', function () {
	    context('not exist', function () {
	        it('should complain', function () {
	            return BillForward.Account.getByID("wup")
	            .should.be.rejected;
	        });
	    });
    });
});