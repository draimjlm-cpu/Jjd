import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Atom,
  Cpu,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { MathView } from './MathView';

interface Chapter {
  id: string;
  number: string;
  title: string;
  enTitle: string;
  summary: string;
  badge: string;
  content: React.ReactNode;
}

export const TheorySection: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>('chapter-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAll, setExpandedAll] = useState<boolean>(false);

  const chapters: Chapter[] = [
    {
      id: 'chapter-1',
      number: 'الباب الأول',
      title: 'التحليل الميكانيكي الكلاسيكي واشتقاق متسلسلة تايلور من الصفر',
      enTitle: 'Classical Foundation & Taylor Expansion from Scratch',
      badge: 'الاشتقاق 1 + 1',
      summary: 'اشتقاق خطوة بخطوة لكيفية تحول أي جهد فيزيائي عام V(x) عند موضع اتزانه إلى قطع مكافئ توافقي دقيق عبر إهمال الحدود العليا.',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              1.1 مفهوم الطاقة الكلاسيكية (طاقة الحركة وطاقة الوضع)
            </h4>
            <p>
              في الفيزياء الكلاسيكية لنيوتن وهاميلتون، طاقة جسيم كتلته <MathView math="m" /> يتحرك على محور <MathView math="x" /> بسرعة <MathView math="v" /> وزخم خطي <MathView math="p = m \cdot v" /> تُكتب كمجموع لطاقتي الحركة والوضع:
            </p>
            <MathView math="T = \frac{1}{2} m v^2 = \frac{1}{2} m \left(\frac{p}{m}\right)^2 = \frac{p^2}{2m}" block />
            <p>
              أما طاقة الوضع <MathView math="V(x)" /> فترتبط بالقوة <MathView math="F(x)" /> عبر سالب انحدار الجهد (القوة تدفع الجسيم دائماً نحو مناطق الطاقة الأقل):
            </p>
            <MathView math="F(x) = - \frac{dV(x)}{dx}" block />
            <p>
              وبالتالي يكون دالة هاميلتون الكلاسيكية (طاقة النظام الكلية):
            </p>
            <MathView math="H(x, p) = \frac{p^2}{2m} + V(x)" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              1.2 البرهان الرياضي خطوة بخطوة لمتسلسلة تايلور (حساب المعاملات)
            </h4>
            <p>
              نفرض أن لدينا دالة جهد عامة <MathView math="V(x)" /> ونريد معرفة سلوكها بالقرب من موضع اتزان مستقر نختاره عند <MathView math="x = 0" />. نفرض إمكانية كتابة الجهد كمتسلسلة قوى لانهائية بثوابت غير معروفة <MathView math="c_0, c_1, c_2, \dots" />:
            </p>
            <MathView math="V(x) = c_0 + c_1 x + c_2 x^2 + c_3 x^3 + c_4 x^4 + \dots" block />

            <div className="space-y-3 mt-3 pr-2 border-r-2 border-slate-800">
              <div>
                <strong className="text-white block text-xs">الخطوة الأولى: إيجاد الثابت c₀</strong>
                <p>نعوض <MathView math="x = 0" /> في متسلسلة القوى:</p>
                <MathView math="V(0) = c_0 + c_1(0) + c_2(0)^2 + \dots \implies c_0 = V(0) = \frac{V(0)}{0!}" />
              </div>

              <div>
                <strong className="text-white block text-xs">الخطوة الثانية: إيجاد الثابت c₁</strong>
                <p>نشتق الدالة لأول مرة بالنسبة لـ <MathView math="x" />:</p>
                <MathView math="\frac{dV}{dx} = V'(x) = c_1 + 2 c_2 x + 3 c_3 x^2 + 4 c_4 x^3 + \dots" />
                <p>بالتعويض عند <MathView math="x = 0" />:</p>
                <MathView math="V'(0) = c_1 \implies c_1 = \frac{V'(0)}{1!}" />
              </div>

              <div>
                <strong className="text-white block text-xs">الخطوة الثالثة: إيجاد الثابت c₂</strong>
                <p>نشتق للمرة الثانية:</p>
                <MathView math="\frac{d^2 V}{dx^2} = V''(x) = (2 \cdot 1) c_2 + (3 \cdot 2) c_3 x + (4 \cdot 3) c_4 x^2 + \dots" />
                <p>بالتعويض عند <MathView math="x = 0" />:</p>
                <MathView math="V''(0) = 2 c_2 \implies c_2 = \frac{V''(0)}{2} = \frac{V''(0)}{2!}" />
              </div>

              <div>
                <strong className="text-white block text-xs">الخطوة الرابعة: إيجاد الثابت c₃ والثابت c₄</strong>
                <p>بالاشتقاق المتتابع للمرة الثالثة والرابعة والتعويض عند <MathView math="x = 0" />:</p>
                <MathView math="c_3 = \frac{V'''(0)}{3 \cdot 2 \cdot 1} = \frac{V'''(0)}{6} = \frac{V'''(0)}{3!}, \quad c_4 = \frac{V^{(4)}(0)}{4 \cdot 3 \cdot 2 \cdot 1} = \frac{V^{(4)}(0)}{24} = \frac{V^{(4)}(0)}{4!}" />
              </div>
            </div>

            <p className="mt-4 font-semibold text-cyan-300">
              بالتعويض عن جميع الثوابت <MathView math="c_n" /> نصل إلى متسلسلة تايلور الكاملة:
            </p>
            <MathView math="V(x) = V(0) + V'(0) x + \frac{1}{2} V''(0) x^2 + \frac{1}{6} V'''(0) x^3 + \frac{1}{24} V^{(4)}(0) x^4 + \dots" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              1.3 التفسير الفيزيائي المعمق لكل حد
            </h4>
            <ul className="space-y-2 list-disc list-inside text-slate-300">
              <li>
                <strong className="text-white">الحد V(0):</strong> طاقة مرجعية ثابتة عند القاع، وبما أن القوة تعتمد على انحدار الجهد فقط <MathView math="F = -dV/dx" />، فيمكن معايرة المرجع وجعل <MathView math="V(0) = 0" />.
              </li>
              <li>
                <strong className="text-white">الحد V'(0)x:</strong> القوة عند قاع البئر معدومة حتماً <MathView math="F(0) = -V'(0) = 0" /> لأن الجسيم في حالة اتزان، لذلك <strong className="text-cyan-300">ينعدم هذا الحد دائماً</strong>!
              </li>
              <li>
                <strong className="text-white">الحد ½ V''(0)x²:</strong> يمثل انحناء الجهد. القوة الناتجة عنه هي <MathView math="F = -V''(0)x" />، وهي تطابق قانون هوك للنابض <MathView math="F = -kx" />، حيث ثابت الصلابة الفعال هو <MathView math="k = V''(0) = m\omega^2" />، فينتج جهد المتذبذب التوافقي: <MathView math="\frac{1}{2} m \omega^2 x^2" />.
              </li>
              <li>
                <strong className="text-white">الحدود التكعيبية والرباعية:</strong> في السعات الصغيرة <MathView math="x \ll 1" />، يكون <MathView math="x^3" /> و <MathView math="x^4" /> أصغر بآلاف المرات من <MathView math="x^2" />، مما يبرر إهمالها التام في تقريب الاهتزازات الصغيرة.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'chapter-2',
      number: 'الباب الثاني',
      title: 'مسلمات الكم والمؤثرات وبرهان [x̂, p̂] = iħ',
      enTitle: 'Canonical Quantization & Commutator Proof',
      badge: 'برهان رياضي',
      summary: 'البرهان الصارم بالتفصيل الممل لعلاقة التبديل القانونية لهايزنبرغ عبر التأثير على دالة اختبار وقاعدة ضرب الدوال.',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              2.1 المؤثرات في تمثيل الموضع
            </h4>
            <p>
              في ميكانيكا الكم، يستبدل الموضع والزخم بمؤثرات خطية هيرميتية تؤثر على فضاء هيلبرت:
            </p>
            <MathView math="\hat{x} \psi(x) = x \cdot \psi(x)" block />
            <MathView math="\hat{p} \psi(x) = -i \hbar \frac{d\psi(x)}{dx}" block />
            <p className="text-xs text-slate-400 mt-2">
              (ملاحظة: وجود العدد التخيلي <MathView math="i" /> والإشارة السالبة ضروري لضمان هيرميتية مؤثر الزخم <MathView math="\hat{p}^\dagger = \hat{p}" />، مما يضمن أن قياسات الزخم تعطي أعداداً حقيقية فقط).
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              2.2 البرهان الرياضي التفصيلي لعلاقة التبديل [x̂, p̂] = iħ
            </h4>
            <p>
              لحساب المتبادل <MathView math="[\hat{x}, \hat{p}] = \hat{x}\hat{p} - \hat{p}\hat{x}" />، نطبقه على دالة اختبار اعتباطية ناعمة <MathView math="f(x)" />:
            </p>
            <MathView math="[\hat{x}, \hat{p}] f(x) = \hat{x}(\hat{p} f(x)) - \hat{p}(\hat{x} f(x))" block />

            <div className="space-y-3 mt-3 pr-2 border-r-2 border-cyan-500/40">
              <div>
                <strong className="text-white block text-xs">الشق الأول: تأثير x̂(p̂ f(x))</strong>
                <MathView math="\hat{p} f(x) = -i\hbar \frac{df}{dx} \implies \hat{x}(\hat{p} f(x)) = x \left( -i\hbar \frac{df}{dx} \right) = -i\hbar x \frac{df}{dx}" />
              </div>

              <div>
                <strong className="text-white block text-xs">الشق الثاني: تأثير p̂(x̂ f(x)) وتطبيق قاعدة الضرب</strong>
                <p>نؤثر بمؤثر الزخم على حاصل ضرب الدالتين <MathView math="[x \cdot f(x)]" />:</p>
                <MathView math="\hat{p}(\hat{x} f(x)) = -i\hbar \frac{d}{dx} [x \cdot f(x)]" />
                <p>نطبق قاعدة تفاضل حاصل ضرب دالتين: <MathView math="\frac{d}{dx}[u \cdot v] = \frac{du}{dx}v + u\frac{dv}{dx}" />:</p>
                <MathView math="\frac{d}{dx}[x \cdot f(x)] = \left(\frac{dx}{dx}\right) f(x) + x \left(\frac{df}{dx}\right) = 1 \cdot f(x) + x \frac{df}{dx}" />
                <p>نضرب في المعامل الثابت <MathView math="(-i\hbar)" />:</p>
                <MathView math="\hat{p}(\hat{x} f(x)) = -i\hbar f(x) - i\hbar x \frac{df}{dx}" />
              </div>

              <div>
                <strong className="text-white block text-xs">طرح الشق الثاني من الشق الأول:</strong>
                <MathView math="[\hat{x}, \hat{p}] f(x) = \left( -i\hbar x \frac{df}{dx} \right) - \left( -i\hbar f(x) - i\hbar x \frac{df}{dx} \right)" />
                <MathView math="[\hat{x}, \hat{p}] f(x) = -i\hbar x \frac{df}{dx} + i\hbar f(x) + i\hbar x \frac{df}{dx} = i\hbar f(x)" />
              </div>
            </div>

            <p className="mt-4 font-bold text-emerald-400">
              بما أن دالة الاختبار <MathView math="f(x)" /> غير منعدمة واعتباطية، نختصرها لنحصل على القانون الأساسي:
            </p>
            <MathView math="[\hat{x}, \hat{p}] = i\hbar \hat{\mathbb{I}}" block />
          </div>
        </div>
      ),
    },
    {
      id: 'chapter-3',
      number: 'الباب الثالث',
      title: 'جبر ديراك لمؤثرات السلم واشتقاق الهاميلتوني Ĥ',
      enTitle: 'Dirac Ladder Operators Algebra & Hamiltonian Derivation',
      badge: 'جبر ديراك',
      summary: 'تحليل الأبعاد لاشتقاق x₀ و p₀، تعريف â و â†، إثبات [â, â†] = 1، واشتقاق Ĥ = ħω(â†â + ½).',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              3.1 تحليل الأبعاد ومقاييس الطول والزخم الطبيعية
            </h4>
            <p>
              نبحث عن مقياس طول مميز <MathView math="x_0" /> ومقياس زخم <MathView math="p_0" /> مبنيين فقط من ثوابت النظام: كتلة الجسيم <MathView math="m" /> والتردد <MathView math="\omega" /> وثابت بلانك <MathView math="\hbar" />:
            </p>
            <MathView math="x_0 = \sqrt{\frac{\hbar}{m\omega}}, \quad p_0 = \sqrt{m\hbar\omega} = \frac{\hbar}{x_0} \implies x_0 \cdot p_0 = \hbar" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              3.2 تعريف مؤثري الإفناء والإنشاء والبرهان على أن [â, â†] = 1
            </h4>
            <MathView math="\hat{a} = \frac{1}{\sqrt{2}} \left( \frac{\hat{x}}{x_0} + i \frac{\hat{p}}{p_0} \right), \quad \hat{a}^\dagger = \frac{1}{\sqrt{2}} \left( \frac{\hat{x}}{x_0} - i \frac{\hat{p}}{p_0} \right)" block />
            <p>بحساب المتبادل بالتفصيل الجبري:</p>
            <MathView math="[\hat{a}, \hat{a}^\dagger] = \frac{1}{2} \left[ \frac{\hat{x}}{x_0} + i\frac{\hat{p}}{p_0}, \, \frac{\hat{x}}{x_0} - i\frac{\hat{p}}{p_0} \right]" block />
            <MathView math="[\hat{a}, \hat{a}^\dagger] = \frac{1}{2} \left( -\frac{i}{x_0 p_0} [\hat{x}, \hat{p}] + \frac{i}{x_0 p_0} [\hat{p}, \hat{x}] \right) = \frac{-i}{x_0 p_0} [\hat{x}, \hat{p}]" block />
            <p>نعوض بقيمتي <MathView math="x_0 p_0 = \hbar" /> و <MathView math="[\hat{x}, \hat{p}] = i\hbar" />:</p>
            <MathView math="[\hat{a}, \hat{a}^\dagger] = -\frac{i}{\hbar} (i\hbar) = - i^2 = -(-1) = 1" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              3.3 الاشتقاق الحرفي لصيغة الهاميلتوني المكتوبة في الشريحة
            </h4>
            <p>نحسب حاصل الضرب المباشر <MathView math="\hat{a}^\dagger \hat{a}" />:</p>
            <MathView math="\hat{a}^\dagger \hat{a} = \frac{1}{2} \left( \frac{\hat{x}}{x_0} - i\frac{\hat{p}}{p_0} \right) \left( \frac{\hat{x}}{x_0} + i\frac{\hat{p}}{p_0} \right) = \frac{1}{2} \left[ \frac{\hat{x}^2}{x_0^2} + \frac{\hat{p}^2}{p_0^2} + \frac{i}{x_0 p_0} (\hat{x}\hat{p} - \hat{p}\hat{x}) \right]" block />
            <MathView math="\hat{a}^\dagger \hat{a} = \frac{1}{2} \left[ \frac{\hat{x}^2}{x_0^2} + \frac{\hat{p}^2}{p_0^2} + \frac{i}{\hbar}(i\hbar) \right] = \frac{1}{2} \frac{\hat{x}^2}{x_0^2} + \frac{1}{2} \frac{\hat{p}^2}{p_0^2} - \frac{1}{2}" block />
            <p>بالتعويض عن <MathView math="x_0^2 = \hbar/(m\omega)" /> و <MathView math="p_0^2 = m\hbar\omega" />:</p>
            <MathView math="\hat{a}^\dagger \hat{a} = \frac{1}{\hbar\omega} \left( \frac{\hat{p}^2}{2m} + \frac{1}{2}m\omega^2 \hat{x}^2 \right) - \frac{1}{2} = \frac{\hat{H}}{\hbar\omega} - \frac{1}{2}" block />
            <p className="font-bold text-cyan-300">نضرب في ħω وننقل النصف:</p>
            <MathView math="\hat{H} = \hbar\omega \left( \hat{a}^\dagger \hat{a} + \frac{1}{2} \right)" block />
          </div>
        </div>
      ),
    },
    {
      id: 'chapter-4',
      number: 'الباب الرابع',
      title: 'فضاء فوك وإثبات قيم الطاقة ومعاملات التكبير',
      enTitle: 'Fock Space & Spectrum Eigenvalues Proof',
      badge: 'فضاء فوك',
      summary: 'البرهان على أن طيف الطاقة Eₙ = ħω(n + ½) بأعداد صحيحة n ≥ 0، واشتقاق المعاملين √n و √(n+1).',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              4.1 علاقات تبديل مؤثر العدد N̂ = â†â
            </h4>
            <p>
              باستخدام المتطابقة الجبرية للمتبادلات <MathView math="[AB, C] = A[B,C] + [A,C]B" />:
            </p>
            <MathView math="[\hat{N}, \hat{a}] = [\hat{a}^\dagger \hat{a}, \hat{a}] = \hat{a}^\dagger [\hat{a}, \hat{a}] + [\hat{a}^\dagger, \hat{a}] \hat{a} = 0 + (-1)\hat{a} = -\hat{a}" block />
            <MathView math="[\hat{N}, \hat{a}^\dagger] = [\hat{a}^\dagger \hat{a}, \hat{a}^\dagger] = \hat{a}^\dagger [\hat{a}, \hat{a}^\dagger] + [\hat{a}^\dagger, \hat{a}^\dagger] \hat{a} = \hat{a}^\dagger(1) + 0 = +\hat{a}^\dagger" block />
            <p>
              وبالتالي إذا كانت <MathView math="|n\rangle" /> حالة ذاتية لـ <MathView math="\hat{N}" /> بقيمة ذاتية <MathView math="n" />، فإن:
            </p>
            <MathView math="\hat{N} (\hat{a}^\dagger |n\rangle) = (\hat{a}^\dagger \hat{N} + \hat{a}^\dagger) |n\rangle = (n+1) (\hat{a}^\dagger |n\rangle)" block />
            <MathView math="\hat{N} (\hat{a} |n\rangle) = (\hat{a} \hat{N} - \hat{a}) |n\rangle = (n-1) (\hat{a} |n\rangle)" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              4.2 شرط الإيجابية وإثبات وجود الحالة القاعية n ≥ 0
            </h4>
            <p>
              في فضاء هيلبرت، يجب أن يكون معيار أي متجه حالة موجباً أو صفراً:
            </p>
            <MathView math="\langle \psi | \psi \rangle \ge 0 \implies \left( \hat{a}|n\rangle \right)^\dagger \left( \hat{a}|n\rangle \right) = \langle n | \hat{a}^\dagger \hat{a} | n \rangle = n \langle n | n \rangle = n \ge 0" block />
            <p>
              ولمنع النزول اللانهائي إلى قيم سالبة عبر تطبيق <MathView math="\hat{a}" /> المتكرر، يجب أن تنعدم الحالة عند أدنى مستوى:
            </p>
            <MathView math="\hat{a} |0\rangle = 0 \implies n \in \{0, 1, 2, 3, \dots\}" block />
            <p className="font-bold text-cyan-300">وهذا يعطي طيف الطاقة المتساوي التباعد:</p>
            <MathView math="E_n = \hbar\omega \left(n + \frac{1}{2}\right)" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              4.3 برهان معاملات التكبير √n و √(n+1)
            </h4>
            <p>
              نفرض أن <MathView math="\hat{a}|n\rangle = c |n-1\rangle" />، ونحسب المعيار:
            </p>
            <MathView math="\langle n | \hat{a}^\dagger \hat{a} | n \rangle = |c|^2 \langle n-1 | n-1 \rangle \implies n = |c|^2 \implies c = \sqrt{n}" block />
            <MathView math="\hat{a} |n\rangle = \sqrt{n} |n-1\rangle" block />
            <p>وبالمثل لمؤثر الإنشاء <MathView math="\hat{a}^\dagger |n\rangle = d |n+1\rangle" />:</p>
            <MathView math="\langle n | \hat{a} \hat{a}^\dagger | n \rangle = \langle n | (\hat{N} + 1) | n \rangle = n+1 = |d|^2 \implies d = \sqrt{n+1}" block />
            <MathView math="\hat{a}^\dagger |n\rangle = \sqrt{n+1} |n+1\rangle" block />
          </div>
        </div>
      ),
    },
    {
      id: 'chapter-5',
      number: 'الباب الخامس',
      title: 'طاقة نقطة الصفر وبرهان مبدأ عدم اليقين',
      enTitle: 'Zero-Point Energy & Heisenberg Uncertainty Proof',
      badge: 'الفيزياء الكونية',
      summary: 'الحساب التفصيلي لـ ⟨x²⟩ و ⟨p²⟩، إثبات Δx·Δp = ħ/2، وتفسير الفراغ الكمي وظواهر كازيمير ولآمب.',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              5.1 الحساب الرياضي الدقيق لـ Δx و Δp في الحالة الأرضية |0⟩
            </h4>
            <p>نعبر عن الموضع والزخم بدلالة مؤثري السلم:</p>
            <MathView math="\hat{x} = \frac{x_0}{\sqrt{2}} (\hat{a} + \hat{a}^\dagger), \quad \hat{p} = -i \frac{p_0}{\sqrt{2}} (\hat{a} - \hat{a}^\dagger)" block />
            <p>في الحالة الأرضية <MathView math="|0\rangle" />:</p>
            <MathView math="\langle 0 | \hat{x} | 0 \rangle = 0, \quad \langle 0 | \hat{p} | 0 \rangle = 0" block />
            <p>لحساب متوسط مربع الموضع <MathView math="\langle \hat{x}^2 \rangle" />:</p>
            <MathView math="\hat{x}^2 = \frac{x_0^2}{2} (\hat{a}^2 + \hat{a}\hat{a}^\dagger + \hat{a}^\dagger\hat{a} + (\hat{a}^\dagger)^2)" block />
            <MathView math="\langle 0 | \hat{x}^2 | 0 \rangle = \frac{x_0^2}{2} \langle 0 | \hat{a}\hat{a}^\dagger | 0 \rangle = \frac{x_0^2}{2} (1) = \frac{x_0^2}{2} \implies \Delta x = \frac{x_0}{\sqrt{2}}" block />
            <p>وبالمثل للزخم:</p>
            <MathView math="\langle 0 | \hat{p}^2 | 0 \rangle = \frac{p_0^2}{2} \implies \Delta p = \frac{p_0}{\sqrt{2}}" block />
            <p className="font-bold text-cyan-300">حاصل ضرب عدم اليقين:</p>
            <MathView math="\Delta x \cdot \Delta p = \frac{x_0}{\sqrt{2}} \cdot \frac{p_0}{\sqrt{2}} = \frac{x_0 p_0}{2} = \frac{\hbar}{2}" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              5.2 لماذا لا يمكن إزالة طاقة نقطة الصفر؟ (تأثير كازيمير وإزاحة لآمب)
            </h4>
            <p>
              لو كانت طاقة الحالة الأرضية صفراً <MathView math="E_0 = 0" />، لكان الجسيم ساكناً عند المركز تماماً: <MathView math="x = 0 \implies \Delta x = 0" /> و <MathView math="p = 0 \implies \Delta p = 0" />، وهو ما ينتهك مبدأ هايزنبرغ بصورة مستحيلة فيزيائياً.
            </p>
            <p className="mt-2">
              هذه الطاقة <MathView math="\frac{1}{2}\hbar\omega" /> تمثل <strong>تقلبات الفراغ الكمي الحقيقية</strong>، ولها شواهد تجريبية مثبتة:
            </p>
            <ul className="space-y-2 mt-2 list-disc list-inside">
              <li><strong>تأثير كازيمير (Casimir Effect):</strong> تجاذب صفيحتين موصلتين في الفراغ المطلق نتيجة حصر أنماط تقلبات الفراغ بينهما.</li>
              <li><strong>إزاحة لآمب (Lamb Shift):</strong> انزياح مستويات طاقة ذرة الهيدروجين بفعل التفاعل مع فوتونات الفراغ التلقائية.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'chapter-6',
      number: 'الباب السادس',
      title: 'معادلة هيرميت، الدوال الموجية، والنفق الكمي',
      enTitle: 'Hermite Equation, Wavefunctions & Quantum Tunneling',
      badge: 'ميكانيكا الموجات',
      summary: 'الحل التحليلي لمعادلة شرودنغر، السلوك التقاربي e^(-x²/2)، صيغة رودريغيز، وشرح الرسم البياني ونقاط التحول.',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              6.1 السلوك التقاربي ومعادلة هيرميت
            </h4>
            <p>
              بتحويل معادلة شرودنغر إلى المتغير اللابُعدي <MathView math="\xi = x/x_0" /> والتعويض بالحل المقبول فيزيائياً <MathView math="\psi(\xi) = H(\xi) e^{-\xi^2/2}" />، تنتج معادلة هيرميت التفاضلية:
            </p>
            <MathView math="H''(\xi) - 2\xi H'(\xi) + (2n) H(\xi) = 0" block />
            <p>
              حلول هذه المعادلة هي <strong>كثيرات حدود هيرميت (Hermite Polynomials)</strong> المعطاة بصيغة رودريغيز:
            </p>
            <MathView math="H_n(\xi) = (-1)^n e^{\xi^2} \frac{d^n}{d\xi^n} \left( e^{-\xi^2} \right)" block />
            <p className="font-bold text-cyan-300">الصيغة العامة للدوال الموجية المعايرة:</p>
            <MathView math="\psi_n(x) = \frac{1}{\sqrt{2^n n!}} \left(\frac{1}{\pi x_0^2}\right)^{1/4} H_n\left(\frac{x}{x_0}\right) e^{-\frac{x^2}{2x_0^2}}" block />
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              6.2 التفسير الفيزيائي للرسم البياني للشريحة
            </h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>نقاط التحول الكلاسيكية (Classical Turning Points):</strong> <MathView math="x_{cl} = \pm x_0 \sqrt{2n+1}" />. هي نقاط تقاطع طاقة المستوى مع القطع المكافئ للجهد.
              </li>
              <li>
                <strong>ظاهرة النفق الكمي (Quantum Tunneling):</strong> الدوال الموجية لا تنقطع فجأة عند <MathView math="\pm x_{cl}" />، بل تتسرب إلى المنطقة المحظورة كلاسيكياً متلاشية أسياً، مما يمنح احتمالاً غير صفري لوجود الجسيم خلف الجدار الكلاسيكي!
              </li>
              <li>
                <strong>مبدأ التطابق لبور (Bohr Correspondence Principle):</strong> في المستويات العالية (<MathView math="n = 5, 6" />)، تتركز قمم الاحتمال عند أطراف البئر حيث تتباطأ السرعة الكلاسيكية <MathView math="v(x) \to 0" />، متطابقة مع الفيزياء الكلاسيكية.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'chapter-7',
      number: 'الباب السابع',
      title: 'فيزياء الحوسبة الكمية: وصلات جوزيفسون والترانزمون',
      enTitle: 'Quantum Computing: Josephson Junctions & Transmon Qubits',
      badge: 'الحوسبة الكمية',
      summary: 'لماذا يفشل المتذبذب التوافقي النقي ككيوبت؟ كيف تكسر وصلة جوزيفسون التوافق بالحد -¹/₂₄Ejφ⁴ لعزل الفضاء الثنائي.',
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              7.1 معضلة تسلق السلم التوافقي (The Harmonic Ladder Problem)
            </h4>
            <p>
              في دوائر الرنين الكهرومغناطيسية الفائقة التوصيل المكونة من مكثف <MathView math="C" /> وملف <MathView math="L" />، يكون النظام متذبذباً توافقياً تاماً:
            </p>
            <MathView math="E_{10} = E_1 - E_0 = \hbar\omega, \quad E_{21} = E_2 - E_1 = \hbar\omega" block />
            <p>
              عند تسليط نبضة ميكروويف بتردد <MathView math="\omega" /> لإجراء عملية منطقية على الكيوبت <MathView math="|0\rangle \to |1\rangle" />، تمتص الذرة الاصطناعية فوتوناً ثانياً وثالثاً بنفس التردد الرنيني وتنتقل عشوائياً إلى <MathView math="|2\rangle" /> و <MathView math="|3\rangle" />، فيتسرب الكيوبت وتفشل المعالجة الكمية!
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-base mb-2">
              7.2 حل الترانزمون بجهد جوزيفسون اللاتوافقي
            </h4>
            <p>
              باستبدال الملف الخطي بوصلة جوزيفسون (عازل نانوي بين موصلين فائقين)، يتحول الجهد إلى دالة جيب التمام غير الخطية:
            </p>
            <MathView math="V(\phi) = -E_J \cos(\phi) = -E_J + \frac{1}{2} E_J \phi^2 - \frac{1}{24} E_J \phi^4 + \dots" block />
            <p>
              الحد اللاتوافقي <MathView math="-\frac{1}{24} E_J \phi^4" /> يكسر التباعد المتساوي لمستويات الطاقة:
            </p>
            <MathView math="E_n \approx \hbar\omega \left(n + \frac{1}{2}\right) - \frac{E_C}{2} n(n+1)" block />
            <p className="font-bold text-emerald-400">فروق الطاقات الانتقالية للترانزمون:</p>
            <MathView math="E_{10} = \hbar\omega - E_C, \quad E_{21} = \hbar\omega - 2 E_C \implies \Delta\omega = E_{10} - E_{21} = E_C" block />
            <p className="mt-2">
              بفضل هذا الانزياح اللاتوافقي <MathView math="E_C" /> (طاقة شحن كولوم)، نستطيع استهداف الانتقال <MathView math="|0\rangle \leftrightarrow |1\rangle" /> بنبضة ميكروويف معزولة دون أي تسرب، وهو المبدأ الذي تعمل به معالجات Google Quantum AI و IBM Quantum اليوم!
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Filter chapters based on search query
  const filteredChapters = chapters.filter(
    (ch) =>
      ch.title.includes(searchQuery) ||
      ch.enTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.summary.includes(searchQuery)
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              الموسوعة الفيزيائية والرياضية الشاملة (الأطروحة الأكاديمية)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              المرجع الجامعي المتكامل: من الصفر المطلق إلى الحواسيب الكمومية
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              شرح تفصيلي ممل لكل رمز رياضي، مؤثر كمي، واشتقاق فيزيائي، مكتوب خطوة بخطوة بالصيغ الدقيقة والبراهين الكاملة.
            </p>
          </div>

          {/* Toggle Expand / Collapse All */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpandedAll(!expandedAll)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-bold transition-all cursor-pointer"
            >
              {expandedAll ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>طي الفصول</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>توسيع كافة الفصول</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder="ابحث في الأبواب: تايلور، هايزنبرغ، هيرميت، جوزيفسون، كازيمير، مؤثر السلم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Chapters Accordion / Book View */}
      <div className="space-y-4">
        {filteredChapters.map((chapter) => {
          const isOpen = expandedAll || activeChapterId === chapter.id;

          return (
            <div
              key={chapter.id}
              className={`border rounded-xl transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-950/80 border-cyan-500/40 shadow-xl ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => {
                  if (expandedAll) setExpandedAll(false);
                  setActiveChapterId(isOpen && !expandedAll ? '' : chapter.id);
                }}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-right cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 sm:mt-0">
                    {chapter.number.replace('الباب ', '')}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">{chapter.number}:</span>
                      <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                        {chapter.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {chapter.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1 hidden sm:block">
                      {chapter.enTitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 mr-3">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-950/90 animate-fadeIn">
                  {/* Summary Bar */}
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 mb-6 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>{chapter.summary}</div>
                  </div>

                  {/* Main Rich Content */}
                  {chapter.content}
                </div>
              )}
            </div>
          );
        })}

        {filteredChapters.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            لا توجد أبواب تطابق بحثك عن "{searchQuery}". جرب كلمة أخرى مثل "تايلور" أو "ديراك".
          </div>
        )}
      </div>
    </div>
  );
};
