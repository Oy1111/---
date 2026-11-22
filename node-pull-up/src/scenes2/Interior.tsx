import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { Star } from "../components/GWagon";
import { Smoke, Sparkle } from "../components/Props";
import { Dust } from "../components/City";
import { wordTimes } from "../data/timing";
import { PAL, W, beatPulse, easeOut, clamp } from "../lib";

/** G-klassens kabine: Strøget gennem forruden, widescreen med "Pull Up" og volumen der skrues op. */
export const Dash: React.FC<{ start: number; dur: number; line: number; bass?: boolean }> = ({ start, line, bass = false }) => {
  const { lt, t } = useTimes(start);
  const bp = beatPulse(t);
  const sk = wordTimes(line, "skrug");
  let vol = 0.35;
  sk.forEach((s, i) => (vol += easeOut((t - s) / 0.25) * (0.65 / Math.max(1, sk.length))));
  if (bass) vol = 0.85 + bp * 0.15;
  const vNum = Math.round(clamp(vol) * 50);
  return (
    <Stage cam={[1.0 + bp * (bass ? 0.03 : 0.015), Math.sin(t * 22) * (bass ? 4 : 1.5), 0]}>
      {/* gennem forruden */}
      <g filter="url(#blur6)">
        <Stroget t={t} camZ={2 + lt * 1.2} vy={760} />
      </g>
      {/* A-søjler, tag og forrude-ramme */}
      <path d="M-300,-300 L1380,-300 L1380,1000 L1120,960 L1000,150 L80,150 L-40,960 L-300,1000 Z" fill="#06070b" />
      <path d="M80,150 L1000,150" stroke="#1d2233" strokeWidth={6} />
      <rect x={480} y={150} width={120} height={120} rx={16} fill="#0b0d14" />
      {/* instrumentbræt */}
      <path d="M-300,980 Q540,860 1380,980 L1380,2300 L-300,2300 Z" fill="#0c0e15" />
      <path d="M-300,980 Q540,860 1380,980" stroke="#3a4360" strokeWidth={4} fill="none" />
      <path d="M-300,1020 Q540,900 1380,1020" stroke="#c9a46a" strokeWidth={3} fill="none" opacity={0.35} />
      {/* widescreen */}
      <rect x={70} y={1020} width={940} height={330} rx={26} fill="#05060a" stroke="#2b3248" strokeWidth={4} />
      <rect x={90} y={1040} width={900} height={290} rx={18} fill="#0b1024" />
      {/* venstre: instrumenter, højre: musik */}
      <circle cx={250} cy={1185} r={110} fill="none" stroke="#2b3a66" strokeWidth={10} />
      <circle cx={250} cy={1185} r={110} fill="none" stroke={PAL.cyan} strokeWidth={10} strokeDasharray={`${(0.3 + bp * 0.1) * 690} 690`} transform="rotate(130,250,1185)" />
      <text x={250} y={1205} textAnchor="middle" fontFamily="Anton" fontSize={64} fill="#fff">
        {Math.round(40 + lt * 8)}
      </text>
      <rect x={430} y={1070} width={140} height={140} rx={12} fill="#1a1f33" />
      <rect x={430} y={1070} width={140} height={140} rx={12} fill="url(#gold)" opacity={0.3} />
      <text x={500} y={1160} textAnchor="middle" fontFamily="Anton" fontSize={44} fill="#fff">
        NODE
      </text>
      <text x={600} y={1110} fontFamily="Anton" fontSize={46} fill="#fff">
        PULL UP
      </text>
      <text x={600} y={1150} fontFamily="Playfair" fontStyle="italic" fontSize={30} fill="#aab6d6">
        Node
      </text>
      <rect x={600} y={1175} width={360} height={8} rx={4} fill="#26304e" />
      <rect x={600} y={1175} width={360 * ((t * 0.02) % 1)} height={8} rx={4} fill={PAL.cyan} />
      {/* volumen */}
      <text x={600} y={1250} fontFamily="SpaceMonoB" fontSize={24} fill="#aab6d6">
        VOLUMEN
      </text>
      {Array.from({ length: 25 }).map((_, i) => (
        <rect key={i} x={600 + i * 15} y={1270} width={10} height={40} rx={3} fill={i / 25 < vol ? (i > 20 ? PAL.red : PAL.cyan) : "#26304e"} />
      ))}
      <text x={990} y={1250} textAnchor="end" fontFamily="Anton" fontSize={44} fill={vNum >= 48 ? PAL.red : "#fff"}>
        {vNum >= 48 ? "MAX" : vNum}
      </text>
      {/* tre runde turbine-dyser */}
      {[300, 540, 780].map((x) => (
        <g key={x}>
          <circle cx={x} cy={1470} r={70} fill="#05060a" stroke="url(#chrome)" strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={x} y1={1470} x2={x + Math.cos((i * 30 + t * 40) * Math.PI / 180) * 60} y2={1470 + Math.sin((i * 30 + t * 40) * Math.PI / 180) * 60} stroke="#4a5370" strokeWidth={4} />
          ))}
          <circle cx={x} cy={1470} r={16} fill="url(#chrome)" />
        </g>
      ))}
      {/* højttaler-grill der pumper */}
      <g transform={`translate(1000,1700) scale(${1 + bp * (bass ? 0.08 : 0.03)})`}>
        <circle r={120} fill="#05060a" stroke="url(#chrome)" strokeWidth={6} />
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={Math.cos(i * 2.4) * Math.sqrt(i) * 14} cy={Math.sin(i * 2.4) * Math.sqrt(i) * 14} r={4} fill="#2a3045" />
        ))}
      </g>
      {/* rat */}
      <circle cx={200} cy={2050} r={460} fill="none" stroke="#08090d" strokeWidth={100} />
      <circle cx={200} cy={2050} r={460} fill="none" stroke="#3a4360" strokeWidth={3} opacity={0.7} />
      <circle cx={200} cy={1700} r={70} fill="#0b0d14" />
      <Star x={200} y={1700} r={46} />
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="url(#glowCyan)" opacity={0.05} />
    </Stage>
  );
};

