(function($){
    function SliderIMG(iam, speed, playCheck, pagingCheck, dotCheck, verticalMove, swipe, targetHover, sliderStart){
    this.current = null;
    this.counter = null;
    this.$iam = null;
    this.$target = null;
    this.targetLeng = null;
    this.$menu = null;
    this.$swipeInner = null;
    this.autoPlay = null;
    this.$total = null;
    this.$btnArrow = null;
    this.$btnDot = null;
    this.$playStop = null;
    this.$paging = null;
    this.speed = speed;
    this.playCheck = playCheck;
    this.pagingCheck = pagingCheck;
    this.dotCheck = dotCheck;
    this.verticalMove = verticalMove;
    this.swipe = swipe;
    this.targetHover = targetHover;
    this.sliderStart = sliderStart;
    this.init(iam);
    this.currentSlide();
    this.makeSwipe();
    this.makeBtn();
    this.initEvent();
}    
    SliderIMG.prototype.init = function(iam){
         this.current = 0;
        if(this.sliderStart === 0){
            this.counter = this.sliderStart;
        }else{
            this.counter = this.sliderStart-1;
            console.log(this.counter);
        }
         this.$iam = $(iam);
         this.$target =this.$iam.find('li');
         this.targetLeng = this.$target.length;
         this.$menu = this.$iam.find('.menu');
         this.$total = this.$iam.find('.total');
         this.$btnArrow = this.$iam.find('.btn_arrow');
         this.$btnDot = this.$iam.find('.button_dot');
         this.$playStop = this.$iam.find('.play_stop');
         this.$paging = this.$iam.find('.paging');
    };      
    SliderIMG.prototype.initEvent = function(){
        if(this.targetLeng > 1){
            var objThis = this;      
            //$right
            this.$right.on('click', function () {
                objThis.stop();
                objThis.rightMove();
            }); 
            //$left
            this.$left.on('click', function () {
                objThis.stop();
                objThis.leftMove();
            }); 
            //$top
            this.$top.on('click', function () {
                objThis.stop();
                objThis.topMove();
            }); 
            //$bottom
            this.$bottom.on('click', function () {
                objThis.stop();
                objThis.bottomMove();
            }); 
            
            //$btnDot
            this.$buttonDot.on('click', function () {
                objThis.stop();
                var index = $(this).index();
                objThis.btnClick(index);
            }); 
            //$playBtn
            // play_stop : on - play중
            this.$playStop.on('click', function () {
               $(this).toggleClass('on');
                objThis.play();
            });
            //swipe
            this.$swipeInner.swipe({
                fingers: 'all',
                swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if(objThis.verticalMove === false){
                        objThis.leftMove();
                    }
                },
                swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if(objThis.verticalMove === false){
                        objThis.rightMove();
                    }
                },
                swipeUp: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if(objThis.verticalMove === true){
                        objThis.topMove();
                    } 
                },
                swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if(objThis.verticalMove  === true){
                        objThis.bottomMove();
                    }
                },
                allowPageScroll: 'auto'
            });     
            //setting
            this.slideHover();
        }
    };        
    //sliderStart
    SliderIMG.prototype.currentSlide = function(){
        if(this.verticalMove === true){
            this.$target.eq(this.counter).css({
                'top':'0'
            });
        }else{
            this.$target.eq(this.counter).css({
                'left':'0'
            });
        }
    };     
    SliderIMG.prototype.moveMoveLeft = function(counter,current,moveCounter,moveCurrent){
            this.$target.eq(counter).css({
                'left':moveCounter
            }).animate({
                'left':'0'
            },this.speed);
            this.$target.eq(current).animate({
                'left':moveCurrent
            },this.speed);
            this.btnOn();
		console.log(counter+'counter');
            this.pagingCurrent(counter); 
    };    
    SliderIMG.prototype.moveMoveTop = function(counter,current,moveCounter,moveCurrent){
            this.$target.eq(counter).css({
                'top':moveCounter
            }).animate({
                'top':'0'
            },this.speed);
            this.$target.eq(current).animate({
                'top':moveCurrent
            },this.speed);
            this.btnOn();
            this.pagingCurrent(counter); 
    };  
    //rightMove
    SliderIMG.prototype.rightMove = function(){
        if(!this.$target.is(':animated')){
            this.counter++;
            this.current = this.counter-1; 
            console.log('current - '+this.counter);
            if(this.counter == this.targetLeng){
                this.counter = 0;
            }
            this.moveMoveLeft(this.counter,this.current,'100%','-100%');
            this.$right.addClass('on');
        }
    };         
    //leftMove
    SliderIMG.prototype.leftMove = function(){
        if(!this.$target.is(':animated')){
            this.counter--;
            this.current = this.counter+1; 
            if(this.counter<0){
                this.counter = this.targetLeng-1;
            }                    
            this.moveMoveLeft(this.counter,this.current,'-100%','100%');
            this.$left.addClass('on');
        }    
    };            
    //topMove
    SliderIMG.prototype.topMove = function(){
        if(!this.$target.is(':animated')){
            this.counter--;
            this.current = this.counter+1; 
            if(this.counter<0){
                this.counter = this.targetLeng-1;
            }  
            this.moveMoveTop(this.counter,this.current,'-100%','100%');
            this.$top.addClass('on');
        }    
    };        
    //bottomMove
    SliderIMG.prototype.bottomMove = function(){
        if(!this.$target.is(':animated')){
            this.counter++;
            this.current = this.counter-1;    
            if(this.counter == this.targetLeng){
                this.counter = 0;
            }                      
            this.moveMoveTop(this.counter,this.current,'100%','-100%');
            this.$bottom.addClass('on');
            this.$playStop.removeClass('on');
        }    
    };          
    //btnOn : addClass('on')
    SliderIMG.prototype.btnOn = function(){
        this.$buttonDot.removeClass('on');
        this.$buttonDot.eq(this.counter).addClass('on');
        this.$left.removeClass('on');
        this.$right.removeClass('on');
        this.$top.removeClass('on');
        this.$bottom.removeClass('on');
    };       
    //btnClick
    SliderIMG.prototype.btnClick = function(index){
        if(!this.$target.is(':animated')){
            this.current = this.counter; 
            this.counter = index; 
			console.log(index+'index');
            if(this.current < this.counter){
                if(this.verticalMove === true){
                    this.moveMoveTop(this.counter,this.current,'-100%','100%');
                }else{
                    this.moveMoveLeft(this.counter,this.current,'-100%','100%');
                }       
                this.btnOn();
            }else{
                if(this.verticalMove === true){
                    this.moveMoveTop(this.counter,this.current,'100%','-100%');
                }else{
                    this.moveMoveLeft(this.counter,this.current,'100%','-100%');
                }     
                this.btnOn();    
            }
            this.pagingCurrent(index); 
        }  
    };      
    //play    
    SliderIMG.prototype.play = function(){
        var objThis = this;
        if(this.$playStop.hasClass('on')){
            this.autoPlay = setInterval(function(){
                if(objThis.verticalMove === true){
                    objThis.topMove();
                }else{
                    objThis.rightMove();
                }        
                this.playCheck = true;
            });
        }else{
            this.stop();
        }
    };   
    //stop  
    SliderIMG.prototype.stop = function(){
        clearInterval(this.autoPlay); 
        this.playCheck = false;
        this.$playStop.removeClass('on');
        this.$left.removeClass('on');
        this.$right.removeClass('on');
        this.$top.removeClass('on');
        this.$bottom.removeClass('on');
    };     
    //targetHover
    SliderIMG.prototype.slideHover = function(){
        var objThis = this;   
        if(this.targetHover === true){
            if(!this.playCheck){
                //이미 정지 상태일때
               this.$target.off('mouseenter mouseleave');
            }else{ 
                //실행 중 일때
                this.$target.on('mouseenter',function(){
                    objThis.stop();
                    this.playCheck = false;
                });   
                this.$target.on('mouseleave',function(){
                    objThis.$playStop.addClass('on');
                    objThis.play();
                    this.playCheck = true;
                });
             }
        }else{}
    };   
    //makeSwipe
    SliderIMG.prototype.makeSwipe = function(){
        if(this.targetLeng > 1){
            if(this.swipe === true){
                this.$menu.addClass('swipe_inner');
            }else{}
         this.$swipeInner = this.$iam.find('.swipe_inner');
        }
    };  
    //makeBtn    
    SliderIMG.prototype.makeBtn = function(){
        var btn = '';
        if(this.targetLeng > 1){
            //btnArrow 
            btn += '<div class="btn_arrow btn_wrap">';
            if(this.verticalMove === true){
                btn += '<button type="button" class="top">top</button>';
                btn += '<button type="button" class="bottom">bottom</button>'; 
                this.$target.addClass('top');
            }else{
                btn += '<button type="button" class="left">left</button>';
                btn += '<button type="button" class="right">right</button>';
                this.$target.addClass('left');
            }          
            btn += '</div>';
            //buttonNum  
            if(this.dotCheck === true){
                btn += '<div class="button_dot btn_wrap">';
                for(var i = 0; i < this.targetLeng; i++){
                    btn += '<button type="button" class="dot">'+(i+1)+'</button>';
                }
                btn += '</div>';
            }else{}
            //paging
            if(this.pagingCheck === true){
                btn += '<div class="paging">';
                btn += '<ul class="clearfix"><li class="current">';
				if(this.sliderStart === 0){
					this.sliderStart = 1;
                	btn += this.sliderStart;
				}else{
                	btn += this.sliderStart;
				}
                btn += '</li>';
                btn += '<li>/</li><li class="total">'+this.targetLeng+'</li></ul>';      
                btn += '</div>';
            }else{}
            //$playBtn
            // play_stop : on - play중
            if(this.playCheck === true){
                btn += '<button type="button" class="play_stop on"></button>';
            }else{}
            btn += '</div>';
            this.$iam.prepend(btn);
            this.$paging = this.$iam.find('.paging');
            this.$btnArrow = this.$iam.find('.btn_arrow');
            this.$btnDot = this.$iam.find('.button_dot');
            this.$playStop = this.$iam.find('.play_stop');
            this.$current = this.$paging.find('.current');
            
            this.$right = this.$btnArrow.find('.right');
            this.$left = this.$btnArrow.find('.left');
            this.$top = this.$btnArrow.find('.top');
            this.$bottom = this.$btnArrow.find('.bottom');
            this.$buttonDot = this.$btnDot.find('button');
            
            this.$buttonDot.eq(this.counter).addClass('on');
        }else{
            this.$iam.append('');
        }
    };   
    SliderIMG.prototype.pagingCurrent = function(index){
        this.counter = index; 
        this.$current.empty().html((this.counter));
    };       
