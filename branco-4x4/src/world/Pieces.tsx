import React from "react";
import { random } from "remotion";
import { clamp, easeOut, lerp } from "../lib";

/** Sæt-stykker i skærm-rum omkring Branco (han står i x≈160–920, y≈880–1920; tekst i y≈230–600). */
export const ap = (t: number, a: number | undefined, d = 0.3) => (a === undefined ? 0 : easeOut((t - a) / d));
export const win = (t: number, a: number, b: number, fi = 0.3, fo = 0.4) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));

/* ---------- boxy 4x4 forfra ---------- */
export const SUV: React.FC<{ x: number; y: number; s: number; lights?: number; open?: number }> = ({ x, y, s, lights = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={360} ry={30} fill="#000" opacity={0.7} />
    {/* hjul */}
    {[-250, 250].map((wx) => (
      <rect key={wx} x={wx - 50} y={-110} width={100} height={110} rx={22} fill="#08060c" />
    ))}
    {/* karrosseri */}
    <path d="M-300,-120 L-300,-330 L-270,-350 L270,-350 L300,-330 L300,-120Z" fill="#14121a" />
    <path d="M-300,-330 L300,-330" stroke="#3a3446" strokeWidth={4} />
    {/* forrude */}
    <path d="M-250,-350 L-230,-520 L230,-520 L250,-350Z" fill="#1c2238" />
    <path d="M-230,-520 L230,-520" stroke="#2a2836" strokeWidth={14} />
    <path d="M-200,-500 L-120,-370 L-80,-370 L-160,-500Z" fill="#fff" opacity={0.08} />
    {/* tagbøjle med lysbjælke */}
    <rect x={-210} y={-560} width={420} height={26} rx={8} fill="#0c0a10" />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-196 + i * 50} y={-554} width={40} height={14} rx={4} fill="#fff6dc" opacity={lights} />
    ))}
    {/* grill med lodrette lameller */}
    <rect x={-150} y={-300} width={300} height={130} rx={10} fill="#0a080e" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-136 + i * 32} y={-290} width={14} height={110} rx={4} fill="#2a2632" />
    ))}
    {/* runde forlygter + blink */}
    {[-225, 225].map((lx) => (
      <g key={lx}>
        <circle cx={lx} cy={-240} r={52} fill="#2a2632" />
        <circle cx={lx} cy={-240} r={42} fill="#fff8e0" opacity={0.4 + lights * 0.6} />
        <circle cx={lx} cy={-240} r={18} fill="#fff" />
        <circle cx={lx} cy={-240} r={170} fill="url(#rHot)" opacity={0.55 * lights} />
        <rect x={lx - 28} y={-176} width={56} height={18} rx={6} fill="#ffb347" />
      </g>
    ))}
    {/* kofanger + spil */}
    <rect x={-320} y={-160} width={640} height={50} rx={10} fill="#0c0a10" />
    <rect x={-60} y={-150} width={120} height={30} rx={6} fill="#2a2632" />
    {/* dørene slår op (sidekanter lyser) */}
    {open > 0 && (
      <g opacity={open}>
        <path d={`M-300,-330 L${-300 - open * 90},-360 L${-300 - open * 90},-120 L-300,-120Z`} fill="#1c1a24" stroke="#ff3dc8" strokeWidth={3} />
        <path d={`M300,-330 L${300 + open * 90},-360 L${300 + open * 90},-120 L300,-120Z`} fill="#1c1a24" stroke="#3de0ff" strokeWidth={3} />
      </g>
    )}
  </g>
);

/* ---------- hættefigur (anonym) med neon-kant; back = vender ryggen til (trøjenummer) ---------- */
export const Hood: React.FC<{ x: number; y: number; s: number; rim: string; back?: number; num?: string; op?: number }> = ({ x, y, s, rim, back = 0, num = "9", op = 1 }) => {
  const body = "M-70,0 L-80,-300 C-80,-360 -60,-390 -40,-400 C-46,-470 -30,-520 0,-524 C30,-520 46,-470 40,-400 C60,-390 80,-360 80,-300 L70,0Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      <path d={body} fill={rim} transform="translate(-3,0)" />
      <path d={body} fill={rim} transform="translate(3,0)" opacity={0.6} />
      <path d={body} fill="#07050c" />
      <path d="M-30,-470 C-28,-500 28,-500 30,-470 C28,-440 -28,-440 -30,-470Z" fill={back > 0.5 ? "#0e0a14" : "#000"} />
      {back > 0.02 && (
        <g opacity={back}>
          <text x={0} y={-190} textAnchor="middle" fontFamily="Anton" fontSize={170} fill="#f4f1ea">{num}</text>
          <text x={0} y={-320} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#f4f1ea" letterSpacing={4}>BROR</text>
        </g>
      )}
    </g>
  );
};

