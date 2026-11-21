import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Dust } from "../components/City";
import { Bag, Knob, Equalizer, Sparkle } from "../components/Props";
import { wordTimes } from "../data/timing";
import { PAL, W, easeOut, beatPulse } from "../lib";

/** "Gi'r dem bar' designer, så skrug op": poser falder ned i lyskeglen, volumen-knap drejes op. */
export const Designer: React.FC<{ start: number; line: number }> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const skrug = wordTimes(line, "skrug");
  const k0 = skrug[0] ?? start + 1.2;
  const vol = easeOut((t - k0) / 0.35) * 0.55 + easeOut((t - (skrug[1] ?? k0 + 0.6)) / 0.35) * 0.45;
  const bp = beatPulse(t);
  const bags: [number, string, string, number][] = [
    [250, "#14141c", "DESIGN", -8],
    [540, "#e9e4da", "", 4],
    [830, "#3b0f1e", "LUXE", 10],
  ];
  return (
    <Stage cam={[1.0 + bp * 0.015, 0, 0]}>
      <Sky t={t} stars={false} />
      <Skyline seed="dfar" base={1300} depth={0.35} maxH={900} t={t} offset={30} />
      <rect x={-200} y={1300} width={W + 400} height={800} fill="#070912" />
      {/* spotlight fra oven */}
      <polygon points="440,-50 640,-50 1000,1500 80,1500" fill="url(#cone)" opacity={0.8} style={{ mixBlendMode: "screen" }} />
      <ellipse cx={540} cy={1500} rx={470} ry={60} fill={PAL.amber} opacity={0.16} />
      {bags.map(([x, c, l, r], i) => {
        const d = easeOut((lt - i * 0.18) / 0.45);
        return <Bag key={i} x={x} y={-300 + d * 1700} s={1.15} color={c} label={l} rot={r * (1 - d) + (i - 1) * 3} />;
      })}
      {bags.map(([x], i) => (
        <Sparkle key={i} x={x + 60} y={1240 - i * 30} r={70 * Math.max(0, Math.sin((lt - 0.5 - i * 0.2) * 4))} rot={lt * 40} />
      ))}
      {/* volumen */}
      <g opacity={easeOut((t - k0 + 0.25) / 0.2)}>
        <rect x={140} y={1560} width={800} height={300} rx={40} fill="#05070f" stroke="#2b3760" strokeWidth={4} />
        <Knob x={300} y={1710} r={90} v={0.15 + vol * 0.85} />
        <Equalizer x={450} y={1820} w={460} h={230} level={0.2 + vol * 0.8 + bp * 0.2} t={t} n={12} />
      </g>
      <Dust t={t} n={50} area={[80, 0, 920, 1500]} />
    </Stage>
  );
};
