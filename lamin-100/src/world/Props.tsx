import React from "react";
import { random } from "remotion";
import { GROUND } from "./Building";

/** Klassisk gadelygte (fod i x, GROUND+off). */
export const StreetLamp: React.FC<{ x: number; y?: number; h?: number; on?: number }> = ({ x, y = GROUND + 40, h = 640, on = 1 }) => {
  const hy = y - h;
  return (
    <g>
      {/* lyskegle + pøl */}
      <polygon points={`${x - 30},${hy + 60} ${x + 30},${hy + 60} ${x + 260},${y} ${x - 260},${y}`} fill="url(#gLampCone)" opacity={0.55 * on} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={x} cy={y - 4} rx={330} ry={46} fill="url(#rWarm)" opacity={0.9 * on} />
      {/* fod */}
      <path d={`M${x - 26},${y} L${x - 18},${y - 70} L${x + 18},${y - 70} L${x + 26},${y}Z`} fill="#10131c" />
      <rect x={x - 22} y={y - 82} width={44} height={14} fill="#1a1e2a" />
      <path d={`M${x - 9},${y - 80} L${x - 6},${hy + 70} L${x + 6},${hy + 70} L${x + 9},${y - 80}Z`} fill="#141824" />
      <rect x={x - 3} y={y - 80} width={3} height={h - 150} fill="#5a6278" opacity={0.5} />
      {[0.35, 0.6].map((k) => (
        <rect key={k} x={x - 12} y={y - h * k} width={24} height={10} fill="#1a1e2a" />
      ))}
      {/* lanterne */}
      <path d={`M${x - 10},${hy + 70} L${x - 26},${hy + 56} L${x + 26},${hy + 56} L${x + 10},${hy + 70}Z`} fill="#10131c" />
      <path d={`M${x - 30},${hy + 56} L${x - 40},${hy - 10} L${x + 40},${hy - 10} L${x + 30},${hy + 56}Z`} fill="#fff1c8" opacity={on} />
      <path d={`M${x - 30},${hy + 56} L${x - 40},${hy - 10} L${x + 40},${hy - 10} L${x + 30},${hy + 56}Z`} fill="none" stroke="#10131c" strokeWidth={5} />
      <line x1={x} y1={hy - 10} x2={x} y2={hy + 56} stroke="#10131c" strokeWidth={4} />
      <path d={`M${x - 52},${hy - 10} L${x},${hy - 46} L${x + 52},${hy - 10}Z`} fill="#10131c" />
      <circle cx={x} cy={hy - 52} r={8} fill="#10131c" />
      <circle cx={x} cy={hy + 22} r={260} fill="url(#rWarm)" opacity={0.75 * on} />
      <circle cx={x} cy={hy + 22} r={70} fill="url(#rHot)" opacity={0.9 * on} />
    </g>
  );
};

/** Gadetræ (stamme + løvkrone, belyst nedefra). */
export const Tree: React.FC<{ x: number; seed: string; h?: number }> = ({ x, seed, h = 900 }) => {
  const blobs = Array.from({ length: 26 }).map((_, i) => {
    const a = random(`${seed}a${i}`) * Math.PI * 2;
    const d = random(`${seed}d${i}`) * 230;
    return { cx: x + Math.cos(a) * d * 1.2, cy: GROUND - h + 140 + Math.sin(a) * d * 0.8, r: 70 + random(`${seed}r${i}`) * 70, l: random(`${seed}l${i}`) };
  });
  return (
    <g>
      <path d={`M${x - 22},${GROUND + 30} L${x - 12},${GROUND - h + 260} L${x + 12},${GROUND - h + 260} L${x + 26},${GROUND + 30}Z`} fill="#140e0c" />
      <path d={`M${x},${GROUND - h + 380} L${x - 140},${GROUND - h + 180} M${x + 4},${GROUND - h + 330} L${x + 150},${GROUND - h + 170}`} stroke="#140e0c" strokeWidth={14} />
      {blobs.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.l < 0.4 ? "#1c2a14" : b.l < 0.75 ? "#121c10" : "#2e3a18"} />
      ))}
      {blobs.slice(0, 10).map((b, i) => (
        <circle key={`h${i}`} cx={b.cx} cy={b.cy + b.r * 0.4} r={b.r * 0.6} fill="#6a5a22" opacity={0.25} />
      ))}
      <rect x={x - 70} y={GROUND + 26} width={140} height={10} fill="#1a1816" />
    </g>
  );
};

/** Cykel (side). */
export const Bike: React.FC<{ x: number; y?: number; c?: string }> = ({ x, y = GROUND + 60, c = "#1a1d26" }) => (
  <g stroke={c} strokeWidth={5} fill="none">
    <circle cx={x} cy={y - 40} r={40} />
    <circle cx={x + 130} cy={y - 40} r={40} />
    <path d={`M${x},${y - 40} L${x + 50},${y - 100} L${x + 120},${y - 100} L${x + 130},${y - 40} M${x + 50},${y - 100} L${x + 70},${y - 40} L${x},${y - 40} M${x + 70},${y - 40} L${x + 120},${y - 100}`} />
    <path d={`M${x + 40},${y - 116} L${x + 64},${y - 116} M${x + 120},${y - 100} L${x + 110},${y - 128} L${x + 132},${y - 132}`} strokeWidth={7} />
  </g>
);

