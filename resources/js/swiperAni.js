(function () {
	let observer = null;
	let currentMode = 'toggle'; // 'once' | 'toggle'

	function createObserver() {
		if (observer) return;

		observer = new IntersectionObserver((entries, obs) => {
			entries.forEach(entry => {
				const el = entry.target;

				// 🔥 1200px 미만이면 무시
				if (window.innerWidth < 1200) return;

				if (currentMode === 'once') {
					// 1회 실행 모드
					if (entry.isIntersecting) {
						el.classList.add('active');
						obs.unobserve(el);
					}
				} else {
					// toggle 모드 (들어오면 add / 나가면 remove)
					if (entry.isIntersecting) {
						el.classList.add('active');
					} else {
						el.classList.remove('active');
					}
				}
			});
		}, {
			threshold: 0.2
		});
	}

	function observe(root = document) {
		if (!observer) createObserver();

		root.querySelectorAll('.swiper').forEach(swiper => {
			if (!swiper.dataset.observed) {
				observer.observe(swiper);
				swiper.dataset.observed = 'true';
			}
		});
	}

	function destroy() {
		if (!observer) return;

		document.querySelectorAll('.swiper').forEach(swiper => {
			observer.unobserve(swiper);
			swiper.classList.remove('active');
			delete swiper.dataset.observed;
		});
	}

	function init({ mode = 'once', root = document } = {}) {
		currentMode = mode;

		// 1200px 조건
		if (window.innerWidth < 1200) {
			destroy();
			return;
		}

		observe(root);
	}

	// resize 대응
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			init({ mode: currentMode });
		}, 150);
	});

	// 전역 노출
	window.SwiperObserver = {
		init,
		destroy
	};
})();