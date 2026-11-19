/* =========================================================
   BUILD MY UNIVERSE — shared site behaviour
   ========================================================= */
const BRAND = "Build My Universe";
const WHATSAPP = "919820000000"; // replace with your WhatsApp number (country code, no +)

const ICON = {
  arrow: '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  heart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.3 3.3 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.7 0 5.9 3.8 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>',
  pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg>',
  bed: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/></svg>',
  bath: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0"/></svg>',
  area: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const page = document.body.dataset.page;

/* ---------- Favourites (stored per browser) ---------- */
const favStore = {
  get() { try { return JSON.parse(localStorage.getItem("nestora-favs") || "[]"); } catch { return []; } },
  set(v) { try { localStorage.setItem("nestora-favs", JSON.stringify(v)); } catch {} },
  toggle(id) { const f = this.get(); const i = f.indexOf(id); i > -1 ? f.splice(i, 1) : f.push(id); this.set(f); return i === -1; },
  has(id) { return this.get().includes(id); },
};

/* ---------- Header & footer ---------- */
function renderChrome() {
  const links = [
    ["index.html", "Home", "home"],
    ["properties.html?mode=buy", "Buy", "buy"],
    ["properties.html?mode=rent", "Rent", "rent"],
    ["about.html", "About", "about"],
    ["contact.html", "Contact", "contact"],
  ];
  const mode = new URLSearchParams(location.search).get("mode");
  const activeKey = page === "properties" ? (mode === "rent" ? "rent" : mode === "buy" ? "buy" : "") : page;
  const logo = `<a href="index.html" class="logo" aria-label="${BRAND} home">${BRAND}</a>`;

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site-header" id="header">
      <div class="container">
        <nav class="nav" aria-label="Main">
          ${links.map(([h, l, k]) => `<a href="${h}" class="${k === activeKey ? "active" : ""}">${l}</a>`).join("")}
        </nav>
        ${logo}
        <div class="header-actions">
          <a class="icon-btn" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" aria-label="Message us on WhatsApp">${ICON.wa}</a>
          <a class="btn btn--white" href="contact.html">Book a consultation</a>
          <button class="icon-btn menu-toggle" id="menuOpen" aria-label="Open menu">${ICON.menu}</button>
        </div>
      </div>
    </header>
    <div class="progress" aria-hidden="true"></div>
    <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
      <div class="top">${logo}<button class="close-btn" id="menuClose" aria-label="Close menu">${ICON.close}</button></div>
      <nav>${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}</nav>
      <div class="bottom">
        <a class="btn btn--white btn--lg" href="contact.html">Book a consultation</a>
        <a class="btn btn--glass btn--lg" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">${ICON.wa} WhatsApp</a>
      </div>
    </div>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-footer">
      <div class="container">
        ${logo}
        <nav class="footer-links" aria-label="Footer">
          <a href="properties.html?mode=buy">Buy</a><a href="properties.html?mode=rent">Rent</a>
          <a href="contact.html?topic=sell">Sell</a><a href="about.html">About</a><a href="contact.html">Contact</a>
          <a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">YouTube</a>
        </nav>
        <div class="footer-news">
          <h4>Follow the newsletter</h4>
          <form class="subscribe" data-toast="You're subscribed. New listings will land in your inbox first.">
            <input type="email" required placeholder="you@example.com" aria-label="Email address">
            <button class="btn btn--white" type="submit">Submit</button>
          </form>
        </div>
        <div class="footer-offices">
          <div><b>Mumbai</b>12th Floor, Nariman Point · <a href="tel:+912200000000">+91 22 0000 0000</a></div>
          <div><b>Bengaluru</b>80 Feet Road, Indiranagar · <a href="mailto:hello@buildmyuniverse.example">hello@buildmyuniverse.example</a></div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${BRAND} Realty. All rights reserved.</span>
          <span><a href="#">Privacy</a> · <a href="#">Terms</a></span>
        </div>
      </div>
    </footer>
    <div class="toast" id="toast" role="status"></div>`);

  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 30);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const menu = $("#mobileMenu");
  const setMenu = (open) => { menu.classList.toggle("open", open); menu.setAttribute("aria-hidden", !open); document.body.style.overflow = open ? "hidden" : ""; };
  $("#menuOpen").addEventListener("click", () => setMenu(true));
  $("#menuClose").addEventListener("click", () => setMenu(false));
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------- Property card ---------- */
function cardHTML(p) {
  return `
    <article class="card" data-id="${p.id}" tabindex="0" aria-label="${p.title}">
      <div class="card-media">
        <img src="${IMG(p.images[0], 800)}" alt="${p.title}, ${p.area}, ${p.city}" loading="lazy">
        <div class="card-badges">
          <span class="badge ${p.mode === "rent" ? "badge--teal" : ""}">${p.mode === "rent" ? "For rent" : "Available"}</span>
          <button class="fav ${favStore.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Save ${p.title}">${ICON.heart}</button>
        </div>
      </div>
      <div class="card-body">
        <span class="card-icon">${ICON.home}</span>
        <h3 class="card-title">${p.title} · ${p.city}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="card-foot">
          <div class="card-specs">
            ${p.beds ? `<span>${ICON.bed}${p.beds}</span>` : ""}
            <span>${ICON.bath}${p.baths}</span>
            <span>${ICON.area}${p.sqft.toLocaleString("en-IN")}</span>
          </div>
          <span class="card-price">${formatPrice(p)}</span>
        </div>
      </div>
    </article>`;
}

function bindCards(root) {
  root.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      e.stopPropagation();
      const on = favStore.toggle(fav.dataset.fav);
      $$(`[data-fav="${fav.dataset.fav}"]`).forEach((b) => b.classList.toggle("on", on));
      toast(on ? "Saved to your shortlist" : "Removed from your shortlist");
      window.dispatchEvent(new Event("favs-changed"));
      return;
    }
    const card = e.target.closest("[data-id]");
    if (card) openProperty(card.dataset.id);
  });
  root.addEventListener("keydown", (e) => {
    const card = e.target.closest("[data-id]");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProperty(card.dataset.id); }
  });
}

/* ---------- Property modal ---------- */
function ensureModal() {
  if ($("#propModal")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" id="propModal" role="dialog" aria-modal="true" aria-label="Property details">
      <div class="modal-backdrop" data-close></div>
      <div class="modal-panel">
        <div class="modal-close-wrap"><button class="modal-close" data-close aria-label="Close">${ICON.close}</button></div>
        <div class="modal-body" id="modalBody"></div>
      </div>
    </div>`);
  $("#propModal").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeProperty(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeProperty(); });
}

