/**
 * Created by zhaojing.
 * Date: 15-8-28
 * Time: 上午10:56
 */

//  小鸟相关
function Bird(opt){
	this.init(opt);
	this.observers = [];
}
Bird.prototype={
	constructor:Bird,
	//		小鸟挂了
	die:function(){
		this.birdDie=true;
		this.Dom.className+=" die";
		console.log("you die");
	},
	getClientRects:function(){
		return [{
			x:this.left,
			y:this.top,
			X:this.left+DEFAULTS_BIRD_W,
			Y:this.top+DEFAULTS_BIRD_H
		}];
	},
	//		小鸟跳
	jump:function(t){
		if(this.birdDie) {
			return;
		}
		this.revolutions.push({t:t});
	},
	//		画小鸟
	paint:function(t,world,options){
		options = options || {};
		this._prePaint(t);
		this.Dom.style.top=this.top+"px";
		if("timeOffset" in options) {
			this.Dom.style.left = (DEFAULTS_WIN_WIDTH/2 - (world._convertTimeToPix(t - options.timeOffset) - world._convertTimeToPix(t)) - DEFAULTS_BIRD_W/2) + "px";
		}else{
			DEFAULTS_DOM.dis.innerText = Math.ceil(world._convertTimeToPix(t)/8)+"米";
		}
	},
	_prePaint:function(t){
		var S=0;
		if(this.revolutions.length<=0){
			S = .5*DEFAULTS_G*Math.pow(t,2);
		}else{
			var prevT=0;
			for (var i=0,l=this.revolutions.length;i<l;i++){
				var revolution=this.revolutions[i];
				if(revolution.t>=t){
					break;
				}
				var jt=revolution.t-prevT;
				S += .5 * DEFAULTS_G * Math.pow(jt, 2) + (prevT==0 ? 0 : DEFAULTS_V * jt);
				prevT=revolution.t;
			}
			S += .5 * DEFAULTS_G * Math.pow((t-prevT), 2) + (prevT==0 ? 0 : DEFAULTS_V * (t-prevT));
		}
		return this.top = parseInt(S);
	},
	_getBirdDom:function(opt){
		var div = document.createElement('div')
			, style = opt.style ? opt.style : ""
			, id = opt.domId ? opt.domId : ("id"+Math.floor(Math.random()*1000000000))
			;
		div.style.cssText="width:"+DEFAULTS_BIRD_W+"px;height:"+DEFAULTS_BIRD_H+"px;"+ style;
		div.className="player";
		div.id=id;
		DEFAULTS_WARP.appendChild(div);
		return div;
	},
	addObserver: function(obj) {
        this.observers.push(obj);
    },
	//		初始化
	init:function(opt){
		this.Dom=this._getBirdDom(opt);
		this.revolutions=[];
		this.birdDie=false;
		var rect =this.Dom.getBoundingClientRect();
		this.left=rect.left;
		this.top=0;
	}
};