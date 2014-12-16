module.exports = {
	"urlRoot":     "https://api-sandbox.billforward.net:443/v1/",
	"accessToken": "INSERT_ACCESS_TOKEN_HERE",

	// print API output to console
	"requestLogging": false,
	"responseLogging": false,
	"errorLogging": false,

	// listen during tests for webhooks incoming to localhost on this port
	"webhookPort": 4649,
	// wait maximally this amount of time (ms) for webhooks to arrive during functional test
	"keepAlive": 10000
}