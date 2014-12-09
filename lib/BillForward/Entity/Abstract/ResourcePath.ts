module BillForward {

  export class ResourcePath {
  	protected path;
  	protected entityName;

    constructor(path:string, entityName:string) {
    	this.path = path;
    	this.entityName = entityName;
    }

    getPath():string {
    	return this.path;
    }

    getEntityName():string {
    	return this.entityName;
    }
  } 
}