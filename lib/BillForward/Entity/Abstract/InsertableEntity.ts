module BillForward {

  export class InsertableEntity extends BillingEntity {
    constructor() {
      super();
    }

    static create(entity:InsertableEntity) {
    	var client:Client = entity.getClient();

    	var entityClass = this.getDerivedClassStatic();

    	var apiRoute = entityClass.getResourcePath().getPath();
		var endpoint = "/";
		var fullRoute = apiRoute+endpoint;

		var deferred: Q.Deferred<any> = Imports.Q.defer();

		client.request("POST", fullRoute)
		.then(function(payload) {
				if (payload.results.length<1) {
					deferred.reject("No results");
					return;
				}

				deferred.resolve(payload);
			})
		.done();

		return deferred.promise;
    }

    static makeEntityFromResponse(payload:Object, deferred: Q.Deferred<any>) {
    	//deferred.
    }
  } 
}