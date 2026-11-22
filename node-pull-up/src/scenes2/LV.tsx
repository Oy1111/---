import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Rain, Dust } from "../components/City";
import { Sparkle } from "../components/Props";
import { wordTimes } from "../data/timing";
import { PAL, W, easeOut, smooth, beatPulse, clamp } from "../lib";

const BROWN = "#5a3a22";
/** Kuffert/taske med blomster-mønster (brunt lærred, messingbeslag) */
const Trunk: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={BROWN} />
    {Array.from({ length: Math.floor(w / 26) * Math.floor(h / 26) }).map((_, i) => {
      const cols = Math.floor(w / 26);
      const cx = x + 13 + (i % cols) * 26, cy = y + 13 + Math.floor(i / cols) * 26;
      return <circle key={i} cx={cx} cy={cy} r={4} fill="#c9a46a" opacity={0.55} />;
    })}
    <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke="#2a1a0e" strokeWidth={6} />
    {[[x, y], [x + w - 18, y], [x, y + h - 18], [x + w - 18, y + h - 18]].map(([a, b], i) => (
      <rect key={i} x={a} y={b} width={18} height={18} rx={3} fill="url(#gold)" />
    ))}
    <rect x={x + w / 2 - 14} y={y + h * 0.4} width={28} height={22} rx={4} fill="url(#gold)" />
  </g>
);

const Handbag: React.FC<{ x: number; y: number; s: number; col?: string }> = ({ x, y, s, col = BROWN }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,-70 Q-40,-120 0,-120 Q40,-120 40,-70" fill="none" stroke="#3a2412" strokeWidth={8} />
    <path d="M-80,-70 L80,-70 L95,40 L-95,40 Z" fill={col} />
    {Array.from({ length: 24 }).map((_, i) => (
      <circle key={i} cx={-70 + (i % 6) * 28} cy={-50 + Math.floor(i / 6) * 24} r={3.5} fill="#c9a46a" opacity={0.5} />
    ))}
    <rect x={-12} y={-60} width={24} height={18} rx={3} fill="url(#gold)" />
    <path d="M-80,-70 L80,-70" stroke="#d9b77c" strokeWidth={3} opacity={0.6} />
  </g>
);

/** Anonym fyr bagfra (hættetrøje), går væk fra kameraet */
const GuyBack: React.FC<{ x: number; y: number; h: number; t: number; col?: string }> = ({ x, y, h, t, col = "#0b0d14" }) => {
  const s = h / 100;
  const sw = Math.sin(t * 7) * 3;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={20} ry={2.5} fill="#000" opacity={0.5} />
      <path d={`M-13,-46 L${-11 + sw * 0.3},-2 L${-3 + sw * 0.2},-2 L-1,-40 L1,-40 L${3 - sw * 0.2},-2 L${11 - sw * 0.3},-2 L13,-46 Z`} fill="#141824" />
      <path d="M-14,-2 L-2,-2 L-2,1 L-15,1 Z M2,-2 L14,-2 L15,1 L2,1 Z" fill="#e9e9ee" />
      <path d="M-18,-78 Q-21,-60 -18,-44 L18,-44 Q21,-60 18,-78 Q0,-84 -18,-78 Z" fill={col} />
      <path d="M-18,-76 Q-24,-60 -22,-46 L-17,-46 Z M18,-76 Q24,-60 22,-46 L17,-46 Z" fill={col} />
      <path d="M-9,-80 Q-11,-98 0,-100 Q11,-98 9,-80 Q0,-76 -9,-80 Z" fill={col} />
      <path d="M-18,-78 Q0,-84 18,-78" stroke="#ffe2b0" strokeWidth={0.8} opacity={0.6} fill="none" />
      <path d="M-9,-80 Q-11,-98 0,-100" stroke="#ffe2b0" strokeWidth={0.6} opacity={0.6} fill="none" />
    </g>
  );
};

