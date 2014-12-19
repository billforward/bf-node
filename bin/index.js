var BillForward;
(function (BillForward) {
    var Client = (function () {
        function Client(accessToken, urlRoot, requestLogging, responseLogging, errorLogging) {
            if (requestLogging === void 0) { requestLogging = false; }
            if (responseLogging === void 0) { responseLogging = false; }
            if (errorLogging === void 0) { errorLogging = false; }
            this.accessToken = accessToken;
            this.urlRoot = urlRoot;
            this.requestLogging = requestLogging;
            this.responseLogging = responseLogging;
            this.errorLogging = errorLogging;
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
        Client.makeDefault = function (accessToken, urlRoot, requestLogging, responseLogging, errorLogging) {
            if (requestLogging === void 0) { requestLogging = false; }
            if (responseLogging === void 0) { responseLogging = false; }
            if (errorLogging === void 0) { errorLogging = false; }
            var client = new Client(accessToken, urlRoot, requestLogging, responseLogging, errorLogging);
            return Client.setDefault(client);
        };
        Client.getDefaultClient = function () {
            if (!Client.singletonClient) {
                throw 'No default BillForwardClient found; cannot make API requests.';
            }
            return Client.singletonClient;
        };
        Client.prototype.request = function (verb, path, queryParams, json) {
            var _this = this;
            if (queryParams === void 0) { queryParams = {}; }
            if (json === void 0) { json = {}; }
            var queryString = "";
            if (!BillForward.Imports._.isEmpty(queryParams)) {
                queryString = "?" + BillForward.Imports._.map(queryParams, function (value, key) {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }).join("&");
            }
            var fullPath = this.urlRoot + path + queryString;
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
            if (this.requestLogging) {
                console.log(JSON.stringify(json, null, "\t"));
            }
            if (verb === 'POST' || verb === 'PUT') {
                options.input = json;
                options.inputType = 'json';
                options.headers['Content-Type'] = 'application/json';
            }
            BillForward.Imports.httpinvoke(fullPath, verb, options);
            return deferred.promise;
        };
        Client.prototype.successResponse = function (body, statusCode, headers, deferred) {
            if (statusCode === 200) {
                if (this.responseLogging) {
                    console.log(JSON.stringify(body, null, "\t"));
                }
                deferred.resolve(body);
                return;
            }
            this.errorResponse(body, deferred);
        };
        Client.prototype.errorResponse = function (err, deferred) {
            var parsed = err;
            if (this.errorLogging) {
                if (err instanceof Object) {
                    parsed = JSON.stringify(err);
                }
                console.error(parsed);
            }
            Client.handlePromiseError(parsed, deferred);
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
        BillingEntity.resolveRoute = function (endpoint) {
            if (endpoint === void 0) { endpoint = ""; }
            var entityClass = this.getDerivedClassStatic();
            var apiRoute = entityClass.getResourcePath().getPath();
            var fullRoute = apiRoute + endpoint;
            return fullRoute;
        };
        BillingEntity.makeHttpPromise = function (verb, endpoint, queryParams, payload, callback, client) {
            var _this = this;
            if (client === void 0) { client = null; }
            if (!client) {
                client = BillingEntity.getSingletonClient();
            }
            var deferred = BillForward.Imports.Q.defer();
            var entityClass = this.getDerivedClassStatic();
            var fullRoute = entityClass.resolveRoute(endpoint);
            client.request(verb, fullRoute, queryParams, payload).then(function (payload) {
                callback.call(_this, payload, client, deferred);
            }).catch(function (err) {
                BillForward.Client.handlePromiseError(err, deferred);
            });
            return deferred.promise;
        };
        BillingEntity.makeGetPromise = function (endpoint, queryParams, callback, client) {
            if (client === void 0) { client = null; }
            var entityClass = this.getDerivedClassStatic();
            return entityClass.makeHttpPromise("GET", endpoint, queryParams, null, callback, client);
        };
        BillingEntity.getByID = function (id, queryParams, client) {
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            var entityClass = this.getDerivedClassStatic();
            return entityClass.makeGetPromise("/" + id, queryParams, entityClass.getFirstEntityFromResponse, client);
        };
        BillingEntity.getAll = function (queryParams, client) {
            if (queryParams === void 0) { queryParams = {}; }
            if (client === void 0) { client = null; }
            var entityClass = this.getDerivedClassStatic();
            return entityClass.makeGetPromise("", queryParams, entityClass.getAllEntitiesFromResponse, client);
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
            if (constructArgs instanceof entityClass) {
                return constructArgs;
            }
            var constructArgsType = typeof constructArgs;
            if (constructArgsType !== 'object') {
                throw "Expected either a property map or an entity of type '" + entityClass + "'. Instead received: " + constructArgsType + "; " + constructArgs;
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
                var entityClass = this.getDerivedClassStatic();
                entity = entityClass.makeEntityFromPayload(stateParams, client);
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
        BillingEntity.getAllEntitiesFromResponse = function (payload, client, deferred) {
            var _this = this;
            try {
                if (payload.results.length === undefined) {
                    deferred.reject("Received malformed response from API.");
                    return;
                }
            }
            catch (e) {
                deferred.reject("Received malformed response from API.");
                return;
            }
            var entities;
            try {
                var results = payload.results;
                entities = BillForward.Imports._.map(results, function (value) {
                    var entityClass = _this.getDerivedClassStatic();
                    var entity = entityClass.makeEntityFromPayload(value, client);
                    if (!entity) {
                        deferred.reject("Failed to unserialize API response into entity.");
                        return false;
                    }
                    return entity;
                });
            }
            catch (e) {
                deferred.reject(e);
                return;
            }
            if (!entities) {
                deferred.reject("Failed to unserialize API response into entity.");
                return;
            }
            deferred.resolve(entities);
        };
        BillingEntity.makeEntityFromPayload = function (payload, client) {
            var entityClass = this.getDerivedClassStatic();
            return new entityClass(payload, client);
        };
        BillingEntity.makeBillForwardDate = function (date) {
            var asISO = date.toISOString();
            return asISO;
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
            var entityClass = this.getDerivedClassStatic();
            var client = entity.getClient();
            var payload = entity.serialize();
            return entityClass.makePostPromise("/", null, payload, entityClass.getFirstEntityFromResponse, client);
        };
        InsertableEntity.makePostPromise = function (endpoint, queryParams, payload, callback, client) {
            if (client === void 0) { client = null; }
            var entityClass = this.getDerivedClassStatic();
            return entityClass.makeHttpPromise("POST", endpoint, queryParams, payload, callback, client);
        };
        return InsertableEntity;
    })(BillForward.BillingEntity);
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
            var entityClass = this.getDerivedClass();
            var client = this.getClient();
            var payload = this.serialize();
            return entityClass.makePutPromise("/", null, payload, entityClass.getFirstEntityFromResponse, client);
        };
        MutableEntity.makePutPromise = function (endpoint, queryParams, payload, callback, client) {
            if (client === void 0) { client = null; }
            var entityClass = this.getDerivedClassStatic();
            return entityClass.makeHttpPromise("PUT", endpoint, queryParams, payload, callback, client);
        };
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
            this.registerEntityArray('roles', BillForward.Role);
            this.registerEntityArray('paymentMethods', BillForward.PaymentMethod);
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
    var CreditNote = (function (_super) {
        __extends(CreditNote, _super);
        function CreditNote(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.unserialize(stateParams);
        }
        CreditNote._resourcePath = new BillForward.ResourcePath('credit-notes', 'creditNote');
        return CreditNote;
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.InsertableEntity);
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
        Amendment.prototype.discard = function () {
            var amendment = new BillForward.AmendmentDiscardAmendment({
                'amendmentToDiscardID': this.id,
                'subscriptionID': this.subscriptionID
            });
            return BillForward.AmendmentDiscardAmendment.create(amendment);
        };
        Amendment._resourcePath = new BillForward.ResourcePath('amendments', 'amendment');
        return Amendment;
    })(BillForward.InsertableEntity);
    BillForward.Amendment = Amendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
    var AmendmentDiscardAmendment = (function (_super) {
        __extends(AmendmentDiscardAmendment, _super);
        function AmendmentDiscardAmendment(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            _super.call(this, stateParams, client);
            this.applyType('AmendmentDiscardAmendment');
            this.unserialize(stateParams);
        }
        return AmendmentDiscardAmendment;
    })(BillForward.Amendment);
    BillForward.AmendmentDiscardAmendment = AmendmentDiscardAmendment;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
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
            if (serviceEnd === void 0) { serviceEnd = 0 /* AtPeriodEnd */; }
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            var amendment = new CancellationAmendment({
                'subscriptionID': subscription.id,
                'serviceEnd': serviceEnd
            });
            var date = null;
            if (actioningTime instanceof Date) {
                date = BillForward.BillingEntity.makeBillForwardDate(actioningTime);
            }
            else if (actioningTime === 'AtPeriodEnd') {
                if (subscription.currentPeriodEnd) {
                    date = subscription.currentPeriodEnd;
                }
                else {
                    throw 'Cannot set actioning time to period end, because the subscription does not declare a period end.';
                }
            }
            if (date) {
                amendment.actioningTime = date;
            }
            return amendment;
        };
        return CancellationAmendment;
    })(BillForward.Amendment);
    BillForward.CancellationAmendment = CancellationAmendment;
    (function (ServiceEndTime) {
        ServiceEndTime[ServiceEndTime["AtPeriodEnd"] = 0] = "AtPeriodEnd";
        ServiceEndTime[ServiceEndTime["Immediate"] = 1] = "Immediate";
    })(BillForward.ServiceEndTime || (BillForward.ServiceEndTime = {}));
    var ServiceEndTime = BillForward.ServiceEndTime;
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
        Invoice._resourcePath = new BillForward.ResourcePath('invoices', 'invoice');
        return Invoice;
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.InsertableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.InsertableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
        Product._resourcePath = new BillForward.ResourcePath('products', 'product');
        return Product;
    })(BillForward.MutableEntity);
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
        ProductRatePlan._resourcePath = new BillForward.ResourcePath('product-rate-plans', 'productRatePlan');
        return ProductRatePlan;
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
    BillForward.TaxationLink = TaxationLink;
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
    })(BillForward.MutableEntity);
    BillForward.PaymentMethodSubscriptionLink = PaymentMethodSubscriptionLink;
})(BillForward || (BillForward = {}));
var BillForward;
(function (BillForward) {
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
        Subscription.prototype.activate = function () {
            this.state = 'AwaitingPayment';
            return this.save();
        };
        Subscription.prototype.cancel = function (serviceEnd, actioningTime) {
            if (serviceEnd === void 0) { serviceEnd = 0 /* AtPeriodEnd */; }
            if (actioningTime === void 0) { actioningTime = 'Immediate'; }
            var amendment = BillForward.CancellationAmendment.construct(this, serviceEnd, actioningTime);
            var promise = BillForward.CancellationAmendment.create(amendment);
            return promise;
        };
        Subscription._resourcePath = new BillForward.ResourcePath('subscriptions', 'subscription');
        return Subscription;
    })(BillForward.MutableEntity);
    BillForward.Subscription = Subscription;
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
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
    })(BillForward.MutableEntity);
    BillForward.StripeToken = StripeToken;
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