///<reference path='../typings/tsd.d.ts' />
var BillForward;
(function (BillForward) {
    var Hello = (function () {
        function Hello(opts) {
            // Underscore's extend functionality is a great
            // way to extend default parameters, with parameters
            // passed in when creating a new instance of a class.
            _.extend(this, {
                helloMessage: 'Hello World!'
            }, opts);
        }
        Hello.prototype.sayHello = function () {
            return this.helloMessage;
        };
        Hello.prototype.sayHelloLater = function (callback) {
            var _this = this;
            setTimeout(function () {
                callback(_this.helloMessage);
            }, 250);
        };
        Hello.prototype.sayHelloThenSayHelloLater = function (callback) {
            this.sayHelloLater(callback);
            return this.sayHello();
        };
        return Hello;
    })();
    BillForward.Hello = Hello;
})(BillForward || (BillForward = {}));
///<reference path='../typings/tsd.d.ts' />
///<reference path='hello.ts' />
var _ = require('underscore');
var BillForward;
(function (BillForward) {
    var Main = (function () {
        function Main() {
            this._h = new BillForward.Hello({});
        }
        return Main;
    })();
    BillForward.Main = Main;
})(BillForward || (BillForward = {}));
module.exports = BillForward;
