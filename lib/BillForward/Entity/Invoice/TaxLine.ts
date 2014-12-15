module BillForward {
  export class TaxLine extends InsertableEntity {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}