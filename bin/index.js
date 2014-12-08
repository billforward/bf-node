///<reference path='../../typings/tsd.d.ts' />
var BillForward;
(function (BillForward) {
    var Client = (function () {
        function Client(accessToken, urlRoot) {
            this.accessToken = accessToken;
            this.urlRoot = urlRoot;
        }
        Client.setDefaultClient = function (client) {
            Client.singletonClient = client;
            return Client.singletonClient;
        };
        Client.prototype.request = function (verb, path, queryParams, json) {
            if (queryParams === void 0) { queryParams = {}; }
            if (json === void 0) { json = {}; }
            var parsed = url.parse(path);
            var protocol = parsed.protocol;
            /*var client;
            switch (protocol) {
              case "http:":
              case "https:":
                client =
                client = http;
              } === ) {
      
            }
            var client =
      
            var options = {
              host: parsed.hostname,
              port: parsed.port,
              pathname: parsed.pathname,
              method: verb
            };
      
            var req = http.request(options, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });*/
        };
        return Client;
    })();
    BillForward.Client = Client;
})(BillForward || (BillForward = {}));
///<reference path='../../typings/tsd.d.ts' />
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
var _ = require('lodash');
var http = require('http');
var https = require('https');
var url = require('url');
module.exports = BillForward;
//# sourceMappingURL=index.js.map