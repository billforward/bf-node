module BillForward {
  export class PricingComponent extends MutableEntity {
    protected static _resourcePath = new ResourcePath('pricing-components', 'PricingComponent');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('tiers', PricingComponentTier);

        this.unserialize(stateParams);
    }
  }
}