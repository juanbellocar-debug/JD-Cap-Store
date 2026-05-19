import { useEffect, useRef } from "react";

export function CornerAmbient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 260;
    const H = 110;
    canvas.width = W;
    canvas.height = H;

    type Wisp = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number; decay: number;
    };

    function spawn(): Wisp {
      return {
        x: W * 0.6 + Math.random() * W * 0.5,
        y: H * 0.4 + Math.random() * H * 0.7,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.1),
        r: Math.random() * 22 + 10,
        alpha: Math.random() * 0.18 + 0.04,
        decay: Math.random() * 0.002 + 0.0005,
      };
    }

    const wisps: Wisp[] = Array.from({ length: 28 }, spawn);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const w of wisps) {
        w.x += w.vx;
        w.y += w.vy;
        w.alpha -= w.decay;
        if (w.alpha <= 0 || w.y < -w.r) Object.assign(w, spawn());
        const g = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
        g.addColorStop(0, `rgba(160,185,220,${w.alpha})`);
        g.addColorStop(1, `rgba(80,110,170,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        @keyframes cornerPulse {
          0%,100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes cornerShift {
          0%,100% { transform: scale(1) translate(0,0); opacity: 0.5; }
          50% { transform: scale(1.08) translate(-4px,-3px); opacity: 0.75; }
        }
      `}</style>

      <div
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{ width: 260, height: 110, zIndex: 2147483646 }}
        aria-hidden="true"
      >
        {/* Deep corner dark fill */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 130% at 115% 115%, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 38%, rgba(0,0,0,0.55) 62%, transparent 80%)",
          }}
        />

        {/* Blue-silver ambient glow — JDED brand accent */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 105% 110%, rgba(25,90,200,0.22) 0%, rgba(40,120,220,0.1) 45%, transparent 70%)",
            animation: "cornerPulse 4.5s ease-in-out infinite",
          }}
        />

        {/* Secondary chrome shimmer */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 95% 105%, rgba(180,200,230,0.06) 0%, transparent 65%)",
            animation: "cornerShift 6s ease-in-out infinite",
          }}
        />

        {/* Smoke wisps canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Hard edge vignette to ensure dark fill at the very corner */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: 160,
            height: 70,
            background:
              "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0.98) 100%)",
          }}
        />
      </div>
    </>
  );
}
