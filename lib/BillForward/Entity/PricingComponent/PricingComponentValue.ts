module BillForward {
  export class PricingComponentValue extends MutableEntity {
    protected static _resourcePath = new ResourcePath('pricing-component-values', 'PricingComponentValue');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}