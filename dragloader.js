(function(window, undefined){
	$(function(){
		var Dragloader = function(options) {
			this.options = options;
		};

		Dragloader.prototype = {
			constructor: Dragloader,
			
			init: function() {
				this.options.container.on('touchstart', this.startDrag()).
				on('touchmove', this.moveDrag()).
				on('touchend', this.endDrag());
				// status: 0->空闲(结束)   1->开始   2->正在滑动
				this.status = 0;
			},
			
			startDrag: function() {
				var self = this;

				return function(event) {
					if (self.status === 0) {
						self.options.loader.removeClass('drag-loader-spinning').removeClass('drag-loader-off-canvas');
						self.touchPosY = event.originalEvent.changedTouches[0].pageY;
						self.loaderPosY = self.options.loader.css('top');
						self.status = 1;
					}
				};
			},
			
			moveDrag: function() {
				var self = this;

				return function(event) {
					var posY = event.originalEvent.changedTouches[0].pageY,
						intervalY = posY - self.touchPosY,
						degree = parseInt(self.options.loader.css('-webkit-transform'));
					
					if (self.status === 1 || self.status === 2) {
						self.status = 2;
						console.log(intervalY);
						if (intervalY > 0) {
							var oldTop = parseInt(self.options.loader.css('top'));
							self.options.loader.css({
								'top': oldTop + intervalY,
								'-webkit-transform': 'rotateZ(' + (degree + 10) + 'deg)'
							});
							self.touchPosY = event.originalEvent.changedTouches[0].pageY;
						}
					}
				};
			},
			
			endDrag: function() {
				var self = this;

				return function(event) {
					if (self.status === 2) {
						self.status = 0;
						self.options.loader.removeAttr("style").addClass('drag-loader-spinning');
						self.options.callback(function(){
							self.options.loader.addClass('drag-loader-off-canvas');
						});
					}
				};
			}
		};


		var ld = new Dragloader({
			loader: $('.loader'),
			container: $('body'),
			callback: function(fn) { 
				setTimeout(
					function(){
						fn();
					},
				3000);
			}
		});
		ld.init();
	});
}(window));
