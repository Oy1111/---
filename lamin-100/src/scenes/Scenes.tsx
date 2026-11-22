import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { NatDefs, Street, Facade, Table, Sparkles, Figure } from "../components/Nat";
import { Lamp } from "../components/City";
import { Lamin, LaminDefs } from "../components/Lamin";
import { wordTimes } from "../data/timing";
import { H, W, beatPulse, clamp, easeOut, lerp, smooth } from "../lib";

type SP = { start: number; dur: number; line: number };

/** 0→1 fra tidspunkt a over d sek */
const after = (t: number, a: number | undefined, d = 0.35) => (a === undefined ? 0 : easeOut((t - a) / d));
const first = (line: number, w: string, i = 0) => wordTimes(line, w)[i];
/** spring-pop (overshoot) */
const pop = (t: number, a: number | undefined, d = 0.4) => {
  if (a === undefined) return 0;
  const x = clamp((t - a) / d);
  return x === 0 ? 0 : 1 + Math.sin(x * Math.PI) * 0.25 * (1 - x) - (1 - x) * (1 - x) * (1 - x);
};

const Base: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; bg?: string }> = ({ children, cam, bg }) => (
  <Stage cam={cam} bg={bg}>
    <NatDefs />
    <LaminDefs />
    {children}
  </Stage>
);

/* ---------------- INTRO: gaden, Lamin træder frem ---------------- */
export const Intro: React.FC<SP> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const k = smooth(lt / dur);
  return (
    <Base cam={[lerp(1.0, 1.12, k), 0, lerp(40, -20, k)]}>
      <Street t={t} seed="in" />
      <rect x={0} y={0} width={W} height={H} fill="#000" opacity={0.25} />
      <circle cx={W / 2} cy={1180} r={700} fill="url(#warmPool)" opacity={0.6} />
      <Lamin x={W / 2} y={H + 40} h={lerp(1050, 1150, k)} t={t} opacity={after(lt, 0.4, 1.2)} rim="rimWarm" />
      <g opacity={after(lt, 0.8, 0.6) * (1 - after(lt, dur - 0.5, 0.4))}>
        <text x={W / 2} y={330} textAnchor="middle" fontFamily="Anton" fontSize={150} fill="#f4f1ea" letterSpacing={40} style={{ filter: "drop-shadow(0 8px 14px #000)" }}>LAMIN</text>
        <text x={W / 2} y={470} textAnchor="middle" fontFamily="Anton" fontSize={130} fill="url(#goldText)" style={{ filter: "drop-shadow(0 8px 14px #000)" }}>100%</text>
        <rect x={W / 2 - 160} y={360} width={320 * after(lt, 1.2, 0.8)} height={6} fill="#ff9a3c" />
      </g>
    </Base>
  );
};

/* ---------------- MAGI: høj hat på café-bord, gnister ved hokus / pokus ---------------- */
export const Magi: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const hk = first(line, "hokus");
  const pk = first(line, "pokus");
  const b = Math.max(pop(t, hk, 0.3) > 0 ? Math.exp(-Math.max(0, t - (hk ?? 0)) * 3) : 0, pk !== undefined && t > pk ? Math.exp(-(t - pk) * 2.5) * 1.4 : 0);
  const lift = after(t, pk, 0.5);
  return (
    <Base cam={[lerp(1.05, 1.15, lt / dur), 0, 60]}>
      <Street t={t} seed="mg" lamps={false} shops={["Le Magique", "Tabac"]} />
      <rect width={W} height={H} fill="#000" opacity={0.3} />
      <Table cy={1580} />
      {/* spillekort spredt på bordet */}
      {[-220, -150, 190, 260].map((x, i) => (
        <g key={i} transform={`translate(${W / 2 + x},${1580 + (i % 2) * 40}) rotate(${-30 + i * 22}) scale(1,0.5)`}>
          <rect x={-40} y={-56} width={80} height={112} rx={8} fill="#faf6ee" stroke="#c9bfae" strokeWidth={2} />
          <text x={0} y={18} textAnchor="middle" fontFamily="Anton" fontSize={52} fill={i % 2 ? "#c21d2a" : "#111"}>{["A", "♥", "K", "♠"][i]}</text>
        </g>
      ))}
      {/* tryllestav */}
      <g transform={`translate(${W / 2 + 120},${1600}) rotate(${-24 - lift * 30})`}>
        <rect x={0} y={-8} width={320} height={16} rx={8} fill="#0b0b0f" />
        <rect x={270} y={-8} width={50} height={16} rx={6} fill="#f3efe6" />
        <circle cx={320} cy={0} r={60} fill="url(#glowAmber)" opacity={b * 0.9} />
      </g>
      {/* høj hat */}
      <g transform={`translate(${W / 2 - 60},${1560}) rotate(-4)`}>
        <ellipse cx={0} cy={0} rx={220} ry={62} fill="#0a0a0f" />
        <path d="M-150,-10 L-136,-380 Q0,-410 136,-380 L150,-10 Q0,30 -150,-10Z" fill="#14141c" />
        <path d="M-150,-10 L-136,-380 Q-110,-386 -96,-384 L-108,-6 Z" fill="#2b2b3a" opacity={0.7} />
        <path d="M-148,-90 Q0,-60 148,-90 L146,-40 Q0,-10 -146,-40Z" fill="#7a1420" />
        <ellipse cx={0} cy={-384} rx={136} ry={30} fill="#060609" />
        {/* lys fra hatten */}
        <ellipse cx={0} cy={-384} rx={120} ry={22} fill="#ffe7a8" opacity={0.4 + b * 0.6} filter="url(#blur10)" />
        <polygon points="-110,-384 110,-384 260,-1100 -260,-1100" fill="url(#cone)" opacity={0.25 + b * 0.5} style={{ mixBlendMode: "screen" }} />
      </g>
      <Sparkles t={t} x={W / 2 - 60} y={1150 - lift * 200} n={60} spread={420} burst={b} seed="mg" />
      {/* duer letter fra hatten på "pokus" */}
      {lift > 0 &&
        [0, 1, 2].map((i) => {
          const p = clamp((t - (pk ?? 0)) * 0.9 - i * 0.12);
          const x = W / 2 - 60 + (i - 1) * 260 * p;
          const y = 1170 - p * 900 - i * 40;
          const fl = Math.sin(t * 22 + i) * 30;
          return (
            <g key={i} transform={`translate(${x},${y}) scale(${0.6 + p * 0.7})`} opacity={clamp(p * 4)}>
              <ellipse rx={46} ry={24} fill="#f4f1ea" />
              <circle cx={40} cy={-14} r={18} fill="#f4f1ea" />
              <path d={`M-10,-6 Q-60,${-60 - fl} -110,${-30 - fl} Q-60,-10 -10,6Z`} fill="#e6e1d6" />
              <path d={`M10,-6 Q50,${-70 + fl} 90,${-50 + fl} Q50,-14 10,6Z`} fill="#fffdf6" />
              <path d="M56,-14 L72,-10 L56,-6Z" fill="#e8a33c" />
            </g>
          );
        })}
    </Base>
  );
};

