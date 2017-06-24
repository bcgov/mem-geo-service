'use strict';

var _ = require('lodash');
var RestRequest = require('../utils/http').RestRequest;

module.exports = EaoRestConnector;

function EaoRestConnector(options) {
  var defaults = {
    baseUrl: process.env.SERVER_URL,
    path: process.env.PROJECT_API_PATH,
    fields: process.env.DATA_FIELDS,
    q: {
      isPublished: true
    }
  };

  this._opts = _.merge(defaults, options);
  this._filter = _.pick(this._opts, 'q', 'fields');
};

EaoRestConnector.prototype.findProjects = function findProjects(filter) {
  var path = this._opts.path;
  var obj = filter || this._filter;
  return new RestRequest(path).put(obj);
};
