module BillForward {
  export class SubscriptionCharge extends MutableEntity {
    protected static _resourcePath = new ResourcePath('charges', 'subscriptionCharge');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    /**
     * Gets SubscriptionCharges belonging to the specified Subscription
     * @param EntityReference Reference to the entity. <string>: ID of the entity. <Subscription>: Entity object, from whom an ID can be extracted.
     * @return Q.Promise<SubscriptionCharge[]> The fetched SubscriptionCharges.
     */
    static getBySubscription(subscription:EntityReference, queryParams:Object = {}, client:Client = null) {
        return Subscription.fetchIfNecessary(subscription)
        .then((sub) => {
            return (<Subscription>sub).getCharges(queryParams, client);
            });
    }
  }
}