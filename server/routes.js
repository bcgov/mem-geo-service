(function () {

  'use strict';

  var express = require('express');
  var status = require('http-status');

  var exportController = require('./export');
  var healthController = require('./health');

  module.exports = function apiRouter(options) {
    var repo = options.repo;
    var apiUrl = options.apiUrl || process.env.SERVER_URL;
    var router = express.Router();

    // API ROUTES
    // =============================================================================
    router.get('/geojson', function (req, res, next) {
      repo.findAllProjects()
        .then(function (projects) {
          return exportController.geojson(projects, apiUrl);
        })
        .then(function (geojson) {
          res.type('application/json').status(status.OK).json(geojson);
        })
        .catch(next);
    });

    router.get('/healthcheck', function (req, res, next) {
      healthController.getHealthStatus()
        .then(function (serverInfo) {
          res.type('application/json').status(status.OK).json(serverInfo);
        })
        .catch(next);
    });

    return router;
  };

})();
