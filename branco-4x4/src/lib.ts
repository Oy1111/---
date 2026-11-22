import { random } from "remotion";
import { BEATS, HITS } from "./data/timing";

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const rnd = (seed: string | number) => random(seed);

/** 0..1 puls der falder efter hvert beat (sekunder, video-tid) */
export const beatPulse = (t: number, decay = 9) => {
  let v = 0;
  for (const b of BEATS) {
    const d = t - b;
    if (d >= 0 && d < 0.4) v = Math.max(v, Math.exp(-d * decay));
  }
  return v;
};

/** antal beats indtil t (til ting der skifter pr. beat) */
export const beatIndex = (t: number) => {
  let i = 0;
  for (const b of BEATS) if (b <= t) i++;
  return i;
};

/** kraftige hits (nøgleord) – 0..styrke, hurtigt henfald */
export const hitAmt = (t: number) => {
  let v = 0;
  for (const [h, s] of HITS) {
    const d = t - h;
    if (d >= -0.02 && d < 0.45) v = Math.max(v, s * Math.exp(-Math.max(0, d) * 8));
  }
  return v;
};

export const PAL = {
  sky0: "#03050d",
  sky1: "#0a1230",
  sky2: "#1a2a5c",
  amber: "#ffb347",
  sodium: "#ffd28a",
  cyan: "#4fd8ff",
  magenta: "#ff3d8b",
  red: "#ff2a3c",
  ink: "#05070f",
  white: "#f4f1ea",
};
