module BillForward {
  export class Account extends InsertableEntity {
    protected static _resourcePath = new ResourcePath('accounts', 'account');
  }
}