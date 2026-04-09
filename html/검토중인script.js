 

[class^=swiper-button-]

			// const isOne = swiper.slides.length <= 1;
			// document.querySelector('.my-bookmark-swiper .swiper-indicator').style.display = isOne ? 'none' : '';

			
// bookmark single 초기 소스 ===================================================================================================

		const bookmarkSwiper = new Swiper(".my-bookmark-swiper .swiper", {
			// slidesPerView: 4,
			// spaceBetween: 32,
			// grid: {
			// 	rows: 2,
			// 	fill: "row",
			// },
			watchOverflow: true,
			observer: true,
			observeParents: true,
			navigation: {
				nextEl: ".my-bookmark-swiper .swiper-button-next",
				prevEl: ".my-bookmark-swiper .swiper-button-prev",
			},
			pagination: {
				el: ".my-bookmark-swiper .swiper-pagination",
				clickable: true,
			},
			breakpoints: {
				0: {
					slidesPerView: 1,
					spaceBetween: 16,
					grid: { 
						rows: 4, 
						fill: "row" 
					}
				},
				1200: {
					slidesPerView: 4,
					spaceBetween: 32,
					grid: { 
						rows: 2, 
						fill: "row",
					}
				}
			},
			on: {
				init(swiper) {
					swpControlUI(swiper);
				},
				resize(swiper) {
					swpControlUI(swiper);
				},
				update(swiper) {
					swpControlUI(swiper);
				},
			},
		});

// ===================================================================================================
var Swiper = undefined;
    function initSwiper(){ 
        var screenWidth = $(window).width();
        if(screenWidth < 992 && secSwiper == undefined){
           secSwiper = new Swiper('.sec-swiper .swiper-container',{
                slidesPerView: 'auto',    
            });
        }else if(screenWidth > 991 && Swiper != undefined){
           Swiper.destroy();
           Swiper = undefined;
            $('.swiper-wrapper').removeAttr('style');
            $('.swiper-slide').removeAttr('style');
        }
    }
 
    initSwiper();
 
    $(window).on('resize', function(){
        initSwiper();
    });  

// ===================================================================================================


		// parallax swiper
		const parallaxSwiper = new Swiper(".parallax", {
			direction: "vertical",
			slidesPerView: 1,
			spaceBetween: 0,
			mousewheel: true,
			mousewheel: {
				sensitivity: 3, // 휠 감도 조절 (값이 클수록 빠르게 반응)
				//thresholdDelta: 30, // 휠 민감도 조절 (값이 작을수록 민감)
				//releaseOnEdges: true, // 가장자리에서 휠 이벤트 릴리스 허용
				// invert: true, // 휠 방향 반전
				// forceToAxis: true, // 수직 스크롤만 허용
				// sensitivity: 1, // 휠 감도 조절 (값이 클수록 빠르게 반응)
				// eventsTarget: ".parallax", // 휠 이벤트를 감지할 요소 지정
				// thresholdTime: 300, // 휠 이벤트 간 최소 시간 간격 (ms)
				// thresholdDelta: 20, // 휠 이벤트 간 최소 이동 거리 (px)	
			},
			pagination: {
				el: ".swiper-pagination-full",
				clickable: true,
			},
			breakpoints: {
				0: {
					 	enabled: false,
						// mousewheel: false,
					},
				1200: {
				},
			},

			on: {
				reachEnd: function () {
					// 마지막 슬라이드 → footer로 자연 스크롤 허용
					parallaxSwiper.mousewheel.disable();
					document.querySelector('.mouseWrap').classList.add('off');
				},
				fromEdge: function () {
					// 다시 위로 올라오면 swiper 다시 활성화
					// swiper.mousewheel.enable();
					document.querySelector('.mouseWrap').classList.remove('off');

				},
				slideChange: function () {
					updateActiveClass(this);

					if (this.activeIndex !== 0) {
						document.body.classList.add("is-gnb");
					} else {
						document.body.classList.remove("is-gnb");
					}
				},
			}
		});
		
		// 마우스 휠 control start
		function updateActiveClass(swiper) {
			// 전체 sec-inner active 제거
			document.querySelectorAll('.sec-inner').forEach(el => {
				el.classList.remove('active');
			});

			// 현재 active 슬라이드 내부에만 추가
			const activeSlide = swiper.slides[swiper.activeIndex];
			const target = activeSlide.querySelector('.sec-inner');

			if (target) {
				target.classList.add('active');
			}
		}
		// wheel 이벤트로 parallax 제어
		window.addEventListener('wheel', function (event) {
			if (event.deltaY < 0) {
				parallaxSwiper.mousewheel.enable();
			} else if (event.deltaY > 0 ) {
					// swiper.mousewheel.disable();

				// if (swiper.isEnd) {
				// 	swiper.mousewheel.disable();
				// }
				// // 마지막 슬라이드에서 휠 다운 시 footer로 자연 스크롤 허용
				// if (swiper.isEnd && event.deltaY > 0) {
				// 	swiper.mousewheel.disable();
				// }
				// // 마지막 슬라이드에서 휠 업 시 swiper 다시 활성화
				// if (swiper.isEnd && event.deltaY < 0) {
				// 	swiper.mousewheel.enable();
				// }
				
			}
		});
		// 마우스 휠 control end

