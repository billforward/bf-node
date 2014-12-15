module BillForward {
  export class PricingComponentValueChange extends InsertableEntity {
    protected static _resourcePath = new ResourcePath('pricing-component-value-changes', 'PricingComponentValueChange');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}