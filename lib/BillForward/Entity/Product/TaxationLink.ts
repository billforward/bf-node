module BillForward {
  export class TaxationLink extends MutableEntity {
  	protected static _resourcePath = new ResourcePath('taxation-links', 'TaxationLink');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}