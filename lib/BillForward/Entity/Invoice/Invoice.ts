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
  }
}