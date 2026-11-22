import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Bust, Kid, PeopleDefs, Who } from "../components/People";
import { Office, SchoolDefs, Clock } from "../components/School";
import { Estate, Person } from "../components/Block";
import { School2Defs, SchoolExterior2 as SchoolExterior, Classroom2 as Classroom } from "../components/School2";
import { wordTimes, lineOf } from "../data/timing";
import { W, H, beatPulse, clamp, easeOut, smooth } from "../lib";

type P = { start: number; dur: number; line: number };

/** Fælles ramme: Stage + defs */
const S: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; bg?: string }> = ({ children, cam, bg }) => (
  <Stage cam={cam} bg={bg}>
    <SchoolDefs />
    <School2Defs />
    <PeopleDefs />
    {children}
  </Stage>
);

/** taler: munden bevæger sig når der synges (pr. ord i linjen) */
const talkAt = (t: number, times: number[]) => {
  for (const w of times) if (t >= w && t < w + 0.22) return 0.5 + 0.5 * Math.sin((t - w) * 30);
  return 0;
};

/** Kridt-tekst på tavlen der "skrives" frem fra venstre */
const Chalk: React.FC<{ x: number; y: number; text: string; size: number; p: number; color?: string; font?: string }> = ({ x, y, text, size, p, color = "#f4f1ea", font = "Playfair" }) => {
  const id = `ck${text.replace(/\W/g, "")}${Math.round(x)}${Math.round(y)}`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x - 900} y={y - size * 1.2} width={1800 * clamp(p) } height={size * 1.6} />
        </clipPath>
      </defs>
      <text x={x} y={y} textAnchor="middle" fontFamily={font} fontStyle={font === "Playfair" ? "italic" : "normal"} fontSize={size} fill={color} opacity={0.92} clipPath={`url(#${id})`} style={{ letterSpacing: font === "Anton" ? "0.06em" : undefined }}>
        {text}
      </text>
    </g>
  );
};

// ------------------------------------------------------------------ INTRO
export const Intro: React.FC<P> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const u = smooth(lt / dur);
  return (
    <>
      <S cam={[1.0 + u * 0.12, 0, -u * 120]}>
        <SchoolExterior t={t} hour={7.9 + lt * 0.02} />
      </S>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, opacity: easeOut(lt / 0.4) * (1 - smooth((lt - dur + 0.35) / 0.35)) }}>
        <div style={{ fontFamily: "Anton", fontSize: 230, color: "#fffaf0", letterSpacing: "0.12em", textShadow: "0 8px 0 rgba(0,0,0,.25), 0 0 40px rgba(255,220,160,.5)" }}>GIGIS</div>
        <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 130, color: "#c0392b", marginTop: -20, textShadow: "0 4px 0 rgba(255,255,255,.6)" }}>Gertrud</div>
      </AbsoluteFill>
    </>
  );
};

// ------------------------------------------------------------------ GERTRUD (klasse) – gentages med varianter
export const GertrudClass: React.FC<P & { mood?: "happy" | "serious" | "talk" | "hero"; chalk?: string }> = ({ start, dur, line, mood = "happy", chalk }) => {
  const { lt, t } = useTimes(start);
  const words = lineOf(line).map((w) => w.t);
  const talk = mood === "talk" || mood === "serious" ? talkAt(t, words) : 0;
  const u = smooth(lt / dur);
  return (
    <S cam={[1.0 + u * 0.06, 0, 0]}>
      <Classroom t={t} hour={13.75 + lt * 0.01} chalk={chalk ? <Chalk x={620} y={560} text={chalk} size={90} p={lt / 0.9} /> : undefined} />
      <Bust who="gertrud" x={540} y={1960} s={1.75} t={t} smile={mood === "serious" ? 0.15 : mood === "hero" ? 0.95 : 0.8} brow={mood === "serious" ? -0.4 : 0.6} talk={talk} look={Math.sin(t * 0.7) * 0.3} />
      {mood === "serious" && <circle cx={540 + 74} cy={1960 - 344 * 1.75} r={40 * Math.abs(Math.sin(t * 3))} fill="url(#glowWhite)" />}
    </S>
  );
};

