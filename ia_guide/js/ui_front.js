"use strict";

// s : function
(function () {
	const goTopBtn = () => {
		const contentArea = document.querySelector(".g-wrap #container");
		if (contentArea) {
			const goTopTag = document.createElement("button");
			goTopTag.className = "page-top-button krds-tooltip";
			goTopTag.type = "button";
			goTopTag.innerHTML = `<i class="svg-icon ico-go-top"></i><span class="sr-only">위로</span>`;
			// goTopTag.setAttribute("data-tooltip", "페이지 상단으로 이동");
			contentArea.append(goTopTag);

			// const home = contentArea.querySelector(".breadcrumb .home a");
			const toggleVisibility = () => {
				goTopTag.classList.toggle("active", window.scrollY > window.innerHeight * .5);
			};
			const scrollToTop = () => {
				window.scrollTo({ top: 0, behavior: "smooth" });
				// home?.focus();
			};
			window.addEventListener("scroll", toggleVisibility);
			goTopTag.addEventListener("click", scrollToTop);
		}
	};

	// run
	goTopBtn();

	// const btnTop = document.querySelector(".page-top");

	// window.addEventListener('scroll', () => {
	// 	if (window.scrollY > 100) {
	// 			btnTop.classList.add('active');
	// 	} else {
	// 			btnTop.classList.remove('active');
	// 	}
	// });
	// btnTop.addEventListener('click', () => {
	// 	window.scrollTo({
	// 			top: 0,
	// 			behavior: 'smooth'
	// 	});
	// });

})();