/* ---------- kamerablitz ("skud") ---------- */
export const Flashes: React.FC<{ t: number; t0: number; n: number; dur: number }> = ({ t, t0, n, dur }) => {
  const els: React.ReactNode[] = [];
  let count = 0;
  for (let i = 0; i < n; i++) {
    const ft = t0 + (dur * i) / n;
    if (t < ft) continue;
    count++;
    const k = t - ft;
    if (k > 0.35) continue;
    const x = 120 + random(`fx${i}`) * 840;
    const y = 620 + random(`fy${i}`) * 520;
    const a = 1 - k / 0.35;
    els.push(
      <g key={i} opacity={a}>
        <circle cx={x} cy={y} r={220} fill="url(#rHot)" />
        <path d={`M${x - 120},${y} L${x + 120},${y} M${x},${y - 120} L${x},${y + 120}`} stroke="#fff" strokeWidth={4} />
        <circle cx={x} cy={y} r={22} fill="#fff" />
      </g>,
    );
  }
  return (
    <g>
      {els}
      {count > 0 && t < t0 + dur + 0.8 && (
        <text x={980} y={1040} textAnchor="end" fontFamily="SpaceMonoB" fontSize={64} fill="#fff" opacity={0.85}>{String(count).padStart(2, "0")}/15</text>
      )}
    </g>
  );
};

/* ---------- neon-tal/skilt ---------- */
export const NeonText: React.FC<{ txt: string; x: number; y: number; size: number; color: string; on: number; font?: string }> = ({ txt, x, y, size, color, on, font = "Anton" }) => (
  <g opacity={0.15 + on * 0.85} filter="url(#nGlow)">
    <text x={x} y={y} textAnchor="middle" fontFamily={font} fontStyle={font === "Playfair" ? "italic" : undefined} fontSize={size} fill="none" stroke={color} strokeWidth={size / 28}>{txt}</text>
    <text x={x} y={y} textAnchor="middle" fontFamily={font} fontStyle={font === "Playfair" ? "italic" : undefined} fontSize={size} fill="#fff" opacity={on * 0.25}>{txt}</text>
  </g>
);

/* ---------- skakkonge i neon ---------- */
export const King: React.FC<{ x: number; y: number; s: number; color: string; on: number }> = ({ x, y, s, color, on }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={0.2 + on * 0.8} filter="url(#nGlow)">
    <path d="M-60,0 L60,0 L50,-30 L-50,-30Z M-40,-30 L-30,-140 L30,-140 L40,-30Z M-50,-140 L50,-140 L44,-170 L-44,-170Z M-30,-170 Q-50,-230 0,-240 Q50,-230 30,-170Z M-6,-240 L6,-240 L6,-290 L-6,-290Z M-24,-270 L24,-270 L24,-258 L-24,-258Z" fill="none" stroke={color} strokeWidth={6} />
  </g>
);

