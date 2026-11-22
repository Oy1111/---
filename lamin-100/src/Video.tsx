import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { SCENES } from "./data/timing";
import { FPS, beatPulse, hitAmt } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";
import * as Sc from "./scenes/Scenes";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 54 * FPS;
type SP = { start: number; dur: number; line: number };
const REG: Record<string, React.FC<SP>> = {
  intro: (p) => <Sc.Intro {...p} />,
  magi: (p) => <Sc.Magi {...p} />,
  fokus: (p) => <Sc.Fokus {...p} />,
  bonus: (p) => <Sc.Bonus {...p} />,
  igen: (p) => <Sc.Igen {...p} />,
  globus: (p) => <Sc.Globus {...p} />,
  snak: (p) => <Sc.Snak {...p} />,
  bruge: (p) => <Sc.Bruge {...p} />,
  foles: (p) => <Sc.Foles {...p} />,
  procent: (p) => <Sc.Procent {...p} />,
  foles2: (p) => <Sc.Foles {...p} variant={1} />,
  procent2: (p) => <Sc.Procent {...p} variant={1} />,
  taxa: (p) => <Sc.Taxa {...p} />,
  retur: (p) => <Sc.Retur {...p} />,
  bruger: (p) => <Sc.Bruger {...p} />,
  barca: (p) => <Sc.Barca {...p} />,
  ord: (p) => <Sc.Ord {...p} />,
  outro: (p) => <Sc.Outro {...p} />,
};

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const h = hitAmt(t);
  return (
    <AbsoluteFill style={{ scale: String(1 + beatPulse(t) * 0.012 + h * 0.04), translate: `${Math.sin(f * 2.3) * h * 14}px ${Math.cos(f * 1.7) * h * 14}px` }}>
      {children}
    </AbsoluteFill>
  );
};

export const LaminVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile("lamin.mp3")} />
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
