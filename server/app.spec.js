/* eslint-env mocha */
process.env.NODE_ENV = 'test';

require('should');
var server = require('./app');

describe('Server', function () {
  it('should require a port to start', function () {
    // this is should.js syntax, very clear
    return server.start({ repo: {} }).should.be.rejectedWith(/port/);
  });

  it('should require a repository to start', function () {
    return server.start({ port: 4395 }).should.be.rejectedWith(/repository/);
  });

  it('should require a remote API URL to start', function () {
    return server.start({ port: 4395, repo: {} }).should.be.rejectedWith(/remote API URL/);
  });
});