/* ---------------- FOKUS: kamera-søger, sløret gade bliver skarp på "fokus" ---------------- */
export const Fokus: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const fk = first(line, "fokus");
  const mist = first(line, "mist");
  const sharp = after(t, fk, 0.25);
  const wobble = mist !== undefined && t > mist && sharp < 1 ? Math.sin(t * 9) * 10 : 0;
  const blur = lerp(26, 0, sharp);
  return (
    <Base cam={[lerp(1.08, 1.0, sharp), wobble, 0]}>
      <g style={{ filter: `blur(${blur}px)` }}>
        <Street t={t} seed="fk" shops={["Optik", "Foto"]} />
        <Lamin x={W / 2} y={H + 60} h={1000} t={t} rim="rimCool" />
      </g>
      {/* søger-UI */}
      <g stroke="#fff" strokeWidth={6} fill="none" opacity={0.9}>
        {[[90, 300, 1, 1], [990, 300, -1, 1], [90, 1700, 1, -1], [990, 1700, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M${x},${y + sy * 90} L${x},${y} L${x + sx * 90},${y}`} />
        ))}
      </g>
      <g transform={`translate(${W / 2},${880})`} opacity={0.95}>
        <rect x={-150 - (1 - sharp) * 60} y={-150 - (1 - sharp) * 60} width={300 + (1 - sharp) * 120} height={300 + (1 - sharp) * 120} fill="none" stroke={sharp > 0.95 ? "#5cff7a" : "#fff"} strokeWidth={4} />
        <circle r={10} fill={sharp > 0.95 ? "#5cff7a" : "#fff"} />
      </g>
      <circle cx={130} cy={1780} r={14} fill="#ff2a3c" opacity={0.5 + 0.5 * Math.round((Math.sin(t * 8) + 1) / 2)} />
      <text x={160} y={1792} fill="#fff" fontFamily="SpaceMonoB" fontSize={34}>REC  00:{String(Math.floor(lt + 17)).padStart(2, "0")}</text>
      <text x={990} y={1792} fill="#fff" fontFamily="SpaceMonoB" fontSize={34} textAnchor="end">{sharp > 0.95 ? "AF ●" : "AF ○"}  f/1.8</text>
      {/* fokus-ring skala */}
      <g transform={`translate(${W / 2},1650)`}>
        <rect x={-320} y={-4} width={640} height={8} fill="#fff" opacity={0.35} />
        {Array.from({ length: 17 }).map((_, i) => (
          <rect key={i} x={-320 + i * 40} y={-18} width={4} height={i % 4 === 0 ? 36 : 20} fill="#fff" opacity={0.6} />
        ))}
        <path d="M0,-40 L-14,-62 L14,-62Z" transform={`translate(${lerp(-260, 0, sharp)},0)`} fill="#ffc861" />
      </g>
    </Base>
  );
};

/* ---------------- BONUS: skrabelod og guldmønter på bordet ---------------- */
export const Bonus: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const bn = first(line, "bonus");
  const tid = first(line, "tid");
  const scratch = clamp((t - (tid ?? start)) / Math.max(0.3, (bn ?? start + 1) - (tid ?? start)));
  const win = after(t, bn, 0.3);
  return (
    <Base cam={[lerp(1.0, 1.1, lt / dur), 0, 0]}>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#1a120e" />
      <Facade x={-100} y={-200} w={1280} h={1200} seed="bn" t={t} cols={5} floors={5} warm />
      <rect width={W} height={H} fill="#000" opacity={0.35} />
      <Table cy={1500} r={640} />
      {/* skrabelod */}
      <g transform={`translate(${W / 2},1380) rotate(-6) scale(${1 + win * 0.08})`} filter="url(#soft)">
        <rect x={-300} y={-190} width={600} height={380} rx={20} fill="#1a2f6b" />
        <rect x={-284} y={-174} width={568} height={348} rx={14} fill="none" stroke="#ffc861" strokeWidth={4} />
        <text x={0} y={-110} textAnchor="middle" fontFamily="Anton" fontSize={58} fill="#ffc861" letterSpacing={6}>SKRAB & VIND</text>
        {[0, 1, 2].map((i) => {
          const cx = -180 + i * 180;
          const rev = clamp(scratch * 3 - i);
          return (
            <g key={i}>
              <circle cx={cx} cy={40} r={72} fill="#f6e7b8" />
              <text x={cx} y={70} textAnchor="middle" fontFamily="Anton" fontSize={84} fill="#b8741d">€</text>
              <circle cx={cx} cy={40} r={72} fill="#b9bcc6" opacity={1 - rev} />
              {rev > 0 && rev < 1 && <path d={`M${cx - 70},${40 - 30} l140,${20} M${cx - 60},${60} l120,-10`} stroke="#8d909a" strokeWidth={10} opacity={1 - rev} />}
            </g>
          );
        })}
        <text x={0} y={170} textAnchor="middle" fontFamily="Anton" fontSize={44} fill="#fff" opacity={win}>BONUS ×3</text>
      </g>
      {/* mønter regner ned ved "bonus" */}
      {win > 0 &&
        Array.from({ length: 34 }).map((_, i) => {
          const d = t - (bn ?? 0) - random(`cd${i}`) * 0.5;
          if (d < 0) return null;
          const x = 120 + random(`cx${i}`) * 840;
          const yEnd = 1460 + random(`cy${i}`) * 260;
          const y = Math.min(yEnd, -100 + d * d * 2600);
          const rot = d * 600 * (random(`cr${i}`) - 0.5);
          return (
            <g key={i} transform={`translate(${x},${y})`}>
              <ellipse rx={38 * Math.abs(Math.cos(rot / 60)) + 6} ry={38} fill="url(#gold)" stroke="#8a5a12" strokeWidth={3} />
              <circle cx={0} cy={0} r={60} fill="url(#glowAmber)" opacity={y >= yEnd ? 0.25 : 0.5} />
            </g>
          );
        })}
      {/* kvittering */}
      <g transform="translate(860,1640) rotate(14)">
        <rect x={-90} y={-170} width={180} height={300} fill="#f7f3ea" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={-70} y={-140 + i * 26} width={i % 3 === 2 ? 70 : 140} height={8} fill="#8a8478" />
        ))}
        <path d="M-90,130 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l10,10 L90,130Z" fill="#f7f3ea" />
      </g>
    </Base>
  );
};

/* ---------------- IGEN: facade-ur der spoler tilbage ---------------- */
export const Igen: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const ig = first(line, "igen");
  const tk = first(line, "tænk");
  const rew = after(t, ig, 0.2);
  const ang = -(rew > 0 ? (t - (ig ?? 0)) * 900 : 0);
  const stopT = tk !== undefined && t > tk ? 1 : 0;
  const a = stopT ? -((tk ?? 0) - (ig ?? 0)) * 900 : ang;
  return (
    <Base cam={[lerp(1.0, 1.22, smooth(lt / dur)), 0, lerp(0, 120, smooth(lt / dur))]}>
      <Street t={t} seed="ig" shops={["Horloger", "Café"]} />
      <rect width={W} height={H} fill="#000" opacity={0.2} />
      {/* stort ur på facaden */}
      <g transform={`translate(${W / 2},760)`}>
        <circle r={300} fill="url(#glowAmber)" opacity={0.35 + beatPulse(t) * 0.2} />
        <circle r={210} fill="#1b1611" stroke="#b8741d" strokeWidth={16} />
        <circle r={190} fill="#f3e6c6" />
        {Array.from({ length: 12 }).map((_, i) => (
          <text key={i} x={Math.sin((i * Math.PI) / 6) * 150} y={-Math.cos((i * Math.PI) / 6) * 150 + 16} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={40} fill="#2a1d10">
            {["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"][i]}
          </text>
        ))}
        <rect x={-6} y={-110} width={12} height={120} rx={6} fill="#120c06" transform={`rotate(${a / 12 + 300})`} />
        <rect x={-4} y={-160} width={8} height={170} rx={4} fill="#120c06" transform={`rotate(${a})`} />
        <circle r={14} fill="#b8741d" />
        {/* spole-pile */}
        {rew > 0 && !stopT && (
          <g opacity={0.9} transform={`rotate(${ang * 0.3})`}>
            <path d="M-250,0 A250,250 0 0 1 0,-250" fill="none" stroke="#ffc861" strokeWidth={10} strokeLinecap="round" />
            <path d="M-262,-10 L-250,40 L-220,0Z" fill="#ffc861" />
          </g>
        )}
      </g>
      <Lamin x={W / 2} y={H + 80} h={760} t={t} rim="rimWarm" opacity={0.95} />
    </Base>
  );
};

/* ---------------- GLOBUS: globus i et tændt vindue, drejes ---------------- */
export const Globus: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const dr = first(line, "drej");
  const gb = first(line, "globus");
  const spin = dr !== undefined && t > dr ? (t - dr) * 3.2 + Math.max(0, t - dr) ** 2 * 1.5 : lt * 0.2;
  const z = lerp(1.0, 1.25, after(t, gb, 0.5));
  return (
    <Base cam={[z, 0, 80]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#120d10" />
      {/* vindueskarm og rum */}
      <rect x={60} y={260} width={960} height={1300} fill="#2c1d14" />
      <rect x={100} y={300} width={880} height={1220} fill="#ffcf86" opacity={0.25} />
      <circle cx={W / 2} cy={900} r={700} fill="url(#warmPool)" />
      {/* bogreol bagved */}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 14 }).map((__, c) => (
          <rect key={`${r}-${c}`} x={150 + c * 56} y={360 + r * 160 + random(`bk${r}${c}`) * 30} width={44} height={130 - random(`bk${r}${c}`) * 30} fill={["#5a2a1a", "#2a3a5a", "#6a5a2a", "#3a1a2a"][(r + c) % 4]} opacity={0.55} />
        )),
      )}
      {/* globus */}
      <g transform={`translate(${W / 2},1060)`}>
        <ellipse cx={0} cy={430} rx={200} ry={40} fill="#000" opacity={0.5} filter="url(#blur10)" />
        <path d="M-120,420 L120,420 L60,330 L-60,330Z" fill="#5a3a1c" />
        <rect x={-10} y={250} width={20} height={90} fill="#6b4520" />
        <path d="M-330,0 A330,330 0 0 0 0,330" fill="none" stroke="url(#gold)" strokeWidth={18} transform="rotate(-23)" />
        <defs>
          <clipPath id="globeClip"><circle r={300} /></clipPath>
          <radialGradient id="ocean" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#6fb3d9" />
            <stop offset="0.6" stopColor="#2a6e9a" />
            <stop offset="1" stopColor="#0d2c46" />
          </radialGradient>
        </defs>
        <g transform="rotate(-23)">
          <circle r={300} fill="url(#ocean)" />
          <g clipPath="url(#globeClip)">
            {[0, 1].map((rep) => (
              <g key={rep} transform={`translate(${(((-spin * 400) % 1200) + 1200) % 1200 - 1200 + rep * 1200},0)`}>
                {/* forenklede kontinenter */}
                <path d="M-500,-180 q60,-60 140,-20 q40,60 -20,110 q-30,90 -100,60 q-50,-60 -20,-150Z" fill="#c9b27a" />
                <path d="M-160,-220 q80,-40 160,0 q30,40 -10,80 q40,60 10,150 q-60,100 -100,10 q-40,-80 -60,-240Z" fill="#9cb06a" />
                <path d="M120,-200 q140,-40 260,10 q60,60 -40,100 q-120,20 -160,-40 q-60,-30 -60,-70Z" fill="#c9b27a" />
                <path d="M300,80 q80,-10 120,40 q-20,80 -110,60 q-40,-50 -10,-100Z" fill="#9cb06a" />
                <path d="M-420,60 q40,-20 80,20 q30,120 -40,200 q-60,-80 -40,-220Z" fill="#9cb06a" />
              </g>
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <ellipse key={i} rx={300} ry={Math.abs(Math.cos(((i - 3) * Math.PI) / 7)) * 300} cy={(i - 3) * 80} fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={2} />
            ))}
            <circle cx={-90} cy={-110} r={260} fill="#fff" opacity={0.12} filter="url(#blur20)" />
            <circle r={300} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={80} filter="url(#blur20)" />
          </g>
        </g>
        {/* hånd der drejer */}
        {dr !== undefined && t > dr - 0.2 && t < dr + 0.8 && (
          <g transform={`translate(${340 - clamp((t - dr) * 3) * 260},${-60})`} opacity={1 - clamp((t - dr - 0.5) * 3)}>
            <path d="M0,0 q-60,-20 -110,10 q-20,30 10,40 l90,0 q60,0 120,40 l0,-120 q-60,10 -110,30Z" fill="#6b4434" />
            <rect x={110} y={-90} width={240} height={140} rx={30} fill="#1d2440" />
          </g>
        )}
      </g>
      {/* vinduesrammer i forgrund */}
      <rect x={-300} y={-300} width={360} height={H + 600} fill="#0b0809" />
      <rect x={1020} y={-300} width={360} height={H + 600} fill="#0b0809" />
      <rect x={-300} y={-300} width={W + 600} height={560} fill="#0b0809" />
      <rect x={-300} y={1560} width={W + 600} height={700} fill="#0b0809" />
      <rect x={40} y={1540} width={1000} height={40} fill="#3b2a1c" />
      <rect x={530} y={260} width={20} height={1300} fill="#0b0809" />
    </Base>
  );
};

/* ---------------- SNAK: telefon med beskeder der stabler sig ---------------- */
const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; children?: React.ReactNode; dark?: number }> = ({ x, y, s = 1, rot = 0, children, dark = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} filter="url(#soft)">
    <rect x={-260} y={-520} width={520} height={1040} rx={70} fill="#0a0a0d" />
    <rect x={-244} y={-504} width={488} height={1008} rx={58} fill="#121624" />
    <clipPath id="scr"><rect x={-236} y={-496} width={472} height={992} rx={52} /></clipPath>
    <g clipPath="url(#scr)">
      <rect x={-236} y={-496} width={472} height={992} fill="#0e1220" />
      {children}
      <rect x={-236} y={-496} width={472} height={992} fill="#000" opacity={dark} />
    </g>
    <rect x={-60} y={-484} width={120} height={30} rx={15} fill="#000" />
  </g>
);

const Bubble: React.FC<{ y: number; text: string; me?: boolean; a: number }> = ({ y, text, me = false, a }) => {
  if (a <= 0) return null;
  const w = Math.max(160, text.length * 24 + 60);
  const x = me ? 216 - w : -216;
  return (
    <g transform={`translate(0,${(1 - a) * 40})`} opacity={a}>
      <rect x={x} y={y} width={w} height={84} rx={38} fill={me ? "#2f7cf6" : "#2b2f3d"} />
      <text x={x + 30} y={y + 55} fill="#fff" fontFamily="SpaceMonoB" fontSize={34}>{text}</text>
    </g>
  );
};

export const Snak: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const dems = wordTimes(line, "dem");
  const sn = first(line, "snak");
  const msgs = ["hvor er du??", "svar bror", "ring tilbage", "?????", "du ser den"];
  const ts = [sn, ...dems, dems[2] !== undefined ? dems[2] + 0.35 : undefined];
  const vib: number = ts.reduce<number>((v, x) => (x !== undefined && t > x && t - x < 0.2 ? 1 : v), 0);
  return (
    <Base cam={[lerp(1.0, 1.08, lt / dur), 0, 0]}>
      <Street t={t} seed="sn" lamps />
      <rect width={W} height={H} fill="#000" opacity={0.5} />
      <Table cy={1700} r={700} />
      <Phone x={W / 2 + Math.sin(t * 90) * 6 * vib} y={1180} s={1.05} rot={-3}>
        <rect x={-236} y={-496} width={472} height={130} fill="#161b2c" />
        <circle cx={-170} cy={-420} r={34} fill="#5a4a7a" />
        <text x={-120} y={-410} fill="#fff" fontFamily="SpaceMonoB" fontSize={34}>DEM (4)</text>
        {msgs.map((m, i) => (
          <Bubble key={i} y={-330 + i * 110} text={m} a={after(t, ts[i], 0.2)} />
        ))}
        <rect x={-236} y={400} width={472} height={96} fill="#161b2c" />
        <rect x={-210} y={420} width={340} height={56} rx={28} fill="#2b2f3d" />
      </Phone>
    </Base>
  );
};

/* ---------------- BRUGE: afvis opkald, telefonen slukker ---------------- */
export const Bruge: React.FC<SP> = ({ start, line }) => {
  const { t } = useTimes(start);
  const ik = first(line, "ik");
  const nu = first(line, "nu");
  const eys = wordTimes(line, "ey");
  const decl = after(t, ik, 0.3);
  const off = after(t, nu, 0.4);
  const eyHit = eys.reduce((v, x) => (t > x && t - x < 0.25 ? 1 - (t - x) * 4 : v), 0);
  return (
    <Base cam={[1 + eyHit * 0.04, 0, 0]}>
      <Street t={t} seed="br" />
      <rect width={W} height={H} fill="#000" opacity={0.45} />
      <Phone x={W / 2} y={lerp(1000, 2600, after(t, eys[0], 0.5))} s={1.18} rot={lerp(0, 14, off)} dark={off * 0.95}>
        <rect x={-236} y={-496} width={472} height={992} fill="#1b2a40" />
        <circle cx={0} cy={-220} r={110} fill="#5a4a7a" />
        <text x={0} y={-60} textAnchor="middle" fill="#fff" fontFamily="Anton" fontSize={64}>UKENDT</text>
        <text x={0} y={0} textAnchor="middle" fill="#aab" fontFamily="SpaceMonoB" fontSize={30}>ringer...</text>
        <g transform={`translate(-130,${300}) scale(${1 + decl * 0.3})`}>
          <circle r={74} fill="#ff3b30" />
          <rect x={-40} y={-10} width={80} height={20} rx={10} fill="#fff" transform="rotate(135)" />
        </g>
        <g transform="translate(130,300)">
          <circle r={74} fill="#34c759" opacity={1 - decl} />
        </g>
        {decl > 0.5 && <text x={0} y={180} textAnchor="middle" fill="#ff6b62" fontFamily="SpaceMonoB" fontSize={34} opacity={decl}>AFVIST</text>}
      </Phone>
      {/* ey ey ey: Lamin kommer frem */}
      <Lamin x={W / 2} y={H + 60} h={1150} t={t} opacity={after(t, eys[0], 0.3)} rim="rimGold" />
      {eys.map((x, i) => (
        <circle key={i} cx={W / 2} cy={1100} r={300 + (t - x) * 900} fill="none" stroke="#ffc861" strokeWidth={10} opacity={t > x ? clamp(1 - (t - x) * 2) : 0} />
      ))}
    </Base>
  );
};

/* ---------------- FØLES: Lamin med hånd på brystet, hjertet gløder ---------------- */
export const Foles: React.FC<SP & { variant?: number }> = ({ start, dur, line, variant = 0 }) => {
  const { lt, t } = useTimes(start);
  const fo = first(line, "føles");
  const glow = after(t, fo, 0.4);
  const hb = Math.max(0, Math.sin(t * 2 * Math.PI * (129.2 / 60) * 0.5)) ** 6;
  const k = smooth(lt / dur);
  return (
    <Base cam={[lerp(1.0, 1.12, k), 0, lerp(0, -80, k)]}>
      {variant === 0 ? (
        <Street t={t} seed="fo" />
      ) : (
        <g>
          {/* tag-terrasse over byen */}
          <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#duskSky)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Facade key={i} x={-300 + i * 200} y={900 + random(`rf${i}`) * 200} w={190} h={900} seed={`rf${i}`} t={t} cols={2} floors={6} lit={0.45} />
          ))}
          <rect x={-300} y={1500} width={W + 600} height={800} fill="#0c0a10" />
        </g>
      )}
      <rect width={W} height={H} fill="#000" opacity={0.35} />
      <circle cx={W / 2 + 40} cy={1580} r={260 + hb * 60} fill="url(#glowRed)" opacity={glow * (0.5 + hb * 0.5)} style={{ mixBlendMode: "screen" }} />
      <Lamin x={W / 2} y={H + 40} h={1240} t={t} rim={variant ? "rimCool" : "rimWarm"} />
      <circle cx={W / 2 - 60} cy={1560} r={120 + hb * 40} fill="url(#glowAmber)" opacity={glow * (0.35 + hb * 0.4)} style={{ mixBlendMode: "screen" }} />
      <Sparkles t={t} x={W / 2 - 40} y={1500} n={18} spread={300} burst={0} seed={`fo${variant}`} color="#ffb0a0" />
    </Base>
  );
};

/* ---------------- PROCENT: kæmpe neon-skilt på facaden lader op til 100% ---------------- */
export const Procent: React.FC<SP & { variant?: number }> = ({ start, dur, line, variant = 0 }) => {
  const { lt, t } = useTimes(start);
  const hu = first(line, "hundrede");
  const pr = first(line, "procent");
  const s0 = first(line, "om") ?? start;
  const p = hu !== undefined && t < hu ? clamp((t - s0) / (hu - s0)) * 0.86 : hu !== undefined ? lerp(0.86, 1, after(t, hu, (pr ?? hu + 0.5) - hu + 0.1)) : 0;
  const full = after(t, pr, 0.2);
  const pct = Math.round(p * 100);
  return (
    <Base cam={[lerp(1.0, 1.1, smooth(lt / dur)) + full * 0.03 * Math.exp(-(t - (pr ?? 0)) * 3), 0, 0]}>
      <Street t={t} seed={`pc${variant}`} />
      <rect width={W} height={H} fill="#000" opacity={0.45} />
      {variant === 0 ? (
        <g transform={`translate(${W / 2},${1050})`}>
          {/* neon-skilt */}
          <rect x={-420} y={-340} width={840} height={560} rx={30} fill="#0b0a10" stroke="#2a2433" strokeWidth={10} />
          <text x={0} y={60} textAnchor="middle" fontFamily="Anton" fontSize={300} fill="none" stroke={full > 0 ? "#ffc861" : "#ffefc8"} strokeWidth={6} opacity={0.9}>{pct}%</text>
          <text x={0} y={60} textAnchor="middle" fontFamily="Anton" fontSize={300} fill={full > 0 ? "url(#goldText)" : "#ffefc8"} opacity={0.2 + p * 0.5 + full * 0.3}>{pct}%</text>
          <circle cx={0} cy={-40} r={520} fill="url(#glowAmber)" opacity={0.15 + full * 0.35} style={{ mixBlendMode: "screen" }} />
          <rect x={-340} y={130} width={680} height={50} rx={25} fill="#1d1a24" />
          <rect x={-334} y={136} width={668 * p} height={38} rx={19} fill="url(#gold)" />
        </g>
      ) : (
        <g transform={`translate(${W / 2},${1150})`}>
          {/* speedometer i bil-cockpit */}
          <circle r={400} fill="#07080c" stroke="#2a2f3c" strokeWidth={16} />
          <circle r={380} fill="none" stroke="#1a1d26" strokeWidth={4} />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = ((-225 + i * 27) * Math.PI) / 180;
            return (
              <g key={i}>
                <line x1={Math.cos(a) * 300} y1={Math.sin(a) * 300} x2={Math.cos(a) * 360} y2={Math.sin(a) * 360} stroke={i >= 9 ? "#ff3b30" : "#e8e8f0"} strokeWidth={8} />
                <text x={Math.cos(a) * 240} y={Math.sin(a) * 240 + 18} textAnchor="middle" fontFamily="Anton" fontSize={48} fill={i === 10 ? "#ffc861" : "#ccd"}>{i * 10}</text>
              </g>
            );
          })}
          <g transform={`rotate(${-225 + p * 270 + 90 + Math.sin(t * 40) * full * 1.5})`}>
            <path d="M-10,0 L0,-340 L10,0 Z" fill="#ff5a3c" />
          </g>
          <circle r={36} fill="#2a2f3c" />
          <text x={0} y={200} textAnchor="middle" fontFamily="Anton" fontSize={120} fill="url(#goldText)">{pct}%</text>
          <circle r={500} fill="url(#glowRed)" opacity={full * 0.3} style={{ mixBlendMode: "screen" }} />
        </g>
      )}
      <Sparkles t={t} x={W / 2} y={1000} n={50} spread={600} burst={full} seed={`pc${variant}`} />
    </Base>
  );
};

/* ---------------- TAXA: taxa holder ind om natten, besked på telefon ---------------- */
const Taxi: React.FC<{ x: number; y: number; s?: number; t: number; lit?: number }> = ({ x, y, s = 1, t, lit = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={520} ry={50} fill="#000" opacity={0.6} filter="url(#blur10)" />
    <path d="M-480,-20 L-470,-150 Q-440,-190 -330,-200 L-220,-320 Q-180,-350 -80,-352 L170,-352 Q240,-350 290,-300 L380,-200 Q470,-190 490,-140 L500,-20 Z" fill="#f2b705" />
    <path d="M-480,-60 L500,-60 L500,-20 L-480,-20Z" fill="#1a1a1a" />
    <path d="M-200,-310 Q-170,-332 -90,-332 L40,-332 L40,-210 L-300,-210 Z" fill="#1b2438" />
    <path d="M60,-332 L170,-332 Q220,-330 260,-290 L330,-210 L60,-210 Z" fill="#1b2438" />
    <path d="M-150,-320 L-60,-320 L-150,-220Z" fill="#fff" opacity={0.15} />
    {Array.from({ length: 10 }).map((_, i) => (
      <rect key={i} x={-460 + i * 96} y={-120} width={48} height={24} fill={i % 2 ? "#111" : "#f2b705"} />
    ))}
    <rect x={-100} y={-400} width={200} height={50} rx={10} fill={lit ? "#ffe9a6" : "#665"} />
    <text x={0} y={-364} textAnchor="middle" fontFamily="Anton" fontSize={38} fill="#1a1400">TAXA</text>
    <circle cx={0} cy={-380} r={160} fill="url(#glowAmber)" opacity={0.5 * lit} />
    {[-300, 320].map((wx) => (
      <g key={wx} transform={`translate(${wx},-20)`}>
        <circle r={82} fill="#0b0b0e" />
        <circle r={46} fill="url(#chrome)" />
        <g transform={`rotate(${t * 400})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <rect key={a} x={-5} y={-44} width={10} height={40} fill="#333" transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    ))}
    <ellipse cx={480} cy={-130} rx={26} ry={18} fill="#fff6d8" />
    <polygon points="490,-140 1100,-260 1100,40 490,-110" fill="url(#coneWhite)" opacity={0.6} />
    <rect x={-492} y={-150} width={20} height={34} fill="#ff2a3c" />
  </g>
);

