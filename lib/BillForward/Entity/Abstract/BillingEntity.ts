module BillForward {

  export class BillingEntity {

  	protected _client:Client;
    protected _exemptFromSerialization:Array<string> = ['_client', '_exemptFromSerialization', '_registeredEntities', '_registeredEntityArrays'];

    protected _registeredEntities: { [classKey:string]:typeof BillingEntity } = {};
    protected _registeredEntityArrays: { [classKey:string]:typeof BillingEntity } = {};

    constructor(stateParams:Object = {}, client:Client = null) {
    	if (!client) {
    		client = BillingEntity.getSingletonClient();
    	}

    	this.setClient(client);
    }

    getClient():Client {
		return this._client;
	}

	setClient(client:Client):void {
		this._client = client;
	}

    protected static resolveRoute(endpoint:string = "") {
        var entityClass = this.getDerivedClassStatic();

        var apiRoute = entityClass.getResourcePath().getPath();
        var fullRoute = apiRoute+endpoint;

        return fullRoute;
    }

    protected static makeHttpPromise(verb:string, endpoint:string, queryParams:Object, payload:Object, callback, client:Client = null) {
        if (!client) {
            client = BillingEntity.getSingletonClient();
        }

        var deferred:Q.Deferred<any> = Imports.Q.defer();

        var entityClass = this.getDerivedClassStatic();

        var fullRoute = entityClass.resolveRoute(endpoint);

        client.request(verb, fullRoute, queryParams, payload)
        .then((payload) => {
                callback.call(this, payload, client, deferred);
            });

        return deferred.promise;
    }

    protected static makeGetPromise(endpoint:string, queryParams:Object, callback, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeHttpPromise("GET", endpoint, queryParams, null, callback, client);
    }

    static getByID(id:string, queryParams:Object = {}, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeGetPromise("/"+id, queryParams, entityClass.getFirstEntityFromResponse, client);
    }

    static getAll(queryParams:Object = {}, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeGetPromise("", queryParams, entityClass.getAllEntitiesFromResponse, client);
    }

    static getResourcePath() {
        return this.getDerivedClassStatic()._resourcePath;
    }

    static getSingletonClient():Client {
    	return Client.getDefaultClient();;
    }

    static getDerivedClassStatic():any {
        return <any>this;
    }

    protected registerEntity(key:string, entityClass:typeof BillingEntity) {
        this._registeredEntities[key] = entityClass;
    }

    protected registerEntityArray(key:string, entityClass:typeof BillingEntity) {
        this._registeredEntityArrays[key] = entityClass;
    }

    getDerivedClass():any {
        return (<any>this).constructor;
    }

    static serializeProperty(value:any):any {
        // if (!value) return false;
        if (value instanceof Array) {
            return Imports._.map(value, BillingEntity.serializeProperty);
        }
        if (value instanceof BillingEntity) {
            return value.serialize();
        }
        return value;
    }

    serialize():Object {
        var pruned = Imports._.omit(this, this._exemptFromSerialization);
        var pruned = Imports._.omit(pruned, function(property) {
                return property instanceof Function;
            });
        var serialized = Imports._.mapValues(pruned, BillingEntity.serializeProperty);
        return serialized;
    }

    toString() : string {
        return JSON.stringify(this.serialize(), null, "\t");
    }

    protected unserialize(json:Object) {
        for (var key in json) {
            var value = json[key];
            this.addToEntity(key, value);
        }
    }

    protected addToEntity(key:string, value:any) {
        var unserializedValue:any;
        if (Imports._.has(this._registeredEntities, key)) {
            var entityClass = this._registeredEntities[key];
            unserializedValue = this.buildEntity(entityClass, value);
        } else if (Imports._.contains(this._registeredEntityArrays, key)) {
            var entityClass = this._registeredEntityArrays[key];
            unserializedValue = this.buildEntityArray(entityClass, value);
        } else {
            // JSON or primitive
            unserializedValue = value;
        }
        this[key] = unserializedValue;
    }

    protected buildEntity(entityClass:typeof BillingEntity, constructArgs:any):BillingEntity {
        if (constructArgs instanceof entityClass) {
            // the entity has already been constructed!
            return constructArgs;
        }
        var constructArgsType = typeof constructArgs;
        if (constructArgsType !== 'object') {
            throw "Expected either a property map or an entity of type '"+entityClass+"'. Instead received: "+constructArgsType+"; "+constructArgs;
        }
        var client = this.getClient();
        var newEntity:BillingEntity = entityClass.makeEntityFromPayload(constructArgs, client);
        return newEntity;
    }

    protected buildEntityArray(entityClass:typeof BillingEntity, constructArgs:Array<any>):Array<BillingEntity> {
        var client = this.getClient();
        var entities = Imports._.map(constructArgs, this.buildEntity);
        return entities;
    }    

    protected static getFirstEntityFromResponse(payload:any, client:Client, deferred: Q.Deferred<BillingEntity>) {
        try {
            if (payload.results.length<1) {
                deferred.reject("No results returned upon API request.");
                return;
            }
        } catch (e) {
            deferred.reject("Received malformed response from API.");
            return;
        }

        var entity:BillingEntity;
        try {
            var results = payload.results;
            var assumeFirst = results[0];
            var stateParams = assumeFirst;
            var entityClass = this.getDerivedClassStatic();
            entity = entityClass.makeEntityFromPayload(stateParams, client);
        } catch (e) {
            deferred.reject(e);
            return;
        }

        if (!entity) {
            deferred.reject("Failed to unserialize API response into entity.");
            return;
        }
        deferred.resolve(entity);
    }

    protected static getAllEntitiesFromResponse(payload:any, client:Client, deferred: Q.Deferred<Array<BillingEntity>>) {
        try {
            if (payload.results.length === undefined) {
                deferred.reject("Received malformed response from API.");
                return;
            }
        } catch (e) {
            deferred.reject("Received malformed response from API.");
            return;
        }

        var entities:Array<BillingEntity>;
        try {
            var results = payload.results;
            entities = Imports._.map(results, (value:Object):any => {
                var entityClass = this.getDerivedClassStatic();
                var entity = entityClass.makeEntityFromPayload(value, client);
                if (!entity) {
                    deferred.reject("Failed to unserialize API response into entity.");
                    return false;
                }
                return entity;
            });
        } catch (e) {
            deferred.reject(e);
            return;
        }

        if (!entities) {
            deferred.reject("Failed to unserialize API response into entity.");
            return;
        }
        deferred.resolve(entities);
    }

    protected static makeEntityFromPayload(payload:Object, client:Client):BillingEntity {
        var entityClass = this.getDerivedClassStatic();
        return new entityClass(payload, client);
    }

    /**
     * Fetches (if necessary) entity by ID from API.
     * Otherwise returns entity as-is.
     * @param mixed ENUM[string id, BillingEntity entity] Reference to the entity. <id>: Fetches entity by ID. <entity>: Returns entity as-is.
     * @return static The gotten entity.
     */
    static fetchIfNecessary(entityReference:any): Q.Promise<BillingEntity> {
        return <Q.Promise<BillingEntity>>Q.Promise((resolve, reject) => {
            try {
                var entityClass = this.getDerivedClassStatic();
                if (typeof entityReference === "string") {
                    // fetch entity by ID
                    return resolve(entityClass.getByID(entityReference));
                }
                if (entityReference instanceof entityClass) {
                    // is already a usable entity
                    return resolve(<any>entityReference);
                }
                throw "Cannot fetch entity; referenced entity is neither an ID, nor an object extending the desired entity class.";
            } catch (e) {
                return reject(e);
            }
        });
    }

    static makeBillForwardDate(date:Date) {
        var asISO = date.toISOString();
        //var removeMilli = asISO.slice(0, -5)+"Z";
        return asISO;
    }
  } 
}