(function () {

  'use strict';

  var _ = require('lodash');
  var RestRequest = require('../helpers/http').RestRequest;

  var defaultSettings = {
    baseUrl: process.env.SERVER_URL,
    path: process.env.PROJECT_API_PATH
  };

  /**
   * Factory function that creates a repository.
   *
   * The repository mediates between the data source layer and the business layers of the application.
   * It queries the data source for the data, maps the data from the data source to a business entity,
   * and persists changes in the business entity to the data source.
   * A repository separates the business logic from the interactions with the underlying data source or Web service.
   */
  var repository = function repository(options) {
    var opts = _.merge({}, defaultSettings, options.restSettings);
    var path = opts.path;

    // connects to a remote REST API and fetches a list of major mines
    var findAllProjects = function () {
      return new RestRequest(path).get();
    };

    // perform tasks associated with freeing, releasing, or resetting resources; e.g. closing db connections.
    var disconnect = function disconnect() {
    };

    return {
      findAllProjects: findAllProjects,
      disconnect: disconnect
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
