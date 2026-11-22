import React from "react";
import { random } from "remotion";
import { FLOOR } from "./Room";

/** Bordplade-højde og stolepositioner (world). */
export const TABLE = { x0: 1340, x1: 2360, y: FLOOR - 525 };
export const HER = { x: 2500, y: FLOOR - 315 };
export const HIM = { x: 1200, y: FLOOR - 315 };

type P = [number, number];
const L = (a: P, b: P, k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

/** Hånd hvilende på bordet set fra siden (peger mod dir). */
const Hand: React.FC<{ x: number; y: number; dir: 1 | -1; skin: string; dark: string; light: string }> = ({ x, y, dir, skin, dark, light }) => (
  <g transform={`translate(${x},${y}) scale(${dir},1)`}>
    <path d="M-60,-30 C-30,-44 20,-40 40,-26 C58,-20 76,-14 84,-6 C88,0 84,4 76,4 L-60,6Z" fill={skin} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${30 + i * 4},${-22 + i * 7} C${56 + i * 4},${-20 + i * 6} ${78 - i * 6},${-10 + i * 4} ${84 - i * 8},${-2 + i * 2}`} stroke={dark} strokeWidth={1.6} fill="none" opacity={0.7} />
    ))}
    <path d="M-10,-36 C10,-50 34,-44 40,-34" stroke={light} strokeWidth={5} fill="none" opacity={0.35} strokeLinecap="round" />
    <path d="M10,-30 C20,-46 40,-50 52,-40 C56,-34 50,-30 40,-30Z" fill={skin} />
    <path d="M40,-38 l8,-2" stroke="#efe0d6" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
    <path d="M78,-4 l6,-1" stroke="#efe0d6" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
    <ellipse cx={0} cy={8} rx={86} ry={8} fill="#000" opacity={0.35} />
  </g>
);

/* ======================= HENDE ======================= */
export const Her: React.FC<{ t: number; eyeUp?: number; blink?: number; reach?: number; lookAt?: number; headTilt?: number; sad?: number; hood?: number }> = ({
  t, eyeUp = 0, blink = 0, reach = 0, lookAt = 0, headTilt = 0, sad = 0, hood = 0,
}) => {
  const skin = "#9c6544", sd = "#64391f", sl = "#d29a72";
  const breath = Math.sin(t * 1.7) * 2.5;
  const hc: P = [-60, -580 + breath];
  const hand: P = L([-270, -212], [-540, -212], reach);
  const elbow: P = L([-120, -230], [-250, -250], reach);
  const sh: P = [-20, -380 + breath];
  // blik: lookAt 0 = ned/væk, 1 = mod ham; eyeUp løfter iris (himmelvendt)
  const gx = -2 - lookAt * 4;
  const gy = 3 - lookAt * 2 - eyeUp * 12;
  const lid = Math.max(blink, eyeUp * 0.15);
  const tilt = headTilt * -6 + eyeUp * -5 + Math.sin(t * 0.9) * 1.2;
  return (
    <g transform={`translate(${HER.x},${HER.y})`}>
      {/* stol */}
      <path d="M70,-560 C110,-560 120,-520 118,-480 L112,40 L84,40 L90,-470 C88,-500 80,-520 60,-520Z" fill="#2a1a10" />
      <rect x={-120} y={20} width={240} height={34} rx={8} fill="#3a2414" />
      {[-100, 96].map((x) => (
        <rect key={x} x={x} y={54} width={18} height={262} fill="#24160c" />
      ))}
      {/* hår bagpå (langt, krøllet) */}
      <g transform={`translate(${hc[0]},${hc[1]}) rotate(${tilt})`}>
        {Array.from({ length: 34 }).map((_, i) => {
          const a = random(`hb${i}`);
          const x = 10 + a * 90 + Math.sin(t * 0.8 + i) * 2;
          const y = -80 + random(`hy${i}`) * 300;
          return <circle key={i} cx={x} cy={y} r={30 + random(`hr${i}`) * 22} fill={i % 4 ? "#170d08" : "#24140c"} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={`c${i}`} d={`M${30 + random(`hc${i}`) * 70},${-40 + i * 20} q14,-10 6,-22 q-10,-8 -16,4`} stroke="#5a3a24" strokeWidth={3} fill="none" opacity={0.55} />
        ))}
      </g>
      {/* ben (jeans) under bordet */}
      <path d="M-10,-30 C-120,-40 -220,-36 -290,-20 L-300,40 C-220,30 -120,30 -10,40Z" fill="#2a3a5a" />
      <path d="M-300,-20 C-310,60 -306,180 -300,300 L-250,300 C-250,180 -244,60 -240,0Z" fill="#26344f" />
      <path d="M-330,300 C-330,286 -250,282 -230,296 L-226,316 L-336,316Z" fill="#efe9e0" />
      {/* overkrop: oversized hættetrøje (creme) */}
      <path d={`M60,10 C70,-120 60,-300 30,${-370 + breath} C10,${-392 + breath} -60,${-392 + breath} -90,${-366 + breath} C-120,-300 -130,-150 -110,10Z`} fill="#d8ccb6" />
      <path d={`M60,10 C70,-120 60,-300 30,${-370 + breath} C10,${-392 + breath} -60,${-392 + breath} -90,${-366 + breath} C-120,-300 -130,-150 -110,10Z`} fill="url(#gShadeL)" />
      <path d="M-100,-120 C-60,-110 0,-112 40,-124" stroke="#b8aa92" strokeWidth={4} fill="none" />
      <path d="M-80,-60 C-40,-50 10,-52 46,-60" stroke="#b8aa92" strokeWidth={3} fill="none" opacity={0.6} />
      {/* hætte i nakken */}
      <path d={`M-10,${-380 + breath} C20,${-410 + breath} 70,${-400 + breath} 70,${-350 + breath} C60,${-330 + breath} 30,${-340 + breath} 10,${-350 + breath}Z`} fill="#c8bca4" />
      {/* hals */}
      <path d={`M${hc[0] + 10},${hc[1] + 60} L${hc[0] + 52},${hc[1] + 60} L${hc[0] + 60},${-372 + breath} L${hc[0] + 6},${-380 + breath}Z`} fill={skin} />
      <path d={`M${hc[0] + 10},${hc[1] + 60} L${hc[0] + 52},${hc[1] + 60} L${hc[0] + 56},${hc[1] + 90} L${hc[0] + 12},${hc[1] + 84}Z`} fill={sd} opacity={0.6} />
      {/* ===== hoved ===== */}
      <g transform={`translate(${hc[0]},${hc[1]}) rotate(${tilt})`}>
        <clipPath id="herFace">
          <path d="M30,-92 C-20,-100 -62,-72 -66,-32 C-68,-12 -72,2 -80,14 C-76,22 -70,24 -66,26 C-66,36 -62,44 -61,52 C-58,64 -50,74 -36,82 C-10,92 20,84 40,64 C56,44 64,10 62,-30 C60,-70 50,-88 30,-92Z" />
        </clipPath>
        <path d="M30,-92 C-20,-100 -62,-72 -66,-32 C-68,-12 -72,2 -80,14 C-76,22 -70,24 -66,26 C-66,36 -62,44 -61,52 C-58,64 -50,74 -36,82 C-10,92 20,84 40,64 C56,44 64,10 62,-30 C60,-70 50,-88 30,-92Z" fill={skin} />
        <g clipPath="url(#herFace)"><g filter="url(#fBlur6)">
          {/* lys fra vinduet (venstre, koldt) + lampe (oppe, varmt) */}
          <ellipse cx={-50} cy={-40} rx={60} ry={70} fill="#c8d4ff" opacity={0.16} />
          <ellipse cx={-20} cy={-70} rx={70} ry={40} fill={sl} opacity={0.35} />
          <ellipse cx={50} cy={20} rx={40} ry={90} fill={sd} opacity={0.55} />
          <ellipse cx={0} cy={86} rx={60} ry={20} fill={sd} opacity={0.5} />
          {/* kindben-højlys + rouge */}
          <ellipse cx={-14} cy={10} rx={26} ry={14} fill="#e8a88a" opacity={0.35} />
          <ellipse cx={-24} cy={2} rx={16} ry={6} fill="#f2c8a8" opacity={0.4} />
          </g>
          {/* næse */}
          <path d="M-46,-16 C-56,0 -66,8 -74,14" stroke={sd} strokeWidth={3} fill="none" opacity={0.55} />
          <path d="M-74,13 C-70,22 -60,24 -52,20" stroke={sd} strokeWidth={2.4} fill="none" />
          <ellipse cx={-58} cy={20} rx={6} ry={3} fill="#3a1a0e" opacity={0.7} />
          <ellipse cx={-72} cy={8} rx={4} ry={3} fill="#f6d2b8" opacity={0.6} />
          <path d="M-52,-28 L-60,4" stroke="#f2c8a8" strokeWidth={3} opacity={0.35} />
        </g>
        {/* øjne */}
        {[
          { ex: -10, ey: -16, w: 32, h: 14, s: 1 },
          { ex: -55, ey: -16, w: 17, h: 12, s: 0.6 },
        ].map((e, i) => {
          const eye = `M${e.ex - e.w / 2},${e.ey} Q${e.ex},${e.ey - e.h} ${e.ex + e.w / 2},${e.ey - 2} Q${e.ex},${e.ey + e.h * 0.55} ${e.ex - e.w / 2},${e.ey}Z`;
          const cid = `herEye${i}`;
          return (
            <g key={i}>
              <clipPath id={cid}><path d={eye} /></clipPath>
              <path d={eye} fill="#efe4dc" />
              <g clipPath={`url(#${cid})`}>
                <circle cx={e.ex + gx * e.s} cy={e.ey + gy} r={8.5 * (0.6 + e.s * 0.4)} fill="#3a1e10" />
                <circle cx={e.ex + gx * e.s} cy={e.ey + gy} r={8.5 * (0.6 + e.s * 0.4)} fill="none" stroke="#1a0c06" strokeWidth={1.6} />
                <circle cx={e.ex + gx * e.s} cy={e.ey + gy} r={3.8 * (0.6 + e.s * 0.4)} fill="#080404" />
                <circle cx={e.ex + gx * e.s + 2.5} cy={e.ey + gy - 2.5} r={2} fill="#fff" />
                <path d={`M${e.ex - e.w / 2},${e.ey - e.h} L${e.ex + e.w / 2},${e.ey - e.h} L${e.ex + e.w / 2},${e.ey - e.h + (e.h * 1.6) * lid} L${e.ex - e.w / 2},${e.ey - e.h + e.h * 1.6 * lid}Z`} fill={skin} />
                <rect x={e.ex - e.w / 2} y={e.ey - e.h} width={e.w} height={5} fill="#000" opacity={0.25} />
              </g>
              {/* øvre øjenlåg + vipper */}
              <path d={`M${e.ex - e.w / 2 - 1},${e.ey + 0.5} Q${e.ex},${e.ey - e.h - 1 + e.h * 1.6 * lid} ${e.ex + e.w / 2 + 2},${e.ey - 3}`} stroke="#120806" strokeWidth={2.8} fill="none" strokeLinecap="round" />
              {Array.from({ length: 5 }).map((_, k) => {
                const u = 0.3 + k * 0.17;
                const lx = e.ex - e.w / 2 + e.w * u;
                const ly = e.ey - e.h * (1 - Math.abs(u - 0.5) * 1.6) * 0.95 + e.h * 1.6 * lid * 0.9;
                return <path key={k} d={`M${lx},${ly} q${3 + k},-${4 + k * 0.6} ${6 + k * 1.5},-${5 + k * 0.4}`} stroke="#120806" strokeWidth={1.4} fill="none" />;
              })}
              <path d={`M${e.ex - e.w / 2 + 3},${e.ey - e.h - 5} Q${e.ex},${e.ey - e.h - 9} ${e.ex + e.w / 2},${e.ey - e.h - 4}`} stroke={sd} strokeWidth={1.6} fill="none" opacity={0.7} />
              <path d={`M${e.ex - e.w / 2 + 4},${e.ey + 2} Q${e.ex},${e.ey + e.h * 0.6} ${e.ex + e.w / 2},${e.ey}`} stroke={sd} strokeWidth={1} fill="none" opacity={0.6} />
            </g>
          );
        })}
        {/* bryn */}
        <path d={`M-30,${-38 - eyeUp * 4 + sad * 2} Q-10,${-48 - eyeUp * 6 - sad * 4} 12,${-40 - eyeUp * 3}`} stroke="#140a06" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M-66,${-34 - eyeUp * 3} Q-56,${-40 - eyeUp * 5} -44,${-38 - eyeUp * 3}`} stroke="#140a06" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* læber */}
        <path d="M-66,48 C-62,42 -56,41 -52,44 C-48,41 -40,41 -32,47 C-44,50 -56,51 -66,48Z" fill="#7a2e2c" />
        <path d="M-66,48 C-56,51 -44,50 -32,47 C-38,58 -58,60 -66,48Z" fill="#8e3a36" />
        <path d={`M-64,48 C-54,${50 - sad * 2} -44,${50 - sad * 2} -33,47`} stroke="#3a1210" strokeWidth={1.6} fill="none" />
        <ellipse cx={-50} cy={53} rx={6} ry={2} fill="#fff" opacity={0.45} />
        {/* øre (delvist skjult) + creol */}
        <path d="M44,-6 C56,-10 60,10 52,24 C48,30 42,28 42,22Z" fill={sd} />
        <circle cx={48} cy={52} r={22} fill="none" stroke="url(#gGold)" strokeWidth={4} />
        <circle cx={40} cy={70} r={2.5} fill="#fff" opacity={0.8} />
        {/* hår foran: krøller rundt om ansigtet */}
        <path d="M44,-100 C0,-120 -60,-108 -74,-60 C-62,-80 -30,-92 0,-88 C20,-86 38,-74 52,-50 L70,40 L80,-40Z" fill="#170d08" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = -Math.PI * 0.95 + i * 0.16;
          const cx = 10 + Math.cos(a) * 90;
          const cy = -20 + Math.sin(a) * 92;
          return <circle key={i} cx={cx} cy={cy} r={16 + random(`hf${i}`) * 8} fill={i % 3 ? "#170d08" : "#24140c"} />;
        })}
        <path d={`M-62,-76 q-14,14 -6,32 q6,14 -6,28`} stroke="#170d08" strokeWidth={5} fill="none" />
      </g>
      {hood > 0 && (
        <g transform={`translate(${hc[0]},${hc[1]}) rotate(${tilt}) translate(${(1 - hood) * 60},${(1 - hood) * 90})`} opacity={Math.min(1, hood * 1.6)}>
          <path d="M-70,-40 C-80,-120 0,-150 60,-120 C120,-90 130,0 110,90 C100,140 70,170 40,190 L-20,140 C30,120 60,60 60,0 C60,-60 20,-100 -30,-96 C-50,-92 -64,-70 -70,-40Z" fill="#d8ccb6" />
          <path d="M-70,-40 C-80,-120 0,-150 60,-120 C120,-90 130,0 110,90" stroke="#b8aa92" strokeWidth={6} fill="none" />
          <path d="M-66,-44 C-60,-80 -20,-104 20,-100" stroke="#f2e8d4" strokeWidth={4} fill="none" opacity={0.6} />
          <path d="M-30,-96 C20,-100 60,-60 60,0 C60,60 30,120 -20,140" stroke="#a89a80" strokeWidth={10} fill="none" opacity={0.7} />
        </g>
      )}
      {/* arm på bordet (ærme) + hånd */}
      <path d={`M${sh[0]},${sh[1]} L${elbow[0]},${elbow[1]} L${hand[0] + 60},${hand[1] - 10}`} stroke="#d0c4ac" strokeWidth={64} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${sh[0] - 10},${sh[1] + 10} L${elbow[0] - 6},${elbow[1] + 10} L${hand[0] + 60},${hand[1]}`} stroke="#a89a80" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.6} />
      <Hand x={hand[0]} y={hand[1] + 2} dir={-1} skin={skin} dark={sd} light={sl} />
    </g>
  );
};

