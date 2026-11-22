import React from "react";
import { random, staticFile } from "remotion";
import { beatPulse } from "../lib";

/**
 * Stuen om natten (world units). Loft y=0, væg til y=FLOOR, gulv i perspektiv til y=2500.
 * 1 m ≈ 700 units. Venstre: entré-dør + knagerække. Midt: spisebord under en pendel foran det store vindue (regn + by).
 * Højre: skænk med pladespiller og højttalere, vægur, billeder, brændeovn.
 */
export const FLOOR = 1900;
export const RW = 4600;

export const RoomDefs: React.FC = () => (
  <defs>
    <pattern id="pWall" patternUnits="userSpaceOnUse" width={220} height={220}>
      <image href={staticFile("tex/wallpaper.png")} width={220} height={220} />
    </pattern>
    <pattern id="pWood" patternUnits="userSpaceOnUse" width={700} height={260}>
      <image href={staticFile("tex/wood.png")} width={700} height={260} preserveAspectRatio="none" />
    </pattern>
    <pattern id="pRug" patternUnits="userSpaceOnUse" width={160} height={80}>
      <image href={staticFile("tex/rug.png")} width={160} height={80} preserveAspectRatio="none" />
    </pattern>
    <linearGradient id="gWallShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0.65" />
      <stop offset="0.45" stopColor="#000" stopOpacity="0.2" />
      <stop offset="0.85" stopColor="#000" stopOpacity="0.35" />
      <stop offset="1" stopColor="#000" stopOpacity="0.6" />
    </linearGradient>
    <linearGradient id="gFloorShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0.6" />
      <stop offset="0.5" stopColor="#000" stopOpacity="0.25" />
      <stop offset="1" stopColor="#000" stopOpacity="0.75" />
    </linearGradient>
    <linearGradient id="gNightCity" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#060a1e" />
      <stop offset="0.6" stopColor="#141a3c" />
      <stop offset="1" stopColor="#2a2440" />
    </linearGradient>
    <linearGradient id="gWoodFurn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6a4428" />
      <stop offset="0.1" stopColor="#4a2e1a" />
      <stop offset="1" stopColor="#24160c" />
    </linearGradient>
    <linearGradient id="gTableTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8a5c38" />
      <stop offset="1" stopColor="#4a2e1a" />
    </linearGradient>
    <radialGradient id="rLampPool" cx="0.5" cy="0.3" r="0.7">
      <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" />
      <stop offset="0.5" stopColor="#ffb867" stopOpacity="0.18" />
      <stop offset="1" stopColor="#ffb867" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rWinLight" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0" stopColor="#6a86d8" stopOpacity="0.35" />
      <stop offset="1" stopColor="#6a86d8" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="gFire" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#fff2b0" />
      <stop offset="0.35" stopColor="#ffb02a" />
      <stop offset="0.75" stopColor="#ff5a10" />
      <stop offset="1" stopColor="#ff3000" stopOpacity="0" />
    </linearGradient>
  </defs>
);

