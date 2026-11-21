import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp } from "../components/City";
import { CarSide } from "../components/Car";
import { PAL, W, beatPulse } from "../lib";

/** Bilen fra siden i fuld fart: motion-striber, slørede lamper, kameraet følger med. */
export const SpeedSide: React.FC<{ start: number }> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const scroll = lt * 3200;
  const ground = 1450;
  const bp = beatPulse(t);
  return (
    <Stage cam={[1.05 + bp * 0.03, Math.sin(t * 30) * 3, Math.cos(t * 27) * 3]}>
      <Sky t={t} />
      <Skyline seed="spfar" base={ground - 140} depth={0.45} maxH={1000} t={t} offset={scroll * 0.08} width={6000} />
      <g filter="url(#blur6)">
        <Skyline seed="spnear" base={ground - 80} depth={0.85} maxH={700} t={t} offset={scroll * 0.4} width={9000} />
      </g>
      <rect x={-200} y={ground - 80} width={W + 400} height={36} fill="#161c30" />
      <rect x={-200} y={ground - 44} width={W + 400} height={700} fill="url(#road)" />
      <g filter="url(#blur6)">
        {Array.from({ length: 6 }).map((_, i) => {
          const x = ((i * 520 - scroll) % 3120 + 3120) % 3120 - 600;
          return <Lamp key={i} x={x} y={ground - 60} h={900} />;
        })}
      </g>
      {Array.from({ length: 26 }).map((_, i) => (
        <rect key={i} x={((i * 173 - scroll * 1.4) % 1600 + 1600) % 1600 - 300} y={250 + ((i * 131) % 1500)} width={260 + (i % 5) * 90} height={3} fill={i % 3 ? "#cfe0ff" : PAL.amber} opacity={0.35} />
      ))}
      <CarSide x={540 + Math.sin(t * 2) * 30} y={ground + 40} scale={1.05} spin={scroll * 0.9} underglow={1} />
    </Stage>
  );
};
