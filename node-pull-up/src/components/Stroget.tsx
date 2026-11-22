import React from "react";
import { random } from "remotion";
import { W, PAL, beatPulse } from "../lib";

/**
 * Strøget om natten i ét-punkts-perspektiv.
 * camZ = kameraets position i dybden (bevæger sig fremad når den stiger).
 * Alle bygninger ligger på faste dybder, så scenen kan "køres igennem".
 */
type Props = { t: number; camZ?: number; vx?: number; vy?: number; people?: boolean; fogA?: number };

const FACADE = ["#8a6646", "#9c7550", "#6e5a49", "#87483a", "#5d6656", "#a38a62", "#7a5240", "#686f78"];
const SHOPS = ["CAFÉ", "UR & SMYKKER", "SKO", "BAGERI", "MODE", "PARFUME", "KIOSK", "BOGHANDEL", "GULD", "OPTIK"];

export const Stroget: React.FC<Props> = ({ t, camZ = 0, vx = W / 2, vy = 1020, people = true, fogA = 0.16 }) => {
  const GY = 2150; // jordlinje helt tæt på
  const TOP = -2600; // tagkant helt tæt på
  const P = (side: number, d: number, h: number): [number, number] => {
    const s = 1 / (1 + Math.max(d, -0.6));
    const xN = side < 0 ? -300 : W + 300;
    return [vx + (xN - vx) * s, vy + (GY + (TOP - GY) * h - vy) * s];
  };
  const Q = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");
  const els: React.ReactNode[] = [];
  const glows: React.ReactNode[] = [];
  const pools: React.ReactNode[] = [];
  const pulse = beatPulse(t);

  // himmel-stribe mellem tagene
  els.push(<rect key="sky" x={-200} y={-400} width={W + 400} height={vy + 400} fill="url(#sky)" />);

  // bygninger: fra langt væk mod kameraet (male bagfra)
  const blocks: { side: number; d0: number; d1: number; i: number }[] = [];
  for (const side of [-1, 1])
    for (let i = 0; i < 26; i++) {
      const D0 = i * 0.62 + (side > 0 ? 0.25 : 0);
      blocks.push({ side, d0: D0 - camZ, d1: D0 + 0.6 - camZ, i });
    }
  blocks.sort((a, b) => b.d0 - a.d0);
  for (const b of blocks) {
    if (b.d1 < -0.4 || b.d0 > 14) continue;
    const { side, i } = b;
    const d0 = Math.max(b.d0, -0.4),
      d1 = b.d1;
    const key = `${side}-${i}`;
    const hTop = 0.6 + random(`h${key}`) * 0.12;
    const col = FACADE[Math.floor(random(`c${key}`) * FACADE.length)];
    // facade
    els.push(<polygon key={`f${key}`} points={Q([P(side, d0, 0), P(side, d1, 0), P(side, d1, hTop), P(side, d0, hTop)])} fill={col} />);
    // mørkere skygge fra lyset nedefra
    els.push(<polygon key={`fs${key}`} points={Q([P(side, d0, 0), P(side, d1, 0), P(side, d1, hTop), P(side, d0, hTop)])} fill="url(#facadeShade)" />);
    els.push(<polygon key={`fd${key}`} points={Q([P(side, d0, 0), P(side, d1, 0), P(side, d1, hTop), P(side, d0, hTop)])} fill="#04050b" opacity={Math.min(0.75, Math.max(0, (d0 - 1) * 0.08))} />);
    // gesims-linjer
    for (const hh of [0.3, 0.31, hTop - 0.02]) {
      const a = P(side, d0, hh), c = P(side, d1, hh);
      els.push(<line key={`g${key}${hh}`} x1={a[0]} y1={a[1]} x2={c[0]} y2={c[1]} stroke="#000" strokeOpacity={0.4} strokeWidth={Math.max(1, 6 / (1 + Math.max(d0, 0)))} />);
    }
    // tagkant
    els.push(<polygon key={`r${key}`} points={Q([P(side, d0, hTop), P(side, d1, hTop), P(side, d1, hTop + 0.025), P(side, d0, hTop + 0.025)])} fill="#14161e" />);
    // vinduer på etagerne
    const cols = 3;
    const fh = (hTop - 0.33) / 5;
    for (let fl = 0; fl < 5; fl++) {
      const h0 = 0.345 + fl * fh;
      if (h0 + 0.05 > hTop) continue;
      for (let c = 0; c < cols; c++) {
        const u0 = 0.12 + c * 0.29, u1 = u0 + 0.14;
        const dd0 = d0 + (d1 - d0) * u0, dd1 = d0 + (d1 - d0) * u1;
        if (dd0 < -0.3) continue;
        const k = `${key}-${fl}-${c}`;
        const lit = random(`w${k}`);
        const on = lit < 0.42;
        const warm = random(`ww${k}`) < 0.8;
        els.push(
          <polygon key={`wf${k}`} points={Q([P(side, dd0, h0), P(side, dd1, h0), P(side, dd1, h0 + fh * 0.62), P(side, dd0, h0 + fh * 0.62)])} fill={on ? (warm ? "#ffcf86" : "#a9c6ff") : "#121826"} opacity={on ? 0.6 + lit : 1} />,
        );
        // vinduessprosser
        const m0 = P(side, (dd0 + dd1) / 2, h0), m1 = P(side, (dd0 + dd1) / 2, h0 + fh * 0.62);
        els.push(<line key={`ws${k}`} x1={m0[0]} y1={m0[1]} x2={m1[0]} y2={m1[1]} stroke="#1a1410" strokeWidth={Math.max(1, 4 / (1 + Math.max(dd0, 0)))} />);
        const s0 = P(side, dd0, h0 - 0.004), s1 = P(side, dd1, h0 - 0.004);
        els.push(<line key={`wl${k}`} x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]} stroke="#d8cbb4" strokeOpacity={0.35} strokeWidth={Math.max(1, 5 / (1 + Math.max(dd0, 0)))} />);
      }
    }
    // butiksfacade i stueetagen
    const su0 = d0 + (d1 - d0) * 0.08, su1 = d0 + (d1 - d0) * 0.92;
    if (su1 > -0.3) {
      const warmShop = random(`sh${key}`) < 0.7;
      els.push(<polygon key={`sg${key}`} points={Q([P(side, su0, 0.02), P(side, su1, 0.02), P(side, su1, 0.2), P(side, su0, 0.2)])} fill={warmShop ? "#ffe2b0" : "#dfe9ff"} opacity={0.9} />);
      // varer i vinduet (silhuetter)
      for (let k = 0; k < 4; k++) {
        const a = su0 + (su1 - su0) * (0.1 + k * 0.22), b2 = a + (su1 - su0) * 0.12;
        els.push(<polygon key={`it${key}${k}`} points={Q([P(side, a, 0.04), P(side, b2, 0.04), P(side, b2, 0.08 + random(`it${key}${k}`) * 0.07), P(side, a, 0.08 + random(`it${key}${k}`) * 0.07)])} fill="#2a2018" opacity={0.6} />);
      }
      // sprosser
      for (let k = 1; k < 4; k++) {
        const a = P(side, su0 + ((su1 - su0) * k) / 4, 0.02), c2 = P(side, su0 + ((su1 - su0) * k) / 4, 0.2);
        els.push(<line key={`mu${key}${k}`} x1={a[0]} y1={a[1]} x2={c2[0]} y2={c2[1]} stroke="#1b1610" strokeWidth={Math.max(1, 8 / (1 + Math.max(su0, 0)))} />);
      }
      // skiltebånd
      els.push(<polygon key={`sb${key}`} points={Q([P(side, su0, 0.215), P(side, su1, 0.215), P(side, su1, 0.26), P(side, su0, 0.26)])} fill="#0d0f16" />);
      const mid = P(side, (su0 + su1) / 2, 0.226);
      const sc = 1 / (1 + Math.max((su0 + su1) / 2, 0));
      if (sc > 0.3 && (su0 + su1) / 2 < 2.4)
        els.push(
          <text key={`st${key}`} x={mid[0]} y={mid[1] + 14 * sc} fontFamily="Playfair" fontStyle="italic" fontSize={70 * sc} fill={warmShop ? "#ffd9a0" : "#e8f0ff"} textAnchor="middle" opacity={0.92}>
            {SHOPS[Math.floor(random(`sn${key}`) * SHOPS.length)]}
          </text>,
        );
      // lys fra butikken ud på brostenene
      const g0 = P(side, (su0 + su1) / 2, 0);
      pools.push(<ellipse key={`gl${key}`} cx={g0[0] - side * 80 * sc} cy={g0[1] + 20 * sc} rx={420 * sc} ry={110 * sc} fill={warmShop ? PAL.amber : "#9fc2ff"} opacity={0.22} />);
    }
  }

  // gaden (brosten)
  const road: React.ReactNode[] = [];
  const l0 = P(-1, -0.4, 0), r0 = P(1, -0.4, 0), l1 = P(-1, 14, 0), r1 = P(1, 14, 0);
  road.push(<polygon key="road" points={Q([l1, r1, r0, l0])} fill="url(#cobble)" />);
  for (let row = 0; row < 90; row++) {
    const D = row * 0.14;
    const d = D - (camZ % 0.14);
    if (d < -0.35) continue;
    const s = 1 / (1 + d);
    const y = vy + (GY - vy) * s;
    const xl = P(-1, d, 0)[0], xr = P(1, d, 0)[0];
    const n = 34;
    for (let k = 0; k < n; k++) {
      const x = xl + ((xr - xl) * (k + (row % 2) * 0.5)) / n;
      road.push(<ellipse key={`cb${row}-${k}`} cx={x} cy={y} rx={((xr - xl) / n) * 0.36} ry={9 * s} fill="#3a3448" opacity={0.28} />);
    }
  }

  // hængende gadelamper på wire midt over gaden + lyskæder
  const wires: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const D = i * 1.0 + 0.5;
    const d = D - camZ;
    if (d < -0.3 || d > 13) continue;
    const s = 1 / (1 + d);
    const a = P(-1, d, 0.42), b = P(1, d, 0.42);
    const sag = 180 * s;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + sag;
    wires.push(<path key={`w${i}`} d={`M${a[0]},${a[1]} Q${mx},${my + sag} ${b[0]},${b[1]}`} stroke="#0a0b10" strokeWidth={Math.max(1, 5 * s)} fill="none" />);
    // lampe
    const ly = my + 30 * s;
    wires.push(
      <g key={`l${i}`}>
        <path d={`M${mx - 60 * s},${ly} L${mx + 60 * s},${ly} L${mx + 30 * s},${ly - 40 * s} L${mx - 30 * s},${ly - 40 * s} Z`} fill="#11131b" />
        <ellipse cx={mx} cy={ly + 4 * s} rx={46 * s} ry={10 * s} fill="#fff1d0" />
      </g>,
    );
    glows.push(<circle key={`lg${i}`} cx={mx} cy={ly} r={520 * s} fill="url(#glowAmber)" opacity={0.5} />);
    pools.push(<ellipse key={`lp${i}`} cx={mx} cy={vy + (GY - vy) * s} rx={500 * s} ry={80 * s} fill={PAL.amber} opacity={0.18} />);
    pools.push(<ellipse key={`lr${i}`} cx={mx} cy={vy + (GY - vy) * s + 160 * s} rx={60 * s} ry={260 * s} fill="#ffd28a" opacity={0.2} filter="url(#blur6)" />);
    // lyskæde (sænket kurve med pærer) halvvejs til næste lampe
    const d2 = d + 0.5;
    if (d2 > -0.2) {
      const s2 = 1 / (1 + d2);
      const a2 = P(-1, d2, 0.36), b2 = P(1, d2, 0.36);
      const sag2 = 140 * s2;
      wires.push(<path key={`sw${i}`} d={`M${a2[0]},${a2[1]} Q${(a2[0] + b2[0]) / 2},${(a2[1] + b2[1]) / 2 + sag2 * 2} ${b2[0]},${b2[1]}`} stroke="#0a0b10" strokeWidth={Math.max(1, 3 * s2)} fill="none" />);
      for (let k = 1; k < 22; k++) {
        const u = k / 22;
        const x = (1 - u) * (1 - u) * a2[0] + 2 * u * (1 - u) * ((a2[0] + b2[0]) / 2) + u * u * b2[0];
        const y = (1 - u) * (1 - u) * a2[1] + 2 * u * (1 - u) * ((a2[1] + b2[1]) / 2 + sag2 * 2) + u * u * b2[1];
        const tw = 0.6 + 0.4 * Math.sin(t * 3 + k * 1.7 + i) + pulse * 0.3;
        wires.push(<circle key={`bu${i}-${k}`} cx={x} cy={y + 6 * s2} r={Math.max(1.5, 9 * s2)} fill="#fff3d6" opacity={tw} />);
        if (k % 2 === 0) glows.push(<circle key={`bg${i}-${k}`} cx={x} cy={y + 6 * s2} r={70 * s2} fill="url(#glowAmber)" opacity={0.45 * tw} />);
      }
    }
  }

  // fodgængere langt væk (bløde silhuetter)
  const ppl: React.ReactNode[] = [];
  if (people)
    for (let i = 0; i < 16; i++) {
      const D = 3 + random(`pd${i}`) * 9;
      const d = D - camZ * 0.6;
      if (d < 1.2) continue;
      const s = 1 / (1 + d);
      const lane = random(`pl${i}`) * 1.6 - 0.8;
      const walk = Math.sin(t * 4 + i) * 0.03;
      const x = vx + lane * (W * 0.7) * s + (random(`pv${i}`) - 0.5) * t * 40 * s;
      const y = vy + (GY - vy) * s;
      const h = 900 * s;
      ppl.push(
        <g key={`p${i}`} opacity={0.85}>
          <ellipse cx={x} cy={y - h * 0.86} rx={h * 0.07} ry={h * 0.085} fill="#0a0b12" />
          <path d={`M${x - h * 0.13},${y - h * 0.76} Q${x},${y - h * 0.82} ${x + h * 0.13},${y - h * 0.76} L${x + h * 0.11},${y - h * 0.4} L${x - h * 0.11},${y - h * 0.4} Z`} fill="#0a0b12" />
          <path d={`M${x - h * 0.09},${y - h * 0.42} L${x - h * (0.07 + walk)},${y} L${x - h * 0.02},${y} L${x},${y - h * 0.3} L${x + h * 0.02},${y} L${x + h * (0.07 + walk)},${y} L${x + h * 0.09},${y - h * 0.42} Z`} fill="#0a0b12" />
        </g>,
      );
    }

  return (
    <g>
      {els}
      {road}
      <g style={{ mixBlendMode: "screen" }} filter="url(#blur30)" opacity={0.8}>{pools}</g>
      <g style={{ mixBlendMode: "screen" }}>{glows}</g>
      <g filter="url(#blur6)">{ppl}</g>
      {wires}
      <g filter="url(#blur30)">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={((i * 500 + t * 26) % 1800) - 300} cy={vy + 80 + i * 40} rx={600} ry={150} fill="#7f8db8" opacity={fogA} />
        ))}
      </g>
    </g>
  );
};