/** "Sten fra Dolce Gabbana": tennis-kæde, cubansk guldkæde og iset vedhæng på sort fløjl. */
export const Jewels: React.FC<{ start: number; dur: number; line: number }> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const sten = wordTimes(line, "sten")[0] ?? start;
  const k = easeOut((t - sten) / 0.4);
  const u = lt / dur;
  const tennis = [];
  for (let i = 0; i < 46; i++) {
    const a = Math.PI * (0.08 + (i / 45) * 0.84);
    const x = 540 - Math.cos(a) * 470, y = 520 + Math.sin(a) * 620;
    const tw = Math.max(0, Math.sin(t * 5 + i * 1.3));
    tennis.push(
      <g key={i}>
        <circle cx={x} cy={y} r={20} fill="#c9d2e6" stroke="#eef3ff" strokeWidth={3} />
        <path d={`M${x - 14},${y} L${x},${y - 14} L${x + 14},${y} L${x},${y + 14} Z`} fill="#ffffff" opacity={0.7} />
        <circle cx={x - 5} cy={y - 5} r={4} fill="#fff" />
        {tw > 0.9 && <Sparkle x={x} y={y} r={60 * (tw - 0.9) * 10} />}
      </g>,
    );
  }
  const cuban = [];
  for (let i = 0; i < 26; i++) {
    const a = Math.PI * (0.12 + (i / 25) * 0.76);
    const x = 540 - Math.cos(a) * 330, y = 640 + Math.sin(a) * 420;
    cuban.push(<ellipse key={i} cx={x} cy={y} rx={30} ry={20} fill="url(#gold)" stroke="#8a5a1a" strokeWidth={3} transform={`rotate(${(a * 180) / Math.PI + 90},${x},${y})`} />);
  }
  return (
    <Stage cam={[1.0 + u * 0.12, 0, -u * 80]} bg="#050308">
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#0b0710" />
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={random(`bk${i}`) * W} cy={random(`bky${i}`) * 1900} r={40 + random(`bkr${i}`) * 80} fill={i % 3 ? "url(#glowWhite)" : "url(#glowAmber)"} opacity={0.12} />
      ))}
      {/* smykkeskrin med navn */}
      <rect x={140} y={1450} width={800} height={330} rx={20} fill="#120a0e" stroke="url(#gold)" strokeWidth={4} />
      <text x={540} y={1650} textAnchor="middle" fontFamily="sans-serif" fontSize={54} letterSpacing={12} fill="url(#gold)">
        DOLCE&amp;GABBANA
      </text>
      <g opacity={0.4 + k * 0.6}>
        {cuban}
        {tennis}
      </g>
      {/* iset vedhæng */}
      <g transform={`translate(540,${1180 + (1 - k) * -200}) rotate(${Math.sin(t * 1.6) * 5})`}>
        <circle r={130} fill="#cdd6ea" stroke="url(#gold)" strokeWidth={10} />
        {Array.from({ length: 60 }).map((_, i) => {
          const rr = 18 + (i % 5) * 22, a = i * 0.9;
          return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r={9} fill="#fff" opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />;
        })}
        <Star x={0} y={0} r={0} ring={false} />
      </g>
      <Sparkle x={540 + Math.sin(t * 2) * 80} y={1100} r={220 * Math.abs(Math.sin(t * 2.2))} rot={t * 40} />
      <Dust t={t} n={70} color="#e8f0ff" />
    </Stage>
  );
};

