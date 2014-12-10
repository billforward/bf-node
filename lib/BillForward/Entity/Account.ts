module BillForward {
  export class Account extends InsertableEntity implements Controller {
    protected static _resourcePath = new ResourcePath('accounts', 'account');

    constructor() {
      super();
    }
  }
}