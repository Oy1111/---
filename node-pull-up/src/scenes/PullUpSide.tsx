import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp, Rain, Fog, Dust } from "../components/City";
import { CarSide } from "../components/Car";
import { Smoke } from "../components/Props";
import { easeOut, PAL, W } from "../lib";

/** Bilen "puller up": glider ind fra venstre og bremser hårdt under lygten. */
export const PullUpSide: React.FC<{ start: number; dur: number; stopAt?: number }> = ({ start, dur, stopAt = 1.35 }) => {
  const { lt, t } = useTimes(start);
  const k = easeOut(lt / stopAt);
  const carX = -700 + k * 1240;
  const speed = lt < stopAt ? (1 - k) * 2600 + 200 : 0;
  const scroll = lt * 60 + (1 - k) * 900;
  const brake = lt < stopAt + 0.3 ? 1 : 0.3;
  const dip = lt > stopAt - 0.1 && lt < stopAt + 0.25 ? Math.sin(((lt - stopAt + 0.1) / 0.35) * Math.PI) * 10 : 0;
  const ground = 1500;
  return (
    <Stage cam={[1.02 + (lt / dur) * 0.05, 0, 0]}>
      <Sky t={t} moon={[200, 420]} />
      <Skyline seed="sfar" base={ground - 160} depth={0.45} maxH={1000} t={t} offset={scroll * 0.2} />
      <Skyline seed="snear" base={ground - 90} depth={0.85} maxH={760} t={t} offset={scroll * 0.5 + 300} />
      <Fog t={t} y={ground - 200} />
      {/* fortov + vej */}
      <rect x={-200} y={ground - 90} width={W + 400} height={40} fill="#161c30" />
      <rect x={-200} y={ground - 52} width={W + 400} height={8} fill="#2a3352" />
      <rect x={-200} y={ground - 44} width={W + 400} height={700} fill="url(#road)" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={((i * 300 - scroll * 1.0) % 2400 + 2400) % 2400 - 300} y={ground + 150} width={150} height={12} fill={PAL.sodium} opacity={0.45} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = ((i * 560 - scroll * 0.9 + 270) % 2800 + 2800) % 2800 - 400;
        return <Lamp key={i} x={x} y={ground - 70} h={900} />;
      })}
      {/* våd vej-spejling af lamperne */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = ((i * 560 - scroll * 0.9 + 270) % 2800 + 2800) % 2800 - 400 + 140;
        return <rect key={i} x={x - 40} y={ground} width={80} height={420} fill={PAL.amber} opacity={0.12} filter="url(#blur14)" />;
      })}
      <CarSide x={carX} y={ground + 40 + dip} scale={1.05} spin={(carX + scroll) * 0.9} brake={brake} />
      {lt < stopAt + 0.6 && <Smoke t={lt} x={carX - 250} y={ground + 30} n={18} spread={0.6} seed="tire" color="#aab6d6" />}
      {speed > 400 &&
        Array.from({ length: 18 }).map((_, i) => (
          <rect key={i} x={((i * 137) % W) - (lt * 2600) % 300} y={300 + ((i * 97) % 1500)} width={200 + (i % 4) * 80} height={3} fill="#cfe0ff" opacity={0.25 * (speed / 2800)} />
        ))}
      <Dust t={t} n={40} />
      <Rain t={t} opacity={0.22} />
    </Stage>
  );
};
