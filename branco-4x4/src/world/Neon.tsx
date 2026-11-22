import React from "react";
import { random } from "remotion";
import { beatPulse } from "../lib";

/** 2,5D neon-gade i perspektiv. Skærm 1080x1920, forsvindingspunkt (540, HZ). Kameraet kører langsomt frem. */
export const HZ = 960;
const F = 720; // brændvidde
const CAMH = 340; // kamerahøjde over jorden
const SW = 560; // halv gadebredde (facadernes x)
const SEG = 420; // facade-segment langs z
const N = 16;

export type Pal = { sky0: string; sky1: string; haze: string; a: string; b: string; c: string; win: string };
export const PALS: Record<string, Pal> = {
  purple: { sky0: "#0a0418", sky1: "#3a1250", haze: "#ff5ab4", a: "#ff3dc8", b: "#3de0ff", c: "#ffb347", win: "#ffcf86" },
  red: { sky0: "#12040a", sky1: "#4a0e1e", haze: "#ff4a4a", a: "#ff2a4a", b: "#ffb347", c: "#ff6ad5", win: "#ffb070" },
  cyan: { sky0: "#020a18", sky1: "#0e2a4a", haze: "#3de0ff", a: "#3de0ff", b: "#ff3dc8", c: "#a8ff6a", win: "#c8e8ff" },
  gold: { sky0: "#0e0804", sky1: "#3a2410", haze: "#ffb347", a: "#ffc861", b: "#ff6ad5", c: "#3de0ff", win: "#ffd9a0" },
};

const P = (x: number, y: number, z: number): [number, number] => [540 + (F * x) / z, HZ + (F * (y + CAMH)) / z];

const SIGNS = ["DISKO", "24/7", "KIOSK", "GRILL", "BAR", "NAT", "HOTEL", "FRISØR", "LOUNGE", "SHISHA", "CAFÉ", "VASK"];

export const NeonDefs: React.FC<{ pal: Pal }> = ({ pal }) => (
  <defs>
    <linearGradient id="nSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={pal.sky0} />
      <stop offset="0.85" stopColor={pal.sky1} />
      <stop offset="1" stopColor={pal.haze} stopOpacity="0.6" />
    </linearGradient>
    <linearGradient id="nGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={pal.sky1} />
      <stop offset="0.25" stopColor="#140a1e" />
      <stop offset="1" stopColor="#05030a" />
    </linearGradient>
    <radialGradient id="nHaze" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={pal.haze} stopOpacity="0.55" />
      <stop offset="1" stopColor={pal.haze} stopOpacity="0" />
    </radialGradient>
    <filter id="nGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="a" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="a" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="nSoft"><feGaussianBlur stdDeviation="10" /></filter>
  </defs>
);

