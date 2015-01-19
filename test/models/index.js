module.exports = function(BillForward) {
	var models = {};

	models.Account = function() {
		var address = new BillForward.Address({
		    'addressLine1': 'address line 1',
		    'addressLine2': 'address line 2',
		    'addressLine3': 'address line 3',
		    'city': 'London',
		    'country': 'Gensokyo',
		    'province': 'London',
		    'postcode': 'SW1 1AS',
		    'landline': '02000000000',
		    'primaryAddress': true
		});
		var profile = new BillForward.Profile({
			'email': 'u.n.owen@was.her',
				'firstName': 'U.N.',
				'lastName': 'Owen',
			'addresses': [address]
		});
		var paymentMethod = new BillForward.PaymentMethod({
		    'name': 'Credit Notes',
		    'description': 'Pay using credit',
		    'linkID': '',
		    'gateway': 'credit_note',
		    'userEditable': 0,
		    'priority': 100,
		    'reusable': 1,
		    'defaultPaymentMethod': true
	    });
		var account = new BillForward.Account({
			profile: profile,
			paymentMethods: [paymentMethod]
		});

		return account;
	};

	models.UnitOfMeasure = function() {
		var uom = new BillForward.UnitOfMeasure({
			'name': 'CPU',
			'displayedAs': 'Cycles',
			'roundingScheme': 'UP',
		});
		return uom;
	};

	models.UnitOfMeasure2 = function() {
		var uom = new BillForward.UnitOfMeasure({
			'name': 'Bandwidth',
			'displayedAs': 'Mbps',
			'roundingScheme': 'UP',
		});
		return uom;
	};

	models.Product = function() {
		var product = new BillForward.Product({
			'productType': 'recurring',
			'state': 'prod',
			'name': 'Monthly recurring',
			'description': 'Purchaseables to which customer has an automatically-renewing, monthly entitlement',
			'durationPeriod': 'months',
			'duration': 1
		});
		return product;
	};

	models.PricingComponentTiers = function() {
		var tiers = [
			new BillForward.PricingComponentTier({
				'lowerThreshold': 0,
				'upperThreshold': 0,
				'pricingType': 'unit',
				'price': 0
			}),
			new BillForward.PricingComponentTier({
				'lowerThreshold': 1,
				'upperThreshold': 10,
				'pricingType': 'unit',
				'price': 1
			}),
			new BillForward.PricingComponentTier({
				'lowerThreshold': 11,
				'upperThreshold': 1000,
				'pricingType': 'unit',
				'price': 0.5
			})
		];
		return tiers;
	};

	models.PricingComponentTiers2 = function() {
		var tiers = [
			new BillForward.PricingComponentTier({
				'lowerThreshold': 0,
				'upperThreshold': 0,
				'pricingType': 'unit',
				'price': 0
			}),
			new BillForward.PricingComponentTier({
				'lowerThreshold': 1,
				'upperThreshold': 10,
				'pricingType': 'unit',
				'price': 0.10
			}),
			new BillForward.PricingComponentTier({
				'lowerThreshold': 11,
				'upperThreshold': 1000,
				'pricingType': 'unit',
				'price': 0.05
			})
		];
		return tiers;
	};

	return models;
};