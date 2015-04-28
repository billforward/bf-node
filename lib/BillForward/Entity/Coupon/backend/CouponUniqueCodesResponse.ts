module BillForward {
	export class CouponUniqueCodesResponse extends BillingEntity {
		constructor(stateParams:Object = {}, client:Client = null) {
	        super(stateParams, client);
	        
	        this.unserialize(stateParams);
	    }
		
	}
}