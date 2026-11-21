import React from "react";
import { random } from "remotion";
import { PAL, clamp, easeOut } from "../lib";

/** 8-takket stjerneglimt */
export const Sparkle: React.FC<{ x: number; y: number; r: number; o?: number; rot?: number }> = ({ x, y, r, o = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o} style={{ mixBlendMode: "screen" }}>
    <circle r={r * 0.5} fill="url(#glowWhite)" />
    <path d={`M0,${-r} L${r * 0.07},0 L0,${r} L${-r * 0.07},0 Z`} fill="#fff" />
    <path d={`M${-r},0 L0,${r * 0.07} L${r},0 L0,${-r * 0.07} Z`} fill="#fff" />
    <g transform="rotate(45)">
      <path d={`M0,${-r * 0.45} L${r * 0.05},0 L0,${r * 0.45} L${-r * 0.05},0 Z`} fill="#fff" opacity={0.8} />
      <path d={`M${-r * 0.45},0 L0,${r * 0.05} L${r * 0.45},0 L0,${-r * 0.05} Z`} fill="#fff" opacity={0.8} />
    </g>
  </g>
);

/** Facetteret diamant */
export const Diamond: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-100,-30 L-60,-80 L60,-80 L100,-30 L0,110 Z" fill="#cfe6ff" />
    <path d="M-100,-30 L-60,-80 L-20,-30 Z" fill="#ffffff" />
    <path d="M-20,-30 L-60,-80 L60,-80 L20,-30 Z" fill="#e9f4ff" />
    <path d="M20,-30 L60,-80 L100,-30 Z" fill="#a9cdf5" />
    <path d="M-100,-30 L-20,-30 L0,110 Z" fill="#9cc3f0" />
    <path d="M-20,-30 L20,-30 L0,110 Z" fill="#dff0ff" />
    <path d="M20,-30 L100,-30 L0,110 Z" fill="#7fa9dd" />
    <path d="M-100,-30 L100,-30" stroke="#fff" strokeWidth={2} />
  </g>
);

/** Kæde med vedhæng (diamant) */
export const Chain: React.FC<{ t: number; cx: number; cy: number; w: number; sag: number }> = ({ t, cx, cy, w, sag }) => {
  const links = [];
  const n = 34;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = cx - w / 2 + w * u;
    const y = cy + Math.sin(u * Math.PI) * sag + Math.sin(t * 2 + u * 6) * 4;
    links.push(
      <ellipse key={i} cx={x} cy={y} rx={13} ry={8} fill="none" stroke="url(#gold)" strokeWidth={5} transform={`rotate(${i % 2 ? 60 : -20},${x},${y})`} />,
    );
  }
  return <g>{links}</g>;
};

/** Pengeseddel */
export const Bill: React.FC<{ x: number; y: number; rot: number; s?: number; o?: number }> = ({ x, y, rot, s = 1, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-90} y={-44} width={180} height={88} rx={6} fill="#cfe3c4" />
    <rect x={-82} y={-36} width={164} height={72} rx={4} fill="none" stroke="#5f8a5a" strokeWidth={3} />
    <circle cx={0} cy={0} r={22} fill="none" stroke="#5f8a5a" strokeWidth={3} />
    <text x={0} y={9} textAnchor="middle" fontFamily="Anton" fontSize={26} fill="#3f6b3b">
      500
    </text>
    <text x={-66} y={-14} fontFamily="Anton" fontSize={16} fill="#5f8a5a">
      500
    </text>
  </g>
);

/** Fly (sideview, flyver mod venstre) */
export const Plane: React.FC<{ x: number; y: number; s: number; t: number; rot?: number }> = ({ x, y, s, t, rot = 0 }) => {
  const blink = Math.sin(t * 9) > 0.6 ? 1 : 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-300,0 Q-300,-26 -250,-30 L230,-30 Q300,-28 320,-6 Q300,14 230,16 L-250,16 Q-300,14 -300,0 Z" fill="#1a2340" stroke="#4a5a8a" strokeWidth={3} />
      <path d="M-40,-10 L60,-10 L-110,-170 L-150,-170 Z" fill="#141b33" stroke="#4a5a8a" strokeWidth={2} />
      <path d="M-40,8 L60,8 L-70,110 L-110,110 Z" fill="#101629" />
      <path d="M200,-30 L230,-30 L290,-130 L262,-130 Z" fill="#141b33" stroke="#4a5a8a" strokeWidth={2} />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={-220 + i * 26} y={-18} width={12} height={10} rx={3} fill={PAL.sodium} opacity={0.85} />
      ))}
      <circle cx={-110} cy={-170} r={30} fill="url(#glowRed)" opacity={blink} />
      <circle cx={262} cy={-130} r={26} fill="url(#glowWhite)" opacity={1 - blink} />
      <circle cx={-296} cy={2} r={60} fill="url(#glowWhite)" opacity={0.9} />
      <polygon points="-296,2 -1400,-160 -1400,200" fill="url(#coneWhiteL)" opacity={0.35} style={{ mixBlendMode: "screen" }} />
    </g>
  );
};

