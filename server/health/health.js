(function () {

  'use strict';

  var getHealthStatus = function getHealthStatus() {
    return Promise.resolve({ service: 'OK' });
  };

  module.exports = {
    getHealthStatus: getHealthStatus
  };

})();
