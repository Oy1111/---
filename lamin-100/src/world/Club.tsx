import React from "react";
import { random } from "remotion";
import { beatPulse, clamp, easeOut, lerp, smooth } from "../lib";
import { bodyParts } from "./Figure";

/**
 * POV inde i klubben (1080x1920 lærred, tegnes inde i dørens rektangel).
 * Lamin er fuld/skæv: kameraet svajer, dobbeltsyn, sløring. På "fokus" prøver blikket at fokusere.
 * Derefter panorerer blikket hen til en spilleautomat i baren: BONUS.
 */
const CW = 2600; // bredt rum, der panoreres i

const Crowd: React.FC<{ t: number }> = ({ t }) => {
  const els: React.ReactNode[] = [];
  for (let i = 0; i < 22; i++) {
    const depth = random(`cd${i}`);
    const x = random(`cx${i}`) * CW;
    const s = 1.4 + depth * 2.4;
    const bob = Math.abs(Math.sin(t * Math.PI * (129.2 / 60) + i)) * 14 * s;
    const y = 1320 + depth * 620 + bob * 0.4;
    const arms = random(`ca${i}`) < 0.4;
    els.push(
      <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={0.9}>
        {bodyParts(arms ? "arms" : "stand", t + i).map((d, j) => <path key={j} d={d} fill={depth > 0.6 ? "#050308" : "#120a1e"} />)}
      </g>,
    );
  }
  return <g>{els.sort((a, b) => 0)}</g>;
};

const Slot: React.FC<{ t: number; tid?: number; bonus?: number }> = ({ t, tid = 99, bonus = 99 }) => {
  const x = 2060, y = 760;
  const spinning = t > tid && t < bonus;
  const win = t >= bonus;
  const sym = ["7", "★", "€", "♦", "BAR", "♣"];
  const flash = win ? Math.floor(t * 8) % 2 : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={760} rx={300} ry={40} fill="#000" opacity={0.6} />
      <path d="M-220,0 Q-220,-120 -120,-150 L120,-150 Q220,-120 220,0 L240,760 L-240,760Z" fill="#2a0c3a" />
      <path d="M-220,0 Q-220,-120 -120,-150 L120,-150 Q220,-120 220,0 L240,760 L-240,760Z" fill="none" stroke="#ffc861" strokeWidth={10} />
      <rect x={-180} y={-120} width={360} height={100} rx={20} fill={win ? (flash ? "#ffe08a" : "#ff3d8b") : "#1a0626"} />
      <text x={0} y={-48} textAnchor="middle" fontFamily="Anton" fontSize={70} fill={win ? "#2a0c3a" : "#ffc861"}>{win ? "BONUS!" : "JACKPOT"}</text>
      {/* lyskæde */}
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={-200 + (i % 8) * 57} cy={i < 8 ? 10 : 560} r={10} fill={(Math.floor(t * 10) + i) % 3 === 0 || win ? "#ffe08a" : "#6a3a1a"} />
      ))}
      <rect x={-190} y={60} width={380} height={300} rx={14} fill="#f4efe2" />
      {[0, 1, 2].map((i) => {
        const stopT = bonus - 0.4 + i * 0.2;
        const spin = t > tid && t < stopT;
        const off = spin ? ((t * 2200 + i * 130) % 600) : 0;
        return (
          <g key={i}>
            <clipPath id={`reel${i}`}><rect x={-180 + i * 125} y={70} width={110} height={280} /></clipPath>
            <g clipPath={`url(#reel${i})`}>
              {spin
                ? sym.map((sy, j) => (
                    <text key={j} x={-125 + i * 125} y={150 + ((j * 100 + off) % 600) - 100} textAnchor="middle" fontFamily="Anton" fontSize={70} fill="#2a0c3a" opacity={0.6} style={{ filter: "blur(3px)" }}>{sy}</text>
                  ))
                : <text x={-125 + i * 125} y={240} textAnchor="middle" fontFamily="Anton" fontSize={90} fill={t >= stopT && t > tid ? "#c21d2a" : "#2a0c3a"}>{t > tid ? "7" : sym[i + 1]}</text>}
            </g>
          </g>
        );
      })}
      <rect x={-190} y={190} width={380} height={6} fill="#c21d2a" opacity={0.6} />
      {/* håndtag */}
      <rect x={230} y={100} width={20} height={220} rx={10} fill="url(#gChrome)" transform={`rotate(${spinning && t - tid < 0.4 ? 30 : 0} 240 320)`} />
      <circle cx={240} cy={96} r={30} fill="#c21d2a" />
      <rect x={-150} y={420} width={300} height={90} rx={10} fill="#12041a" />
      <text x={0} y={480} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={40} fill="#ff6b62">{win ? "x100" : spinning ? "..." : "INDSÆT"}</text>
      {/* mønter springer ud */}
      {win &&
        Array.from({ length: 40 }).map((_, i) => {
          const d = t - bonus - random(`sc${i}`) * 0.4;
          if (d < 0) return null;
          const vx = (random(`sv${i}`) - 0.5) * 1600;
          const vy = -900 - random(`su${i}`) * 900;
          const px = vx * d;
          const py = 560 + vy * d + 1800 * d * d;
          return (
            <g key={i} transform={`translate(${px},${py})`}>
              <ellipse rx={28 * Math.abs(Math.cos(d * 12 + i))} ry={28} fill="url(#gGold)" stroke="#8a5a12" strokeWidth={3} />
            </g>
          );
        })}
      <circle cx={0} cy={200} r={600} fill="url(#rWarm)" opacity={win ? 0.6 : 0.2} style={{ mixBlendMode: "screen" }} />
    </g>
  );
};