// ------------------------------------------------------------------ "De andre lærer' de sagde jeg var en rod"
export const Rod: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const rod = wordTimes(line, "rod")[0] ?? start + 2;
  const k = t - rod;
  const teachers: [Who, number][] = [["laererA", 230], ["inspektor", 540], ["laererB", 850]];
  return (
    <S cam={[1.0 + lt * 0.015 + (k > 0 ? 0.05 * Math.exp(-k * 6) : 0), 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#cdbfa6" />
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#sunGlow)" opacity={0.3} />
      {teachers.map(([w, x], i) => (
        <Bust key={w} who={w} x={x} y={1240} s={0.95} t={t + i} smile={0} brow={-1} look={x < 540 ? 0.6 : x > 540 ? -0.6 : 0} talk={Math.max(0, Math.sin(t * 9 + i)) * 0.6} />
      ))}
      <rect x={-300} y={1240} width={W + 600} height={800} fill="url(#wood)" />
      <Bust who="abdi" x={540} y={1980} s={1.05} t={t} smile={k > 0 ? 0.7 : 0.05} brow={k > 0 ? 0.6 : -0.2} look={0} />
      {/* papirer på bordet – eksploderer på "rod" */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = random(`pa${i}`) * Math.PI * 2, v = 400 + random(`pv${i}`) * 700;
        const kk = Math.max(0, k);
        const side = i % 2 ? 1 : -1;
        const x = 540 + side * (300 + random(`px${i}`) * 180) + Math.cos(a) * v * kk;
        const y = 1780 + (random(`py${i}`) - 0.5) * 160 + Math.sin(a) * v * kk - 300 * kk + 600 * kk * kk;
        return <rect key={i} x={x - 50} y={y - 34} width={100} height={68} fill="#fbfaf4" stroke="#c9c0b0" strokeWidth={2} transform={`rotate(${(random(`pr${i}`) - 0.5) * 60 + kk * 400 * (random(`ps${i}`) - 0.5)},${x},${y})`} />;
      })}
    </S>
  );
};

// ------------------------------------------------------------------ "slidt og gammel nu" – gammelt foto på væggen + uret der snurrer
export const Gammel: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const gm = wordTimes(line, "gammel")[0] ?? start + 1.3;
  const age = easeOut((t - gm + 0.3) / 0.6);
  return (
    <S cam={[1.05 + lt * 0.03, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#d9c9a8" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={i * 100 - 40} y={-300} width={6} height={H + 600} fill="#c4b18e" />
      ))}
      <Clock x={540} y={1760} r={80} hour={8 + lt * 6} />
      {/* billedramme */}
      <rect x={130} y={560} width={820} height={1040} fill="#6e4e30" />
      <rect x={160} y={590} width={760} height={980} fill="#efe4cc" />
      <g style={{ filter: `sepia(${age}) contrast(${1 - age * 0.1})` }}>
        <rect x={190} y={620} width={700} height={920} fill="#b9a27a" />
        <Bust who="gertrud" x={540} y={1540} s={1.3} t={t} smile={0.7} brow={0.4} />
      </g>
      <rect x={190} y={620} width={700} height={920} fill="#a88a5a" opacity={age * 0.25} />
      {/* ridser */}
      {age > 0.3 && [0, 1, 2].map((i) => <line key={i} x1={220 + i * 230} y1={640} x2={260 + i * 220} y2={1500} stroke="#fff" strokeWidth={2} opacity={0.3 * age} />)}
      <path d="M130,560 Q300,700 130,840" stroke="#fff" strokeWidth={2} opacity={0.4} fill="none" />
    </S>
  );
};

// ------------------------------------------------------------------ "Vil' jeg gøre hende til min brud"
export const Brud: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const br = wordTimes(line, "brud")[0] ?? start + 1.4;
  const k = t - br;
  const veil = easeOut(k / 0.35);
  return (
    <S cam={[1.0 + lt * 0.02, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#f3d6dc" />
      <circle cx={540} cy={900} r={900} fill="url(#sunGlow)" />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = random(`hx${i}`) * W, y = ((random(`hy${i}`) * 1900 - t * (60 + random(`hs${i}`) * 60)) % 1900 + 1900) % 1900;
        return <path key={i} d={`M${x},${y} c-14,-20 -40,-4 -24,18 l24,22 l24,-22 c16,-22 -10,-38 -24,-18 z`} fill="#e0485a" opacity={0.35} />;
      })}
      <Bust who="gertrud" x={720} y={1960} s={1.2} t={t} smile={k > 0 ? 1 : 0.6} brow={k > 0 ? 1 : 0.3} look={-0.7} />
      {/* slør */}
      {k > -0.1 && (
        <g transform={`translate(720,${1960 - 1.2 * 470 - (1 - veil) * 300})`} opacity={veil}>
          <path d="M-150,0 Q-260,300 -230,560 L-120,560 Q-150,260 -110,40 Q0,20 110,40 Q150,260 120,560 L230,560 Q260,300 150,0 Q0,-60 -150,0 Z" fill="#ffffff" opacity={0.6} />
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx={-60 + i * 20} cy={-18 + Math.abs(i - 3) * 4} r={10} fill="#fff" stroke="#e8e0e8" />
          ))}
        </g>
      )}
      <Bust who="abdi" x={300} y={1980} s={1.0} t={t} smile={0.9} brow={0.8} look={0.7} />
      {/* blomster i Abdis hånd-område */}
      <g transform="translate(470,1700)">
        <rect x={-6} y={0} width={12} height={220} fill="#3a7a3a" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={Math.cos(i * 1.26) * 34} cy={Math.sin(i * 1.26) * 34} r={26} fill={["#e0485a", "#f39c12", "#e0485a", "#9b59b6", "#e0485a"][i]} />
        ))}
        <circle r={16} fill="#f1c40f" />
      </g>
      {k > 0 && Array.from({ length: 40 }).map((_, i) => {
        const x = random(`cf${i}`) * W, y = -50 + k * (600 + random(`cv${i}`) * 900);
        return <rect key={i} x={x} y={y} width={14} height={8} fill={["#e0485a", "#f1c40f", "#3498db", "#2ecc71"][i % 4]} transform={`rotate(${k * 300 + i * 20},${x},${y})`} />;
      })}
    </S>
  );
};

