import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface IntroScreenProps {
  onEnter: () => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onEnter, 1400);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number; alpha: number;
      decay: number; isEmber: boolean;
    };

    function spawn(): Particle {
      const isEmber = Math.random() < 0.38;
      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(Math.random() * 1.4 + 0.4),
        size: isEmber ? Math.random() * 2 + 0.5 : Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.85 + 0.15,
        decay: Math.random() * 0.004 + 0.001,
        isEmber,
      };
    }

    const particles: Particle[] = Array.from({ length: 130 }, spawn);

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) Object.assign(p, spawn());
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.isEmber) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          g.addColorStop(0, `rgba(255,140,30,${p.alpha})`);
          g.addColorStop(1, `rgba(255,60,0,0)`);
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = `rgba(200,215,255,${p.alpha * 0.6})`;
        }
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes ingresarGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(50,140,255,0.55), 0 0 40px rgba(30,100,255,0.3), 0 0 80px rgba(20,80,255,0.15), inset 0 0 20px rgba(50,130,255,0.1); }
          50% { box-shadow: 0 0 28px rgba(60,170,255,0.85), 0 0 65px rgba(40,130,255,0.55), 0 0 110px rgba(25,100,255,0.3), inset 0 0 30px rgba(60,160,255,0.2); }
        }
        @keyframes ingresarBorder {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes titleShimmer {
          0%, 100% { text-shadow: 0 0 14px rgba(255,255,255,0.35), 0 0 28px rgba(255,255,255,0.1); }
          50% { text-shadow: 0 0 22px rgba(255,255,255,0.6), 0 0 45px rgba(255,255,255,0.2); }
        }
      `}</style>

      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center overflow-hidden"
        style={{ background: "#000" }}
        animate={
          exiting
            ? { scale: 1.1, opacity: 0, filter: "blur(14px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Background image — full cover */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/intro-bg.jpg')" }}
        />

        {/* Deep vignette for cinematic depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 75% at 50% 42%, transparent 10%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        {/* Bottom gradient for button area */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          }}
        />

        {/* Particle canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        {/* Dynasty title — top */}
        <motion.p
          initial={{ opacity: 0, y: -18, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.45em" }}
          transition={{ delay: 0.5, duration: 1.3, ease: "easeOut" }}
          className="relative z-10 mt-8 text-[11px] sm:text-sm font-light uppercase text-white/80 tracking-[0.45em]"
          style={{ animation: "titleShimmer 3.5s ease-in-out infinite" }}
        >
          The Edras &amp; Jesus Dynasty
        </motion.p>

        {/* Flex spacer — pushes button to bottom */}
        <div className="flex-1" />

        {/* INGRESAR button */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1.0, ease: "easeOut" }}
          className="relative z-10 mb-16 sm:mb-20"
        >
          <button
            onClick={handleEnter}
            disabled={exiting}
            className="relative px-12 sm:px-20 py-3 sm:py-4 text-sm sm:text-base font-bold tracking-[0.4em] text-white uppercase transition-transform duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none"
            style={{
              border: "2px solid rgba(60,160,255,0.85)",
              background: "rgba(0,70,180,0.12)",
              animation: "ingresarGlow 2.2s ease-in-out infinite",
            }}
          >
            {/* Pulsing outer border ring */}
            <span
              className="absolute inset-[-3px] pointer-events-none"
              style={{
                border: "1px solid rgba(100,190,255,0.35)",
                animation: "ingresarBorder 2.2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                textShadow: "0 0 14px rgba(140,210,255,0.95), 0 0 30px rgba(80,170,255,0.5)",
              }}
            >
              INGRESAR
            </span>
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}
