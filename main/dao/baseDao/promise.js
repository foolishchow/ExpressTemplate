var helper = require('../../util/Helper');

helper.Thenjs.onerror = function(err){
    console.info("err:"+  err  );
    console.info(  err  );
    //baseDao.onerror(err);
}

// var util = require('util');
// var em = require('event').EventEmitter;  
var baseDao = function(transactions){
    this.connection = {};
    this.prepared = false;
    this.transactions = ( !transactions ) ? false : true ;
    logger.info('Transaction . . . . . . ' + this.transactions);
}
baseDao.onerror = function(err){
    throw err;
}
var prop = baseDao.prototype;
/*异步接口*/
prop.then = function(func){
    this.thenobj = this.thenobj.then(function(cont){
        func.apply(this,arguments);
    });
    return this;
}
prop.err = function(err){
    if( err ){
        this.__error = err;
        throw err;
    }
}
/*准备链接*/
prop.prepare = function(){
    var me = this;
    if( this.prepared ) return;
    me.thenobj = helper.Thenjs(function(cont){
        global.database.pool.getConnection(function(err, connection) {
            cont(null, err, connection);
        });
    });
    me.then(function(cont, err, connection){
        me.err(err)
        me.connection = connection;
        cont(null);
    });
    me.prepared = true;
    if( me.transactions ) {
        me.then(function(cont){
            logger.info('beginTransaction . . . . . . ');
            me.connection.beginTransaction(function(err) { 
                cont(null,err); 
            });
        }).then(function(cont,err){
            logger.info('beginTransaction successed. . . . . . ');
            me.err(err); 
            cont(null);
        });

    }
    return this;
}
/*添加持久化操作*/
prop.addQuery = function(sql,array,func){
    var me = this;
    me.prepare();

    me.then(function(cont){
        logger.info("prepare sql : " + sql);
        logger.info("prepare param : " + JSON.stringify(array));
        me.connection.query(sql, array , function(err, results) {
            cont(null,err,results);
        });
    }).then(function(cont, err, results){
        me.err(err);
        func(results);
        cont(null);
    });

    return this;
};
prop.excute = function(){
    var me = this;

    //commit the whole transaction
    if( me.transactions ) {
        me.then(function(cont){
            logger.info("commit transaction");
            me.connection.commit(function(err) {
                cont(null,err)
            });
        }).then(function(cont,err){
            if (err)  logger.info('error in transaction commit');
            me.err(err);  
            cont(null);
        });
    } 

    me.thenobj = me.thenobj.fail(function(error){
        error.__error = me.__error;
        throw error;
    });

    me.thenobj = me.thenobj.fin(function(cont,err){

        if( me.__error && me.transactions ) {
            logger.info("error , so transaction rollback");
            me.connection.rollback(function(err) {
                me.err(err); 
                cont(null,err);
            });
            
        } else{
            logger.info('finally release connection!');
            me.connection.release();
            logger.info('finally released connection!');
        }

       
        
    });

    me.then(function(cont){
        try{
            logger.info(" Try to release connection ... ");
            me.connection.release();
        }catch(e){
            logger.info(" Connection already released ... ");
        }
        logger.info(" Connection released ... ");
        me.released = true;
        throw me.__error;
    });

    return this;
}







module.exports = function(transactions){
    return new baseDao(transactions);
};;


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


// var sql = 'select * from #{tabel_name} where id = #{id}';
// var ts = sql.match(/\#\{.*?\}/g);
// console.info(ts);
