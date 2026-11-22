import React from "react";
import { random } from "remotion";
import { W, H } from "../lib";

/**
 * Helkrops-person (realistiske proportioner, 100 enheder høj, fødder i 0,0).
 * pose: hvordan armene står. top: hættetrøje/dunjakke. head: kasket/hue/hætte/bart hår.
 */
export type Pose = "pockets" | "deal" | "phone" | "smoke" | "cross" | "walk" | "hang";
export type PersonOpts = {
  pose?: Pose;
  skin?: string;
  top?: string;
  pants?: string;
  shoes?: string;
  head?: "cap" | "beanie" | "hood" | "hair" | "curls";
  headCol?: string;
  puffer?: boolean;
  face?: -1 | 0 | 1; // -1 venstre, 0 forfra, 1 højre
  rim?: string;
  t?: number;
  seed?: number;
  item?: "cash" | "bag" | null; // hvad hånden holder (handel)
  flip?: boolean;
};

export const Person: React.FC<{ x: number; y: number; h: number } & PersonOpts> = ({
  x,
  y,
  h,
  pose = "pockets",
  skin = "#b07a52",
  top = "#1d2230",
  pants = "#20242c",
  shoes = "#ececec",
  head = "hood",
  headCol,
  puffer = false,
  face = 0,
  rim = "#ffcf8a",
  t = 0,
  seed = 0,
  item = null,
  flip = false,
}) => {
  const s = h / 100;
  const sway = Math.sin(t * 1.3 + seed) * 0.8;
  const walk = pose === "walk" ? Math.sin(t * 7 + seed) : 0;
  const hc = headCol ?? top;
  const W2 = puffer ? 21 : 18;
  // arm-punkter: skulder → albue → hånd
  const arm = (side: -1 | 1): [number, number, number, number, number, number] => {
    const sx = side * (W2 - 2), sy = -78;
    switch (pose) {
      case "pockets": return [sx, sy, side * (W2 + 1), -62, side * 10, -50];
      case "cross": return [sx, sy, side * (W2 - 1), -60, side * -8, -60];
      case "phone": return side === 1 ? [sx, sy, side * 17, -58, 3, -66] : [sx, sy, side * (W2 + 1), -60, side * 16, -46];
      case "smoke": return side === 1 ? [sx, sy, side * 20, -68, 4, -86] : [sx, sy, side * (W2 + 1), -60, side * 15, -46];
      case "deal": return side === 1 ? [sx, sy, side * 26, -66, side * 40, -62] : [sx, sy, side * (W2 + 1), -60, side * 12, -48];
      case "hang": return [sx, sy, side * (W2 + 2), -60, side * (W2 + 1), -44];
      case "walk": return [sx, sy, side * (W2 + 1) + walk * side * 4, -61, side * (W2 - 1) + walk * side * 8, -45];
    }
  };
  const legs = (k: number) => {
    const lx = k * 7;
    const sw = pose === "walk" ? walk * k * 7 : 0;
    return `M${lx - 7},-46 L${lx - 5.5 + sw},-4 L${lx + 5 + sw},-4 L${lx + 6.5},-46 Z`;
  };
  const body = puffer
    ? `M${-W2},-78 Q${-W2 - 3},-60 ${-W2 + 1},-44 Q0,-41 ${W2 - 1},-44 Q${W2 + 3},-60 ${W2},-78 Q0,-85 ${-W2},-78 Z`
    : `M${-W2},-78 Q${-W2 - 1},-62 ${-W2 + 2},-44 Q0,-42 ${W2 - 2},-44 Q${W2 + 1},-62 ${W2},-78 Q0,-84 ${-W2},-78 Z`;
  const headY = -91;
  const shape = (fill: string) => (
    <g fill={fill}>
      <path d={legs(-1)} />
      <path d={legs(1)} />
      <path d={body} />
      <rect x={-4} y={-84} width={8} height={7} />
      <ellipse cx={face * 1.2} cy={headY} rx={7.2} ry={8.6} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${sway},0,0)`}>
      <ellipse cx={4} cy={0.6} rx={16} ry={2.4} fill="#000" opacity={0.45} />
      {/* lyskant */}
      <g transform="translate(-0.7,-0.3)" opacity={0.55}>{shape(rim)}</g>
      {/* ben + sko */}
      <path d={legs(-1)} fill={pants} />
      <path d={legs(1)} fill={pants} />
      {[-1, 1].map((k) => (
        <g key={k}>
          <path d={`M${k * 7 - 6 + (pose === "walk" ? walk * k * 7 : 0)},-4 L${k * 7 + 7 + (pose === "walk" ? walk * k * 7 : 0)},-4 L${k * 7 + 9 + (pose === "walk" ? walk * k * 7 : 0)},0 L${k * 7 - 6 + (pose === "walk" ? walk * k * 7 : 0)},0 Z`} fill={shoes} />
          <rect x={k * 7 - 6 + (pose === "walk" ? walk * k * 7 : 0)} y={-1.2} width={15} height={1.2} fill="#9a9a9a" />
        </g>
      ))}
      {/* krop */}
      <path d={body} fill={top} />
      {puffer && [-70, -62, -54].map((yy) => <path key={yy} d={`M${-W2},${yy} Q0,${yy + 2} ${W2},${yy}`} stroke="#000" strokeOpacity={0.35} strokeWidth={0.7} fill="none" />)}
      {!puffer && <path d="M-6,-50 L6,-50 L6,-56 L-6,-56 Z" fill="#000" opacity={0.18} />}
      <line x1={0} y1={-80} x2={0} y2={-44} stroke="#000" strokeOpacity={0.25} strokeWidth={0.6} />
      {/* arme */}
      {([-1, 1] as const).map((k) => {
        const [sx, sy, ex, ey, hx, hy] = arm(k);
        return (
          <g key={k}>
            <path d={`M${sx},${sy} L${ex},${ey} L${hx},${hy}`} stroke={top} strokeWidth={puffer ? 8.5 : 7.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M${sx},${sy} L${ex},${ey}`} stroke={rim} strokeOpacity={0.35} strokeWidth={1.2} fill="none" transform="translate(-3,0)" />
            {pose !== "pockets" && !(pose === "cross") && <circle cx={hx} cy={hy} r={3} fill={skin} />}
            {pose === "deal" && k === 1 && item === "cash" && <rect x={hx - 2} y={hy - 4} width={9} height={5} rx={0.6} fill="#b9c99a" stroke="#6a7a4a" strokeWidth={0.5} />}
            {pose === "deal" && k === 1 && item === "bag" && <rect x={hx} y={hy - 3} width={4} height={4} rx={0.6} fill="#f2f2f2" opacity={0.9} />}
            {pose === "phone" && k === 1 && <rect x={hx - 3} y={hy - 6} width={6} height={10} rx={1.2} fill="#0b0b10" stroke="#5a6a9a" strokeWidth={0.4} />}
            {pose === "phone" && k === 1 && <circle cx={hx} cy={hy - 2} r={10} fill="#8fb4ff" opacity={0.12} />}
            {pose === "smoke" && k === 1 && (
              <g>
                <line x1={hx} y1={hy} x2={hx + 5} y2={hy - 1} stroke="#eee" strokeWidth={1.2} />
                <circle cx={hx + 5.4} cy={hy - 1} r={0.9 + 0.4 * Math.abs(Math.sin(t * 2))} fill="#ff7a2a" />
                {[0, 1, 2, 3].map((q) => (
                  <circle key={q} cx={hx + 6 + Math.sin(t * 2 + q) * 2 + q * 0.6} cy={hy - 4 - q * 5 - ((t * 6) % 5)} r={1.5 + q * 0.8} fill="#cfd4dd" opacity={0.25 - q * 0.05} />
                ))}
              </g>
            )}
          </g>
        );
      })}
      {/* hals + hoved */}
      <rect x={-3.5} y={-84} width={7} height={7} fill={skin} />
      <ellipse cx={face * 1.2} cy={headY} rx={7.2} ry={8.6} fill={skin} />
      {face === 0 ? (
        <g>
          <circle cx={-2.6} cy={headY - 0.6} r={0.75} fill="#1a0e08" />
          <circle cx={2.6} cy={headY - 0.6} r={0.75} fill="#1a0e08" />
          <path d={`M-3.8,${headY - 2.4} L-1.6,${headY - 2.8} M1.6,${headY - 2.8} L3.8,${headY - 2.4}`} stroke="#1a0e08" strokeWidth={0.7} />
          <path d={`M-1.6,${headY + 4} Q0,${headY + 4.8} 1.6,${headY + 4}`} stroke="#5a2a20" strokeWidth={0.6} fill="none" />
        </g>
      ) : (
        <g>
          <circle cx={face * 4} cy={headY - 0.6} r={0.75} fill="#1a0e08" />
          <path d={`M${face * 7},${headY} L${face * 8.6},${headY + 1.6} L${face * 7},${headY + 2.2}`} fill={skin} />
        </g>
      )}
      {head === "cap" && (
        <g>
          <path d={`M-7.6,${headY - 2} Q-7.4,${headY - 10} 0,${headY - 10.5} Q7.4,${headY - 10} 7.6,${headY - 2} Z`} fill={hc} />
          <path d={`M${face >= 0 ? -1 : -12},${headY - 2.4} L${face >= 0 ? 12 : 1},${headY - 2.4} L${face >= 0 ? 11 : 0},${headY - 0.8} L${face >= 0 ? -1 : -11},${headY - 0.8} Z`} fill={hc} />
        </g>
      )}
      {head === "beanie" && <path d={`M-7.8,${headY - 1.5} Q-8,${headY - 12} 0,${headY - 12.5} Q8,${headY - 12} 7.8,${headY - 1.5} Z`} fill={hc} />}
      {head === "hood" && (
        <path d={`M-9.5,${headY + 6} Q-11,${headY - 12} 0,${headY - 12} Q11,${headY - 12} 9.5,${headY + 6} L7,${headY + 2} Q7.4,${headY - 8} 0,${headY - 8.6} Q-7.4,${headY - 8} -7,${headY + 2} Z`} fill={hc} />
      )}
      {head === "hair" && <path d={`M-7.4,${headY - 1} Q-7.6,${headY - 10.5} 0,${headY - 10.6} Q7.6,${headY - 10.5} 7.4,${headY - 1} Q4,${headY - 6} 0,${headY - 6.5} Q-4,${headY - 6} -7.4,${headY - 1} Z`} fill="#140d09" />}
      {head === "curls" && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-6 + (i % 5) * 3} cy={headY - 8 + Math.floor(i / 5) * 3} r={2.8} fill="#140d09" />)}
    </g>
  );
};

