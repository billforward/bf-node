module BillForward {
  export class Amendment extends InsertableEntity {
    protected static _resourcePath = new ResourcePath('amendments', 'amendment');

    constructor(stateParams:Object = {}, client:Client = null) {
        super(stateParams, client);
        
        this.unserialize(stateParams);
    }

    applyType(type:string) {
    	this['@type'] = type;
    }

    discard() {
		// create model of amendment
		var amendment = new AmendmentDiscardAmendment({
			'amendmentToDiscardID': (<any>this).id,
			'subscriptionID': (<any>this).subscriptionID
		});

		return AmendmentDiscardAmendment.create(amendment);
	}
  }
}