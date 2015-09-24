(function () {
    var d = document,
    w = window,
    p = parseInt,
    dd = d.documentElement,
    db = d.body,
    dc = d.compatMode == 'CSS1Compat',
    dx = dc ? dd: db,
    ec = encodeURIComponent;
     
     
    w.exec = {
        id:null,
        socket:null,
        random:function(){
            return Math.random()*Math.random()*Math.random()*Math.random()*Math.random()*1000;
        },
        init:function(username){
            /*
            客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
            实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
            */
           this.id = new Date+ "_" + this.random();
            
             
            //连接websocket后端服务器
            this.socket = io.connect('ws://127.0.0.1:8080');
             
            //告诉服务器端有用户登录
            this.socket.emit('login', {userid:this.userid, username:this.username});
             
            //监听消息发送
            this.socket.on('message', function(obj){
                cb(obj);
            });

        },
        send:function(str){
            var obj = {
                id:this.id,
                cmd:str
            };
            this.socket.emit('message', obj);
        }
    };
})();