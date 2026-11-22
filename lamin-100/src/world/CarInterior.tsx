import React from "react";
import { random } from "remotion";
import { beatPulse, clamp, lerp } from "../lib";

/**
 * Førerplads set indefra (1080x1920): forrude med natgaden udenfor (bokeh), fuldt instrumentbræt
 * med omdrejningstæller + speedometer, digitalt midterdisplay, rat, midterskærm, luftdyser, gearvælger, ambient-LED.
 * p = 0..1 (100% på "procent").
 */
const Dial: React.FC<{ cx: number; cy: number; r: number; max: number; step: number; v: number; red?: number; label: string; unit: string; glow: number }> = ({ cx, cy, r, max, step, v, red = 0.85, label, unit, glow }) => {
  const a0 = -225, a1 = 45;
  const n = Math.round(max / step);
  const ang = (x: number) => ((a0 + (a1 - a0) * x) * Math.PI) / 180;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r + 26} fill="#05060a" />
      <circle r={r + 20} fill="none" stroke="url(#gChrome)" strokeWidth={6} opacity={0.75} />
      <circle r={r + 8} fill="#0a0c14" />
      <circle r={r} fill="url(#dialFace)" />
      <path d={`M${Math.cos(ang(red)) * (r - 8)},${Math.sin(ang(red)) * (r - 8)} A${r - 8},${r - 8} 0 0 1 ${Math.cos(ang(1)) * (r - 8)},${Math.sin(ang(1)) * (r - 8)}`} stroke="#ff2a2a" strokeWidth={12} fill="none" opacity={0.85} />
      {Array.from({ length: n * 5 + 1 }).map((_, i) => {
        const x = i / (n * 5);
        const big = i % 5 === 0;
        const a = ang(x);
        return <line key={i} x1={Math.cos(a) * (r - 6)} y1={Math.sin(a) * (r - 6)} x2={Math.cos(a) * (r - (big ? 34 : 18))} y2={Math.sin(a) * (r - (big ? 34 : 18))} stroke={x >= red ? "#ff5a4a" : "#f2f4ff"} strokeWidth={big ? 5 : 2.5} />;
      })}
      {Array.from({ length: n + 1 }).map((_, i) => {
        const a = ang(i / n);
        return (
          <text key={i} x={Math.cos(a) * (r - 66)} y={Math.sin(a) * (r - 66) + 14} textAnchor="middle" fontFamily="Anton" fontSize={r * 0.17} fill={i / n >= red ? "#ff6a5a" : "#eef2ff"}>
            {Math.round(i * step)}
          </text>
        );
      })}
      <text x={0} y={r * 0.42} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={r * 0.1} fill="#9aa6c8">{unit}</text>
      <text x={0} y={-r * 0.36} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={r * 0.09} fill="#6a76a0">{label}</text>
      {/* nål */}
      <g transform={`rotate(${a0 + (a1 - a0) * v + 90})`}>
        <path d={`M-7,24 L0,${-(r - 14)} L7,24Z`} fill="#ff4a2a" />
        <path d={`M-2,10 L0,${-(r - 14)} L2,10Z`} fill="#ffd0b0" />
      </g>
      <circle r={r * 0.6} fill="url(#rRed)" opacity={glow * 0.35} />
      <circle r={30} fill="#14161e" stroke="#3a3f50" strokeWidth={4} />
      {/* glas-refleks */}
      <path d={`M${-r * 0.8},${-r * 0.4} Q0,${-r * 1.05} ${r * 0.8},${-r * 0.4} Q0,${-r * 0.7} ${-r * 0.8},${-r * 0.4}Z`} fill="#fff" opacity={0.07} />
    </g>
  );
};