/** Louis Vuitton-butikken på Strøget, set forfra om natten. To fyre går ind. */
export const LVFront: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const u = smooth(lt / dur);
  const walk = lt / dur;
  return (
    <Stage cam={[1.0 + u * 0.18, 0, -u * 160]}>
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#0a0c14" />
      {/* kalkstensfacade */}
      <rect x={-60} y={-100} width={1200} height={1820} fill="#bfb3a0" />
      <rect x={-60} y={-100} width={1200} height={1820} fill="url(#facadeShade)" />
      {[260, 520, 780].map((yy) => (
        <rect key={yy} x={-60} y={yy} width={1200} height={14} fill="#8d8270" opacity={0.7} />
      ))}
      {/* øverste vinduer */}
      {[0, 1, 2, 3].map((c) =>
        [0, 1].map((r) => <rect key={`${c}${r}`} x={40 + c * 260} y={-20 + r * 260} width={150} height={190} fill={random(`lvw${c}${r}`) < 0.6 ? "#ffd59a" : "#1c2232"} opacity={0.85} />),
      )}
      {/* skilt */}
      <rect x={60} y={840} width={960} height={110} fill="#1a1510" />
      <text x={540} y={918} textAnchor="middle" fontFamily="sans-serif" fontWeight={300} fontSize={68} letterSpacing={18} fill="#f3e6c8">
        LOUIS VUITTON
      </text>
      <rect x={60} y={840} width={960} height={110} fill="none" stroke="url(#gold)" strokeWidth={4} />
      {/* buede udstillingsvinduer + dør */}
      {[0, 2].map((c) => {
        const x = c === 0 ? 40 : 720;
        return (
          <g key={c}>
            <path d={`M${x},1700 L${x},1150 Q${x},1000 ${x + 160},1000 Q${x + 320},1000 ${x + 320},1150 L${x + 320},1700 Z`} fill="#fff1d6" />
            <path d={`M${x},1700 L${x},1150 Q${x},1000 ${x + 160},1000 Q${x + 320},1000 ${x + 320},1150 L${x + 320},1700 Z`} fill="url(#glowAmber)" opacity={0.6} />
            <Trunk x={x + 40} y={1500} w={240} h={150} />
            <Trunk x={x + 70} y={1370} w={180} h={130} />
            <Handbag x={x + 160} y={1300} s={0.9} />
            <path d={`M${x},1700 L${x},1150 Q${x},1000 ${x + 160},1000 Q${x + 320},1000 ${x + 320},1150 L${x + 320},1700`} fill="none" stroke="#3a2e22" strokeWidth={14} />
          </g>
        );
      })}
      <path d="M400,1720 L400,1120 Q400,1010 540,1010 Q680,1010 680,1120 L680,1720 Z" fill="#ffe7c0" />
      <rect x={530} y={1120} width={20} height={600} fill="#3a2e22" />
      <circle cx={540} cy={1300} r={420} fill="url(#glowAmber)" opacity={0.55} style={{ mixBlendMode: "screen" }} />
      {/* fortov */}
      <rect x={-300} y={1700} width={W + 600} height={600} fill="url(#cobble)" />
      <ellipse cx={540} cy={1740} rx={700} ry={90} fill={PAL.amber} opacity={0.22} filter="url(#blur30)" />
      {/* to fyre går ind */}
      <GuyBack x={300 + walk * 140} y={1990 - walk * 230} h={560 - walk * 220} t={t} />
      <GuyBack x={780 - walk * 140} y={2010 - walk * 240} h={580 - walk * 230} t={t + 0.4} col="#121624" />
      <Rain t={t} opacity={0.2} />
    </Stage>
  );
};

