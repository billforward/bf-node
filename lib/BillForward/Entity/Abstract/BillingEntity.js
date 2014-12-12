var BillForward;
(function (BillForward) {
    var BillingEntity = (function () {
        function BillingEntity(stateParams, client) {
            if (stateParams === void 0) { stateParams = {}; }
            if (client === void 0) { client = null; }
            this._exemptFromSerialization = ['_client', '_exemptFromSerialization'];
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
            var deferred = Imports.Q.defer();
            client.request("GET", fullRoute).then(function (payload) {
                entityClass.getFirstEntityFromResponse(payload, client, deferred);
            }).catch(function (err) {
                if (err !== null && err instanceof Object) {
                    err.toString = JSON.stringify;
                }
                deferred.reject(err);
            });
            return deferred.promise;
            // return new this();
        };
        BillingEntity.getResourcePath = function () {
            return this.getDerivedClassStatic()._resourcePath;
        };
        BillingEntity.getSingletonClient = function () {
            return Client.getDefaultClient();
            ;
        };
        BillingEntity.getDerivedClassStatic = function () {
            return this;
        };
        BillingEntity.prototype.getDerivedClass = function () {
            return this;
        };
        BillingEntity.prototype.serialize = function () {
            var serial = {};
            var pruned = Imports._.omit(this, this._exemptFromSerialization);
            var serialized = Imports._.mapValues(pruned, function (value) {
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
                this[key] = value;
            }
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
//# sourceMappingURL=BillingEntity.js.map