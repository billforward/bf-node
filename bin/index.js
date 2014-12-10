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
            var deferred = BillForward.Imports.Q.defer();
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
            var converters = {
                'text json': JSON.parse,
                'json text': JSON.stringify
            };
            var options = {
                headers: headers,
                finished: callback,
                outputType: 'json',
                converters: converters
            };
            BillForward.Imports.httpinvoke(fullPath, verb, options);
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
        function BillingEntity(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
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
            var entityClass = this.getDerivedClassStatic();
            var apiRoute = entityClass.getResourcePath().getPath();
            var endpoint = "/" + id;
            var fullRoute = apiRoute + endpoint;
            var deferred = BillForward.Imports.Q.defer();
            client.request("GET", fullRoute).then(function (payload) {
                if (payload.results.length < 1) {
                    deferred.reject("No results");
                    return;
                }
                deferred.resolve(payload);
            }).done();
            return deferred.promise;
        };
        BillingEntity.getResourcePath = function () {
            return this.getDerivedClassStatic()._resourcePath;
        };
        BillingEntity.getSingletonClient = function () {
            return BillForward.Client.getDefaultClient();
            ;
        };
        BillingEntity.getDerivedClassStatic = function () {
            return this;
        };
        BillingEntity.prototype.getDerivedClass = function () {
            return this;
        };
        return BillingEntity;
    })();
    BillForward.BillingEntity = BillingEntity;
})(BillForward || (BillForward = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BillForward;
(function (BillForward) {
    var InsertableEntity = (function (_super) {
        __extends(InsertableEntity, _super);
        function InsertableEntity() {
            _super.call(this);
        }
        InsertableEntity.create = function (entity) {
            var client = entity.getClient();
            var entityClass = this.getDerivedClassStatic();
            var apiRoute = entityClass.getResourcePath().getPath();
            var endpoint = "/";
            var fullRoute = apiRoute + endpoint;
            var deferred = BillForward.Imports.Q.defer();
            client.request("POST", fullRoute).then(function (payload) {
                if (payload.results.length < 1) {
                    deferred.reject("No results");
                    return;
                }
                var entity;
                try {
                    entity = entityClass.makeEntityFromResponse(payload, client, deferred);
                }
                catch (e) {
                    deferred.reject(e);
                    return;
                }
                if (!entity) {
                    deferred.reject("Failed to unserialize API response into entity.");
                }
                deferred.resolve(entity);
            }).done();
            return deferred.promise;
        };
        InsertableEntity.makeEntityFromResponse = function (payload, providedClient, deferred) {
            var entityClass = this.getDerivedClassStatic();
            return new entityClass(payload);
        };
        return InsertableEntity;
    })(BillForward.BillingEntity);
    BillForward.InsertableEntity = InsertableEntity;
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
var BillForward;
(function (BillForward) {
    var Account = (function (_super) {
        __extends(Account, _super);
        function Account() {
            _super.call(this);
        }
        Account._resourcePath = new BillForward.ResourcePath('accounts', 'account');
        return Account;
    })(BillForward.InsertableEntity);
    BillForward.Account = Account;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Imports = (function () {
        function Imports() {
        }
        Imports._ = require('lodash');
        Imports.httpinvoke = require('httpinvoke');
        Imports.Q = require('q');
        return Imports;
    })();
    BillForward.Imports = Imports;
})(BillForward || (BillForward = {}));
module.exports = BillForward;
//# sourceMappingURL=index.js.map