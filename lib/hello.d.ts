/// <reference path="../typings/tsd.d.ts" />
declare class Hello {
    private helloMessage;
    constructor(opts: any);
    sayHello(): String;
    sayHelloLater(callback: any): void;
    sayHelloThenSayHelloLater(callback: any): String;
}
export = Hello;
