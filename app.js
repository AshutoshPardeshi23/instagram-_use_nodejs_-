var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookiepaeser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'khuch bi'
}));

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

//flash
app.use(flash());

//cors
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  Credentials: true
}));

// express
app.use(logger('div'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookiepaeser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
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
