
require('../source/config/log4j.js');
global.database = require('../source/config/mysql.js');
var baseDao = require('../main/dao/baseDao/baseDao.js');

var sql = "select * from td_m_resource where id =?";
var array = ['1'];
var array1 = ['2'];
// baseDao(sql,array,function(result){
// 	console.info("000");
// 	console.info(result);
// });


var bd = baseDao.base();
	bd.addQuery(sql,array,function(result){
		console.info("000");
		console.info(result);
	}).addQuery(sql,array1,function(result){
		console.info("001");
		console.info(result);
	}).excute();
