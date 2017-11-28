var SimpleSlideShow = (function() {
	function SimpleSlideShow(obj) {
		this.obj=obj;
		this.index=0;
		this.SlideContainer = obj.children(".SimpleSlideBox-Container");
		this.Slideitem = this.SlideContainer.children(".SimpleSlideBox-item");
		this.Slidebtnitem=this.obj.find(".SimpleSlideBox-button-item");
		this.LeftBtn = obj.children(".SimpleSlideBox-LeftBtn");
		this.RightBtn = obj.children(".SimpleSlideBox-RightBtn");

		this.size = this.Slideitem.size();
		this.animateFlag = false;
		this.TimeInterval=null;
		
		this.setting={
			width:200,
			height:120,
			speed:3000,
			HoverAuto:true
		}
		
		$.extend(this.setting, this.getSetting());
		
		this.Main();
	}
	SimpleSlideShow.prototype = {
		Draw: function() {
			this.obj.height( this.setting.height);
			this.obj.width(this.setting.width);
			this.SlideContainer.height( this.setting.height);
			this.SlideContainer.width(this.size * this.setting.width);
			this.Slideitem.width(this.setting.width);
			this.Slidebtnitem.width(100/this.size+"%");
		},
		RightMove: function() {
			var _this_ = this;
			this.RightBtn.on("click", function() {
				var OldLeft = _this_.SlideContainer.position().left;
				if(OldLeft <= -(_this_.size - 1) * _this_.setting.width) {
					OldLeft = 0;
					_this_.SlideContainer[0].style.left = OldLeft + "px";
				}
				var offsetDistance=OldLeft - _this_.setting.width
				_this_.Animate(offsetDistance,"right");
			});
			
		},
		LeftMove: function() {
			var _this_ = this;
			this.LeftBtn.on("click", function() {
				var OldLeft = _this_.SlideContainer.position().left;
				if(OldLeft >= 0) {
					OldLeft = -(_this_.size - 1) * _this_.setting.width;
					_this_.SlideContainer[0].style.left = OldLeft + "px";
				}
				var offsetDistance=OldLeft + _this_.setting.width;
				_this_.Animate(offsetDistance,"left");
			});
		},
		Animate: function(offsetDistance,type) {
			var _this_=this;
			if(this.animateFlag) {
				return;
			}
			this.animateFlag = true;
			this.SlideContainer.animate({
				left: offsetDistance
			}, function() {
				_this_.animateFlag = false;
				_this_.IndexPlusOrDel(type);
			});

		},
		IndexPlusOrDel:function(type){
			var _this_=this;
			
			if(type==="right"){
				_this_.index++;
				if(_this_.index>_this_.size-2){
					_this_.index=0;
				}
			}else if(type==="left"){
				_this_.index--;
				if(_this_.index<0){
					_this_.index=_this_.size-2;
				}
			}
			
			
			this.Slidebtnitem.each(function(index){
				if(_this_.index===index){
					$(this).addClass("on").siblings("li").removeClass("on");
				}
			});
			
			
		},
		Play:function(){
			var _this_=this;
			this.RightBtn.click();
			this.TimeInterval=setTimeout(function(){
				_this_.Play();
			},_this_.setting.speed);
		},
		StopPlay:function(){
			var _this_=this;
			clearTimeout(_this_.TimeInterval);
		},
		SlideSelect:function(){
			var _this_=this;
			_this_.Play();
			this.obj.on("mouseenter",function(){
				if(_this_.setting.HoverAuto){
					_this_.StopPlay();
				}
			}).on("mouseleave",function(){
				_this_.Play();
			});
		},
		getSetting:function(){
			var setting=this.obj.attr("data-setting");
			if(setting&&setting!=''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		},
		BtnClick:function(){
			var _this_=this;
			_this_.Slidebtnitem.on("click",function(){
				$(this).addClass("on").siblings("li").removeClass("on");
				_this_.Animate(-$(this).index()*_this_.setting.width);
				_this_.index=$(this).index();
			});
		},
		Main: function() {
			this.Draw();
			this.RightMove();
			this.LeftMove();
			this.SlideSelect();
			this.BtnClick();
		}

	}
	return SimpleSlideShow;
}());

;
(function() {
	SimpleSlideShow.init = function(obj) {
		var _this_ = this;
		obj.each(function() {
			new _this_($(this));
		});
	}
	window.SimpleSlideShow = SimpleSlideShow;
})(jQuery);