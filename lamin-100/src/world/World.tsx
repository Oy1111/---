import React from "react";
import { random } from "remotion";
import { Building, BuildingSpec, GROUND, topOf } from "./Building";
import { StreetLamp, Bike, Car, Bin } from "./Props";
import { Figure } from "./Figure";
import { ClubPOV } from "./Club";
import { beatPulse, clamp, easeOut, lerp, smooth } from "../lib";
import { wordTimes } from "../data/timing";

export const BUILDINGS: BuildingSpec[] = [
  { id: "A", x: -400, w: 1200, floors: 6, style: "stucco", color: "#c9a46a", bays: 4, roof: "mansard", lit: 0.55, shop: { name: "Kiosk · Tobak", kind: "kiosk" }, balconies: "french", entrance: 3 },
  { id: "B", x: 800, w: 900, floors: 5, style: "brick", color: "#8a4a32", bays: 4, roof: "flat", lit: 0.5, shop: { name: "Pizzeria Napoli", kind: "pizza" }, balconies: "deep", entrance: 0 },
  { id: "C", x: 1700, w: 1000, floors: 6, style: "stucco", color: "#8e9aa6", bays: 4, roof: "mansard", lit: 0.45, shop: { name: "", kind: "club" }, balconies: "french" },
  { id: "D", x: 2700, w: 900, floors: 6, style: "stucco", color: "#b86f52", bays: 3, roof: "tiles", lit: 0.5, shop: { name: "Bageri", kind: "bakery" }, balconies: "french", skip: [[4, 1], [3, 1]], entrance: 2 },
  { id: "E", x: 3600, w: 1100, floors: 5, style: "stucco", color: "#d8c7a0", bays: 4, roof: "mansard", lit: 0.6, shop: { name: "", kind: "none" }, balconies: "french" },
  { id: "F", x: 5000, w: 1100, floors: 7, style: "brick", color: "#5a3428", bays: 4, roof: "flat", lit: 0.5, shop: { name: "Café Lune", kind: "cafe" }, balconies: "deep", entrance: 3 },
  { id: "G", x: 6100, w: 1000, floors: 6, style: "stucco", color: "#9fae96", bays: 4, roof: "mansard", lit: 0.55, shop: { name: "Atelier", kind: "boutique" }, balconies: "french", entrance: 0 },
];
export const LAMPS = [450, 1640, 2960, 4150, 4860, 5900, 6950];
const f0 = (line: number, w: string, i = 0) => wordTimes(line, w)[i];
const ap = (t: number, a: number | undefined, d = 0.3) => (a === undefined ? 0 : easeOut((t - a) / d));

/* ---------- himmel, fjern skyline ---------- */
const Sky: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-1500} y={-2600} width={10500} height={5400} fill="url(#gNightSky)" />
    {Array.from({ length: 220 }).map((_, i) => (
      <circle key={i} cx={-1500 + random(`sx${i}`) * 10500} cy={-2600 + random(`sy${i}`) * 3000} r={1.5 + random(`sr${i}`) * 2.5} fill="#e6ecff" opacity={0.25 + 0.5 * Math.abs(Math.sin(t * (0.5 + random(`st${i}`)) + i))} />
    ))}
    <circle cx={6700} cy={-820} r={700} fill="url(#rMoon)" />
    <circle cx={6700} cy={-820} r={120} fill="#f5f1e4" />
    <circle cx={6660} cy={-850} r={22} fill="#dcd6c6" opacity={0.7} />
    <circle cx={6740} cy={-780} r={16} fill="#dcd6c6" opacity={0.6} />
    <circle cx={6720} cy={-870} r={9} fill="#dcd6c6" opacity={0.6} />
    {/* fjern by i dis */}
    {Array.from({ length: 60 }).map((_, i) => {
      const x = -1500 + i * 180 + random(`fx${i}`) * 60;
      const h = 500 + random(`fh${i}`) * 900;
      return (
        <g key={i}>
          <rect x={x} y={GROUND - 200 - h} width={170} height={h + 200} fill="#141a33" />
          {Array.from({ length: 10 }).map((__, j) => (random(`fw${i}${j}`) < 0.35 ? <rect key={j} x={x + 20 + (j % 4) * 36} y={GROUND - 160 - h + Math.floor(j / 4) * 60 + 40} width={14} height={20} fill="#ffcf86" opacity={0.5} /> : null))}
        </g>
      );
    })}
    {/* kirkespir i tværgaden */}
    <path d="M4840,2300 L4840,500 L4870,200 L4900,-200 L4930,200 L4960,500 L4960,2300Z" fill="#1a2040" />
    <circle cx={4900} cy={700} r={34} fill="#ffcf86" opacity={0.6} />
    <rect x={-1500} y={600} width={10500} height={1900} fill="#3a3060" opacity={0.25} />
  </g>
);

/* ---------- gade ---------- */
const Street: React.FC = () => (
  <g>
    <rect x={-1500} y={GROUND} width={10500} height={170} fill="url(#pSlab)" />
    <rect x={-1500} y={GROUND} width={10500} height={170} fill="#0a0812" opacity={0.45} />
    <rect x={-1500} y={GROUND + 160} width={10500} height={22} fill="#6a6670" />
    <rect x={-1500} y={GROUND + 182} width={10500} height={12} fill="#000" opacity={0.6} />
    <rect x={-1500} y={GROUND + 194} width={10500} height={400} fill="url(#pAsphalt)" />
    <rect x={-1500} y={GROUND + 194} width={10500} height={400} fill="#0a0c18" opacity={0.35} />
    {Array.from({ length: 50 }).map((_, i) => (
      <rect key={i} x={-1500 + i * 220} y={GROUND + 390} width={120} height={10} fill="#d8d4c8" opacity={0.6} />
    ))}
    {/* vådt: refleksioner af butikslys og lygter */}
    <g filter="url(#fBlur14)" opacity={0.55}>
      {[-150, 300, 1100, 1900, 2300, 3100, 3800, 4150, 5300, 5550, 6450].map((x, i) => (
        <rect key={i} x={x} y={GROUND + 200} width={90 + (i % 3) * 40} height={340} fill="#ffb867" opacity={0.35} />
      ))}
    </g>
    <rect x={-1500} y={GROUND + 594} width={10500} height={600} fill="#06050a" />
    <rect x={-1500} y={GROUND + 594} width={10500} height={14} fill="#2a2830" />
  </g>
);

