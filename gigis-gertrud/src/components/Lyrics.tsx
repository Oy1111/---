import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, random } from "remotion";
import { CHUNKS, Chunk, Word } from "../data/timing";
import { FPS, clamp, easeOut } from "../lib";

/**
 * Custom tekst pr. linje (stil sat med {stil} i words-filen).
 * Hver stil har egen skrift, farve, ind-animation og effekt på nøgleordet.
 */
const SIDE = 80;
const MAXW = 1080 - SIDE * 2;
const fit = (txt: string, max: number, k = 0.47) => Math.min(max, MAXW / (Math.max(3, txt.length) * k));

type St = {
  font: string;
  italic?: boolean;
  upper?: boolean;
  color: string;
  keyColor?: string;
  keyGrad?: string;
  shadow: string;
  size: number;
  keyScale?: number;
  sizeK?: number;
  enter: (age: number, i: number, w: Word) => React.CSSProperties;
  after?: (w: Word, t: number, size: number, i: number) => React.ReactNode;
  bg?: (t: number) => React.ReactNode;
};

const pop = (age: number): React.CSSProperties => ({ scale: String(age >= 0 ? 1 + 0.25 * Math.exp(-age * 16) : 1), opacity: age >= 0 ? clamp(0.35 + age * 12) : 0.16 });

