import { useEffect, useRef } from "react";

interface Star {
  x: number; y: number; radius: number; opacity: number;
  twinkleOffset: number; twinkleSpeed: number; bright: boolean;
}

interface ShootingStar {
  x: number; y: number; length: number; speed: number;
  opacity: number; angle: number; active: boolean; timer: number; progress: number;
}

export function AnimatedStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let stars: Star[] = [];
    let shooters: ShootingStar[] = [];
    let time = 0;

    const makeShooter = (w: number, h: number, randomDelay = false): ShootingStar => ({
      x: Math.random() * w * 0.6 + w * 0.05, y: Math.random() * h * 0.35,
      length: Math.random() * 200 + 80, speed: Math.random() * 6 + 5, opacity: 0,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.35, active: false,
      timer: randomDelay ? Math.floor(Math.random() * 500) : Math.floor(Math.random() * 400 + 150),
      progress: 0,
    });

    const initStars = () => {
      const w = canvas.width, h = canvas.height;
      stars = [];
      const count = Math.floor((w * h) / 700);
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const bright = roll > 0.92;
        const radius = bright ? Math.random() * 1.8 + 1.0 : roll > 0.75 ? Math.random() * 0.8 + 0.4 : Math.random() * 0.4 + 0.1;
        stars.push({ x: Math.random() * w, y: Math.random() * h, radius, opacity: Math.random() * 0.6 + 0.2, twinkleOffset: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 0.025 + 0.005, bright });
      }
      shooters = Array.from({ length: 4 }, () => makeShooter(w, h, true));
    };

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initStars(); };

    const render = () => {
      const w = canvas.width, h = canvas.height;
      time++;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      const nebulae = [
        { cx: w * 0.18, cy: h * 0.22, r: w * 0.32, color: [18, 6, 55] },
        { cx: w * 0.80, cy: h * 0.55, r: w * 0.26, color: [6, 18, 60] },
        { cx: w * 0.50, cy: h * 0.78, r: w * 0.22, color: [4, 24, 44] },
        { cx: w * 0.62, cy: h * 0.12, r: w * 0.20, color: [28, 6, 50] },
      ];
      for (const n of nebulae) {
        const g = ctx.createRadialGradient(n.cx, n.cy, 0, n.cx, n.cy, n.r);
        g.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0.55)`);
        g.addColorStop(0.5, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},0.18)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.cx, n.cy, n.r, 0, Math.PI * 2); ctx.fill();
      }

      for (const s of stars) {
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const op = Math.max(0.05, Math.min(1, s.opacity + twinkle * 0.35));
        if (s.bright) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 6);
          halo.addColorStop(0, `rgba(200,215,255,${op * 0.5})`);
          halo.addColorStop(0.4, `rgba(160,185,255,${op * 0.15})`);
          halo.addColorStop(1, "transparent");
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius * 6, 0, Math.PI * 2); ctx.fill();
          if (s.radius > 2) {
            ctx.strokeStyle = `rgba(220,228,255,${op * 0.3})`; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(s.x - s.radius * 8, s.y); ctx.lineTo(s.x + s.radius * 8, s.y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(s.x, s.y - s.radius * 8); ctx.lineTo(s.x, s.y + s.radius * 8); ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.bright ? `rgba(210,225,255,${op})` : `rgba(255,255,255,${op})`;
        ctx.fill();
      }

      for (let i = 0; i < shooters.length; i++) {
        const s = shooters[i];
        if (!s.active) { if (--s.timer <= 0) s.active = true; continue; }
        s.x += Math.cos(s.angle) * s.speed; s.y += Math.sin(s.angle) * s.speed;
        s.progress += s.speed; s.opacity = Math.min(1, s.opacity + 0.12);
        if (s.x > w + 120 || s.y > h + 120) { shooters[i] = makeShooter(w, h); continue; }
        const fade = Math.min(1, s.progress / (s.length * 3));
        const tx = s.x - Math.cos(s.angle) * s.length, ty = s.y - Math.sin(s.angle) * s.length;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, `rgba(180,210,255,${s.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity * (1 - fade * 0.3)})`);
        ctx.beginPath(); ctx.strokeStyle = grad; ctx.lineWidth = 1.8;
        ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke();
      }

      animFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animFrameId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none bg-black" style={{ zIndex: 0 }} />;
}
