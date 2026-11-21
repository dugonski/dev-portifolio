/* =========================================================
   Main — orquestra preloader, cenas e interações.
   As cenas são criadas de cima para baixo para que os pins
   do ScrollTrigger sejam calculados na ordem correta.
   ========================================================= */
(function (GD) {
  const SCENE_ORDER = ["hero", "about", "constellation", "missions", "trajectory", "contact"];

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  const yearEl = GD.q(".js-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const runPreloader = () => {
    const preloader = GD.q(".preloader");
    const countEl = GD.q(".js-count");
    const counter = { v: 0 };
    const duration = GD.reduce ? 0.4 : 2.4;
    const bootEl = GD.q(".js-boot");
    let bootIndex = 0;
    const BOOT = [
      [0, "boot", "gd.dev v2.0 — curitiba, br"],
      [8, "ok", "carregando gsap@3.13.0"],
      [20, "ok", "registrando plugins: ScrollTrigger, SplitText, DrawSVG, MotionPath…"],
      [36, "ok", "montando cenas: hero, about, skills, projects, journey, contact"],
      [52, "ok", "calibrando campo de estrelas"],
      [68, "ok", "sincronizando 10+ repositórios"],
      [84, "ok", "checando combustível… 100%"],
      [97, "go", "ignição ▲"],
    ];

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
        onUpdate: () => {
          const v = Math.round(counter.v);
          countEl.textContent = String(v).padStart(3, "0");
          // imprime as linhas do boot log conforme o progresso
          while (bootIndex < BOOT.length && v >= BOOT[bootIndex][0]) {
            const [, status, msg] = BOOT[bootIndex++];
            bootEl.innerHTML += `<span class="${status === "ok" ? "ok" : ""}">[${status.padEnd(4)}]</span> ${msg}\n`;
          }
        },
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