export const NeonStreet: React.FC<{ t: number; pal: Pal; speed?: number; lights?: number }> = ({ t, pal, speed = 120, lights = 1 }) => {
  const dz = t * speed;
  const bp = beatPulse(t);
  const els: React.ReactNode[] = [];
  const glow: React.ReactNode[] = [];
  const refl: React.ReactNode[] = [];
  // fra bagerst til forrest
  for (let k = N - 1; k >= 0; k--) {
    const idx = Math.floor(dz / SEG) + k;
    const z0 = idx * SEG - dz + 260;
    const z1 = z0 + SEG;
    if (z1 < 60) continue;
    const zn = Math.max(z0, 60);
    for (const side of [-1, 1]) {
      const s = `${idx}${side}`;
      const h = 900 + random(`h${s}`) * 1500;
      const X = side * SW;
      const a = P(X, 0, zn), b = P(X, 0, z1), c = P(X, -h, z1), d = P(X, -h, zn);
      const shade = 0.4 + random(`c${s}`) * 0.4;
      const col = `rgb(${Math.round(30 * shade + 10)},${Math.round(14 * shade + 6)},${Math.round(44 * shade + 14)})`;
      els.push(<path key={`f${s}`} d={`M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]} L${d[0]},${d[1]}Z`} fill={col} />);
      // fuge mellem segmenter
      els.push(<path key={`e${s}`} d={`M${a[0]},${a[1]} L${d[0]},${d[1]}`} stroke="#05020a" strokeWidth={Math.max(1, 3000 / zn)} />);
      // vinduer i facaden
      const rows = Math.floor(h / 140);
      for (let r = 0; r < rows; r++)
        for (let cI = 0; cI < 3; cI++) {
          const ws = `${s}-${r}-${cI}`;
          const lit = random(ws);
          if (lit > 0.42) continue;
          const wz0 = z0 + 40 + cI * 125, wz1 = wz0 + 70;
          if (wz0 < 60) continue;
          const wy0 = -200 - r * 140, wy1 = wy0 - 80;
          const p1 = P(X, wy0, wz0), p2 = P(X, wy0, wz1), p3 = P(X, wy1, wz1), p4 = P(X, wy1, wz0);
          const wc = lit < 0.08 ? pal.a : lit < 0.13 ? pal.b : pal.win;
          els.push(<path key={`w${ws}`} d={`M${p1[0]},${p1[1]} L${p2[0]},${p2[1]} L${p3[0]},${p3[1]} L${p4[0]},${p4[1]}Z`} fill={wc} opacity={0.35 + lit} />);
        }
      // lodret neonskilt der stikker ud fra facaden (vender mod kameraet)
      if (random(`sg${s}`) < 0.75) {
        const sz = z0 + 120 + random(`sz${s}`) * 180;
        if (sz > 90) {
          const sx = X - side * 70;
          const sy = -320 - random(`sy${s}`) * 500;
          const [px, py] = P(sx, sy, sz);
          const sc = F / sz;
          const txt = SIGNS[Math.floor(random(`st${s}`) * SIGNS.length)];
          const cc = [pal.a, pal.b, pal.c][Math.floor(random(`sc${s}`) * 3)];
          const vert = random(`sv${s}`) < 0.6;
          const w = vert ? 64 : 34 * txt.length, hh = vert ? 46 * txt.length + 30 : 70;
          const flick = random(`fl${s}`) < 0.15 ? (Math.sin(t * 23 + idx) > 0.6 ? 0.3 : 1) : 1;
          glow.push(
            <g key={`s${s}`} transform={`translate(${px},${py}) scale(${sc})`} opacity={flick * lights}>
              <rect x={-w / 2} y={-hh / 2} width={w} height={hh} rx={8} fill="#0a0410" stroke={cc} strokeWidth={5} />
              {vert ? (
                txt.split("").map((ch, i) => (
                  <text key={i} x={0} y={-hh / 2 + 52 + i * 46} textAnchor="middle" fontFamily="Anton" fontSize={42} fill={cc}>{ch}</text>
                ))
              ) : (
                <text x={0} y={16} textAnchor="middle" fontFamily="Anton" fontSize={46} fill={cc}>{txt}</text>
              )}
            </g>,
          );
          refl.push(<rect key={`r${s}`} x={px - w * sc * 0.6} y={P(sx, 0, sz)[1] + 10} width={w * sc * 1.2} height={Math.min(600, (hh * sc) * 1.6)} fill={cc} opacity={0.22 * lights} />);
        }
      }
    }
    // lyskæde over gaden
    if (idx % 2 === 0 && z0 > 80) {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 12; i++) {
        const u = i / 12;
        const x = -SW + u * SW * 2;
        const y = -560 + Math.sin(u * Math.PI) * 120;
        pts.push(P(x, y, z0));
      }
      els.push(<path key={`l${idx}`} d={`M${pts.map((p) => p.join(",")).join(" L")}`} stroke="#120818" strokeWidth={Math.max(1, 800 / z0)} fill="none" />);
      pts.forEach(([x, y], i) =>
        glow.push(<circle key={`b${idx}-${i}`} cx={x} cy={y} r={Math.max(1.5, 4200 / z0) * (0.8 + bp * 0.4)} fill={i % 3 === 0 ? pal.a : i % 3 === 1 ? pal.win : pal.b} opacity={lights} />),
      );
    }
  }
  const g0 = P(-SW, 0, 4000), g1 = P(SW, 0, 4000);
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={HZ + 220} fill="url(#nSky)" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={random(`st${i}`) * 1080} cy={random(`sy${i}`) * 700} r={1 + random(`sr${i}`) * 1.8} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 0.7 + i))} />
      ))}
      {/* fjern skyline i dis */}
      {Array.from({ length: 18 }).map((_, i) => {
        const w = 40 + random(`fw${i}`) * 70;
        const h = 80 + random(`fh${i}`) * 220;
        return <rect key={i} x={260 + i * 32} y={HZ - h} width={w} height={h} fill="#2a1440" opacity={0.8} />;
      })}
      <ellipse cx={540} cy={HZ} rx={700} ry={260} fill="url(#nHaze)" />
      {/* jord */}
      <rect x={-200} y={HZ} width={1480} height={1200} fill="url(#nGround)" />
      <path d={`M${g0[0]},${g0[1]} L${P(-SW, 0, 60)[0]},${P(-SW, 0, 60)[1]} L${P(SW, 0, 60)[0]},${P(SW, 0, 60)[1]} L${g1[0]},${g1[1]}Z`} fill="#0e0816" />
      {/* vejstriber */}
      {Array.from({ length: 14 }).map((_, i) => {
        const z = ((i * 300 - dz) % 4200 + 4200) % 4200 + 80;
        const a = P(-8, 0, z), b = P(8, 0, z), c = P(8, 0, z + 140), d = P(-8, 0, z + 140);
        return <path key={i} d={`M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]} L${d[0]},${d[1]}Z`} fill="#e8d8f0" opacity={0.35} />;
      })}
      <g filter="url(#nSoft)">{refl}</g>
      {els}
      <g filter="url(#nGlow)">{glow}</g>
      <ellipse cx={540} cy={HZ + 40} rx={900} ry={200} fill="url(#nHaze)" opacity={0.5} />
    </g>
  );
};
