module BillForward {
  export class Invoice extends MutableEntity {
    protected static _resourcePath = new ResourcePath('invoices', 'invoice');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('invoiceLines', InvoiceLine);
        this.registerEntityArray('taxLines', TaxLine);
        this.registerEntityArray('invoicePayments', InvoicePayment);
        
        this.unserialize(stateParams);
    }

    /**
     * Registers (upon this invoice's subscription) the consumption of usage-based pricing components for the period described by this invoice.
     * This is intended only for 'usage' pricing components.
     *
     * @note Most likely you will want to invoke this.recalculate() after this' successful completion.
     * 
     * @param Dictionary<string, Number> Map of pricing component names to quantity consumed {'Bandwidth usage': 102}
     * @return Promise<PricingComponentValue[]> The created PricingComponentValues.
     */
    modifyUsage(componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Invoice> {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
            try {
                return resolve(Subscription.fetchIfNecessary((<any>this).subscriptionID)
                    .then((subscription:Subscription) => {
                        var appliesTil = (<any>this).periodStart;
                        return subscription.modifyUsageHelper(componentNamesToValues, appliesTil);
                        })
                    .then(() => {
                        // for chaining
                        return this;
                        }));
            } catch(e) {
                return reject(e);
            }
        });
    }

    /**
     * Issues invoice (now, or at a scheduled time).
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the 'issue amendment'
     * @return IssueInvoiceAmendment The created 'issue amendment'.
     */
    issue(actioningTime:ActioningTime = 'Immediate'):Q.Promise<IssueInvoiceAmendment> {
        return IssueInvoiceAmendment.construct(this, actioningTime)
        .then(amendment => {
            // create amendment using API
            return IssueInvoiceAmendment.create(amendment);
            });
    }

    /**
     * Recalculates invoice (now, or at a scheduled time).
     * @param string ENUM['Paid', 'Unpaid', 'Pending', 'Voided'] (Default: 'Pending') State to which the invoice will be moved following the recalculation.
     * @param string ENUM['RecalculateAsLatestSubscriptionVersion', 'RecalculateAsCurrentSubscriptionVersion'] (Default: 'RecalculateAsLatestSubscriptionVersion') How to recalculate the invoice.
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the 'recalculate invoice' amendment
     * @return InvoiceRecalculationAmendment The created 'recalculate invoice' amendment.
     */
    recalculate(newInvoiceState:InvoiceState = InvoiceState.Pending, recalculationBehaviour:InvoiceRecalculationBehaviour = InvoiceRecalculationBehaviour.RecalculateAsLatestSubscriptionVersion, actioningTime:ActioningTime = 'Immediate'):Q.Promise<InvoiceRecalculationAmendment> {
        return InvoiceRecalculationAmendment.construct(this, newInvoiceState, recalculationBehaviour, actioningTime)
        .then(amendment => {
            // create amendment using API
            return InvoiceRecalculationAmendment.create(amendment);
            });
    }
  }
}