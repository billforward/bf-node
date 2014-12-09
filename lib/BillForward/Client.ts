///<reference path='../../typings/tsd.d.ts' />

module BillForward {

  export class Client {

    private static singletonClient:Client;

    private accessToken:string;
    private urlRoot:string;

    constructor(accessToken:string, urlRoot:string) {
      this.accessToken = accessToken;
      this.urlRoot = urlRoot;
    }

    static setDefault(client:Client):Client {
      Client.singletonClient = client;
      return Client.singletonClient;
    }

    static makeDefault(accessToken:string, urlRoot:string):Client {
      var client = new Client(accessToken, urlRoot);
      return Client.setDefault(client);
    }

    request(verb:string, path:string, queryParams:Object = {}, json:Object = {}) {
      var fullPath = this.urlRoot+path;

      var parsed = url.parse(fullPath);
      var client = parsed.protocol === "http:" ? http : https;

      var options = {
        host: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        method: verb
      };

      var deferred = q.defer();

      var req = client.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      });

      var self = this;

      req.on('response', function(req) {
        self.successResponse(req, deferred);
        // deferred.resolve(req);
        });
      req.on('error', function(req) {
        self.errorResponse(req, deferred);
        // deferred.reject(req);
        });

      req.end();

      return deferred.promise;
    }

    private successResponse(req, deferred) {
      deferred.resolve(req);
    }

    private errorResponse(req, deferred) {
      deferred.reject(req);
    }
  } 
}