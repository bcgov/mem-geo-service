'use strict';

var _ = require('lodash');
var request = require('request-promise');

var SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

module.exports.combineUris = combineUris;
module.exports.buildApiPath = buildApiPath;
module.exports.jsonRequest = jsonRequest;
module.exports.RestRequest = RestRequest;

function combineUris(baseUri, relativeUri) {
  return relativeUri ? _.trimEnd(baseUri, '/') + '/' + _.trimStart(relativeUri, '/') : baseUri;
}

function buildApiPath(path) {
  return combineUris(SERVER_URL, path);
}

function jsonRequest(path, options) {
  var defaults = {
    method: 'GET',
    uri: path,
    headers: {
      'Accept': 'application/json'
    },
    json: true // Automatically parses the JSON string in the response
  };

  var opts = _.merge(defaults, options || {});
  return request(opts);
}

function RestRequest(path) {
  this.path = buildApiPath(path);
}

RestRequest.prototype.get = function apiGet(params) {
  return jsonRequest(this.path, { method: 'GET', qs: params });
};

RestRequest.prototype.post = function apiPost(data) {
  return jsonRequest(this.path, { method: 'POST', body: data });
};

RestRequest.prototype.put = function apiPut(data) {
  return jsonRequest(this.path, { method: 'PUT', body: data });
};

RestRequest.prototype.delete = function apiDelete(data) {
  return jsonRequest(this.path, { method: 'DELETE', body: data });
};
