import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp, Fog, Rain } from "../components/City";
import { CarFront } from "../components/Car";
import { Smoke } from "../components/Props";
import { easeOut, W } from "../lib";

/** Callback: bilen kommer brølende mod kameraet og stopper med blændende forlygter. */
export const PullUpFront: React.FC<{ start: number }> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const k = easeOut(lt / 1.0);
  const vy = 1060;
  return (
    <Stage cam={[1.0 + k * 0.06, 0, (1 - k) * -40]}>
      <Sky t={t} moon={[200, 360]} />
      <Skyline seed="pf" base={vy} depth={0.5} maxH={950} t={t} offset={60} />
      <Fog t={t} y={vy - 60} />
      <polygon points={`${W / 2 - 40},${vy} ${W / 2 + 40},${vy} ${W + 900},2400 ${-900},2400`} fill="url(#road)" />
      <Lamp x={110} y={vy + 360} h={1000} side={1} />
      <Lamp x={970} y={vy + 360} h={1000} side={-1} />
      <CarFront x={W / 2} y={vy + 80 + k * 560} scale={0.3 + k * 1.15} flash={lt > 0.95 && lt < 1.4 ? 0.8 : 0} />
      {lt > 0.9 && <Smoke t={lt - 0.9} x={W / 2} y={1700} n={22} spread={0.8} seed="pf" color="#aab6d6" />}
      <Rain t={t} opacity={0.25} />
    </Stage>
  );
};
