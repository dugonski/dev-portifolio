/* =========================================================
   02 · Órbita — anéis desenhados pela rolagem, satélite em
   motion path e texto revelado palavra por palavra.
   ========================================================= */
(function (GD) {
  GD.scenes.orbit = {
    scroll() {
      const split = SplitText.create(".orbit__text", { type: "words", wordsClass: "word" });
      const counters = GD.qa(".js-counter");

      gsap.to(".orbit__rings", { rotation: 360, svgOrigin: "400 400", duration: 140, repeat: -1, ease: "none" });

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 901px)", mobile: "(max-width: 900px)" },
        (ctx) => {
          const { desktop } = ctx.conditions;
          const tl = gsap.timeline({
            scrollTrigger: desktop
              ? { trigger: "#orbit", start: "top top", end: "+=180%", pin: true, scrub: 1 }
              : { trigger: "#orbit", start: "top 75%", end: "bottom 70%", scrub: 1 },
          });

          tl.fromTo(".orbit__ring:not(.orbit__ring--dash)", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, stagger: 0.25, ease: "none" }, 0)
            .fromTo(".orbit__ring--dash", { autoAlpha: 0, rotation: -120, svgOrigin: "400 400" }, { autoAlpha: 1, rotation: 0, duration: 1.6, ease: "none" }, 0)
            .fromTo(".orbit__core", { scale: 0.3, transformOrigin: "50% 50%" }, { scale: 1, duration: 1.2, ease: "power2.out" }, 0)
            .fromTo(split.words, { opacity: 0.12 }, { opacity: 1, duration: 0.25, stagger: 0.05, ease: "none" }, 0.2)
            .to(".orbit__satellite", {
              motionPath: { path: "#orbitPath", autoRotate: true, start: 0, end: 1.25 },
              duration: tl.duration(),
              ease: "none",
            }, 0);

          counters.forEach((el) => {
            const obj = { v: 0 };
            const target = +el.dataset.value;
            const suffix = el.dataset.suffix || "";
            tl.fromTo(obj, { v: 0 }, {
              v: target,
              duration: 0.8,
              ease: "power1.out",
              onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
            }, ">-0.6");
          });

          return () => split.words.forEach((w) => (w.style.opacity = ""));
        }
      );
    },
  };
})(window.GD);
