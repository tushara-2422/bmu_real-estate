/* =========================================================
   Build My Universe — single-page site
   Needs js/data.js (PROPERTIES, IMG, formatPrice, LOCALITIES, TYPES)
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, "0");
  const plain = (p) => formatPrice(p).replace(/<[^>]+>/g, "").trim();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const options = (list) => list.map((v) => `<option>${v}</option>`).join("");
  const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.3 3.3 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.7 0 5.9 3.8 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>';

  /* ---------- Fill the dropdowns ---------- */
  $("#fArea").insertAdjacentHTML("beforeend", options(LOCALITIES));
  $("#cArea").insertAdjacentHTML("beforeend", options(LOCALITIES));
  $("#fType").insertAdjacentHTML("beforeend", options(TYPES));
  $("#cHome").insertAdjacentHTML("beforeend", PROPERTIES.map((p) => `<option value="${p.id}">${p.title}, ${p.area}</option>`).join(""));

  /* ---------- Saved homes (kept in this browser only) ---------- */
  const saved = {
    get() { try { return JSON.parse(localStorage.getItem("bmu-saved") || "[]"); } catch { return []; } },
    toggle(id) {
      const list = this.get(); const i = list.indexOf(id);
      i > -1 ? list.splice(i, 1) : list.push(id);
      try { localStorage.setItem("bmu-saved", JSON.stringify(list)); } catch {}
      return i === -1;
    },
  };

  /* =========================================================
     HOMES: a fanned deck of cards. The middle one is in focus,
     the rest sit smaller behind it. Moves on by itself.
     ========================================================= */
  const state = { mode: "", areas: [], type: "", max: 0 };
  const SLIDE_MS = 3000;
  const PIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
  const CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
  const deck = $("#deck"), track = $("#deckTrack"), deckBg = $("#deckBg");
  let list = [], idx = 0, elapsed = 0, paused = false, homesVisible = false, cards = [];

  const matches = (p) => (!state.mode || p.mode === state.mode)
    && (!state.areas.length || state.areas.includes(p.area))
    && (!state.type || p.type === state.type)
    && (!state.max || p.price <= state.max);

  const card = (p, i) => `
    <article class="hc" data-i="${i}" aria-label="${p.title}">
      <div class="hc-img">
        <img src="${IMG(p.images[0], 700)}" alt="${p.title}" loading="${i < 4 ? "eager" : "lazy"}">
        <span class="hc-tag">${p.mode === "rent" ? "For rent" : "For sale"}</span>
        <button class="save${saved.get().includes(p.id) ? " on" : ""}" data-save="${p.id}" aria-label="Save ${p.title}">${HEART}</button>
      </div>
      <div class="hc-body">
        <h3>${p.title}</h3>
        <p class="hc-where">${PIN}${p.area}, ${p.city}</p>
        <h4>About this home</h4>
        <p class="hc-desc">${p.description}</p>
        <div class="hc-stats">
          <div><span>Bedrooms</span><b>${p.beds || "Studio"}</b></div>
          <div><span>Bathrooms</span><b>${p.baths}</b></div>
          <div><span>Sq ft</span><b>${p.sqft.toLocaleString("en-IN")}</b></div>
        </div>
        <div class="hc-foot">
          <div class="hc-price"><span>${p.mode === "rent" ? "Rent" : "Price"}</span>${formatPrice(p)}</div>
          <button class="hc-go" data-visit="${p.id}" aria-label="Book a visit to ${p.title}">${CAL}</button>
        </div>
      </div>
    </article>`;

  function render(animate = true) {
    list = PROPERTIES.filter(matches);
    $("#empty").hidden = list.length > 0;
    deck.hidden = list.length === 0;
    deck.classList.toggle("single", list.length < 2);
    track.innerHTML = list.map(card).join("");
    cards = $$(".hc", track);
    $$("#modeTabs button").forEach((b) => b.classList.toggle("on", b.dataset.mode === state.mode));
    moveTabPill();
    if (!list.length) return;
    // fresh cards start stacked in the middle, then fan out
    if (animate && !reduce) {
      cards.forEach((c) => c.classList.add("stacked"));
      requestAnimationFrame(() => cards.forEach((c, i) => setTimeout(() => c.classList.remove("stacked"), 60 + Math.min(i, 6) * 50)));
    }
    show(0);
    sizeDeck();
  }

  // where each card sits, by how far it is from the middle one
  const SLOTS = [{ x: 0, s: 1 }, { x: 0.72, s: 0.84 }, { x: 1.2, s: 0.7 }];
  function layout() {
    if (!cards.length) return;
    const w = cards[0].offsetWidth, n = cards.length, narrow = innerWidth < 640;
    cards.forEach((c, i) => {
      let d = i - idx;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const a = Math.abs(d), slot = SLOTS[Math.min(a, 2)];
      const x = Math.sign(d) * (narrow ? Math.min(a, 2) * 0.58 : slot.x) * w;
      c.style.setProperty("--x", `${x.toFixed(1)}px`);
      c.style.setProperty("--s", narrow && a ? 0.82 : slot.s);
      c.style.zIndex = 10 - a;
      c.classList.toggle("active", a === 0);
      c.classList.toggle("near", a === 1);
      c.classList.toggle("gone", a > (narrow ? 1 : 2));
      c.toggleAttribute("inert", a > 0);
    });
  }
  function sizeDeck() {
    if (cards[0]) deck.style.setProperty("--h", `${cards[0].offsetHeight}px`);
    layout();
  }
  addEventListener("resize", sizeDeck);
  document.fonts?.ready.then(sizeDeck);

  function show(i) {
    if (!list.length) return;
    idx = (i + list.length) % list.length;
    elapsed = 0;
    layout();
    deck.setAttribute("aria-label", `Homes, ${idx + 1} of ${list.length}: ${list[idx].title}`);
    // the backdrop fades to a soft, dark copy of the home in front
    const img = new Image();
    img.src = IMG(list[idx].images[0], 1000);
    img.alt = "";
    deckBg.append(img);
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add("on")));
    $$("img", deckBg).slice(0, -1).forEach((o) => { o.classList.remove("on"); setTimeout(() => o.remove(), 1400); });
  }

  // timer: moves on every few seconds while the section is on screen and not hovered
  let last = performance.now();
  (function tick(now) {
    const dt = now - last; last = now;
    if (!paused && homesVisible && !document.hidden && list.length > 1 && !reduce) elapsed += dt;
    if (elapsed >= SLIDE_MS) show(idx + 1);
    requestAnimationFrame(tick);
  })(last);
  new IntersectionObserver(([en]) => { homesVisible = en.isIntersecting; }, { threshold: 0.35 }).observe(deck);
  // keeps moving on hover; it only waits while a home is open in the drawer
  $("#dkPrev").addEventListener("click", () => show(idx - 1));
  $("#dkNext").addEventListener("click", () => show(idx + 1));
  deck.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1); }
    if (e.key === "Enter" && e.target === deck && list[idx]) openHome(list[idx].id);
  });

  // scroll sideways on a trackpad (or Shift + mouse wheel) to move through the deck;
  // plain up/down scrolling still moves the page
  let wheelSum = 0, wheelLock = 0, wheelReset;
  deck.addEventListener("wheel", (e) => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (!dx || list.length < 2) return;
    e.preventDefault();
    clearTimeout(wheelReset);
    wheelReset = setTimeout(() => { wheelSum = 0; }, 200);
    if (performance.now() < wheelLock) return;
    wheelSum += dx;
    if (Math.abs(wheelSum) > 45) { show(idx + Math.sign(wheelSum)); wheelSum = 0; wheelLock = performance.now() + 480; }
  }, { passive: false });

  // swipe or drag sideways to move through the deck
  let drag = null, dragged = false;
  deck.addEventListener("pointerdown", (e) => { drag = e.target.closest("button") ? null : { x: e.clientX, y: e.clientY }; dragged = false; });
  addEventListener("pointerup", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { dragged = true; show(idx + (dx < 0 ? 1 : -1)); }
  });
  addEventListener("pointercancel", () => { drag = null; });
  // a side card comes to the middle; the middle card opens the home
  track.addEventListener("click", (e) => {
    if (dragged) { dragged = false; return; }
    const c = e.target.closest(".hc");
    if (!c || e.target.closest("button")) return;
    const i = +c.dataset.i;
    i === idx ? openHome(list[i].id) : show(i);
  });

  // sliding gold pill behind the active tab
  const tabs = $("#modeTabs");
  tabs.insertAdjacentHTML("afterbegin", '<span class="pill-bg" aria-hidden="true"></span>');
  function moveTabPill() {
    const on = $("button.on", tabs), bg = $(".pill-bg", tabs);
    if (!on) return;
    bg.style.width = `${on.offsetWidth}px`;
    bg.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  addEventListener("resize", moveTabPill);

  function setAreas(areas, label) {
    state.areas = areas;
    const sel = $("#fArea");
    sel.querySelector("option[data-group]")?.remove();
    if (areas.length > 1) {
      sel.insertAdjacentHTML("beforeend", `<option data-group value="group">${label}</option>`);
      sel.value = "group";
    } else sel.value = areas[0] || "";
  }
  const scrollToHomes = () => $("#homes").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  $$("#modeTabs button").forEach((b) => b.addEventListener("click", () => { state.mode = b.dataset.mode; render(); }));
  $("#fArea").addEventListener("change", (e) => { if (e.target.value !== "group") setAreas(e.target.value ? [e.target.value] : []); render(); });
  $("#fType").addEventListener("change", (e) => { state.type = e.target.value; render(); });
  $("#resetFilters").addEventListener("click", () => {
    Object.assign(state, { mode: "", type: "", max: 0 }); setAreas([]); $("#fType").value = ""; render();
  });
  // area cards and the footer's area links
  $$("[data-areas]").forEach((a) => a.addEventListener("click", () => {
    // picking an area shows everything there, whatever was filtered before
    Object.assign(state, { mode: "", type: "", max: 0 }); $("#fType").value = "";
    setAreas(a.dataset.areas.split("|"), a.dataset.label || a.querySelector("h3")?.textContent || a.textContent);
    render();
    scrollToHomes();
  }));
  render(false);

  /* ---------- Home details drawer ---------- */
  const drawer = $("#drawer"), panel = $("#drawerPanel");
  function openHome(id) {
    const p = PROPERTIES.find((x) => x.id === id);
    if (!p) return;
    panel.innerHTML = `
      <div class="d-close-wrap"><button class="d-close" data-close aria-label="Close">✕</button></div>
      <div class="d-hero"><img src="${IMG(p.images[0], 1400)}" alt="${p.title}"></div>
      <div class="d-body">
        <h2>${p.title}</h2>
        <p class="d-where">${p.area}, ${p.city} · ${p.type} · ${p.mode === "rent" ? "For rent" : "For sale"}</p>
        <div class="d-facts">
          <div><b>${p.beds || "–"}</b><span>Bedrooms</span></div>
          <div><b>${p.baths}</b><span>Bathrooms</span></div>
          <div><b>${p.sqft.toLocaleString("en-IN")}</b><span>Sq ft</span></div>
          <div><b>${p.year}</b><span>Built</span></div>
        </div>
        <p>${p.description}</p>
        <ul class="d-tags">${p.amenities.map((x) => `<li>${x}</li>`).join("")}</ul>
        <div class="d-thumbs">${p.images.slice(1, 4).map((im) => `<img src="${IMG(im, 500)}" alt="" loading="lazy">`).join("")}</div>
        <div class="d-foot">
          <div class="d-price">${formatPrice(p)}</div>
          <button class="btn btn--gold" data-visit="${p.id}">Book a visit</button>
        </div>
      </div>`;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    panel.scrollTop = 0;
    document.body.style.overflow = "hidden";
    paused = true;
    $(".d-close", panel).focus();
  }
  function closeHome() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    paused = false;
  }
  function goToContact(fields = {}) {
    if (fields.topic) $("#cTopic").value = fields.topic;
    if (fields.home) {
      $("#cHome").value = fields.home;
      const p = PROPERTIES.find((x) => x.id === fields.home);
      if (p) { $("#cTopic").value = p.mode === "rent" ? "Rent" : "Buy"; $("#cArea").value = p.area; }
    }
    $("#contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    fitAll();
    setTimeout(() => $("#contactForm input[name=name]").focus({ preventScroll: true }), 800);
  }

  /* ---------- Clicks ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const save = t.closest("[data-save]");
    if (save) {
      e.stopPropagation();
      const on = saved.toggle(save.dataset.save);
      save.classList.toggle("on", on);
      save.classList.remove("pop"); void save.offsetWidth; save.classList.add("pop");
      toast(on ? "Saved. You'll find it here next time." : "Removed from your saved homes.");
      return;
    }
    if (t.closest("[data-close]")) { closeHome(); return; }
    const visit = t.closest("[data-visit]");
    if (visit) { closeHome(); goToContact({ home: visit.dataset.visit }); return; }
    const open = t.closest("[data-open]");
    if (open) { openHome(open.dataset.open); return; }
    const help = t.closest(".help-row");
    if (help) { goToContact({ topic: help.dataset.topic }); return; }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeHome(); setMenu(false); } });

  /* ---------- Questions open and close smoothly ---------- */
  $$(".q").forEach((d) => {
    const summary = $("summary", d);
    const body = document.createElement("div");
    body.className = "q-body";
    [...d.children].filter((c) => c !== summary).forEach((c) => body.append(c));
    d.append(body);
    summary.addEventListener("click", (e) => {
      if (reduce) return;
      e.preventDefault();
      if (d.open) {
        const h = body.offsetHeight;
        body.animate([{ height: `${h}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" })
          .onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" });
      }
    });
  });

  /* ---------- Buy / Sell / Rent ---------- */
  const helpRows = $(".help-rows"), rowsList = $$(".help-row");
  // split each big word into letters that can roll over to gold
  rowsList.forEach((row) => {
    const w = $(".hr-word", row), word = w.textContent.trim();
    row.setAttribute("aria-label", `${word}. ${$(".hr-note", row).textContent}`);
    w.innerHTML = [...word].map((ch, l) => `<span class="hl-l" style="--l:${l}"><span>${ch}</span><span aria-hidden="true">${ch}</span></span>`).join("");
  });
  // once the rows have risen in, hover responds without the entrance delays
  const settle = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    setTimeout(() => helpRows.classList.add("settled"), 2000);
    settle.disconnect();
  }, { threshold: 0.2 });
  settle.observe(helpRows);
  // no hover on phones: the row in the middle of the screen lights up instead
  if (!fine) {
    const mid = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle("live", en.isIntersecting)), { rootMargin: "-42% 0px -42% 0px" });
    rowsList.forEach((r) => mid.observe(r));
  }

  // photo that follows the pointer and leans the way it's moving
  const preview = $("#helpPreview"), pImg = $("img", preview), pTag = $(".hp-tag", preview);
  if (fine && !reduce) {
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
    const follow = () => {
      const dx = tx - px;
      px += dx * 0.14; py += (ty - py) * 0.14;
      preview.style.translate = `${px.toFixed(1)}px ${py.toFixed(1)}px`;
      preview.style.rotate = `${clamp(dx * 0.06, -10, 10).toFixed(2)}deg`;
      raf = requestAnimationFrame(follow);
    };
    rowsList.forEach((row) => row.addEventListener("mouseenter", (e) => {
      if (!preview.classList.contains("on")) { tx = px = e.clientX; ty = py = e.clientY; }
      const src = IMG(row.dataset.img, 520);
      if (pImg.getAttribute("src") !== src) {
        pImg.src = src;
        pImg.classList.remove("swap"); void pImg.offsetWidth; pImg.classList.add("swap");
      }
      pTag.textContent = `${row.dataset.topic} with us`;
      preview.classList.add("on");
      if (!raf) follow();
    }));
    helpRows.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    helpRows.addEventListener("mouseleave", () => { preview.classList.remove("on"); cancelAnimationFrame(raf); raf = 0; preview.style.rotate = "0deg"; });
  }

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobileMenu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  $("#menuOpen").addEventListener("click", () => setMenu(true));
  $("#menuClose").addEventListener("click", () => setMenu(false));
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Contact form ---------- */
  const cForm = $("#contactForm"), tfFields = $$(".tf-field input, .tf-field select", cForm);
  // inline fields grow and shrink to fit what's in them
  const measure = document.createElement("canvas").getContext("2d");
  function fit(el) {
    const cs = getComputedStyle(el);
    measure.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const text = el.tagName === "SELECT" ? el.options[el.selectedIndex]?.text || "" : el.value || el.placeholder;
    el.style.width = `${Math.ceil(measure.measureText(text).width) + (el.tagName === "SELECT" ? 30 : 8)}px`;
    el.closest(".tf-field").classList.toggle("filled", !!el.value);
  }
  function fitAll() { tfFields.forEach(fit); }
  $$(".tf-field input", cForm).forEach((el, i) => { const f = el.closest(".tf-field"); f.classList.add("need"); f.style.setProperty("--hd", `${i * 1.4}s`); });
  // the photo leans a little with the pointer
  const talkSide = $(".talk-side");
  // the photos behind "Let's talk" take turns while the section is on screen
  const talkImgs = $$(".talk-img", talkSide);
  let talkIdx = 0, talkTimer = 0;
  const talkLoad = () => talkImgs.forEach((im) => { if (im.dataset.src) { im.src = im.dataset.src; delete im.dataset.src; } });
  const talkNext = () => {
    const prev = talkImgs[talkIdx];
    talkIdx = (talkIdx + 1) % talkImgs.length;
    const next = talkImgs[talkIdx];
    next.classList.toggle("fresh", false); void next.offsetWidth;
    next.classList.add("on", "fresh");
    prev.classList.toggle("on", false);
  };
  if (!reduce && talkImgs.length > 1) {
    new IntersectionObserver(([en]) => {
      clearInterval(talkTimer);
      if (en.isIntersecting) talkLoad();
      if (en.isIntersecting) talkTimer = setInterval(() => { if (!document.hidden) talkNext(); }, 4000);
    }, { threshold: 0.2 }).observe(talkSide);
  }
  if (fine && !reduce) {
    talkSide.addEventListener("pointermove", (e) => {
      const r = talkSide.getBoundingClientRect();
      talkSide.style.setProperty("--tx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      talkSide.style.setProperty("--ty", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    talkSide.addEventListener("pointerleave", () => { talkSide.style.setProperty("--tx", 0); talkSide.style.setProperty("--ty", 0); });
  }
  tfFields.forEach((el) => {
    el.addEventListener("input", () => { fit(el); el.closest(".tf-field").classList.remove("bad"); });
    el.addEventListener("change", () => fit(el));
  });
  fitAll();
  document.fonts?.ready.then(fitAll);

  cForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = cForm.elements.name, phone = cForm.elements.phone;
    const missing = [name, phone].filter((el) => !el.value.trim() || (el === phone && el.value.replace(/\D/g, "").length < 10));
    missing.forEach((el) => { const f = el.closest(".tf-field"); f.classList.remove("bad"); void f.offsetWidth; f.classList.add("bad"); });
    if (missing.length) {
      $("#tfError").textContent = missing.length === 2 ? "Please add your name and a phone number." : missing[0] === name ? "Please add your name." : "Please add a phone number we can call.";
      missing[0].focus();
      return;
    }
    $("#tfError").textContent = "";
    const first = name.value.trim().split(/\s+/)[0];
    $("#okTitle").textContent = `Thanks, ${first}.`;
    $("#okText").textContent = `We'll call you on ${phone.value.trim()} soon, usually the same day.`;
    const btn = $(".tf-send", cForm);
    btn.classList.add("flying");
    setTimeout(() => { cForm.classList.add("sent"); btn.classList.remove("flying"); }, reduce ? 0 : 700);
  });
  $("#okAgain").addEventListener("click", () => { cForm.reset(); cForm.classList.remove("sent"); fitAll(); });

  // are we open right now? (Bangalore time)
  (function hours() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = now.getDay(), h = now.getHours() + now.getMinutes() / 60, workday = day >= 1 && day <= 6;
    const open = workday && h >= 10 && h < 19;
    let text = "Open now, until 7pm today";
    if (!open) text = workday && h < 10 ? "Closed right now. We open at 10am today." : day === 6 || day === 0 ? "Closed right now. We're back on Monday at 10am." : "Closed right now. We're back tomorrow at 10am.";
    $("#openNow").textContent = text;
    $(".talk-hours").classList.toggle("closed", !open);
  })();
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  /* =========================================================
     MOTION
     ========================================================= */

  // Split headings into words that rise into place.
  function splitWords(el) {
    let i = 0;
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(" "); return; }
          const w = document.createElement("span"); w.className = "sw";
          const inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--i", i++);
          w.append(inner); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(el);
  }
  if (!reduce) $$("h2").forEach((h) => { h.classList.remove("reveal"); splitWords(h); });
  // hero headline: split into letters so they can pop up one by one
  if (!reduce) {
    let c = 0;
    $$(".hero-title > span").forEach((line) => {
      line.innerHTML = line.textContent.split(" ").map((word) => `<span class="hw">${[...word].map((ch) => `<span class="ch" style="--c:${c++}">${ch}</span>`).join("")}</span>`).join(" ");
    });
  }

  // Footer wordmark: letters rise one by one.
  const fWord = $("#fWord");
  fWord.innerHTML = [...fWord.textContent].map((ch, i) => (ch === " " ? " " : `<span class="fl" style="--i:${i}">${ch}</span>`)).join("");

  // Scroll story: which chapter is showing.
  const story = $("#story"), storyBgs = $$(".story-bg", story), storyItems = $$(".story-list li", story), storyCard = $(".story-card", story);
  const STORY = [{"label":"Mornings","q":"Which way does the bedroom face, and does it get the early light?"},{"label":"Commute","q":"How long is the drive to your office at 9 in the morning?"},{"label":"School run","q":"Which good schools can you reach without a long drive?"},{"label":"The view","q":"What will you be looking at every evening?"}];
  let storyK = 0;
  function setChapter(k) {
    if (k === storyK) return;
    storyK = k;
    storyBgs.forEach((img, i) => img.classList.toggle("on", i === k));
    storyItems.forEach((li, i) => { li.classList.toggle("on", i === k); li.classList.toggle("done", i < k); });
    $("#storyLabel").textContent = STORY[k].label;
    $("#storyQ").textContent = STORY[k].q;
    $("#storyNum").textContent = pad(k + 1);
    storyCard.classList.remove("swap"); void storyCard.offsetWidth; storyCard.classList.add("swap");
  }

  // Staggered groups: give each child its index.
  $$("[data-stagger]").forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty("--i", i)));

  // Reveal on scroll.
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const t = en.target;
    t.classList.add(t.matches("h2, .hero-title") ? "split-in" : "in");
    io.unobserve(t);
  }), { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  $$(".reveal, [data-stagger], #chevrons, h2, #fWord").forEach((el) => { if (!el.closest(".hero")) io.observe(el); });

  // Hero entrance once the photo is ready.
  const heroImg = $(".frame-img");
  Promise.race([heroImg.decode ? heroImg.decode().catch(() => {}) : Promise.resolve(), new Promise((r) => setTimeout(r, 1200))])
    .then(() => requestAnimationFrame(() => {
      document.documentElement.classList.add("ready");
      setTimeout(() => $(".hero-title").classList.add("split-in"), 250);
      // load the other hero photos once the first one is up
      setTimeout(() => HERO.slice(1).forEach((p) => { new Image().src = IMG(p.images[0], 2200); }), 1500);
    }));

  // Hero slideshow: a few homes we like, each one opening out of the last.
  const frame = $(".frame"), heroSlides = $("#heroSlides");
  const HERO = ["sarjapur-lake-villa", "nandi-hills-retreat", "sadashivanagar-residence", "whitefield-glasshouse"].map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean);
  const HERO_MS = 7000;
  let hIdx = 0, hElapsed = 0, hLast = performance.now();
  function heroGo(i) {
    hIdx = (i + HERO.length) % HERO.length;
    hElapsed = 0;
    const p = HERO[hIdx];
    const img = new Image();
    img.className = "hs on enter";
    img.alt = p.title;
    img.style.setProperty("--kx", hIdx % 2 ? "-1.5%" : "1.5%");
    img.src = IMG(p.images[0], 2200);
    const old = $$(".hs", heroSlides);
    const put = () => {
      if (HERO[hIdx] !== p) return; // someone already moved on
      heroSlides.append(img);
      setTimeout(() => old.forEach((o) => o.remove()), 1900);
    };
    (img.decode ? img.decode() : Promise.resolve()).then(put, put);
  }
  (function heroTick(now) {
    const dt = now - hLast; hLast = now;
    if (!reduce && !document.hidden && scrollY < innerHeight && document.documentElement.classList.contains("ready")) hElapsed += dt;
    if (hElapsed >= HERO_MS) heroGo(hIdx + 1);
    requestAnimationFrame(heroTick);
  })(hLast);
  // photo prints that pop up in the hero; each opens its home
  const heroPops = $("#heroPops");
  heroPops.innerHTML = ["indiranagar-penthouse", "hebbal-lakeview", "jp-nagar-family-home"]
    .map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean)
    .map((p, i) => `<button class="pop" style="--i:${i}" data-open="${p.id}" aria-label="See ${p.title}"><img src="${IMG(p.images[0], 500)}" alt=""><b>${p.area}</b><small>${plain(p)}</small></button>`).join("");
  setTimeout(() => heroPops.classList.add("settled"), 4800);

  // the photo and the words drift a little with the pointer
  if (fine && !reduce) {
    frame.addEventListener("pointermove", (e) => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      frame.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    frame.addEventListener("pointerleave", () => { frame.style.setProperty("--px", 0); frame.style.setProperty("--py", 0); });
  }

  // Pointer: cursor light, glass spotlight, card tilt, magnetic buttons.
  const light = $("#cursorLight");
  if (fine && !reduce) {
    let lx = innerWidth / 2, ly = innerHeight / 2, tx = lx, ty = ly, tilted = null, pulled = null;
    (function loop() { lx += (tx - lx) * 0.1; ly += (ty - ly) * 0.1; light.style.transform = `translate3d(${lx}px, ${ly}px, 0)`; requestAnimationFrame(loop); })();
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      light.classList.add("on");
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      const g = t.closest(".glass");
      if (g) { const r = g.getBoundingClientRect(); g.style.setProperty("--mx", `${e.clientX - r.left}px`); g.style.setProperty("--my", `${e.clientY - r.top}px`); }
      const card = t.closest(".area");
      if (tilted && tilted !== card) tilted.style.transform = "";
      tilted = card;
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
      }
      const mag = t.closest(".btn, .s-go, .hr-arrow, .icon-btn, .dk-side, .hc-go");
      if (pulled && pulled !== mag) pulled.style.translate = "";
      pulled = mag;
      if (mag) { const r = mag.getBoundingClientRect(); mag.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`; }
    }, { passive: true });
    document.addEventListener("pointerleave", () => { light.classList.remove("on"); if (tilted) tilted.style.transform = ""; if (pulled) pulled.style.translate = ""; });
  }

  // Navbars: a pill slides under the links (hover in the top bar, current section in the floating one).
  function navPill(nav) {
    const ind = document.createElement("span");
    ind.className = "nav-ind";
    ind.setAttribute("aria-hidden", "true");
    nav.prepend(ind);
    return (a) => {
      if (!a) { ind.classList.remove("on"); return; }
      const fresh = !ind.classList.contains("on");
      if (fresh) ind.style.transition = "none";
      ind.style.width = `${a.offsetWidth}px`;
      ind.style.transform = `translateX(${a.offsetLeft}px)`;
      if (fresh) { void ind.offsetWidth; ind.style.transition = ""; }
      ind.classList.add("on");
    };
  }
  const topnav = $(".topnav"), placeTop = navPill(topnav), placeFn = navPill($(".fn-links"));
  $$("a", topnav).forEach((a) => a.addEventListener("mouseenter", () => placeTop(a)));
  topnav.addEventListener("mouseleave", () => placeTop(null));
  let lastSec = null;
  const syncFn = () => placeFn($(".fn-links a.on"));
  addEventListener("resize", syncFn);
  document.fonts?.ready.then(syncFn);

  // Scroll-linked effects.
  const heroEl = $(".hero"), floatNav = $("#floatNav"), howPhoto = $(".how-photo");
  const steps = $("#steps"), stepItems = $$("li", steps), chevrons = $("#chevrons");
  const layers = $$("[data-parallax]");
  const sections = ["homes", "areas", "how", "questions"].map((id) => document.getElementById(id));
  let ticking = false;
  function onScroll() {
    const vh = innerHeight, y = scrollY;
    const max = document.documentElement.scrollHeight - vh;
    floatNav.classList.toggle("show", y > vh * 0.8);

    let current = "";
    sections.forEach((s) => { if (s.getBoundingClientRect().top < vh * 0.45) current = s.id; });
    $$(".fn-links a").forEach((a) => a.classList.toggle("on", a.dataset.sec === current));
    if (current !== lastSec) { lastSec = current; syncFn(); }

    const str = story.getBoundingClientRect();
    const sp = clamp(-str.top / (str.height - vh));
    story.style.setProperty("--ci", reduce ? "0%" : `${(9 * (1 - clamp((vh - str.top) / vh))).toFixed(2)}%`);
    story.style.setProperty("--sp", sp.toFixed(4));
    setChapter(Math.min(STORY.length - 1, Math.max(0, Math.floor((sp - 0.06) / 0.2))));
    story.classList.toggle("end", sp > 0.84);

    if (!reduce) {
      if (y < vh * 1.2) heroEl.style.setProperty("--hs", clamp(y / vh).toFixed(4));
      if (y < vh) heroSlides.style.translate = `0 ${(y * 0.18).toFixed(1)}px`;
      const hr = howPhoto.getBoundingClientRect();
      howPhoto.style.setProperty("--ci", `${(12 * (1 - clamp((vh - hr.top) / (vh * 0.7)))).toFixed(2)}%`);
      const cr = chevrons.getBoundingClientRect();
      if (cr.top < vh && cr.bottom > 0) chevrons.style.translate = `${((cr.top + cr.height / 2 - vh / 2) * -0.12).toFixed(1)}px 0`;
      layers.forEach((img) => {
        const pr = img.parentElement.getBoundingClientRect();
        if (pr.bottom < 0 || pr.top > vh) return;
        img.style.translate = `0 ${(((pr.top + pr.height / 2) - vh / 2) * -0.08 - pr.height * 0.1).toFixed(1)}px`;
      });
    }

    const sr = steps.getBoundingClientRect();
    steps.style.setProperty("--p", clamp((vh * 0.65 - sr.top) / sr.height).toFixed(4));
    stepItems.forEach((li) => li.classList.toggle("on", reduce || li.getBoundingClientRect().top < vh * 0.65));
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();
