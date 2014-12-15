module BillForward {
  export class PaymentMethodSubscriptionLink extends MutableEntity {
    protected static _resourcePath = new ResourcePath('payment-method-subscription-links', 'PaymentMethodSubscriptionLink');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}