module BillForward {
  export class AmendmentDiscardAmendment extends Amendment {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.applyType('AmendmentDiscardAmendment');
        
        this.unserialize(stateParams);
    }

    /**
	 * Discards amendment (now, or at a scheduled time).
	 * @param mixed ENUM[string id, Amendment entity] Reference to the amendment. <id>: Fetches amendment by ID. <Amendment>: Uses amendment as-is.
	 * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
	 * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
	 * @return AmendmentDiscardAmendment The created cancellation amendment.
	 */
    static construct(amendment:EntityReference, actioningTime:ActioningTime = 'Immediate'): Q.Promise<AmendmentDiscardAmendment> {
        return <Q.Promise<AmendmentDiscardAmendment>>Imports.Q.Promise((resolve, reject) => {
            try {
                return resolve(Amendment.fetchIfNecessary(amendment)
                	.then(amendment => {
                		var discardModel = new AmendmentDiscardAmendment({
		                    'amendmentToDiscardID': (<any>amendment).id,
		                    'subscriptionID': (<any>amendment).subscriptionID
		                });

		                return discardModel.applyActioningTime(actioningTime, (<any>amendment).subscriptionID);
                		}));
            } catch (e) {
                return reject(e);
            }
        });
	}
  }
}