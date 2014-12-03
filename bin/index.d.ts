/// <reference path="../typings/tsd.d.ts" />
declare module BillForward {
    class Hello {
        private helloMessage;
        constructor(opts: any);
        sayHello(): String;
        sayHelloLater(callback: any): void;
        sayHelloThenSayHelloLater(callback: any): String;
    }
}
declare module BillForward {
    class Main {
        private _h;
        constructor();
    }
}