/* ---------- bygning B: altan med en der ryger ---------- */
const BAL = { x: 1137, y: 1874 };
const Smoker: React.FC<{ t: number }> = ({ t }) => {
  const juu = f0(0, "juuen") ?? 5.05;
  const helt = f0(0, "helt") ?? 5.8;
  const magisk = f0(0, "magisk") ?? 6;
  const inhale = clamp((t - (juu - 0.25)) / 0.5) * (1 - clamp((t - helt) / 0.3));
  const k = t > juu - 0.4 && t < helt + 0.2 ? 0 : 0.0;
  const ember = 0.35 + inhale * 0.65 + Math.sin(t * 9) * 0.05;
  const hand = { x: BAL.x + 22, y: BAL.y - 186 };
  return (
    <g>
      {/* lys fra altandøren bag ham */}
      <rect x={BAL.x - 70} y={BAL.y - 250} width={140} height={250} fill="url(#gWinLit)" />
      <rect x={BAL.x - 70} y={BAL.y - 250} width={140} height={250} fill="none" stroke="#3a2a1e" strokeWidth={8} />
      <rect x={BAL.x - 3} y={BAL.y - 250} width={6} height={250} fill="#3a2a1e" />
      <ellipse cx={BAL.x} cy={BAL.y - 120} rx={240} ry={200} fill="url(#rWarm)" opacity={0.7} />
      <Figure id="smoker" x={BAL.x + 20} y={BAL.y} s={1} pose="smoke" t={t} k={k} flip rim="#ffb45a" side={-1} />
      {/* joint: glød */}
      <g transform={`translate(${hand.x - 10},${hand.y + 4})`}>
        <rect x={-34} y={-3} width={34} height={6} fill="#efe6d2" transform="rotate(-12)" />
        <circle cx={-36} cy={6} r={5 + inhale * 3} fill="#ff7a1a" />
        <circle cx={-36} cy={6} r={40 + inhale * 50} fill="url(#rEmber)" opacity={ember} />
      </g>
      {/* gelænder foran ham */}
      <rect x={BAL.x - 132} y={BAL.y - 114} width={265} height={8} fill="#1a1d26" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={BAL.x - 132 + i * 33} y={BAL.y - 110} width={4} height={110} fill="#1a1d26" />
      ))}
      <rect x={BAL.x - 132} y={BAL.y - 110} width={265} height={110} fill="#2a3448" opacity={0.3} />
      <Smoke t={t} sx={hand.x - 46} sy={hand.y} juu={juu} helt={helt} magisk={magisk} />
    </g>
  );
};

/** røg: tynde striber fra jointen, stort pust på "helt", guld-gnister på "magisk", fløjter mod klubben på "hokus" */
const Smoke: React.FC<{ t: number; sx: number; sy: number; juu: number; helt: number; magisk: number }> = ({ t, sx, sy, helt, magisk }) => {
  const hokus = f0(0, "hokus") ?? 6.3;
  const pokus = f0(0, "pokus") ?? 6.8;
  const els: React.ReactNode[] = [];
  // tynd røgstribe
  for (let i = 0; i < 14; i++) {
    const age = (t * 0.7 + i / 14) % 1;
    els.push(<circle key={`w${i}`} cx={sx + Math.sin(age * 6 + i) * 18 * age + age * 30} cy={sy - age * 260} r={8 + age * 30} fill="url(#rSmoke)" opacity={(1 - age) * 0.8} />);
  }
  // udpust
  if (t > helt - 0.1) {
    const d = t - (helt - 0.1);
    const gold = clamp((t - magisk) / 0.3);
    const fly = clamp((t - hokus) / (pokus - hokus + 0.05));
    for (let i = 0; i < 26; i++) {
      const a = random(`pa${i}`) * Math.PI * 2;
      const rr = random(`pr${i}`);
      // fra munden ud i en sky, derefter mod klubskiltet (2200, 2230)
      const cx0 = sx + 40 + Math.cos(a) * rr * 120 * Math.min(1, d * 1.5) + d * 40;
      const cy0 = sy - 40 + Math.sin(a) * rr * 80 * Math.min(1, d * 1.5) - d * 30;
      const tx = 2200 + Math.cos(a) * rr * 260;
      const ty = 2240 + Math.sin(a) * rr * 60;
      const e = smooth(fly);
      const arc = Math.sin(e * Math.PI) * -260;
      const cx = lerp(cx0, tx, e);
      const cy = lerp(cy0, ty, e) + arc;
      const op = (1 - clamp((t - pokus - 0.2) / 0.5)) * 0.9;
      els.push(<circle key={`p${i}`} cx={cx} cy={cy} r={40 + rr * 50 + d * 20} fill="url(#rSmoke)" opacity={op} />);
      if (gold > 0) {
        const s = (4 + random(`ps${i}`) * 8) * gold * (0.6 + 0.4 * Math.abs(Math.sin(t * 7 + i)));
        els.push(
          <g key={`g${i}`} transform={`translate(${cx + Math.cos(i) * 30},${cy + Math.sin(i) * 30}) rotate(${t * 120 + i * 30})`} opacity={op}>
            <path d={`M0,${-s * 2} L${s * 0.35},${-s * 0.35} L${s * 2},0 L${s * 0.35},${s * 0.35} L0,${s * 2} L${-s * 0.35},${s * 0.35} L${-s * 2},0 L${-s * 0.35},${-s * 0.35}Z`} fill="#ffe6a3" />
            <circle r={s * 3} fill="url(#rHot)" opacity={0.6} />
          </g>,
        );
      }
    }
  }
  return <g>{els}</g>;
};

