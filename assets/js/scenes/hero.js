/* =========================================================
   01 · Lançamento — título se desfaz, planeta fica para trás
   e o campo de estrelas entra em dobra.
   ========================================================= */
(function (GD) {
  let split;

  GD.scenes.hero = {
    prepare() {
      split = SplitText.create(".hero__line", { type: "chars", mask: "chars", charsClass: "char" });
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set(".hero__planet", { xPercent: -50, yPercent: -22, x: 0, y: 0 });
      gsap.set(".planet, .planet__atmo", { yPercent: 35 });
      gsap.set([".hero__eyebrow", ".hero__lead", ".hero__scroll", ".hero__countdown"], { autoAlpha: 0, y: 24 });
    },

    intro() {
      return gsap.timeline()
        .to(".planet, .planet__atmo", { yPercent: 0, duration: 2.2, ease: "gd.out" }, 0)
        .to(split.chars, { yPercent: 0, duration: 1.3, ease: "gd.out", stagger: 0.035 }, 0.1)
        .to([".hero__eyebrow", ".hero__lead", ".hero__scroll", ".hero__countdown"], {
          autoAlpha: 1, y: 0, duration: 1, ease: "gd.out", stagger: 0.08,
        }, 0.7);
    },

    scroll() {
      const lines = GD.qa(".hero__line");
      gsap.timeline({
        scrollTrigger: {
          trigger: "#launch",
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => { GD.starfield.warp = Math.sin(self.progress * Math.PI) * 0.9; },
          onLeave: () => { GD.starfield.warp = 0; },
          onLeaveBack: () => { GD.starfield.warp = 0; },
        },
      })
        .fromTo(lines[0], { xPercent: 0 }, { xPercent: -35, ease: "power2.in" }, 0)
        .fromTo(lines[1], { xPercent: 0 }, { xPercent: 30, ease: "power2.in" }, 0)
        .fromTo(".hero__title",
          { scale: 1, filter: "blur(0px)", autoAlpha: 1 },
          { scale: 2.2, filter: "blur(14px)", autoAlpha: 0, ease: "power2.in" }, 0)
        .fromTo(".hero__meta", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -60, ease: "none", duration: 0.4 }, 0)
        .fromTo(".hero__planet",
          { yPercent: -22, scale: 1 },
          { yPercent: 25, scale: 0.6, ease: "power1.in" }, 0);
    },
  };
})(window.GD);
