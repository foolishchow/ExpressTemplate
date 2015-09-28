var log4js = require('log4js');
var path = require('path');


var appenders = function(props){
  var appender = props.appenders;
  for( var i = 0 ; i < appender.length ; i++ ){
    var  append = appender[i];
    if( append.filename && append.RelativePath ){
      append.filename = path.join(__dirname, append.filename );
      delete append.RelativePath;
    }
  }
  return appender;
}

var prop = require('../prototype/log4j.js');

log4js.configure({
  appenders: appenders(prop),
  replaceConsole: prop.replaceConsole
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
  

module.exports = function(app){
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

  //app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO, format:':status :method :url'}));
};