/* ---------- klubben (C): neon, dørmand, kø, døren ---------- */
export const DOOR = { x: 2125, y: 2333, w: 150, h: 267 };
const Club: React.FC<{ t: number }> = ({ t }) => {
  const hokus = f0(0, "hokus") ?? 6.3;
  const pokus = f0(0, "pokus") ?? 6.8;
  const on1 = t > hokus ? (t - hokus < 0.15 ? (Math.floor(t * 40) % 2) : 1) : 0;
  const on2 = t > pokus ? (t - pokus < 0.15 ? (Math.floor(t * 40) % 2) : 1) : 0;
  const open = smooth((t - 6.95) / 0.4);
  const inside = t > 6.9 && t < 11.7;
  const jeg = f0(1, "jeg") ?? 7.2;
  const fokus = f0(1, "fokus") ?? 8.6;
  const tid = f0(2, "tid") ?? 9.7;
  const bonus = f0(2, "bonus") ?? 10.5;
  const bp = beatPulse(t);
  return (
    <g>
      {/* neon-skilt */}
      <rect x={1760} y={2215} width={880} height={110} rx={10} fill="#07060b" />
      <g filter="url(#fNeon)">
        <text x={2010} y={2300} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={92} fill="none" stroke={on1 ? "#ff7ad8" : "#3a2034"} strokeWidth={5}>Hokus</text>
        <text x={2400} y={2300} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={92} fill="none" stroke={on2 ? "#7ae8ff" : "#1e3038"} strokeWidth={5}>Pokus</text>
      </g>
      {on1 > 0 && <ellipse cx={2010} cy={2270} rx={300} ry={140} fill="url(#rMagenta)" opacity={0.35 + bp * 0.15} style={{ mixBlendMode: "screen" }} />}
      {on2 > 0 && <ellipse cx={2400} cy={2270} rx={300} ry={140} fill="url(#rCyan)" opacity={0.35 + bp * 0.15} style={{ mixBlendMode: "screen" }} />}
      {/* døråbning med indhold */}
      <rect x={DOOR.x - 14} y={DOOR.y - 14} width={DOOR.w + 28} height={DOOR.h + 14} fill="#1a1620" />
      <clipPath id="doorClip"><rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} /></clipPath>
      <g clipPath="url(#doorClip)">
        {inside ? (
          <g transform={`translate(${DOOR.x},${DOOR.y}) scale(${DOOR.h / 1920})`}>
            <ClubPOV t={t} fokus={fokus} tid={tid} bonus={bonus} jeg={jeg} />
          </g>
        ) : (
          <g>
            <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="#2a0c3a" />
            <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill={Math.floor(t * 4) % 2 ? "#ff3dc8" : "#3de0ff"} opacity={0.25 + bp * 0.3} />
          </g>
        )}
        {/* dørblad svinger op */}
        <rect x={DOOR.x} y={DOOR.y} width={DOOR.w * (1 - open)} height={DOOR.h} fill="#120d14" />
        <circle cx={DOOR.x + DOOR.w * (1 - open) - 16} cy={DOOR.y + 140} r={5} fill="#d8b46a" opacity={1 - open} />
      </g>
      <ellipse cx={DOOR.x + DOOR.w / 2} cy={GROUND + 20} rx={260} ry={40} fill={Math.floor(t * 4) % 2 ? "url(#rMagenta)" : "url(#rCyan)"} opacity={0.35} />
      {/* rebsøjler + kø + dørmand (anonyme) */}
      {[1900, 2020].map((x) => (
        <g key={x}>
          <rect x={x - 6} y={GROUND + 10} width={12} height={90} fill="url(#gChrome)" />
          <circle cx={x} cy={GROUND + 8} r={10} fill="url(#gGold)" />
        </g>
      ))}
      <path d={`M1900,${GROUND + 22} Q1960,${GROUND + 60} 2020,${GROUND + 22}`} stroke="#8a1020" strokeWidth={8} fill="none" />
      <Figure id="bouncer" x={2360} y={GROUND + 70} s={1.12} pose="lean" t={t} rim="#7ae8ff" side={1} />
      <Figure id="q1" x={1800} y={GROUND + 60} s={1} pose="phone" t={t} rim="#ff7ad8" side={1} />
      <Figure id="q2" x={1690} y={GROUND + 64} s={0.98} pose="talk" t={t} rim="#ffb45a" side={-1} flip />
    </g>
  );
};

/* ---------- D: facadeur ---------- */
const CLOCK = { x: 3150, y: 875 };
const Clock: React.FC<{ t: number }> = ({ t }) => {
  const ig = f0(3, "igen") ?? 12.3;
  const tk = f0(3, "tænk") ?? 13.3;
  const base = 23 * 60 + 57 + t / 60; // minutter
  const back = t > ig ? -Math.min(t, tk) + ig : 0;
  const mins = base + back * 220;
  const ma = (mins % 60) * 6;
  const ha = ((mins / 60) % 12) * 30;
  const spinning = t > ig && t < tk;
  return (
    <g transform={`translate(${CLOCK.x},${CLOCK.y})`}>
      <circle r={300} fill="url(#rWarm)" opacity={0.55 + beatPulse(t) * 0.15} />
      <circle r={165} fill="#3a2a18" />
      <circle r={152} fill="url(#gGold)" />
      <circle r={136} fill="#1c140c" />
      <circle r={128} fill="#f4ead0" />
      <circle r={128} fill="url(#rHot)" opacity={0.35} />
      {Array.from({ length: 60 }).map((_, i) => (
        <rect key={i} x={-1.5} y={-124} width={3} height={i % 5 ? 8 : 16} fill="#2a1d10" transform={`rotate(${i * 6})`} />
      ))}
      {["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"].map((n, i) => (
        <text key={n} x={Math.sin((i * Math.PI) / 6) * 92} y={-Math.cos((i * Math.PI) / 6) * 92 + 10} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={28} fill="#2a1d10">{n}</text>
      ))}
      <path d="M-6,10 L0,-72 L6,10Z" fill="#120c06" transform={`rotate(${ha})`} />
      <path d="M-4,14 L0,-112 L4,14Z" fill="#120c06" transform={`rotate(${ma})`} />
      <circle r={9} fill="url(#gGold)" />
      {spinning && (
        <g opacity={0.9} transform={`rotate(${-t * 400})`}>
          <path d="M-210,0 A210,210 0 0 1 0,-210" fill="none" stroke="#ffc861" strokeWidth={10} strokeLinecap="round" />
          <path d="M-222,-8 L-210,40 L-182,0Z" fill="#ffc861" />
        </g>
      )}
      {/* konsol og lampe */}
      <rect x={-40} y={165} width={80} height={40} fill="#3a2a18" />
    </g>
  );
};

