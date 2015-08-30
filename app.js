/** CONFIGURATION **/

HOST = "http://172.16.37.86/"
PORT = "8868"

/** CONFIGURATION **/

var express = require('express')
	, app = express.createServer()
	, io = require('socket.io').listen(app);

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.listen(PORT);

var DB = new Array();

app.get('/:nickname', function (req, res) {
	var nick = req.params.nickname,roomid,
		pageData = {
			PORT: PORT,
			HOST: HOST,
			title: "联机对战",
			nickname: nick 
		}
	res.render('games/newgame', pageData);
});

io.sockets.on('connection', function(socket) {
	//监听用户加入
	socket.on('login', function(data) {
		console.log(data.username + ' connected');

		socket.name = data.username;
		//socket.obstacles = getObstacles(data.scale);

		var roomid;
		//查询是否有房间
		if (!DB['waitingRoom'] || DB['waitingRoom'].length == 0) {
			var roomid = Math.random().toString(36).substring(12);
			//添加等待房间
			DB['waitingRoom'] = [roomid];
			//添加玩家
			DB[roomid] = { players: [data.username], sockets: [], randomArr: []};
			DB[roomid].randomArr = getRandom();
		}
		else {
			//获取等待房间
			roomid = DB['waitingRoom'][DB['waitingRoom'].length-1];
			//判断是否页面刷新
			if (DB[roomid]) {
				DB['waitingRoom'].pop();
				//添加玩家
				DB[roomid].players.push(data.username);
			} 
			else {
				console.log("刷新--------------")
				DB[roomid] = { players: [data.username], sockets: [] };
			}
		}
		socket.roomid = roomid;
		DB[roomid].sockets.push(this);
		//console.log(DB[data.roomid].sockets);

		socket.emit('login', { roomid: roomid, players: DB[roomid].players });
	});

	//监听用户退出
    socket.on('disconnect', function(){
    	//将信息发送给用户
    	if (DB[socket.roomid]) {
    		DB[socket.roomid].sockets.forEach(function(item) {
    			item.emit('message', { type: 'disconnect'});
    		})
	    	//删除DB
	    	delete DB[socket.roomid];
    	}
    });
    //计算客户端与服务器延时
    socket.on('delaytime', function(data) {
    	var st = new Date().getTime();
    	console.log(st);
    	socket.emit('delaytime_' + data.index, { t2: st, t1: data.t1 });
    });
    //监听用户匹配
	socket.on('match', function(data) {
		//发送100个障碍物数据
		// console.log(socket.scale)
		//var obstacles = getObstacles(socket.scale)
		// var topheightArr = []
		// for (var i = 0; i < 100; i++) {
		// 	topheightArr.push(Math.floor(Math.random()*170));
		// }
		var randomArr = getRandom();
		DB[data.roomid].sockets.forEach(function(item) {
			item.server_time = new Date().getTime();
			item.emit('match', { random: DB[data.roomid].randomArr });
		})
	});
	//发送障碍物
	socket.on('obstacles', function() {
		var obstacles = getObstacles(socket.scale);
		socket.emit('obstacles', { obstacles: obstacles });
	});

	socket.on('message', function(data) {
		console.log(data)
		// var s_socket = DB[data.roomid].sockets[0].name == data.player ? DB[data.roomid].sockets[1] : DB[data.roomid].sockets[0];
		// s_socket.emit('message', { type: data.type, h: data.h });
		var s_socket = DB[data.roomid].sockets.filter(function(item){
			return item.name != data.player;
		});
		s_socket.forEach(function(socket) {
			socket.emit('message', { type: data.type, t: data.t });
		})
	});

	function getRandom(scale) {
		var randomArr = []
		for(var i=1;i<100;i++){
			randomArr.push({
				wr: Math.random(),
				sr: Math.random(),
				hr: Math.random()
			})
		}
		return randomArr;
	}
	
	//生成障碍物
	function getObstacles(scale) {
		var left = ( scale.DEFAULTS_WIN_WIDTH - scale.DEFAULTS_BOARD_WIDTH )/2 + scale.DEFAULTS_BOARD_WIDTH
			, obstacles = []
		;
		obstacles.push({
			left:left,
			right: left + 46,
			height: 320
		});
		for(var i=1;i<20;i++){
			var wr = Math.random();
			var sr = Math.random();
			var hr = Math.random();
			Arr1.push({
				left:left,
				right: left + width,
				height: height
			})
			Arr2.push({
				left:left,
				right: left + width,
				height: height
			})

			var width = Math.floor(Math.random() * scale.DEFAULTS_BOARD_WIDTH / 6 ) + 20
				, spacing = Math.floor(Math.random() * scale.DEFAULTS_BOARD_WIDTH * .2) + 80
				, height = Math.floor(Math.random() * scale.DEFAULTS_WIN_HEIGHT * .5 ) + scale.DEFAULTS_WIN_HEIGHT * .3
				;
			left += spacing;
			obstacles.push({
				left:left,
				right: left + width,
				height: height
			});
			left += width;
		}
		return obstacles;
	}
});