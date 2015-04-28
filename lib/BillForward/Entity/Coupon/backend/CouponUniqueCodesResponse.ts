module BillForward {
	export class CouponUniqueCodesResponse extends BillingEntity {
		constructor(stateParams:Object = {}, client:Client = null) {
	        super(stateParams, client);
	        
	        this.unserialize(stateParams);
	    }

	    getBaseCode() {
	        return (<any>this).couponCode;
	    }

	    applyToSubscription(subscription:EntityReference, client:Client = null) {
	    	return <Q.Promise<Coupon>>Coupon.applyCouponCodeToSubscription(this.getBaseCode(), subscription, client);
	    }

	}
}