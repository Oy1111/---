import React from "react";

/**
 * Semi-realistiske anonyme mennesker (3/4 forfra, ansigt mod højre). Fødder i (0,0), højde ~236.
 * Tøj med skygge/højlys, ansigt med øjne/næse/mund, hår/kasket/hætte, hænder, sneakers og slagskygge.
 * Aldrig kunstneren – kun anonyme personer.
 */
export type PPose = "stand" | "phone" | "talk" | "smoke" | "crossed" | "walk" | "sit" | "dap" | "shake" | "bags" | "lean";
export type Look = {
  skin: string;
  top: string; // trøje/jakke farve
  topKind: "hoodie" | "puffer" | "jacket" | "tee";
  pants: string;
  pantsKind: "jeans" | "track";
  shoes: string;
  hair: "fade" | "cap" | "hood" | "curly" | "long";
  hairC?: string;
  cap?: string;
  beard?: boolean;
};

type P = [number, number];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
export const capsule = (a: P, b: P, r1: number, r2: number) => {
  const [dx, dy] = sub(b, a);
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return `M${a[0] + nx * r1},${a[1] + ny * r1} L${b[0] + nx * r2},${b[1] + ny * r2} A${r2},${r2} 0 0 1 ${b[0] - nx * r2},${b[1] - ny * r2} L${a[0] - nx * r1},${a[1] - ny * r1} A${r1},${r1} 0 0 1 ${a[0] + nx * r1},${a[1] + ny * r1}Z`;
};
const lerpP = (a: P, b: P, k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

const hexMix = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k))));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

type Joints = { sh: [P, P]; el: [P, P]; wr: [P, P]; hip: [P, P]; kn: [P, P]; an: [P, P] };
export const joints = (pose: PPose, t = 0, k = 0): Joints => {
  const breath = Math.sin(t * 1.8) * 0.8;
  const J: Joints = {
    sh: [[-30, -188 + breath], [30, -188 + breath]],
    el: [[-40, -142], [40, -142]],
    wr: [[-42, -98], [42, -98]],
    hip: [[-15, -112], [15, -112]],
    kn: [[-17, -58], [17, -58]],
    an: [[-19, -12], [19, -12]],
  };
  const sw = Math.sin(t * 7);
  switch (pose) {
    case "phone": J.el[1] = [50, -150]; J.wr[1] = [20, -212]; break;
    case "talk": J.el[1] = [54, -148]; J.wr[1] = [78 + Math.sin(t * 5) * 8, -168 + Math.cos(t * 4) * 10]; break;
    case "smoke": J.el[1] = [48, -146]; J.wr[1] = lerpP([34, -178], [16, -207], k); J.el[0] = [-46, -146]; J.wr[0] = [-58, -112]; break;
    case "crossed": J.el = [[-38, -140], [38, -140]]; J.wr = [[22, -148], [-22, -146]]; break;
    case "walk":
      J.kn = [[-17 + sw * 10, -58], [17 - sw * 10, -58]];
      J.an = [[-19 + sw * 24, -12], [19 - sw * 24, -12]];
      J.el = [[-40 - sw * 6, -142], [40 + sw * 6, -142]];
      J.wr = [[-42 - sw * 16, -98], [42 + sw * 16, -98]];
      break;
    case "sit":
      J.hip = [[-15, -100], [15, -100]];
      J.kn = [[34, -100], [56, -98]];
      J.an = [[40, -14], [62, -12]];
      J.el = [[-40, -132], [40, -132]];
      J.wr = [[-54, -104], [66, -104]];
      break;
    case "dap": J.el[1] = [62 + k * 16, -158]; J.wr[1] = [84 + k * 44, -160]; break;
    case "shake": J.el[1] = [58 + k * 14, -132]; J.wr[1] = [80 + k * 34, -124]; break;
    case "bags": J.wr = [[-48, -92], [48, -92]]; J.el = [[-42, -140], [42, -140]]; break;
    case "lean": J.el = [[-46, -146], [46, -146]]; J.wr = [[-30, -118], [30, -118]]; break;
  }
  return J;
};

