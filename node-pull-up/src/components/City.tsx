import React from "react";
import { random } from "remotion";
import { PAL, W, H, beatPulse } from "../lib";

/** Fælles gradienter/filtre – læg én gang øverst i hver scenes <svg>. */
export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={PAL.sky0} />
      <stop offset="0.55" stopColor={PAL.sky1} />
      <stop offset="1" stopColor={PAL.sky2} />
    </linearGradient>
    <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={PAL.sodium} stopOpacity="0.55" />
      <stop offset="1" stopColor={PAL.amber} stopOpacity="0" />
    </linearGradient>
    <linearGradient id="coneWhite" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fffbe8" stopOpacity="0.8" />
      <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="coneWhiteL" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#fffbe8" stopOpacity="0.8" />
      <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="glowAmber">
      <stop offset="0" stopColor="#fff4d6" stopOpacity="1" />
      <stop offset="0.25" stopColor={PAL.amber} stopOpacity="0.55" />
      <stop offset="1" stopColor={PAL.amber} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowRed">
      <stop offset="0" stopColor="#ffd0d4" stopOpacity="1" />
      <stop offset="0.3" stopColor={PAL.red} stopOpacity="0.6" />
      <stop offset="1" stopColor={PAL.red} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowWhite">
      <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
      <stop offset="0.3" stopColor="#dfe9ff" stopOpacity="0.5" />
      <stop offset="1" stopColor="#dfe9ff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowCyan">
      <stop offset="0" stopColor="#e8fbff" stopOpacity="1" />
      <stop offset="0.3" stopColor={PAL.cyan} stopOpacity="0.5" />
      <stop offset="1" stopColor={PAL.cyan} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowMagenta">
      <stop offset="0" stopColor="#ffe0ee" stopOpacity="1" />
      <stop offset="0.3" stopColor={PAL.magenta} stopOpacity="0.5" />
      <stop offset="1" stopColor={PAL.magenta} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="shadow">
      <stop offset="0" stopColor="#000" stopOpacity="0.85" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0d1224" />
      <stop offset="1" stopColor="#04060c" />
    </linearGradient>
    <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a4566" />
      <stop offset="0.18" stopColor="#141a2c" />
      <stop offset="0.55" stopColor="#070a14" />
      <stop offset="0.8" stopColor="#1a2340" />
      <stop offset="1" stopColor="#05070d" />
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#1c2a52" />
      <stop offset="0.45" stopColor="#060914" />
      <stop offset="0.5" stopColor="#2b3d70" />
      <stop offset="0.56" stopColor="#060914" />
      <stop offset="1" stopColor="#0b1226" />
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.5" stopColor="#7d8aa8" />
      <stop offset="1" stopColor="#d9e2f5" />
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff3c9" />
      <stop offset="0.45" stopColor="#ffc861" />
      <stop offset="1" stopColor="#b8741d" />
    </linearGradient>
    <filter id="blur6" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="blur14" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id="blur30" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30" />
    </filter>
  </defs>
);

export const Sky: React.FC<{ t: number; moon?: [number, number]; stars?: boolean }> = ({ t, moon, stars = true }) => {
  const st = [];
  if (stars)
    for (let i = 0; i < 90; i++) {
      const x = random(`sx${i}`) * W,
        y = random(`sy${i}`) * H * 0.55,
        s = random(`ss${i}`) * 2.2 + 0.6,
        tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (1 + random(`st${i}`) * 3) + i));
      st.push(<circle key={i} cx={x} cy={y} r={s} fill="#dfe8ff" opacity={tw * 0.7} />);
    }
  return (
    <g>
      <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="url(#sky)" />
      {st}
      {moon && (
        <g>
          <circle cx={moon[0]} cy={moon[1]} r={340} fill="url(#glowWhite)" opacity={0.25} />
          <circle cx={moon[0]} cy={moon[1]} r={62} fill="#f3f0e6" />
          <circle cx={moon[0] - 18} cy={moon[1] - 12} r={13} fill="#d6d2c6" opacity={0.6} />
          <circle cx={moon[0] + 20} cy={moon[1] + 18} r={9} fill="#d6d2c6" opacity={0.5} />
        </g>
      )}
    </g>
  );
};

/** Skyline med vinduer. offset = scroll i px. depth styrer farve/lysstyrke. */
export const Skyline: React.FC<{
  seed: string;
  base: number;
  offset?: number;
  depth?: number;
  maxH?: number;
  t: number;
  width?: number;
}> = ({ seed, base, offset = 0, depth = 1, maxH = 700, t, width = 2600 }) => {
  const els: React.ReactNode[] = [];
  let x = -400;
  let i = 0;
  const pulse = beatPulse(t);
  const shade = Math.round(8 + (1 - depth) * 18);
  const fill = `rgb(${shade},${shade + 4},${shade + 18})`;
  while (x < width) {
    const w = 90 + random(`${seed}w${i}`) * 170;
    const h = (0.35 + random(`${seed}h${i}`) * 0.65) * maxH;
    const top = base - h;
    els.push(<rect key={`b${i}`} x={x} y={top} width={w} height={h + 4} fill={fill} />);
    if (random(`${seed}a${i}`) < 0.3)
      els.push(<rect key={`an${i}`} x={x + w * 0.45} y={top - 70} width={6} height={70} fill={fill} />);
    if (random(`${seed}a${i}`) < 0.3)
      els.push(
        <circle key={`al${i}`} cx={x + w * 0.45 + 3} cy={top - 72} r={5} fill={PAL.red} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i))} />,
      );
    // vinduer
    const cols = Math.floor((w - 20) / 26);
    const rows = Math.floor((h - 30) / 34);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const k = `${seed}${i}-${r}-${c}`;
        const lit = random(k);
        if (lit > 0.34) continue;
        const flick = random(`${k}f`) < 0.08 ? pulse : 0;
        const warm = random(`${k}c`) < 0.78;
        els.push(
          <rect
            key={k}
            x={x + 12 + c * 26}
            y={top + 22 + r * 34}
            width={13}
            height={18}
            fill={warm ? PAL.sodium : "#9cc4ff"}
            opacity={(0.35 + lit * 1.6) * depth * (0.8 + flick * 0.6)}
          />,
        );
      }
    x += w + 6 + random(`${seed}g${i}`) * 10;
    i++;
  }
  return <g transform={`translate(${-offset},0)`}>{els}</g>;
};

