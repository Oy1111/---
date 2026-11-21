import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp } from "../components/City";
import { CarSide } from "../components/Car";
import { Smoke } from "../components/Props";
import { W } from "../lib";

/** "Duften nærmer, råber fri marijuana": parkeret bil under lygten, røg vælter ud af det åbne vindue. */
export const SmokeScene: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const ground = 1560;
  return (
    <Stage cam={[1.25 + (lt / dur) * 0.12, -120, 160]}>
      <Sky t={t} />
      <Skyline seed="smk" base={ground - 100} depth={0.6} maxH={900} t={t} offset={600} />
      <rect x={-300} y={ground - 60} width={W + 600} height={800} fill="url(#road)" />
      <Lamp x={360} y={ground - 40} h={1100} />
      <CarSide x={600} y={ground + 40} scale={1.05} beam={0} lights={0.4} />
      <Smoke t={lt} x={560} y={ground - 260} n={34} spread={1.4} seed="weed" color="#b8c9a8" />
      <Smoke t={lt + 1.3} x={720} y={ground - 240} n={20} spread={1.1} seed="weed2" color="#c9d4f0" />
    </Stage>
  );
};