//(function($){
//    $.fn.red=function(){
//        this.each(function(index){
//            $(this).css({'background':'red'});
//        })
//        return this;
//    }
//    $.fn.gray=function(){
//        this.each(function(index){
//            $(this).css({'background':'gray'});
//        })
//        return this;
//    }
//    $.fn.removeLi=function(){
//        this.each(function(index){
//            var $target = $(this);
//            $target.delay(index*1000).animate({
//                height:0
//            },500,function(){
//                $target.remove();
//            });
//        })
//        return this;
//    }
    SliderIMG.prototype.asd = function($target){
        if(this.$target){
           this.$target.removeClass('on')
        }
        this.$target = $target;
        this.$target.addClass('on');
    };    
    $.fn.slider=function(){
        this.each(function(index){
            var slider = new SliderIMG(this);
//            $(this).data('slider', slider);
        })
        return this;
    }
    $.defaultOptions = {
        speed : 500,
        playCheck : false,
        pagingCheck : true,
        dotCheck : true,
        // verticalMove true면 상하 슬라이드
        verticalMove : false,
        swipe : false,
        targetHover : false,
        // 시작하고 싶은 슬라이드 순서
        sliderStart : 0
    }
    $.fn.SliderIMG = function(options){
//        speed = speed || $.defaultOptions.speed;
//        easing = easing || $.defaultOptions.easing;
//        autoPlay = autoPlay || $.defaultOptions.autoPlay;
        var options = $.extend(null, $.defaultOptions, options);
        this.each(function(index){
            var slideOption = new SliderIMG($(this), options.speed, options.playCheck, options.pagingCheck, options.dotCheck, options.verticalMove, options.swipe, options.targetHover, options.sliderStart);
			if(options.playCheck == true){ 
				slideOption.play();
            }
            //return 값은 target에 저장
        })            
        return this;
    }
