import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Dust } from "../components/City";
import { Guy } from "../components/Figures";
import { Sparkle } from "../components/Props";
import { PAL, W, easeOut } from "../lib";

/** "Stilen bar' Christian Dior": modefoto – figur i spotlight, kamerablitz, glimt i solbriller og kæde. */
export const Style: React.FC<{ start: number }> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const flashes = [0.15, 0.55, 0.8, 1.15];
  let fl = 0;
  for (const f of flashes) if (lt >= f) fl = Math.max(fl, Math.exp(-(lt - f) * 9));
  return (
    <Stage cam={[1.0 + easeOut(lt / 1.5) * 0.12, 0, -60]}>
      <Sky t={t} stars={false} />
      <Skyline seed="sty" base={1200} depth={0.35} maxH={900} t={t} offset={100} />
      <rect x={-200} y={1200} width={W + 400} height={900} fill="#06080f" />
      <polygon points="420,-50 660,-50 960,1820 120,1820" fill="url(#cone)" opacity={0.85} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={540} cy={1820} rx={360} ry={50} fill="url(#shadow)" />
      <Guy x={540} y={1820} h={1280} t={t} rim={PAL.sodium} />
      <Sparkle x={505} y={1820 - 1280 * 0.905} r={140 * fl + 30} rot={t * 50} />
      <Sparkle x={540} y={1820 - 1280 * 0.68} r={90 * Math.abs(Math.sin(t * 4))} />
      <rect x={-200} y={-200} width={W + 400} height={2400} fill="#fff" opacity={fl * 0.35} />
      <Dust t={t} n={60} area={[200, 0, 700, 1800]} />
    </Stage>
  );
};
