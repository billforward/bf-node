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

    static getByID(id:string, options:Object = {}, client:Client = null) {
    	if (!client) {
    		client = BillingEntity.getSingletonClient();
    	}

        var entityClass = this.getDerivedClassStatic();

		var apiRoute = entityClass.getResourcePath().getPath();
		var endpoint = "/"+id;
		var fullRoute = apiRoute+endpoint;

		var deferred:Q.Deferred<any> = Imports.Q.defer();

		client.request("GET", fullRoute)
		.then(function(payload) {
				entityClass.getFirstEntityFromResponse(payload, client, deferred);
			})
        .catch(function(err) {
                Client.handlePromiseError(err, deferred);
            });

		return deferred.promise;

    	// return new this();
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

    getDerivedClass():any {
        return <any>this;
    }

    serialize():Object {
        var serial = {};
        var pruned = Imports._.omit(this, this._exemptFromSerialization);
        var serialized = Imports._.mapValues(pruned, function(value) {
                if (!value) return false;
                if ((<any>value).serialize) {
                    return (<any>value).serialize();
                }
                return value;
            });
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
        if (Imports._.has(this._registeredEntities, key)) {
            var entityClass = this._registeredEntities[key];
            var constructedEntity = this.buildEntity(entityClass, value);
            this[key] = constructedEntity;
        }/* else if (Imports._.contains(this._registeredEntities, key)) {
            var entityClass = this._registeredEntities[key];
            var constructedEntity = this.buildEntity(entityClass, value);
            this[key] = constructedEntity;
        }*/ else {
            this[key] = value;
        }
    }

    protected buildEntity(entityClass:typeof BillingEntity, constructArgs:any):BillingEntity {
        var client = this.getClient();
        var newEntity:BillingEntity = new entityClass(constructArgs, client);
        return newEntity;
    }

    protected static getFirstEntityFromResponse(payload:any, client:Client, deferred: Q.Deferred<any>) {
        try {
            if (payload.results.length<1) {
                deferred.reject("No results returned upon API request.");
                return;
            }
        } catch (e) {
            deferred.reject("Received malformed response from API.");
            return;
        }

        var entity;
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

    protected static makeEntityFromPayload(payload:any, client:Client) {
        return new this(payload, client);
    }
  } 
}