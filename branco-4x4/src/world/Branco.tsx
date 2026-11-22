import React from "react";
import { staticFile } from "remotion";
import { beatPulse } from "../lib";

/** Branco (tegnet portræt ud fra foto) i midten forneden, med neon-lyskant i to farver. */
const IMG = { w: 1108, h: 1108, crop: [97, 134, 979, 1108] as const };
export const BrancoDefs: React.FC<{ a: string; b: string }> = ({ a, b }) => (
  <defs>
    <filter id="bRim" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
      <feComponentTransfer in="SourceGraphic" result="g">
        <feFuncR type="gamma" amplitude="1.02" exponent="1.05" offset="0" />
        <feFuncG type="gamma" amplitude="0.96" exponent="1.08" offset="0" />
        <feFuncB type="gamma" amplitude="1.06" exponent="1.0" offset="0.02" />
      </feComponentTransfer>
      <feOffset in="SourceAlpha" dx="-9" dy="3" result="o1" />
      <feComposite in="SourceAlpha" in2="o1" operator="out" result="e1" />
      <feGaussianBlur in="e1" stdDeviation="2.2" result="e1b" />
      <feFlood floodColor={a} result="ca" />
      <feComposite in="ca" in2="e1b" operator="in" result="r1" />
      <feOffset in="SourceAlpha" dx="9" dy="3" result="o2" />
      <feComposite in="SourceAlpha" in2="o2" operator="out" result="e2" />
      <feGaussianBlur in="e2" stdDeviation="2.2" result="e2b" />
      <feFlood floodColor={b} result="cb" />
      <feComposite in="cb" in2="e2b" operator="in" result="r2" />
      <feGaussianBlur in="r1" stdDeviation="12" result="r1g" />
      <feGaussianBlur in="r2" stdDeviation="12" result="r2g" />
      <feMerge>
        <feMergeNode in="g" />
        <feMergeNode in="r1g" /><feMergeNode in="r1" />
        <feMergeNode in="r2g" /><feMergeNode in="r2" />
      </feMerge>
    </filter>
  </defs>
);

export const BX = 540, BH = 1040; // figurhøjde på skærmen
export const bScale = BH / (IMG.crop[3] - IMG.crop[1]);
/** billed-koordinat -> skærm (til glas-refleks osv.) */
export const bPt = (ix: number, iy: number, t = 0): [number, number] => {
  const s = bScale * (1 + beatPulse(t) * 0.008);
  const left = BX - ((IMG.crop[0] + IMG.crop[2]) / 2) * s;
  const top = 1920 - IMG.crop[3] * s + 8;
  return [left + ix * s, top + iy * s];
};

export const Branco: React.FC<{ t: number }> = ({ t }) => {
  const s = bScale * (1 + beatPulse(t) * 0.008);
  const left = BX - ((IMG.crop[0] + IMG.crop[2]) / 2) * s + Math.sin(t * 0.8) * 4;
  const top = 1920 - IMG.crop[3] * s + 8;
  return (
    <g>
      <ellipse cx={BX} cy={1920} rx={520} ry={80} fill="#000" opacity={0.6} filter="url(#nSoft)" />
      <image href={staticFile("people/branco_vector.png")} x={left} y={top} width={IMG.w * s} height={IMG.h * s} filter="url(#bRim)" preserveAspectRatio="none" />
    </g>
  );
};
