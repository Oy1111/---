import React from "react";
import { PAL } from "../lib";

/** Pistol (profil, pibe mod højre). Lokalt: greb nederst til venstre ved (0,0). */
export const Pistol: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {/* greb */}
    <path d="M0,0 L-14,-92 Q-15,-100 -6,-102 L40,-104 Q48,-104 50,-96 L62,-8 Q63,2 54,4 L10,8 Q1,8 0,0 Z" fill="#111216" />
    {Array.from({ length: 9 }).map((_, i) => (
      <line key={i} x1={-6 + i * 0.4} y1={-84 + i * 9} x2={44 + i * 1.6} y2={-86 + i * 9} stroke="#1e2028" strokeWidth={2} />
    ))}
    {/* ramme + aftrækkerbøjle */}
    <path d="M-10,-100 L180,-104 L182,-124 L-8,-122 Z" fill="#15161b" />
    <path d="M50,-100 Q54,-62 92,-62 Q118,-62 120,-100" fill="none" stroke="#15161b" strokeWidth={9} />
    <path d="M80,-100 Q76,-84 84,-74" stroke="#2a2c34" strokeWidth={6} fill="none" />
    {/* slæde */}
    <rect x={-16} y={-160} width={214} height={40} rx={6} fill="#1a1b21" />
    <rect x={-16} y={-160} width={214} height={8} rx={4} fill="#4a5068" opacity={0.6} />
    {Array.from({ length: 7 }).map((_, i) => (
      <line key={i} x1={-4 + i * 6} y1={-156} x2={-4 + i * 6} y2={-124} stroke="#0a0b0e" strokeWidth={2.5} />
    ))}
    <rect x={150} y={-150} width={34} height={14} rx={3} fill="#0d0e12" />
    <rect x={186} y={-168} width={8} height={9} fill="#1a1b21" />
    <rect x={-12} y={-168} width={14} height={9} fill="#1a1b21" />
    <circle cx={198} cy={-140} r={6} fill="#000" />
    <line x1={-14} y1={-158} x2={196} y2={-158} stroke="#9aa5c4" strokeWidth={1.5} opacity={0.5} />
  </g>
);

