require('./index.css');

const main = require('./main');
const tests = require('./test/main');

module.exports = main.app;
module.exports.Tests = tests.Tests;
