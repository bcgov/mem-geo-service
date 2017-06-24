'use strict';

var _ = require('lodash');
var status = require('http-status');

module.exports = HealthController;

function HealthController(options) {
  options = options || {};

  var defaultService = {
    health: function health() { return { service: 'OK' }; }
  };

  this._service = _.isFunction(options.healthService) ? options.healthService : defaultService;
};

HealthController.prototype.health = function () {
  return this._service.health();
};

HealthController.prototype.healthCheck = function healthCheck(req, res, next) {
  var serverHealth = this.health();
  res.status(status.OK).json(serverHealth);
};
