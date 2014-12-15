module BillForward {

  export class Client {

    private static singletonClient:Client;

    private accessToken:string;
    private urlRoot:string;
    private logging:boolean;

    constructor(accessToken:string, urlRoot:string, logging:boolean = false) {
      this.accessToken = accessToken;
      this.urlRoot = urlRoot;
      this.logging = logging;
    }

    getAccessToken():string {
      return this.accessToken;
    }

    getUrlRoot():string {
      return this.urlRoot;
    }

    static setDefault(client:Client):Client {
      Client.singletonClient = client;
      return Client.singletonClient;
    }

    static makeDefault(accessToken:string, urlRoot:string, logging:boolean = false):Client {
      var client = new Client(accessToken, urlRoot, logging);
      return Client.setDefault(client);
    }

    static getDefaultClient():Client {
      if (!Client.singletonClient) {
        throw 'No default BillForwardClient found; cannot make API requests.';
      }
      return Client.singletonClient;
    }

    request(verb:string, path:string, queryParams:Object = {}, json:Object = {}) {
      var fullPath = this.urlRoot+path;
      var _this = this;

      var deferred:Q.Deferred<any> = Imports.Q.defer();

      var callback = function(err, body, statusCode, headers) {
          if(err) {
            _this.errorResponse(err, deferred);
            return;
          }
          // console.log('Success', body, statusCode, headers);
          _this.successResponse(body, statusCode, headers, deferred);
      };

      var headers = {
        'Authorization': 'Bearer '+this.accessToken
      };

      var converters = {
        'text json': JSON.parse,
        'json text': JSON.stringify
      };

      var options:any = {
        headers: headers,
        finished: callback,
        outputType: 'json',
        converters: converters
      };

      if(verb === 'POST') {
        options.input = json;
        options.inputType = 'json';
        options.headers['Content-Type'] = 'application/json';
      }

      Imports.httpinvoke(fullPath, verb, options);

      return deferred.promise;
    }

    private successResponse(body, statusCode, headers, deferred) {
      if (statusCode === 200) {
        if (this.logging) {
          console.log(JSON.stringify(body, null, "\t"));
        }
        deferred.resolve(body);
        return;
      }
      this.errorResponse(body, deferred);
    }

    private errorResponse(err, deferred) {
      if (this.logging) {
        console.error(err);
      }
      Client.handlePromiseError(err, deferred);
    }

    static handlePromiseError(err, deferred) {
      deferred.reject(err);
    }
  }
}