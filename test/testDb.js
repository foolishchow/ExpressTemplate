
require('../source/config/log4j.js');
global.database = require('../source/config/mysql.js');
var baseDao = require('../main/dao/baseDao/baseDao.js');

var sql = "select * from td_m_resource where id =?";
var array = ['1'];
var array1 = ['4','4','4'];
var array2 = ['4','5','5'];
var sql1 = "insert into td_m_resource(id,name,token)  values(?,?,?)";

try{

	var bd = baseDao.base(true);
		bd.addQuery(sql,array,function(result){
			console.info("000");
			console.info(result);
		}).addQuery(sql1,array1,function(result){
			console.info("001");
			console.info(result);
		}).addQuery(sql1,array2,function(result){
			console.info("002");
			console.info(result);
		}).excute();

}catch(e){
	logger.info("---------------catch");
	logger.info(e);
}
