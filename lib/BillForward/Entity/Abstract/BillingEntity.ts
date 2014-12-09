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

		var apiRoute = (<any>this).constructor.getResourcePath().getPath();
		var endpoint = "/"+id;
		var fullRoute = apiRoute+endpoint;

		return client.request("GET", fullRoute)

    	// return new this();
    }

    static getResourcePath() {
    	return (<any>this).constructor._resourcePath;
    }

    static getSingletonClient():Client {
    	return Client.getDefaultClient();;
    }
  } 
}