export const Taxa: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const ins = first(line, "instrukser");
  const tx = first(line, "taxatur");
  const sent = first(line, "sendt");
  const arrive = easeOut((t - start) / 1.6);
  return (
    <Base cam={[lerp(1.0, 1.08, lt / dur), 0, 0]}>
      <Street t={t} seed="tx" shops={["Kiosk", "Grill"]} />
      <rect width={W} height={H} fill="#000" opacity={0.2} />
      <Taxi x={lerp(-700, 520, arrive)} y={1620} s={0.95} t={arrive < 1 ? t : start + 1.6} />
      {/* anonym figur går mod taxaen */}
      <Figure x={lerp(900, 760, clamp((t - (sent ?? start + 2)) * 0.8))} y={1640} s={0.95} pose="walk" t={t} flip />
      {/* telefon med instruktioner */}
      <g opacity={after(t, ins, 0.3)} transform={`translate(${250},${lerp(820, 760, after(t, ins, 0.4))}) rotate(-6) scale(0.5)`}>
        <rect x={-260} y={-520} width={520} height={900} rx={60} fill="#0a0a0d" />
        <rect x={-240} y={-500} width={480} height={860} rx={48} fill="#0e1220" />
        <text x={-200} y={-420} fill="#8a93ad" fontFamily="SpaceMonoB" fontSize={34}>BROR</text>
        {["kl. 02:00", "bagindgangen", "ingen navne", "kør tur-retur"].map((m, i) => (
          <g key={i} opacity={clamp((t - (ins ?? 0)) * 3 - i * 0.6)}>
            <rect x={-210} y={-370 + i * 120} width={380} height={90} rx={40} fill="#2b2f3d" />
            <text x={-180} y={-312 + i * 120} fill="#fff" fontFamily="SpaceMonoB" fontSize={36}>{m}</text>
          </g>
        ))}
      </g>
      {tx !== undefined && t > tx && (
        <text x={W / 2 + 200} y={1250} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={44} fill="#ffe9a6" opacity={after(t, tx, 0.2)}>
          ● LEDIG → OPTAGET
        </text>
      )}
    </Base>
  );
};

