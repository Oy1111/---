import React from "react";

/**
 * Anonyme silhuet-figurer (aldrig kunstneren). Fødder i (0,0), højde ~230.
 * Lyskant kun på den ydre kontur: krop i rim-farve, samme krop forskudt i næsten-sort ovenpå, klippet til kroppen.
 */
export type Pose = "stand" | "smoke" | "talk" | "phone" | "dap" | "shake" | "walk" | "sit" | "bags" | "lean" | "arms";

const limb = (x1: number, y1: number, x2: number, y2: number, w1: number, w2: number) => {
  const dx = x2 - x1, dy = y2 - y1;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return `M${x1 + nx * w1},${y1 + ny * w1} L${x2 + nx * w2},${y2 + ny * w2} Q${x2 + dx / L * w2 * 1.2},${y2 + dy / L * w2 * 1.2} ${x2 - nx * w2},${y2 - ny * w2} L${x1 - nx * w1},${y1 - ny * w1}Z `;
};

export const bodyParts = (pose: Pose, t = 0, k = 0): string[] => {
  const P: string[] = [];
  const hx = pose === "smoke" ? -3 : 0;
  // hætte (én afrundet form) + skulderfald
  P.push(`M${hx - 24},-200 C${hx - 27},-243 ${hx + 27},-243 ${hx + 24},-200 C${hx + 23},-182 ${hx + 12},-176 ${hx},-176 C${hx - 12},-176 ${hx - 23},-182 ${hx - 24},-200Z`);
  P.push(`M-14,-184 L14,-184 L16,-170 L-16,-170Z`);
  // hættetrøje: skrå skuldre, lidt posende ved hoften
  P.push(`M-40,-168 C-36,-180 -22,-184 0,-184 C22,-184 36,-180 40,-168 L44,-112 C46,-100 40,-94 30,-93 L-30,-93 C-40,-94 -46,-100 -44,-112Z`);
  if (pose === "sit") {
    P.push(limb(-22, -100, 40, -98, 15, 13), limb(40, -98, 44, -12, 12, 9), limb(8, -100, 58, -100, 15, 13), limb(58, -100, 62, -12, 12, 9));
    P.push(`M34,-14 C34,-22 64,-22 66,-6 L66,0 L32,0Z`, `M52,-14 C52,-22 82,-22 84,-6 L84,0 L50,0Z`);
  } else {
    const sw = pose === "walk" ? Math.sin(t * 7) * 18 : 0;
    P.push(limb(-17, -102, -19 + sw, -10, 16, 10), limb(17, -102, 19 - sw, -10, 16, 10));
    P.push(`M${-34 + sw},-12 C${-34 + sw},-22 ${-8 + sw},-22 ${-4 + sw},-8 L${-4 + sw},0 L${-36 + sw},0Z`);
    P.push(`M${4 - sw},-12 C${4 - sw},-22 ${30 - sw},-22 ${36 - sw},-8 L${36 - sw},0 L${4 - sw},0Z`);
  }
  const arm = (sx: number, ex: number, ey: number, hx2: number, hy2: number) => {
    P.push(limb(sx, -170, ex, ey, 11, 9), limb(ex, ey, hx2, hy2, 9, 7));
    P.push(`M${hx2 - 8},${hy2} a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0Z`);
  };
  const sw2 = pose === "walk" ? Math.sin(t * 7) * 14 : 0;
  switch (pose) {
    case "smoke": arm(34, 50, -124, 10, -188); arm(-34, -54, -118, -72, -106); break;
    case "talk": arm(34, 58, -128, 84 + Math.sin(t * 5) * 8, -160 + Math.cos(t * 4) * 10); arm(-34, -44, -128, -44, -90); break;
    case "phone": arm(34, 52, -126, 22, -200); arm(-34, -44, -128, -44, -90); break;
    case "dap": arm(34, 64 + k * 30, -148, 96 + k * 54, -150); arm(-34, -44, -128, -44, -90); break;
    case "shake": arm(34, 62 + k * 24, -128, 92 + k * 40, -122); arm(-34, -44, -128, -44, -90); break;
    case "bags": arm(34, 44, -128, 48, -86); arm(-34, -44, -128, -48, -86); break;
    case "lean": arm(34, 54, -126, 30, -112); arm(-34, -54, -126, -30, -112); break;
    case "arms": arm(34, 56, -220, 64, -276); arm(-34, -56, -220, -64, -276); break;
    case "sit": arm(34, 46, -126, 70, -108); arm(-34, -46, -126, -66, -100); break;
    default: arm(34, 44 + sw2 * 0.3, -128, 44 + sw2, -88); arm(-34, -44 - sw2 * 0.3, -128, -44 - sw2, -88);
  }
  return P;
};
export const bodyPath = (pose: Pose, t = 0, k = 0) => bodyParts(pose, t, k).join(" ");

export const Figure: React.FC<{
  id: string;
  x: number;
  y: number;
  s?: number;
  pose?: Pose;
  t?: number;
  k?: number;
  flip?: boolean;
  rim?: string;
  side?: 1 | -1;
  body?: string;
  opacity?: number;
}> = ({ id, x, y, s = 1, pose = "stand", t = 0, k = 0, flip = false, rim = "#ffb45a", side = 1, body = "#07070c", opacity = 1 }) => {
  const parts = bodyParts(pose, t, k);
  const cid = `fig-${id}`;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={opacity}>
      <ellipse cx={0} cy={2} rx={70} ry={12} fill="#000" opacity={0.55} />
      <clipPath id={cid}>
        {parts.map((d, i) => <path key={i} d={d} />)}
      </clipPath>
      {parts.map((d, i) => <path key={i} d={d} fill={rim} />)}
      <g clipPath={`url(#${cid})`}>
        <g transform={`translate(${-side * 4},${2})`}>
          {parts.map((d, i) => <path key={i} d={d} fill={body} />)}
        </g>
      </g>
    </g>
  );
};
