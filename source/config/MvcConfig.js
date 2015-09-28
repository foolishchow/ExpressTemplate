var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var log4j = require('./log4j.js');



/**
 * [configViews description]
 * @return {[type]} [description]
 */
var configViews = function(app,express){
	// view engine setup
	app.set('views', path.join(__dirname, '../../views/pages/'));
	app.set('view engine', 'ejs');

	app.use(partials());
}
/**
 * [configStatic description]
 * @return {[type]} [description]
 */
var configStatic = function(app,express){
    //静态资源地址 相对本配置文件的位置
	app.use(express.static(path.join(__dirname, '../../views/Static/')));
}
/**
 * [configUtils description]
 * @return {[type]} [description]
 */
var configUtils = function(app,express){
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	//日志配置
	log4j(app);
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	//app.use(logger('dev')); //express自带的日志系统 这里不配置使用log4j代替
}
/**
 * [configController description]
 * @param  {[type]} app     [description]
 * @param  {[type]} express [description]
 * @return {[type]}         [description]
 */
var configController = function(app,express){
	var indexController = require('../../main/controller/indexController');
	var usersController = require('../../main/controller/usersController');
	app.use('/', indexController);
	app.use('/users', usersController);
}
/**
 * [configDefault description]
 * @param  {[type]} app     [description]
 * @param  {[type]} express [description]
 * @return {[type]}         [description]
 */
var configDefault = function(app,express){
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
}
/**
 * [config description]
 * @param  {[type]} app     [description]
 * @param  {[type]} express [description]
 * @return {[type]}         [description]
 */
var config = function(app,express){

	configViews(app,express);
	configUtils(app,express);
	configStatic(app,express);
	configController(app,express);
	configDefault(app,express);

	//项目端口
	process.env.PORT="8080";
	app.set('port', process.env.PORT || 3000);
}


module.exports = config;