/* ---------- vindue med familie-silhuetter + polaroids ---------- */
export const FamilyWindow: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <g transform={`translate(${x},${y})`} opacity={on}>
    <rect x={-150} y={-180} width={300} height={360} fill="#1a0e22" />
    <rect x={-136} y={-166} width={272} height={332} fill="#ffcf86" />
    <rect x={-136} y={-166} width={272} height={332} fill="url(#rWarm)" />
    <rect x={-4} y={-166} width={8} height={332} fill="#1a0e22" />
    <rect x={-136} y={-30} width={272} height={8} fill="#1a0e22" />
    {/* mor + to børn */}
    <ellipse cx={-60} cy={-10} rx={26} ry={30} fill="#3a1a10" />
    <path d="M-110,166 Q-110,30 -60,24 Q-10,30 -10,166Z" fill="#3a1a10" />
    <path d="M-88,-30 Q-60,-70 -32,-30 L-26,30 L-94,30Z" fill="#3a1a10" />
    <ellipse cx={30} cy={60} rx={18} ry={20} fill="#3a1a10" />
    <path d="M0,166 Q0,90 30,86 Q60,90 60,166Z" fill="#3a1a10" />
    <ellipse cx={90} cy={80} rx={15} ry={17} fill="#3a1a10" />
    <path d="M66,166 Q66,104 90,100 Q114,104 114,166Z" fill="#3a1a10" />
    <circle cx={0} cy={0} r={300} fill="url(#rWarm)" opacity={0.5} />
  </g>
);
export const Polaroids: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => {
      const k = t - t0 - i * 0.12;
      if (k < 0) return null;
      const x = 140 + (i % 3) * 400 + Math.sin(k + i) * 30 + (i > 2 ? 200 : 0) - 100;
      const y = 1150 - k * 220 - (i > 2 ? 200 : 0);
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${-14 + i * 7 + Math.sin(k * 2 + i) * 6})`} opacity={clamp(k * 3) * clamp(2.5 - k)}>
          <rect x={-70} y={-80} width={140} height={160} fill="#f4f1ea" />
          <rect x={-60} y={-70} width={120} height={110} fill={["#c9a46a", "#8aa0b8", "#d8a080", "#a87ab8", "#7ab8a0", "#d8c070"][i]} />
          <ellipse cx={-14} cy={-24} rx={14} ry={16} fill="#2a1a12" />
          <ellipse cx={20} cy={-20} rx={12} ry={14} fill="#1a0e08" />
          <path d="M-40,40 Q-14,-10 6,40Z M0,40 Q20,0 44,40Z" fill="#2a1a12" />
        </g>
      );
    })}
  </g>
);

/* ---------- øjne i mørket ---------- */
export const Eyes: React.FC<{ t: number; on: number; color: string }> = ({ t, on, color }) => (
  <g opacity={on}>
    <rect x={0} y={0} width={1080} height={1920} fill="#000" opacity={0.55} />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 80 + random(`ex${i}`) * 920;
      const y = 640 + random(`ey${i}`) * 560;
      const s = 0.6 + random(`es${i}`) * 0.9;
      const bl = Math.sin(t * 3 + i * 2.1) > 0.97 ? 0.1 : 1;
      return (
        <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={clamp((on - random(`eo${i}`) * 0.5) * 2)}>
          {[-26, 26].map((dx) => (
            <g key={dx}>
              <ellipse cx={dx} cy={0} rx={16} ry={7 * bl} fill={color} />
              <ellipse cx={dx} cy={0} rx={5} ry={6 * bl} fill="#000" />
              <ellipse cx={dx} cy={0} rx={60} ry={30} fill={color} opacity={0.15} />
            </g>
          ))}
        </g>
      );
    })}
  </g>
);

/* ---------- talebobler der splintres ---------- */
export const Bubbles: React.FC<{ t: number; t0: number; shatter: number }> = ({ t, t0, shatter }) => {
  const txts = ["bla bla", "hva så?", "han er færdig", "snak snak", "ha ha", "?!"];
  return (
    <g>
      {txts.map((tx, i) => {
        const k = t - t0 - i * 0.12;
        if (k < 0) return null;
        const x = 160 + (i % 2) * 760 + (i > 3 ? (i - 3) * 80 : 0);
        const y = 680 + Math.floor(i / 2) * 170;
        const sh = Math.max(0, t - shatter);
        const pop = Math.min(1, k * 6);
        if (sh > 0.6) return null;
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${pop})`} opacity={1 - sh / 0.6}>
            {sh > 0
              ? Array.from({ length: 6 }).map((_, j) => (
                  <rect key={j} x={-90 + j * 30 + sh * (j - 2.5) * 260} y={-34 + sh * sh * 600 * (0.5 + random(`b${i}${j}`))} width={34} height={60} fill="#f4f1ea" transform={`rotate(${sh * 400 * (random(`r${i}${j}`) - 0.5)})`} />
                ))
              : (
                <g>
                  <rect x={-tx.length * 13 - 26} y={-38} width={tx.length * 26 + 52} height={76} rx={36} fill="#f4f1ea" opacity={0.92} />
                  <path d="M-10,36 L10,36 L-14,64Z" fill="#f4f1ea" opacity={0.92} />
                  <text x={0} y={12} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={38} fill="#1a1020">{tx}</text>
                </g>
              )}
          </g>
        );
      })}
    </g>
  );
};

