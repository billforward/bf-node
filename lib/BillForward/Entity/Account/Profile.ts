module BillForward {
  export class Profile extends MutableEntity {
    protected static _resourcePath = new ResourcePath('profiles', 'profile');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.registerEntityArray('addresses', Address);
        this.unserialize(stateParams);
    }
  }
}