/** Maskeret mand forfra i modlys. (x,y)=fødder, h=højde. gun = viser pistol i højre hånd */
export const MaskedMan: React.FC<{ x: number; y: number; h: number; rim?: string; t?: number; gun?: boolean; step?: number }> = ({
  x,
  y,
  h,
  rim = "#ffe2b8",
  t = 0,
  gun = true,
  step = 0,
}) => {
  const s = h / 100;
  const sw = Math.sin(t * 1.5) * 0.4;
  const legL = step * 6;
  const parts = (
    <>
      {/* ben */}
      <path d={`M-14,-46 L${-12 - legL * 0.3},-6 L${-4 - legL * 0.2},-6 L-1,-40 L1,-40 L4,-6 L12,-6 L14,-46 Z`} />
      {/* sko */}
      <path d={`M${-15 - legL * 0.3},-6 L${-3 - legL * 0.2},-6 L${-2 - legL * 0.2},0 L${-17 - legL * 0.3},0 Z M3,-6 L14,-6 L17,0 L2,0 Z`} />
      {/* jakke (oppustet) */}
      <path d="M-9,-84 Q-20,-82 -22,-74 L-21,-50 Q-18,-44 0,-44 Q18,-44 21,-50 L22,-74 Q20,-82 9,-84 Q0,-86 -9,-84 Z" />
      {/* arme */}
      <path d={`M-20,-78 Q-27,-70 -27,-56 L-26,-46 Q-23,-42 -19,-44 L-18,-58 L-17,-72 Z`} transform={`rotate(${sw},-20,-78)`} />
      <path d="M20,-78 Q28,-70 27,-56 L24,-48 Q20,-44 17,-47 L18,-60 L17,-72 Z" />
      {/* krave + hoved (elefanthue) */}
      <path d="M-7,-86 L-7,-81 L7,-81 L7,-86 Z" />
      <ellipse cx={0} cy={-92} rx={6.6} ry={8} />
    </>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={0.5} rx={22} ry={2.5} fill="#000" opacity={0.6} />
      <g fill={rim} transform="translate(0.8,-0.5)">
        {parts}
      </g>
      <g fill="#07080c">{parts}</g>
      {/* vattering-stik på jakken */}
      {[-76, -70, -64, -58, -52].map((yy) => (
        <path key={yy} d={`M-20,${yy} Q0,${yy + 2.5} 20,${yy}`} stroke="#1c2130" strokeWidth={0.7} fill="none" />
      ))}
      {[-76, -70, -64, -58, -52].map((yy) => (
        <path key={`h${yy}`} d={`M-19,${yy - 1.2} Q0,${yy + 1.3} 19,${yy - 1.2}`} stroke="#3a4462" strokeWidth={0.35} fill="none" opacity={0.7} />
      ))}
      <line x1={0} y1={-84} x2={0} y2={-45} stroke="#2a3045" strokeWidth={0.5} />
      {/* lomme på låret */}
      <rect x={-13} y={-32} width={6} height={8} rx={0.8} fill="none" stroke="#1c2130" strokeWidth={0.5} />
      <rect x={7} y={-32} width={6} height={8} rx={0.8} fill="none" stroke="#1c2130" strokeWidth={0.5} />
      {/* sko-sål fanger lyset */}
      <rect x={-17} y={-1.6} width={14} height={1.6} rx={0.6} fill="#e8e9ee" />
      <rect x={2.5} y={-1.6} width={14.5} height={1.6} rx={0.6} fill="#e8e9ee" />
      {/* øjenspalte i hue */}
      <rect x={-4.6} y={-95} width={9.2} height={3} rx={1.2} fill="#5b3a2a" />
      <circle cx={-2.2} cy={-93.6} r={0.75} fill="#f1f1f1" />
      <circle cx={2.2} cy={-93.6} r={0.75} fill="#f1f1f1" />
      <circle cx={-2.2} cy={-93.6} r={0.35} fill="#111" />
      <circle cx={2.2} cy={-93.6} r={0.35} fill="#111" />
      {/* handsker */}
      <ellipse cx={-25} cy={-44} rx={3.2} ry={3.6} fill="#050507" transform={`rotate(${sw},-20,-78)`} />
      <ellipse cx={22} cy={-46} rx={3.2} ry={3.6} fill="#050507" />
      {gun && <Pistol x={19.5} y={-44} s={0.1} rot={88} />}
    </g>
  );
};

/** Nærbillede: behandsket hånd der holder pistol ned langs låret (på jakke-baggrund) */
export const GunHand: React.FC<{ x: number; y: number; s: number; t: number; reveal: number }> = ({ x, y, s, t, reveal }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* låret (bukser) */}
    <path d="M-260,-420 L260,-420 L300,900 L-300,900 Z" fill="#0b0c11" />
    <path d="M-60,-420 L-40,900" stroke="#1a1d28" strokeWidth={6} />
    <rect x={-210} y={40} width={150} height={190} rx={14} fill="none" stroke="#1e2230" strokeWidth={6} />
    {/* jakkens kant */}
    <path d="M-320,-700 L320,-700 L330,-380 Q0,-330 -330,-380 Z" fill="#090a0f" />
    {[-640, -560, -470].map((yy) => (
      <path key={yy} d={`M-330,${yy} Q0,${yy + 40} 330,${yy}`} stroke="#222738" strokeWidth={6} fill="none" />
    ))}
    {/* pistol (træder frem) */}
    <g transform={`translate(${-20 + (1 - reveal) * -60},${-160 + (1 - reveal) * 40}) rotate(${80 + Math.sin(t * 2) * 1.5})`}>
      <Pistol x={0} y={0} s={2.2} rot={0} />
    </g>
    {/* handske om greb */}
    <path
      d={`M${-120},${-330} Q-40,-380 60,-340 L100,-260 Q110,-200 70,-170 L-20,-150 Q-110,-150 -140,-220 Z`}
      fill="#060608"
      transform={`translate(${(1 - reveal) * -60},${(1 - reveal) * 40})`}
    />
    {[-1, 0, 1, 2].map((k) => (
      <path key={k} d={`M${-90 + k * 50},-300 Q${-70 + k * 50},-250 ${-80 + k * 50},-200`} stroke="#1c1e26" strokeWidth={5} fill="none" transform={`translate(${(1 - reveal) * -60},${(1 - reveal) * 40})`} />
    ))}
    <path d="M-120,-330 Q-40,-380 60,-340" stroke={PAL.amber} strokeWidth={4} fill="none" opacity={0.5} transform={`translate(${(1 - reveal) * -60},${(1 - reveal) * 40})`} />
  </g>
);

