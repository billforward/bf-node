module BillForward {
  export class Coupon extends MutableEntity {
    protected static _resourcePath = new ResourcePath('coupons', 'Coupon');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    getBaseCode() {
        if ((<any>this).parentCouponCode) {
            return (<any>this).parentCouponCode;
        }
        return (<any>this).couponCode;
    }

    createUniqueCodes(quantity:number, client:Client = null) {
        return <Q.Promise<Array<CouponUniqueCodesResponse>>>this.getDerivedClass().createUniqueCodesFromBaseCode(this.getBaseCode(), quantity, client);
    }

    getUnusedUniqueCodes(queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Array<CouponUniqueCodesResponse>>>this.getDerivedClass().getUnusedUniqueCodesFromBaseCode(this.getBaseCode(), queryParams, client);
    }

    applyToSubscription(subscription:EntityReference, client:Client = null) {
        return <Q.Promise<Coupon>>this.getDerivedClass().applyCouponCodeToSubscription(this.getBaseCode(), subscription, client);
    }

    static applyCouponCodeToSubscription(couponCode:string, subscription:EntityReference, client:Client = null) {
        return <Q.Promise<Coupon>>AddCouponCodeRequest.applyCouponCodeToSubscription(couponCode, subscription, client);
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

    static createUniqueCodesFromBaseCode(baseCode:string, quantity:number, client:Client = null) {
        return <Q.Promise<Array<CouponUniqueCodesResponse>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var requestEntity = new Coupon({
                    'quantity': quantity
                    }, client);

                var endpoint = Imports.util.format("%s/codes", encodeURIComponent(baseCode));

                var responseEntity = new CouponUniqueCodesResponse();
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