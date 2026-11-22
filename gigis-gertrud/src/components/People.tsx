import React from "react";

/**
 * Parametrisk vektor-buste (ren illustrationsstil). Lokale koordinater: (0,0) = midt forneden ved skuldrene,
 * hovedet er ca. 270 høj omkring y = -335. s = skala.
 */
export type Who = "gertrud" | "abdi" | "inspektor" | "hassan" | "laererA" | "laererB";
type Look = {
  skin: [string, string];
  hair: string;
  cloth: [string, string];
  eye: string;
  lips: string;
};
const LOOKS: Record<Who, Look> = {
  gertrud: { skin: ["#f3d2bd", "#d9a98e"], hair: "#d9d6d2", cloth: ["#7c3b45", "#4e2229"], eye: "#4a6f8a", lips: "#b8636a" },
  abdi: { skin: ["#c88d63", "#9a6440"], hair: "#17110d", cloth: ["#2c4a7a", "#1a2c4c"], eye: "#3a2414", lips: "#8e4f3f" },
  inspektor: { skin: ["#f0c9ad", "#cf9d80"], hair: "#6b5a4a", cloth: ["#3a3f4c", "#22262e"], eye: "#4a3a2a", lips: "#a86058" },
  hassan: { skin: ["#b47c55", "#8a5a38"], hair: "#100c09", cloth: ["#5a7a3a", "#36502a"], eye: "#2c1a10", lips: "#7c4636" },
  laererA: { skin: ["#f2cfb4", "#d49e80"], hair: "#3a2418", cloth: ["#3b6e8f", "#244a63"], eye: "#3a5a2a", lips: "#a0434c" },
  laererB: { skin: ["#e8c0a0", "#c49272"], hair: "#5a3a22", cloth: ["#7a6a4a", "#4e4430"], eye: "#3a2a1a", lips: "#94564a" },
};

