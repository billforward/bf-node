var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

var sinon = testBase.sinon;

context(testBase.getContext(), function () {
	describe('Account', function () {
		describe('::create', function () {
			context('model constructed', function() {
				var model;

				before(function() {
					model = new BillForward.Account({});
				});
				after(function () {
				    BillForward.Imports.httpinvoke.restore();
				});
				it('should succeed', function () {
					sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
						options.finished(false, mocks.blankAccount, 200, options.headers);
					});

					return BillForward.Account.create(model)
					.should.be.fulfilled;
				});
			});
		});
	});
});

var mocks = {
	blankAccount: {
		"executionTime": 1378205,
		"results": [
			{
				"@type": "account",
				"created": "2014-12-10T16:41:49Z",
				"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
				"updated": "2014-12-10T16:41:49Z",
				"id": "D12B8CF8-2E1E-4F76-925F-1B539D37B2D9",
				"crmID": null,
				"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
				"successfulSubscriptions": 0,
				"deleted": false,
				"roles": [],
				"profile": {
					"created": "2014-12-10T16:41:49Z",
					"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
					"updated": "2014-12-10T16:41:49Z",
					"id": "E4D9E04C-9DB1-47AA-9EBA-A66FC0923CF9",
					"accountID": "D12B8CF8-2E1E-4F76-925F-1B539D37B2D9",
					"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
					"addresses": []
				},
				"paymentMethods": [
					{
						"created": "2014-12-10T16:41:49Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-10T16:41:49Z",
						"id": "3F95195C-5FFA-4795-B6DF-CC25F0D26EE5",
						"accountID": "D12B8CF8-2E1E-4F76-925F-1B539D37B2D9",
						"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
						"name": "Offline Payment",
						"description": "Payments taken offline",
						"gateway": "offline",
						"priority": 100,
						"userEditable": false,
						"reusable": true,
						"deleted": false
					},
					{
						"created": "2014-12-10T16:41:49Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-10T16:41:49Z",
						"id": "B3C590FE-1E2B-471A-8580-20E3A4CFCC3C",
						"accountID": "D12B8CF8-2E1E-4F76-925F-1B539D37B2D9",
						"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
						"name": "Account Credit",
						"description": "Credit Notes",
						"gateway": "credit_note",
						"priority": 100,
						"userEditable": false,
						"reusable": true,
						"deleted": false
					}
				]
			}
		]
	}
};