const Room: React.FC<{ t: number; tid?: number; bonus?: number }> = ({ t, tid, bonus }) => {
  const bp = beatPulse(t);
  const beams = [
    { x: 500, c: "#ff3dc8" },
    { x: 1100, c: "#3de0ff" },
    { x: 1600, c: "#ffb347" },
    { x: 2200, c: "#ff3dc8" },
  ];
  return (
    <g>
      <rect x={-400} y={-400} width={CW + 800} height={2800} fill="#08040f" />
      {/* bagvæg med LED-strip */}
      <rect x={-400} y={300} width={CW + 800} height={900} fill="#140a22" />
      <rect x={-400} y={560} width={CW + 800} height={14} fill="#ff3dc8" opacity={0.5 + bp * 0.5} />
      <rect x={-400} y={540} width={CW + 800} height={60} fill="url(#rMagenta)" opacity={0.4} />
      {/* DJ-pult */}
      <g transform="translate(900,980)">
        <rect x={-300} y={0} width={600} height={260} fill="#0c0612" />
        <rect x={-300} y={0} width={600} height={16} fill="#3de0ff" opacity={0.6 + bp * 0.4} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-280 + i * 48} y={40 + (1 - Math.abs(Math.sin(t * 6 + i))) * 120} width={30} height={(Math.abs(Math.sin(t * 6 + i))) * 120 + 20} fill={i % 3 ? "#3de0ff" : "#ff3dc8"} opacity={0.7} />
        ))}
        <g transform={`translate(0,${-10 - bp * 20}) scale(1.4)`}>{bodyParts("arms", t).map((d, j) => <path key={j} d={d} fill="#050308" />)}</g>
      </g>
      {/* bar til højre med flasker */}
      <rect x={1500} y={620} width={1100} height={560} fill="#1c0e10" />
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 16 }).map((__, c) => (
          <g key={`${r}-${c}`}>
            <rect x={1540 + c * 64} y={660 + r * 170} width={30} height={110} rx={10} fill={["#7a2a1a", "#2a5a3a", "#c9a45a", "#3a2a5a"][(r + c) % 4]} opacity={0.85} />
            <rect x={1550 + c * 64} y={640 + r * 170} width={10} height={30} fill="#1a1010" />
          </g>
        )),
      )}
      <rect x={1500} y={1180} width={1100} height={60} fill="#3a1c10" />
      <rect x={1500} y={1180} width={1100} height={8} fill="#ffc861" opacity={0.6} />
      <rect x={1500} y={600} width={1100} height={580} fill="url(#rWarm)" opacity={0.35} />
      <Slot t={t} tid={tid} bonus={bonus} />
      {/* lyskegler fra loftet */}
      {beams.map((b, i) => {
        const a = Math.sin(t * (0.9 + i * 0.3) + i) * 28;
        return (
          <g key={i} transform={`rotate(${a} ${b.x} 0)`} style={{ mixBlendMode: "screen" }}>
            <polygon points={`${b.x - 10},0 ${b.x + 10},0 ${b.x + 260},1900 ${b.x - 260},1900`} fill={b.c} opacity={0.16 + bp * 0.1} />
            <circle cx={b.x} cy={10} r={40} fill={b.c} />
          </g>
        );
      })}
      {/* røg/dis */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={((i * 700 + t * 60) % (CW + 600)) - 300} cy={900 + i * 120} rx={600} ry={160} fill="#b9a0d8" opacity={0.08} filter="url(#fBlur30)" />
      ))}
      <Crowd t={t} />
      {/* diskokugle */}
      <g transform="translate(1250,140)">
        <line x1={0} y1={-200} x2={0} y2={-60} stroke="#555" strokeWidth={4} />
        <circle r={70} fill="#c9ccd6" />
        {Array.from({ length: 30 }).map((_, i) => (
          <rect key={i} x={-60 + (i % 6) * 20} y={-60 + Math.floor(i / 6) * 24} width={16} height={18} fill={(i + Math.floor(t * 12)) % 5 === 0 ? "#fff" : "#8a8e9a"} />
        ))}
      </g>
    </g>
  );
};

