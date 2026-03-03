"use client";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  alpha: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
  color: string;
  timestamp: number;
}

interface Lantern {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  wobble: number;
}

export default function LanternFestivalPage() {
  const [isClient, setIsClient] = useState(false);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [showDragon, setShowDragon] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ FIX: useRef<number>() 必须传初始值（TS/React 类型要求）
  // raf id 在未创建时用 null 表示
  const animationRef = useRef<number | null>(null);

  const fireworkIdRef = useRef(0);

  // 生成随机颜色
  const getRandomColor = useCallback(() => {
    const colors = [
      "#ff6b6b",
      "#ffd93d",
      "#6bcf7f",
      "#4d96ff",
      "#9d4edd",
      "#ff8c42",
      "#ff4d6d",
      "#f72585",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // 创建烟花粒子
  const createParticles = useCallback(
    (x: number, y: number, color: string) => {
      const particles: Particle[] = [];
      const particleCount = 80 + Math.floor(Math.random() * 40);

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 4;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          color,
          size: 2 + Math.random() * 3,
          alpha: 1,
        });
      }

      return particles;
    },
    []
  );

  // 创建烟花
  const createFirework = useCallback(
    (x: number, y: number) => {
      const color = getRandomColor();
      const newFirework: Firework = {
        id: fireworkIdRef.current++,
        x,
        y,
        particles: createParticles(x, y, color),
        color,
        timestamp: Date.now(),
      };

      setFireworks((prev) => [...prev, newFirework]);

      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== newFirework.id));
      }, 2000);
    },
    [createParticles, getRandomColor]
  );

  // 初始化客户端
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化灯笼
  useEffect(() => {
    if (!isClient) return;

    const initialLanterns: Lantern[] = [];
    for (let i = 0; i < 12; i++) {
      initialLanterns.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 200,
        speed: 0.5 + Math.random() * 1.5,
        size: 20 + Math.random() * 30,
        opacity: 0.3 + Math.random() * 0.7,
        wobble: Math.random() * Math.PI * 2,
      });
    }
    setLanterns(initialLanterns);
  }, [isClient]);

  // 点击创建烟花
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createFirework(x, y);
    },
    [createFirework]
  );

  // 自动创建烟花
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.6);
      createFirework(x, y);
    }, 1500);

    return () => clearInterval(interval);
  }, [createFirework, isClient]);

  // 绘制动画
  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 30, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lanterns.forEach((lantern) => {
        ctx.save();
        ctx.globalAlpha = lantern.opacity;

        const wobbleX = Math.sin(lantern.wobble) * 10;
        const x = lantern.x + wobbleX;

        const gradient = ctx.createRadialGradient(
          x,
          lantern.y,
          0,
          x,
          lantern.y,
          lantern.size
        );
        gradient.addColorStop(0, "rgba(255, 200, 0, 0.8)");
        gradient.addColorStop(0.5, "rgba(255, 100, 0, 0.4)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(x, lantern.y, lantern.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.fillStyle = "rgba(255, 220, 150, 0.9)";
        ctx.beginPath();
        ctx.arc(x, lantern.y, lantern.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      fireworks.forEach((firework) => {
        firework.particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.05;
          particle.life -= 0.02;
          particle.alpha = particle.life;

          if (particle.life > 0) {
            ctx.save();
            ctx.globalAlpha = particle.alpha;

            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              particle.size * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, "rgba(0,0,0,0)");

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.restore();
          }
        });
      });

      if (showDragon) {
        const time = Date.now() / 1000;
        const dragonX = canvas.width * 0.5 + Math.sin(time * 0.5) * 200;
        const dragonY = canvas.height * 0.3 + Math.cos(time * 0.7) * 100;

        const segments = 20;
        for (let i = 0; i < segments; i++) {
          const progress = i / segments;
          const segmentX = dragonX - progress * 300 + Math.sin(time * 3 + progress * 10) * 50;
          const segmentY = dragonY + Math.sin(time * 2 + progress * 8) * 30 + progress * 100;

          const size = 25 - progress * 15;
          const alpha = 1 - progress * 0.7;

          ctx.save();
          ctx.globalAlpha = alpha;

          const segmentGradient = ctx.createRadialGradient(
            segmentX,
            segmentY,
            0,
            segmentX,
            segmentY,
            size
          );
          segmentGradient.addColorStop(0, "rgba(255, 100, 0, 0.8)");
          segmentGradient.addColorStop(0.5, "rgba(255, 200, 0, 0.4)");
          segmentGradient.addColorStop(1, "rgba(255, 0, 0, 0)");

          ctx.beginPath();
          ctx.arc(segmentX, segmentY, size, 0, Math.PI * 2);
          ctx.fillStyle = segmentGradient;
          ctx.fill();

          ctx.restore();
        }

        const head = {
          x: dragonX,
          y: dragonY,
        };

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.translate(head.x, head.y);
        ctx.rotate(Math.sin(time * 2) * 0.3);

        const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
        headGradient.addColorStop(0, "rgba(255, 200, 0, 1)");
        headGradient.addColorStop(0.5, "rgba(255, 100, 0, 0.8)");
        headGradient.addColorStop(1, "rgba(255, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.fillStyle = headGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-15, -20);
        ctx.lineTo(-25, -50);
        ctx.lineTo(-5, -30);
        ctx.fillStyle = "#ffaa00";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(15, -20);
        ctx.lineTo(25, -50);
        ctx.lineTo(5, -30);
        ctx.fillStyle = "#ffaa00";
        ctx.fill();

        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.arc(-12, -5, 5, 0, Math.PI * 2);
        ctx.arc(12, -5, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      // ✅ FIX: 类型收窄，避免 TS 认为可能为 null
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showDragon, isClient, lanterns, fireworks]);

  // 更新灯笼位置
  useEffect(() => {
    if (!isClient || lanterns.length === 0) return;

    const interval = setInterval(() => {
      setLanterns((prev) =>
        prev.map((lantern) => {
          let newY = lantern.y - lantern.speed;
          let newWobble = lantern.wobble + 0.02;

          if (newY < -10) {
            newY = window.innerHeight + Math.random() * 100;
            return {
              ...lantern,
              x: Math.random() * window.innerWidth,
              y: newY,
              wobble: newWobble,
              opacity: 0.3 + Math.random() * 0.7,
              size: 20 + Math.random() * 30,
              speed: 0.5 + Math.random() * 1.5,
            };
          }

          return {
            ...lantern,
            y: newY,
            wobble: newWobble,
          };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [isClient, lanterns.length]);

  const titleText = useMemo(() => {
    return "Lantern Festival · 元宵节";
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0b0b2b 0%, #120a2f 50%, #1a0628 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "32px 24px",
          color: "#fff",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(28px, 4vw, 56px)",
            letterSpacing: "0.08em",
            textShadow: "0 8px 30px rgba(0,0,0,0.6)",
          }}
        >
          {titleText}
        </h1>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            opacity: 0.85,
            fontSize: "clamp(14px, 1.6vw, 18px)",
            textShadow: "0 6px 20px rgba(0,0,0,0.5)",
          }}
        >
          Click anywhere to launch fireworks · 点击任意位置放烟花
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 18,
          zIndex: 3,
          display: "flex",
          gap: 10,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setShowDragon((v) => !v)}
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.24)",
            background: "rgba(0,0,0,0.25)",
            color: "#fff",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {showDragon ? "Hide Dragon" : "Show Dragon"}
        </button>
      </div>
    </div>
  );
}