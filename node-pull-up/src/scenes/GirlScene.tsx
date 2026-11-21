import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Dust } from "../components/City";
import { Girl } from "../components/Figures";
import { wordTimes } from "../data/timing";
import { PAL, W } from "../lib";

/** "Hun er ikk' hidsig, men slår": kvinde i magenta neon. På "slår" – slag-effekt: knust glas + chokbølge. */
export const GirlScene: React.FC<{ start: number; line: number }> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const slar = wordTimes(line, "slår")[0] ?? start + 1.5;
  const k = t - slar;
  const cracks = [];
  if (k > 0)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.3;
      let x = 560, y = 900;
      const pts = [`${x},${y}`];
      for (let s = 0; s < 6; s++) {
        x += Math.cos(a + Math.sin(i * 7 + s) * 0.3) * 120;
        y += Math.sin(a + Math.sin(i * 5 + s) * 0.3) * 120;
        pts.push(`${x},${y}`);
      }
      cracks.push(<polyline key={i} points={pts.join(" ")} fill="none" stroke="#fff" strokeWidth={4} opacity={0.85} />);
    }
  return (
    <Stage cam={[1.0 + lt * 0.03 + (k > 0 ? 0.08 * Math.exp(-k * 6) : 0), 0, 0]}>
      <Sky t={t} stars={false} />
      <Skyline seed="gir" base={1300} depth={0.4} maxH={900} t={t} offset={300} />
      <rect x={-200} y={1300} width={W + 400} height={800} fill="#07050c" />
      {/* neonskilt */}
      <rect x={140} y={560} width={800} height={14} rx={7} fill={PAL.magenta} opacity={0.9} />
      <circle cx={540} cy={567} r={600} fill="url(#glowMagenta)" opacity={0.3} />
      <polygon points="380,580 700,580 980,1800 100,1800" fill={PAL.magenta} opacity={0.08} />
      <ellipse cx={540} cy={1800} rx={330} ry={46} fill="url(#shadow)" />
      <Girl x={540} y={1800} h={1250} t={t} rim={PAL.magenta} />
      {k > 0 && (
        <g>
          <circle cx={560} cy={900} r={k * 1800} fill="none" stroke="#fff" strokeWidth={20} opacity={Math.max(0, 0.7 - k * 1.2)} />
          {cracks}
        </g>
      )}
      <Dust t={t} n={50} color="#ffd0e4" />
    </Stage>
  );
};