/** "Fri marijuana": helt tæt på en anonym person der ryger en joint – gløden blusser op, røgen ruller. */
export const Joint: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt } = useTimes(start);
  const u = lt / dur;
  const inhale = clamp(Math.sin(lt * 2.6) * 0.5 + 0.5);
  return (
    <Stage cam={[1.35 + u * 0.25, -140 - 80 * u, -40 - 60 * u]} bg="#040306">
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#07060a" />
      {Array.from({ length: 18 }).map((_, i) => (
        <circle key={i} cx={random(`jb${i}`) * W} cy={300 + random(`jby${i}`) * 1200} r={50 + random(`jbr${i}`) * 90} fill={i % 2 ? "url(#glowAmber)" : "url(#glowCyan)"} opacity={0.14} />
      ))}
      {/* profil i hætte (silhuet) */}
      <path d="M1180,300 Q820,260 700,560 Q660,680 690,760 L640,820 Q628,842 652,850 L690,858 Q680,890 700,905 Q690,935 712,948 Q700,990 760,1010 L800,1180 L1180,1200 Z" fill="#050508" />
      <circle cx={420} cy={900} r={700} fill="url(#glowAmber)" opacity={0.35 + inhale * 0.35} style={{ mixBlendMode: "screen" }} />
      <path d="M1180,280 Q760,200 640,560 Q600,700 640,820" fill="none" stroke="#ffcf8a" strokeWidth={8} opacity={0.5 + inhale * 0.4} filter="url(#blur3)" />
      <path d="M690,760 L640,820 Q628,842 652,850 L690,858 Q680,890 700,905 Q690,935 712,948" fill="none" stroke={PAL.amber} strokeWidth={4} opacity={0.35 + inhale * 0.5} />
      {/* hånd */}
      <path d="M560,1300 Q540,1040 640,960 L760,940 Q800,950 790,990 L700,1030 Q740,1080 700,1120 L640,1180 Q620,1260 640,1320 Z" fill="#0a0809" />
      <path d="M640,960 L760,940" stroke={PAL.amber} strokeWidth={3} opacity={0.4 + inhale * 0.4} />
      {/* jointen */}
      <g transform="rotate(-18,700,925)">
        <path d="M690,912 L470,900 L462,936 L690,936 Z" fill="#efe9dc" />
        <path d="M690,912 L470,900" stroke="#fff" strokeWidth={2} />
        <path d="M600,916 L600,934 M560,914 L560,934" stroke="#d8cfbd" strokeWidth={1.5} />
        <path d="M690,912 L720,918 L720,930 L690,936 Z" fill="#cbbfa4" />
        <ellipse cx={466} cy={918} rx={10} ry={18} fill={inhale > 0.5 ? "#ff7a2a" : "#b8481c"} />
        <circle cx={462} cy={918} r={60 + inhale * 70} fill="url(#glowAmber)" opacity={0.6 + inhale * 0.4} />
      </g>
      <Smoke t={lt} x={420} y={820} n={36} spread={1.2} seed="jt" color="#cfd6e6" />
      <Smoke t={lt + 0.7} x={660} y={880} n={24} spread={0.9} seed="jt2" color="#aab3c6" />
    </Stage>
  );
};
