module BillForward {
  export class ComponentChange extends MutableEntity {
    protected static _resourcePath = new ResourcePath('', 'ComponentChange');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}