/**
 * Created by zhaojing.
 * Date: 15-8-28
 * Time: 上午10:57
 */

//	障碍物
function Obstacle(){
	//this.init();
}
Obstacle.prototype={
	constructor:Obstacle,
	//		获取障碍物container
	_getObstacleContainer:function(){
		var canvas=document.createElement("canvas");
		canvas.id="J_obstacles";
		canvas.width = DEFAULTS_WIN_WIDTH;
		canvas.height = DEFAULTS_WIN_HEIGHT;
		DEFAULTS_WARP.appendChild(canvas);
		var ctx=canvas.getContext("2d");
		ctx.fillStyle='#ffe97d';
		this.obstacleContainer=ctx;
	},
	//		获取障碍物数据数组
	_generateObstacleArray:function(){
		var left = ( DEFAULTS_WIN_WIDTH - DEFAULTS_BOARD_WIDTH )/2 +DEFAULTS_BOARD_WIDTH;
		this.obstacles.push({
			left:left,
			right: left + 46,
			height: 320
		});
		var randomArr = this.randomArr;
		if(!randomArr || randomArr.length==0){
			console.log("--------随机数组没有过来啊啊啊啊啊！！！");
			this._selfGenerateObstacleArray();
			return;
		}
		for(var i=1, l=randomArr.length; i<l;i++){
			var random = randomArr[i];
			var width = Math.floor(random.wr * DEFAULTS_BOARD_WIDTH / 6 ) + 20
				, spacing = Math.floor(random.sr * DEFAULTS_BOARD_WIDTH * .2) + 80
				, height = Math.floor(random.hr * DEFAULTS_WIN_HEIGHT * .5 ) + DEFAULTS_WIN_HEIGHT * .3
				;
			left += spacing;
			this.obstacles.push({
				left:left,
				right: left + width,
				height: height
			});
			left += width;
		}
	},
	//		获取障碍物数据数组
	_selfGenerateObstacleArray:function(){
		var left = ( DEFAULTS_WIN_WIDTH - DEFAULTS_BOARD_WIDTH )/2 +DEFAULTS_BOARD_WIDTH;
		this.obstacles.push({
			left:left,
			right: left + 46,
			height: 320
		});
		for(var i=1, l=100; i<l;i++){
			var width = Math.floor(Math.random() * DEFAULTS_BOARD_WIDTH / 6 ) + 20
				, spacing = Math.floor(Math.random() * DEFAULTS_BOARD_WIDTH * .2) + 80
				, height = Math.floor(Math.random() * DEFAULTS_WIN_HEIGHT * .5 ) + DEFAULTS_WIN_HEIGHT * .3
				;
			left += spacing;
			this.obstacles.push({
				left:left,
				right: left + width,
				height: height
			});
			left += width;
		}
	},
	//		获取新需要新添加障碍物的数据
	_getObstacleArray:function(offset){
		var obstacles = [];
		for(var i = this.lastObstacleIndex, l = this.obstacles.length; i < l ; i++) {
			var obstacle = this.obstacles[i];
			if (obstacle.left < (offset + DEFAULTS_WIN_WIDTH) ) {
				obstacles.push(obstacle);
			} else {
				break;
			}
		}
		return obstacles;
	},
	//		删除过期障碍物
	_adjustChildren: function(offset) {
		var removed = 0;
		this.obstaclesVisible.forEach(function(obstacle){
			if(obstacle.right - offset < 0) {
				removed ++;
			}
		});
		if(removed) {
			this.obstaclesVisible = this.obstaclesVisible.slice(removed);
		}
	},
	//		画出障碍物
	_paintChildren: function(offset) {
		this.obstacleContainer.clearRect(0,0,DEFAULTS_WIN_WIDTH,DEFAULTS_WIN_HEIGHT);
		this.obstaclesVisible.forEach(function(obstacle) {
			var x=obstacle.left - offset
				,y=DEFAULTS_WIN_HEIGHT - obstacle.height
				,w=obstacle.right - obstacle.left
				,h=	obstacle.height
				;
			this.obstacleContainer.fillRect(x, y, w, h);
			this.obstacleContainer.drawImage(this.img, x, y, w, this.img.naturalHeight/this.img.naturalWidth*w);
		}.bind(this));
	},
	//		添加新障碍物
	_joinNewColleagues: function(offset) {
		var obstacleArray = this._getObstacleArray(offset);
		if (obstacleArray.length == 0) {
			return;
		}
		this.obstaclesVisible = this.obstaclesVisible.concat(obstacleArray);
		this.lastObstacleIndex += obstacleArray.length;
	},
	//		开画
	paint: function(t, world) {
		var offset = this.offset = world._convertTimeToPix(t);
		this._adjustChildren(offset);
		this._joinNewColleagues(offset);
		this._paintChildren(offset);
		this._concatGenerateObstacleArray();
	},
	_concatGenerateObstacleArray:function(){
		if(this.obstacles.length-this.lastObstacleIndex == 50){
			console.log(this.lastObstacleIndex+"_____concat new Array");
		}
	},
	getClientRects: function(){
		var rects=[];
		this.obstaclesVisible.forEach(function(obstacle){
			var left=obstacle.left-this.offset
				,right=obstacle.right-this.offset
				;
			if(left < DEFAULTS_CDE_R && right > DEFAULTS_CDE_L){
				rects.push({
					x:left,
					y:DEFAULTS_WIN_HEIGHT-obstacle.height,
					X:left + obstacle.right-obstacle.left,
					Y:DEFAULTS_WIN_HEIGHT
				});
			}
		}.bind(this));
		return rects;
	},
	getRandomArr:function(randomArr){
		this.randomArr = randomArr;
	},
	//		初始化
	init:function(){
		// this.randomArr=[];
		this.obstacles=[];
		this.lastObstacleIndex = 0;
		this.obstaclesVisible = [];
		this.offset=0;
		this.S=0;
		var img = new Image();
		img.src = "http://fightingbird-jingz-p71.bj.oupeng.com/img/window.png";
		this.img=img;
		this._generateObstacleArray();
		this._getObstacleContainer();
	}
};