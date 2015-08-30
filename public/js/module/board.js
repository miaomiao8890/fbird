/**
 * Created by zhaojing.
 * Date: 15-8-28
 * Time: 上午10:57
 */

	//	画板
function Board(){
	this.init();
}
Board.prototype={
	constructor:Board,
	// 检测鸟是否全死
	_isAllDie:function(this_board){
		var flag=true;
		for(var i=0 , l=this_board.birds.length;i<l;i++){
			if(this_board.birds[i].birdDie && flag){
				flag=true;
			}else{
				flag=false;
			}
		}
		return flag;
	},
	//		stop
	_stopAnimate:function(){
		clearTimeout(this.boardTimer);
		this.boardTimer=null;
	},
	//		画一帧 ms
	_paint:function(t){
		this._entries.forEach(function(entry){
			entry.entry.paint(t,this);
		}.bind(this));
	},
//	计算帧频
	_getFps :function(t,this_board){
		var data=this_board.fpsData;
		data.fpsArr.push(t);
		data.prevT += 1;
		data.prevT %= 10;
		if(data.fpsArr.length > 20) {
			data.fpsArr.shift();
		}
		if(data.prevT == 9) {
			var span = data.fpsArr[data.fpsArr.length-1] - data.fpsArr[0];
			if(span!=0){
				data.dom.innerText=Math.floor((data.fpsArr.length-1)/span*1000)+"";
			}
		}
	},
	//		绘图
	animate:function(){
		var this_board = this;
		if(this_board.startTime>0) return;
		this_board.startTime=Date.now();
		(function() {
			if(this_board._isAllDie(this_board)) {
				this_board._stopAnimate();
			}
			var t=Date.now()-this_board.startTime;//ms

			this_board._getFps(t,this_board);

			this_board._paint(t);

			this_board._collisionDetections.forEach(function(collisionDetection){
				collisionDetection.detection();
			});
			window.requestAnimationFrame(arguments.callee);
			//this_board.boardTimer=window.setTimeout(arguments.callee,0);
		})();
	},

	_convertTimeToPix: function(t) {
		return  DEFAULTS_H_SCALE * t /10 + t * t / 1000000 * DEFAULTS_H_SCALE ;
	},

	//		绑定碰撞检测器
	bindCollisionDetection: function(cd) {
		this._collisionDetections.push(cd);
	},
	//		获取世界时间
	getStartTime:function(){
		return this.startTime;
	},
	setBirds:function(bird){
		this.birds.push(bird);
	},
	//		绑定元素
	bindEntry:function(entry , zIndex){
		this._entries.push({
			entry:entry,
			zIndex:zIndex
		});
	},
	//		初始化
	init:function(){
		this.birds=[];
		this._entries=[];
		this.startTime=0;
		this._collisionDetections = [];
		this.boardTimer=null;
		this.fpsData ={
			dom:DEFAULTS_DOM.fps
			,prevT:0
			,fpsArr : []
		};
	}
};