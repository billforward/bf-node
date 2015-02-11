module BillForward {
  export class Coupon extends MutableEntity {
    protected static _resourcePath = new ResourcePath('coupons', 'Coupon');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}