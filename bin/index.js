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
        Client.handlePromiseError = function (err, deferred) {
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
            this._exemptFromSerialization = ['_client', '_exemptFromSerialization', '_registeredEntities', '_registeredEntityArrays'];
            this._registeredEntities = {};
            this._registeredEntityArrays = {};
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
                entityClass.getFirstEntityFromResponse(payload, client, deferred);
            }).catch(function (err) {
                BillForward.Client.handlePromiseError(err, deferred);
            });
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
        BillingEntity.prototype.registerEntity = function (key, entityClass) {
            this._registeredEntities[key] = entityClass;
        };
        BillingEntity.prototype.registerEntityArray = function (key, entityClass) {
            this._registeredEntityArrays[key] = entityClass;
        };
        BillingEntity.prototype.getDerivedClass = function () {
            return this;
        };
        BillingEntity.prototype.serialize = function () {
            var serial = {};
            var pruned = BillForward.Imports._.omit(this, this._exemptFromSerialization);
            var serialized = BillForward.Imports._.mapValues(pruned, function (value) {
                if (!value)
                    return false;
                if (value.serialize) {
                    return value.serialize();
                }
                return value;
            });
            return serialized;
        };
        BillingEntity.prototype.toString = function () {
            return JSON.stringify(this.serialize(), null, "\t");
        };
        BillingEntity.prototype.unserialize = function (json) {
            for (var key in json) {
                var value = json[key];
                this.addToEntity(key, value);
            }
        };
        BillingEntity.prototype.addToEntity = function (key, value) {
            var unserializedValue;
            if (BillForward.Imports._.has(this._registeredEntities, key)) {
                var entityClass = this._registeredEntities[key];
                unserializedValue = this.buildEntity(entityClass, value);
            }
            else if (BillForward.Imports._.contains(this._registeredEntityArrays, key)) {
                var entityClass = this._registeredEntityArrays[key];
                unserializedValue = this.buildEntityArray(entityClass, value);
            }
            else {
                unserializedValue = value;
            }
            this[key] = unserializedValue;
        };
        BillingEntity.prototype.buildEntity = function (entityClass, constructArgs) {
            var client = this.getClient();
            var newEntity = new entityClass(constructArgs, client);
            return newEntity;
        };
        BillingEntity.prototype.buildEntityArray = function (entityClass, constructArgs) {
            var client = this.getClient();
            var entities = BillForward.Imports._.map(constructArgs, this.buildEntity);
            return entities;
        };
        BillingEntity.getFirstEntityFromResponse = function (payload, client, deferred) {
            try {
                if (payload.results.length < 1) {
                    deferred.reject("No results returned upon API request.");
                    return;
                }
            }
            catch (e) {
                deferred.reject("Received malformed response from API.");
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
                return;
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
            }).catch(function (err) {
                BillForward.Client.handlePromiseError(err, deferred);
            });
            return deferred.promise;
        };
        return InsertableEntity;
    })(BillForward.BillingEntity);
    BillForward.InsertableEntity = InsertableEntity;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var MutableEntity = (function (_super) {
        __extends(MutableEntity, _super);
        function MutableEntity() {
            _super.apply(this, arguments);
        }
        return MutableEntity;
    })(BillForward.InsertableEntity);
    BillForward.MutableEntity = MutableEntity;
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
        function Account(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntity('profile', BillForward.Profile);
            this.unserialize(stateParams);
        }
        Account._resourcePath = new BillForward.ResourcePath('accounts', 'account');
        return Account;
    })(BillForward.MutableEntity);
    BillForward.Account = Account;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Address = (function (_super) {
        __extends(Address, _super);
        function Address(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        Address._resourcePath = new BillForward.ResourcePath('addresses', 'address');
        return Address;
    })(BillForward.MutableEntity);
    BillForward.Address = Address;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Profile = (function (_super) {
        __extends(Profile, _super);
        function Profile(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntityArray('addresses', BillForward.Address);
            this.unserialize(stateParams);
        }
        Profile._resourcePath = new BillForward.ResourcePath('profiles', 'profile');
        return Profile;
    })(BillForward.MutableEntity);
    BillForward.Profile = Profile;
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