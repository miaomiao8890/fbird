/**
 * Created by zhaojing.
 * Date: 15-8-28
 * Time: 上午10:57
 */
/**
 *
 * @param offset
 * @constructor
 */
//	时光机 延时
function TimeMachine(offset){
	this.offset=offset;
	this._entries=[];
	this.init();
}
TimeMachine.prototype={
	constructor:TimeMachine,
	//		绑定元素
	bindEntry:function(entry , zIndex){
		this._entries.push({
			entry:entry,
			zIndex:zIndex
		});
	},
	paint:function(t,world){
		t = Math.max(0,t+this.offset);
		this._entries.forEach(function(entry){
			entry.entry.paint(t,world,{
				timeOffset:this.offset
			});
		}.bind(this));
	},
	//		初始化
	init:function(){

	}
};