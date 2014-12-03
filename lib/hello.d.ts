/// <reference path="../typings/tsd.d.ts" />
declare class Hello {
    private helloMessage;
    constructor(opts: any);
    public sayHello(): String;
    public sayHelloLater(callback: any): void;
    public sayHelloThenSayHelloLater(callback: any): String;
}
export = Hello;
