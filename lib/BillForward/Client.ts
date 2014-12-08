///<reference path='../../typings/tsd.d.ts' />

module BillForward {

  export class Client {

    private static singletonClient:Client;

    private accessToken:String;
    private urlRoot:String;

    constructor(accessToken:String, urlRoot:String) {
      this.accessToken = accessToken;
      this.urlRoot = urlRoot;
    }

    static setDefaultClient(client:Client):Client {
      Client.singletonClient = client;
      return Client.singletonClient;
    }

    request(verb:String, path:String, queryParams:Object = {}, json:Object = {}) {
      var parsed = url.parse(path);
      var protocol = parsed.protocol;

      /*var client;
      switch (protocol) {
        case "http:":
        case "https:":
          client = 
          client = http;
        } === ) {

      }
      var client = 

      var options = {
        host: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        method: verb
      };

      var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      });*/
    }
  } 
}