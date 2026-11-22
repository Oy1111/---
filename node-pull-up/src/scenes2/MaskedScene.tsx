import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { GFront } from "../components/GWagon";
import { MaskedBust } from "../components/Masked";
import { Rain } from "../components/City";
import { easeOut } from "../lib";

/** "min bror": den maskerede mand træder frem foran G-klassens forlygter (modlys). */
export const MaskedScene: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const k = easeOut(lt / 0.5);
  return (
    <Stage cam={[1.0 + (lt / dur) * 0.06, 0, 0]}>
      <g filter="url(#blur6)">
        <Stroget t={t} camZ={2.2} people={false} />
        <GFront x={540} y={1500} s={0.95} t={t} uid="msk" flash={0.3} />
      </g>
      <circle cx={540} cy={1200} r={900} fill="url(#glowWhite)" opacity={0.25} />
      <MaskedBust x={540} y={2050 + (1 - k) * 140} s={0.98} t={t} look={Math.sin(t * 0.8) * 0.6} />
      <Rain t={t} opacity={0.3} />
    </Stage>
  );
};