/* ---------- E: rejsebureau med globus, kort og billet-plakat ---------- */
const Globe: React.FC<{ cx: number; cy: number; r: number; spin: number }> = ({ cx, cy, r, spin }) => (
  <g transform={`translate(${cx},${cy})`}>
    <clipPath id="globeC"><circle r={r} /></clipPath>
    <path d={`M${-r * 0.5},${r * 1.55} L${r * 0.5},${r * 1.55} L${r * 0.2},${r * 1.2} L${-r * 0.2},${r * 1.2}Z`} fill="#5a3a1c" />
    <rect x={-r * 0.06} y={r * 0.95} width={r * 0.12} height={r * 0.3} fill="#6b4520" />
    <path d={`M${-r * 1.12},0 A${r * 1.12},${r * 1.12} 0 0 0 0,${r * 1.12}`} fill="none" stroke="url(#gGold)" strokeWidth={r * 0.07} transform="rotate(-23)" />
    <g transform="rotate(-23)">
      <circle r={r} fill="#2a6e9a" />
      <g clipPath="url(#globeC)">
        {[0, 1].map((rep) => (
          <g key={rep} transform={`translate(${((((-spin * r * 1.3) % (r * 4)) + r * 4) % (r * 4)) - r * 4 + rep * r * 4},0) scale(${r / 300})`}>
            <path d="M-500,-180 q60,-60 140,-20 q40,60 -20,110 q-30,90 -100,60 q-50,-60 -20,-150Z" fill="#c9b27a" />
            <path d="M-160,-220 q80,-40 160,0 q30,40 -10,80 q40,60 10,150 q-60,100 -100,10 q-40,-80 -60,-240Z" fill="#9cb06a" />
            <path d="M120,-200 q140,-40 260,10 q60,60 -40,100 q-120,20 -160,-40 q-60,-30 -60,-70Z" fill="#c9b27a" />
            <path d="M300,80 q80,-10 120,40 q-20,80 -110,60 q-40,-50 -10,-100Z" fill="#9cb06a" />
            <path d="M-420,60 q40,-20 80,20 q30,120 -40,200 q-60,-80 -40,-220Z" fill="#9cb06a" />
            <path d="M700,-180 q60,-60 140,-20 q40,60 -20,110 q-30,90 -100,60 q-50,-60 -20,-150Z" fill="#c9b27a" />
          </g>
        ))}
        <circle cx={-r * 0.3} cy={-r * 0.35} r={r * 0.85} fill="#fff" opacity={0.14} />
        <circle r={r} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={r * 0.25} />
      </g>
    </g>
  </g>
);

