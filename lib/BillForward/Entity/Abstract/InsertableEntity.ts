module BillForward {

  export class InsertableEntity extends BillingEntity {
    /**
     * Asks API to persist an instance of the modelled entity.
     */
    static create(entity:InsertableEntity) {
    	var entityClass = this.getDerivedClassStatic();

      var client:Client = entity.getClient();
      var payload = entity.serialize();

      return entityClass.makePostPromise("/", null, payload, entityClass.getFirstEntityFromResponse, client);
    }

    protected static makePostPromise(endpoint:string, queryParams:Object, payload:Object, callback, client:Client = null) {
        var entityClass = this.getDerivedClassStatic();
        return entityClass.makeHttpPromise("POST", endpoint, queryParams, payload, callback, client);
    }
  } 
}