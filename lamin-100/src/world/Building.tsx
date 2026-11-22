import React from "react";
import { random } from "remotion";

/** Fortovets kant (world y) og etagehøjder. */
export const GROUND = 2600;
export const GF = 400; // stueetage
export const FH = 300; // etage

const r = (s: string) => random(s);
const pick = <T,>(s: string, arr: T[]) => arr[Math.floor(r(s) * arr.length) % arr.length];

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k))));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

export type ShopSpec = { name: string; kind: "cafe" | "kiosk" | "bakery" | "pizza" | "boutique" | "club" | "travel" | "none"; sub?: string };

export type BuildingSpec = {
  id: string;
  x: number;
  w: number;
  floors: number;
  style: "stucco" | "brick";
  color: string;
  bays: number;
  roof: "mansard" | "flat" | "tiles";
  lit?: number;
  shop?: ShopSpec;
  balconies?: "french" | "deep" | "none";
  skip?: [number, number][]; // [floor, bay] uden vindue (fx ur/billboard)
  entrance?: number; // bay med opgangsdør
};

export const topOf = (b: BuildingSpec) => GROUND - GF - b.floors * FH;

/* --------------------------- VINDUE --------------------------- */
const Interior: React.FC<{ x: number; y: number; w: number; h: number; s: string; cool?: boolean }> = ({ x, y, w, h, s, cool }) => {
  const kind = Math.floor(r(`${s}k`) * 6);
  const els: React.ReactNode[] = [];
  els.push(<rect key="bg" x={x} y={y} width={w} height={h} fill={cool ? "url(#gWinLitCool)" : "url(#gWinLit)"} />);
  // bagvæg-skygge mod hjørner
  els.push(<rect key="v" x={x} y={y} width={w} height={h * 0.25} fill="#5a2a0a" opacity={0.25} />);
  if (kind === 0) {
    // bogreol
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 6; j++)
        els.push(<rect key={`b${i}${j}`} x={x + 6 + j * ((w - 12) / 6)} y={y + h * 0.35 + i * h * 0.17} width={(w - 12) / 6 - 3} height={h * 0.14} fill={pick(`${s}c${i}${j}`, ["#6a2e1a", "#2c3c5c", "#7a6a2e", "#3c1a2a", "#4a5a3a"])} opacity={0.7} />);
  } else if (kind === 1) {
    // billede + plante
    els.push(<rect key="pf" x={x + w * 0.2} y={y + h * 0.3} width={w * 0.35} height={h * 0.22} fill="#3a2414" opacity={0.75} />);
    els.push(<rect key="pi" x={x + w * 0.23} y={y + h * 0.33} width={w * 0.29} height={h * 0.16} fill="#c58a4a" opacity={0.7} />);
    els.push(<path key="pl" d={`M${x + w * 0.75},${y + h} q-30,-60 -10,-120 q10,40 14,60 q10,-50 30,-70 q-6,50 -10,130Z`} fill="#2a3a1a" opacity={0.85} />);
  } else if (kind === 2) {
    // person-silhuet
    const px = x + w * (0.3 + r(`${s}px`) * 0.4);
    els.push(<ellipse key="ph" cx={px} cy={y + h * 0.45} rx={w * 0.09} ry={w * 0.11} fill="#2a1206" opacity={0.85} />);
    els.push(<path key="pb" d={`M${px - w * 0.2},${y + h} Q${px - w * 0.18},${y + h * 0.56} ${px},${y + h * 0.56} Q${px + w * 0.18},${y + h * 0.56} ${px + w * 0.2},${y + h}Z`} fill="#2a1206" opacity={0.85} />);
  } else if (kind === 3) {
    // køkkenskabe
    els.push(<rect key="ks" x={x} y={y + h * 0.18} width={w} height={h * 0.22} fill="#d8c2a0" opacity={0.7} />);
    for (let j = 0; j < 3; j++) els.push(<rect key={`kd${j}`} x={x + 4 + j * (w / 3)} y={y + h * 0.2} width={w / 3 - 8} height={h * 0.18} fill="none" stroke="#7a5a3a" strokeWidth={2} opacity={0.6} />);
  }
  // loftlampe
  if (r(`${s}lamp`) < 0.55) {
    const lx = x + w / 2;
    els.push(<line key="lc" x1={lx} y1={y} x2={lx} y2={y + h * 0.18} stroke="#3a220e" strokeWidth={2} />);
    els.push(<path key="ls" d={`M${lx - w * 0.14},${y + h * 0.26} L${lx + w * 0.14},${y + h * 0.26} L${lx + w * 0.07},${y + h * 0.17} L${lx - w * 0.07},${y + h * 0.17}Z`} fill="#3a220e" />);
    els.push(<ellipse key="lg" cx={lx} cy={y + h * 0.3} rx={w * 0.5} ry={h * 0.22} fill="url(#rHot)" opacity={0.55} />);
  }
  return <g>{els}</g>;
};

