/* =========================================================
   BUILD MY UNIVERSE — premium glass landing page
   Requires js/data.js (PROPERTIES, AGENTS, IMG, formatPrice).
   Lenis (smooth scroll) is optional: the page works without it.
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const byId = (id) => PROPERTIES.find((p) => p.id === id);
  const firstSentence = (t) => (t.match(/^.*?[.!?](\s|$)/) || [t])[0].trim();

  /* ---------- Content: Bangalore homes (cover = first image unless overridden) ---------- */
  const pick = (list) => list.map((x) => {
    const p = byId(x.id);
    return p && { ...p, cover: x.cover || p.images[0] };
  }).filter(Boolean);

  const PROJECTS = pick([
    { id: "nandi-hills-retreat" },
    { id: "whitefield-glasshouse" },
    { id: "sarjapur-lake-villa" },
    { id: "sadashivanagar-residence" },
  ]);

  const STORIES = pick([
    { id: "indiranagar-penthouse", cover: "1511818966892-d7d671e672a2" },
    { id: "yelahanka-courtyard-villa" },
    { id: "devanahalli-farm-estate" },
    { id: "hebbal-lakeview" },
  ]);

  const ALL = [...PROJECTS, ...STORIES];

  /* ---------- Hero: cascade of tilted home cards ---------- */
  const CASCADE = pick([
    { id: "whitefield-glasshouse" },
    { id: "nandi-hills-retreat" },
    { id: "sarjapur-lake-villa" },
    { id: "indiranagar-penthouse" },
    { id: "yelahanka-courtyard-villa" },
    { id: "sadashivanagar-residence" },
  ]);
  const cascade = $("#cascade");
  cascade.innerHTML = CASCADE.map((p, i) => `
    <article class="c-card" data-open="${p.id}" data-pos="${i < 4 ? i : "in"}" aria-label="${p.title}, ${p.area}" tabindex="${i < 4 ? 0 : -1}">
      <img src="${IMG(p.cover, 800)}" alt="${p.title}" ${i > 2 ? 'loading="lazy"' : ""}>
      <span class="price">${formatPrice(p).replace(/<[^>]+>/g, "")}</span>
      <span class="brand"><svg><use href="#bmu-mark"/></svg>${p.title}</span>
    </article>`).join("");
  const cCards = $$(".c-card", cascade);
  let cFirst = 0, cTimer = null;
  function placeCascade() {
    const n = cCards.length;
    cCards.forEach((c, i) => {
      const pos = (i - cFirst + n) % n;
      c.dataset.pos = pos < 4 ? pos : "in";
      c.tabIndex = pos < 4 ? 0 : -1;
    });
  }
  function stepCascade() {
    const leaving = cCards[cFirst];
    cFirst = (cFirst + 1) % cCards.length;
    placeCascade();
    leaving.dataset.pos = "out";
    // once it has flown off, park it (invisibly) at the back of the queue
    setTimeout(() => { leaving.style.transition = "none"; leaving.dataset.pos = "in"; void leaving.offsetWidth; leaving.style.transition = ""; }, 1100);
  }
  const startCascade = () => { if (reduce) return; clearInterval(cTimer); cTimer = setInterval(stepCascade, 4200); };
  cascade.addEventListener("mouseenter", () => clearInterval(cTimer));
  cascade.addEventListener("mouseleave", startCascade);
  cascade.addEventListener("focusin", () => clearInterval(cTimer));
  cascade.addEventListener("focusout", startCascade);
  placeCascade();
  startCascade();

  // floating price chips
  const HOUSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9H3z"/><path d="M9 20v-6h6v6"/></svg>';
  $("#lhChips").innerHTML = pick([{ id: "koramangala-garden-flat" }, { id: "hebbal-lakeview" }, { id: "jp-nagar-family-home" }])
    .map((p, i) => `<button class="chip-f ${i === 0 ? "peach" : ""}" data-open="${p.id}"><i>${HOUSE}</i><div><b>${p.area}</b><span>${formatPrice(p).replace(/<[^>]+>/g, "")}</span></div></button>`).join("");

  /* ---------- Neighbourhood chips ---------- */
  $("#localityChips").innerHTML = LOCALITIES.map((a) =>
    `<a class="chip" href="properties.html?q=${encodeURIComponent(a)}">${a}</a>`).join("");

  /* ---------- FAQ ---------- */
  $$(".faq-q").forEach((q) => q.addEventListener("click", () => {
    const item = q.parentElement;
    const open = !item.classList.contains("open");
    $$(".faq-item").forEach((i) => { i.classList.remove("open"); $(".faq-q", i).setAttribute("aria-expanded", "false"); });
    item.classList.toggle("open", open);
    q.setAttribute("aria-expanded", String(open));
  }));

  /* ---------- Project cards ---------- */
  $("#collection-anchor").insertAdjacentHTML("afterend", PROJECTS.map((p, i) => `
    <section class="panel project" ${i === 0 ? 'id="collection"' : ""} data-panel>
      <div class="panel-bg"><img src="${IMG(p.cover, 2200)}" alt="${p.title}, ${p.area}, ${p.city}" ${i ? 'loading="lazy"' : ""}></div>
      <div class="project-content">
        <div class="project-card glass fade">
          <span class="loc"><span>${p.area}, Bangalore</span><b>${formatPrice(p).replace(/<[^>]+>/g, "")}</b></span>
          <h2 class="rise"><span class="ln"><span>${p.title}</span></span></h2>
          <p>${p.description}</p>
          <div class="project-facts">
            ${p.beds ? `<span>${p.beds} bedrooms</span>` : ""}<span>${p.sqft.toLocaleString("en-IN")} sq.ft</span><span>${p.type}</span>
          </div>
          <div class="project-actions">
            <button class="pill pill--white" data-open="${p.id}">View home</button>
            <button class="pill pill--orange" data-enquire="${p.id}">Book a visit</button>
          </div>
        </div>
      </div>
      <div class="project-count glass"><span>0${i + 1} / 0${PROJECTS.length}</span></div>
    </section>`).join(""));

  /* ---------- Customer stories ---------- */
  $("#storyGrid").innerHTML = STORIES.map((p, i) => `
    <article class="story fade ${i % 2 ? "d1" : ""}" data-open="${p.id}" tabindex="0" aria-label="${p.title}">
      <img src="${IMG(p.cover, 1200)}" alt="${p.title}" loading="lazy">
      <span class="go">${ARROW}</span>
      <div class="story-body glass">
        <h3>${p.title}</h3>
        <div class="tags"><span>${p.area}</span><span>${p.type}</span>${p.beds ? `<span>${p.beds} bed</span>` : ""}</div>
        <p>${firstSentence(p.description)}</p>
      </div>
    </article>`).join("");

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.3, smoothWheel: true, wheelMultiplier: 0.9 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  function goTo(target) {
    const y = target === "top" ? 0 : target.getBoundingClientRect().top + scrollY;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------- Hero entrance ---------- */
  // Start the entrance once the first card photo is ready, or after 1.2s at most.
  const firstImg = $(".c-card img");
  Promise.race([
    firstImg.decode ? firstImg.decode().catch(() => {}) : Promise.resolve(),
    new Promise((r) => setTimeout(r, reduce ? 0 : 1200)),
  ]).then(() => requestAnimationFrame(() => document.body.classList.add("ready")));

  /* ---------- Reveals ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  $$(".rise, .fade").forEach((el) => { if (!el.closest(".hero")) io.observe(el); });

  /* ---------- Cursor light & glass spotlight ---------- */
  const light = $("#cursorLight");
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let lx = innerWidth / 2, ly = innerHeight / 2, tx = lx, ty = ly;
  if (fine && !reduce) {
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      light.classList.add("on");
      const g = e.target instanceof Element && e.target.closest(".glass");
      if (g) {
        const r = g.getBoundingClientRect();
        g.style.setProperty("--mx", `${e.clientX - r.left}px`);
        g.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    }, { passive: true });
    document.addEventListener("pointerleave", () => light.classList.remove("on"));
  }

  /* ---------- Depth: background photos move slower than the page ---------- */
  const bgs = $$(".panel-bg");
  const inline = $$("[data-parallax]");
  const stars = $$(".cosmos .stars");
  function frame() {
    if (fine && !reduce) {
      lx += (tx - lx) * 0.1; ly += (ty - ly) * 0.1;
      light.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
    }
    if (!reduce) {
      const vh = innerHeight;
      stars.forEach((s, i) => { s.style.transform = `translate3d(0, ${(-scrollY * (i ? 0.02 : 0.045)).toFixed(1)}px, 0)`; });
      bgs.forEach((bg) => {
        const r = bg.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        // -1 when the card's centre is above the screen, +1 when below
        const q = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2));
        bg.style.transform = `translate3d(0, ${(-q * 13).toFixed(2)}%, 0)`;
      });
      inline.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        img.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * -+img.dataset.parallax - r.height * 0.1).toFixed(1)}px, 0)`;
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobileMenu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  $("#menuOpen").addEventListener("click", () => setMenu(true));
  $("#menuClose").addEventListener("click", () => setMenu(false));

  /* ---------- Drawer: property details or enquiry ---------- */
  const drawer = $("#drawer"), dPanel = $("#drawerPanel");
  function showDrawer(html) {
    dPanel.innerHTML = `<div class="drawer-close-wrap"><button class="drawer-close" data-close aria-label="Close">✕</button></div>${html}`;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    dPanel.scrollTop = 0;
    if (lenis) lenis.stop(); else document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start(); else document.body.style.overflow = "";
  }
  function openProperty(id) {
    const p = ALL.find((x) => x.id === id) || byId(id);
    if (!p) return;
    const a = AGENTS[p.agent];
    showDrawer(`
      <div class="drawer-hero"><img src="${IMG(p.cover || p.images[0], 1600)}" alt="${p.title}"></div>
      <div class="drawer-body">
        <span class="kicker">${p.mode === "rent" ? "For lease" : "For sale"} · ${p.type}</span>
        <h2>${p.title}</h2>
        <div class="drawer-loc">${p.area}, ${p.city}</div>
        <div class="drawer-facts">
          <div><b>${p.beds || "—"}</b><span>Bedrooms</span></div>
          <div><b>${p.baths}</b><span>Bathrooms</span></div>
          <div><b>${p.sqft.toLocaleString("en-IN")}</b><span>Sq. ft</span></div>
          <div><b>${p.year}</b><span>Built</span></div>
        </div>
        <p>${p.description}</p>
        <ul class="amen">${p.amenities.map((x) => `<li>${x}</li>`).join("")}</ul>
        <div class="thumbs">${p.images.slice(0, 3).map((im) => `<img src="${IMG(im, 600)}" alt="" loading="lazy">`).join("")}</div>
        <div class="drawer-cta">
          <div><span class="kicker">${p.mode === "rent" ? "Rent" : "Price"}</span><div class="price">${formatPrice(p)}</div></div>
          <button class="pill pill--dark pill--lg" data-enquire="${p.id}">Book a visit</button>
        </div>
      </div>`);
  }
  function openEnquiry(id = "") {
    const options = ALL.map((p) => `<option value="${p.id}" ${p.id === id ? "selected" : ""}>${p.title} · ${p.area}</option>`).join("");
    showDrawer(`
      <div class="enquiry">
        <span class="kicker">Book a visit</span>
        <h2>When would you like to come by?</h2>
        <p>Leave your name and number and we'll call you back, usually the same day. The rest is optional.</p>
        <form class="form" id="enquiryForm">
          <div class="row">
            <label>Full name<input class="input" required placeholder="Your name"></label>
            <label>Phone<input class="input" required type="tel" placeholder="+91"></label>
          </div>
          <label>Email<input class="input" type="email" placeholder="you@example.com"></label>
          <div class="row">
            <label>Home of interest<select class="input"><option value="">Not sure yet</option>${options}</select></label>
            <label>Budget<select class="input"><option value="">Select</option><option>Up to ₹2 Cr</option><option>₹2 – 5 Cr</option><option>₹5 – 10 Cr</option><option>₹10 Cr +</option><option>Rental</option></select></label>
          </div>
          <div class="row">
            <label>Preferred locality<select class="input"><option value="">Anywhere in Bangalore</option>${LOCALITIES.map((a) => `<option>${a}</option>`).join("")}</select></label>
            <label>Timeline<select class="input"><option value="">Select</option><option>Ready to move now</option><option>Within 3 months</option><option>3 – 12 months</option><option>Just exploring</option></select></label>
          </div>
          <label>Anything we should know?<textarea class="input" placeholder="Good days to visit, must-haves, questions"></textarea></label>
          <button class="pill pill--orange" type="submit">Send</button>
          <p class="form-ok">Thanks, got it. We'll call you soon.</p>
        </form>
      </div>`);
  }

  /* ---------- Clicks ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-close]")) { closeDrawer(); return; }
    const enq = t.closest("[data-enquire]");
    if (enq) { setMenu(false); openEnquiry(enq.dataset.enquire); return; }
    const open = t.closest("[data-open]");
    if (open) { openProperty(open.dataset.open); return; }
    const a = t.closest('a[href^="#"]');
    if (a) {
      const id = a.getAttribute("href").slice(1);
      const target = id === "top" ? "top" : document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      goTo(target);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeDrawer(); setMenu(false); }
    const story = e.target.closest?.(".story");
    if (story && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProperty(story.dataset.open); }
  });

  /* ---------- Forms ---------- */
  let toastTimer;
  const toast = (msg) => {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3400);
  };
  document.addEventListener("submit", (e) => {
    const f = e.target;
    e.preventDefault();
    if (f.id === "enquiryForm") { f.classList.add("sent"); toast("Thanks, we'll call you soon."); }
    if (f.id === "newsForm") { f.reset(); toast("Thanks, you're signed up."); }
  });
})();
