module BillForward {
  export class Address extends MutableEntity {
    protected static _resourcePath = new ResourcePath('addresses', 'address');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}