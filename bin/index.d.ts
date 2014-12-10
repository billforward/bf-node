/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    class Client {
        private static singletonClient;
        private accessToken;
        private urlRoot;
        constructor(accessToken: string, urlRoot: string);
        getAccessToken(): string;
        getUrlRoot(): string;
        static setDefault(client: Client): Client;
        static makeDefault(accessToken: string, urlRoot: string): Client;
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
        static getByID(id: string, options?: Object, client?: Client): Q.Promise<any>;
        static getResourcePath(): any;
        static getSingletonClient(): Client;
        static getDerivedClassStatic(): any;
        getDerivedClass(): any;
    }
}
declare module BillForward {
    class InsertableEntity extends BillingEntity {
        constructor();
        static create(entity: InsertableEntity): Q.Promise<any>;
        static makeEntityFromResponse(payload: Object, deferred: Q.Deferred<any>): any;
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
    class Account extends InsertableEntity {
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
    class Hello {
        private helloMessage;
        constructor(opts: any);
        sayHello(): String;
        sayHelloLater(callback: any): void;
        sayHelloThenSayHelloLater(callback: any): String;
    }
}
