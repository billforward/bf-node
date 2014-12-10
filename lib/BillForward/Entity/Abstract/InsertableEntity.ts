module BillForward {

  export class InsertableEntity extends BillingEntity {
    constructor(stateParams:Object = {}, client:Client = null) {
      super(stateParams, client);
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
                entityClass.getFirstEntityFromResponse(payload, client, deferred);
			})
		.done();

		return deferred.promise;
    }
  } 
}