import React from "react";
import { PAL } from "../lib";

/** Mercedes-stjerne (tre takker i ring) */
export const Star: React.FC<{ x: number; y: number; r: number; color?: string; ring?: boolean }> = ({ x, y, r, color = "url(#chrome)", ring = true }) => (
  <g transform={`translate(${x},${y})`}>
    {ring && <circle r={r} fill="none" stroke={color} strokeWidth={r * 0.12} />}
    {[0, 120, 240].map((a) => (
      <path key={a} d={`M0,0 L${-r * 0.13},${-r * 0.1} L0,${-r * 0.92} L${r * 0.13},${-r * 0.1} Z`} fill={color} transform={`rotate(${a})`} />
    ))}
  </g>
);

const Rim: React.FC<{ cx: number; cy: number; r: number; spin: number }> = ({ cx, cy, r, spin }) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r} fill="#050507" />
    <circle r={r * 0.93} fill="none" stroke="#15161c" strokeWidth={r * 0.06} />
    {/* dæk-sidevæg tekst-ring */}
    <circle r={r * 0.82} fill="none" stroke="#1d1f27" strokeWidth={2} />
    <circle r={r * 0.74} fill="url(#rimGrad)" />
    <g transform={`rotate(${spin})`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M-4,${-r * 0.2} L-9,${-r * 0.7} L9,${-r * 0.7} L4,${-r * 0.2} Z`} fill="#20232c" stroke="#8d97b3" strokeWidth={1.5} transform={`rotate(${i * 36})`} />
      ))}
    </g>
    <circle r={r * 0.71} fill="none" stroke="#a7b2cf" strokeWidth={2} opacity={0.6} />
    <rect x={r * 0.2} y={-r * 0.46} width={r * 0.22} height={r * 0.36} rx={5} fill="#c41a28" />
    <circle r={r * 0.2} fill="#101218" stroke="#9aa5c4" strokeWidth={2} />
    <Star x={0} y={0} r={r * 0.13} ring={false} />
  </g>
);

/** Lyse refleksionsstriber der glider over lakken (gadelys der passerer) */
const Reflections: React.FC<{ clip: string; t: number; w: number; y0: number; y1: number }> = ({ clip, t, w, y0, y1 }) => (
  <g clipPath={`url(#${clip})`} style={{ mixBlendMode: "screen" }}>
    {[0, 1, 2].map((i) => {
      const x = ((t * 420 + i * 520) % (w * 2.4)) - w * 1.2;
      return <polygon key={i} points={`${x},${y0} ${x + 90},${y0} ${x + 30},${y1} ${x - 60},${y1}`} fill="#ffe7c2" opacity={0.08} />;
    })}
    <rect x={-w} y={y0} width={w * 2} height={(y1 - y0) * 0.12} fill="#c7d6ff" opacity={0.12} />
  </g>
);

type P = { x: number; y: number; s?: number; t?: number; uid: string; lights?: number; brake?: number };

/** G-klasse set fra siden, kører mod højre */
export const GSide: React.FC<P & { spin?: number; beam?: number; doorOpen?: number }> = ({ x, y, s = 1, t = 0, uid, lights = 1, brake = 0, spin = 0, beam = 1, doorOpen = 0 }) => {
  const body = "M-455,-95 L-455,-232 Q-455,-242 -445,-242 L-440,-242 L-440,-418 Q-440,-434 -424,-434 L236,-434 Q252,-434 256,-420 L286,-242 L440,-240 Q456,-236 457,-220 L458,-110 L452,-82 L392,-82 A104,104 0 0 0 208,-82 L-208,-82 A104,104 0 0 0 -392,-82 L-448,-82 Q-455,-86 -455,-95 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={`gs${uid}`}>
          <path d={body} />
        </clipPath>
      </defs>
      {beam > 0 && <polygon points="456,-200 1900,-460 1900,120" fill="url(#coneWhite)" opacity={0.5 * beam * lights} style={{ mixBlendMode: "screen" }} />}
      <ellipse cx={0} cy={6} rx={540} ry={40} fill="url(#shadow)" />
      {/* reservehjul bagpå */}
      <path d="M-455,-380 L-500,-380 Q-514,-380 -514,-366 L-514,-200 Q-514,-186 -500,-186 L-455,-186 Z" fill="#07080c" stroke="#2a3045" strokeWidth={2} />
      <path d={body} fill="url(#gPaint)" stroke="#2c3550" strokeWidth={2} />
      {/* ruder */}
      <path d="M-426,-256 L-426,-414 L-306,-414 L-306,-256 Z" fill="url(#glass)" />
      <path d="M-288,-256 L-288,-414 L-12,-414 L-12,-256 Z" fill="url(#glass)" />
      <path d="M6,-256 L6,-414 L232,-414 L258,-256 Z" fill="url(#glass)" />
      <path d="M-426,-414 L232,-414" stroke="#0a0b10" strokeWidth={6} />
      {/* tagkant / regnrende */}
      <path d="M-440,-438 L250,-438" stroke="url(#chrome)" strokeWidth={3} opacity={0.6} />
      {/* dørlinjer, hængsler, håndtag */}
      {[-296, -2, 282].map((dx) => (
        <line key={dx} x1={dx} y1={-418} x2={dx === 282 ? dx - 20 : dx} y2={-90} stroke="#000" strokeWidth={3} opacity={0.8} />
      ))}
      {[[-2, -380], [-2, -150], [282, -232], [282, -150]].map(([hx, hy], i) => (
        <rect key={i} x={hx - 6} y={hy} width={14} height={34} rx={3} fill="#0d0f15" stroke="#5a6684" strokeWidth={1.5} />
      ))}
      <rect x={-90} y={-226} width={58} height={12} rx={6} fill="url(#chrome)" />
      <rect x={200} y={-226} width={58} height={12} rx={6} fill="url(#chrome)" />
      {/* beskyttelseslist */}
      <rect x={-455} y={-160} width={910} height={18} fill="#0a0b10" />
      <rect x={-455} y={-154} width={910} height={4} fill="url(#chrome)" opacity={0.7} />
      {/* hjulkasser (sorte skærmudvidelser) */}
      <path d="M404,-82 A116,116 0 0 0 196,-82" stroke="#0b0c11" strokeWidth={26} fill="none" />
      <path d="M-196,-82 A116,116 0 0 0 -404,-82" stroke="#0b0c11" strokeWidth={26} fill="none" />
      {/* trinbræt + sideudstødning */}
      <rect x={-200} y={-78} width={400} height={16} rx={6} fill="#14161e" stroke="#3a4360" strokeWidth={1.5} />
      <rect x={-196} y={-60} width={42} height={18} rx={9} fill="url(#chrome)" />
      <rect x={-146} y={-60} width={42} height={18} rx={9} fill="url(#chrome)" />
      {/* blinklys på skærmen + spejl */}
      <path d="M408,-240 Q408,-262 430,-262 L446,-262 Q456,-262 456,-244 L456,-240 Z" fill="#ffd9a0" opacity={0.85} />
      <path d="M256,-300 L312,-308 Q320,-308 320,-298 L318,-270 L262,-268 Z" fill="#0b0d14" stroke="#3a4360" strokeWidth={2} />
      {/* for- og baglygter */}
      <rect x={452} y={-226} width={8} height={70} rx={3} fill="#eef4ff" opacity={lights} />
      <circle cx={458} cy={-190} r={110} fill="url(#glowWhite)" opacity={0.7 * lights} />
      <rect x={-460} y={-236} width={10} height={100} rx={3} fill={PAL.red} />
      <circle cx={-458} cy={-190} r={90 + brake * 90} fill="url(#glowRed)" opacity={0.55 + brake * 0.45} />
      <Reflections clip={`gs${uid}`} t={t} w={460} y0={-434} y1={-80} />
      {/* døren åbnes (mørk sprække + dør der svinger ud) */}
      {doorOpen > 0 && <path d={`M6,-418 L${6 - doorOpen * 40},-430 L${6 - doorOpen * 40},-70 L6,-86 Z`} fill="#000" opacity={0.9} />}
      <Rim cx={300} cy={-84} r={84} spin={spin} />
      <Rim cx={-300} cy={-84} r={84} spin={spin} />
    </g>
  );
};

