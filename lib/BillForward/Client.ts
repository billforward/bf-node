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

      // var parsed = url.parse(fullPath);
      // var client = parsed.protocol === "http:" ? http : https;

      // var options = {
      //   host: parsed.hostname,
      //   port: parsed.port,
      //   pathname: parsed.pathname,
      //   method: verb
      // };

      /*// var deferred = q.defer();

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

      // req.end();

      return deferred.promise;*/
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
        'Authorization': 'Bearer '+this.accessToken,
        'Content-Type': 'application/json'
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
      deferred.reject(err);
    }
  } 
}