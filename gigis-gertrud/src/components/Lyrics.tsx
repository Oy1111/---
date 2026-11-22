import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { CHUNKS, Chunk } from "../data/timing";
import { FPS, PAL, clamp, easeOut, hitAmt } from "../lib";

const SIDE = 80;
const MAXW = 1080 - SIDE * 2;

/** Anton er ca. 0.46em bred pr. tegn i versaler – bruges til at vælge skriftstørrelse */
const fitSize = (txt: string, max: number) => Math.min(max, MAXW / (Math.max(3, txt.length) * 0.47));

const Word: React.FC<{ w: Chunk["words"][number]; t: number; size: number; keyWord: boolean }> = ({ w, t, size, keyWord }) => {
  const age = t - w.t;
  const on = age >= 0;
  const pop = on ? 1 + 0.28 * Math.exp(-age * 16) : 1;
  const lift = on ? 18 * Math.exp(-age * 18) : 0;
  const glow = on ? 0.55 + 0.45 * Math.exp(-age * 5) : 0;
  const style: React.CSSProperties = {
    display: "inline-block",
    fontFamily: "Anton",
    fontSize: size,
    lineHeight: 1,
    letterSpacing: "0.01em",
    margin: `0 ${size * 0.12}px`,
    opacity: on ? clamp(0.35 + age * 12) : 0.17,
    scale: String(pop),
    translate: `0px ${-lift}px`,
    color: PAL.white,
    textShadow: on
      ? `0 0 ${18 + glow * 30}px rgba(255,190,110,${0.45 * glow}), 0 6px 0 rgba(0,0,0,0.55), 0 14px 30px rgba(0,0,0,0.75)`
      : "0 6px 20px rgba(0,0,0,0.5)",
  };
  if (keyWord && on) {
    style.backgroundImage = "linear-gradient(180deg,#fff6dc 0%,#ffd28a 45%,#ff9a3d 100%)";
    style.WebkitBackgroundClip = "text";
    style.backgroundClip = "text";
    style.color = "transparent";
    style.filter = `drop-shadow(0 0 ${14 + glow * 24}px rgba(255,170,70,${0.6 * glow})) drop-shadow(0 8px 10px rgba(0,0,0,.7))`;
    style.textShadow = "none";
  }
  return <span style={style}>{w.w.toUpperCase()}</span>;
};

export const Lyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ch = CHUNKS.find((c) => t >= c.t0 - 0.12 && t < c.t1);
  if (!ch) return null;
  const fadeOut = clamp((ch.t1 - t) / 0.08);
  const h = hitAmt(t);
  const shake = h * 10;
  const txt = ch.words.map((w) => w.w).join(" ");

  // "stack": gentagelser (TO OP …) stables i rækker under hinanden
  if (ch.style === "stack") {
    const size = 150;
    return (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, opacity: fadeOut }}>
        <Interactive.Div name="Lyrik (stak)" style={{ display: "flex", flexDirection: "column", alignItems: "center", translate: `${Math.sin(frame * 7) * shake}px 0px` }}>
          {ch.rows!.map((row, i) => {
            const vis = t >= row[0].t - 0.12;
            return (
              <div key={i} style={{ display: "flex", opacity: vis ? 1 : 0, marginBottom: -12 }}>
                {row.map((w, j) => (
                  <Word key={j} w={w} t={t} size={size * (1 - i * 0.04)} keyWord={!!w.key} />
                ))}
              </div>
            );
          })}
        </Interactive.Div>
      </AbsoluteFill>
    );
  }

  const size = fitSize(txt, ch.style === "big" ? 230 : 170);
  const keySize = Math.min(size * 1.25, fitSize(ch.words.find((w) => w.key)?.w ?? "XXXX", 260));
  const intro = easeOut((t - (ch.t0 - 0.12)) / 0.12);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 160, opacity: fadeOut }}>
      <Interactive.Div
        name="Lyrik"
        style={{
          width: MAXW,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          rowGap: 6,
          translate: `${Math.sin(frame * 7) * shake}px ${(1 - intro) * -20}px`,
        }}
      >
        {ch.words.map((w, i) => (
          <Word key={i} w={w} t={t} size={w.key ? keySize : size} keyWord={!!w.key} />
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