/** G-klasse forfra */
export const GFront: React.FC<P & { flash?: number; beam?: number }> = ({ x, y, s = 1, t = 0, uid, lights = 1, flash = 0, beam = 1 }) => {
  const body = "M-335,-58 L-342,-150 L-336,-340 Q-330,-352 -300,-354 L-286,-360 L-272,-476 Q-268,-484 -256,-484 L256,-484 Q268,-484 272,-476 L286,-360 L300,-354 Q330,-352 336,-340 L342,-150 L335,-58 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={`gf${uid}`}>
          <path d={body} />
        </clipPath>
      </defs>
      {beam > 0 && (
        <g style={{ mixBlendMode: "screen" }} opacity={0.55 * beam * lights}>
          <polygon points="-236,-262 -900,700 60,700" fill="#fff4dc" opacity={0.22} filter="url(#blur30)" />
          <polygon points="236,-262 900,700 -60,700" fill="#fff4dc" opacity={0.22} filter="url(#blur30)" />
        </g>
      )}
      <ellipse cx={0} cy={8} rx={420} ry={44} fill="url(#shadow)" />
      {/* dæk under karrosseriet */}
      <rect x={-330} y={-130} width={110} height={132} rx={18} fill="#050507" />
      <rect x={220} y={-130} width={110} height={132} rx={18} fill="#050507" />
      <path d={body} fill="url(#gPaint)" stroke="#2c3550" strokeWidth={2} />
      {/* forrude */}
      <path d="M-258,-370 L-246,-468 L246,-468 L258,-370 Z" fill="url(#glass)" />
      <path d="M-120,-462 L-200,-380" stroke="#d6e2ff" strokeWidth={10} opacity={0.12} />
      <path d="M-210,-374 L-40,-392 M40,-374 L210,-392" stroke="#05060a" strokeWidth={5} />
      {/* spejle */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <path d={`M${k * 300},-392 L${k * 372},-402 Q${k * 384},-402 ${k * 384},-390 L${k * 380},-340 L${k * 306},-336 Z`} fill="#0a0c12" stroke="#3a4360" strokeWidth={2} />
        </g>
      ))}
      {/* motorhjelm-kant + blinklys oven på skærmene */}
      <path d="M-300,-354 L300,-354" stroke="#3a4360" strokeWidth={3} />
      {[-1, 1].map((k) => (
        <path key={k} d={`M${k * 262},-354 Q${k * 262},-378 ${k * 290},-378 L${k * 312},-378 Q${k * 330},-378 ${k * 330},-356 Z`} fill="#ffe0b0" opacity={0.85} />
      ))}
      {/* gitter (lodrette stænger) */}
      <rect x={-150} y={-336} width={300} height={150} rx={10} fill="#05060a" stroke="url(#chrome)" strokeWidth={5} />
      {Array.from({ length: 15 }).map((_, i) => (
        <rect key={i} x={-140 + i * 19.5} y={-330} width={6} height={138} rx={3} fill="url(#chrome)" opacity={0.85} />
      ))}
      <circle cx={0} cy={-262} r={60} fill="#05060a" />
      <Star x={0} y={-262} r={54} />
      {/* runde forlygter med LED-ring */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <circle cx={k * 238} cy={-262} r={70} fill="#0a0c12" stroke="url(#chrome)" strokeWidth={8} />
          <circle cx={k * 238} cy={-262} r={56} fill="none" stroke="#eaf3ff" strokeWidth={9} opacity={lights} />
          <circle cx={k * 238} cy={-262} r={30} fill="#dfe8ff" opacity={0.8 * lights} />
          <circle cx={k * 238} cy={-262} r={14} fill="#fff" opacity={lights} />
          <circle cx={k * 238} cy={-262} r={150 + flash * 360} fill="url(#glowWhite)" opacity={(0.75 + flash * 0.25) * lights} />
          {/* anamorf lysstribe */}
          <ellipse cx={k * 238} cy={-262} rx={500 + flash * 700} ry={6 + flash * 6} fill="#cfe2ff" opacity={(0.35 + flash * 0.5) * lights} style={{ mixBlendMode: "screen" }} />
        </g>
      ))}
      {/* kofanger med luftindtag */}
      <path d="M-338,-150 L338,-150 L334,-62 L-334,-62 Z" fill="#0b0c11" />
      {[-1, 0, 1].map((k) => (
        <path key={k} d={`M${k * 200 - 80},-136 L${k * 200 + 80},-136 L${k * 200 + 66},-84 L${k * 200 - 66},-84 Z`} fill="#030305" stroke="#2a3045" strokeWidth={2} />
      ))}
      <rect x={-300} y={-110} width={60} height={10} rx={5} fill="#eaf3ff" opacity={0.9 * lights} />
      <rect x={240} y={-110} width={60} height={10} rx={5} fill="#eaf3ff" opacity={0.9 * lights} />
      {/* nummerplade */}
      <rect x={-104} y={-182} width={208} height={42} rx={4} fill="#eef1f6" stroke="#9aa3b8" strokeWidth={2} />
      <rect x={-104} y={-182} width={20} height={42} rx={3} fill="#1b3c9c" />
      <text x={10} y={-150} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={30} fill="#111" letterSpacing={3}>
        NO 63 DE
      </text>
      <Reflections clip={`gf${uid}`} t={t} w={340} y0={-484} y1={-58} />
    </g>
  );
};

