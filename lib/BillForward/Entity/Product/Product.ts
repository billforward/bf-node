module BillForward {
  export class Product extends MutableEntity {
    protected static _resourcePath = new ResourcePath('products', 'product');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    getRatePlans(queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Array<ProductRatePlan>>>ProductRatePlan.getForProduct(<BillingEntity>this, queryParams, client);
    }
  }
}