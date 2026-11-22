import React from "react";
import { random } from "remotion";
import { W, H } from "../lib";
import { Clock } from "./School";

/** Mønstre og gradienter til de realistiske skole-miljøer */
export const School2Defs: React.FC = () => (
  <defs>
    <pattern id="bricks" width="64" height="32" patternUnits="userSpaceOnUse">
      <rect width="64" height="32" fill="#9e4636" />
      <rect x="1" y="1" width="30" height="14" fill="#a94b3a" />
      <rect x="33" y="1" width="30" height="14" fill="#92402f" />
      <rect x="-15" y="17" width="30" height="14" fill="#8c3d2e" />
      <rect x="17" y="17" width="30" height="14" fill="#a5503d" />
      <rect x="49" y="17" width="30" height="14" fill="#974433" />
    </pattern>
    <pattern id="slate" width="40" height="22" patternUnits="userSpaceOnUse">
      <rect width="40" height="22" fill="#3d4148" />
      <path d="M0,21 L40,21 M20,0 L20,11 M0,11 L40,11 M10,11 L10,22 M30,11 L30,22" stroke="#2a2d33" strokeWidth="2" />
    </pattern>
    <pattern id="planks" width="140" height="40" patternUnits="userSpaceOnUse">
      <rect width="140" height="40" fill="#a8743f" />
      <rect y="0" width="140" height="19" fill="#b07c46" />
      <path d="M0,19.5 L140,19.5 M0,39.5 L140,39.5 M60,0 L60,19 M120,20 L120,40" stroke="#6e4826" strokeWidth="1.5" />
    </pattern>
    <linearGradient id="sunSide" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#ffd59a" stopOpacity="0.35" />
      <stop offset="1" stopColor="#3a1a10" stopOpacity="0.35" />
    </linearGradient>
    <linearGradient id="verdigris" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#4f8f7a" />
      <stop offset="0.6" stopColor="#7cc0a6" />
      <stop offset="1" stopColor="#3f7564" />
    </linearGradient>
    <linearGradient id="glassWin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#cfe6f2" />
      <stop offset="0.45" stopColor="#7fa6bf" />
      <stop offset="0.5" stopColor="#e9f4fa" />
      <stop offset="0.56" stopColor="#7fa6bf" />
      <stop offset="1" stopColor="#4d7088" />
    </linearGradient>
    <linearGradient id="goldenSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5f8fbf" />
      <stop offset="0.5" stopColor="#c9d6df" />
      <stop offset="0.8" stopColor="#f6d3a2" />
      <stop offset="1" stopColor="#f3b37a" />
    </linearGradient>
    <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8d8a86" />
      <stop offset="1" stopColor="#5c5a58" />
    </linearGradient>
    <linearGradient id="concrete" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#a7a29b" />
      <stop offset="1" stopColor="#8a857e" />
    </linearGradient>
    <linearGradient id="duskShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a2550" stopOpacity="0.55" />
      <stop offset="1" stopColor="#0d0f1c" stopOpacity="0.65" />
    </linearGradient>
    <filter id="soft4" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="soft20" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" />
    </filter>
  </defs>
);

/** Træ med volumen (lys side mod højre, skygge mod venstre) */
const Tree: React.FC<{ x: number; y: number; s: number; t: number; seed: string; autumn?: boolean }> = ({ x, y, s, t, seed, autumn = true }) => {
  const cols = autumn ? ["#b5551d", "#d9822b", "#e7a83b", "#c0392b"] : ["#3f6e3a", "#5a8f45", "#78ab55"];
  const sway = Math.sin(t * 0.8 + random(seed) * 6) * 2;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={-120} cy={6} rx={220} ry={26} fill="#000" opacity={0.25} filter="url(#soft4)" />
      <path d="M-18,0 L-12,-260 Q-40,-320 -70,-350 M-12,-260 Q20,-330 60,-360 M-12,-200 L14,0 Z" stroke="#4a2e1a" strokeWidth={30} fill="#4a2e1a" strokeLinecap="round" />
      <g transform={`rotate(${sway},0,-260)`}>
        {Array.from({ length: 22 }).map((_, i) => {
          const a = random(`${seed}a${i}`) * Math.PI * 2, r = random(`${seed}r${i}`) * 150;
          const cx = Math.cos(a) * r * 1.2, cy = -400 + Math.sin(a) * r * 0.9;
          const light = cx > 0;
          return <circle key={i} cx={cx} cy={cy} r={80 + random(`${seed}s${i}`) * 50} fill={cols[Math.floor(random(`${seed}c${i}`) * cols.length)]} opacity={light ? 1 : 0.92} />;
        })}
        <ellipse cx={-80} cy={-380} rx={170} ry={190} fill="#3a1a08" opacity={0.18} />
        <ellipse cx={90} cy={-450} rx={120} ry={110} fill="#fff1c8" opacity={0.18} />
      </g>
    </g>
  );
};

