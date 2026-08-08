// CampusOps — shared behaviours: icons, toast, modal/focus-trap, table helper,
// loading/empty/error/permission-denied state renderers.
(function () {
  "use strict";

  var ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    map: '<path d="M9 18l-6 2V4l6-2 6 2 6-2v16l-6 2-6-2-6-2z"/><path d="M9 2v16"/><path d="M15 4v16"/>',
    clipboard: '<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M8 11h8M8 15h5"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    workorder: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h4"/>',
    report: '<path d="M12 22a9 9 0 1 0-9-9c0 2 .6 3.6 2 5l-1 3 3.2-1c1.2.7 2.5 1 3.8 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    bar: '<path d="M4 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="0.5"/><rect x="13" y="8" width="3" height="10" rx="0.5"/><rect x="19" y="14" width="0" height="0"/><rect x="18" y="5" width="3" height="13" rx="0.5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronsUpDown: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
    x: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    flame: '<path d="M12 22c4 0 7-2.5 7-6.5 0-3-2-4.5-3-7-.3 2-1.3 3-2 2 .5-3-1-5.5-3-7 .5 3-2 5-3.5 7.5C6.5 12.5 6 14 6 15.5 6 19.5 8.5 22 12 22z"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.3h6c0-1 .3-1.8 1-2.3A7 7 0 0 0 12 2Z"/>',
    wind: '<path d="M3 8h10a2.5 2.5 0 1 0-2-4"/><path d="M3 12h15a2.5 2.5 0 1 1-2 4"/><path d="M3 16h7a2 2 0 1 1-1.6 3.2"/>',
    droplet: '<path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/>',
    elevator: '<rect x="5" y="2" width="14" height="20" rx="1.5"/><path d="m10 8 2-2 2 2"/><path d="m10 14 2 2 2-2"/>',
    accessibility: '<circle cx="12" cy="4" r="1.6"/><path d="M8 8.5h8l-2 2.2v2.3l3.5 4"/><path d="M10.5 12.7H15"/><path d="M9 13l-2.5 6.5"/><path d="M13.2 15.5 15 19.5"/>',
    camera: '<path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2z"/><circle cx="12" cy="13" r="3.5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-5-5L5 21"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    alertTriangle: '<path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    alertOctagon: '<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    shieldAlert: '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7l3.5-7Z"/>',
    refresh: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    download: '<path d="M12 3v13"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/>',
    upload: '<path d="M12 21V8"/><path d="m7 13 5-5 5 5"/><path d="M5 21h14"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    wifiOff: '<path d="M2 2l20 20"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 12.9a10 10 0 0 1 3-2.1"/><path d="M19 12.9a10 10 0 0 0-2.3-1.8"/><path d="M8.5 7.5A10 10 0 0 1 12 7c1 0 2 .1 2.9.4"/><path d="M1 8.5A15 15 0 0 1 4.5 6"/><path d="M12 20h.01"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a17.6 17.6 0 0 1-2.6 3.8"/><path d="M6.6 6.6C3.5 8.5 1 12 1 12s4 8 11 8a9.7 9.7 0 0 0 5-1.4"/><path d="M9.9 9.9a3 3 0 1 0 4.2 4.2"/><path d="M2 2l20 20"/>',
    filter: '<path d="M4 4h16l-6 8v6l-4 2v-8Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L2 19v3h3l7-7.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2-2Z"/>',
    fileText: '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h6M9 9h1"/>',
    barChart2: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    checkSquare: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    navigation: '<path d="m3 11 19-9-9 19-2-8-8-2Z"/>',
    trendUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    trendDown: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>'
  };

  function icon(key, cls) {
    var d = ICONS[key] || ICONS.x;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  }

  // ------------------------------------------------------------------
  // Toasts
  // ------------------------------------------------------------------
  function ensureToastStack() {
    var stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    return stack;
  }

  function toast(message, type) {
    var stack = ensureToastStack();
    var el = document.createElement("div");
    el.className = "toast" + (type ? " toast-" + type : "");
    var iconKey = type === "error" ? "xCircle" : type === "success" ? "checkCircle" : "bell";
    el.innerHTML = icon(iconKey) + "<span>" + message + "</span>";
    stack.appendChild(el);
    setTimeout(function () {
      el.style.transition = "opacity .2s ease";
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 220);
    }, 3200);
  }

  // ------------------------------------------------------------------
  // Modal + focus trap
  // ------------------------------------------------------------------
  var lastFocusedEl = null;

  function trapFocusIn(container) {
    var focusables = container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    function handler(e) {
      if (e.key === "Escape") { closeTopModal(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    container.__focusHandler = handler;
    container.addEventListener("keydown", handler);
    first.focus();
  }
  function releaseFocusTrap(container) {
    if (container.__focusHandler) container.removeEventListener("keydown", container.__focusHandler);
  }

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    lastFocusedEl = document.activeElement;
    el.classList.add("open");
    document.body.classList.add("modal-open");
    var modal = el.querySelector(".modal");
    if (modal) trapFocusIn(modal);
  }
  function closeTopModal() {
    var open = document.querySelectorAll(".modal-backdrop.open");
    if (!open.length) return;
    var el = open[open.length - 1];
    var modal = el.querySelector(".modal");
    if (modal) releaseFocusTrap(modal);
    el.classList.remove("open");
    document.body.classList.remove("modal-open");
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-modal-close]")) closeTopModal();
    var backdrop = e.target.classList && e.target.classList.contains("modal-backdrop") ? e.target : null;
    if (backdrop) closeTopModal();
    var opener = e.target.closest("[data-open-modal]");
    if (opener) openModal(opener.getAttribute("data-open-modal"));
  });

  // ------------------------------------------------------------------
  // Photo evidence: thumbnail buttons + one shared lightbox dialog.
  // Reused by dashboard (urgent table), map (marker popover), and
  // workorder-detail (before/after grid) — nobody re-implements this.
  // ------------------------------------------------------------------
  var LIGHTBOX_ID = "photo-lightbox-backdrop";

  function ensurePhotoLightbox() {
    if (document.getElementById(LIGHTBOX_ID)) return;
    document.body.insertAdjacentHTML("beforeend",
      '<div class="modal-backdrop photo-lightbox" id="' + LIGHTBOX_ID + '">' +
        '<div class="modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="photo-lightbox-title">' +
          '<button type="button" class="photo-lightbox-close" data-modal-close aria-label="關閉照片檢視">' + icon("x") + "</button>" +
          '<div class="photo-lightbox-media"><img id="photo-lightbox-img" src="" alt=""></div>' +
          '<div class="photo-lightbox-body">' +
            '<h3 id="photo-lightbox-title"></h3>' +
            '<div class="photo-lightbox-tags" id="photo-lightbox-tags"></div>' +
            '<div class="photo-lightbox-meta" id="photo-lightbox-meta"></div>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  // photo: { src, alt, label, capturedBy, capturedAt, demo }
  function openLightbox(photo) {
    ensurePhotoLightbox();
    var img = document.getElementById("photo-lightbox-img");
    img.src = photo.src;
    img.alt = photo.alt || "";
    document.getElementById("photo-lightbox-title").textContent = photo.alt || "現場照片";
    var tagsHtml = "";
    if (photo.label) tagsHtml += '<span class="badge badge-neutral">' + photo.label + "</span>";
    if (photo.demo) tagsHtml += '<span class="badge badge-caution">示意照片</span>';
    document.getElementById("photo-lightbox-tags").innerHTML = tagsHtml;
    var metaBits = [];
    if (photo.capturedBy) metaBits.push('<span class="pl-by">' + photo.capturedBy + "</span>");
    if (photo.capturedAt) {
      try { metaBits.push(new Date(photo.capturedAt).toLocaleString("zh-TW", { hour12: false })); } catch (e) { /* ignore */ }
    }
    document.getElementById("photo-lightbox-meta").innerHTML = metaBits.join(" · ");
    // openModal() captures document.activeElement (the thumbnail just
    // clicked) as the focus-return target, so no extra bookkeeping needed here.
    openModal(LIGHTBOX_ID);
  }

  // Renders a <button class="photo-thumbnail-button ..."> for a photo object
  // and wires its click (and its keyboard activation, for free, since it's a
  // real <button>) to open the shared lightbox. Caller inserts the returned
  // element; photo stays a live JS reference via closure, not re-parsed from HTML.
  function renderPhotoThumbnail(photo, opts) {
    opts = opts || {};
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "photo-thumbnail-button" + (opts.extraClass ? " " + opts.extraClass : "");
    btn.setAttribute("aria-label", "放大查看：" + (photo.alt || "現場照片"));
    var img = document.createElement("img");
    img.src = photo.src; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
    img.setAttribute("aria-hidden", "true");
    img.addEventListener("error", function () {
      btn.innerHTML = "";
      btn.classList.add("photo-empty-state", "is-error");
      btn.innerHTML = icon("alertOctagon") + "<span>照片載入失敗</span>";
      btn.disabled = true;
    });
    btn.appendChild(img);
    btn.addEventListener("click", function () { openLightbox(photo); });
    return btn;
  }

  // Empty-state placeholder matching a photo slot's footprint, for when a
  // work order genuinely has no photo yet — never a broken-image glyph.
  function photoEmptyStateHtml(message) {
    return '<div class="photo-empty-state">' + icon("image") + "<span>" + (message || "尚無照片") + "</span></div>";
  }

  // ------------------------------------------------------------------
  // Query-param driven demo state (?demo=loading|error|empty)
  // ------------------------------------------------------------------
  function demoStateParam() {
    var m = /[?&]demo=(loading|error|empty)/.exec(window.location.search);
    return m ? m[1] : null;
  }

  function stateBlockHtml(kind, opts) {
    opts = opts || {};
    if (kind === "loading") {
      return (
        '<div class="state-block state-loading" role="status" aria-live="polite">' +
        '<div class="skeleton skeleton-card" style="width:100%;max-width:420px;"></div>' +
        '<div class="skeleton skeleton-text" style="width:60%"></div>' +
        '<div class="skeleton skeleton-text" style="width:40%"></div>' +
        "<p>資料載入中…</p></div>"
      );
    }
    if (kind === "error") {
      return (
        '<div class="state-block state-error">' +
        '<div class="state-icon">' + icon("alertOctagon") + "</div>" +
        "<h3>資料載入失敗</h3>" +
        "<p>" + (opts.message || "與伺服器連線發生問題，請稍後再試一次。") + "</p>" +
        '<div class="state-actions"><button type="button" class="btn btn-primary" data-retry>' + icon("refresh") + "重新載入</button></div>" +
        "</div>"
      );
    }
    if (kind === "denied") {
      return (
        '<div class="state-block state-denied">' +
        '<div class="state-icon">' + icon("shieldAlert") + "</div>" +
        "<h3>權限不足</h3>" +
        "<p>" + (opts.message || "目前身分沒有這個頁面的存取權限，請切換身分或聯絡系統管理者。") + "</p>" +
        '<div class="state-actions"><button type="button" class="btn btn-secondary" data-open-role-switcher>切換身分</button>' +
        '<a class="btn btn-primary" href="' + (opts.fallbackHref || "dashboard.html") + '">' + icon("home") + "回首頁</a></div>" +
        "</div>"
      );
    }
    // empty
    return (
      '<div class="state-block state-empty">' +
      '<div class="state-icon">' + icon(opts.icon || "inbox") + "</div>" +
      "<h3>" + (opts.title || "沒有符合條件的資料") + "</h3>" +
      "<p>" + (opts.message || "試著調整篩選條件或搜尋關鍵字。") + "</p>" +
      (opts.actionHtml || '<div class="state-actions"><button type="button" class="btn btn-secondary" data-clear-filters">清除篩選</button></div>') +
      "</div>"
    );
  }

  // ------------------------------------------------------------------
  // Generic table controller: search + filter + sort + paginate
  // ------------------------------------------------------------------
  function TableController(opts) {
    this.data = opts.data || [];
    this.columns = opts.columns;
    this.pageSize = opts.pageSize || 8;
    this.searchKeys = opts.searchKeys || [];
    this.mount = opts.mount;
    this.renderRow = opts.renderRow;
    this.emptyOpts = opts.emptyOpts || {};
    this.rowClick = opts.rowClick;
    this.state = { search: "", filters: {}, sortKey: opts.defaultSort || null, sortDir: opts.defaultSortDir || "desc", page: 1 };
    this.forcedState = opts.forcedState || null; // 'loading' | 'error' | 'empty'
  }
  TableController.prototype.setFilter = function (key, val) { this.state.filters[key] = val; this.state.page = 1; this.render(); };
  TableController.prototype.setSearch = function (val) { this.state.search = val; this.state.page = 1; this.render(); };
  TableController.prototype.setSort = function (key) {
    if (this.state.sortKey === key) this.state.sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
    else { this.state.sortKey = key; this.state.sortDir = "asc"; }
    this.render();
  };
  TableController.prototype.clearFilters = function () {
    this.state.search = ""; this.state.filters = {}; this.state.page = 1; this.render();
  };
  TableController.prototype.getFiltered = function () {
    var self = this;
    var rows = this.data.filter(function (row) {
      if (self.state.search) {
        var q = self.state.search.toLowerCase();
        var hit = self.searchKeys.some(function (k) { return String(row[k] || "").toLowerCase().indexOf(q) !== -1; });
        if (!hit) return false;
      }
      for (var key in self.state.filters) {
        var val = self.state.filters[key];
        if (val && val !== "all" && String(row[key]) !== String(val)) return false;
      }
      return true;
    });
    if (this.state.sortKey) {
      var key = this.state.sortKey, dir = this.state.sortDir === "asc" ? 1 : -1;
      rows = rows.slice().sort(function (a, b) {
        var av = a[key], bv = b[key];
        if (av === bv) return 0;
        return av > bv ? dir : -dir;
      });
    }
    return rows;
  };
  TableController.prototype.render = function () {
    var mount = this.mount;
    if (this.forcedState === "loading") { mount.innerHTML = stateBlockHtml("loading"); return; }
    if (this.forcedState === "error") { mount.innerHTML = stateBlockHtml("error"); bindStateActions(mount, this); return; }

    var filtered = this.getFiltered();
    var totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    if (this.state.page > totalPages) this.state.page = totalPages;
    var start = (this.state.page - 1) * this.pageSize;
    var pageRows = filtered.slice(start, start + this.pageSize);

    if (!filtered.length) {
      mount.innerHTML = stateBlockHtml("empty", this.emptyOpts);
      bindStateActions(mount, this);
      return;
    }

    var self = this;
    var theadHtml = "<thead><tr>" + this.columns.map(function (c) {
      var sortable = c.sortable ? " sortable" : "";
      var active = self.state.sortKey === c.key ? " sort-active" : "";
      var sortIcon = c.sortable ? '<span class="sort-icon">' + icon("chevronsUpDown") + "</span>" : "";
      return '<th class="' + sortable + active + '" data-sort-key="' + (c.sortable ? c.key : "") + '">' + c.label + sortIcon + "</th>";
    }).join("") + "</tr></thead>";

    var tbodyHtml = "<tbody>" + pageRows.map(function (row) { return self.renderRow(row); }).join("") + "</tbody>";

    mount.innerHTML =
      '<div class="table-scroll"><table class="data-table table-responsive-stack">' + theadHtml + tbodyHtml + "</table></div>" +
      '<div class="table-pagination">' +
      '<span class="table-count">共 ' + filtered.length + ' 筆，第 ' + this.state.page + ' / ' + totalPages + ' 頁</span>' +
      '<div class="pager-btns">' +
      '<button type="button" data-page-nav="prev" ' + (this.state.page <= 1 ? "disabled" : "") + ">" + icon("chevronLeft") + "</button>" +
      '<button type="button" data-page-nav="next" ' + (this.state.page >= totalPages ? "disabled" : "") + ">" + icon("chevronRight") + "</button>" +
      "</div></div>";

    mount.querySelectorAll("th.sortable").forEach(function (th) {
      th.addEventListener("click", function () { self.setSort(th.getAttribute("data-sort-key")); });
    });
    var prevBtn = mount.querySelector('[data-page-nav="prev"]');
    var nextBtn = mount.querySelector('[data-page-nav="next"]');
    if (prevBtn) prevBtn.addEventListener("click", function () { self.state.page--; self.render(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { self.state.page++; self.render(); });
    if (this.rowClick) {
      mount.querySelectorAll("tr.row-link").forEach(function (tr) {
        tr.addEventListener("click", function (e) {
          if (e.target.closest("a,button")) return;
          self.rowClick(tr.getAttribute("data-row-id"));
        });
      });
    }
  };

  function bindStateActions(mount, controller) {
    var clearBtn = mount.querySelector("[data-clear-filters]");
    if (clearBtn) clearBtn.addEventListener("click", function () { controller.clearFilters(); if (window.__coResetFilterUI) window.__coResetFilterUI(); });
    var retryBtn = mount.querySelector("[data-retry]");
    if (retryBtn) retryBtn.addEventListener("click", function () {
      controller.forcedState = null;
      var url = new URL(window.location.href);
      url.searchParams.delete("demo");
      window.history.replaceState({}, "", url);
      toast("重新載入成功", "success");
      controller.render();
    });
  }

  window.CO = {
    icon: icon, ICONS: ICONS,
    toast: toast,
    openModal: openModal, closeTopModal: closeTopModal,
    trapFocusIn: trapFocusIn, releaseFocusTrap: releaseFocusTrap,
    demoStateParam: demoStateParam,
    stateBlockHtml: stateBlockHtml,
    TableController: TableController,
    openLightbox: openLightbox, renderPhotoThumbnail: renderPhotoThumbnail, photoEmptyStateHtml: photoEmptyStateHtml
  };
})();