const Win: React.FC<{ x: number; y: number; w: number; h: number; s: string; lit: boolean; brick: boolean; floor: number; facade: string; french: boolean; layer: "base" | "lit" }> = ({
  x, y, w, h, s, lit, brick, floor, facade, french, layer,
}) => {
  const els: React.ReactNode[] = [];
  if (layer === "lit" && !lit) return null;
  const L = layer === "lit";
  const frame = brick ? "#e9e4da" : shade(facade, 0.28);
  const sash = brick ? "#f2efe8" : "#ece6da";
  // lysudslip på facaden
  if (L) els.push(<ellipse key="spill" cx={x + w / 2} cy={y + h / 2} rx={w * 1.25} ry={h * 0.95} fill="url(#rWarm)" opacity={0.45} />);
  if (L) {
    /* kun lys-laget: tegnes efter natte-overlay */
  } else if (brick) {
    // stik (soldaterskifte) + bundgesims
    els.push(<rect key="st" x={x - 10} y={y - 26} width={w + 20} height={26} fill="#5a2418" />);
    for (let i = 0; i <= (w + 20) / 11; i++) els.push(<rect key={`sj${i}`} x={x - 10 + i * 11} y={y - 26} width={1.6} height={26} fill="#a89a8a" opacity={0.7} />);
    els.push(<rect key="sl" x={x - 12} y={y + h} width={w + 24} height={14} fill="#b8b2a8" />);
    els.push(<rect key="grime" x={x - 4} y={y + h + 24} width={w + 8} height={FH * 0.45} fill="url(#gShadowDown)" opacity={0.15 + r(`${s}gr`) * 0.15} />);
    els.push(<rect key="sls" x={x - 12} y={y + h + 14} width={w + 24} height={10} fill="#000" opacity={0.35} />);
  } else {
    // indfatning
    els.push(<rect key="sur" x={x - 16} y={y - 16} width={w + 32} height={h + 26} fill={frame} />);
    els.push(<rect key="surS" x={x - 16} y={y - 16} width={w + 32} height={h + 26} fill="url(#gCornice)" opacity={0.6} />);
    els.push(<rect key="surI" x={x - 6} y={y - 6} width={w + 12} height={h + 10} fill={shade(facade, -0.25)} />);
    // overstykke
    if (floor === 0) {
      els.push(<path key="ped" d={`M${x - 30},${y - 22} L${x + w / 2},${y - 78} L${x + w + 30},${y - 22}Z`} fill={frame} />);
      els.push(<path key="pedS" d={`M${x - 30},${y - 22} L${x + w + 30},${y - 22} L${x + w + 30},${y - 14} L${x - 30},${y - 14}Z`} fill="#000" opacity={0.35} />);
      els.push(<path key="pedH" d={`M${x - 24},${y - 25} L${x + w / 2},${y - 72}`} stroke="#fff" strokeOpacity={0.25} strokeWidth={3} />);
    } else if (floor === 1) {
      els.push(<path key="seg" d={`M${x - 28},${y - 20} Q${x + w / 2},${y - 70} ${x + w + 28},${y - 20}Z`} fill={frame} />);
      els.push(<rect key="segS" x={x - 28} y={y - 22} width={w + 56} height={8} fill="#000" opacity={0.3} />);
    } else {
      els.push(<rect key="lin" x={x - 26} y={y - 40} width={w + 52} height={20} fill={frame} />);
      els.push(<rect key="linS" x={x - 26} y={y - 20} width={w + 52} height={8} fill="#000" opacity={0.35} />);
      els.push(<path key="key" d={`M${x + w / 2 - 14},${y - 40} L${x + w / 2 + 14},${y - 40} L${x + w / 2 + 9},${y - 6} L${x + w / 2 - 9},${y - 6}Z`} fill={shade(facade, 0.38)} />);
    }
    // regnstriber/snavs under sålbænken
    els.push(<rect key="grime" x={x - 6} y={y + h + 30} width={w + 12} height={FH * 0.5} fill="url(#gShadowDown)" opacity={0.18 + r(`${s}gr`) * 0.2} />);
    // sålbænk
    els.push(<rect key="sill" x={x - 22} y={y + h + 6} width={w + 44} height={14} fill={frame} />);
    els.push(<rect key="sillS" x={x - 22} y={y + h + 20} width={w + 44} height={14} fill="url(#gShadowDown)" />);
    // konsoller
    els.push(<rect key="c1" x={x - 10} y={y + h + 20} width={12} height={20} fill={shade(facade, 0.15)} />);
    els.push(<rect key="c2" x={x + w - 2} y={y + h + 20} width={12} height={20} fill={shade(facade, 0.15)} />);
  }
  // glas / interiør
  if (L) {
    els.push(<Interior key="int" x={x} y={y} w={w} h={h} s={s} cool={r(`${s}cool`) < 0.12} />);
    const cur = r(`${s}cur`);
    if (cur < 0.45) {
      els.push(<path key="cl" d={`M${x},${y} L${x + w * 0.3},${y} Q${x + w * 0.16},${y + h * 0.5} ${x + w * 0.22},${y + h} L${x},${y + h}Z`} fill="url(#gCurtain)" opacity={0.9} />);
      els.push(<path key="cr" d={`M${x + w},${y} L${x + w * 0.7},${y} Q${x + w * 0.84},${y + h * 0.5} ${x + w * 0.78},${y + h} L${x + w},${y + h}Z`} fill="url(#gCurtain)" opacity={0.9} />);
    } else if (cur < 0.75) {
      els.push(<rect key="sh" x={x} y={y} width={w} height={h} fill="url(#gSheer)" />);
    } else if (cur < 0.88) {
      const down = 0.2 + r(`${s}bl`) * 0.5;
      els.push(<rect key="bl" x={x} y={y} width={w} height={h * down} fill="#e8d6b0" opacity={0.9} />);
      for (let i = 0; i < h * down; i += 9) els.push(<rect key={`bll${i}`} x={x} y={y + i} width={w} height={2} fill="#9a845a" opacity={0.5} />);
    }
  } else if (!lit) {
    els.push(<rect key="dk" x={x} y={y} width={w} height={h} fill="url(#gWinDark)" />);
    if (r(`${s}dc`) < 0.4) els.push(<rect key="dcu" x={x + w * 0.05} y={y} width={w * 0.9} height={h} fill="#1a1414" opacity={0.6} />);
  }
  // rammer, sprosser
  if (!L && lit) return <g>{els}</g>;
  const mw = 7;
  const sashC = L ? "#3a2a1e" : sash;
  els.push(<rect key="fr" x={x} y={y} width={w} height={h} fill="none" stroke={sashC} strokeWidth={mw} />);
  els.push(<rect key="mul" x={x + w / 2 - mw / 2} y={y} width={mw} height={h} fill={sashC} />);
  els.push(<rect key="tr" x={x} y={y + h * 0.28} width={w} height={mw} fill={sashC} />);
  els.push(<rect key="g1" x={x} y={y + h * 0.64} width={w} height={4} fill={sashC} opacity={0.9} />);
  els.push(<rect key="g2" x={x + w / 4 - 2} y={y + h * 0.28} width={4} height={h * 0.72} fill={sashC} opacity={0.9} />);
  els.push(<rect key="g3" x={x + (3 * w) / 4 - 2} y={y + h * 0.28} width={4} height={h * 0.72} fill={sashC} opacity={0.9} />);
  // glasrefleks
  els.push(<path key="refl" d={`M${x + 6},${y + h * 0.9} L${x + w * 0.35},${y + 6} L${x + w * 0.45},${y + 6} L${x + 14},${y + h * 0.95}Z`} fill="#fff" opacity={lit ? 0.07 : 0.1} />);
  // fransk altan
  if (french && (L || !lit)) {
    const by = y + h * 0.66;
    const bx0 = x - 10, bx1 = x + w + 10;
    els.push(<rect key="ft" x={bx0} y={by} width={bx1 - bx0} height={6} fill="#0c0a10" />);
    els.push(<rect key="fb" x={bx0} y={y + h - 2} width={bx1 - bx0} height={6} fill="#0c0a10" />);
    const n = 9;
    for (let i = 0; i <= n; i++) els.push(<rect key={`fv${i}`} x={bx0 + ((bx1 - bx0) / n) * i - 1.5} y={by} width={3} height={y + h - by} fill="#0c0a10" />);
    for (let i = 0; i < n; i += 2) els.push(<circle key={`fc${i}`} cx={bx0 + ((bx1 - bx0) / n) * (i + 0.5)} cy={(by + y + h) / 2} r={(bx1 - bx0) / n / 2 - 2} fill="none" stroke="#0c0a10" strokeWidth={2.5} />);
  }
  // blomsterkasse
  if (L && !french && r(`${s}fl`) < 0.22) {
    els.push(<rect key="fbx" x={x + 4} y={y + h - 26} width={w - 8} height={26} fill="#4a2a1a" />);
    for (let i = 0; i < 7; i++) els.push(<circle key={`ff${i}`} cx={x + 14 + i * ((w - 28) / 6)} cy={y + h - 30} r={12} fill={i % 2 ? "#2e4a22" : "#3c5a2a"} />);
    for (let i = 0; i < 4; i++) els.push(<circle key={`fp${i}`} cx={x + 24 + i * ((w - 48) / 3)} cy={y + h - 38} r={5} fill={pick(`${s}fpc${i}`, ["#c22a3a", "#e8d24a", "#f4f1ea"])} />);
  }
  return <g>{els}</g>;
};

