/* =========================================================
   05 · Trajetória — um foguete percorre uma rota gerada a
   partir das posições reais dos checkpoints (MotionPath +
   DrawSVG). A rota é recalculada a cada resize.
   ========================================================= */
(function (GD) {
  const buildPath = () => {
    const section = GD.q("#trajectory");
    const svg = GD.q(".trajectory__svg");
    const head = GD.q(".trajectory__head");
    const items = GD.qa(".checkpoint");
    const w = section.offsetWidth;
    const h = section.offsetHeight;
    const mobile = w <= 900;

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const pts = [[mobile ? 30 : w / 2, head.offsetTop + head.offsetHeight + 20]];
    items.forEach((item, i) => {
      const y = item.offsetTop + item.parentElement.offsetTop + item.offsetHeight / 2;
      const x = mobile ? 30 + (i % 2 ? 10 : -10) : i % 2 ? w * 0.3 : w * 0.7;
      pts.push([x, y]);
    });
    pts.push([mobile ? 30 : w / 2, h - 40]);

    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const my = (y0 + y1) / 2;
      d += ` C${x0},${my} ${x1},${my} ${x1},${y1}`;
    }

    GD.qa("path", svg).forEach((p) => p.setAttribute("d", d));

    // um "commit" (nó) em cada checkpoint, como no git log --graph
    const nodesG = GD.q(".js-traj-nodes");
    pts.slice(1, -1).forEach(([x, y], i) => {
      let node = nodesG.children[i];
      if (!node) {
        node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        node.setAttribute("r", 6);
        node.setAttribute("class", "traj-node");
        nodesG.appendChild(node);
      }
      node.setAttribute("cx", x);
      node.setAttribute("cy", y);
    });
  };

  GD.scenes.trajectory = {
    scroll() {
      buildPath();
      ScrollTrigger.addEventListener("refreshInit", buildPath);

      gsap.timeline({
        scrollTrigger: {
          trigger: "#trajectory",
          start: "top 35%",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })
        .fromTo("#trajPath", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none" }, 0)
        .to(".trajectory__rocket", {
          ease: "none",
          motionPath: { path: "#trajPath", align: "#trajPath", alignOrigin: [0.5, 0.5], autoRotate: 90 },
        }, 0);

      GD.qa(".checkpoint").forEach((item, i) => {
        const year = item.querySelector(".commit__hash");
        const node = GD.q(".js-traj-nodes").children[i];
        const text = year.textContent;
        gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 78%", toggleActions: "play none none reverse" },
        })
          .fromTo(item,
            { autoAlpha: 0, x: i % 2 ? 80 : -80, rotation: i % 2 ? 3 : -3 },
            { autoAlpha: 1, x: 0, rotation: 0, duration: 1.1, ease: "gd.out" })
          .fromTo(node, { attr: { r: 0 } }, { attr: { r: 6 }, duration: 0.6, ease: "back.out(3)" }, 0)
          .to(year, { duration: 0.8, scrambleText: { text, chars: "0123456789abcdef", speed: 0.6 } }, 0.15);
      });
    },
  };
})(window.GD);
