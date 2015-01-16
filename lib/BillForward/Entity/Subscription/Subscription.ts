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
    cancel(serviceEnd:ServiceEndState = ServiceEndState.AtPeriodEnd, actioningTime:any = 'Immediate'):Q.Promise<CancellationAmendment> {
        return CancellationAmendment.construct(this, serviceEnd, actioningTime)
        .then((amendment:CancellationAmendment) => {
            // create amendment using API
            return CancellationAmendment.create(amendment);
            });
    }

    usePaymentMethodsFromAccountByID(accountID:string):Q.Promise<Subscription> {
        return Account.getByID(accountID)
        .then((account:Account) => {
            return this.usePaymentMethodsFromAccount(account);
            });
    }

    usePaymentMethodsFromAccount(account:Account = null):Q.Promise<Subscription> {
        return <Q.Promise<Subscription>>Imports.Q.Promise((resolve, reject) => {
            try {
                if (!account) {
                    return resolve(this.usePaymentMethodsFromAccountByID((<any>this).accountID));
                }

                if (!(<any>this).paymentMethodSubscriptionLinks)
                (<any>this).paymentMethodSubscriptionLinks = [];

                // set existing subscription links as deleted
                Imports._.each((<any>this).paymentMethodSubscriptionLinks, function(paymentMethodSubscriptionLink:any) {
                    paymentMethodSubscriptionLink.deleted = true;
                });

                var newLinks = Imports._.map((<any>account).paymentMethods, function(paymentMethod:any) {
                    return new PaymentMethodSubscriptionLink({
                        paymentMethodID: paymentMethod.id
                    });
                });

                (<any>this).paymentMethodSubscriptionLinks = (<any>this).paymentMethodSubscriptionLinks.concat(newLinks);
                return resolve(<any>this);
            } catch(e) {
                return reject(e);
            }
        });
    }

    setValuesOfPricingComponentsByName(componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Subscription> {
        return this.useValuesForNamedPricingComponentsOnRatePlanByID((<any>this).productRatePlanID, componentNamesToValues);
    }

    useValuesForNamedPricingComponentsOnRatePlanByID(ratePlanID:string, componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Subscription> {
        return ProductRatePlan.getByID(ratePlanID)
        .then((ratePlan:ProductRatePlan) => {
            return this.useValuesForNamedPricingComponentsOnRatePlan(ratePlan, componentNamesToValues);
            });
    }

    useValuesForNamedPricingComponentsOnRatePlan(ratePlan:ProductRatePlan, componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Subscription> {
        return <Q.Promise<Subscription>>Imports.Q.Promise((resolve, reject) => {
            try {
                var componentIDsAgainstValues = Imports._.map(componentNamesToValues, function(currentValue, currentName) {
                    var matchedComponent = Imports._.find((<any>ratePlan).pricingComponents, function(component) {
                        return (<any>component).name === currentName;
                    });
                    return new PricingComponentValue({
                        pricingComponentID: (<any>matchedComponent).id,
                        value: currentValue
                        });
                });
                (<any>this).pricingComponentValues = componentIDsAgainstValues;
                return resolve(<any>this);
            } catch(e) {
                return reject(e);
            }
        });
    }
  }
}