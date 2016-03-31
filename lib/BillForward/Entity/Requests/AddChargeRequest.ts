module BillForward {
  export class AddChargeRequest extends BillingEntity {
    protected static _resourcePath = new ResourcePath('', '');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

	/**
     * Applies this AddChargeRequest to the specified Subscription
     * @param AddChargeRequest request entity
     * @return Q.Promise<SubscriptionCharge[]> The resulting SubscriptionCharges.
     */
    addToSubscription(subscription:EntityReference, client:Client = null) {
        var subSham = new Subscription({
            "id" : Subscription.getIdentifier(subscription)
            }, client);

        return subSham.addCharge(this, client);
    }

  }
}