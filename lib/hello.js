///<reference path='../typings/tsd.d.ts' />
var _ = require("underscore");
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
module.exports = Hello;
//# sourceMappingURL=hello.js.map