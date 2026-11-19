/* =========================================================
   04 · Missões — a rolagem vertical vira viagem horizontal.
   Cada planeta gira e cresce via containerAnimation.
   ========================================================= */
(function (GD) {
  GD.scenes.missions = {
    scroll() {
      const section = GD.q("#missions");
      const track = GD.q(".missions__track");
      const bar = GD.q(".missions__progress span");
      const rocket = GD.q(".missions__rocket");
      const barWrap = GD.q(".missions__progress");
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const travel = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress });
            gsap.set(rocket, { x: self.progress * barWrap.offsetWidth });
          },
        },
      });

      GD.qa(".mission", section).forEach((card) => {
        const planet = card.querySelector(".mission__planet");
        const ring = card.querySelector(".mission__ring");
        const body = card.querySelectorAll(".mission__body > *");

        if (planet) {
          gsap.fromTo(planet,
            { scale: 0.35, rotation: -90, autoAlpha: 0.3 },
            {
              scale: 1, rotation: 0, autoAlpha: 1, ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: travel, start: "left right", end: "center center", scrub: true },
            });
          gsap.fromTo(ring,
            { rotation: -60, scaleX: 0.4 },
            {
              rotation: -16, scaleX: 1, ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: travel, start: "left right", end: "center center", scrub: true },
            });
        }

        gsap.fromTo(body,
          { y: 50, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.9, ease: "gd.out",
            scrollTrigger: { trigger: card, containerAnimation: travel, start: "left 75%", toggleActions: "play none none reverse" },
          });

        gsap.fromTo(card,
          { rotationY: -18, transformPerspective: 1200 },
          {
            rotationY: 0, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: travel, start: "left right", end: "left 30%", scrub: true },
          });
      });
    },
  };
})(window.GD);