function openProperty(id) {
  const p = PROPERTIES.find((x) => x.id === id);
  if (!p) return;
  ensureModal();
  const a = AGENTS[p.agent];
  const first = a.name.split(" ")[0];
  $("#modalBody").innerHTML = `
    <div class="gallery">${p.images.map((im, i) => `<img src="${IMG(im, i ? 800 : 1400)}" alt="${p.title} photo ${i + 1}">`).join("")}</div>
    <div class="detail-grid">
      <div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="tag">${p.mode === "rent" ? "For rent" : "For sale"}</span>
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <h2>${p.title}</h2>
        <div class="detail-loc">${ICON.pin}${p.area}, ${p.city} · ${p.type}</div>
        <div class="detail-specs">
          <div><b>${p.beds || "—"}</b><span>Bedrooms</span></div>
          <div><b>${p.baths}</b><span>Bathrooms</span></div>
          <div><b>${p.sqft.toLocaleString("en-IN")}</b><span>Sq. ft</span></div>
          <div><b>${p.year}</b><span>Built</span></div>
        </div>
        <h4>About this home</h4>
        <p style="color:var(--muted);margin:0 0 26px">${p.description}</p>
        <h4>Amenities</h4>
        <ul class="amenities">${p.amenities.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>
      <aside class="enquiry">
        <span class="label">${p.mode === "rent" ? "Monthly rent" : "Asking price"}</span>
        <div class="price">${formatPrice(p)}</div>
        <div class="agent"><img src="${a.photo}" alt="${a.name}"><div><b>${a.name}</b><span>${a.role}</span></div></div>
        <form class="form" data-toast="Thanks, ${first} will call you within the hour.">
          <input class="input" required placeholder="Your name" aria-label="Your name">
          <input class="input" required type="tel" placeholder="Phone number" aria-label="Phone number">
          <input class="input" type="date" aria-label="Preferred viewing date">
          <button class="btn btn--white btn--lg" type="submit">Request a viewing ${ICON.arrow}</button>
          <a class="btn btn--glass" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I'm interested in ${p.title} (${p.area}, ${p.city}).`)}">${ICON.wa} WhatsApp ${first}</a>
          <div class="form-success">Request sent. ${first} will be in touch shortly.</div>
        </form>
      </aside>
    </div>`;
  const m = $("#propModal");
  m.classList.add("open");
  $(".modal-panel", m).scrollTop = 0;
  document.body.style.overflow = "hidden";
  history.replaceState(null, "", `#${p.id}`);
}

