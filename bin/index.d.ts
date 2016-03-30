/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    type clientConstructObj = {
        accessToken: string;
        urlRoot: string;
        requestLogging?: boolean;
        responseLogging?: boolean;
        errorLogging?: boolean;
        longStack?: boolean;
    };
    class Client {
        private static singletonClient;
        private accessToken;
        private urlRoot;
        private requestLogging;
        private responseLogging;
        private errorLogging;
        private longStack;
        constructor(accessToken: string, urlRoot: string, requestLogging?: boolean, responseLogging?: boolean, errorLogging?: boolean, longStack?: boolean);
        getAccessToken(): string;
        getUrlRoot(): string;
        static setDefault(client: Client): Client;
        static makeDefault(obj: clientConstructObj): Client;
        static makeDefault(accessToken: string, urlRoot?: string, requestLogging?: boolean, responseLogging?: boolean, errorLogging?: boolean, longStack?: boolean): Client;
        static getDefaultClient(): Client;
        request(verb: string, path: string, queryParams?: Object, json?: Object): Q.Promise<any>;
        static mockableRequestWrapper(callVerb: string, callArgs: Array<any>): any;
        private successResponse(obj);
        private errorResponse(input);
    }
}
declare module BillForward {
    type EntityReference = string | BillingEntity;
    class BillingEntity {
        protected _client: Client;
        protected _exemptFromSerialization: Array<string>;
        protected _registeredEntities: {
            [classKey: string]: typeof BillingEntity;
        };
        protected _registeredEntityArrays: {
            [classKey: string]: typeof BillingEntity;
        };
        constructor(stateParams?: Object, client?: Client);
        getClient(): Client;
        setClient(client: Client): void;
        protected static resolveRoute(endpoint?: string): string;
        protected static makeHttpPromise(verb: string, endpoint: string, queryParams: Object, payload: Object, client?: Client): Q.Promise<any>;
        protected static makeGetPromise(endpoint: string, queryParams: Object, client?: Client): Q.Promise<BillingEntity[]>;
        protected static makePutPromise(endpoint: string, queryParams: Object, payload: Object, client?: Client): Q.Promise<BillingEntity[]>;
        protected static makePostPromise(endpoint: string, queryParams: Object, payload: Object, client?: Client): Q.Promise<BillingEntity[]>;
        protected static postEntityAndGrabFirst(endpoint: string, queryParams: Object, entity: BillingEntity, client?: Client, responseEntity?: BillingEntity): Q.Promise<BillingEntity>;
        protected static postEntityAndGrabCollection(endpoint: string, queryParams: Object, entity: BillingEntity, client?: Client, responseEntity?: BillingEntity): Q.Promise<BillingEntity[]>;
        protected static postAndGrabFirst(endpoint: string, queryParams: Object, payload: Object, client?: Client, responseEntity?: BillingEntity): Q.Promise<BillingEntity>;
        protected static postAndGrabCollection(endpoint: string, queryParams: Object, payload: Object, client?: Client, responseEntity?: BillingEntity): Q.Promise<BillingEntity[]>;
        protected static getAndGrabFirst(endpoint: string, queryParams: Object, client?: Client, responseEntity?: BillingEntity): Q.Promise<BillingEntity>;
        protected static getAndGrabCollection(endpoint: string, queryParams: Object, payload: Object, client?: Client, responseEntity?: BillingEntity): Q.Promise<BillingEntity[]>;
        static getByID(id: string, queryParams?: Object, client?: Client): Q.Promise<BillingEntity>;
        static getAll(queryParams?: Object, client?: Client): Q.Promise<BillingEntity[]>;
        static getResourcePath(): any;
        static getSingletonClient(): Client;
        static getDerivedClassStatic(): any;
        protected registerEntity(key: string, entityClass: typeof BillingEntity): void;
        protected registerEntityArray(key: string, entityClass: typeof BillingEntity): void;
        getDerivedClass(): any;
        static serializeProperty(value: any): any;
        serialize(): Object;
        toString(): string;
        protected unserialize(json: Object): void;
        protected addToEntity(key: string, value: any): void;
        protected buildEntity(entityClass: typeof BillingEntity, constructArgs: any): BillingEntity;
        protected buildEntityArray(entityClass: typeof BillingEntity, constructArgs: Array<any>): Array<BillingEntity>;
        protected static getFirstEntityFromResponse(payload: any, client: Client): BillingEntity;
        protected static getAllEntitiesFromResponse(payload: any, client: Client): Array<BillingEntity>;
        protected static makeEntityFromPayload(payload: Object, client: Client): BillingEntity;
        static fetchIfNecessary(entityReference: EntityReference): Q.Promise<BillingEntity>;
        static getIdentifier(entityReference: EntityReference): string;
        static makeBillForwardDate(date: Date): string;
        static getBillForwardNow(): any;
    }
}
declare module BillForward {
    class InsertableEntity extends BillingEntity {
        constructor(stateParams?: Object, client?: Client);
        static create(entity: InsertableEntity): Q.Promise<any>;
    }
}
declare module BillForward {
    class MutableEntity extends InsertableEntity {
        constructor(stateParams?: Object, client?: Client);
        save(): Q.Promise<any>;
    }
}
declare module BillForward {
    class ResourcePath {
        protected path: any;
        protected entityName: any;
        constructor(path: string, entityName: string);
        getPath(): string;
        getEntityName(): string;
    }
}
declare module BillForward {
    class Account extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        issueCredit(value: number, currency?: string, description?: string): Q.Promise<CreditNote>;
    }
}
declare module BillForward {
    class Address extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class CreditNote extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        static construct(value: number, currency?: string, description?: string): CreditNote;
        issueToSubscription(subscription: EntityReference): Q.Promise<CreditNote>;
        issueToAccount(account: EntityReference): Q.Promise<CreditNote>;
    }
}
declare module BillForward {
    class PaymentMethod extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Profile extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Role extends InsertableEntity {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    type ActioningTime = string | Date;
    class Amendment extends InsertableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client, skipUnserialize?: boolean);
        applyType(type: string): void;
        static getBySubscription(subscription: EntityReference, queryParams?: Object, client?: Client): Q.Promise<Amendment>;
        discard(actioningTime?: ActioningTime): Q.Promise<AmendmentDiscardAmendment>;
        static parseActioningTime(actioningTime: ActioningTime, subscription?: any): Q.Promise<string>;
        applyActioningTime(actioningTime: ActioningTime, subscription?: any): Q.Promise<BillingEntity>;
    }
}
declare module BillForward {
    class AmendmentDiscardAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
        static construct(amendment: EntityReference, actioningTime?: ActioningTime): Q.Promise<AmendmentDiscardAmendment>;
    }
}
declare module BillForward {
    enum ServiceEndState {
        AtPeriodEnd = 0,
        Immediate = 1,
    }
    class CancellationAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
        static construct(subscription: EntityReference, serviceEnd?: ServiceEndState, actioningTime?: ActioningTime): Q.Promise<CancellationAmendment>;
    }
}
declare module BillForward {
    enum InvoiceState {
        Paid = 0,
        Unpaid = 1,
        Pending = 2,
        Voided = 3,
    }
    enum InvoiceRecalculationBehaviour {
        RecalculateAsLatestSubscriptionVersion = 0,
        RecalculateAsCurrentSubscriptionVersion = 1,
    }
    class InvoiceRecalculationAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
        static construct(invoice: EntityReference, newInvoiceState?: InvoiceState, recalculationBehaviour?: InvoiceRecalculationBehaviour, actioningTime?: ActioningTime): Q.Promise<InvoiceRecalculationAmendment>;
    }
}
declare module BillForward {
    class IssueInvoiceAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
        static construct(invoice: any, actioningTime?: ActioningTime): Q.Promise<IssueInvoiceAmendment>;
    }
}
declare module BillForward {
    class ProductRatePlanMigrationAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Coupon extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        getBaseCode(): any;
        createUniqueCodes(quantity: number, client?: Client): Q.Promise<CouponUniqueCodesResponse[]>;
        getUnusedUniqueCodes(queryParams?: Object, client?: Client): Q.Promise<CouponUniqueCodesResponse[]>;
        applyToSubscription(subscription: EntityReference, client?: Client): Q.Promise<Coupon>;
        static applyCouponCodeToSubscription(couponCode: string, subscription: EntityReference, client?: Client): Q.Promise<Coupon>;
        static getUnusedUniqueCodesFromBaseCode(baseCode: string, queryParams?: Object, client?: Client): Q.Promise<CouponUniqueCodesResponse[]>;
        static createUniqueCodesFromBaseCode(baseCode: string, quantity: number, client?: Client): Q.Promise<CouponUniqueCodesResponse[]>;
    }
}
declare module BillForward {
    class AddCouponCodeRequest extends BillingEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        static applyCouponToSubscription(coupon: Coupon, subscription: EntityReference, client?: Client): Q.Promise<Coupon>;
        static applyCouponCodeToSubscription(couponCode: string, subscription: EntityReference, client?: Client): Q.Promise<Coupon>;
    }
}
declare module BillForward {
    class CouponUniqueCodesResponse extends BillingEntity {
        constructor(stateParams?: Object, client?: Client);
        getBaseCode(): any;
        applyToSubscription(subscription: EntityReference, client?: Client): Q.Promise<Coupon>;
    }
}
declare module BillForward {
    class Invoice extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        static getForSubscription(subscription: EntityReference, queryParams?: Object, client?: Client): Q.Promise<Invoice>;
        static getForSubscriptionVersion(subscriptionVersionID: string, queryParams?: Object, client?: Client): Q.Promise<Invoice>;
        static getForAccount(account: EntityReference, queryParams?: Object, client?: Client): Q.Promise<Invoice>;
        modifyUsage(componentNamesToValues: {
            [componentName: string]: Number;
        }): Q.Promise<Invoice>;
        issue(actioningTime?: ActioningTime): Q.Promise<IssueInvoiceAmendment>;
        recalculate(newInvoiceState?: InvoiceState, recalculationBehaviour?: InvoiceRecalculationBehaviour, actioningTime?: ActioningTime): Q.Promise<InvoiceRecalculationAmendment>;
    }
}
declare module BillForward {
    class InvoiceLine extends MutableEntity {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class InvoicePayment extends MutableEntity {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class TaxLine extends InsertableEntity {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class APIConfiguration extends MutableEntity {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Organisation extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class ComponentChange extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class PricingComponent extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class PricingComponentTier extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class PricingComponentValue extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class PricingComponentValueChange extends InsertableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class PricingComponentValueMigrationAmendmentMapping extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class UnitOfMeasure extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Product extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        getRatePlans(queryParams?: Object, client?: Client): Q.Promise<ProductRatePlan[]>;
    }
}
declare module BillForward {
    class ProductRatePlan extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        getProduct(): Q.Promise<Product>;
        static getForProduct(product: EntityReference, queryParams?: Object, client?: Client): Q.Promise<ProductRatePlan[]>;
    }
}
declare module BillForward {
    class TaxationLink extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class PaymentMethodSubscriptionLink extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    enum SubscriptionState {
        Trial = 0,
        Provisioned = 1,
        Paid = 2,
        AwaitingPayment = 3,
        Cancelled = 4,
        Failed = 5,
        Expired = 6,
    }
    class Subscription extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        static getByAccount(account: EntityReference, queryParams?: Object, client?: Client): Q.Promise<Subscription>;
        static getByState(state: SubscriptionState, queryParams?: Object, client?: Client): Q.Promise<Subscription>;
        activate(): Q.Promise<any>;
        cancel(serviceEnd?: ServiceEndState, actioningTime?: ActioningTime): Q.Promise<CancellationAmendment>;
        usePaymentMethodsFromAccountByID(accountID: string): Q.Promise<Subscription>;
        usePaymentMethodsFromAccount(account?: Account): Q.Promise<Subscription>;
        setValuesOfPricingComponentsByName(componentNamesToValues: {
            [componentName: string]: Number;
        }): Q.Promise<Subscription>;
        useValuesForNamedPricingComponentsOnRatePlanByID(ratePlanID: string, componentNamesToValues: {
            [componentName: string]: Number;
        }): Q.Promise<Subscription>;
        useValuesForNamedPricingComponentsOnRatePlan(ratePlan: ProductRatePlan, componentNamesToValues: {
            [componentName: string]: Number;
        }): Q.Promise<Subscription>;
        getCurrentPeriodStart(): any;
        getCurrentPeriodEnd(): any;
        getRatePlan(): Q.Promise<ProductRatePlan>;
        modifyUsage(componentNamesToValues: {
            [componentName: string]: Number;
        }): Q.Promise<Subscription>;
        modifyUsageHelper(componentNamesToValues: {
            [componentName: string]: Number;
        }, appliesTilOverride?: string): Q.Promise<Array<PricingComponentValue>>;
        issueCredit(value: number, description?: string): Q.Promise<CreditNote>;
        getCharges(queryParams?: Object, client?: Client): Q.Promise<SubscriptionCharge>;
    }
}
declare module BillForward {
    class SubscriptionCharge extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        static getBySubscription(subscription: EntityReference, queryParams?: Object, client?: Client): Q.Promise<SubscriptionCharge>;
    }
}
declare module BillForward {
    class AuthorizeNetToken extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class BraintreeToken extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class StripeACHToken extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class StripeToken extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Error {
        name: string;
        message: string;
        stack: string;
        constructor(message?: string);
    }
    class BFError extends Error {
        message: string;
        constructor(message: string);
        toString(): string;
    }
    class BFPreconditionFailedError extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFInvocationError extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFNoResultsError extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFMalformedAPIResponseError extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFResponseUnserializationFailure extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFRequestError extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFHTTPError extends BFError {
        message: string;
        constructor(message: string);
    }
    class BFUnauthorizedError extends BFError {
        message: string;
        constructor(message: string);
    }
}
declare module BillForward {
    class Imports {
        static _: _.LoDashStatic;
        static restler: any;
        static Q: any;
        static util: any;
    }
}
declare module BillForward {
    class MixinHandler {
        static applyMixins(derivedCtor: any, baseCtors: any[]): void;
    }
}
