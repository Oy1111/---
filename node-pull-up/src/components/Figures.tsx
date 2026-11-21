import React from "react";
import { PAL } from "../lib";

/** Mand forfra (hættetrøje, kasket, kæde). (x,y)=fødder, h=højde */
export const Guy: React.FC<{ x: number; y: number; h: number; rim?: string; t?: number; shades?: boolean; chain?: boolean; flip?: boolean }> = ({
  x,
  y,
  h,
  rim = PAL.amber,
  t = 0,
  shades = true,
  chain = true,
  flip = false,
}) => {
  const s = h / 100;
  const sway = Math.sin(t * 2) * 0.6;
  const body = (
    <>
      <path d="M-7,0 L-6,-42 L-1,-42 L-1,0 Z M1,0 L1,-42 L6,-42 L7,0 Z" />
      <path d="M-17,-76 Q-22,-74 -23,-66 L-24,-44 L-19,-42 L-17,-58 L-15,-40 L15,-40 L17,-58 L19,-42 L24,-44 L23,-66 Q22,-74 17,-76 Q8,-80 0,-80 Q-8,-80 -17,-76 Z" />
      <path d="M-7,-79 L-7,-83 L7,-83 L7,-79 Z" />
      <path d="M0,-99 C-7,-99 -8,-93 -8,-89 C-8,-84 -5,-81 0,-81 C5,-81 8,-84 8,-89 C8,-93 7,-99 0,-99 Z" />
      <path d="M-9,-93 Q-9,-101 0,-101 Q9,-101 9,-93 L14,-92 L14,-90 L-9,-90 Z" />
    </>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${sway})`}>
      <g fill={rim} transform="translate(-0.9,-0.4)">
        {body}
      </g>
      <g fill="#05070d">{body}</g>
      {shades && <rect x={-6.5} y={-92} width={13} height={3} rx={1.2} fill="#0d1430" stroke={PAL.cyan} strokeWidth={0.4} />}
      {chain && <path d="M-6,-79 Q0,-66 6,-79" fill="none" stroke="url(#gold)" strokeWidth={1.1} />}
      {chain && <circle cx={0} cy={-68} r={1.6} fill="url(#gold)" />}
    </g>
  );
};

/** Kvinde (silhuet, langt hår, højhælede). (x,y)=fødder */
export const Girl: React.FC<{ x: number; y: number; h: number; rim?: string; t?: number; flip?: boolean }> = ({ x, y, h, rim = PAL.magenta, t = 0, flip = false }) => {
  const s = h / 100;
  const hair = Math.sin(t * 2.2) * 1.5;
  const body = (
    <>
      <path d="M-5,0 L-3.5,-38 L-0.5,-38 L-2.5,0 Z M2.5,0 L0.5,-38 L3.5,-38 L5,0 Z" />
      <path d="M-11,-78 Q-14,-76 -14,-70 L-12,-58 Q-13,-50 -16,-38 Q0,-34 16,-38 Q13,-50 12,-58 L14,-70 Q14,-76 11,-78 Q5,-80 0,-80 Q-5,-80 -11,-78 Z" />
      <path d="M-13,-74 Q-18,-60 -17,-46 L-14,-46 Q-14,-60 -11,-68 Z M13,-74 Q18,-60 17,-46 L14,-46 Q14,-60 11,-68 Z" />
      <path d="M-3,-84 L-3,-79 L3,-79 L3,-84 Z" />
      <path d="M0,-100 C-6,-100 -7,-95 -7,-91 C-7,-86 -4,-83 0,-83 C4,-83 7,-86 7,-91 C7,-95 6,-100 0,-100 Z" />
      <path
        d={`M-7,-96 C-7,-103 8,-103 8,-96 C11,-86 12,-74 ${11 + hair},-60 C9,-58 6,-58 4,-60 L-4,-60 C-7,-58 -10,-58 ${-11 + hair},-60 C-12,-74 -11,-87 -7,-96 Z`}
      />
    </>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <g fill={rim} transform="translate(-0.9,-0.4)">
        {body}
      </g>
      <g fill="#05070d">{body}</g>
      <circle cx={-6.8} cy={-88} r={1.4} fill="none" stroke="url(#gold)" strokeWidth={0.5} />
    </g>
  );
};

/** Hånd der rækker frem (fra venstre), håndled i (0,0), fingre mod højre */
export const Hand: React.FC<{ x: number; y: number; s: number; rot?: number; flip?: boolean; rim?: string }> = ({ x, y, s, rot = 0, flip = false, rim = PAL.amber }) => {
  const shape = (
    <>
      <path d="M-400,-40 L0,-46 L0,46 L-400,52 Z" />
      <path d="M0,-46 Q40,-60 90,-50 L170,-52 Q186,-50 184,-36 Q182,-26 168,-26 L110,-24 L176,-18 Q192,-14 190,0 Q188,12 172,12 L112,12 L166,22 Q180,26 178,38 Q176,50 162,48 L104,40 L148,52 Q160,58 156,68 Q150,78 136,74 L70,58 Q30,62 0,46 Z" />
      <path d="M40,-48 Q70,-90 96,-96 Q110,-98 108,-84 Q100,-70 80,-48 Z" />
    </>
  );
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <g fill={rim} transform="translate(0,-3)">
        {shape}
      </g>
      <g fill="#0a0d18">{shape}</g>
      <path d="M-400,-40 L0,-46" stroke="#1a2340" strokeWidth={6} />
    </g>
  );
};
