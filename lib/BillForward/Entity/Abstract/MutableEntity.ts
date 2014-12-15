module BillForward {

  export class MutableEntity extends InsertableEntity {
  	/**
	 * Asks API to update existing instance of this entity,
	 * to match the current properties with which it is modelled.
	 */
  	save() {
  		var entityClass = this.getDerivedClass();
  		var client = this.getClient();
  		var payload = this.serialize();
        return entityClass.makePutPromise("/", null, payload, entityClass.getFirstEntityFromResponse, client);
  	}

  	protected static makePutPromise(endpoint:string, queryParams:Object, payload:Object, callback, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeHttpPromise("PUT", endpoint, queryParams, payload, callback, client);
    }
  } 
}