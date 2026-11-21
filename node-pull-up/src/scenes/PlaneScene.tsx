import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline } from "../components/City";
import { Plane, Palm } from "../components/Props";
import { PAL, W } from "../lib";

/** "'Cita fløjet ind fra Dominicana": fly over palmer og havet, landingslys. */
export const PlaneScene: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const u = lt / dur;
  return (
    <Stage cam={[1.0 + u * 0.05, 0, 0]}>
      <Sky t={t} moon={[220, 420]} />
      {/* hav */}
      <rect x={-200} y={1250} width={W + 400} height={800} fill="#060b1c" />
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i} x={220 - 120 + Math.sin(t * 2 + i) * 30 - i * 4} y={1260 + i * 18} width={240 + i * 8} height={3} fill="#e9eefc" opacity={0.35 * (1 - i / 30)} />
      ))}
      <Skyline seed="pl" base={1260} depth={0.5} maxH={300} t={t} offset={0} />
      <Plane x={1450 - u * 1900} y={640 + u * 240} s={1.15} t={t} rot={-7} />
      {[40, 210, 900, 1050].map((x, i) => (
        <Palm key={i} x={x} y={1950} h={560 + (i % 2) * 160} t={t} seed={`p${i}`} />
      ))}
      <rect x={-200} y={1700} width={W + 400} height={400} fill="#020309" />
      <circle cx={540} cy={1700} r={500} fill={PAL.magenta} opacity={0.06} />
    </Stage>
  );
};
