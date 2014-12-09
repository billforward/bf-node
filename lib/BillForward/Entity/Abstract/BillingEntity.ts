module BillForward {

  export class BillingEntity {

  	private _client:Client;

    constructor(options:Object = {}, client:Client = null) {
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

		var apiRoute = this.getResourcePath().getPath();
		var endpoint = "/"+id;
		var fullRoute = apiRoute+endpoint;

		var deferred = q.defer();

		client.request("GET", fullRoute)
		.then(function(payload) {
				if (payload.results.length<1) {
					deferred.reject("No results");
					return;
				}
				deferred.resolve(payload);
			})
		.done();

		return deferred.promise;

    	// return new this();
    }

    static getResourcePath() {
    	return (<any>this)._resourcePath;
    }

    static getSingletonClient():Client {
    	return Client.getDefaultClient();;
    }
  } 
}