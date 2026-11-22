import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { GFront } from "../components/GWagon";
import { Rain } from "../components/City";
import { Smoke } from "../components/Props";
import { easeOut } from "../lib";

/** G-klassen kommer ned ad Strøget mod kameraet og "puller op" med hård opbremsning. */
export const GArrive: React.FC<{ start: number; dur: number; stopAt?: number }> = ({ start, stopAt = 1.0 }) => {
  const { lt, t } = useTimes(start);
  const k = easeOut(lt / stopAt);
  // nedbremsning: næsen dykker og fjedrer tilbage
  const dive = lt > stopAt - 0.08 ? Math.sin(Math.min(1, (lt - stopAt + 0.08) / 0.45) * Math.PI) * 18 * Math.exp(-(lt - stopAt) * 2) : 0;
  const sc = 0.22 + k * 1.18;
  const y = 1100 + k * 620;
  return (
    <Stage cam={[1.0 + k * 0.04, 0, 0]}>
      <Stroget t={t} camZ={1.2} />
      <g transform={`rotate(${dive * 0.05},540,${y})`}>
        <GFront x={540} y={y + dive} s={sc} t={t} uid="arr" flash={lt > stopAt - 0.05 && lt < stopAt + 0.35 ? 0.9 : 0} />
      </g>
      {lt > stopAt - 0.2 && <Smoke t={lt - stopAt + 0.2} x={540} y={1780} n={26} spread={0.9} seed="arr" color="#b9c2dc" />}
      <Rain t={t} opacity={0.22} />
    </Stage>
  );
};
