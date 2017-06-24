'use strict';

var express = require('express');
var ExportController = require('./controllers/export');
var HealthController = require('./controllers/health');

module.exports.api = apiRoutes;

function apiRoutes(options) {
  // verify that a connector has been supplied
  if (!options.connector) {
    throw new Error('The server must be started with a connected data source');
  }

  var router = express.Router();
  var exportController = new ExportController(options);
  var healthController = new HealthController(options);

  // --- routes

  router.get('/export/geojson', function (req, res, next) {
    exportController.exportGeoJson(req, res, next);
  });

  router.get('/health', function (req, res, next) {
    healthController.healthCheck(req, res, next);
  });

  return router;
};
