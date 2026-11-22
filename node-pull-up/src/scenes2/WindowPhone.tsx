import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Rain, Dust } from "../components/City";
import { lineOf } from "../data/timing";
import { PAL, W, smooth, clamp } from "../lib";

/**
 * "Si'r til hende hva' jeg får": ude fra gaden zoomer vi ind gennem et oplyst vindue,
 * ind i soveværelset til telefonen på natbordet – beskeden skrives i takt med ordene.
 */
export const WindowPhone: React.FC<{ start: number; dur: number; line: number }> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const ZOOM = 1.1; // sek. ude-fra-zoom
  const z = smooth(lt / ZOOM);
  const inside = clamp((lt - ZOOM + 0.15) / 0.25);
  // vinduet vi zoomer ind i (3. sal, midten)
  const wx = 540, wy = 860;
  const zoom = 1 + Math.pow(z, 2.2) * 9;
  // besked-tekst bogstav for bogstav
  const words = lineOf(line);
  let s = "";
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (t < w.t) break;
    const end = i + 1 < words.length ? words[i + 1].t : w.t + 0.35;
    const n = Math.max(1, Math.ceil(((t - w.t) / Math.max(0.08, end - w.t)) * w.w.length));
    s += w.w.slice(0, n) + (t >= end ? " " : "");
  }
  const notif = clamp((lt - ZOOM - 0.1) / 0.2);
  const buzz = lt > ZOOM && lt < ZOOM + 0.5 ? Math.sin(lt * 90) * 5 : 0;
  return (
    <>
      {inside < 1 && (
        <Stage cam={[1, 0, 0]}>
          <g transform={`translate(${wx},${wy}) scale(${zoom}) translate(${-wx},${-wy})`}>
            <Sky t={t} />
            {/* etageejendom (okker puds) */}
            <rect x={-100} y={200} width={1280} height={1800} fill="#a98a5c" />
            <rect x={-100} y={200} width={1280} height={1800} fill="url(#facadeShade)" />
            {[0, 1, 2, 3, 4].map((fl) =>
              [0, 1, 2, 3].map((c) => {
                const x = 40 + c * 260, y = 300 + fl * 330;
                const me = fl === 2 && c === 2 - 0;
                const on = me || random(`aw${fl}${c}`) < 0.35;
                return (
                  <g key={`${fl}${c}`}>
                    <rect x={x - 10} y={y - 10} width={180} height={250} fill="#e8dcc4" opacity={0.6} />
                    <rect x={x} y={y} width={160} height={230} fill={on ? "#ffd59a" : "#141a28"} />
                    {on && <rect x={x} y={y} width={160} height={230} fill="url(#glowAmber)" opacity={0.5} />}
                    <line x1={x + 80} y1={y} x2={x + 80} y2={y + 230} stroke="#e8dcc4" strokeWidth={8} />
                    <line x1={x} y1={y + 80} x2={x + 160} y2={y + 80} stroke="#e8dcc4" strokeWidth={8} />
                  </g>
                );
              }),
            )}
            <rect x={-100} y={1880} width={1280} height={400} fill="#0d0f16" />
          </g>
          <Rain t={t} opacity={0.25} />
        </Stage>
      )}
      {inside > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: inside }}>
          <Stage cam={[1.05 + (lt - ZOOM) * 0.04, 0, 0]} bg="#07060a">
            {/* soveværelse om natten */}
            <rect x={-300} y={-300} width={W + 600} height={2600} fill="#120e10" />
            <rect x={620} y={-100} width={520} height={900} fill="#1b2440" />
            <rect x={620} y={-100} width={520} height={900} fill="url(#glowCyan)" opacity={0.12} />
            <line x1={880} y1={-100} x2={880} y2={800} stroke="#0b0a0c" strokeWidth={16} />
            {/* sengen (dyne) */}
            <path d="M560,1050 Q800,980 1300,1010 L1300,2300 L520,2300 Z" fill="#d9d4cc" />
            <path d="M560,1050 Q800,980 1300,1010 L1300,1120 Q900,1090 560,1150 Z" fill="#efebe4" />
            <path d="M600,1300 Q900,1260 1300,1300" stroke="#b8b0a4" strokeWidth={6} fill="none" />
            {/* natbord */}
            <rect x={-100} y={1120} width={640} height={60} rx={8} fill="#6a4a30" />
            <rect x={-100} y={1180} width={600} height={900} fill="#4a321f" />
            <rect x={20} y={1260} width={420} height={14} rx={7} fill="#2a1c10" />
            {/* lampe */}
            <path d="M120,700 L340,700 L380,920 L80,920 Z" fill="#e8d6b0" />
            <rect x={220} y={920} width={20} height={200} fill="#8a7050" />
            <circle cx={230} cy={850} r={600} fill="url(#glowAmber)" opacity={0.6} style={{ mixBlendMode: "screen" }} />
            <ellipse cx={230} cy={1130} rx={380} ry={60} fill={PAL.amber} opacity={0.25} />
            {/* telefon på natbordet (set ovenfra i vinkel) */}
            <g transform={`translate(${300 + buzz},1100) rotate(-8) scale(1,0.86)`}>
              <rect x={-110} y={-230} width={220} height={440} rx={34} fill="#0a0b10" stroke="#5c6680" strokeWidth={3} />
              <rect x={-100} y={-220} width={200} height={420} rx={26} fill={notif > 0 ? "#0e1428" : "#05060a"} />
              {notif > 0 && (
                <g opacity={notif}>
                  <text x={0} y={-150} textAnchor="middle" fontFamily="Anton" fontSize={56} fill="#fff">
                    00:17
                  </text>
                  <rect x={-90} y={-110} width={180} height={150} rx={16} fill="#f2f4f8" opacity={0.92} />
                  <text x={-78} y={-82} fontFamily="SpaceMonoB" fontSize={14} fill="#333">
                    BESKED · nu
                  </text>
                  <text x={-78} y={-56} fontFamily="SpaceMonoB" fontSize={16} fill="#111">
                    {s.slice(0, 15)}
                  </text>
                  <text x={-78} y={-32} fontFamily="SpaceMonoB" fontSize={16} fill="#111">
                    {s.slice(15, 30)}
                  </text>
                  <circle cx={0} cy={0} r={160} fill="url(#glowCyan)" opacity={0.25} />
                </g>
              )}
            </g>
            {notif > 0 && <circle cx={300} cy={1100} r={420} fill="url(#glowCyan)" opacity={0.25 * notif} style={{ mixBlendMode: "screen" }} />}
            <Dust t={t} n={50} area={[0, 600, 700, 700]} />
          </Stage>
        </div>
      )}
    </>
  );
};
