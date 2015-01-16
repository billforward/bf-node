module BillForward {
	export class UpdateComponentValueAmendment extends Amendment {
		constructor(stateParams:Object = {}, client:Client = null) {
		    super(stateParams, client, true);

		    this.applyType('UpdateComponentValueAmendment');
		    
		    this.unserialize(stateParams);
		}

		/**
		 * Registers with the specified subscription a change in the value of some Usage pricing component.
		 * @param string ENUM['Immediate', 'AtPeriodEnd'] (Default: 'AtPeriodEnd') Specifies whether the service will end immediately on cancellation or if it will continue until the end of the current period.
		 * @param mixed[timestamp:Date, 'Immediate', 'AtPeriodEnd'] Default: 'Immediate'. When to action the cancellation amendment
		 * @return CancellationAmendment The created cancellation amendment.
		 */
	}
}