function closeProperty() {
  const m = $("#propModal");
  if (!m || !m.classList.contains("open")) return;
  m.classList.remove("open");
  document.body.style.overflow = "";
  history.replaceState(null, "", location.pathname + location.search);
}

/* ---------- Forms (front-end only demo) ---------- */
function bindForms() {
  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (!(f instanceof HTMLFormElement) || f.dataset.native !== undefined) return;
    e.preventDefault();
    if (f.dataset.toast) toast(f.dataset.toast);
    if ($(".form-success", f)) f.classList.add("sent");
    else f.reset();
  });
}

/* ---------- Scroll reveal & counters ---------- */
function bindReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.dataset.count) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, [data-count]").forEach((el) => io.observe(el));
}
function countUp(el) {
  const end = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const t0 = performance.now();
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / 1600);
    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 4))).toLocaleString("en-IN") + suffix;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- FAQ ---------- */
function bindFAQ() {
  $$(".faq-q").forEach((q) => q.addEventListener("click", () => {
    const item = q.parentElement;
    const open = !item.classList.contains("open");
    $$(".faq-item.open").forEach((i) => { i.classList.remove("open"); $(".faq-q", i).setAttribute("aria-expanded", "false"); });
    item.classList.toggle("open", open);
    q.setAttribute("aria-expanded", open);
  }));
}

