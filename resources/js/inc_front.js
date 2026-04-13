
// 0313 ver.	perplexity
(function() {
  // 0. include 대상과 파일 매핑
  const includeMap = [
    { selector: '.g-krds-header', file: 'inc/g_header.html' },
    // { selector: '#krds-header', file: 'inc/header.html' },
    { selector: '.g-krds-footer', file: 'inc/g_footer.html' },
    // 필요하면 여기 계속 추가
    // { selector: '#sub-nav', file: 'inc/sub_nav.html' },
  ];

  function loadAllIncludes() {
    const promises = includeMap.map(item => {
      const el = document.querySelector(item.selector);
      if (!el) return Promise.resolve(null);

      el.innerHTML = '<div class="loading">로딩중...</div>';

      return fetch(item.file)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(html => {
          el.innerHTML = html;
          return el;
        })
        .catch(err => {
          console.error(`Include failed: ${item.file}`, err);
          el.innerHTML = `<div class="error">로드 실패: ${item.file}</div>`;
          return null;
        });
    });

    return Promise.all(promises).then(() => {
      document.dispatchEvent(
        new CustomEvent('all:includes:loaded', {
          detail: { loadedCount: includeMap.length }
        })
      );
    });

    // return Promise.all(promises).then(() => {
    //   document.dispatchEvent(new CustomEvent('all:includes:loaded', {
    //     detail: { loadedCount: includeMap.length }
    //   }));
    //   triggerEventRebind();
    // });
  }

  // function triggerEventRebind() {
  //   if (window.initCommonEvents) {
  //     window.initCommonEvents();
  //   }

  //   const header = document.querySelector('#site-header');
  //   if (header) {
  //     header.dispatchEvent(new Event('DOMNodeInserted', { bubbles: true }));
  //   }
  // }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllIncludes, { once: true });
  } else {
    loadAllIncludes();
  }
})();
