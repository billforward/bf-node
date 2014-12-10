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
						options.finished(false, mocks.createBlankAccount, 200, options.headers);
					});

					return BillForward.Account.create(model)
					.should.be.fulfilled.and
					.should.eventually.have.property('id').that.equals('D12B8CF8-2E1E-4F76-925F-1B539D37B2D9');;
				});
			});
		});
		describe('::getByID', function () {
			var model;
			after(function () {
			    BillForward.Imports.httpinvoke.restore();
			});
			it('should succeed', function () {
				sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
					options.finished(false, mocks.getAccountByID, 200, options.headers);
				});

				return BillForward.Account.getByID("riggidy riggidy wrecked")
				.should.be.fulfilled.and
				.should.eventually.have.property('id').that.equals('C2CA1ED0-203B-4A8A-97B8-99EE7FA869CF');;
			});
		});
	});
});

var mocks = {
	createBlankAccount: {
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
	},
	getAccountByID: {
		"executionTime": 1425872,
		"results": [
			{
				"@type": "account",
				"created": "2014-12-10T18:22:05Z",
				"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
				"updated": "2014-12-10T18:22:05Z",
				"id": "C2CA1ED0-203B-4A8A-97B8-99EE7FA869CF",
				"crmID": null,
				"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
				"successfulSubscriptions": 0,
				"deleted": false,
				"roles": [],
				"profile": {
					"created": "2014-12-10T18:22:05Z",
					"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
					"updated": "2014-12-10T18:22:05Z",
					"id": "5738863E-7575-42CA-95CE-318D05EF8FB0",
					"accountID": "C2CA1ED0-203B-4A8A-97B8-99EE7FA869CF",
					"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
					"addresses": []
				},
				"paymentMethods": [
					{
						"created": "2014-12-10T18:22:05Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-10T18:22:05Z",
						"id": "28049ACF-A402-477C-B847-857D41A5A217",
						"accountID": "C2CA1ED0-203B-4A8A-97B8-99EE7FA869CF",
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
						"created": "2014-12-10T18:22:05Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-10T18:22:05Z",
						"id": "6631FA41-429A-454D-A6A0-5491EC5E2752",
						"accountID": "C2CA1ED0-203B-4A8A-97B8-99EE7FA869CF",
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