import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Lamp, Fog, Rain } from "../components/City";
import { CarRear } from "../components/Car";
import { easeOut, smooth, PAL, W } from "../lib";

/** Intro: kameraet daler fra himlen ned i gaden, bilen kører væk fra os. Titelkort. */
export const Intro: React.FC<{ start: number }> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const d = smooth(lt / 3.4);
  const camY = (1 - d) * -700;
  const vy = 1080;
  const carZ = 0.55 - d * 0.25;
  return (
    <>
      <Stage cam={[1 + d * 0.06, 0, -camY]}>
        <Sky t={t} moon={[760, 360]} />
        <Skyline seed="far" base={vy - 40} depth={0.45} maxH={900} t={t} offset={lt * 6} />
        <Skyline seed="mid" base={vy + 60} depth={0.75} maxH={700} t={t} offset={200 + lt * 14} />
        <Fog t={t} y={vy} opacity={0.14} />
        {/* vej i perspektiv */}
        <polygon points={`${W / 2 - 30},${vy + 60} ${W / 2 + 30},${vy + 60} ${W + 700},2300 ${-700},2300`} fill="url(#road)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const z = ((i / 12 + lt * 0.18) % 1);
          const y = vy + 60 + Math.pow(z, 2.2) * 1300;
          return <rect key={i} x={W / 2 - 3 - z * 16} y={y} width={6 + z * 32} height={10 + z * 90} fill={PAL.sodium} opacity={0.5 * z} />;
        })}
        {[-1, 1].map((s) =>
          [0, 1, 2, 3, 4].map((k) => {
            const z = Math.pow((k + 1) / 5.5, 1.6);
            return <Lamp key={`${s}${k}`} x={W / 2 + s * (60 + z * 760)} y={vy + 60 + z * 1150} h={140 + z * 1100} side={(s * -1) as 1 | -1} />;
          }),
        )}
        <CarRear x={W / 2} y={vy + 330 - d * 140} scale={carZ} brake={lt > 2.6 ? 1 : 0.2} />
        <Rain t={t} opacity={0.25} />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: easeOut(lt / 0.5) * (1 - smooth((lt - 2.6) / 0.5)) }}>
        <div style={{ fontFamily: "Anton", fontSize: 220, color: PAL.white, letterSpacing: "0.12em", textShadow: "0 0 40px rgba(255,180,80,.6), 0 10px 30px #000", translate: `0px ${-200 + lt * 12}px` }}>NODE</div>
        <div style={{ fontFamily: "Anton", fontSize: 96, color: PAL.amber, letterSpacing: "0.3em", textShadow: "0 0 30px rgba(255,150,60,.7)", translate: `0px ${-190 + lt * 12}px` }}>PULL UP</div>
      </AbsoluteFill>
    </>
  );
};
