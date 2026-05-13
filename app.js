require("dotenv").config();
var session = require('express-session');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { connectToDB } = require('./models/db');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
(async () => {
  try {
    await connectToDB();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to start database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
