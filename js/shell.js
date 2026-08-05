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
    { key: "map", href: "map.html", label: "GIS 校園地圖", icon: "map", roles: ["manager", "inspector"] },
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
          '<a class="sidebar-link" href="#" data-logout>' + ico("logout") + "<span>登出</span></a>" +
        "</div>" +
      "</aside>"
    );
  }

  function renderTopbar(title, breadcrumb) {
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

    return (
      '<div class="topbar-inner">' +
        '<div class="topbar-left">' +
          '<button class="sidebar-toggle" data-sidebar-toggle aria-label="收合/展開選單">' + ico("menu") + "</button>" +
          '<div class="page-heading"><h1>' + (title || "") + "</h1>" + (breadcrumb ? '<span class="breadcrumb">' + breadcrumb + "</span>" : "") + "</div>" +
        "</div>" +
        '<div class="topbar-right">' +
          '<button class="icon-btn" aria-label="通知" data-notification-trigger>' + ico("bell") + '<span class="badge-dot"></span></button>' +
          '<div class="role-switcher">' +
            '<button type="button" class="role-chip" data-role-toggle aria-haspopup="true" aria-expanded="false">' +
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
    var url = new URL(window.location.href);
    function stateLink(state, label) {
      var u = new URL(url.href); u.searchParams.set("demo", state);
      return '<a href="' + u.pathname + u.search + '">' + label + "</a>";
    }
    var clearUrl = new URL(url.href); clearUrl.searchParams.delete("demo");
    return (
      ico("alertTriangle") +
      '<span class="db-text">Demo 展示環境 — 所有校園、人員與工單資料皆為虛構情境，不代表任何真實學校或機構。</span>' +
      '<span class="db-tests"><span>測試狀態：</span>' + stateLink("loading", "載入中") + stateLink("error", "錯誤") + stateLink("empty", "空狀態") + '<a href="' + clearUrl.pathname + '">還原</a></span>'
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
    if (sidebarMount) sidebarMount.outerHTML = renderSidebar(page, role);
    if (topbarMount) topbarMount.innerHTML = renderTopbar(topbarMount.getAttribute("data-title"), topbarMount.getAttribute("data-breadcrumb"));
    if (bannerMount) bannerMount.innerHTML = renderDemoBanner();
    if (!document.getElementById("reset-demo-modal")) document.body.insertAdjacentHTML("beforeend", renderResetModal());

    applyRoleGate(page);

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-sidebar-toggle]")) {
        if (window.innerWidth <= 900) document.body.classList.toggle("sidebar-mobile-open");
        else document.body.classList.toggle("sidebar-collapsed");
      }
      if (e.target.closest("[data-reset-demo]")) window.CO.openModal("reset-demo-modal");
      if (e.target.closest("[data-open-role-switcher]")) {
        var chip = document.querySelector("[data-role-toggle]");
        if (chip) chip.click();
      }

      var roleToggle = e.target.closest("[data-role-toggle]");
      var notifToggle = e.target.closest("[data-notification-trigger]");
      var roleMenu = document.getElementById("role-menu");
      var notifMenu = document.getElementById("notif-menu");
      if (roleToggle) { roleMenu.classList.toggle("open"); notifMenu.classList.remove("open"); }
      else if (notifToggle) { notifMenu.classList.toggle("open"); roleMenu.classList.remove("open"); }
      else if (!e.target.closest(".role-menu")) { roleMenu.classList.remove("open"); notifMenu.classList.remove("open"); }

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
