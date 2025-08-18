// Ensure the DOM exists before binding anything
document.addEventListener("DOMContentLoaded", () => {
  // ============ LocalStorage keys ============
  const LS_UPDATES = "nm_placement_updates_v1";
  const LS_BOOKMARKS = "nm_placement_bookmarks_v1"; // (kept for future use)
  const LS_SUBSCRIBE = "nm_placement_subscribed_v1";

  // ============ Seed (now 9 items) ============
  const seed = [
    { id: 1, title: "Google SDE Online Assessment", company: "Google", tag: "drive", date: "2025-08-18", urgent: true,  pinned: true,  branches:["CSE","ECE"], desc:"OA on 20 Aug, HackerRank link via email. Bring college ID." },
    { id: 2, title: "Infosys Shortlist (Round 1)",   company: "Infosys", tag: "shortlist", date: "2025-08-17", urgent: false, pinned: false, branches:["CSE","ECE","ME"], desc:"Shortlist for Round 2 is out on portal Notice Board." },
    { id: 3, title: "TCS Technical Interviews",       company: "TCS",    tag: "interview", date: "2025-08-20", urgent: false, pinned: true,  branches:["CSE","ECE","CE"], desc:"Slots published. Venue: Lab Block L-2. Reach 15 mins early." },
    { id: 4, title: "Wipro HR Round Reschedule",      company: "Wipro",  tag: "notice",    date: "2025-08-16", urgent: true,  pinned: false, branches:["CSE"], desc:"HR round moved to 22 Aug due to venue conflict." },
    { id: 5, title: "HCL Drive Registration",         company: "HCL",    tag: "drive",     date: "2025-08-27", urgent: false, pinned: false, branches:["CSE","ECE","ME"], desc:"Register before 24 Aug. Eligibility: 7.0+ CGPA." },
    { id: 6, title: "Accenture Interview Results",    company: "Accenture", tag: "shortlist", date: "2025-08-14", urgent: false, pinned: false, branches:["CSE","ECE","CE"], desc:"Stage 1 results announced. Log in to placement portal." },
    { id: 7, title: "LTIMindtree Tech Interview",     company: "LTIMindtree", tag: "interview", date:"2025-08-23", urgent:false, pinned:false, branches:["CSE","ECE"], desc:"Panels 1-4 in Seminar Hall. Dress code formal." },
    { id: 8, title: "Capgemini Aptitude Drive",       company: "Capgemini", tag: "drive", date:"2025-08-29", urgent:false, pinned:false, branches:["CSE","ECE","ME","CE"], desc:"Aptitude + Communication Test. Venue: Main Auditorium." },
    { id: 9, title: "google: Google SDE",             company: "google", tag: "drive", date:"2025-08-05", urgent:false, pinned:false, branches:["CSE"], desc:"Off-campus practice drive (sample item)." }
  ];

  // ============ Storage helpers ============
  const getUpdates = () => {
    const raw = localStorage.getItem(LS_UPDATES);
    return raw ? JSON.parse(raw) : seed.slice();
  };
  const setUpdates = (arr) => localStorage.setItem(LS_UPDATES, JSON.stringify(arr));
  if (!localStorage.getItem(LS_UPDATES)) setUpdates(seed);

  // Optional bookmarks (not shown in UI now)
  const getBookmarks = () => new Set(JSON.parse(localStorage.getItem(LS_BOOKMARKS) || "[]"));
  const setBookmarks = (set) => localStorage.setItem(LS_BOOKMARKS, JSON.stringify([...set]));

  // ============ DOM refs ============
  const cardsEl = document.getElementById("cards");
  const pageInfoEl = document.getElementById("pageInfo");
  const timelineEl = document.getElementById("timeline");

  const qEl = document.getElementById("q");
  const fCompanyEl = document.getElementById("fCompany");
  const fTagEl = document.getElementById("fTag");
  const fBranchEl = document.getElementById("fBranch");
  const fFromEl = document.getElementById("fFrom");
  const fToEl = document.getElementById("fTo");
  const fSortEl = document.getElementById("fSort");
  const fResetEl = document.getElementById("fReset");

  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");

  const statTotal = document.getElementById("statTotal");
  const statInterviews = document.getElementById("statInterviews");
  const statDrives = document.getElementById("statDrives");
  const statShortlists = document.getElementById("statShortlists");

  const drawer = document.getElementById("drawer");
  const drawerBody = document.getElementById("drawerBody");
  const drawerClose = document.getElementById("drawerClose");

  const btnSubscribe = document.getElementById("btnSubscribe");
  const btnExportCsv = document.getElementById("btnExportCsv");
  const btnOpenAdmin = document.getElementById("btnOpenAdmin");
  const adminModal = document.getElementById("adminModal");
  const adminClose = document.getElementById("adminClose");
  const adminForm = document.getElementById("adminForm");
  const adminReset = document.getElementById("adminReset");

  // ============ State ============
  let state = {
    page: 1,
    perPage: 6,
    q: "",
    company: "",
    tag: "",
    branch: "",
    from: "",
    to: "",
    sort: "newest",
  };

  // ============ Utils ============
  const parseDate = (d) => new Date(d + "T00:00:00");
  const fmt = (d) =>
    parseDate(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const todayYMD = () => {
    const t = new Date();
    const m = String(t.getMonth() + 1).padStart(2, "0");
    const d = String(t.getDate()).padStart(2, "0");
    return `${t.getFullYear()}-${m}-${d}`;
  };

  const unique = (arr) => [...new Set(arr)];
  const inRange = (d, from, to) => {
    const x = parseDate(d).getTime();
    if (from && x < parseDate(from).getTime()) return false;
    if (to && x > parseDate(to).getTime()) return false;
    return true;
  };

  // ============ Init helpers ============
  function buildCompanyFilter() {
    const companies = unique(getUpdates().map((u) => u.company)).sort((a,b)=>a.localeCompare(b));
    fCompanyEl.innerHTML =
      '<option value="">Company (All)</option>' +
      companies.map((c) => `<option value="${c}">${c}</option>`).join("");
  }
  buildCompanyFilter();

  function syncSubscribeLabel() {
    const sub = localStorage.getItem(LS_SUBSCRIBE) === "1";
    btnSubscribe.textContent = sub ? "🔕 Subscribed" : "🔔 Subscribe";
    btnSubscribe.classList.toggle("btn-dark", !sub);
    btnSubscribe.classList.toggle("btn-outline-dark", sub);
  }
  syncSubscribeLabel();

  // ============ Filtering / Sorting / Paging ============
  function filterAndSort(data) {
    return data
      .filter(
        (u) =>
          (!state.q ||
            (u.title + " " + u.company).toLowerCase().includes(state.q.toLowerCase())) &&
          (!state.company || u.company === state.company) &&
          (!state.tag || u.tag === state.tag) &&
          (!state.branch || (u.branches || []).includes(state.branch)) &&
          inRange(u.date, state.from, state.to)
      )
      .sort((a, b) => {
        // pinned always first
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        const da = parseDate(a.date).getTime();
        const db = parseDate(b.date).getTime();
        return state.sort === "newest" ? db - da : da - db;
      });
  }

  function paginate(arr) {
    const start = (state.page - 1) * state.perPage;
    return arr.slice(start, start + state.perPage);
  }

  // ============ Renderers ============
  function renderStats(all) {
    statTotal.textContent = all.length;
    statInterviews.textContent = all.filter((u) => u.tag === "interview").length;
    statDrives.textContent = all.filter((u) => u.tag === "drive").length;
    statShortlists.textContent = all.filter((u) => u.tag === "shortlist").length;
  }

  function renderTimeline(all) {
    const items = all.slice().sort((a, b) => parseDate(b.date) - parseDate(a.date));
    timelineEl.innerHTML = items
      .map(
        (u) =>
          `<li class="mb-2"><span class="me-2">•</span><strong>${fmt(u.date)}</strong> — ${u.company}: ${u.title}</li>`
      )
      .join("");
  }

  function tagPill(tag) {
    const T = tag?.toLowerCase() || "";
    const label = T ? T[0].toUpperCase() + T.slice(1) : "";
    return `<span class="badge rounded-pill px-3 tag ${T}">${label}</span>`;
  }

  function renderCards(view) {
    if (!view.length) {
      cardsEl.innerHTML = `<div class="col-12">
        <div class="p-4 rounded-3 text-center" style="border:1px dashed var(--border-color, #ddd); color: var(--secondary-text-color, #6c757d)">
          No updates match your filters.
        </div></div>`;
      return;
    }

    cardsEl.innerHTML = view
      .map(
        (u) => `
      <div class="col-md-6 col-lg-4">
        <div class="p-3 placement-card h-100 d-flex flex-column" data-id="${u.id}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            ${tagPill(u.tag)}
            <div class="d-flex gap-2">
              ${u.urgent ? `<span class="badge badge-urgent rounded-pill px-3 py-2">Urgent</span>` : ""}
              ${u.pinned ? `<span class="badge badge-pinned rounded-pill px-3 py-2">Pinned</span>` : ""}
            </div>
          </div>

          <h4 class="mb-2" style="line-height:1.25">${u.title}</h4>
          <p class="mb-1"><b>Company:</b> ${u.company}</p>
          <p class="mb-1">📅 <b>${fmt(u.date)}</b></p>
          ${
            u.branches?.length
              ? `<p class="mb-1">🎓 Branches: ${u.branches.join(", ")}</p>`
              : ""
          }
          <p class="mb-2 small text-muted" style="flex:1 0 auto">${u.desc || ""}</p>

          <div class="mt-auto d-flex justify-content-end">
            <button class="btn btn-warning btn-sm" data-view="${u.id}">View</button>
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  function renderPage() {
    const all = filterAndSort(getUpdates());
    const pages = Math.max(1, Math.ceil(all.length / state.perPage));
    if (state.page > pages) state.page = pages;

    const view = paginate(all);
    renderCards(view);
    renderStats(all);
    renderTimeline(all);

    pageInfoEl.textContent = `Page ${state.page} / ${pages}`;
    btnPrev.disabled = state.page <= 1;
    btnNext.disabled = state.page >= pages;
  }

  // ============ Drawer ============
  function openDrawer(item) {
    if (!item) return;
    // Fill body
    drawerBody.innerHTML = `
      <div class="mb-2"><small class="text-muted">Title</small><div class="fw-semibold">${item.title}</div></div>
      <div class="mb-2"><small class="text-muted">Company</small><div>${item.company}</div></div>
      <div class="mb-2"><small class="text-muted">Date</small><div>${fmt(item.date)}</div></div>
      <div class="mb-2"><small class="text-muted">Tag</small><div class="text-capitalize">${item.tag}</div></div>
      <div class="mb-2"><small class="text-muted">Branches</small><div>${(item.branches || []).join(", ") || "-"}</div></div>
      <div class="mb-2"><small class="text-muted">Urgent</small><div>${item.urgent ? "Yes" : "No"}</div></div>
      <div class="mb-2"><small class="text-muted">Pinned</small><div>${item.pinned ? "Yes" : "No"}</div></div>
      <hr>
      <div style="white-space:pre-wrap">${item.desc || ""}</div>
    `;

    // Make sure it becomes visible regardless of CSS approach
    drawer.classList.add("open");
    drawer.style.display = "block";
    drawer.style.right = "0";
    drawer.style.transform = "translateX(0)";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.style.transform = "";
    drawer.style.right = "";
    drawer.style.display = "";
  }

  // ============ Event wiring ============

  // Filters
  qEl.addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    state.page = 1;
    renderPage();
  });
  fCompanyEl.addEventListener("change", (e) => {
    state.company = e.target.value;
    state.page = 1;
    renderPage();
  });
  fTagEl.addEventListener("change", (e) => {
    state.tag = e.target.value;
    state.page = 1;
    renderPage();
  });
  fBranchEl.addEventListener("change", (e) => {
    state.branch = e.target.value;
    state.page = 1;
    renderPage();
  });
  fFromEl.addEventListener("change", (e) => {
    state.from = e.target.value;
    state.page = 1;
    renderPage();
  });
  fToEl.addEventListener("change", (e) => {
    state.to = e.target.value;
    state.page = 1;
    renderPage();
  });
  fSortEl.addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.page = 1;
    renderPage();
  });

  fResetEl.addEventListener("click", () => {
    state = { ...state, page: 1, q: "", company: "", tag: "", branch: "", from: "", to: "", sort: "newest" };
    qEl.value = "";
    fCompanyEl.value = "";
    fTagEl.value = "";
    fBranchEl.value = "";
    fFromEl.value = "";
    fToEl.value = "";
    fSortEl.value = "newest";
    renderPage();
  });

  // Pagination
  btnPrev.addEventListener("click", () => {
    state.page = Math.max(1, state.page - 1);
    renderPage();
  });
  btnNext.addEventListener("click", () => {
    state.page = state.page + 1;
    renderPage();
  });

  // Card delegation (View)
  cardsEl.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view]");
    const card = e.target.closest(".placement-card");
    if (!viewBtn && !card) return;

    const id = +(viewBtn?.getAttribute("data-view") || card?.getAttribute("data-id"));
    const item = getUpdates().find((u) => u.id === id);
    if (item) openDrawer(item);
  });

  // Drawer close
  drawerClose.addEventListener("click", closeDrawer);
  // optional: close by hitting Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Subscribe toggle
  btnSubscribe.addEventListener("click", () => {
    const now = localStorage.getItem(LS_SUBSCRIBE) === "1";
    localStorage.setItem(LS_SUBSCRIBE, now ? "0" : "1");
    syncSubscribeLabel();
    if (!now) alert("✅ Subscribed to Placement Updates (demo).");
  });

  // CSV export
  btnExportCsv.addEventListener("click", () => {
    const visible = filterAndSort(getUpdates());
    const rows = [
      ["Title", "Company", "Tag", "Date", "Branches", "Urgent", "Pinned", "Description"],
    ];
    visible.forEach((u) => {
      rows.push([
        u.title,
        u.company,
        u.tag,
        u.date,
        (u.branches || []).join(";"),
        u.urgent ? "Yes" : "No",
        u.pinned ? "Yes" : "No",
        (u.desc || "").replace(/\n/g, " "),
      ]);
    });
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "placement_updates.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Admin Modal (open/close)
  function openAdmin() {
    adminModal.classList.add("open");
    adminModal.style.display = "block";
  }
  function closeAdmin() {
    adminModal.classList.remove("open");
    adminModal.style.display = "none";
  }

  btnOpenAdmin.addEventListener("click", openAdmin);
  adminClose.addEventListener("click", closeAdmin);
  adminModal.addEventListener("click", (e) => {
    if (e.target === adminModal) closeAdmin();
  });
  adminReset?.addEventListener("click", () => adminForm.reset());

  // Admin form submit
  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(adminForm);
    const arr = getUpdates();
    const nextId = (arr.reduce((m, u) => Math.max(m, u.id), 0) || 0) + 1;
    const branches = (fd.get("branches") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const item = {
      id: nextId,
      title: (fd.get("title") || "").toString().trim(),
      company: (fd.get("company") || "").toString().trim(),
      tag: fd.get("tag"),
      date: fd.get("date"),
      branches,
      urgent: fd.get("urgent") === "on",
      pinned: fd.get("pinned") === "on",
      desc: (fd.get("desc") || "").toString().trim(),
    };

    arr.push(item);
    setUpdates(arr);
    buildCompanyFilter();
    adminForm.reset();
    closeAdmin();
    state.page = 1;
    renderPage();
  });

  // First render
  renderPage();
});
