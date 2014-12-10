var BillForward;
(function (BillForward) {
    var Client = (function () {
        function Client(accessToken, urlRoot, logging) {
            if (logging === void 0) { logging = false; }
            this.accessToken = accessToken;
            this.urlRoot = urlRoot;
            this.logging = logging;
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
        Client.makeDefault = function (accessToken, urlRoot, logging) {
            if (logging === void 0) { logging = false; }
            var client = new Client(accessToken, urlRoot, logging);
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
            if (verb === 'POST') {
                options.input = json;
                options.inputType = 'json';
                options.headers['Content-Type'] = 'application/json';
            }
            BillForward.Imports.httpinvoke(fullPath, verb, options);
            return deferred.promise;
        };
        Client.prototype.successResponse = function (body, statusCode, headers, deferred) {
            if (statusCode === 200) {
                if (this.logging) {
                    console.log(JSON.stringify(body, null, "\t"));
                }
                deferred.resolve(body);
                return;
            }
            this.errorResponse(body, deferred);
        };
        Client.prototype.errorResponse = function (err, deferred) {
            if (this.logging) {
                console.error(err);
            }
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
            this.unserialize(stateParams);
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
                entityClass.getFirstEntityFromResponse(payload, client, deferred);
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
        BillingEntity.prototype.serialize = function () {
            return {};
        };
        BillingEntity.prototype.unserialize = function (json) {
            for (var key in json) {
                var value = json[key];
                this[key] = value;
            }
        };
        BillingEntity.getFirstEntityFromResponse = function (payload, client, deferred) {
            if (payload.results.length < 1) {
                deferred.reject("No results");
                return;
            }
            var entity;
            try {
                var results = payload.results;
                var assumeFirst = results[0];
                var stateParams = assumeFirst;
                entity = this.makeEntityFromPayload(stateParams, client);
            }
            catch (e) {
                deferred.reject(e);
                return;
            }
            if (!entity) {
                deferred.reject("Failed to unserialize API response into entity.");
            }
            deferred.resolve(entity);
        };
        BillingEntity.makeEntityFromPayload = function (payload, client) {
            return new this(payload, client);
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
        function InsertableEntity(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
        }
        InsertableEntity.create = function (entity) {
            var client = entity.getClient();
            var entityClass = this.getDerivedClassStatic();
            var apiRoute = entityClass.getResourcePath().getPath();
            var endpoint = "/";
            var fullRoute = apiRoute + endpoint;
            var deferred = BillForward.Imports.Q.defer();
            client.request("POST", fullRoute, {}, entity.serialize()).then(function (payload) {
                entityClass.getFirstEntityFromResponse(payload, client, deferred);
            }).done();
            return deferred.promise;
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
            _super.apply(this, arguments);
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
        Imports.httpinvoke = require('httpinvoke');
        Imports.Q = require('q');
        return Imports;
    })();
    BillForward.Imports = Imports;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var MixinHandler = (function () {
        function MixinHandler() {
        }
        MixinHandler.applyMixins = function (derivedCtor, baseCtors) {
            baseCtors.forEach(function (baseCtor) {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                });
            });
        };
        return MixinHandler;
    })();
    BillForward.MixinHandler = MixinHandler;
})(BillForward || (BillForward = {}));
module.exports = BillForward;
//# sourceMappingURL=index.js.map