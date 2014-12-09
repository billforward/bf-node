var BillForward;
(function (BillForward) {
    var Client = (function () {
        function Client(accessToken, urlRoot) {
            this.accessToken = accessToken;
            this.urlRoot = urlRoot;
        }
        Client.prototype.getAccessToken = function () {
            return this.accessToken;
        };
        Client.prototype.getUrlRoot = function () {
            return this.urlRoot;
        };
        Client.setDefault = function (client) {
            Client.singletonClient = client;
            return Client.singletonClient;
        };
        Client.makeDefault = function (accessToken, urlRoot) {
            var client = new Client(accessToken, urlRoot);
            return Client.setDefault(client);
        };
        Client.getDefaultClient = function () {
            if (!Client.singletonClient) {
                throw 'No default BillForwardClient found; cannot make API requests.';
            }
            return Client.singletonClient;
        };
        Client.prototype.request = function (verb, path, queryParams, json) {
            if (queryParams === void 0) { queryParams = {}; }
            if (json === void 0) { json = {}; }
            var fullPath = this.urlRoot + path;
            var _this = this;
            var deferred = q.defer();
            var callback = function (err, body, statusCode, headers) {
                if (err) {
                    _this.errorResponse(err, deferred);
                    return;
                }
                _this.successResponse(body, statusCode, headers, deferred);
            };
            var headers = {
                'Authorization': 'Bearer ' + this.accessToken
            };
            var options = {
                headers: headers,
                finished: callback
            };
            httpinvoke(fullPath, verb, options);
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
    var BillingEntity = (function () {
        function BillingEntity(options, client) {
            if (options === void 0) { options = {}; }
            if (client === void 0) { client = null; }
            if (!client) {
                client = BillingEntity.getSingletonClient();
            }
            this.setClient(client);
        }
        BillingEntity.prototype.getClient = function () {
            return this._client;
        };
        BillingEntity.prototype.setClient = function (client) {
            this._client = client;
        };
        BillingEntity.getByID = function (id, options, client) {
            if (options === void 0) { options = {}; }
            if (client === void 0) { client = null; }
            if (!client) {
                client = BillingEntity.getSingletonClient();
            }
            var apiRoute = this.getResourcePath().getPath();
            var endpoint = "/" + id;
            var fullRoute = apiRoute + endpoint;
            return client.request("GET", fullRoute);
        };
        BillingEntity.getResourcePath = function () {
            return this._resourcePath;
        };
        BillingEntity.getSingletonClient = function () {
            return BillForward.Client.getDefaultClient();
            ;
        };
        return BillingEntity;
    })();
    BillForward.BillingEntity = BillingEntity;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var ResourcePath = (function () {
        function ResourcePath(path, entityName) {
            this.path = path;
            this.entityName = entityName;
        }
        ResourcePath.prototype.getPath = function () {
            return this.path;
        };
        ResourcePath.prototype.getEntityName = function () {
            return this.entityName;
        };
        return ResourcePath;
    })();
    BillForward.ResourcePath = ResourcePath;
})(BillForward || (BillForward = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BillForward;
(function (BillForward) {
    var Account = (function (_super) {
        __extends(Account, _super);
        function Account() {
            _super.call(this);
        }
        Account._resourcePath = new BillForward.ResourcePath('accounts', 'account');
        return Account;
    })(BillForward.BillingEntity);
    BillForward.Account = Account;
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