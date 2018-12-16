var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
//the package below export a function, which in our case, is the session
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')
 

var userRoutes = require('./routes/user');

var app = express();

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true });
require('./config/passport'); //this will load what we have in passport.js

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mysecret', 
  resave: false, 
  saveUninitialized: false,
  //lets store the session on the server, also on the cookie which expires after 3hours(180mins)
  //use our existing mongodb connection
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  //maxAge is 180minutes which is 180000seconds
  cookie: {maxAge: 180 * 60 * 1000}
}));
//take note that everything that needs session will be placed under session definition 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  //locals is gotten from the response
  //login is a variable we want to be available in all our views
  //login is a global variable
  res.locals.login = req.isAuthenticated();
  //lets make session available in all our views:
  res.locals.session = req.session;

  next();
});

app.use('/user', userRoutes);
app.use('/', indexRouter);

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
