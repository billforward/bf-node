module BillForward {
  export class Amendment extends InsertableEntity {
    protected static _resourcePath = new ResourcePath('amendments', 'amendment');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}