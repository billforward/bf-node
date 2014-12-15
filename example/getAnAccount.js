var BillForward = require('../../bin');

var config = {
	"urlRoot":     "https://api-sandbox.billforward.net:443/v1/",
	"accessToken": "INSERT_ACCESS_TOKEN_HERE"
};

BillForward.Client.makeDefault(config.accessToken, config.urlRoot);

BillForward.Account.getAll()
.then(function(accounts) {
	console.log(accounts[0].profile.toString());
})
.catch(function(err) {
	console.log(err);
});