module BillForward {
  export class AuthorizeNetToken extends MutableEntity {
  	/* WARNING: resource paths for AuthorizeNetToken do not follow the usual pattern;
	 * instead of posting to 'root' of a URL root reserved for AuthorizeNetToken, 
	 * this routing is a bit less standard; for example we can't GET from the same
	 * place we POST to.
	 */
    protected static _resourcePath = new ResourcePath('vaulted-gateways/authorize-net', 'authorizeNetToken');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}