/** Alment boligbyggeri: betonblok i skumring med altaner, paraboler, lys i vinduer */
export const HousingBlock: React.FC<{ x: number; y: number; w: number; floors: number; t: number; seed: string; depth?: number }> = ({ x, y, w, floors, t, seed, depth = 1 }) => {
  const fh = 120;
  const cols = Math.floor(w / 130);
  const els: React.ReactNode[] = [];
  els.push(<rect key="f" x={x} y={y - floors * fh} width={w} height={floors * fh} fill="url(#concrete)" />);
  els.push(<rect key="s" x={x} y={y - floors * fh} width={w} height={floors * fh} fill="url(#duskShade)" />);
  for (let f = 0; f < floors; f++)
    for (let c = 0; c < cols; c++) {
      const wx = x + 25 + c * 130, wy = y - (f + 1) * fh + 22;
      const k = `${seed}${f}-${c}`;
      const on = random(k) < 0.45;
      const warm = random(`${k}w`) < 0.75;
      const tv = random(`${k}tv`) < 0.12;
      els.push(<rect key={`w${k}`} x={wx} y={wy} width={80} height={62} fill={on ? (warm ? "#ffcf86" : "#a9c6ff") : "#1b2234"} opacity={on ? 0.95 : 1} />);
      if (tv) els.push(<rect key={`tv${k}`} x={wx} y={wy} width={80} height={62} fill="#7fb0ff" opacity={0.25 + 0.25 * Math.abs(Math.sin(t * 7 + c))} />);
      els.push(<line key={`m${k}`} x1={wx + 40} y1={wy} x2={wx + 40} y2={wy + 62} stroke="#cfcac2" strokeWidth={3} />);
      // altan med rækværk
      if (c % 2 === 0) {
        els.push(<rect key={`b${k}`} x={wx - 12} y={wy + 62} width={104} height={34} fill="#b9b4ac" />);
        els.push(<rect key={`bs${k}`} x={wx - 12} y={wy + 92} width={104} height={6} fill="#6f6a64" />);
        if (random(`${k}p`) < 0.3) els.push(<g key={`pd${k}`}><circle cx={wx + 70} cy={wy + 52} r={16} fill="#e8e8e8" stroke="#9a9a9a" /><line x1={wx + 70} y1={wy + 52} x2={wx + 82} y2={wy + 46} stroke="#666" strokeWidth={2} /></g>);
        if (random(`${k}l`) < 0.2)
          els.push(<path key={`ld${k}`} d={`M${wx - 8},${wy + 66} L${wx + 88},${wy + 66}`} stroke="#555" strokeWidth={1.5} />, ...[0, 1, 2].map((q) => <rect key={`lx${k}${q}`} x={wx + q * 28} y={wy + 66} width={20} height={22} fill={["#c0392b", "#ecf0f1", "#2980b9"][q]} />));
      }
    }
  // trappeopgang med lys
  els.push(<rect key="op" x={x + w / 2 - 40} y={y - floors * fh} width={80} height={floors * fh} fill="#6f6a64" opacity={0.3} />);
  for (let f = 0; f < floors; f++) els.push(<rect key={`op${f}`} x={x + w / 2 - 22} y={y - (f + 1) * fh + 30} width={44} height={60} fill="#e6f0ff" opacity={0.8} />);
  els.push(<rect key="door" x={x + w / 2 - 34} y={y - 100} width={68} height={100} fill="#3a3f48" />);
  els.push(<circle key="dl" cx={x + w / 2} cy={y - 110} r={70} fill="url(#sunGlow)" opacity={0.5} />);
  return <g opacity={depth}>{els}</g>;
};