/** Gadelampe. x,y = fod. h = højde. on = lysstyrke 0..1 */
export const Lamp: React.FC<{ x: number; y: number; h: number; on?: number; side?: 1 | -1; cone?: boolean }> = ({
  x,
  y,
  h,
  on = 1,
  side = 1,
  cone = true,
}) => {
  const hx = x + side * h * 0.16;
  const hy = y - h;
  return (
    <g>
      {cone && (
        <polygon
          points={`${hx - h * 0.04},${hy + h * 0.04} ${hx + h * 0.04},${hy + h * 0.04} ${hx + h * 0.32},${y} ${hx - h * 0.32},${y}`}
          fill="url(#cone)"
          opacity={0.9 * on}
          style={{ mixBlendMode: "screen" }}
        />
      )}
      <ellipse cx={hx} cy={y} rx={h * 0.3} ry={h * 0.035} fill={PAL.amber} opacity={0.18 * on} />
      <rect x={x - h * 0.012} y={hy} width={h * 0.024} height={h} fill="#0b0e18" />
      <path
        d={`M${x},${hy + h * 0.02} Q${x},${hy - h * 0.03} ${hx},${hy - h * 0.01}`}
        stroke="#0b0e18"
        strokeWidth={h * 0.016}
        fill="none"
      />
      <path d={`M${hx - h * 0.05},${hy} L${hx + h * 0.05},${hy} L${hx + h * 0.03},${hy + h * 0.035} L${hx - h * 0.03},${hy + h * 0.035} Z`} fill="#141a2a" />
      <circle cx={hx} cy={hy + h * 0.04} r={h * 0.5} fill="url(#glowAmber)" opacity={0.55 * on} />
      <ellipse cx={hx} cy={hy + h * 0.036} rx={h * 0.03} ry={h * 0.008} fill="#fff6dc" opacity={on} />
    </g>
  );
};

export const Rain: React.FC<{ t: number; n?: number; seed?: string; opacity?: number; speed?: number }> = ({
  t,
  n = 120,
  seed = "r",
  opacity = 0.35,
  speed = 1,
}) => {
  const d = [];
  for (let i = 0; i < n; i++) {
    const bx = random(`${seed}x${i}`) * (W + 200) - 100;
    const sp = (1500 + random(`${seed}s${i}`) * 900) * speed;
    const y = ((random(`${seed}y${i}`) * (H + 300) + t * sp) % (H + 300)) - 150;
    const l = 24 + random(`${seed}l${i}`) * 40;
    d.push(<line key={i} x1={bx} y1={y} x2={bx - 6} y2={y - l} stroke="#aac4ff" strokeWidth={1.6} opacity={opacity * (0.4 + random(`${seed}o${i}`) * 0.6)} />);
  }
  return <g>{d}</g>;
};

export const Dust: React.FC<{ t: number; n?: number; seed?: string; color?: string; area?: [number, number, number, number] }> = ({
  t,
  n = 60,
  seed = "d",
  color = PAL.sodium,
  area = [0, 0, W, H],
}) => {
  const d = [];
  for (let i = 0; i < n; i++) {
    const x = area[0] + ((random(`${seed}x${i}`) * area[2] + Math.sin(t * 0.6 + i) * 30 + area[2]) % area[2]);
    const y = area[1] + ((((random(`${seed}y${i}`) * area[3] - t * (14 + random(`${seed}s${i}`) * 30)) % area[3]) + area[3]) % area[3]);
    d.push(<circle key={i} cx={x} cy={y} r={1 + random(`${seed}r${i}`) * 3} fill={color} opacity={0.25 + 0.6 * Math.abs(Math.sin(t * 1.4 + i))} />);
  }
  return <g>{d}</g>;
};

export const Fog: React.FC<{ t: number; y: number; color?: string; opacity?: number }> = ({ t, y, color = "#6b7fb8", opacity = 0.12 }) => (
  <g filter="url(#blur30)">
    {[0, 1, 2, 3].map((i) => (
      <ellipse
        key={i}
        cx={((i * 420 + t * (i % 2 ? 30 : -24)) % 1700) - 300}
        cy={y + Math.sin(t * 0.4 + i) * 40}
        rx={520}
        ry={130}
        fill={color}
        opacity={opacity}
      />
    ))}
  </g>
);
