// sub.js
(function (global) {
	const SubLayout = (function () {
		let header, subVisual, breadcrumb;

		let headerHeight = 0;
		let breadcrumbTop = 0;

		let isActive = false;
		let isPc = false;
		let isInit = false;

		// -----------------------------
		// 요소 세팅
		// -----------------------------
		function setElements() {
			header = document.getElementById('krds-header');
			subVisual = document.querySelector('.sub-visual-wrap');
			breadcrumb = document.getElementById('breadcrumb-home');

			if (!header || !subVisual || !breadcrumb) return false;
			return true;
		}

		// -----------------------------
		// 값 계산
		// -----------------------------
		function setLayoutValues() {
			headerHeight = header.offsetHeight;

			const rect = breadcrumb.getBoundingClientRect();
			breadcrumbTop = rect.top + window.scrollY;
		}
		// -----------------------------
		// 초기 상태
		// -----------------------------
		function applyInitial() {
			if (!isPc) return;

			if (header.classList.contains('is-bg')) {
				subVisual.style.paddingTop = headerHeight + 'px';
				isActive = true;
			}
		}

		// -----------------------------
		// 스크롤
		// -----------------------------
		function handleScroll() {
			if (!isPc) return;

			const scrollTop = window.scrollY;

			if (scrollTop + headerHeight >= breadcrumbTop) {
				if (isActive) {
					header.classList.remove('is-bg');
					subVisual.style.paddingTop = '';
					isActive = false;
				}
			} else {
				if (!isActive) {
					header.classList.add('is-bg');
					subVisual.style.paddingTop = headerHeight + 'px';
					isActive = true;
				}
			}
		}

		// -----------------------------
		// 리사이즈
		// -----------------------------
		function handleResize() {
			const prevIsPc = isPc;
			isPc = window.innerWidth >= 1280;

			setLayoutValues();

			// PC → 모바일
			if (!isPc) {
				reset();
				return;
			}

			// 모바일 → PC
			if (!prevIsPc && isPc) {
				applyInitial();
				handleScroll();
			}
		}

		// -----------------------------
		// 초기화
		// -----------------------------
		function init() {
			if (isInit) return;
			if (!setElements()) return;

			isPc = window.innerWidth >= 1280;

			setLayoutValues();
			applyInitial();
			handleScroll();

			window.addEventListener('scroll', handleScroll);
			window.addEventListener('resize', handleResize);

			isInit = true;
		}

		// -----------------------------
		// 초기화 해제 (페이지 전환 대응)
		// -----------------------------
		function destroy() {
			if (!isInit) return;

			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);

			reset();

			isInit = false;
		}

		// -----------------------------
		// 상태 초기화
		// -----------------------------
		function reset() {
			if (subVisual) subVisual.style.paddingTop = '';
			if (header) header.classList.remove('is-bg');
			isActive = false;
		}

		// -----------------------------
		// 재초기화 (동적 페이지용)
		// -----------------------------
		function reinit() {
			destroy();
			init();
		}

		return {
			init,
			destroy,
			reinit,
		};
	})();

	// 전역 등록
	global.SubLayout = SubLayout;

	// 자동 실행 (일반 페이지)
	window.addEventListener('load', function () {
		global.SubLayout.init();
	});
})(window);