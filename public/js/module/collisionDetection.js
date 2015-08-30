/**
 * Created by zhaojing.
 * Date: 15-8-28
 * Time: 上午10:57
 */

//	碰撞检测器
function CollisionDetection (){
	this.init();
}
CollisionDetection.prototype={
	constructor:CollisionDetection,

	//		是否撞上
	isCollision:function(x1, X1, y1, Y1, x2, X2, y2, Y2) {
		if (x1 >= x2 && x1 >= X2) {
			return false;
		} else if (x1 <= x2 && X1 <= x2) {
			return false;
		} else if (y1 >= y2 && y1 >= Y2) {
			return false;
		} else if (y1 <= y2 && Y1 <= y2) {
			return false;
		}
		return true;
	},

	//		撞击检测
	detection: function() {
		var	rects = [];
		for(var entryI =0, entryL = this._entries.length; entryI < entryL; entryI ++) {
			var entry = this._entries[entryI].entry
				, entryRects = entry.getClientRects()
				;
			//				断点测试
			//				if(entry instanceof Bird) {
			//					if(entryRects[0].y < 0) {
			//						console.log(121111111);
			//					}
			//				}
			//				if(entry instanceof Obstacle) {
			//					if(entryRects.length > 0) {
			//						console.log(entryRects[0].x);
			//					}
			//					if(entryRects.length > 0 && entryRects[0].x<(DEFAULTS_WIN_WIDTH - DEFAULTS_BIRD_W)/2+24) {
			//						console.log(1233333333);
			//					}
			//				}
			for(var rectI =0, rectL = entryRects.length; rectI < rectL; rectI++) {
				var rect = entryRects[rectI];
				for(var i =0, l = rects.length; i < l ;i++) {
					var pRect = rects[i];
					if(this.isCollision(rect.x, rect.X, rect.y, rect.Y,
						pRect.x, pRect.X, pRect.y, pRect.Y)){
						this.trigger({event:"collision"});
						return;
					}
				}
			}
			rects = rects.concat(entryRects);
		}
	},
	trigger: function(evt) {
		this.binder[evt.event].forEach(function(callback) {
			callback.call(evt);
		});
	},
	//		绑定元素
	bindEntry:function(entry , zIndex){
		this._entries.push({
			entry:entry
		});
	},
	bind: function(event, callback) {
		if (!(event in this.binder)) {
			this.binder[event] = [];
		}
		this.binder[event].push(callback);
	},
	init:function(){
		this._entries = [];
		this.binder={};
	}
};