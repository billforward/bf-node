///<reference path='../typings/tsd.d.ts' />

module BillForward {

  export class Hello {

    private helloMessage:String;

    constructor(opts) {
      // Underscore's extend functionality is a great
      // way to extend default parameters, with parameters
      // passed in when creating a new instance of a class.
      _.extend(this, {
        helloMessage: 'Hello World!'
      }, opts);
    }

    public sayHello():String {
      return this.helloMessage;
    }

    public sayHelloLater(callback):void {
      var _this = this;

      setTimeout(function() {
        callback(_this.helloMessage);
      }, 250);
    }

    public sayHelloThenSayHelloLater(callback):String {
      this.sayHelloLater(callback);
      return this.sayHello();
    }
  } 
}