export const Person: React.FC<{
  id: string;
  x: number;
  y: number;
  s?: number;
  pose?: PPose;
  look: Look;
  t?: number;
  k?: number;
  flip?: boolean;
  light?: -1 | 1; // lyskilde i lokal retning (venstre/højre)
  rim?: string;
  shadowLen?: number;
  glowFace?: number; // varm glød i ansigtet (fx joint)
  noLegs?: boolean;
}> = ({ id, x, y, s = 1, pose = "stand", look, t = 0, k = 0, flip = false, light = -1, rim = "#ffc27a", shadowLen = 1, glowFace = 0, noLegs = false }) => {
  const J = joints(pose, t, k);
  const L = flip ? -light : light; // lysside i figurens lokale koordinater
  const shadeId = L < 0 ? "gShadeR" : "gShadeL";
  const top = look.top, dTop = hexMix(top, -0.45), lTop = hexMix(top, 0.25);
  const pant = look.pants, dPant = hexMix(pant, -0.45), lPant = hexMix(pant, 0.22);
  const skin = look.skin, dSkin = hexMix(skin, -0.35), lSkin = hexMix(skin, 0.18);
  const cid = `p-${id}`;
  const wide = look.topKind === "puffer" ? 4 : 0;
  const torso = `M-30,-194 C-18,-199 18,-199 30,-194 C${38 + wide},-191 ${41 + wide},-182 ${40 + wide},-168 L${37 + wide},-130 C${36 + wide},-114 ${34 + wide},-104 28,-100 L-28,-100 C${-34 - wide},-104 ${-36 - wide},-114 ${-37 - wide},-130 L${-40 - wide},-168 C${-41 - wide},-182 ${-38 - wide},-191 -30,-194Z`;
  const head = `M-12,-224 C-13,-235 -5,-238 2,-238 C10,-238 15,-233 15,-225 C15,-217 13,-210 8,-206 C5,-204 0,-204 -3,-206 C-8,-209 -11,-215 -12,-224Z`;
  const limbs = (a: P, b: P, c: P, r1: number, r2: number, r3: number, col: string, dcol: string, lcol: string, key: string) => {
    const d1 = `M${a[0]},${a[1]} L${b[0]},${b[1]}`;
    const d2 = `M${b[0]},${b[1]} L${c[0]},${c[1]}`;
    const off = (r: number, k: number) => `translate(${L * r * k},0)`;
    return (
      <g key={key} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={d1} stroke={col} strokeWidth={r1 * 2} />
        <path d={d2} stroke={col} strokeWidth={r2 * 2} />
        <path d={`M${b[0]},${b[1]} L${b[0]},${b[1]}`} stroke={col} strokeWidth={r2 * 2.05} />
        <g opacity={0.5}>
          <path d={d1} stroke={dcol} strokeWidth={r1 * 0.9} transform={off(r1, -0.5)} />
          <path d={d2} stroke={dcol} strokeWidth={r2 * 0.9} transform={off(r2, -0.5)} />
        </g>
        <g opacity={0.3}>
          <path d={d1} stroke={lcol} strokeWidth={r1 * 0.5} transform={off(r1, 0.5)} />
          <path d={d2} stroke={lcol} strokeWidth={r2 * 0.5} transform={off(r2, 0.5)} />
        </g>
      </g>
    );
  };
  const hand = (p: P, key: string) => (
    <g key={key}>
      <ellipse cx={p[0]} cy={p[1] + 3} rx={6.5} ry={8} fill={skin} />
      <path d={`M${p[0] - 5},${p[1] + 6} q5,6 10,0`} stroke={dSkin} strokeWidth={1.4} fill="none" />
      <ellipse cx={p[0] - L * 2} cy={p[1] + 1} rx={3} ry={4.5} fill={lSkin} opacity={0.4} />
    </g>
  );
  const shoe = (p: P, key: string) => (
    <g key={key}>
      <path d={`M${p[0] - 10},${p[1] - 2} C${p[0] - 10},${p[1] - 12} ${p[0] + 4},${p[1] - 12} ${p[0] + 8},${p[1] - 6} C${p[0] + 18},${p[1] - 4} ${p[0] + 22},${p[1] + 2} ${p[0] + 22},${p[1] + 6} L${p[0] - 12},${p[1] + 6}Z`} fill={look.shoes} />
      <rect x={p[0] - 12} y={p[1] + 5} width={35} height={6} rx={3} fill="#f2f0ea" />
      <path d={`M${p[0] - 2},${p[1] - 8} l6,4 M${p[0] + 2},${p[1] - 10} l6,4`} stroke="#ddd" strokeWidth={1.2} />
    </g>
  );
  // hvilken arm er bagerst: venstre (lokal -x) tegnes først
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* slagskygge på jorden, væk fra lyset */}
      <ellipse cx={0} cy={2} rx={44} ry={8} fill="#000" opacity={0.6} />
      <ellipse cx={-L * 70 * shadowLen} cy={6} rx={80 * shadowLen} ry={10} fill="#000" opacity={0.35} filter="url(#fBlur6)" />
      <defs>
        <clipPath id={`${cid}-torso`}><path d={torso} /></clipPath>
        <clipPath id={`${cid}-head`}><path d={head} /></clipPath>
      </defs>
      {/* bageste arm */}
      {limbs(J.sh[0], J.el[0], J.wr[0], 10.5, 8.5, 7, look.topKind === "tee" ? skin : dTop, hexMix(dTop, -0.4), top, "armB")}
      {hand(J.wr[0], "hB")}
      {/* ben */}
      {!noLegs && (
        <g>
          {limbs(J.hip[0], J.kn[0], J.an[0], 15, 11, 8.5, hexMix(pant, -0.15), dPant, lPant, "legB")}
          {limbs(J.hip[1], J.kn[1], J.an[1], 15, 11, 8.5, pant, dPant, lPant, "legF")}
          {look.pantsKind === "track" && (
            <g stroke="#e8e6e0" strokeWidth={2.2} opacity={0.85}>
              <line x1={J.hip[1][0] + 13} y1={J.hip[1][1]} x2={J.an[1][0] + 8} y2={J.an[1][1]} />
            </g>
          )}
          {look.pantsKind === "jeans" && <path d={`M${J.kn[1][0] - 6},${J.kn[1][1]} q6,3 12,0`} stroke={lPant} strokeWidth={1.5} fill="none" opacity={0.6} />}
          {shoe(J.an[0], "sB")}
          {shoe(J.an[1], "sF")}
        </g>
      )}
      {/* hals */}
      <rect x={-8} y={-210} width={17} height={22} fill={dSkin} />
      {/* overkrop */}
      <path d={torso} fill={top} />
      <g clipPath={`url(#${cid}-torso)`}>
        <rect x={-50} y={-200} width={100} height={110} fill={`url(#${shadeId})`} />
        {look.topKind === "puffer" &&
          Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <path d={`M-46,${-180 + i * 15} Q0,${-174 + i * 15} 46,${-180 + i * 15}`} stroke={dTop} strokeWidth={2.4} fill="none" />
              <path d={`M-40,${-175 + i * 15} Q0,${-170 + i * 15} 40,${-175 + i * 15}`} stroke={lTop} strokeWidth={2} fill="none" opacity={0.45} />
            </g>
          ))}
        {look.topKind === "hoodie" && (
          <g>
            <path d="M-22,-138 L22,-138 L26,-112 L-26,-112Z" fill={dTop} opacity={0.5} />
            <path d="M-22,-138 L22,-138" stroke={lTop} strokeWidth={1.5} opacity={0.5} />
            <path d="M-5,-188 L-7,-150 M5,-188 L7,-152" stroke="#e8e2d6" strokeWidth={1.8} />
            <rect x={-46} y={-110} width={92} height={10} fill={dTop} opacity={0.6} />
          </g>
        )}
        {look.topKind === "jacket" && (
          <g>
            <path d="M0,-192 L0,-101" stroke={dTop} strokeWidth={2.5} />
            <path d="M-12,-194 L0,-176 L12,-194" stroke={lTop} strokeWidth={3} fill="none" />
            <rect x={-34} y={-130} width={22} height={4} fill={dTop} />
            <rect x={12} y={-130} width={22} height={4} fill={dTop} />
          </g>
        )}
        {look.topKind === "puffer" && <path d="M0,-196 L0,-101" stroke="#1a1a1a" strokeWidth={2} />}
        {/* rim-lys langs lyssiden */}
        <path d={torso} fill="none" stroke={rim} strokeWidth={2.4} opacity={0.3} transform={`translate(${L * 1.5},0)`} />
      </g>
      {look.topKind === "hoodie" && look.hair !== "hood" && <path d="M-22,-196 C-26,-206 26,-206 22,-196 C14,-190 -14,-190 -22,-196Z" fill={dTop} />}
      {look.topKind === "puffer" && <path d="M-18,-200 L18,-200 L20,-188 L-20,-188Z" fill={hexMix(top, -0.2)} />}
      {/* hoved */}
      {look.hair === "hood" && <path d="M-19,-224 C-22,-246 4,-252 14,-246 C24,-240 24,-222 20,-206 L22,-194 L-24,-192 C-22,-204 -20,-212 -19,-224Z" fill={dTop} />}
      <path d={head} fill={skin} />
      <g clipPath={`url(#${cid}-head)`}>
        <rect x={-16} y={-240} width={34} height={40} fill={`url(#${shadeId})`} />
        <ellipse cx={4} cy={-206} rx={12} ry={4} fill={dSkin} opacity={0.5} />
        {glowFace > 0 && <ellipse cx={14} cy={-212} rx={16} ry={14} fill="#ff8a3a" opacity={glowFace * 0.55} />}
      </g>
      {/* øre */}
      <ellipse cx={-10} cy={-222} rx={3} ry={5} fill={dSkin} />
      {/* øjne, bryn, næse, mund */}
      <ellipse cx={9.5} cy={-224} rx={2.3} ry={1.3} fill="#140a06" />
      <ellipse cx={1} cy={-224} rx={2} ry={1.2} fill="#140a06" />
      <circle cx={10.2} cy={-224.4} r={0.6} fill="#fff" opacity={0.8} />
      <path d="M6,-228.5 L12.5,-228 M-2,-228.4 L3.5,-228.6" stroke={hexMix(look.hairC ?? "#1a120c", 0)} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M12,-224 L14.5,-217.5 L11.5,-216.5" stroke={dSkin} strokeWidth={1.3} fill="none" />
      <path d="M5,-211.5 Q8.5,-210.5 11,-211.8" stroke="#3a1a12" strokeWidth={1.3} fill="none" />
      {look.beard && <path d="M-10,-216 C-8,-206 -2,-203 4,-203 C10,-203 13,-208 14,-212 C12,-209 8,-208.5 5,-209 C2,-209 -3,-210 -10,-216Z" fill={look.hairC ?? "#1a120c"} opacity={0.85} />}
      {/* hår / kasket */}
      {look.hair === "fade" && (
        <g>
          <path d="M-13,-225 C-14,-238 0,-241 6,-240 C12,-239 16,-234 15,-228 C10,-232 0,-234 -6,-230 C-9,-228 -11,-226 -13,-225Z" fill={look.hairC ?? "#120c08"} />
          <path d="M-13,-225 C-12,-219 -11,-216 -10,-214" stroke={look.hairC ?? "#120c08"} strokeWidth={2} opacity={0.5} />
        </g>
      )}
      {look.hair === "curly" &&
        [[-8, -236], [-2, -239], [5, -239], [11, -236], [-11, -230], [14, -231], [-12, -224]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={5} fill={look.hairC ?? "#120c08"} />)}
      {look.hair === "long" && <path d="M-14,-226 C-16,-242 14,-244 16,-228 C12,-234 0,-235 -6,-231 L-10,-196 L-16,-198Z" fill={look.hairC ?? "#2a1a10"} />}
      {look.hair === "cap" && (
        <g>
          <path d="M-14,-226 C-15,-240 12,-243 16,-230 L16,-227 L-14,-224Z" fill={look.cap ?? "#1a1a22"} />
          <path d="M8,-228 L28,-226 C28,-223 20,-222 12,-224Z" fill={hexMix(look.cap ?? "#1a1a22", -0.3)} />
          <path d="M-12,-234 C-4,-240 8,-240 14,-232" stroke={hexMix(look.cap ?? "#1a1a22", 0.3)} strokeWidth={1.5} fill="none" opacity={0.6} />
        </g>
      )}
      {look.hair === "hood" && <path d="M-19,-224 C-20,-238 2,-246 14,-240 C6,-242 -6,-240 -12,-230 L-14,-206 L-20,-200Z" fill={hexMix(look.top, -0.25)} />}
      {/* forreste arm */}
      {limbs(J.sh[1], J.el[1], J.wr[1], 10.5, 8.5, 7, look.topKind === "tee" ? skin : top, dTop, lTop, "armF")}
      {hand(J.wr[1], "hF")}
    </g>
  );
};

