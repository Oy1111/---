import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { ThreeCanvas } from "@remotion/three";
import { FPS, clamp, easeOut } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";
import { Scene3D } from "./three/Scene3D";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 55 * FPS;

const Outro: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - 51.6;
  if (lt < 0) return null;
  const k = (a: number, d = 0.4) => easeOut((lt - a) / d);
  const rows: [string, string, string][] = [
    ["♥", "LIKE", "hvis den ramte"],
    ["✓", "FØLG", "for mere"],
    ["✎", "SKRIV", "hvad du synes"],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(6,6,10,${0.95 * k(0, 0.5)})` }}>
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", opacity: k(0.1, 0.5) }}>
        <div style={{ fontFamily: "Anton", fontSize: 140, color: "#f4f1ea", letterSpacing: 40, paddingLeft: 40 }}>BRANCO</div>
        <div style={{ width: 130, height: 4, background: "#ff9a3c", margin: "14px auto" }} />
        <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 58, color: "#ffbf73" }}>Ingen Introduktion · 4x4</div>
      </div>
      {rows.map(([ic, a, b], i) => (
        <div key={i} style={{ position: "absolute", left: 230 - (1 - k(0.5 + i * 0.25)) * 40, top: 990 + i * 115, display: "flex", alignItems: "center", gap: 20, opacity: k(0.5 + i * 0.25) }}>
          <div style={{ width: 56, height: 56, borderRadius: 30, background: i === 0 ? "#ffb347" : "#f4f1ea", color: "#0b0b10", fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{ic}</div>
          <div style={{ fontFamily: "Anton", fontSize: 78, color: "#f4f1ea" }}>{a}</div>
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
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05030a" }}>
      <Audio src={staticFile("branco.mp3")} />
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 42, position: [0, 1.6, 2.45], near: 0.05, far: 140 }}>
        <Scene3D t={t} />
      </ThreeCanvas>
      <AbsoluteFill style={{ opacity: clamp((t - 0.1) / 0.3) * (1 - clamp((t - 0.85) / 0.25)), alignItems: "center", paddingTop: 300 }}>
        <div style={{ fontFamily: "Anton", fontSize: 150, color: "#f4f1ea", letterSpacing: 40, paddingLeft: 40, textShadow: "0 8px 24px #000" }}>BRANCO</div>
      </AbsoluteFill>
      <Lyrics />
      <Outro t={t} />
      <FX />
    </AbsoluteFill>
  );
};
