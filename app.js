require('dotenv').config()
const express = require('express');
const path = require('path');
const multer = require('multer');
const router = require('./routes/index');
const rateLimit = require('./middlewares/rateLimit');
const httpCodes = require('http-status-codes');
require('./databases')
require('./jobs')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(rateLimit)


/*
  API Endpoint: Server Health Check
  Route: GET /
  Description: This endpoint serves as a simple server health check.
              It responds with a 'Hello!' message and an HTTP 200 OK status.
              Used to verify that the server is running and reachable.
*/
app.get('/', function(req, res, next) {
  return res.status(httpCodes.StatusCodes.OK).send('Hello!')
});

/*
  Routes for File Operations
  Description: The following routes handle file-related operations such as creation,
            download, and deletion. These routes are defined in the router.
*/
app.use('/', router);

/*
  NotFound Middleware
  Description: This middleware handles bad requsts
*/
app.use(function(req, res, next) {
  return res.status(httpCodes.StatusCodes.NOT_FOUND).send();
});

/*
  Error Handler Middleware
  Description: This middleware handles errors that occur during the processing of requests.
             It checks if the error is an instance of MulterError (file upload error).
             If so, it responds with a 400 Bad Request status and an error message.
             Otherwise, for other types of errors, it responds with a 500 Internal Server Error status.
*/
app.use(function(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(httpCodes.StatusCodes.BAD_REQUEST).json({ error: err.message });
  } else if (err) {
    res.status(httpCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error: '});
  } else {
    next();
  }
});

module.exports = app;
