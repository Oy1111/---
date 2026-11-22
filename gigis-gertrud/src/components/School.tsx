import React from "react";
import { random } from "remotion";
import { W, H } from "../lib";

/** Fælles defs for skole-miljøerne */
export const SchoolDefs: React.FC = () => (
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#e9d9b8" />
      <stop offset="1" stopColor="#c9b28a" />
    </linearGradient>
    <linearGradient id="board" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#2f5a45" />
      <stop offset="1" stopColor="#1d3d2e" />
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#b9834f" />
      <stop offset="1" stopColor="#7d5230" />
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9a6c42" />
      <stop offset="1" stopColor="#5c3c22" />
    </linearGradient>
    <linearGradient id="sunray" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff2c8" stopOpacity="0.55" />
      <stop offset="1" stopColor="#fff2c8" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="brick" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#a2493a" />
      <stop offset="1" stopColor="#7a3328" />
    </linearGradient>
    <linearGradient id="autumnSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7fa6c9" />
      <stop offset="0.6" stopColor="#e9c79a" />
      <stop offset="1" stopColor="#f3b37a" />
    </linearGradient>
    <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1c2550" />
      <stop offset="0.55" stopColor="#7a4a7a" />
      <stop offset="1" stopColor="#f29a6a" />
    </linearGradient>
    <radialGradient id="sunGlow">
      <stop offset="0" stopColor="#fff6dc" stopOpacity="0.9" />
      <stop offset="1" stopColor="#ffd89a" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="chalkDust">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
  </defs>
);

/** Vægur – viser klokkeslæt (timer i decimal, fx 14.25 = 14:15). Rød tråd i videoen. */
export const Clock: React.FC<{ x: number; y: number; r: number; hour: number }> = ({ x, y, r, hour }) => {
  const m = (hour % 1) * 60;
  const h = hour % 12;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r + 8} fill="#2a2a2e" />
      <circle r={r} fill="#fbf8f0" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-3} y={-r + 6} width={6} height={i % 3 === 0 ? 18 : 10} fill="#222" transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-5} y={-r * 0.5} width={10} height={r * 0.55} rx={4} fill="#222" transform={`rotate(${h * 30 + m * 0.5})`} />
      <rect x={-3} y={-r * 0.78} width={6} height={r * 0.82} rx={3} fill="#222" transform={`rotate(${m * 6})`} />
      <rect x={-1} y={-r * 0.85} width={2} height={r * 0.95} fill="#c41a28" transform={`rotate(${(hour * 3600) % 60 * 6})`} />
      <circle r={7} fill="#c41a28" />
      <path d={`M${-r * 0.7},${-r * 0.5} Q0,${-r * 0.95} ${r * 0.7},${-r * 0.5}`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.6} />
    </g>
  );
};

