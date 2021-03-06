module BillForward {

  export class MutableEntity extends InsertableEntity {
    constructor(stateParams:Object = {}, client:Client = null) {
      super(stateParams, client);
    }

  	/**
  	 * Asks API to update existing instance of this entity,
  	 * to match the current properties with which it is modelled.
  	 */
  	save() {
      return <Q.Promise<any>>Imports.Q.Promise((resolve, reject) => {
          try {
              // console.log('saving');
              var entityClass = this.getDerivedClass();
          		// var entityClass = (<any>this).constructor;
          		
          		var client = this.getClient();
          		var payload = this.serialize();

              // console.log(entityClass);
              // console.log(entityClass.makePutPromise);

              return resolve(entityClass.makePutPromise("", null, payload, client)
              .then((payload) => {
                return entityClass.getFirstEntityFromResponse(payload, client);
              }));
          } catch(e) {
              return reject(e);
          }
      });
  	}
  } 
}