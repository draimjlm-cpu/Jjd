import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ShieldAlert, Sparkles, Zap, Atom } from 'lucide-react';
import { MathView } from './MathView';

export const LadderOperatorsLab: React.FC = () => {
  const [currentN, setCurrentN] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string>('تم تهيئة النظام في الحالة القاعية |0⟩');
  const [zeroPointAlert, setZeroPointAlert] = useState<boolean>(false);
  const [photonEvent, setPhotonEvent] = useState<'created' | 'annihilated' | null>(null);

  const maxLevel = 7;

  const handleAnnihilation = () => {
    if (currentN === 0) {
      setZeroPointAlert(true);
      setLastAction('المحاولة فشلت: â|0⟩ = 0 ! طاقة نقطة الصفر ½ħω لا يمكن إزالتها أبداً.');
      setTimeout(() => setZeroPointAlert(false), 3500);
      return;
    }

    const prevN = currentN;
    const nextN = currentN - 1;
    setCurrentN(nextN);
    setPhotonEvent('annihilated');
    setTimeout(() => setPhotonEvent(null), 1200);

    const coef = Math.sqrt(prevN).toFixed(3);
    setLastAction(`تم تطبيق مؤثر الإفناء: â|${prevN}⟩ = ${coef} |${nextN}⟩ (انبعاث فوتون طاقته ħω)`);
  };

  const handleCreation = () => {
    if (currentN >= maxLevel) {
      setLastAction(`وصلت للحد الأقصى للتمثيل في هذا المختبر (n = ${maxLevel})`);
      return;
    }

    const prevN = currentN;
    const nextN = currentN + 1;
    setCurrentN(nextN);
    setPhotonEvent('created');
    setTimeout(() => setPhotonEvent(null), 1200);

    const coef = Math.sqrt(prevN + 1).toFixed(3);
    setLastAction(`تم تطبيق مؤثر الإنشاء: â†|${prevN}⟩ = ${coef} |${nextN}⟩ (امتصاص فوتون طاقته ħω)`);
  };

  // Uncertainty calculations
  const deltaX = Math.sqrt(currentN + 0.5).toFixed(2);
  const deltaP = Math.sqrt(currentN + 0.5).toFixed(2);
  const uncertaintyProduct = (currentN + 0.5).toFixed(1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
          <Atom className="w-4 h-4" />
          مختبر جبر ديراك ومؤثرات السلم
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
          مؤثرات الإنشاء والإفناء وفضاء فوك <span className="text-cyan-400 font-mono text-lg">(Fock Space)</span>
        </h3>
        <p className="text-sm text-slate-300 mt-1">
          تفاعل مع مؤثر الإفناء <span className="font-mono text-cyan-300">â</span> ومؤثر الإنشاء <span className="font-mono text-pink-300">â†</span>، واختبر لماذا يستحيل كسر طاقة الفراغ الأرضية!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Ladder of States (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950 p-5 rounded-xl border border-slate-800 relative overflow-hidden">
          {/* Photon Animation overlay */}
          {photonEvent && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs z-20 pointer-events-none transition-all">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500 shadow-xl text-sm font-bold animate-bounce">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className={photonEvent === 'created' ? 'text-pink-400' : 'text-cyan-400'}>
                  {photonEvent === 'created' ? 'امتصاص كم طاقة +ħω' : 'انبعاث كم طاقة -ħω'}
                </span>
              </div>
            </div>
          )}

          {/* Zero-point alert overlay */}
          {zeroPointAlert && (
            <div className="absolute inset-x-4 top-4 z-30 p-3 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs shadow-2xl flex items-start gap-2 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white text-sm">مستحيل كمومياً: â|0⟩ = 0</strong>
                لا يمكن امتصاص أو إزالة طاقة الحالة القاعية (½ħω)! مبدأ عدم اليقين يمنع سكون الجسيم تماماً.
              </div>
            </div>
          )}

          {/* Vertical Fock Ladder */}
          <div className="space-y-2">
            {[7, 6, 5, 4, 3, 2, 1, 0].map((n) => {
              const isCurrent = currentN === n;
              return (
                <div
                  key={n}
                  onClick={() => setCurrentN(n)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/40 translate-x-1'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                        isCurrent ? 'bg-cyan-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      |{n}⟩
                    </span>
                    <div>
                      <span className="font-mono text-xs text-slate-300">
                        {n === 0 ? 'الحالة القاعية (Ground State)' : `الحالة المثارة رقم ${n}`}
                      </span>
                      {n === 0 && (
                        <span className="block text-[10px] text-cyan-400 font-sans">
                          نقطة الصفر (Zero-point)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="font-mono text-xs text-slate-400">
                    E_{n} = <span className="text-emerald-400 font-bold">{(n + 0.5).toFixed(1)} ħω</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Log Text */}
          <div className="mt-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
            {lastAction}
          </div>
        </div>

        {/* Right Column: Interactive Buttons & Heisenberg Calculator (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          {/* Operator Action Buttons */}
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              تحفيز الانتقالات الكمية بالمؤثرات:
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCreation}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
              >
                <ArrowUp className="w-5 h-5" />
                <span>مؤثر الإنشاء â†</span>
              </button>

              <button
                onClick={handleAnnihilation}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <ArrowDown className="w-5 h-5" />
                <span>مؤثر الإفناء â</span>
              </button>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div>
                <span className="text-pink-400 font-mono font-bold">â†|n⟩ = √(n+1) |n+1⟩</span>
                <span className="text-slate-400 block text-[11px]">معامل التكبير: √({currentN}+1) = {Math.sqrt(currentN + 1).toFixed(3)}</span>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <span className="text-cyan-400 font-mono font-bold">â|n⟩ = √n |n-1⟩</span>
                <span className="text-slate-400 block text-[11px]">معامل التكبير: √({currentN}) = {Math.sqrt(currentN).toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* Real-time Heisenberg Uncertainty Gauge */}
          <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">
                حساب مبدأ عدم اليقين لهايزنبرغ للحالة |{currentN}⟩:
              </span>
              <span className="font-mono text-amber-400 font-bold">Δx · Δp ≥ ½ ħ</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">لايقين الموضع Δx:</span>
                <span className="text-cyan-400 font-bold text-sm">{deltaX} x₀</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">لايقين الزخم Δp:</span>
                <span className="text-pink-400 font-bold text-sm">{deltaP} p₀</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">حاصل الضرب Δx · Δp:</span>
                <span className="text-white font-bold text-base">{uncertaintyProduct} ħ</span>
              </div>

              {currentN === 0 ? (
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-sans font-bold">
                  ✓ الحد الأدنى المطلق (½ ħ)
                </span>
              ) : (
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-sans">
                  حالة مثارة ({uncertaintyProduct} &gt; 0.5)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
