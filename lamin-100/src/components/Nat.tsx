import React from "react";
import { random, staticFile } from "remotion";
import { H, W, beatPulse, clamp } from "../lib";
import { Lamp } from "./City";

/** Varm natte-gade: klassiske facader med tændte vinduer, altaner, gesimser og våde brosten. */

export const NatDefs: React.FC = () => (
  <defs>
    <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a3346" />
      <stop offset="0.5" stopColor="#2a2433" />
      <stop offset="1" stopColor="#1a1622" />
    </linearGradient>
    <linearGradient id="stoneWarm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5a4636" />
      <stop offset="0.55" stopColor="#3b2f2a" />
      <stop offset="1" stopColor="#1f1a1c" />
    </linearGradient>
    <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff0c4" />
      <stop offset="0.6" stopColor="#ffc56b" />
      <stop offset="1" stopColor="#d9862e" />
    </linearGradient>
    <linearGradient id="winDim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2b3557" />
      <stop offset="1" stopColor="#141a30" />
    </linearGradient>
    <linearGradient id="curtain" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#7a3b22" stopOpacity="0.9" />
      <stop offset="1" stopColor="#a8552c" stopOpacity="0.6" />
    </linearGradient>
    <linearGradient id="wetGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a2228" />
      <stop offset="0.4" stopColor="#17141c" />
      <stop offset="1" stopColor="#08080d" />
    </linearGradient>
    <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#060a1c" />
      <stop offset="0.6" stopColor="#1a2550" />
      <stop offset="1" stopColor="#4a3a5c" />
    </linearGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff2c2" />
      <stop offset="0.5" stopColor="#f2c35a" />
      <stop offset="1" stopColor="#a8701e" />
    </linearGradient>
    <linearGradient id="tableTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#efe6d6" />
      <stop offset="1" stopColor="#a99b86" />
    </linearGradient>
    <radialGradient id="tableLight" cx="0.5" cy="0.3" r="0.7">
      <stop offset="0" stopColor="#fff7e6" />
      <stop offset="0.6" stopColor="#d8cbb4" />
      <stop offset="1" stopColor="#8a7d6c" />
    </radialGradient>
    <radialGradient id="warmPool">
      <stop offset="0" stopColor="#ffcf86" stopOpacity="0.55" />
      <stop offset="1" stopColor="#ffcf86" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#e9edf5" />
      <stop offset="0.5" stopColor="#7b8396" />
      <stop offset="1" stopColor="#2a2f3c" />
    </linearGradient>
    <filter id="blur4"><feGaussianBlur stdDeviation="4" /></filter>
    <filter id="blur10"><feGaussianBlur stdDeviation="10" /></filter>
    <filter id="blur20"><feGaussianBlur stdDeviation="20" /></filter>
    <filter id="blur30"><feGaussianBlur stdDeviation="30" /></filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
      <feOffset dy="18" result="o" />
      <feComponentTransfer><feFuncA type="linear" slope="0.6" /></feComponentTransfer>
      <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

/** Én klassisk bygning. x,y = venstre-top, w,h. */
export const Facade: React.FC<{ x: number; y: number; w: number; h: number; seed: string; t: number; cols?: number; floors?: number; warm?: boolean; lit?: number; shop?: string }> = ({
  x, y, w, h, seed, t, cols = 4, floors = 6, warm = false, lit = 0.55, shop,
}) => {
  const els: React.ReactNode[] = [];
  const fh = (h - 60) / (floors + 0.6);
  const cw = w / cols;
  const pulse = beatPulse(t);
  els.push(<rect key="body" x={x} y={y} width={w} height={h} fill={warm ? "url(#stoneWarm)" : "url(#stone)"} />);
  // tag + mansard
  els.push(<path key="roof" d={`M${x - 10},${y} L${x + 18},${y - 70} L${x + w - 18},${y - 70} L${x + w + 10},${y} Z`} fill="#1b1d2c" />);
  for (let c = 0; c < cols; c++) {
    const dx = x + c * cw + cw * 0.3;
    els.push(<rect key={`dorm${c}`} x={dx} y={y - 58} width={cw * 0.4} height={46} rx={cw * 0.2} fill={random(`${seed}d${c}`) < 0.4 ? "url(#win)" : "#232842"} opacity={0.9} />);
  }
  // vandrette gesimser (stenbånd)
  for (let f = 0; f <= floors; f++) {
    const yy = y + 30 + f * fh;
    els.push(<rect key={`band${f}`} x={x - 6} y={yy - 6} width={w + 12} height={f === 0 ? 14 : 7} fill="#000" opacity={0.28} />);
    els.push(<rect key={`bandh${f}`} x={x - 6} y={yy - 8} width={w + 12} height={2} fill="#ffd9a0" opacity={0.12} />);
  }
  for (let f = 0; f < floors; f++) {
    const yy = y + 30 + f * fh + fh * 0.18;
    const wh = fh * 0.66;
    for (let c = 0; c < cols; c++) {
      const k = `${seed}-${f}-${c}`;
      const on = random(k) < lit;
      const wx = x + c * cw + cw * 0.22;
      const ww = cw * 0.56;
      const flick = random(`${k}f`) < 0.1 ? pulse * 0.3 : 0;
      els.push(<rect key={`wf${k}`} x={wx - 5} y={yy - 5} width={ww + 10} height={wh + 8} fill="#120f18" opacity={0.75} />);
      els.push(<rect key={`w${k}`} x={wx} y={yy} width={ww} height={wh} fill={on ? "url(#win)" : "url(#winDim)"} opacity={on ? 0.82 + flick : 1} />);
      if (on) {
        els.push(<rect key={`wg${k}`} x={wx - ww * 0.6} y={yy - wh * 0.3} width={ww * 2.2} height={wh * 1.6} fill="url(#warmPool)" opacity={0.5} />);
        if (random(`${k}c`) < 0.6) {
          els.push(<path key={`cl${k}`} d={`M${wx},${yy} L${wx + ww * 0.32},${yy} Q${wx + ww * 0.18},${yy + wh * 0.5} ${wx + ww * 0.24},${yy + wh} L${wx},${yy + wh} Z`} fill="url(#curtain)" />);
          els.push(<path key={`cr${k}`} d={`M${wx + ww},${yy} L${wx + ww * 0.68},${yy} Q${wx + ww * 0.82},${yy + wh * 0.5} ${wx + ww * 0.76},${yy + wh} L${wx + ww},${yy + wh} Z`} fill="url(#curtain)" />);
        }
        if (random(`${k}p`) < 0.12) {
          // silhuet i vindue
          els.push(<ellipse key={`ph${k}`} cx={wx + ww * 0.5} cy={yy + wh * 0.42} rx={ww * 0.12} ry={ww * 0.14} fill="#2a1408" opacity={0.75} />);
          els.push(<path key={`pb${k}`} d={`M${wx + ww * 0.28},${yy + wh} Q${wx + ww * 0.5},${yy + wh * 0.5} ${wx + ww * 0.72},${yy + wh} Z`} fill="#2a1408" opacity={0.75} />);
        }
      }
      // sprosser
      els.push(<rect key={`mv${k}`} x={wx + ww / 2 - 1.5} y={yy} width={3} height={wh} fill="#1a1420" opacity={0.85} />);
      els.push(<rect key={`mh${k}`} x={wx} y={yy + wh * 0.38} width={ww} height={3} fill="#1a1420" opacity={0.85} />);
      // fransk altan
      if (f % 2 === 1 || f === 1) {
        const by = yy + wh - wh * 0.28;
        els.push(<rect key={`bal${k}`} x={wx - 8} y={by} width={ww + 16} height={wh * 0.28 + 6} fill="none" stroke="#0c0a10" strokeWidth={3} />);
        for (let b = 0; b < 7; b++) els.push(<line key={`bb${k}${b}`} x1={wx - 8 + ((ww + 16) / 6) * b} y1={by} x2={wx - 8 + ((ww + 16) / 6) * b} y2={by + wh * 0.28 + 6} stroke="#0c0a10" strokeWidth={2} />);
        els.push(<rect key={`bfl${k}`} x={wx - 12} y={by + wh * 0.28 + 4} width={ww + 24} height={6} fill="#0c0a10" />);
      }
    }
  }
  // stueetage med butik
  const gy = y + h - fh * 0.9;
  els.push(<rect key="ground" x={x} y={gy} width={w} height={fh * 0.9} fill="#140f15" />);
  if (shop) {
    els.push(<rect key="shopw" x={x + w * 0.08} y={gy + fh * 0.2} width={w * 0.84} height={fh * 0.66} fill="url(#win)" opacity={0.7} />);
    els.push(<rect key="shopg" x={x + w * 0.08} y={gy + fh * 0.2} width={w * 0.84} height={fh * 0.66} fill="#3a1c0a" opacity={0.35} />);
    els.push(<rect key="awn" x={x + w * 0.04} y={gy - 4} width={w * 0.92} height={fh * 0.2} fill="#1c2a24" />);
    els.push(
      <text key="shopt" x={x + w / 2} y={gy + fh * 0.14} fill="#e8d6ad" fontFamily="Playfair" fontStyle="italic" fontSize={fh * 0.12} textAnchor="middle" letterSpacing={2}>
        {shop}
      </text>,
    );
  }
  return <g>{els}</g>;
};

/** Hel gade: himmel, to facaderækker i perspektiv-agtig opstilling, lamper, våde brosten. */
export const Street: React.FC<{ t: number; seed?: string; horizon?: number; lamps?: boolean; shops?: [string, string] }> = ({
  t, seed = "s", horizon = 1340, lamps = true, shops = ["Café Nord", "Bistro"],
}) => (
  <g>
    <rect x={-600} y={-600} width={W + 1200} height={H + 1200} fill="url(#duskSky)" />
    {Array.from({ length: 60 }).map((_, i) => (
      <circle key={i} cx={random(`st${i}`) * W} cy={random(`sy${i}`) * 500} r={1 + random(`sr${i}`) * 1.6} fill="#dfe6ff" opacity={0.3 + 0.4 * Math.abs(Math.sin(t + i))} />
    ))}
    <Facade x={-140} y={300} w={560} h={horizon - 300} seed={`${seed}a`} t={t} cols={4} floors={6} shop={shops[0]} />
    <Facade x={430} y={420} w={300} h={horizon - 420} seed={`${seed}b`} t={t} cols={2} floors={5} warm lit={0.7} />
    <Facade x={740} y={260} w={520} h={horizon - 260} seed={`${seed}c`} t={t} cols={4} floors={7} shop={shops[1]} />
    {/* fortov og våde brosten */}
    <rect x={-300} y={horizon} width={W + 600} height={H - horizon + 300} fill="url(#wetGround)" />
    <rect x={-300} y={horizon} width={W + 600} height={10} fill="#3a3038" />
    {Array.from({ length: 16 }).map((_, r) =>
      Array.from({ length: 22 }).map((__, c) => {
        const yy = horizon + 20 + r * r * 2.6 + r * 14;
        const sz = 16 + r * 5;
        const xx = -200 + c * sz * 1.25 + (r % 2) * sz * 0.6;
        return <rect key={`${r}-${c}`} x={xx} y={yy} width={sz} height={sz * 0.42} rx={sz * 0.18} fill="#2b2530" opacity={0.35 + random(`cb${r}${c}`) * 0.3} />;
      }),
    )}
    {/* reflekser af vinduer i vådt underlag */}
    <g opacity={0.35} filter="url(#blur10)">
      {[60, 210, 520, 830, 980].map((x, i) => (
        <rect key={i} x={x} y={horizon + 30} width={70} height={360 + (i % 2) * 120} fill="#ffc56b" opacity={0.5 + 0.3 * Math.sin(t * 1.3 + i)} />
      ))}
    </g>
    {lamps && (
      <>
        <Lamp x={80} y={horizon + 140} h={620} side={1} />
        <Lamp x={1000} y={horizon + 140} h={620} side={-1} />
      </>
    )}
  </g>
);

/** Rundt café-bord set skråt oppefra (som hovedrolle-flade for objekter). */
export const Table: React.FC<{ cx?: number; cy?: number; r?: number }> = ({ cx = W / 2, cy = 1560, r = 560 }) => (
  <g>
    <ellipse cx={cx} cy={cy + 40} rx={r * 1.04} ry={r * 0.36} fill="#000" opacity={0.5} filter="url(#blur20)" />
    <ellipse cx={cx} cy={cy + 14} rx={r} ry={r * 0.32} fill="#7c6e5e" />
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} fill="url(#tableLight)" />
    <ellipse cx={cx} cy={cy} rx={r * 0.97} ry={r * 0.3} fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={3} />
  </g>
);

