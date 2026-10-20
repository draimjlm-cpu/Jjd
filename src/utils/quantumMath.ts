/**
 * Quantum Harmonic Oscillator Mathematical Utilities
 * University-level precision for wavefunctions, Hermite polynomials, and potential expansions.
 */

// Memoized factorial
const factorials: number[] = [1, 1];
export function factorial(n: number): number {
  if (n < 0) return 1;
  if (factorials[n] !== undefined) return factorials[n];
  let res = factorials[factorials.length - 1];
  for (let i = factorials.length; i <= n; i++) {
    res *= i;
    factorials[i] = res;
  }
  return factorials[n];
}

/**
 * Computes Hermite polynomial H_n(xi) using recurrence:
 * H_0(xi) = 1
 * H_1(xi) = 2 * xi
 * H_n(xi) = 2 * xi * H_{n-1}(xi) - 2 * (n - 1) * H_{n-2}(xi)
 */
export function hermitePolynomial(n: number, xi: number): number {
  if (n === 0) return 1;
  if (n === 1) return 2 * xi;

  let hPrev2 = 1; // H_0
  let hPrev1 = 2 * xi; // H_1
  let hCurrent = 0;

  for (let i = 2; i <= n; i++) {
    hCurrent = 2 * xi * hPrev1 - 2 * (i - 1) * hPrev2;
    hPrev2 = hPrev1;
    hPrev1 = hCurrent;
  }

  return hCurrent;
}

/**
 * Normalization factor: N_n = 1 / sqrt(2^n * n! * sqrt(pi))
 * We work in dimensionless units where x_0 = 1, so psi(xi) has factor (1/sqrt(pi))^(1/4)
 */
export function normalizationConstant(n: number, x0: number = 1): number {
  const sqrtPi = Math.sqrt(Math.PI);
  const factor = 1 / Math.sqrt(Math.pow(2, n) * factorial(n) * sqrtPi * x0);
  return factor;
}

/**
 * Evaluates the stationary wavefunction psi_n(x)
 * psi_n(x) = N_n * H_n(x/x_0) * exp(- x^2 / (2 * x_0^2))
 */
export function wavefunction(n: number, x: number, x0: number = 1): number {
  const xi = x / x0;
  const hVal = hermitePolynomial(n, xi);
  const norm = normalizationConstant(n, x0);
  const gaussian = Math.exp(-(xi * xi) / 2);
  return norm * hVal * gaussian;
}

/**
 * Probability density: |psi_n(x)|^2
 */
export function probabilityDensity(n: number, x: number, x0: number = 1): number {
  const psi = wavefunction(n, x, x0);
  return psi * psi;
}

/**
 * Energy of level n in units of hbar * omega
 * E_n = hbar * omega * (n + 1/2)
 */
export function energyLevel(n: number, hbarOmega: number = 1): number {
  return hbarOmega * (n + 0.5);
}

/**
 * Classical turning point: x_cl = x_0 * sqrt(2*n + 1)
 */
export function classicalTurningPoint(n: number, x0: number = 1): number {
  return x0 * Math.sqrt(2 * n + 1);
}

/**
 * Coherent state wavefunction: |alpha> oscillating at frequency omega
 * Real part, Imaginary part, and Probability density
 */
export function coherentState(alpha0: number, t: number, omega: number, x: number, x0: number = 1) {
  // alpha(t) = alpha0 * exp(-i * omega * t)
  const angle = -omega * t;
  const alphaRe = alpha0 * Math.cos(angle);
  const alphaIm = alpha0 * Math.sin(angle);

  // Mean position <x>(t) = sqrt(2) * x0 * Re(alpha)
  const xMean = Math.sqrt(2) * x0 * alphaRe;
  const pMean = Math.sqrt(2) * (1 / x0) * alphaIm; // in hbar units

  const xi = (x - xMean) / x0;
  const amp = (1 / Math.sqrt(x0 * Math.sqrt(Math.PI))) * Math.exp(-(xi * xi) / 2);

  const phase = (x * pMean) - (omega * t / 2) + (alpha0 * alpha0 * Math.sin(2 * angle) / 2);

  const re = amp * Math.cos(phase);
  const im = amp * Math.sin(phase);
  const prob = amp * amp;

  return { re, im, prob, xMean, pMean };
}

/**
 * Potentials for Taylor Expansion Lab
 */
export interface PotentialModel {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  evaluateExact: (x: number) => number;
  v0: number;
  vPrime0: number; // always 0 at equilibrium
  vDoublePrime0: number; // k = m*omega^2
  vTriplePrime0: number;
  vQuad0: number;
  xRange: [number, number];
  yRange: [number, number];
}

export const POTENTIAL_MODELS: PotentialModel[] = [
  {
    id: 'josephson',
    name: 'Josephson Junction (Qubit Cosine)',
    arabicName: 'جهد وصلة جوزيفسون (كيوبت الترانزمون)',
    description: 'الجهد الفيزيائي الحقيقي لوصلة جوزيفسون في الكيوبتات فائقة التوصيل V(phi) = -Ej * cos(phi). يوضح كيف يكسر الحد الرابع التباعد التوافقي!',
    evaluateExact: (x) => -4 * Math.cos(x) + 4, // shifted so V(0)=0
    v0: 0,
    vPrime0: 0,
    vDoublePrime0: 4, // k = 4
    vTriplePrime0: 0, // cos is even, so 3rd derivative at 0 is 0
    vQuad0: -4, // 4th derivative of -4*cos is 4*cos(0)=4, with minus sign in series => -4/24 * x^4
    xRange: [-3.2, 3.2],
    yRange: [-0.5, 8],
  },
  {
    id: 'morse',
    name: 'Morse Molecular Potential',
    arabicName: 'جهد مورس للجزيئات ثنائية الذرة',
    description: 'يصف تذبذب وتفكك الروابط الكيميائية بين الذرات. يمتلك عدم تماثل واضح (حد تكعيبي V\'\'\' غير صفري) يفسر التمدد الحراري للمواد.',
    // V(x) = De * (1 - exp(-a * x))^2, with De = 4, a = 0.8
    evaluateExact: (x) => 4 * Math.pow(1 - Math.exp(-0.8 * x), 2),
    v0: 0,
    vPrime0: 0,
    vDoublePrime0: 4 * 2 * 0.8 * 0.8, // 5.12
    vTriplePrime0: -4 * 6 * Math.pow(0.8, 3), // -12.288
    vQuad0: 4 * 14 * Math.pow(0.8, 4), // 22.9376
    xRange: [-1.8, 3.5],
    yRange: [-0.5, 9],
  },
  {
    id: 'lennard-jones',
    name: 'Lennard-Jones (Intermolecular)',
    arabicName: 'جهد لينارد-جونز بين الجزيئات',
    description: 'الجهد الكلاسيكي الشهير لقوى التجاذب والتنافر بين الذرات المحايدة (قوى فان دير فالس والتنافر الباولي).',
    // Shifted coordinate around minimum r_m = 2^(1/6) approx 1.122
    evaluateExact: (x) => {
      const r = x + 1.12246;
      if (r <= 0.7) return 12;
      const invR6 = Math.pow(1 / r, 6);
      const invR12 = invR6 * invR6;
      return 4 * (invR12 - invR6) + 1; // minimum at V=0
    },
    v0: 0,
    vPrime0: 0,
    vDoublePrime0: 57.14,
    vTriplePrime0: -612,
    vQuad0: 4800,
    xRange: [-0.35, 0.9],
    yRange: [-0.5, 10],
  },
];
