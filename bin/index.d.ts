/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    class Client {
        private static singletonClient;
        private accessToken;
        private urlRoot;
        constructor(accessToken: string, urlRoot: string);
        static setDefault(client: Client): Client;
        static makeDefault(accessToken: string, urlRoot: string): Client;
        request(verb: string, path: string, queryParams?: Object, json?: Object): any;
        private successResponse(body, statusCode, headers, deferred);
        private errorResponse(err, deferred);
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
declare var _: _.LoDashStatic;
declare var httpinvoke: any;
declare var q: any;
