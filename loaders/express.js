const express = require('express');
const path = require('path');
const logger = require('morgan');
const compress = require('compression');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports =  (app) => {
  app.use(compress());
  app.use(express.json({limit: '10mb'}));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../module')));

  app.use(logger('dev'));

  app.use(session({
    secret: 'eatable',
    saveUninitialized: false,
    rolling: true,
    resave: false,
    cookie: {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 3600000 * 24 * 7),
      maxAge: 3600000 * 24 * 7
    }
  }));


}
