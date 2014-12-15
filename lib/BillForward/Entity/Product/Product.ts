module BillForward {
  export class Product extends MutableEntity {
    protected static _resourcePath = new ResourcePath('products', 'product');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }
  }
}