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
        private _client;
        private _exemptFromSerialization;
        constructor(stateParams?: Object, client?: Client);
        getClient(): Client;
        setClient(client: Client): void;
        static getByID(id: string, options?: Object, client?: Client): Q.Promise<any>;
        static getResourcePath(): any;
        static getSingletonClient(): Client;
        static getDerivedClassStatic(): any;
        getDerivedClass(): any;
        serialize(): Object;
        toString(): string;
        protected unserialize(json: Object): void;
        protected static getFirstEntityFromResponse(payload: any, client: Client, deferred: Q.Deferred<any>): void;
        protected static makeEntityFromPayload(payload: any, client: Client): BillingEntity;
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
    }
}
declare module BillForward {
    class Profile extends MutableEntity {
        protected static _resourcePath: ResourcePath;
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