/** Klasseværelse set forfra: tavle, ur, vinduer med solstråler, pulte. chalk = tekst på tavlen */
export const Classroom: React.FC<{ t: number; hour?: number; chalk?: React.ReactNode; desks?: boolean; sun?: number }> = ({ t, hour = 13.75, chalk, desks = true, sun = 1 }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#wall)" />
    {/* panel nederst på væggen */}
    <rect x={-300} y={1260} width={W + 600} height={140} fill="#8e6a44" />
    <rect x={-300} y={1250} width={W + 600} height={14} fill="#6e4e30" />
    {/* vinduer til venstre med solstråler */}
    {[0, 1].map((i) => (
      <g key={i}>
        <rect x={-260 + i * 0} y={240 + i * 0} width={0} height={0} />
      </g>
    ))}
    <rect x={-120} y={160} width={250} height={560} fill="#bfe0f2" stroke="#fbf6ea" strokeWidth={18} />
    <line x1={5} y1={160} x2={5} y2={720} stroke="#fbf6ea" strokeWidth={12} />
    <line x1={-120} y1={440} x2={130} y2={440} stroke="#fbf6ea" strokeWidth={12} />
    <circle cx={60} cy={260} r={160} fill="url(#sunGlow)" opacity={0.8 * sun} />
    {/* tavle */}
    <rect x={220} y={280} width={800} height={500} rx={8} fill="url(#wood)" />
    <rect x={240} y={300} width={760} height={460} fill="url(#board)" />
    <ellipse cx={500} cy={500} rx={300} ry={160} fill="url(#chalkDust)" />
    <ellipse cx={820} cy={620} rx={200} ry={100} fill="url(#chalkDust)" />
    <rect x={240} y={760} width={760} height={18} fill="#6e4e30" />
    <rect x={300} y={748} width={60} height={12} rx={4} fill="#f4f1ea" />
    <rect x={380} y={750} width={40} height={10} rx={4} fill="#f3d36a" />
    <g>{chalk}</g>
    {/* ur over tavlen */}
    <Clock x={110} y={900} r={70} hour={hour} />
    {/* plakater */}
    <rect x={240} y={840} width={180} height={230} fill="#f4efe2" stroke="#c9b28a" strokeWidth={4} />
    <text x={330} y={900} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#c0392b">
      ABC
    </text>
    {["Æ", "Ø", "Å"].map((c, i) => (
      <text key={c} x={280 + i * 40} y={980} fontFamily="Anton" fontSize={44} fill={["#2e86de", "#27ae60", "#e67e22"][i]}>
        {c}
      </text>
    ))}
    <rect x={820} y={840} width={200} height={150} fill="#cfe3ee" stroke="#c9b28a" strokeWidth={4} />
    <path d="M840,920 Q880,870 920,910 Q960,880 1000,930 L1000,975 L840,975 Z" fill="#7ab36a" />
    {/* solstråler ned over rummet */}
    <g style={{ mixBlendMode: "screen" }} opacity={sun}>
      {[0, 1, 2].map((i) => (
        <polygon key={i} points={`${-120 + i * 80},${180} ${-40 + i * 80},${180} ${700 + i * 160 + Math.sin(t * 0.5 + i) * 20},${1900} ${520 + i * 160},${1900}`} fill="url(#sunray)" opacity={0.5} />
      ))}
    </g>
    {/* støv i lyset */}
    {Array.from({ length: 40 }).map((_, i) => {
      const x = (random(`d${i}`) * 900 + Math.sin(t * 0.4 + i) * 30) % 1000;
      const y = ((random(`dy${i}`) * 1500 - t * (8 + random(`ds${i}`) * 14)) % 1500 + 1500) % 1500 + 300;
      return <circle key={i} cx={x} cy={y} r={1.5 + random(`dr${i}`) * 2.5} fill="#fff6d8" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />;
    })}
    {/* gulv */}
    <rect x={-300} y={1400} width={W + 600} height={800} fill="url(#floor)" />
    {Array.from({ length: 14 }).map((_, i) => (
      <line key={i} x1={i * 90 - 100} y1={1400} x2={i * 150 - 600} y2={2300} stroke="#4a2e18" strokeWidth={3} opacity={0.4} />
    ))}
    {desks &&
      [0, 1].map((r) =>
        [0, 1, 2].map((c) => {
          const s = 1 + r * 0.45;
          const x = 180 + c * 360 - (s - 1) * 200 + (c - 1) * r * 120;
          const y = 1470 + r * 300;
          return (
            <g key={`${r}${c}`}>
              <rect x={x - 130 * s} y={y} width={260 * s} height={22 * s} rx={6} fill="url(#wood)" />
              <rect x={x - 120 * s} y={y + 22 * s} width={10 * s} height={120 * s} fill="#3a3a40" />
              <rect x={x + 110 * s} y={y + 22 * s} width={10 * s} height={120 * s} fill="#3a3a40" />
              <rect x={x - 60 * s} y={y - 14 * s} width={80 * s} height={14 * s} rx={3} fill={["#e74c3c", "#3498db", "#f1c40f"][c]} />
            </g>
          );
        }),
      )}
  </g>
);

