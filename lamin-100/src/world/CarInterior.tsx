import React from "react";
import { random } from "remotion";
import { beatPulse, clamp } from "../lib";

/**
 * Cockpit i luksus-coupé (lærred 1080x1920, men tegnet bredt -2400..3480 så det fylder hele sideruden).
 * Forrude med natgade (bokeh + regn), widescreen-glaspanel: digitalt speedometer + omdrejningstæller
 * og midterskærm (afspiller "100%"), runde turbine-dyser i krom, ambient-LED, trælist,
 * fladbundet sportsrat med touch-knapper og pedal-paddles, midterkonsol.
 * p = 0..1 (100 % på "procent").
 */
const X0 = -2400, X1 = 3480;

const DigiDial: React.FC<{ cx: number; cy: number; r: number; v: number; max: number; step: number; unit: string; color: string; full: number }> = ({ cx, cy, r, v, max, step, unit, color, full }) => {
  const a0 = -220, a1 = 40;
  const ang = (x: number) => ((a0 + (a1 - a0) * x) * Math.PI) / 180;
  const arc = (x0: number, x1v: number, rr: number) => {
    const s = ang(x0), e = ang(x1v);
    const large = (x1v - x0) * (a1 - a0) > 180 ? 1 : 0;
    return `M${Math.cos(s) * rr},${Math.sin(s) * rr} A${rr},${rr} 0 ${large} 1 ${Math.cos(e) * rr},${Math.sin(e) * rr}`;
  };
  const n = Math.round(max / step);
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r + 10} fill="#03040a" />
      <path d={arc(0, 1, r - 6)} stroke="#1a2030" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={arc(0, Math.max(0.001, v), r - 6)} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={arc(0, Math.max(0.001, v), r - 6)} stroke={color} strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.25} filter="url(#fBlur6)" />
      {Array.from({ length: n * 2 + 1 }).map((_, i) => {
        const a = ang(i / (n * 2));
        const big = i % 2 === 0;
        return <line key={i} x1={Math.cos(a) * (r - 22)} y1={Math.sin(a) * (r - 22)} x2={Math.cos(a) * (r - (big ? 40 : 30))} y2={Math.sin(a) * (r - (big ? 40 : 30))} stroke="#cfd8f0" strokeWidth={big ? 3 : 1.6} opacity={0.8} />;
      })}
      {Array.from({ length: n + 1 }).map((_, i) => {
        const a = ang(i / n);
        return <text key={i} x={Math.cos(a) * (r - 60)} y={Math.sin(a) * (r - 60) + 8} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={r * 0.13} fill="#aab6d8">{Math.round(i * step)}</text>;
      })}
      <g transform={`rotate(${a0 + (a1 - a0) * v + 90})`}>
        <path d={`M-3,0 L0,${-(r - 8)} L3,0Z`} fill="#fff" />
        <path d={`M-6,${-(r - 46)} L0,${-(r - 6)} L6,${-(r - 46)}Z`} fill={color} />
      </g>
      <circle r={r * 0.42} fill="#05070f" stroke="#1a2236" strokeWidth={2} />
      <text x={0} y={r * 0.12} textAnchor="middle" fontFamily="Anton" fontSize={r * 0.34} fill={full > 0.5 ? "#ffd27a" : "#f2f6ff"}>{Math.round(v * max)}</text>
      <text x={0} y={r * 0.3} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={r * 0.09} fill="#7a86a8">{unit}</text>
    </g>
  );
};

