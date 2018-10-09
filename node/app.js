var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config/dev.config.js');
const Tools = require('./tools/Tools.js');






var app = express();

/*
*占时没用
if(config.isGzip){
	var compression = require('compression');//gzip 压缩
	// compress responses gzip 压缩
	app.use(compression());
}*/

//use session
app.use(session({
	secret:'yangcz',
	cookie:{maxAge:1000*3600*2},//毫秒
	resave:true,
	saveUninitialized:true
}));



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jurisRouter = require('./routes/juris');
var roteRouter = require('./routes/rote');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*',function(req,res,next){
	let username = req.cookies.username,token = req.cookies.token;
	if(req.path == '/user/login') {
		next();
		return;
	}
	if(token === Tools.userToken(username)){
	  next();  
	}else{
	  res.json(Tools.failRet(40003,req.path));
	  
	}
	
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/juris', jurisRouter);
app.use('/rote', roteRouter);

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
