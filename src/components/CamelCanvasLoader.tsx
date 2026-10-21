import React, { useEffect, useRef, useState } from 'react';
import { Wifi, Zap, Sparkles, ShieldCheck } from 'lucide-react';

interface CamelCanvasLoaderProps {
  title?: string;
  subtitle?: string;
  onFinish: () => void;
}

export const CamelCanvasLoader: React.FC<CamelCanvasLoaderProps> = ({
  title = 'Cargando Échele Camello...',
  subtitle = 'Conectando con la red de técnicos de Colombia...',
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [networkInfo, setNetworkInfo] = useState<{
    type: string;
    speedText: string;
    rttMs: number;
  }>({
    type: '4G',
    speedText: 'Alta velocidad',
    rttMs: 38,
  });

  // 1. Detectar características reales de la conexión a internet
  useEffect(() => {
    let speedMultiplier = 1.0;
    try {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        const effType = (conn.effectiveType || '4g').toUpperCase();
        const rtt = conn.rtt || 45;
        const downlink = conn.downlink || 10;

        let speedText = 'Conexión ultrarrápida';
        if (effType.includes('2G') || downlink < 1.5) {
          speedText = 'Conexión básica';
          speedMultiplier = 0.55;
        } else if (effType.includes('3G') || downlink < 4) {
          speedText = 'Velocidad estándar';
          speedMultiplier = 0.75;
        } else {
          speedText = 'Fibra / 4G de alta velocidad';
          speedMultiplier = 1.25;
        }

        setNetworkInfo({
          type: effType,
          speedText,
          rttMs: Math.max(18, Math.min(rtt, 180)),
        });
      }
    } catch {
      // ignore
    }

    // Progreso dinámico adaptado a la velocidad de internet
    const startTime = Date.now();
    // Duración total calculada: entre 1.2s y 2.4s según el internet
    const targetDuration = Math.round(1800 / speedMultiplier);

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.round((elapsed / targetDuration) * 100));

      // Curva suave de aceleración/desaceleración
      setProgress(rawPct);

      if (rawPct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onFinish();
        }, 280);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [onFinish]);

  // 2. Animación en Canvas 2D: Camello estilizado color naranja caminando por dunas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Partículas de polvo y chispas naranjas
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const width = 380;
    const height = 210;
    canvas.width = width;
    canvas.height = height;

    const render = () => {
      t += 0.045;
      ctx.clearRect(0, 0, width, height);

      // Fondo resplandeciente en gradiente radial
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2 - 10, 10, width / 2, height / 2, 160);
      bgGrad.addColorStop(0, 'rgba(240, 80, 35, 0.16)');
      bgGrad.addColorStop(0.6, 'rgba(240, 80, 35, 0.04)');
      bgGrad.addColorStop(1, 'rgba(22, 22, 23, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Dunas del desierto animadas con parallax
      const drawDune = (offsetY: number, speed: number, alpha: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 10) {
          const y =
            offsetY +
            Math.sin((x + t * speed * 30) * 0.02) * 8 +
            Math.cos((x + t * speed * 15) * 0.035) * 5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      };

      // Duna de fondo
      drawDune(160, 0.4, 0.25, '#2e1c15');
      // Duna principal
      drawDune(170, 0.9, 0.85, '#231612');

      // Línea de suelo con resplandor naranja
      ctx.strokeStyle = '#f05023';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#f05023';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const y = 170 + Math.sin((x + t * 27) * 0.02) * 8 + Math.cos((x + t * 13) * 0.035) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Generar partículas en las pisadas del camello
      if (Math.random() < 0.4) {
        particles.push({
          x: width / 2 - 30 + Math.random() * 60,
          y: 172 + Math.random() * 6,
          vx: -1.2 - Math.random() * 1.5,
          vy: -0.4 - Math.random() * 0.8,
          size: 1.5 + Math.random() * 2,
          alpha: 0.9,
          color: Math.random() > 0.5 ? '#f05023' : '#ff9500',
        });
      }

      // Dibujar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ========================================================
      // DIBUJAR CAMELLO ESTILIZADO EN MOVIMIENTO (COLOR NARANJA)
      // ========================================================
      const cx = width / 2;
      // Rebote suave vertical al caminar
      const bounce = Math.sin(t * 8) * 3;
      const cy = 125 + bounce;

      ctx.save();
      ctx.shadowColor = '#f05023';
      ctx.shadowBlur = 14;

      // Gradiente característico de Échele Camello
      const camelGrad = ctx.createLinearGradient(cx - 40, cy - 40, cx + 50, cy + 30);
      camelGrad.addColorStop(0, '#ff7a50');
      camelGrad.addColorStop(0.5, '#f05023');
      camelGrad.addColorStop(1, '#c2410c');
      ctx.fillStyle = camelGrad;
      ctx.strokeStyle = '#ff9500';
      ctx.lineWidth = 1.2;

      // Articulación de patas al caminar
      const legCycle1 = Math.sin(t * 8);
      const legCycle2 = Math.sin(t * 8 + Math.PI);
      const legCycle3 = Math.sin(t * 8 + Math.PI * 0.5);
      const legCycle4 = Math.sin(t * 8 + Math.PI * 1.5);

      // Función para dibujar pata estilizada
      const drawLeg = (startX: number, startY: number, angle: number, isBack: boolean) => {
        ctx.save();
        if (isBack) {
          ctx.fillStyle = '#a8320a'; // Tonalidad más oscura para dar profundidad
        }
        const kneeX = startX + Math.sin(angle) * 16;
        const kneeY = startY + 22;
        const footX = kneeX + Math.sin(angle * 0.8) * 14;
        const footY = kneeY + 24;

        ctx.beginPath();
        ctx.moveTo(startX - 3, startY);
        ctx.lineTo(startX + 3, startY);
        ctx.lineTo(kneeX + 2.5, kneeY);
        ctx.lineTo(footX + 4, footY);
        ctx.lineTo(footX - 3, footY);
        ctx.lineTo(kneeX - 2.5, kneeY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Patas traseras (en segundo plano)
      drawLeg(cx - 26, cy + 10, legCycle2, true);
      drawLeg(cx + 20, cy + 10, legCycle4, true);

      // Cola del camello
      ctx.beginPath();
      ctx.moveTo(cx - 36, cy - 2);
      ctx.quadraticCurveTo(cx - 48, cy + 10 + Math.sin(t * 8) * 3, cx - 42, cy + 24);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f05023';
      ctx.stroke();

      // CUERPO DEL CAMELLO
      ctx.beginPath();
      // Pecho
      ctx.moveTo(cx + 24, cy + 12);
      // Vientre
      ctx.quadraticCurveTo(cx - 4, cy + 16, cx - 32, cy + 8);
      // Grupa trasera
      ctx.quadraticCurveTo(cx - 38, cy - 10, cx - 28, cy - 16);
      // Bajada antes de la joroba
      ctx.quadraticCurveTo(cx - 20, cy - 14, cx - 14, cy - 18);
      // LA GRAN JOROBA DEL CAMELLO
      ctx.quadraticCurveTo(cx - 4, cy - 44, cx + 10, cy - 18);
      // Lomo y base del cuello
      ctx.quadraticCurveTo(cx + 18, cy - 14, cx + 22, cy - 10);
      // Cuello estilizado curvado hacia arriba
      ctx.quadraticCurveTo(cx + 34, cy - 28, cx + 38, cy - 42);
      // Cabeza del camello
      ctx.quadraticCurveTo(cx + 42, cy - 50, cx + 52, cy - 48); // Hocico superior
      ctx.lineTo(cx + 54, cy - 42); // Nariz
      ctx.quadraticCurveTo(cx + 48, cy - 38, cx + 42, cy - 36); // Mandíbula
      // Parte frontal del cuello bajando hacia el pecho
      ctx.quadraticCurveTo(cx + 34, cy - 20, cx + 28, cy + 4);
      ctx.closePath();
      ctx.fill();

      // Oreja
      ctx.beginPath();
      ctx.ellipse(cx + 38, cy - 49, 4, 2, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Ojo brillante
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + 46, cy - 45, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Brillo en la joroba (High tech glow)
      const humpGlow = ctx.createRadialGradient(cx - 2, cy - 30, 2, cx - 2, cy - 30, 16);
      humpGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      humpGlow.addColorStop(1, 'rgba(240, 80, 35, 0)');
      ctx.fillStyle = humpGlow;
      ctx.beginPath();
      ctx.arc(cx - 2, cy - 30, 16, 0, Math.PI * 2);
      ctx.fill();

      // Patas delanteras (en primer plano)
      ctx.fillStyle = camelGrad;
      drawLeg(cx - 22, cy + 10, legCycle1, false);
      drawLeg(cx + 24, cy + 10, legCycle3, false);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] bg-[#161617] text-white flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200"
    >
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,80,35,0.14),transparent_65%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#f05023] animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px] text-[#ff7a50]">
            Échele Camello
          </span>
          <span className="text-[#86868b]">·</span>
          <span className="text-[11px] text-[#a1a1a6]">Garantía & Conexión</span>
        </div>

        {/* Dynamic HTML5 Canvas Camel Animation */}
        <div className="relative w-[380px] h-[210px] max-w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full drop-shadow-[0_12px_32px_rgba(240,80,35,0.25)]"
          />
        </div>

        {/* Textos de Estado */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center justify-center gap-2">
            <span>{title}</span>
          </h2>
          <p className="text-xs text-[#a1a1a6] leading-relaxed max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Barra de Progreso Apple Segmentada en Naranja Neón */}
        <div className="w-full space-y-2">
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#f05023] via-[#ff7a50] to-[#ffaa00] rounded-full transition-all duration-100 ease-out shadow-[0_0_16px_rgba(240,80,35,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#86868b] font-mono tabular-nums">
            <span className="flex items-center gap-1.5 text-[#ff7a50]">
              <Zap className="w-3 h-3 text-[#ff7a50]" />
              <span>Cargando recursos...</span>
            </span>
            <span className="font-bold text-white text-xs">{progress}%</span>
          </div>
        </div>

        {/* Badge de velocidad de internet real */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[11px] text-[#86868b]">
          <Wifi className="w-3.5 h-3.5 text-[#34c759]" />
          <span>
            Red: <strong className="text-white font-medium">{networkInfo.type}</strong> ({networkInfo.speedText} · {networkInfo.rttMs} ms)
          </span>
        </div>
      </div>
    </div>
  );
};
