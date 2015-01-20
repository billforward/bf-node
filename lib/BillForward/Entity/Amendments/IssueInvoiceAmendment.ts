module BillForward {
  export class IssueInvoiceAmendment extends Amendment {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.applyType('IssueInvoiceAmendment');
        
        this.unserialize(stateParams);
    }

	/**
	 * Issues invoice at a specified time.
	 * @param mixed ENUM[string id, Invoice entity] Reference to the invoice. <id>: Fetches invoice by ID. <Invoice>: Uses invoice as-is.
	 * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
	 * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
	 * @return IssueInvoiceAmendment The created cancellation amendment.
	 */
	static construct(invoice:any, actioningTime:ActioningTime = 'Immediate'): Q.Promise<IssueInvoiceAmendment> {
    	return <Q.Promise<IssueInvoiceAmendment>>Imports.Q.Promise((resolve, reject) => {
	        try {
	        	return resolve(Invoice.fetchIfNecessary(invoice)
	        	.then(invoice => {
	        		var amendment = new IssueInvoiceAmendment({
						'invoiceID': (<any>invoice).id,
						'subscriptionID': (<any>invoice).subscriptionID
					});

					return amendment.applyActioningTime(actioningTime, (<any>invoice).subscriptionID);
	        		}));
			} catch (e) {
                return reject(e);
            }
		});
	}
  }
}