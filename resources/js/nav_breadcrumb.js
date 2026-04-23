/**
 * nav.js — 브레드크럼 연결 드롭다운 네비게이션
 *
 * 사용법:
 *   <nav id="breadcrumb" aria-label="현재 경로"></nav>
 *   <script src="nav.js"></script>
 *   <script>
 *     const bc = new BreadcrumbNav('#breadcrumb', MENU_DATA, initialState);
 *   </script>
 *
 * MENU_DATA 구조:
 *   {
 *     dep1: [ { id, label, ext? }, ... ],
 *     dep2: { [dep1Id]: [ { id, label, ext? }, ... ] },
 *     dep3: { [dep2Id]: [ { id, label, ext? }, ... ] },   // 없으면 생략
 *     dep4: { [dep3Id]: [ { id, label, ext? }, ... ] }    // 없으면 생략
 *   }
 *
 * initialState:
 *   { dep1, dep2, dep3, dep4 }  — 각 뎁스의 선택된 id (없으면 null)
 */

class BreadcrumbNav {
  /**
   * @param {string|Element} target  - 마운트할 nav 요소 또는 CSS 선택자
   * @param {object}         data    - 메뉴 데이터
   * @param {object}         [state] - 초기 선택 상태 (생략 시 첫 항목 자동 선택)
   * @param {function}       [onSelect] - 항목 선택 시 콜백 (depthKey, item) => void
   */
  constructor(target, data, state, onSelect) {
    this._root = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!this._root) throw new Error(`BreadcrumbNav: target "${target}" not found`);

    this._data     = data;
    this._onSelect = typeof onSelect === 'function' ? onSelect : null;
    this._state    = this._resolveInitialState(state);

    /* ul 래퍼 생성 */
    this._ul = document.createElement('ul');
    this._ul.className = 'breadcrumb-nav';
    this._root.appendChild(this._ul);

    /* 전역 닫기 이벤트 */
    this._outsideHandler = (e) => {
      if (!this._root.contains(e.target)) this._closeAll();
    };
    document.addEventListener('click', this._outsideHandler);

    /* ESC 키로 드롭다운 닫기 */
    this._keyHandler = (e) => {
      if (e.key === 'Escape') {
        this._closeAll();
        /* 포커스를 현재 열려 있던 트리거로 복원 */
        const focused = this._root.querySelector('.lnk[aria-expanded="true"]');
        if (focused) focused.focus();
      }
    };
    document.addEventListener('keydown', this._keyHandler);

