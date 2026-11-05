/* MARK MY WORDS! — main.js
   Struktura: render (iz content.js) → layers (menu/modal/lightbox) → motion (GSAP, u matchMedia kontekstu)
   → loader + intro. Sve ScrollTrigger-e živi u gsap.matchMedia, pa se pri resize/rebreakpointu čiste. */
(() => {
  const C = window.MMW;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const pad2 = n => String(n).padStart(2, "0");

  /* ---------- motion flag (?motion=full|reduce, jer neki browseri uvek javljaju reduce) ---------- */
  const q = new URLSearchParams(location.search).get("motion");
  // Animacije su podrazumevano uključene; ?motion=reduce daje statičnu verziju (bez OS prefers-reduced-motion provere).
  const reduce = q === "reduce";
  document.documentElement.classList.toggle("reduce", reduce);

  /* ---------- grain tekstura (jednom generisana) ---------- */
  (() => {
    const c = document.createElement("canvas"); c.width = c.height = 160;
    const x = c.getContext("2d"), d = x.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0);
    document.documentElement.style.setProperty("--grain", `url(${c.toDataURL()})`);
  })();

  /* ---------- render ---------- */
  function media(slug, alt = "", extra = "") {
    const f = C.imageFiles && C.imageFiles[slug], h = hash(slug);
    return `<div class="media ${f ? "has-img" : ""} ${extra}"><div class="ph" style="--x:${20 + h % 60}%;--y:${15 + (h >> 3) % 55}%;--r:${(h % 14) - 7}deg;--bx:${(h % 30) - 15}%"><span>[FOTO · ${esc(slug)}]</span></div>${f ? `<img src="${esc(f)}" alt="${esc(alt)}" loading="lazy" decoding="async">` : ""}</div>`;
  }
  const isPh = s => /^\s*\[/.test(s || "");

  const SECTIONS = [["top", "INTRO"], ["band", "THE BAND"], ["members", "MEMBERS"], ["music", "MUSIC"], ["live", "LIVE DATES"], ["videos", "VIDEOS"], ["gallery", "GALLERY"], ["contact", "CONTACT"]];

  function render() {
    $("#heroGenre").textContent = `${C.genre} · ${C.since}`;
    $("#year").textContent = new Date().getFullYear();

    // hero pozadina
    const bg = $("#heroBg");
    if (C.heroVideo) {
      bg.innerHTML = `<div class="hero__bgin"><video src="${esc(C.heroVideo)}" muted loop playsinline preload="metadata" ${reduce ? "" : "autoplay"} aria-hidden="true"></video></div>`;
    } else {
      bg.innerHTML = `<div class="hero__bgin">${C.heroImages.map((s, i) => `<div class="layer-img" style="opacity:${i ? 0 : 1}">${media(s, "")}</div>`).join("")}</div>`;
    }

    // band
    const words = C.intro.lines.join(" ").split(" ");
    $("#bandBig").innerHTML = C.intro.lines.map((l, li) => l.split(" ").map(w => `<span class="w ${li === C.intro.lines.length - 1 ? "is-red" : ""}">${esc(w)}</span>`).join(" ")).join("<br>");
    $("#bandBig").setAttribute("aria-label", C.intro.lines.join(" "));
    $("#bandFig").innerHTML = media(C.intro.img, "Fotografija benda");
    $("#bandText").textContent = C.intro.text;

    // members
    $("#membersList").innerHTML = C.members.map((m, i) => `
      <li class="m" data-i="${i}">
        <div class="m__fig">${media(m.img, m.name + ", " + m.role)}</div>
        <p class="m__role mono">${pad2(i + 1)} — ${esc(m.role)}</p>
        <h3 class="m__name">${esc(m.name).split(" ").map(w => `<span><i>${w}</i></span>`).join("")}</h3>
      </li>`).join("");
    $("#mTot").textContent = pad2(C.members.length);

    // releases
    $("#releases").innerHTML = C.releases.map((r, i) => `
      <article class="rel" data-i="${i}">
        <p class="rel__ghost" aria-hidden="true">${esc(r.title)}</p>
        <div class="rel__art">${media(r.img, "Artwork: " + r.title)}</div>
        <div class="rel__info">
          <p class="rel__meta mono"><span>${esc(r.type)}</span><span>${esc(r.year)}</span></p>
          <h2 class="rel__title">${esc(r.title)}</h2>
          <div class="rel__links">
            ${r.links.map(l => l.url ? `<a class="btn btn--solid" href="${esc(l.url)}" target="_blank" rel="noopener"><span>${esc(l.label)} ↗</span></a>` : `<span class="btn btn--line is-dead" aria-disabled="true" title="Link još nije dodat"><span>${esc(l.label)} [LINK]</span></span>`).join("")}
            ${r.embed ? `<button class="btn btn--line" type="button" data-embed="${esc(r.embed)}"><span>PLAY HERE</span></button>` : ""}
          </div>
          <div class="rel__embed"></div>
        </div>
      </article>`).join("");

    // live
    const L = $("#liveList");
    if (!C.dates.length) {
      L.outerHTML = `<div class="live__empty" id="liveList"><p class="big" aria-hidden="true">!</p><div><h3>NEMA POTVRĐENIH NASTUPA</h3><p>Novi datumi stižu uskoro. Prati nas ili piši za booking.</p><div class="rel__links"><a class="btn btn--solid" href="#contact" data-nav><span>BOOKING</span></a></div></div></div>`;
    } else {
      L.innerHTML = C.dates.map(d => {
        const [y, m, dd] = d.date.split("-");
        return `<li class="row" ${d.img ? `data-img="${esc(d.img)}"` : ""}><div class="row__in">
          <p class="row__date mono"><b>${dd} / ${m}</b> · ${y}</p>
          <h3 class="row__city">${esc(d.city)}</h3>
          <p class="row__venue mono">${esc(d.venue)}</p>
          <div class="row__tix">${d.tickets ? `<a class="btn btn--line" href="${esc(d.tickets)}" target="_blank" rel="noopener" aria-label="Karte: ${esc(d.city)}, ${esc(d.venue)}"><span>TICKETS ↗</span></a>` : `<span class="mono">TBA</span>`}</div>
        </div></li>`;
      }).join("");
    }

    // videos
    $("#videoGrid").innerHTML = C.videos.map((v, i) => `
      <button class="vid" type="button" data-i="${i}" data-cursor="PLAY" aria-label="Pusti video: ${esc(v.title)}">
        <div class="vid__thumb">${media(v.img, "")}<span class="vid__play" aria-hidden="true"></span></div>
        <div class="vid__cap"><b>${esc(v.title)}</b><span class="mono">${esc(v.tag)}</span></div>
      </button>`).join("");

    // gallery
    $("#galGrid").innerHTML = C.gallery.map((g, i) => `
      <button class="gi gi--${g.size}" type="button" data-i="${i}" data-cursor="VIEW" data-speed="${[0, -40, 30, -20, 50, -30][i % 6]}" aria-label="Otvori fotografiju ${i + 1} od ${C.gallery.length}: ${esc(g.alt)}">
        ${media(g.img, "")}<span class="gi__n mono" aria-hidden="true">${pad2(i + 1)}</span>
      </button>`).join("");

    // contact
    const mailBtn = $("#mailBtn");
    mailBtn.textContent = C.email;
    mailBtn.classList.toggle("is-ph", isPh(C.email));
    if (!isPh(C.email)) $("#mailHint").innerHTML = `KLIKNI DA KOPIRAŠ · <a class="ul" href="mailto:${esc(C.email)}">OTVORI MAIL</a>`;
    else $("#mailHint").textContent = "[EMAIL NIJE UNET — content.js]";
    $("#socList").innerHTML = C.socials.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>` : `<span class="is-dead" aria-disabled="true">${esc(s.label)}</span>`}</li>`).join("");

    // menu
    $("#menuList").innerHTML = SECTIONS.map(([id, label], i) => `<li><a href="#${id}" data-nav data-menu-link><span class="mono">${pad2(i)}</span><span class="t">${label}</span></a></li>`).join("");
    $("#menuMail").innerHTML = isPh(C.email) ? esc(C.email) : `<a class="ul" href="mailto:${esc(C.email)}">${esc(C.email)}</a>`;
    $("#menuSocials").innerHTML = C.socials.filter(s => s.url).map(s => `<a class="ul" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");
  }
  render();

  /* ---------- Lenis + GSAP ---------- */
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  ScrollTrigger.config({ ignoreMobileResize: true });
  CustomEase.create("mmw", "0.16,1,0.3,1");
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = el => {
    if (lenis) lenis.scrollTo(el, { duration: 1.5, easing: t => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: "auto" });
  };

  /* ---------- layer manager (menu / modal / lightbox): fokus, Escape, trap, restore ---------- */
  const FOC = 'a[href],button:not([disabled]),iframe,video[controls],[tabindex]:not([tabindex="-1"])';
  let layer = null, opener = null;
  const setInert = on => ["#main", "#nav", "#foot"].forEach(s => { const e = $(s); on ? e.setAttribute("inert", "") : e.removeAttribute("inert"); });
  const D = d => reduce ? 0 : d;
  const anim = {
    menu: {
      in(el) {
        const tl = gsap.timeline();
        tl.set(el, { visibility: "visible", clipPath: "inset(0% 0% 100% 0%)" })
          .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: D(.85), ease: "mmw" })
          .fromTo($$("#menuList a", el), { yPercent: 110 }, { yPercent: 0, duration: D(.9), ease: "mmw", stagger: D(.05) }, D(.25))
          .fromTo(".menu__bang", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: D(1.1), ease: "mmw" }, D(.2))
          .fromTo([".menu__foot", ".menu__close"], { opacity: 0 }, { opacity: 1, duration: D(.4) }, D(.5));
        return tl;
      },
      out(el) {
        return gsap.timeline().to(el, { clipPath: "inset(100% 0% 0% 0%)", duration: D(.6), ease: "power3.inOut" }).set(el, { visibility: "hidden" });
      }
    },
    fade: {
      in: el => gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: D(.35) }),
      out: el => gsap.to(el, { autoAlpha: 0, duration: D(.25) })
    }
  };
  function openLayer(el, from, kind = "fade", onOpen) {
    if (layer) return;
    layer = { el, kind }; opener = from || document.activeElement;
    el.hidden = false; setInert(true);
    if (lenis) lenis.stop();
    document.body.classList.add("is-locked");
    anim[kind].in(el);
    el.style.visibility = "visible";   // fokus mora da radi odmah, pre prvog tick-a animacije
    onOpen && onOpen();
    const first = el.querySelector("[data-close],.menu__close") || el;
    first.focus({ preventScroll: true });
    setTimeout(() => { if (layer && layer.el === el && !el.contains(document.activeElement)) first.focus({ preventScroll: true }); }, 80);
    document.addEventListener("keydown", onKey, true);
    if (el.id === "menu") { $("#menuBtn").setAttribute("aria-expanded", "true"); }
  }
  function closeLayer(after) {
    if (!layer) return;
    const { el, kind } = layer; layer = null;
    document.removeEventListener("keydown", onKey, true);
    anim[kind].out(el).eventCallback("onComplete", () => { el.hidden = true; el.dispatchEvent(new Event("layerclose")); });
    setInert(false);
    document.body.classList.remove("is-locked");
    if (lenis) lenis.start();
    if (el.id === "menu") $("#menuBtn").setAttribute("aria-expanded", "false");
    const o = opener; opener = null;
    if (after) after(); else if (o && document.contains(o)) o.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (!layer) return;
    if (e.key === "Escape") { e.preventDefault(); closeLayer(); return; }
    if (layer.el.id === "lb") { if (e.key === "ArrowRight") lbStep(1); if (e.key === "ArrowLeft") lbStep(-1); }
    if (e.key === "Tab") {
      const f = $$(FOC, layer.el).filter(x => x.offsetParent !== null || x === document.activeElement);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      else if (!layer.el.contains(document.activeElement)) { e.preventDefault(); a.focus(); }
    }
  }

  /* menu */
  $("#menuBtn").addEventListener("click", e => openLayer($("#menu"), e.currentTarget, "menu"));
  $("#menuClose").addEventListener("click", () => closeLayer());

  /* anchor navigacija */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-nav]");
    if (!a) return;
    const t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    if (layer && layer.el.id === "menu") closeLayer(() => setTimeout(() => scrollToEl(t), 250));
    else scrollToEl(t);
  });

  /* video modal */
  const vModal = $("#vModal");
  function videoEmbed(url) {
    if (!url) return `<p class="mono">[VIDEO LINK NIJE DODAT — content.js → videos]</p>`;
    let m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    if (m) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?rel=0" title="Video" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}" title="Video" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (/\.(mp4|webm)(\?|$)/i.test(url)) return `<video src="${esc(url)}" controls playsinline style="width:100%;height:100%"></video>`;
    return `<p class="mono"><a class="ul" href="${esc(url)}" target="_blank" rel="noopener">OTVORI VIDEO ↗</a></p>`;
  }
  $("#videoGrid").addEventListener("click", e => {
    const b = e.target.closest(".vid"); if (!b) return;
    const v = C.videos[+b.dataset.i];
    $("#vFrame").innerHTML = videoEmbed(v.url);
    $("#vCap").textContent = `${v.tag} — ${v.title}`;
    openLayer(vModal, b);
  });
  vModal.addEventListener("layerclose", () => { $("#vFrame").innerHTML = ""; });
  vModal.querySelector("[data-close]").addEventListener("click", () => closeLayer());
  vModal.addEventListener("click", e => { if (e.target === vModal) closeLayer(); });

  /* lightbox */
  const lb = $("#lb"); let lbI = 0;
  function lbShow(i, dir = 0) {
    lbI = (i + C.gallery.length) % C.gallery.length;
    const g = C.gallery[lbI];
    const fig = $("#lbFig");
    fig.innerHTML = media(g.img, g.alt);
    $("#lbCap").textContent = `${pad2(lbI + 1)} / ${pad2(C.gallery.length)} — ${g.alt}`;
    if (!reduce) gsap.fromTo(fig, { opacity: 0, x: dir * 40 }, { opacity: 1, x: 0, duration: .5, ease: "mmw" });
  }
  const lbStep = d => lbShow(lbI + d, d);
  $("#galGrid").addEventListener("click", e => {
    const b = e.target.closest(".gi"); if (!b) return;
    lbShow(+b.dataset.i); openLayer(lb, b);
  });
  $("#lbPrev").addEventListener("click", () => lbStep(-1));
  $("#lbNext").addEventListener("click", () => lbStep(1));
  lb.querySelector("[data-close]").addEventListener("click", () => closeLayer());
  lb.addEventListener("click", e => { if (e.target === lb) closeLayer(); });
  let tx = null;
  lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1); tx = null; }, { passive: true });

  /* embed na zahtev */
  $("#releases").addEventListener("click", e => {
    const b = e.target.closest("[data-embed]"); if (!b) return;
    const box = b.closest(".rel").querySelector(".rel__embed");
    box.innerHTML = `<iframe src="${esc(b.dataset.embed)}" title="Plejer" allow="encrypted-media" loading="lazy"></iframe>`;
    b.remove();
  });

  /* kopiranje maila */
  let toastT;
  const toast = msg => { const t = $("#toast"); t.textContent = msg; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2200); };
  $("#mailBtn").addEventListener("click", async () => {
    if (isPh(C.email)) return toast("EMAIL JE PLACEHOLDER — UNESI GA U content.js");
    try { await navigator.clipboard.writeText(C.email); }
    catch { const t = document.createElement("textarea"); t.value = C.email; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
    toast("KOPIRANO ✓ " + C.email);
  });

  /* ---------- custom cursor (samo fini pokazivač) ---------- */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    const cur = $(".cursor"), lab = $(".cursor__label");
    const qx = gsap.quickTo(cur, "x", { duration: .25, ease: "power3" }), qy = gsap.quickTo(cur, "y", { duration: .25, ease: "power3" });
    window.addEventListener("mousemove", e => { document.documentElement.classList.add("has-cursor"); qx(e.clientX); qy(e.clientY); }, { passive: true });
    document.addEventListener("mouseover", e => {
      const t = e.target.closest("[data-cursor],a,button,input");
      cur.classList.toggle("is-label", !!(t && t.dataset.cursor));
      cur.classList.toggle("is-link", !!t && !t.dataset.cursor);
      lab.textContent = t && t.dataset.cursor || "";
    });
  }

  /* ---------- hero: foto kadrovi + glitch (rade samo dok je hero vidljiv) ---------- */
  let heroVisible = true;
  const timers = [];
  (() => {
    const layers = $$("#heroBg .layer-img");
    if (layers.length > 1 && !reduce) {
      let idx = 0;
      gsap.to(layers[0], { scale: 1.1, duration: 8, ease: "none" });
      const step = () => {
        if (!heroVisible || document.hidden) { timers[0] = gsap.delayedCall(1, step); return; }
        const a = layers[idx]; idx = (idx + 1) % layers.length; const b = layers[idx];
        gsap.set(b, { zIndex: 2, scale: 1 });
        gsap.to(b, { opacity: 1, duration: 1.4, ease: "power2.inOut" });
        gsap.to(b, { scale: 1.1, duration: 8, ease: "none", overwrite: false });
        gsap.to(a, { opacity: 0, duration: 1.4, ease: "power2.inOut", onComplete: () => gsap.set(a, { zIndex: 1 }) });
        timers[0] = gsap.delayedCall(5.5, step);
      };
      timers[0] = gsap.delayedCall(5, step);
    }
    // glitch slova (referenca ima isto treperenje wordmarka)
    if (!reduce) {
      const logo = $(".hero__logo");
      const glitch = () => {
        if (heroVisible && !document.hidden && !document.body.classList.contains("is-locked")) {
          gsap.timeline({ onComplete: () => gsap.set(logo, { clearProps: "x,skewX,opacity" }) })
            .to(logo, { x: gsap.utils.random(-14, 14), skewX: gsap.utils.random(-6, 6), opacity: .8, duration: .05 })
            .to(logo, { x: gsap.utils.random(-8, 8), skewX: 0, opacity: 1, duration: .05 })
            .to(logo, { x: 0, duration: .06 });
        }
        timers[1] = gsap.delayedCall(gsap.utils.random(2.2, 4.5), glitch);
      };
      timers[1] = gsap.delayedCall(5, glitch);
    }
    const vid = $("#heroBg video");
    if (vid) new IntersectionObserver(([en]) => { en.isIntersecting ? vid.play().catch(() => { }) : vid.pause(); }).observe($("#top"));
  })();

  /* ---------- scroll sistem ---------- */
  const mm = gsap.matchMedia();
  function setWhere() {
    $$("[data-section]").forEach(s => {
      const [n, name] = s.dataset.section.split("|");
      ScrollTrigger.create({ trigger: s, start: "top 55%", end: "bottom 55%", onToggle: self => { if (self.isActive) { $("#whereNum").textContent = n; $("#whereName").textContent = name; } } });
    });
  }

  function initScroll() {
    mm.add({ desk: "(min-width:821px)", mob: "(max-width:820px)" }, ctx => {
      const { desk } = ctx.conditions;
      const st = (vars) => ScrollTrigger.create(vars);

      setWhere();
      ScrollTrigger.create({ trigger: "#top", start: "top top", end: "bottom top", onToggle: s => { heroVisible = s.isActive; } });

      if (reduce) return;

      /* HERO: pin + preklapanje; naslov se razmiče, kadar zumira, band klizi preko */
      gsap.timeline({ scrollTrigger: { trigger: "#top", start: "top top", end: desk ? "+=100%" : "+=70%", pin: true, pinSpacing: false, scrub: true } })
        .to("#top .hero__mask", { xPercent: desk ? -12 : -8, yPercent: -6, ease: "none" }, 0)
        .to(".hero__bgin", { scale: 1.28, yPercent: 8, ease: "none" }, 0)
        .to(".hero__shade", { opacity: .4, ease: "none" }, 0)
        .fromTo([".hero__meta", ".hero__scroll"], { opacity: 1 }, { opacity: 0, ease: "none", duration: .4, immediateRender: false }, 0);

      /* BAND: reč po reč, foto se otvara uzvičnikovim rezom */
      gsap.to("#bandBig .w", { opacity: 1, stagger: .12, ease: "none", scrollTrigger: { trigger: "#bandBig", start: "top 82%", end: "bottom 50%", scrub: .5 } });
      gsap.timeline({ scrollTrigger: { trigger: "#bandFig", start: "top 88%", end: "top 25%", scrub: .6 } })
        .to("#bandFig", { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" }, 0)
        .fromTo("#bandFig .ph,#bandFig img", { scale: 1.5 }, { scale: 1, ease: "none" }, 0);
      if (desk) gsap.fromTo(".band__bang", { yPercent: 30 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: ".band__row", start: "top bottom", end: "bottom top", scrub: true } });

      /* MEMBERS */
      const items = $$(".m"), n = items.length;
      if (desk) {
        const names = items.map(m => $$(".m__name i", m)), roles = items.map(m => $(".m__role", m)), figs = items.map(m => $(".m__fig", m));
        names.forEach((g, i) => i && gsap.set(g, { yPercent: 115 }));
        roles.forEach((r, i) => i && gsap.set(r, { opacity: 0 }));
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#members", start: "top top", end: () => "+=" + (n - 1) * innerHeight * .95, pin: true, scrub: .6, anticipatePin: 1,
            snap: { snapTo: "labels", duration: { min: .2, max: .55 }, delay: .08, ease: "power1.inOut" },
            onUpdate: s => { $("#mNow").textContent = pad2(Math.round(s.progress * (n - 1)) + 1); }
          }
        });
        tl.addLabel("s0", 0);
        for (let i = 1; i < n; i++) {
          const p = (i - 1) * 1.2 + .1;
          tl.to(names[i - 1], { yPercent: -115, duration: .5, stagger: .05, ease: "power2.in" }, p)
            .to(roles[i - 1], { opacity: 0, duration: .2 }, p)
            .to(figs[i - 1], { scale: 1.08, duration: .9, ease: "none" }, p)
            .fromTo(figs[i], { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .8, ease: "power3.inOut" }, p + .05)
            .fromTo($$(".media > *", figs[i]), { scale: 1.35 }, { scale: 1, duration: .9, ease: "power2.out" }, p + .05)
            .to(names[i], { yPercent: 0, duration: .6, stagger: .06, ease: "power3.out" }, p + .5)
            .to(roles[i], { opacity: 1, duration: .3 }, p + .7)
            .addLabel("s" + i, p + 1.15);
        }
        tl.to({}, { duration: .1 });
        // prvi kadar: kratak ulaz portreta
        gsap.fromTo(figs[0], { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", scrollTrigger: { trigger: "#members", start: "top 85%", end: "top 20%", scrub: .5 } });
      } else {
        items.forEach(m => {
          gsap.timeline({ scrollTrigger: { trigger: m, start: "top 80%", once: true } })
            .to($(".m__fig", m), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" })
            .fromTo($(".m__name", m), { clipPath: "inset(0 0 100% 0)", yPercent: 20 }, { clipPath: "inset(0 0 0% 0)", yPercent: 0, duration: .9, ease: "mmw" }, .3);
        });
      }

      /* MUSIC */
      $$(".rel").forEach(r => {
        gsap.fromTo($(".rel__art", r), { rotate: -5, yPercent: 8 }, { rotate: 0, yPercent: 0, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "top 30%", scrub: .6 } });
        gsap.fromTo($(".rel__title", r), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: r, start: "top 65%", once: true } });
        if (desk) gsap.fromTo($(".rel__ghost", r), { xPercent: 5 }, { xPercent: -45, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* LIVE */
      gsap.fromTo(".live__title", { xPercent: -6 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: ".live", start: "top bottom", end: "top 10%", scrub: true } });
      $$(".row__in").forEach((r, i) => gsap.from(r, { yPercent: 105, duration: .9, ease: "mmw", scrollTrigger: { trigger: r.parentNode, start: "top 92%", once: true } }));
      const em = $(".live__empty");
      if (em) gsap.from(em.children, { yPercent: 12, opacity: 0, duration: 1, stagger: .12, ease: "mmw", scrollTrigger: { trigger: em, start: "top 80%", once: true } });

      /* VIDEOS */
      $$(".vid").forEach(v => {
        gsap.fromTo($(".vid__thumb", v), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: v, start: "top 85%", once: true } });
        gsap.fromTo($(".vid__thumb .media", v), { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: v, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* GALLERY */
      $$(".gi").forEach(g => {
        const m = $(".media", g);
        gsap.fromTo(m, { clipPath: "inset(12% 12% 12% 12%)", scale: .9 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: g, start: "top 90%", once: true } });
        if (desk) gsap.to(g, { y: +g.dataset.speed * 1.6, ease: "none", scrollTrigger: { trigger: g, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* CONTACT + FOOTER */
      gsap.from(".contact .line__in", { yPercent: 110, duration: 1.1, stagger: .12, ease: "mmw", scrollTrigger: { trigger: ".contact__big", start: "top 80%", once: true } });
      gsap.from(".contact__row > div", { y: 30, opacity: 0, duration: .9, stagger: .12, ease: "mmw", scrollTrigger: { trigger: ".contact__row", start: "top 88%", once: true } });
      gsap.from(".foot .foot__logo", { yPercent: 105, duration: 1.2, stagger: .12, ease: "mmw", scrollTrigger: { trigger: ".foot", start: "top 70%", once: true } });
      gsap.fromTo(".foot__slit", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "top 40%", scrub: true } });

      /* hover: preview fotografije u live listi (samo pokazivač) */
      if (desk && matchMedia("(hover:hover)").matches) {
        const peek = $("#livePeek"), off = [];
        const px = gsap.quickTo(peek, "x", { duration: .4, ease: "power3" }), py = gsap.quickTo(peek, "y", { duration: .4, ease: "power3" });
        $$(".row[data-img]").forEach(r => {
          const enter = () => { peek.innerHTML = media(r.dataset.img, ""); gsap.to(peek, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: .5, ease: "power3.out", overwrite: true }); };
          const leave = () => gsap.to(peek, { opacity: 0, clipPath: "inset(0% 50% 0% 50%)", duration: .35, overwrite: true });
          const move = e => { px(e.clientX + 30); py(e.clientY - peek.offsetHeight / 2); };
          r.addEventListener("mouseenter", enter); r.addEventListener("mouseleave", leave); r.addEventListener("mousemove", move);
          off.push(() => { r.removeEventListener("mouseenter", enter); r.removeEventListener("mouseleave", leave); r.removeEventListener("mousemove", move); });
        });
        return () => off.forEach(f => f());
      }
    });
  }

  /* ---------- loader + intro (veže se na stvarno učitavanje) ---------- */
  function boot() {
    const body = document.body, loader = $(".loader"), num = $("#loadNum");
    const finishInstant = () => { loader.classList.add("is-done"); body.classList.remove("is-loading"); initScroll(); ScrollTrigger.refresh(); };
    if (reduce) return finishInstant();

    const first = Object.values(C.imageFiles || {})[0];
    const tasks = [
      document.fonts ? document.fonts.ready : Promise.resolve(),
      document.readyState === "complete" ? Promise.resolve() : new Promise(r => addEventListener("load", r, { once: true })),
      first ? new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = first; }) : Promise.resolve()
    ];
    let done = 0, safe = false;
    tasks.forEach(t => t.then(() => done++));
    setTimeout(() => { safe = true; }, 4500);
    const o = { v: 0 };
    gsap.to(o, { v: 100, duration: 1.3, ease: "power1.inOut" });
    const tick = () => {
      const cap = safe ? 100 : 35 + 65 * (done / tasks.length);
      const shown = Math.min(o.v, cap);
      num.textContent = String(Math.round(shown)).padStart(3, "0");
      if (shown >= 100) { gsap.ticker.remove(tick); intro(); }
    };
    gsap.ticker.add(tick);
  }

  function intro() {
    const body = document.body;
    initScroll();
    const els = [".nav", ".hero__meta", ".hero__scroll"];
    gsap.set(els, { opacity: 0 });
    body.classList.remove("is-loading"); body.classList.add("is-locked");
    if (lenis) lenis.stop();
    gsap.set(".hero__logo", { yPercent: 112 });
    gsap.set(".hero__bg", { scale: 1.35 });
    const tl = gsap.timeline({
      onComplete: () => { $(".loader").classList.add("is-done"); body.classList.remove("is-locked"); if (lenis) lenis.start(); gsap.set(els, { clearProps: "opacity" }); ScrollTrigger.refresh(); }
    });
    tl.to(".loader__count", { opacity: 0, duration: .25 })
      .to(".loader__slit", { scaleY: 1, duration: .45, ease: "power3.inOut" }, .1)
      .to(".loader__panel--l", { xPercent: -101, duration: 1.15, ease: "power4.inOut" }, .6)
      .to(".loader__panel--r", { xPercent: 101, duration: 1.15, ease: "power4.inOut" }, .6)
      .to(".loader__slit", { opacity: 0, duration: .4 }, .9)
      .to(".hero__bg", { scale: 1, duration: 2.2, ease: "power3.out" }, .6)
      .to(".hero__logo", { yPercent: 0, duration: 1.4, ease: "mmw" }, 1.4)
      .to(els, { opacity: 1, duration: .8, stagger: .12, ease: "power2.out" }, 2.2);
  }

  boot();
  // refresh kad se sve učita (npr. fontovi menjaju visine)
  addEventListener("load", () => ScrollTrigger.refresh());
})();
