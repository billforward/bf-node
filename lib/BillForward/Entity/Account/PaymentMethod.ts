module BillForward {
  export class PaymentMethod extends MutableEntity {
    protected static _resourcePath = new ResourcePath('payment-methods', 'paymentMethod');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}