const STYLES: Record<string, St> = {
  normal: {
    font: "Anton", upper: true, color: "#fffaf0", keyGrad: "linear-gradient(180deg,#fff6dc,#ffd28a 50%,#ff9a3d)", size: 165,
    shadow: "0 6px 0 rgba(0,0,0,.35), 0 12px 26px rgba(0,0,0,.6)", enter: pop,
  },
  // kridt: hvid kridt-tekstur, skrives frem bogstav for bogstav (clip) med støvsky
  chalk: {
    font: "Playfair", italic: true, color: "#f6f3ea", keyColor: "#ffd6dc", size: 150, keyScale: 1.25, sizeK: 0.42,
    shadow: "0 0 2px rgba(255,255,255,.6), 0 6px 18px rgba(0,0,0,.55)",
    enter: (age) => ({ clipPath: `inset(-20% ${100 - clamp(age / 0.28) * 100}% -20% -5%)`, opacity: age >= 0 ? 1 : 0.14, WebkitMaskImage: `url(${staticFile("chalk.png")})`, WebkitMaskSize: "300px" }),
    after: (w, t, s) => {
      const age = t - w.t;
      if (age < 0 || age > 0.6) return null;
      return (
        <span style={{ position: "absolute", left: `${clamp(age / 0.28) * 100}%`, top: "50%", width: s * 0.5, height: s * 0.5, borderRadius: "50%", translate: "-50% -50%", background: "radial-gradient(circle, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)", opacity: 1 - age / 0.6 }} />
      );
    },
  },
  // rod: skæve bogstaver, på nøgleordet eksploderer de
  messy: {
    font: "Anton", upper: true, color: "#fffaf0", keyColor: "#ff4a3a", size: 150,
    shadow: "-3px -3px 0 #1a1a22, 3px -3px 0 #1a1a22, -3px 3px 0 #1a1a22, 3px 3px 0 #1a1a22, 0 10px 22px rgba(0,0,0,.55)",
    enter: (age, i) => ({ ...pop(age), rotate: `${(random(`m${i}`) - 0.5) * 14}deg`, translate: `0px ${(random(`my${i}`) - 0.5) * 30}px` }),
  },
  // sepia: gammel skrivemaskine/fotoalbum
  sepia: {
    font: "SpaceMonoB", upper: true, color: "#3a2412", keyColor: "#8a2a12", size: 120, sizeK: 0.62,
    shadow: "0 0 12px rgba(255,240,210,.9), 1px 1px 0 rgba(255,240,210,.8)",
    enter: (age) => ({ opacity: age >= 0 ? 1 : 0.15, filter: age >= 0 ? `blur(${Math.max(0, 6 - age * 60)}px)` : "none" }),
  },
  // kærlighed: rosa, hjerter popper ud af ordene
  love: {
    font: "Playfair", italic: true, color: "#c2143a", keyColor: "#e0002e", size: 155, keyScale: 1.3, sizeK: 0.42,
    shadow: "-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff, 0 8px 20px rgba(160,0,40,.35)", enter: pop,
    after: (w, t, s, i) => {
      const age = t - w.t;
      if (age < 0 || age > 1.2) return null;
      return [0, 1, 2].map((k) => (
        <span key={k} style={{ position: "absolute", left: `${30 + k * 20}%`, top: 0, fontSize: s * 0.35, color: "#ff4d6d", translate: `${(random(`h${i}${k}`) - 0.5) * 120 * age}px ${-age * 260}px`, opacity: 1 - age / 1.2 }}>
          ♥
        </span>
      ));
    },
  },
  // stamme: hvert "Ger" slås ned med ekko-kopier
  stutter: {
    font: "Anton", upper: true, color: "#fffaf0", keyGrad: "linear-gradient(180deg,#ffe0e6,#ff7a95)", size: 210, keyScale: 1.25,
    shadow: "0 8px 0 rgba(0,0,0,.35), 0 16px 30px rgba(0,0,0,.6)",
    enter: (age) => ({ scale: String(age >= 0 ? 1 + 0.6 * Math.exp(-age * 20) : 1), opacity: age >= 0 ? 1 : 0.12 }),
    after: (w, t, s) => {
      const age = t - w.t;
      if (age < 0 || age > 0.5) return null;
      return [1, 2].map((k) => (
        <span key={k} style={{ position: "absolute", inset: 0, color: "transparent", WebkitTextStroke: "3px rgba(255,255,255,.6)", scale: String(1 + age * 1.2 * k), opacity: (1 - age / 0.5) * 0.7, fontSize: "inherit" }}>
          {w.w.toUpperCase()}
        </span>
      ));
    },
  },
  // rapport: skrivemaskine-tekst, nøgleordet stemples rødt
  report: {
    font: "SpaceMonoB", upper: true, color: "#f4f4f6", keyColor: "#e0322a", size: 110, sizeK: 0.62, keyScale: 1.7,
    shadow: "0 6px 16px rgba(0,0,0,.7)",
    enter: (age, _i, w) =>
      w.key
        ? { scale: String(age >= 0 ? 1 + 1.4 * Math.exp(-age * 18) : 1.2), rotate: "-8deg", opacity: age >= 0 ? 1 : 0, border: "10px solid #e0322a", padding: "0 18px", borderRadius: 14, fontFamily: "Anton" }
        : { opacity: age >= 0 ? 1 : 0.15 },
  },
  // energi: hopper på beat, elektrisk glød
  energy: {
    font: "Anton", upper: true, color: "#fffde8", keyColor: "#f9e45b", size: 160, keyScale: 1.3,
    shadow: "0 0 20px rgba(249,228,91,.7), 0 8px 0 rgba(0,0,0,.35)",
    enter: (age, i) => ({ ...pop(age), translate: `0px ${age >= 0 ? -Math.abs(Math.sin(age * 12 + i)) * 16 * Math.exp(-age * 1.5) : 0}px` }),
    after: (w, t, s) => {
      const age = t - w.t;
      if (!w.key || age < 0) return null;
      return <span style={{ position: "absolute", inset: "-20%", background: "radial-gradient(circle, rgba(249,228,91,.45), rgba(249,228,91,0) 65%)", opacity: 0.6 + 0.4 * Math.sin(t * 30), fontSize: s }} />;
    },
  },
  // karakter: rød kuglepen, tal cirkles
  grade: {
    font: "Anton", upper: true, color: "#fffaf0", keyColor: "#e0322a", size: 150, keyScale: 1.5,
    shadow: "0 0 3px rgba(0,0,0,.9), 0 6px 0 rgba(0,0,0,.45), 0 12px 26px rgba(0,0,0,.7)", enter: pop,
    after: (w, t) => {
      const age = t - w.t;
      if (!w.key || age < 0.05) return null;
      const p = clamp((age - 0.05) / 0.35);
      return (
        <svg style={{ position: "absolute", inset: "-25% -30%", width: "160%", height: "150%", overflow: "visible" }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <ellipse cx={50} cy={52} rx={46} ry={40} fill="none" stroke="#e0322a" strokeWidth={3} strokeDasharray={290} strokeDashoffset={290 * (1 - p)} transform="rotate(-8 50 50)" />
        </svg>
      );
    },
  },
  // graffiti: spraymaling med drips
  graffiti: {
    font: "Anton", upper: true, color: "#fffaf0", keyGrad: "linear-gradient(180deg,#5ef0ff,#2a8cff)", size: 165, keyScale: 1.2,
    shadow: "0 0 18px rgba(94,240,255,.55), 4px 6px 0 #1a1a2a", enter: (age, i) => ({ ...pop(age), rotate: `${(random(`g${i}`) - 0.5) * 6}deg` }),
    after: (w, t, s, i) => {
      const age = t - w.t;
      if (!w.key || age < 0) return null;
      return [0, 1, 2, 3].map((k) => (
        <span key={k} style={{ position: "absolute", left: `${15 + k * 22}%`, top: "88%", width: 8, height: Math.min(1, age * 2) * (30 + random(`dr${i}${k}`) * 60), background: "#2a8cff", borderRadius: 6, fontSize: s }} />
      ));
    },
  },
  // drøm: blød glød + stjerner
  dream: {
    font: "Playfair", italic: true, color: "#f2f0ff", keyColor: "#ffe9a8", size: 150, keyScale: 1.25, sizeK: 0.42,
    shadow: "0 0 30px rgba(190,180,255,.8), 0 8px 18px rgba(0,0,0,.5)",
    enter: (age) => ({ opacity: age >= 0 ? clamp(age * 5) : 0.12, translate: `0px ${age >= 0 ? 20 * Math.exp(-age * 8) : 20}px` }),
    after: (w, t, s, i) => (t >= w.t ? <span style={{ position: "absolute", right: -s * 0.15, top: -s * 0.1, fontSize: s * 0.3, color: "#ffe9a8", opacity: 0.5 + 0.5 * Math.sin(t * 6 + i) }}>✦</span> : null),
  },
  // guld: metallisk med glimt-sweep
  gold: {
    font: "Anton", upper: true, color: "#fffaf0", keyGrad: "linear-gradient(180deg,#fff3c9 0%,#ffc861 40%,#b8741d 60%,#ffe9a8 100%)", size: 165, keyScale: 1.3,
    shadow: "0 0 3px rgba(0,0,0,.9), 0 6px 0 rgba(0,0,0,.45), 0 12px 26px rgba(0,0,0,.7)", enter: pop,
    after: (w, t, s) => {
      const age = t - w.t;
      if (!w.key || age < 0 || age > 0.8) return null;
      return <span style={{ position: "absolute", top: "-10%", left: `${-20 + (age / 0.8) * 140}%`, width: s * 0.25, height: "120%", background: "linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0))", rotate: "18deg", mixBlendMode: "overlay" }} />;
    },
  },
  // fri: bogstaver letter som fugle på nøgleordet
  free: {
    font: "Anton", upper: true, color: "#fffaf0", keyColor: "#8fd3ff", size: 160, keyScale: 1.25,
    shadow: "0 0 3px rgba(0,0,0,.9), 0 6px 0 rgba(0,0,0,.45), 0 12px 26px rgba(0,0,0,.7)",
    enter: (age, _i, w) => (w.key && age > 0.25 ? { opacity: Math.max(0, 1 - (age - 0.25) * 2), translate: `${(age - 0.25) * 200}px ${-(age - 0.25) * 500}px`, rotate: `${(age - 0.25) * 30}deg` } : pop(age)),
  },
  // pære: nøgleordet lyser op som en pære
  bulb: {
    font: "Anton", upper: true, color: "#fffaf0", keyColor: "#fff6b0", size: 160, keyScale: 1.3,
    shadow: "0 0 3px rgba(0,0,0,.9), 0 6px 0 rgba(0,0,0,.45), 0 12px 26px rgba(0,0,0,.7)",
    enter: (age, _i, w) => ({ ...pop(age), textShadow: w.key && age >= 0 ? `0 0 ${20 + 30 * Math.abs(Math.sin(age * 9))}px rgba(255,240,150,.95), 0 0 80px rgba(255,220,100,.7)` : undefined }),
  },
  // bog: bogskrift i varm creme, nøgleordet gløder
  book: {
    font: "Playfair", italic: true, color: "#fff3d6", keyColor: "#ffd28a", size: 150, keyScale: 1.35, sizeK: 0.42,
    shadow: "0 0 26px rgba(255,210,140,.6), 0 8px 18px rgba(0,0,0,.6)",
    enter: (age) => ({ opacity: age >= 0 ? clamp(age * 6) : 0.12, letterSpacing: age >= 0 ? `${Math.max(0, 0.3 - age) * 0.6}em` : "0.18em" }),
  },
};

const Word_: React.FC<{ w: Word; t: number; st: St; size: number; i: number }> = ({ w, t, st, size, i }) => {
  const age = t - w.t;
  const isKey = w.key;
  const s = isKey ? size * (st.keyScale ?? 1.15) : size;
  const base: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    fontFamily: st.font,
    fontStyle: st.italic ? "italic" : "normal",
    fontSize: s,
    lineHeight: 1.02,
    margin: `0 ${s * 0.12}px`,
    color: isKey && st.keyColor && age >= 0 ? st.keyColor : st.color,
    textShadow: st.shadow,
  };
  if (isKey && st.keyGrad && age >= 0) {
    Object.assign(base, { backgroundImage: st.keyGrad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textShadow: "none", filter: "drop-shadow(0 6px 0 rgba(0,0,0,.3)) drop-shadow(0 0 20px rgba(255,200,120,.4))" });
  }
  const txt = st.upper ? w.w.replace(/[()"]/g, "").toUpperCase() : w.w.replace(/[()"]/g, "").toLowerCase();
  return (
    <span style={{ ...base, ...st.enter(age, i, w) }}>
      {txt}
      {st.after?.(w, t, s, i)}
    </span>
  );
};

