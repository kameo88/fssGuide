async function includeHTML() {
  const targets = document.querySelectorAll('[data-include-path]');

  const jobs = [...targets].map(async el => {
    const path = el.dataset.includePath;
    if (!path) return;

    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(path);

      el.innerHTML = await res.text();
    } catch (e) {
      console.error('include error:', e);
    }
  });

  await Promise.all(jobs);
}

// ui-script.js 에서 DOMContentLoaded 사용 시 재실행
function rerunDOMContentLoaded() {
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

document.addEventListener('DOMContentLoaded', async () => {
  await includeHTML();

  /**
   * ui-script.js 가
   * document.addEventListener('DOMContentLoaded', ...)
   * 로 이벤트를 걸고 있다면
   * 강제로 한 번 더 트리거
   */
  rerunDOMContentLoaded();
});