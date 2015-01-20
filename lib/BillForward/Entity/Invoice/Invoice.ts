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