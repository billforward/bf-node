module BillForward {
  export class Account extends MutableEntity {
    protected static _resourcePath = new ResourcePath('accounts', 'account');
  }
}