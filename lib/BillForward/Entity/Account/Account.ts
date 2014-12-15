module BillForward {
  export class Account extends MutableEntity {
    protected static _resourcePath = new ResourcePath('accounts', 'account');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('roles', Role);
        this.registerEntityArray('paymentMethods', PaymentMethod);
        
        this.registerEntity('profile', Profile);
        this.unserialize(stateParams);
    }
  }
}