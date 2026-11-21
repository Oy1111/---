import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Diamond, Chain, Sparkle } from "../components/Props";
import { Dust } from "../components/City";
import { wordTimes } from "../data/timing";
import { easeOut, PAL } from "../lib";

/** "Sten fra Dolce Gabbana": diamant-vedhæng på sort fløjl, lysstråler, glimt. */
export const Stone: React.FC<{ start: number; line: number }> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const sten = wordTimes(line, "sten")[0] ?? start;
  const k = t - sten;
  const rot = Math.sin(t * 1.4) * 8;
  return (
    <Stage cam={[1.0 + lt * 0.03, 0, 0]} bg="#050308">
      <rect x={-200} y={-200} width={1480} height={2400} fill="#07050c" />
      {Array.from({ length: 12 }).map((_, i) => (
        <polygon key={i} points={`540,1150 ${540 + Math.cos(i * 0.52 + t * 0.3) * 1600},${1150 + Math.sin(i * 0.52 + t * 0.3) * 1600} ${540 + Math.cos(i * 0.52 + 0.12 + t * 0.3) * 1600},${1150 + Math.sin(i * 0.52 + 0.12 + t * 0.3) * 1600}`} fill="#bfdcff" opacity={0.05 + 0.05 * easeOut(k * 2)} />
      ))}
      <circle cx={540} cy={1150} r={600} fill="url(#glowCyan)" opacity={0.25 * easeOut(k * 2)} />
      <Chain t={t} cx={540} cy={700} w={900} sag={300} />
      <g transform={`translate(0,${(1 - easeOut(k * 3)) * -200})`}>
        <line x1={540} y1={1000} x2={540} y2={1050} stroke="url(#gold)" strokeWidth={8} />
        <Diamond x={540} y={1150} s={2.2} rot={rot} />
      </g>
      <Sparkle x={500 + Math.sin(t * 3) * 60} y={1050} r={180 * Math.abs(Math.sin(t * 2.5))} rot={t * 30} />
      <Sparkle x={620} y={1250} r={110 * Math.abs(Math.sin(t * 3.3 + 1))} rot={-t * 40} />
      <Sparkle x={300} y={820} r={70 * Math.abs(Math.sin(t * 4 + 2))} />
      <Sparkle x={800} y={860} r={70 * Math.abs(Math.sin(t * 4.4 + 3))} />
      <Dust t={t} n={70} color="#dfeeff" />
      <rect x={0} y={1500} width={1080} height={420} fill={PAL.ink} opacity={0.6} />
    </Stage>
  );
};
