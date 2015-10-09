var helper = require('../../util/Helper');
var promiseDao = require('./promise');


var excute = function(sql,array,cb){
    var callback = function(error,result,errorDetail){
        if(error){
            throw error;
        }else{
            cb(result); 
        }
    };
    helper
    .Thenjs(function(cont){
        global.database.pool.getConnection(function(err, connection) {
            if (err) {
                callback(true,null,err);
                return;
            }
            cont(null,connection);
        });
    })
    .then(function(cont,connection){
        connection.query(sql, array , function(err, results) {
            if (err) {
                callback(true,results,err);
                connection.release();
                return;
            }
            callback(false, results,err);
        });
    })
    .fail(function(cont,err){
        callback(true,null,err);
    });
    
}
excute.base = function(transactions){
    return new promiseDao(transactions);
};
module.exports = excute;