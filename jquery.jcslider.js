/**
 * A responsive slider jQuery plugin with CSS animations
 *
 * @copyright Copyright 2013-2015 Joan claret
 * @license   MIT
 * @author    Joan Claret Teruel <dpam23 at gmail dot com>
 *
 * Licensed under The MIT License (MIT).
 * Copyright (c) Joan Claret Teruel <dpam23 at gmail dot com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


;(function($, document, window, undefined) {

    'use strict';

    var jcSlider = 

	    $.fn.jcSlider = function(options) {

	        var $this = $(this);
	        $this.css({'overflow':'hidden'});

	        // hide all items excepting first
	        $this.find('.jc-animation:not(:first)').hide();

	        // get settings
	        var settings = $.extend({
	            // default settings
	            animationIn     : 'bounceInRight',
	            animationOut    : 'bounceOutLeft',
	            stopOnHover     : true,
	            loop            : true,
		    splitString	    : " "	//多个动画名之间的分割符号
	        }, options );

	        var animateOut,
	            animateIn,
	            animationItem = $this.find('.jc-animation'),
	            animationItemsLength = animationItem.length,
	            animationCurrentItem = 0,
	            jcSliderInterval = null,
		    splitString = settings.splitString;

            // 用来保存上一次的随机动画名
            var ANIMATE_IN_DATA_NAME = 'lastAnimateInClassName';
            var ANIMATE_OUT_DATA_NAME = 'lastAnimateOutClassName';


	        // Detect when animations (keyframes) end
	        function whichAnimationEvent() {
	          var t,
	              el = document.createElement('fakeelement');

	          var animations = {
	            'animation'      : 'animationend',
	            'OAnimation'     : 'oAnimationEnd',
	            'MozAnimation'   : 'animationend',
	            'WebkitAnimation': 'webkitAnimationEnd'
	          };

	          for (t in animations) {
	            if (el.style[t] !== undefined) {
	              return animations[t];
	            }
	          }
	        }
	        var animationEvent = whichAnimationEvent();

			//从空格切割字符串的数组中 获取随机元素
			function getAnimationName(animationString){

				//如果动画名字只有一个就直接返回该动画名
				if ( animationString.indexOf(splitString) == -1 ) {
					return 'animated ' + animationString;
				}

				//如果有多个动画名 就随机返回其中的一个动画名
				var animationNameArray = animationString.split(splitString);
				return 'animated ' + animationNameArray[Math.floor(Math.random() * animationNameArray.length)];
			}

	        // main function
	        var jcSliderAnimation = function() {

	            jcSliderInterval = setInterval(function() {

	                // stop animation if loop is false and we are on the last image
	                if (settings.loop === false && animationCurrentItem == (animationItemsLength -2)) {
	                    clearInterval(jcSliderInterval);
	                }

			animateOut = getAnimationName(settings.animationOut);

			var currentAnimationItem = animationItem.eq(animationCurrentItem);

			currentAnimationItem
	                .removeClass(currentAnimationItem.data(ANIMATE_IN_DATA_NAME)) // reset enter animation
	                .addClass(animateOut)   // exit animation
			.data(ANIMATE_OUT_DATA_NAME, animateOut)    // 保存随机动画名

	                // when exit animation is finished, move next item
	               .one(animationEvent,

	                    function() {

				var currentAnimationItem = animationItem.eq(animationCurrentItem);
	                        // move current item
				currentAnimationItem
	                        .removeClass(currentAnimationItem.data(ANIMATE_OUT_DATA_NAME)) // reset exit animation
	                        .hide();      // hide

	                        // select next item
	                        animationCurrentItem ++;
	                        if (animationCurrentItem == animationItemsLength) {
	                            animationCurrentItem = 0;
	                        }

				animateIn = getAnimationName(settings.animationIn);

	                        // move next item
	                        animationItem.eq(animationCurrentItem)
	                        .show() // show
	                        .addClass(animateIn)  // next item animation
				.data(ANIMATE_IN_DATA_NAME, animateIn); // 保存随机动画名

	                    });

	            }, 4000);
	        };

	        // Initialise the animation function
	        jcSliderAnimation();

	        if(settings.stopOnHover === true) {

	            // Stop the animation on hover
	            $this.hover(
	                function() {
	                    clearInterval(jcSliderInterval);
	                },
	                function(){
	                    jcSliderAnimation();
	                });
	        }
	    }
	;

})(window.jQuery || window.Zepto || window.$, document, window);
// Pending Zepto support


/*
 * Export as a CommonJS module
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = jcSlider;
}
