<script>
document.addEventListener('DOMContentLoaded', function () {
  const breadcrumb = document.querySelector('.breadcrumb');
  const breadcrumbTop = breadcrumb.getBoundingClientRect().top + window.scrollY;

  function onScroll() {
    if (window.scrollY >= breadcrumbTop) {
      breadcrumb.classList.add('fixed');
    } else {
      breadcrumb.classList.remove('fixed');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
</script>

<script>

const breadcrumb = document.querySelector('.breadcrumb');
const main = document.querySelector('main');
const headerHeight = 80; // 헤더 높이 (px)

let breadcrumbTop = breadcrumb.getBoundingClientRect().top + window.scrollY;

window.addEventListener('scroll', () => {
  if (window.scrollY >= breadcrumbTop - headerHeight) {
    breadcrumb.classList.add('fixed');
    main.classList.add('has-fixed');
  } else {
    breadcrumb.classList.remove('fixed');
    main.classList.remove('has-fixed');
  }
});
</script>


<header>헤더</header>
<main>
  <div class="inner">
    <nav class="breadcrumb">홈 > 카테고리 > 현재 페이지</nav>
    <div style="height: 2000px;">콘텐츠...</div>
  </div>
</main>
위 구조에서 header 는 고정이 아니고, breadcrumb 이 화면 최상단에 도착하면
class fixed 를 추가해서 고정하게 js, css 구성