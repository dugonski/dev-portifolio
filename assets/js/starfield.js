/* =========================================================
   Starfield — campo de estrelas 3D em canvas.
   `warp` (0..1) e `boost` controlam a velocidade de dobra,
   alimentados pela rolagem.
   ========================================================= */
(function (GD) {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const state = { warp: 0, boost: 0, mx: 0, my: 0, tx: 0, ty: 0 };
  GD.starfield = state;

  const COLORS = ["230,237,247", "230,237,247", "190,210,240", "96,165,250"];
  let w = 0, h = 0, stars = [];

  const makeStar = (z = Math.random()) => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z,
    size: Math.random() * 1.3 + 0.3,
    color: COLORS[(Math.random() * COLORS.length) | 0],
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(650, Math.max(220, (w * h) / 2600)));
    stars = Array.from({ length: count }, () => makeStar());
  };

  const render = () => {
    state.mx += (state.tx - state.mx) * 0.04;
    state.my += (state.ty - state.my) * 0.04;
    state.boost *= 0.94;

    const base = GD.reduce ? 0 : 0.00045;
    const speed = base + state.warp * 0.018 + state.boost;
    const streak = speed > 0.0025;

    ctx.fillStyle = `rgba(3, 7, 18, ${streak ? 0.55 : 1})`;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2 - state.mx * 60;
    const cy = h / 2 - state.my * 60;
    const fov = Math.max(w, h) * 0.55;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const pz = s.z;
      s.z -= speed;
      if (s.z <= 0.02) { stars[i] = makeStar(1); continue; }

      const sx = cx + (s.x / s.z) * fov;
      const sy = cy + (s.y / s.z) * fov;
      if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) { stars[i] = makeStar(1); continue; }

      const depth = 1 - s.z;
      const alpha = Math.min(0.85, depth * 1.2);
      const r = s.size * depth * 1.3 + 0.1;

      if (streak) {
        const px = cx + (s.x / pz) * fov;
        const py = cy + (s.y / pz) * fov;
        ctx.strokeStyle = `rgba(${s.color}, ${alpha})`;
        ctx.lineWidth = r;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  resize();
  window.addEventListener("resize", resize);
  gsap.ticker.add(render);
})(window.GD);
