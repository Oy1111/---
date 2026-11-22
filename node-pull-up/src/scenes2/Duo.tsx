import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { GFront } from "../components/GWagon";
import { Artist, ArtistDefs } from "../components/Artist";
import { Rain } from "../components/City";
import { wordTimes } from "../data/timing";
import { smooth } from "../lib";

/** "Han er to op ×4": Node og Gilli (rigtige fotos) på Strøget. Hvert "to" = nyt klip/komposition. */
export const Duo: React.FC<{ start: number; line: number; variant?: number }> = ({ start, line, variant = 0 }) => {
  const { lt, t } = useTimes(start);
  const tos = wordTimes(line, "to");
  let idx = -1;
  for (let i = 0; i < tos.length; i++) if (t >= tos[i] - 0.02) idx = i;
  const since = idx >= 0 ? t - tos[idx] : lt;
  const punch = Math.exp(-since * 8);
  // kompositioner pr. "to": [visNode, visGilli, zoom, dy]
  const comps: [boolean, boolean, number, number][] = [
    [true, true, 1.0, 0],
    [true, false, 1.25, -120],
    [false, true, 1.25, -120],
    [true, true, 1.12, -40],
    [true, true, 1.35, -200],
  ];
  const c = comps[(idx + 1 + variant) % comps.length];
  return (
    <>
      <Stage cam={[c[2] + punch * 0.04 + smooth(since / 1) * 0.02, 0, c[3]]}>
        <ArtistDefs />
        <g filter="url(#blur6)">
          <Stroget t={t} camZ={3 + variant} people={false} />
          <GFront x={540} y={1330} s={0.75} t={t} uid={`duo${variant}`} flash={punch * 0.6} beam={0.6} />
        </g>
        <rect x={-300} y={-300} width={1680} height={2520} fill="#05060c" opacity={0.25} />
        {c[0] && <Artist who="node" x={c[1] ? 330 : 540} y={1930} h={c[1] ? 980 : 1250} rim="rimWarm" t={t} />}
        {c[1] && <Artist who="gilli" x={c[0] ? 780 : 560} y={1930} h={c[0] ? 1040 : 1300} rim="rimCool" t={t + 1} />}
        <Rain t={t} opacity={0.2} />
      </Stage>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: punch * 0.18, mixBlendMode: "screen" }} />
    </>
  );
};
