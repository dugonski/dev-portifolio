/* =========================================================
   01 · Sobre — o editor "digita" o perfil linha a linha
   conforme a rolagem, enquanto o texto acende palavra
   por palavra e os contadores sobem.
   ========================================================= */
(function (GD) {
  GD.scenes.about = {
    scroll() {
      const lines = GD.qa(".editor .ln");
      const split = SplitText.create(".about__text", { type: "words", wordsClass: "word" });
      const counters = GD.qa(".js-counter");

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 901px)", mobile: "(max-width: 900px)" }, (ctx) => {
        const { desktop } = ctx.conditions;
        const tl = gsap.timeline({
          scrollTrigger: desktop
            ? { trigger: "#about", start: "top top", end: "+=160%", pin: true, scrub: 1 }
            : { trigger: "#about", start: "top 70%", end: "bottom 75%", scrub: 1 },
        });

        // cada linha é revelada da esquerda para a direita, como se fosse digitada
        tl.fromTo(lines,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, stagger: 0.22, ease: "steps(18)" }, 0)
          .fromTo(split.words, { opacity: 0.15 }, { opacity: 1, duration: 0.2, stagger: 0.04, ease: "none" }, 0.1);

        counters.forEach((el) => {
          const obj = { v: 0 };
          const suffix = el.dataset.suffix || "";
          tl.fromTo(obj, { v: 0 }, {
            v: +el.dataset.value,
            duration: 0.6,
            ease: "power1.out",
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
          }, ">-0.4");
        });
      });
    },
  };
})(window.GD);
