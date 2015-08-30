/**
 * Created by sunchi on 2015/7/10.
 * opt = {
 *     HOST: '',                   //host
 *     nickname: '',               //玩家昵称
 * }
 */
var BirdSocket = function(opt) {
	this.dtList = [];
	this.dt = 0;
	this.roomid = "";
	this.gameStartFn = null;
	this.getMessageFn = null;
	this.setObstacleFn = null;
	this.setRandomFn = null;
	return (this instanceof BirdSocket) ? this.init(opt) : new BirdSocket(opt);
};
BirdSocket.prototype = {
	constructor: BirdSocket,
	init: function(opt) {
		socket = io.connect(opt.HOST);
		//告诉服务器端已登陆
		socket.emit('login', { 
			username: opt.nickname,
			scale: {
				DEFAULTS_WIN_WIDTH: DEFAULTS_WIN_WIDTH,
				DEFAULTS_BOARD_WIDTH: DEFAULTS_BOARD_WIDTH,
				DEFAULTS_WIN_HEIGHT: DEFAULTS_WIN_HEIGHT
			}
		});
		
		this.getMessage(opt);
		//this.getDtTime();
	},
	//计算客户端与服务器的延迟时间
	getDtTime: function() {
		var self = this;
		for (var i = 0; i < 10; i++) {
			var t1 = new Date().getTime(),t2,t3,dt;
			socket.emit('delaytime', { index: i, t1: new Date().getTime() });
			socket.on('delaytime_' + i, function(message) {
				var t3 = new Date().getTime();
				dt = message.t2-(message.t1+t3)/2;
				self.dtList.push(dt);
				//console.log(self.dtList);
				if(self.dtList.length == 10) {
					var sum = 0;

					self.dtList.forEach(function(dt) {
						sum += dt;
					})
					self.dt = sum/self.dtList.length;
				}
			});
		};
	},
	getMessage: function(opt) {
		var self=this;
		socket.on('login', function(message) {
			self.roomid = message.roomid;
			document.getElementById("roomId").innerText = self.roomid;
			if (message.players.length == 2) {
				//告诉服务器游戏开始
				socket.emit('match', { roomid: self.roomid, players: message.players.length });
			}
		});
		//匹配完成
		socket.on('match', function(message) {
			//console.log(message);
			//游戏初始化
			document.querySelector(".title").style.display="none";
			var i = 3,timeDom = document.getElementById("J_countdown");
			var countdown = setInterval(function(){
				if(i < 0){
					clearInterval(countdown);
					countdown = null;
					timeDom.style.display = "none";
					self.gameStartFn(message);
					return;
				}
				timeDom.innerText = i--;
			},1000);
		});
		//接收数据
		socket.on('message', function(message) {
			console.log(message);
			self.getMessageFn(message);
		});
		//
		// socket.on('obstacles',function(message) {
		// 	self.setObstacleFn(message);
		// })
	},
	sendMessage: function(option) {
		var self = this;
		//向服务器发送数据
		switch(option.type) {
			case 'jump':
				console.log("send jump");
				console.log(nickname);
				socket.emit('message', { type: option.type, roomid: self.roomid, t: option.t, player:nickname});
				break;
			case 'dead':
				//socket.emit('message', { type: option.type, roomid: self.roomid, h: option.h, player:nickname});
				break;
			default:
				//场景数据
		}
	},
	// getObstacles: function() {
	// 	socket.emit('obstacles');
	// },
	_event: {},    
    // 添加
    bind: function(type, fn) {
        if(!this._event[type]){
	        this._event[type] = [];
	    }
	    this._event[type].push(fn);
    },
    // 触发
    trigger: function(type, data) {
        var i = 0;
	    if(!this._event[type]){
	        return;
	    }
	    for(len = this._event[type].length;i<len;i++){
	        this._event[type][i].call(this, data);
	    }
	    return this;
    }
};
var birdsocket = new BirdSocket({
	HOST: HOST,
	nickname: nickname,
});


