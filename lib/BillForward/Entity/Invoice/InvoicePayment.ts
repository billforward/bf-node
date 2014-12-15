module BillForward {
  export class InvoicePayment extends MutableEntity {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}