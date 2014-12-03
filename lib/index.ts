///<reference path='../typings/tsd.d.ts' />
///<reference path='hello.ts' />

var _:UnderscoreStatic = require('../node_modules/underscore/underscore.js');

module BillForward {
	export class Main
	{
		private _h:Hello;
	    constructor()
	    {
	    	this._h = new Hello({});
	    }
	}

}

module.exports = BillForward;