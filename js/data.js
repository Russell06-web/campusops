// CampusOps — shared demo dataset (window.CO_DATA)
// Fictional campus, fictional data — not a real school's records.
(function () {
  "use strict";

  var NS = "co_demo_v1_";

  function daysFromNow(n, hour, min) {
    var d = new Date();
    d.setHours(hour == null ? 9 : hour, min == null ? 0 : min, 0, 0);
    d.setDate(d.getDate() + n);
    return d.toISOString();
  }
  function fmtDate(iso) {
    var d = new Date(iso);
    return d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0");
  }
  function fmtDateTime(iso) {
    var d = new Date(iso);
    return fmtDate(iso) + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function fmtTime(iso) {
    var d = new Date(iso);
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  // ---------------------------------------------------------------
  // Static reference data
  // ---------------------------------------------------------------

  var BUILDINGS = [
    { id: "A", name: "行政大樓", floors: 5, x: 5, y: 8, w: 17, h: 20 },
    { id: "B", name: "教學大樓一館", floors: 6, x: 27, y: 6, w: 19, h: 18 },
    { id: "C", name: "教學大樓二館", floors: 6, x: 53, y: 8, w: 19, h: 18 },
    { id: "D", name: "圖書資訊館", floors: 8, x: 38, y: 40, w: 22, h: 20 },
    { id: "E", name: "學生活動中心", floors: 4, x: 6, y: 64, w: 21, h: 24 },
    { id: "F", name: "綜合體育館", floors: 3, x: 66, y: 60, w: 26, h: 26 }
  ];
  function building(id) { return BUILDINGS.filter(function (b) { return b.id === id; })[0]; }

  var FACILITY_TYPES = [
    { id: "fire", name: "消防", icon: "flame", swatch: "#e34948" },
    { id: "lighting", name: "照明", icon: "lightbulb", swatch: "#eda100" },
    { id: "hvac", name: "空調", icon: "wind", swatch: "#2a78d6" },
    { id: "plumbing", name: "水電", icon: "droplet", swatch: "#1baf7a" },
    { id: "elevator", name: "電梯", icon: "elevator", swatch: "#5b4b93" },
    { id: "accessibility", name: "無障礙設施", icon: "accessibility", swatch: "#e87ba4" }
  ];
  function facility(id) { return FACILITY_TYPES.filter(function (f) { return f.id === id; })[0]; }

  var RISK_LEVELS = {
    normal: { label: "一般", badge: "badge-neutral", markerClass: "risk-normal" },
    caution: { label: "注意", badge: "badge-caution", markerClass: "risk-caution" },
    high: { label: "高風險", badge: "badge-risk", markerClass: "risk-high" },
    overdue: { label: "逾期", badge: "badge-danger", markerClass: "risk-overdue" }
  };

  var STATUS_META = {
    pending: { label: "待分派", badge: "badge-neutral", step: 0 },
    assigned: { label: "已指派", badge: "badge-info", step: 1 },
    inprogress: { label: "處理中", badge: "badge-primary", step: 2 },
    review: { label: "待驗收", badge: "badge-violet", step: 3 },
    done: { label: "已完成", badge: "badge-success", step: 4 },
    rejected: { label: "退回", badge: "badge-danger", step: -1 }
  };

  var STAFF = {
    manager: { id: "U-001", name: "蔡宗諺", title: "總務處 事務組組長", org: "總務處" },
    inspectors: [
      { id: "U-101", name: "李佳穎", title: "巡檢人員", org: "總務處 工務組" },
      { id: "U-102", name: "張家豪", title: "巡檢人員", org: "總務處 工務組" },
      { id: "U-103", name: "周雅婷", title: "巡檢人員", org: "總務處 工務組" }
    ],
    technicians: [
      { id: "U-201", name: "陳建宏", title: "維修技工（水電）", org: "總務處 工務組" },
      { id: "U-202", name: "林志成", title: "維修技工（空調）", org: "總務處 工務組" },
      { id: "U-203", name: "王俊傑", title: "維修技工（電機）", org: "總務處 工務組" }
    ],
    contractors: [
      { id: "C-01", name: "大安水電行", org: "外部廠商", scope: "plumbing" },
      { id: "C-02", name: "新光電梯保養公司", org: "外部廠商", scope: "elevator" },
      { id: "C-03", name: "永固消防器材行", org: "外部廠商", scope: "fire" },
      { id: "C-04", name: "冷暖佳空調工程", org: "外部廠商", scope: "hvac" }
    ]
  };
  function allAssignees() { return STAFF.technicians.concat(STAFF.contractors); }
  function findAssignee(name) {
    return allAssignees().filter(function (p) { return p.name === name; })[0] || { name: name, org: "" };
  }

  // ---------------------------------------------------------------
  // Work orders — 24 seed records, hand-authored campus scenarios
  // ---------------------------------------------------------------

  var WO_SEED = [
    { b: "B", floor: "3F", loc: "301 教室", type: "lighting", title: "教室日光燈管閃爍", desc: "上課期間日光燈管持續閃爍，疑似啟動器老化，影響授課品質。", source: "inspection", risk: "caution", status: "pending", priority: "中", assignee: "陳建宏", createdOffset: -1, slaOffset: 2 },
    { b: "C", floor: "2F", loc: "男廁", type: "plumbing", title: "男廁水龍頭持續漏水", desc: "洗手台水龍頭關閉後仍持續滴水，地面偶有積水，有滑倒疑慮。", source: "report", reporter: "學生／王同學", risk: "high", status: "done", priority: "高", assignee: "大安水電行", createdOffset: -2, slaOffset: 1 },
    { b: "D", floor: "1F", loc: "大廳電梯 A", type: "elevator", title: "電梯運行時異音伴隨停頓", desc: "電梯上下樓時發出異音，並曾於 2 樓短暫停頓約 3 秒後才恢復運行。", source: "inspection", risk: "high", status: "inprogress", priority: "高", assignee: "新光電梯保養公司", createdOffset: -3, slaOffset: -1 },
    { b: "F", floor: "1F", loc: "逃生通道", type: "fire", title: "逃生方向指示燈不亮", desc: "西側逃生通道指示燈完全不亮，緊急照明功能失效。", source: "inspection", risk: "overdue", status: "review", priority: "高", assignee: "永固消防器材行", createdOffset: -5, slaOffset: -2 },
    { b: "A", floor: "2F", loc: "洽公大廳", type: "hvac", title: "空調出風口滴水", desc: "冷氣出風口凝結水滴落，天花板出現水漬痕跡。", source: "report", reporter: "行政人員／陳小姐", risk: "caution", status: "pending", priority: "中", assignee: "冷暖佳空調工程", createdOffset: 0, slaOffset: 3 },
    { b: "E", floor: "1F", loc: "社團辦公室走廊", type: "accessibility", title: "無障礙坡道地磚破損翹起", desc: "坡道入口處地磚破損翹起約 1 公分高低差，輪椅通行有絆倒風險。", source: "inspection", risk: "high", status: "review", priority: "高", assignee: "陳建宏", createdOffset: -1, slaOffset: 1 },
    { b: "B", floor: "5F", loc: "507 教室", type: "hvac", title: "空調運轉異音", desc: "定期巡檢發現空調室內機運轉時有輕微異音，已排除並測試正常。", source: "inspection", risk: "normal", status: "done", priority: "低", assignee: "林志成", createdOffset: -10, slaOffset: -8 },
    { b: "C", floor: "4F", loc: "走廊", type: "lighting", title: "走廊感應燈延遲亮起", desc: "人員經過後燈具延遲約 5 秒才亮起，已更換感應器模組。", source: "inspection", risk: "normal", status: "done", priority: "低", assignee: "陳建宏", createdOffset: -9, slaOffset: -7 },
    { b: "D", floor: "5F", loc: "自習室外", type: "fire", title: "滅火器逾期未檢", desc: "定期巡檢發現滅火器檢驗合格證已逾期 2 個月，需立即更換或送檢。", source: "inspection", risk: "overdue", status: "pending", priority: "高", assignee: "永固消防器材行", createdOffset: -6, slaOffset: -3 },
    { b: "A", floor: "1F", loc: "大門入口", type: "accessibility", title: "無障礙自動門感應失靈", desc: "自動門感應器對輪椅使用者反應遲緩，需人工協助開門。", source: "report", reporter: "校外訪客通報", risk: "high", status: "review", priority: "高", assignee: "陳建宏", createdOffset: -4, slaOffset: -1 },
    { b: "F", floor: "2F", loc: "器材室", type: "plumbing", title: "牆面電源插座鬆脫", desc: "插座固定座鬆脫外露，插頭插入後接觸不穩定。", source: "inspection", risk: "caution", status: "inprogress", priority: "中", assignee: "大安水電行", createdOffset: -2, slaOffset: 2 },
    { b: "E", floor: "2F", loc: "交誼廳", type: "lighting", title: "燈具閃爍異常", desc: "交誼廳吸頂燈間歇性閃爍，晚間自習學生反映影響閱讀。", source: "report", reporter: "學生／林同學", risk: "caution", status: "pending", priority: "中", assignee: "陳建宏", createdOffset: 0, slaOffset: 3 },
    { b: "B", floor: "1F", loc: "男廁", type: "plumbing", title: "馬桶阻塞", desc: "第二間馬桶沖水後排水不順，已通樂處理並確認排水恢復正常。", source: "report", reporter: "學生通報", risk: "high", status: "done", priority: "高", assignee: "大安水電行", createdOffset: -7, slaOffset: -6 },
    { b: "C", floor: "1F", loc: "電梯間", type: "elevator", title: "電梯門夾感應異常", desc: "電梯關門時偶爾未偵測到障礙物即持續夾合，具夾傷風險。", source: "inspection", risk: "overdue", status: "review", priority: "高", assignee: "新光電梯保養公司", createdOffset: -5, slaOffset: -2 },
    { b: "D", floor: "2F", loc: "期刊區", type: "hvac", title: "空調濾網積塵", desc: "定期巡檢發現濾網積塵嚴重，已清洗並恢復正常出風。", source: "inspection", risk: "normal", status: "done", priority: "低", assignee: "林志成", createdOffset: -12, slaOffset: -10 },
    { b: "A", floor: "3F", loc: "第二會議室", type: "lighting", title: "投影用燈具老化偏暗", desc: "會議室崁燈亮度明顯不足，疑似燈具老化，需更換 LED 燈具。", source: "inspection", risk: "caution", status: "assigned", priority: "中", assignee: "陳建宏", createdOffset: -1, slaOffset: 2 },
    { b: "F", floor: "3F", loc: "看台區", type: "fire", title: "消防栓箱門鎖損壞", desc: "消防栓箱門鎖卡榫斷裂無法開啟，緊急時恐無法即時取用水帶。", source: "inspection", risk: "high", status: "pending", priority: "高", assignee: "永固消防器材行", createdOffset: -1, slaOffset: 1 },
    { b: "E", floor: "3F", loc: "無障礙電梯", type: "elevator", title: "樓層按鈕觸控失靈", desc: "3 樓按鈕需按壓多次才有反應，疑似觸控面板接觸不良。", source: "report", reporter: "教職員通報", risk: "overdue", status: "inprogress", priority: "高", assignee: "新光電梯保養公司", createdOffset: -4, slaOffset: -1 },
    { b: "B", floor: "4F", loc: "女廁", type: "plumbing", title: "洗手台底部漏水", desc: "洗手台下方水管接頭滲水，櫃體底部已受潮。", source: "report", reporter: "學生通報", risk: "caution", status: "done", priority: "中", assignee: "大安水電行", createdOffset: -8, slaOffset: -6 },
    { b: "C", floor: "6F", loc: "頂樓機房", type: "hvac", title: "空調主機運轉異音", desc: "頂樓空調主機運轉時有明顯異音，廠商到場後表示需觀察運轉數據才能確認故障點。", source: "inspection", risk: "high", status: "rejected", priority: "高", assignee: "冷暖佳空調工程", createdOffset: -6, slaOffset: -3, rejectNote: "廠商回報現場運轉數據不足以判定故障原因，需再次安排時間於主機負載較高時段複檢。" },
    { b: "D", floor: "4F", loc: "討論室 402", type: "lighting", title: "燈泡損壞未更換", desc: "巡檢發現一顆日光燈泡損壞，已登記待下次巡檢統一更換。", source: "inspection", risk: "normal", status: "pending", priority: "低", assignee: "陳建宏", createdOffset: -1, slaOffset: 4 },
    { b: "A", floor: "B1", loc: "地下停車場", type: "fire", title: "灑水頭鏽蝕滲漏", desc: "停車場天花板灑水頭接頭處鏽蝕，有輕微滲水痕跡，需評估更換。", source: "inspection", risk: "high", status: "assigned", priority: "高", assignee: "永固消防器材行", createdOffset: -2, slaOffset: 1 },
    { b: "F", floor: "1F", loc: "無障礙廁所", type: "accessibility", title: "扶手鬆動", desc: "無障礙廁所側邊扶手螺絲鬆脫，施力時會晃動，有安全疑慮。", source: "inspection", risk: "high", status: "review", priority: "高", assignee: "陳建宏", createdOffset: -3, slaOffset: -1 },
    { b: "E", floor: "1F", loc: "社團辦公室", type: "plumbing", title: "電源總開關跳電", desc: "社團辦公室電源總開關頻繁跳電，現場負責人反映已影響設備使用。", source: "report", reporter: "社團幹部通報", risk: "overdue", status: "rejected", priority: "高", assignee: "大安水電行", createdOffset: -5, slaOffset: -3, rejectNote: "廠商到場時辦公室無人在場、空間上鎖無法進入現場檢查，需社團重新協調可到場時間。" }
  ];

  // ---------------------------------------------------------------
  // Demo on-site photos — deliberately only a handful of real, operationally
  // useful pairs (not every work order gets a photo; most legitimately have
  // none, which exercises the empty state). Keyed by WO_SEED array index so
  // it stays next to the scenario it documents. Single source of truth read
  // by dashboard/map/workorder-detail — nobody else hardcodes a photo path.
  var PHOTO_DIR = "assets/photos/";
  var PHOTO_SEED = {
    1: { // WO-2026-0002 — 教學大樓二館 2F 男廁 水龍頭持續漏水 (status: done)
      issue: [{ file: "leaking-faucet-before.webp", alt: "教學大樓二館 2F 男廁水龍頭持續漏水，地面有積水", by: "學生／王同學", offset: [-2, 8, 40] }],
      completion: [{ file: "leaking-faucet-after.webp", alt: "教學大樓二館 2F 男廁水龍頭維修後，接縫已更換不再滴水", by: "大安水電行", offset: [-1, 16, 40] }]
    },
    3: { // WO-2026-0004 — 綜合體育館 1F 逃生通道 逃生方向指示燈不亮 (status: review)
      issue: [{ file: "exit-sign-before.webp", alt: "綜合體育館 1F 逃生通道方向指示燈完全不亮", by: "周雅婷", offset: [-5, 8, 55] }],
      completion: [{ file: "exit-sign-after.webp", alt: "綜合體育館 1F 逃生通道方向指示燈維修後恢復正常照明", by: "永固消防器材行", offset: [-4, 16, 40] }]
    },
    5: { // WO-2026-0006 — 學生活動中心 1F 社團辦公室走廊 無障礙坡道地磚翹起 (status: review)
      issue: [{ file: "broken-ramp-before.webp", alt: "學生活動中心 1F 社團辦公室走廊無障礙坡道地磚翹起，有絆倒風險", by: "李佳穎", offset: [-1, 9, 15] }],
      completion: [{ file: "broken-ramp-after.webp", alt: "學生活動中心 1F 無障礙坡道地磚修復後與周邊齊平", by: "陳建宏", offset: [0, 16, 40] }]
    },
    13: { // WO-2026-0014 — 教學大樓二館 1F 電梯間 電梯門夾感應異常 (status: review)
      issue: [{ file: "elevator-sensor-before.webp", alt: "教學大樓二館 1F 電梯門夾感應異常，面板顯示故障燈號", by: "張家豪", offset: [-5, 10, 0] }],
      completion: [{ file: "elevator-sensor-after.webp", alt: "教學大樓二館 1F 電梯門夾感應器更換後測試正常", by: "新光電梯保養公司", offset: [-4, 16, 40] }]
    },
    4: { // WO-2026-0005 — 行政大樓 2F 洽公大廳 空調出風口滴水 (status: pending — no completion photo yet, exercises empty state)
      issue: [{ file: "ac-drip-before.webp", alt: "行政大樓 2F 洽公大廳空調出風口凝結水滴落，天花板有水漬", by: "行政人員／陳小姐", offset: [0, 9, 20] }],
      completion: []
    },
    8: { // WO-2026-0009 — 圖書資訊館 5F 自習室外 滅火器逾期未檢 (status: pending — no completion photo yet)
      issue: [{ file: "extinguisher-before.webp", alt: "圖書資訊館 5F 自習室外滅火器檢驗合格證已逾期", by: "李佳穎", offset: [-6, 9, 30] }],
      completion: []
    }
  };
  function buildPhotoList(entries) {
    return (entries || []).map(function (p) {
      return {
        src: PHOTO_DIR + p.file,
        alt: p.alt,
        capturedAt: daysFromNow(p.offset[0], p.offset[1], p.offset[2]),
        capturedBy: p.by,
        label: null, // filled in below per issue/completion
        demo: true
      };
    });
  }
  function buildPhotos(idx) {
    var seed = PHOTO_SEED[idx];
    var issue = buildPhotoList(seed && seed.issue).map(function (p) { p.label = "問題照片"; return p; });
    var completion = buildPhotoList(seed && seed.completion).map(function (p) { p.label = "完工照片"; return p; });
    return { issue: issue, completion: completion };
  }

  function buildWorkOrders() {
    return WO_SEED.map(function (seed, idx) {
      var bld = building(seed.b);
      var fac = facility(seed.type);
      var createdAt = daysFromNow(seed.createdOffset, 8 + (idx % 5), (idx * 11) % 60);
      var slaDueAt = daysFromNow(seed.slaOffset, 18, 0);
      var person = findAssignee(seed.assignee);
      var id = "WO-2026-" + String(idx + 1).padStart(4, "0");

      var history = [
        { time: createdAt, actor: seed.source === "report" ? (seed.reporter || "通報者") : "系統／例行巡檢", action: "建立工單", note: seed.source === "report" ? "由通報建立" : "巡檢發現異常，自動建立工單" }
      ];
      if (seed.status !== "pending") {
        history.push({ time: daysFromNow(seed.createdOffset, 14, 20), actor: STAFF.manager.name, action: "指派處理人員", note: "指派給 " + seed.assignee + "（" + person.org + "）" });
      }
      if (["inprogress", "review", "done", "rejected"].indexOf(seed.status) !== -1) {
        history.push({ time: daysFromNow(seed.createdOffset + 1, 10, 5), actor: seed.assignee, action: "開始處理", note: "已抵達現場確認狀況並開始維修" });
      }
      if (["review", "done"].indexOf(seed.status) !== -1) {
        history.push({ time: daysFromNow(seed.createdOffset + 1, 16, 40), actor: seed.assignee, action: "完成維修並送審", note: "已上傳完工照片，等待管理者驗收" });
      }
      if (seed.status === "done") {
        history.push({ time: daysFromNow(seed.createdOffset + 2, 9, 15), actor: STAFF.manager.name, action: "驗收通過", note: "現場複核完工品質，予以結案" });
      }
      if (seed.status === "rejected") {
        history.push({ time: daysFromNow(seed.createdOffset + 1, 17, 30), actor: STAFF.manager.name, action: "退回", note: seed.rejectNote || "驗收未通過，退回重新處理" });
      }

      return {
        id: id,
        title: seed.title,
        description: seed.desc,
        buildingId: seed.b,
        buildingName: bld.name,
        floor: seed.floor,
        location: seed.loc,
        facilityType: seed.type,
        facilityLabel: fac.name,
        source: seed.source,
        sourceLabel: seed.source === "report" ? "通報" : "例行巡檢",
        reporterName: seed.reporter || null,
        riskLevel: seed.risk,
        status: seed.status,
        priority: seed.priority,
        assignee: seed.assignee,
        assigneeOrg: person.org || "",
        createdAt: createdAt,
        slaDueAt: slaDueAt,
        photos: buildPhotos(idx),
        history: history
      };
    });
  }

  // ---------------------------------------------------------------
  // Equipment (for QR-scan simulation in mobile inspection form)
  // ---------------------------------------------------------------

  var EQUIPMENT_SEED = [
    { id: "EQ-B-301-LT", b: "B", floor: "3F", loc: "301 教室", type: "lighting", name: "教室照明燈具", lastOffset: -14, lastInspector: "李佳穎", lastResult: "normal" },
    { id: "EQ-D-01-EL", b: "D", floor: "1F", loc: "大廳電梯 A", type: "elevator", name: "電梯機組 A", lastOffset: -3, lastInspector: "王俊傑", lastResult: "abnormal", note: "運行異音伴隨停頓" },
    { id: "EQ-F-01-FE", b: "F", floor: "1F", loc: "逃生通道", type: "fire", name: "逃生指示燈", lastOffset: -20, lastInspector: "周雅婷", lastResult: "normal" },
    { id: "EQ-A-B1-SP", b: "A", floor: "B1", loc: "地下停車場", type: "fire", name: "灑水頭區 2", lastOffset: -2, lastInspector: "李佳穎", lastResult: "abnormal", note: "接頭鏽蝕滲水" },
    { id: "EQ-E-01-AC", b: "E", floor: "1F", loc: "社團辦公室走廊", type: "accessibility", name: "無障礙坡道", lastOffset: -1, lastInspector: "李佳穎", lastResult: "abnormal", note: "地磚破損翹起" },
    { id: "EQ-C-401-LT", b: "C", floor: "4F", loc: "走廊", type: "lighting", name: "走廊感應燈", lastOffset: -9, lastInspector: "張家豪", lastResult: "normal" },
    { id: "EQ-F-02-PW", b: "F", floor: "2F", loc: "器材室", type: "plumbing", name: "牆面電源插座", lastOffset: -2, lastInspector: "周雅婷", lastResult: "abnormal", note: "插座固定座鬆脫" },
    { id: "EQ-D-05-FE", b: "D", floor: "5F", loc: "自習室外", type: "fire", name: "滅火器 #11", lastOffset: -6, lastInspector: "李佳穎", lastResult: "abnormal", note: "檢驗合格證逾期" },
    { id: "EQ-B-01-PL", b: "B", floor: "1F", loc: "男廁", type: "plumbing", name: "馬桶設備", lastOffset: -7, lastInspector: "張家豪", lastResult: "abnormal", note: "沖水後排水不順" },
    { id: "EQ-A-01-AC", b: "A", floor: "1F", loc: "大門入口", type: "accessibility", name: "無障礙自動門", lastOffset: -4, lastInspector: "周雅婷", lastResult: "abnormal", note: "感應器反應遲緩" }
  ];

  function buildEquipment() {
    return EQUIPMENT_SEED.map(function (seed) {
      var bld = building(seed.b);
      var fac = facility(seed.type);
      return {
        id: seed.id,
        name: seed.name,
        buildingId: seed.b,
        buildingName: bld.name,
        floor: seed.floor,
        location: seed.loc,
        facilityType: seed.type,
        facilityLabel: fac.name,
        lastInspectedAt: daysFromNow(seed.lastOffset, 9, 30),
        lastInspector: seed.lastInspector,
        lastResult: seed.lastResult,
        lastNote: seed.note || ""
      };
    });
  }

  // ---------------------------------------------------------------
  // Today's inspection tasks
  // ---------------------------------------------------------------

  var INSPECTION_SEED = [
    { inspector: "李佳穎", time: [8, 30], b: "A", floor: "B1", loc: "地下停車場 灑水頭區", type: "fire", status: "found", woIdx: 21 },
    { inspector: "李佳穎", time: [9, 0], b: "A", floor: "1F", loc: "大門入口 無障礙自動門", type: "accessibility", status: "found", woIdx: 9 },
    { inspector: "李佳穎", time: [9, 30], b: "D", floor: "5F", loc: "自習室外 滅火器", type: "fire", status: "found", woIdx: 8 },
    { inspector: "李佳穎", time: [10, 0], b: "D", floor: "2F", loc: "期刊區 空調濾網", type: "hvac", status: "normal", woIdx: 14 },
    { inspector: "李佳穎", time: [10, 30], b: "E", floor: "1F", loc: "社團辦公室 無障礙坡道", type: "accessibility", status: "found", woIdx: 5 },
    { inspector: "李佳穎", time: [13, 30], b: "B", floor: "3F", loc: "301 教室 照明燈具", type: "lighting", status: "notyet" },
    { inspector: "李佳穎", time: [14, 0], b: "A", floor: "2F", loc: "洽公大廳 空調出風口", type: "hvac", status: "notyet" },

    { inspector: "張家豪", time: [8, 30], b: "B", floor: "1F", loc: "男廁 馬桶設備", type: "plumbing", status: "found", woIdx: 12 },
    { inspector: "張家豪", time: [9, 0], b: "B", floor: "5F", loc: "507 教室 空調", type: "hvac", status: "normal", woIdx: 6 },
    { inspector: "張家豪", time: [9, 30], b: "C", floor: "4F", loc: "走廊 感應燈", type: "lighting", status: "normal", woIdx: 7 },
    { inspector: "張家豪", time: [10, 0], b: "C", floor: "1F", loc: "電梯間 電梯門", type: "elevator", status: "found", woIdx: 13 },
    { inspector: "張家豪", time: [10, 30], b: "C", floor: "6F", loc: "頂樓機房 空調主機", type: "hvac", status: "overdue" },
    { inspector: "張家豪", time: [13, 0], b: "F", floor: "3F", loc: "看台區 消防栓箱", type: "fire", status: "found", woIdx: 16 },

    { inspector: "周雅婷", time: [8, 30], b: "F", floor: "1F", loc: "逃生通道 指示燈", type: "fire", status: "found", woIdx: 3 },
    { inspector: "周雅婷", time: [9, 0], b: "F", floor: "2F", loc: "器材室 電源插座", type: "plumbing", status: "found", woIdx: 10 },
    { inspector: "周雅婷", time: [9, 30], b: "F", floor: "1F", loc: "無障礙廁所 扶手", type: "accessibility", status: "found", woIdx: 22 },
    { inspector: "周雅婷", time: [10, 0], b: "E", floor: "3F", loc: "無障礙電梯 樓層按鈕", type: "elevator", status: "found", woIdx: 17 },
    { inspector: "周雅婷", time: [10, 30], b: "E", floor: "2F", loc: "交誼廳 燈具", type: "lighting", status: "notyet" },
    { inspector: "周雅婷", time: [11, 0], b: "E", floor: "1F", loc: "社團辦公室 電源總開關", type: "plumbing", status: "overdue" }
  ];

  function buildInspectionTasks(workOrders) {
    return INSPECTION_SEED.map(function (seed, idx) {
      var bld = building(seed.b);
      var fac = facility(seed.type);
      var scheduledAt = daysFromNow(0, seed.time[0], seed.time[1]);
      var wo = typeof seed.woIdx === "number" ? workOrders[seed.woIdx] : null;
      return {
        id: "IT-" + String(idx + 1).padStart(3, "0"),
        inspector: seed.inspector,
        buildingId: seed.b,
        buildingName: bld.name,
        floor: seed.floor,
        location: seed.loc,
        facilityType: seed.type,
        facilityLabel: fac.name,
        scheduledAt: scheduledAt,
        status: seed.status, // normal | found | notyet | overdue
        workOrderId: wo ? wo.id : null
      };
    });
  }

  // ---------------------------------------------------------------
  // Persistence layer (localStorage), mirrors the TK_DATA pattern
  // ---------------------------------------------------------------

  var SEEDS = null;
  function seedAll() {
    if (SEEDS) return SEEDS;
    var workOrders = buildWorkOrders();
    SEEDS = {
      workOrders: workOrders,
      equipment: buildEquipment(),
      inspectionTasks: buildInspectionTasks(workOrders)
    };
    return SEEDS;
  }

  var cache = {};
  function load(name) {
    if (cache[name]) return cache[name];
    var raw = null;
    try { raw = localStorage.getItem(NS + name); } catch (e) { /* ignore */ }
    if (raw) {
      try { cache[name] = JSON.parse(raw); return cache[name]; } catch (e) { /* fall through to seed */ }
    }
    cache[name] = JSON.parse(JSON.stringify(seedAll()[name]));
    return cache[name];
  }
  function save(name) {
    try { localStorage.setItem(NS + name, JSON.stringify(cache[name])); } catch (e) { /* ignore quota errors */ }
  }
  function set(name, value) {
    cache[name] = value;
    save(name);
  }
  function resetAll() {
    ["workOrders", "equipment", "inspectionTasks"].forEach(function (name) {
      try { localStorage.removeItem(NS + name); } catch (e) { /* ignore */ }
      delete cache[name];
    });
    SEEDS = null;
  }

  function nextWorkOrderId() {
    var list = load("workOrders");
    var max = list.reduce(function (m, w) {
      var n = parseInt(w.id.split("-").pop(), 10);
      return n > m ? n : m;
    }, 0);
    return "WO-2026-" + String(max + 1).padStart(4, "0");
  }

  // Shape a freshly-captured (non-seed) photo the same way as the demo set,
  // so every consumer (dashboard/map/detail/lightbox) can treat wo.photos.*
  // entries uniformly regardless of source. demo:false — no "Demo" flag on
  // a photo the user actually just uploaded this session.
  function makePhoto(opts) {
    return {
      src: opts.src,
      alt: opts.alt,
      capturedAt: opts.capturedAt || new Date().toISOString(),
      capturedBy: opts.capturedBy,
      label: opts.label,
      demo: false
    };
  }

  window.CO_DATA = {
    BUILDINGS: BUILDINGS, building: building,
    FACILITY_TYPES: FACILITY_TYPES, facility: facility,
    RISK_LEVELS: RISK_LEVELS, STATUS_META: STATUS_META,
    STAFF: STAFF, allAssignees: allAssignees, findAssignee: findAssignee,
    load: load, save: save, set: set, resetAll: resetAll,
    nextWorkOrderId: nextWorkOrderId, makePhoto: makePhoto,
    fmtDate: fmtDate, fmtDateTime: fmtDateTime, fmtTime: fmtTime, daysFromNow: daysFromNow
  };
})();