export const LOOKS: Record<string, Look> = {
  smoker: { skin: "#8a5a3e", top: "#2a2e3a", topKind: "hoodie", pants: "#1a1a20", pantsKind: "track", shoes: "#111", hair: "fade", beard: true },
  q1: { skin: "#c48c66", top: "#7a2a2a", topKind: "puffer", pants: "#2a3a5a", pantsKind: "jeans", shoes: "#eee", hair: "long", hairC: "#2a1608" },
  q2: { skin: "#5a3a28", top: "#3a4a3a", topKind: "jacket", pants: "#18181e", pantsKind: "track", shoes: "#222", hair: "cap", cap: "#0d0d12" },
  bouncer: { skin: "#4a3022", top: "#0e0e12", topKind: "puffer", pants: "#121216", pantsKind: "jeans", shoes: "#0a0a0a", hair: "fade", beard: true },
  g1: { skin: "#7a4e34", top: "#c9a46a", topKind: "puffer", pants: "#1a1a20", pantsKind: "track", shoes: "#eee", hair: "cap", cap: "#1a2a4a" },
  g2: { skin: "#d2a07a", top: "#2a3a5a", topKind: "hoodie", pants: "#3a3a40", pantsKind: "jeans", shoes: "#eee", hair: "curly", hairC: "#1a0e06" },
  g3: { skin: "#5c3a26", top: "#141418", topKind: "hoodie", pants: "#141418", pantsKind: "track", shoes: "#c22a2a", hair: "hood" },
  g4: { skin: "#9a6a4a", top: "#6a6a70", topKind: "jacket", pants: "#2a3a5a", pantsKind: "jeans", shoes: "#111", hair: "fade", beard: true },
  g5: { skin: "#c8946e", top: "#e8e2d2", topKind: "puffer", pants: "#1a1a20", pantsKind: "jeans", shoes: "#111", hair: "long", hairC: "#3a2210" },
  g6: { skin: "#6a4430", top: "#3a2418", topKind: "jacket", pants: "#121216", pantsKind: "track", shoes: "#eee", hair: "cap", cap: "#5a1a1a" },
  runner: { skin: "#7a4e34", top: "#1a1a1e", topKind: "puffer", pants: "#121216", pantsKind: "track", shoes: "#eee", hair: "hood" },
  fa: { skin: "#6e4532", top: "#2a2e3a", topKind: "jacket", pants: "#2a3a5a", pantsKind: "jeans", shoes: "#eee", hair: "fade", beard: true },
  fb: { skin: "#8a5a40", top: "#5a2a1a", topKind: "puffer", pants: "#18181e", pantsKind: "track", shoes: "#111", hair: "cap", cap: "#111" },
  sitter: { skin: "#7a4e34", top: "#2a3a5a", topKind: "hoodie", pants: "#1a1a20", pantsKind: "jeans", shoes: "#eee", hair: "hood" },
};
