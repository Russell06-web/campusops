// CampusOps — shared sidebar / topbar / role-switcher shell.
// Every page mounts this into #sidebar-mount / #topbar-mount / #demo-banner-mount,
// keyed by data-page on <body>. data-roles on <body> (comma list) gates the page
// per the 4 demo personas; shell sets window.CO_PAGE_ALLOWED for the page's own
// script to check before rendering real content.
(function () {
  "use strict";

  var ico = window.CO.icon;

  var NAV_ITEMS = [
    { key: "dashboard", href: "dashboard.html", label: "營運總覽", icon: "dashboard", roles: ["manager"] },
    { key: "map", href: "map.html", label: "校園設施分布圖", icon: "map", roles: ["manager", "inspector"] },
    { key: "inspections", href: "inspections.html", label: "巡檢任務", icon: "clipboard", roles: ["manager", "inspector"] },
    { key: "inspection-form", href: "inspection-form.html", label: "行動巡檢表單", icon: "phone", roles: ["manager", "inspector"] },
    { key: "workorders", href: "workorders.html", label: "工單管理", icon: "workorder", roles: ["manager", "tech"] },
    { key: "reports", href: "reports.html", label: "稽核與報表", icon: "bar", roles: ["manager"] },
    { key: "report-issue", href: "report-issue.html", label: "問題通報", icon: "report", roles: ["manager", "reporter"] }
  ];

  var ROLE_DEFS = [
    { id: "manager", name: "蔡宗諺", title: "總務處管理者", desc: "監控設施、派工、審核完工", icon: "dashboard" },
    { id: "inspector", name: "李佳穎", title: "巡檢人員", desc: "巡檢路線、掃描 QR、回報異常", icon: "clipboard" },
    { id: "tech", name: "陳建宏", title: "維修技工／外部廠商", desc: "接收工單、回報進度、上傳完工照片", icon: "wrench" },
    { id: "reporter", name: "王同學", title: "校內通報者", desc: "回報教室、廁所、空調等問題", icon: "report" }
  ];

  function currentRole() {
    var r = null;
    try { r = localStorage.getItem("co_role_v1"); } catch (e) { /* ignore */ }
    return r || "manager";
  }
  function setRole(id) {
    try { localStorage.setItem("co_role_v1", id); } catch (e) { /* ignore */ }
  }
  function roleDef(id) { return ROLE_DEFS.filter(function (r) { return r.id === id; })[0] || ROLE_DEFS[0]; }
  function initials(name) { return name.slice(-2); }

  var DEMO_MODES = [
    { state: null, label: "正常畫面", icon: "checkCircle" },
    { state: "loading", label: "載入中", icon: "clock" },
    { state: "error", label: "錯誤", icon: "alertOctagon" },
    { state: "empty", label: "空狀態", icon: "inbox" }
  ];
  function demoModeHrefFor(state) {
    var u = new URL(window.location.href);
    if (state) u.searchParams.set("demo", state); else u.searchParams.delete("demo");
    return u.pathname + u.search;
  }
  function activeDemoMode() {
    var current = new URL(window.location.href).searchParams.get("demo");
    return DEMO_MODES.filter(function (m) { return m.state === current; })[0] || DEMO_MODES[0];
  }
  function demoModeItemsHtml(activeMode) {
    return DEMO_MODES.map(function (m) {
      var isActive = m === activeMode;
      return (
        '<a class="role-menu-item' + (isActive ? " active" : "") + '" href="' + demoModeHrefFor(m.state) + '">' +
        ico(m.icon) + '<span><span class="r-name">' + m.label + "</span></span>" +
        "</a>"
      );
    }).join("");
  }

  function renderSidebar(activeKey, role) {
    var linksHtml = NAV_ITEMS.map(function (item) {
      var isActive = item.key === activeKey;
      var locked = item.roles.indexOf(role) === -1;
      return (
        '<a class="sidebar-link' + (isActive ? " active" : "") + '" href="' + item.href + '" title="' + item.label + (locked ? "（目前身分無此權限，點擊可查看提示）" : "") + '"' + (isActive ? ' aria-current="page"' : "") + ">" +
        ico(item.icon) +
        "<span>" + item.label + "</span>" +
        (locked ? '<span class="lock-flag">' + ico("lock") + "</span>" : "") +
        "</a>"
      );
    }).join("");

    return (
      '<aside class="sidebar">' +
        '<div class="sidebar-brand">' +
          '<div class="brand-mark">' + ico("building") + "</div>" +
          '<div><div class="brand-text">CampusOps</div><div class="brand-sub">校園設施巡檢與派工平台</div></div>' +
        "</div>" +
        '<nav class="sidebar-nav" aria-label="主要功能選單">' +
        '<div class="sidebar-section-label">營運管理</div>' + linksHtml +
        "</nav>" +
        '<div class="sidebar-foot">' +
          '<button type="button" class="sidebar-link" data-reset-demo style="width:100%;border:none;background:none;text-align:left;font:inherit;cursor:pointer;">' +
            ico("refresh") + "<span>重設 Demo 資料</span>" +
          "</button>" +
          '<button type="button" class="sidebar-link" data-logout style="width:100%;border:none;background:none;text-align:left;font:inherit;cursor:pointer;">' + ico("logout") + "<span>登出</span></button>" +
        "</div>" +
      "</aside>"
    );
  }

  // Small "Demo" pill for the Dashboard's slim topbar — replaces the
  // full-width banner there only. Opens a popover carrying the exact same
  // disclaimer text plus the demo-state switcher (loading/error/empty),
  // so nothing from the original banner is lost, just relocated.
  function renderDemoTag() {
    var activeMode = activeDemoMode();
    return (
      '<div class="role-switcher demo-tag-switcher">' +
        '<button type="button" class="demo-tag" data-menu-toggle aria-controls="demo-tag-menu" aria-haspopup="true" aria-expanded="false" aria-label="Demo 展示環境說明' + (activeMode.state ? "，目前畫面狀態：" + activeMode.label : "") + '">' +
          ico("alertTriangle") + "<span>Demo</span>" +
        "</button>" +
        '<div class="role-menu demo-tag-menu" id="demo-tag-menu">' +
          '<div class="demo-tag-declaration">' + ico("alertTriangle") + '<span>Demo 展示環境 — 所有校園、人員與工單資料皆為虛構情境，不代表任何真實學校或機構。</span></div>' +
          '<div class="role-menu-label">切換畫面狀態（僅影響檢視，不影響資料）</div>' + demoModeItemsHtml(activeMode) +
        "</div>" +
      "</div>"
    );
  }

  function renderTopbar(title, breadcrumb, opts) {
    opts = opts || {};
    var role = roleDef(currentRole());
    var roleItemsHtml = ROLE_DEFS.map(function (r) {
      var active = r.id === role.id;
      return (
        '<button type="button" class="role-menu-item' + (active ? " active" : "") + '" data-role-pick="' + r.id + '">' +
        ico(r.icon) +
        '<span><span class="r-name">' + r.name + " · " + r.title + "</span><span class=\"r-desc\">" + r.desc + "</span></span>" +
        "</button>"
      );
    }).join("");

    // Dashboard passes no title/breadcrumb (see dashboard.html's topbar-mount)
    // so the page-heading (and its H1) simply doesn't render there — the
    // page's own <h1 class="page-title"> in the main content is the only H1.
    // Every other page still gets its title here exactly as before.
    var headingHtml = title
      ? '<div class="page-heading"><h1>' + title + "</h1>" + (breadcrumb ? '<span class="breadcrumb">' + breadcrumb + "</span>" : "") + "</div>"
      : "";

    return (
      '<div class="topbar-inner">' +
        '<div class="topbar-left">' +
          '<button type="button" class="sidebar-toggle" data-sidebar-toggle aria-label="收合/展開選單">' + ico("menu") + "</button>" +
          headingHtml +
        "</div>" +
        '<div class="topbar-right">' +
          '<button type="button" class="icon-btn" aria-label="通知" data-menu-toggle aria-controls="notif-menu" aria-haspopup="true" aria-expanded="false">' + ico("bell") + '<span class="badge-dot"></span></button>' +
          (opts.compactDemo ? renderDemoTag() : "") +
          '<div class="role-switcher">' +
            '<button type="button" class="role-chip" data-menu-toggle aria-controls="role-menu" aria-haspopup="true" aria-expanded="false">' +
              '<span class="avatar">' + initials(role.name) + "</span>" +
              '<span><span class="role-name">' + role.name + '</span><br><span class="role-title">' + role.title + "</span></span>" +
              ico("chevronDown") +
            "</button>" +
            '<div class="role-menu" id="role-menu">' +
              '<div class="role-menu-label">切換示範身分</div>' + roleItemsHtml +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="role-menu" id="notif-menu" style="right:60px;">' +
        '<div class="role-menu-label">通知</div>' +
        '<div class="role-menu-item" style="cursor:default;"><span>' + ico("alertOctagon") + '</span><span><span class="r-name">逃生指示燈逾期未修復</span><span class="r-desc">綜合體育館 1F · 已逾期 2 天</span></span></div>' +
        '<div class="role-menu-item" style="cursor:default;"><span>' + ico("checkCircle") + '</span><span><span class="r-name">電梯門夾感應異常 待驗收</span><span class="r-desc">教學大樓二館 1F · 廠商已上傳完工照片</span></span></div>' +
        '<div class="role-menu-item" style="cursor:default;"><span>' + ico("alertTriangle") + '</span><span><span class="r-name">新通報：交誼廳燈具閃爍</span><span class="r-desc">學生活動中心 2F · 尚未分派</span></span></div>' +
      "</div>"
    );
  }

  function renderDemoBanner() {
    var activeMode = activeDemoMode();
    return (
      ico("alertTriangle") +
      '<span class="db-text">Demo 展示環境 — 所有校園、人員與工單資料皆為虛構情境，不代表任何真實學校或機構。</span>' +
      '<div class="role-switcher demo-mode-switcher">' +
        '<button type="button" class="role-chip" data-menu-toggle aria-controls="demo-mode-menu" aria-haspopup="true" aria-expanded="false">' +
          ico("layers") +
          '<span class="role-name">展示模式' + (activeMode.state ? "：" + activeMode.label : "") + "</span>" +
          ico("chevronDown") +
        "</button>" +
        '<div class="role-menu" id="demo-mode-menu">' +
          '<div class="role-menu-label">切換畫面狀態（僅影響檢視，不影響資料）</div>' + demoModeItemsHtml(activeMode) +
        "</div>" +
      "</div>"
    );
  }

  function renderResetModal() {
    return (
      '<div class="modal-backdrop" id="reset-demo-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-demo-title">' +
          '<h3 id="reset-demo-title">重設 Demo 資料</h3>' +
          "<p>這會清除你在本機新增／編輯過的工單、巡檢紀錄與設備狀態，並還原成最初的展示內容。此操作無法復原。</p>" +
          '<div class="modal-actions">' +
            '<button type="button" class="btn btn-ghost" data-modal-close>取消</button>' +
            '<button type="button" class="btn btn-danger" id="reset-demo-confirm">確認重設</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function applyRoleGate(page) {
    var item = NAV_ITEMS.filter(function (n) { return n.key === page; })[0];
    var allowed = !item || item.roles.indexOf(currentRole()) !== -1;
    window.CO_PAGE_ALLOWED = allowed;
    if (!allowed) {
      var mount = document.querySelector("[data-page-content]") || document.getElementById("page-main");
      if (mount) {
        mount.innerHTML = '<div class="state-permission-page">' + window.CO.stateBlockHtml("denied", { message: roleDef(currentRole()).title + "身分沒有「" + (item ? item.label : "此頁面") + "」的存取權限。切換為「總務處管理者」即可檢視完整功能。" }) + "</div>";
      }
    }
    return allowed;
  }

  function init() {
    var page = document.body.getAttribute("data-page");

    // Session gate — every page except the login screen requires a session.
    var hasSession = false;
    try { hasSession = localStorage.getItem("co_session_v1") === "1"; } catch (e) { /* ignore */ }
    if (page !== "login" && !hasSession) { window.location.href = "index.html"; return; }

    var role = currentRole();
    var sidebarMount = document.getElementById("sidebar-mount");
    var topbarMount = document.getElementById("topbar-mount");
    var bannerMount = document.getElementById("demo-banner-mount");
    // Dashboard trades the full-width Demo banner for a compact topbar tag
    // (see renderDemoTag) — every other page keeps the banner exactly as before.
    var compactDemo = page === "dashboard";
    if (sidebarMount) sidebarMount.outerHTML = renderSidebar(page, role);
    if (topbarMount) topbarMount.innerHTML = renderTopbar(topbarMount.getAttribute("data-title"), topbarMount.getAttribute("data-breadcrumb"), { compactDemo: compactDemo });
    if (bannerMount) { if (compactDemo) bannerMount.remove(); else bannerMount.innerHTML = renderDemoBanner(); }
    if (!document.getElementById("reset-demo-modal")) document.body.insertAdjacentHTML("beforeend", renderResetModal());

    applyRoleGate(page);

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-sidebar-toggle]")) {
        if (window.innerWidth <= 900) document.body.classList.toggle("sidebar-mobile-open");
        else document.body.classList.toggle("sidebar-collapsed");
      }
      if (e.target.closest("[data-reset-demo]")) window.CO.openModal("reset-demo-modal");
      if (e.target.closest("[data-open-role-switcher]")) {
        var chip = document.querySelector('[data-menu-toggle][aria-controls="role-menu"]');
        if (chip) chip.click();
      }

      // Generic popover system: any [data-menu-toggle aria-controls="id"]
      // opens/closes the .role-menu with that id, closing every other open
      // one. Covers the role switcher, notifications, the demo-mode switcher
      // (full banner) and the Dashboard's compact Demo tag alike — one
      // mechanism instead of a hardcoded pair per menu.
      var toggle = e.target.closest("[data-menu-toggle]");
      var openMenus = Array.prototype.slice.call(document.querySelectorAll(".role-menu[id]"));
      function closeAllExcept(keepMenu) {
        openMenus.forEach(function (m) {
          var isOpen = m === keepMenu;
          m.classList.toggle("open", isOpen);
          var t = document.querySelector('[data-menu-toggle][aria-controls="' + m.id + '"]');
          if (t) t.setAttribute("aria-expanded", String(isOpen));
        });
      }
      if (toggle) {
        var targetMenu = document.getElementById(toggle.getAttribute("aria-controls"));
        closeAllExcept(targetMenu && targetMenu.classList.contains("open") ? null : targetMenu);
      } else if (!e.target.closest(".role-menu")) {
        closeAllExcept(null);
      }

      var pick = e.target.closest("[data-role-pick]");
      if (pick) {
        setRole(pick.getAttribute("data-role-pick"));
        window.location.reload();
      }

      if (e.target.closest("[data-logout]")) {
        e.preventDefault();
        try { localStorage.removeItem("co_session_v1"); } catch (err) { /* ignore */ }
        window.location.href = "index.html";
      }
    });

    // Escape closes whichever popover (role/notification/demo-mode/demo-tag)
    // is currently open and returns focus to its trigger button.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var openMenu = document.querySelector(".role-menu.open");
      if (!openMenu) return;
      var toggle = document.querySelector('[data-menu-toggle][aria-controls="' + openMenu.id + '"]');
      openMenu.classList.remove("open");
      if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
    });

    var resetConfirm = document.getElementById("reset-demo-confirm");
    if (resetConfirm) {
      resetConfirm.addEventListener("click", function () {
        window.CO_DATA.resetAll();
        window.CO.toast("Demo 資料已重設，正在重新整理…");
        setTimeout(function () { window.location.reload(); }, 500);
      });
    }
  }

  window.CO_SHELL = { currentRole: currentRole, roleDef: roleDef, ROLE_DEFS: ROLE_DEFS, NAV_ITEMS: NAV_ITEMS };
  init();
})();
