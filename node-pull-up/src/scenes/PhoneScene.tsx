import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Phone } from "../components/Props";
import { Dust } from "../components/City";
import { CHUNKS, lineOf } from "../data/timing";
import { PAL, beatPulse } from "../lib";

/** "Si'r til hende hva' jeg får": telefonen i bilen, beskeden skrives bogstav for bogstav i takt med ordene. */
export const PhoneScene: React.FC<{ start: number; line: number }> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const words = lineOf(line);
  let s = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (t < w.t) break;
    const end = i + 1 < words.length ? words[i + 1].t : w.t + 0.35;
    const n = Math.max(1, Math.ceil(((t - w.t) / Math.max(0.08, end - w.t)) * w.w.length));
    s += w.w.slice(0, n) + (t >= end ? " " : "");
  }
  const bp = beatPulse(t);
  void CHUNKS;
  return (
    <Stage cam={[1.0 + lt * 0.02, 0, 0]} bg="#05060c">
      <rect x={-200} y={-200} width={1480} height={2400} fill="#06070e" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={(i * 197) % 1080} cy={300 + ((i * 331) % 1400)} r={60 + (i % 4) * 30} fill={i % 2 ? "url(#glowAmber)" : "url(#glowCyan)"} opacity={0.25} />
      ))}
      <Phone x={540} y={1150} s={1.3} rot={-3}>
        <rect x={-192} y={-402} width={384} height={110} fill="#111833" />
        <text x={0} y={-330} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#fff">
          ♥
        </text>
        <rect x={-170} y={-250} width={240} height={64} rx={26} fill="#1c2546" />
        <text x={-150} y={-208} fontFamily="SpaceMonoB" fontSize={22} fill="#cfd8f5">
          hvad får du? 🤔
        </text>
        {s && (
          <g>
            <rect x={170 - Math.min(330, s.length * 15 + 40)} y={-150} width={Math.min(330, s.length * 15 + 40)} height={s.length * 15 + 40 > 330 ? 110 : 64} rx={26} fill={PAL.cyan} />
            <text x={170 - Math.min(330, s.length * 15 + 40) + 20} y={-108} fontFamily="SpaceMonoB" fontSize={24} fill="#04121a">
              {s.slice(0, 19)}
            </text>
            <text x={170 - Math.min(330, s.length * 15 + 40) + 20} y={-74} fontFamily="SpaceMonoB" fontSize={24} fill="#04121a">
              {s.slice(19)}
            </text>
          </g>
        )}
        <rect x={-170} y={300} width={340} height={70} rx={35} fill="#141b36" stroke="#2b3760" strokeWidth={2} />
        <circle cx={140} cy={335} r={26 + bp * 4} fill={PAL.cyan} />
      </Phone>
      <Dust t={t} n={40} />
    </Stage>
  );
};
