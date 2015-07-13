/**
 * Created by sunchi on 2015/7/10.
 * opt = {
 *     HOST: '',                   //host
 *     roomId: '',                 //房间号
 *     nickname: '',               //玩家昵称
 *     players: [],                //参与玩家昵称
 *     gameInitFn: function() {},  //游戏初始化函数
 *     jumpFn: function() {}       //跳跃函数
 * }
 */
var BirdSocket = function(opt) {
	return (this instanceof BirdSocket) ? this.init(opt) : new BirdSocket(opt);
}

BirdSocket.prototype = {
	init: function(opt) {
		socket = io.connect(opt.HOST);
		//告诉服务器端已登陆
		socket.emit('login', { roomid: opt.roomId, username: opt.nickname });
		//房间人数
		if (opt.players.length == 2) {
			//告诉服务器游戏开始
			socket.emit('match', { roomid: opt.roomId, players: opt.players });
		}
		this.getMessage(opt);
	},
	getMessage: function(opt) {
		//匹配完成
		socket.on('match', function(message) {
			//console.log(message);
			//游戏初始化
			opt.gameInitFn(message, opt.nickname);
		});
		//接收数据
		socket.on('message', function(message) {
			//console.log(message);
			switch(message.type) {
				case 'jump':
					opt.jumpFn(message.player);
					break;
				case 'disconnect':
					opt.gameOverFn();
					socket.emit('disconnect');
					break;
				default:
					console.log('场景');
			}
		});
	},
	sendMessage: function(option) {
		//向服务器发送数据
		switch(option.type) {
			case 'jump':
				socket.emit('message', { type: option.type, roomid: option.roomid, player: option.player});
				break;
			default:
				//场景数据
		}
	}
}

