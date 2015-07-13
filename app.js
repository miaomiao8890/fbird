/** CONFIGURATION **/

HOST = "http://127.0.0.1/"
PORT = "8080"

/** CONFIGURATION **/

var express = require('express')
	, app = express.createServer()
	, io = require('socket.io').listen(app);

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.listen(PORT);

var DB = new Array();

app.get('/games/online/:nickname', function (req, res) {
	var nick = req.params.nickname,roomid,
		pageData = {
			PORT: PORT,
			HOST: HOST,
			title: "联机对战",
			nickname: nick
		}
 	//查找是否有等待房间
	if (!DB['waitingRoom'] || DB['waitingRoom'].length == 0) {
		roomid = Math.random().toString(36).substring(12);
		//添加等待房间
		DB['waitingRoom'] = [roomid];
		//添加玩家
		DB[roomid] = { players: [nick], sockets: [] };
		pageData.players = [nick];
	}
	else {
		//获取等待房间
		roomid = DB['waitingRoom'][DB['waitingRoom'].length-1];
		//判断是否页面刷新
		if (DB[roomid]) {
			DB['waitingRoom'].pop();
			//添加玩家
			DB[roomid].players.push(nick);
			pageData.players = DB[roomid].players;
		} 
		else {
			DB[roomid] = { players: [nick], sockets: [] };
			pageData.players = [nick];		
		}
	}
	pageData.roomId = roomid;
	//console.log(DB);
	res.render('games/online', pageData);
});

io.sockets.on('connection', function(socket) {
	//监听用户加入
	socket.on('login', function(data) {
		console.log(data.username + ' connected');

		socket.name = data.username;
		socket.roomid = data.roomid;
		DB[data.roomid].sockets.push(this);
		//console.log(DB[data.roomid].sockets);
	});

	//监听用户退出
    socket.on('disconnect', function(){
    	//将信息发送给用户
    	if (DB[socket.roomid]) {
	    	for (var i = 0; i < DB[socket.roomid].sockets.length; i++) {
	    		DB[socket.roomid].sockets[i].emit('message', { type: 'disconnect'});
	    	}
	    	//删除DB
	    	delete DB[socket.roomid];
    	}
    });
    //监听用户匹配
	socket.on('match', function(data) {
		//console.log(data);
		for (var i = 0; i < DB[data.roomid].sockets.length; i++) {
			DB[data.roomid].sockets[i].emit('match', data.players);
		}
	});

	socket.on('message', function(data) {
		console.log(data)
		var s_socket = DB[data.roomid].sockets[0].name == data.player ? DB[data.roomid].sockets[1] : DB[data.roomid].sockets[0];
		s_socket.emit('message', { type: data.type, player: data.player });
	});
});