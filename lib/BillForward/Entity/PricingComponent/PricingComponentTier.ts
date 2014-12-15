module BillForward {
  export class PricingComponentTier extends MutableEntity {
    protected static _resourcePath = new ResourcePath('pricing-component-tiers', 'pricingComponentTier');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}