var BillForward = require('../bin/index.js');
var sinon = require("sinon");
var chai = require('chai');
var sinonChai = require("sinon-chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();
var assert = require('assert');
require('mocha-sinon');
var expect = chai.expect;

describe('Client', function () {
    // An example of synchronous testing in Mocha.
    describe('#request', function () {
        it('should naninani', function () {
            //this.timeout(15000);
            var client = BillForward.Client.makeDefault('67e1f077-eac0-47cf-9e89-25570a089763', 'http://local.billforward.net:8080/RestAPI/');
            //assert.equal('Hello World!', hello.sayHello());

            var promise = client.request("POST", "accounts");
            return promise.should.be.fulfilled;
        });
    });
});