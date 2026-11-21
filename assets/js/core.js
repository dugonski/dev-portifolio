/* =========================================================
   Core — plugins, smooth scroll, cursor, nav e HUD
   ========================================================= */
window.GD = window.GD || {};

(function (GD) {
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    ScrambleTextPlugin,
    TextPlugin,
    DrawSVGPlugin,
    MotionPathPlugin,
    CustomEase,
    Observer,
    ScrollToPlugin
  );

  CustomEase.create("gd.out", "0.16,1,0.3,1");
  CustomEase.create("gd.inOut", "0.85,0,0.15,1");

  GD.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  GD.touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  GD.q = (sel, ctx = document) => ctx.querySelector(sel);
  GD.qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  GD.scenes = GD.scenes || {};

  /* ---------- Smooth scroll ---------- */
  GD.initSmoother = () => {
    if (GD.reduce) return null;
    GD.smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.15,
      effects: true,
      smoothTouch: 0.1,
    });
    return GD.smoother;
  };

  GD.scrollTo = (target) => {
    if (GD.smoother) {
      GD.smoother.scrollTo(target, true, "top top");
    } else {
      gsap.to(window, { scrollTo: { y: target, autoKill: true }, duration: 1.4, ease: "gd.inOut" });
    }
  };

  GD.lockScroll = (locked) => {
    document.body.classList.toggle("is-loading", locked);
    if (GD.smoother) GD.smoother.paused(locked);
  };

  /* ---------- Links de navegação ---------- */
  GD.initNav = () => {
    GD.qa("[data-scroll-to]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = GD.q(link.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        GD.scrollTo(target);
      });
    });

    GD.qa("[data-scroll-top]").forEach((btn) => btn.addEventListener("click", () => GD.scrollTo(0)));

    GD.qa("[data-scramble]").forEach((el) => {
      const text = el.textContent;
      el.parentElement.addEventListener("mouseenter", () => {
        gsap.to(el, {
          duration: 0.7,
          overwrite: true,
          scrambleText: { text, chars: "upperCase", speed: 0.5, revealDelay: 0.15 },
        });
      });
    });
  };

  /* ---------- Cursor customizado ---------- */
  GD.initCursor = () => {
    if (GD.touch) return;
    const root = GD.q(".cursor");
    const dot = GD.q(".cursor__dot");
    const ring = GD.q(".cursor__ring");
    const label = GD.q(".cursor__label");

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    window.addEventListener("pointermove", (e) => {
      dx(e.clientX); dy(e.clientY);
      rx(e.clientX); ry(e.clientY);
      if (GD.starfield) {
        GD.starfield.tx = e.clientX / window.innerWidth - 0.5;
        GD.starfield.ty = e.clientY / window.innerHeight - 0.5;
      }
    });

    document.addEventListener("pointerover", (e) => {
      const el = e.target.closest("[data-cursor], a, button, .const-star");
      root.classList.toggle("is-hover", !!el);
      const text = el && el.dataset.cursor;
      root.classList.toggle("is-label", !!text);
      if (text) label.textContent = text;
    });

    document.addEventListener("pointerdown", () => gsap.to(ring, { scale: 0.75, duration: 0.2 }));
    document.addEventListener("pointerup", () => gsap.to(ring, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.4)" }));
  };

  /* ---------- Digitação estilo terminal ---------- */
  GD.type = (el, text, opts = {}) =>
    gsap.fromTo(el, { text: "" }, { text, duration: text.length * 0.045, ease: "none", ...opts });

  /* ---------- Botões magnéticos ---------- */
  GD.initMagnetic = () => {
    if (GD.touch) return;
    GD.qa("[data-magnetic]").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1,0.35)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1,0.35)" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.45);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  };

  /* ---------- HUD: distância percorrida, seção atual, velocidade ---------- */
  GD.initHud = () => {
    const dist = GD.q(".js-hud-dist");
    const bar = GD.q(".js-hud-progress");
    const sec = GD.q(".js-hud-section");
    const vel = GD.q(".js-velocity");
    const MOON_KM = 384400;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const km = String(Math.round(self.progress * MOON_KM)).padStart(6, "0");
        dist.textContent = km.slice(0, 3) + "." + km.slice(3);
        gsap.set(bar, { scaleX: self.progress });

        const v = Math.abs(self.getVelocity());
        if (vel) vel.textContent = Math.min(9999, Math.round(v * 1.8));
        if (GD.starfield) GD.starfield.boost = Math.min(0.035, v / 110000);
      },
    });

    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top 85%",
      onToggle: (self) => gsap.to(".statusbar", { autoAlpha: self.isActive ? 0 : 1, duration: 0.4 }),
    });

    const links = GD.qa(".nav__links a");
    GD.qa("[data-section]").forEach((section) => {
      const spacer = section.parentElement.classList.contains("pin-spacer") ? section.parentElement : section;
      ScrollTrigger.create({
        trigger: spacer,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (!self.isActive) return;
          gsap.to(sec, { duration: 0.6, overwrite: true, scrambleText: { text: section.dataset.section, chars: "lowerCase", speed: 0.6 } });
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + section.id));
        },
      });
    });
  };
})(window.GD);