/** Personbil (side). dir=1 front mod højre. interior = vis instrumentbræt-glød. */
export const Car: React.FC<{ x: number; y: number; s?: number; color?: string; dir?: 1 | -1; lights?: number; t?: number; taxi?: "free" | "busy" | null; wheelRot?: number }> = ({
  x, y, s = 1, color = "url(#gMetalCar)", dir = 1, lights = 0, taxi = null, wheelRot = 0,
}) => (
  <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
    <ellipse cx={0} cy={4} rx={330} ry={22} fill="#000" opacity={0.7} />
    {/* krop */}
    <path d="M-320,-40 L-318,-118 Q-310,-140 -260,-146 L-170,-152 L-90,-222 Q-70,-236 -30,-238 L110,-238 Q150,-236 176,-214 L238,-156 Q300,-150 318,-120 L326,-58 L320,-40 Z" fill={color} />
    <path d="M-320,-40 L320,-40 L322,-70 L-322,-70Z" fill="#05060a" opacity={0.6} />
    {/* højlys-linje */}
    <path d="M-312,-118 L316,-118" stroke="#9aa6c8" strokeWidth={3} opacity={0.4} />
    {/* ruder */}
    <path d="M-150,-152 L-84,-214 Q-70,-224 -40,-224 L22,-224 L22,-152Z" fill="url(#gGlassCar)" />
    <path d="M36,-224 L104,-224 Q140,-222 160,-204 L210,-152 L36,-152Z" fill="url(#gGlassCar)" />
    <rect x={22} y={-226} width={14} height={76} fill="#05060a" />
    {/* døre, håndtag */}
    <path d="M-160,-150 L-160,-46 M30,-150 L30,-46 M206,-150 L214,-60" stroke="#000" strokeWidth={3} opacity={0.7} />
    <rect x={-60} y={-130} width={40} height={8} rx={4} fill="#aab" opacity={0.6} />
    <rect x={120} y={-130} width={40} height={8} rx={4} fill="#aab" opacity={0.6} />
    <path d="M-160,-160 L-180,-168 L-184,-150 L-160,-150Z" fill="#111" />
    {/* lygter */}
    <path d="M300,-128 L322,-122 L324,-98 L296,-104Z" fill="#fff6d8" opacity={0.6 + lights * 0.4} />
    <path d="M-318,-120 L-302,-122 L-300,-96 L-320,-96Z" fill="#ff2a3c" opacity={0.6 + lights * 0.4} />
    {lights > 0 && <polygon points="320,-114 1100,-260 1100,60 320,-100" fill="url(#gHeadlight)" opacity={0.55 * lights} />}
    {lights > 0 && <circle cx={-312} cy={-108} r={60} fill="url(#rRed)" opacity={0.6 * lights} />}
    {/* hjul */}
    {[-200, 200].map((wx) => (
      <g key={wx} transform={`translate(${wx},-36)`}>
        <circle r={62} fill="#07080c" />
        <circle r={60} fill="none" stroke="#1a1d26" strokeWidth={6} />
        <circle r={36} fill="url(#gChrome)" opacity={0.85} />
        <g transform={`rotate(${wheelRot})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <rect key={a} x={-5} y={-34} width={10} height={30} fill="#3a3f4c" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r={8} fill="#22252e" />
        <path d={`M-74,-10 Q0,-90 74,-10`} fill="none" stroke="#05060a" strokeWidth={14} />
      </g>
    ))}
    {taxi && (
      <g>
        <rect x={-70} y={-280} width={140} height={42} rx={8} fill={taxi === "free" ? "#fff3c4" : "#3a1a1a"} />
        <text x={0} y={-248} textAnchor="middle" fontFamily="Anton" fontSize={30} fill={taxi === "free" ? "#1a1400" : "#ff4a4a"} transform={dir < 0 ? "scale(-1,1)" : undefined}>
          TAXA
        </text>
        <circle cx={0} cy={-260} r={120} fill={taxi === "free" ? "url(#rWarm)" : "url(#rRed)"} opacity={0.6} />
      </g>
    )}
  </g>
);

/** Skraldespand + pullert */
export const Bin: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 34} y={GROUND - 10} width={68} height={110} rx={6} fill="#1c3a2a" />
    <rect x={x - 38} y={GROUND - 18} width={76} height={14} rx={4} fill="#14281e" />
    <rect x={x - 30} y={GROUND + 10} width={6} height={80} fill="#fff" opacity={0.08} />
  </g>
);
