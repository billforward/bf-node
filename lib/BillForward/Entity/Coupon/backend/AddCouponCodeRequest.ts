module BillForward {
	/*
 * This entity models how a POST request can be made
 * to the subscriptions controller and receive (something like) a coupon in response.
 */
  export class AddCouponCodeRequest extends BillingEntity {
    protected static _resourcePath = new ResourcePath('subscriptions', 'AddCouponCodeRequest');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    static applyCouponToSubscription(coupon:Coupon, subscription:EntityReference, client:Client = null) {
    	return <Q.Promise<Coupon>>this.getDerivedClassStatic().applyCouponCodeToSubscription(coupon.getBaseCode(), subscription, client);
    }

    static applyCouponCodeToSubscription(couponCode:string, subscription:EntityReference, client:Client = null) {
        return <Q.Promise<Coupon>>Imports.Q.Promise((resolve, reject) => {
            try {
                var requestEntity = new Coupon({
                    couponCode: couponCode
                    }, client);

                var subscriptionIdentifier = Subscription.getIdentifier(subscription);

                var endpoint = Imports.util.format("%s/coupons", encodeURIComponent(subscriptionIdentifier));

                var responseEntity = new Coupon();
                var client = requestEntity.getClient();

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity)
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }
  }
}