/* ---------- vejskilt + tom gynge ---------- */
export const Corner: React.FC<{ t: number; on: number }> = ({ t, on }) => (
  <g opacity={on}>
    <g transform="translate(150,1000)">
      <rect x={-6} y={-380} width={12} height={480} fill="#2a2e38" />
      <rect x={-10} y={-400} width={250} height={64} rx={6} fill="#1a5a3a" stroke="#f4f1ea" strokeWidth={4} />
      <text x={115} y={-354} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#f4f1ea" letterSpacing={3}>HJØRNET</text>
    </g>
    <g transform="translate(900,820)">
      <path d="M-120,0 L-90,320 M120,0 L90,320 M-130,0 L130,0" stroke="#3a3e4a" strokeWidth={10} />
      <g transform={`rotate(${Math.sin(t * 2.2) * 14})`}>
        <line x1={-40} y1={0} x2={-40} y2={220} stroke="#8a8e98" strokeWidth={3} />
        <line x1={40} y1={0} x2={40} y2={220} stroke="#8a8e98" strokeWidth={3} />
        <rect x={-54} y={216} width={108} height={16} rx={4} fill="#2a1a12" />
      </g>
    </g>
  </g>
);

/* ---------- svævende telefon: Mor ringer ---------- */
export const MomPhone: React.FC<{ t: number; on: number; n: number }> = ({ t, on, n }) => (
  <g transform={`translate(${880 + Math.sin(t * 60) * 2 * on},${820}) rotate(8)`} opacity={on}>
    <rect x={-110} y={-220} width={220} height={440} rx={34} fill="#0a0a0d" stroke="#5a5e6a" strokeWidth={3} />
    <rect x={-100} y={-208} width={200} height={416} rx={26} fill="#121a30" />
    <text x={0} y={-150} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={22} fill="#cfd8f0">03:12</text>
    <circle cx={0} cy={-80} r={40} fill="#c86a8a" />
    <text x={0} y={-66} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#fff">M</text>
    <text x={0} y={0} textAnchor="middle" fontFamily="Anton" fontSize={44} fill="#fff">MOR ♥</text>
    <text x={0} y={36} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={18} fill="#ff8a8a">{n} ubesvarede opkald</text>
    <circle cx={-50} cy={140} r={30} fill="#ff3b30" />
    <circle cx={50} cy={140} r={30} fill="#34c759" />
    {[0, 1, 2].map((i) => {
      const k = (t * 1.5 + i / 3) % 1;
      return <rect key={i} x={-110 - k * 50} y={-220 - k * 50} width={220 + k * 100} height={440 + k * 100} rx={40} fill="none" stroke="#7ae8ff" strokeWidth={3} opacity={(1 - k) * 0.7} />;
    })}
  </g>
);

/* ---------- sedler der flyver / brænder ---------- */
export const Bills: React.FC<{ t: number; t0: number; burn?: number; n?: number }> = ({ t, t0, burn = 99, n = 22 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = t - t0 - random(`bd${i}`) * 0.6;
      if (k < 0) return null;
      const x = random(`bx${i}`) * 1080 + Math.sin(k * 2 + i) * 60;
      const y = -100 + ((k * (260 + random(`bs${i}`) * 200) + random(`by${i}`) * 300) % 2100);
      const b = clamp((t - burn - random(`bb${i}`) * 0.4) / 0.8);
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${k * 120 * (random(`br${i}`) - 0.5) + i * 30}) scale(${1 - b * 0.3})`} opacity={1 - b}>
          <rect x={-70} y={-34} width={140} height={68} rx={4} fill={b > 0 ? "#3a2a1a" : "#c8b8e8"} />
          <rect x={-62} y={-26} width={124} height={52} rx={2} fill="none" stroke="#6a5a9a" strokeWidth={2} />
          <text x={0} y={12} textAnchor="middle" fontFamily="Anton" fontSize={30} fill="#5a4a8a">1000</text>
          {b > 0 && <circle r={60} fill="url(#rEmber)" opacity={1 - b} />}
        </g>
      );
    })}
  </g>
);

/* ---------- GPS-kort: vejen hjem ---------- */
export const GPS: React.FC<{ t: number; on: number }> = ({ t, on }) => (
  <g transform="translate(830,800) rotate(-6)" opacity={on}>
    <rect x={-150} y={-120} width={300} height={240} rx={18} fill="#0e1424" stroke="#3de0ff" strokeWidth={3} />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M-140,${-90 + i * 36} L140,${-70 + i * 30}`} stroke="#22304a" strokeWidth={6} />
    ))}
    <path d={`M-110,80 L-40,20 L10,40 L60,-30`} stroke="#3de0ff" strokeWidth={5} fill="none" strokeDasharray="10 8" strokeDashoffset={-t * 40} />
    <circle cx={60} cy={-30} r={10} fill="#ff3dc8" />
    <text x={0} y={-82} textAnchor="middle" fontFamily="Anton" fontSize={28} fill="#fff">VEJEN HJEM</text>
    <text x={0} y={104} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={17} fill={Math.floor(t * 3) % 2 ? "#ff6a6a" : "#ffb0b0"}>rute ikke fundet</text>
  </g>
);

