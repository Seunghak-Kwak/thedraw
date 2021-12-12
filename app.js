var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var sendRouter = require('./routes/send');
// var draw1Router = require('./routes/draw1/index');
// var draw2Router = require('./routes/draw2/index');
// var draw3Router = require('./routes/draw3/index');
// var draw4Router = require('./routes/draw4/index');

var app = express();

//logging timezone
logger.token('date', function() {
  var k = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"})
  return (k);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret:'ras',
  resave:true,
  secure:false,
  saveUninitialized:true,
}))

app.use(logger('common'));
//app.use(logger(':method :url :status :response-time :date[clf]'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/send',sendRouter);
// app.use('/draw1', draw1Router);
// app.use('/draw2', draw2Router);
// app.use('/draw3', draw3Router);
// app.use('/draw4', draw4Router);

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
