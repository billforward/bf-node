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

		client.request("POST", fullRoute, {}, entity.serialize())
		.then(function(payload) {
				if (payload.results.length<1) {
					deferred.reject("No results");
					return;
				}

                var entity;
                try {
                    entity = entityClass.makeEntityFromResponse(payload, client, deferred);   
                } catch (e) {
                    deferred.reject(e);
                    return;
                }

                if (!entity) {
                    deferred.reject("Failed to unserialize API response into entity.");
                }
                deferred.resolve(entity);
				// deferred.resolve(payload);
			})
		.done();

		return deferred.promise;
    }

    static makeEntityFromResponse(payload:Object, providedClient:Client, deferred: Q.Deferred<any>) {
    	//deferred.
    	var entityClass = this.getDerivedClassStatic();
    	return new entityClass(payload);
    }
  } 
}