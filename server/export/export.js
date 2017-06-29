(function () {

  'use strict';

  var _ = require('lodash');
  var combineUris = require('../helpers/http').combineUris;

  var geojson = function geojson(projects, baseUrl) {
    return new Promise(function (resolve, reject) {
      if (!baseUrl) {
        return reject(new Error('The remote API URL (SERVER_URL) must be configured'));
      }

      var geojsonObject = {
        type: 'FeatureCollection',
        features: projects.map(function (obj) { return createSpatialFeature(obj, baseUrl); })
      };

      return resolve(geojsonObject);
    });
  };

  var createSpatialFeature = function createSpatialFeature(project, baseUrl) {
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
        projectUrl: combineUris(baseUrl, '/p/' + project.code + '/detail')
      })
      .value();

    // Stash all relevant properties from the source object (project) into the spatial feature
    feature.properties = props;

    return feature;
  };

  module.exports = {
    geojson: geojson
  };

})();