    this._render();
  }

  /* ─── 공개 API ──────────────────────────────────────────── */

  /** 현재 상태를 반환 */
  getState() {
    return { ...this._state };
  }

  /**
   * 외부에서 상태를 직접 지정해 재렌더링
   * @param {object} state
   */
  setState(state) {
    this._state = this._resolveInitialState(state);
    this._render();
  }

  /** 이벤트 리스너 정리 (컴포넌트 제거 시 호출) */
  destroy() {
    document.removeEventListener('click', this._outsideHandler);
    document.removeEventListener('keydown', this._keyHandler);
    this._ul.remove();
  }

  /* ─── 내부 메서드 ───────────────────────────────────────── */

  _resolveInitialState(state = {}) {
    const s = {};
    const d1List = this._data.dep1 || [];
    s.dep1 = state.dep1 || d1List[0]?.id || null;

    const d2List = s.dep1 ? (this._data.dep2?.[s.dep1] || []) : [];
    s.dep2 = state.dep2 || d2List[0]?.id || null;

    const d3List = s.dep2 ? (this._data.dep3?.[s.dep2] || []) : [];
    s.dep3 = state.dep3 || d3List[0]?.id || null;

    const d4List = s.dep3 ? (this._data.dep4?.[s.dep3] || []) : [];
    s.dep4 = state.dep4 || d4List[0]?.id || null;

    return s;
  }

  _render() {
    this._ul.innerHTML = '';

    const s = this._state;
    const d1List = this._data.dep1 || [];
    const d2List = s.dep1 ? (this._data.dep2?.[s.dep1] || []) : [];
    const d3List = s.dep2 ? (this._data.dep3?.[s.dep2] || []) : [];
    const d4List = s.dep3 ? (this._data.dep4?.[s.dep3] || []) : [];

    const d1Sel = d1List.find(i => i.id === s.dep1);
    const d2Sel = d2List.find(i => i.id === s.dep2);
    const d3Sel = d3List.find(i => i.id === s.dep3);
    const d4Sel = d4List.find(i => i.id === s.dep4);

    /* 홈 */
    this._ul.appendChild(this._makeHomeLi());

    /* dep1: 항상 표시, 항상 드롭다운 있음 */
    this._ul.appendChild(
      this._makeLi({
        label:      d1Sel?.label || '',
        items:      d1List,
        selectedId: s.dep1,
        isCurrent:  false,
        onSelect:   item => {
          s.dep1 = item.id;
          const nd2 = this._data.dep2?.[item.id] || [];
          s.dep2 = nd2[0]?.id || null;
          const nd3 = s.dep2 ? (this._data.dep3?.[s.dep2] || []) : [];
          s.dep3 = nd3[0]?.id || null;
          const nd4 = s.dep3 ? (this._data.dep4?.[s.dep3] || []) : [];
          s.dep4 = nd4[0]?.id || null;
          this._fireSelect('dep1', item);
          this._render();
        }
      })
    );

    /* dep2: dep2 목록이 있을 때만 표시 */
    if (d2List.length) {
      this._ul.appendChild(
        this._makeLi({
          label:      d2Sel?.label || '',
          items:      d2List,
          selectedId: s.dep2,
          isCurrent:  d3List.length === 0 && d4List.length === 0,
          onSelect:   item => {
            s.dep2 = item.id;
            const nd3 = this._data.dep3?.[item.id] || [];
            s.dep3 = nd3[0]?.id || null;
            const nd4 = s.dep3 ? (this._data.dep4?.[s.dep3] || []) : [];
            s.dep4 = nd4[0]?.id || null;
            this._fireSelect('dep2', item);
            this._render();
          }
        })
      );
    }

    /* dep3: dep3 목록이 있을 때만 표시 */
    if (d3List.length) {
      this._ul.appendChild(
        this._makeLi({
          label:      d3Sel?.label || '',
          items:      d3List,
          selectedId: s.dep3,
          isCurrent:  d4List.length === 0,
          onSelect:   item => {
            s.dep3 = item.id;
            const nd4 = this._data.dep4?.[item.id] || [];
            s.dep4 = nd4[0]?.id || null;
            this._fireSelect('dep3', item);
            this._render();
          }
        })
      );
    }

    /* dep4: dep4 목록이 있을 때만 표시, isCurrent = true 이지만 드롭다운도 유지 */
    if (d4List.length) {
      this._ul.appendChild(
        this._makeLi({
          label:      d4Sel?.label || '',
          items:      d4List,
          selectedId: s.dep4,
          isCurrent:  true,          /* 마지막 뎁스이므로 current 스타일 적용 */
          forceDropdown: true,       /* current여도 드롭다운 열 수 있게 */
          onSelect:   item => {
            s.dep4 = item.id;
            this._fireSelect('dep4', item);
            this._render();
          }
        })
      );
    }

    /* aria-label 을 현재 경로 텍스트로 동기화 */
    const crumbs = [d1Sel, d2Sel, d3Sel, d4Sel]
      .filter(Boolean)
      .map(i => i.label)
      .join(' > ');
    this._root.setAttribute('aria-label', `현재 경로: ${crumbs}`);
  }

  _makeHomeLi() {
    const li  = document.createElement('li');
    const lnk = document.createElement('a');
    lnk.href      = 'javascript:void(0);';
    lnk.className = 'link home';
    lnk.setAttribute('aria-label', '홈으로 이동');
    lnk.innerHTML =
       `<span class="sr-only">홈</span>`;
    li.appendChild(lnk);
    return li;
  }

  /**
   * @param {object} opts
   * @param {string}   opts.label
   * @param {Array}    opts.items
   * @param {string}   opts.selectedId
   * @param {boolean}  opts.isCurrent
   * @param {boolean}  [opts.forceDropdown=false]
   * @param {function} opts.onSelect
   */
  _makeLi({ label, items, selectedId, isCurrent, forceDropdown = false, onSelect }) {
    const li  = document.createElement('li');
    const lnk = document.createElement('a');
    lnk.href      = 'javascript:void(0);';
    lnk.className = 'link' + (isCurrent ? ' current' : '');
    lnk.setAttribute('role', 'button');

    const hasDropdown = items && items.length > 0 && (!isCurrent || forceDropdown);

    /* 현재 페이지 항목임을 스크린리더에게 알림 */
    if (isCurrent) {
      lnk.setAttribute('aria-current', 'page');
    }

    if (hasDropdown) {
      lnk.setAttribute('aria-haspopup', 'listbox');
      lnk.setAttribute('aria-expanded', 'false');
    }

    lnk.innerHTML =
      `<span class="lnk-text">${label}</span>`

    li.appendChild(lnk);

    if (hasDropdown) {
      const depth2 = this._makeDropdown(items, selectedId, onSelect, lnk, li);
      li.appendChild(depth2);

      /* 트리거 클릭 */
      lnk.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = li.classList.contains('open');
        this._closeAll();
        if (!isOpen) this._openLi(li, lnk, depth2);
      });

      /* 키보드: Enter / Space 로 드롭다운 열기 */
      lnk.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = li.classList.contains('open');
          this._closeAll();
          if (!isOpen) {
            this._openLi(li, lnk, depth2);
            /* 드롭다운의 첫 항목으로 포커스 이동 */
            depth2.querySelector('a')?.focus();
          }
        }
        /* Tab 으로 닫기 */
        if (e.key === 'Tab') {
          this._closeAll();
        }
      });
    }

    return li;
  }

  _makeDropdown(items, selectedId, onSelect, triggerLnk, parentLi) {
    const depth2   = document.createElement('div');
    depth2.className = 'depth2';
    depth2.setAttribute('role', 'listbox');
    depth2.setAttribute('aria-label', '메뉴 선택');

    const ul = document.createElement('ul');
    ul.setAttribute('role', 'presentation');

    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', item.id === selectedId ? 'true' : 'false');
      if (item.id === selectedId) li.classList.add('on');

      const a = document.createElement('a');
      a.href      = 'javascript:void(0);';
    	a.className = 'link';
			a.tabIndex  = -1; /* 드롭다운 닫힌 상태에서는 탭 순서 제외 */
      a.setAttribute('data-idx', idx);
      a.innerHTML =
        item.label +
        (item.ext
          ? `<i class="svg-icon ico-go" aria-label="외부 링크" role="img"></i>`
          : '');

      /* 클릭 선택 */
      a.addEventListener('click', e => {
        e.stopPropagation();
        this._closeAll();
        onSelect(item);
      });

      /* 드롭다운 내 키보드 탐색 */
      a.addEventListener('keydown', e => {
        const anchors = [...depth2.querySelectorAll('a')];
        const cur     = anchors.indexOf(e.target);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          anchors[(cur + 1) % anchors.length]?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          anchors[(cur - 1 + anchors.length) % anchors.length]?.focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          this._closeAll();
          onSelect(item);
        } else if (e.key === 'Tab') {
          this._closeAll();
        } else if (e.key === 'Escape') {
          this._closeAll();
          triggerLnk.focus();
        }
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    depth2.appendChild(ul);
    return depth2;
  }

  _openLi(li, lnk, depth2) {
    li.classList.add('open');
    lnk.setAttribute('aria-expanded', 'true');
    /* 드롭다운 내 앵커에 탭 접근 허용 */
    depth2.querySelectorAll('a').forEach(a => (a.tabIndex = 0));
  }

  _closeAll() {
    this._ul.querySelectorAll('li.open').forEach(li => {
      li.classList.remove('open');
      const lnk = li.querySelector('.lnk');
      if (lnk) lnk.setAttribute('aria-expanded', 'false');
      li.querySelectorAll('.depth2 a').forEach(a => (a.tabIndex = -1));
    });
  }

  _fireSelect(depthKey, item) {
    if (this._onSelect) this._onSelect(depthKey, item);
  }
}