/** G-klasse bagfra med reservehjul */
export const GRear: React.FC<P> = ({ x, y, s = 1, t = 0, uid, brake = 0 }) => {
  const body = "M-330,-58 L-338,-150 L-334,-430 Q-330,-470 -300,-474 L300,-474 Q330,-470 334,-430 L338,-150 L330,-58 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <clipPath id={`gr${uid}`}>
          <path d={body} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={8} rx={420} ry={44} fill="url(#shadow)" />
      <rect x={-270} y={0} width={70} height={320} fill={PAL.red} opacity={0.18 + brake * 0.2} filter="url(#blur14)" />
      <rect x={200} y={0} width={70} height={320} fill={PAL.red} opacity={0.18 + brake * 0.2} filter="url(#blur14)" />
      <rect x={-330} y={-130} width={110} height={132} rx={18} fill="#050507" />
      <rect x={220} y={-130} width={110} height={132} rx={18} fill="#050507" />
      <path d={body} fill="url(#gPaint)" stroke="#2c3550" strokeWidth={2} />
      <path d="M-250,-454 L250,-454 L256,-360 L-256,-360 Z" fill="url(#glass)" />
      {/* baglygter (lodrette) */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <rect x={k > 0 ? 296 : -326} y={-340} width={30} height={160} rx={6} fill={PAL.red} />
          <rect x={k > 0 ? 300 : -322} y={-250} width={22} height={28} rx={3} fill="#f2f2f2" opacity={0.7} />
          <circle cx={k * 311} cy={-280} r={120 + brake * 90} fill="url(#glowRed)" opacity={0.7 + brake * 0.3} />
        </g>
      ))}
      {/* reservehjul med cover og stjerne */}
      <circle cx={0} cy={-246} r={150} fill="#06070b" stroke="#2a3045" strokeWidth={4} />
      <circle cx={0} cy={-246} r={124} fill="url(#gPaint)" stroke="url(#chrome)" strokeWidth={4} />
      <Star x={0} y={-246} r={42} />
      <path d="M-120,-246 A120,120 0 0 1 120,-246" stroke="#c7d6ff" strokeWidth={4} fill="none" opacity={0.25} />
      {/* kofanger + nummerplade */}
      <path d="M-336,-150 L336,-150 L330,-62 L-330,-62 Z" fill="#0b0c11" />
      <rect x={-104} y={-140} width={208} height={42} rx={4} fill="#eef1f6" stroke="#9aa3b8" strokeWidth={2} />
      <rect x={-104} y={-140} width={20} height={42} rx={3} fill="#1b3c9c" />
      <text x={10} y={-108} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={30} fill="#111" letterSpacing={3}>
        NO 63 DE
      </text>
      <ellipse cx={0} cy={-300} rx={420} ry={80} fill={PAL.red} opacity={0.12 + brake * 0.25} filter="url(#blur30)" />
      <Reflections clip={`gr${uid}`} t={t} w={340} y0={-474} y1={-58} />
    </g>
  );
};
