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
		var account = new BillForward.Account({
			profile: profile
		});

		return account;
	};

	models.UnitOfMeasure = function() {
		// don't wanna include GUID library =_=;;
		var seed = Math.floor((new Date).getTime()+Math.random()*10000000);

		var unique = Math.floor(seed/100000)+seed%1000;
		var name = "CPU "+unique;
		var uom = new BillForward.UnitOfMeasure({
			'name': name,
			'displayedAs': 'Cycles',
			'roundingScheme': 'UP',
		});
		return uom;
	};

	models.UnitOfMeasure2 = function() {
		// don't wanna include GUID library =_=;;
		var seed = Math.floor((new Date).getTime()+Math.random()*10000000);

		var unique = Math.floor(seed/100000)+seed%1000;
		var name = "Bandwidth "+unique;
		var uom = new BillForward.UnitOfMeasure({
			'name': name,
			'displayedAs': 'Mbps',
			'roundingScheme': 'UP',
		});
		return uom;
	};

	models.FastProduct = function() {
		var product = new BillForward.Product({
			'productType': 'recurring',
			'state': 'prod',
			'name': 'Quickly recurring',
			'description': 'Purchaseables to which customer has an automatically-renewing, 3-minutely entitlement',
			'durationPeriod': 'minutes',
			'duration': 3
		});
		return product;
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