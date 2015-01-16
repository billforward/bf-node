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
    static parseActioningTime(actioningTime, subscription = null): Q.Promise<BillingEntity> {
        return <Q.Promise<BillingEntity>>Q.Promise((resolve, reject) => {
            try {
                var date:any = null; // defaults to Immediate
                if (actioningTime instanceof Date) {
                    date = BillingEntity.makeBillForwardDate(actioningTime);
                } else if (actioningTime === 'AtPeriodEnd') {
                    if (!subscription) {
                        throw 'Failed to consult subscription to ascertain AtPeriodEnd time, because a null reference was provided to the subscription.';
                    }
                    return resolve(Subscription.fetchIfNecessary(subscription)
                        .then((subscription) => {
                            if ((<any>subscription).currentPeriodEnd) {
                                return (<any>subscription).currentPeriodEnd;
                            } else {
                                throw 'Cannot set actioning time to period end, because the subscription does not declare a period end. This could mean the subscription has not yet been instantiated by the BillForward engines. You could try again in a few seconds, or in future invoke this functionality after a WebHook confirms the subscription has reached the necessary state.';
                            }
                            }));
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
    applyActioningTime(actioningTime): Q.Promise<BillingEntity> {
        return <Q.Promise<BillingEntity>>Q.Promise((resolve, reject) => {
            try {
                var entityClass = this.getDerivedClass();
                return resolve(entityClass.parseActioningTime(actioningTime, (<any>this).subscriptionID)
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