/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    class Client {
        private static singletonClient;
        private accessToken;
        private urlRoot;
        constructor(accessToken: String, urlRoot: String);
        static setDefaultClient(client: Client): Client;
        request(verb: String, path: String, queryParams?: Object, json?: Object): void;
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
declare var http: any;
declare var https: any;
declare var url: any;