/* ---------- Home page ---------- */
function initHome() {
  // hero search
  const form = $("#heroSearch");
  if (form) {
    const tabs = $$(".search-tabs button", form);
    $("[name=city]", form).insertAdjacentHTML("beforeend", CITIES.map((c) => `<option>${c}</option>`).join(""));
    $("[name=type]", form).insertAdjacentHTML("beforeend", TYPES.map((c) => `<option>${c}</option>`).join(""));
    const fillBudgets = (mode) => {
      const opts = mode === "rent"
        ? [["", "Any budget"], ["50000", "Up to ₹50k /mo"], ["100000", "Up to ₹1 L /mo"], ["250000", "Up to ₹2.5 L /mo"]]
        : [["", "Any budget"], ["20000000", "Up to ₹2 Cr"], ["50000000", "Up to ₹5 Cr"], ["100000000", "Up to ₹10 Cr"]];
      $("[name=max]", form).innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
    };
    tabs.forEach((b) => b.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.toggle("active", x === b));
      $("[name=mode]", form).value = b.dataset.mode;
      fillBudgets(b.dataset.mode);
    }));
    fillBudgets("buy");
  }

  // featured showcase with tabs
  const show = $("#showcase");
  const tabsEl = $("#showTabs");
  if (show && tabsEl) {
    const picks = PROPERTIES.filter((p) => p.featured).slice(0, 4);
    tabsEl.innerHTML = picks.map((p, i) => `<button class="${i ? "" : "active"}" data-i="${i}">${p.title}</button>`).join("");
    const render = (p, animate) => {
      const apply = () => {
        show.dataset.id = p.id;
        show.setAttribute("aria-label", p.title);
        const old = $("img", show);
        const img = new Image();
        img.src = IMG(p.images[0], 1800);
        img.alt = `${p.title}, ${p.area}, ${p.city}`;
        show.prepend(img);
        if (old) { old.classList.add("leaving"); setTimeout(() => old.remove(), 800); }
        $(".showcase-info", show).innerHTML = `
          <div><h3>${p.title}</h3><p>${p.area}, ${p.city} · ${p.beds ? p.beds + " bed · " : ""}${p.sqft.toLocaleString("en-IN")} sq.ft</p></div>
          <div class="showcase-price">${formatPrice(p)}</div>`;
        show.classList.remove("swap");
      };
      if (animate) { show.classList.add("swap"); setTimeout(apply, 250); } else apply();
    };
    render(picks[0], false);
    let current = 0;
    const go = (i) => {
      current = (i + picks.length) % picks.length;
      $$("button", tabsEl).forEach((b, j) => b.classList.toggle("active", j === current));
      render(picks[current], true);
    };
    tabsEl.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { go(+b.dataset.i); restart(); } });
    let timer;
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(current + 1), 6000); };
    restart();
    bindCards(show.parentElement);
  }

  // premium listings grid
  const grid = $("#listingGrid");
  if (grid) {
    grid.innerHTML = PROPERTIES.filter((p) => !p.featured).slice(0, 6).map(cardHTML).join("");
    $$(".card", grid).forEach((c, i) => { c.classList.add("reveal"); c.style.transitionDelay = `${(i % 3) * 0.08}s`; });
    bindCards(grid);
  }

  // testimonials slider
  const t = $("#testimonial");
  if (t) {
    const quotes = [
      { text: "We were buying from Dubai and couldn't visit once. The team ran video tours, checked every document and negotiated ₹40 lakh off. Handover day was the first time we saw our home, and it was perfect.", name: "Ananya & Rohan · Whitefield", img: "1438761681033-6461ffad8d80" },
      { text: "Sold our Worli flat in 31 days, above asking. Every step was explained, every deadline was met, and the photos alone were worth it.", name: "Vikram S. · Worli", img: "1507003211169-0a1dd7228f2d" },
      { text: "Moved to Pune for a new job and had a furnished flat in three days. Honest advice, zero broker drama. I've already recommended them to two colleagues.", name: "Priya N. · Baner", img: "1494790108377-be9c29b29330" },
    ];
    let qi = 0;
    const show = (i) => {
      qi = (i + quotes.length) % quotes.length;
      t.classList.add("swap");
      setTimeout(() => {
        $(".quote-text", t).textContent = `“${quotes[qi].text}”`;
        $(".quote-name", t).textContent = quotes[qi].name;
        $(".portrait img", t).src = IMG(quotes[qi].img, 500);
        t.classList.remove("swap");
      }, 380);
    };
    $("#qPrev").addEventListener("click", () => show(qi - 1));
    $("#qNext").addEventListener("click", () => show(qi + 1));
  }
}

