var BirdScoket = function(opt) {
	return (this instanceof BirdScoket) ? this.init(opt) : new BirdScoket(opt);
}

BirdScoket.prototype.init = function(opt) {
	var _this = this,
		socket = io.connect(opt.PORT);

	socket.on('connect', function() {
    	console.log('connected');
    	
	});
}