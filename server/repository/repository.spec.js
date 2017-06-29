/* eslint-env mocha */
process.env.NODE_ENV = 'test';

require('should');
var repository = require('./repository');

describe('Repository', function () {
  it('should connect with a promise', function (done) {
    repository.connect({}).should.be.a.Promise();
    done();
  });
});
