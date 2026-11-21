/* =========================================================
   00 · Lançamento — `whoami` digitado no terminal, título se
   desfaz, planeta fica para trás e as estrelas entram em dobra.
   ========================================================= */
(function (GD) {
  let split;

  GD.scenes.hero = {
    prepare() {
      split = SplitText.create(".hero__line", { type: "chars", mask: "chars", charsClass: "char" });
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set(".hero__planet", { xPercent: -50, yPercent: -20, x: 0, y: 0 });
      gsap.set(".planet", { yPercent: 30 });
      gsap.set(".js-whoami", { text: "" });
      gsap.set([".hero__lead", ".hero__scroll"], { autoAlpha: 0, y: 20 });
    },

    intro() {
      return gsap.timeline()
        .to(".planet", { yPercent: 0, duration: 2.2, ease: "gd.out" }, 0)
        .add(GD.type(".js-whoami", "whoami"), 0.2)
        .to(split.chars, { yPercent: 0, duration: 1.2, ease: "gd.out", stagger: 0.03 }, 0.6)
        .to([".hero__lead", ".hero__scroll"], { autoAlpha: 1, y: 0, duration: 1, ease: "gd.out", stagger: 0.1 }, 1.1);
    },

    scroll() {
      const lines = GD.qa(".hero__line");
      gsap.timeline({
        scrollTrigger: {
          trigger: "#launch",
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => { GD.starfield.warp = Math.sin(self.progress * Math.PI) * 0.8; },
          onLeave: () => { GD.starfield.warp = 0; },
          onLeaveBack: () => { GD.starfield.warp = 0; },
        },
      })
        .fromTo(lines[0], { xPercent: 0 }, { xPercent: -25, ease: "power2.in" }, 0)
        .fromTo(lines[1], { xPercent: 0 }, { xPercent: 20, ease: "power2.in" }, 0)
        .fromTo(".hero__title",
          { scale: 1, filter: "blur(0px)", autoAlpha: 1 },
          { scale: 1.8, filter: "blur(10px)", autoAlpha: 0, ease: "power2.in" }, 0)
        .fromTo(".hero__meta, .hero__prompt", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, ease: "none", duration: 0.35 }, 0)
        .fromTo(".hero__planet", { yPercent: -20, scale: 1 }, { yPercent: 20, scale: 0.7, ease: "power1.in" }, 0);
    },
  };
})(window.GD);
