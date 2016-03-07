var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var curConfig = require('./config.js');

// var routes = require('./routes/index');
// var users = require('./routes/users');
var portReq = require('port');
    // port = process.env.PORT || 6060;

var app = express();

// app.use('/', routes);
// app.use('/users', users);
app.listen(curConfig.port, function (err) {
  ListenErrorMessage(err);
  console.log('listening on %s.', curConfig.port);
});

function ListenErrorMessage (errMesg) {
  if(errMesg){
    console.log('error message is: -- '+errMesg);
  }else{
    console.log('currentApp port No Error.');
  }
};

mongoose.connect(curConfig.database, function (err) {
  mongooseConnectToDb(err);
});

function mongooseConnectToDb(errMsg) {
  if (errMsg) {
    console.log('Connect To Database Error: '+errMsg);
  } else {
    console.log('Connect To Database Successful.');
  }
};

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, '../public'),
  dest: path.join(__dirname, '../public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, '../public')));

//signup Router
var signupApi = require('./apiRoutes/beforLogin/signUpApi.js');
app.use('/api', signupApi);

//get all Users
var getAllUsersApi = require('./apiRoutes/beforLogin/getAllUsers.js');
app.use('/api', getAllUsersApi);

//login user
var loginApi = require('./apiRoutes/beforLogin/loginApi.js');
app.use('/api', loginApi);

// loggedIn Middleware
var loggedInMidwareApi = require('./apiRoutes/loginMiddleware.js');
app.use('/api', loggedInMidwareApi);

// get Current User Info
var getCurUserApi = require('./apiRoutes/afterLogin/getCurUserInfo.js');
app.use('/api', getCurUserApi);

// PostAndGetStory
var postAndGetStoryApi = require('./apiRoutes/afterLogin/postAndGetStory.js');
app.use('/api', postAndGetStoryApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
