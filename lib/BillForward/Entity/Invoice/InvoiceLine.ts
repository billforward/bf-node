module BillForward {
  export class InvoiceLine extends MutableEntity {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        // for now we will not unserialize unit of measure, since this seems to be non-guaranteed to exist

        this.unserialize(stateParams);
    }
  }
}