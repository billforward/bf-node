///<reference path='../../bin/index.d.ts' />
///<reference path="../../typings/node/node.d.ts" />
var config = {
    "urlRoot": "https://api-sandbox.billforward.net:443/v1/",
    "accessToken": "INSERT_ACCESS_TOKEN_HERE"
};
BillForward.Client.makeDefault(config.accessToken, config.urlRoot);
BillForward.Account.getByID("wup").then(function (account) {
    console.log(account);
});
//# sourceMappingURL=example.js.map