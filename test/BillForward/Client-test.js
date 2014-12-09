var testBase = require('../test-base.js');

var BillForward = testBase.BillForward;
var client = testBase.client;

describe('Client', function () {
    // An example of synchronous testing in Mocha.
    describe('#request', function () {
        it('should naninani', function () {
            return client.request("POST", "accounts")
            .should.be.rejected;
        });
    });
});