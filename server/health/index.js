(function () {

  'use strict';

  var controller = require('./health');

  module.exports = {
    getHealthStatus: controller.getHealthStatus
  };

})();