/** Stor grafisk titel-plade med gyldent ord (bruges i outro og billboard). */
export const Sparkles: React.FC<{ t: number; x: number; y: number; n?: number; spread?: number; burst?: number; seed?: string; color?: string }> = ({
  t, x, y, n = 40, spread = 260, burst = 0, seed = "sp", color = "#ffe6a3",
}) => (
  <g style={{ mixBlendMode: "screen" }}>
    {Array.from({ length: n }).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const d = (0.25 + random(`${seed}d${i}`) * 0.75) * spread * (0.6 + burst * 0.8);
      const life = (t * (0.5 + random(`${seed}l${i}`)) + random(`${seed}o${i}`)) % 1;
      const px = x + Math.cos(a) * d * (0.4 + life * 0.6);
      const py = y + Math.sin(a) * d * (0.4 + life * 0.6) - life * 120;
      const s = (3 + random(`${seed}s${i}`) * 9) * (1 - life) * (1 + burst);
      return (
        <g key={i} transform={`translate(${px},${py}) rotate(${t * 90 + i * 20})`} opacity={clamp(1 - life) * 0.95}>
          <path d={`M0,${-s * 2} L${s * 0.35},${-s * 0.35} L${s * 2},0 L${s * 0.35},${s * 0.35} L0,${s * 2} L${-s * 0.35},${s * 0.35} L${-s * 2},0 L${-s * 0.35},${-s * 0.35} Z`} fill={color} />
          <circle r={s * 2.4} fill="url(#glowAmber)" opacity={0.5} />
        </g>
      );
    })}
  </g>
);

