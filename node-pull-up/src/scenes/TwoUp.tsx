import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp, Fog, Rain } from "../components/City";
import { CarFront } from "../components/Car";
import { Guy } from "../components/Figures";
import { wordTimes } from "../data/timing";
import { PAL, W, smooth } from "../lib";

/** "Han er to op ×4": hvert "to" = forlygterne blinker parvist + klip mellem vinkler. Med to figurer ved bilen. */
export const TwoUp: React.FC<{ start: number; line: number; guys?: boolean }> = ({ start, line, guys = false }) => {
  const { t } = useTimes(start);
  const tos = wordTimes(line, "to");
  let idx = -1;
  for (let i = 0; i < tos.length; i++) if (t >= tos[i] - 0.02) idx = i;
  const since = idx >= 0 ? t - tos[idx] : 9;
  const flash = Math.exp(-since * 7);
  const angles: [number, number, number][] = [
    [1.0, 0, 0],
    [1.35, -140, -300],
    [1.2, 150, -180],
    [1.55, 0, -460],
  ];
  const cam = idx >= 0 ? angles[idx % 4] : [0.9, 0, 0] as [number, number, number];
  const vy = 1180;
  return (
    <>
      <Stage cam={[cam[0] + smooth(since / 0.6) * 0.04, cam[1], cam[2]]}>
        <Sky t={t} />
        <Skyline seed="tfar" base={vy} depth={0.5} maxH={950} t={t} offset={40} />
        <Fog t={t} y={vy - 80} />
        <polygon points={`${W / 2 - 40},${vy} ${W / 2 + 40},${vy} ${W + 900},2400 ${-900},2400`} fill="url(#road)" />
        <Lamp x={140} y={vy + 260} h={900} side={1} />
        <Lamp x={940} y={vy + 260} h={900} side={-1} />
        {guys && <Guy x={190} y={1640} h={640} t={t} rim={PAL.cyan} />}
        {guys && <Guy x={890} y={1640} h={660} t={t + 1} rim={PAL.amber} flip />}
        <CarFront x={W / 2} y={1600} scale={1.35} flash={flash} />
        <Rain t={t} opacity={0.25} />
      </Stage>
      {/* store "2"-tal der slår ind bag teksten */}
      {idx >= 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ fontFamily: "Anton", fontSize: 1100, color: "transparent", WebkitTextStroke: `6px rgba(255,200,120,${0.55 * flash + 0.08})`, scale: String(1 + 0.3 * Math.exp(-since * 10)), translate: "0px 120px" }}>2</div>
        </AbsoluteFill>
      )}
    </>
  );
};
