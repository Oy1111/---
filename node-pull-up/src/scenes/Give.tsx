import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Hand } from "../components/Figures";
import { Bill } from "../components/Props";
import { CarSide } from "../components/Car";
import { Sky, Skyline } from "../components/City";
import { wordTimes } from "../data/timing";
import { easeOut, W } from "../lib";

/** "Jeg gi'r hva' jeg får": hånd ud af bilruden rækker en bunke sedler videre. */
export const Give: React.FC<{ start: number; line: number }> = ({ start, line }) => {
  const { t } = useTimes(start);
  const gir = wordTimes(line, "gi'r")[0] ?? start + 0.3;
  const reach = easeOut((t - gir + 0.1) / 0.4);
  return (
    <Stage cam={[1.5, -90, -300]}>
      <Sky t={t} />
      <Skyline seed="giv" base={1300} depth={0.6} maxH={900} t={t} offset={900} />
      <rect x={-200} y={1300} width={W + 400} height={800} fill="url(#road)" />
      <CarSide x={420} y={1560} scale={1.05} beam={0.4} />
      <Hand x={380 + reach * 220} y={1240} s={0.9} rot={-4} />
      <g transform={`translate(${520 + reach * 260},1230)`}>
        <Bill x={0} y={0} rot={-8} />
        <Bill x={8} y={-10} rot={-2} />
        <Bill x={16} y={-20} rot={6} />
      </g>
      <Hand x={1320 - reach * 300} y={1210} s={0.9} rot={4} flip />
    </Stage>
  );
};
