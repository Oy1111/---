import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHUNKS, Chunk, Word } from "../data/timing";
import { FPS, clamp, easeOut } from "../lib";

/**
 * Tekst i toppen (som referencen): hvid Anton, kommende ord svage, nøgleord store i guld.
 * Hver linje har sin egen custom stil (magic, focus, rewind, spin, chat, glitch, heart,
 * percent, mono, ticket, receipt, route, gold).
 */

const GOLD = "linear-gradient(180deg,#fff4cc 0%,#f6cf6a 45%,#c98b2a 75%,#8f5a14 100%)";
const HEART = "linear-gradient(180deg,#ffe0e6 0%,#ff6b8a 50%,#b3123a 100%)";
const SHADOW = "0 6px 18px rgba(0,0,0,.85), 0 2px 3px rgba(0,0,0,.9)";

const goldText = (bg = GOLD): React.CSSProperties => ({
  backgroundImage: bg,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter: "drop-shadow(0 6px 10px rgba(0,0,0,.8))",
});

const KeyWord: React.FC<{ w: Word; t: number; style: string; size: number }> = ({ w, t, style, size }) => {
  const d = t - w.t;
  const on = d >= 0;
  const k = easeOut(d / 0.18);
  const scale = on ? 1 + (1 - k) * 0.35 : 0.92;
  const base: React.CSSProperties = {
    fontFamily: "Anton",
    fontSize: size,
    lineHeight: 1.0,
    display: "inline-block",
    margin: "0 14px",
    transform: `scale(${scale})`,
    opacity: on ? 1 : 0.22,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
  const txt = w.w.replace(/[,?!.]$/, "");
  if (!on) return <span style={{ ...base, color: "#f4f1ea" }}>{txt}</span>;
  switch (style) {
    case "magic": {
      const sh = ((t * 160) % 300) - 100;
      return (
        <span style={{ ...base, ...goldText(`linear-gradient(110deg,#c98b2a ${sh - 30}%,#fffbe6 ${sh}%,#f6cf6a ${sh + 20}%,#c98b2a ${sh + 50}%)`), filter: "drop-shadow(0 0 18px rgba(255,210,120,.8)) drop-shadow(0 6px 8px #000)" }}>
          ✦{txt}✦
        </span>
      );
    }
    case "smoke": {
      const sm = 1 - easeOut(d / 0.5);
      return (
        <span style={{ ...base, ...goldText("linear-gradient(180deg,#ffffff 0%,#e8e2d6 35%,#f6cf6a 70%,#a8701e 100%)"), letterSpacing: sm * 40, filter: `blur(${sm * 14}px) drop-shadow(0 0 22px rgba(255,240,210,.55)) drop-shadow(0 6px 8px #000)`, transform: `scale(${scale}) translateY(${sm * 30}px)` }}>
          {txt}
        </span>
      );
    }
    case "drunk": {
      const dx = 10 + Math.sin(t * 2.1) * 8;
      return (
        <span style={{ ...base, position: "relative", transform: `scale(${scale}) rotate(${Math.sin(t * 1.3) * 5}deg)`, filter: `blur(${Math.max(0, Math.sin(t * 2.7)) * 2}px)` }}>
          <span style={{ position: "absolute", left: dx, top: dx * 0.3, ...goldText(), opacity: 0.45 }}>{txt}</span>
          <span style={{ position: "relative", ...goldText() }}>{txt}</span>
        </span>
      );
    }
    case "focus":
      return <span style={{ ...base, ...goldText(), filter: `blur(${(1 - k) * 18}px) drop-shadow(0 6px 10px #000)` }}>{txt}</span>;
    case "rewind":
      return (
        <span style={{ ...base, position: "relative" }}>
          {[3, 2, 1].map((i) => (
            <span key={i} style={{ position: "absolute", left: -i * 26 * (1 - k * 0.5), top: 0, color: "#ffc861", opacity: 0.18 * i }}>{txt}</span>
          ))}
          <span style={{ position: "relative", ...goldText() }}>{txt}</span>
        </span>
      );
    case "spin":
      return <span style={{ ...base, ...goldText(), transform: `perspective(900px) rotateY(${(1 - k) * 360 + Math.sin(t * 3) * 6}deg) scale(${scale})` }}>{txt}</span>;
    case "chat":
      return (
        <span style={{ ...base, fontFamily: "SpaceMonoB", fontSize: size * 0.62, background: "#2f7cf6", color: "#fff", borderRadius: 60, padding: "6px 40px", textTransform: "none", boxShadow: "0 10px 30px rgba(0,0,0,.6)" }}>
          {txt}
        </span>
      );
    case "glitch": {
      const j = d < 0.3 ? (Math.sin(t * 97) * 12) : 0;
      return (
        <span style={{ ...base, color: "#fff", textShadow: `${j + 6}px 0 #ff2a5c, ${-j - 6}px 0 #2ad8ff, ${SHADOW}`, transform: `scale(${scale}) translateX(${j}px)` }}>{txt}</span>
      );
    }
    case "heart":
      return <span style={{ ...base, ...goldText(HEART), filter: "drop-shadow(0 0 24px rgba(255,80,120,.7)) drop-shadow(0 6px 8px #000)" }}>{txt}</span>;
    case "mono": {
      const n = Math.floor(clamp(d / 0.45) * txt.length);
      return (
        <span style={{ ...base, fontFamily: "SpaceMonoB", fontSize: size * 0.6, color: "#ffe9a6", textShadow: SHADOW, textTransform: "uppercase" }}>
          {txt.slice(0, Math.max(1, n))}
          <span style={{ opacity: Math.floor(t * 4) % 2 ? 1 : 0 }}>▌</span>
        </span>
      );
    }
    case "ticket":
      return (
        <span style={{ ...base, color: "#c21d2a", border: "10px solid #c21d2a", padding: "0 26px", borderRadius: 16, background: "rgba(243,234,214,.95)", transform: `rotate(-6deg) scale(${on ? 1 + (1 - k) * 0.8 : 1})`, fontSize: size * 0.8 }}>
          {txt}
        </span>
      );
    case "receipt":
      return (
        <span style={{ ...base, color: "#1a1814", background: "#f7f3ea", padding: "0 30px", fontFamily: "SpaceMonoB", fontSize: size * 0.62, boxShadow: "0 12px 30px rgba(0,0,0,.6)" }}>
          {txt}
        </span>
      );
    case "route":
      return (
        <span style={{ ...base, position: "relative" }}>
          <span style={goldText()}>{txt}</span>
          <span style={{ position: "absolute", left: 0, bottom: -10, height: 10, width: `${k * 100}%`, background: "repeating-linear-gradient(90deg,#ffc861 0 26px,transparent 26px 40px)" }} />
        </span>
      );
    default:
      return <span style={{ ...base, ...goldText() }}>{txt}</span>;
  }
};

const SmallWord: React.FC<{ w: Word; t: number; style: string }> = ({ w, t, style }) => {
  const d = t - w.t;
  const on = d >= 0;
  const k = easeOut(d / 0.15);
  const font = style === "chat" || style === "mono" || style === "receipt" ? "SpaceMonoB" : "Anton";
  const blur = (style === "focus" || style === "smoke") && !on ? 6 : style === "smoke" ? Math.max(0, 1 - d / 0.3) * 8 : 0;
  return (
    <span
      style={{
        fontFamily: font,
        fontSize: font === "Anton" ? 84 : 58,
        lineHeight: 1.12,
        margin: "0 11px",
        display: "inline-block",
        color: style === "heart" && on ? "#ffe4ea" : "#f4f1ea",
        opacity: on ? 1 : 0.28,
        textShadow: SHADOW,
        textTransform: "uppercase",
        transform: style === "drunk" ? `translateY(${Math.sin(t * 2 + w.t * 7) * 8}px) rotate(${Math.sin(t * 1.6 + w.t * 5) * 4}deg)` : `translateY(${on ? (1 - k) * -10 : 0}px)`,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {w.w}
    </span>
  );
};

const ChunkView: React.FC<{ c: Chunk; t: number }> = ({ c, t }) => {
  const fadeIn = clamp((t - (c.t0 - 0.1)) / 0.08);
  const fadeOut = clamp((c.t1 - t) / 0.12);
  // grupper: sammenhængende nøgleord på én række, øvrige ord flyder
  const rows: { key: boolean; words: Word[] }[] = [];
  for (const w of c.words) {
    const last = rows[rows.length - 1];
    if (last && last.key === w.key) last.words.push(w);
    else rows.push({ key: w.key, words: [w] });
  }
  return (
    <div style={{ position: "absolute", top: 150, left: 50, right: 50, textAlign: "center", opacity: Math.min(fadeIn, fadeOut) }}>
      {rows.map((r, i) =>
        r.key ? (
          <div key={i} style={{ margin: "4px 0 8px" }}>
            {r.words.map((w, j) => (
              <KeyWord key={j} w={w} t={t} style={c.style} size={r.words.length > 1 || w.w.length > 9 ? 150 : 196} />
            ))}
          </div>
        ) : (
          <div key={i}>
            {r.words.map((w, j) => (
              <SmallWord key={j} w={w} t={t} style={c.style} />
            ))}
          </div>
        ),
      )}
    </div>
  );
};

export const Lyrics: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const vis = CHUNKS.filter((c) => t >= c.t0 - 0.1 && t <= c.t1).slice(-1);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* mørk top-gradient så teksten altid kan læses */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.25) 22%,rgba(0,0,0,0) 34%)" }} />
      {vis.map((c, i) => (
        <ChunkView key={i} c={c} t={t} />
      ))}
    </AbsoluteFill>
  );
};
