var BillForward;
(function (BillForward) {
    var Client = (function () {
        function Client(accessToken, urlRoot) {
            this.accessToken = accessToken;
            this.urlRoot = urlRoot;
        }
        Client.setDefault = function (client) {
            Client.singletonClient = client;
            return Client.singletonClient;
        };
        Client.makeDefault = function (accessToken, urlRoot) {
            var client = new Client(accessToken, urlRoot);
            return Client.setDefault(client);
        };
        Client.prototype.request = function (verb, path, queryParams, json) {
            if (queryParams === void 0) { queryParams = {}; }
            if (json === void 0) { json = {}; }
            var fullPath = this.urlRoot + path;
            var _this = this;
            var deferred = q.defer();
            httpinvoke(fullPath, verb, function (err, body, statusCode, headers) {
                if (err) {
                    _this.errorResponse(err, deferred);
                    return;
                }
                _this.successResponse(body, statusCode, headers, deferred);
            });
            return deferred.promise;
        };
        Client.prototype.successResponse = function (body, statusCode, headers, deferred) {
            if (statusCode === 200) {
                deferred.resolve(body);
                return;
            }
            this.errorResponse(body, deferred);
        };
        Client.prototype.errorResponse = function (err, deferred) {
            deferred.reject(err);
        };
        return Client;
    })();
    BillForward.Client = Client;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Hello = (function () {
        function Hello(opts) {
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
var _ = require('lodash');
var httpinvoke = require('httpinvoke');
var q = require('q');
module.exports = BillForward;
//# sourceMappingURL=index.js.map