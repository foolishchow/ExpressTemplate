var socket = require('socket.io');

var encoding = require("encoding");


function execProcessorInner(ExecCommomd,id){
	var cmd = "";
	var arg = ExecCommomd.split(" ");
	if( arg.length == 0 ){
		io.emit('message', {"stdout":'please input you words!'});
		return;
	}else{
		cmd = arg[0];
		arg.shift();
	}
	ExecCommomd = ExecCommomd
	var free = ecs[id](cmd,arg,{});
    free.stdout.on('data', function (data) { 
		console.log('standard output:\n' + data); 
	});
    free.stderr.on('data', function (data) { 
		console.log('standard error output:\n' + data); 
	});
	free.on('exit', function (code, signal) { 
		console.log('child process eixt ,exit:' + code); 
	});
}
var io = function(server){

	var io = socket.listen(server);
	function execProcessorInner(ExecCommomd,id){
		ExecCommomd = ExecCommomd
		var cp = ecs[id](
			ExecCommomd,
	    	{ timeout: 0, maxBuffer: 20000*1024 ,encoding: 'GBK'},
		    function (error, stdout, stderr) {

				var result = {
					error  : error  ? encoding.convert( new Buffer(error)  , 'utf8' , 'GBK' ).toString() : '',
					stdout : stdout ? encoding.convert( new Buffer(stdout) , 'utf8' , 'GBK' ).toString() : '',
					stderr : stderr ? encoding.convert( new Buffer(stderr) , 'utf8' , 'GBK' ).toString() : ''
				};
				io.emit('message', result);
		    }
	    );
	    cp.on('exit', function (code) {

		    console.log('子进程已关闭，代码：' + code);
		    return false;
		});
		ecs[id] = cp.exec;
	}
	var ecs = {};
	io.on('connection', function(socket){
	    console.log('a user connected');
	     
	    //监听用户发布聊天内容
	    socket.on('message', function(obj){
	    	if( !ecs[obj.id] ) {
	    		var exec = require("child_process").exec;
	    		ecs[obj.id] = exec;
	    	} 
	    	execProcessorInner(obj.cmd,obj.id);
	        //向所有客户端广播发布的消息
	        //io.emit('message', obj);
	        //console.log(obj.username+'说：'+obj.content);
	    });
	   
	});
	return io;
}
module.exports = io;