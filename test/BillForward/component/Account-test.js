var testBase = require('./_test-base');

var BillForward = testBase.BillForward;
var client = testBase.client;

var sinon = testBase.sinon;

context(testBase.getContext(), function () {
	afterEach(function () {
		if (BillForward.Imports.httpinvoke.restore) {
			BillForward.Imports.httpinvoke.restore();
		}
	});
	describe('Account', function () {
		describe('::create', function () {
			context('blank entity constructed', function() {
				var promise;
				before(function() {
					sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
						options.finished(false, mocks.createBlankAccount, 200, options.headers);
					});

					var account = new BillForward.Account();

					promise = BillForward.Account.create(account);
				});
				it('should succeed', function () {
					return promise
					.should.be.fulfilled;
				});
				it('should have expected property', function () {
					return promise
					.should.eventually.have.property('id')
						.that.equals('D12B8CF8-2E1E-4F76-925F-1B539D37B2D9');;
				});
			});
			context('nested entity constructed', function() {
				var testDeepProp = 'email';
				var testDeepValue = 'sup@yo.com';

				var promise;
				beforeEach(function() {
					sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
						options.finished(false, mocks.createAccountWithProfile, 200, options.headers);
					});

					var profile = new BillForward.Profile();
					profile[testDeepProp] = testDeepValue;
					var account = new BillForward.Account({
						'profile': profile
					});

					promise = BillForward.Account.create(account);
				});
				it('should succeed', function () {
					return promise
					.should.be.fulfilled;
				});
				it('should have expected nested entity', function() {
					return promise
					.should.eventually.have.property('profile')
						.with.deep.property(testDeepProp)
							.that.equals(testDeepValue);
				});
			});
			context('nested entity array constructed', function() {
				var testDeepProp = 'country';
				var testDeepValue = 'Gensokyo';

				var promise;
				before(function() {
					sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
						options.finished(false, mocks.createAccountWithProfileAndAddress, 200, options.headers);
					});

					var address = new BillForward.Address({
					    'addressLine1': 'address line 1',
					    'addressLine2': 'address line 2',
					    'addressLine3': 'address line 3',
					    'city': 'London',
					    'province': 'London',
					    'postcode': 'SW1 1AS',
					    'landline': '02000000000',
					    'primaryAddress': true
					});
					address[testDeepProp] = testDeepValue;
					var profile = new BillForward.Profile({
						'email': 'u.n.owen@was.her',
	  					'firstName': 'U.N.',
	  					'lastName': 'Owen',
						'addresses': [address]
					});
					var account = new BillForward.Account({
						profile: profile
					});

					promise = BillForward.Account.create(account);
				});
				it('should succeed', function () {
					return promise
					.should.be.fulfilled;
				});
				it('should have expected deep property', function () {
					return promise
					.should.eventually.have.deep.property('profile.addresses')
						.with.property('[0]')
						.with.property(testDeepProp)
							.that.equals(testDeepValue);
				});
			});
		});
		describe('::getByID', function () {
			var promise;
			before(function() {
				sinon.stub(BillForward.Imports, 'httpinvoke', function(fullPath, verb, options) {
					options.finished(false, mocks.getAccountByID, 200, options.headers);
				});

				promise = BillForward.Account.getByID("riggidy riggidy wrecked")
			});
			it('should succeed', function () {
				return promise
				.should.be.fulfilled;
			});
			it('should succeed', function () {
				return promise
				.should.eventually.have.property('id')
					.that.equals('C2CA1ED0-203B-4A8A-97B8-99EE7FA869CF');;
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
	createAccountWithProfile: {
		"executionTime": 1478389,
		"results": [
			{
				"@type": "account",
				"created": "2014-12-12T13:00:04Z",
				"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
				"updated": "2014-12-12T13:00:04Z",
				"id": "BFFC035E-E803-4C12-948C-C9074256A263",
				"crmID": null,
				"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
				"successfulSubscriptions": 0,
				"deleted": false,
				"roles": [],
				"profile": {
					"created": "2014-12-12T13:00:04Z",
					"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
					"updated": "2014-12-12T13:00:04Z",
					"id": "23ECB19D-5AE4-4E91-8A9C-993E04D07389",
					"accountID": "BFFC035E-E803-4C12-948C-C9074256A263",
					"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
					"email": "sup@yo.com",
					"addresses": []
				},
				"paymentMethods": [
					{
						"created": "2014-12-12T13:00:04Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-12T13:00:04Z",
						"id": "FACA0879-888C-417E-AF3C-C26AA0574064",
						"accountID": "BFFC035E-E803-4C12-948C-C9074256A263",
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
						"created": "2014-12-12T13:00:04Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-12T13:00:04Z",
						"id": "E390EF21-3FFD-48F6-9B99-78DF5D136145",
						"accountID": "BFFC035E-E803-4C12-948C-C9074256A263",
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
	createAccountWithProfileAndAddress: {
		"executionTime": 1280537,
		"results": [
			{
				"@type": "account",
				"created": "2014-12-12T17:45:36Z",
				"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
				"updated": "2014-12-12T17:45:36Z",
				"id": "13F8A467-DF2B-407C-85AB-0739F80DAC57",
				"crmID": null,
				"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
				"successfulSubscriptions": 0,
				"deleted": false,
				"roles": [],
				"profile": {
					"created": "2014-12-12T17:45:36Z",
					"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
					"updated": "2014-12-12T17:45:36Z",
					"id": "695DB7CA-7824-4F8E-AF2C-4038FAA18ABF",
					"accountID": "13F8A467-DF2B-407C-85AB-0739F80DAC57",
					"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
					"email": "u.n.owen@was.her",
					"firstName": "U.N.",
					"lastName": "Owen",
					"addresses": [
						{
							"created": "2014-12-12T17:45:36Z",
							"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
							"id": "31B8496B-F9B4-4411-B82F-0DBC7D1A67AD",
							"profileID": "695DB7CA-7824-4F8E-AF2C-4038FAA18ABF",
							"organizationID": "D26698C3-D3F2-4B67-A54E-E7CECF09CFB5",
							"addressLine1": "address line 1",
							"addressLine2": "address line 2",
							"addressLine3": "address line 3",
							"city": "London",
							"province": "London",
							"country": "Gensokyo",
							"postcode": "SW1 1AS",
							"landline": "02000000000",
							"primaryAddress": true,
							"deleted": false
						}
					]
				},
				"paymentMethods": [
					{
						"created": "2014-12-12T17:45:36Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-12T17:45:36Z",
						"id": "61CEE823-EADF-4A80-95F7-99D80EBE503C",
						"accountID": "13F8A467-DF2B-407C-85AB-0739F80DAC57",
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
						"created": "2014-12-12T17:45:36Z",
						"changedBy": "0B35F31B-A949-4B6D-A277-3CDFEAD11EF1",
						"updated": "2014-12-12T17:45:36Z",
						"id": "68AD92DD-A9DC-4381-BD7B-2FA012883E36",
						"accountID": "13F8A467-DF2B-407C-85AB-0739F80DAC57",
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