/** Maskeret mand fra hoften og op, hætte over elefanthue, i modlys. (x,y)=midt ved hoften, s=skala (1 = 900px bred) */
export const MaskedBust: React.FC<{ x: number; y: number; s: number; t: number; look?: number }> = ({ x, y, s, t, look = 0 }) => {
  const breathe = Math.sin(t * 1.8) * 6;
  const torso = `M-330,0 L-345,-380 Q-360,-560 -230,-640 L-150,-690 Q0,-720 150,-690 L230,-640 Q360,-560 345,-380 L330,0 Z`;
  const hood = `M-235,-640 Q-275,-830 -200,-1010 Q-110,-1150 0,-1150 Q110,-1150 200,-1010 Q275,-830 235,-640 Q120,-600 0,-600 Q-120,-600 -235,-640 Z`;
  const armL = `M-345,-560 Q-450,-520 -470,-330 L-480,0 L-370,0 L-360,-330 Z`;
  const armR = `M345,-560 Q450,-520 470,-330 L480,0 L370,0 L360,-330 Z`;
  return (
    <g transform={`translate(${x},${y + breathe}) scale(${s})`}>
      {/* lyskant (modlys fra forlygter bagved) */}
      {[armL, armR, torso, hood].map((p, i) => (
        <path key={`r${i}`} d={p} fill="none" stroke="#fff1d6" strokeWidth={16} opacity={0.55} filter="url(#blur6)" />
      ))}
      {[armL, armR, torso].map((p, i) => (
        <path key={i} d={p} fill="url(#pufferGrad)" stroke="#5a6788" strokeWidth={3} />
      ))}
      {/* vattering */}
      {[-560, -470, -380, -290, -200, -110].map((yy) => (
        <g key={yy}>
          <path d={`M-345,${yy} Q0,${yy + 40} 345,${yy}`} stroke="#03040a" strokeWidth={7} fill="none" />
          <path d={`M-345,${yy - 14} Q0,${yy + 22} 345,${yy - 14}`} stroke="#6b7798" strokeWidth={3} fill="none" opacity={0.35} />
        </g>
      ))}
      {[-480, -380, -280, -180, -80].map((yy) => (
        <g key={`a${yy}`}>
          <path d={`M-470,${yy} Q-420,${yy + 18} -360,${yy}`} stroke="#03040a" strokeWidth={6} fill="none" />
          <path d={`M470,${yy} Q420,${yy + 18} 360,${yy}`} stroke="#03040a" strokeWidth={6} fill="none" />
        </g>
      ))}
      {/* lynlås */}
      <line x1={0} y1={-680} x2={0} y2={0} stroke="#1a1d26" strokeWidth={10} />
      <line x1={0} y1={-680} x2={0} y2={0} stroke="url(#chrome)" strokeWidth={3} opacity={0.6} />
      <rect x={-12} y={-640} width={24} height={46} rx={6} fill="url(#chrome)" />
      {/* hætte */}
      <path d={hood} fill="url(#pufferGrad)" stroke="#5a6788" strokeWidth={3} />
      <path d={`M-185,-660 Q-210,-830 -150,-960 Q-80,-1060 0,-1062 Q80,-1060 150,-960 Q210,-830 185,-660 Q90,-630 0,-630 Q-90,-630 -185,-660 Z`} fill="#020306" />
      {/* elefanthue (strik) */}
      <ellipse cx={0} cy={-830} rx={150} ry={200} fill="#0b0c12" />
      {Array.from({ length: 26 }).map((_, i) => (
        <line key={i} x1={-150 + i * 12} y1={-1010} x2={-150 + i * 12} y2={-640} stroke="#151824" strokeWidth={4} />
      ))}
      <ellipse cx={0} cy={-830} rx={150} ry={200} fill="none" stroke="#000" strokeWidth={30} opacity={0.6} />
      {/* øjenspalte med hud + øjne */}
      <rect x={-112} y={-918} width={224} height={62} rx={26} fill="#6a4532" />
      <rect x={-112} y={-918} width={224} height={20} rx={10} fill="#3b2418" />
      {[-1, 1].map((k) => (
        <g key={k}>
          <ellipse cx={k * 52} cy={-886} rx={30} ry={13} fill="#e9e3dc" />
          <circle cx={k * 52 + look * 10} cy={-886} r={11} fill="#3a2414" />
          <circle cx={k * 52 + look * 10} cy={-886} r={5.5} fill="#050302" />
          <circle cx={k * 52 + look * 10 + 4} cy={-890} r={2.5} fill="#fff" />
          <path d={`M${k * 52 - 32},-892 Q${k * 52},-908 ${k * 52 + 32},-892`} stroke="#1a0e08" strokeWidth={5} fill="none" />
        </g>
      ))}
    </g>
  );
};

