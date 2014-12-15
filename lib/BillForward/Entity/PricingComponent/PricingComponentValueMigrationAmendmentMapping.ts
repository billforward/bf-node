module BillForward {
  export class PricingComponentValueMigrationAmendmentMapping extends MutableEntity {
    protected static _resourcePath = new ResourcePath('', 'PricingComponentValueMigrationAmendmentMapping');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}