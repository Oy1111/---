import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { MaskedBust, Pistol } from "../components/Masked";
import { Rain } from "../components/City";
import { easeOut } from "../lib";

/** "han har den på sig": tæt på den maskerede – pistolen i den behandskede hånd, nede langs siden. */
export const GunScene: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const k = easeOut(lt / 0.35);
  return (
    <Stage cam={[1.0 + (lt / dur) * 0.06, 0, 0]}>
      <g filter="url(#blur6)">
        <Stroget t={t} camZ={2.6} people={false} vx={400} />
      </g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#05060c" opacity={0.35} />
      <MaskedBust x={400} y={2250} s={1.1} t={t} look={0.5} />
      {/* hånd + pistol træder ind nederst til højre */}
      <g transform={`translate(${700 + (1 - k) * 120},${1420 + (1 - k) * 160}) rotate(${98 + Math.sin(t * 2) * 1.5})`}>
        <circle cx={0} cy={-120} r={260} fill="url(#glowAmber)" opacity={0.35} style={{ mixBlendMode: "screen" }} />
        <path d="M-110,0 L90,10 L150,560 L-190,560 Z" fill="url(#pufferGrad)" stroke="#5a6788" strokeWidth={3} />
        <Pistol x={-30} y={0} s={1.6} />
        <path d="M-120,-30 Q-140,-130 -70,-170 L40,-180 Q90,-176 96,-130 L100,-60 Q96,-10 56,0 L-40,20 Q-104,24 -120,-30 Z" fill="#060608" stroke="#ffc27a" strokeWidth={4} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-70 + i * 40},-165 Q${-60 + i * 40},-110 ${-72 + i * 40},-40`} stroke="#22252e" strokeWidth={6} fill="none" />
        ))}
        <path d="M-130,180 Q0,200 120,190 M-150,330 Q0,350 135,340" stroke="#03040a" strokeWidth={8} fill="none" />
      </g>
      <Rain t={t} opacity={0.3} />
    </Stage>
  );
};
