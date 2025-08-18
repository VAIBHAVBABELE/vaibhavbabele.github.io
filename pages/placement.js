
document.addEventListener("DOMContentLoaded", () => {
  // ----- LocalStorage keys -----
  const LS_UPDATES   = "nm_placement_updates_v1";
  const LS_SUBSCRIBE = "nm_placement_subscribed_v1";

  // ----- Seed data -----
  const seed = [
    { id: 1, title: "Google SDE Online Assessment", company: "Google", tag: "drive", date: "2025-08-18", urgent: true,  pinned: true,  branches:["CSE","ECE"], desc:"OA on 20 Aug, HackerRank link via email. Bring college ID." },
    { id: 2, title: "Infosys Shortlist (Round 1)",   company: "Infosys", tag: "shortlist", date: "2025-08-17", urgent: false, pinned: false, branches:["CSE","ECE","ME"], desc:"Shortlist for Round 2 is out on portal Notice Board." },
    { id: 3, title: "TCS Technical Interviews",       company: "TCS",    tag: "interview", date: "2025-08-20", urgent: false, pinned: true,  branches:["CSE","ECE","CE"], desc:"Slots published. Venue: Lab Block L-2. Reach 15 mins early." },
    { id: 4, title: "Wipro HR Round Reschedule",      company: "Wipro",  tag: "notice",    date: "2025-08-16", urgent: true,  pinned: false, branches:["CSE"], desc:"HR round moved to 22 Aug due to venue conflict." },
    { id: 5, title: "HCL Drive Registration",         company: "HCL",    tag: "drive",     date: "2025-08-27", urgent: false, pinned: false, branches:["CSE","ECE","ME"], desc:"Register before 24 Aug. Eligibility: 7.0+ CGPA." },
    { id: 6, title: "Accenture Interview Results",    company: "Accenture", tag: "shortlist", date: "2025-08-14", urgent: false, pinned: false, branches:["CSE","ECE","CE"], desc:"Stage 1 results announced. Log in to placement portal." },
    { id: 7, title: "LTIMindtree Tech Interview",      company: "LTIMindtree", tag: "interview", date:"2025-08-23", urgent:false, pinned:false, branches:["CSE","ECE"], desc:"Panels 1-4 in Seminar Hall. Dress code formal." },
    { id: 8, title: "Capgemini Aptitude Drive",       company: "Capgemini", tag: "drive", date:"2025-08-29", urgent:false, pinned:false, branches:["CSE","ECE","ME","CE"], desc:"Aptitude + Communication Test. Venue: Main Auditorium." },
    { id: 9, title: "google: Google SDE",             company: "google", tag: "drive", date:"2025-08-05", urgent:false, pinned:false, branches:["CSE"], desc:"Off-campus practice drive (sample item)." }
  ];

  // Storage helpers
  const getUpdates = () => {
    const raw = localStorage.getItem(LS_UPDATES);
    return raw ? JSON.parse(raw) : seed.slice();
  };
  const setUpdates = (arr) => localStorage.setItem(LS_UPDATES, JSON.stringify(arr));

  // Seed once
  if (!localStorage.getItem(LS_UPDATES)) setUpdates(seed);

  // ----- State -----
  let updates = getUpdates();
  let page = 1;
  const PER_PAGE = 6;

  // ----- DOM refs -----
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

  const btnSubscribe = document.getElementById("btnSubscribe");
  const btnExportCsv = document.getElementById("btnExportCsv");
  const btnOpenAdmin = document.getElementById("btnOpenAdmin");

  // ----- Drawer (View) -----
  let drawer = document.getElementById("drawer");
  if (!drawer){
    drawer = document.createElement("div");
    drawer.id = "drawer";
    drawer.innerHTML = `
      <div class="drawer-head">
        <h4 class="drawer-title">Update Details</h4>
        <button class="drawer-close" id="drawerClose" title="Close">&times;</button>
      </div>
      <div class="drawer-body" id="drawerBody"></div>
    `;
    document.body.appendChild(drawer);
  }
  const drawerBody = document.getElementById("drawerBody");
  const closeDrawer = () => drawer.classList.remove("open");
  document.addEventListener("click",(e)=>{
    if(e.target.id === "drawerClose") closeDrawer();
  });

  // ----- Modal (Add Update) -----
  let adminModal = document.getElementById("adminModal");
  if (!adminModal){
    adminModal = document.createElement("div");
    adminModal.id = "adminModal";
    adminModal.innerHTML = `
      <div class="modal-panel">
        <div class="modal-head">
          <h4 class="modal-title">Add Placement Update</h4>
          <button class="modal-close" id="adminClose" title="Close">&times;</button>
        </div>
        <form id="adminForm">
          <div class="form-grid">
            <div class="col-6">
              <label class="form-label">Title</label>
              <input class="form-control" name="title" required placeholder="e.g. Google SDE Online Assessment" />
            </div>
            <div class="col-6">
              <label class="form-label">Company</label>
              <input class="form-control" name="company" required placeholder="e.g. Google" />
            </div>
            <div class="col-4">
              <label class="form-label">Tag</label>
              <select class="form-select" name="tag" required>
                <option value="drive">Drive</option>
                <option value="interview">Interview</option>
                <option value="shortlist">Shortlist</option>
                <option value="notice">Notice</option>
              </select>
            </div>
            <div class="col-4">
              <label class="form-label">Branches (comma)</label>
              <input class="form-control" name="branches" placeholder="CSE,ECE" />
            </div>
            <div class="col-4">
              <label class="form-label">Date</label>
              <input class="form-control" name="date" type="date" required />
            </div>
            <div class="col-12">
              <label class="form-label">Description</label>
              <textarea class="form-control" name="desc" placeholder="Key info, venue, instructions…"></textarea>
            </div>
            <div class="col-12">
              <div class="form-row">
                <label><input type="checkbox" name="urgent" /> Urgent</label>
                <label><input type="checkbox" name="pinned" /> Pinned</label>
              </div>
            </div>
            <div class="col-12 modal-actions">
              <button type="button" class="btn-ghost" id="adminReset">Reset</button>
              <button class="btn-primary" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(adminModal);
  }
  const openModal = () => adminModal.classList.add("active");
  const closeModal = () => adminModal.classList.remove("active");
  document.addEventListener("click",(e)=>{
    if (e.target.id === "adminClose") closeModal();
  });
  const adminForm = document.getElementById("adminForm");
  const adminReset = document.getElementById("adminReset");
  if (btnOpenAdmin) btnOpenAdmin.addEventListener("click", openModal);
  if (adminReset) adminReset.addEventListener("click", () => adminForm.reset());
  if (adminForm){
    adminForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const fd = new FormData(adminForm);
      const nextId = Math.max(...updates.map(u=>u.id)) + 1;
      const newItem = {
        id: nextId,
        title: (fd.get("title") || "").trim(),
        company: (fd.get("company") || "").trim(),
        tag: fd.get("tag"),
        date: fd.get("date"),
        branches: (fd.get("branches") || "").split(",").map(s=>s.trim()).filter(Boolean),
        urgent: !!fd.get("urgent"),
        pinned: !!fd.get("pinned"),
        desc: (fd.get("desc") || "").trim()
      };
      updates.push(newItem);
      setUpdates(updates);
      closeModal();
      page = 1;
      hydrateCompanyFilter();
      render();
    });
  }

  // ----- Subscribe / Export -----
  const updateSubBtn = () => {
    const isSub = localStorage.getItem(LS_SUBSCRIBE) === "1";
    if (btnSubscribe) btnSubscribe.textContent = isSub ? "🔕 Unsubscribe" : "🔔 Subscribe";
  };
  if (btnSubscribe){
    updateSubBtn();
    btnSubscribe.addEventListener("click", ()=>{
      const isSub = localStorage.getItem(LS_SUBSCRIBE) === "1";
      localStorage.setItem(LS_SUBSCRIBE, isSub ? "0" : "1");
      updateSubBtn();
      alert(isSub ? "Unsubscribed." : "Subscribed to placement updates!");
    });
  }
  if (btnExportCsv){
    btnExportCsv.addEventListener("click", ()=>{
      const csv = [
        ["ID","Title","Company","Tag","Date","Urgent","Pinned","Branches","Description"].join(",")
      ];
      updates.forEach(u=>{
        const row = [
          u.id,
          quote(u.title),
          quote(u.company),
          u.tag,
          u.date,
          u.urgent ? "Yes":"No",
          u.pinned ? "Yes":"No",
          quote((u.branches||[]).join(" / ")),
          quote(u.desc || "")
        ].join(",");
        csv.push(row);
      });
      const blob = new Blob([csv.join("\n")], {type:"text/csv;charset=utf-8;"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "placement-updates.csv";
      a.click();
    });
  }
  function quote(s){ return `"${String(s).replace(/"/g,'""')}"`; }

  // ----- Filters -----
  function hydrateCompanyFilter(){
    const cur = fCompanyEl.value;
    const uniq = [...new Set(getUpdates().map(u=>u.company))].sort((a,b)=>a.localeCompare(b));
    fCompanyEl.innerHTML = `<option value="">Company (All)</option>` + uniq.map(c=>`<option value="${c}">${c}</option>`).join("");
    if (uniq.includes(cur)) fCompanyEl.value = cur;
  }
  hydrateCompanyFilter();

  [qEl,fCompanyEl,fTagEl,fBranchEl,fFromEl,fToEl,fSortEl].forEach(el=>{
    if(!el) return;
    el.addEventListener("input", ()=>{ page = 1; render(); });
    el.addEventListener("change", ()=>{ page = 1; render(); });
  });
  if (fResetEl){
    fResetEl.addEventListener("click", ()=>{
      qEl.value = "";
      fCompanyEl.value = "";
      fTagEl.value = "";
      fBranchEl.value = "";
      fFromEl.value = "";
      fToEl.value = "";
      fSortEl.value = "newest";
      page = 1;
      render();
    });
  }

  // ----- Pagination -----
  if (btnPrev) btnPrev.addEventListener("click", ()=>{ if(page>1){ page--; render(); }});
  if (btnNext) btnNext.addEventListener("click", ()=>{ const total = getFiltered().length; const pages = Math.max(1, Math.ceil(total/PER_PAGE)); if(page<pages){ page++; render(); }});

  // ----- Rendering helpers -----
  function getFiltered(){
    const q = qEl.value.trim().toLowerCase();
    const cmp = fCompanyEl.value;
    const tag = fTagEl.value;
    const br = fBranchEl.value;
    const from = fFromEl.value ? new Date(fFromEl.value) : null;
    const to   = fToEl.value   ? new Date(fToEl.value)   : null;

    let arr = getUpdates().slice();

    // search
    if (q){
      arr = arr.filter(u =>
        u.title.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q)
      );
    }
    if (cmp) arr = arr.filter(u => u.company === cmp);
    if (tag) arr = arr.filter(u => u.tag === tag);
    if (br)  arr = arr.filter(u => (u.branches||[]).includes(br));
    if (from) arr = arr.filter(u => new Date(u.date) >= from);
    if (to)   arr = arr.filter(u => new Date(u.date) <= to);

    // sort
    const sort = fSortEl.value || "newest";
    arr.sort((a,b)=>{
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort==="newest" ? db-da : da-db;
    });

    // pin urgent/pinned near top but keep within date sorting by adding small bias
    arr = arr.sort((a,b)=>{
      const ap = (a.pinned?2:0) + (a.urgent?1:0);
      const bp = (b.pinned?2:0) + (b.urgent?1:0);
      return bp - ap;
    });

    return arr;
  }

  function render(){
    updates = getUpdates();
    const filtered = getFiltered();

    // cards
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (page > totalPages) page = totalPages;
    const start = (page-1)*PER_PAGE;
    const slice = filtered.slice(start, start+PER_PAGE);

    cardsEl.innerHTML = slice.map(cardHTML).join("") || `<div class="placement-card"><div class="card-title">No updates found</div><div class="card-company">Try adjusting filters.</div></div>`;
    pageInfoEl.textContent = `Page ${page} / ${totalPages}`;
    btnPrev.disabled = page<=1;
    btnNext.disabled = page>=totalPages;

    // stats
    statTotal.textContent = updates.length;
    const today = new Date(); today.setHours(0,0,0,0);
    const interviewsUpcoming = updates.filter(u => u.tag==="interview" && new Date(u.date)>=today).length;
    const drivesActive = updates.filter(u => u.tag==="drive" && new Date(u.date)>=today).length;
    const shortlistsCount = updates.filter(u => u.tag==="shortlist").length;
    statInterviews.textContent = interviewsUpcoming;
    statDrives.textContent = drivesActive;
    statShortlists.textContent = shortlistsCount;

    // timeline (past announcements)
    const past = updates
      .filter(u => new Date(u.date) < today)
      .sort((a,b)=> new Date(b.date)-new Date(a.date));
    timelineEl.innerHTML = past.length
      ? past.map(u=>`<li><strong>${fmtDate(u.date)}</strong> — ${escapeHTML(u.company)}: ${escapeHTML(u.title)}</li>`).join("")
      : `<li>No past announcements yet.</li>`;
  }

  function cardHTML(u){
    return `
      <div class="placement-card" data-id="${u.id}">
        <div class="card-header">
          <span class="card-chip ${u.tag}">${cap(u.tag)}</span>
          ${u.urgent ? `<span class="badge badge-urgent">Urgent</span>` : ``}
          ${u.pinned ? `<span class="badge badge-pinned">Pinned</span>` : ``}
        </div>
        <div class="card-title">${escapeHTML(u.title)}</div>
        <div class="card-company">Company: <strong>${escapeHTML(u.company)}</strong></div>
        <div class="card-date">${fmtDate(u.date)}</div>
        <div class="chips">
          ${(u.branches||[]).map(b=>`<span class="chip">${escapeHTML(b)}</span>`).join("")}
        </div>
        <div class="card-actions">
          <button class="card-btn btn-view" data-id="${u.id}">View</button>
          <div style="display:flex;gap:8px;">
            <span class="chip ${u.tag}">${cap(u.tag)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // View (drawer) — event delegation
  cardsEl.addEventListener("click",(e)=>{
    const btn = e.target.closest(".btn-view");
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const u = updates.find(x=>x.id===id);
    if(!u) return;

    drawerBody.innerHTML = `
      <div class="drawer-meta">
        <span class="chip ${u.tag}">${cap(u.tag)}</span>
        ${u.urgent ? `<span class="chip urgent">Urgent</span>`:``}
        ${u.pinned ? `<span class="chip pinned">Pinned</span>`:``}
      </div>
      <h3 style="margin:0 0 6px 0;">${escapeHTML(u.title)}</h3>
      <div class="kv"><span class="k">Company</span><span class="v">${escapeHTML(u.company)}</span></div>
      <div class="kv"><span class="k">Date</span><span class="v">${fmtDate(u.date)}</span></div>
      <div class="kv"><span class="k">Branches</span>
        <div class="chips" style="margin-top:6px;">${(u.branches||[]).map(b=>`<span class="chip">${escapeHTML(b)}</span>`).join("") || "-"}</div>
      </div>
      <div class="kv"><span class="k">Description</span><div class="v" style="margin-top:6px; line-height:1.55;">${escapeHTML(u.desc || "-")}</div></div>
    `;
    drawer.querySelector(".drawer-title").textContent = "Update Details";
    drawer.classList.add("open");
  });

  // ----- Utils -----
  function fmtDate(s){
    // Expect YYYY-MM-DD
    const d = new Date(s);
    if (isNaN(d)) return s;
    const opts = { month:"short", day:"numeric", year:"numeric" };
    return d.toLocaleDateString(undefined, opts);
  }
  function cap(s){ return s ? (s[0].toUpperCase()+s.slice(1)) : s; }
  function escapeHTML(s){ return String(s).replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])); }

  // Initial render
  render();
});
