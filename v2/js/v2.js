/* MARK MY WORDS! — V2
   Redosled: render → layers (menu/modal/lightbox) → brand logo → uvod → scrub scene (gsap.matchMedia) → boot.
   Sve ScrollTrigger-e i hover listeneri žive u matchMedia kontekstu: pri promeni širine se čiste i grade ponovo. */
(() => {
  const C = window.MMW;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad2 = n => String(n).padStart(2, "0");
  const isPh = s => /^\s*\[/.test(s || "");
  const AR = 873.3 / 617, LW = 873.3, LH = 617;

  /* ---------- motion: podrazumevano UKLJUČENO; ?motion=reduce ili prekidač u meniju ---------- */
  const q = new URLSearchParams(location.search).get("motion");
  let stored = null; try { stored = localStorage.getItem("mmw-motion"); } catch (e) { }
  const reduce = q === "reduce" || (q !== "full" && stored === "off");
  document.documentElement.classList.toggle("reduce", reduce);

  /* ---------- grain ---------- */
  (() => {
    const c = document.createElement("canvas"); c.width = c.height = 160;
    const x = c.getContext("2d"), d = x.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) { d.data[i] = d.data[i + 1] = d.data[i + 2] = 255; d.data[i + 3] = Math.random() * 255 | 0; }
    x.putImageData(d, 0, 0);
    document.documentElement.style.setProperty("--grain", `url(${c.toDataURL()})`);
  })();

  /* ---------- render ---------- */
  const frame = (src, alt = "", cls = "", extra = "", fx = "50%", fy = "50%", fs = 1) =>
    `<div class="frame ${cls}" ${extra}><div class="inner"><div class="mouse"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" style="--fx:${fx};--fy:${fy};--fs:${fs}"></div></div></div>`;
  const VARS = ["a", "b", "c", "d", "e"];
  const SECTIONS = [["top", "THE BAND", "hero"], ["members", "MEMBERS", "mp3"], ["music", "MUSIC", "rel-1"], ["live", "LIVE DATES", "g8"], ["videos", "VIDEOS", "vid-1"], ["gallery", "GALLERY", "g4"], ["contact", "BOOKING", "g2"]];
  const PV = { hero: C.img.hero, mp3: C.members[2].port, "rel-1": C.img["rel-1"], g8: C.gallery[9].src, "vid-1": C.img["vid-1"], g4: C.gallery[4].src, g2: C.gallery[5].src };

  function render() {
    $("#heroGenre").textContent = C.genre;
    $("#year").textContent = new Date().getFullYear();
    $("#oImg").src = C.img.hero; $("#oAlt").src = C.img.heroAlt; $("#oSecImg").src = C.img.second; $("#oSecFlag").src = C.img.second;
    { // na hover samo zastava dobija boju: kolorni duplikat isečen poligonom zastave (koordinate u pikselima slike 1600x915; okvir je 4:3, cover)
      const P = [[535, 458], [640, 462], [725, 490], [960, 495], [1235, 505], [1250, 540], [1248, 700], [1215, 860], [1160, 915], [430, 915], [470, 800], [485, 640], [505, 560]], W = 1600, H = 915, vis = (4 / 3) / (W / H), off = (1 - vis) / 2;
      $("#oSecFlag").style.clipPath = "polygon(" + P.map(([x, y]) => (((x / W - off) / vis) * 100).toFixed(2) + "% " + ((y / H) * 100).toFixed(2) + "%").join(",") + ")";
    } $("#stImg").src = C.img.stage;
    $("#oText").textContent = C.bio.slice(0, 4).join(" ");
    $("#stText").textContent = C.bio[4];
    $("#stTitle").setAttribute("aria-label", C.stageTitle.join(" "));
    $("#stTitle").innerHTML = C.stageTitle.map(l => `<span class="ln"><span class="ln__i">${esc(l)}</span></span>`).join("");

    $("#memList").innerHTML = C.members.map((m, i) => `
      <article class="mem mem--${VARS[i % 5]}" data-i="${i}">
        <span class="mem__no mono">${pad2(i + 1)} / ${pad2(C.members.length)}</span>
        <div class="frame mem__big px" data-mouse data-cursor-skip style="--fx:${m.fx}%;--fy:${m.fy}%;--fs:${m.fs}">
          <div class="inner"><div class="mouse"><img src="${esc(m.big)}" alt="${esc(m.name)}, krupan kadar" loading="lazy" decoding="async"></div></div>
          <div class="alt" aria-hidden="true"><img src="${esc(m.port)}" alt="" loading="lazy" style="transform:none"></div>
        </div>
        <figure class="frame mem__port px"><div class="inner"><div class="mouse"><img src="${esc(m.port)}" alt="${esc(m.name)}, portret" loading="lazy" decoding="async"></div></div></figure>
        <h3 class="mem__name" aria-label="${esc(m.name)}">${esc(m.name).split(" ").map(w => `<span aria-hidden="true"><i>${w}</i></span>`).join("")}</h3>
        <div class="mem__info"><p class="mono mem__role">${esc(m.role)}</p><p class="mem__txt">${esc(m.info)}</p></div>
      </article>`).join("");

    $("#relList").innerHTML = C.releases.map((r, i) => `
      <article class="rel ${i % 2 ? "rel--r" : ""}" data-i="${i}">
        ${frame(C.img[r.img], "Artwork: " + r.title, "rel__art px", "data-mouse")}
        <div class="rel__info">
          <p class="rel__meta mono"><span>${esc(r.type)}</span><span>${esc(r.year)}</span>${r.note ? `<span>${esc(r.note)}</span>` : ""}</p>
          <h2 class="rel__title" aria-label="${esc(r.title)}">${esc(r.title).split(" ").map(w => `<span aria-hidden="true"><i>${w}</i></span>`).join("")}</h2>
          <div class="rel__links">${r.links.map(l => l.url ? `<a class="btn btn--solid" href="${esc(l.url)}" target="_blank" rel="noopener"><span>${esc(l.label)} ↗</span></a>` : `<span class="btn btn--line is-dead" aria-disabled="true" title="Link još nije dodat"><span>${esc(l.label)} [LINK]</span></span>`).join("")}</div>
        </div>
      </article>`).join("");

    const L = $("#liveList");
    if (!C.dates.length) {
      L.outerHTML = `<div class="live__empty" id="liveList"><p class="big" aria-hidden="true">!</p><div><h3>NEMA POTVRĐENIH NASTUPA</h3><p>Novi datumi stižu uskoro. Prati nas ili piši za booking.</p><a class="btn btn--solid" href="#contact" data-nav><span>BOOKING</span></a></div></div>`;
    } else {
      L.innerHTML = C.dates.map(d => { const [y, m, dd] = d.date.split("-"); return `<li class="row"><div class="row__in"><p class="row__date mono"><b>${dd} / ${m}</b> · ${y}</p><h3 class="row__city">${esc(d.city)}</h3><p class="row__venue mono">${esc(d.venue)}</p><div class="row__tix">${d.tickets ? `<a class="btn btn--line" href="${esc(d.tickets)}" target="_blank" rel="noopener" aria-label="Karte: ${esc(d.city)}, ${esc(d.venue)}"><span>TICKETS ↗</span></a>` : `<span class="mono">TBA</span>`}</div></div></li>`; }).join("");
    }

    $("#videoGrid").innerHTML = C.videos.map((v, i) => `
      <button class="vid" type="button" data-i="${i}" data-cursor="PLAY" aria-label="Pusti video: ${esc(v.title)}">
        <div class="vid__thumb frame">${`<div class="inner" style="inset:-8% 0"><div class="mouse"><img src="${esc(C.img[v.img])}" alt="" loading="lazy"></div></div>`}<span class="vid__play" aria-hidden="true"></span></div>
        <div class="vid__cap"><b>${esc(v.title)}</b><span class="mono">${esc(v.tag)}</span></div>
      </button>`).join("");

    $("#galGrid").innerHTML = C.gallery.map((g, i) => `
      <button class="gi gi--${g.k} ${g.whole ? "gi--whole" : ""}" ${g.whole ? `style="--ar:${g.whole}"` : ""} type="button" data-i="${i}" data-cursor="VIEW" data-speed="${[0, -50, 40, -20, 60, -30, 30, -40, 20, -10][i % 10]}" aria-label="Otvori fotografiju ${i + 1} od ${C.gallery.length}: ${esc(g.alt)}">
        ${frame(g.src, "", g.whole ? "" : "px")}<span class="gi__n mono" aria-hidden="true">${pad2(i + 1)}</span>
      </button>`).join("");

    const mb = $("#mailBtn"); mb.textContent = C.email; mb.classList.toggle("is-ph", isPh(C.email));
    $("#mailHint").innerHTML = isPh(C.email) ? "[EMAIL NIJE UNET — v2/js/content.js]" : `KLIKNI DA KOPIRAŠ · <a class="ul" href="mailto:${esc(C.email)}">OTVORI MAIL</a>`;
    $("#socList").innerHTML = C.socials.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>` : `<span class="is-dead" aria-disabled="true">${esc(s.label)}</span>`}</li>`).join("");

    $("#menuList").innerHTML = SECTIONS.map(([id, label, pv], i) => `<li><a href="#${id}" data-nav data-pv="${i}"><span class="mono">${pad2(i + 1)}</span><span>${label}</span></a></li>`).join("");
    $("#menuPv").innerHTML = SECTIONS.map(([id, l, pv]) => `<div class="pv" data-id="${id}"><img src="${esc(PV[pv])}" alt="" loading="lazy"></div>`).join("");
    $("#menuMail").innerHTML = (isPh(C.email) ? esc(C.email) : `<a class="ul" href="mailto:${esc(C.email)}">${esc(C.email)}</a>`) + ` · <button class="ul mono" id="motionBtn" type="button">ANIMACIJE: ${reduce ? "ISKLJ" : "UKLJ"}</button>`;
    $("#menuSocials").innerHTML = C.socials.filter(s => s.url).map(s => `<a class="ul" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("");
  }
  render();
  $("#motionBtn").addEventListener("click", () => { try { localStorage.setItem("mmw-motion", reduce ? "on" : "off"); } catch (e) { } const u = new URL(location.href); u.searchParams.delete("motion"); location.href = u.toString(); });

  /* ---------- gsap / lenis ---------- */
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  ScrollTrigger.config({ ignoreMobileResize: true });
  CustomEase.create("mmw", "0.16,1,0.3,1");
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = el => lenis ? lenis.scrollTo(el, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) }) : el.scrollIntoView();
  const vw = () => innerWidth, vh = () => innerHeight;
  const isMob = () => innerWidth <= 820;

  /* ---------- layer manager: fokus, Escape, trap ---------- */
  const FOC = 'a[href],button:not([disabled]),iframe,video[controls],[tabindex]:not([tabindex="-1"])';
  let layer = null, opener = null;
  const setInert = on => ["#main", "#nav", "#foot"].forEach(s => { const e = $(s); on ? e.setAttribute("inert", "") : e.removeAttribute("inert"); });
  const D = d => reduce ? 0 : d;
  const mbtn = () => { const r = $("#menuBtn").getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const anim = {
    menu: {
      in(el) {
        const [x, y] = mbtn();
        const tl = gsap.timeline();
        tl.set(el, { visibility: "visible" })
          .fromTo(el, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${Math.hypot(vw(), vh()) * 1.1}px at ${x}px ${y}px)`, duration: D(1), ease: "power3.inOut" })
          .fromTo("#menuList a", { yPercent: 115 }, { yPercent: 0, duration: D(.9), ease: "mmw", stagger: D(.05) }, D(.3))
          .fromTo(".menu__ghost", { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: D(1.2), ease: "mmw" }, D(.2))
          .fromTo("#menuPv", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: D(.9), ease: "power3.inOut" }, D(.35))
          .fromTo([".menu__foot", ".menu__close"], { opacity: 0 }, { opacity: 1, duration: D(.4) }, D(.55));
        return tl;
      },
      out(el) {
        const [x, y] = mbtn();
        return gsap.timeline()
          .to("#menuList a", { yPercent: -115, duration: D(.35), ease: "power3.in", stagger: D(.02) }, 0)
          .to("#menuPv", { clipPath: "inset(0% 0 100% 0)", duration: D(.4), ease: "power3.in" }, 0)
          .to(el, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: D(.65), ease: "power3.inOut" }, D(.22))
          .set(el, { visibility: "hidden" });
      }
    },
    fade: { in: el => gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: D(.35) }), out: el => gsap.to(el, { autoAlpha: 0, duration: D(.25) }) }
  };
  function openLayer(el, from, kind = "fade") {
    if (layer) return;
    layer = { el, kind }; opener = from || document.activeElement;
    el.hidden = false; setInert(true);
    if (lenis) lenis.stop();
    document.body.classList.add("is-locked");
    anim[kind].in(el);
    el.style.visibility = "visible";
    const first = el.querySelector("[data-close],.menu__close") || el;
    first.focus({ preventScroll: true });
    setTimeout(() => { if (layer && layer.el === el && !el.contains(document.activeElement)) first.focus({ preventScroll: true }); }, 80);
    document.addEventListener("keydown", onKey, true);
    if (el.id === "menu") { $("#menuBtn").setAttribute("aria-expanded", "true"); markActiveMenu(); }
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

  /* menu: fotografski detalj reaguje na aktivnu stavku */
  let pvIdx = 0, pvZ = 1;
  function showPv(i) {
    const pvs = $$("#menuPv .pv"); if (i === pvIdx || !pvs[i]) return;
    const dir = i > pvIdx ? 1 : -1; pvIdx = i;
    const el = pvs[i]; gsap.killTweensOf(el); el.style.zIndex = ++pvZ;
    gsap.fromTo(el, { clipPath: dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)" }, { clipPath: "inset(0% 0 0 0)", duration: D(.7), ease: "power3.inOut" });
    gsap.fromTo($("img", el), { scale: 1.2 }, { scale: 1, duration: D(1), ease: "power3.out" });
  }
  function markActiveMenu() {
    const cur = $("#whereNum").textContent; // 00..
    const map = { "00": 0, "01": 0, "02": 1, "03": 2, "04": 2, "05": 3, "06": 4, "07": 5, "08": 6 };
    const i = map[cur] ?? 0; $$("#menuList a").forEach((a, k) => a.classList.toggle("is-act", k === i)); pvIdx = -1; showPv(i);
  }
  $("#menuList").addEventListener("mouseover", e => { const a = e.target.closest("a"); if (a) showPv(+a.dataset.pv); });
  $("#menuList").addEventListener("focusin", e => { const a = e.target.closest("a"); if (a) showPv(+a.dataset.pv); });
  $("#menuBtn").addEventListener("click", e => openLayer($("#menu"), e.currentTarget, "menu"));
  $("#menuClose").addEventListener("click", () => closeLayer());
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-nav]"); if (!a) return;
    const t = $(a.getAttribute("href")); if (!t) return;
    e.preventDefault();
    if (layer && layer.el.id === "menu") closeLayer(() => setTimeout(() => scrollToEl(t), 450)); else scrollToEl(t);
  });

  /* video modal */
  const vModal = $("#vModal");
  function videoEmbed(url) {
    if (!url) return `<p class="mono">[VIDEO LINK NIJE DODAT — v2/js/content.js → videos]</p>`;
    let m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    if (m) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?rel=0" title="Video" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}" title="Video" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (/\.(mp4|webm)(\?|$)/i.test(url)) return `<video src="${esc(url)}" controls playsinline style="width:100%;height:100%"></video>`;
    return `<p class="mono"><a class="ul" href="${esc(url)}" target="_blank" rel="noopener">OTVORI VIDEO ↗</a></p>`;
  }
  $("#videoGrid").addEventListener("click", e => {
    const b = e.target.closest(".vid"); if (!b) return; const v = C.videos[+b.dataset.i];
    $("#vFrame").innerHTML = videoEmbed(v.url); $("#vCap").textContent = `${v.tag} — ${v.title}`; openLayer(vModal, b);
  });
  vModal.addEventListener("layerclose", () => { $("#vFrame").innerHTML = ""; });
  vModal.querySelector("[data-close]").addEventListener("click", () => closeLayer());
  vModal.addEventListener("click", e => { if (e.target === vModal) closeLayer(); });

  /* lightbox */
  const lb = $("#lb"); let lbI = 0;
  function lbShow(i, dir = 0) {
    lbI = (i + C.gallery.length) % C.gallery.length; const g = C.gallery[lbI];
    $("#lbFig").innerHTML = `<img src="${esc(g.src)}" alt="${esc(g.alt)}">`;
    $("#lbCap").textContent = `${pad2(lbI + 1)} / ${pad2(C.gallery.length)} — ${g.alt}`;
    if (!reduce) gsap.fromTo("#lbFig", { opacity: 0, x: dir * 40 }, { opacity: 1, x: 0, duration: .5, ease: "mmw" });
  }
  const lbStep = d => lbShow(lbI + d, d);
  $("#galGrid").addEventListener("click", e => { const b = e.target.closest(".gi"); if (!b) return; lbShow(+b.dataset.i); openLayer(lb, b); });
  $("#lbPrev").addEventListener("click", () => lbStep(-1)); $("#lbNext").addEventListener("click", () => lbStep(1));
  lb.querySelector("[data-close]").addEventListener("click", () => closeLayer());
  lb.addEventListener("click", e => { if (e.target === lb) closeLayer(); });
  let tx = null;
  lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1); tx = null; }, { passive: true });

  let toastT;
  const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2200); };
  $("#mailBtn").addEventListener("click", async () => {
    if (isPh(C.email)) return toast("EMAIL JE PLACEHOLDER — UNESI GA U v2/js/content.js");
    try { await navigator.clipboard.writeText(C.email); } catch { const t = document.createElement("textarea"); t.value = C.email; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
    toast("KOPIRANO ✓ " + C.email);
  });

  /* cursor (samo fini pokazivač) */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    const cur = $(".cursor"), lab = $(".cursor__label");
    const qx = gsap.quickTo(cur, "x", { duration: .25, ease: "power3" }), qy = gsap.quickTo(cur, "y", { duration: .25, ease: "power3" });
    addEventListener("mousemove", e => { document.documentElement.classList.add("has-cursor"); qx(e.clientX); qy(e.clientY); }, { passive: true });
    document.addEventListener("mouseover", e => {
      const t = e.target.closest("[data-cursor],a,button,input");
      cur.classList.toggle("is-label", !!(t && t.dataset.cursor)); cur.classList.toggle("is-link", !!t && !t.dataset.cursor); lab.textContent = t && t.dataset.cursor || "";
    });
  }

  /* ---------- brand logo ---------- */
  const brand = $("#brand"), SL = 7;
  for (let i = 0; i < SL; i++) {
    const im = new Image(); im.src = "../images/web/logo.svg"; im.alt = ""; im.className = "bs";
    im.style.setProperty("--t", (i * 100 / SL).toFixed(3) + "%"); im.style.setProperty("--b", Math.max(0, 100 - (i + 1) * 100 / SL - .35).toFixed(3) + "%");
    brand.insertBefore(im, $(".brand__full"));
  }
  const bslices = $$(".bs", brand);
  const heroBox = () => { const mob = isMob(); const w = Math.min(vw() * (mob ? .8 : .52), vh() * (mob ? .34 : .6) * AR), h = w / AR; return { w, h, x: (vw() - w) / 2, y: vh() * (mob ? .36 : .45) - h / 2 }; };
  const navBox = () => { const r = $("#navSlot").getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; };
  const navScale = () => navBox().w / heroBox().w;
  function placeBrand(state) { // "hero" | "nav"
    const h = heroBox(); brand.style.width = h.w + "px";
    if (state === "nav") { const n = navBox(); gsap.set(brand, { x: n.x, y: n.y, scale: n.w / h.w }); } else gsap.set(brand, { x: h.x, y: h.y, scale: 1 });
  }

  /* ---------- pomoćno: lomljenje na redove (maske) ---------- */
  function splitLines(el) {
    const orig = el.innerHTML, label = el.textContent.trim();
    el.innerHTML = label.split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
    const lines = []; let top = null;
    $$(".w", el).forEach(w => { if (w.offsetTop !== top) { top = w.offsetTop; lines.push([]); } lines[lines.length - 1].push(w.textContent); });
    el.setAttribute("aria-label", label);
    el.innerHTML = lines.map(l => `<span class="ln" aria-hidden="true"><span class="ln__i">${l.join(" ")}</span></span>`).join("");
    return { lines: $$(".ln__i", el), revert: () => { el.innerHTML = orig; el.removeAttribute("aria-label"); } };
  }

  /* ---------- hover/miš na fotografijama (scena D) ---------- */
  function mouseFrames() {
    if (reduce || !matchMedia("(hover:hover) and (pointer:fine)").matches) return () => { };
    const off = [];
    $$(".frame[data-mouse]").forEach(f => {
      const m = $(".mouse", f), alt = $(".alt", f);
      const qx = gsap.quickTo(m, "x", { duration: .9, ease: "power3" }), qy = gsap.quickTo(m, "y", { duration: .9, ease: "power3" });
      const side = (e, r) => { const l = e.clientX - r.left, rr = r.right - e.clientX, t = e.clientY - r.top, b = r.bottom - e.clientY, mn = Math.min(l, rr, t, b); return mn === l ? "l" : mn === rr ? "r" : mn === t ? "t" : "b"; };
      const clip = { l: "inset(0 100% 0 0)", r: "inset(0 0 0 100%)", t: "inset(0 0 100% 0)", b: "inset(100% 0 0 0)" };
      const move = e => { const r = f.getBoundingClientRect(); qx(-((e.clientX - r.left) / r.width - .5) * 24); qy(-((e.clientY - r.top) / r.height - .5) * 24); };
      const enter = e => { const r = f.getBoundingClientRect(); gsap.to(m, { scale: 1.04, duration: 1, ease: "power3" }); if (alt) { gsap.killTweensOf(alt); gsap.fromTo(alt, { clipPath: clip[side(e, r)] }, { clipPath: "inset(0 0 0 0)", duration: .8, ease: "power3.inOut" }); } };
      const leave = e => { const r = f.getBoundingClientRect(); qx(0); qy(0); gsap.to(m, { scale: 1, duration: 1, ease: "power3" }); if (alt) { gsap.killTweensOf(alt); gsap.to(alt, { clipPath: clip[side(e, r)], duration: .7, ease: "power3.inOut" }); } };
      f.addEventListener("mousemove", move); f.addEventListener("mouseenter", enter); f.addEventListener("mouseleave", leave);
      off.push(() => { f.removeEventListener("mousemove", move); f.removeEventListener("mouseenter", enter); f.removeEventListener("mouseleave", leave); gsap.set(m, { clearProps: "x,y,scale" }); });
    });
    return () => off.forEach(f => f());
  }

  /* ---------- scrub scene ---------- */
  const mm = gsap.matchMedia();
  let introDone = false;

  function buildScroll() {
    mm.add({ desk: "(min-width:821px)", mob: "(max-width:820px)" }, ctx => {
      const desk = ctx.conditions.desk;
      const undo = [];

      /* nav triggeri se prave posle pinova (da pozicije uključe pin-spacing) */
      const navTriggers = () => {
        $$("[data-section]").forEach(s => { const [n, name] = s.dataset.section.split("|"); ScrollTrigger.create({ trigger: s, start: "top 55%", end: "bottom 55%", onToggle: self => { if (self.isActive) { $("#whereNum").textContent = n; $("#whereName").textContent = name; } } }); });
        ScrollTrigger.create({ trigger: "#contact", start: "top 50px", end: "bottom 50px", onToggle: s => { brand.classList.toggle("on-light", s.isActive); $("#nav").classList.toggle("on-light", s.isActive); } });
      };
      if (reduce) { placeBrand("nav"); navTriggers(); return; }
      placeBrand(introDone ? "hero" : "hero");

      /* ===== OPENING: hero → scena A ===== */
      const oFrame = $("#oFrame"), oInner = $("#oInner"), full = "inset(0px 0px 0px 0px)";
      const fin = () => `inset(${vh() * .14}px ${vw() * .39}px ${vh() * .30}px ${vw() * .05}px)`; // okvir = ceo kadar (skala .56), da se vide svi članovi
      const sp = splitLines($("#oText")); undo.push(sp.revert);
      const copyTag = $(".o-copy .tag");
      gsap.set(".o-shade", { opacity: 1 });
      if (desk) {
        gsap.set(oFrame, { clipPath: full }); gsap.set(oInner, { x: 0, y: 0, scale: 1 });
        gsap.set(sp.lines, { yPercent: 115 }); gsap.set(copyTag, { opacity: 0 });
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "#top", start: "top top", end: "+=270%", pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true } });
        tl.fromTo(brand, { x: () => heroBox().x, y: () => heroBox().y, scale: 1 }, { x: () => navBox().x, y: () => navBox().y, scale: () => navScale(), duration: .2, ease: "power2.inOut" }, 0)
          .to(".o-shade", { opacity: 0, duration: .25 }, .15)
          .to(".o-cue", { opacity: 0, duration: .08 }, 0)
          .fromTo(oFrame, { clipPath: full }, { clipPath: fin, duration: .36, ease: "power3.inOut" }, .12)
          .fromTo(oInner, { x: 0, y: 0, scale: 1 }, { x: () => -vw() * .17, y: () => -vh() * .08, scale: .56, duration: .36, ease: "power3.inOut" }, .12)
          .fromTo(".o-ghost", { xPercent: 14, opacity: 0 }, { xPercent: -3, opacity: .34, duration: .75 }, .2)
          .fromTo(copyTag, { opacity: 0 }, { opacity: 1, duration: .06 }, .44)
          .fromTo(sp.lines, { yPercent: 115 }, { yPercent: 0, stagger: .028, duration: .1, ease: "power2.out" }, .46)
          .fromTo("#oSecond", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: .2, ease: "power3.inOut" }, .58)
          .fromTo("#oSecond .inner", { yPercent: 22, scale: 1.25 }, { yPercent: 0, scale: 1, duration: .22 }, .58)
          .to({}, { duration: .2 }, .8);
      } else {
        gsap.set(sp.lines, { yPercent: 115 }); gsap.set(copyTag, { opacity: 0 });
        gsap.fromTo(brand, { x: () => heroBox().x, y: () => heroBox().y, scale: 1 }, { x: () => navBox().x, y: () => navBox().y, scale: () => navScale(), ease: "power2.inOut", scrollTrigger: { trigger: "#top", start: "top top", end: () => "+=" + vh() * .6, scrub: .4, invalidateOnRefresh: true } });
        gsap.fromTo(oInner, { yPercent: 0 }, { yPercent: 9, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".o-shade", { opacity: 0, ease: "none", scrollTrigger: { trigger: "#top", start: "top top", end: () => "+=" + vh() * .5, scrub: true } });
        gsap.to(copyTag, { opacity: 1, duration: .5, scrollTrigger: { trigger: ".o-copy", start: "top 85%" } });
        gsap.to(sp.lines, { yPercent: 0, stagger: .07, duration: 1, ease: "mmw", scrollTrigger: { trigger: ".o-copy", start: "top 80%" } });
        gsap.fromTo("#oSecond", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: "#oSecond", start: "top 88%" } });
        gsap.fromTo("#oSecond .inner", { yPercent: 18, scale: 1.2 }, { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: "#oSecond", start: "top bottom", end: "top 30%", scrub: true } });
      }

      /* ===== MEMBERS (scena B): dubine kroz različite brzine ===== */
      const reveal = { a: "inset(0 50% 0 50%)", b: "inset(0 0 0 100%)", c: "inset(30% 30% 30% 30%)", d: "inset(0 100% 0 0)", e: "inset(100% 0 0 0)" };
      $$(".mem").forEach((m, i) => {
        const v = VARS[i % 5], big = $(".mem__big", m), port = $(".mem__port", m), name = $(".mem__name", m), info = $(".mem__info", m), no = $(".mem__no", m);
        const names = $$(".mem__name i", m);
        gsap.set(names, { yPercent: 150 });
        gsap.fromTo(big, { clipPath: reveal[v] }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.out", scrollTrigger: { trigger: m, start: desk ? "top 78%" : "top 85%", end: desk ? "top 30%" : "top 40%", scrub: .5 } });
        gsap.fromTo($(".inner", big), { yPercent: -7, scale: v === "c" ? 1.25 : 1 }, { yPercent: 7, scale: 1, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(port, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "power3.inOut", scrollTrigger: { trigger: m, start: desk ? "top 60%" : "top 60%", end: desk ? "top 15%" : "top 20%", scrub: .5 } });
        gsap.to(names, { yPercent: 0, stagger: .1, duration: 1, ease: "mmw", scrollTrigger: { trigger: m, start: desk ? "top 55%" : "top 50%", toggleActions: "play none none reverse" } });
        gsap.fromTo(info, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, ease: "mmw", scrollTrigger: { trigger: m, start: desk ? "top 45%" : "top 40%", toggleActions: "play none none reverse" } });
        if (desk) {
          const sgn = (v === "a" || v === "d") ? 1 : -1;
          gsap.fromTo(port, { y: vh() * .2 }, { y: -vh() * .16, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
          gsap.fromTo($(".inner", port), { yPercent: 8 }, { yPercent: -8, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(name, { x: sgn * -vw() * .07 }, { x: sgn * vw() * .07, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
          gsap.fromTo(info, { y: 0 }, { y: -vh() * .1, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true, immediateRender: false } });
          gsap.fromTo(big, { y: vh() * .05 }, { y: -vh() * .05, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
        }
      });

      /* ===== STAGE: mali kadar → fullscreen → silueta logotipa ===== */
      const sPhoto = $("#stPhoto"), sInner = $("#stInner"), svg = $("#stMask");
      const stc = splitLines($("#stText")); undo.push(stc.revert);
      const tLines = $$("#stTitle .ln__i");
      const small = () => isMob() ? `inset(${vh() * .5}px ${vw() * .06}px ${vh() * .1}px ${vw() * .36}px)` : `inset(${vh() * .5}px ${vw() * .06}px ${vh() * .08}px ${vw() * .58}px)`;
      const mid = () => isMob() ? `inset(${vh() * .26}px ${vw() * .1}px ${vh() * .26}px ${vw() * .1}px)` : `inset(${vh() * .2}px ${vw() * .27}px ${vh() * .2}px ${vw() * .27}px)`;
      const S0 = 70, FOC0 = [303.5 / LW, 17.1 / LH];
      const Sf = () => Math.min(vw() * (isMob() ? .86 : .62) / LW, vh() * (isMob() ? .5 : .74) / LH);
      const st = { t: 0 };
      function layoutMask() {
        const w = vw(), h = vh(); svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        [$("#stR"), $("#stO")].forEach(r => { r.setAttribute("width", w); r.setAttribute("height", h); });
        const m = $("#stM"); m.setAttribute("x", 0); m.setAttribute("y", 0); m.setAttribute("width", w); m.setAttribute("height", h);
      }
      function applyMask(t) {
        const sf = Sf();
        const e1 = Math.min(1, t / .8), k = 1 - Math.pow(1 - e1, 3);      // ulaz: velika silueta → finalna
        let s = S0 * Math.pow(sf / S0, k);
        if (t > .8) { const e2 = (t - .8) / .2; s = sf * (1 - .22 * (e2 * e2 * (3 - 2 * e2))); } // smanjuje se u centru
        const f = Math.min(1, Math.max(0, (t - .3) / .5)), fe = f * f * (3 - 2 * f);
        const fx = FOC0[0] + (.5 - FOC0[0]) * fe, fy = FOC0[1] + (.5 - FOC0[1]) * fe;
        $("#stG").setAttribute("transform", `translate(${vw() / 2} ${vh() / 2}) scale(${s}) translate(${-fx * LW} ${-fy * LH})`);
      }
      layoutMask(); applyMask(0);
      gsap.set(sPhoto, { clipPath: small }); gsap.set(sInner, { scale: 1.35 }); gsap.set(".st-shade", { opacity: 0 });
      gsap.set(tLines, { yPercent: 175 }); gsap.set(svg, { opacity: 0 });
      const glitch = () => {
        const g = gsap.timeline({ onComplete: () => gsap.set("#stTitle", { "--gx": "0px" }) });
        [[14, -10], [-18, 8], [10, -4], [0, 0]].forEach(([a, b], i) => g.to("#stTitle", { "--gx": a + "px", duration: .05 }, i * .06).to(tLines, { x: b, skewX: b * .6, duration: .05 }, i * .06));
        g.set(tLines, { clearProps: "x,skewX" });
      };
      const sTl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "#stage", start: "top top", end: () => "+=" + (isMob() ? 230 : 320) + "%", pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: layoutMask } });
      sTl.to({}, { duration: .06 }, 0)
        .to(stc.lines, { yPercent: -115, stagger: .02, duration: .1, ease: "power2.in" }, .08)
        .to($(".st-copy .tag"), { opacity: 0, duration: .05 }, .08)
        .fromTo(sPhoto, { clipPath: small }, { clipPath: mid, duration: .16, ease: "power2.inOut" }, .07)
        .fromTo(sPhoto, { clipPath: mid }, { clipPath: full, duration: .2, ease: "power3.inOut", immediateRender: false }, .27)
        .fromTo(sInner, { scale: 1.35 }, { scale: 1, duration: .4, ease: "power2.out" }, .07)
        .to(".st-shade", { opacity: 1, duration: .15 }, .3)
        .to(tLines, { yPercent: 0, stagger: .05, duration: .09, ease: "power3.out" }, .47)
        .call(() => { if (sTl.scrollTrigger.direction > 0) glitch(); }, null, .57)
        .to(tLines, { yPercent: -175, stagger: .02, duration: .06, ease: "power3.in" }, .65)
        .to(".st-shade", { opacity: 0, duration: .08 }, .66)
        .set(svg, { opacity: 1 }, .74)
        .fromTo(st, { t: 0 }, { t: 1, duration: .25, ease: "none", onUpdate: () => applyMask(st.t) }, .74)
        .to(sInner, { scale: 1.06, duration: .25 }, .74);
      sTl.eventCallback("onReverseComplete", () => gsap.set(svg, { opacity: 0 }));

      /* ===== MUSIC ===== */
      $$(".rel").forEach(r => {
        const art = $(".rel__art", r), names = $$(".rel__title i", r);
        gsap.set(names, { yPercent: 150 });
        gsap.fromTo(art, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: r, start: "top 75%", toggleActions: "play none none reverse" } });
        gsap.fromTo($(".inner", art), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.to(names, { yPercent: 0, stagger: .1, duration: 1.1, ease: "mmw", scrollTrigger: { trigger: r, start: "top 60%", toggleActions: "play none none reverse" } });
        gsap.fromTo($(".rel__info", r).children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .9, ease: "mmw", scrollTrigger: { trigger: r, start: "top 55%", toggleActions: "play none none reverse" } });
        if (desk) gsap.fromTo(art, { y: 50 }, { y: -50, ease: "none", scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* ===== LIVE / VIDEOS ===== */
      gsap.fromTo(".live__title", { xPercent: -6 }, { xPercent: 4, ease: "none", scrollTrigger: { trigger: ".live", start: "top bottom", end: "top 10%", scrub: true } });
      $$(".row__in").forEach(r => gsap.from(r, { yPercent: 105, duration: .9, ease: "mmw", scrollTrigger: { trigger: r.parentNode, start: "top 92%", once: true } }));
      const em = $(".live__empty"); if (em) gsap.from(em.children, { yPercent: 12, opacity: 0, duration: 1, stagger: .12, ease: "mmw", scrollTrigger: { trigger: em, start: "top 80%", once: true } });
      $$(".vid").forEach(v => {
        gsap.fromTo($(".vid__thumb", v), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: v, start: "top 85%", once: true } });
        gsap.fromTo($(".vid__thumb .inner", v), { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: v, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* ===== GALLERY ===== */
      $$(".gi").forEach(g => {
        const f = $(".frame", g);
        gsap.fromTo(f, { clipPath: "inset(14% 14% 14% 14%)", scale: .9 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: g, start: "top 90%", once: true } });
        if (!g.classList.contains("gi--whole")) gsap.fromTo($(".inner", f), { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: g, start: "top bottom", end: "bottom top", scrub: true } });
        if (desk) gsap.fromTo(g, { y: -g.dataset.speed * 1.2 }, { y: g.dataset.speed * 1.8, ease: "none", scrollTrigger: { trigger: g, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* ===== CONTACT + FOOTER ===== */
      gsap.from(".contact .line__in", { yPercent: 140, duration: 1.1, stagger: .12, ease: "mmw", scrollTrigger: { trigger: ".contact__big", start: "top 80%", once: true } });
      gsap.from(".contact__row > div", { y: 30, opacity: 0, duration: .9, stagger: .12, ease: "mmw", scrollTrigger: { trigger: ".contact__row", start: "top 88%", once: true } });
      gsap.from(".foot__logo", { yPercent: 105, duration: 1.2, ease: "mmw", scrollTrigger: { trigger: ".foot", start: "top 70%", once: true } });
      gsap.fromTo(".foot__slit", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".foot", start: "top bottom", end: "top 40%", scrub: true } });

      navTriggers();
      undo.push(mouseFrames());
      return () => undo.forEach(f => f());
    });
  }

  /* ---------- glitch logotipa na homepage-u: horizontalni isečci pomereni + crveni duplikat; samo dok je logo veliki ---------- */
  function logoGlitch() {
    const w = brand.getBoundingClientRect().width, made = [];
    const n = 3 + (Math.random() * 3 | 0);
    for (let i = 0; i < n; i++) {
      const im = new Image(); im.src = i % 2 ? "../images/web/logo-red.svg" : "../images/web/logo.svg"; im.alt = ""; im.className = "bs bg";
      const t = Math.random() * 85, h = 3 + Math.random() * 12;
      im.style.setProperty("--t", t.toFixed(1) + "%"); im.style.setProperty("--b", Math.max(0, 100 - t - h).toFixed(1) + "%");
      brand.appendChild(im); made.push(im);
    }
    gsap.timeline({ onComplete: () => made.forEach(m => m.remove()) })
      .fromTo(made, { x: () => gsap.utils.random(-.05, .05) * w, opacity: 1 }, { x: () => gsap.utils.random(-.04, .04) * w, duration: .06, stagger: .015 })
      .to(made, { x: () => gsap.utils.random(-.07, .07) * w, duration: .05 })
      .to(made, { x: 0, opacity: 0, duration: .07 })
      .fromTo($(".brand__full"), { x: 0 }, { x: () => gsap.utils.random(-.012, .012) * w, duration: .04, yoyo: true, repeat: 3 }, 0)
      .set($(".brand__full"), { x: 0 });
  }
  function logoGlitchLoop() {
    if (reduce) return;
    const tick = () => {
      if (!document.hidden && !layer && scrollY < vh() * .12) logoGlitch();
      gsap.delayedCall(gsap.utils.random(3, 5.5), tick);
    };
    gsap.delayedCall(1.2, () => { if (scrollY < vh() * .12) logoGlitch(); gsap.delayedCall(gsap.utils.random(3, 5), tick); });
  }

  /* ---------- uvodna špica ---------- */
  function intro() {
    const body = document.body, hb = heroBox();
    brand.style.width = hb.w + "px"; brand.classList.add("is-intro");
    gsap.set(brand, { x: hb.x, y: hb.y, scale: 1 });
    gsap.set(bslices, { opacity: 0, x: () => gsap.utils.random(-.05, .05) * hb.w });
    const els = [".nav__home", ".nav__where", ".nav__menu", "#oMeta", ".o-cue"];
    gsap.set(els, { opacity: 0 });
    gsap.set("#oFrame", { clipPath: "inset(36% 28% 36% 28%)" }); gsap.set("#oImg", { scale: 1.12 }); gsap.set(".o-shade", { opacity: 1 });
    gsap.set("#navSlot", { opacity: 0 });
    body.classList.remove("is-loading"); body.classList.add("is-locked"); if (lenis) lenis.stop();
    const tl = gsap.timeline({ onComplete: () => { introDone = true; body.classList.remove("is-locked"); if (lenis) lenis.start(); gsap.set(els, { clearProps: "opacity" }); gsap.set("#navSlot", { clearProps: "opacity" }); gsap.set("#oImg", { clearProps: "transform" }); ScrollTrigger.refresh(); logoGlitchLoop(); } });
    tl.to("#oFrame", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, .25)
      .to("#oImg", { scale: 1, duration: 2.1, ease: "power3.out" }, .25)
      .to(bslices, { opacity: 1, x: 0, duration: .95, ease: "expo.out", stagger: { each: .09, from: "random" } }, .35)
      .add(() => { brand.classList.remove("is-intro"); bslices.forEach(s => s.remove()); }, 1.55)
      .to(els, { opacity: 1, duration: .8, stagger: .1, ease: "power2.out" }, 2);
  }

  /* ---------- boot ---------- */
  async function boot() {
    const ready = [document.fonts ? document.fonts.ready : 0, new Promise(r => { const i = $("#oImg"); i.complete && i.naturalWidth ? r() : (i.onload = i.onerror = r); })];
    await Promise.race([Promise.all(ready), new Promise(r => setTimeout(r, 4500))]);
    if (reduce) {
      document.body.classList.remove("is-loading");
      $("#brand").classList.remove("is-intro"); bslices.forEach(s => s.remove());
      buildScroll(); ScrollTrigger.refresh(); return;
    }
    buildScroll();      // postavlja početna stanja scena
    intro();
  }
  boot();

  /* ponovna gradnja pri promeni širine (ispravne pozicije i redovi teksta) */
  let lastW = innerWidth, rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if (innerWidth === lastW) { ScrollTrigger.refresh(); return; }
      lastW = innerWidth; mm.revert(); buildScroll(); ScrollTrigger.refresh();
      if (introDone || reduce) { brand.classList.remove("is-intro"); }
    }, 300);
  });
  addEventListener("load", () => ScrollTrigger.refresh());
})();
