module BillForward {
  export class UnitOfMeasure extends MutableEntity {
    protected static _resourcePath = new ResourcePath('units-of-measure', 'unitOfMeasure');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.unserialize(stateParams);
    }
  }
}