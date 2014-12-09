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
            var parsed = url.parse(fullPath);
            var client = parsed.protocol === "http:" ? http : https;
            var options = {
                host: parsed.hostname,
                port: parsed.port,
                pathname: parsed.pathname,
                method: verb
            };
            var deferred = q.defer();
            var req = client.request(options, function (res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                });
            });
            var self = this;
            req.on('response', function (req) {
                self.successResponse(req, deferred);
            });
            req.on('error', function (req) {
                self.errorResponse(req, deferred);
            });
            req.end();
            return deferred.promise;
        };
        Client.prototype.successResponse = function (req, deferred) {
            deferred.resolve(req);
        };
        Client.prototype.errorResponse = function (req, deferred) {
            deferred.reject(req);
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
var http = require('http');
var https = require('https');
var url = require('url');
var q = require('q');
module.exports = BillForward;
//# sourceMappingURL=index.js.map