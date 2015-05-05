module BillForward {
  export class Account extends MutableEntity {
    protected static _resourcePath = new ResourcePath('accounts', 'account');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('roles', Role);
        this.registerEntityArray('paymentMethods', PaymentMethod);
        
        this.registerEntity('profile', Profile);
        this.unserialize(stateParams);
    }

    /**
     * Issues to this account a credit note of the specified value and currency.
     * @param number Nominal value of credit note
     * @param ISO_4217_Currency_Code The currency code (e.g. 'USD')
     * @param string Description of the credit awarded
     * @return CreditNote the modelled credit note
     */
    issueCredit(value:number, currency:string = null, description:string = null):Q.Promise<CreditNote> {
        return Imports.Q.Promise((resolve, reject) => {
            try {
                var creditNote = CreditNote.construct(value, currency, description);
                return resolve(creditNote.issueToAccount(this));
            } catch (e) {
                return reject(e);
            }
        });
    }
  }
}