/* eslint-env mocha */
process.env.NODE_ENV = 'test';

require('should');
var controller = require('./health');

describe('Controllers : healthcheck', function () {
  it('should respond with health status', function () {
    return controller.getHealthStatus()
      .then(function (statusObj) {
        // this is should.js syntax, very clear
        statusObj.should.containEql({
          service: 'OK'
        });
      });
  });
});