/* --------------------------- BUTIK --------------------------- */
const Shop: React.FC<{ x: number; y: number; w: number; h: number; spec: ShopSpec; s: string }> = ({ x, y, w, h, spec, s }) => {
  const els: React.ReactNode[] = [];
  const fy = y + 20;
  // skilt-fascia
  els.push(<rect key="fa" x={x} y={fy} width={w} height={70} fill="#111318" />);
  els.push(<rect key="fa2" x={x + 6} y={fy + 6} width={w - 12} height={58} fill="none" stroke="#c9a45a" strokeWidth={2} opacity={0.7} />);
  if (spec.kind !== "club")
    els.push(
      <text key="ft" x={x + w / 2} y={fy + 50} textAnchor="middle" fontFamily={spec.kind === "travel" || spec.kind === "kiosk" ? "Anton" : "Playfair"} fontStyle={spec.kind === "travel" || spec.kind === "kiosk" ? undefined : "italic"} fontSize={44} fill="#f2dca6" letterSpacing={spec.kind === "travel" ? 6 : 2}>
        {spec.name}
      </text>,
    );
  // vindue
  const wy = fy + 90;
  const wh = h - (wy - y) - 40;
  els.push(<rect key="wf" x={x + 10} y={wy - 8} width={w - 20} height={wh + 16} fill="#1a1612" />);
  if (spec.kind === "club") {
    // sorte ruder med plakater
    els.push(<rect key="cw" x={x + 18} y={wy} width={w - 36} height={wh} fill="#07070b" />);
  } else {
    els.push(<rect key="sw" x={x + 18} y={wy} width={w - 36} height={wh} fill="url(#gShop)" opacity={0.85} />);
    // hylder / varer
    for (let i = 0; i < 3; i++) {
      els.push(<rect key={`sh${i}`} x={x + 30} y={wy + wh * (0.3 + i * 0.25)} width={w - 60} height={6} fill="#5a3a1e" />);
      for (let j = 0; j < 10; j++) {
        const iw = (w - 70) / 10;
        els.push(<rect key={`it${i}${j}`} x={x + 34 + j * iw} y={wy + wh * (0.3 + i * 0.25) - 34 + r(`${s}ih${i}${j}`) * 14} width={iw - 8} height={34 - r(`${s}ih${i}${j}`) * 14} fill={pick(`${s}ic${i}${j}`, ["#c23a2a", "#e8d6a0", "#2a5a8a", "#f4f1ea", "#3a7a3a", "#d88a2a"])} opacity={0.8} />);
      }
    }
    els.push(<rect key="sglow" x={x + 18} y={wy} width={w - 36} height={wh} fill="url(#rWarm)" opacity={0.3} />);
  }
  els.push(<path key="srefl" d={`M${x + 40},${wy + wh} L${x + w * 0.35},${wy} L${x + w * 0.42},${wy} L${x + 70},${wy + wh}Z`} fill="#fff" opacity={0.07} />);
  for (let i = 1; i < 3; i++) els.push(<rect key={`mu${i}`} x={x + 18 + ((w - 36) / 3) * i - 4} y={wy} width={8} height={wh} fill="#1a1612" />);
  // markise
  if (spec.kind === "cafe" || spec.kind === "bakery" || spec.kind === "pizza") {
    const col = spec.kind === "pizza" ? ["#7a1a1a", "#e9e2d2"] : spec.kind === "bakery" ? ["#2a3a5a", "#e9e2d2"] : ["#1c3a2a", "#d9cfb6"];
    const n = Math.round(w / 50);
    for (let i = 0; i < n; i++) els.push(<path key={`aw${i}`} d={`M${x - 10 + i * ((w + 20) / n)},${fy + 70} L${x - 10 + (i + 1) * ((w + 20) / n)},${fy + 70} L${x - 30 + (i + 1) * ((w + 60) / n)},${fy + 150} L${x - 30 + i * ((w + 60) / n)},${fy + 150}Z`} fill={col[i % 2]} />);
    els.push(<rect key="aws" x={x - 30} y={fy + 70} width={w + 60} height={80} fill="url(#gShadowUp)" opacity={0.5} />);
    for (let i = 0; i < n; i++) els.push(<path key={`awf${i}`} d={`M${x - 30 + i * ((w + 60) / n)},${fy + 150} q${(w + 60) / n / 2},26 ${(w + 60) / n},0`} fill={col[i % 2]} />);
  }
  // plint
  els.push(<rect key="pl" x={x} y={y + h - 34} width={w} height={34} fill="#22222a" />);
  return <g>{els}</g>;
};