export const ClubPOV: React.FC<{ t: number; fokus?: number; tid?: number; bonus?: number; jeg?: number }> = ({ t, fokus = 99, tid = 99, bonus = 99, jeg = 0 }) => {
  // panorering mod spilleautomaten
  const pan = lerp(-300, -1520, smooth((t - (tid - 0.6)) / 0.9));
  // fuld: dobbeltsyn og sløring; på "fokus" samles billedet kort
  const f = t > fokus ? Math.exp(-(t - fokus) * 2.2) : 0;
  const pre = clamp((t - jeg) / 1.2);
  const dbl = (22 + Math.sin(t * 1.7) * 16) * (1 - f) * (0.3 + pre * 0.7);
  const blur = (3 + Math.sin(t * 2.3) * 2) * (1 - f);
  const sway = Math.sin(t * 1.25) * 4.5 + Math.sin(t * 0.6) * 2;
  const bob = Math.sin(t * 2.1) * 18;
  const strobe = beatPulse(t, 14);
  const inner = (
    <g transform={`translate(${pan},${bob})`}>
      <Room t={t} tid={tid} bonus={bonus} />
    </g>
  );
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#05030a" />
      <g transform={`rotate(${sway} 540 960)`} style={{ filter: `blur(${blur.toFixed(2)}px)` }}>
        {inner}
        <g opacity={0.45} transform={`translate(${dbl},${dbl * 0.3})`} style={{ mixBlendMode: "screen" }}>
          {inner}
        </g>
      </g>
      {/* Lamins hånd med plastikkop (POV) */}
      <g transform={`translate(${880 + Math.sin(t * 1.4) * 30},${1640 + Math.sin(t * 2.1) * 20}) rotate(${-12 + sway * 1.5})`}>
        <path d="M-40,-150 L60,-150 L48,60 L-28,60Z" fill="#d8252e" />
        <path d="M-40,-150 L60,-150 L58,-120 L-38,-120Z" fill="#f4f1ea" opacity={0.9} />
        <ellipse cx={10} cy={-150} rx={50} ry={10} fill="#f6c86a" />
        <path d="M-70,-90 Q-110,-40 -90,40 L-60,200 L120,260 L130,40 Q120,-60 70,-100 Z" fill="#5a3426" />
        <path d="M-70,-90 Q-50,-110 -30,-96 L-20,-40 Q-50,-30 -70,-50Z" fill="#6e4232" />
        <path d="M60,-110 Q90,-120 100,-90 L96,-30 Q70,-30 60,-60Z" fill="#6e4232" />
        <path d="M-90,40 L-60,240 L140,300 L130,40Z" fill="#1c2236" />
      </g>
      {/* strobe + vignet */}
      <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={strobe * 0.12} />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#rShadow)" opacity={0} />
      <radialGradient id="povVig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.9" />
      </radialGradient>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#povVig)" />
      {/* fokus-ring der ikke kan holde */}
      <circle cx={540} cy={1000} r={lerp(500, 160, easeOut(f))} fill="none" stroke="#fff" strokeWidth={4} opacity={f * 0.6} />
    </g>
  );
};