/** Skolen udefra: rød murstensbygning med tårnur, efterårstræer og faldende blade */
export const SchoolExterior: React.FC<{ t: number; hour?: number }> = ({ t, hour = 8.0 }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#autumnSky)" />
    <circle cx={850} cy={420} r={420} fill="url(#sunGlow)" />
    {/* bygning */}
    <rect x={40} y={760} width={1000} height={900} fill="url(#brick)" />
    {Array.from({ length: 36 }).map((_, r) => (
      <line key={r} x1={40} y1={780 + r * 24} x2={1040} y2={780 + r * 24} stroke="#5e2a20" strokeWidth={2} opacity={0.35} />
    ))}
    {/* tag + tårn */}
    <polygon points="0,780 540,560 1080,780" fill="#3e3a3e" />
    <rect x={440} y={400} width={200} height={380} fill="url(#brick)" />
    <polygon points="420,410 540,250 660,410" fill="#3e3a3e" />
    <Clock x={540} y={520} r={60} hour={hour} />
    {/* vinduer */}
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3, 4].map((c) => (
        <g key={`${r}${c}`}>
          <rect x={90 + c * 190} y={860 + r * 230} width={120} height={160} fill="#fbf6ea" />
          <rect x={100 + c * 190} y={870 + r * 230} width={100} height={140} fill={random(`sw${r}${c}`) < 0.5 ? "#ffe3a8" : "#9fc4dc"} />
          <line x1={150 + c * 190} y1={870 + r * 230} x2={150 + c * 190} y2={1010 + r * 230} stroke="#fbf6ea" strokeWidth={8} />
        </g>
      )),
    )}
    {/* dør + trappe + skilt */}
    <path d="M460,1660 L460,1480 Q540,1400 620,1480 L620,1660 Z" fill="#3a2a1e" />
    <rect x={400} y={1660} width={280} height={30} fill="#c9b9a0" />
    <rect x={330} y={1380} width={420} height={60} fill="#f4efe2" />
    <text x={540} y={1423} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#2a2a2e" letterSpacing={6}>
      SKOLE
    </text>
    {/* skolegård + træer */}
    <rect x={-300} y={1690} width={W + 600} height={600} fill="#8a8580" />
    {[-60, 1120].map((x, i) => (
      <g key={i}>
        <rect x={x - 20} y={1300} width={40} height={420} fill="#5a3a22" />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={x + Math.cos(k * 1.3) * 120} cy={1250 + Math.sin(k * 1.7) * 90} r={150} fill={["#d9822b", "#c0392b", "#e0a030", "#b5651d", "#d35400"][k]} opacity={0.95} />
        ))}
      </g>
    ))}
    {/* faldende blade */}
    {Array.from({ length: 26 }).map((_, i) => {
      const x = ((random(`lx${i}`) * 1300 + Math.sin(t * 1.5 + i) * 60 + t * 40) % 1300) - 100;
      const y = ((random(`ly${i}`) * 1900 + t * (90 + random(`ls${i}`) * 80)) % 1900);
      return <ellipse key={i} cx={x} cy={y} rx={12} ry={6} fill={["#d9822b", "#c0392b", "#e0a030"][i % 3]} transform={`rotate(${t * 120 + i * 40},${x},${y})`} />;
    })}
  </g>
);

