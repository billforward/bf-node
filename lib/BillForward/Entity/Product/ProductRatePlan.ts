module BillForward {
  export class ProductRatePlan extends MutableEntity {
    protected static _resourcePath = new ResourcePath('product-rate-plans', 'productRatePlan');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('taxation', TaxationLink);
        this.registerEntityArray('pricingComponents', PricingComponent);
        
        this.registerEntity('product', Product);
        this.unserialize(stateParams);
    }
  }
}