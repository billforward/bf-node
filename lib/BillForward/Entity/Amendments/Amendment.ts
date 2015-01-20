module BillForward {
    export type ActioningTime = string | Date;

  export class Amendment extends InsertableEntity {
    protected static _resourcePath = new ResourcePath('amendments', 'amendment');

    constructor(stateParams:Object = {}, client:Client = null, skipUnserialize:boolean = false) {
        super(stateParams, client);
        
        // derived amendments should tell their base class to skip unserialization
        if (!skipUnserialize)
        this.unserialize(stateParams);
    }

    applyType(type:string) {
    	this['@type'] = type;
    }

    /**
     * Discards amendment at a specified time.
     * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
     * @return Q.Promise<CancellationAmendment> The created cancellation amendment.
     */
    discard(actioningTime:ActioningTime = 'Immediate'):Q.Promise<AmendmentDiscardAmendment> {
        return AmendmentDiscardAmendment.construct(this, actioningTime)
        .then(amendment => {
            // create amendment using API
            return AmendmentDiscardAmendment.create(amendment);
            });
    }

    /**
     * Parses into a BillForward timestamp the actioning time for some amendment
     * @param mixed[int timestamp, 'Immediate', 'AtPeriodEnd'] (Default: 'Immediate') When to action the issuance amendment.
     * @param mixed[NULL, string subscriptionID, Bf_Subscription subscription] (Default: NULL) Reference to subscription (required only for 'AtPeriodEnd' time).
     * @return string The BillForward-formatted time.
     */
    static parseActioningTime(actioningTime:ActioningTime, subscription = null): Q.Promise<string> {
        return <Q.Promise<string>>Imports.Q.Promise((resolve, reject) => {
            try {
                var date:string = null; // defaults to Immediate
                if (<any>actioningTime instanceof Date) {
                    date = BillingEntity.makeBillForwardDate(<Date>actioningTime);
                } else if (actioningTime === 'AtPeriodEnd') {
                    if (!subscription) {
                        throw 'Failed to consult subscription to ascertain AtPeriodEnd time, because a null reference was provided to the subscription.';
                    }
                    return resolve(Subscription.fetchIfNecessary(subscription)
                        .then(subscription => (<Subscription>subscription).getCurrentPeriodEnd));
                }
                return resolve(date);
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * Assigns to this amendment the specified actioning time.
     * @param mixed[int timestamp, 'Immediate', 'AtPeriodEnd'] (Default: 'Immediate') When to action the issuance amendment.
     * @param mixed[NULL, string subscriptionID, Bf_Subscription subscription] (Default: NULL) Reference to subscription (required only for 'AtPeriodEnd' time).
     * @return static The modified Bf_Amendment model.
     */
    applyActioningTime(actioningTime:ActioningTime, subscription = null): Q.Promise<BillingEntity> {
        return <Q.Promise<BillingEntity>>Imports.Q.Promise((resolve, reject) => {
            try {
                var entityClass = this.getDerivedClass();
                return resolve(entityClass.parseActioningTime(actioningTime, subscription)
                .then((parsedActioningTime) => {
                    // if null, defaults to 'Immediate'
                    if (parsedActioningTime !== null) {
                        (<any>this).actioningTime = parsedActioningTime;
                    }
                    return this;
                    }));
            } catch (e) {
                return reject(e);
            }
        });
    }
  }
}