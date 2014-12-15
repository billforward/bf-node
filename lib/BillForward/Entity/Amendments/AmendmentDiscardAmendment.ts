module BillForward {
  export class AmendmentDiscardAmendment extends Amendment {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.applyType('AmendmentDiscardAmendment');
        
        this.unserialize(stateParams);
    }
  }
}