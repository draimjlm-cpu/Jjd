import React, { useState } from 'react';
import {
  Atom,
  Sparkles,
  Sliders,
  Cpu,
  BookOpen,
  Smartphone,
  Laptop,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { QuantumOscillatorCanvas } from './components/QuantumOscillatorCanvas';
import { TaylorLab } from './components/TaylorLab';
import { LadderOperatorsLab } from './components/LadderOperatorsLab';
import { QubitAnharmonicityLab } from './components/QubitAnharmonicityLab';
import { TheorySection } from './components/TheorySection';
import { useDevice } from './hooks/useDevice';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'taylor' | 'ladder' | 'qubit' | 'theory'>('simulator');
  const { isMobile, orientation, screenWidth } = useDevice();

  const tabs = [
    {
      id: 'simulator',
      label: 'المتذبذب الكمي',
      shortLabel: 'المتذبذب',
      enLabel: 'Oscillator',
      icon: Atom,
      badge: 'الصورة الأصلية',
    },
    {
      id: 'taylor',
      label: 'مختبر تايلور',
      shortLabel: 'تايلور V(x)',
      enLabel: 'Taylor Lab',
      icon: Sliders,
      badge: 'V(x) مفكوك',
    },
    {
      id: 'ladder',
      label: 'مؤثرات السلم',
      shortLabel: 'السلم â',
      enLabel: 'Ladder Ops',
      icon: Layers,
      badge: 'â & â†',
    },
    {
      id: 'qubit',
      label: 'الكيوبت والترانزمون',
      shortLabel: 'الكيوبت',
      enLabel: 'Qubit Lab',
      icon: Cpu,
      badge: 'حوسبة كمية',
    },
    {
      id: 'theory',
      label: 'الموسوعة والاشتقاقات',
      shortLabel: 'الموسوعة',
      enLabel: 'Theory',
      icon: BookOpen,
      badge: 'أكاديمي',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Atom className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-lg text-white leading-tight">
                المتذبذب التوافقي الكمي
              </h1>
              <p className="text-[10px] sm:text-[11px] font-mono text-cyan-400">
                Quantum Oscillator · Lecture 17
              </p>
            </div>
          </div>

          {/* Device Detection Indicator Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              {isMobile ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300">وضع الهاتف</span>
                </>
              ) : (
                <>
                  <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">وضع الحاسوب</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950 border-b border-slate-800/60 py-4 sm:py-7 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-mono mb-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                تحليل الشريحة الفيزيائية الجامعية بالتفصيل التفاعلي
              </div>
              <h2 className="text-lg sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                الفيزياء الكمية التفاعلية: الجبر، الموجات، وتطبيقات الكيوبت
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 sm:mt-2 leading-relaxed">
                استكشف كل معادلة ومنحنى فيزيائي ظهر في شريحة المحاضرة مع الحساب الدقيق لكثيرات حدود هيرميت، وطاقة نقطة الصفر، وكيف تُبنى الكيوبتات.
              </p>
            </div>

            {/* Quick Equation Snapshot on Desktop / Small Card on Mobile */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-xl font-mono text-xs text-slate-300 flex flex-row md:flex-col justify-between items-center md:items-start gap-1 shrink-0">
              <span className="text-slate-400 text-[10px] uppercase font-bold">المعادلة:</span>
              <span className="text-cyan-400 font-bold text-xs sm:text-sm">Ĥ = ħω(â†â + ½)</span>
              <span className="text-emerald-400 font-bold text-xs sm:text-sm">Eₙ = ħω(n + ½)</span>
            </div>
          </div>

          {/* Desktop/Tablet Horizontal Tabs Bar */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto pt-5 pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area (extra bottom padding on mobile for bottom navigation) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-24 md:pb-8">
        {activeTab === 'simulator' && <QuantumOscillatorCanvas />}
        {activeTab === 'taylor' && <TaylorLab />}
        {activeTab === 'ladder' && <LadderOperatorsLab />}
        {activeTab === 'qubit' && <QubitAnharmonicityLab />}
        {activeTab === 'theory' && <TheorySection />}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar (Optimized for One-Hand Thumb Access) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 px-1 py-1 shadow-2xl safe-area-pb">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight truncate w-full text-center mt-0.5">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block bg-slate-950 border-t border-slate-850 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            المتذبذب التوافقي الكمي · محاكاة وتوضيح تفاعلي أكاديمي لمقررات ميكانيكا الكم والمعالجات الكمية
          </p>
          <p className="font-mono text-[11px] text-slate-500 mt-1">
            Ĥ = ħω(â†â + ½) · Eₙ = ħω(n + ½) · [â, â†] = 1 · Δx·Δp ≥ ½ħ
          </p>
        </div>
      </footer>
    </div>
  );
}
