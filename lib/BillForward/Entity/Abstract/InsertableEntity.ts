module BillForward {

  export class InsertableEntity extends BillingEntity {
    constructor(stateParams:Object = {}, client:Client = null) {
      super(stateParams, client);
    }

    /**
     * Asks API to persist an instance of the modelled entity.
     */
    static create(entity:InsertableEntity) {
    	var entityClass = this.getDerivedClassStatic();

      var client:Client = entity.getClient();
      var payload = entity.serialize();

      return entityClass.makePostPromise("/", null, payload, client)
      .then((payload) => {
        return entityClass.getFirstEntityFromResponse(payload, client);
      });
    }
  } 
}