/* ---------- vinduet: regn, dug, by i bokeh ---------- */
export const WIN = { x: 1480, y: 260, w: 760, h: 980 };
export const Window: React.FC<{ t: number; fog?: number; children?: React.ReactNode }> = ({ t, fog = 0.3, children }) => {
  const { x, y, w, h } = WIN;
  return (
    <g>
      <clipPath id="winClip"><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath="url(#winClip)">
        <rect x={x} y={y} width={w} height={h} fill="url(#gNightCity)" />
        {/* fjerne bygninger */}
        {Array.from({ length: 14 }).map((_, i) => {
          const bx = x - 60 + i * 64;
          const bh = 260 + random(`wb${i}`) * 420;
          return (
            <g key={i}>
              <rect x={bx} y={y + h - bh} width={60} height={bh} fill="#121630" />
              {Array.from({ length: 12 }).map((__, j) =>
                random(`ww${i}${j}`) < 0.35 ? <rect key={j} x={bx + 8 + (j % 3) * 16} y={y + h - bh + 16 + Math.floor(j / 3) * 34} width={8} height={12} fill="#ffcf86" opacity={0.6} /> : null,
              )}
            </g>
          );
        })}
        {/* bokeh-lys */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle key={i} cx={x + random(`wk${i}`) * w} cy={y + h * 0.45 + random(`wy${i}`) * h * 0.55} r={10 + random(`wr${i}`) * 26} fill={["#ffcf86", "#ff6a4a", "#7ae8ff", "#fff2c4"][i % 4]} opacity={0.12 + random(`wo${i}`) * 0.2} />
        ))}
        {/* regn bag ruden */}
        {Array.from({ length: 70 }).map((_, i) => {
          const rx = x + random(`rn${i}`) * w;
          const ry = y + ((random(`rm${i}`) * h + t * (900 + random(`rs${i}`) * 500)) % h);
          return <line key={i} x1={rx} y1={ry} x2={rx - 4} y2={ry - 26} stroke="#9ab0e0" strokeWidth={1.4} opacity={0.35} />;
        })}
        {/* dug + dråber på glasset */}
        <rect x={x} y={y} width={w} height={h} fill="#aab6d2" opacity={fog * 0.55} />
        {Array.from({ length: 90 }).map((_, i) => {
          const dx = x + random(`dx${i}`) * w;
          const dyy = y + ((random(`dy${i}`) * h + t * random(`dv${i}`) * 30) % h);
          const r = 2.5 + random(`dr${i}`) * 6;
          return (
            <g key={i}>
              <ellipse cx={dx} cy={dyy} rx={r} ry={r * 1.2} fill="#c8d4f0" opacity={0.28} />
              <circle cx={dx - r * 0.3} cy={dyy - r * 0.4} r={r * 0.35} fill="#fff" opacity={0.45} />
            </g>
          );
        })}
        {children}
      </g>
      {/* karm og sprosser */}
      <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} fill="none" stroke="#e8e2d6" strokeWidth={26} />
      <rect x={x - 40} y={y - 40} width={w + 80} height={h + 80} fill="none" stroke="#000" strokeWidth={4} opacity={0.4} />
      <rect x={x + w / 2 - 9} y={y} width={18} height={h} fill="#e8e2d6" />
      <rect x={x} y={y + h * 0.36} width={w} height={16} fill="#e8e2d6" />
      <rect x={x + w / 2 - 9} y={y} width={18} height={h} fill="#000" opacity={0.15} transform="translate(6,0)" />
      {/* vindueskarm */}
      <rect x={x - 70} y={y + h + 20} width={w + 140} height={34} fill="#efe9de" />
      <rect x={x - 70} y={y + h + 54} width={w + 140} height={24} fill="#000" opacity={0.35} />
      {/* gardiner */}
      {[x - 210, x + w + 40].map((cx, i) => (
        <g key={i}>
          <path d={`M${cx},${y - 80} L${cx + 170},${y - 80} Q${cx + 150 + Math.sin(t * 0.8 + i) * 6},${y + h * 0.6} ${cx + 180},${FLOOR - 40} L${cx - 10},${FLOOR - 40} Q${cx + 20},${y + h * 0.6} ${cx},${y - 80}Z`} fill="#5a2a22" />
          {[0.2, 0.45, 0.7].map((k) => (
            <path key={k} d={`M${cx + 170 * k},${y - 80} Q${cx + 170 * k + 10},${y + h * 0.6} ${cx + 170 * k + 6},${FLOOR - 40}`} stroke="#2a120e" strokeWidth={10} opacity={0.5} fill="none" />
          ))}
          <path d={`M${cx + 30},${y - 80} Q${cx + 38},${y + h * 0.6} ${cx + 34},${FLOOR - 40}`} stroke="#8a4a3a" strokeWidth={6} opacity={0.5} fill="none" />
        </g>
      ))}
      <rect x={x - 260} y={y - 96} width={w + 520} height={14} rx={7} fill="#1a1612" />
      {/* koldt vinduelys ind i rummet */}
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 1.2} ry={h * 0.9} fill="url(#rWinLight)" style={{ mixBlendMode: "screen" }} />
    </g>
  );
};

