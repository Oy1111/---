import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { FPS, beatPulse, clamp, easeOut, hitAmt } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";
import { WorldDefs } from "./world/Defs";
import { SceneLayer } from "./Scene";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 55 * FPS;
const W = 1080, H = 1920;
const NEON = "#ff4fd8";

const Outro: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - 51.6;
  if (lt < 0) return null;
  const k = (a: number, d = 0.4) => easeOut((lt - a) / d);
  const rows: [string, string, string][] = [
    ["♥", "LIKE", "hvis den ramte"],
    ["✓", "FØLG", "for mere"],
    ["✎", "SKRIV", "hvad du synes"],
  ];
  const fl = lt < 0.6 ? (Math.floor(lt * 20) % 2 ? 0.4 : 1) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(6,4,10,${0.96 * k(0, 0.5)})` }}>
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", opacity: k(0.1, 0.4) * fl }}>
        <div style={{ fontFamily: "Anton", fontSize: 170, color: "#ffe6f8", letterSpacing: 10, textShadow: `0 0 18px ${NEON}, 0 0 50px ${NEON}, 0 0 90px ${NEON}` }}>BRANCO</div>
        <div style={{ fontFamily: "Anton", fontSize: 40, color: "#f4f1ea", letterSpacing: 12, marginTop: 4 }}>INGEN INTRODUKTION · 4X4</div>
      </div>
      {rows.map(([ic, a, b], i) => (
        <div key={i} style={{ position: "absolute", left: 230 - (1 - k(0.5 + i * 0.25)) * 40, top: 1000 + i * 110, display: "flex", alignItems: "center", gap: 20, opacity: k(0.5 + i * 0.25) }}>
          <div style={{ width: 56, height: 56, borderRadius: 30, background: i === 0 ? NEON : "#f4f1ea", color: "#0b0b10", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{ic}</div>
          <div style={{ fontFamily: "Anton", fontSize: 76, color: "#f4f1ea" }}>{a}</div>
          <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 32, color: "#d9d2c2", marginTop: 14 }}>{b}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 306, top: 1340, fontFamily: "Playfair", fontStyle: "italic", fontSize: 28, color: "#9a94a8", opacity: k(1.4, 0.5) }}>og ønsk det næste nummer</div>
    </AbsoluteFill>
  );
};

export const BrancoVideo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const h = hitAmt(t);
  const z = 1 + beatPulse(t) * 0.012 + h * 0.035;
  const sh = h * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05030a" }}>
      <Audio src={staticFile("branco.mp3")} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <WorldDefs />
        <g transform={`translate(${540 + Math.sin(f * 2.3) * sh},${1100 + Math.cos(f * 1.7) * sh}) scale(${z}) translate(-540,-1100)`}>
          <SceneLayer t={t} />
        </g>
      </svg>
      <AbsoluteFill style={{ opacity: clamp((t - 0.1) / 0.3) * (1 - clamp((t - 0.85) / 0.25)), alignItems: "center", paddingTop: 300 }}>
        <div style={{ fontFamily: "Anton", fontSize: 150, color: "#ffe6f8", letterSpacing: 8, textShadow: `0 0 18px ${NEON}, 0 0 50px ${NEON}` }}>BRANCO</div>
      </AbsoluteFill>
      <Lyrics />
      <Outro t={t} />
      <FX />
    </AbsoluteFill>
  );
};
