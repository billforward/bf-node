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

    getCurrentPeriodEnd() {
        if ((<any>this).currentPeriodEnd) {
            return (<any>this).currentPeriodEnd;
        } else {
            throw 'Cannot set actioning time to period end, because the subscription does not declare a period end. This could mean the subscription has not yet been instantiated by the BillForward engines. You could try again in a few seconds, or in future invoke this functionality after a WebHook confirms the subscription has reached the necessary state.';
        }
    }

    getRatePlan():Q.Promise<ProductRatePlan> {
        return <Q.Promise<ProductRatePlan>>Imports.Q.Promise((resolve, reject) => {
            try {
                var ref:EntityReference;
                // could use ID
                if ((<any>this).productRatePlanID)
                ref = (<any>this).productRatePlanID;
                // prefer rate plan entity if present
                if ((<any>this).productRatePlan)
                ref = (<any>this).productRatePlan;

                return resolve(ProductRatePlan.fetchIfNecessary(ref));
            } catch(e) {
                return reject(e);
            }
        });
    }

    modifyUsage(componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Subscription> {
        return <Q.Promise<Subscription>>Imports.Q.Promise((resolve, reject) => {
            try {
                var currentPeriodEnd = this.getCurrentPeriodEnd();
                var validTil = currentPeriodEnd;

                var supportedChargeTypes = ["usage"];

                return resolve(this.getRatePlan()
                .then(ratePlan => {
                    var modifiedComponentValues = Imports._.map(componentNamesToValues,
                        (currentValue, currentName) => {
                            var matchedComponent = Imports._.find((<any>ratePlan).pricingComponents,
                                (pricingComponent) => {
                                    return (<any>pricingComponent).name === currentName;
                                });

                            console.log(matchedComponent.toString());

                            if (!matchedComponent) return;

                            if (!Imports._.contains(supportedChargeTypes, (<any>matchedComponent).chargeType))
                            throw Imports.util.format("Matched pricing component has charge type '%s'. must be within supported types: [%s].", (<any>matchedComponent).chargeType, supportedChargeTypes.join(", "));

                            return new PricingComponentValue({
                                pricingComponentID: (<any>matchedComponent).id,
                                value: currentValue,
                                validTill: validTil
                                });
                        });
                    (<any>this).pricingComponentValues = modifiedComponentValues;
                    return <Subscription>this;
                    }));
            } catch(e) {
                return reject(e);
            }
        });
    }
  }
}