import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { GFront, GRear, GSide } from "../components/GWagon";
import { Rain, Sky } from "../components/City";
import { wordTimes } from "../data/timing";
import { PAL, W, beatPulse, smooth } from "../lib";

/** "Pull-pull up": lav vinkel forfra, forlygterne blinker på hvert "pull". */
export const GLow: React.FC<{ start: number; dur: number; line: number }> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const pulls = [...wordTimes(line, "pull-pull"), ...wordTimes(line, "pull")];
  let fl = 0;
  for (const p of pulls) if (t >= p - 0.02) fl = Math.max(fl, Math.exp(-(t - p) * 7));
  const u = smooth(lt / dur);
  return (
    <Stage cam={[1.15 - u * 0.1, 0, -80]}>
      <g filter="url(#blur3)">
        <Stroget t={t} camZ={1.6 + u * 0.4} people />
      </g>
      <g transform={`rotate(${-4 + u * 3},540,1800)`}>
        <GFront x={540 + Math.sin(t * 2) * 10} y={1880} s={1.55} t={t} uid="low" flash={fl} />
      </g>
      <Rain t={t} opacity={0.3} speed={1.2} />
    </Stage>
  );
};

/** Bagfra: G-klassen kører ned ad Strøget, kameraet følger efter. away = forsvinder i det fjerne */
export const GRearDrive: React.FC<{ start: number; dur: number; away?: boolean }> = ({ start, dur, away = false }) => {
  const { lt, t } = useTimes(start);
  const bp = beatPulse(t);
  const u = lt / dur;
  const sc = away ? 1.0 - smooth(u) * 0.75 : 1.0 + Math.sin(t * 2.4) * 0.01;
  const y = away ? 1760 - smooth(u) * 560 : 1760;
  return (
    <Stage cam={[1.0 + bp * 0.015, 0, 0]}>
      <Stroget t={t} camZ={1 + lt * 1.4} />
      <GRear x={540 + Math.sin(t * 1.3) * 30} y={y} s={sc * 1.05} t={t} uid={away ? "away" : "rear"} brake={0.25 + bp * 0.5} />
      <Rain t={t} opacity={0.28} speed={1.2} />
    </Stage>
  );
};

/** Sidebillede i fart forbi butiksfacader (Strøget set fra siden). */
export const GSideSpeed: React.FC<{ start: number }> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const scroll = lt * 2600;
  const base = 1500;
  const shops: React.ReactNode[] = [];
  for (let i = -1; i < 9; i++) {
    const bw = 520;
    const x = ((i * bw - scroll * 0.75) % (bw * 8) + bw * 8) % (bw * 8) - bw;
    const k = Math.floor((i * bw - scroll * 0.75) / (bw * 8));
    const seed = `${i}-${k}`;
    const col = ["#8a6646", "#9c7550", "#6e5a49", "#87483a", "#5d6656", "#a38a62"][Math.floor(random(seed) * 6)];
    shops.push(
      <g key={seed}>
        <rect x={x} y={-200} width={bw - 8} height={base + 200} fill={col} />
        <rect x={x} y={-200} width={bw - 8} height={base + 200} fill="url(#facadeShade)" />
        {[0, 1, 2, 3].map((fl) =>
          [0, 1, 2].map((c) => (
            <rect key={`${fl}${c}`} x={x + 50 + c * 150} y={60 + fl * 230} width={90} height={150} fill={random(`${seed}${fl}${c}`) < 0.45 ? "#ffcf86" : "#141a28"} opacity={0.9} />
          )),
        )}
        <rect x={x + 20} y={base - 420} width={bw - 48} height={30} fill="#0d0f16" />
        <rect x={x + 20} y={base - 380} width={bw - 48} height={330} fill={random(`${seed}s`) < 0.6 ? "#ffe2b0" : "#dfe9ff"} />
        {[0, 1, 2, 3, 4].map((k2) => (
          <rect key={k2} x={x + 50 + k2 * 90} y={base - 200 - random(`${seed}it${k2}`) * 120} width={50} height={150} fill="#2a2018" opacity={0.55} />
        ))}
      </g>,
    );
  }
  return (
    <Stage cam={[1.04, Math.sin(t * 30) * 3, Math.cos(t * 27) * 3]}>
      <Sky t={t} stars={false} />
      <g filter="url(#blur6)">{shops}</g>
      <rect x={-300} y={base - 50} width={W + 600} height={700} fill="url(#cobble)" />
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={((i * 173 - scroll * 1.5) % 1700 + 1700) % 1700 - 300} y={250 + ((i * 131) % 1500)} width={300 + (i % 5) * 100} height={3} fill={i % 3 ? "#e8eeff" : PAL.amber} opacity={0.3} />
      ))}
      <GSide x={560} y={base + 330} s={1.05} t={t} uid="side" spin={scroll * 0.6} beam={0.7} />
      <Rain t={t} opacity={0.25} speed={1.5} />
    </Stage>
  );
};
