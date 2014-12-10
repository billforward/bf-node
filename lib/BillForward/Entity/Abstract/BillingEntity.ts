module BillForward {

  export class BillingEntity {

  	private _client:Client;

    constructor(stateParams:Object = {}, client:Client = null) {
    	if (!client) {
    		client = BillingEntity.getSingletonClient();
    	}

    	this.setClient(client);
        this.unserialize(stateParams);
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

    getDerivedClass():any {
        return <any>this;
    }

    serialize():Object {
        return {};
    }

    protected unserialize(json:Object) {
        for (var key in json) {
            var value = json[key];
            this[key] = value;
        }
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