export const PeopleDefs: React.FC = () => (
  <defs>
    {(Object.keys(LOOKS) as Who[]).map((w) => (
      <React.Fragment key={w}>
        <linearGradient id={`skin-${w}`} x1="1" y1="0" x2="0" y2="0.3">
          <stop offset="0" stopColor={LOOKS[w].skin[0]} />
          <stop offset="0.6" stopColor={LOOKS[w].skin[0]} />
          <stop offset="1" stopColor={LOOKS[w].skin[1]} />
        </linearGradient>
        <linearGradient id={`cloth-${w}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LOOKS[w].cloth[0]} />
          <stop offset="1" stopColor={LOOKS[w].cloth[1]} />
        </linearGradient>
      </React.Fragment>
    ))}
    <radialGradient id="blush">
      <stop offset="0" stopColor="#e0707a" stopOpacity="0.45" />
      <stop offset="1" stopColor="#e0707a" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="hairShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  </defs>
);

const FACE = "M0,-470 C72,-470 112,-420 112,-350 C112,-300 100,-252 64,-222 C42,-205 20,-197 0,-197 C-20,-197 -42,-205 -64,-222 C-100,-252 -112,-300 -112,-350 C-112,-420 -72,-470 0,-470 Z";

export const Bust: React.FC<{
  who: Who;
  x: number;
  y: number;
  s: number;
  t: number;
  smile?: number; // 0..1
  brow?: number; // -1 vred .. 1 glad/løftet
  look?: number; // øjne -1..1 vandret
  tilt?: number; // grader
  talk?: number; // mund åben 0..1
  rim?: string;
  blinkSeed?: number;
  wink?: number; // 0..1 højre øje lukkes
}> = ({ who, x, y, s, t, smile = 0.4, brow = 0, look = 0, tilt = 0, talk = 0, rim = "#ffd9a0", blinkSeed = 0, wink = 0 }) => {
  const L = LOOKS[who];
  const id = who;
  // naturligt blink ca. hvert 3. sekund
  const bp = (t + blinkSeed) % 3.1;
  const blink = bp < 0.12 ? Math.sin((bp / 0.12) * Math.PI) : 0;
  const eyeOpen = 1 - blink * 0.92;
  const breathe = Math.sin(t * 1.7 + blinkSeed) * 3;
  const mouthY = -262;
  const mW = 34 + smile * 8;
    const open = talk * 16;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* --- bag-hår --- */}
      {who === "gertrud" && (
        <g>
          <ellipse cx={0} cy={-470} rx={62} ry={50} fill={L.hair} />
          <ellipse cx={-10} cy={-478} rx={40} ry={30} fill="#efedea" opacity={0.6} />
          <path d="M-20,-505 Q0,-470 22,-505" stroke="#b9b5b0" strokeWidth={4} fill="none" />
        </g>
      )}
      {/* --- krop / tøj --- */}
      <g transform={`translate(0,${breathe * 0.4})`}>
        <path d="M-50,-215 L-48,-150 L48,-150 L50,-215 Z" fill={L.skin[1]} />
        <path d="M-200,0 L-196,-90 Q-190,-150 -120,-168 L-46,-185 Q0,-160 46,-185 L120,-168 Q190,-150 196,-90 L200,0 Z" fill={`url(#cloth-${id})`} />
        <path d="M-200,0 L-196,-90 Q-190,-150 -120,-168" fill="none" stroke={rim} strokeWidth={5} opacity={0.5} />
        {who === "gertrud" && (
          <g>
            {/* bluse-krave + cardigan V + perlekæde + brillekæde */}
            <path d="M-46,-185 L0,-110 L46,-185 Q0,-170 -46,-185 Z" fill="#f2ece2" />
            <path d="M-46,-185 L-10,-120 L-30,-115 Z M46,-185 L10,-120 L30,-115 Z" fill="#e2dacd" />
            <path d="M-70,-170 L0,-40 M70,-170 L0,-40" stroke="#5a2a32" strokeWidth={6} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={0} cy={-90 + i * 26} r={7} fill="#e9e1d4" stroke="#b8ab96" strokeWidth={1.5} />
            ))}
            {Array.from({ length: 13 }).map((_, i) => {
              const a = (i / 12) * Math.PI;
              return <circle key={`p${i}`} cx={Math.cos(a) * 42} cy={-176 + Math.sin(a) * 24} r={5.5} fill="#f7f2ea" stroke="#c9bda8" strokeWidth={1} />;
            })}
          </g>
        )}
        {who === "abdi" && (
          <g>
            {/* hættetrøje: hætte bag nakken + snører */}
            <path d="M-120,-168 Q-130,-230 -70,-232 L70,-232 Q130,-230 120,-168 Q60,-200 0,-196 Q-60,-200 -120,-168 Z" fill={L.cloth[1]} />
            <path d="M-22,-180 L-26,-110 M22,-180 L26,-110" stroke="#e8e8ee" strokeWidth={5} strokeLinecap="round" />
            <rect x={-90} y={-70} width={180} height={60} rx={14} fill="#000" opacity={0.15} />
          </g>
        )}
        {who === "hassan" && <path d="M-46,-185 Q0,-150 46,-185" stroke="#2a3a1c" strokeWidth={8} fill="none" />}
        {who === "inspektor" && (
          <g>
            <path d="M-46,-185 L0,-100 L46,-185 Q0,-172 -46,-185 Z" fill="#f4f4f6" />
            <path d="M-12,-176 L12,-176 L16,-150 L0,-60 L-16,-150 Z" fill="#8a1c24" />
            <path d="M-46,-185 L-90,-60 L-20,-120 Z M46,-185 L90,-60 L20,-120 Z" fill="#2c3038" />
          </g>
        )}
      </g>
      {/* --- hoved --- */}
      <g transform={`rotate(${tilt},0,-200) translate(0,${breathe * 0.3})`}>
        {/* ører */}
        <ellipse cx={-110} cy={-335} rx={16} ry={28} fill={L.skin[1]} />
        <ellipse cx={110} cy={-335} rx={16} ry={28} fill={L.skin[0]} />
        {who === "gertrud" && (
          <g>
            <circle cx={-112} cy={-300} r={8} fill="#f7f2ea" />
            <circle cx={112} cy={-300} r={8} fill="#f7f2ea" />
          </g>
        )}
        {/* lyskant + ansigt */}
        <path d={FACE} fill={rim} transform="translate(-6,0)" opacity={0.8} />
        <path d={FACE} fill={`url(#skin-${id})`} />
        {/* blush + kæbeskygge */}
        <ellipse cx={-62} cy={-292} rx={30} ry={18} fill="url(#blush)" />
        <ellipse cx={62} cy={-292} rx={30} ry={18} fill="url(#blush)" />
        <path d="M-64,-222 C-42,-205 -20,-197 0,-197 C20,-197 42,-205 64,-222 C40,-212 20,-208 0,-208 C-20,-208 -40,-212 -64,-222 Z" fill="#000" opacity={0.08} />
        {/* øjne */}
        {[-1, 1].map((k) => {
          const op = k === 1 ? eyeOpen * (1 - wink * 0.95) : eyeOpen;
          return (
            <g key={k} transform={`translate(${k * 42},-345) scale(1,${op})`}>
              <ellipse cx={0} cy={0} rx={22} ry={12} fill="#fbf8f4" />
              <circle cx={look * 8} cy={0} r={10.5} fill={L.eye} />
              <circle cx={look * 8} cy={0} r={5} fill="#0a0604" />
              <circle cx={look * 8 + 3.5} cy={-3.5} r={2.8} fill="#fff" />
              <path d="M-24,-2 Q0,-18 24,-2" stroke="#2a1a12" strokeWidth={5} fill="none" strokeLinecap="round" />
              <path d="M-20,8 Q0,15 20,8" stroke="#000" strokeWidth={1.5} fill="none" opacity={0.25} />
            </g>
          );
        })}
        {/* øjenbryn */}
        {[-1, 1].map((k) => (
          <path
            key={k}
            d={`M${k * 18},${-378 + brow * -4} Q${k * 40},${-392 - brow * 6} ${k * 66},${-382 + brow * -2 + (brow < 0 ? -8 : 0) * -1}`}
            stroke={who === "gertrud" ? "#9b948c" : who === "inspektor" ? "#4a3a2c" : "#140d09"}
            strokeWidth={who === "abdi" || who === "hassan" ? 9 : 7}
            fill="none"
            strokeLinecap="round"
            transform={brow < 0 ? `rotate(${k * brow * -10},${k * 40},-385)` : undefined}
          />
        ))}
        {/* næse */}
        <path d="M6,-345 Q14,-300 18,-290 Q8,-282 -4,-286" stroke={L.skin[1]} strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={-8} cy={-287} rx={5} ry={3} fill="#000" opacity={0.18} />
        <ellipse cx={12} cy={-287} rx={5} ry={3} fill="#000" opacity={0.18} />
        {/* mund: overlæbe-bue + underlæbe-bue (smil åbner munden og viser tænder) */}
        {(() => {
          const up = mouthY + smile * 4 - (1 - smile) * 2;
          const lo = mouthY + smile * 30 + open;
          const corner = mouthY - smile * 8;
          const showTeeth = smile > 0.45 || talk > 0.2;
          return (
            <g>
              <path d={`M${-mW},${corner} Q0,${up} ${mW},${corner} Q0,${lo} ${-mW},${corner} Z`} fill={showTeeth ? "#4a1616" : L.lips} />
              {showTeeth && <path d={`M${-mW + 6},${corner + 2} Q0,${up + 2} ${mW - 6},${corner + 2} Q0,${up + 14} ${-mW + 6},${corner + 2} Z`} fill="#fbfaf6" />}
              {showTeeth && <ellipse cx={0} cy={lo - 8} rx={mW * 0.45} ry={5} fill="#c4505a" opacity={0.8} />}
              <path d={`M${-mW},${corner} Q0,${lo} ${mW},${corner}`} stroke={L.lips} strokeWidth={5} fill="none" />
              <path d={`M${-mW},${corner} Q0,${up} ${mW},${corner}`} stroke={L.lips} strokeWidth={3} fill="none" />
            </g>
          );
        })()}
        {smile > 0.3 && (
          <g stroke={L.skin[1]} strokeWidth={3} fill="none" opacity={0.6}>
            <path d={`M${-mW - 6},${mouthY - 14} Q${-mW - 10},${mouthY} ${-mW - 4},${mouthY + 6}`} />
            <path d={`M${mW + 6},${mouthY - 14} Q${mW + 10},${mouthY} ${mW + 4},${mouthY + 6}`} />
          </g>
        )}
        {/* --- karakter-specifikt --- */}
        {who === "gertrud" && (
          <g>
            {/* rynker */}
            <g stroke="#b88a72" strokeWidth={2.5} fill="none" opacity={0.7}>
              <path d="M-40,-420 Q0,-426 40,-420" />
              <path d="M-30,-408 Q0,-413 30,-408" />
              <path d="M-74,-350 l-12,-6 M-74,-342 l-12,0 M-74,-334 l-12,6" />
              <path d="M74,-350 l12,-6 M74,-342 l12,0 M74,-334 l12,6" />
              <path d="M-40,-300 Q-48,-280 -44,-262" />
              <path d="M40,-300 Q48,-280 44,-262" />
            </g>
            {/* hår: bløde grå bølger */}
            <path d="M-116,-330 C-130,-420 -90,-488 0,-492 C90,-488 130,-420 116,-330 C104,-380 82,-420 40,-440 C20,-420 -10,-420 -30,-440 C-70,-430 -100,-390 -116,-330 Z" fill={L.hair} />
            <path d="M-116,-330 C-130,-420 -90,-488 0,-492 C90,-488 130,-420 116,-330" fill="none" stroke="#f4f2ef" strokeWidth={6} opacity={0.6} />
            {[-70, -30, 20, 64].map((xx, i) => (
              <path key={i} d={`M${xx},-470 Q${xx + 18},-450 ${xx + 6},-428`} stroke="#b9b5b0" strokeWidth={3} fill="none" />
            ))}
            {/* briller + kæde */}
            {[-1, 1].map((k) => (
              <ellipse key={k} cx={k * 42} cy={-344} rx={34} ry={26} fill="#fff" fillOpacity={0.08} stroke="#7a4a2a" strokeWidth={5} />
            ))}
            <path d="M-8,-348 Q0,-354 8,-348" stroke="#7a4a2a" strokeWidth={5} fill="none" />
            <path d="M-76,-344 Q-118,-240 -96,-150 M76,-344 Q118,-240 96,-150" stroke="#c9a46a" strokeWidth={2.5} fill="none" strokeDasharray="4 4" />
            <path d="M24,-364 L40,-338" stroke="#fff" strokeWidth={4} opacity={0.5} />
          </g>
        )}
        {(who === "abdi" || who === "hassan") && (
          <g>
            {/* krøller */}
            {Array.from({ length: 34 }).map((_, i) => {
              const a = Math.PI * (1.05 + (i / 33) * 0.9);
              const r = 108 + (i % 3) * 10;
              const cx = Math.cos(a) * r * 0.98, cy = -350 + Math.sin(a) * r * 1.12;
              return <circle key={i} cx={cx} cy={cy} r={who === "abdi" ? 30 : 24} fill={L.hair} />;
            })}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle key={`c${i}`} cx={-80 + i * 15} cy={-440 + (i % 2) * 14} r={26} fill={L.hair} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <path key={`h${i}`} d={`M${-70 + i * 15},${-470 + (i % 3) * 6} q8,-10 16,0`} stroke="#4a3a30" strokeWidth={3} fill="none" />
            ))}
          </g>
        )}
        {who === "laererA" && (
          <g>
            <path d="M-122,-250 C-140,-420 -90,-492 0,-494 C90,-492 140,-420 122,-250 L100,-250 C104,-330 96,-400 60,-430 C20,-410 -40,-400 -86,-380 C-100,-330 -100,-290 -100,-250 Z" fill={L.hair} />
            <path d="M-60,-470 Q0,-490 60,-470" stroke="#fff" strokeWidth={6} opacity={0.25} fill="none" />
            {[-1, 1].map((k) => (
              <rect key={k} x={k * 42 - 30} y={-362} width={60} height={34} rx={14} fill="#fff" fillOpacity={0.08} stroke="#b0262e" strokeWidth={6} />
            ))}
            <path d="M-12,-346 L12,-346" stroke="#b0262e" strokeWidth={6} />
          </g>
        )}
        {who === "laererB" && (
          <g>
            <path d="M-114,-340 C-118,-430 -70,-480 0,-482 C70,-480 118,-430 114,-340 C100,-400 60,-430 0,-432 C-60,-430 -100,-400 -114,-340 Z" fill={L.hair} />
            <path d="M-110,-320 C-110,-250 -70,-196 0,-190 C70,-196 110,-250 110,-320 C96,-280 70,-262 40,-266 Q0,-250 -40,-266 C-70,-262 -96,-280 -110,-320 Z" fill={L.hair} />
            <path d="M-40,-268 Q0,-246 40,-268 Q0,-258 -40,-268 Z" fill="#7a3a30" />
          </g>
        )}
        {who === "inspektor" && (
          <g>
            <path d="M-116,-330 C-118,-380 -104,-410 -92,-418 L-88,-360 Z M116,-330 C118,-380 104,-410 92,-418 L88,-360 Z" fill={L.hair} />
            <path d="M-60,-460 Q0,-478 60,-460" stroke="#fff" strokeWidth={8} opacity={0.35} fill="none" />
            {/* overskæg */}
            <path d="M-46,-272 Q-24,-290 0,-280 Q24,-290 46,-272 Q24,-262 0,-270 Q-24,-262 -46,-272 Z" fill="#5a4636" />
            {/* firkantede briller */}
            {[-1, 1].map((k) => (
              <rect key={k} x={k * 42 - 32} y={-366} width={64} height={42} rx={8} fill="#fff" fillOpacity={0.08} stroke="#1a1a1e" strokeWidth={6} />
            ))}
            <path d="M-10,-348 L10,-348" stroke="#1a1a1e" strokeWidth={6} />
          </g>
        )}
      </g>
    </g>
  );
};

