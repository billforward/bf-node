module BillForward {
  export class StripeToken extends MutableEntity {
  	/* WARNING: resource paths for StripeTokens do not follow the usual pattern;
	 * instead of posting to 'root' of a URL root reserved for StripeTokens, 
	 * this routing is a bit less standard; for example we can't GET from the same
	 * place we POST to.
	 */
    protected static _resourcePath = new ResourcePath('vaulted-gateways/stripe', 'stripe_token');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}