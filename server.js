(function () {

  'use strict';

  var _ = require('lodash');
  var dotenv = require('dotenv');
  var winston = require('winston');

  var server = require('./server/app');
  var repository = require('./server/repository/repository');

  // Dotenv is a zero-dependency module that loads environment variables from a .env file into 'process.env'
  // The .env file is for development purposes only. It should NEVER be committed to version control.
  // https://github.com/motdotla/dotenv
  dotenv.config();

  // DEPLOYMENT CONFIGURATION
  // =============================================================================
  process.env.PORT = process.env.PORT || 1337;
  process.env.HOST = process.env.HOST || '0.0.0.0';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
  process.env.SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
  process.env.PROJECT_API_PATH = process.env.PROJECT_API_PATH || '/api/query/project';
  process.env.DATA_FIELDS = process.env.DATA_FIELDS || '_id code eacDecision lat lon description currentPhase epicProjectID name proponent status type sector';

  var config = {
    repo: null,
    port: process.env.PORT,
    host: process.env.HOST,
    logger: {
      level: process.env.LOG_LEVEL
    },
    restSettings: {
      baseUrl: process.env.SERVER_URL,
      path: process.env.PROJECT_API_PATH,
      fields: process.env.DATA_FIELDS
    }
  };

  // START THE SERVER
  // =============================================================================
  var rep;
  repository.connect(config)
    .then(function (repo) {
      rep = repo;
      var newConfig = _.merge({}, config, { repo: repo });

      // repository connected, start the server
      return server.start(newConfig);
    })
    .then(function (app) {
      var host = app.address().address;
      var port = app.address().port;
      winston.info('Server started succesfully, running on http://' + host + ':' + port);
      winston.info('Log level is at: ' + process.env.LOG_LEVEL);

      // disconnect the repository when the server shuts down
      app.on('close', function () {
        rep.disconnect();
      });
    });

}());