/** Palme-silhuet */
export const Palm: React.FC<{ x: number; y: number; h: number; t: number; seed: string }> = ({ x, y, h, t, seed }) => {
  const sway = Math.sin(t * 1.2 + random(seed) * 6) * 3;
  const tx = x + h * 0.12;
  const ty = y - h;
  return (
    <g>
      <path d={`M${x - 8},${y} Q${x + h * 0.05},${y - h * 0.5} ${tx},${ty} L${tx + 10},${ty} Q${x + h * 0.08},${y - h * 0.5} ${x + 10},${y} Z`} fill="#03050c" />
      <g transform={`rotate(${sway},${tx},${ty})`}>
        {[-150, -110, -70, -30, 10, 40, 200, 160].map((a, i) => (
          <path
            key={i}
            d={`M${tx},${ty} Q${tx + Math.cos((a * Math.PI) / 180) * h * 0.22},${ty + Math.sin((a * Math.PI) / 180) * h * 0.22 - 30} ${tx + Math.cos((a * Math.PI) / 180) * h * 0.34},${ty + Math.sin((a * Math.PI) / 180) * h * 0.34 + 20}`}
            stroke="#03050c"
            strokeWidth={h * 0.05}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>
    </g>
  );
};

/** Equalizer-søjler (skrug op) */
export const Equalizer: React.FC<{ x: number; y: number; w: number; h: number; level: number; t: number; n?: number; color?: string }> = ({
  x,
  y,
  w,
  h,
  level,
  t,
  n = 18,
  color = PAL.cyan,
}) => {
  const bw = w / n;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const v = clamp(level * (0.45 + 0.55 * Math.abs(Math.sin(t * (6 + (i % 5)) + i * 1.3))));
        const segs = Math.floor(v * 14);
        return (
          <g key={i}>
            {Array.from({ length: segs }).map((__, k) => (
              <rect
                key={k}
                x={x + i * bw + 3}
                y={y - (k + 1) * (h / 14)}
                width={bw - 6}
                height={h / 14 - 4}
                rx={2}
                fill={k > 10 ? PAL.red : k > 7 ? PAL.amber : color}
                opacity={0.9}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
};

/** Volumenknap */
export const Knob: React.FC<{ x: number; y: number; r: number; v: number }> = ({ x, y, r, v }) => {
  const a = -135 + v * 270;
  const ticks = [];
  for (let i = 0; i <= 20; i++) {
    const aa = ((-135 + i * 13.5 - 90) * Math.PI) / 180;
    const on = i / 20 <= v;
    ticks.push(
      <line
        key={i}
        x1={x + Math.cos(aa) * (r + 18)}
        y1={y + Math.sin(aa) * (r + 18)}
        x2={x + Math.cos(aa) * (r + 44)}
        y2={y + Math.sin(aa) * (r + 44)}
        stroke={on ? (i > 16 ? PAL.red : PAL.cyan) : "#26304e"}
        strokeWidth={8}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <g>
      {ticks}
      <circle cx={x} cy={y} r={r} fill="url(#chrome)" />
      <circle cx={x} cy={y} r={r * 0.86} fill="#141a2c" />
      {Array.from({ length: 36 }).map((_, i) => (
        <line
          key={i}
          x1={x + Math.cos((i * 10 * Math.PI) / 180) * r * 0.86}
          y1={y + Math.sin((i * 10 * Math.PI) / 180) * r * 0.86}
          x2={x + Math.cos((i * 10 * Math.PI) / 180) * r * 0.98}
          y2={y + Math.sin((i * 10 * Math.PI) / 180) * r * 0.98}
          stroke="#0a0d18"
          strokeWidth={3}
        />
      ))}
      <g transform={`rotate(${a},${x},${y})`}>
        <rect x={x - 7} y={y - r * 0.8} width={14} height={r * 0.42} rx={7} fill={PAL.cyan} />
      </g>
      <circle cx={x} cy={y} r={r * 1.6} fill="url(#glowCyan)" opacity={0.25 * v} />
    </g>
  );
};

/** Speedometer */
export const Speedo: React.FC<{ x: number; y: number; r: number; v: number }> = ({ x, y, r, v }) => {
  const els = [];
  for (let i = 0; i <= 26; i++) {
    const aa = ((-220 + i * (260 / 26)) * Math.PI) / 180;
    const big = i % 2 === 0;
    els.push(
      <line
        key={i}
        x1={x + Math.cos(aa) * r * 0.82}
        y1={y + Math.sin(aa) * r * 0.82}
        x2={x + Math.cos(aa) * r * (big ? 0.68 : 0.75)}
        y2={y + Math.sin(aa) * r * (big ? 0.68 : 0.75)}
        stroke={i > 20 ? PAL.red : "#cfe0ff"}
        strokeWidth={big ? 6 : 3}
      />,
    );
    if (big && i % 4 === 0)
      els.push(
        <text key={`t${i}`} x={x + Math.cos(aa) * r * 0.54} y={y + Math.sin(aa) * r * 0.54 + 12} textAnchor="middle" fontFamily="Anton" fontSize={32} fill="#cfe0ff">
          {i * 10}
        </text>,
      );
  }
  const na = -220 + clamp(v) * 260;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#05070f" stroke="#2b3760" strokeWidth={6} />
      <circle cx={x} cy={y} r={r * 0.95} fill="url(#glowCyan)" opacity={0.15} />
      {els}
      <g transform={`rotate(${na},${x},${y})`}>
        <path d={`M${x},${y - 6} L${x + r * 0.8},${y} L${x},${y + 6} Z`} fill={PAL.red} />
      </g>
      <circle cx={x} cy={y} r={18} fill="url(#chrome)" />
      <text x={x} y={y + r * 0.45} textAnchor="middle" fontFamily="Anton" fontSize={64} fill="#fff">
        {Math.round(v * 260)}
      </text>
      <text x={x} y={y + r * 0.6} textAnchor="middle" fontFamily="Anton" fontSize={24} fill="#8fa3d6">
        KM/T
      </text>
    </g>
  );
};

/** Indkøbsposer (uden mærkelogoer) */
export const Bag: React.FC<{ x: number; y: number; s: number; color: string; label: string; rot?: number }> = ({ x, y, s, color, label, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60,-150 Q-60,-210 0,-210 Q60,-210 60,-150" fill="none" stroke="#c9b78a" strokeWidth={8} />
    <rect x={-110} y={-160} width={220} height={260} rx={6} fill={color} />
    <rect x={-110} y={-160} width={220} height={260} rx={6} fill="url(#glass)" opacity={0.15} />
    <rect x={-110} y={-160} width={18} height={260} fill="#000" opacity={0.25} />
    <text x={0} y={-40} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#f4f1ea" letterSpacing={6}>
      {label}
    </text>
  </g>
);

/** Røgsky */
export const Smoke: React.FC<{ t: number; x: number; y: number; n?: number; spread?: number; seed?: string; color?: string; start?: number }> = ({
  t,
  x,
  y,
  n = 26,
  spread = 1,
  seed = "sm",
  color = "#c9d4f0",
  start = 0,
}) => (
  <g filter="url(#blur14)">
    {Array.from({ length: n }).map((_, i) => {
      const st = start + random(`${seed}s${i}`) * 2.5;
      const k = t - st;
      if (k < 0) return null;
      const life = (k % 3.2) / 3.2;
      const dx = (random(`${seed}x${i}`) - 0.3) * 520 * life * spread + Math.sin(k * 2 + i) * 30;
      const dy = -420 * life * spread;
      const r = 30 + life * 160;
      return <circle key={i} cx={x + dx} cy={y + dy} r={r} fill={color} opacity={0.22 * (1 - life) * easeOut(k * 2)} />;
    })}
  </g>
);

/** Telefon med beskedtråd */
export const Phone: React.FC<{ x: number; y: number; s: number; rot?: number; children?: React.ReactNode }> = ({ x, y, s, rot = 0, children }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-210} y={-420} width={420} height={840} rx={64} fill="#05060c" stroke="#5c6b9a" strokeWidth={4} />
    <rect x={-192} y={-402} width={384} height={804} rx={50} fill="#0c1124" />
    {children}
    <rect x={-62} y={-390} width={124} height={30} rx={15} fill="#05060c" />
    <rect x={-192} y={-402} width={384} height={804} rx={50} fill="url(#glass)" opacity={0.12} />
  </g>
);
