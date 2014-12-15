module BillForward {
  export class StripeACHToken extends MutableEntity {
  	/* WARNING: resource paths for StripeACHToken do not follow the usual pattern;
	 * instead of posting to 'root' of a URL root reserved for StripeACHToken, 
	 * this routing is a bit less standard; for example we can't GET from the same
	 * place we POST to.
	 */
    protected static _resourcePath = new ResourcePath('vaulted-gateways/stripe-ACH', 'stripe_ach_token');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}