// ------------------------------------------------------------------ "Ger Ger Gertrud" ×2: kridt på tavlen
export const GerGer: React.FC<P> = ({ start, line }) => {
  const { t } = useTimes(start);
  const l1 = wordTimes(line, "ger"), l2 = wordTimes(line + 1, "ger");
  const g1 = wordTimes(line, "gertrud")[0] ?? start + 0.4, g2 = wordTimes(line + 1, "gertrud")[0] ?? start + 1.8;
  const rows: [number, string, number][] = [
    [l1[0] ?? start, "Ger", 0],
    [l1[1] ?? start + 0.15, "Ger", 1],
    [g1, "Gertrud", 2],
    [l2[0] ?? start + 1.4, "Ger", 3],
    [l2[1] ?? start + 1.55, "Ger", 4],
    [g2, "Gertrud", 5],
  ];
  return (
    <S cam={[1.0 + beatPulse(t) * 0.02, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#wood)" />
      <rect x={40} y={140} width={1000} height={1640} fill="url(#board)" />
      <ellipse cx={540} cy={900} rx={500} ry={600} fill="url(#chalkDust)" />
      {rows.map(([tt, txt, i]) => {
        const p = (t - tt) / (txt === "Ger" ? 0.12 : 0.35);
        if (p <= 0) return null;
        const big = txt === "Gertrud";
        const y = 760 + Math.floor(i / 3) * 520 + (big ? 230 : 0);
        const x = big ? 540 : 300 + (i % 3) * 440;
        return <Chalk key={i} x={x} y={y} text={txt} size={big ? 230 : 150} p={p} font={big ? "Playfair" : "Anton"} color={big ? "#ffd6dc" : "#f4f1ea"} />;
      })}
      {/* lille hjerte tegnet med kridt */}
      {t > g2 && <path d="M880,1640 c-30,-40 -90,-10 -60,40 l60,60 l60,-60 c30,-50 -30,-80 -60,-40 z" fill="none" stroke="#ffd6dc" strokeWidth={8} opacity={easeOut((t - g2) / 0.3)} />}
    </S>
  );
};

// ------------------------------------------------------------------ Inspektøren + ADHD-stempel
export const Inspektor: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const adhd = wordTimes(line, "adhd")[0] ?? start + 2;
  const k = t - adhd;
  const words = lineOf(line).map((w) => w.t);
  return (
    <S cam={[1.0 + lt * 0.02 + (k > 0 ? 0.06 * Math.exp(-k * 7) : 0), 0, 0]}>
      <Office t={t} />
      <Bust who="inspektor" x={560} y={1500} s={1.35} t={t} smile={0} brow={-1} talk={talkAt(t, words)} look={-0.3} />
      <rect x={-300} y={1500} width={W + 600} height={600} fill="url(#wood)" />
      <g transform="translate(300,1560) rotate(-6)">
        <rect x={0} y={0} width={420} height={300} rx={8} fill="#e8c77a" />
        <text x={30} y={70} fontFamily="SpaceMonoB" fontSize={28} fill="#5a4320">
          ELEVMAPPE · ABDI
        </text>
        {k > 0 && (
          <g transform={`translate(210,180) scale(${1 + 0.6 * Math.exp(-k * 14)}) rotate(-12)`} opacity={clamp(k * 8)}>
            <rect x={-170} y={-60} width={340} height={120} rx={12} fill="none" stroke="#c0392b" strokeWidth={12} />
            <text x={0} y={36} textAnchor="middle" fontFamily="Anton" fontSize={100} fill="#c0392b" letterSpacing={8}>
              ADHD
            </text>
          </g>
        )}
      </g>
    </S>
  );
};

// ------------------------------------------------------------------ "han har bare meget energi"
export const Energi: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const en = wordTimes(line, "energi")[0] ?? start + 1;
  const k = t - en;
  const lvl = clamp(0.2 + easeOut((t - en + 0.4) / 0.5) * 0.8);
  const bounce = Math.abs(Math.sin(t * 8)) * (k > 0 ? 60 : 20);
  return (
    <S cam={[1.0 + beatPulse(t) * 0.03, 0, 0]}>
      <Classroom t={t} desks={false} />
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#f1c40f" opacity={k > 0 ? 0.12 * Math.abs(Math.sin(t * 10)) : 0} />
      <Bust who="abdi" x={540} y={1990 - bounce} s={1.45} t={t} smile={0.95} brow={0.8} look={Math.sin(t * 6) * 0.8} />
      {/* lyn */}
      {k > 0 &&
        [[180, 900], [880, 820], [140, 1300], [930, 1250]].map(([x, y], i) => (
          <path key={i} d={`M${x},${y} l40,-90 l-10,70 l50,-10 l-50,110 l12,-70 z`} fill="#f9e45b" stroke="#c99a10" strokeWidth={4} transform={`rotate(${Math.sin(t * 12 + i) * 15},${x},${y}) scale(${1 + Math.sin(t * 14 + i) * 0.1})`} style={{ transformOrigin: `${x}px ${y}px` }} />
        ))}
      {/* batteri */}
      <g transform="translate(840,620)">
        <rect x={-70} y={-150} width={140} height={300} rx={18} fill="#1d2330" stroke="#fff" strokeWidth={8} />
        <rect x={-30} y={-176} width={60} height={26} rx={6} fill="#fff" />
        <rect x={-54} y={134 - 268 * lvl} width={108} height={268 * lvl} rx={8} fill={lvl > 0.9 ? "#2ecc71" : "#f1c40f"} />
        <text x={0} y={230} textAnchor="middle" fontFamily="Anton" fontSize={60} fill="#fff">
          {Math.round(lvl * 100)}%
        </text>
      </g>
      <text x={0} y={0} opacity={0}>
        {lt}
      </text>
    </S>
  );
};