/** Nærbillede: hættetrøjen løftes – pistolgrebet stikker op af bukselinningen (tydeligt sidelys) */
export const WaistGun: React.FC<{ x: number; y: number; s: number; lift: number }> = ({ x, y, s, lift }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {/* jeans */}
    <path d="M-540,0 L540,0 L580,900 L-580,900 Z" fill="url(#denim)" />
    <path d="M-40,40 L-30,900" stroke="#3a4668" strokeWidth={5} />
    <path d="M-420,60 Q-300,140 -200,60" stroke="#3a4668" strokeWidth={5} fill="none" />
    {/* bælte */}
    <rect x={-540} y={-36} width={1080} height={64} fill="#16120e" />
    <rect x={-540} y={-36} width={1080} height={6} fill="#5a4a3a" />
    <rect x={-70} y={-46} width={140} height={84} rx={10} fill="none" stroke="url(#chrome)" strokeWidth={10} />
    {/* t-shirt-kant */}
    <path d="M-540,-420 L540,-420 L540,-30 Q0,-10 -540,-30 Z" fill="#232838" />
    {/* pistolgreb i linningen */}
    <g transform="translate(230,60) rotate(-12)">
      <path d="M-62,0 L-52,-260 Q-50,-288 -22,-290 L96,-294 Q124,-294 124,-266 L110,0 Z" fill="#2a2d36" stroke="#c3cbe2" strokeWidth={5} />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={-46} y1={-28 - i * 22} x2={108} y2={-30 - i * 22} stroke="#3a3e4a" strokeWidth={5} />
      ))}
      <rect x={-68} y={-350} width={210} height={74} rx={10} fill="#30333c" stroke="#c3cbe2" strokeWidth={5} />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={-52 + i * 13} y1={-342} x2={-52 + i * 13} y2={-284} stroke="#15161b" strokeWidth={5} />
      ))}
      <path d="M-52,-262 L108,-268" stroke="#e8eeff" strokeWidth={4} opacity={0.7} />
    </g>
    <rect x={60} y={-36} width={380} height={64} fill="#16120e" />
    <rect x={60} y={-36} width={380} height={6} fill="#5a4a3a" />
    {/* hættetrøjens kant der løftes */}
    <path d={`M-600,${-900} L600,${-900} L600,${-260 - lift * 260} Q200,${-200 - lift * 300} -600,${-240 - lift * 120} Z`} fill="url(#pufferGrad)" stroke="#8a96b8" strokeWidth={4} />
    <path d={`M-600,${-260 - lift * 120} Q200,${-220 - lift * 300} 600,${-280 - lift * 260}`} stroke="#03040a" strokeWidth={22} fill="none" />
    {/* behandsket hånd der holder kanten */}
    <g transform={`translate(${-250},${-230 - lift * 190})`}>
      <path d="M-130,50 Q-150,-40 -86,-90 L40,-104 Q96,-104 104,-64 L108,-20 Q104,24 64,34 L-40,66 Q-108,78 -130,50 Z" fill="#08080b" stroke="#ffc27a" strokeWidth={4} />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${-64 + k * 42},-92 Q${-54 + k * 42},-44 ${-66 + k * 42},12`} stroke="#22252e" strokeWidth={6} fill="none" />
      ))}
    </g>
  </g>
);
