module BillForward {

  export class Account extends BillingEntity {
    protected static _resourcePath = new ResourcePath('accounts', 'account');

    constructor() {
      super();
    }
  } 
}