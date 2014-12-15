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

    protected static makeGetPromise(endpoint:string, callback, client:Client = null) {
        if (!client) {
            client = BillingEntity.getSingletonClient();
        }

        var deferred:Q.Deferred<any> = Imports.Q.defer();

        var entityClass = this.getDerivedClassStatic();

        var fullRoute = entityClass.resolveRoute(endpoint);

        client.request("GET", fullRoute)
        .then((payload) => {
                callback.call(this, payload, client, deferred);
            })
        .catch(function(err) {
                Client.handlePromiseError(err, deferred);
            });

        return deferred.promise;
    }

    static getByID(id:string, options:Object = {}, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeGetPromise("/"+id, entityClass.getFirstEntityFromResponse, client);
    }

    static getAll(id:string, options:Object = {}, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeGetPromise("", entityClass.getAllEntitiesFromResponse, client);
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
        return <any>this;
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
        var newEntity:BillingEntity = new entityClass(constructArgs, client);
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
            entity = this.makeEntityFromPayload(stateParams, client);
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
                    var entity = this.makeEntityFromPayload(value, client);
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
        return new this(payload, client);
    }
  } 
}