module BillForward {
	export class CancellationAmendment extends Amendment {
		constructor(stateParams:Object = {}, client:Client = null) {
		    super(stateParams, client, true);

		    this.applyType('CancellationAmendment');
		    
		    this.unserialize(stateParams);
		}

		/**
		 * Cancels subscription at a specified time.
		 * @param mixed ENUM[string id, Subscription entity] Reference to the subscription. <id>: Fetches subscription by ID. <Subscription>: Uses subscription as-is.
		 * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
		 * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
		 * @return CancellationAmendment The created cancellation amendment.
		 */
		static construct(subscription:any, serviceEnd:ServiceEndState = ServiceEndState.AtPeriodEnd, actioningTime:any = 'Immediate'): Q.Promise<CancellationAmendment> {
        	return <Q.Promise<CancellationAmendment>>Q.Promise((resolve, reject) => {
		        try {
		        	return resolve(Subscription.fetchIfNecessary(subscription)
		        	.then((subscription:Subscription) => {
		        		var amendment = new CancellationAmendment({
							'subscriptionID': (<any>subscription).id,
							'serviceEnd': serviceEnd
						});

						return amendment.applyActioningTime(actioningTime, subscription);
		        		}));
				} catch (e) {
	                return reject(e);
	            }
			});
		}
	}
	
	export enum ServiceEndState {
		AtPeriodEnd,
		Immediate
	}
}