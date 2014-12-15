module BillForward {
  export class Organisation extends MutableEntity {
    protected static _resourcePath = new ResourcePath('organizations', 'organization');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('apiConfigurations', APIConfiguration);
        
        this.unserialize(stateParams);
    }
  }
}