/* ---------- vægge, gulv, lister, loftlampe ---------- */
export const Walls: React.FC<{ t: number; lamp?: number }> = ({ t, lamp = 1 }) => (
  <g>
    <rect x={-800} y={-600} width={RW + 1600} height={FLOOR + 600} fill="url(#pWall)" />
    <rect x={-800} y={-600} width={RW + 1600} height={FLOOR + 600} fill="url(#gWallShade)" />
    {/* panel nederst på væggen */}
    <rect x={-800} y={FLOOR - 560} width={RW + 1600} height={560} fill="#2a3436" />
    {Array.from({ length: 22 }).map((_, i) => (
      <rect key={i} x={-760 + i * 280} y={FLOOR - 520} width={240} height={440} fill="none" stroke="#1a2224" strokeWidth={6} />
    ))}
    {Array.from({ length: 22 }).map((_, i) => (
      <rect key={`h${i}`} x={-754 + i * 280} y={FLOOR - 514} width={240} height={3} fill="#5a6a6c" opacity={0.5} />
    ))}
    <rect x={-800} y={FLOOR - 574} width={RW + 1600} height={18} fill="#3a4648" />
    <rect x={-800} y={FLOOR - 70} width={RW + 1600} height={70} fill="#e8e2d6" />
    <rect x={-800} y={FLOOR - 70} width={RW + 1600} height={70} fill="url(#gWallShade)" />
    {/* stuk-loft */}
    <rect x={-800} y={-600} width={RW + 1600} height={640} fill="#1a1e22" />
    <rect x={-800} y={30} width={RW + 1600} height={30} fill="#d8d2c6" opacity={0.6} />
    <rect x={-800} y={60} width={RW + 1600} height={40} fill="url(#gShadowDown)" />
    {/* gulv */}
    <rect x={-800} y={FLOOR} width={RW + 1600} height={900} fill="url(#pWood)" />
    <rect x={-800} y={FLOOR} width={RW + 1600} height={900} fill="url(#gFloorShade)" />
    {/* tæppe under bordet */}
    <path d={`M1000,${FLOOR + 60} L2700,${FLOOR + 60} L2900,${FLOOR + 420} L800,${FLOOR + 420}Z`} fill="url(#pRug)" />
    <path d={`M1000,${FLOOR + 60} L2700,${FLOOR + 60} L2900,${FLOOR + 420} L800,${FLOOR + 420}Z`} fill="#000" opacity={0.35} />
    {/* pendel over bordet */}
    <g>
      <line x1={1860} y1={60} x2={1860} y2={420} stroke="#0c0c0e" strokeWidth={5} />
      <path d="M1740,520 Q1860,380 1980,520Z" fill="#1a1614" />
      <path d="M1740,520 Q1860,390 1980,520" stroke="#3a3028" strokeWidth={4} fill="none" />
      <ellipse cx={1860} cy={522} rx={120} ry={16} fill="#fff1c8" opacity={lamp} />
      <polygon points={`1745,520 1975,520 2400,${FLOOR + 200} 1320,${FLOOR + 200}`} fill="url(#gLampCone)" opacity={0.5 * lamp} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={1860} cy={1100} rx={900} ry={800} fill="url(#rLampPool)" opacity={lamp * (0.9 + beatPulse(t) * 0.05)} style={{ mixBlendMode: "screen" }} />
    </g>
  </g>
);

/* ---------- entré: dør + knagerække med hendes jakke (skjult hjerte i foret) ---------- */
export const Entry: React.FC<{ t: number; heart?: number }> = ({ heart = 0 }) => (
  <g>
    {/* dør */}
    <rect x={120} y={420} width={620} height={FLOOR - 420} fill="#e8e2d6" />
    <rect x={150} y={450} width={560} height={FLOOR - 450} fill="#3a2a1e" />
    {[0, 1].map((r) => (
      <g key={r}>
        <rect x={190} y={500 + r * 680} width={480} height={600} fill="none" stroke="#24180e" strokeWidth={10} />
        <rect x={196} y={506 + r * 680} width={468} height={6} fill="#5a4030" />
      </g>
    ))}
    <circle cx={660} cy={1220} r={18} fill="url(#gGold)" />
    <rect x={150} y={450} width={560} height={FLOOR - 450} fill="url(#gWallShade)" />
    {/* knagerække */}
    <rect x={820} y={640} width={360} height={30} fill="#3a2a1e" />
    {[870, 990, 1110].map((x) => (
      <circle key={x} cx={x} cy={680} r={10} fill="url(#gGold)" />
    ))}
    {/* hendes jakke på knagen */}
    <g transform="translate(990,680)">
      <path d="M-20,0 C-120,20 -150,120 -150,300 L-140,640 L140,640 L150,300 C150,120 120,20 20,0Z" fill="#c9b49a" />
      <path d="M-150,300 L-180,560 L-150,600 L-130,330Z M150,300 L180,560 L150,600 L130,330Z" fill="#b8a288" />
      <path d="M0,20 L-30,640 M0,20 L30,640" stroke="#8a7458" strokeWidth={4} />
      {/* foret åbner sig lidt: indersiden */}
      <path d="M0,40 L-26,630 L26,630Z" fill="#5a1a22" />
      {/* hjertet indeni */}
      <g transform={`translate(0,300) scale(${0.8 + heart * 0.4})`} opacity={0.25 + heart * 0.75}>
        <path d="M0,22 C-30,-4 -26,-34 0,-18 C26,-34 30,-4 0,22Z" fill="#ff3a5a" />
        <circle r={60} fill="url(#rRed)" opacity={heart} />
      </g>
      <path d="M-150,300 C-120,330 -60,340 -26,330" stroke="#a8927a" strokeWidth={4} fill="none" />
      <rect x={-140} y={430} width={70} height={60} rx={6} fill="none" stroke="#a8927a" strokeWidth={3} />
      <rect x={70} y={430} width={70} height={60} rx={6} fill="none" stroke="#a8927a" strokeWidth={3} />
      <path d="M-20,0 C-120,20 -150,120 -150,300 L-140,640 L140,640 L150,300 C150,120 120,20 20,0Z" fill="url(#gShadeR)" />
    </g>
    {/* nøgleskål + kommode */}
    <rect x={820} y={1360} width={380} height={540} fill="url(#gWoodFurn)" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={840} y={1390 + i * 170} width={340} height={150} fill="none" stroke="#1a1008" strokeWidth={5} />
        <circle cx={1010} cy={1465 + i * 170} r={9} fill="url(#gGold)" />
      </g>
    ))}
  </g>
);

