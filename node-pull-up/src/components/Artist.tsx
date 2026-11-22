import React from "react";
import { staticFile } from "remotion";

/**
 * Foto-udklip af kunstneren, farvegradet til nattescenen med lyskant (rim light).
 * (x,y) = midten forneden af billedet, h = højde i px. rim = farve på lyskanten.
 * Billederne er rigtige fotos – derfor ser ansigter og kroppe ægte ud.
 */
export const ARTISTS = {
  node: { src: "people/node_vector.png", w: 784, h: 1020, crop: [141, 200, 643, 1013] as const },
  gilli: { src: "people/gilli_vector.png", w: 1200, h: 1200, crop: [28, 53, 1200, 1200] as const },
};

export const ArtistDefs: React.FC = () => (
  <defs>
    {[
      ["rimWarm", "#ffc27a", -7],
      ["rimCool", "#9cc4ff", 7],
      ["rimWarmR", "#ffc27a", 7],
    ].map(([id, col, dx]) => (
      <filter key={id as string} id={id as string} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        {/* natte-grading: lidt mørkere, kølige skygger, varm midtone */}
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0.86 0.06 0 0 0.0  0.02 0.82 0.04 0 0.0  0.02 0.06 0.84 0 0.035  0 0 0 1 0"
          result="graded"
        />
        <feComponentTransfer in="graded" result="contrast">
          <feFuncR type="gamma" amplitude="1" exponent="1.12" offset="0" />
          <feFuncG type="gamma" amplitude="1" exponent="1.12" offset="0" />
          <feFuncB type="gamma" amplitude="1" exponent="1.06" offset="0" />
        </feComponentTransfer>
        {/* lyskant: alpha minus forskudt alpha */}
        <feOffset in="SourceAlpha" dx={dx as number} dy="4" result="off" />
        <feComposite in="SourceAlpha" in2="off" operator="out" result="edge" />
        <feGaussianBlur in="edge" stdDeviation="2.2" result="edgeB" />
        <feFlood floodColor={col as string} floodOpacity="0.95" result="c" />
        <feComposite in="c" in2="edgeB" operator="in" result="rim" />
        <feGaussianBlur in="rim" stdDeviation="9" result="rimGlow" />
        <feMerge>
          <feMergeNode in="contrast" />
          <feMergeNode in="rimGlow" />
          <feMergeNode in="rim" />
        </feMerge>
      </filter>
    ))}
  </defs>
);

export const Artist: React.FC<{
  who: "node" | "gilli";
  x: number;
  y: number;
  h: number;
  rim?: "rimWarm" | "rimCool" | "rimWarmR";
  t?: number;
  flip?: boolean;
  opacity?: number;
}> = ({ who, x, y, h, rim = "rimWarm", t = 0, flip = false, opacity = 1 }) => {
  const a = ARTISTS[who];
  const [cx0, cy0, cx1, cy1] = a.crop;
  const scale = h / (cy1 - cy0);
  const w = a.w * scale;
  const hh = a.h * scale;
  // billedets venstre-top så beskæringens bund-midte lander i (x,y)
  const left = x - ((cx0 + cx1) / 2) * scale;
  const top = y - cy1 * scale;
  const breathe = 1 + Math.sin(t * 1.6) * 0.004;
  return (
    <g opacity={opacity} transform={`translate(${x},${y}) scale(${flip ? -breathe : breathe},${breathe}) translate(${-x},${-y})`}>
      <ellipse cx={x} cy={y + 6} rx={(cx1 - cx0) * scale * 0.55} ry={28} fill="url(#shadow)" />
      <image href={staticFile(a.src)} x={left} y={top} width={w} height={hh} filter={`url(#${rim})`} preserveAspectRatio="none" />
    </g>
  );
};
