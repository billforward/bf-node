module BillForward {
  export type clientConstructObj = { accessToken:string; urlRoot:string; requestLogging?:boolean; responseLogging?:boolean; errorLogging?:boolean; longStack?:boolean };

  export class Client {

    private static singletonClient:Client;

    private accessToken:string;
    private urlRoot:string;

    private requestLogging:boolean;
    private responseLogging:boolean;
    private errorLogging:boolean;

    private longStack:boolean;

    constructor(accessToken:string, urlRoot:string, requestLogging:boolean = false, responseLogging:boolean = false, errorLogging:boolean = false, longStack:boolean = false) {
      this.accessToken = accessToken;
      this.urlRoot = urlRoot;
      
      this.requestLogging = requestLogging;
      this.responseLogging = responseLogging;
      this.errorLogging = errorLogging;

      Imports.Q.longStackSupport = longStack;
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

    static makeDefault(obj:clientConstructObj): Client;
    static makeDefault(accessToken:string, urlRoot?:string, requestLogging?:boolean, responseLogging?:boolean, errorLogging?:boolean, longStack?:boolean): Client;

    /*static makeDefault(obj:Object):Client {
      var client = new Client(obj.accessToken, obj.urlRoot, obj.requestLogging, obj.responseLogging, obj.errorLogging);
      return Client.setDefault(client);
    }*/

    static makeDefault(accessTokenOrObj:any, urlRoot?:string, requestLogging?:boolean, responseLogging?:boolean, errorLogging?:boolean, longStack?:boolean):Client {
      var _accessToken:string;
      var _urlRoot:string;
      var _responseLogging:boolean = false;
      var _requestLogging:boolean = false;
      var _errorLogging:boolean = false;
      var _longStack:boolean = false;
      if (typeof accessTokenOrObj === 'string') {
        _accessToken = <string>accessTokenOrObj;
        _urlRoot = urlRoot;
        if (requestLogging) _requestLogging = requestLogging;
        if (responseLogging) _responseLogging = responseLogging;
        if (errorLogging) _errorLogging = errorLogging;
        if (longStack) _longStack = longStack;
      } else {
        var obj = <clientConstructObj>accessTokenOrObj;
        _accessToken = obj.accessToken;
        _urlRoot = obj.urlRoot;
        if (obj.requestLogging) _requestLogging = obj.requestLogging;
        if (obj.responseLogging) _responseLogging = obj.responseLogging;
        if (obj.errorLogging) _errorLogging = obj.errorLogging;
        if (obj.longStack) _longStack = obj.longStack;
      }

      var client = new Client(_accessToken, _urlRoot, _requestLogging, _responseLogging, _errorLogging, _longStack);
      return Client.setDefault(client);
    }

    static getDefaultClient():Client {
      if (!Client.singletonClient) {
        throw new BFInvocationError("No default BillForwardClient found; cannot make API requests.");
      }
      return Client.singletonClient;
    }

    request(verb:string, path:string, queryParams:Object = {}, json:Object = {}):Q.Promise<any> {
      return <Q.Promise<any>>Imports.Q.Promise((resolve, reject) => {
        try {
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
            options.headers['Content-Type'] = 'application/json;charset=utf-8';
            
            options.data = JSON.stringify(json || {});
          }

          return Client.mockableRequestWrapper(callVerb, callArgs)
          .catch(obj => {
            // HTTP errors
            return this.errorResponse(obj);
          })
          .then(obj => {
            // HTTP succeeded
            // throws error if response is in bad format
            var success = this.successResponse(obj);
            return resolve(success);
          })
          .catch(obj => {
            // HTTP succeeds, but BillForward response is an error
            return reject(obj);
          });
        } catch(e) {
          return reject(e);
        }
      });
    }

    static mockableRequestWrapper(callVerb:string, callArgs:Array<any>):any {
      return <Q.Promise<any>>Imports.Q.Promise((resolve, reject) => {
        try {
          return Imports.restler[callVerb].apply(this, callArgs)
          .on('success', (data, response) => {
            return resolve({
              data:data,
              response:response
              });
            })
          .on('fail', (data, response) => {
            return reject({
              data:data,
              response:response
              });
            });
        } catch(e) {
            return reject(e);
        }
      });
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
      if (input & input.response && input.response.statusCode !== undefined && input.response.statusCode !== null)
      if (input.response.statusCode !== 200)
      if (input.response.statusCode === 401) {
        throw new BFUnauthorizedError(input);
      } else {
        throw new BFHTTPError(input);
      }

      var raw = input;
      if (input.data)
      raw = input.data;
      var obj = raw;
      var printable = raw;

      if (typeof raw === "string") {
        var jsonParsed;
        try {
          jsonParsed = JSON.parse(raw);
          obj = jsonParsed;
        } catch(e) {
        }
      }
      if (obj instanceof Object) {
        var stringified;
        try {
          stringified = JSON.stringify(obj, null, "\t");
          printable = stringified;
        } catch(e) {
        }
      }

      if (this.errorLogging)
      console.error(printable);

      if (obj.errorType === "Oauth")
      throw new BFUnauthorizedError(printable);

      throw new BFRequestError(printable);
    }
  }
}