/** Inspektørens kontor: persienner med eftermiddagslys, arkivskabe, diplomer, plante, lampe, skærm */
export const Office: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#cfc4b0" />
    {Array.from({ length: 24 }).map((_, i) => (
      <rect key={i} x={i * 60 - 300} y={-300} width={30} height={1900} fill="#c6baa4" opacity={0.6} />
    ))}
    {/* vindue med persienner */}
    <rect x={560} y={140} width={460} height={600} fill="#f4dca8" />
    {Array.from({ length: 22 }).map((_, i) => (
      <rect key={i} x={560} y={150 + i * 27} width={460} height={14} fill="#e9e4d8" />
    ))}
    <rect x={560} y={140} width={460} height={600} fill="none" stroke="#fbf6ea" strokeWidth={16} />
    {/* lysstriber fra persiennerne ned over rummet */}
    <g style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <polygon key={i} points={`${560},${160 + i * 54} ${1020},${160 + i * 54} ${700 + Math.sin(t * 0.3) * 10},${1100 + i * 60} ${200},${1100 + i * 60}`} fill="#fff1c8" opacity={0.05} />
      ))}
    </g>
    {/* diplomer */}
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${80 + i * 200},${180})`}>
        <rect width={160} height={120} fill="#6e4e30" />
        <rect x={10} y={10} width={140} height={100} fill="#f4efe2" />
        <circle cx={80} cy={78} r={14} fill="#c0392b" />
        <rect x={30} y={30} width={100} height={8} fill="#999" />
      </g>
    ))}
    {/* reol */}
    <rect x={40} y={360} width={420} height={600} fill="#6e4e30" />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <rect x={60} y={380 + r * 190} width={380} height={160} fill="#4a321e" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={70 + i * 40} y={400 + r * 190 + random(`b${r}${i}`) * 30} width={32} height={140 - random(`b${r}${i}`) * 30} fill={["#8e2b2b", "#2b4e8e", "#2b8e5a", "#c9a046", "#5a2b8e"][(i + r) % 5]} />
        ))}
      </g>
    ))}
    {/* arkivskab + plante */}
    <rect x={40} y={980} width={200} height={460} fill="#8a8f98" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={52} y={995 + i * 148} width={176} height={134} fill="#9aa0aa" stroke="#6a6f78" strokeWidth={3} />
        <rect x={115} y={1050 + i * 148} width={50} height={10} rx={4} fill="#5a5f68" />
      </g>
    ))}
    <path d="M880,1500 L960,1500 L950,1420 L890,1420 Z" fill="#c0603a" />
    {[-1, 0, 1, 2].map((k) => (
      <ellipse key={k} cx={920 + k * 18} cy={1340} rx={18} ry={70} fill="#3f7a3a" transform={`rotate(${k * 18 + Math.sin(t + k) * 2},920,1420)`} />
    ))}
    {/* dansk bordflag */}
    <rect x={780} y={1180} width={6} height={160} fill="#bbb" />
    <rect x={786} y={1190} width={110} height={74} fill="#c8102e" />
    <rect x={816} y={1190} width={16} height={74} fill="#fff" />
    <rect x={786} y={1220} width={110} height={14} fill="#fff" />
    {/* skrivebord */}
    <rect x={-300} y={1500} width={W + 600} height={600} fill="url(#wood)" />
    <rect x={-300} y={1500} width={W + 600} height={16} fill="#d9a56a" />
    {/* skærm + lampe + krus + telefon */}
    <g transform="translate(860,1500)">
      <rect x={-20} y={-10} width={40} height={10} fill="#333" />
      <rect x={-5} y={-80} width={10} height={70} fill="#333" />
    </g>
    <g transform="translate(150,1500)">
      <path d="M0,0 L60,0 L40,-20 L20,-20 Z" fill="#1d4a2a" />
      <path d="M30,-20 L60,-150 L120,-150" stroke="#1d4a2a" strokeWidth={8} fill="none" />
      <path d="M90,-160 L170,-160 L150,-120 L110,-120 Z" fill="#1d4a2a" />
      <circle cx={130} cy={-110} r={180} fill="url(#sunGlow)" opacity={0.5} />
    </g>
    <g transform="translate(980,1560)">
      <rect x={-30} y={-60} width={60} height={70} rx={8} fill="#fff" />
      <path d="M30,-45 Q55,-35 30,-15" stroke="#fff" strokeWidth={8} fill="none" />
      {[0, 1].map((q) => (
        <path key={q} d={`M${-10 + q * 18},-70 q8,-${16 + ((t * 20) % 10)} 0,-36`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.35} />
      ))}
    </g>
  </g>
);

/** Gaden ved skumring: graffiti-mur, lygtepæl, hjørne */
export const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#duskSky)" />
    {Array.from({ length: 10 }).map((_, i) => (
      <rect key={i} x={i * 120 - 60} y={600 - random(`hb${i}`) * 300} width={110} height={1200} fill="#2a2440" />
    ))}
    {Array.from({ length: 40 }).map((_, i) => (
      <rect key={`w${i}`} x={(i % 10) * 120 - 40} y={650 + Math.floor(i / 10) * 90} width={30} height={40} fill="#ffcf7a" opacity={random(`ww${i}`) < 0.5 ? 0.85 : 0.1} />
    ))}
    {/* mur med graffiti */}
    <rect x={-300} y={1000} width={W + 600} height={700} fill="#5a5560" />
    <text x={200} y={1300} fontFamily="Anton" fontSize={200} fill="#e74c3c" opacity={0.75} transform="rotate(-6,200,1300)">
      GADEN
    </text>
    <text x={520} y={1520} fontFamily="Anton" fontSize={120} fill="#3498db" opacity={0.6} transform="rotate(4,520,1520)">
      2200
    </text>
    <rect x={-300} y={1700} width={W + 600} height={600} fill="#2a2a30" />
    {/* lygtepæl */}
    <rect x={880} y={700} width={20} height={1000} fill="#1a1a20" />
    <rect x={840} y={690} width={100} height={26} rx={8} fill="#1a1a20" />
    <circle cx={890} cy={722} r={300} fill="url(#sunGlow)" opacity={0.6 + Math.sin(t * 9) * 0.05} />
    <polygon points="850,716 930,716 1100,1700 680,1700" fill="#ffe6a8" opacity={0.15} />
  </g>
);