export const CarInterior: React.FC<{ t: number; p: number; full: number }> = ({ t, p, full }) => {
  const bp = beatPulse(t);
  const rpm = clamp(p * 0.75 + Math.sin(t * 9) * 0.02 * p + full * 0.15);
  return (
    <g>
      <defs>
        <radialGradient id="dialFace" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#1a2036" />
          <stop offset="1" stopColor="#06070c" />
        </radialGradient>
        <linearGradient id="dashTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2c36" />
          <stop offset="0.3" stopColor="#14151c" />
          <stop offset="1" stopColor="#07080c" />
        </linearGradient>
        <linearGradient id="wheelG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3c46" />
          <stop offset="0.5" stopColor="#0d0e12" />
          <stop offset="1" stopColor="#1c1d24" />
        </linearGradient>
      </defs>
      {/* udsigt gennem forruden: natgade i bokeh */}
      <rect x={0} y={0} width={1080} height={1000} fill="#0b1026" />
      <rect x={0} y={520} width={1080} height={480} fill="#14101a" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={i * 120 - 40} y={180 + random(`cb${i}`) * 200} width={110} height={500} fill="#1a1a2e" opacity={0.9} />
      ))}
      {Array.from({ length: 46 }).map((_, i) => {
        const x = random(`bx${i}`) * 1080;
        const y = 150 + random(`by${i}`) * 650;
        const c = ["#ffcf86", "#ffb347", "#ff3d5a", "#7ae8ff", "#fff2c4"][i % 5];
        const r = 18 + random(`br${i}`) * 50;
        return <circle key={i} cx={x + Math.sin(t * 0.5 + i) * 6} cy={y} r={r} fill={c} opacity={0.18 + random(`bo${i}`) * 0.3} />;
      })}
      {/* regndråber på ruden */}
      {Array.from({ length: 70 }).map((_, i) => {
        const x = random(`rx${i}`) * 1080;
        const y = ((random(`ry${i}`) * 900 + t * (8 + random(`rs${i}`) * 30)) % 900) + 40;
        const r = 3 + random(`rr${i}`) * 6;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={r} ry={r * 1.25} fill="#9ab0e0" opacity={0.25} />
            <circle cx={x - r * 0.3} cy={y - r * 0.4} r={r * 0.35} fill="#fff" opacity={0.35} />
          </g>
        );
      })}
      {/* A-søjler og bakspejl */}
      <path d="M0,0 L150,0 L0,980Z" fill="#06070a" />
      <path d="M1080,0 L930,0 L1080,980Z" fill="#06070a" />
      <rect x={0} y={0} width={1080} height={70} fill="#06070a" />
      <rect x={430} y={60} width={220} height={74} rx={18} fill="#0b0c10" />
      <rect x={442} y={70} width={196} height={54} rx={12} fill="#1a2040" />
      <rect x={530} y={20} width={20} height={44} fill="#0b0c10" />
      {/* instrumentbræt */}
      <path d="M-20,900 Q540,800 1100,900 L1100,1920 L-20,1920Z" fill="url(#dashTop)" />
      <path d="M-20,900 Q540,800 1100,900" stroke="#4a4c58" strokeWidth={3} fill="none" opacity={0.6} />
      <path d="M-20,930 Q540,830 1100,930" stroke="#c9a45a" strokeWidth={2} strokeDasharray="10 8" fill="none" opacity={0.35} />
      {/* ambient-LED */}
      <path d="M-20,1440 Q540,1380 1100,1440" stroke="#3de0ff" strokeWidth={6} fill="none" opacity={0.7 + bp * 0.3} />
      <path d="M-20,1440 Q540,1380 1100,1440" stroke="#3de0ff" strokeWidth={30} fill="none" opacity={0.15} filter="url(#fBlur14)" />
      {/* instrumenthus */}
      <path d="M80,1010 Q540,900 1000,1010 L980,1380 L100,1380Z" fill="#030407" />
      <path d="M80,1010 Q540,900 1000,1010" stroke="#2a2c36" strokeWidth={10} fill="none" />
      <Dial cx={300} cy={1190} r={170} max={8} step={1} v={rpm} red={0.8} label="x1000" unit="RPM" glow={full} />
      <Dial cx={780} cy={1190} r={170} max={200} step={20} v={p * 0.5} red={0.9} label="km/t" unit="KM/T" glow={full} />
      {/* digitalt midterdisplay */}
      <rect x={470} y={1080} width={140} height={230} rx={12} fill="#05070e" stroke="#20263a" strokeWidth={3} />
      <text x={540} y={1170} textAnchor="middle" fontFamily="Anton" fontSize={64} fill={full > 0.5 ? "#ffc861" : "#e8f0ff"}>{Math.round(p * 100)}</text>
      <text x={540} y={1200} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={22} fill="#7a86a8">%</text>
      <rect x={490} y={1230} width={100} height={14} rx={7} fill="#1a2030" />
      <rect x={490} y={1230} width={100 * p} height={14} rx={7} fill={full > 0.5 ? "#ffc861" : "#3de0ff"} />
      <text x={540} y={1285} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={18} fill="#7a86a8">{full > 0.5 ? "FULD TANK" : "D  · 21:47"}</text>
      {/* advarselslamper */}
      {["#3de0ff", "#5aff7a", "#ffc861"].map((c, i) => (
        <circle key={i} cx={430 + i * 110} cy={1355} r={9} fill={c} opacity={0.6} />
      ))}
      {/* luftdyser */}
      {[30, 960].map((x) => (
        <g key={x}>
          <rect x={x} y={1240} width={90} height={110} rx={20} fill="#0b0c10" stroke="#2a2c36" strokeWidth={4} />
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={x + 10} y={1258 + i * 18} width={70} height={6} rx={3} fill="#3a3c46" />
          ))}
        </g>
      ))}
      {/* rat */}
      <g transform="translate(540,1700)">
        <circle r={430} fill="none" stroke="#000" strokeWidth={90} opacity={0.4} filter="url(#fBlur14)" />
        <circle r={420} fill="none" stroke="url(#wheelG)" strokeWidth={70} />
        <circle r={420} fill="none" stroke="#5a5c68" strokeWidth={3} opacity={0.6} transform="translate(0,-28)" />
        <path d="M-380,-60 Q0,-20 380,-60 L300,120 Q0,170 -300,120Z" fill="#0d0e12" />
        <path d="M-110,-160 Q0,-200 110,-160 L130,40 Q0,80 -130,40Z" fill="#121318" stroke="#2a2c36" strokeWidth={4} />
        <circle r={36} cy={-60} fill="#1c1d24" stroke="url(#gChrome)" strokeWidth={4} />
        {[[-250, -20], [-200, 30], [200, -20], [250, 30]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={14} fill="#1a1c24" stroke="#3de0ff" strokeWidth={2} opacity={0.8} />
        ))}
        <path d="M-420,0 Q-430,-200 -300,-320" stroke="#8a8c98" strokeWidth={4} fill="none" opacity={0.35} />
      </g>
      {/* midterkonsol-skærm i højre side */}
      <g transform="translate(1040,1560) rotate(-8)">
        <rect x={-120} y={-160} width={260} height={180} rx={14} fill="#05070e" stroke="#2a2c36" strokeWidth={4} />
        <rect x={-110} y={-150} width={240} height={160} rx={10} fill="#0c1430" />
        <circle cx={-60} cy={-90} r={30} fill="#1db954" opacity={0.8} />
        <rect x={-20} y={-110} width={130} height={14} rx={7} fill="#e8f0ff" opacity={0.8} />
        <rect x={-20} y={-84} width={90} height={10} rx={5} fill="#7a86a8" />
        <rect x={-100} y={-30} width={220} height={8} rx={4} fill="#2a3050" />
        <rect x={-100} y={-30} width={220 * ((t * 0.02) % 1)} height={8} rx={4} fill="#1db954" />
      </g>
      {/* lys fra instrumenterne på rattet og kabinen */}
      <ellipse cx={540} cy={1200} rx={600} ry={260} fill="url(#rBlue)" opacity={0.25 + full * 0.15} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={540} cy={1200} rx={500} ry={220} fill="url(#rRed)" opacity={full * 0.35} style={{ mixBlendMode: "screen" }} />
      <radialGradient id="carVig" cx="0.5" cy="0.55" r="0.75">
        <stop offset="0.5" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.85" />
      </radialGradient>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#carVig)" />
      <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={lerp(0, 0.04, bp)} />
    </g>
  );
};