const Vent: React.FC<{ cx: number; cy: number; r: number; t: number }> = ({ cx, cy, r, t }) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r + 8} fill="#05060a" />
    <circle r={r + 4} fill="none" stroke="url(#gChrome)" strokeWidth={8} />
    <circle r={r - 2} fill="#0b0c12" />
    <g transform={`rotate(${t * 4})`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M0,0 L${r * 0.18},${-r * 0.92} L${-r * 0.06},${-r * 0.92}Z`} fill="url(#gChrome)" opacity={0.85} transform={`rotate(${i * 30})`} />
      ))}
    </g>
    <circle r={r * 0.3} fill="url(#gChrome)" />
    <circle r={r * 0.16} fill="#14151c" />
    <path d={`M${-r * 0.7},${-r * 0.7} A${r},${r} 0 0 1 ${r * 0.7},${-r * 0.7}`} stroke="#fff" strokeWidth={2} fill="none" opacity={0.35} />
  </g>
);

export const CarInterior: React.FC<{ t: number; p: number; full: number }> = ({ t, p, full }) => {
  const bp = beatPulse(t);
  const rpm = clamp(p * 0.72 + Math.sin(t * 9) * 0.015 * p + full * 0.12);
  const amb = ["#7a5cff", "#3de0ff", "#ff3dc8"][Math.floor(t * 0.5) % 3];
  const prog = clamp(((t + 10) % 187) / 187);
  return (
    <g>
      <defs>
        <linearGradient id="ciDash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2e38" />
          <stop offset="0.35" stopColor="#15161c" />
          <stop offset="1" stopColor="#08090c" />
        </linearGradient>
        <linearGradient id="ciWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a1a10" />
          <stop offset="0.3" stopColor="#4a2e1a" />
          <stop offset="0.55" stopColor="#3a2414" />
          <stop offset="0.8" stopColor="#523420" />
          <stop offset="1" stopColor="#2a1a10" />
        </linearGradient>
        <linearGradient id="ciWheel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a4c56" />
          <stop offset="0.45" stopColor="#101116" />
          <stop offset="1" stopColor="#24252c" />
        </linearGradient>
        <linearGradient id="ciGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c0f1c" />
          <stop offset="1" stopColor="#03040a" />
        </linearGradient>
        <linearGradient id="ciArt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="0.6" stopColor="#c23a5a" />
          <stop offset="1" stopColor="#2a1a4a" />
        </linearGradient>
        <radialGradient id="ciVig" cx="0.5" cy="0.55" r="0.8">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      {/* ---------- udsyn gennem forruden ---------- */}
      <rect x={X0} y={-600} width={X1 - X0} height={1500} fill="#0b1026" />
      <rect x={X0} y={480} width={X1 - X0} height={420} fill="#120e18" />
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i} x={X0 + i * 200} y={140 + random(`cb${i}`) * 220} width={180} height={600} fill="#181a2e" />
      ))}
      {Array.from({ length: 120 }).map((_, i) => {
        const x = X0 + random(`bx${i}`) * (X1 - X0);
        const y = 120 + random(`by${i}`) * 620;
        const c = ["#ffcf86", "#ffb347", "#ff3d5a", "#7ae8ff", "#fff2c4"][i % 5];
        const r = 10 + random(`br${i}`) * 34;
        return <circle key={i} cx={x + Math.sin(t * 0.5 + i) * 5} cy={y} r={r} fill={c} opacity={0.14 + random(`bo${i}`) * 0.22} />;
      })}
      {Array.from({ length: 140 }).map((_, i) => {
        const x = X0 + random(`rx${i}`) * (X1 - X0);
        const y = ((random(`ry${i}`) * 820 + t * (6 + random(`rs${i}`) * 24)) % 820) + 30;
        const r = 2.5 + random(`rr${i}`) * 5;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={r} ry={r * 1.25} fill="#9ab0e0" opacity={0.22} />
            <circle cx={x - r * 0.3} cy={y - r * 0.4} r={r * 0.35} fill="#fff" opacity={0.32} />
          </g>
        );
      })}
      {/* tagbeklædning, A-søjler, bakspejl */}
      <rect x={X0} y={-600} width={X1 - X0} height={660} fill="#0a0a0e" />
      <path d={`M${X0},-600 L120,-600 L-60,900 L${X0},900Z`} fill="#07070a" />
      <path d={`M${X1},-600 L960,-600 L1140,900 L${X1},900Z`} fill="#07070a" />
      <path d="M120,60 L-60,900" stroke="#1c1d24" strokeWidth={10} />
      <path d="M960,60 L1140,900" stroke="#1c1d24" strokeWidth={10} />
      <rect x={400} y={60} width={280} height={86} rx={22} fill="#0b0c10" />
      <rect x={414} y={72} width={252} height={62} rx={14} fill="#1a2040" />
      <rect x={414} y={72} width={252} height={62} rx={14} fill="url(#rBlue)" opacity={0.3} />
      <rect x={530} y={20} width={20} height={44} fill="#0b0c10" />
      {/* ---------- instrumentbræt ---------- */}
      <path d={`M${X0},880 Q540,780 ${X1},880 L${X1},2400 L${X0},2400Z`} fill="url(#ciDash)" />
      <path d={`M${X0},880 Q540,780 ${X1},880`} stroke="#4a4c58" strokeWidth={3} fill="none" opacity={0.6} />
      <path d={`M${X0},905 Q540,805 ${X1},905`} stroke="#c9a45a" strokeWidth={2} strokeDasharray="10 8" fill="none" opacity={0.35} />
      {/* widescreen-glaspanel */}
      <rect x={20} y={920} width={1040} height={330} rx={26} fill="#020306" stroke="#3a3c48" strokeWidth={4} />
      <rect x={30} y={930} width={1020} height={310} rx={20} fill="url(#ciGlass)" />
      <DigiDial cx={160} cy={1090} r={120} v={(p * 100) / 260} max={260} step={20} unit="km/t" color={full > 0.5 ? "#ffb347" : "#3de0ff"} full={full} />
      <DigiDial cx={420} cy={1090} r={120} v={rpm} max={8} step={1} unit="x1000 rpm" color={full > 0.5 ? "#ff4a3a" : "#7a5cff"} full={full} />
      <text x={290} y={968} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={18} fill="#7a86a8">D  ·  21:47  ·  8°C</text>
      <rect x={250} y={1188} width={80} height={36} rx={8} fill="#0a0e1c" stroke="#2a3250" />
      <text x={290} y={1214} textAnchor="middle" fontFamily="Anton" fontSize={26} fill={full > 0.5 ? "#ffd27a" : "#e8f0ff"}>{Math.round(p * 100)}%</text>
      {/* midterskærm: afspiller */}
      <rect x={560} y={940} width={480} height={290} rx={16} fill="#070a16" />
      <text x={584} y={976} fontFamily="Playfair" fontStyle="italic" fontSize={22} fill="#c9ccd6">Mercedes-Benz</text>
      <text x={1020} y={976} textAnchor="end" fontFamily="SpaceMonoB" fontSize={18} fill="#7a86a8">CLS</text>
      <rect x={584} y={996} width={150} height={150} rx={10} fill="url(#ciArt)" />
      <text x={659} y={1084} textAnchor="middle" fontFamily="Anton" fontSize={52} fill="#fff">100%</text>
      <text x={754} y={1036} fontFamily="Anton" fontSize={40} fill="#fff">100%</text>
      <text x={754} y={1074} fontFamily="SpaceMonoB" fontSize={22} fill="#aab6d8">LAMIN</text>
      {/* equalizer */}
      {Array.from({ length: 14 }).map((_, i) => {
        const h = 10 + Math.abs(Math.sin(t * 6 + i * 0.9)) * 40 * (0.5 + bp * 0.5);
        return <rect key={i} x={754 + i * 18} y={1132 - h} width={10} height={h} rx={3} fill="#3de0ff" opacity={0.8} />;
      })}
      <rect x={584} y={1172} width={430} height={8} rx={4} fill="#1a2236" />
      <rect x={584} y={1172} width={430 * prog} height={8} rx={4} fill="#fff" />
      <circle cx={584 + 430 * prog} cy={1176} r={9} fill="#fff" />
      <text x={584} y={1214} fontFamily="SpaceMonoB" fontSize={18} fill="#7a86a8">⏮   ⏸   ⏭</text>
      <text x={1014} y={1214} textAnchor="end" fontFamily="SpaceMonoB" fontSize={18} fill="#7a86a8">♥  ⇄</text>
      {/* glasrefleks over hele panelet */}
      <path d="M40,930 L320,930 L120,1240 L40,1240Z" fill="#fff" opacity={0.05} />
      <path d="M560,930 L700,930 L600,1240 L560,1240Z" fill="#fff" opacity={0.04} />
      {/* ambient-LED-linje */}
      <path d={`M${X0},1286 Q540,1250 ${X1},1286`} stroke={amb} strokeWidth={5} fill="none" opacity={0.85 + bp * 0.15} />
      <path d={`M${X0},1286 Q540,1250 ${X1},1286`} stroke={amb} strokeWidth={34} fill="none" opacity={0.18} filter="url(#fBlur14)" />
      {/* turbine-dyser */}
      {[-300, 120, 400, 680, 960, 1380].map((x, i) => (
        <Vent key={i} cx={x} cy={1360} r={62} t={t + i} />
      ))}
      {/* trælist */}
      <path d={`M${X0},1450 Q540,1420 ${X1},1450 L${X1},1500 Q540,1470 ${X0},1500Z`} fill="url(#ciWood)" />
      <path d={`M${X0},1450 Q540,1420 ${X1},1450`} stroke="url(#gChrome)" strokeWidth={3} fill="none" />
      {/* midterkonsol */}
      <path d="M700,1520 L1080,1500 L1140,1920 L760,1920Z" fill="#0b0c10" />
      <rect x={780} y={1560} width={240} height={110} rx={20} fill="#14151c" stroke="url(#gChrome)" strokeWidth={3} />
      <circle cx={840} cy={1615} r={34} fill="#1c1d24" stroke="url(#gChrome)" strokeWidth={3} />
      <text x={840} y={1612} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={11} fill="#ff6a5a">ENGINE</text>
      <text x={840} y={1626} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={9} fill="#c9ccd6">START STOP</text>
      <rect x={900} y={1590} width={100} height={50} rx={10} fill="#0a0b10" stroke="#2a2c36" strokeWidth={2} />
      {[0, 1].map((i) => (
        <ellipse key={i} cx={830 + i * 130} cy={1760} rx={54} ry={30} fill="#05060a" stroke="#2a2c36" strokeWidth={3} />
      ))}
      <path d={`M700,1520 L1080,1500`} stroke={amb} strokeWidth={3} opacity={0.6} />
      {/* ---------- rat ---------- */}
      <g transform="translate(290,1640)">
        <circle r={410} fill="none" stroke="#000" strokeWidth={100} opacity={0.35} filter="url(#fBlur14)" />
        {/* fladbundet rat-krans */}
        <path d="M-380,120 A400,400 0 1 1 380,120 L300,300 L-300,300Z" fill="none" stroke="url(#ciWheel)" strokeWidth={74} strokeLinejoin="round" />
        <path d="M-380,120 A400,400 0 1 1 380,120" fill="none" stroke="#6a6c78" strokeWidth={3} opacity={0.45} transform="translate(0,-30) scale(0.98)" />
        {/* perforeret læder ved greb */}
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (-150 + i * 3) * (Math.PI / 180);
          return <circle key={i} cx={Math.cos(a) * 400} cy={Math.sin(a) * 400} r={3} fill="#05060a" opacity={0.7} />;
        })}
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (-30 - i * 3) * (Math.PI / 180);
          return <circle key={`r${i}`} cx={Math.cos(a) * 400} cy={Math.sin(a) * 400} r={3} fill="#05060a" opacity={0.7} />;
        })}
        {/* eger */}
        <path d="M-370,0 Q-200,-40 -110,-30 L-110,60 Q-220,70 -360,90Z" fill="#121318" />
        <path d="M370,0 Q200,-40 110,-30 L110,60 Q220,70 360,90Z" fill="#121318" />
        <path d="M-60,100 L60,100 L90,300 L-90,300Z" fill="#121318" />
        <path d="M-370,4 Q-200,-36 -110,-26" stroke="url(#gChrome)" strokeWidth={4} fill="none" />
        <path d="M370,4 Q200,-36 110,-26" stroke="url(#gChrome)" strokeWidth={4} fill="none" />
        {/* touch-knapper */}
        {[[-260, 20], [-200, 20], [-230, 56]].map(([x, y], i) => (
          <rect key={i} x={x - 22} y={y - 16} width={44} height={32} rx={10} fill="#1a1c24" stroke="#3de0ff" strokeWidth={1.6} opacity={0.85} />
        ))}
        {[[200, 20], [260, 20], [230, 56]].map(([x, y], i) => (
          <rect key={`b${i}`} x={x - 22} y={y - 16} width={44} height={32} rx={10} fill="#1a1c24" stroke="#3de0ff" strokeWidth={1.6} opacity={0.85} />
        ))}
        {/* nav med neutral emblem-ring */}
        <path d="M-130,-60 Q0,-110 130,-60 L150,120 Q0,170 -150,120Z" fill="#16171d" stroke="#2a2c36" strokeWidth={4} />
        <circle cy={20} r={52} fill="#0c0d12" stroke="url(#gChrome)" strokeWidth={6} />
        <circle cy={20} r={36} fill="none" stroke="#3a3c46" strokeWidth={2} />
        {/* paddle-shifters bag ratet */}
        <path d="M-420,-60 L-470,-40 L-460,10 L-410,0Z" fill="url(#gChrome)" opacity={0.8} />
        <path d="M420,-60 L470,-40 L460,10 L410,0Z" fill="url(#gChrome)" opacity={0.8} />
      </g>
      {/* lys fra skærmene ud i kabinen */}
      <ellipse cx={540} cy={1100} rx={760} ry={300} fill="url(#rBlue)" opacity={0.3 + full * 0.1} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={290} cy={1100} rx={420} ry={220} fill="url(#rRed)" opacity={full * 0.35} style={{ mixBlendMode: "screen" }} />
      <rect x={X0} y={-600} width={X1 - X0} height={3000} fill="url(#ciVig)" />
    </g>
  );
};
