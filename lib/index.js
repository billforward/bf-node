///<reference path='../typings/tsd.d.ts' />
require('typescript-require')({
    nodeLib: false,
    targetES5: true,
    exitOnError: true
});
exports.Hello = require('./hello.ts').Hello;
//# sourceMappingURL=index.js.map