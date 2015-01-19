module BillForward {
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

    discard() {
		// create model of amendment
		var amendment = new AmendmentDiscardAmendment({
			'amendmentToDiscardID': (<any>this).id,
			'subscriptionID': (<any>this).subscriptionID
		});

		return AmendmentDiscardAmendment.create(amendment);
	}

    /**
     * Parses into a BillForward timestamp the actioning time for some amendment
     * @param mixed[int timestamp, 'Immediate', 'AtPeriodEnd'] (Default: 'Immediate') When to action the issuance amendment.
     * @param mixed[NULL, string subscriptionID, Bf_Subscription subscription] (Default: NULL) Reference to subscription (required only for 'AtPeriodEnd' time).
     * @return string The BillForward-formatted time.
     */
    static parseActioningTime(actioningTime, subscription = null): Q.Promise<string> {
        return <Q.Promise<string>>Imports.Q.Promise((resolve, reject) => {
            try {
                var date:any = null; // defaults to Immediate
                if (actioningTime instanceof Date) {
                    date = BillingEntity.makeBillForwardDate(actioningTime);
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
    applyActioningTime(actioningTime, subscription = null): Q.Promise<BillingEntity> {
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