const Travel: React.FC<{ t: number }> = ({ t }) => {
  const dr = f0(4, "drej") ?? 13.8;
  const spin = t > dr ? (t - dr) * 3.2 + (t - dr) ** 2 * 1.2 : t * 0.1;
  const tr = f0(12, "tur-retur") ?? 38.9;
  const stamp = ap(t, tr, 0.15);
  const dam = f0(14, "dam") ?? 46.5;
  const barca = f0(14, "barca") ?? 47.05;
  const boer = f0(14, "boer") ?? 47.8;
  const route = clamp((t - dam) / Math.max(0.3, barca - dam));
  const gy = 2200;
  const A = [4230, 2330], B = [4105, 2500], C = [4060, 2400];
  const pt = (u: number) => [(1 - u) ** 2 * A[0] + 2 * (1 - u) * u * C[0] + u * u * B[0], (1 - u) ** 2 * A[1] + 2 * (1 - u) * u * C[1] + u * u * B[1]];
  const [px, py] = pt(route);
  return (
    <g>
      {/* facade-stueetage */}
      <rect x={3600} y={gy} width={1100} height={400} fill="#3a3024" />
      <rect x={3620} y={gy + 18} width={1060} height={70} fill="#0d1a2e" />
      <text x={4150} y={gy + 70} textAnchor="middle" fontFamily="Anton" fontSize={50} fill="#f2dca6" letterSpacing={10}>VERDEN RUNDT · REJSER</text>
      {[3700, 4150, 4600].map((x) => (
        <g key={x}>
          <path d={`M${x - 10},${gy + 2} L${x + 10},${gy + 2} L${x + 30},${gy - 30} L${x - 30},${gy - 30}Z`} fill="#1a1d26" />
          <polygon points={`${x - 8},${gy + 2} ${x + 8},${gy + 2} ${x + 80},${gy + 110} ${x - 80},${gy + 110}`} fill="#fff2c4" opacity={0.18} />
        </g>
      ))}
      {/* vindue 1: globus */}
      <rect x={3630} y={gy + 100} width={340} height={270} fill="#1a1410" />
      <rect x={3640} y={gy + 110} width={320} height={250} fill="url(#gShop)" opacity={0.6} />
      <rect x={3660} y={gy + 130} width={90} height={120} fill="#e8d6a0" />
      <text x={3705} y={gy + 180} textAnchor="middle" fontFamily="Anton" fontSize={22} fill="#c23a2a">SOL</text>
      <circle cx={3705} cy={gy + 215} r={18} fill="#ffb347" />
      <rect x={3860} y={gy + 130} width={80} height={110} fill="#2a5a8a" />
      <text x={3900} y={gy + 190} textAnchor="middle" fontFamily="Anton" fontSize={18} fill="#fff">ROM</text>
      <Globe cx={3800} cy={gy + 225} r={74} spin={spin} />
      <circle cx={3800} cy={gy + 225} r={180} fill="url(#rWarm)" opacity={0.3} />
      {/* vindue 2: Europa-kort */}
      <rect x={3990} y={gy + 100} width={340} height={270} fill="#1a1410" />
      <rect x={4000} y={gy + 110} width={320} height={250} fill="#d9cba6" />
      <path d="M4040,2330 Q4100,2300 4200,2312 Q4260,2330 4290,2360 Q4300,2400 4260,2420 Q4220,2440 4240,2480 Q4200,2520 4150,2520 Q4100,2550 4080,2530 Q4040,2510 4050,2470 Q4020,2440 4045,2410 Q4020,2380 4040,2330Z" fill="#b8c49a" stroke="#7a8a6a" strokeWidth={2} />
      {[[4185, 2378, "PARIS"], [4265, 2345, "BERLIN"], [4080, 2492, "MADRID"], [4240, 2440, "MILANO"]].map(([x, y, n]) => (
        <g key={n as string}><circle cx={x as number} cy={y as number} r={3} fill="#5a4a3a" /><text x={(x as number) + 6} y={(y as number) + 4} fontFamily="SpaceMonoB" fontSize={9} fill="#5a4a3a">{n}</text></g>
      ))}
      <path d={`M${A[0]},${A[1]} Q${C[0]},${C[1]} ${B[0]},${B[1]}`} fill="none" stroke="#c21d2a" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${route} 1`} />
      <g opacity={ap(t, dam, 0.2)}><circle cx={A[0]} cy={A[1]} r={7} fill="#c21d2a" /><circle cx={A[0]} cy={A[1]} r={30} fill="url(#rRed)" opacity={0.6} /><text x={A[0] + 10} y={A[1] - 8} fontFamily="Anton" fontSize={16} fill="#1a1410">AMSTERDAM</text></g>
      <g opacity={ap(t, barca, 0.2)}><circle cx={B[0]} cy={B[1]} r={7} fill="#c21d2a" /><circle cx={B[0]} cy={B[1]} r={30} fill="url(#rRed)" opacity={0.6} /><text x={B[0] + 10} y={B[1] + 18} fontFamily="Anton" fontSize={16} fill="#1a1410">BARCELONA</text></g>
      {route > 0 && route < 1 && (
        <g transform={`translate(${px},${py}) rotate(${(Math.atan2(pt(Math.min(1, route + 0.02))[1] - py, pt(Math.min(1, route + 0.02))[0] - px) * 180) / Math.PI}) scale(0.35)`}>
          <path d="M40,0 L-20,-8 L-34,-44 L-46,-44 L-38,-8 L-60,-6 L-70,-20 L-78,-20 L-72,0 L-78,20 L-70,20 L-60,6 L-38,8 L-46,44 L-34,44 L-20,8Z" fill="#1a1410" />
        </g>
      )}
      {t > boer && (
        <g transform={`translate(${B[0] + 40},${B[1] - 20 - Math.abs(Math.sin((t - boer) * 7)) * 40 * Math.exp(-(t - boer) * 1.5)}) rotate(${(t - boer) * 300})`}>
          <circle r={14} fill="#f4f1ea" stroke="#111" strokeWidth={1.5} />
          <path d="M0,-5 L5,-2 L3,4 L-3,4 L-5,-2Z" fill="#111" />
        </g>
      )}
      <rect x={4230} y={2470} width={80} height={60} fill="#fff" />
      <text x={4270} y={2495} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={12} fill="#c21d2a">FRA</text>
      <text x={4270} y={2520} textAnchor="middle" fontFamily="Anton" fontSize={20} fill="#c21d2a">999,-</text>
      {/* dør */}
      <rect x={4365} y={2290} width={160} height={310} fill="#1a1410" />
      <rect x={4378} y={2302} width={134} height={290} fill="url(#gShop)" opacity={0.5} />
      <rect x={4400} y={2380} width={90} height={40} fill="#fff" />
      <text x={4445} y={2408} textAnchor="middle" fontFamily="Anton" fontSize={24} fill="#2a7a3a">ÅBEN</text>
      <rect x={4492} y={2440} width={8} height={60} fill="url(#gChrome)" />
      {/* vindue 3: billet-plakat */}
      <rect x={4545} y={gy + 100} width={140} height={270} fill="#1a1410" />
      <rect x={4555} y={gy + 110} width={120} height={250} fill="#0d1a2e" />
      <g transform={`translate(4615,${gy + 235}) rotate(-90)`}>
        <rect x={-110} y={-48} width={220} height={96} rx={6} fill="#f3ead6" />
        <text x={-96} y={-20} fontFamily="SpaceMonoB" fontSize={11} fill="#7a6a50">BILLET · NAT</text>
        <text x={-96} y={14} fontFamily="Anton" fontSize={34} fill="#1c1a24">TUR-RETUR</text>
        <text x={-96} y={36} fontFamily="SpaceMonoB" fontSize={11} fill="#7a6a50">AMS ⇄ BCN</text>
        <g transform={`translate(78,0) rotate(-18) scale(${lerp(2.4, 1, stamp)})`} opacity={stamp}>
          <circle r={26} fill="none" stroke="#c21d2a" strokeWidth={4} />
          <text y={7} textAnchor="middle" fontFamily="Anton" fontSize={18} fill="#c21d2a">OK</text>
        </g>
      </g>
      {stamp > 0 && <circle cx={4615} cy={gy + 235} r={160} fill="url(#rRed)" opacity={0.4 * Math.exp(-(t - tr) * 2)} />}
      <rect x={3600} y={2570} width={1100} height={30} fill="#22222a" />
    </g>
  );
};

/* ---------- grupperne på hjørnet ("med dem og med dem og med dem") ---------- */
const GROUPS = [
  { x: 4690, txt: "YO, BROR!" },
  { x: 4930, txt: "HVA' SÅ?" },
  { x: 5170, txt: "RING TIL MIG" },
];
const Groups: React.FC<{ t: number }> = ({ t }) => {
  const dems = wordTimes(5, "dem");
  const vis = 1 - clamp((t - 17.6) / 0.4);
  if (vis <= 0) return null;
  return (
    <g opacity={vis}>
      {GROUPS.map((g, i) => {
        const on = ap(t, dems[i], 0.2);
        const rim = on > 0 ? "#ffd08a" : "#7a8ab8";
        return (
          <g key={i}>
            <ellipse cx={g.x} cy={GROUND + 60} rx={200} ry={40} fill="url(#rWarm)" opacity={on * 0.7} />
            <Figure id={`g${i}a`} x={g.x - 55} y={GROUND + 60} s={0.95} pose={i === 1 ? "phone" : "talk"} t={t + i} rim={rim} side={-1} />
            <Figure id={`g${i}b`} x={g.x + 55} y={GROUND + 70} s={1.02} pose={i === 2 ? "lean" : "stand"} t={t} rim={rim} side={1} flip />
            {on > 0 && (
              <g transform={`translate(${g.x},${GROUND - 250 - on * 20}) scale(${on})`}>
                <rect x={-110} y={-56} width={220} height={70} rx={30} fill="#f4f1ea" />
                <path d="M-10,14 L10,14 L-6,40Z" fill="#f4f1ea" />
                <text x={0} y={-10} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#141418">{g.txt}</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

/* ---------- café-bord med telefon ---------- */
const PHONE = { x: 5330, y: 2575 };
const CafeTable: React.FC<{ t: number }> = ({ t }) => {
  const det = f0(6, "det") ?? 17.5;
  const ik = f0(6, "ik") ?? 17.85;
  const nu = f0(6, "nu") ?? 18.25;
  const ringing = t > det - 1 && t < ik;
  const decl = ap(t, ik, 0.2);
  const off = ap(t, nu, 0.3);
  const vib = ringing ? Math.sin(t * 80) * 2 : 0;
  return (
    <g>
      {/* stole og bord */}
      {[5180, 5480].map((x, i) => (
        <g key={x} stroke="#1a1410" strokeWidth={6} fill="none">
          <path d={`M${x},${GROUND + 110} L${x},${GROUND - 10} M${x + (i ? 60 : -60)},${GROUND + 110} L${x + (i ? 60 : -60)},${GROUND - 10} M${x - 40},${GROUND - 10} L${x + 40},${GROUND - 10} M${x + (i ? -30 : 30)},${GROUND - 10} L${x + (i ? -30 : 30)},${GROUND - 140}`} />
          <rect x={x - 46} y={GROUND - 16} width={92} height={10} fill="#3a2414" stroke="none" />
        </g>
      ))}
      <rect x={5326} y={GROUND - 20} width={8} height={130} fill="#1a1410" />
      <ellipse cx={5330} cy={GROUND + 108} rx={50} ry={10} fill="#1a1410" />
      <ellipse cx={5330} cy={GROUND - 22} rx={120} ry={20} fill="#c8bca6" />
      <ellipse cx={5330} cy={GROUND - 26} rx={120} ry={18} fill="#e8dcc6" />
      {/* kop */}
      <path d={`M5400,${GROUND - 62} L5440,${GROUND - 62} L5436,${GROUND - 30} L5404,${GROUND - 30}Z`} fill="#f4f1ea" />
      <path d={`M5440,${GROUND - 56} q14,4 0,18`} stroke="#f4f1ea" strokeWidth={4} fill="none" />
      <path d={`M5414,${GROUND - 70} q-6,-14 4,-26 M5428,${GROUND - 72} q6,-16 -2,-30`} stroke="#ddd" strokeWidth={2} fill="none" opacity={0.5} />
      {/* telefon lænet mod koppen */}
      <g transform={`translate(${PHONE.x + vib},${PHONE.y}) rotate(-8)`}>
        <rect x={-26} y={-54} width={52} height={104} rx={8} fill="#0a0a0d" />
        <rect x={-23} y={-50} width={46} height={96} rx={6} fill={off > 0.5 ? "#05060a" : "#1b2a40"} />
        {off < 0.5 && (
          <g>
            <circle cx={0} cy={-22} r={10} fill="#5a4a7a" />
            <text x={0} y={-2} textAnchor="middle" fontFamily="Anton" fontSize={9} fill="#fff">UKENDT</text>
            <text x={0} y={8} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={5} fill="#aab">ringer...</text>
            <circle cx={-12} cy={30} r={7 + decl * 2} fill="#ff3b30" />
            <circle cx={12} cy={30} r={7} fill="#34c759" opacity={1 - decl} />
            {decl > 0.5 && <text x={0} y={20} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={6} fill="#ff6b62">AFVIST</text>}
          </g>
        )}
        {ringing && [0, 1, 2].map((i) => {
          const a = ((t * 1.6 + i / 3) % 1);
          return <rect key={i} x={-26 - a * 30} y={-54 - a * 30} width={52 + a * 60} height={104 + a * 60} rx={10} fill="none" stroke="#7ae8ff" strokeWidth={2} opacity={1 - a} />;
        })}
        <circle cx={0} cy={0} r={90} fill="url(#rBlue)" opacity={(1 - off) * 0.5} />
      </g>
    </g>
  );
};

/* ---------- F tag: billboard + figur på kanten ---------- */
const BB = { x: 5150, y: -560, w: 860, h: 420 };
const Billboard: React.FC<{ t: number }> = ({ t }) => {
  const om = f0(8, "om") ?? 23.85;
  const hu = f0(8, "hundrede") ?? 26.05;
  const pr = f0(8, "procent") ?? 26.8;
  const p = t < om ? 0 : t < hu ? clamp((t - om) / (hu - om)) * 0.9 : lerp(0.9, 1, ap(t, hu, pr - hu));
  const full = ap(t, pr, 0.2);
  const end = ap(t, 49.9, 0.4);
  const pct = Math.round(p * 100);
  const fTop = topOf(BUILDINGS[5]);
  return (
    <g>
      {/* stålstativ */}
      {[BB.x + 80, BB.x + BB.w / 2, BB.x + BB.w - 80].map((x) => (
        <g key={x}>
          <rect x={x - 8} y={BB.y + BB.h} width={16} height={fTop - 60 - (BB.y + BB.h)} fill="#14161e" />
          <path d={`M${x - 8},${fTop - 60} L${x - 70},${BB.y + BB.h + 10} M${x + 8},${fTop - 60} L${x + 70},${BB.y + BB.h + 10}`} stroke="#14161e" strokeWidth={6} />
        </g>
      ))}
      <rect x={BB.x - 20} y={BB.y - 20} width={BB.w + 40} height={BB.h + 40} fill="#0d0e14" />
      <rect x={BB.x} y={BB.y} width={BB.w} height={BB.h} fill="#07080c" />
      {end < 1 && (
        <g opacity={1 - end}>
          <text x={BB.x + BB.w / 2} y={BB.y + 270} textAnchor="middle" fontFamily="Anton" fontSize={250} fill={full > 0 ? "url(#gGold)" : "#ffefc8"} opacity={0.25 + p * 0.6 + full * 0.15} filter="url(#fNeon)">{pct}%</text>
          <rect x={BB.x + 60} y={BB.y + 320} width={BB.w - 120} height={44} rx={22} fill="#1d1a24" />
          <rect x={BB.x + 66} y={BB.y + 326} width={(BB.w - 132) * p} height={32} rx={16} fill="url(#gGold)" />
        </g>
      )}
      {end > 0 && (
        <g opacity={end} filter="url(#fNeon)">
          <text x={BB.x + BB.w / 2} y={BB.y + 230} textAnchor="middle" fontFamily="Anton" fontSize={200} fill="#f4f1ea" letterSpacing={50}>LAMIN</text>
          <text x={BB.x + BB.w / 2} y={BB.y + 370} textAnchor="middle" fontFamily="Anton" fontSize={120} fill="#ff9a3c" letterSpacing={20}>100%</text>
        </g>
      )}
      <ellipse cx={BB.x + BB.w / 2} cy={BB.y + BB.h / 2} rx={BB.w * 0.8} ry={BB.h * 0.9} fill="url(#rWarm)" opacity={0.25 + full * 0.35 + end * 0.3} style={{ mixBlendMode: "screen" }} />
      {/* lamper på armene */}
      {[0.2, 0.5, 0.8].map((k) => (
        <g key={k}>
          <path d={`M${BB.x + BB.w * k},${BB.y + BB.h + 20} L${BB.x + BB.w * k},${BB.y + BB.h + 70}`} stroke="#14161e" strokeWidth={6} />
          <rect x={BB.x + BB.w * k - 20} y={BB.y + BB.h + 60} width={40} height={20} fill="#fff2c4" />
        </g>
      ))}
    </g>
  );
};

const RoofSitter: React.FC<{ t: number }> = ({ t }) => {
  const fo = f0(9, "føles") ?? 30.6;
  const glow = ap(t, fo, 0.4);
  const fTop = topOf(BUILDINGS[5]);
  const hb = Math.max(0, Math.sin(t * Math.PI * (129.2 / 60))) ** 6;
  return (
    <g>
      <circle cx={6070} cy={fTop - 180} r={140 + hb * 40} fill="url(#rRed)" opacity={glow * (0.4 + hb * 0.4)} style={{ mixBlendMode: "screen" }} />
      <Figure id="sitter" x={6040} y={fTop - 64} s={0.95} pose="sit" t={t} rim="#9cc4ff" side={1} />
      <circle cx={6080} cy={fTop - 210} r={50} fill="url(#rBlue)" opacity={0.5} />
    </g>
  );
};

/* ---------- G: parkeret bil med speedometer ---------- */
export const GAUGE = { x: 6470, y: 2664 };
const ParkedCar: React.FC<{ t: number }> = ({ t }) => {
  const om = f0(10, "om") ?? 41.3;
  const hu = f0(10, "hundrede") ?? 43.5;
  const pr = f0(10, "procent") ?? 44.25;
  const lt = t + 0; // sang-tid er allerede video-tid
  const p = lt < om ? 0 : lt < hu ? clamp((lt - om) / (hu - om)) * 0.82 : lerp(0.82, 1, ap(lt, hu, pr - hu));
  const full = ap(lt, pr, 0.2);
  return (
    <g>
      <Car x={6600} y={2860} s={1.05} dir={-1} lights={0} />
      {/* interiør set gennem sideruden: instrumentbræt der vender mod os */}
      <g transform={`translate(${GAUGE.x},${GAUGE.y}) scale(0.78)`}>
        <clipPath id="dashClip"><path d="M-110,-48 L110,-48 L120,52 L-120,52Z" /></clipPath>
        <g clipPath="url(#dashClip)">
          <rect x={-130} y={-60} width={260} height={120} fill="#05060c" />
          <circle r={120} fill="url(#rRed)" opacity={0.2 + full * 0.5} />
          <circle r={42} fill="#0a0b12" stroke="#2a2f3c" strokeWidth={3} />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = ((-225 + i * 27) * Math.PI) / 180;
            return (
              <g key={i}>
                <line x1={Math.cos(a) * 32} y1={Math.sin(a) * 32} x2={Math.cos(a) * 39} y2={Math.sin(a) * 39} stroke={i >= 9 ? "#ff3b30" : "#e8e8f0"} strokeWidth={1.6} />
                <text x={Math.cos(a) * 25} y={Math.sin(a) * 25 + 2.5} textAnchor="middle" fontFamily="Anton" fontSize={7} fill={i === 10 ? "#ffc861" : "#ccd"}>{i * 10}</text>
              </g>
            );
          })}
          <path d="M-1.6,0 L0,-38 L1.6,0Z" fill="#ff5a3c" transform={`rotate(${-135 + p * 270 + Math.sin(t * 50) * full * 1.5})`} />
          <circle r={5} fill="#2a2f3c" />
          <text x={0} y={22} textAnchor="middle" fontFamily="Anton" fontSize={11} fill="#ffc861">{Math.round(p * 100)}%</text>
          <circle cx={-80} r={26} fill="#0a0b12" stroke="#2a2f3c" strokeWidth={2} />
          <circle cx={80} r={26} fill="#0a0b12" stroke="#2a2f3c" strokeWidth={2} />
          <path d="M-80,0 L-80,-20" stroke="#3de0ff" strokeWidth={2} transform={`rotate(${-60 + p * 100} -80 0)`} />
          <path d="M80,0 L80,-20" stroke="#3de0ff" strokeWidth={2} transform={`rotate(${-30 + p * 60} 80 0)`} />
          {/* rat i forgrunden */}
          <circle cx={0} cy={70} r={70} fill="none" stroke="#0b0c10" strokeWidth={14} />
        </g>
      </g>
    </g>
  );
};

/* ---------- taxa + figur der får instrukser ---------- */
const Taxi: React.FC<{ t: number }> = ({ t }) => {
  const bror = f0(11, "bror") ?? 35;
  const ins = f0(11, "instrukser") ?? 35.7;
  const tx = f0(11, "taxatur") ?? 37.3;
  if (t < bror - 1.2 || t > 40.5) return null;
  const arrive = easeOut((t - (bror - 1.2)) / 2.0);
  const leave = Math.max(0, t - (tx + 0.35));
  const x = t < tx + 0.35 ? lerp(7600, 5850, arrive) : 5850 - leave * leave * 900 - leave * 300;
  const busy = t > tx;
  const walk = clamp((t - (ins - 0.2)) / 1.4);
  const inCar = t > tx - 0.1;
  return (
    <g>
      {!inCar && (
        <g>
          <Figure id="runner" x={lerp(5560, 5760, walk)} y={GROUND + 120} s={1.05} pose={walk > 0 && walk < 1 ? "walk" : "phone"} t={t} rim="#ffb45a" side={1} />
          {["kl. 02:00", "bagindgangen", "ingen navne", "tur-retur"].map((m, i) => {
            const a = clamp((t - ins) * 3 - i * 0.7);
            if (a <= 0) return null;
            return (
              <g key={i} transform={`translate(${lerp(5560, 5760, walk) + 50},${GROUND - 520 + i * 64})`} opacity={a}>
                <rect x={0} y={0} width={240} height={52} rx={24} fill="#2b2f3d" />
                <text x={20} y={35} fontFamily="SpaceMonoB" fontSize={24} fill="#fff">{m}</text>
              </g>
            );
          })}
        </g>
      )}
      <Car x={x} y={2980} s={1.0} dir={-1} lights={1} taxi={busy ? "busy" : "free"} wheelRot={-x * 0.6} />
    </g>
  );
};

/* ---------- de to venner foran rejsebureauet: dap, poser/kvittering, håndtryk ---------- */
const Friends: React.FC<{ t: number }> = ({ t }) => {
  if (t < 38.0) return null;
  const hb = f0(12, "habibi-bror") ?? 40.8;
  const del = f0(12, "del") ?? 40.6;
  const bru = f0(13, "bruger") ?? 43.35;
  const nah = f0(13, "nah") ?? 43.6;
  const ho = f0(15, "holder") ?? 49.3;
  const fo = f0(15, "forstår") ?? 48;
  const inA = easeOut((t - 38.0) / 1.4);
  const dap = clamp((t - (del + 0.05)) / (hb - del + 0.05));
  const shake = clamp((t - (fo + 0.2)) / (ho - fo - 0.2));
  const phase = t < 42 ? "dap" : t < 47.8 ? "bags" : "shake";
  const xa = lerp(4300, 4470, inA);
  const xb = lerp(4900, 4710, inA);
  const pose = phase === "dap" ? (t > del ? "dap" : "walk") : phase === "bags" ? "bags" : "shake";
  const k = phase === "dap" ? dap : phase === "shake" ? shake : 0;
  // kvittering ruller ud fra A's hånd og blæser væk
  const roll = clamp((t - (bru - 0.9)) / 0.9);
  const blow = Math.max(0, t - nah);
  return (
    <g>
      <Figure id="fa" x={xa} y={GROUND + 90} s={1.05} pose={pose as "dap"} t={t} k={k} rim="#ffb45a" side={-1} />
      <Figure id="fb" x={xb} y={GROUND + 96} s={1.08} pose={pose as "dap"} t={t} k={k} flip rim="#ffcf86" side={1} />
      {phase === "dap" && dap >= 1 && <circle cx={(xa + xb) / 2} cy={GROUND - 70} r={140} fill="url(#rHot)" opacity={Math.exp(-(t - hb) * 3)} />}
      {phase === "shake" && shake >= 1 && <circle cx={(xa + xb) / 2} cy={GROUND - 30} r={200} fill="url(#rHot)" opacity={0.3 + 0.7 * Math.exp(-(t - ho) * 2)} />}
      {phase === "bags" && (
        <g>
          {[[xa - 60, "#e9e2d2"], [xa + 62, "#141418"], [xb - 62, "#c8a25a"], [xb + 60, "#e9e2d2"]].map(([x, c], i) => (
            <g key={i} transform={`translate(${x},${GROUND + 10})`}>
              <path d="M-36,-60 L36,-60 L42,40 L-42,40Z" fill={c as string} />
              <path d="M-16,-60 Q-16,-96 0,-96 Q16,-96 16,-60" fill="none" stroke="#000" strokeWidth={4} opacity={0.6} />
            </g>
          ))}
          {roll > 0 && (
            <g transform={`translate(${xa + 70 - blow * 500},${GROUND - 60 - blow * 900 - blow * blow * 300}) rotate(${blow * 160})`}>
              <rect x={-30} y={0} width={60} height={320 * roll} fill="#f7f3ea" />
              {Array.from({ length: Math.floor(roll * 9) }).map((_, i) => (
                <rect key={i} x={-22} y={14 + i * 34} width={i % 3 === 2 ? 26 : 44} height={6} fill="#6a645a" />
              ))}
            </g>
          )}
        </g>
      )}
    </g>
  );
};

/* ---------- belysning fra lygter på facaderne ---------- */
const LampWash: React.FC = () => (
  <g style={{ mixBlendMode: "screen" }} opacity={0.6}>
    {LAMPS.map((x) => (
      <ellipse key={x} cx={x} cy={GROUND - 520} rx={480} ry={520} fill="url(#rWarm)" />
    ))}
  </g>
);

const inView = (x0: number, x1: number, vx0: number, vx1: number) => x1 > vx0 - 200 && x0 < vx1 + 200;

export const World: React.FC<{ t: number; view: [number, number, number, number] }> = ({ t, view }) => {
  const [vx0, vy0, vx1, vy1] = view;
  const near = (x0: number, x1: number) => inView(x0, x1, vx0, vx1);
  const rooftop = vy0 < 400;
  return (
    <g>
      <Sky t={t} />
      {BUILDINGS.filter((b) => near(b.x - 300, b.x + b.w + 300)).map((b) => (
        <Building key={b.id} b={b} />
      ))}
      <LampWash />
      {rooftop && near(5000, 6800) && <Billboard t={t} />}
      {rooftop && near(5600, 6400) && t > 26 && t < 33 && <RoofSitter t={t} />}
      {near(800, 1600) && t < 9 && <Smoker t={t} />}
      {near(1600, 2700) && <Club t={t} />}
      {near(2800, 3500) && vy0 < 1200 && <Clock t={t} />}
      {near(3600, 4700) && <Travel t={t} />}
      <Street />
      {LAMPS.filter((x) => near(x - 400, x + 400)).map((x) => (
        <StreetLamp key={x} x={x} y={GROUND + 150} />
      ))}
      {near(1300, 1600) && <><Bike x={1380} /><Bike x={1460} c="#2a1d1a" /></>}
      {near(2500, 2800) && <Bin x={2640} />}
      {near(400, 1500) && <Car x={1050} y={2860} s={1.02} dir={1} />}
      {near(4500, 5500) && <Groups t={t} />}
      {near(5000, 5700) && <CafeTable t={t} />}
      {near(6000, 7200) && <ParkedCar t={t} />}
      {near(3500, 7800) && <Taxi t={t} />}
      {near(4000, 5200) && <Friends t={t} />}
      {vy1 > 0 && <rect x={-1500} y={vy0 - 100} width={10500} height={vy1 - vy0 + 200} fill="#2a3060" opacity={0.06} />}
    </g>
  );
};
