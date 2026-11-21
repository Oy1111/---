import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp, Fog, Rain } from "../components/City";
import { CarRear } from "../components/Car";
import { PAL, W, beatPulse } from "../lib";

/** Jagtvinkel bagfra: bilen kører ned ad en lang gade, lamperne suser forbi. */
export const Chase: React.FC<{ start: number; dur: number; away?: boolean }> = ({ start, dur, away = false }) => {
  const { lt, t } = useTimes(start);
  const vy = 1000;
  const bp = beatPulse(t);
  const sc = away ? 0.95 - (lt / dur) * 0.6 : 0.95 + Math.sin(t * 3) * 0.02;
  const sway = Math.sin(t * 1.6) * 40;
  return (
    <Stage cam={[1.0 + bp * 0.02, 0, 0]}>
      <Sky t={t} moon={[860, 380]} />
      <Skyline seed="cfar" base={vy} depth={0.5} maxH={850} t={t} offset={20} />
      <Fog t={t} y={vy - 40} opacity={0.16} />
      <polygon points={`${W / 2 - 30},${vy} ${W / 2 + 30},${vy} ${W + 900},2300 ${-900},2300`} fill="url(#road)" />
      {Array.from({ length: 14 }).map((_, i) => {
        const z = (i / 14 + lt * 0.55) % 1;
        const y = vy + Math.pow(z, 2.3) * 1400;
        return <rect key={i} x={W / 2 - 3 - z * 18} y={y} width={6 + z * 36} height={12 + z * 140} fill={PAL.sodium} opacity={0.6 * z} />;
      })}
      {[-1, 1].map((s) =>
        Array.from({ length: 6 }).map((_, k) => {
          const z = Math.pow(((k / 6 + lt * 0.55) % 1), 2.3);
          return <Lamp key={`${s}${k}`} x={W / 2 + s * (40 + z * 1100)} y={vy + z * 1400} h={120 + z * 1500} side={(s * -1) as 1 | -1} />;
        }),
      )}
      <CarRear x={W / 2 + sway} y={1650 - (away ? (lt / dur) * 450 : 0)} scale={sc * 1.25} brake={0.3 + bp * 0.5} />
      <Rain t={t} opacity={0.28} speed={1.3} />
    </Stage>
  );
};
