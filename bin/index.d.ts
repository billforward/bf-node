/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    class Client {
        private static singletonClient;
        private accessToken;
        private urlRoot;
        private logging;
        constructor(accessToken: string, urlRoot: string, logging?: boolean);
        getAccessToken(): string;
        getUrlRoot(): string;
        static setDefault(client: Client): Client;
        static makeDefault(accessToken: string, urlRoot: string, logging?: boolean): Client;
        static getDefaultClient(): Client;
        request(verb: string, path: string, queryParams?: Object, json?: Object): Q.Promise<any>;
        private successResponse(body, statusCode, headers, deferred);
        private errorResponse(err, deferred);
        static handlePromiseError(err: any, deferred: any): void;
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
        protected static makeGetPromise(endpoint: string, callback: any, client?: Client): Q.Promise<any>;
        static getByID(id: string, options?: Object, client?: Client): any;
        static getAll(id: string, options?: Object, client?: Client): any;
        static getResourcePath(): any;
        static getSingletonClient(): Client;
        static getDerivedClassStatic(): any;
        protected registerEntity(key: string, entityClass: typeof BillingEntity): void;
        protected registerEntityArray(key: string, entityClass: typeof BillingEntity): void;
        getDerivedClass(): any;
        serialize(): Object;
        toString(): string;
        protected unserialize(json: Object): void;
        protected addToEntity(key: string, value: any): void;
        protected buildEntity(entityClass: typeof BillingEntity, constructArgs: any): BillingEntity;
        protected buildEntityArray(entityClass: typeof BillingEntity, constructArgs: any[]): BillingEntity[];
        protected static getFirstEntityFromResponse(payload: any, client: Client, deferred: Q.Deferred<BillingEntity>): void;
        protected static getAllEntitiesFromResponse(payload: any, client: Client, deferred: Q.Deferred<BillingEntity[]>): void;
        protected static makeEntityFromPayload(payload: Object, client: Client): BillingEntity;
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
        static httpinvoke: any;
        static Q: any;
    }
}
declare module BillForward {
    class MixinHandler {
        static applyMixins(derivedCtor: any, baseCtors: any[]): void;
    }
}
