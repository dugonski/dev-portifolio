/* =========================================================
   Main — orquestra preloader, cenas e interações.
   As cenas são criadas de cima para baixo para que os pins
   do ScrollTrigger sejam calculados na ordem correta.
   ========================================================= */
(function (GD) {
  const SCENE_ORDER = ["hero", "orbit", "constellation", "missions", "trajectory", "contact"];

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const yearEl = GD.q(".js-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const runPreloader = () => {
    const preloader = GD.q(".preloader");
    const countEl = GD.q(".js-count");
    const counter = { v: 0 };
    const duration = GD.reduce ? 0.4 : 2.2;

    gsap.set(preloader, { clipPath: "inset(0% 0% 0% 0%)" });

    return gsap.timeline({
      onComplete: () => {
        GD.lockScroll(false);
        preloader.style.display = "none";
      },
    })
      .to(counter, {
        v: 100,
        duration,
        ease: "power2.inOut",
        onUpdate: () => { countEl.textContent = String(Math.round(counter.v)).padStart(3, "0"); },
      })
      .to(".preloader__bar span", { scaleX: 1, duration, ease: "power2.inOut" }, 0)
      .to(preloader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "gd.inOut" }, "+=0.15")
      .add(() => { GD.starfield.boost = 0.06; }, "<")
      .add(GD.scenes.hero.intro(), "<0.35");
  };

  const init = () => {
    GD.initSmoother();
    GD.lockScroll(true);

    GD.scenes.hero.prepare();
    SCENE_ORDER.forEach((name) => {
      const scene = GD.scenes[name];
      if (scene && scene.scroll) scene.scroll();
    });

    GD.initNav();
    GD.initCursor();
    GD.initMagnetic();
    GD.initHud();

    ScrollTrigger.refresh();
    runPreloader();
  };

  // Espera as fontes para que o SplitText meça os glifos corretos.
  let started = false;
  const start = () => { if (!started) { started = true; init(); } };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 2500);
  } else {
    window.addEventListener("load", start);
  }
})(window.GD);
