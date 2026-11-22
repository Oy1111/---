import { clamp } from "../lib";

/** Ét take gennem stuen: [tid, x, y, zoom] – verdenspunktet lander på skærm (540, SY). */
export const SY = 1180;
type K = [number, number, number, number];
export const KEYS: K[] = [
  [0, 1860, 780, 1.6],
  [1.5, 1860, 820, 1.5],
  [2.2, 2440, 1040, 1.9],
  [3.4, 2445, 1012, 3.0],
  [4.7, 2445, 1008, 3.3],
  [5.6, 1840, 1150, 0.78],
  [8.6, 1850, 1140, 0.84],
  [9.5, 990, 1010, 1.55],
  [11.2, 990, 985, 2.1],
  [12.6, 990, 985, 2.15],
  [13.8, 1840, 1330, 1.7],
  [15.3, 1840, 1340, 2.1],
  [16.9, 1840, 1340, 2.15],
  [17.6, 1612, 1348, 4.0],
  [21.6, 1612, 1348, 4.3],
  [22.4, 1720, 1240, 1.5],
  [23.3, 1612, 1348, 4.2],
  [26.9, 1612, 1348, 4.5],
  [27.7, 2110, 1250, 2.5],
  [30.3, 2110, 1240, 2.8],
  [30.65, 1860, 920, 1.45],
  [33.0, 1860, 900, 1.6],
  [33.35, 3070, 1250, 2.3],
  [35.4, 3070, 1250, 2.5],
  [36.6, 1860, 940, 1.55],
  [39.6, 1860, 930, 1.7],
  [41.1, 3070, 1120, 1.45],
  [46.2, 3070, 1110, 1.6],
  [47.2, 1850, 1190, 0.78],
  [49.6, 1900, 1170, 0.82],
  [50.4, 2420, 1080, 1.5],
  [52.2, 2440, 1030, 2.3],
  [55.0, 2440, 1020, 2.4],
];

const sm = (x: number) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};

export const camAt = (tt: number, stuckFrom = 99, stuckTo = 0) => {
  // "sætter sig fast": kamerabevægelsen hakker og springer tilbage hvert halve beat
  const t = tt > stuckFrom && tt < stuckTo ? stuckFrom + ((tt - stuckFrom) % 0.255) : tt;
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1][0] <= t) i++;
  const [t0, x0, y0, z0] = KEYS[i];
  const [t1, x1, y1, z1] = KEYS[i + 1];
  const u = sm((t - t0) / (t1 - t0));
  const z = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * u);
  let w = u;
  if (Math.abs(Math.log(z1 / z0)) > 0.5) w = (1 / z0 - 1 / z) / (1 / z0 - 1 / z1);
  const d = 1 / Math.sqrt(z);
  const cx = x0 + (x1 - x0) * w + Math.sin(tt * 0.7) * 7 * d + Math.sin(tt * 1.9) * 2 * d;
  const cy = y0 + (y1 - y0) * w + Math.cos(tt * 0.6) * 6 * d;
  return { cx, cy, z };
};