/* ---------------- RETUR: billet stemples, to anonyme hænder giver dap ---------------- */
export const Retur: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const rt = first(line, "tur-retur");
  const del = first(line, "del");
  const hb = first(line, "habibi-bror");
  const stamp = after(t, rt, 0.15);
  const dap = clamp((t - (hb ?? del ?? start + 2)) / 0.3);
  return (
    <Base cam={[lerp(1.0, 1.06, lt / dur), 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#120d0c" />
      <Facade x={-120} y={-240} w={1320} h={1000} seed="rt" t={t} cols={5} floors={4} warm />
      <rect width={W} height={H} fill="#000" opacity={0.3} />
      <Table cy={1500} r={660} />
      {/* billet */}
      <g transform={`translate(${W / 2 - 40},${1280}) rotate(-8) scale(${1 + stamp * 0.04})`} filter="url(#soft)">
        <rect x={-380} y={-150} width={760} height={300} rx={14} fill="#f3ead6" />
        <rect x={180} y={-150} width={4} height={300} fill="#c8bba0" strokeDasharray="8 8" />
        <text x={-340} y={-80} fontFamily="SpaceMonoB" fontSize={30} fill="#7a6a50">BILLET · TICKET</text>
        <text x={-340} y={10} fontFamily="Anton" fontSize={92} fill="#1c1a24">TUR-RETUR</text>
        <text x={-340} y={90} fontFamily="SpaceMonoB" fontSize={30} fill="#7a6a50">2 PERS · NAT</text>
        <g transform={`translate(270,0) rotate(-18) scale(${lerp(2.2, 1, stamp)})`} opacity={stamp}>
          <circle r={90} fill="none" stroke="#c21d2a" strokeWidth={10} />
          <text y={14} textAnchor="middle" fontFamily="Anton" fontSize={44} fill="#c21d2a">OK ✓</text>
        </g>
      </g>
      {/* to hænder: fist bump */}
      <g opacity={after(t, del, 0.3)}>
        <g transform={`translate(${lerp(-200, W / 2 - 110, easeOut(dap))},${700})`}>
          <rect x={-600} y={-60} width={560} height={130} rx={50} fill="#1c2236" />
          <rect x={-80} y={-70} width={150} height={150} rx={50} fill="#6e4532" />
          <rect x={30} y={-60} width={30} height={130} rx={14} fill="#5a3726" />
        </g>
        <g transform={`translate(${lerp(W + 200, W / 2 + 110, easeOut(dap))},${700}) scale(-1,1)`}>
          <rect x={-600} y={-60} width={560} height={130} rx={50} fill="#3a1d1a" />
          <rect x={-80} y={-70} width={150} height={150} rx={50} fill="#8a5a40" />
          <rect x={30} y={-60} width={30} height={130} rx={14} fill="#734a34" />
        </g>
        {dap >= 1 && <Sparkles t={t} x={W / 2} y={700} n={30} spread={300} burst={Math.exp(-(t - (hb ?? 0) - 0.3) * 3)} seed="dap" />}
      </g>
    </Base>
  );
};

/* ---------------- BRUGER: lang kvittering ruller ud, krølles sammen ---------------- */
export const Bruger: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const bru = first(line, "bruger");
  const nah = first(line, "nah");
  const roll = clamp((t - (bru ?? start)) / 0.9);
  const crum = after(t, nah, 0.35);
  const items = ["SNEAKERS", "JAKKE", "MIDDAG x6", "TAXA", "PARFUME", "UR", "BILLETTER", "DRIKKE", "HOTEL"];
  return (
    <Base cam={[lerp(1.0, 1.05, lt / dur), 0, 0]}>
      <Street t={t} seed="bg" shops={["Boutique", "Atelier"]} />
      <rect width={W} height={H} fill="#000" opacity={0.45} />
      {/* indkøbsposer */}
      {[[200, 1720, "#e9e2d2"], [360, 1760, "#141418"], [860, 1730, "#c8a25a"]].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path d="M-90,-220 L90,-220 L110,0 L-110,0Z" fill={c as string} />
          <path d="M-40,-220 Q-40,-300 0,-300 Q40,-300 40,-220" fill="none" stroke="#000" strokeWidth={8} opacity={0.6} />
        </g>
      ))}
      <g transform={`translate(${W / 2},${360}) scale(${lerp(1, 0.25, crum)}) rotate(${crum * 40})`} opacity={1 - crum * 0.2}>
        <rect x={-230} y={0} width={460} height={1250 * roll} fill="#f7f3ea" />
        <g clipPath="none">
          {items.map((it, i) =>
            i * 120 + 120 < 1250 * roll ? (
              <g key={i}>
                <text x={-190} y={110 + i * 120} fontFamily="SpaceMonoB" fontSize={38} fill="#2a2620">{it}</text>
                <text x={190} y={110 + i * 120} textAnchor="end" fontFamily="SpaceMonoB" fontSize={38} fill="#2a2620">{(random(`p${i}`) * 4000 + 400).toFixed(0)},-</text>
              </g>
            ) : null,
          )}
        </g>
        <rect x={-230} y={-30} width={460} height={40} rx={10} fill="#d9d2c2" />
      </g>
      {crum > 0 && <Lamin x={W / 2} y={H + 60} h={lerp(800, 1150, crum)} t={t} opacity={crum} rim="rimGold" />}
    </Base>
  );
};