/** Dansk sprossevindue med karm, sål, refleks og evt. gardin */
const Window: React.FC<{ x: number; y: number; w: number; h: number; seed: string; arch?: boolean; lit?: boolean }> = ({ x, y, w, h, seed, arch, lit }) => {
  const curtain = random(seed) < 0.45;
  const top = arch ? `M${x},${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w / 2}` : `M${x},${y} L${x + w},${y}`;
  const path = arch ? `${top} L${x + w},${y + h} L${x},${y + h} Z` : `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
  return (
    <g>
      <rect x={x - 10} y={y + h} width={w + 20} height={12} fill="#e9e1d2" />
      <path d={path} fill="#f4efe6" transform={`translate(0,0)`} />
      <path d={path} fill={lit ? "#ffe0a0" : "url(#glassWin)"} transform={`translate(${w * 0.06},${w * 0.06}) scale(${0.88},${(h - w * 0.12) / h})`} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      {curtain && <rect x={x + w * 0.08} y={y + (arch ? w * 0.3 : h * 0.06)} width={w * 0.18} height={h * 0.82} fill="#e8d6b0" opacity={0.85} />}
      {curtain && <rect x={x + w * 0.74} y={y + (arch ? w * 0.3 : h * 0.06)} width={w * 0.18} height={h * 0.82} fill="#e8d6b0" opacity={0.85} />}
      <line x1={x + w / 2} y1={y + (arch ? 0 : 0)} x2={x + w / 2} y2={y + h} stroke="#f4efe6" strokeWidth={7} />
      <line x1={x} y1={y + h * 0.42} x2={x + w} y2={y + h * 0.42} stroke="#f4efe6" strokeWidth={6} />
      <line x1={x} y1={y + h * 0.72} x2={x + w} y2={y + h * 0.72} stroke="#f4efe6" strokeWidth={6} />
      <path d={path} fill="none" stroke="#f4efe6" strokeWidth={8} />
      <polygon points={`${x + w * 0.2},${y + h * 0.1} ${x + w * 0.38},${y + h * 0.1} ${x + w * 0.12},${y + h * 0.9} ${x},${y + h * 0.9}`} fill="#fff" opacity={0.18} />
    </g>
  );
};

/** Cykel (sidebillede) */
const Bike: React.FC<{ x: number; y: number; s: number; col: string }> = ({ x, y, s, col }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} stroke={col} strokeWidth={5} fill="none">
    <circle cx={-40} cy={-30} r={30} stroke="#222" />
    <circle cx={40} cy={-30} r={30} stroke="#222" />
    <path d="M-40,-30 L-10,-30 L20,-70 L-20,-70 Z M20,-70 L40,-30 M-20,-70 L-24,-82 M14,-82 L24,-82 M20,-70 L20,-82" />
  </g>
);

/** Skolen udefra – realistisk dansk murstensskole i gyldent eftermiddagslys */
export const SchoolExterior2: React.FC<{ t: number; hour?: number; kids?: boolean }> = ({ t, hour = 8, kids = true }) => {
  const flag = (y: number) => `M0,${y} ${Array.from({ length: 9 }).map((_, i) => `L${i * 22},${y + Math.sin(t * 6 - i * 0.7) * 8 * (i / 8)}`).join(" ")}`;
  return (
    <g>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#goldenSky)" />
      <circle cx={980} cy={560} r={520} fill="url(#sunGlow)" />
      {[[200, 300, 260], [700, 220, 200], [500, 420, 300]].map(([cx, cy, r], i) => (
        <g key={i} filter="url(#soft20)" opacity={0.85}>
          <ellipse cx={(cx + t * 6) % 1400 - 100} cy={cy} rx={r} ry={r * 0.32} fill="#fffaf0" />
        </g>
      ))}
      {/* fjerne huse/træer */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={i * 100 - 80} y={1060 - random(`fh${i}`) * 120} width={96} height={400} fill="#8a7a8c" opacity={0.5} />
      ))}
      {/* tag */}
      <polygon points="-20,860 540,640 1100,860" fill="url(#slate)" />
      <polygon points="-20,860 540,640 1100,860" fill="url(#sunSide)" />
      <rect x={180} y={700} width={40} height={110} fill="#7a3328" />
      <rect x={170} y={692} width={60} height={14} fill="#5a2a20" />
      {[300, 780].map((x) => (
        <g key={x}>
          <polygon points={`${x - 60},800 ${x},740 ${x + 60},800`} fill="#2f3238" />
          <rect x={x - 46} y={800} width={92} height={60} fill="#f4efe6" />
          <rect x={x - 34} y={808} width={68} height={46} fill="url(#glassWin)" />
        </g>
      ))}
      {/* facade */}
      <rect x={20} y={860} width={1040} height={830} fill="url(#bricks)" />
      <rect x={20} y={860} width={1040} height={830} fill="url(#sunSide)" />
      <rect x={20} y={860} width={1040} height={40} fill="#000" opacity={0.25} />
      <rect x={10} y={850} width={1060} height={22} fill="#e9e1d2" />
      <rect x={10} y={1230} width={1060} height={16} fill="#e9e1d2" />
      <rect x={20} y={1640} width={1040} height={50} fill="#5a524a" />
      {[0, 1].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          if (r === 1 && c === 2) return null;
          return <Window key={`${r}${c}`} x={70 + c * 196} y={r === 0 ? 920 : 1290} w={120} h={r === 0 ? 260 : 300} seed={`w${r}${c}`} arch={r === 1} />;
        }),
      )}
      {/* tårn med irgrønt spir og ur */}
      <rect x={430} y={430} width={220} height={430} fill="url(#bricks)" />
      <rect x={430} y={430} width={220} height={430} fill="url(#sunSide)" />
      <rect x={420} y={420} width={240} height={20} fill="#e9e1d2" />
      <polygon points="420,425 540,170 660,425" fill="url(#verdigris)" />
      <line x1={540} y1={170} x2={540} y2={100} stroke="#3a3a3a" strokeWidth={6} />
      <path d={`M540,120 L${540 + Math.sin(t) * 6 + 40},112 L540,104 Z`} fill="#2a2a2a" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={470 + i * 52} y={460} width={34} height={60} rx={14} fill="#2a2420" />
      ))}
      <Clock x={540} y={640} r={74} hour={hour} />
      {/* indgang */}
      <rect x={450} y={1300} width={180} height={340} fill="#e9e1d2" />
      <path d="M470,1640 L470,1400 Q540,1320 610,1400 L610,1640 Z" fill="#5a3420" />
      <line x1={540} y1={1360} x2={540} y2={1640} stroke="#3a2010" strokeWidth={6} />
      <circle cx={525} cy={1520} r={6} fill="#d9b36a" />
      <circle cx={555} cy={1520} r={6} fill="#d9b36a" />
      {[430, 650].map((x) => (
        <g key={x}>
          <rect x={x - 8} y={1400} width={16} height={34} fill="#1e1e1e" />
          <circle cx={x} cy={1400} r={60} fill="url(#sunGlow)" opacity={0.4} />
        </g>
      ))}
      <rect x={360} y={1250} width={360} height={46} fill="#d8cfbf" />
      <text x={540} y={1286} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#3a3330" letterSpacing={10}>
        SKOLEN
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={430 - i * 20} y={1640 + i * 16} width={220 + i * 40} height={16} fill={i % 2 ? "#cfc6b6" : "#bdb4a4"} />
      ))}
      {/* flagstang + dannebrog */}
      <rect x={70} y={980} width={10} height={720} fill="#e6e6e6" />
      <circle cx={75} cy={978} r={9} fill="#d9b36a" />
      <g transform="translate(80,1000)">
        <path d={`${flag(0)} L176,${100 + Math.sin(t * 6 - 5.6) * 8} ${Array.from({ length: 9 }).map((_, i) => `L${176 - i * 22},${100 + Math.sin(t * 6 - (8 - i) * 0.7) * 8 * ((8 - i) / 8)}`).join(" ")} Z`} fill="#c8102e" />
        <path d={`M48,${Math.sin(t * 6 - 1.5) * 3} L48,100 M0,${44 + Math.sin(t * 6) * 2} L176,${44 + Math.sin(t * 6 - 5.6) * 7}`} stroke="#fff" strokeWidth={16} />
      </g>
      {/* skolegård */}
      <rect x={-300} y={1690} width={W + 600} height={600} fill="url(#asphalt)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={420 + (i % 2) * 120} y={1760 + Math.floor(i / 2) * 70} width={110} height={62} fill="none" stroke="#f4f1ea" strokeWidth={4} opacity={0.7} />
      ))}
      <text x={475} y={1808} fontFamily="Anton" fontSize={34} fill="#f4f1ea" opacity={0.7}>1</text>
      <text x={595} y={1808} fontFamily="Anton" fontSize={34} fill="#f4f1ea" opacity={0.7}>2</text>
      {/* lange skygger mod venstre */}
      <polygon points="20,1690 1060,1690 700,1900 -400,1900" fill="#000" opacity={0.12} />
      {/* cykelstativ */}
      <rect x={760} y={1716} width={280} height={8} fill="#777" />
      {[790, 850, 920, 990].map((x, i) => (
        <Bike key={x} x={x} y={1780} s={0.8} col={["#c0392b", "#2c3e50", "#27ae60", "#f1c40f"][i]} />
      ))}
      <Tree x={-30} y={1720} s={1.0} t={t} seed="tl" />
      <Tree x={1120} y={1740} s={1.1} t={t} seed="tr" />
      {kids &&
        [0, 1, 2].map((i) => {
          const x = ((i * 300 + t * (40 + i * 10)) % 1200) - 60;
          return (
            <g key={i} transform={`translate(${x},${1860 + i * 18}) scale(0.9)`}>
              <circle cx={0} cy={-88} r={12} fill="#c88d63" />
              <rect x={-12} y={-74} width={24} height={40} rx={8} fill={["#2e86de", "#e67e22", "#8e44ad"][i]} />
              <rect x={-9} y={-36} width={7} height={36} fill="#2a2a30" transform={`rotate(${Math.sin(t * 9 + i) * 18},-5,-36)`} />
              <rect x={2} y={-36} width={7} height={36} fill="#2a2a30" transform={`rotate(${-Math.sin(t * 9 + i) * 18},5,-36)`} />
              <rect x={10} y={-72} width={14} height={26} rx={4} fill="#c0392b" />
            </g>
          );
        })}
      {/* faldende blade */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = ((random(`lx${i}`) * 1300 + Math.sin(t * 1.5 + i) * 60 + t * 40) % 1300) - 100;
        const y = (random(`ly${i}`) * 1900 + t * (90 + random(`ls${i}`) * 80)) % 1900;
        return <ellipse key={i} cx={x} cy={y} rx={12} ry={6} fill={["#d9822b", "#c0392b", "#e0a030"][i % 3]} transform={`rotate(${t * 120 + i * 40},${x},${y})`} />;
      })}
    </g>
  );
};

/** Klasseværelse – realistisk: panel, kortet over Danmark, reol, globus, vinduer med planter, pulte i perspektiv */
export const Classroom2: React.FC<{ t: number; hour?: number; chalk?: React.ReactNode; desks?: boolean; sun?: number }> = ({ t, hour = 13.75, chalk, desks = true, sun = 1 }) => (
  <g>
    {/* væg med svage striber + panel */}
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#e7d9bd" />
    {Array.from({ length: 30 }).map((_, i) => (
      <rect key={i} x={i * 50 - 300} y={-300} width={22} height={1600} fill="#dccba9" opacity={0.5} />
    ))}
    <rect x={-300} y={1180} width={W + 600} height={240} fill="#7e5c3a" />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={i * 120 - 280} y={1200} width={100} height={190} fill="none" stroke="#5e4228" strokeWidth={4} />
    ))}
    <rect x={-300} y={1172} width={W + 600} height={14} fill="#5e4228" />
    {/* vindue til venstre med træ udenfor + planter */}
    <rect x={-160} y={180} width={300} height={720} fill="#9cc7e0" />
    <circle cx={-40} cy={420} r={160} fill="#7aa85a" opacity={0.8} />
    <circle cx={60} cy={360} r={120} fill="#8fbf68" opacity={0.8} />
    <rect x={-160} y={180} width={300} height={720} fill="url(#glassWin)" opacity={0.35} />
    <path d="M-160,180 L140,180 L140,900 L-160,900 Z M-10,180 L-10,900 M-160,420 L140,420 M-160,660 L140,660" stroke="#fbf6ea" strokeWidth={16} fill="none" />
    <rect x={-170} y={896} width={330} height={20} fill="#fbf6ea" />
    {[0, 80].map((dx, i) => (
      <g key={i} transform={`translate(${-60 + dx},896)`}>
        <path d="M-26,0 L26,0 L20,-50 L-20,-50 Z" fill="#c0603a" />
        {[-1, 0, 1].map((k) => (
          <ellipse key={k} cx={k * 14} cy={-70} rx={12} ry={30} fill="#3f7a3a" transform={`rotate(${k * 25},${k * 14},-50)`} />
        ))}
      </g>
    ))}
    <circle cx={0} cy={300} r={260} fill="url(#sunGlow)" opacity={0.7 * sun} />
    {/* tavle */}
    <rect x={200} y={270} width={830} height={520} rx={8} fill="url(#wood)" />
    <rect x={220} y={290} width={790} height={480} fill="url(#board)" />
    <ellipse cx={500} cy={500} rx={320} ry={170} fill="url(#chalkDust)" />
    <ellipse cx={860} cy={640} rx={200} ry={100} fill="url(#chalkDust)" />
    <text x={250} y={340} fontFamily="Playfair" fontStyle="italic" fontSize={30} fill="#f4f1ea" opacity={0.6}>
      Mandag
    </text>
    <text x={820} y={740} fontFamily="Playfair" fontStyle="italic" fontSize={34} fill="#f4f1ea" opacity={0.45}>
      7 × 8 = 56
    </text>
    <rect x={220} y={770} width={790} height={20} fill="#5e4228" />
    <rect x={280} y={756} width={60} height={14} rx={4} fill="#f4f1ea" />
    <rect x={360} y={758} width={46} height={12} rx={4} fill="#f3d36a" />
    <rect x={900} y={748} width={80} height={22} rx={4} fill="#3a2a1e" />
    <rect x={900} y={748} width={80} height={8} fill="#e8e0d0" />
    <g>{chalk}</g>
    {/* Danmarkskort */}
    <g transform="translate(220,860)">
      <rect width={250} height={290} fill="#dfeef3" stroke="#8d6a44" strokeWidth={8} />
      <path d="M60,40 Q90,30 110,60 Q120,120 100,160 Q110,200 90,240 Q60,250 50,200 Q40,140 55,90 Z" fill="#9bc37a" stroke="#5a7a4a" strokeWidth={2} />
      <ellipse cx={150} cy={170} rx={22} ry={30} fill="#9bc37a" stroke="#5a7a4a" strokeWidth={2} />
      <path d="M180,140 Q220,130 230,170 Q225,220 190,220 Q170,190 180,140 Z" fill="#9bc37a" stroke="#5a7a4a" strokeWidth={2} />
      <circle cx={212} cy={168} r={5} fill="#c0392b" />
      <text x={125} y={276} textAnchor="middle" fontFamily="Anton" fontSize={22} fill="#3a3330">DANMARK</text>
    </g>
    {/* reol + globus */}
    <g transform="translate(860,860)">
      <rect width={190} height={320} fill="#7a5532" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x={10} y={14 + r * 100} width={170} height={86} fill="#4a321e" />
          {Array.from({ length: 7 }).map((_, i) => (
            <rect key={i} x={16 + i * 23} y={24 + r * 100 + random(`bk${r}${i}`) * 18} width={20} height={74 - random(`bk${r}${i}`) * 18} fill={["#8e2b2b", "#2b4e8e", "#2b8e5a", "#c9a046", "#5a2b8e", "#d35400"][(i + r) % 6]} />
          ))}
        </g>
      ))}
      <circle cx={95} cy={-60} r={52} fill="#5d9cc8" />
      <path d={`M${60 + Math.sin(t * 0.6) * 10},-90 Q95,-60 ${70 + Math.sin(t * 0.6) * 10},-20`} stroke="#8fbf68" strokeWidth={24} fill="none" />
      <path d="M43,-60 A52,52 0 0 0 147,-60" stroke="#c9a046" strokeWidth={5} fill="none" />
      <rect x={88} y={-8} width={14} height={10} fill="#c9a046" />
    </g>
    <Clock x={110} y={1000} r={66} hour={hour} />
    {/* solstråler + solpletter på gulvet */}
    <g style={{ mixBlendMode: "screen" }} opacity={sun}>
      {[0, 1, 2].map((i) => (
        <polygon key={i} points={`${-140 + i * 90},${200} ${-50 + i * 90},${200} ${760 + i * 150 + Math.sin(t * 0.5 + i) * 20},${1900} ${560 + i * 150},${1900}`} fill="url(#sunray)" opacity={0.45} />
      ))}
    </g>
    {Array.from({ length: 50 }).map((_, i) => {
      const x = (random(`d${i}`) * 900 + Math.sin(t * 0.4 + i) * 30) % 1000;
      const y = ((random(`dy${i}`) * 1500 - t * (8 + random(`ds${i}`) * 14)) % 1500 + 1500) % 1500 + 300;
      return <circle key={i} cx={x} cy={y} r={1.5 + random(`dr${i}`) * 2.5} fill="#fff6d8" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />;
    })}
    {/* trægulv i perspektiv */}
    <polygon points={`-300,1420 ${W + 300},1420 ${W + 900},2300 -900,2300`} fill="url(#planks)" />
    <polygon points={`-300,1420 ${W + 300},1420 ${W + 900},2300 -900,2300`} fill="#000" opacity={0.12} />
    <polygon points="240,1420 520,1420 900,2000 420,2000" fill="#fff2c8" opacity={0.18 * sun} />
    {desks &&
      [0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const s = 0.75 + r * 0.35;
          const y = 1450 + r * r * 90 + r * 120;
          const x = 540 + (c - 1) * 330 * s;
          return (
            <g key={`${r}${c}`} transform={`translate(${x},${y}) scale(${s})`}>
              {/* stol */}
              <rect x={-40} y={-90} width={80} height={60} rx={8} fill="#2f6f9f" />
              <rect x={-36} y={-30} width={8} height={90} fill="#555" />
              <rect x={28} y={-30} width={8} height={90} fill="#555" />
              {/* pult */}
              <rect x={-120} y={0} width={240} height={22} rx={6} fill="url(#wood)" />
              <rect x={-120} y={18} width={240} height={10} fill="#5e4228" />
              <rect x={-112} y={28} width={10} height={120} fill="#4a4a50" />
              <rect x={102} y={28} width={10} height={120} fill="#4a4a50" />
              <rect x={-60} y={-14} width={70} height={14} rx={2} fill={["#e74c3c", "#3498db", "#f1c40f"][(r + c) % 3]} />
              <rect x={30} y={-8} width={50} height={6} rx={3} fill="#f39c12" transform="rotate(-10,30,-8)" />
              {random(`bp${r}${c}`) < 0.5 && <rect x={70} y={60} width={50} height={60} rx={14} fill={["#c0392b", "#16a085", "#8e44ad"][(r + c) % 3]} />}
            </g>
          );
        }),
      )}
  </g>
);
