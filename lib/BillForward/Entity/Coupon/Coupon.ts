module BillForward {
  export class Coupon extends MutableEntity {
    protected static _resourcePath = new ResourcePath('coupons', 'Coupon');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    applyToSubscription(subscription:EntityReference) {
    	return <Q.Promise<Coupon>>Imports.Q.Promise((resolve, reject) => {
            try {
    			return resolve(
    				AddCouponCodeRequest.applyCouponToSubscription(this, subscription)
    				);
    		} catch(e) {
                return reject(e);
            }
        });
    }

    applyCouponCodeToSubscription(couponCode:string, subscription:EntityReference) {
    	return <Q.Promise<Coupon>>Imports.Q.Promise((resolve, reject) => {
            try {
    			return resolve(
    				AddCouponCodeRequest.applyCouponCodeToSubscription(couponCode, subscription)
    				);
    		} catch(e) {
                return reject(e);
            }
        });
    }
  }
}