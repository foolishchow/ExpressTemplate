var log4js = require('log4js');
var path = require('path');


log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'dateFile', //文件输出
      filename: path.join(__dirname, '/../../logs/access.log') , 
      maxLogSize: 10240,
      backups:3,
      category: 'normal' ,
      type: "dateFile",
      pattern: "-yyyy-MM-dd"
    }
  ],
  replaceConsole: true
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
  

module.exports = function(app){
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

  //app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO, format:':status :method :url'}));
};