// ------------------------------------------------------------------ 02 → 10 på prøven
export const Karakter: React.FC<P> = ({ start, line }) => {
  const { t } = useTimes(start);
  const t02 = wordTimes(line, "02")[0] ?? start + 0.8;
  const t10 = wordTimes(line, "10")[0] ?? start + 3;
  const p10 = clamp((t - t10 + 0.05) / 0.35);
  return (
    <S cam={[1.0 + clamp((t - t10) / 1) * 0.06, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#wood)" />
      {/* gamle prøver med 02 */}
      {[0, 1, 2].map((i) => {
        const a = clamp((t - t02 + i * 0.15) / 0.2);
        return (
          <g key={i} transform={`translate(${200 + i * 60},${560 + i * 70}) rotate(${-14 + i * 8})`} opacity={0.5 + a * 0.5}>
            <rect x={0} y={0} width={420} height={560} fill="#f7f4ea" stroke="#d9d0bc" strokeWidth={3} />
            {Array.from({ length: 12 }).map((_, k) => (
              <rect key={k} x={40} y={80 + k * 36} width={260 + (k % 3) * 40} height={8} fill="#c9c2b2" />
            ))}
            {a > 0 && (
              <text x={300} y={140} fontFamily="Anton" fontSize={110} fill="#c0392b" transform={`rotate(-10,300,140)`} opacity={a}>
                02
              </text>
            )}
          </g>
        );
      })}
      {/* Gertruds prøve med 10 */}
      <g transform={`translate(330,${1040 - clamp((t - t10 + 0.6) / 0.5) * 60}) rotate(4)`}>
        <rect x={0} y={0} width={520} height={700} fill="#fffdf6" stroke="#d9d0bc" strokeWidth={4} />
        <text x={40} y={70} fontFamily="SpaceMonoB" fontSize={26} fill="#555">
          NAVN: ABDI
        </text>
        {Array.from({ length: 14 }).map((_, k) => (
          <rect key={k} x={40} y={110 + k * 36} width={300 + (k % 3) * 60} height={8} fill="#c9c2b2" />
        ))}
        <defs>
          <clipPath id="ten">
            <rect x={240} y={-40} width={300 * p10} height={320} />
          </clipPath>
        </defs>
        <text x={250} y={230} fontFamily="Anton" fontSize={240} fill="#c0392b" clipPath="url(#ten)">
          10
        </text>
        {p10 >= 1 && <text x={330} y={300} fontFamily="Playfair" fontStyle="italic" fontSize={54} fill="#c0392b" opacity={clamp((t - t10 - 0.3) * 4)}>Flot! ★</text>}
        {/* rød kuglepen */}
        <g transform={`translate(${250 + 290 * p10},${120 + Math.sin(p10 * 20) * 40}) rotate(30)`}>
          <rect x={-10} y={-200} width={20} height={200} rx={8} fill="#c0392b" />
          <path d="M-10,0 L10,0 L0,30 Z" fill="#e8d9b0" />
        </g>
      </g>
    </S>
  );
};

// ------------------------------------------------------------------ gaden: boligblokken om aftenen
export const Gaden: React.FC<P> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const gd = wordTimes(line, "gaden")[0] ?? start + 1.8;
  const zoom = smooth((t - gd + 0.2) / 0.6);
  const u = lt / dur;
  return (
    <S cam={[1.0 + u * 0.04 + zoom * 0.3, zoom * 20, -zoom * 300]}>
      <Estate t={t} cam={u * 80} />
      {/* de yngre langt tilbage ved bænken */}
      <Person x={400} y={1480} h={250} t={t} seed={4} pose="hang" top="#7a1f2a" head="cap" headCol="#f2f2f2" face={1} skin="#c88d63" />
      <Person x={470} y={1488} h={240} t={t} seed={5} pose="pockets" top="#2e4a7a" head="curls" face={0} skin="#a46c45" />
      <Person x={540} y={1478} h={255} t={t} seed={6} pose="phone" top="#3a3a3a" head="hood" headCol="#222" face={-1} skin="#8a5a38" />
      {/* de ældre ved bilen (mellemgrund) */}
      <Person x={790} y={1620} h={400} t={t} seed={1} pose="smoke" puffer top="#15171d" head="cap" headCol="#0d0d10" face={-1} skin="#8a5a38" />
      <Person x={900} y={1640} h={420} t={t} seed={2} pose="cross" puffer top="#2a2f22" head="beanie" headCol="#111" face={0} skin="#b07a52" />
      <Person x={1010} y={1610} h={390} t={t} seed={3} pose="phone" top="#1d2230" head="hood" face={-1} skin="#6e4a30" />
      {/* udkig */}
      <Person x={160} y={1700} h={460} t={t} seed={9} pose="pockets" puffer top="#1a1c22" head="beanie" headCol="#3a3a3a" face={Math.sin(t * 1.2) > 0 ? 1 : -1} skin="#9a6440" />
      {/* handlen i forgrunden */}
      <Person x={430} y={1930} h={660} t={t} seed={7} pose="deal" item="cash" puffer top="#101216" head="beanie" headCol="#26262c" face={1} skin="#7a4e32" />
      <Person x={650} y={1945} h={680} t={t} seed={8} pose="deal" item="bag" top="#2b2b33" head="cap" headCol="#1a1a1a" face={-1} skin="#b07a52" flip />
      {t > gd && <circle cx={540} cy={1560} r={90 * Math.exp(-(t - gd) * 2)} fill="url(#glowWhite)" />}
      {/* Abdi kommer gående i forgrunden */}
      <Person x={1000 - u * 160} y={2000} h={600} t={t} seed={10} pose="walk" top="#2c4a7a" head="curls" face={-1} skin="#c88d63" flip />
    </S>
  );
};

// ------------------------------------------------------------------ drømme
export const Drommer: React.FC<P> = ({ start }) => {
  const { lt, t } = useTimes(start);
  const icons: [string, string][] = [["🩺", "LÆGE"], ["✈️", "PILOT"], ["⚖️", "ADVOKAT"], ["🎓", "STUDENT"], ["🚀", "ASTRONAUT"]];
  return (
    <S cam={[1.0 + lt * 0.03, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#25305a" />
      {Array.from({ length: 60 }).map((_, i) => (
        <circle key={i} cx={random(`st${i}`) * W} cy={random(`sy${i}`) * 1400} r={1 + random(`sr${i}`) * 2.5} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i))} />
      ))}
      {icons.map(([ic, lb], i) => {
        const a = easeOut((lt - i * 0.22) / 0.3);
        const ang = -2.6 + i * 0.55;
        const x = 540 + Math.cos(ang) * 400, y = 1120 + Math.sin(ang) * 430 + Math.sin(t * 2 + i) * 14;
        return (
          <g key={i} opacity={a} transform={`translate(${x},${y}) scale(${0.6 + a * 0.4})`}>
            <circle r={95} fill="#fffaf0" />
            <circle r={95} fill="none" stroke="#f1c40f" strokeWidth={6} />
            <text y={30} textAnchor="middle" fontSize={90}>
              {ic}
            </text>
            <text y={140} textAnchor="middle" fontFamily="Anton" fontSize={38} fill="#fff">
              {lb}
            </text>
          </g>
        );
      })}
      <Bust who="abdi" x={540} y={1990} s={1.15} t={t} smile={0.6} brow={0.9} look={Math.sin(t) * 0.6} tilt={-4} />
    </S>
  );
};

