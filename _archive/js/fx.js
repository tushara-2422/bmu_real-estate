/* =========================================================
   BUILD MY UNIVERSE — motion effects (loaded after main.js)
   ========================================================= */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // First-visit intro runs once per session; never let it linger.
  try { sessionStorage.setItem("nestora-intro", "1"); } catch {}
  if (document.documentElement.classList.contains("intro")) {
    setTimeout(() => document.documentElement.classList.remove("intro"), 2500);
  }

  /* ---------- Word-by-word headline reveal ---------- */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span");
            const wi = document.createElement("span");
            w.className = "w"; wi.className = "wi";
            wi.style.setProperty("--i", i++);
            wi.textContent = part;
            w.append(wi); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    el.classList.add("split-words");
  }
  if (!reduce) {
    const heads = document.querySelectorAll(".h2, .page-hero .h1");
    heads.forEach(splitWords);
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.3 });
    heads.forEach((h) => io.observe(h));
  }

  /* ---------- Scroll: progress, smart header, parallax ---------- */
  const header = document.getElementById("header");
  const progress = document.querySelector(".progress");
  const parallax = [
    [".hero-house", 0.22, "hero"],
    [".hero .cloud--a", -0.35, "hero"],
    [".hero .cloud--b", -0.2, "hero"],
    [".page-hero .cloud", -0.25, "hero"],
    [".split-media img", 0.08],
    [".contact-band .bg-house", 0.1],
  ].flatMap(([sel, speed, kind]) => [...document.querySelectorAll(sel)].map((el) => ({ el, speed, kind })));

  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.setProperty("--p", max > 0 ? Math.min(1, y / max) : 0);
    if (header) {
      const menuOpen = document.getElementById("mobileMenu")?.classList.contains("open");
      header.classList.toggle("hide", !menuOpen && y > lastY && y > 400);
    }
    lastY = y;
    if (!reduce) {
      parallax.forEach(({ el, speed, kind }) => {
        if (kind === "hero") {
          if (y < innerHeight * 1.5) el.style.translate = `0 ${(y * speed).toFixed(1)}px`;
          return;
        }
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        el.style.translate = `0 ${((r.top + r.height / 2 - innerHeight / 2) * speed).toFixed(1)}px`;
      });
    }
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Gentle 3D tilt on images ---------- */
  if (finePointer && !reduce) {
    const TILT = ".card-media, .showcase, .post-img";
    let tiltEl = null;
    document.addEventListener("pointermove", (e) => {
      const t = e.target instanceof Element ? e.target.closest(TILT) : null;
      if (tiltEl && tiltEl !== t) tiltEl.style.transform = "";
      tiltEl = t;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const k = t.classList.contains("showcase") ? 2.5 : 6;
      t.style.transform = `perspective(1100px) rotateX(${(-y * k).toFixed(2)}deg) rotateY(${(x * k).toFixed(2)}deg)`;
    }, { passive: true });
    document.addEventListener("pointerleave", () => { if (tiltEl) tiltEl.style.transform = ""; tiltEl = null; });
    document.querySelectorAll(".card-media, .showcase, .post-img").forEach((el) => { el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)"; });
  }

  /* ---------- Click ripple on buttons ---------- */
  document.addEventListener("pointerdown", (e) => {
    const btn = !reduce && e.target instanceof Element && e.target.closest(".btn");
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.append(s);
    s.addEventListener("animationend", () => s.remove());
  });

  /* ---------- Page transitions ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target instanceof Element && e.target.closest("a[href]");
    if (!a || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.protocol !== location.protocol || url.host !== location.host) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => { location.href = url.href; }, 340);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) document.body.classList.remove("leaving"); });
})();
