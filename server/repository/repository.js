(function () {

  'use strict';

  var _ = require('lodash');
  var RestRequest = require('../helpers/http').RestRequest;

  var defaultSettings = {
    baseUrl: process.env.SERVER_URL,
    path: process.env.PROJECT_API_PATH,
    fields: process.env.DATA_FIELDS,
    q: { isPublished: true }
  };

  var repository = function repository(options) {
    var opts = _.merge({}, defaultSettings, options.restSettings);

    // Assemble query object; i.e { q: {...}, fields: {...} }
    var queryObj = _.pick(opts, 'q', 'fields');
    var path = opts.path;
    var findAllProjects = function (filter) {
      return new RestRequest(path).put(filter || queryObj);
    };

    return {
      findAllProjects: findAllProjects
    };
  };

  var connect = function connect(options) {
    return new Promise(function (resolve, reject) {
      if (!options) {
        return reject(new Error('options not supplied!'));
      }
      return resolve(repository(options));
    });
  };

  module.exports.connect = connect;
})();
