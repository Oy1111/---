import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { SCENES } from "./data/timing";
import { FPS, beatPulse, hitAmt } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 50 * FPS;

import { IntroS } from "./scenes2/IntroS";
import { GArrive } from "./scenes2/GArrive";
import { MaskedScene } from "./scenes2/MaskedScene";
import { GunScene } from "./scenes2/GunScene";
import { Duo } from "./scenes2/Duo";
import { GLow, GRearDrive, GSideSpeed } from "./scenes2/Drive";
import { LVFront, LVInside, LVBags } from "./scenes2/LV";
import { Dash, Jewels, Joint } from "./scenes2/Interior";
import { PlaneLand, Cash, DiorWalk, Robbery, Give2 } from "./scenes2/World";
import { WindowPhone } from "./scenes2/WindowPhone";
import { Outro2 } from "./scenes2/Outro2";

type SceneProps = { start: number; dur: number; line: number };
const REG: Record<string, React.FC<SceneProps>> = {
  introS: (p) => <IntroS {...p} />,
  gArrive: (p) => <GArrive {...p} />,
  masked: (p) => <MaskedScene {...p} />,
  gun: (p) => <GunScene {...p} />,
  duo: (p) => <Duo {...p} />,
  gLow: (p) => <GLow {...p} />,
  lvFront: (p) => <LVFront {...p} />,
  lvInside: (p) => <LVInside {...p} />,
  dash: (p) => <Dash {...p} />,
  gRear: (p) => <GRearDrive {...p} />,
  duo2: (p) => <Duo {...p} variant={1} />,
  gSide: (p) => <GSideSpeed {...p} />,
  lvBags: (p) => <LVBags {...p} />,
  dashBass: (p) => <Dash {...p} bass />,
  jewels: (p) => <Jewels {...p} />,
  joint: (p) => <Joint {...p} />,
  plane: (p) => <PlaneLand {...p} />,
  cash: (p) => <Cash {...p} />,
  dior: (p) => <DiorWalk {...p} />,
  robbery: (p) => <Robbery {...p} />,
  give: (p) => <Give2 {...p} />,
  window: (p) => <WindowPhone {...p} />,
  gArrive2: (p) => <GArrive {...p} />,
  duo3: (p) => <Duo {...p} variant={3} />,
  gAway: (p) => <GRearDrive {...p} away />,
  outro: (p) => <Outro2 {...p} />,
};

/** Kamera-puls på beats + rystelse på hits (lægges over alle scener) */
const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const h = hitAmt(t);
  return (
    <AbsoluteFill
      style={{
        scale: String(1 + beatPulse(t) * 0.018 + h * 0.05),
        translate: `${Math.sin(f * 2.3) * h * 18}px ${Math.cos(f * 1.7) * h * 18}px`,
        rotate: `${Math.sin(f * 1.1) * h * 0.8}deg`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const PullUpVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile("pullup.mp3")} />
    <Camera>
      {SCENES.map(([start, name, line], i) => {
        const end = i + 1 < SCENES.length ? SCENES[i + 1][0] : DURATION / FPS;
        const Comp = REG[name];
        return (
          <Sequence key={i} name={`${i + 1}. ${name}`} from={Math.round(start * FPS)} durationInFrames={Math.max(1, Math.round((end - start) * FPS))}>
            <Comp start={start} dur={end - start} line={line} />
          </Sequence>
        );
      })}
    </Camera>
    <Lyrics />
    <FX />
  </AbsoluteFill>
);
