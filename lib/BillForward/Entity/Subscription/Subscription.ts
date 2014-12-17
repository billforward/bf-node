module BillForward {
  export class Subscription extends MutableEntity {
    protected static _resourcePath = new ResourcePath('subscriptions', 'subscription');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('pricingComponentValueChanges', PricingComponentValueChange);
        this.registerEntityArray('pricingComponentValues', PricingComponentValue);
        this.registerEntityArray('paymentMethodSubscriptionLinks', PaymentMethodSubscriptionLink);
        
        this.registerEntity('productRatePlan', ProductRatePlan);
        this.unserialize(stateParams);
    }

    /**
     * Attempts to put subscription in 'state: "AwaitingPayment"'
     * @return Q.Promise<Subscription> The updated Subscription
     */
    activate() {
        (<any>this).state = 'AwaitingPayment';
        return this.save();
    }

    /**
     * Cancels subscription at a specified time.
     * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
     * @return Q.Promise<CancellationAmendment> The created cancellation amendment.
     */
    cancel(serviceEnd:ServiceEndTime = ServiceEndTime.AtPeriodEnd, actioningTime:any = 'Immediate') {
        var amendment = CancellationAmendment.construct(this, serviceEnd, actioningTime);

        // create amendment using API
        var promise = CancellationAmendment.create(amendment);
        return promise;
    }
  }
}