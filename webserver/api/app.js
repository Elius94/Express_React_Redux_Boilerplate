/**
 * @module app
 * @requires express
 * @requires body-parser
 * @requires cors
 * 
 * @author Elia Lazzari - Elius94
 * 
 * @description This is the entry point of the application. 
 * It is responsible for creating the Express application and configuring it.
 * 
 * @see {@link https://expressjs.com/en/4x/api.html#app}
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const io = require('@pm2/io')

/**
 * Routers files path
 * @constant {string}
 */
var usersRouter = require('./routes/index');
var APIRouter = require('./routes/API');

/**
 * app = express() - the server unit
 * @constant {object}
 * @see {@link https://expressjs.com/en/4x/api.html#app}
 */
var app = express();

/** 
 * app.use(cors()) 
 * @see {@link https://expressjs.com/en/4x/api.html#app.use}
 * 
 * @description cors() is a middleware that allows cross-origin HTTP requests,
 * by setting the "Access-Control-Allow-Origin" header.
 * cross-origin HTTP requests are those that are made from a different domain than the server.
 * 
 * @see {@link https://expressjs.com/en/resources/middleware/cors.html}
 */
app.use(cors());

/** 
 * app.use(logger('dev'))
 * @description logger('dev') is a middleware for logging requests.
 * 
 * @see {@link https://expressjs.com/en/resources/middleware/logger.html}
 */
app.use(logger('dev'));

/** 
 * app.use(express.json())
 * @description express.json() is a middleware for parsing JSON request bodies.
 * 
 * @see {@link https://expressjs.com/en/resources/middleware/body-parser.html} 
 */
app.use(express.json({ limit: '10mb' }));

/** 
 * app.use(express.urlencoded({ extended: false }))
 * @description express.urlencoded() is a middleware for parsing URL encoded bodies.
 * 
 * @see {@link https://expressjs.com/en/resources/middleware/body-parser.html}
 */
app.use(express.urlencoded({ extended: false }));

/** 
 * app.use(cookieParser())
 * @description cookieParser() is a middleware for parsing cookies.
 * 
 * @see {@link https://expressjs.com/en/resources/middleware/cookie-parser.html}
 */
app.use(cookieParser());

/** 
 * app.use(express.static(path.join(__dirname, 'public')))
 * @description express.static() is a middleware for serving static files.
 * 
 * @see {@link https://expressjs.com/en/resources/middleware/static.html}
 */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

/** 
 * app.use('/api', APIRouter)
 * @description app.use('/api', APIRouter) is a middleware for serving API routes.
 * 
 * @see {@link ./routes/API.js}
 */
app.use("/API", APIRouter); // REST API here

app.disable('x-powered-by');
app.set('json spaces', 2);

/**
 * @description Use this to send errors to PM2 dashboard
 * @see {@link https://www.npmjs.com/package/@pm2/io}
 * @see {@link https://www.npmjs.com/package/http-errors}
 */
app.use(io.expressErrorHandler())

/**
 * createError(404)
 * @description  is a middleware for handling 404 errors. 
 */
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;