var mysql = require('mysql');
var config = require('../prototype/db.js');

var pool = mysql.createPool(config.mysql_dev);

exports.pool = pool;