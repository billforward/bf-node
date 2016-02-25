module BillForward {
  export class ProductRatePlanMigrationAmendment extends Amendment {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client, true);

        this.applyType('ProductRatePlanMigrationAmendment');
        
        this.unserialize(stateParams);
    }
  }
}