/* ---------------- BARCA: kort Amsterdam → Barcelona, rute tegnes ---------------- */
export const Barca: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const dam = first(line, "dam");
  const bar = first(line, "barca");
  const boer = first(line, "boer");
  const route = clamp((t - (dam ?? start)) / Math.max(0.3, (bar ?? start + 1) - (dam ?? start)));
  const ball = after(t, boer, 0.6);
  const A = [640, 520];
  const B = [420, 1360];
  const C = [A[0] - 380, (A[1] + B[1]) / 2];
  const pt = (u: number) => [(1 - u) ** 2 * A[0] + 2 * (1 - u) * u * C[0] + u * u * B[0], (1 - u) ** 2 * A[1] + 2 * (1 - u) * u * C[1] + u * u * B[1]];
  const [px, py] = pt(route);
  return (
    <Base cam={[lerp(1.0, 1.08, lt / dur), 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#0e1a2a" />
      <g transform="translate(0,260)">
      {/* stiliseret Europa-kort */}
      <g opacity={0.95}>
        <path d="M200,200 Q420,120 720,180 Q900,260 980,420 Q1000,620 880,700 Q760,820 820,980 Q700,1100 560,1120 Q480,1260 560,1400 Q460,1520 260,1480 Q120,1400 160,1240 Q60,1100 180,960 Q120,780 260,680 Q160,520 220,380Z" fill="#2a3a4e" stroke="#4a6a8a" strokeWidth={4} />
        <path d="M60,1500 Q260,1560 520,1520 Q700,1600 900,1560 L1100,1900 L-100,1900Z" fill="#0a1422" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={0} y1={160 * i} x2={W} y2={160 * i} stroke="#4a6a8a" strokeOpacity={0.15} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={150 * i} y1={0} x2={150 * i} y2={H} stroke="#4a6a8a" strokeOpacity={0.15} />
        ))}
      </g>
      {[[520, 760, "PARIS"], [820, 620, "BERLIN"], [300, 1240, "MADRID"], [760, 1080, "MILANO"], [560, 980, "LYON"], [180, 900, "BORDEAUX"]].map(([x, y, n], i) => (
        <g key={i} opacity={0.6}>
          <circle cx={x as number} cy={y as number} r={8} fill="#9cb6d6" />
          <text x={(x as number) + 16} y={(y as number) + 10} fontFamily="SpaceMonoB" fontSize={28} fill="#9cb6d6">{n}</text>
        </g>
      ))}
      <path d={`M${A[0]},${A[1]} Q${C[0]},${C[1]} ${B[0]},${B[1]}`} fill="none" stroke="#ffc861" strokeWidth={10} strokeDasharray="1 0" pathLength={1} strokeDashoffset={0} opacity={0.15} />
      <path d={`M${A[0]},${A[1]} Q${C[0]},${C[1]} ${B[0]},${B[1]}`} fill="none" stroke="#ffc861" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${route} 1`} />
      {[[A, "AMSTERDAM"], [B, "BARCELONA"]].map(([p, n], i) => (
        <g key={i} transform={`translate(${(p as number[])[0]},${(p as number[])[1]})`} opacity={i === 0 ? after(t, dam, 0.2) : after(t, bar, 0.2)}>
          <circle r={70} fill="url(#glowAmber)" />
          <circle r={18} fill="#fff" />
          <text x={i === 0 ? 40 : -40} y={-40} textAnchor={i === 0 ? "start" : "end"} fontFamily="Anton" fontSize={64} fill="#fff" letterSpacing={4}>{n as string}</text>
        </g>
      ))}
      {/* fly langs ruten */}
      {route > 0 && route < 1 && (
        <g transform={`translate(${px},${py}) rotate(${(Math.atan2(pt(Math.min(1, route + 0.01))[1] - py, pt(Math.min(1, route + 0.01))[0] - px) * 180) / Math.PI})`}>
          <path d="M40,0 L-20,-8 L-34,-44 L-46,-44 L-38,-8 L-60,-6 L-70,-20 L-78,-20 L-72,0 L-78,20 L-70,20 L-60,6 L-38,8 L-46,44 L-34,44 L-20,8Z" fill="#fff" />
        </g>
      )}
      {/* fodbold flyver ind på "De Boer" */}
      {ball > 0 && (
        <g transform={`translate(${lerp(1300, 760, ball)},${lerp(1700, 1500, ball)}) rotate(${t * 400}) scale(1.4)`}>
          <circle r={80} fill="#f4f1ea" />
          <path d="M0,-30 L28,-10 L18,24 L-18,24 L-28,-10Z" fill="#111" />
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M0,-80 L10,-60 L-10,-60Z" fill="#111" transform={`rotate(${a})`} />
          ))}
          <circle r={80} fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={10} />
        </g>
      )}
      </g>
    </Base>
  );
};

/* ---------------- ORD: håndtryk i varmt lys ---------------- */
export const Ord: React.FC<SP> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const ho = first(line, "holder");
  const sh = clamp((t - (ho ?? start + 1)) / 0.35);
  const k = smooth(lt / dur);
  return (
    <Base cam={[lerp(1.0, 1.15, k), 0, 0]}>
      <Street t={t} seed="ord" />
      <rect width={W} height={H} fill="#000" opacity={0.4} />
      <circle cx={W / 2} cy={1050} r={600} fill="url(#warmPool)" opacity={0.6 + sh * 0.4} />
      <Lamin x={W / 2} y={H + 60} h={1150} t={t} opacity={1 - sh * 0.25} rim="rimWarm" />
      <g transform={`translate(${W / 2},1500) scale(1.2)`}>
        <circle r={420} fill="url(#warmPool)" opacity={sh} />
        <g transform={`translate(${lerp(-700, 0, easeOut(sh))},${Math.sin(t * 12) * 6 * (sh >= 1 ? 1 : 0)})`}>
          <rect x={-760} y={-70} width={640} height={150} rx={50} fill="#1c2236" />
          <path d="M-140,-80 Q-40,-110 40,-70 L90,-30 Q100,10 60,20 L-140,70Z" fill="#6e4532" />
          <path d="M-20,-60 Q60,-60 110,-20 Q120,0 90,6 L20,-10Z" fill="#7c4f3a" />
        </g>
        <g transform={`translate(${lerp(700, 0, easeOut(sh))},${Math.sin(t * 12) * 6 * (sh >= 1 ? 1 : 0)}) scale(-1,1)`}>
          <rect x={-760} y={-70} width={640} height={150} rx={50} fill="#2a1a14" />
          <path d="M-140,-80 Q-40,-110 40,-70 L90,-30 Q100,10 60,20 L-140,70Z" fill="#8a5a40" />
          <path d="M-60,40 Q20,60 70,30 L60,10 L-60,20Z" fill="#9a6a4c" />
        </g>
        {sh >= 1 && <Sparkles t={t} x={0} y={0} n={40} spread={420} burst={Math.exp(-(t - (ho ?? 0) - 0.35) * 2.5)} seed="ord" />}
      </g>
    </Base>
  );
};

/* ---------------- OUTRO ---------------- */
export const Outro: React.FC<SP> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const rows = [
    ["♥", "LIKE", "hvis den ramte"],
    ["✓", "FØLG", "for mere"],
    ["✎", "SKRIV", "hvad du synes"],
  ];
  return (
    <Base bg="#0b0b10">
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#0b0b10" />
      <circle cx={W / 2} cy={1500} r={700} fill="url(#warmPool)" opacity={0.25} />
      <Lamin x={W / 2} y={H + 40} h={900} t={t} opacity={0.35 * after(lt, 0.2, 1)} rim="rimWarm" />
      <rect x={0} y={1200} width={W} height={720} fill="#0b0b10" opacity={0.4} />
      <text x={W / 2} y={560} textAnchor="middle" fontFamily="Anton" fontSize={128} fill="#f4f1ea" letterSpacing={34} opacity={after(lt, 0.1, 0.6)}>
        LAMIN
      </text>
      <text x={W / 2} y={640} textAnchor="middle" fontFamily="Anton" fontSize={52} fill="#ff9a3c" letterSpacing={14} opacity={after(lt, 0.4, 0.6)}>
        100%
      </text>
      {rows.map(([ic, a, b], i) => {
        const k = after(lt, 0.8 + i * 0.35, 0.4);
        return (
          <g key={i} transform={`translate(${230 + (1 - k) * -40},${800 + i * 120})`} opacity={k}>
            <circle cx={0} cy={-26} r={30} fill={i === 0 ? "#ffb347" : "#f4f1ea"} />
            <text x={0} y={-14} textAnchor="middle" fontSize={34} fill="#0b0b10" fontWeight={900}>{ic}</text>
            <text x={60} y={0} fontFamily="Anton" fontSize={80} fill="#f4f1ea">{a}</text>
            <text x={60 + a.length * 42 + 30} y={-6} fontFamily="SpaceMonoB" fontSize={30} fill="#d9d2c2">{b}</text>
          </g>
        );
      })}
      <text x={290} y={1190} fontFamily="SpaceMonoB" fontSize={26} fill="#9a94a8" opacity={after(lt, 2, 0.5)}>og ønsk det næste nummer</text>
    </Base>
  );
};

export { Lamp, H };