//    $.fn.slider123456=function(selectIndex){
//        this.each(function(index){
//            var slider = $(this).data('slider');
//            if(slider){
//               slider.asd(slider.$target.eq(selectIndex));
//            }
//        })
//    this.playCheck
//        return this;
//    }
})(jQuery)


$( document ).ready(function() {
//    var slider1 = new SliderIMG('.accordion1');
//    var slider2 = new SliderIMG('.accordion2');
//    var slider3 = new SliderIMG('.accordion3');
//    var slider4 = new SliderIMG('.accordion4');
//    var slider5 = new SliderIMG('.accordion5');
//    var asd = $('.play_stop button').red();
//    asd.on();
////    $('.play_stop button').red();
//    $('.btn_arrow button').gray();
//    $('.test li').removeLi();
//    $('.slider').slider().slider123456(2);
    
    $('.accordion5').SliderIMG();
    $('.accordion2').SliderIMG();
    $('.accordion3').SliderIMG();
    $('.accordion4').SliderIMG({
        sliderStart :2});
    $('.accordion1').SliderIMG({
        speed : 1000,
        playCheck : true,
        pagingCheck : false,
        dotCheck : false,
        verticalMove : true,
        swipe : false,
        targetHover : true,
        sliderStart : 3
    });
//    $('.accordion2').SliderIMG({
//        speed : 2000,
//        playCheck : true,
//        pagingCheck : true,
//        dotCheck : true,
//        verticalMove : false,
//        swipe : true,
//        sliderStart : 2
//    });
//    $('.accordion3').SliderIMG({
//        speed : 10000,
//        playCheck : true,
//        pagingCheck : true,
//        dotCheck : true,
//        verticalMove : true,
//        swipe : true,
//        targetHover : true,
//        sliderStart : 3
//    });
//    $('.accordion4').SliderIMG({
//        sliderStart : 2
//    });
//    $('.accordion5').SliderIMG({
//        speed : 500,
//        playCheck : false,
//        pagingCheck : false,
//        dotCheck : true,
//        verticalMove : true,
//        swipe : true,
//        targetHover : false,
//        sliderStart : 4
//    });
});