module BillForward {
  export class TrustCommerceToken extends MutableEntity {
  	/* WARNING: resource paths for TrustCommerceToken do not follow the usual pattern;
	 * instead of posting to 'root' of a URL root reserved for TrustCommerceToken, 
	 * this routing is a bit less standard; for example we can't GET from the same
	 * place we POST to.
	 */
    protected static _resourcePath = new ResourcePath('vaulted-gateways/trustCommerce', 'trustCommerceToken');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}