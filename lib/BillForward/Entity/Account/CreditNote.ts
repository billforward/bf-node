module BillForward {
  export class CreditNote extends MutableEntity {
    protected static _resourcePath = new ResourcePath('credit-notes', 'creditNote');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    /**
	 * Constructs a model of a CreditNote of the specified value and currency.
	 * @param number Nominal value of credit note
	 * @param ISO_4217_Currency_Code The currency code (e.g. 'USD')
	 * @param string Description of the credit awarded
	 * @return CreditNote the modelled credit note
	 */
    static construct(value:number, currency:string = null, description:string = null) {
    	var stateParams:any = {
    		nominalValue:value,
    		};
    	if(currency) {
    		stateParams.currency = currency;
    	}
    	if(description) {
    		stateParams.description = description;
    	}

    	return new CreditNote(stateParams);
    }

    /**
	 * Issues this credit note to the specified subscription
     * @param EntityReference Reference to the entity. <string>: ID of the entity. <Subscription>: Entity object, from whom an ID can be extracted.
	 * @return CreditNote The issued credit note
	 */
    issueToSubscription(subscription:EntityReference):Q.Promise<CreditNote> {
    	return Imports.Q.Promise((resolve, reject) => {
            try {
    			var requestEntity = this;

                var endpoint = Imports.util.format("%s/credit", encodeURIComponent(Subscription.getIdentifier(subscription)));

                var responseEntity = new CreditNote();
                var client = requestEntity.getClient();

                return resolve(
                    Subscription.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity)
                    );
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
	 * Issues this credit note to the specified account
	 * @return CreditNote The issued credit note
	 */
    issueToAccount(account:EntityReference):Q.Promise<CreditNote> {
    	return Imports.Q.Promise((resolve, reject) => {
            try {
    			var requestEntity = this;

                var endpoint = Imports.util.format("%s/credit", encodeURIComponent(Account.getIdentifier(account)));

                var responseEntity = new CreditNote();
                var client = requestEntity.getClient();

                return resolve(
                    Account.postEntityAndGrabFirst(endpoint, null, requestEntity, client, responseEntity)
                    );
            } catch (e) {
                return reject(e);
            }
        });
    }
  }
}