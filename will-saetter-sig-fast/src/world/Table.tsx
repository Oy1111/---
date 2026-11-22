import React from "react";
import { TABLE } from "./Characters";
import { FLOOR } from "./Room";

/** Spisebord (side) med bordplade i let perspektiv. */
export const Table: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { x0, x1, y } = TABLE;
  return (
    <g>
      <ellipse cx={(x0 + x1) / 2} cy={FLOOR + 40} rx={(x1 - x0) * 0.6} ry={40} fill="#000" opacity={0.5} filter="url(#fBlur14)" />
      {[x0 + 60, x1 - 90].map((lx) => (
        <g key={lx}>
          <path d={`M${lx},${y + 40} L${lx + 30},${y + 40} L${lx + 26},${FLOOR + 20} L${lx + 4},${FLOOR + 20}Z`} fill="#3a2414" />
          <rect x={lx + 18} y={y + 40} width={6} height={FLOOR - y - 20} fill="#6a4428" opacity={0.5} />
        </g>
      ))}
      <rect x={x0 + 40} y={y + 30} width={x1 - x0 - 80} height={40} fill="#2a1a0e" />
      {/* bordplade-overflade set lidt oppefra */}
      <path d={`M${x0 + 30},${y - 70} L${x1 - 30},${y - 70} L${x1},${y} L${x0},${y}Z`} fill="url(#gTableTop)" />
      <path d={`M${x0 + 30},${y - 70} L${x1 - 30},${y - 70}`} stroke="#a87a50" strokeWidth={3} opacity={0.6} />
      {children}
      <rect x={x0} y={y} width={x1 - x0} height={34} fill="#5a3a22" />
      <rect x={x0} y={y} width={x1 - x0} height={5} fill="#a87a50" opacity={0.7} />
    </g>
  );
};