/** Hele miljøet: blokken i skumring, parkeringsplads, gadelamper, garager med graffiti, legeplads */
export const Estate: React.FC<{ t: number; cam?: number }> = ({ t, cam = 0 }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#duskSky)" />
    {Array.from({ length: 40 }).map((_, i) => (
      <circle key={i} cx={random(`s${i}`) * W} cy={random(`sy${i}`) * 500} r={1 + random(`sr${i}`) * 1.5} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />
    ))}
    <g transform={`translate(${-cam * 0.3},0)`}>
      <HousingBlock x={-200} y={1150} w={700} floors={8} t={t} seed="a" depth={0.85} />
      <HousingBlock x={560} y={1100} w={720} floors={7} t={t} seed="b" depth={0.85} />
    </g>
    <g transform={`translate(${-cam * 0.6},0)`}>
      {/* garager med graffiti */}
      <rect x={-200} y={1150} width={W + 400} height={260} fill="#6c6a70" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={-180 + i * 200} y={1180} width={180} height={230} fill="#7a7880" stroke="#55535a" strokeWidth={4} />
      ))}
      <text x={60} y={1340} fontFamily="Anton" fontSize={120} fill="#e74c3c" opacity={0.75} transform="rotate(-5,60,1340)">
        BLOKKEN
      </text>
      <text x={640} y={1320} fontFamily="Anton" fontSize={90} fill="#3498db" opacity={0.65} transform="rotate(4,640,1320)">
        2200
      </text>
      <path d="M560,1220 q40,-40 80,0 t80,0" stroke="#f1c40f" strokeWidth={10} fill="none" opacity={0.6} />
    </g>
    {/* parkeringsplads */}
    <rect x={-300} y={1400} width={W + 600} height={900} fill="#2c2d33" />
    {Array.from({ length: 7 }).map((_, i) => (
      <line key={i} x1={-100 + i * 220} y1={1420} x2={-160 + i * 240} y2={1560} stroke="#d8d6cf" strokeWidth={5} opacity={0.45} />
    ))}
    {/* parkeret bil (mørk) */}
    <g transform="translate(860,1560)">
      <path d="M-230,0 L-230,-60 Q-220,-80 -170,-84 L-110,-130 L100,-130 L160,-84 Q220,-80 230,-60 L230,0 Z" fill="#14161c" />
      <path d="M-100,-124 L-50,-124 L-50,-86 L-150,-86 Z M-36,-124 L90,-124 L140,-86 L-36,-86 Z" fill="#26324e" />
      <circle cx={-140} cy={0} r={38} fill="#0a0a0c" />
      <circle cx={140} cy={0} r={38} fill="#0a0a0c" />
      <circle cx={-140} cy={0} r={18} fill="#6a6f7a" />
      <circle cx={140} cy={0} r={18} fill="#6a6f7a" />
      <rect x={210} y={-62} width={20} height={12} fill="#ff3a3a" />
      <path d="M-230,-62 L230,-62" stroke="#ffcf8a" strokeOpacity={0.35} strokeWidth={3} />
    </g>
    {/* gadelamper */}
    {[120, 980].map((lx, i) => (
      <g key={i}>
        <rect x={lx - 6} y={980} width={12} height={560} fill="#18181c" />
        <rect x={lx - 40} y={970} width={80} height={18} rx={6} fill="#18181c" />
        <circle cx={lx} cy={990} r={340} fill="url(#sunGlow)" opacity={0.55 + Math.sin(t * 13 + i) * 0.03} />
        <polygon points={`${lx - 30},988 ${lx + 30},988 ${lx + 260},1700 ${lx - 260},1700`} fill="#ffd89a" opacity={0.12} />
        <ellipse cx={lx} cy={1640} rx={300} ry={60} fill="#ffcf8a" opacity={0.18} />
      </g>
    ))}
    {/* bænk + legeplads-gynge i baggrunden */}
    <g transform="translate(470,1480)">
      <rect x={-110} y={-40} width={220} height={14} fill="#6e4e30" />
      <rect x={-110} y={-70} width={220} height={12} fill="#6e4e30" />
      <rect x={-100} y={-26} width={10} height={36} fill="#333" />
      <rect x={90} y={-26} width={10} height={36} fill="#333" />
    </g>
    <path d="M270,1420 L300,1300 L380,1300 L410,1420" stroke="#c0392b" strokeWidth={8} fill="none" opacity={0.7} />
    <line x1={340} y1={1300} x2={340 + Math.sin(t * 1.4) * 14} y2={1380} stroke="#888" strokeWidth={3} />
    <rect x={325 + Math.sin(t * 1.4) * 14} y={1380} width={30} height={8} fill="#333" />
    {/* løv/skrald */}
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={random(`tr${i}`) * W} y={1700 + random(`ty${i}`) * 200} width={14} height={8} fill={["#c0392b", "#ecf0f1", "#f1c40f"][i % 3]} opacity={0.5} transform={`rotate(${i * 37},${random(`tr${i}`) * W},${1700 + random(`ty${i}`) * 200})`} />
    ))}
  </g>
);
