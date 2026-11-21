import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { SCENES } from "./data/timing";
import { FPS, beatPulse, hitAmt } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";
import { Intro } from "./scenes/Intro";
import { PullUpSide } from "./scenes/PullUpSide";
import { TwoUp } from "./scenes/TwoUp";
import { Drift } from "./scenes/Drift";
import { Designer } from "./scenes/Designer";
import { Dashboard } from "./scenes/Dashboard";
import { Chase } from "./scenes/Chase";
import { SpeedSide } from "./scenes/SpeedSide";
import { Stone } from "./scenes/Stone";
import { SmokeScene } from "./scenes/SmokeScene";
import { PlaneScene } from "./scenes/PlaneScene";
import { Money } from "./scenes/Money";
import { Style } from "./scenes/Style";
import { GirlScene } from "./scenes/GirlScene";
import { Give } from "./scenes/Give";
import { PhoneScene } from "./scenes/PhoneScene";
import { PullUpFront } from "./scenes/PullUpFront";
import { Outro } from "./scenes/Outro";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 50 * FPS;

type SceneProps = { start: number; dur: number; line: number };
const REG: Record<string, React.FC<SceneProps>> = {
  intro: (p) => <Intro {...p} />,
  pullSide: (p) => <PullUpSide {...p} />,
  twoUp: (p) => <TwoUp {...p} />,
  twoUpGuys: (p) => <TwoUp {...p} guys />,
  drift: (p) => <Drift {...p} />,
  designer: (p) => <Designer {...p} />,
  dashboard: (p) => <Dashboard {...p} />,
  chase: (p) => <Chase {...p} />,
  chaseAway: (p) => <Chase {...p} away />,
  speed: (p) => <SpeedSide {...p} />,
  stone: (p) => <Stone {...p} />,
  smoke: (p) => <SmokeScene {...p} />,
  plane: (p) => <PlaneScene {...p} />,
  money: (p) => <Money {...p} />,
  style: (p) => <Style {...p} />,
  girl: (p) => <GirlScene {...p} />,
  give: (p) => <Give {...p} />,
  phone: (p) => <PhoneScene {...p} />,
  pullFront: (p) => <PullUpFront {...p} />,
  outro: (p) => <Outro {...p} />,
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
