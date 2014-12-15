module BillForward {
  export class CancellationAmendment extends Amendment {
    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.applyType('CancellationAmendment');
        
        this.unserialize(stateParams);
    }
  }
}