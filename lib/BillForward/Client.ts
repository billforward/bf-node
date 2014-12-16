module BillForward {

  export class Client {

    private static singletonClient:Client;

    private accessToken:string;
    private urlRoot:string;

    private requestLogging:boolean;
    private responseLogging:boolean;
    private errorLogging:boolean;

    constructor(accessToken:string, urlRoot:string, requestLogging:boolean = false, responseLogging:boolean = false, errorLogging:boolean = false) {
      this.accessToken = accessToken;
      this.urlRoot = urlRoot;
      
      this.requestLogging = requestLogging;
      this.responseLogging = responseLogging;
      this.errorLogging = errorLogging;
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

    static makeDefault(accessToken:string, urlRoot:string, requestLogging:boolean = false, responseLogging:boolean = false, errorLogging:boolean = false):Client {
      var client = new Client(accessToken, urlRoot, requestLogging, responseLogging, errorLogging);
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

      if (this.requestLogging) {
        console.log(JSON.stringify(json, null, "\t"));
      }

      if(verb === 'POST' || verb === 'PUT') {
        options.input = json;
        options.inputType = 'json';
        options.headers['Content-Type'] = 'application/json';
      }

      Imports.httpinvoke(fullPath, verb, options);

      return deferred.promise;
    }

    private successResponse(body, statusCode, headers, deferred) {
      if (statusCode === 200) {
        if (this.responseLogging) {
          console.log(JSON.stringify(body, null, "\t"));
        }
        deferred.resolve(body);
        return;
      }
      this.errorResponse(body, deferred);
    }

    private errorResponse(err, deferred) {
      var parsed = err;
      if (this.errorLogging) {
        if (err instanceof Object) {
          parsed = JSON.stringify(err);
        }
        console.error(parsed);
      }
      Client.handlePromiseError(parsed, deferred);
    }

    static handlePromiseError(err, deferred) {
      deferred.reject(err);
    }
  }
}