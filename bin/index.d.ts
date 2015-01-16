/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    class Client {
        private static singletonClient;
        private accessToken;
        private urlRoot;
        private requestLogging;
        private responseLogging;
        private errorLogging;
        constructor(accessToken: string, urlRoot: string, requestLogging?: boolean, responseLogging?: boolean, errorLogging?: boolean);
        getAccessToken(): string;
        getUrlRoot(): string;
        static setDefault(client: Client): Client;
        static makeDefault(accessToken: string, urlRoot: string, requestLogging?: boolean, responseLogging?: boolean, errorLogging?: boolean): Client;
        static getDefaultClient(): Client;
        request(verb: string, path: string, queryParams?: Object, json?: Object): Q.Promise<any>;
        static mockableRequestWrapper(callVerb: string, callArgs: any[]): any;
        private successResponse(obj);
        private errorResponse(input);
    }
}
declare module BillForward {
    class BillingEntity {
        protected _client: Client;
        protected _exemptFromSerialization: string[];
        protected _registeredEntities: {
            [x: string]: typeof BillingEntity;
        };
        protected _registeredEntityArrays: {
            [x: string]: typeof BillingEntity;
        };
        constructor(stateParams?: Object, client?: Client);
        getClient(): Client;
        setClient(client: Client): void;
        protected static resolveRoute(endpoint?: string): string;
        protected static makeHttpPromise(verb: string, endpoint: string, queryParams: Object, payload: Object, callback: any, client?: Client): Q.Promise<any>;
        protected static makeGetPromise(endpoint: string, queryParams: Object, callback: any, client?: Client): any;
        static getByID(id: string, queryParams?: Object, client?: Client): any;
        static getAll(queryParams?: Object, client?: Client): any;
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
        protected buildEntityArray(entityClass: typeof BillingEntity, constructArgs: any[]): BillingEntity[];
        protected static getFirstEntityFromResponse(payload: any, client: Client, deferred: Q.Deferred<BillingEntity>): void;
        protected static getAllEntitiesFromResponse(payload: any, client: Client, deferred: Q.Deferred<BillingEntity[]>): void;
        protected static makeEntityFromPayload(payload: Object, client: Client): BillingEntity;
        static fetchIfNecessary(entityReference: any): Q.Promise<BillingEntity>;
        static makeBillForwardDate(date: Date): string;
    }
}
declare module BillForward {
    class InsertableEntity extends BillingEntity {
        constructor(stateParams?: Object, client?: Client);
        static create(entity: InsertableEntity): any;
        protected static makePostPromise(endpoint: string, queryParams: Object, payload: Object, callback: any, client?: Client): any;
    }
}
declare module BillForward {
    class MutableEntity extends InsertableEntity {
        constructor(stateParams?: Object, client?: Client);
        save(): any;
        protected static makePutPromise(endpoint: string, queryParams: Object, payload: Object, callback: any, client?: Client): any;
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
    class Amendment extends InsertableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client, skipUnserialize?: boolean);
        applyType(type: string): void;
        discard(): any;
        static parseActioningTime(actioningTime: any, subscription?: any): Q.Promise<string>;
        applyActioningTime(actioningTime: any, subscription?: any): Q.Promise<BillingEntity>;
    }
}
declare module BillForward {
    class AmendmentDiscardAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class CancellationAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
        static construct(subscription: any, serviceEnd?: ServiceEndState, actioningTime?: any): Q.Promise<CancellationAmendment>;
    }
    enum ServiceEndState {
        AtPeriodEnd = 0,
        Immediate = 1,
    }
}
declare module BillForward {
    class UpdateComponentValueAmendment extends Amendment {
        constructor(stateParams?: Object, client?: Client);
    }
}
declare module BillForward {
    class Invoice extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
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
    }
}
declare module BillForward {
    class ProductRatePlan extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
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
    class Subscription extends MutableEntity {
        protected static _resourcePath: ResourcePath;
        constructor(stateParams?: Object, client?: Client);
        activate(): any;
        cancel(serviceEnd?: ServiceEndState, actioningTime?: any): Q.Promise<CancellationAmendment>;
        usePaymentMethodsFromAccountByID(accountID: string): Q.Promise<Subscription>;
        usePaymentMethodsFromAccount(account?: Account): Q.Promise<Subscription>;
        setValuesOfPricingComponentsByName(componentNamesToValues: {
            [x: string]: Number;
        }): Q.Promise<Subscription>;
        useValuesForNamedPricingComponentsOnRatePlanByID(ratePlanID: string, componentNamesToValues: {
            [x: string]: Number;
        }): Q.Promise<Subscription>;
        useValuesForNamedPricingComponentsOnRatePlan(ratePlan: ProductRatePlan, componentNamesToValues: {
            [x: string]: Number;
        }): Q.Promise<Subscription>;
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
    class Imports {
        static _: _.LoDashStatic;
        static restler: any;
        static Q: any;
    }
}
declare module BillForward {
    class MixinHandler {
        static applyMixins(derivedCtor: any, baseCtors: any[]): void;
    }
}
