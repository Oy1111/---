import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { FPS, beatPulse, clamp, easeOut, hitAmt } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";
import { WorldDefs } from "./world/Defs";
import { World } from "./world/World";
import { camAt, SY } from "./world/Camera";
import { wordTimes } from "./data/timing";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 55 * FPS;
const W = 1080, H = 1920;

const IntroTitle: React.FC<{ t: number }> = ({ t }) => {
  const op = clamp((t - 0.25) / 0.4) * (1 - clamp((t - 1.55) / 0.35));
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 260, opacity: op }}>
      <div style={{ fontFamily: "Anton", fontSize: 150, color: "#f4f1ea", letterSpacing: 46, paddingLeft: 46, textShadow: "0 8px 20px #000" }}>WILL</div>
      <div style={{ width: 300 * clamp((t - 0.5) / 0.6), height: 5, background: "#ff9a3c", margin: "10px 0 16px" }} />
      <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 86, color: "#ffd9a0", textShadow: "0 6px 16px #000" }}>Sætter Sig Fast</div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - 52.3;
  if (lt < 0) return null;
  const k = (a: number, d = 0.4) => easeOut((lt - a) / d);
  const rows: [string, string, string][] = [
    ["♥", "LIKE", "hvis den ramte"],
    ["✓", "FØLG", "for mere"],
    ["✎", "SKRIV", "hvad du synes"],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(8,9,16,${0.95 * k(0, 0.6)})` }}>
      <div style={{ position: "absolute", top: 600, width: "100%", textAlign: "center", opacity: k(0.15, 0.5) }}>
        <div style={{ fontFamily: "Anton", fontSize: 120, color: "#f4f1ea", letterSpacing: 40, paddingLeft: 40 }}>WILL</div>
        <div style={{ width: 120, height: 4, background: "#ff9a3c", margin: "14px auto" }} />
        <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 64, color: "#ffbf73" }}>Sætter Sig Fast</div>
      </div>
      {rows.map(([ic, a, b], i) => (
        <div key={i} style={{ position: "absolute", left: 230 - (1 - k(0.5 + i * 0.25)) * 40, top: 960 + i * 120, display: "flex", alignItems: "center", gap: 22, opacity: k(0.5 + i * 0.25) }}>
          <div style={{ width: 58, height: 58, borderRadius: 30, background: i === 0 ? "#ffb347" : "#f4f1ea", color: "#0b0b10", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{ic}</div>
          <div style={{ fontFamily: "Anton", fontSize: 80, color: "#f4f1ea" }}>{a}</div>
          <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 34, color: "#d9d2c2", marginTop: 14 }}>{b}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 310, top: 1330, fontFamily: "Playfair", fontStyle: "italic", fontSize: 30, color: "#9a94a8", opacity: k(1.4, 0.5) }}>og ønsk det næste nummer</div>
    </AbsoluteFill>
  );
};

export const WillVideo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const st = wordTimes(8, "sætter")[0] ?? 33.45;
  const { cx, cy, z } = camAt(t, st, 35.3);
  const h = hitAmt(t);
  const zz = z * (1 + beatPulse(t) * 0.006 + h * 0.025);
  const shake = h * 9;
  const stuck = t > st && t < 35.3;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05060a" }}>
      <Audio src={staticFile("will.mp3")} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <WorldDefs />
        <g transform={`translate(${540 + Math.sin(f * 2.3) * shake},${SY + Math.cos(f * 1.7) * shake}) scale(${zz}) translate(${-cx},${-cy})`}>
          <World t={t} />
        </g>
      </svg>
      {stuck && (
        <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, transparent 2px 7px)", opacity: ((t - st) % 0.255) < 0.06 ? 1 : 0.25, mixBlendMode: "screen" }} />
      )}
      <IntroTitle t={t} />
      <Lyrics />
      <Outro t={t} />
      <FX />
    </AbsoluteFill>
  );
};
