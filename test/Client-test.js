var BillForward = require('../bin/index.js');
var sinon = require("sinon");
var assert = require('assert');

describe('Client', function () {
    // An example of synchronous testing in Mocha.
    describe('#request', function () {
        it('should naninani', function () {
            var client = BillForward.Client.makeDefault('67e1f077-eac0-47cf-9e89-25570a089763', 'http://local.billforward.net:8080/RestAPI/');
            //assert.equal('Hello World!', hello.sayHello());

            client.request("accounts")
        });
    });
});