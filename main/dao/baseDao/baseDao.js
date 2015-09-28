var H = require('Helper');

module.exports = function(sql,array){
	H.then();
	//var sql = "SELECT * FROM users WHERE id =?";
    // get a connection from the pool
    global.database.pool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, array , function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
}