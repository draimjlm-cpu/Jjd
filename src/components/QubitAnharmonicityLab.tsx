import React, { useState, useEffect } from 'react';
import { Cpu, Zap, AlertTriangle, CheckCircle2, Radio, Play, RotateCcw } from 'lucide-react';
import { MathView } from './MathView';

export const QubitAnharmonicityLab: React.FC = () => {
  const [anharmonicity, setAnharmonicity] = useState<number>(0.35); // alpha in GHz or hbar*omega
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [pulseTime, setPulseTime] = useState<number>(0);

  // Populations of states |0>, |1>, |2>, |3>
  const [populations, setPopulations] = useState<[number, number, number, number]>([1, 0, 0, 0]);

  // Reset or run simulation step
  useEffect(() => {
    let animId: number;

    if (isPulsing) {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        setPulseTime(elapsed);

        // Approximate 3-level density matrix dynamics under drive resonant with 0->1
        const omegaDrive = 2.0; // Rabi frequency
        const theta = omegaDrive * elapsed;

        if (anharmonicity < 0.05) {
          // Linear harmonic oscillator: coherent Poissonian-like leakage up the ladder!
          const meanN = Math.pow(Math.sin(theta / 2), 2) * 1.8;
          const p0 = Math.exp(-meanN);
          const p1 = meanN * Math.exp(-meanN);
          const p2 = (meanN * meanN / 2) * Math.exp(-meanN);
          const p3 = Math.max(0, 1 - (p0 + p1 + p2));
          setPopulations([p0, p1, p2, p3]);
        } else {
          // Transmon qubit with detuned 1->2 transition: clean two-level Rabi oscillation
          // Effective leakage suppressed by (Omega / alpha)^2
          const leakageFactor = Math.min(0.25, Math.pow(omegaDrive / (anharmonicity * 12), 2));
          const p1 = Math.pow(Math.sin(theta / 2), 2) * (1 - leakageFactor);
          const p0 = 1 - p1 - leakageFactor;
          const p2 = leakageFactor * Math.pow(Math.sin(theta), 2);
          const p3 = 0.01 * leakageFactor;
          setPopulations([Math.max(0, p0), Math.max(0, p1), Math.max(0, p2), p3]);
        }

        if (elapsed < 4.0) {
          animId = requestAnimationFrame(tick);
        } else {
          setIsPulsing(false);
        }
      };

      animId = requestAnimationFrame(tick);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPulsing, anharmonicity]);

  const handleFirePulse = () => {
    setPopulations([1, 0, 0, 0]);
    setPulseTime(0);
    setIsPulsing(true);
  };

  const handleReset = () => {
    setIsPulsing(false);
    setPulseTime(0);
    setPopulations([1, 0, 0, 0]);
  };

  // Level energy calculations
  const e01 = 5.0; // GHz baseline
  const e12 = 5.0 - anharmonicity * 1.5;
  const e23 = 5.0 - 2 * anharmonicity * 1.5;

  const isIdealQubit = anharmonicity >= 0.25;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <Cpu className="w-4 h-4" />
          الفيزياء التطبيقية في الحواسيب الكمومية
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
          من المتذبذب التوافقي إلى الكيوبت: <span className="text-cyan-400 font-mono text-lg">الترانزمون (Transmon Qubit)</span>
        </h3>
        <p className="text-sm text-slate-300 mt-1">
          شاهد كيف تمنع وصلة جوزيفسون (Josephson Junction) تسلق السلم الكمي وتعزل الحالتين |0⟩ و |1⟩ لتشكيل كيوبت حقيقي!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Energy Levels Diagram (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-slate-300">مستويات طاقة النظام:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                isIdealQubit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isIdealQubit ? 'كيوبت معزول (Transmon)' : 'متذبذب متماثل (تسرب كمي)'}
              </span>
            </div>

            {/* Visual Levels Display */}
            <div className="h-64 relative border-r-2 border-slate-800 my-4 flex flex-col justify-end gap-5 pr-4">
              {/* Level 3 */}
              <div className="flex items-center justify-between">
                <div className="w-28 h-1 bg-amber-500/60 rounded"></div>
                <div className="text-xs font-mono text-slate-400">|3⟩</div>
              </div>

              {/* Transition 2->3 */}
              <div className="text-[11px] font-mono text-amber-400/80 pr-6">
                ΔE₂₃ = {e23.toFixed(2)} GHz
              </div>

              {/* Level 2 */}
              <div className="flex items-center justify-between">
                <div className="w-36 h-1 bg-pink-500/80 rounded"></div>
                <div className="text-xs font-mono text-slate-400">|2⟩ (حالة تسرب)</div>
              </div>

              {/* Transition 1->2 */}
              <div className="text-[11px] font-mono text-pink-400 pr-6">
                ΔE₁₂ = {e12.toFixed(2)} GHz {anharmonicity > 0.05 ? `(انزياح -α)` : `(متطابق!)`}
              </div>

              {/* Level 1 */}
              <div className="flex items-center justify-between">
                <div className="w-44 h-1.5 bg-cyan-400 rounded shadow-md shadow-cyan-500/30"></div>
                <div className="text-xs font-mono font-bold text-cyan-300">|1⟩ (الحالة الكمية 1)</div>
              </div>

              {/* Transition 0->1 */}
              <div className="text-xs font-mono font-bold text-cyan-400 pr-6 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                تردد الرنين المطلوب: ΔE₀₁ = {e01.toFixed(2)} GHz
              </div>

              {/* Level 0 */}
              <div className="flex items-center justify-between">
                <div className="w-48 h-1.5 bg-blue-500 rounded"></div>
                <div className="text-xs font-mono font-bold text-blue-300">|0⟩ (الحالة الكمية 0)</div>
              </div>
            </div>
          </div>

          {/* Anharmonicity Slider */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">معامل اللاتوافقية (Anharmonicity α):</span>
              <span className="text-cyan-400 font-mono font-bold">{anharmonicity.toFixed(2)} GHz</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.02"
              value={anharmonicity}
              onChange={(e) => {
                setAnharmonicity(parseFloat(e.target.value));
                setPopulations([1, 0, 0, 0]);
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0 (متذبذب خطي)</span>
              <span>وصلة جوزيفسون (ترانزمون مثالي)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pulse Trigger & State Populations (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  تجربة إثارة الكيوبت بنبضة مايكروويف:
                </span>
                <span className="text-sm text-slate-200">
                  تسليط إشعاع رنيني بتردد الانتقال <span className="text-cyan-400 font-mono">ω = 5.00 GHz</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFirePulse}
                  disabled={isPulsing}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isPulsing ? 'جاري تطبيق النبضة...' : 'أطلق نبضة لقلب الكيوبت'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="إعادة التعيين"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="space-y-3">
              {/* P0 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-blue-400 font-bold">احتمالية الحالة |0⟩ (P₀):</span>
                  <span className="text-white font-bold">{(populations[0] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-blue-500 transition-all duration-75"
                    style={{ width: `${Math.max(0, populations[0] * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* P1 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-400 font-bold">احتمالية الحالة |1⟩ (P₁ - الهدف):</span>
                  <span className="text-white font-bold">{(populations[1] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-75 shadow-sm shadow-cyan-400"
                    style={{ width: `${Math.max(0, populations[1] * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* P2 (Leakage) */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-pink-400 font-bold">احتمالية التسرب للمستوى |2⟩ (P₂ - خطأ كمي):</span>
                  <span className={`font-bold ${populations[2] > 0.05 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {(populations[2] * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-pink-500 transition-all duration-75"
                    style={{ width: `${Math.max(0, populations[2] * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* P3 (Leakage) */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 font-bold">احتمالية التسرب للمستوى |3⟩ (P₃ - خطأ كمي):</span>
                  <span className="text-slate-400 font-bold">{(populations[3] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-500 transition-all duration-75"
                    style={{ width: `${Math.max(0, populations[3] * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Box */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
            isIdealQubit
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            {isIdealQubit ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-sm">عملية كمومية ناجحة (High-Fidelity Gate):</strong>
                  بفضل وصلة جوزيفسون واللاتوافقية α = {anharmonicity.toFixed(2)} GHz، يبتعد المستوى |2⟩ عن تردد الرنين، مما يسمح بنقل الحالة بين |0⟩ و |1⟩ بنسبة نقاء فائقة ودون أي تسرب!
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white text-sm">كارثة تسرب السلم التوافقي (Harmonic Leakage):</strong>
                  عندما تكون α = 0 (متذبذب توافقي نقي)، يمتص النظام الفوتون وينتقل إلى |2⟩ و |3⟩ عشوائياً، مما يجعل المتذبذب التوافقي النقي عاجزاً عن العمل ككيوبت حاسوبي.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
