var helper = require('../../util/Helper');
// var util = require('util');
// var em = require('event').EventEmitter;  
var baseDao = function(transactions){
    //this.thenobj = new helper.Thenjs();
    this.connection = {};
    this.prepared = false;
    this.transactions = ( !transactions ) ? false : true ;
    logger.info('Transaction . . . . . . ' + this.transactions);
}
var prop = baseDao.prototype;
/*异步接口*/
prop.then = function(func){
    this.thenobj = this.thenobj.then(function(cont){
        func.apply(this,arguments);
    });
    return this;
}
/*准备链接*/
prop.prepare = function(){
    var me = this;
    if( this.prepared ) return;
    this.thenobj = helper.Thenjs(function(cont){
        global.database.pool.getConnection(function(err, connection) {
            if (err) {
                throw( new Error( err ) );
            }
            me.connection = connection;
            cont(null);
        });
    });
    me.prepared = true;
    if( this.transactions ) {
        this.thenobj = this.thenobj.then(function(cont){
            logger.info('beginTransaction . . . . . . ');
            me.connection.beginTransaction(function(err, connection) {
                if (err) {
                   throw( new Error( err ) );
                }
                cont(null);
            });
        });
    }
    return this;
}
/*添加持久化操作*/
prop.addQuery = function(sql,array,func){
    var me = this;
    this.prepare();

    this.then(function(cont){
        console.info("args___"+ JSON.stringify(arguments));
        logger.info("prepare sql : " + sql);
        logger.info("prepare param : " + JSON.stringify(array));
        me.connection.query(sql, array , function(err, results) {
            cont(null,err,results);
        });
    });

    this.then(function(cont, err, results){
        if ( err ) {
            throw err;//处罚thenjs错误
        }
        func(results);
        cont(null);
    });
    return this;
};
prop.excute = function(){
    var me = this;
    if( me.transactions ) {
        this.thenobj = this.thenobj.then(function(cont){
            logger.info("commit transaction");
            me.connection.commit(function(err) {
                if (err) {
                    logger.info('error in excute commit');
                    throw  err ;
                }
                cont(null);
            });
        });
    } 
    this.thenobj = this.thenobj.fail(function(cont,errror){
       
        if( me.transactions ) {
            console.info("rollback");
            me.connection.rollback(function(err) {
                throw err;
            });
        } 
        me.connection.release();
        me.released = true;
        throw error;
    });
    this.thenobj = this.thenobj.fin(function(cont,err){
        logger.info('finally release connection!');
        if( !me.released ) me.connection.release();
    });
    return this;
}


prop.t = prop.transition;
var prepareStatement = function(){
    this.thenjs = helper.Thenjs(function(cont){
        global.database.pool.getConnection(function(err, connection) {
            if (err) {
                callback(true,null,err);
                return;
            }
            cont(null,connection);
        });
    }); 
    return this; 
};

var query = function(sql){
    if(sql) sql = 'select * from #{tabel_name} where id = #{id}';
    var regexp = new RegExp('\#\{.*?\}/g');
    var test = regexp.test(sql);
    if(test){
        
    }
}
module.exports = function(transactions){
    return new baseDao(transactions);
};;

// var sql = 'select * from #{tabel_name} where id = #{id}';
// var ts = sql.match(/\#\{.*?\}/g);
// console.info(ts);