/* --------------------------- OPGANG --------------------------- */
const Entrance: React.FC<{ x: number; w: number; s: string; num: number }> = ({ x, w, s, num }) => {
  const dw = Math.min(170, w * 0.7);
  const dx = x + (w - dw) / 2;
  const dh = 300;
  const dy = GROUND - dh;
  return (
    <g>
      <rect x={dx - 22} y={dy - 70} width={dw + 44} height={dh + 70} fill="#2a2420" />
      <path d={`M${dx},${dy} L${dx},${dy - 30} Q${dx + dw / 2},${dy - 90} ${dx + dw},${dy - 30} L${dx + dw},${dy}Z`} fill="url(#gWinLit)" opacity={0.75} />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={dx + dw * k} y1={dy - 10} x2={dx + dw / 2} y2={dy - 60} stroke="#2a2420" strokeWidth={4} />
      ))}
      <rect x={dx} y={dy} width={dw} height={dh} fill="#3b2216" />
      <rect x={dx + dw / 2 - 2} y={dy} width={4} height={dh} fill="#1a0e08" />
      {[0, 1].map((k) => (
        <g key={k}>
          <rect x={dx + 12 + k * (dw / 2)} y={dy + 16} width={dw / 2 - 24} height={dh * 0.45} fill="none" stroke="#24130b" strokeWidth={5} />
          <rect x={dx + 18 + k * (dw / 2)} y={dy + 22} width={dw / 2 - 36} height={dh * 0.45 - 12} fill="url(#gWinLit)" opacity={0.35} />
          <rect x={dx + 12 + k * (dw / 2)} y={dy + dh * 0.58} width={dw / 2 - 24} height={dh * 0.34} fill="none" stroke="#24130b" strokeWidth={5} />
        </g>
      ))}
      <circle cx={dx + dw / 2 - 14} cy={dy + dh * 0.55} r={5} fill="#d8b46a" />
      <circle cx={dx + dw / 2 + 14} cy={dy + dh * 0.55} r={5} fill="#d8b46a" />
      {/* husnummer + dørtelefon */}
      <rect x={dx + dw + 30} y={dy + 40} width={44} height={36} rx={4} fill="#1a3a7a" />
      <text x={dx + dw + 52} y={dy + 68} textAnchor="middle" fontFamily="Anton" fontSize={28} fill="#fff">{num}</text>
      <rect x={dx + dw + 34} y={dy + 100} width={36} height={90} rx={4} fill="#9aa0aa" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={dx + dw + 40} y={dy + 108 + i * 13} width={24} height={8} fill={r(`${s}ib${i}`) < 0.5 ? "#ffe9a6" : "#d8dce4"} />
      ))}
      {/* væglampe */}
      <rect x={dx - 54} y={dy - 10} width={18} height={34} rx={4} fill="#1a1612" />
      <ellipse cx={dx - 45} cy={dy + 20} rx={14} ry={6} fill="#fff2c4" />
      <circle cx={dx - 45} cy={dy + 20} r={110} fill="url(#rWarm)" opacity={0.7} />
      {/* trin */}
      <rect x={dx - 30} y={GROUND - 14} width={dw + 60} height={14} fill="#5a5660" />
    </g>
  );
};

