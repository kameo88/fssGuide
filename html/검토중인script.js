 

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