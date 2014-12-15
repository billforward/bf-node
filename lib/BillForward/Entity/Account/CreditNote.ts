module BillForward {
  export class CreditNote extends MutableEntity {
    protected static _resourcePath = new ResourcePath('credit-notes', 'creditNote');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}