// ------------------------------------------------------------------ "jeg vil være rig"
export const Rig: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const rig = wordTimes(line, "rig")[0] ?? start + 1.3;
  const k = t - rig;
  return (
    <S cam={[1.0 + lt * 0.03, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#2b2a1a" />
      <circle cx={540} cy={1100} r={900} fill="url(#sunGlow)" opacity={0.4} />
      {k > -1.0 &&
        Array.from({ length: 40 }).map((_, i) => {
          const st = random(`ms${i}`) * 1.2, kk = k - st + 1.0;
          if (kk < 0) return null;
          const x = random(`mx${i}`) * W, y = -100 + kk * (500 + random(`mv${i}`) * 400);
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${Math.sin(kk * 4 + i) * 40})`}>
              <rect x={-70} y={-34} width={140} height={68} rx={4} fill="#b9c99a" stroke="#7a8a5a" strokeWidth={3} />
              <circle r={18} fill="none" stroke="#7a8a5a" strokeWidth={3} />
            </g>
          );
        })}
      <Bust who="abdi" x={540} y={1990} s={1.45} t={t} smile={1} brow={0.9} />
      {/* solbriller + guldkæde */}
      <g transform={`translate(540,${1990 - 1.45 * 345})`}>
        <rect x={-108} y={-30} width={92} height={52} rx={20} fill="#0b0b10" />
        <rect x={16} y={-30} width={92} height={52} rx={20} fill="#0b0b10" />
        <rect x={-16} y={-14} width={32} height={8} fill="#0b0b10" />
        <path d="M-90,-20 L-60,-20" stroke="#fff" strokeWidth={5} opacity={0.6} />
      </g>
      <path d={`M380,${1990 - 1.45 * 175} Q540,${1990 - 1.45 * 40} 700,${1990 - 1.45 * 175}`} stroke="url(#gold)" strokeWidth={18} fill="none" strokeDasharray="22 6" />
      <text x={0} y={0} opacity={0}>
        {lt}
      </text>
    </S>
  );
};

// ------------------------------------------------------------------ "jeg vil være fri"
export const Fri: React.FC<P> = ({ start, line, dur }) => {
  const { lt, t } = useTimes(start);
  const fri = wordTimes(line, "fri")[0] ?? start + 1.2;
  const run = clamp(lt / dur);
  return (
    <S cam={[1.15 - run * 0.1, 0, -200]}>
      <SchoolExterior t={t} hour={15.0} />
      <Kid x={540 + run * 380} y={1840 - Math.abs(Math.sin(t * 12)) * 20} h={420} t={t} run={1} />
      {/* rygsæk der flyver af */}
      {t > fri && (
        <g transform={`translate(${560 + (t - fri) * 500},${1600 - (t - fri) * 900 + (t - fri) * (t - fri) * 900}) rotate(${(t - fri) * 500})`}>
          <rect x={-40} y={-50} width={80} height={100} rx={18} fill="#e74c3c" />
          <rect x={-30} y={-10} width={60} height={34} rx={8} fill="#c0392b" />
        </g>
      )}
      {/* fugle */}
      {t > fri && Array.from({ length: 6 }).map((_, i) => {
        const kk = t - fri;
        const x = 500 + i * 60 + kk * 300, y = 1200 - kk * 500 - i * 40;
        const fl = Math.sin(t * 18 + i) * 14;
        return <path key={i} d={`M${x - 30},${y - fl} Q${x - 12},${y - 10} ${x},${y} Q${x + 12},${y - 10} ${x + 30},${y - fl}`} stroke="#2a2a2e" strokeWidth={6} fill="none" />;
      })}
    </S>
  );
};

// ------------------------------------------------------------------ "lave para … være G"
export const Para: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const g = wordTimes(line, "g")[0] ?? start + 1.2;
  const k = t - g;
  return (
    <S cam={[1.0 + lt * 0.03 + (k > 0 ? 0.05 * Math.exp(-k * 6) : 0), 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#1b1d24" />
      <circle cx={540} cy={1000} r={800} fill="url(#sunGlow)" opacity={0.3} />
      {/* seddelbunker */}
      {[220, 400, 680, 860].map((x, i) =>
        Array.from({ length: 7 }).map((_, j) => (
          <rect key={`${i}${j}`} x={x - 90} y={1620 - j * 22 - (i % 2) * 30} width={180} height={80} rx={4} fill={j % 2 ? "#b9c99a" : "#a8b88a"} stroke="#7a8a5a" strokeWidth={2} />
        )),
      )}
      <rect x={-300} y={1700} width={W + 600} height={500} fill="url(#wood)" />
      {/* stort G-vedhæng */}
      <g transform={`translate(540,${920 - (k > 0 ? 0 : 400 * (1 - clamp((t - g + 0.5) / 0.5)))}) scale(${k > 0 ? 1 + 0.3 * Math.exp(-k * 8) : 1})`}>
        <line x1={0} y1={-600} x2={0} y2={-230} stroke="url(#gold)" strokeWidth={14} strokeDasharray="20 6" />
        <circle r={230} fill="url(#gold)" />
        <circle r={200} fill="#1b1d24" />
        <text y={110} textAnchor="middle" fontFamily="Anton" fontSize={330} fill="url(#gold)">
          G
        </text>
        {k > 0 && <circle cx={120} cy={-120} r={90 * Math.exp(-k * 3)} fill="url(#glowWhite)" />}
      </g>
    </S>
  );
};

// ------------------------------------------------------------------ drengeværelset: plakater + mikrofon (rap / kloge / de to)
export const Bedroom: React.FC<P & { mode: "rap" | "kloge" | "deto" }> = ({ start, mode }) => {
  const { lt, t } = useTimes(start);
  const poster = (x: number, kind: "bandana" | "crown") => (
    <g transform={`translate(${x},640)`}>
      <rect x={-180} y={-260} width={360} height={520} fill="#1c1c22" stroke="#e8e0d0" strokeWidth={10} />
      <rect x={-180} y={-260} width={360} height={520} fill={kind === "bandana" ? "#6a2a2a" : "#2a3a6a"} opacity={0.6} />
      {/* generisk silhuet */}
      <ellipse cx={0} cy={-30} rx={80} ry={100} fill="#0b0b0e" />
      <path d="M-160,260 Q-150,90 0,70 Q150,90 160,260 Z" fill="#0b0b0e" />
      {kind === "bandana" ? <path d="M-84,-80 Q0,-140 84,-80 L90,-50 L-90,-50 Z" fill="#2a4aa8" /> : <path d="M-70,-110 L-50,-170 L-20,-130 L0,-185 L20,-130 L50,-170 L70,-110 Z" fill="url(#gold)" />}
      {mode === "kloge" && (
        <g opacity={easeOut((lt - 0.2) / 0.4)}>
          <circle cx={0} cy={-230} r={60} fill="#fff6c8" />
          <circle cx={0} cy={-230} r={140} fill="url(#sunGlow)" />
          <rect x={-22} y={-178} width={44} height={30} fill="#9a9a9a" />
        </g>
      )}
      <text x={0} y={235} textAnchor="middle" fontFamily="Anton" fontSize={40} fill="#e8e0d0">
        {kind === "bandana" ? "WEST" : "EAST"}
      </text>
    </g>
  );
  return (
    <S cam={[1.0 + lt * 0.03, 0, 0]}>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#2e2a44" />
      {/* LED-strip langs loftet */}
      <rect x={-300} y={-300} width={W + 600} height={330} fill="#1e1a30" />
      <rect x={-300} y={24} width={W + 600} height={8} fill="#c86bff" />
      <rect x={-300} y={20} width={W + 600} height={200} fill="#c86bff" opacity={0.12} />
      {/* vindue ud mod blokken om aftenen */}
      <g transform="translate(560,1060)">
        <rect x={0} y={0} width={420} height={300} fill="#1b2240" />
        {Array.from({ length: 24 }).map((_, i) => (
          <rect key={i} x={20 + (i % 8) * 50} y={30 + Math.floor(i / 8) * 80} width={26} height={34} fill="#ffcf86" opacity={random(`bw${i}`) < 0.5 ? 0.9 : 0.1} />
        ))}
        <rect x={0} y={0} width={420} height={300} fill="none" stroke="#e8e0d0" strokeWidth={14} />
        <line x1={210} y1={0} x2={210} y2={300} stroke="#e8e0d0" strokeWidth={10} />
      </g>
      {/* seng med dyne og puder */}
      <g transform="translate(-60,1420)">
        <rect x={0} y={0} width={620} height={220} rx={12} fill="#4a3a2a" />
        <path d="M0,10 Q300,-40 620,10 L620,180 L0,180 Z" fill="#5a6aa0" />
        <path d="M60,10 Q300,-30 600,20" stroke="#7a8ac0" strokeWidth={8} fill="none" />
        <ellipse cx={120} cy={-10} rx={110} ry={40} fill="#e8e8f0" />
      </g>
      {/* skrivebord med laptop + højttaler */}
      <g transform="translate(600,1420)">
        <rect x={0} y={0} width={420} height={20} fill="#6e4e30" />
        <rect x={20} y={20} width={14} height={260} fill="#3a2a1e" />
        <rect x={380} y={20} width={14} height={260} fill="#3a2a1e" />
        <path d="M120,0 L300,0 L290,-14 L130,-14 Z" fill="#9a9aa8" />
        <path d="M140,-14 L280,-14 L270,-130 L150,-130 Z" fill="#1a1a24" />
        <rect x={156} y={-122} width={108} height={98} fill="#5a8aff" opacity={0.6} />
        <rect x={330} y={-110} width={60} height={110} rx={8} fill="#111" />
        <circle cx={360} cy={-40} r={20} fill="#2a2a30" />
        <circle cx={360} cy={-85} r={10} fill="#2a2a30" />
      </g>
      {/* skokasser */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={40} y={1660 - i * 60} width={160} height={58} fill={["#e67e22", "#c0392b", "#ecf0f1"][i]} stroke="#222" strokeWidth={3} />
      ))}
      <rect x={-300} y={1640} width={W + 600} height={700} fill="#3a2e28" />
      <circle cx={540} cy={500} r={700} fill="url(#sunGlow)" opacity={0.15} />
      {mode !== "deto" ? (
        <>
          {poster(290, "bandana")}
          {poster(790, "crown")}
        </>
      ) : (
        // to skygger på væggen
        [300, 780].map((x, i) => (
          <g key={i} opacity={0.75}>
            <ellipse cx={x} cy={600} rx={110} ry={135} fill="#15121e" />
            <path d={`M${x - 220},1100 Q${x - 200},780 ${x},760 Q${x + 200},780 ${x + 220},1100 Z`} fill="#15121e" />
          </g>
        ))
      )}
      {mode === "kloge" &&
        Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={160 + i * 130} y={1150 - (i % 3) * 20} width={110} height={170} fill={["#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#d35400", "#16a085"][i]} stroke="#1a1a1a" strokeWidth={3} />
        ))}
      <Bust who="abdi" x={540} y={1990} s={1.25} t={t} smile={mode === "rap" ? 0.9 : 0.4} brow={mode === "deto" ? 0.2 : 0.6} look={mode === "deto" ? Math.sin(t * 1.5) : 0} />
      {mode === "rap" && (
        <g transform="translate(830,1520) rotate(-12)">
          <rect x={-8} y={0} width={16} height={600} fill="#2a2a30" />
          <rect x={-42} y={-110} width={84} height={130} rx={42} fill="#3a3a44" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={-40} y1={-90 + i * 18} x2={40} y2={-90 + i * 18} stroke="#55556a" strokeWidth={3} />
          ))}
        </g>
      )}
    </S>
  );
};

// ------------------------------------------------------------------ "lære at læse i en bog"
export const Bog: React.FC<P> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const bog = wordTimes(line, "bog")[0] ?? start + 1.6;
  const open = easeOut((t - bog + 0.6) / 0.6);
  const k = t - bog;
  return (
    <S cam={[1.0 + lt * 0.03, 0, 0]}>
      <Classroom t={t} desks={false} sun={0.6} />
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#1a1410" opacity={0.35} />
      <Bust who="abdi" x={540} y={1700} s={1.05} t={t} smile={0.5} brow={0.4} look={0} tilt={4} />
      <rect x={-300} y={1500} width={W + 600} height={700} fill="url(#wood)" />
      {/* bog der åbnes */}
      <g transform="translate(540,1560)">
        <path d={`M0,0 L${-380 * open},${-30} L${-380 * open},${260} L0,290 Z`} fill="#fbf6e8" stroke="#c9b98a" strokeWidth={3} />
        <path d={`M0,0 L${380},${-30} L380,260 L0,290 Z`} fill="#fbf6e8" stroke="#c9b98a" strokeWidth={3} />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={40} y={20 + i * 30} width={280} height={8} fill="#c9c2b2" opacity={open} />
        ))}
        <circle cx={0} cy={100} r={500 * open} fill="url(#sunGlow)" opacity={0.8 * open} />
      </g>
      {/* bogstaver flyver op */}
      {k > -0.3 &&
        "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("").map((c, i) => {
          const kk = k + 0.3 - random(`lt${i}`) * 0.8;
          if (kk < 0) return null;
          const x = 540 + (random(`lx${i}`) - 0.5) * 900 * Math.min(1, kk), y = 1560 - kk * (500 + random(`lv${i}`) * 500);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={60 + random(`ls${i}`) * 50} fill="#fff3c8" opacity={Math.max(0, 1 - kk * 0.5)}>
              {c}
            </text>
          );
        })}
    </S>
  );
};

// ------------------------------------------------------------------ OUTRO
export const Outro: React.FC<P> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const row = (icon: string, big: string, small: string, d: number) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 22, opacity: clamp(d * 3), translate: `${(1 - easeOut(d)) * 60}px 0px`, marginBottom: 18 }}>
      <span style={{ fontFamily: "Anton", fontSize: 76, color: "#f1c40f", width: 80, textAlign: "center" }}>{icon}</span>
      <span style={{ fontFamily: "Anton", fontSize: 104, color: "#fffaf0" }}>{big}</span>
      <span style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 46, color: "#e8e0d0" }}>{small}</span>
    </div>
  );
  return (
    <>
      <S cam={[1.04 - lt * 0.01, 0, 0]}>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#wood)" />
        <rect x={30} y={60} width={1020} height={1800} fill="url(#board)" />
        <ellipse cx={540} cy={900} rx={520} ry={700} fill="url(#chalkDust)" />
        <Bust who="gertrud" x={820} y={1880} s={0.85} t={t} smile={0.95} brow={0.6} look={-0.6} />
        <Bust who="abdi" x={300} y={1900} s={0.78} t={t + 1} smile={0.95} brow={0.6} look={0.6} />
      </S>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <div style={{ textAlign: "center", opacity: easeOut(lt / 0.3) }}>
          <div style={{ fontFamily: "Anton", fontSize: 190, color: "#f4f1ea", letterSpacing: "0.12em", textShadow: "0 0 20px rgba(255,255,255,.25)" }}>GIGIS</div>
          <div style={{ width: 140, height: 6, backgroundColor: "#f1c40f", margin: "4px auto 10px" }} />
          <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 120, color: "#ffd6dc" }}>Gertrud</div>
        </div>
        <div style={{ alignSelf: "flex-start", marginLeft: 100, marginTop: 60 }}>
          {row("♥", "LIKE", "hvis den ramte", (lt - 0.4) / 0.3)}
          {row("+", "FØLG", "for mere", (lt - 0.6) / 0.3)}
          {row("✎", "SKRIV", "hvad du synes", (lt - 0.8) / 0.3)}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: smooth((lt - (dur - 0.5)) / 0.5) }} />
    </>
  );
};
