var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BillForward;
(function (BillForward) {
    var Client = (function () {
        function Client(accessToken, urlRoot, requestLogging, responseLogging, errorLogging, longStack) {
            if (requestLogging === void 0) { requestLogging = false; }
            if (responseLogging === void 0) { responseLogging = false; }
            if (errorLogging === void 0) { errorLogging = false; }
            if (longStack === void 0) { longStack = false; }
            this.accessToken = accessToken;
            this.urlRoot = urlRoot;
            this.requestLogging = requestLogging;
            this.responseLogging = responseLogging;
            this.errorLogging = errorLogging;
            BillForward.Imports.Q.longStackSupport = longStack;
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
        Client.makeDefault = function (accessTokenOrObj, urlRoot, requestLogging, responseLogging, errorLogging, longStack) {
            var _accessToken;
            var _urlRoot;
            var _responseLogging = false;
            var _requestLogging = false;
            var _errorLogging = false;
            var _longStack = false;
            if (typeof accessTokenOrObj === 'string') {
                _accessToken = accessTokenOrObj;
                _urlRoot = urlRoot;
                if (requestLogging)
                    _requestLogging = requestLogging;
                if (responseLogging)
                    _responseLogging = responseLogging;
                if (errorLogging)
                    _errorLogging = errorLogging;
                if (longStack)
                    _longStack = longStack;
            }
            else {
                var obj = accessTokenOrObj;
                _accessToken = obj.accessToken;
                _urlRoot = obj.urlRoot;
                if (obj.requestLogging)
                    _requestLogging = obj.requestLogging;
                if (obj.responseLogging)
                    _responseLogging = obj.responseLogging;
                if (obj.errorLogging)
                    _errorLogging = obj.errorLogging;
                if (obj.longStack)
                    _longStack = obj.longStack;
            }
            var client = new Client(_accessToken, _urlRoot, _requestLogging, _responseLogging, _errorLogging, _longStack);
            return Client.setDefault(client);
        };
        Client.getDefaultClient = function () {
            if (!Client.singletonClient) {
                throw new BillForward.BFInvocationError("No default BillForwardClient found; cannot make API requests.");
            }
            return Client.singletonClient;
        };
        Client.prototype.request = function (verb, path, queryParams, json) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (json === void 0) { json = {}; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var queryString = "";
                    if (!BillForward.Imports._.isEmpty(queryParams)) {
                        queryString = "?" + BillForward.Imports._.map(queryParams, function (value, key) {
                            return encodeURIComponent(key) + "=" + encodeURIComponent(value);
                        }).join("&");
                    }
                    var fullPath = _this.urlRoot + path + queryString;
                    if (_this.requestLogging) {
                        console.log(fullPath);
                    }
                    var headers = {
                        'Authorization': 'Bearer ' + _this.accessToken
                    };
                    var options = {
                        headers: headers
                    };
                    if (_this.requestLogging) {
                        console.log(JSON.stringify(json, null, "\t"));
                    }
                    var callVerb = verb.toLowerCase();
                    var callArgs = [fullPath, options];
                    if (verb === 'POST' || verb === 'PUT') {
                        options.headers['Content-Type'] = 'application/json;charset=utf-8';
                        options.data = JSON.stringify(json || {});
                    }
                    return Client.mockableRequestWrapper(callVerb, callArgs)
                        .catch(function (obj) {
                        return _this.errorResponse(obj);
                    })
                        .then(function (obj) {
                        var success = _this.successResponse(obj);
                        return resolve(success);
                    })
                        .catch(function (obj) {
                        return reject(obj);
                    });
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Client.mockableRequestWrapper = function (callVerb, callArgs) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return BillForward.Imports.restler[callVerb].apply(_this, callArgs)
                        .on('success', function (data, response) {
                        return resolve({
                            data: data,
                            response: response
                        });
                    })
                        .on('fail', function (data, response) {
                        return reject({
                            data: data,
                            response: response
                        });
                    });
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Client.prototype.successResponse = function (obj) {
            if (!obj || !obj.data || !obj.response) {
                return this.errorResponse(obj);
            }
            if (obj.response.statusCode === 200) {
                if (this.responseLogging) {
                    console.log(JSON.stringify(obj.data, null, "\t"));
                }
                return obj.data;
            }
            return this.errorResponse(obj);
        };
        Client.prototype.errorResponse = function (input) {
            if (input & input.response && input.response.statusCode !== undefined && input.response.statusCode !== null)
                if (input.response.statusCode !== 200)
                    if (input.response.statusCode === 401) {
                        throw new BillForward.BFUnauthorizedError(input);
                    }
                    else {
                        throw new BillForward.BFHTTPError(input);
                    }
            var raw = input;
            if (input.data)
                raw = input.data;
            var obj = raw;
            var printable = raw;
            if (typeof raw === "string") {
                var jsonParsed;
                try {
                    jsonParsed = JSON.parse(raw);
                    obj = jsonParsed;
                }
                catch (e) {
                }
            }
            if (obj instanceof Object) {
                var stringified;
                try {
                    stringified = JSON.stringify(obj, null, "\t");
                    printable = stringified;
                }
                catch (e) {
                }
            }
            if (this.errorLogging)
                console.error(printable);
            if (obj.errorType === "Oauth")
                throw new BillForward.BFUnauthorizedError(printable);
            throw new BillForward.BFRequestError(printable);
        };
        return Client;
    }());
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
        BillingEntity.resolveRoute = function (endpoint) {
            if (endpoint === void 0) { endpoint = ""; }
            var entityClass = this.getDerivedClassStatic();
            var controller = entityClass.getResourcePath().getPath();
            var fullRoute = BillForward.Imports.util.format("%s/%s", controller, endpoint);
            return fullRoute;
        };
        BillingEntity.makeHttpPromise = function (verb, endpoint, queryParams, payload, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    if (!client) {
                        client = BillingEntity.getSingletonClient();
                    }
                    var myClass = _this.getDerivedClassStatic();
                    var fullRoute = myClass.resolveRoute(endpoint);
                    return resolve(client.request(verb, fullRoute, queryParams, payload));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.makeGetPromise = function (endpoint, queryParams, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.makeHttpPromise("GET", endpoint, queryParams, null, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.makePutPromise = function (endpoint, queryParams, payload, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.makeHttpPromise("PUT", endpoint, queryParams, payload, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.makePostPromise = function (endpoint, queryParams, payload, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.makeHttpPromise("POST", endpoint, queryParams, payload, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.postEntityAndGrabFirst = function (endpoint, queryParams, entity, client, responseEntity) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (responseEntity === void 0) { responseEntity = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var serial = entity.serialize();
                    return resolve(myClass.postAndGrabFirst(endpoint, queryParams, serial, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.postEntityAndGrabCollection = function (endpoint, queryParams, entity, client, responseEntity) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (responseEntity === void 0) { responseEntity = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var serial = entity.serialize();
                    return resolve(myClass.postAndGrabCollection(endpoint, queryParams, serial, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.postAndGrabFirst = function (endpoint, queryParams, payload, client, responseEntity) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (responseEntity === void 0) { responseEntity = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var responseClass = responseEntity.getDerivedClass();
                    return resolve(myClass.makePostPromise(endpoint, queryParams, payload, client)
                        .then(function (payload) {
                        return responseClass.getFirstEntityFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.postAndGrabCollection = function (endpoint, queryParams, payload, client, responseEntity) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (responseEntity === void 0) { responseEntity = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var responseClass = responseEntity.getDerivedClass();
                    return resolve(myClass.makePostPromise(endpoint, queryParams, payload, client)
                        .then(function (payload) {
                        return responseClass.getAllEntitiesFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.getAndGrabFirst = function (endpoint, queryParams, client, responseEntity) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (responseEntity === void 0) { responseEntity = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var responseClass = responseEntity ? responseEntity.getDerivedClass() : myClass;
                    return resolve(myClass.makeGetPromise(endpoint, queryParams, client)
                        .then(function (payload) {
                        return responseClass.getFirstEntityFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.getAndGrabCollection = function (endpoint, queryParams, client, responseEntity) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (responseEntity === void 0) { responseEntity = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var responseClass = responseEntity ? responseEntity.getDerivedClass() : myClass;
                    return resolve(myClass.makeGetPromise(endpoint, queryParams, client)
                        .then(function (payload) {
                        return responseClass.getAllEntitiesFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.getByID = function (id, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var endpoint = BillForward.Imports.util.format("%s", encodeURIComponent(id));
                    return resolve(myClass.getAndGrabFirst(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.getAll = function (queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var myClass = _this.getDerivedClassStatic();
                    var endpoint = "";
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
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
            return this.constructor;
        };
        BillingEntity.serializeProperty = function (value) {
            if (value instanceof Array) {
                return BillForward.Imports._.map(value, BillingEntity.serializeProperty);
            }
            if (value instanceof BillingEntity) {
                return value.serialize();
            }
            return value;
        };
        BillingEntity.prototype.serialize = function () {
            var pruned = BillForward.Imports._.omit(this, this._exemptFromSerialization);
            var pruned = BillForward.Imports._.omit(pruned, function (property) {
                return property instanceof Function;
            });
            var serialized = BillForward.Imports._.mapValues(pruned, BillingEntity.serializeProperty);
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
            else if (BillForward.Imports._.includes(this._registeredEntityArrays, key)) {
                var entityClass = this._registeredEntityArrays[key];
                unserializedValue = this.buildEntityArray(entityClass, value);
            }
            else {
                unserializedValue = value;
            }
            this[key] = unserializedValue;
        };
        BillingEntity.prototype.buildEntity = function (entityClass, constructArgs) {
            if (constructArgs instanceof entityClass) {
                return constructArgs;
            }
            var constructArgsType = typeof constructArgs;
            if (constructArgsType !== 'object') {
                throw new BillForward.BFInvocationError(BillForward.Imports.util.format("Expected either a property map or an entity of type '%s'. Instead received: '%s'; %s", entityClass, constructArgsType, constructArgs));
            }
            var client = this.getClient();
            var newEntity = entityClass.makeEntityFromPayload(constructArgs, client);
            return newEntity;
        };
        BillingEntity.prototype.buildEntityArray = function (entityClass, constructArgs) {
            var client = this.getClient();
            var entities = BillForward.Imports._.map(constructArgs, this.buildEntity);
            return entities;
        };
        BillingEntity.getFirstEntityFromResponse = function (payload, client) {
            if (!payload.results || payload.results.length === undefined || payload.results.length === null)
                throw new BillForward.BFMalformedAPIResponseError("Received malformed response from API.");
            if (payload.results.length < 1)
                throw new BillForward.BFNoResultsError("No results returned upon API request.");
            var entity;
            var results = payload.results;
            var assumeFirst = results[0];
            var stateParams = assumeFirst;
            var entityClass = this.getDerivedClassStatic();
            entity = entityClass.makeEntityFromPayload(stateParams, client);
            if (!entity)
                throw new BillForward.BFResponseUnserializationFailure("Failed to unserialize API response into entity.");
            return entity;
        };
        BillingEntity.getAllEntitiesFromResponse = function (payload, client) {
            var _this = this;
            if (!payload.results || payload.results.length === undefined || payload.results.length === null)
                throw new BillForward.BFMalformedAPIResponseError("Received malformed response from API.");
            if (payload.results.length < 1)
                throw new BillForward.BFNoResultsError("No results returned upon API request.");
            var entities;
            var results = payload.results;
            entities = BillForward.Imports._.map(results, function (value) {
                var entityClass = _this.getDerivedClassStatic();
                var entity = entityClass.makeEntityFromPayload(value, client);
                if (!entity)
                    throw new BillForward.BFResponseUnserializationFailure("Failed to unserialize API response into entity.");
                return entity;
            });
            if (!entities)
                throw new BillForward.BFResponseUnserializationFailure("Failed to unserialize API response into entity.");
            return entities;
        };
        BillingEntity.makeEntityFromPayload = function (payload, client) {
            var entityClass = this.getDerivedClassStatic();
            return new entityClass(payload, client);
        };
        BillingEntity.fetchIfNecessary = function (entityReference) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var entityClass = _this.getDerivedClassStatic();
                    if (typeof entityReference === "string") {
                        return resolve(entityClass.getByID(entityReference));
                    }
                    if (entityReference instanceof entityClass) {
                        return resolve(entityReference);
                    }
                    throw new BillForward.BFInvocationError("Cannot fetch entity; referenced entity is neither an ID, nor an object extending the desired entity class.");
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        BillingEntity.getIdentifier = function (entityReference) {
            if (typeof entityReference === "string") {
                return entityReference;
            }
            var entityClass = this.getDerivedClassStatic();
            if (entityReference instanceof entityClass) {
                return entityReference.id;
            }
            throw new BillForward.BFInvocationError("Cannot get identifier of referenced entity; referenced entity is neither an ID, nor an object extending the desired entity class.");
        };
        BillingEntity.makeBillForwardDate = function (date) {
            var asISO = date.toISOString();
            var removeMilli = asISO.slice(0, -5) + "Z";
            return removeMilli;
        };
        BillingEntity.getBillForwardNow = function () {
            var now = new Date();
            var entityClass = this.getDerivedClassStatic();
            return entityClass.makeBillForwardDate(now);
        };
        return BillingEntity;
    }());
    BillForward.BillingEntity = BillingEntity;
})(BillForward || (BillForward = {}));
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
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var entityClass = _this.getDerivedClassStatic();
                    var client = entity.getClient();
                    var payload = entity.serialize();
                    return resolve(entityClass.makePostPromise("", null, payload, client)
                        .then(function (payload) {
                        return entityClass.getFirstEntityFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        return InsertableEntity;
    }(BillForward.BillingEntity));
    BillForward.InsertableEntity = InsertableEntity;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var MutableEntity = (function (_super) {
        __extends(MutableEntity, _super);
        function MutableEntity(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
        }
        MutableEntity.prototype.save = function () {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var entityClass = _this.getDerivedClass();
                    var client = _this.getClient();
                    var payload = _this.serialize();
                    return resolve(entityClass.makePutPromise("", null, payload, client)
                        .then(function (payload) {
                        return entityClass.getFirstEntityFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        return MutableEntity;
    }(BillForward.InsertableEntity));
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
    }());
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
            this.registerEntityArray('roles', BillForward.Role);
            this.registerEntityArray('paymentMethods', BillForward.PaymentMethod);
            this.registerEntity('profile', BillForward.Profile);
            this.unserialize(stateParams);
        }
        Account.prototype.issueCredit = function (value, currency, description) {
            var _this = this;
            if (currency === void 0) { currency = null; }
            if (description === void 0) { description = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var creditNote = BillForward.CreditNote.construct(value, currency, description);
                    return resolve(creditNote.issueToAccount(_this));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Account._resourcePath = new BillForward.ResourcePath('accounts', 'account');
        return Account;
    }(BillForward.MutableEntity));
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
    }(BillForward.MutableEntity));
    BillForward.Address = Address;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var CreditNote = (function (_super) {
        __extends(CreditNote, _super);
        function CreditNote(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        CreditNote.construct = function (value, currency, description) {
            if (currency === void 0) { currency = null; }
            if (description === void 0) { description = null; }
            var stateParams = {
                nominalValue: value,
            };
            if (currency) {
                stateParams.currency = currency;
            }
            if (description) {
                stateParams.description = description;
            }
            return new CreditNote(stateParams);
        };
        CreditNote.prototype.issueToSubscription = function (subscription) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var requestEntity = _this;
                    var endpoint = BillForward.Imports.util.format("%s/credit", encodeURIComponent(BillForward.Subscription.getIdentifier(subscription)));
                    var responseEntity = new CreditNote();
                    var client = requestEntity.getClient();
                    return resolve(BillForward.Subscription.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        CreditNote.prototype.issueToAccount = function (account) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var requestEntity = _this;
                    var endpoint = BillForward.Imports.util.format("%s/credit", encodeURIComponent(BillForward.Account.getIdentifier(account)));
                    var responseEntity = new CreditNote();
                    var client = requestEntity.getClient();
                    return resolve(BillForward.Account.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        CreditNote._resourcePath = new BillForward.ResourcePath('credit-notes', 'creditNote');
        return CreditNote;
    }(BillForward.MutableEntity));
    BillForward.CreditNote = CreditNote;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PaymentMethod = (function (_super) {
        __extends(PaymentMethod, _super);
        function PaymentMethod(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        PaymentMethod._resourcePath = new BillForward.ResourcePath('payment-methods', 'paymentMethod');
        return PaymentMethod;
    }(BillForward.MutableEntity));
    BillForward.PaymentMethod = PaymentMethod;
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
    }(BillForward.MutableEntity));
    BillForward.Profile = Profile;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Role = (function (_super) {
        __extends(Role, _super);
        function Role(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        return Role;
    }(BillForward.InsertableEntity));
    BillForward.Role = Role;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Amendment = (function (_super) {
        __extends(Amendment, _super);
        function Amendment(stateParams, client, skipUnserialize) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            if (skipUnserialize === void 0) { skipUnserialize = false; }
            _super.call(this, stateParams, client);
            if (!skipUnserialize)
                this.unserialize(stateParams);
        }
        Amendment.prototype.applyType = function (type) {
            this['@type'] = type;
        };
        Amendment.getBySubscription = function (subscription, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("subscription/%s", encodeURIComponent(BillForward.Subscription.getIdentifier(subscription)));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Amendment.prototype.discard = function (actioningTime) {
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.AmendmentDiscardAmendment.construct(this, actioningTime)
                .then(function (amendment) {
                return BillForward.AmendmentDiscardAmendment.create(amendment);
            });
        };
        Amendment.parseActioningTime = function (actioningTime, subscription) {
            if (subscription === void 0) { subscription = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var date = null;
                    if (actioningTime instanceof Date) {
                        date = BillForward.BillingEntity.makeBillForwardDate(actioningTime);
                    }
                    else if (actioningTime === 'AtPeriodEnd') {
                        if (!subscription) {
                            throw new BillForward.BFInvocationError("Failed to consult subscription to ascertain AtPeriodEnd time, because a null reference was provided to the subscription.");
                        }
                        return resolve(BillForward.Subscription.fetchIfNecessary(subscription)
                            .then(function (subscription) { return subscription.getCurrentPeriodEnd; }));
                    }
                    return resolve(date);
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Amendment.prototype.applyActioningTime = function (actioningTime, subscription) {
            var _this = this;
            if (subscription === void 0) { subscription = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var entityClass = _this.getDerivedClass();
                    return resolve(entityClass.parseActioningTime(actioningTime, subscription)
                        .then(function (parsedActioningTime) {
                        if (parsedActioningTime !== null) {
                            _this.actioningTime = parsedActioningTime;
                        }
                        return _this;
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Amendment._resourcePath = new BillForward.ResourcePath('amendments', 'amendment');
        return Amendment;
    }(BillForward.InsertableEntity));
    BillForward.Amendment = Amendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var AmendmentDiscardAmendment = (function (_super) {
        __extends(AmendmentDiscardAmendment, _super);
        function AmendmentDiscardAmendment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client, true);
            this.applyType('AmendmentDiscardAmendment');
            this.unserialize(stateParams);
        }
        AmendmentDiscardAmendment.construct = function (amendment, actioningTime) {
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return resolve(BillForward.Amendment.fetchIfNecessary(amendment)
                        .then(function (amendment) {
                        var discardModel = new AmendmentDiscardAmendment({
                            'amendmentToDiscardID': amendment.id,
                            'subscriptionID': amendment.subscriptionID
                        });
                        return discardModel.applyActioningTime(actioningTime, amendment.subscriptionID);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        return AmendmentDiscardAmendment;
    }(BillForward.Amendment));
    BillForward.AmendmentDiscardAmendment = AmendmentDiscardAmendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    (function (ServiceEndState) {
        ServiceEndState[ServiceEndState["AtPeriodEnd"] = 0] = "AtPeriodEnd";
        ServiceEndState[ServiceEndState["Immediate"] = 1] = "Immediate";
    })(BillForward.ServiceEndState || (BillForward.ServiceEndState = {}));
    var ServiceEndState = BillForward.ServiceEndState;
    var CancellationAmendment = (function (_super) {
        __extends(CancellationAmendment, _super);
        function CancellationAmendment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client, true);
            this.applyType('CancellationAmendment');
            this.unserialize(stateParams);
        }
        CancellationAmendment.construct = function (subscription, serviceEnd, actioningTime) {
            if (serviceEnd === void 0) { serviceEnd = ServiceEndState.AtPeriodEnd; }
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return resolve(BillForward.Subscription.fetchIfNecessary(subscription)
                        .then(function (subscription) {
                        var amendment = new CancellationAmendment({
                            'subscriptionID': subscription.id,
                            'serviceEnd': serviceEnd
                        });
                        return amendment.applyActioningTime(actioningTime, subscription);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        return CancellationAmendment;
    }(BillForward.Amendment));
    BillForward.CancellationAmendment = CancellationAmendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    (function (InvoiceState) {
        InvoiceState[InvoiceState["Paid"] = 0] = "Paid";
        InvoiceState[InvoiceState["Unpaid"] = 1] = "Unpaid";
        InvoiceState[InvoiceState["Pending"] = 2] = "Pending";
        InvoiceState[InvoiceState["Voided"] = 3] = "Voided";
    })(BillForward.InvoiceState || (BillForward.InvoiceState = {}));
    var InvoiceState = BillForward.InvoiceState;
    (function (InvoiceRecalculationBehaviour) {
        InvoiceRecalculationBehaviour[InvoiceRecalculationBehaviour["RecalculateAsLatestSubscriptionVersion"] = 0] = "RecalculateAsLatestSubscriptionVersion";
        InvoiceRecalculationBehaviour[InvoiceRecalculationBehaviour["RecalculateAsCurrentSubscriptionVersion"] = 1] = "RecalculateAsCurrentSubscriptionVersion";
    })(BillForward.InvoiceRecalculationBehaviour || (BillForward.InvoiceRecalculationBehaviour = {}));
    var InvoiceRecalculationBehaviour = BillForward.InvoiceRecalculationBehaviour;
    var InvoiceRecalculationAmendment = (function (_super) {
        __extends(InvoiceRecalculationAmendment, _super);
        function InvoiceRecalculationAmendment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client, true);
            this.applyType('InvoiceRecalculationAmendment');
            this.unserialize(stateParams);
        }
        InvoiceRecalculationAmendment.construct = function (invoice, newInvoiceState, recalculationBehaviour, actioningTime) {
            if (newInvoiceState === void 0) { newInvoiceState = InvoiceState.Pending; }
            if (recalculationBehaviour === void 0) { recalculationBehaviour = InvoiceRecalculationBehaviour.RecalculateAsLatestSubscriptionVersion; }
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return resolve(BillForward.Invoice.fetchIfNecessary(invoice)
                        .then(function (invoice) {
                        var amendment = new InvoiceRecalculationAmendment({
                            'invoiceID': invoice.id,
                            'subscriptionID': invoice.subscriptionID
                        });
                        amendment.recalculationBehaviour = recalculationBehaviour;
                        amendment.newInvoiceState = newInvoiceState;
                        return amendment.applyActioningTime(actioningTime, invoice.subscriptionID);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        return InvoiceRecalculationAmendment;
    }(BillForward.Amendment));
    BillForward.InvoiceRecalculationAmendment = InvoiceRecalculationAmendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var IssueInvoiceAmendment = (function (_super) {
        __extends(IssueInvoiceAmendment, _super);
        function IssueInvoiceAmendment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client, true);
            this.applyType('IssueInvoiceAmendment');
            this.unserialize(stateParams);
        }
        IssueInvoiceAmendment.construct = function (invoice, actioningTime) {
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return resolve(BillForward.Invoice.fetchIfNecessary(invoice)
                        .then(function (invoice) {
                        var amendment = new IssueInvoiceAmendment({
                            'invoiceID': invoice.id,
                            'subscriptionID': invoice.subscriptionID
                        });
                        return amendment.applyActioningTime(actioningTime, invoice.subscriptionID);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        return IssueInvoiceAmendment;
    }(BillForward.Amendment));
    BillForward.IssueInvoiceAmendment = IssueInvoiceAmendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var ProductRatePlanMigrationAmendment = (function (_super) {
        __extends(ProductRatePlanMigrationAmendment, _super);
        function ProductRatePlanMigrationAmendment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client, true);
            this.applyType('ProductRatePlanMigrationAmendment');
            this.unserialize(stateParams);
        }
        return ProductRatePlanMigrationAmendment;
    }(BillForward.Amendment));
    BillForward.ProductRatePlanMigrationAmendment = ProductRatePlanMigrationAmendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Coupon = (function (_super) {
        __extends(Coupon, _super);
        function Coupon(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        Coupon.prototype.getBaseCode = function () {
            if (this.parentCouponCode) {
                return this.parentCouponCode;
            }
            return this.couponCode;
        };
        Coupon.prototype.createUniqueCodes = function (quantity, client) {
            if (client === void 0) { client = null; }
            return this.getDerivedClass().createUniqueCodesFromBaseCode(this.getBaseCode(), quantity, client);
        };
        Coupon.prototype.getUnusedUniqueCodes = function (queryParams, client) {
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return this.getDerivedClass().getUnusedUniqueCodesFromBaseCode(this.getBaseCode(), queryParams, client);
        };
        Coupon.prototype.applyToSubscription = function (subscription, client) {
            if (client === void 0) { client = null; }
            return this.getDerivedClass().applyCouponCodeToSubscription(this.getBaseCode(), subscription, client);
        };
        Coupon.applyCouponCodeToSubscription = function (couponCode, subscription, client) {
            if (client === void 0) { client = null; }
            return BillForward.AddCouponCodeRequest.applyCouponCodeToSubscription(couponCode, subscription, client);
        };
        Coupon.getUnusedUniqueCodesFromBaseCode = function (baseCode, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("%s/codes", encodeURIComponent(baseCode));
                    var responseEntity = new BillForward.CouponUniqueCodesResponse();
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Coupon.createUniqueCodesFromBaseCode = function (baseCode, quantity, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var requestEntity = new Coupon({
                        'quantity': quantity
                    }, client);
                    var endpoint = BillForward.Imports.util.format("%s/codes", encodeURIComponent(baseCode));
                    var responseEntity = new BillForward.CouponUniqueCodesResponse();
                    var client = requestEntity.getClient();
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Coupon._resourcePath = new BillForward.ResourcePath('coupons', 'Coupon');
        return Coupon;
    }(BillForward.MutableEntity));
    BillForward.Coupon = Coupon;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var AddCouponCodeRequest = (function (_super) {
        __extends(AddCouponCodeRequest, _super);
        function AddCouponCodeRequest(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        AddCouponCodeRequest.applyCouponToSubscription = function (coupon, subscription, client) {
            if (client === void 0) { client = null; }
            return this.getDerivedClassStatic().applyCouponCodeToSubscription(coupon.getBaseCode(), subscription, client);
        };
        AddCouponCodeRequest.applyCouponCodeToSubscription = function (couponCode, subscription, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var requestEntity = new BillForward.Coupon({
                        couponCode: couponCode
                    }, client);
                    var subscriptionIdentifier = BillForward.Subscription.getIdentifier(subscription);
                    var endpoint = BillForward.Imports.util.format("%s/coupons", encodeURIComponent(subscriptionIdentifier));
                    var responseEntity = new BillForward.Coupon();
                    var client = requestEntity.getClient();
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        AddCouponCodeRequest._resourcePath = new BillForward.ResourcePath('subscriptions', 'AddCouponCodeRequest');
        return AddCouponCodeRequest;
    }(BillForward.BillingEntity));
    BillForward.AddCouponCodeRequest = AddCouponCodeRequest;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var CouponUniqueCodesResponse = (function (_super) {
        __extends(CouponUniqueCodesResponse, _super);
        function CouponUniqueCodesResponse(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        CouponUniqueCodesResponse.prototype.getBaseCode = function () {
            return this.couponCode;
        };
        CouponUniqueCodesResponse.prototype.applyToSubscription = function (subscription, client) {
            if (client === void 0) { client = null; }
            return BillForward.Coupon.applyCouponCodeToSubscription(this.getBaseCode(), subscription, client);
        };
        return CouponUniqueCodesResponse;
    }(BillForward.BillingEntity));
    BillForward.CouponUniqueCodesResponse = CouponUniqueCodesResponse;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Invoice = (function (_super) {
        __extends(Invoice, _super);
        function Invoice(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntityArray('invoiceLines', BillForward.InvoiceLine);
            this.registerEntityArray('taxLines', BillForward.TaxLine);
            this.registerEntityArray('invoicePayments', BillForward.InvoicePayment);
            this.unserialize(stateParams);
        }
        Invoice.getForSubscription = function (subscription, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var subscriptionIdentifier = BillForward.Subscription.getIdentifier(subscription);
                    var endpoint = BillForward.Imports.util.format("subscription/%s", encodeURIComponent(subscriptionIdentifier));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Invoice.getForSubscriptionVersion = function (subscriptionVersionID, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("subscription/version/%s", encodeURIComponent(subscriptionVersionID));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Invoice.getForAccount = function (account, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var accountIdentifier = BillForward.Account.getIdentifier(account);
                    var endpoint = BillForward.Imports.util.format("account/%s", encodeURIComponent(accountIdentifier));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Invoice.prototype.modifyUsage = function (componentNamesToValues) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return resolve(BillForward.Subscription.fetchIfNecessary(_this.subscriptionID)
                        .then(function (subscription) {
                        var appliesTil = _this.periodStart;
                        return subscription.modifyUsageHelper(componentNamesToValues, appliesTil);
                    })
                        .then(function () {
                        return _this;
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Invoice.prototype.issue = function (actioningTime) {
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.IssueInvoiceAmendment.construct(this, actioningTime)
                .then(function (amendment) {
                return BillForward.IssueInvoiceAmendment.create(amendment);
            });
        };
        Invoice.prototype.recalculate = function (newInvoiceState, recalculationBehaviour, actioningTime) {
            if (newInvoiceState === void 0) { newInvoiceState = BillForward.InvoiceState.Pending; }
            if (recalculationBehaviour === void 0) { recalculationBehaviour = BillForward.InvoiceRecalculationBehaviour.RecalculateAsLatestSubscriptionVersion; }
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.InvoiceRecalculationAmendment.construct(this, newInvoiceState, recalculationBehaviour, actioningTime)
                .then(function (amendment) {
                return BillForward.InvoiceRecalculationAmendment.create(amendment);
            });
        };
        Invoice.prototype.retryExecution = function (payload) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var invoiceIdentifier = Invoice.getIdentifier(_this);
                    var myClass = _this.getDerivedClass();
                    var client = _this.getClient();
                    return resolve(myClass.makePostPromise(BillForward.Imports.util.format("%s/execute", invoiceIdentifier), null, payload || {}, client)
                        .then(function (payload) {
                        return myClass.getFirstEntityFromResponse(payload, client);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Invoice._resourcePath = new BillForward.ResourcePath('invoices', 'invoice');
        return Invoice;
    }(BillForward.MutableEntity));
    BillForward.Invoice = Invoice;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var InvoiceLine = (function (_super) {
        __extends(InvoiceLine, _super);
        function InvoiceLine(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        return InvoiceLine;
    }(BillForward.MutableEntity));
    BillForward.InvoiceLine = InvoiceLine;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var InvoicePayment = (function (_super) {
        __extends(InvoicePayment, _super);
        function InvoicePayment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        return InvoicePayment;
    }(BillForward.MutableEntity));
    BillForward.InvoicePayment = InvoicePayment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var TaxLine = (function (_super) {
        __extends(TaxLine, _super);
        function TaxLine(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        return TaxLine;
    }(BillForward.InsertableEntity));
    BillForward.TaxLine = TaxLine;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var APIConfiguration = (function (_super) {
        __extends(APIConfiguration, _super);
        function APIConfiguration(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        return APIConfiguration;
    }(BillForward.MutableEntity));
    BillForward.APIConfiguration = APIConfiguration;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Organisation = (function (_super) {
        __extends(Organisation, _super);
        function Organisation(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntityArray('apiConfigurations', BillForward.APIConfiguration);
            this.unserialize(stateParams);
        }
        Organisation._resourcePath = new BillForward.ResourcePath('organizations', 'organization');
        return Organisation;
    }(BillForward.MutableEntity));
    BillForward.Organisation = Organisation;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var ComponentChange = (function (_super) {
        __extends(ComponentChange, _super);
        function ComponentChange(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        ComponentChange._resourcePath = new BillForward.ResourcePath('', 'ComponentChange');
        return ComponentChange;
    }(BillForward.MutableEntity));
    BillForward.ComponentChange = ComponentChange;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PricingComponent = (function (_super) {
        __extends(PricingComponent, _super);
        function PricingComponent(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntityArray('tiers', BillForward.PricingComponentTier);
            this.unserialize(stateParams);
        }
        PricingComponent._resourcePath = new BillForward.ResourcePath('pricing-components', 'PricingComponent');
        return PricingComponent;
    }(BillForward.MutableEntity));
    BillForward.PricingComponent = PricingComponent;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PricingComponentTier = (function (_super) {
        __extends(PricingComponentTier, _super);
        function PricingComponentTier(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        PricingComponentTier._resourcePath = new BillForward.ResourcePath('pricing-component-tiers', 'pricingComponentTier');
        return PricingComponentTier;
    }(BillForward.MutableEntity));
    BillForward.PricingComponentTier = PricingComponentTier;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PricingComponentValue = (function (_super) {
        __extends(PricingComponentValue, _super);
        function PricingComponentValue(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        PricingComponentValue._resourcePath = new BillForward.ResourcePath('pricing-component-values', 'PricingComponentValue');
        return PricingComponentValue;
    }(BillForward.MutableEntity));
    BillForward.PricingComponentValue = PricingComponentValue;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PricingComponentValueChange = (function (_super) {
        __extends(PricingComponentValueChange, _super);
        function PricingComponentValueChange(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        PricingComponentValueChange._resourcePath = new BillForward.ResourcePath('pricing-component-value-changes', 'PricingComponentValueChange');
        return PricingComponentValueChange;
    }(BillForward.InsertableEntity));
    BillForward.PricingComponentValueChange = PricingComponentValueChange;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PricingComponentValueMigrationAmendmentMapping = (function (_super) {
        __extends(PricingComponentValueMigrationAmendmentMapping, _super);
        function PricingComponentValueMigrationAmendmentMapping(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        PricingComponentValueMigrationAmendmentMapping._resourcePath = new BillForward.ResourcePath('', 'PricingComponentValueMigrationAmendmentMapping');
        return PricingComponentValueMigrationAmendmentMapping;
    }(BillForward.MutableEntity));
    BillForward.PricingComponentValueMigrationAmendmentMapping = PricingComponentValueMigrationAmendmentMapping;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var UnitOfMeasure = (function (_super) {
        __extends(UnitOfMeasure, _super);
        function UnitOfMeasure(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        UnitOfMeasure._resourcePath = new BillForward.ResourcePath('units-of-measure', 'unitOfMeasure');
        return UnitOfMeasure;
    }(BillForward.MutableEntity));
    BillForward.UnitOfMeasure = UnitOfMeasure;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Product = (function (_super) {
        __extends(Product, _super);
        function Product(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        Product.prototype.getRatePlans = function (queryParams, client) {
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.ProductRatePlan.getForProduct(this, queryParams, client);
        };
        Product._resourcePath = new BillForward.ResourcePath('products', 'product');
        return Product;
    }(BillForward.MutableEntity));
    BillForward.Product = Product;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var ProductRatePlan = (function (_super) {
        __extends(ProductRatePlan, _super);
        function ProductRatePlan(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntityArray('taxation', BillForward.TaxationLink);
            this.registerEntityArray('pricingComponents', BillForward.PricingComponent);
            this.registerEntity('product', BillForward.Product);
            this.unserialize(stateParams);
        }
        ProductRatePlan.prototype.getProduct = function () {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var ref;
                    if (_this.productID)
                        ref = _this.productID;
                    if (_this.product)
                        ref = _this.product;
                    return resolve(BillForward.Product.fetchIfNecessary(ref)
                        .then(function (product) {
                        _this.product = product;
                        return _this.product;
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        ProductRatePlan.getForProduct = function (product, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var productIdentifier = BillForward.Product.getIdentifier(product);
                    var endpoint = BillForward.Imports.util.format("product/%s", encodeURIComponent(productIdentifier));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        ProductRatePlan._resourcePath = new BillForward.ResourcePath('product-rate-plans', 'productRatePlan');
        return ProductRatePlan;
    }(BillForward.MutableEntity));
    BillForward.ProductRatePlan = ProductRatePlan;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var TaxationLink = (function (_super) {
        __extends(TaxationLink, _super);
        function TaxationLink(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        TaxationLink._resourcePath = new BillForward.ResourcePath('taxation-links', 'TaxationLink');
        return TaxationLink;
    }(BillForward.MutableEntity));
    BillForward.TaxationLink = TaxationLink;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var AddChargeRequest = (function (_super) {
        __extends(AddChargeRequest, _super);
        function AddChargeRequest(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        AddChargeRequest.prototype.addToSubscription = function (subscription, client) {
            if (client === void 0) { client = null; }
            var subSham = new BillForward.Subscription({
                "id": BillForward.Subscription.getIdentifier(subscription)
            }, client);
            return subSham.addCharge(this, client);
        };
        AddChargeRequest._resourcePath = new BillForward.ResourcePath('', '');
        return AddChargeRequest;
    }(BillForward.BillingEntity));
    BillForward.AddChargeRequest = AddChargeRequest;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var PaymentMethodSubscriptionLink = (function (_super) {
        __extends(PaymentMethodSubscriptionLink, _super);
        function PaymentMethodSubscriptionLink(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        PaymentMethodSubscriptionLink._resourcePath = new BillForward.ResourcePath('payment-method-subscription-links', 'PaymentMethodSubscriptionLink');
        return PaymentMethodSubscriptionLink;
    }(BillForward.MutableEntity));
    BillForward.PaymentMethodSubscriptionLink = PaymentMethodSubscriptionLink;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    (function (SubscriptionState) {
        SubscriptionState[SubscriptionState["Trial"] = 0] = "Trial";
        SubscriptionState[SubscriptionState["Provisioned"] = 1] = "Provisioned";
        SubscriptionState[SubscriptionState["Paid"] = 2] = "Paid";
        SubscriptionState[SubscriptionState["AwaitingPayment"] = 3] = "AwaitingPayment";
        SubscriptionState[SubscriptionState["Cancelled"] = 4] = "Cancelled";
        SubscriptionState[SubscriptionState["Failed"] = 5] = "Failed";
        SubscriptionState[SubscriptionState["Expired"] = 6] = "Expired";
    })(BillForward.SubscriptionState || (BillForward.SubscriptionState = {}));
    var SubscriptionState = BillForward.SubscriptionState;
    var Subscription = (function (_super) {
        __extends(Subscription, _super);
        function Subscription(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.registerEntityArray('pricingComponentValueChanges', BillForward.PricingComponentValueChange);
            this.registerEntityArray('pricingComponentValues', BillForward.PricingComponentValue);
            this.registerEntityArray('paymentMethodSubscriptionLinks', BillForward.PaymentMethodSubscriptionLink);
            this.registerEntity('productRatePlan', BillForward.ProductRatePlan);
            this.unserialize(stateParams);
        }
        Subscription.getByAccount = function (account, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("account/%s", encodeURIComponent(BillForward.Account.getIdentifier(account)));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.getByState = function (state, queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("state/%s", encodeURIComponent(SubscriptionState[state]));
                    var myClass = _this.getDerivedClassStatic();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.activate = function () {
            this.state = 'AwaitingPayment';
            return this.save();
        };
        Subscription.prototype.cancel = function (serviceEnd, actioningTime) {
            if (serviceEnd === void 0) { serviceEnd = BillForward.ServiceEndState.AtPeriodEnd; }
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            return BillForward.CancellationAmendment.construct(this, serviceEnd, actioningTime)
                .then(function (amendment) {
                return BillForward.CancellationAmendment.create(amendment);
            });
        };
        Subscription.prototype.usePaymentMethodsFromAccountByID = function (accountID) {
            var _this = this;
            return BillForward.Account.getByID(accountID)
                .then(function (account) {
                return _this.usePaymentMethodsFromAccount(account);
            });
        };
        Subscription.prototype.usePaymentMethodsFromAccount = function (account) {
            var _this = this;
            if (account === void 0) { account = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    if (!account) {
                        return resolve(_this.usePaymentMethodsFromAccountByID(_this.accountID));
                    }
                    if (!_this.paymentMethodSubscriptionLinks)
                        _this.paymentMethodSubscriptionLinks = [];
                    BillForward.Imports._.each(_this.paymentMethodSubscriptionLinks, function (paymentMethodSubscriptionLink) {
                        paymentMethodSubscriptionLink.deleted = true;
                    });
                    var newLinks = BillForward.Imports._.map(account.paymentMethods, function (paymentMethod) {
                        return new BillForward.PaymentMethodSubscriptionLink({
                            paymentMethodID: paymentMethod.id
                        });
                    });
                    _this.paymentMethodSubscriptionLinks = _this.paymentMethodSubscriptionLinks.concat(newLinks);
                    return resolve(_this);
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.setValuesOfPricingComponentsByName = function (componentNamesToValues) {
            return this.useValuesForNamedPricingComponentsOnRatePlanByID(this.productRatePlanID, componentNamesToValues);
        };
        Subscription.prototype.useValuesForNamedPricingComponentsOnRatePlanByID = function (ratePlanID, componentNamesToValues) {
            var _this = this;
            return BillForward.ProductRatePlan.getByID(ratePlanID)
                .then(function (ratePlan) {
                return _this.useValuesForNamedPricingComponentsOnRatePlan(ratePlan, componentNamesToValues);
            });
        };
        Subscription.prototype.useValuesForNamedPricingComponentsOnRatePlan = function (ratePlan, componentNamesToValues) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var componentIDsAgainstValues = BillForward.Imports._.map(componentNamesToValues, function (currentValue, currentName) {
                        var matchedComponent = BillForward.Imports._.find(ratePlan.pricingComponents, function (component) {
                            return component.name === currentName;
                        });
                        return new BillForward.PricingComponentValue({
                            pricingComponentID: matchedComponent.id,
                            value: currentValue
                        });
                    });
                    _this.pricingComponentValues = componentIDsAgainstValues;
                    return resolve(_this);
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.getCurrentPeriodStart = function () {
            if (this.currentPeriodStart) {
                return this.currentPeriodStart;
            }
            else {
                throw new BillForward.BFPreconditionFailedError("Cannot set actioning time to period start, because the subscription does not declare a period start. This could mean the subscription is still in the 'Provisioned' state. Alternatively the subscription may not have been instantiated yet by the BillForward engines. You could try again in a few seconds, or wait for a WebHook (Domain 'Subscription', Action 'Updated') whose list of webhook.changes.auditFieldChanges includes an object auditFieldChange, where (auditFieldChange.attributeName === 'currentPeriodEnd').");
            }
        };
        Subscription.prototype.getCurrentPeriodEnd = function () {
            if (this.currentPeriodEnd) {
                return this.currentPeriodEnd;
            }
            else {
                throw new BillForward.BFPreconditionFailedError("Cannot set actioning time to period start, because the subscription does not declare a period start. This could mean the subscription is still in the 'Provisioned' state. Alternatively the subscription may not have been instantiated yet by the BillForward engines. You could try again in a few seconds, or wait for a WebHook (Domain 'Subscription', Action 'Updated') whose list of webhook.changes.auditFieldChanges includes an object auditFieldChange, where (auditFieldChange.attributeName === 'currentPeriodEnd').");
            }
        };
        Subscription.prototype.getRatePlan = function () {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var ref;
                    if (_this.productRatePlanID)
                        ref = _this.productRatePlanID;
                    if (_this.productRatePlan)
                        ref = _this.productRatePlan;
                    return resolve(BillForward.ProductRatePlan.fetchIfNecessary(ref)
                        .then(function (productRatePlan) {
                        _this.productRatePlan = productRatePlan;
                        return _this.productRatePlan;
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.modifyUsage = function (componentNamesToValues) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    return resolve(_this.modifyUsageHelper(componentNamesToValues)
                        .then(function () {
                        return Subscription.getByID(_this.id);
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.modifyUsageHelper = function (componentNamesToValues, appliesTilOverride) {
            var _this = this;
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var appliesTil;
                    if (appliesTilOverride) {
                        appliesTil = appliesTilOverride;
                    }
                    else {
                        var currentPeriodEnd = _this.getCurrentPeriodEnd();
                        appliesTil = currentPeriodEnd;
                    }
                    var supportedChargeTypes = ["usage"];
                    var componentGenerator = function (correspondingComponent, mappedValue) {
                        return new BillForward.PricingComponentValue({
                            pricingComponentID: correspondingComponent.id,
                            value: mappedValue,
                            appliesTill: appliesTil,
                            organizationID: correspondingComponent.organizationID,
                            subscriptionID: _this.id
                        });
                    };
                    return resolve(_this.getRatePlan()
                        .then(function (ratePlan) {
                        var pricingComponents = ratePlan.pricingComponents;
                        return BillForward.Imports.Q.all(BillForward.Imports._.map(BillForward.Imports._.map(BillForward.Imports._.keys(componentNamesToValues), function (key) {
                            var mappedValue = componentNamesToValues[key];
                            var correspondingComponent = BillForward.Imports._.find(pricingComponents, function (pricingComponent) {
                                return pricingComponent.name === key;
                            });
                            if (!correspondingComponent)
                                throw new BillForward.BFInvocationError(BillForward.Imports.util.format("We failed to find any pricing component whose name matches '%s'.", key));
                            if (!BillForward.Imports._.includes(supportedChargeTypes, correspondingComponent.chargeType))
                                throw new BillForward.BFInvocationError(BillForward.Imports.util.format("Matched pricing component has charge type '%s'. must be within supported types: [%s].", correspondingComponent.chargeType, supportedChargeTypes.join(", ")));
                            return componentGenerator(correspondingComponent, mappedValue);
                        }), function (pricingComponentValueModel) {
                            return BillForward.PricingComponentValue.create(pricingComponentValueModel);
                        }));
                    }));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.issueCredit = function (value, description) {
            var _this = this;
            if (description === void 0) { description = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var creditNote = BillForward.CreditNote.construct(value, null, description);
                    return resolve(creditNote.issueToSubscription(_this));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.getCharges = function (queryParams, client) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("%s/charges", encodeURIComponent(Subscription.getIdentifier(_this)));
                    var responseEntity = new BillForward.SubscriptionCharge();
                    var myClass = _this.getDerivedClass();
                    return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription.prototype.addCharge = function (charge, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            return BillForward.Imports.Q.Promise(function (resolve, reject) {
                try {
                    var endpoint = BillForward.Imports.util.format("%s/charge", encodeURIComponent(Subscription.getIdentifier(_this)));
                    var responseEntity = new BillForward.SubscriptionCharge();
                    var myClass = _this.getDerivedClass();
                    return resolve(myClass.postEntityAndGrabCollection(endpoint, {}, charge, client, responseEntity));
                }
                catch (e) {
                    return reject(e);
                }
            });
        };
        Subscription._resourcePath = new BillForward.ResourcePath('subscriptions', 'subscription');
        return Subscription;
    }(BillForward.MutableEntity));
    BillForward.Subscription = Subscription;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var SubscriptionCharge = (function (_super) {
        __extends(SubscriptionCharge, _super);
        function SubscriptionCharge(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        SubscriptionCharge.getBySubscription = function (subscription, queryParams, client) {
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            var subSham = new BillForward.Subscription({
                "id": BillForward.Subscription.getIdentifier(subscription)
            }, client);
            return subSham.getCharges(queryParams, client);
        };
        SubscriptionCharge._resourcePath = new BillForward.ResourcePath('charges', 'subscriptionCharge');
        return SubscriptionCharge;
    }(BillForward.MutableEntity));
    BillForward.SubscriptionCharge = SubscriptionCharge;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var AuthorizeNetToken = (function (_super) {
        __extends(AuthorizeNetToken, _super);
        function AuthorizeNetToken(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        AuthorizeNetToken._resourcePath = new BillForward.ResourcePath('vaulted-gateways/authorize-net', 'authorizeNetToken');
        return AuthorizeNetToken;
    }(BillForward.MutableEntity));
    BillForward.AuthorizeNetToken = AuthorizeNetToken;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var BraintreeToken = (function (_super) {
        __extends(BraintreeToken, _super);
        function BraintreeToken(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        BraintreeToken._resourcePath = new BillForward.ResourcePath('vaulted-gateways/braintree', 'braintree_token');
        return BraintreeToken;
    }(BillForward.MutableEntity));
    BillForward.BraintreeToken = BraintreeToken;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var StripeACHToken = (function (_super) {
        __extends(StripeACHToken, _super);
        function StripeACHToken(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        StripeACHToken._resourcePath = new BillForward.ResourcePath('vaulted-gateways/stripe-ACH', 'stripe_ach_token');
        return StripeACHToken;
    }(BillForward.MutableEntity));
    BillForward.StripeACHToken = StripeACHToken;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var StripeToken = (function (_super) {
        __extends(StripeToken, _super);
        function StripeToken(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        StripeToken._resourcePath = new BillForward.ResourcePath('vaulted-gateways/stripe', 'stripe_token');
        return StripeToken;
    }(BillForward.MutableEntity));
    BillForward.StripeToken = StripeToken;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var TrustCommerceToken = (function (_super) {
        __extends(TrustCommerceToken, _super);
        function TrustCommerceToken(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        TrustCommerceToken._resourcePath = new BillForward.ResourcePath('vaulted-gateways/trustCommerce', 'trustCommerceToken');
        return TrustCommerceToken;
    }(BillForward.MutableEntity));
    BillForward.TrustCommerceToken = TrustCommerceToken;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var BFError = (function (_super) {
        __extends(BFError, _super);
        function BFError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFError';
            this.message = message;
            this.stack = (new Error()).stack;
        }
        BFError.prototype.toString = function () {
            return this.name + ': ' + this.message;
        };
        return BFError;
    }(Error));
    BillForward.BFError = BFError;
    var BFPreconditionFailedError = (function (_super) {
        __extends(BFPreconditionFailedError, _super);
        function BFPreconditionFailedError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFPreconditionFailedError';
        }
        return BFPreconditionFailedError;
    }(BFError));
    BillForward.BFPreconditionFailedError = BFPreconditionFailedError;
    var BFInvocationError = (function (_super) {
        __extends(BFInvocationError, _super);
        function BFInvocationError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFInvocationError';
        }
        return BFInvocationError;
    }(BFError));
    BillForward.BFInvocationError = BFInvocationError;
    var BFNoResultsError = (function (_super) {
        __extends(BFNoResultsError, _super);
        function BFNoResultsError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFNoResultsError';
        }
        return BFNoResultsError;
    }(BFError));
    BillForward.BFNoResultsError = BFNoResultsError;
    var BFMalformedAPIResponseError = (function (_super) {
        __extends(BFMalformedAPIResponseError, _super);
        function BFMalformedAPIResponseError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'MalformedAPIResponseError';
        }
        return BFMalformedAPIResponseError;
    }(BFError));
    BillForward.BFMalformedAPIResponseError = BFMalformedAPIResponseError;
    var BFResponseUnserializationFailure = (function (_super) {
        __extends(BFResponseUnserializationFailure, _super);
        function BFResponseUnserializationFailure(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFResponseUnserializationFailure';
        }
        return BFResponseUnserializationFailure;
    }(BFError));
    BillForward.BFResponseUnserializationFailure = BFResponseUnserializationFailure;
    var BFRequestError = (function (_super) {
        __extends(BFRequestError, _super);
        function BFRequestError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFRequestError';
        }
        return BFRequestError;
    }(BFError));
    BillForward.BFRequestError = BFRequestError;
    var BFHTTPError = (function (_super) {
        __extends(BFHTTPError, _super);
        function BFHTTPError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFHTTPError';
        }
        return BFHTTPError;
    }(BFError));
    BillForward.BFHTTPError = BFHTTPError;
    var BFUnauthorizedError = (function (_super) {
        __extends(BFUnauthorizedError, _super);
        function BFUnauthorizedError(message) {
            _super.call(this, message);
            this.message = message;
            this.name = 'BFUnauthorizedError';
        }
        return BFUnauthorizedError;
    }(BFError));
    BillForward.BFUnauthorizedError = BFUnauthorizedError;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var Imports = (function () {
        function Imports() {
        }
        Imports._ = require('lodash');
        Imports.restler = require('restler');
        Imports.Q = require('q');
        Imports.util = require('util');
        return Imports;
    }());
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
    }());
    BillForward.MixinHandler = MixinHandler;
})(BillForward || (BillForward = {}));
module.exports = BillForward;
//# sourceMappingURL=index.js.map