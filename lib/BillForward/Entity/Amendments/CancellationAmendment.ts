module BillForward {
	export class CancellationAmendment extends Amendment {
		constructor(stateParams:Object = {}, client:Client = null) {
		    super(stateParams, client, true);

		    this.applyType('CancellationAmendment');
		    
		    this.unserialize(stateParams);
		}

		/**
		 * Cancels subscription at a specified time.
		 * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
		 * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
		 * @return CancellationAmendment The created cancellation amendment.
		 */
		static construct(subscription:Subscription, serviceEnd:ServiceEndTime = ServiceEndTime.AtPeriodEnd, actioningTime:any = 'Immediate'):CancellationAmendment {
			var amendment = new CancellationAmendment({
				'subscriptionID': (<any>subscription).id,
				'serviceEnd': serviceEnd
			});

			var date:any = null; // defaults to Immediate
			if (actioningTime instanceof Date) {
				date = BillingEntity.makeBillForwardDate(actioningTime);
			} else if (actioningTime === 'AtPeriodEnd') {
				if ((<any>subscription).currentPeriodEnd) {
					date = (<any>subscription).currentPeriodEnd;
				} else {
					throw 'Cannot set actioning time to period end, because the subscription does not declare a period end.';
				}
			}

			if (date) {
				(<any>amendment).actioningTime = date;
			}

			return amendment;
		}
	}
	
	export enum ServiceEndTime {
		AtPeriodEnd,
		Immediate
	}
}