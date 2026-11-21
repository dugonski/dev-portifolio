/* =========================================================
   03 · Projetos — a rolagem vertical vira viagem horizontal.
   Cada planeta gira e cresce via containerAnimation; os cards
   imitam um repositório, com `git clone` copiável.
   ========================================================= */
(function (GD) {
  const copyButtons = () => {
    GD.qa(".js-copy").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const cmd = btn.parentElement.querySelector("code").textContent;
        try {
          await navigator.clipboard.writeText(cmd);
          btn.textContent = "copiado ✓";
        } catch {
          btn.textContent = "erro";
        }
        btn.classList.add("is-copied");
        setTimeout(() => { btn.textContent = "copiar"; btn.classList.remove("is-copied"); }, 1600);
      });
    });
  };

  GD.scenes.missions = {
    scroll() {
      const section = GD.q("#missions");
      const track = GD.q(".missions__track");
      const bar = GD.q(".missions__progress span");
      const indexEl = GD.q(".js-mission-index");
      const cards = GD.qa(".mission:not(.mission--next)", section);
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      copyButtons();

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
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        },
      });

      cards.forEach((card, i) => {
        const planet = card.querySelector(".mission__planet");
        const ring = card.querySelector(".mission__ring");
        const body = card.querySelectorAll(".mission__body > *");
        const opts = { trigger: card, containerAnimation: travel, start: "left right", end: "center center", scrub: true };

        gsap.fromTo(planet, { scale: 0.4, rotation: -90 }, { scale: 1, rotation: 0, ease: "none", scrollTrigger: opts });
        gsap.fromTo(ring, { rotation: -60, scaleX: 0.4 }, { rotation: -16, scaleX: 1, ease: "none", scrollTrigger: { ...opts } });

        gsap.fromTo(body,
          { y: 40, autoAlpha: 0 },
          {
            y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: "gd.out",
            scrollTrigger: { trigger: card, containerAnimation: travel, start: "left 75%", toggleActions: "play none none reverse" },
          });

        ScrollTrigger.create({
          trigger: card,
          containerAnimation: travel,
          start: "left center",
          end: "right center",
          onToggle: (self) => {
            if (self.isActive) indexEl.textContent = String(i + 1).padStart(2, "0");
          },
        });
      });
    },
  };
})(window.GD);
