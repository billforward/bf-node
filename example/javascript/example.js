var config = {
	"urlRoot":     "https://api-sandbox.billforward.net:443/v1/",
	"accessToken": "INSERT_ACCESS_TOKEN_HERE"
};

var BillForward = require('../../bin');
BillForward.Client.makeDefault(config.accessToken, config.urlRoot);

BillForward.Account.getByID("wup")
.then(function(account) {
	console.log(account);
});