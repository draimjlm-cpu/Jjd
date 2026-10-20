import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Info, Sparkles, Layers, Sliders, Eye, Smartphone } from 'lucide-react';
import {
  wavefunction,
  probabilityDensity,
  energyLevel,
  classicalTurningPoint,
  coherentState,
} from '../utils/quantumMath';
import { MathView } from './MathView';
import { useDevice } from '../hooks/useDevice';

export const QuantumOscillatorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isMobile } = useDevice();

  // Controls
  const [activeLevel, setActiveLevel] = useState<number | 'all'>('all');
  const [maxN, setMaxN] = useState<number>(6);
  const [displayMode, setDisplayMode] = useState<'psi' | 'prob'>('psi');
  const [showTurningPoints, setShowTurningPoints] = useState<boolean>(true);
  const [showTunnelingZones, setShowTunnelingZones] = useState<boolean>(true);
  const [isCoherentActive, setIsCoherentActive] = useState<boolean>(false);
  const [alphaCoherent, setAlphaCoherent] = useState<number>(1.8);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; xVal: number } | null>(null);

  // Time evolution
  const timeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Palette matching the screenshot's stunning gradient (cyan -> purple -> pink -> amber)
  const levelColors = useMemo(() => [
    '#38bdf8', // n=0: sky blue (zero point)
    '#60a5fa', // n=1: royal blue
    '#818cf8', // n=2: indigo
    '#a855f7', // n=3: purple
    '#ec4899', // n=4: pink / magenta
    '#f43f5e', // n=5: rose
    '#fb923c', // n=6: amber / gold
    '#facc15', // n=7
    '#a3e635', // n=8
  ], []);

  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (currentTimestamp: number) => {
      const dt = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;

      if (isPlaying) {
        timeRef.current += dt * 2.5; // animation speed
      }

      drawCanvas();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    isPlaying,
    activeLevel,
    maxN,
    displayMode,
    showTurningPoints,
    showTunnelingZones,
    isCoherentActive,
    alphaCoherent,
    hoveredPoint,
    isMobile,
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Padding tuned for mobile vs desktop
    const padX = isMobile ? 42 : 70;
    const padY = isMobile ? 35 : 50;
    const plotW = width - 2 * padX;
    const plotH = height - 2 * padY;

    // Physical bounds: x/x0 from -3.8 to +3.8
    const xMin = -3.8;
    const xMax = 3.8;
    const eMin = 0;
    const eMax = (maxN + 1.6);

    const toScreenX = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * plotW;
    const toScreenY = (e: number) => height - padY - ((e - eMin) / (eMax - eMin)) * plotH;

    // 1. Draw grid lines and axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Vertical x ticks
    for (let x = -3; x <= 3; x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, padY);
      ctx.lineTo(sx, height - padY);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = isMobile ? '10px "JetBrains Mono", monospace' : '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(x.toString(), sx, height - padY + (isMobile ? 14 : 18));
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = isMobile ? '10px "JetBrains Mono", monospace' : '13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('x / x₀  ,  x₀ = √(ħ/mω)', width / 2, height - (isMobile ? 6 : 12));

    // Energy axis label
    ctx.textAlign = 'right';
    ctx.fillText('E (ħω)', padX - (isMobile ? 8 : 15), padY - (isMobile ? 8 : 12));

    // 2. Parabolic potential V(x)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = isMobile ? 2 : 2.5;
    ctx.beginPath();
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const v = 0.5 * x * x;
      const sx = toScreenX(x);
      const sy = toScreenY(v);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // 3. Render Coherent State if active
    if (isCoherentActive) {
      const t = timeRef.current;
      const cState = coherentState(alphaCoherent, t, 1.0, 0, 1.0);
      const xTurn = Math.sqrt(2) * alphaCoherent;

      // Draw potential fill under coherent packet
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      const numPts = 180;
      for (let i = 0; i <= numPts; i++) {
        const x = xMin + (i / numPts) * (xMax - xMin);
        const pt = coherentState(alphaCoherent, t, 1.0, x, 1.0);
        const eBaseline = alphaCoherent * alphaCoherent + 0.5;
        const waveScale = isMobile ? 0.9 : 1.2;
        const sy = toScreenY(eBaseline + (displayMode === 'prob' ? pt.prob : pt.re) * waveScale);
        const sx = toScreenX(x);
        if (i === 0) ctx.moveTo(sx, toScreenY(eBaseline));
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(toScreenX(xMax), toScreenY(alphaCoherent * alphaCoherent + 0.5));
      ctx.closePath();
      ctx.fill();

      // Draw coherent wave line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= numPts; i++) {
        const x = xMin + (i / numPts) * (xMax - xMin);
        const pt = coherentState(alphaCoherent, t, 1.0, x, 1.0);
        const eBaseline = alphaCoherent * alphaCoherent + 0.5;
        const waveScale = isMobile ? 0.9 : 1.2;
        const sy = toScreenY(eBaseline + (displayMode === 'prob' ? pt.prob : pt.re) * waveScale);
        const sx = toScreenX(x);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Classical particle marker tracing <x>(t)
      const particleSx = toScreenX(cState.xMean);
      const particleSy = toScreenY(0.5 * cState.xMean * cState.xMean);
      ctx.beginPath();
      ctx.arc(particleSx, particleSy, isMobile ? 5 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Energy level line for coherent state <E>
      const eCoherent = alphaCoherent * alphaCoherent + 0.5;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(toScreenX(-xTurn), toScreenY(eCoherent));
      ctx.lineTo(toScreenX(xTurn), toScreenY(eCoherent));
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // 4. Render Eigenstates (n = 0 to maxN)
      const levelsToRender = activeLevel === 'all'
        ? Array.from({ length: maxN + 1 }, (_, i) => i)
        : [activeLevel];

      levelsToRender.forEach((n) => {
        const en = energyLevel(n);
        const color = levelColors[n % levelColors.length];
        const xcl = classicalTurningPoint(n);
        const sxClMinus = toScreenX(-xcl);
        const sxClPlus = toScreenX(xcl);
        const syEn = toScreenY(en);

        // A) Energy baseline level
        ctx.strokeStyle = `${color}55`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(toScreenX(-3.5), syEn);
        ctx.lineTo(toScreenX(3.5), syEn);
        ctx.stroke();

        // Level text annotation (n = ...)
        ctx.fillStyle = color;
        ctx.font = isMobile ? 'bold 10px "JetBrains Mono", monospace' : 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`n=${n}`, toScreenX(xMax) - (isMobile ? 32 : 45), syEn - (isMobile ? 2 : 4));

        if (n === 0 && !isMobile) {
          ctx.fillStyle = '#38bdf8';
          ctx.font = '11px "Cairo", sans-serif';
          ctx.fillText('نقطة الصفر (Zero-point)', toScreenX(xMax) - 170, syEn + 14);
        }

        // B) Classical turning points
        if (showTurningPoints && (activeLevel === n || activeLevel === 'all')) {
          ctx.strokeStyle = `${color}44`;
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.moveTo(sxClMinus, syEn - (isMobile ? 10 : 15));
          ctx.lineTo(sxClMinus, syEn + (isMobile ? 10 : 15));
          ctx.moveTo(sxClPlus, syEn - (isMobile ? 10 : 15));
          ctx.lineTo(sxClPlus, syEn + (isMobile ? 10 : 15));
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // C) Draw Wavefunction or Probability Density
        const waveScale = displayMode === 'prob' ? (isMobile ? 0.6 : 0.75) : (isMobile ? 0.45 : 0.55);
        const numSamples = isMobile ? 180 : 250;

        // Gradient fill below wavefunction
        const fillGradient = ctx.createLinearGradient(0, syEn - 30, 0, syEn + 30);
        fillGradient.addColorStop(0, `${color}40`);
        fillGradient.addColorStop(1, `${color}05`);

        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= numSamples; i++) {
          const x = xMin + (i / numSamples) * (xMax - xMin);
          let val = 0;
          if (displayMode === 'prob') {
            val = probabilityDensity(n, x);
          } else {
            val = wavefunction(n, x);
          }

          const sy = syEn - val * waveScale * (isMobile ? 35 : 45);
          const sx = toScreenX(x);

          if (first) {
            ctx.moveTo(sx, syEn);
            first = false;
          }
          ctx.lineTo(sx, sy);
        }
        ctx.lineTo(toScreenX(xMax), syEn);
        ctx.closePath();
        ctx.fillStyle = fillGradient;
        ctx.fill();

        // Wave outline stroke
        ctx.strokeStyle = color;
        ctx.lineWidth = activeLevel === n ? (isMobile ? 2.5 : 3) : (isMobile ? 1.5 : 2);
        ctx.beginPath();
        for (let i = 0; i <= numSamples; i++) {
          const x = xMin + (i / numSamples) * (xMax - xMin);
          const val = displayMode === 'prob' ? probabilityDensity(n, x) : wavefunction(n, x);
          const sy = syEn - val * waveScale * (isMobile ? 35 : 45);
          const sx = toScreenX(x);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // D) Highlight Tunneling Area
        if (showTunnelingZones && (activeLevel === n || activeLevel === 'all')) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
          ctx.fillRect(toScreenX(xMin), syEn - 12, sxClMinus - toScreenX(xMin), 24);
          ctx.fillRect(sxClPlus, syEn - 12, toScreenX(xMax) - sxClPlus, 24);
        }
      });
    }

    // 5. Draw mouse or touch inspection marker
    if (hoveredPoint) {
      const hx = hoveredPoint.x;
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, padY);
      ctx.lineTo(hx, height - padY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const updateHoverCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const padX = isMobile ? 42 : 70;
    const plotW = rect.width - 2 * padX;
    const xMin = -3.8;
    const xMax = 3.8;
    const xVal = xMin + ((xPos - padX) / plotW) * (xMax - xMin);

    if (xPos >= padX && xPos <= rect.width - padX) {
      setHoveredPoint({ x: xPos, y: yPos, xVal: parseFloat(xVal.toFixed(2)) });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updateHoverCoordinates(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      updateHoverCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handlePointerLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Banner Matching the Slide Theme */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 sm:pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            17 — IV · OSCILLATORS, ATOMS, QUBITS
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-0.5 sm:mt-1">
            المتذبذب التوافقي الكمي
          </h2>
        </div>

        {/* Mode Selector Tabs (Wrapped gracefully for mobile) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => {
              setIsCoherentActive(false);
              setDisplayMode('psi');
            }}
            className={`flex-1 sm:flex-none text-center px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              !isCoherentActive && displayMode === 'psi'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الدالة الموجية ψ(x)
          </button>
          <button
            onClick={() => {
              setIsCoherentActive(false);
              setDisplayMode('prob');
            }}
            className={`flex-1 sm:flex-none text-center px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              !isCoherentActive && displayMode === 'prob'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            كثافة الاحتمال |ψ|²
          </button>
          <button
            onClick={() => setIsCoherentActive(true)}
            className={`flex-1 sm:flex-none text-center px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
              isCoherentActive
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            الحالة |α⟩
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas & Math Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left / Top Canvas View */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative w-full h-[280px] sm:h-[440px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner touch-none">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handlePointerLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handlePointerLeave}
              className="w-full h-full cursor-crosshair"
            />

            {/* Hover / Touch Floating Data */}
            {hoveredPoint && (
              <div className="absolute top-2 left-2 bg-slate-900/95 border border-slate-700/80 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300 shadow-lg pointer-events-none">
                <div>الموضع: x/x₀ = <span className="text-cyan-400 font-bold">{hoveredPoint.xVal}</span></div>
                <div>الجهد: V = <span className="text-amber-400">{(0.5 * hoveredPoint.xVal * hoveredPoint.xVal).toFixed(2)} ħω</span></div>
              </div>
            )}
          </div>

          {/* Interactive Controls Bar */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-950/70 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-xs">
            {/* Level Selector Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
              <span className="text-slate-400 font-mono ml-1 text-[11px]">المستوى:</span>
              <button
                onClick={() => setActiveLevel('all')}
                className={`px-2 py-1 rounded-md font-mono text-xs transition-all ${
                  activeLevel === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                الكل
              </button>
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setActiveLevel(n)}
                  className={`px-2 py-1 rounded-md font-mono text-xs transition-all ${
                    activeLevel === n
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  n={n}
                </button>
              ))}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t sm:border-t-0 border-slate-800">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={showTurningPoints}
                  onChange={(e) => setShowTurningPoints(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
                نقاط التحول (±x_cl)
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={showTunnelingZones}
                  onChange={(e) => setShowTunnelingZones(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                />
                النفق الكمي (Tunneling)
              </label>

              {isCoherentActive && (
                <div className="flex items-center gap-1.5 mr-auto sm:mr-2">
                  <span className="text-amber-400 font-mono text-[11px]">سعة α:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={alphaCoherent}
                    onChange={(e) => setAlphaCoherent(parseFloat(e.target.value))}
                    className="w-16 accent-amber-500"
                  />
                  <span className="text-white font-mono text-[11px]">{alphaCoherent}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Math & Physics Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Card exactly reproducing the slide equation box */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-4 sm:p-5 rounded-xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
            <div className="text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-wide">
              معادلات ديراك الأساسية
            </div>

            <div className="bg-slate-950/80 rounded-lg p-2.5 sm:p-3 border border-slate-800/80 mb-3 overflow-x-auto text-xs sm:text-sm">
              <MathView math="\hat{H} = \hbar\omega \left(\hat{a}^\dagger \hat{a} + \frac{1}{2}\right)" block />
              <MathView math="E_n = \hbar\omega \left(n + \frac{1}{2}\right), \quad n = 0, 1, 2, \dots" block />
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0"></span>
                <p>
                  <strong className="text-white">مستويات متساوية التباعد:</strong>
                  {' '}المسافة بين أي مستويين متتاليين ثابتة: <span className="text-cyan-300 font-mono">ΔE = ℏω</span>.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <p>
                  <strong className="text-white">طاقة نقطة الصفر (Zero-point):</strong>
                  {' '}الحالة القاعية تمتلك طاقة دنيا <span className="text-amber-300 font-mono font-bold">½ ℏω</span> لا يمكن إزالتها أبداً بموجب مبدأ هايزنبرغ (<span className="text-slate-300 font-mono">Δx·Δp ≥ ℏ/2</span>).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Active State Inspector */}
          <div className="bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] mb-1 flex items-center justify-between">
              <span>بيانات الحالة</span>
              <span className="text-cyan-400 font-bold">{activeLevel === 'all' ? 'جميع المستويات' : `المستوى n = ${activeLevel}`}</span>
            </div>

            {activeLevel !== 'all' ? (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">الطاقة Eₙ:</span>
                  <span className="text-emerald-400 font-bold">{(activeLevel + 0.5).toFixed(1)} ℏω</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">نقاط التحول ±x_cl:</span>
                  <span className="text-amber-400 font-bold">±{classicalTurningPoint(activeLevel).toFixed(2)} x₀</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">عدد العقد (Nodes):</span>
                  <span className="text-purple-400 font-bold">{activeLevel} عقد</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">التناظر (Parity):</span>
                  <span className="text-cyan-300 font-bold">{activeLevel % 2 === 0 ? 'زوجي (Even)' : 'فردي (Odd)'}</span>
                </div>
              </>
            ) : (
              <p className="text-slate-400 font-sans leading-relaxed text-[11px] pt-1">
                انقر أو المس أي مستوى (مثل n=0 أو n=3) لعزل دالته الموجية والاطلاع على خصائصه.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