export const Lyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ch: Chunk | undefined = CHUNKS.find((c) => t >= c.t0 - 0.12 && t < c.t1);
  if (!ch) return null;
  const st = STYLES[ch.style] ?? STYLES.normal;
  const fade = clamp((ch.t1 - t) / 0.08);
  const txt = ch.words.map((w) => w.w).join(" ");
  const size = fit(txt, st.size, st.sizeK ?? 0.47);
  const intro = easeOut((t - (ch.t0 - 0.12)) / 0.12);
  // "rod": hele bidden eksploderer når nøgleordet er sunget
  const keyW = ch.words.find((w) => w.key);
  const boom = ch.style === "messy" && keyW && t > keyW.t + 0.25 ? t - keyW.t - 0.25 : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170, opacity: fade }}>
      <div
        style={{
          width: MAXW,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          rowGap: 4,
          translate: `0px ${(1 - intro) * -18}px`,
          ...(ch.style === "chalk"
            ? {
                background: "radial-gradient(ellipse at 40% 40%, #3d6e57 0%, #2a5040 60%, #1f3d31 100%)",
                border: "16px solid #8a5a30",
                borderRadius: 10,
                padding: "22px 10px 30px",
                boxShadow: "0 18px 40px rgba(0,0,0,.55), inset 0 0 40px rgba(0,0,0,.35)",
                rotate: "-1.5deg",
              }
            : {}),
        }}
      >
        {ch.words.map((w, i) => (
          <span key={i} style={boom ? { display: "inline-block", translate: `${(random(`bx${i}`) - 0.5) * 900 * boom}px ${-200 * boom + 1400 * boom * boom}px`, rotate: `${(random(`br${i}`) - 0.5) * 400 * boom}deg` } : { display: "inline-block" }}>
            <Word_ w={w} t={t} st={st} size={size} i={i} />
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