/** Anonym figur i silhuet (hættetrøje) – aldrig kunstneren. */
export const Figure: React.FC<{ x: number; y: number; s?: number; color?: string; pose?: "stand" | "sit" | "walk"; t?: number; flip?: boolean }> = ({
  x, y, s = 1, color = "#07070c", pose = "stand", t = 0, flip = false,
}) => {
  const sw = pose === "walk" ? Math.sin(t * 6) * 14 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} fill={color}>
      <ellipse cx={0} cy={-300} rx={36} ry={42} />
      <path d="M-44,-300 Q-48,-352 0,-356 Q48,-352 44,-300 Q40,-262 0,-258 Q-40,-262 -44,-300Z" />
      <path d="M-70,-250 Q0,-280 70,-250 L82,-120 Q0,-104 -82,-120 Z" />
      <path d={`M-70,-240 L-96,-120 L-80,-60 L-64,-118 Z`} />
      <path d={`M70,-240 L96,-120 L80,-60 L64,-118 Z`} />
      {pose === "sit" ? (
        <path d="M-64,-120 L64,-120 L70,-70 L150,-66 L150,0 L120,0 L118,-34 L-60,-40 Z" />
      ) : (
        <>
          <path d={`M-60,-122 L-8,-122 L${-18 + sw},0 L${-52 + sw},0 Z`} />
          <path d={`M8,-122 L60,-122 L${52 - sw},0 L${18 - sw},0 Z`} />
        </>
      )}
    </g>
  );
};

export const img = (p: string) => staticFile(p);
export { W, H };
