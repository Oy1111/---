import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Bill } from "../components/Props";
import { Lamp } from "../components/City";
import { W } from "../lib";

/** "Flous": sedler regner ned gennem lyskeglen og lander i en bunke. */
export const Money: React.FC<{ start: number }> = ({ start }) => {
  const { lt } = useTimes(start);
  const bills = [];
  for (let i = 0; i < 46; i++) {
    const st = random(`m${i}`) * 2.0;
    const k = lt - st;
    if (k < 0) continue;
    const y = -150 + k * (700 + random(`v${i}`) * 300);
    const landed = y > 1500 + random(`l${i}`) * 140;
    const yy = landed ? 1500 + random(`l${i}`) * 140 : y;
    const x = 160 + random(`x${i}`) * 760 + (landed ? 0 : Math.sin(k * 3 + i) * 80);
    bills.push(<Bill key={i} x={x} y={yy} rot={landed ? random(`r${i}`) * 60 - 30 : Math.sin(k * 4 + i) * 60} s={0.9 + random(`s${i}`) * 0.4} />);
  }
  return (
    <Stage cam={[1.02 + lt * 0.02, 0, 0]} bg="#04050a">
      <rect x={-200} y={-200} width={W + 400} height={2400} fill="#05060d" />
      <Lamp x={540} y={1700} h={1600} side={1} />
      <polygon points="460,0 760,0 1100,1700 100,1700" fill="url(#cone)" opacity={0.7} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={600} cy={1640} rx={500} ry={70} fill="url(#shadow)" />
      {bills}
    </Stage>
  );
};
