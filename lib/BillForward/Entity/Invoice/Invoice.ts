module BillForward {
  export class Invoice extends MutableEntity {
    protected static _resourcePath = new ResourcePath('invoices', 'invoice');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);

        this.registerEntityArray('invoiceLines', InvoiceLine);
        this.registerEntityArray('taxLines', TaxLine);
        this.registerEntityArray('invoicePayments', InvoicePayment);
        
        this.unserialize(stateParams);
    }

    static getForSubscription(subscription:EntityReference, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
            try {
                var subscriptionIdentifier = Subscription.getIdentifier(subscription);

                var endpoint = Imports.util.format("subscription/%s", encodeURIComponent(subscriptionIdentifier));

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.getAndGrabCollection(endpoint, queryParams, client)
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    static getForSubscriptionVersion(subscriptionVersionID:string, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
            try {
                var endpoint = Imports.util.format("subscription/version/%s", encodeURIComponent(subscriptionVersionID));

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.getAndGrabCollection(endpoint, queryParams, client)
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    static getForAccount(account:EntityReference, queryParams:Object = {}, client:Client = null) {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
            try {
                var accountIdentifier = Account.getIdentifier(account);

                var endpoint = Imports.util.format("account/%s", encodeURIComponent(accountIdentifier));

                var myClass = this.getDerivedClassStatic();
                return resolve(
                    myClass.getAndGrabCollection(endpoint, queryParams, client)
                    );
            } catch(e) {
                return reject(e);
            }
        });
    }

    /**
     * Registers (upon this invoice's subscription) the consumption of usage-based pricing components for the period described by this invoice.
     * This is intended only for 'usage' pricing components.
     *
     * @note Most likely you will want to invoke this.recalculate() after this' successful completion.
     * 
     * @param Dictionary<string, Number> Map of pricing component names to quantity consumed {'Bandwidth usage': 102}
     * @return Promise<PricingComponentValue[]> The created PricingComponentValues.
     */
    modifyUsage(componentNamesToValues: { [componentName: string]:Number }):Q.Promise<Invoice> {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
            try {
                return resolve(Subscription.fetchIfNecessary((<any>this).subscriptionID)
                    .then((subscription:Subscription) => {
                        var appliesTil = (<any>this).periodStart;
                        return subscription.modifyUsageHelper(componentNamesToValues, appliesTil);
                        })
                    .then(() => {
                        // for chaining
                        return this;
                        }));
            } catch(e) {
                return reject(e);
            }
        });
    }

    /**
     * Issues invoice (now, or at a scheduled time).
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the 'issue amendment'
     * @return IssueInvoiceAmendment The created 'issue amendment'.
     */
    issue(actioningTime:ActioningTime = 'Immediate'):Q.Promise<IssueInvoiceAmendment> {
        return IssueInvoiceAmendment.construct(this, actioningTime)
        .then(amendment => {
            // create amendment using API
            return IssueInvoiceAmendment.create(amendment);
            });
    }

    /**
     * Recalculates invoice (now, or at a scheduled time).
     * @param string ENUM['Paid', 'Unpaid', 'Pending', 'Voided'] (Default: 'Pending') State to which the invoice will be moved following the recalculation.
     * @param string ENUM['RecalculateAsLatestSubscriptionVersion', 'RecalculateAsCurrentSubscriptionVersion'] (Default: 'RecalculateAsLatestSubscriptionVersion') How to recalculate the invoice.
     * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the 'recalculate invoice' amendment
     * @return InvoiceRecalculationAmendment The created 'recalculate invoice' amendment.
     */
    recalculate(newInvoiceState:InvoiceState = InvoiceState.Pending, recalculationBehaviour:InvoiceRecalculationBehaviour = InvoiceRecalculationBehaviour.RecalculateAsLatestSubscriptionVersion, actioningTime:ActioningTime = 'Immediate'):Q.Promise<InvoiceRecalculationAmendment> {
        return InvoiceRecalculationAmendment.construct(this, newInvoiceState, recalculationBehaviour, actioningTime)
        .then(amendment => {
            // create amendment using API
            return InvoiceRecalculationAmendment.create(amendment);
            });
    }

    /**
     * Synchronously retries execution of the invoice.
     * @param Object $executionOptions (Default: All keys set to their respective default values) Encapsulates the following optional parameters:
     *  * @param bool $..['forcePaid'] (Default: false) Whether to force the invoice into the paid state using an 'offline payment'.
     */
    retryExecution(payload:Object) {
        return <Q.Promise<Invoice>>Imports.Q.Promise((resolve, reject) => {
          try {
            var invoiceIdentifier = Invoice.getIdentifier(this);

            var myClass = this.getDerivedClass();
            var client:Client = this.getClient();

            return resolve(
                myClass.makePostPromise(
                    Imports.util.format(
                        "%s/execute",
                        invoiceIdentifier
                        ),
                    null,
                    payload || {},
                    client
                    )
              .then((payload) => {
                return myClass.getFirstEntityFromResponse(payload, client);
              }));
          } catch(e) {
              return reject(e);
          }
      });
    }
  }
}