/* --------------------------- BYGNING --------------------------- */
const BuildingInner: React.FC<{ b: BuildingSpec }> = ({ b }) => {
  const { x, w, floors, color, bays, id } = b;
  const brick = b.style === "brick";
  const top = topOf(b);
  const lit = b.lit ?? 0.5;
  const bw = w / bays;
  const els: React.ReactNode[] = [];
  const litEls: React.ReactNode[] = [];
  const frontEls: React.ReactNode[] = [];

  // tag
  if (b.roof === "mansard") {
    const rh = 230;
    els.push(<path key="mans" d={`M${x - 14},${top} L${x + 40},${top - rh} L${x + w - 40},${top - rh} L${x + w + 14},${top}Z`} fill="url(#pZinc)" />);
    els.push(<path key="mansS" d={`M${x - 14},${top} L${x + 40},${top - rh} L${x + w - 40},${top - rh} L${x + w + 14},${top}Z`} fill="#0a1022" opacity={0.55} />);
    els.push(<rect key="mansT" x={x + 30} y={top - rh - 8} width={w - 60} height={10} fill="#2a3040" />);
    for (let i = 0; i < bays; i++) {
      const cx = x + bw * (i + 0.5);
      const on = r(`${id}dm${i}`) < lit * 0.8;
      els.push(<path key={`dm${i}`} d={`M${cx - 52},${top - 20} L${cx - 52},${top - 150} L${cx},${top - 200} L${cx + 52},${top - 150} L${cx + 52},${top - 20}Z`} fill={shade(color, -0.1)} />);
      els.push(<rect key={`dmw${i}`} x={cx - 34} y={top - 150} width={68} height={116} fill={on ? "url(#gWinLit)" : "url(#gWinDark)"} />);
      els.push(<rect key={`dmm${i}`} x={cx - 3} y={top - 150} width={6} height={116} fill="#e9e4da" />);
      els.push(<rect key={`dmf${i}`} x={cx - 34} y={top - 150} width={68} height={116} fill="none" stroke="#e9e4da" strokeWidth={6} />);
      if (on) els.push(<ellipse key={`dmg${i}`} cx={cx} cy={top - 90} rx={110} ry={90} fill="url(#rWarm)" opacity={0.4} />);
    }
  } else if (b.roof === "tiles") {
    els.push(<path key="tl" d={`M${x - 30},${top} L${x + w * 0.18},${top - 300} L${x + w * 0.82},${top - 300} L${x + w + 30},${top}Z`} fill="url(#pTiles)" />);
    els.push(<path key="tlS" d={`M${x - 30},${top} L${x + w * 0.18},${top - 300} L${x + w * 0.82},${top - 300} L${x + w + 30},${top}Z`} fill="#050814" opacity={0.55} />);
    for (let i = 0; i < 2; i++) {
      const cx = x + w * (0.3 + i * 0.4);
      els.push(<rect key={`sk${i}`} x={cx - 40} y={top - 170} width={80} height={60} fill="#1b2438" transform={`skewX(-8)`} />);
    }
  } else {
    els.push(<rect key="par" x={x - 8} y={top - 60} width={w + 16} height={60} fill={shade(color, -0.2)} />);
    els.push(<rect key="parT" x={x - 12} y={top - 70} width={w + 24} height={12} fill={shade(color, 0.2)} />);
    // tagudstyr
    els.push(<rect key="ac" x={x + w * 0.15} y={top - 130} width={120} height={70} fill="#5a5e68" />);
    els.push(<circle key="acf" cx={x + w * 0.15 + 60} cy={top - 95} r={26} fill="#2a2e38" />);
    els.push(<line key="ant" x1={x + w * 0.7} y1={top - 70} x2={x + w * 0.7} y2={top - 300} stroke="#1a1d26" strokeWidth={6} />);
    for (let i = 0; i < 4; i++) els.push(<line key={`an${i}`} x1={x + w * 0.7 - 60 + i * 8} y1={top - 220 - i * 20} x2={x + w * 0.7 + 60 - i * 8} y2={top - 220 - i * 20} stroke="#1a1d26" strokeWidth={4} />);
  }
  // skorstene
  for (let i = 0; i < 2; i++) {
    const cx = x + w * (0.22 + i * 0.56) + (r(`${id}ch${i}`) - 0.5) * 60;
    const ch = b.roof === "flat" ? top - 60 : top - (b.roof === "mansard" ? 230 : 300);
    els.push(<rect key={`ch${i}`} x={cx - 36} y={ch - 120} width={72} height={124} fill="url(#pBrickDark)" />);
    els.push(<rect key={`cht${i}`} x={cx - 44} y={ch - 132} width={88} height={16} fill="#3a3640" />);
    els.push(<rect key={`chp${i}`} x={cx - 18} y={ch - 162} width={14} height={32} fill="#7a3a22" />);
    els.push(<rect key={`chq${i}`} x={cx + 6} y={ch - 156} width={14} height={26} fill="#7a3a22" />);
  }
  if (r(`${id}sat`) < 0.6) {
    const sx = x + w * 0.5;
    els.push(<ellipse key="sat" cx={sx} cy={top - (b.roof === "flat" ? 120 : 250)} rx={40} ry={46} fill="#cfd3da" transform={`rotate(-25 ${sx} ${top - 250})`} />);
  }

  // facade-krop
  const bodyH = GROUND - top;
  els.push(<rect key="body" x={x} y={top} width={w} height={bodyH} fill={brick ? "url(#pBrick)" : color} />);
  if (!brick) els.push(<rect key="stc" x={x} y={top} width={w} height={bodyH} fill="url(#pStucco)" style={{ mixBlendMode: "multiply" }} opacity={0.9} />);
  // hovedgesims med tandsnit
  els.push(<rect key="cor" x={x - 24} y={top - 10} width={w + 48} height={46} fill={brick ? "#c9c2b6" : shade(color, 0.25)} />);
  els.push(<rect key="corG" x={x - 24} y={top - 10} width={w + 48} height={46} fill="url(#gCornice)" />);
  for (let i = 0; i < w / 22; i++) els.push(<rect key={`dt${i}`} x={x + i * 22} y={top + 36} width={12} height={16} fill={brick ? "#b8b0a2" : shade(color, 0.15)} />);
  els.push(<rect key="corS" x={x} y={top + 52} width={w} height={40} fill="url(#gShadowDown)" />);

  // etager
  for (let f = 0; f < floors; f++) {
    const fy = GROUND - GF - (f + 1) * FH; // top af etagen
    // bånd
    if (!brick || f === 0) {
      els.push(<rect key={`bd${f}`} x={x - 8} y={fy + FH - 14} width={w + 16} height={16} fill={brick ? "#c9c2b6" : shade(color, 0.18)} />);
      els.push(<rect key={`bdS${f}`} x={x} y={fy + FH + 2} width={w} height={16} fill="url(#gShadowDown)" />);
    }
    // gennemgående altan på 1. sal (stuk)
    if (!brick && f === 0 && b.balconies !== "none") {
      els.push(<rect key="bal" x={x + 20} y={fy + FH - 30} width={w - 40} height={22} fill={shade(color, 0.22)} />);
      for (let i = 0; i < bays * 2; i++) els.push(<path key={`bk${i}`} d={`M${x + 40 + i * ((w - 80) / (bays * 2 - 1))},${fy + FH - 8} l-10,0 l6,40 l8,0Z`} fill={shade(color, 0.1)} />);
    }
    for (let i = 0; i < bays; i++) {
      if (b.skip?.some(([sf, sb]) => sf === f && sb === i)) continue;
      const ww = bw * 0.46;
      const wx = x + bw * i + (bw - ww) / 2;
      const wy = fy + 46;
      const wh = FH - 110;
      const s = `${id}-${f}-${i}`;
      const isLit = r(s) < lit;
      const french = !brick && b.balconies === "french" && (f === 1 || f === 3 || (f === 0 && false));
      els.push(<Win key={`w${f}${i}`} x={wx} y={wy} w={ww} h={wh} s={s} lit={isLit} brick={brick} floor={f} facade={color} french={french} layer="base" />);
      if (isLit) litEls.push(<Win key={`wl${f}${i}`} x={wx} y={wy} w={ww} h={wh} s={s} lit brick={brick} floor={f} facade={color} french={french} layer="lit" />);
      // dybe altaner (mursten)
      if (brick && b.balconies === "deep" && i % 2 === 1 && f < floors - 1) {
        const by = fy + FH - 26;
        const bx = x + bw * i + 14;
        const bww = bw - 28;
        frontEls.push(<rect key={`ds${f}${i}`} x={bx - 20} y={by} width={bww + 40} height={26} fill="#55525a" />);
        frontEls.push(<rect key={`dsu${f}${i}`} x={bx - 20} y={by + 26} width={bww + 40} height={20} fill="#000" opacity={0.45} />);
        frontEls.push(<rect key={`dsr${f}${i}`} x={bx - 20} y={by - 110} width={bww + 40} height={110} fill="#2a3448" opacity={0.35} />);
        frontEls.push(<rect key={`dst${f}${i}`} x={bx - 20} y={by - 114} width={bww + 40} height={8} fill="#1a1d26" />);
        for (let k = 0; k <= 8; k++) frontEls.push(<rect key={`dsb${f}${i}${k}`} x={bx - 20 + ((bww + 40) / 8) * k - 2} y={by - 110} width={4} height={110} fill="#1a1d26" />);
        const it = Math.floor(r(`${s}bi`) * 4);
        if (it === 0) frontEls.push(<g key={`pot${f}${i}`}><rect x={bx + 10} y={by - 60} width={46} height={60} fill="#7a3a22" /><circle cx={bx + 33} cy={by - 80} r={36} fill="#2a4a22" /></g>);
        if (it === 1) frontEls.push(<g key={`cyc${f}${i}`} stroke="#0c0e14" strokeWidth={5} fill="none"><circle cx={bx + 40} cy={by - 36} r={32} /><circle cx={bx + 140} cy={by - 36} r={32} /><path d={`M${bx + 40},${by - 36} L${bx + 80},${by - 90} L${bx + 140},${by - 36} M${bx + 80},${by - 90} L${bx + 120},${by - 90}`} /></g>);
        if (it === 2) frontEls.push(<g key={`lau${f}${i}`}>{[0, 1, 2, 3].map((k) => <rect key={k} x={bx + 20 + k * 40} y={by - 100} width={30} height={50 + (k % 2) * 16} fill={pick(`${s}lc${k}`, ["#e8e2d2", "#3a5a8a", "#c23a3a", "#2a2a30"])} />)}<line x1={bx + 10} y1={by - 100} x2={bx + 180} y2={by - 100} stroke="#ccc" strokeWidth={3} /></g>);
        if (it === 3) frontEls.push(<g key={`sl${f}${i}`}>{Array.from({ length: 9 }).map((_, k) => <circle key={k} cx={bx - 10 + k * ((bww + 20) / 8)} cy={by - 118 + Math.sin(k) * 6} r={5} fill="#ffe6a3" />)}</g>);
      }
    }
  }
  // nedløbsrør
  for (const px of [x + 14, x + w - 26]) {
    els.push(<rect key={`dp${px}`} x={px} y={top + 30} width={12} height={GROUND - top - 30} fill="#3a3c44" />);
    els.push(<rect key={`dph${px}`} x={px + 2} y={top + 30} width={3} height={GROUND - top - 30} fill="#8a8e98" opacity={0.4} />);
    for (let yy = top + 120; yy < GROUND; yy += 320) els.push(<rect key={`dpb${px}${yy}`} x={px - 4} y={yy} width={20} height={8} fill="#2a2c34" />);
  }

  // stueetage
  const gy = GROUND - GF;
  if (!brick) {
    els.push(<rect key="rus" x={x} y={gy} width={w} height={GF} fill={shade(color, -0.08)} />);
    els.push(<rect key="rusT" x={x} y={gy} width={w} height={GF} fill="url(#pStucco)" style={{ mixBlendMode: "multiply" }} />);
    for (let yy = gy + 40; yy < GROUND; yy += 42) els.push(<rect key={`rg${yy}`} x={x} y={yy} width={w} height={4} fill="#000" opacity={0.3} />);
  } else {
    els.push(<rect key="gbr" x={x} y={gy} width={w} height={GF} fill="#3a3640" opacity={0.25} />);
  }
  const shopBays = b.shop ? (b.entrance !== undefined ? bays - 1 : bays) : 0;
  if (b.shop && b.shop.kind !== "none") {
    const sx = b.entrance === 0 ? x + bw : x;
    els.push(<Shop key="shop" x={sx + 20} y={gy} w={bw * shopBays - 40} h={GF} spec={b.shop} s={id} />);
  }
  if (b.entrance !== undefined) els.push(<Entrance key="ent" x={x + bw * b.entrance} w={bw} s={id} num={Math.floor(r(`${id}num`) * 80) + 2} />);
  // graffiti-tags og plakater nederst
  if (r(`${id}tag`) < 0.8) {
    const tx = x + w * (0.1 + r(`${id}tx`) * 0.3);
    els.push(<path key="tag" d={`M${tx},${GROUND - 60} q20,-50 40,-10 q10,-40 30,-6 q14,-30 30,0 q10,-36 40,-14`} stroke={pick(`${id}tc`, ["#e83a6a", "#4ad8ff", "#f4f1ea", "#ffd23a"])} strokeWidth={6} fill="none" opacity={0.75} />);
  }
  els.push(<rect key="plint" x={x} y={GROUND - 30} width={w} height={30} fill="#2a2830" />);
  // natte-belysning (mørkere opad)
  els.push(<rect key="night" x={x - 30} y={top - 10} width={w + 60} height={GROUND - top + 10} fill="url(#gFacadeNight)" />);
  els.push(<g key="litL">{litEls}</g>);
  els.push(<g key="frontL">{frontEls}</g>);
  // husskel
  els.push(<rect key="edgeL" x={x} y={top} width={10} height={GROUND - top} fill="#000" opacity={0.35} />);
  return <g>{els}</g>;
};

export const Building = React.memo(BuildingInner);
