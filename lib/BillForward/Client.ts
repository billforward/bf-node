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

    request(verb:string, path:string, queryParams:Object = {}, json:Object = {}):Q.Promise<any> {
      var queryString = "";
      if (!Imports._.isEmpty(queryParams)) {
        queryString = "?"+Imports._.map(<any>queryParams, function(value:any, key:string) {
          return encodeURIComponent(key)+"="+encodeURIComponent(value);
        }).join("&");
      }

      var fullPath = this.urlRoot+path+queryString;

      if (this.requestLogging) {
        console.log(fullPath);
      }

      /*var callback = (err, body, statusCode, headers) => {
          if(err) {
            this.errorResponse(err, deferred);
            return;
          }
          // console.log('Success', body, statusCode, headers);
          this.successResponse(body, statusCode, headers, deferred);
      };*/

      var headers = {
        'Authorization': 'Bearer '+this.accessToken
      };

      /*var converters = {
        'text json': JSON.parse,
        'json text': JSON.stringify
      };

      var options:any = {
        headers: headers,
        finished: callback,
        outputType: 'json',
        converters: converters
      };*/

      var options:any = {
        headers: headers
      };

      if (this.requestLogging) {
        console.log(JSON.stringify(json, null, "\t"));
      }

      var callVerb = verb.toLowerCase();

      var callArgs = [fullPath, options];

      if(verb === 'POST' || verb === 'PUT') {
        /*options.input = json;
        options.inputType = 'json';
        options.headers['Content-Type'] = 'application/json';*/

        callVerb += "Json";
        callArgs.splice(1, 0, json);
      }

      return Client.mockableRequestWrapper(callVerb, callArgs)
      .then((obj) => {
        return this.successResponse(obj);
        })
      .catch((obj) => {
        return this.errorResponse(obj);
        });
    }

    static mockableRequestWrapper(callVerb:string, callArgs:Array<any>):any {
      // var deferred:Q.Deferred<any> = Imports.Q.defer();

      return <Q.Promise<any>>Imports.Q.Promise((resolve, reject) => {
        try {
          Imports.restler[callVerb].apply(this, callArgs)
          .on('success', (data, response) => {
            resolve({
              data:data,
              response:response
              });
            })
          .on('fail', (data, response) => {
            reject({
              data:data,
              response:response
              });
            });
        } catch(e) {
            return reject(e);
        }
      });

      // return deferred.promise;
    }

    private successResponse(obj:any):any {
      if (!obj || !obj.data || !obj.response) {
        return this.errorResponse(obj);
      }
      
      if (obj.response.statusCode === 200) {
        if (this.responseLogging) {
          console.log(JSON.stringify(obj.data, null, "\t"));
        }
        return obj.data;
      }
      return this.errorResponse(obj);
    }

    private errorResponse(input:any):any {
      var parsed = input;
      if (this.errorLogging) {
        if (input instanceof Object) {
          parsed = JSON.stringify(input, null, "\t");
        }
        console.error(parsed);
      }
      throw parsed;
    }
  }
}