/* ---------- Listings page ---------- */
function initListings() {
  const params = new URLSearchParams(location.search);
  const state = {
    mode: params.get("mode") || "all",
    q: params.get("q") || "",
    city: params.get("city") || "",
    type: params.get("type") || "",
    beds: params.get("beds") || "",
    max: params.get("max") || "",
    sort: "featured",
    saved: false,
  };

  $("#fCity").insertAdjacentHTML("beforeend", CITIES.map((c) => `<option>${c}</option>`).join(""));
  $("#fType").insertAdjacentHTML("beforeend", TYPES.map((c) => `<option>${c}</option>`).join(""));

  function fillMax() {
    const opts = state.mode === "rent"
      ? [["", "Any budget"], ["50000", "≤ ₹50k /mo"], ["100000", "≤ ₹1 L /mo"], ["250000", "≤ ₹2.5 L /mo"], ["1000000", "≤ ₹10 L /mo"]]
      : state.mode === "buy"
        ? [["", "Any budget"], ["20000000", "≤ ₹2 Cr"], ["50000000", "≤ ₹5 Cr"], ["100000000", "≤ ₹10 Cr"]]
        : [["", "Any budget"]];
    $("#fMax").innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
    $("#fMax").disabled = state.mode === "all";
  }
  const sync = () => {
    $$("#fMode button").forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
    $("#fQ").value = state.q; $("#fCity").value = state.city; $("#fType").value = state.type;
    $("#fBeds").value = state.beds; $("#fSort").value = state.sort;
    $("#fSaved").classList.toggle("is-on", state.saved);
    fillMax();
    $("#fMax").value = state.max;
    if (!$("#fMax").value) state.max = "";
    $("#listTitle").textContent = state.mode === "rent" ? "Homes to rent" : state.mode === "buy" ? "Homes for sale" : "Every listing";
  };

  const grid = $("#results");
  bindCards(grid);

  const render = () => {
    const q = state.q.trim().toLowerCase();
    const favs = favStore.get();
    let list = PROPERTIES.filter((p) =>
      (state.mode === "all" || p.mode === state.mode) &&
      (!state.city || p.city === state.city) &&
      (!state.type || p.type === state.type) &&
      (!state.beds || p.beds >= +state.beds) &&
      (!state.max || p.price <= +state.max) &&
      (!state.saved || favs.includes(p.id)) &&
      (!q || [p.title, p.city, p.area, p.type, ...p.tags].join(" ").toLowerCase().includes(q))
    );
    const sorters = {
      featured: (a, b) => b.featured - a.featured,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      size: (a, b) => b.sqft - a.sqft,
      newest: (a, b) => b.year - a.year,
    };
    list = list.sort(sorters[state.sort]);
    $("#count").innerHTML = `<b>${list.length}</b> ${list.length === 1 ? "property" : "properties"} found`;
    grid.innerHTML = list.length
      ? `<div class="grid">${list.map(cardHTML).join("")}</div>`
      : `<div class="empty"><h3>Nothing matches. Yet.</h3><p>Try widening your filters, or tell us your brief and we'll check our off-market list.</p><button class="btn btn--teal" id="resetFilters">Reset filters</button></div>`;
    $$("#results .card").forEach((c, i) => { c.classList.add("reveal"); c.style.transitionDelay = `${(i % 3) * 0.06}s`; requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("in"))); });

    const url = new URLSearchParams();
    ["mode", "q", "city", "type", "beds", "max"].forEach((k) => { if (state[k] && !(k === "mode" && state[k] === "all")) url.set(k, state[k]); });
    history.replaceState(null, "", `${location.pathname}${url.toString() ? "?" + url : ""}${location.hash}`);
  };

  const update = (patch) => { Object.assign(state, patch); sync(); render(); };

  $("#fMode").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) update({ mode: b.dataset.mode, max: "" }); });
  let qt; $("#fQ").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => update({ q: e.target.value }), 180); });
  $("#fCity").addEventListener("change", (e) => update({ city: e.target.value }));
  $("#fType").addEventListener("change", (e) => update({ type: e.target.value }));
  $("#fBeds").addEventListener("change", (e) => update({ beds: e.target.value }));
  $("#fMax").addEventListener("change", (e) => update({ max: e.target.value }));
  $("#fSort").addEventListener("change", (e) => update({ sort: e.target.value }));
  $("#fSaved").addEventListener("click", () => update({ saved: !state.saved }));
  grid.addEventListener("click", (e) => { if (e.target.id === "resetFilters") update({ mode: "all", q: "", city: "", type: "", beds: "", max: "", saved: false }); });
  addEventListener("favs-changed", () => { if (state.saved) render(); });

  sync(); render();
}

/* ---------- Contact page ---------- */
function initContact() {
  const topic = new URLSearchParams(location.search).get("topic");
  if (topic) { const el = $(`input[name=topic][value=${topic}]`); if (el) el.checked = true; }
}

/* ---------- Boot ---------- */
renderChrome();
bindForms();
bindFAQ();
if (page === "home") initHome();
if (page === "properties") initListings();
if (page === "contact") initContact();
bindReveal();
if (location.hash && PROPERTIES.some((p) => p.id === location.hash.slice(1))) openProperty(location.hash.slice(1));
