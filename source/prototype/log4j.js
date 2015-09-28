module.exports = {
	  "appenders": [
	    { "type": "console" }, //控制台输出
	      {
	        "type": "dateFile", //文件输出
	        "filename":  "/../../logs/access.log", 
	        "RelativePath":true, //是否根据当前路径 的相对路劲
	        "maxLogSize": 10240,
	        "backups":3,
	        "category": "normal" ,
	        "type": "dateFile",
	        "pattern": "-yyyy-MM-dd"
	      }
	  ],
	  "replaceConsole":true
}