import React from "react";
import { PAL } from "../lib";

type Common = { x: number; y: number; scale?: number; lights?: number; brake?: number };

const Wheel: React.FC<{ cx: number; cy: number; r: number; spin: number }> = ({ cx, cy, r, spin }) => (
  <g transform={`translate(${cx},${cy})`}>
    <circle r={r} fill="#06070b" />
    <circle r={r * 0.92} fill="none" stroke="#1b2133" strokeWidth={3} />
    <circle r={r * 0.7} fill="url(#chrome)" opacity={0.35} />
    <circle r={r * 0.66} fill="#0c1020" />
    <g transform={`rotate(${spin})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={`M-5,0 L-9,${-r * 0.64} L9,${-r * 0.64} L5,0 Z`} fill="url(#chrome)" transform={`rotate(${a})`} opacity={0.85} />
      ))}
    </g>
    <rect x={r * 0.18} y={-r * 0.42} width={r * 0.18} height={r * 0.4} rx={4} fill={PAL.red} opacity={0.9} />
    <circle r={r * 0.14} fill="url(#chrome)" />
  </g>
);

/** Bil fra siden, kører mod højre. (x,y) = jordpunkt under bilens midte. */
export const CarSide: React.FC<Common & { spin?: number; beam?: number; flip?: boolean; underglow?: number }> = ({
  x,
  y,
  scale = 1,
  lights = 1,
  brake = 0,
  spin = 0,
  beam = 1,
  flip = false,
  underglow = 0.5,
}) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
    {/* forlygte-kegle */}
    {beam > 0 && (
      <polygon points="378,-122 1500,-330 1500,60" fill="url(#coneWhite)" opacity={0.55 * beam * lights} style={{ mixBlendMode: "screen" }} />
    )}
    {/* skygge + underglow */}
    <ellipse cx={0} cy={4} rx={430} ry={34} fill="url(#shadow)" />
    <ellipse cx={0} cy={6} rx={380} ry={26} fill={PAL.cyan} opacity={0.18 * underglow} filter="url(#blur14)" />
    {/* krop */}
    <path
      d="M-372,-58 Q-382,-90 -378,-112 Q-374,-146 -348,-152 L-252,-162 Q-200,-232 -128,-246 L70,-250 Q150,-246 232,-168 L350,-150 Q378,-142 384,-118 L386,-64 Q382,-42 358,-40 L306,-40 A66,66 0 0 0 174,-40 L-174,-40 A66,66 0 0 0 -306,-40 L-348,-40 Q-366,-42 -372,-58 Z"
      fill="url(#carBody)"
      stroke="#3b4a78"
      strokeWidth={2}
    />
    {/* ruder (tonede) */}
    <path d="M-232,-164 Q-190,-226 -128,-236 L-28,-238 L-28,-164 Z" fill="url(#glass)" />
    <path d="M-12,-164 L-12,-239 L64,-240 Q138,-236 210,-170 Z" fill="url(#glass)" />
    <path d="M-232,-164 Q-190,-226 -128,-236 L64,-240 Q138,-236 210,-170" fill="none" stroke="url(#chrome)" strokeWidth={3} opacity={0.6} />
    {/* refleks-streg + karosselinjer */}
    <path d="M-366,-108 Q0,-124 382,-112" fill="none" stroke="#9fb4ea" strokeWidth={3} opacity={0.45} />
    <path d="M-356,-76 Q0,-84 380,-78" fill="none" stroke="#000" strokeWidth={2} opacity={0.6} />
    <line x1={-20} y1={-160} x2={-20} y2={-48} stroke="#000" strokeWidth={3} opacity={0.7} />
    <line x1={196} y1={-158} x2={190} y2={-48} stroke="#000" strokeWidth={3} opacity={0.6} />
    <rect x={-80} y={-128} width={40} height={8} rx={4} fill="url(#chrome)" opacity={0.7} />
    <rect x={120} y={-128} width={40} height={8} rx={4} fill="url(#chrome)" opacity={0.7} />
    {/* spejl */}
    <path d="M196,-170 L232,-176 L236,-160 L204,-156 Z" fill="#0b0f1c" stroke="#3b4a78" strokeWidth={2} />
    {/* forlygte */}
    <path d="M352,-138 L382,-128 L384,-112 L350,-118 Z" fill="#eaf3ff" opacity={lights} />
    <circle cx={378} cy={-122} r={90} fill="url(#glowWhite)" opacity={0.75 * lights} />
    {/* baglygte */}
    <path d="M-376,-128 L-350,-134 L-348,-112 L-378,-108 Z" fill={PAL.red} />
    <circle cx={-370} cy={-120} r={70 + brake * 90} fill="url(#glowRed)" opacity={0.55 + brake * 0.45} />
    {/* hjul */}
    <Wheel cx={240} cy={-40} r={60} spin={spin} />
    <Wheel cx={-240} cy={-40} r={60} spin={spin} />
  </g>
);

/** Bil set bagfra (jagt-vinkel). */
export const CarRear: React.FC<Common & { plate?: string }> = ({ x, y, scale = 1, lights = 1, brake = 0, plate = "NODE" }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx={0} cy={6} rx={340} ry={34} fill="url(#shadow)" />
    {/* røde spejlinger i vejen */}
    <rect x={-250} y={0} width={60} height={260} fill={PAL.red} opacity={0.22 * (0.5 + brake)} filter="url(#blur14)" />
    <rect x={190} y={0} width={60} height={260} fill={PAL.red} opacity={0.22 * (0.5 + brake)} filter="url(#blur14)" />
    <rect x={-262} y={-40} width={70} height={52} rx={10} fill="#05060a" />
    <rect x={192} y={-40} width={70} height={52} rx={10} fill="#05060a" />
    <path
      d="M-280,-40 L-288,-150 Q-282,-192 -232,-202 L-192,-292 Q-172,-322 -120,-324 L120,-324 Q172,-322 192,-292 L232,-202 Q282,-192 288,-150 L280,-40 Q270,-20 240,-20 L-240,-20 Q-270,-20 -280,-40 Z"
      fill="url(#carBody)"
      stroke="#3b4a78"
      strokeWidth={2}
    />
    <path d="M-168,-214 L-148,-292 Q-138,-306 -108,-306 L108,-306 Q138,-306 148,-292 L168,-214 Z" fill="url(#glass)" />
    <path d="M-150,-300 L150,-300" stroke="#9fb4ea" strokeWidth={2} opacity={0.4} />
    {/* LED-bar */}
    <rect x={-262} y={-184} width={524} height={16} rx={8} fill={PAL.red} />
    <rect x={-262} y={-184} width={524} height={16} rx={8} fill="url(#glowRed)" opacity={0.6} />
    <ellipse cx={0} cy={-176} rx={360} ry={70} fill={PAL.red} opacity={0.25 + brake * 0.4} filter="url(#blur30)" />
    <circle cx={-232} cy={-176} r={70 + brake * 60} fill="url(#glowRed)" opacity={0.7 + brake * 0.3} />
    <circle cx={232} cy={-176} r={70 + brake * 60} fill="url(#glowRed)" opacity={0.7 + brake * 0.3} />
    {/* nummerplade */}
    <rect x={-76} y={-128} width={152} height={40} rx={5} fill="#e9edf6" />
    <text x={0} y={-98} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={28} fill="#111" letterSpacing={4}>
      {plate}
    </text>
    <circle cx={0} cy={-108} r={60} fill="url(#glowWhite)" opacity={0.25} />
    {/* diffuser + udstødning */}
    <path d="M-200,-56 L200,-56 L182,-26 L-182,-26 Z" fill="#05070d" />
    <ellipse cx={-130} cy={-42} rx={22} ry={11} fill="url(#chrome)" />
    <ellipse cx={130} cy={-42} rx={22} ry={11} fill="url(#chrome)" />
    <ellipse cx={-130} cy={-42} rx={14} ry={6} fill="#000" />
    <ellipse cx={130} cy={-42} rx={14} ry={6} fill="#000" />
    <path d="M-272,-150 Q0,-160 272,-150" stroke="#9fb4ea" strokeWidth={3} fill="none" opacity={0.35} />
  </g>
);

/** Bil forfra. flash = ekstra blink i forlygterne (0..1) */
export const CarFront: React.FC<Common & { flash?: number; beam?: number }> = ({ x, y, scale = 1, lights = 1, flash = 0, beam = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {beam > 0 && (
      <g style={{ mixBlendMode: "screen" }} opacity={0.5 * beam}>
        <polygon points="-210,-170 -600,500 0,500" fill="#fff6d8" opacity={0.25} filter="url(#blur30)" />
        <polygon points="210,-170 600,500 0,500" fill="#fff6d8" opacity={0.25} filter="url(#blur30)" />
      </g>
    )}
    <ellipse cx={0} cy={6} rx={360} ry={36} fill="url(#shadow)" />
    <rect x={-268} y={-40} width={70} height={52} rx={10} fill="#05060a" />
    <rect x={198} y={-40} width={70} height={52} rx={10} fill="#05060a" />
    <path
      d="M-284,-40 L-292,-160 Q-286,-196 -240,-206 L-196,-292 Q-176,-322 -122,-324 L122,-324 Q176,-322 196,-292 L240,-206 Q286,-196 292,-160 L284,-40 Q274,-20 244,-20 L-244,-20 Q-274,-20 -284,-40 Z"
      fill="url(#carBody)"
      stroke="#3b4a78"
      strokeWidth={2}
    />
    <path d="M-176,-218 L-150,-294 Q-140,-308 -110,-308 L110,-308 Q140,-308 150,-294 L176,-218 Z" fill="url(#glass)" />
    <path d="M-60,-300 L-120,-224" stroke="#c6d6ff" strokeWidth={6} opacity={0.2} />
    {/* spejle */}
    <path d="M-250,-214 L-300,-226 L-306,-196 L-258,-190 Z" fill="#0b0f1c" stroke="#3b4a78" strokeWidth={2} />
    <path d="M250,-214 L300,-226 L306,-196 L258,-190 Z" fill="#0b0f1c" stroke="#3b4a78" strokeWidth={2} />
    {/* grill */}
    <rect x={-110} y={-150} width={220} height={66} rx={14} fill="#03040a" stroke="url(#chrome)" strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line key={i} x1={-96 + i * 32} y1={-144} x2={-96 + i * 32} y2={-90} stroke="#2a3350" strokeWidth={4} />
    ))}
    {/* lygter */}
    {[-1, 1].map((s) => (
      <g key={s}>
        <path d={`M${s * 130},-176 L${s * 262},-182 L${s * 258},-150 L${s * 136},-148 Z`} fill="#eef5ff" opacity={lights} />
        <path d={`M${s * 136},-142 L${s * 256},-146`} stroke={PAL.cyan} strokeWidth={4} opacity={0.9 * lights} />
        <circle cx={s * 196} cy={-164} r={120 + flash * 260} fill="url(#glowWhite)" opacity={(0.7 + flash * 0.3) * lights} />
      </g>
    ))}
    <rect x={-80} y={-70} width={160} height={36} rx={5} fill="#e9edf6" />
    <text x={0} y={-43} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={26} fill="#111" letterSpacing={4}>
      NODE
    </text>
    <path d="M-276,-160 Q0,-172 276,-160" stroke="#9fb4ea" strokeWidth={3} fill="none" opacity={0.35} />
  </g>
);

/** Bil oppefra (fugleperspektiv), peger mod højre ved rot=0 */
export const CarTop: React.FC<Common & { rot?: number }> = ({ x, y, scale = 1, lights = 1, rot = 0, brake = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`}>
    <polygon points="330,-90 1300,-420 1300,420 330,90" fill="url(#coneWhite)" opacity={0.45 * lights} style={{ mixBlendMode: "screen" }} />
    <rect x={-360} y={-170} width={720} height={340} rx={120} fill="#000" opacity={0.5} filter="url(#blur14)" />
    <rect x={-250} y={-158} width={80} height={24} rx={8} fill="#05060a" />
    <rect x={170} y={-158} width={80} height={24} rx={8} fill="#05060a" />
    <rect x={-250} y={134} width={80} height={24} rx={8} fill="#05060a" />
    <rect x={170} y={134} width={80} height={24} rx={8} fill="#05060a" />
    <rect x={-340} y={-140} width={680} height={280} rx={110} fill="url(#carBody)" stroke="#3b4a78" strokeWidth={2} />
    <path d="M60,-118 Q150,-110 170,0 Q150,110 60,118 Z" fill="url(#glass)" />
    <path d="M-200,-110 Q-250,0 -200,110 L-160,100 Q-190,0 -160,-100 Z" fill="url(#glass)" />
    <rect x={-150} y={-112} width={200} height={224} rx={40} fill="#0a0e1c" stroke="#2b3760" strokeWidth={2} />
    <line x1={-150} y1={0} x2={50} y2={0} stroke="#9fb4ea" strokeWidth={2} opacity={0.3} />
    <circle cx={330} cy={-90} r={80} fill="url(#glowWhite)" opacity={0.8 * lights} />
    <circle cx={330} cy={90} r={80} fill="url(#glowWhite)" opacity={0.8 * lights} />
    <circle cx={-338} cy={-96} r={60 + brake * 60} fill="url(#glowRed)" opacity={0.8} />
    <circle cx={-338} cy={96} r={60 + brake * 60} fill="url(#glowRed)" opacity={0.8} />
  </g>
);
