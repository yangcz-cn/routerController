var ws = require("nodejs-websocket");
console.log("开始建立连接...")

var users = new Map(),game2 = null , game1Ready = false , game2Ready = false;
var server = ws.createServer(function(conn){
    conn.on("text", function (str) {
        let parse = JSON.parse(str);
		let ret = {};
		switch(parse.action){
			case 'connect':
				if(parse.key){
					parse.conn = conn;
					parse.online = true;
					users.set(parse.key,parse);
					ret.type = 'connect';
					ret.msg = '链接成功';
					conn.sendText(JSON.stringify(ret));
				}else{
						console.log('未登录的用户');
						ret.type = 'waring';
						ret.msg = '请登录后发言';
						conn.sendText(JSON.stringify(ret));
				}
			break;
			case 'msg':
				if(checkMsg(parse.msg)){
					for(let user of users ){
						if(user[1].online){
							ret.type = 'msg';
							ret.key = parse.key;
							ret.msg = checkMsg(parse.msg);
							user[1].conn.sendText(JSON.stringify(ret));
						}
					}
				}
			break;
        }
       // conn.sendText(str)//发送给客户端消息
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接",'code',code,'reason',reason);
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭",'code',code,'reason',reason)
    });
}).listen(8001)
console.log("WebSocket建立完毕");
function checkMsg(msg){
	if(msg === null || msg === undefined || msg === ''){
		return false;
	}
	return msg;
}