/** Inde i butikken: reoler med tasker og sko. På "skrug op" lyser hylderne op række for række. */
export const LVInside: React.FC<{ start: number; dur: number; line: number }> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const sk = wordTimes(line, "skrug");
  const k0 = sk[0] ?? start;
  const u = smooth(lt / dur);
  return (
    <Stage cam={[1.05 + u * 0.12, 0, 0]} bg="#120d08">
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#1b140d" />
      {/* reolvæg */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => {
          const x = 40 + c * 255, y = 120 + r * 250;
          const on = clamp((t - k0 - r * 0.07) / 0.1);
          const it = Math.floor(random(`it${r}${c}`) * 3);
          return (
            <g key={`${r}${c}`}>
              <rect x={x} y={y} width={235} height={230} fill="#2a1d12" />
              <rect x={x} y={y} width={235} height={230} fill="#ffe3b0" opacity={0.12 + on * 0.25} />
              <rect x={x + 30} y={y + 6} width={175} height={8} rx={4} fill="#fff3d6" opacity={0.5 + on * 0.5} />
              {it === 0 && <Handbag x={x + 118} y={y + 200} s={0.85} col={random(`c${r}${c}`) < 0.5 ? BROWN : "#2b2b33"} />}
              {it === 1 && (
                <g>
                  <path d={`M${x + 40},${y + 200} L${x + 40},${y + 160} Q${x + 70},${y + 140} ${x + 120},${y + 150} L${x + 200},${y + 175} L${x + 200},${y + 200} Z`} fill="#f2f0ea" />
                  <rect x={x + 40} y={y + 192} width={160} height={10} fill="#d8d2c4" />
                  <circle cx={x + 90} cy={y + 165} r={7} fill={BROWN} />
                </g>
              )}
              {it === 2 && <Trunk x={x + 40} y={y + 90} w={155} h={110} />}
              <rect x={x} y={y + 205} width={235} height={25} fill="#3a2a1a" />
            </g>
          );
        }),
      )}
      <rect x={-300} y={1640} width={W + 600} height={700} fill="#2a2018" />
      <rect x={-300} y={1640} width={W + 600} height={10} fill="#d9b77c" opacity={0.4} />
      <Sparkle x={300} y={500 + Math.sin(t) * 40} r={80 * Math.abs(Math.sin(t * 3))} />
      <Sparkle x={800} y={900} r={70 * Math.abs(Math.sin(t * 2.4 + 1))} />
      <Dust t={t} n={60} />
    </Stage>
  );
};

/** Ved disken: poser stables, kvitteringen printes med totalen. */
export const LVBags: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const bp = beatPulse(t);
  const receipt = easeOut(lt / (dur * 0.8));
  const total = Math.round(receipt * 148500);
  return (
    <Stage cam={[1.0 + lt * 0.02 + bp * 0.01, 0, 0]} bg="#120d08">
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#1f160e" />
      <circle cx={540} cy={300} r={1000} fill="url(#glowAmber)" opacity={0.35} />
      {/* disk */}
      <rect x={-300} y={1300} width={W + 600} height={800} fill="#2b1f15" />
      <rect x={-300} y={1300} width={W + 600} height={18} fill="#d9b77c" opacity={0.6} />
      {/* poser */}
      {[0, 1, 2, 3, 4].map((i) => {
        const d = easeOut((lt - i * 0.25) / 0.35);
        if (d <= 0) return null;
        const x = 150 + i * 190, y = 1310 - (1 - d) * 300;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(i - 2) * 4})`}>
            <path d="M-50,-260 Q-50,-320 0,-320 Q50,-320 50,-260" fill="none" stroke="#7a4b1e" strokeWidth={6} />
            <rect x={-95} y={-270} width={190} height={270} fill="#e39b3a" />
            <rect x={-95} y={-270} width={20} height={270} fill="#000" opacity={0.15} />
            <text x={0} y={-150} textAnchor="middle" fontFamily="sans-serif" fontSize={17} letterSpacing={4} fill="#4a2a10">
              LOUIS VUITTON
            </text>
          </g>
        );
      })}
      {/* kvittering */}
      <g transform="translate(540,1300)">
        <rect x={-110} y={-30} width={220} height={60} rx={10} fill="#141414" />
        <rect x={-90} y={30} width={180} height={receipt * 520} fill="#f4f1ea" />
        {Array.from({ length: Math.floor(receipt * 12) }).map((_, i) => (
          <rect key={i} x={-75} y={50 + i * 36} width={100 + random(`r${i}`) * 50} height={10} fill="#9a958a" />
        ))}
        {receipt > 0.6 && (
          <text x={0} y={30 + receipt * 520 - 30} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={26} fill="#111">
            {`KR ${total.toLocaleString("da-DK")},-`}
          </text>
        )}
      </g>
      <Dust t={t} n={50} />
    </Stage>
  );
};
