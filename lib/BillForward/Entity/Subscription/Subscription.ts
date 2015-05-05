module BillForward {
    export enum SubscriptionState {
        Trial,
        Provisioned,
        Paid,
        AwaitingPayment,
        Cancelled,
        Failed,
        Expired
    }

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
     * Gets Subscriptions by the specified state
     * @param ENUM['Trial', 'Provisioned', 'Paid', 'AwaitingPayment', 'Cancelled', 'Failed', 'Expired'] (ENUM: BillForward.SubscriptionState) Subscription state upon which to query.
     * @return Q.Promise<Subscription[]> The fetched Subscriptions.
     */
    static getByState(state:SubscriptionState, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
            try {
                var endpoint = Imports.util.format("state/%s", encodeURIComponent(SubscriptionState[state]));

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.getAndGrabCollection(endpoint, queryParams, client)
                    );
            } catch(e) {
                return reject(e);
            }
        });
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
     * Cancels subscription (now, or at a scheduled time).
     * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
     * @return Q.Promise<CancellationAmendment> The created cancellation amendment.
     */
    cancel(serviceEnd:ServiceEndState = ServiceEndState.AtPeriodEnd, actioningTime:ActioningTime = 'Immediate'):Q.Promise<CancellationAmendment> {
        return CancellationAmendment.construct(this, serviceEnd, actioningTime)
        .then(amendment => {
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

    /**
     * Registers (upon this subscription's model) the current consumption of pricing components.
     * This is recommended for initialising 'in advance' pricing components when the provisioned subscription is first being modelled.
     * 
     * @note Changes only the MODELLED subscription; you will need to run subscription.save() to persist the modelled changes to the API.
     * 
     * @param Dictionary<string, Number> Map of pricing component names to quantity consumed {'CPU': 97}
     * @return Subscription The modified Subscription model.
     */
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

    getCurrentPeriodStart() {
        if ((<any>this).currentPeriodStart) {
            return (<any>this).currentPeriodStart;
        } else {
            throw new BFPreconditionFailedError("Cannot set actioning time to period start, because the subscription does not declare a period start. This could mean the subscription is still in the 'Provisioned' state. Alternatively the subscription may not have been instantiated yet by the BillForward engines. You could try again in a few seconds, or wait for a WebHook (Domain 'Subscription', Action 'Updated') whose list of webhook.changes.auditFieldChanges includes an object auditFieldChange, where (auditFieldChange.attributeName === 'currentPeriodEnd').");
        }
    }

    getCurrentPeriodEnd() {
        if ((<any>this).currentPeriodEnd) {
            return (<any>this).currentPeriodEnd;
        } else {
            throw new BFPreconditionFailedError("Cannot set actioning time to period start, because the subscription does not declare a period start. This could mean the subscription is still in the 'Provisioned' state. Alternatively the subscription may not have been instantiated yet by the BillForward engines. You could try again in a few seconds, or wait for a WebHook (Domain 'Subscription', Action 'Updated') whose list of webhook.changes.auditFieldChanges includes an object auditFieldChange, where (auditFieldChange.attributeName === 'currentPeriodEnd').");
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

                return resolve(ProductRatePlan.fetchIfNecessary(ref)
                    .then((productRatePlan) => {
                        // cache because why not
                        (<any>this).productRatePlan = productRatePlan;
                        return (<any>this).productRatePlan;
                        })
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    /**
     * Registers (upon this subscription) the current consumption of usage-based pricing components. Pertains to the current period of the subscription.
     * This is intended only for 'usage' pricing components.
     * 'Usage' pricing components will return to 0 value upon entering the next billing period.
     * 
     * @param Dictionary<string, Number> Map of pricing component names to quantity consumed {'Bandwidth usage': 102}
     * @return Promise<Subscription> The updated Subscription.
     */
    modifyUsage(componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Subscription> {
        return <Q.Promise<Subscription>>Imports.Q.Promise((resolve, reject) => {
            try {
                return resolve((<any>this).modifyUsageHelper(componentNamesToValues)
                    .then(() => {
                        return Subscription.getByID((<any>this).id);
                        }))
            } catch(e) {
                return reject(e);
            }
            });
    }

    /**
     * Registers (upon this subscription) the current consumption of usage-based pricing components. Pertains to the current period of the subscription.
     * This is intended only for 'usage' pricing components.
     * 'Usage' pricing components will return to 0 value upon entering the next billing period.
     * 
     * @param Dictionary<string, Number> Map of pricing component names to quantity consumed {'Bandwidth usage': 102}
     * @param string? BillForward-formatted time until which the usage consumption applies.
     * @return Promise<PricingComponentValue[]> The created PricingComponentValues.
     */
    modifyUsageHelper(componentNamesToValues: { [componentName: string]:Number }, appliesTilOverride?:string):Q.Promise<Array<PricingComponentValue>> {
        return <Q.Promise<Array<PricingComponentValue>>>Imports.Q.Promise((resolve, reject) => {
            try {
                var appliesTil;
                if (appliesTilOverride) {
                    appliesTil = appliesTilOverride;
                } else {
                    var currentPeriodEnd = this.getCurrentPeriodEnd();
                    appliesTil = currentPeriodEnd;
                }

                var supportedChargeTypes = ["usage"];

                var componentGenerator = (correspondingComponent:any, mappedValue:Number) => {
                    return new PricingComponentValue({
                        pricingComponentID: correspondingComponent.id,
                        value: mappedValue,
                        appliesTill: appliesTil,
                        organizationID: correspondingComponent.organizationID,
                        subscriptionID: (<any>this).id
                        });
                }

                return resolve(this.getRatePlan()
                .then(ratePlan => {
                    var pricingComponents = (<any>ratePlan).pricingComponents;
                    
                    return Imports.Q.all(Imports._.map(Imports._.map(Imports._.keys(componentNamesToValues),
                        key => {
                            var mappedValue = componentNamesToValues[key];
                            var correspondingComponent = Imports._.find(pricingComponents,
                                pricingComponent => {
                                    // return as match if name matches a prescribed component
                                    return (<any>pricingComponent).name === key;
                                    });

                            if (!correspondingComponent) throw new BFInvocationError(Imports.util.format("We failed to find any pricing component whose name matches '%s'.", key));

                            if (!Imports._.contains(supportedChargeTypes, (<any>correspondingComponent).chargeType))
                            throw new BFInvocationError(Imports.util.format("Matched pricing component has charge type '%s'. must be within supported types: [%s].", (<any>correspondingComponent).chargeType, supportedChargeTypes.join(", ")));

                            return componentGenerator(correspondingComponent, mappedValue);
                            }), pricingComponentValueModel => {
                        return PricingComponentValue.create(pricingComponentValueModel);
                        }));
                    }));
            } catch(e) {
                return reject(e);
            }
        });
    }
  }
}