import React from "react";
import { staticFile } from "remotion";

/**
 * Lamin som tegnet (vektor) portræt – lavet ud fra hans foto, farvelagt varm duotone.
 * (x,y) = bund-midte, h = højde. rim = lyskant-farve.
 */
const SRC = { src: "people/lamin_vector.png", w: 1085, h: 1148, crop: [103, 0, 1054, 1148] as const };

export const LaminDefs: React.FC = () => (
  <defs>
    {[
      ["rimWarm", "#ffc27a", -8],
      ["rimCool", "#9cc4ff", 8],
      ["rimGold", "#ffd36b", 8],
    ].map(([id, col, dx]) => (
      <filter key={id as string} id={id as string} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feComponentTransfer in="SourceGraphic" result="lift">
          <feFuncR type="gamma" amplitude="1.12" exponent="0.9" offset="0.01" />
          <feFuncG type="gamma" amplitude="1.08" exponent="0.92" offset="0.01" />
          <feFuncB type="gamma" amplitude="1.04" exponent="0.95" offset="0.02" />
        </feComponentTransfer>
        <feOffset in="SourceAlpha" dx={dx as number} dy="5" result="off" />
        <feComposite in="SourceAlpha" in2="off" operator="out" result="edge" />
        <feGaussianBlur in="edge" stdDeviation="2.4" result="edgeB" />
        <feFlood floodColor={col as string} floodOpacity="1" result="c" />
        <feComposite in="c" in2="edgeB" operator="in" result="rim" />
        <feGaussianBlur in="rim" stdDeviation="12" result="rimGlow" />
        <feMerge>
          <feMergeNode in="lift" />
          <feMergeNode in="rimGlow" />
          <feMergeNode in="rim" />
        </feMerge>
      </filter>
    ))}
  </defs>
);

export const Lamin: React.FC<{ x: number; y: number; h: number; rim?: "rimWarm" | "rimCool" | "rimGold"; t?: number; opacity?: number; shadow?: boolean }> = ({
  x, y, h, rim = "rimWarm", t = 0, opacity = 1, shadow = true,
}) => {
  const [cx0, cy0, cx1, cy1] = SRC.crop;
  const scale = h / (cy1 - cy0);
  const left = x - ((cx0 + cx1) / 2) * scale;
  const top = y - cy1 * scale;
  const breathe = 1 + Math.sin(t * 1.6) * 0.005;
  return (
    <g opacity={opacity} transform={`translate(${x},${y}) scale(${breathe}) translate(${-x},${-y})`}>
      {shadow && <ellipse cx={x} cy={y} rx={(cx1 - cx0) * scale * 0.5} ry={40} fill="url(#shadow)" />}
      <image href={staticFile(SRC.src)} x={left} y={top} width={SRC.w * scale} height={SRC.h * scale} filter={`url(#${rim})`} preserveAspectRatio="none" />
    </g>
  );
};