/* ---------- konvolut med husleje ---------- */
export const Rent: React.FC<{ on: number; open: number }> = ({ on, open }) => (
  <g transform="translate(860,860) rotate(7)" opacity={on}>
    <rect x={-150} y={-90} width={300} height={190} rx={8} fill="#efe6d2" />
    <path d={`M-150,-90 L0,${10 - open * 160} L150,-90`} fill="#e2d6be" stroke="#c8b898" strokeWidth={2} />
    {open > 0 && [0, 1, 2].map((i) => (
      <rect key={i} x={-110 + i * 10} y={-90 - open * (70 + i * 16)} width={220} height={90} rx={4} fill="#c8b8e8" stroke="#6a5a9a" strokeWidth={2} />
    ))}
    <text x={0} y={70} textAnchor="middle" fontFamily="Anton" fontSize={36} fill="#3a2a1a" letterSpacing={4}>HUSLEJE</text>
    <text x={0} y={92} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={18} fill="#6a5a4a">til mama</text>
  </g>
);

/* ---------- neon-hjerte ---------- */
export const Heart: React.FC<{ x: number; y: number; s: number; on: number; broken?: number; color: string }> = ({ x, y, s, on, broken = 0, color }) => {
  const d = "M0,90 C-120,10 -150,-80 -80,-110 C-40,-126 -10,-100 0,-80 C10,-100 40,-126 80,-110 C150,-80 120,10 0,90Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} filter="url(#nGlow)" opacity={0.15 + on * 0.85}>
      {broken > 0 ? (
        <g>
          <g transform={`translate(${-broken * 30},${broken * 40}) rotate(${-broken * 12})`}>
            <path d={d} fill="none" stroke={color} strokeWidth={8} clipPath="url(#hL)" />
          </g>
          <g transform={`translate(${broken * 30},${broken * 60}) rotate(${broken * 16})`}>
            <path d={d} fill="none" stroke={color} strokeWidth={8} clipPath="url(#hR)" opacity={0.6} />
          </g>
          <clipPath id="hL"><path d="M-200,-200 L4,-200 L-10,-80 L14,-20 L-6,40 L4,200 L-200,200Z" /></clipPath>
          <clipPath id="hR"><path d="M200,-200 L4,-200 L-10,-80 L14,-20 L-6,40 L4,200 L200,200Z" /></clipPath>
        </g>
      ) : (
        <path d={d} fill="none" stroke={color} strokeWidth={8} />
      )}
    </g>
  );
};

/* ---------- højhus hvor vinduerne slukker ---------- */
export const Block: React.FC<{ t: number; t0: number; on: number }> = ({ t, t0, on }) => (
  <g transform="translate(860,1000)" opacity={on}>
    <rect x={-150} y={-560} width={300} height={600} fill="#121826" />
    {Array.from({ length: 10 }).map((_, r) =>
      Array.from({ length: 5 }).map((__, c) => {
        const i = r * 5 + c;
        const off = t > t0 + random(`bo${i}`) * 1.4;
        return <rect key={i} x={-130 + c * 54} y={-540 + r * 56} width={34} height={36} fill={off ? "#1c2234" : "#ffcf86"} opacity={off ? 1 : 0.85} />;
      }),
    )}
  </g>
);

export const lerpN = lerp;
