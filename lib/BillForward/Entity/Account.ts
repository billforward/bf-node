module BillForward {
  export class Account extends MutableEntity {
    protected static _resourcePath = new ResourcePath('accounts', 'account');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.registerEntity('profile', Profile);
        this.unserialize(stateParams);
    }
  }
}