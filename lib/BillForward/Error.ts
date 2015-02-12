module BillForward {
	export declare class Error {
        public name: string;
        public message: string;
        public stack: string;
        constructor(message?: string);
    }

    export class BFError extends Error {
        constructor(public message: string) {
            super(message);
            this.name = 'BFError';
            this.message = message;
            this.stack = (<any>new Error()).stack;
        }
        toString() {
            return this.name + ': ' + this.message;
        }
    }

    export class BFPreconditionFailedError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFPreconditionFailedError';
        }
    }

    export class BFInvocationError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFInvocationError';
        }
    }

    export class BFNoResultsError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFNoResultsError';
        }
    }

    export class BFMalformedAPIResponseError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'MalformedAPIResponseError';
        }
    }

    export class BFResponseUnserializationFailure extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFResponseUnserializationFailure';
        }
    }

    export class BFRequestError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFRequestError';
        }
    }

    export class BFHTTPError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFHTTPError';
        }
    }

    export class BFUnauthorizedError extends BFError {
    	constructor(public message: string) {
            super(message);
            this.name = 'BFUnauthorizedError';
        }
    }
}