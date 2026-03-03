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

export default function LanternFestival() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [showDragon, setShowDragon] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const fireworkIdRef = useRef(0);

  // 预生成星星位置，避免 hydration 不匹配
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      left: `${(i * 13.7) % 100}%`,
      top: `${(i * 7.3) % 60}%`,
      delay: `${(i * 0.1) % 3}s`,
      opacity: 0.3 + ((i * 0.07) % 0.5)
    }));
  }, []);

  // 标记客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化灯笼 - 只在客户端执行
  useEffect(() => {
    if (!isClient) return;
    
    const initialLanterns: Lantern[] = [];
    for (let i = 0; i < 20; i++) {
      initialLanterns.push({
        id: i,
        x: Math.random() * 100,
        y: 100 + Math.random() * 50,
        speed: 0.2 + Math.random() * 0.3,
        size: 30 + Math.random() * 20,
        opacity: 0.6 + Math.random() * 0.4,
        wobble: Math.random() * Math.PI * 2
      });
    }
    setLanterns(initialLanterns);
  }, [isClient]);

  // 创建烟花 - 多层爆炸效果
  const createFirework = useCallback((x: number, y: number) => {
    const colors = [
      "#ff0040", "#ff4000", "#ffff00", "#ff0080", 
      "#ff8000", "#ffffff", "#00ffff", "#ff69b4", "#ffd700"
    ];
    const particles: Particle[] = [];
    
    // 多层爆炸 - 内圈
    const innerColor = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const velocity = 1 + Math.random() * 2;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color: innerColor,
        size: 3 + Math.random() * 2,
        alpha: 1
      });
    }

    // 外圈 - 不同颜色
    const outerColor = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30 + Math.random() * 0.2;
      const velocity = 3 + Math.random() * 4;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color: outerColor,
        size: 2 + Math.random() * 3,
        alpha: 0.8
      });
    }

    // 散射粒子
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 6;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color: "#ffffff",
        size: 1 + Math.random() * 2,
        alpha: 0.6
      });
    }

    const newFirework: Firework = {
      id: fireworkIdRef.current++,
      x,
      y,
      particles,
      color: innerColor,
      timestamp: Date.now()
    };

    setFireworks(prev => [...prev, newFirework]);

    // 自动清理
    setTimeout(() => {
      setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
    }, 2500);
  }, []);

  // 点击放烟花
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createFirework(x, y);
    
    // 连锁反应 - 在附近再爆几个小的
    setTimeout(() => createFirework(x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 100), 100);
    setTimeout(() => createFirework(x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 100), 200);
  }, [createFirework]);

  // Canvas 动画（火龙）
  useEffect(() => {
    if (!isClient) return;
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

    let time = 0;
    const dragonSegments: { x: number; y: number }[] = [];
    const numSegments = 30;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (showDragon) {
        time += 0.02;
        
        const headX = canvas.width / 2 + Math.sin(time) * 200;
        const headY = canvas.height / 2 + Math.cos(time * 1.5) * 100;

        dragonSegments.unshift({ x: headX, y: headY });
        if (dragonSegments.length > numSegments) {
          dragonSegments.pop();
        }

        dragonSegments.forEach((seg, i) => {
          const size = 20 - (i / numSegments) * 15;
          const opacity = 1 - (i / numSegments) * 0.8;
          
          const gradient = ctx.createRadialGradient(seg.x, seg.y, 0, seg.x, seg.y, size);
          gradient.addColorStop(0, `rgba(255, 100, 0, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(255, 50, 0, ${opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(100, 0, 0, 0)`);
          
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          if (i % 3 === 0) {
            ctx.beginPath();
            ctx.arc(
              seg.x + (Math.random() - 0.5) * 30,
              seg.y + (Math.random() - 0.5) * 30,
              Math.random() * 10,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 200, 0, ${opacity * 0.6})`;
            ctx.fill();
          }
        });

        if (dragonSegments.length > 0) {
          const head = dragonSegments[0];
          ctx.save();
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
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showDragon, isClient]);

  // 更新灯笼位置
  useEffect(() => {
    if (!isClient || lanterns.length === 0) return;
    
    const interval = setInterval(() => {
      setLanterns(prev => prev.map(lantern => {
        let newY = lantern.y - lantern.speed;
        let newWobble = lantern.wobble + 0.02;
        
        if (newY < -10) {
          newY = 110;
          newWobble = Math.random() * Math.PI * 2;
        }

        return {
          ...lantern,
          y: newY,
          wobble: newWobble,
          x: lantern.x + Math.sin(newWobble) * 0.1
        };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [lanterns.length, isClient]);

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden cursor-crosshair"
      onClick={handleClick}
    >
      {/* 星空背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-red-950/30 to-red-900/50" />
      
      {/* 星星 - 使用预生成的位置 */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              opacity: star.opacity
            }}
          />
        ))}
      </div>

      {/* 月亮 */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-400 shadow-[0_0_60px_rgba(255,200,0,0.5)] animate-pulse">
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-200 opacity-80" />
        <div className="absolute bottom-4 left-6 text-4xl opacity-30">🐇</div>
      </div>

      {/* Canvas 火龙层 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{ mixBlendMode: "screen" }}
      />

      {/* 烟花层 - 使用 CSS 动画实现 */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {fireworks.map(firework => (
          <div key={firework.id} className="absolute" style={{ left: firework.x, top: firework.y }}>
            {firework.particles.map((particle, idx) => (
              <div
                key={idx}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${particle.size * 6}px ${particle.color}`,
                  animation: `firework-explode 2s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.1}s`,
                  ['--tx' as string]: `${particle.vx * 30}px`,
                  ['--ty' as string]: `${particle.vy * 30}px`,
                  ['--color' as string]: particle.color
                }}
              />
            ))}
            {/* 中心闪光 */}
            <div 
              className="absolute w-20 h-20 rounded-full animate-ping"
              style={{
                background: `radial-gradient(circle, ${firework.color} 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%'
              }}
            />
          </div>
        ))}
      </div>

      {/* 孔明灯层 */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {lanterns.map(lantern => (
          <div
            key={lantern.id}
            className="absolute transition-all duration-100 ease-linear"
            style={{
              left: `${lantern.x}%`,
              top: `${lantern.y}%`,
              transform: `translateX(${Math.sin(lantern.wobble) * 20}px)`,
              opacity: lantern.opacity
            }}
          >
            <div 
              className="relative"
              style={{
                width: lantern.size,
                height: lantern.size * 1.3
              }}
            >
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 shadow-[0_0_30px_rgba(255,100,0,0.6)]"
                style={{
                  animation: `flicker ${2 + (lantern.id % 3)}s ease-in-out infinite alternate`
                }}
              />
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-yellow-600/50 to-transparent" />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-red-700" />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-red-600 text-xs">❋</div>
            </div>
          </div>
        ))}
      </div>

      {/* 主要内容 */}
      <div className="relative z-40 flex flex-col items-center justify-center min-h-screen px-6 text-center pointer-events-none">
        <div className="mb-8 relative pointer-events-auto">
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-400 to-red-600 drop-shadow-[0_0_30px_rgba(255,100,0,0.8)] animate-pulse">
            元宵节
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-yellow-200 mt-4 drop-shadow-[0_0_20px_rgba(255,200,0,0.6)]">
            快乐
          </h2>
          <div className="absolute -inset-10 bg-gradient-to-r from-red-600/20 via-yellow-500/20 to-red-600/20 blur-3xl -z-10 animate-pulse" />
        </div>

        <div className="relative my-12 pointer-events-auto">
          <div className="flex gap-4 justify-center items-end">
            <div className="text-6xl md:text-8xl animate-bounce" style={{ animationDelay: "0s", animationDuration: "2s" }}>
              🥣
            </div>
            <div className="text-7xl md:text-9xl animate-bounce" style={{ animationDelay: "0.2s", animationDuration: "2.2s" }}>
              🧧
            </div>
            <div className="text-6xl md:text-8xl animate-bounce" style={{ animationDelay: "0.4s", animationDuration: "1.8s" }}>
              🥣
            </div>
          </div>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-white/20 rounded-full blur-sm animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-3xl mx-auto border border-yellow-500/30 shadow-[0_0_50px_rgba(255,100,0,0.3)] relative overflow-hidden group hover:shadow-[0_0_80px_rgba(255,150,0,0.5)] transition-all duration-500 pointer-events-auto">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,200,0,0.3)_1px,_transparent_1px)] bg-[length:20px_20px]" />
          
          <p className="text-2xl md:text-3xl text-yellow-300 mb-6 font-medium tracking-wider drop-shadow-lg">
            花好月圆人团圆，汤圆香甜福连连
          </p>
          <p className="text-lg md:text-xl text-orange-200 mb-8 leading-relaxed">
            点击屏幕任意位置燃放烟花 ✨
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏮", text: "花灯万盏", color: "from-red-600/50 to-orange-600/50" },
              { icon: "🥣", text: "汤圆香甜", color: "from-orange-600/50 to-yellow-600/50" },
              { icon: "👨‍👩‍👧‍👦", text: "阖家团圆", color: "from-yellow-600/50 to-red-600/50" },
              { icon: "🎊", text: "万事如意", color: "from-red-600/50 to-pink-600/50" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`bg-gradient-to-br ${item.color} rounded-xl p-4 border border-white/10 transform hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-3xl mb-2 animate-pulse">{item.icon}</div>
                <div className="text-sm text-yellow-100 font-medium">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex gap-4 flex-wrap justify-center pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDragon(!showDragon);
            }}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_40px_rgba(255,100,0,0.8)] transform hover:scale-110 transition-all duration-300 border border-orange-400/50"
          >
            {showDragon ? "🐉 收起火龙" : "🐉 召唤火龙"}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 随机位置放烟花
              for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                  if (typeof window !== 'undefined') {
                    createFirework(
                      Math.random() * window.innerWidth,
                      Math.random() * window.innerHeight * 0.6
                    );
                  }
                }, i * 300);
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,200,0,0.5)] hover:shadow-[0_0_40px_rgba(255,200,0,0.8)] transform hover:scale-110 transition-all duration-300 border border-yellow-400/50"
          >
            🎆 自动烟花
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-950/80 to-transparent z-30 pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end opacity-40 z-20 pointer-events-none">
        <svg viewBox="0 0 1200 200" className="w-full max-w-6xl text-red-950 fill-current">
          <path d="M0,200 L0,150 L50,120 L100,150 L100,200 Z" />
          <path d="M80,200 L80,140 L150,100 L220,140 L220,200 Z" />
          <path d="M200,200 L200,130 L300,80 L400,130 L400,200 Z" />
          <path d="M350,200 L350,150 L450,110 L550,150 L550,200 Z" />
          <path d="M500,200 L500,120 L600,70 L700,120 L700,200 Z" />
          <path d="M650,200 L650,140 L750,100 L850,140 L850,200 Z" />
          <path d="M800,200 L800,150 L900,110 L1000,150 L1000,200 Z" />
          <path d="M950,200 L950,130 L1050,80 L1150,130 L1150,200 Z" />
          <path d="M1100,200 L1100,140 L1150,110 L1200,140 L1200,200 Z" />
        </svg>
      </div>

      <style jsx global>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes firework-explode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}