/** Lille figur i hel krop (silhuet-agtig vektor) til totaler: (x,y)=fødder */
export const Kid: React.FC<{ x: number; y: number; h: number; t: number; color?: string; run?: number; flip?: boolean }> = ({ x, y, h, t, color = "#2c4a7a", run = 0, flip = false }) => {
  const s = h / 100;
  const sw = Math.sin(t * 12) * 22 * run;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <ellipse cx={0} cy={0} rx={16} ry={2.5} fill="#000" opacity={0.3} />
      <g transform={`rotate(${sw},0,-42)`}>
        <rect x={-8} y={-42} width={7} height={40} rx={3} fill="#1d2330" />
        <rect x={-10} y={-4} width={11} height={5} rx={2} fill="#eee" />
      </g>
      <g transform={`rotate(${-sw},0,-42)`}>
        <rect x={1} y={-42} width={7} height={40} rx={3} fill="#232a3a" />
        <rect x={0} y={-4} width={11} height={5} rx={2} fill="#eee" />
      </g>
      <rect x={-13} y={-74} width={26} height={36} rx={9} fill={color} />
      <g transform={`rotate(${-sw * 1.2},-11,-70)`}>
        <rect x={-17} y={-72} width={7} height={30} rx={3.5} fill={color} />
      </g>
      <g transform={`rotate(${sw * 1.2},11,-70)`}>
        <rect x={10} y={-72} width={7} height={30} rx={3.5} fill={color} />
      </g>
      <circle cx={0} cy={-86} r={11} fill="#c88d63" />
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={-9 + (i % 5) * 4.5} cy={-95 + Math.floor(i / 5) * 4} r={4.2} fill="#17110d" />
      ))}
    </g>
  );
};
