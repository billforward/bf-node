module BillForward {

  export type EntityReference = string | BillingEntity;

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

    protected static resolveRoute(endpoint:string = ""):string {
        var entityClass = this.getDerivedClassStatic();

        var controller = entityClass.getResourcePath().getPath();

        var fullRoute = Imports.util.format("%s/%s", controller, endpoint);

        return fullRoute;
    }

    protected static makeHttpPromise(verb:string, endpoint:string, queryParams:Object, payload:Object, client:Client = null):Q.Promise<any> {
        return <Q.Promise<any>>Imports.Q.Promise((resolve, reject) => {
            try {
                if (!client) {
                    client = BillingEntity.getSingletonClient();
                }

                var myClass = this.getDerivedClassStatic();
                var fullRoute = myClass.resolveRoute(endpoint);

                return resolve(client.request(verb, fullRoute, queryParams, payload));
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static makeGetPromise(endpoint:string, queryParams:Object, client:Client = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                return resolve(myClass.makeHttpPromise("GET", endpoint, queryParams, null, client));
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static makePutPromise(endpoint:string, queryParams:Object, payload:Object, client:Client = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
              var myClass = this.getDerivedClassStatic();
              return resolve(myClass.makeHttpPromise("PUT", endpoint, queryParams, payload, client));
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static makePostPromise(endpoint:string, queryParams:Object, payload:Object, client:Client = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                return resolve(myClass.makeHttpPromise("POST", endpoint, queryParams, payload, client));
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static postEntityAndGrabFirst(endpoint:string, queryParams:Object, entity:BillingEntity, client:Client = null, responseEntity:BillingEntity = null) {
        return <Q.Promise<BillingEntity>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var serial = entity.serialize();
                return resolve(myClass.postAndGrabFirst(endpoint, queryParams, serial, client, responseEntity));
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static postEntityAndGrabCollection(endpoint:string, queryParams:Object, entity:BillingEntity, client:Client = null, responseEntity:BillingEntity = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var serial = entity.serialize();
                return resolve(myClass.postAndGrabCollection(endpoint, queryParams, serial, client, responseEntity));
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static postAndGrabFirst(endpoint:string, queryParams:Object, payload:Object, client:Client = null, responseEntity:BillingEntity = null) {
        return <Q.Promise<BillingEntity>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var responseClass = responseEntity.getDerivedClass();
                return resolve(
                    myClass.makePostPromise(endpoint, queryParams, payload, client)
                    .then(payload => {
                        return responseClass.getFirstEntityFromResponse(payload, client);
                      })
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static postAndGrabCollection(endpoint:string, queryParams:Object, payload:Object, client:Client = null, responseEntity:BillingEntity = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var responseClass = responseEntity.getDerivedClass();
                return resolve(
                    myClass.makePostPromise(endpoint, queryParams, payload, client)
                    .then(payload => {
                        return responseClass.getAllEntitiesFromResponse(payload, client);
                      })
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static getAndGrabFirst(endpoint:string, queryParams:Object, client:Client = null, responseEntity:BillingEntity = null) {
        return <Q.Promise<BillingEntity>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var responseClass = responseEntity ? responseEntity.getDerivedClass() : myClass;
                return resolve(
                    myClass.makeGetPromise(endpoint, queryParams, client)
                    .then(payload => {
                        return responseClass.getFirstEntityFromResponse(payload, client);
                      })
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    protected static getAndGrabCollection(endpoint:string, queryParams:Object, client:Client = null, responseEntity:BillingEntity = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var responseClass = responseEntity ? responseEntity.getDerivedClass() : myClass;
                return resolve(
                    myClass.makeGetPromise(endpoint, queryParams, client)
                    .then(payload => {
                        return responseClass.getAllEntitiesFromResponse(payload, client);
                      })
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    static getByID(id:string, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<BillingEntity>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var endpoint = Imports.util.format("%s", encodeURIComponent(id));
                return resolve(myClass.getAndGrabFirst(endpoint, queryParams, client));
            } catch(e) {
                return reject(e);
            }
        });
    }

    static getAll(queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Array<BillingEntity>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var myClass = this.getDerivedClassStatic();
                var endpoint = "";
                return resolve(myClass.getAndGrabCollection(endpoint, queryParams, client));
            } catch(e) {
                return reject(e);
            }
        });
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
        } else if (Imports._.includes(this._registeredEntityArrays, key)) {
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
            throw new BFInvocationError(Imports.util.format("Expected either a property map or an entity of type '%s'. Instead received: '%s'; %s", entityClass, constructArgsType, constructArgs));
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

    protected static getFirstEntityFromResponse(payload:any, client:Client):BillingEntity {
        if (!payload.results || payload.results.length === undefined || payload.results.length === null)
            throw new BFMalformedAPIResponseError("Received malformed response from API.");
        if (payload.results.length<1)
            throw new BFNoResultsError("No results returned upon API request.");

        var entity:BillingEntity;
        var results = payload.results;
        var assumeFirst = results[0];
        var stateParams = assumeFirst;
        var entityClass = this.getDerivedClassStatic();
        entity = entityClass.makeEntityFromPayload(stateParams, client);

        if (!entity)
            throw new BFResponseUnserializationFailure("Failed to unserialize API response into entity.");
        return entity;
    }

    protected static getAllEntitiesFromResponse(payload:any, client:Client): Array<BillingEntity> {
        if (!payload.results || payload.results.length === undefined || payload.results.length === null)
            throw new BFMalformedAPIResponseError("Received malformed response from API.");
        if (payload.results.length<1)
            throw new BFNoResultsError("No results returned upon API request.");

        var entities:Array<BillingEntity>;
        var results = payload.results;
        entities = Imports._.map(results, (value:Object):any => {
            var entityClass = this.getDerivedClassStatic();
            var entity = entityClass.makeEntityFromPayload(value, client);
            if (!entity)
                throw new BFResponseUnserializationFailure("Failed to unserialize API response into entity.");
            return entity;
        });

        if (!entities)
            throw new BFResponseUnserializationFailure("Failed to unserialize API response into entity.");

        return entities;
    }

    protected static makeEntityFromPayload(payload:Object, client:Client):BillingEntity {
        var entityClass = this.getDerivedClassStatic();
        return new entityClass(payload, client);
    }

    /**
     * Fetches (if necessary) entity by ID from API.
     * Otherwise returns entity as-is.
     * @param mixed ENUM[string id, BillingEntity entity] Reference to the entity. <id>: Fetches entity by ID. <entity>: Returns entity as-is.
     * @return Q.Promise<static> The gotten entity.
     */
    static fetchIfNecessary(entityReference: EntityReference): Q.Promise<BillingEntity> {
        return <Q.Promise<BillingEntity>>Imports.Q.Promise((resolve, reject) => {
            try {
                var entityClass = this.getDerivedClassStatic();
                if (typeof entityReference === "string") {
                    // fetch entity by ID
                    return resolve(entityClass.getByID(entityReference));
                }
                if (<any>entityReference instanceof entityClass) {
                    // is already a usable entity
                    return resolve(<any>entityReference);
                }
                throw new BFInvocationError("Cannot fetch entity; referenced entity is neither an ID, nor an object extending the desired entity class.");
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * Get ID of referenced entity.
     * @param EntityReference Reference to the entity. <string>: ID of the entity. <BillingEntity>: Entity object, from whom an ID can be extracted.
     * @return static The gotten entity.
     */
    static getIdentifier(entityReference: EntityReference): string {
        if (typeof entityReference === "string") {
            // is already an ID; we're done here.
            return entityReference;
        }

        var entityClass = this.getDerivedClassStatic();
        if (<any>entityReference instanceof entityClass) {
            return (<any>entityReference).id;
        }

        throw new BFInvocationError("Cannot get identifier of referenced entity; referenced entity is neither an ID, nor an object extending the desired entity class.");
    }

    static makeBillForwardDate(date:Date) {
        var asISO = date.toISOString();
        var removeMilli = asISO.slice(0, -5)+"Z";
        return removeMilli;
    }

    static getBillForwardNow() {
        var now = new Date();
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeBillForwardDate(now);
    }
  } 
}