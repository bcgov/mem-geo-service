(function () {

  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var compression = require('compression');
  var helmet = require('helmet');
  var morgan = require('morgan');
  var winston = require('winston');

  var apiRouter = require('./routes');

  var start = function start(options) {
    return new Promise(function (resolve, reject) {
      options = options || {};
      options.logger = options.logger || {};
      options.restSettings = options.restSettings || {};

      var repo = options.repo;
      var port = options.port || process.env.PORT;
      var host = options.host || process.env.HOST || '0.0.0.0';
      var logLevel = options.logger.level || process.env.LOG_LEVEL || 'debug';
      var apiUrl = options.restSettings.baseUrl || process.env.SERVER_URL;

      if (!repo) {
        return reject(new Error('The server must be started with a connected repository'));
      }
      if (!port) {
        return reject(new Error('The server must be started with an available port'));
      }
      if (!apiUrl) {
        return reject(new Error('The remote API URL (SERVER_URL) must be configured'));
      }

      // LOGGER INIT
      // =============================================================================
      winston.level = logLevel;
      winston.remove(winston.transports.Console);
      winston.add(winston.transports.Console, { 'timestamp': true, 'colorize': true });

      // APP STARTUP
      // =============================================================================
      var app = express();

      // middleware
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      // compress responses
      app.use(compression());

      // helmet helps you secure your express apps by setting various HTTP headers
      // https://github.com/helmetjs/helmet
      app.use(helmet());

      // development only
      // https://github.com/expressjs/morgan
      if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
      }

      // REGISTER OUR API ROUTES
      // =============================================================================
      app.use('/api', apiRouter({ repo: repo, apiUrl: apiUrl }));

      // catch 404 and forward to error handler
      app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      });

      // error handlers

      // development error handler
      // will print stacktrace
      if (process.env.NODE_ENV === 'development') {
        app.use(function (err, req, res) {
          res.status(err.status || 500);
          res.json({
            message: err.message,
            error: err
          });
        });
      }

      // production error handler
      // no stacktraces leaked to user
      app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.json({
          message: err.message,
          error: {}
        });
      });

      // START THE SERVER
      // =============================================================================
      var server = app.listen(port, host, function () {
        return resolve(server);
      });
    });
  };

  module.exports.start = start;

})();
