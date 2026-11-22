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
  gertrud1: (p) => <Sc.GertrudClass {...p} mood="happy" chalk="Gertrud ♥" />,
  rod: (p) => <Sc.Rod {...p} />,
  gammel: (p) => <Sc.Gammel {...p} />,
  brud: (p) => <Sc.Brud {...p} />,
  gergertrud: (p) => <Sc.GerGer {...p} />,
  inspektor: (p) => <Sc.Inspektor {...p} />,
  gertrudSiger: (p) => <Sc.GertrudClass {...p} mood="talk" chalk="Nej!" />,
  energi: (p) => <Sc.Energi {...p} />,
  karakter: (p) => <Sc.Karakter {...p} />,
  gaden: (p) => <Sc.Gaden {...p} />,
  drømme: (p) => <Sc.Drommer {...p} />,
  rig: (p) => <Sc.Rig {...p} />,
  fri: (p) => <Sc.Fri {...p} />,
  para: (p) => <Sc.Para {...p} />,
  rap: (p) => <Sc.Bedroom {...p} mode="rap" />,
  forstaa: (p) => <Sc.GertrudClass {...p} mood="serious" chalk="Lyt nu, Abdi" />,
  kloge: (p) => <Sc.Bedroom {...p} mode="kloge" />,
  deto: (p) => <Sc.Bedroom {...p} mode="deto" />,
  bog: (p) => <Sc.Bog {...p} />,
  gertrudPaa: (p) => <Sc.GertrudClass {...p} mood="hero" chalk="Tak, Gertrud ♥" />,
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

export const GertrudVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile("gertrud.mp3")} />
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
