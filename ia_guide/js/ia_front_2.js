
// 0313 ver.	perplexity
// DOMContentLoaded 전에 실행되도록 IIFE 사용
(function() {
  // 1. 모든 include 약속 묶기
  function loadAllIncludes() {
    const includes = document.querySelectorAll("[data-include]");
    const promises = Array.from(includes).map(el => {
      const file = el.getAttribute("data-include");
      
      // 로딩 상태 표시
      el.innerHTML = '<div class="loading">로딩중...</div>';
      
      return fetch(file)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(html => {
          el.innerHTML = html;
          return el; // 성공한 엘리먼트 반환
        })
        .catch(err => {
          console.error(`Include failed: ${file}`, err);
          el.innerHTML = `<div class="error">로드 실패: ${file}</div>`;
          return null; // 실패한 경우 null 반환
        });
    });

    // 2. 모든 fetch 완료 대기
    return Promise.all(promises).then(() => {
      // 3. 모든 include 완료 후 커스텀 이벤트 디스패치
      document.dispatchEvent(new CustomEvent("all:includes:loaded", {
        detail: { loadedCount: includes.length }
      }));
      
      // 추가: MutationObserver로 DOM 변경 감지 후 이벤트 재바인딩 트리거
      triggerEventRebind();
    });
  }

  // 4. 이벤트 재바인딩 트리거 (common.js 우회)
  function triggerEventRebind() {
    // 방법1: 커스텀 이벤트로 common.js 초기화 유도 (존재하면)
    if (window.initCommonEvents) {
      window.initCommonEvents();
    }
    
    // 방법2: 주요 영역에 change 이벤트 발생시켜 이벤트 재처리 유도
    const header = document.querySelector('header');
    if (header) {
      header.dispatchEvent(new Event('DOMNodeInserted', { bubbles: true }));
    }
  }

  // 5. 즉시 실행 (DOMContentLoaded 기다리지 않음)
  if (document.readyState === 'loading') {
    // DOM 아직 파싱중 → DOMContentLoaded에서 실행
    document.addEventListener('DOMContentLoaded', loadAllIncludes, { once: true });
  } else {
    // DOM 이미 준비됨 → 즉시 실행
    loadAllIncludes();
  }
})();