/* ---------- skænk med pladespiller, højttalere, vægur, billeder, brændeovn ---------- */
export const RECORD = { x: 3100, y: 1290 };
export const Sideboard: React.FC = () => (
  <g>
    <rect x={2700} y={1350} width={800} height={550} fill="url(#gWoodFurn)" />
    <rect x={2690} y={1340} width={820} height={22} fill="#6a4428" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={2720 + i * 260} y={1390} width={240} height={480} fill="none" stroke="#1a1008" strokeWidth={6} />
        <rect x={2720 + i * 260 + 110} y={1600} width={20} height={60} rx={8} fill="url(#gGold)" />
      </g>
    ))}
    {/* højttalere */}
    {[2740, 3390].map((x) => (
      <g key={x}>
        <rect x={x - 70} y={1060} width={140} height={280} rx={10} fill="#1a1612" />
        <circle cx={x} cy={1130} r={36} fill="#0b0a0a" stroke="#3a3430" strokeWidth={4} />
        <circle cx={x} cy={1250} r={56} fill="#0b0a0a" stroke="#3a3430" strokeWidth={5} />
        <circle cx={x} cy={1250} r={18} fill="#2a2622" />
      </g>
    ))}
  </g>
);

export const Wall2: React.FC<{ t: number }> = () => (
  <g>
    {/* billeder af dem to (lykkeligere tider) */}
    {[[2780, 560, 220, 280], [3060, 620, 180, 220], [3300, 540, 240, 300]].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} fill="#1a1612" />
        <rect x={x} y={y} width={w} height={h} fill={["#c9a46a", "#8aa0b8", "#d8a080"][i]} />
        <rect x={x} y={y + h * 0.6} width={w} height={h * 0.4} fill="#000" opacity={0.2} />
        <ellipse cx={x + w * 0.38} cy={y + h * 0.42} rx={w * 0.11} ry={h * 0.11} fill="#2a1a12" />
        <ellipse cx={x + w * 0.62} cy={y + h * 0.4} rx={w * 0.11} ry={h * 0.12} fill="#1a0e08" />
        <path d={`M${x + w * 0.2},${y + h} Q${x + w * 0.38},${y + h * 0.5} ${x + w * 0.5},${y + h}Z M${x + w * 0.45},${y + h} Q${x + w * 0.62},${y + h * 0.5} ${x + w * 0.82},${y + h}Z`} fill="#2a1a12" />
        <rect x={x} y={y} width={w} height={h} fill="#fff" opacity={0.06} />
      </g>
    ))}
  </g>
);

export const Stove: React.FC<{ t: number; fire: number }> = ({ t, fire }) => (
  <g>
    <rect x={3780} y={1080} width={500} height={820} fill="#1a1a1e" />
    <rect x={3760} y={1060} width={540} height={36} fill="#2a2a30" />
    <rect x={3830} y={1250} width={400} height={360} rx={10} fill="#050506" stroke="#3a3a40" strokeWidth={10} />
    {/* ild */}
    <g opacity={fire}>
      <rect x={3840} y={1260} width={380} height={340} fill="#3a1200" />
      {Array.from({ length: 9 }).map((_, i) => {
        const fx = 3870 + i * 40;
        const fh = (120 + Math.sin(t * 9 + i * 1.7) * 40 + random(`fh${i}`) * 60) * fire;
        return <path key={i} d={`M${fx - 26},1590 Q${fx - 20},${1590 - fh * 0.6} ${fx + Math.sin(t * 6 + i) * 10},${1590 - fh} Q${fx + 22},${1590 - fh * 0.6} ${fx + 26},1590Z`} fill="url(#gFire)" />;
      })}
      <rect x={3860} y={1560} width={340} height={30} fill="#2a1408" />
      <ellipse cx={4030} cy={1430} rx={500} ry={420} fill="url(#rWarm)" opacity={0.9} style={{ mixBlendMode: "screen" }} />
    </g>
    <rect x={3830} y={1250} width={400} height={360} rx={10} fill="#8aa0c8" opacity={0.08} />
    <rect x={3840} y={1700} width={380} height={160} fill="#121216" />
    <rect x={3990} y={-600} width={80} height={1660} fill="#141418" />
  </g>
);
