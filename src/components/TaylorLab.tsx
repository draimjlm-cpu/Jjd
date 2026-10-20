import React, { useState, useRef, useEffect } from 'react';
import { POTENTIAL_MODELS, PotentialModel } from '../utils/quantumMath';
import { MathView } from './MathView';
import { Check, AlertCircle, Info, Sparkles, RefreshCw } from 'lucide-react';

export const TaylorLab: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<PotentialModel>(POTENTIAL_MODELS[0]);
  const [includeTerm0, setIncludeTerm0] = useState<boolean>(true);
  const [includeTerm1, setIncludeTerm1] = useState<boolean>(false);
  const [includeTerm2, setIncludeTerm2] = useState<boolean>(true);
  const [includeTerm3, setIncludeTerm3] = useState<boolean>(false);
  const [includeTerm4, setIncludeTerm4] = useState<boolean>(false);
  const [testPosition, setTestPosition] = useState<number>(0.6);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute approximation at position x
  const evalApproximation = (x: number) => {
    let val = 0;
    if (includeTerm0) val += selectedModel.v0;
    if (includeTerm1) val += selectedModel.vPrime0 * x;
    if (includeTerm2) val += 0.5 * selectedModel.vDoublePrime0 * x * x;
    if (includeTerm3) val += (1 / 6) * selectedModel.vTriplePrime0 * x * x * x;
    if (includeTerm4) val += (1 / 24) * selectedModel.vQuad0 * x * x * x * x;
    return val;
  };

  useEffect(() => {
    drawPlot();
  }, [selectedModel, includeTerm0, includeTerm1, includeTerm2, includeTerm3, includeTerm4, testPosition]);

  const drawPlot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const isMobile = width < 768;
    const padX = isMobile ? 40 : 60;
    const padY = isMobile ? 28 : 40;
    const plotW = width - 2 * padX;
    const plotH = height - 2 * padY;

    const [xMin, xMax] = selectedModel.xRange;
    const [yMin, yMax] = selectedModel.yRange;

    const toScreenX = (x: number) => padX + ((x - xMin) / (xMax - xMin)) * plotW;
    const toScreenY = (y: number) => height - padY - ((y - yMin) / (yMax - yMin)) * plotH;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // x axis
    const yZero = toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(padX, yZero);
    ctx.lineTo(width - padX, yZero);
    ctx.stroke();

    // y axis
    const xZero = toScreenX(0);
    ctx.beginPath();
    ctx.moveTo(xZero, padY);
    ctx.lineTo(xZero, height - padY);
    ctx.stroke();

    // 1. Plot Exact Physical Potential (Solid White Line)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = selectedModel.evaluateExact(x);
      const sx = toScreenX(x);
      const sy = toScreenY(Math.min(Math.max(y, yMin - 1), yMax + 2));
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // 2. Plot Taylor Approximation (Glowing Cyan / Orange Dashed Line)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = evalApproximation(x);
      const sx = toScreenX(x);
      const sy = toScreenY(Math.min(Math.max(y, yMin - 2), yMax + 5));
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Mark Test Position x
    const exactAtTest = selectedModel.evaluateExact(testPosition);
    const approxAtTest = evalApproximation(testPosition);
    const testSx = toScreenX(testPosition);

    // Vertical dashed marker line
    ctx.strokeStyle = '#e2e8f0';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(testSx, padY);
    ctx.lineTo(testSx, height - padY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Exact Point
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(testSx, toScreenY(exactAtTest), 5, 0, 2 * Math.PI);
    ctx.fill();

    // Approx Point
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(testSx, toScreenY(approxAtTest), 5, 0, 2 * Math.PI);
    ctx.fill();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('الموضع الإزاحي x', width / 2, height - 10);
    ctx.textAlign = 'right';
    ctx.fillText('الجهد V(x)', padX - 10, padY - 5);

    ctx.restore();
  };

  const exactVal = selectedModel.evaluateExact(testPosition);
  const approxVal = evalApproximation(testPosition);
  const absError = Math.abs(exactVal - approxVal);
  const relError = exactVal !== 0 ? (absError / Math.abs(exactVal)) * 100 : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Title */}
      <div className="border-b border-slate-800 pb-3 sm:pb-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          مختبر التحليل الرياضي والتقريب التوافقي
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
          تشريح متسلسلة تايلور للجهد: <span className="text-cyan-400 font-mono text-sm sm:text-lg">V(x) = V(0) + V'(0)x + ½V''(0)x² + ...</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          شاهد كيف يتحول أي جهد فيزيائي حقيقي معقد عند قاعه إلى قطع مكافئ توافقي دقيق عبر شطب الحدود العليا!
        </p>
      </div>

      {/* Model Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {POTENTIAL_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => {
              setSelectedModel(model);
              setTestPosition(model.id === 'lennard-jones' ? 0.08 : 0.6);
            }}
            className={`p-2.5 sm:p-3.5 rounded-xl border text-right transition-all ${
              selectedModel.id === model.id
                ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="font-bold text-xs sm:text-sm text-white">{model.arabicName}</div>
            <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5">{model.name}</div>
          </button>
        ))}
      </div>

      {/* Grid: Graph and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Graph (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[260px] sm:h-[360px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Legend inside canvas */}
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono space-y-1 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-white rounded-full"></span>
                <span className="text-white">الجهد الحقيقي الدقيق V_exact(x)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-cyan-400 rounded-full border-t border-dashed border-cyan-200"></span>
                <span className="text-cyan-400">تقريب تايلور V_approx(x)</span>
              </div>
            </div>
          </div>

          {/* Slider for displacement x */}
          <div className="mt-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-300 font-medium">اختبر الإزاحة عن موضع الاتزان (x):</span>
              <span className="text-cyan-400 font-mono font-bold text-sm">x = {testPosition.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={selectedModel.xRange[0] * 0.7}
              max={selectedModel.xRange[1] * 0.7}
              step="0.02"
              value={testPosition}
              onChange={(e) => setTestPosition(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
              <span>اهتزاز لليسار (-x)</span>
              <span>مركز الاتزان (x=0)</span>
              <span>اهتزاز لليمين (+x)</span>
            </div>
          </div>
        </div>

        {/* Controls: Term-by-Term Toggles (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              التحكم في حدود متسلسلة تايلور المضمنة:
            </div>

            <div className="space-y-2 text-xs">
              {/* Term 0: V(0) */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTerm0}
                    onChange={(e) => setIncludeTerm0(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-mono font-bold text-white">الحد 0: V(0)</span>
                    <span className="text-slate-400 block text-[11px]">طاقة المرجع الثابتة عند القاع (= 0)</span>
                  </div>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">C</span>
              </label>

              {/* Term 1: V'(0)x */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTerm1}
                    onChange={(e) => setIncludeTerm1(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-mono font-bold text-white">الحد 1: V'(0) · x</span>
                    <span className="text-slate-400 block text-[11px]">المشتقة الأولى (القوة عند الاتزان = 0)</span>
                  </div>
                </div>
                <span className="font-mono text-amber-400 text-[11px]">ينعدم دائماً</span>
              </label>

              {/* Term 2: 1/2 V''(0)x^2 */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/40 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTerm2}
                    onChange={(e) => setIncludeTerm2(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-400 focus:ring-0"
                  />
                  <div>
                    <span className="font-mono font-bold text-cyan-300">الحد 2: ½ V''(0) · x²</span>
                    <span className="text-cyan-200/80 block text-[11px]">التقريب التوافقي = ½ m ω² x²</span>
                  </div>
                </div>
                <span className="font-mono text-cyan-400 font-bold text-[11px]">المتذبذب</span>
              </label>

              {/* Term 3: 1/6 V'''(0)x^3 */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTerm3}
                    onChange={(e) => setIncludeTerm3(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-pink-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-mono font-bold text-pink-300">الحد 3: ⅙ V'''(0) · x³</span>
                    <span className="text-slate-400 block text-[11px]">اللاتماثل التكعيبي (التمدد الحراري)</span>
                  </div>
                </div>
                <span className="font-mono text-pink-400 text-[11px]">لاخطي</span>
              </label>

              {/* Term 4: 1/24 V''''(0)x^4 */}
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeTerm4}
                    onChange={(e) => setIncludeTerm4(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="font-mono font-bold text-amber-300">الحد 4: ¹/₂₄ V⁽⁴⁾(0) · x⁴</span>
                    <span className="text-slate-400 block text-[11px]">اللاتوافقية للكيوبت (Transmon Qubit)</span>
                  </div>
                </div>
                <span className="font-mono text-amber-400 text-[11px]">كيوبت</span>
              </label>
            </div>
          </div>

          {/* Quantitative Error Gauge */}
          <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mb-1">
              مقارنة الدقة عند الإزاحة الحالية (x = {testPosition.toFixed(2)}):
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">القيمة الفيزيائية الدقيقة:</span>
              <span className="text-white font-bold">{exactVal.toFixed(4)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">قيمة تقريب تايلور:</span>
              <span className="text-cyan-400 font-bold">{approxVal.toFixed(4)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">الخطأ النسبي (Relative Error):</span>
              <span className={`font-bold ${relError < 2 ? 'text-emerald-400' : relError < 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                {relError.toFixed(2)}% {relError < 2 ? '✓ (تقريب مثالي)' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
