/* =========================================================
   06 · Horizonte de eventos — o buraco negro se expande e as
   letras emergem da singularidade. Abaixo, um marquee que
   reage à direção e velocidade da rolagem (Observer).
   ========================================================= */
(function (GD) {
  const marquee = () => {
    const tweens = GD.qa(".marquee__row").map((row, i) => {
      const inner = row.querySelector(".marquee__inner");
      row.appendChild(inner.cloneNode(true));
      row.appendChild(inner.cloneNode(true));
      const reverse = i % 2 === 1;
      return gsap.fromTo(row,
        { x: () => (reverse ? -inner.offsetWidth : 0) },
        { x: () => (reverse ? 0 : -inner.offsetWidth), duration: 22, ease: "none", repeat: -1 });
    });

    if (GD.reduce) { tweens.forEach((t) => t.pause()); return; }

    let direction = 1;
    Observer.create({
      target: window,
      type: "wheel,touch",
      onChangeY: (self) => {
        direction = self.deltaY > 0 ? 1 : -1;
        const boost = Math.min(6, 1 + Math.abs(self.velocityY) / 900);
        gsap.to(tweens, { timeScale: direction * boost, duration: 0.2, overwrite: true });
        gsap.to(tweens, { timeScale: direction, duration: 1.2, delay: 0.25, ease: "power2.out" });
      },
    });
  };

  GD.scenes.contact = {
    scroll() {
      const split = SplitText.create(".contact__line", { type: "words,chars", charsClass: "char" });
      const content = GD.q(".contact__content");

      // vetor de cada letra até o centro (offsets ignoram transforms)
      const toCenter = (char, axis) => {
        let x = 0, y = 0, node = char;
        while (node && node !== content) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
        return axis === "x"
          ? content.offsetWidth / 2 - (x + char.offsetWidth / 2)
          : content.offsetHeight / 2 - (y + char.offsetHeight / 2);
      };

      gsap.timeline({
        scrollTrigger: { trigger: "#contact", start: "top top", end: "+=130%", pin: true, scrub: 1, invalidateOnRefresh: true },
      })
        .fromTo(".blackhole", { scale: 0.08, rotation: -90 }, { scale: 1, rotation: 0, duration: 1.2, ease: "power2.out" }, 0)
        .fromTo(split.chars,
          { x: (i, c) => toCenter(c, "x"), y: (i, c) => toCenter(c, "y"), scale: 0, rotation: () => gsap.utils.random(-180, 180), autoAlpha: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: { each: 0.025, from: "center" } }, 0.25)
        .fromTo(".contact__content .section-tag, .contact__actions",
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.15 }, ">-0.3")
        .to(".blackhole", { scale: 1.15, duration: 0.6, ease: "none" }, ">");

      marquee();
    },
  };
})(window.GD);
