import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Equalizer, Speedo, Knob } from "../components/Props";
import { Skyline, Sky } from "../components/City";
import { PAL, W, beatPulse, easeOut } from "../lib";

/** Indefra bilen: forrude med byens lys der suser forbi, speedometer og equalizer på max. */
export const Dashboard: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const bp = beatPulse(t);
  const v = 0.3 + easeOut(lt / dur) * 0.62 + bp * 0.03;
  return (
    <Stage cam={[1.0 + bp * 0.02, Math.sin(t * 20) * 2, 0]}>
      <Sky t={t} />
      <Skyline seed="dash" base={900} depth={0.8} maxH={700} t={t} offset={lt * 900} width={9000} />
      {/* lysstriber (lygter der passerer) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = ((i * 260 - lt * 2200) % 2600 + 2600) % 2600 - 600;
        return <rect key={i} x={x} y={820 + (i % 3) * 40} width={260} height={6} fill={i % 2 ? PAL.amber : "#cfe0ff"} opacity={0.6} filter="url(#blur6)" />;
      })}
      <rect x={-200} y={880} width={W + 400} height={200} fill="#0b1020" />
      {/* forrude-ramme + interiør */}
      <path d="M-200,-200 L1280,-200 L1280,1060 Q540,960 -200,1060 Z M-60,140 Q540,40 1140,140 L1180,980 Q540,900 -100,980 Z" fill="#04050a" fillRule="evenodd" />
      <path d="M-200,1000 Q540,880 1280,1000 L1280,2200 L-200,2200 Z" fill="#070a14" />
      <path d="M-200,1000 Q540,880 1280,1000" stroke="#2b3760" strokeWidth={4} fill="none" />
      {/* instrumentbræt */}
      <rect x={80} y={1120} width={920} height={420} rx={60} fill="#05070f" stroke="#1f2847" strokeWidth={4} />
      <Speedo x={330} y={1330} r={180} v={v} />
      <Equalizer x={560} y={1480} w={400} h={300} level={0.6 + bp * 0.4} t={t} n={10} />
      <Knob x={540} y={1720} r={80} v={0.85 + bp * 0.15} />
      {/* rat */}
      <circle cx={330} cy={1900} r={420} fill="none" stroke="#0b0f1c" strokeWidth={80} />
      <circle cx={330} cy={1900} r={420} fill="none" stroke="#2b3760" strokeWidth={3} opacity={0.6} />
      <rect x={0} y={0} width={W} height={1920} fill="url(#glowCyan)" opacity={0.06} />
    </Stage>
  );
};
