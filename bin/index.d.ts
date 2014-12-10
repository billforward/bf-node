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
    }
}
declare module BillForward {
    class BillingEntity {
        private _client;
        constructor(stateParams?: Object, client?: Client);
        getClient(): Client;
        setClient(client: Client): void;
        static getByID<T extends BillingEntity>(id: string, options?: Object, client?: Client): Q.Promise<T>;
        static getResourcePath(): any;
        static getSingletonClient(): Client;
        static getDerivedClassStatic(): any;
        getDerivedClass(): any;
        serialize(): Object;
    }
}
declare module BillForward {
    class InsertableEntity extends BillingEntity {
        constructor();
        static create<T extends InsertableEntity>(entity: T): Q.Promise<T>;
        static makeEntityFromResponse(payload: Object, providedClient: Client, deferred: Q.Deferred<any>): any;
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
    class Account extends InsertableEntity implements Controller {
        protected static _resourcePath: ResourcePath;
        constructor();
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
    class Controller {
        protected static _resourcePath: any;
        static getResourcePath(): any;
    }
}
declare module BillForward {
    class MixinHandler {
        static applyMixins(derivedCtor: any, baseCtors: any[]): void;
    }
}
