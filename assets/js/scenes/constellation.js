/* =========================================================
   03 · Constelação — o stack vira um mapa estelar. As linhas
   são traçadas com DrawSVG e os nomes decodificados com
   ScrambleText conforme a rolagem avança.
   Edite SKILLS para atualizar o seu stack.
   ========================================================= */
(function (GD) {
  const SKILLS = [
    {
      name: "Frontend",
      color: "#93c5fd",
      label: [110, 70],
      stars: [
        { n: "HTML", x: 140, y: 170, info: "Semântica e acessibilidade" },
        { n: "CSS", x: 290, y: 120, info: "Layouts, grid e animação" },
        { n: "JavaScript", x: 400, y: 250, info: "DOM, ES modules, async" },
        { n: "TypeScript", x: 250, y: 330, info: "Tipagem para escalar" },
        { n: "GSAP", x: 110, y: 450, info: "Motion e scroll storytelling" },
        { n: "Responsivo", x: 370, y: 470, info: "Mobile first" },
      ],
      links: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [3, 5], [2, 5]],
    },
    {
      name: "Backend & Automação",
      color: "#60a5fa",
      label: [560, 60],
      stars: [
        { n: "Python", x: 610, y: 160, info: "Scripts, automação e CLIs" },
        { n: "Node.js", x: 760, y: 250, info: "APIs e tooling" },
        { n: "SQL", x: 640, y: 360, info: "Modelagem e consultas" },
        { n: "APIs REST", x: 820, y: 400, info: "Integrações" },
        { n: "SAP Scripting", x: 830, y: 120, info: "Automação de SAP GUI" },
      ],
      links: [[0, 1], [1, 2], [0, 4], [1, 3], [2, 3]],
    },
    {
      name: "Ferramentas",
      color: "#c7d2fe",
      label: [930, 300],
      stars: [
        { n: "Git", x: 960, y: 420, info: "Commits convencionais e branches" },
        { n: "GitHub", x: 1100, y: 380, info: "PRs, Actions e Pages" },
        { n: "Linux", x: 1080, y: 560, info: "Terminal no dia a dia" },
        { n: "VS Code", x: 900, y: 600, info: "Editor principal" },
        { n: "Figma", x: 1120, y: 220, info: "Do layout ao código" },
      ],
      links: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 4]],
    },
  ];

  // pontes entre constelações [grupoA, estrelaA, grupoB, estrelaB]
  const BRIDGES = [[0, 2, 1, 1], [1, 3, 2, 0], [0, 5, 2, 3]];

  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };

  // Em telas estreitas o mapa é transposto (paisagem → retrato).
  const portrait = window.matchMedia("(max-width: 900px)").matches;
  const P = (x, y) => (portrait ? { x: y + 20, y: x } : { x, y });

  const build = () => {
    const linesG = GD.q(".js-const-lines");
    const starsG = GD.q(".js-const-stars");
    const groups = [];

    if (portrait) GD.q(".constellation__svg").setAttribute("viewBox", "0 0 780 1240");

    SKILLS.forEach((group, gi) => {
      const g = { lines: [], stars: [], labels: [], title: null };

      const lp = P(group.label[0], group.label[1]);
      const title = el("text", { x: portrait ? lp.x - 20 : lp.x, y: portrait ? lp.y - 40 : lp.y, class: "const-group-label" });
      title.textContent = group.name;
      starsG.appendChild(title);
      g.title = title;

      group.links.forEach(([a, b]) => {
        const A = P(group.stars[a].x, group.stars[a].y), B = P(group.stars[b].x, group.stars[b].y);
        const line = el("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: "const-line" });
        linesG.appendChild(line);
        g.lines.push(line);
      });

      group.stars.forEach((s, si) => {
        const pos = P(s.x, s.y);
        const star = el("g", { class: "const-star", transform: `translate(${pos.x} ${pos.y})`, tabindex: 0 });
        star.style.setProperty("--c", group.color);
        star.dataset.name = s.n;
        star.dataset.info = s.info;
        star.dataset.group = group.name;

        const inner = el("g", { class: "const-star__inner" });
        inner.appendChild(el("circle", { r: 16, class: "const-star__halo" }));
        inner.appendChild(el("circle", { r: si === 0 ? 6 : 4.5, class: "const-star__core" }));
        star.appendChild(inner);

        const label = el("text", { x: 14, y: -14, class: "const-star__label" });
        label.dataset.text = s.n;
        star.appendChild(label);

        starsG.appendChild(star);
        g.stars.push(inner);
        g.labels.push(label);
      });

      groups.push(g);
    });

    const bridges = BRIDGES.map(([ga, sa, gb, sb]) => {
      const A = P(SKILLS[ga].stars[sa].x, SKILLS[ga].stars[sa].y), B = P(SKILLS[gb].stars[sb].x, SKILLS[gb].stars[sb].y);
      const line = el("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: "const-line const-line--bridge" });
      linesG.appendChild(line);
      return line;
    });

    return { groups, bridges };
  };

  const tooltip = () => {
    const map = GD.q(".constellation__map");
    const tip = GD.q(".constellation__tooltip");

    const show = (star) => {
      tip.innerHTML = `<strong>${star.dataset.name}</strong><br><span style="color:var(--muted)">${star.dataset.info}</span>`;
      const r = star.getBoundingClientRect();
      const m = map.getBoundingClientRect();
      gsap.set(tip, { x: r.left - m.left + 24, y: r.top - m.top + 18 });
      gsap.to(tip, { autoAlpha: 1, duration: 0.25, overwrite: true });
      gsap.to(star.querySelector(".const-star__halo"), { scale: 2.2, opacity: 0.35, duration: 0.5, ease: "back.out(3)", transformOrigin: "50% 50%" });
    };
    const hide = (star) => {
      gsap.to(tip, { autoAlpha: 0, duration: 0.2, overwrite: true });
      gsap.to(star.querySelector(".const-star__halo"), { scale: 1, opacity: 0.15, duration: 0.4 });
    };

    GD.qa(".const-star").forEach((star) => {
      star.addEventListener("pointerenter", () => show(star));
      star.addEventListener("pointerleave", () => hide(star));
      star.addEventListener("focus", () => show(star));
      star.addEventListener("blur", () => hide(star));
    });
  };

  const parallax = () => {
    if (GD.touch) return;
    const section = GD.q("#constellation");
    const lines = GD.q(".js-const-lines");
    const stars = GD.q(".js-const-stars");
    const lx = gsap.quickTo(lines, "x", { duration: 1.2, ease: "power3" });
    const ly = gsap.quickTo(lines, "y", { duration: 1.2, ease: "power3" });
    const sx = gsap.quickTo(stars, "x", { duration: 1, ease: "power3" });
    const sy = gsap.quickTo(stars, "y", { duration: 1, ease: "power3" });
    section.addEventListener("pointermove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      lx(nx * -14); ly(ny * -10);
      sx(nx * -24); sy(ny * -16);
    });
  };

  GD.scenes.constellation = {
    scroll() {
      const { groups, bridges } = build();
      tooltip();
      parallax();

      groups.forEach((g) => {
        gsap.set(g.stars, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(g.title, { autoAlpha: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: "#constellation", start: "top top", end: "+=170%", pin: true, scrub: 1 },
      });

      tl.fromTo(".constellation__nebula", { scale: 0.8, rotation: -8 }, { scale: 1.2, rotation: 8, duration: 4, ease: "none" }, 0);

      gsap.fromTo(".constellation__title",
        { autoAlpha: 0, y: 80, clipPath: "inset(0% 0% 100% 0%)" },
        {
          autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: "#constellation", start: "top 85%", end: "top 15%", scrub: 1 },
        });

      groups.forEach((g, i) => {
        const at = 0.3 + i * 1.1;
        tl.to(g.title, { autoAlpha: 1, duration: 0.3 }, at)
          .to(g.stars, { scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(3)" }, at)
          .fromTo(g.lines, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, stagger: 0.07, ease: "none" }, at + 0.2);
        g.labels.forEach((label, li) => {
          tl.to(label, { duration: 0.4, scrambleText: { text: label.dataset.text, chars: "01<>/_", speed: 1 } }, at + 0.15 + li * 0.08);
        });
      });

      tl.fromTo(bridges, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, stagger: 0.15, ease: "none" }, ">-0.2")
        .fromTo(".constellation__legend li", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.3 }, "<");
    },
  };
})(window.GD);
