import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { FPS, beatPulse, clamp, easeOut, hitAmt, lerp } from "./lib";
import { Lyrics } from "./components/Lyrics";
import { FX } from "./components/FX";
import { WorldDefs } from "./world/Defs";
import { World } from "./world/World";
import { camAt, SY } from "./world/Camera";
import { Lamin, LaminDefs } from "./components/Lamin";
import { wordTimes } from "./data/timing";

loadFont({ family: "Anton", url: staticFile("Anton.woff2") });
loadFont({ family: "Playfair", url: staticFile("PlayfairItalic.woff2"), style: "italic" });
loadFont({ family: "SpaceMonoB", url: staticFile("SpaceMonoBold.woff2") });

export const DURATION = 54 * FPS;
const W = 1080, H = 1920;
const ap = (t: number, a: number | undefined, d = 0.3) => (a === undefined ? 0 : easeOut((t - a) / d));

/** Lamin i forgrunden (tegnet portræt) – intro og "ey ey ey / svært at fortæl'". */
const LaminFG: React.FC<{ t: number }> = ({ t }) => {
  const eys = wordTimes(6, "ey");
  const fo = wordTimes(7, "føles")[0] ?? 23.1;
  const intro = t < 4.6 ? clamp((t - 0.15) / 0.8) * (1 - clamp((t - 3.0) / 1.4)) : 0;
  const mid = t > 18.3 && t < 24.4 ? ap(t, eys[0] - 0.15, 0.45) * (1 - clamp((t - 23.6) / 0.6)) : 0;
  const op = Math.max(intro, mid);
  if (op <= 0) return null;
  const isIntro = t < 5;
  const k = isIntro ? clamp((t - 3.0) / 1.4) : clamp((t - 23.6) / 0.6);
  const h = isIntro ? lerp(1180, 700, easeOut(k)) : lerp(1150, 1260, clamp((t - 19) / 4.6));
  const y = H + 40 + (isIntro ? k * 260 : k * 700);
  const glow = ap(t, fo, 0.4);
  const hb = Math.max(0, Math.sin(t * Math.PI * (129.2 / 60))) ** 6;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <LaminDefs />
      <WorldDefs />
      <g opacity={op}>
        {!isIntro && <circle cx={W / 2 + 40} cy={1580} r={260 + hb * 60} fill="url(#rRed)" opacity={glow * (0.5 + hb * 0.5)} style={{ mixBlendMode: "screen" }} />}
        <Lamin x={W / 2} y={y} h={h} t={t} rim={isIntro ? "rimWarm" : "rimGold"} />
        {!isIntro && <circle cx={W / 2 - 60} cy={1560} r={120 + hb * 40} fill="url(#rHot)" opacity={glow * (0.3 + hb * 0.4)} style={{ mixBlendMode: "screen" }} />}
        {!isIntro && eys.map((x, i) => (
          <circle key={i} cx={W / 2} cy={1150} r={300 + (t - x) * 900} fill="none" stroke="#ffc861" strokeWidth={10} opacity={t > x ? clamp(1 - (t - x) * 2) : 0} />
        ))}
      </g>
    </svg>
  );
};

const IntroTitle: React.FC<{ t: number }> = ({ t }) => {
  const op = clamp((t - 0.7) / 0.5) * (1 - clamp((t - 4.3) / 0.4));
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, opacity: op }}>
      <div style={{ fontFamily: "Anton", fontSize: 150, color: "#f4f1ea", letterSpacing: 44, paddingLeft: 44, textShadow: "0 8px 20px #000" }}>LAMIN</div>
      <div style={{ width: 320 * clamp((t - 1.2) / 0.8), height: 6, background: "#ff9a3c", margin: "6px 0 10px" }} />
      <div style={{ fontFamily: "Anton", fontSize: 130, backgroundImage: "linear-gradient(180deg,#fff4cc,#f6cf6a 45%,#c98b2a 75%,#8f5a14)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 14px #000)" }}>100%</div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - 51.3;
  if (lt < 0) return null;
  const k = (a: number, d = 0.4) => easeOut((lt - a) / d);
  const rows: [string, string, string][] = [
    ["♥", "LIKE", "hvis den ramte"],
    ["✓", "FØLG", "for mere"],
    ["✎", "SKRIV", "hvad du synes"],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(8,9,16,${0.95 * k(0, 0.6)})` }}>
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", opacity: k(0.2, 0.5) }}>
        <div style={{ fontFamily: "Anton", fontSize: 120, color: "#f4f1ea", letterSpacing: 36, paddingLeft: 36 }}>LAMIN</div>
        <div style={{ fontFamily: "Anton", fontSize: 50, color: "#ff9a3c", letterSpacing: 14, marginTop: 6 }}>100%</div>
      </div>
      {rows.map(([ic, a, b], i) => (
        <div key={i} style={{ position: "absolute", left: 230 - (1 - k(0.6 + i * 0.3)) * 40, top: 930 + i * 120, display: "flex", alignItems: "center", gap: 22, opacity: k(0.6 + i * 0.3) }}>
          <div style={{ width: 58, height: 58, borderRadius: 30, background: i === 0 ? "#ffb347" : "#f4f1ea", color: "#0b0b10", fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{ic}</div>
          <div style={{ fontFamily: "Anton", fontSize: 80, color: "#f4f1ea" }}>{a}</div>
          <div style={{ fontFamily: "SpaceMonoB", fontSize: 30, color: "#d9d2c2", marginTop: 14 }}>{b}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 310, top: 1300, fontFamily: "SpaceMonoB", fontSize: 26, color: "#9a94a8", opacity: k(1.7, 0.5) }}>og ønsk det næste nummer</div>
    </AbsoluteFill>
  );
};

export const LaminVideo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const { cx, cy, z } = camAt(t);
  const h = hitAmt(t);
  const zz = z * (1 + beatPulse(t) * 0.008 + h * 0.025);
  const view: [number, number, number, number] = [cx - 540 / zz, cy - SY / zz, cx + 540 / zz, cy + (H - SY) / zz];
  // dybdeskarphed når Lamin står i forgrunden
  const dof = Math.max(t < 4.6 ? 1 - clamp((t - 3.0) / 1.4) : 0, t > 18.4 && t < 24.2 ? clamp((t - 18.4) / 0.4) * (1 - clamp((t - 23.6) / 0.5)) : 0);
  const shake = h * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: "#03050d" }}>
      <Audio src={staticFile("lamin.mp3")} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, filter: dof > 0.01 ? `blur(${(dof * 7).toFixed(2)}px) brightness(${1 - dof * 0.25})` : undefined }}>
        <WorldDefs />
        <g transform={`translate(${540 + Math.sin(f * 2.3) * shake},${SY + Math.cos(f * 1.7) * shake}) scale(${zz}) translate(${-cx},${-cy})`}>
          <World t={t} view={view} />
        </g>
      </svg>
      <LaminFG t={t} />
      <IntroTitle t={t} />
      <Lyrics />
      <Outro t={t} />
      <FX />
    </AbsoluteFill>
  );
};
