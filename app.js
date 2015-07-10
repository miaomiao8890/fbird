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
		roomid = DB['waitingRoom'].pop(); 
		//添加玩家
		DB[roomid].players.push(nick);
		pageData.players = DB[roomid].players;
		//socket.emit('message', { channel: 'game.' + roomid, data: { type: 'start', players: DB[roomid] } });
	}
	pageData.roomId = roomid;
	//console.log(DB);
	res.render('games/online', pageData);
});

io.sockets.on('connection', function(socket) {
	console.log('a user connected');

	socket.on('login', function(data) {
		//socket.name = data.username;
		DB[data.roomid].sockets.push(this);
		//console.log(DB[data.roomid].sockets);
	});

	socket.on('match', function(data) {
		//console.log(task)
		console.log(data);
		for (var i = 0; i < DB[data.roomid].sockets.length; i++) {
			DB[data.roomid].sockets[i].emit('match', data.players);
		}
	});
});