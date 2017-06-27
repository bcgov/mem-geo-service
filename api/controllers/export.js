'use strict';

var _ = require('lodash');
var status = require('http-status');
var combineUris = require('../../utils/http').combineUris;

module.exports = ExportController;

function ExportController(options) {
  // verify that a connector has been supplied
  if (!options.connector) {
    throw new Error('The server must be started with a connected data source');
  }
  this._connector = options.connector;
}

ExportController.prototype.exportGeoJson = function exportGeoJson(req, res, next) {
  var self = this;
  this._connector.findProjects()
    .then(function (response) {
      return self.toGeoJson(response);
    })
    .then(function (geojson) {
      return res.status(status.OK).json(geojson);
    })
    .catch(next);
};

ExportController.prototype.toGeoJson = function toGeoJson(projects) {
  var geojsonObject = {
    type: 'FeatureCollection',
    features: projects.map(function (obj) { return createSpatialFeature(obj); })
  };

  return geojsonObject;
};

function createSpatialFeature(project) {
  var feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [project.lon, project.lat]
    },
    properties: null
  };

  // remove spatial properties; add project url
  var props = _.chain(project)
    .omit('lat', 'lon', 'userCan')
    .merge({
      projectUrl: combineUris(process.env.SERVER_URL, '/p/' + project.code + '/detail')
    })
    .value();

  // Stash all relevant properties from the source object (project) into the spatial feature
  feature.properties = props;

  return feature;
}
