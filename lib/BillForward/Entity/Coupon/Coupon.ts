module BillForward {
  export class Coupon extends MutableEntity {
    protected static _resourcePath = new ResourcePath('coupons', 'Coupon');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    getBaseCode() {
        if (!(<any>this).parentCouponCode) {
            return (<any>this).parentCouponCode;
        }
        return (<any>this).couponCode;
    }

    getUnusedUniqueCodes(queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Array<CouponUniqueCodesResponse>>>this.getDerivedClass().getUnusedUniqueCodesFromBaseCode(this.getBaseCode(), queryParams, client);
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

    static getUnusedUniqueCodesFromBaseCode(baseCode:string, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Array<CouponUniqueCodesResponse>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var endpoint = Imports.util.format("%s/codes", encodeURIComponent(baseCode));

                var responseEntity = new CouponUniqueCodesResponse();

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.getAndGrabCollection(endpoint, queryParams, client, responseEntity)
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }
  }
}