/* ======================= HAM (Will, bagfra / 3/4) ======================= */
export const Him: React.FC<{ t: number; reach?: number; lean?: number; talk?: number }> = ({ t, reach = 0, lean = 0, talk = 0 }) => {
  const skin = "#6e4532", sd = "#3e2418", sl = "#9a6a4c";
  const breath = Math.sin(t * 1.5 + 1) * 2.5;
  const lx = lean * 30;
  const hc: P = [70 + lx, -600 + breath];
  const hand: P = L([240, -212], [530, -212], reach);
  const elbow: P = L([90, -220], [230, -240], reach);
  const sh: P = [20 + lx, -400 + breath];
  const jaw = talk > 0 ? Math.abs(Math.sin(t * 14)) * talk : 0;
  return (
    <g transform={`translate(${HIM.x},${HIM.y})`}>
      {/* stol */}
      <path d="M-70,-560 C-110,-560 -120,-520 -118,-480 L-112,40 L-84,40 L-90,-470 C-88,-500 -80,-520 -60,-520Z" fill="#2a1a10" />
      <rect x={-120} y={20} width={240} height={34} rx={8} fill="#3a2414" />
      {[-110, 92].map((x) => (
        <rect key={x} x={x} y={54} width={18} height={262} fill="#24160c" />
      ))}
      {/* ben (sorte træningsbukser) */}
      <path d="M10,-30 C120,-40 220,-36 290,-20 L300,40 C220,30 120,30 10,40Z" fill="#16161c" />
      <path d="M300,-20 C310,60 306,180 300,300 L250,300 C250,180 244,60 240,0Z" fill="#141418" />
      <path d="M200,6 L296,0" stroke="#e8e6e0" strokeWidth={4} opacity={0.6} />
      <path d="M230,300 C230,286 310,282 330,296 L334,316 L224,316Z" fill="#f2f0ea" />
      {/* ryg: hættetrøje mørkegrå, set bagfra/3/4 */}
      <path d={`M-90,10 C-110,-150 -100,-300 ${-60 + lx},${-380 + breath} C${-20 + lx},${-420 + breath} ${70 + lx},${-420 + breath} ${110 + lx},${-380 + breath} C130,-300 130,-150 110,10Z`} fill="#2e3038" />
      <path d={`M-90,10 C-110,-150 -100,-300 ${-60 + lx},${-380 + breath} C${-20 + lx},${-420 + breath} ${70 + lx},${-420 + breath} ${110 + lx},${-380 + breath} C130,-300 130,-150 110,10Z`} fill="url(#gShadeR)" />
      <path d="M-60,-300 C-20,-250 40,-250 90,-290" stroke="#1e2026" strokeWidth={5} fill="none" opacity={0.6} />
      <path d="M-80,-120 C-20,-100 60,-100 110,-120" stroke="#1e2026" strokeWidth={4} fill="none" opacity={0.5} />
      <rect x={-96} y={-20} width={206} height={30} rx={8} fill="#24262c" />
      {/* hætte foldet i nakken */}
      <path d={`M${-30 + lx},${-400 + breath} C${-10 + lx},${-450 + breath} ${110 + lx},${-450 + breath} ${120 + lx},${-396 + breath} C${90 + lx},${-370 + breath} ${10 + lx},${-366 + breath} ${-30 + lx},${-400 + breath}Z`} fill="#383a44" />
      <path d={`M${-20 + lx},${-404 + breath} C${10 + lx},${-436 + breath} ${100 + lx},${-436 + breath} ${110 + lx},${-400 + breath}`} stroke="#4a4c58" strokeWidth={3} fill="none" />
      {/* nakke */}
      <path d={`M${hc[0] - 40},${hc[1] + 50} L${hc[0] + 30},${hc[1] + 56} L${hc[0] + 36},${-400 + breath} L${hc[0] - 46},${-404 + breath}Z`} fill={skin} />
      <path d={`M${hc[0] - 40},${hc[1] + 50} L${hc[0] - 10},${hc[1] + 54} L${hc[0] - 16},${-402 + breath} L${hc[0] - 46},${-404 + breath}Z`} fill={sd} opacity={0.5} />
      {/* hoved bagfra/3-4 */}
      <g transform={`translate(${hc[0]},${hc[1]})`}>
        <path d="M-62,-30 C-66,-80 -30,-100 10,-98 C50,-96 72,-70 74,-30 C76,0 70,30 62,48 C52,66 30,74 10,74 C-20,74 -50,50 -58,20Z" fill={skin} />
        {/* kæbe/kind-kant mod højre + skæg */}
        <path d="M58,10 C64,30 60,52 44,66 C34,74 20,78 8,76 C30,66 46,48 52,24Z" fill="#1a100a" opacity={0.9} />
        <path d="M60,-8 C66,-2 68,8 66,14" stroke={sl} strokeWidth={3} fill="none" opacity={0.7} />
        {/* kort fade i nakken */}
        <path d="M-62,-30 C-60,10 -50,40 -30,60 C-50,58 -66,30 -66,-10Z" fill="#120a06" opacity={0.8} />
        {Array.from({ length: 40 }).map((_, i) => (
          <circle key={i} cx={-56 + random(`fd${i}`) * 50} cy={-20 + random(`fy${i}`) * 70} r={1.2} fill="#0a0604" opacity={0.6} />
        ))}
        {/* øre (venstre, vendt mod os) */}
        <path d="M-6,-6 C-24,-14 -34,4 -28,22 C-24,34 -10,36 -4,28Z" fill={skin} />
        <path d="M-12,0 C-22,0 -26,12 -20,22" stroke={sd} strokeWidth={3} fill="none" />
        <circle cx={-14} cy={30} r={3} fill="url(#gChrome)" />
        {/* kasket (sort, skygge frem mod højre) */}
        <path d="M-66,-36 C-70,-92 -20,-112 20,-110 C60,-108 82,-80 80,-40 L60,-34 C20,-40 -30,-40 -66,-36Z" fill="#0d0d12" />
        <path d="M60,-40 C90,-44 120,-40 132,-30 C128,-24 100,-22 64,-28Z" fill="#08080c" />
        <path d="M-40,-90 C-10,-104 40,-102 66,-78" stroke="#3a3c48" strokeWidth={2.5} fill="none" opacity={0.7} />
        <path d="M-66,-36 L-30,-38" stroke="#2a2c36" strokeWidth={6} />
        <rect x={-62} y={-46} width={16} height={8} rx={2} fill="#2a2c36" />
        {/* næsetip/ kind-glimt yderst til højre */}
        <path d="M70,-4 C78,2 80,8 74,12" stroke={skin} strokeWidth={6} fill="none" />
        {talk > 0 && <path d={`M60,${40 + jaw * 4} l10,${jaw * 2}`} stroke="#1a0c06" strokeWidth={2} />}
        {/* rim-lys fra vinduet langs kontur */}
        <path d="M-62,-30 C-66,-80 -30,-100 10,-98" stroke="#9cb4ff" strokeWidth={3} fill="none" opacity={0.35} />
      </g>
      {/* arm mod bordet */}
      <path d={`M${sh[0]},${sh[1]} L${elbow[0]},${elbow[1]} L${hand[0] - 60},${hand[1] - 10}`} stroke="#33353e" strokeWidth={70} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${sh[0] + 14},${sh[1] - 16} L${elbow[0] + 10},${elbow[1] - 20} L${hand[0] - 60},${hand[1] - 24}`} stroke="#4a4c56" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.5} />
      <Hand x={hand[0]} y={hand[1] + 2} dir={1} skin={skin} dark={sd} light={sl} />
    </g>
  );
};
