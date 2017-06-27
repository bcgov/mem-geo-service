'use strict';

var express             = require('express');
var bodyParser          = require('body-parser');
var helmet              = require('helmet');
var morgan              = require('morgan');
var winston             = require('winston');
var dotenv              = require('dotenv');

var EaoRestConnector    = require('./services/eao-rest-connector');
var routes              = require('./api/routes');

// Dotenv is a zero-dependency module that loads environment variables from a .env file into 'process.env'
// The .env file is for development purposes only. It should NEVER be committed to version control.
// https://github.com/motdotla/dotenv
dotenv.config();

////////////////////////////////////////////////////////
/*
 * Deployment Configuration
 */
////////////////////////////////////////////////////////

var PORT                = process.env.PORT || 1337;
var HOST                = process.env.HOST || 'localhost';
var NODE_ENV            = process.env.NODE_ENV || 'development';
var LOG_LEVEL           = process.env.LOG_LEVEL || 'debug';
var SERVER_URL          = process.env.SERVER_URL || 'http://localhost:3000';
var PROJECT_API_PATH    = process.env.PROJECT_API_PATH || '/api/query/project';
var DATA_FIELDS         = process.env.DATA_FIELDS || '_id code eacDecision lat lon description currentPhase epicProjectID name proponent status type sector';

////////////////////////////////////////////////////////
/*
 * Logger init
 */
////////////////////////////////////////////////////////

winston.level = LOG_LEVEL;
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { 'timestamp': true, 'colorize': true });

////////////////////////////////////////////////////////
/*
 * App Startup
 */
////////////////////////////////////////////////////////

var app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// helmet helps you secure your express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// development only
// https://github.com/expressjs/morgan
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount API routes
var connector = new EaoRestConnector({
  baseUrl: SERVER_URL,
  path: PROJECT_API_PATH,
  fields: DATA_FIELDS
});

app.use('/api', routes.api({ connector: connector }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (NODE_ENV === 'development') {
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

var server = app.listen(PORT, HOST, function () {
  var host = server.address().address;
  var port = server.address().port;
  winston.info('Service listening at http://' + host + ':' + port);
  winston.info('Log level is at: ' + LOG_LEVEL);
});
