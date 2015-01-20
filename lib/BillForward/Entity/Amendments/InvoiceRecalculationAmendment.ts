module BillForward {
    export enum InvoiceState {
        Paid,
        Unpaid,
        Pending,
        Voided
    }

    export enum InvoiceRecalculationBehaviour {
        RecalculateAsLatestSubscriptionVersion,
        RecalculateAsCurrentSubscriptionVersion
    }

  export class InvoiceRecalculationAmendment extends Amendment {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client, true);

        this.applyType('InvoiceRecalculationAmendment');
        
        this.unserialize(stateParams);
    }

	/**
     * Recalculates invoice (now, or at a scheduled time).
     * @param mixed ENUM[string id, Invoice entity] Reference to the invoice. <id>: Fetches invoice by ID. <Invoice>: Uses invoice as-is.
     * @param string ENUM['Paid', 'Unpaid', 'Pending', 'Voided'] (Default: 'Pending') State to which the invoice will be moved following the recalculation.
     * @param string ENUM['RecalculateAsLatestSubscriptionVersion', 'RecalculateAsCurrentSubscriptionVersion'] (Default: 'RecalculateAsLatestSubscriptionVersion') How to recalculate the invoice.
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
     * @return InvoiceRecalculationAmendment The created 'invoice recalculation' amendment.
     */
	static construct(invoice:any, newInvoiceState:InvoiceState = InvoiceState.Pending, recalculationBehaviour:InvoiceRecalculationBehaviour = InvoiceRecalculationBehaviour.RecalculateAsLatestSubscriptionVersion, actioningTime:ActioningTime = 'Immediate'): Q.Promise<InvoiceRecalculationAmendment> {
    	return <Q.Promise<InvoiceRecalculationAmendment>>Imports.Q.Promise((resolve, reject) => {
	        try {
	        	return resolve(Invoice.fetchIfNecessary(invoice)
	        	.then(invoice => {
	        		var amendment = new InvoiceRecalculationAmendment({
						'invoiceID': (<any>invoice).id,
						'subscriptionID': (<any>invoice).subscriptionID
					});

					(<any>amendment).recalculationBehaviour = recalculationBehaviour;
					(<any>amendment).newInvoiceState = newInvoiceState;

					return amendment.applyActioningTime(actioningTime, (<any>invoice).subscriptionID);
	        		}));
			} catch (e) {
                return reject(e);
            }
		});
	}
  }
}