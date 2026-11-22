import React from "react";
import { random } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Dust } from "../components/City";
import { MaskedBust } from "../components/Masked";
import { wordTimes } from "../data/timing";
import { PAL, W, easeOut, beatPulse } from "../lib";

/** Passagerfly (737-agtigt) set fra siden, flyver mod venstre. Fiktivt selskab. */
const Airliner: React.FC<{ x: number; y: number; s: number; t: number; rot: number }> = ({ x, y, s, t, rot }) => {
  const strobe = (t * 1.2) % 1 < 0.06 ? 1 : 0;
  const beacon = (t * 1.0 + 0.5) % 1 < 0.12 ? 1 : 0;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {/* landingslys-kegler */}
      <polygon points="-120,40 -2200,-300 -2200,400" fill="url(#coneWhiteL)" opacity={0.45} style={{ mixBlendMode: "screen" }} />
      {/* fjerneste vinge (skygge) */}
      <polygon points="-140,10 60,10 260,-60 180,-62" fill="#8d95a8" />
      {/* krop */}
      <path d="M-700,12 Q-702,-38 -640,-58 L560,-62 Q640,-60 700,-112 L724,-112 L704,-24 Q684,40 560,60 L-620,62 Q-698,60 -700,12 Z" fill="url(#fuselage)" stroke="#9aa3b8" strokeWidth={2} />
      {/* bug-stribe (bemaling) */}
      <path d="M-690,30 Q-640,60 -560,60 L560,58 Q650,48 704,-24 L690,-8 Q640,30 560,36 L-600,40 Q-660,40 -690,30 Z" fill="#0aa3b5" />
      <path d="M-640,46 L560,44" stroke="#f5a623" strokeWidth={6} />
      {/* cockpit-vinduer */}
      <path d="M-660,-34 L-640,-46 L-610,-48 L-612,-30 Z" fill="#0b1020" />
      <path d="M-606,-48 L-578,-49 L-580,-31 L-608,-30 Z" fill="#0b1020" />
      {/* passagervinduer */}
      {Array.from({ length: 46 }).map((_, i) => (
        <rect key={i} x={-540 + i * 22} y={-30} width={10} height={14} rx={4} fill="#0e1424" />
      ))}
      {Array.from({ length: 46 }).map((_, i) => (random(`pw${i}`) < 0.5 ? <rect key={`l${i}`} x={-539 + i * 22} y={-29} width={8} height={12} rx={4} fill="#ffe3a8" opacity={0.8} /> : null))}
      {/* døre */}
      {[-560, -90, 500].map((dx) => (
        <rect key={dx} x={dx} y={-46} width={26} height={70} rx={8} fill="none" stroke="#7e879c" strokeWidth={2} />
      ))}
      {/* navn + registrering */}
      <text x={-380} y={-38} fontFamily="Anton" fontSize={34} fill="#0b3b6e" letterSpacing={4}>
        CARIBE AIR
      </text>
      <text x={430} y={20} fontFamily="SpaceMonoB" fontSize={18} fill="#1a2233">
        HI-1047
      </text>
      {/* halefinne med palme-logo */}
      <path d="M520,-62 L606,-62 L724,-292 L664,-292 Z" fill="#0b3b6e" />
      <path d="M600,-90 Q620,-170 670,-230" stroke="#f5a623" strokeWidth={8} fill="none" />
      {[-40, 0, 40, 80].map((a, i) => (
        <path key={i} d={`M670,-230 q${Math.cos((a * Math.PI) / 180) * 50},${Math.sin((a * Math.PI) / 180) * 30 - 30} ${Math.cos((a * Math.PI) / 180) * 70},${Math.sin((a * Math.PI) / 180) * 20}`} stroke="#0aa3b5" strokeWidth={10} fill="none" strokeLinecap="round" />
      ))}
      <path d="M600,-26 L730,-8 L716,2 L596,-6 Z" fill="#c4cad8" />
      {/* nærmeste vinge + motor */}
      <polygon points="-170,24 80,24 300,108 196,112" fill="#d6dbe6" stroke="#8d95a8" strokeWidth={2} />
      <path d="M296,108 L304,70" stroke="#d6dbe6" strokeWidth={8} />
      <path d="M-230,62 Q-236,40 -210,34 L-60,34 Q-20,40 -20,70 Q-20,100 -60,106 L-210,106 Q-236,100 -230,62 Z" fill="url(#fuselage)" stroke="#8d95a8" strokeWidth={2} />
      <ellipse cx={-228} cy={70} rx={12} ry={34} fill="#20242e" />
      <ellipse cx={-226} cy={70} rx={6} ry={22} fill="#0a0c10" />
      <path d="M-20,58 L30,62 L30,80 L-20,84 Z" fill="#7e879c" />
      {/* landingsstel */}
      <line x1={-20} y1={60} x2={-20} y2={150} stroke="#5a6274" strokeWidth={10} />
      <circle cx={-34} cy={158} r={18} fill="#0b0c10" />
      <circle cx={-6} cy={158} r={18} fill="#0b0c10" />
      <line x1={-560} y1={60} x2={-560} y2={136} stroke="#5a6274" strokeWidth={8} />
      <circle cx={-560} cy={144} r={14} fill="#0b0c10" />
      {/* lys */}
      <circle cx={-120} cy={40} r={70} fill="url(#glowWhite)" />
      <circle cx={-120} cy={40} r={14} fill="#fff" />
      <circle cx={300} cy={108} r={40} fill="url(#glowWhite)" opacity={0.6 + strobe * 0.4} />
      <circle cx={300} cy={108} r={9} fill="#7dff9a" />
      <circle cx={724} cy={-290} r={60} fill="url(#glowWhite)" opacity={strobe} />
      <circle cx={0} cy={-64} r={40} fill="url(#glowRed)" opacity={beacon} />
      <circle cx={0} cy={64} r={40} fill="url(#glowRed)" opacity={beacon} />
      <circle cx={650} cy={-200} r={160} fill="url(#glowWhite)" opacity={0.18} />
    </g>
  );
};

/** Split-flap tavle-række */
const Flap: React.FC<{ x: number; y: number; text: string; t: number; t0: number; size?: number; color?: string }> = ({ x, y, text, t, t0, size = 52, color = "#ffd28a" }) => {
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ0123456789 ";
  return (
    <g>
      {text.split("").map((c, i) => {
        const k = t - t0 - i * 0.03;
        const done = k > 0.35;
        const ch = done ? c : CH[Math.floor(random(`${text}${i}${Math.floor(t * 20)}`) * CH.length)];
        return (
          <g key={i}>
            <rect x={x + i * size * 0.72} y={y - size} width={size * 0.66} height={size * 1.2} rx={4} fill="#0b0c10" />
            <line x1={x + i * size * 0.72} y1={y - size * 0.4} x2={x + i * size * 0.72 + size * 0.66} y2={y - size * 0.4} stroke="#000" strokeWidth={2} />
            <text x={x + i * size * 0.72 + size * 0.33} y={y} textAnchor="middle" fontFamily="SpaceMonoB" fontSize={size * 0.9} fill={k < 0 ? "#444" : color}>
              {k < 0 ? " " : ch}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** "'Cita fløjet ind fra Dominicana": flyet lander i Kastrup om natten + ankomsttavle. */
export const PlaneLand: React.FC<{ start: number; dur: number; line: number }> = ({ start, dur, line }) => {
  const { lt, t } = useTimes(start);
  const u = lt / dur;
  const dom = wordTimes(line, "dominicana")[0] ?? start + 1.5;
  const gy = 1350;
  return (
    <Stage cam={[1.0 + u * 0.06, 0, 0]}>
      <Sky t={t} moon={[860, 330]} />
      <rect x={-300} y={gy - 80} width={W + 600} height={90} fill="#0b0e18" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={i * 90} y={gy - 80 - random(`ap${i}`) * 140} width={70} height={160} fill="#0a0c14" />
      ))}
      <rect x={-300} y={gy} width={W + 600} height={900} fill="#06080e" />
      {/* landingsbane i perspektiv med kantlys + "kanin"-lys */}
      <polygon points={`490,${gy} 590,${gy} 1300,1920 -220,1920`} fill="#0d1019" />
      {Array.from({ length: 16 }).map((_, i) => {
        const z = i / 16, y = gy + Math.pow(z, 2) * (1920 - gy);
        const xl = 490 - z * z * 710, xr = 590 + z * z * 710;
        return (
          <g key={i}>
            <circle cx={xl} cy={y} r={3 + z * 10} fill="#fff1c8" />
            <circle cx={xr} cy={y} r={3 + z * 10} fill="#fff1c8" />
            <circle cx={xl} cy={y} r={20 + z * 50} fill="url(#glowAmber)" opacity={0.6} />
            <circle cx={xr} cy={y} r={20 + z * 50} fill="url(#glowAmber)" opacity={0.6} />
            <rect x={538 - z * 6} y={y} width={4 + z * 12} height={8 + z * 40} fill="#e8edf6" opacity={0.6} />
          </g>
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const on = Math.floor(t * 16) % 8 === i;
        return <circle key={`rb${i}`} cx={540} cy={gy - 10 - i * 8} r={on ? 14 : 4} fill="#fff" opacity={on ? 1 : 0.4} />;
      })}
      <Airliner x={1650 - u * 1700} y={480 + u * 560} s={1.0} t={t} rot={-9 + u * 3} />
      {/* ankomsttavle */}
      <g>
        <rect x={40} y={1560} width={1000} height={300} rx={16} fill="#111318" stroke="#2b2f3a" strokeWidth={4} />
        <text x={70} y={1615} fontFamily="SpaceMonoB" fontSize={30} fill="#aab3c6" letterSpacing={4}>
          ANKOMST · ARRIVALS · KØBENHAVN
        </text>
        <Flap x={70} y={1710} text="CB1047 PUNTA CANA" t={t} t0={start + 0.2} size={50} />
        <Flap x={70} y={1810} text={t > dom ? "LANDET  23:47" : "VENTET  23:45"} t={t} t0={t > dom ? dom : start + 0.4} size={50} color={t > dom ? "#7dff9a" : "#ffd28a"} />
      </g>
    </Stage>
  );
};

/** Pengeseddel (generisk design) */
const Note: React.FC<{ x: number; y: number; w: number; rot?: number; o?: number }> = ({ x, y, w, rot = 0, o = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
    <rect x={-w / 2} y={-w * 0.25} width={w} height={w * 0.5} rx={4} fill="#b9c4a6" />
    <rect x={-w / 2} y={-w * 0.25} width={w * 0.35} height={w * 0.5} fill="#9aa88a" />
    <circle cx={w * 0.18} cy={0} r={w * 0.14} fill="none" stroke="#6b7a5c" strokeWidth={3} />
    <text x={-w * 0.42} y={-w * 0.08} fontFamily="Anton" fontSize={w * 0.14} fill="#3f4d34">
      1000
    </text>
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={-w * 0.1} y1={-w * 0.18 + i * w * 0.07} x2={w * 0.45} y2={-w * 0.18 + i * w * 0.07} stroke="#8f9c7f" strokeWidth={1.5} />
    ))}
  </g>
);

/** "Flous": pengetællemaskine der ruller sedler igennem, LCD tæller op, bundter med banderoler. */
export const Cash: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const count = Math.floor(easeOut(lt / dur) * 250) * 1000;
  const bp = beatPulse(t);
  return (
    <Stage cam={[1.05 + lt * 0.03 + bp * 0.01, 0, 0]} bg="#06070a">
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#0b0c10" />
      <circle cx={540} cy={500} r={1000} fill="url(#glowWhite)" opacity={0.12} />
      <rect x={-300} y={1350} width={W + 600} height={800} fill="#1a1712" />
      {/* bundter */}
      {[[170, 1500], [300, 1460], [820, 1500], [930, 1450]].map(([x, y], i) =>
        Array.from({ length: 6 }).map((_, k) => (
          <g key={`${i}${k}`}>
            <Note x={x} y={y - k * 26} w={230} />
            {k === 5 && <rect x={x - 30} y={y - k * 26 - 58} width={60} height={116} fill="#c9542f" />}
          </g>
        )),
      )}
      {/* maskinen */}
      <rect x={300} y={980} width={480} height={420} rx={30} fill="#d9dde6" />
      <rect x={300} y={980} width={480} height={420} rx={30} fill="url(#chrome)" opacity={0.3} />
      <rect x={360} y={1180} width={360} height={140} rx={12} fill="#0b1a10" />
      <text x={700} y={1280} textAnchor="end" fontFamily="SpaceMonoB" fontSize={74} fill="#7dff9a">
        {count.toLocaleString("da-DK")}
      </text>
      <text x={380} y={1215} fontFamily="SpaceMonoB" fontSize={22} fill="#4fa86a">
        KR · DKK
      </text>
      {/* sedler i bakken der flipper */}
      {Array.from({ length: 10 }).map((_, i) => {
        const ph = (t * 14 + i / 10) % 1;
        return <Note key={i} x={540} y={960 - ph * 40} w={300} rot={-ph * 70} o={1 - ph} />;
      })}
      <Note x={540} y={985} w={300} />
      {/* sedler der skydes ud forrest */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ph = (t * 6 + i / 8) % 1;
        return <Note key={`o${i}`} x={540} y={1420 + ph * 200} w={300} rot={ph * 8} o={1 - ph * 0.6} />;
      })}
      <Dust t={t} n={40} color="#e6eedd" />
    </Stage>
  );
};

/** "Stilen bar' Christian Dior": model bagfra i sort jakke med DIOR på ryggen, catwalk med blitz. */
export const DiorWalk: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const u = lt / dur;
  const flashes = [0.1, 0.35, 0.55, 0.9, 1.2, 1.45];
  let fl = 0;
  flashes.forEach((f, i) => (fl = Math.max(fl, lt > f ? Math.exp(-(lt - f) * 12) * (i % 2 ? 0.8 : 1) : 0)));
  const sway = Math.sin(t * 6) * 6;
  return (
    <Stage cam={[1.0 + u * 0.1, 0, -u * 80]}>
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#07070b" />
      {/* catwalk i perspektiv */}
      <polygon points="480,700 600,700 1100,1920 -20,1920" fill="#15141a" />
      {Array.from({ length: 10 }).map((_, i) => {
        const z = i / 10, y = 700 + Math.pow(z, 1.6) * 1220;
        return (
          <g key={i}>
            <circle cx={480 - z * 500} cy={y} r={4 + z * 8} fill="#fff" />
            <circle cx={600 + z * 500} cy={y} r={4 + z * 8} fill="#fff" />
          </g>
        );
      })}
      <circle cx={540} cy={650} r={500} fill="url(#glowWhite)" opacity={0.5} />
      {/* fotografer-silhuetter + blitz */}
      {[[60, 1300], [140, 1100], [980, 1250], [900, 1050]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 40} y={y} width={80} height={600} fill="#030305" />
          <circle cx={x} cy={y - 20} r={36} fill="#030305" />
          <rect x={x + (x < 540 ? 20 : -60)} y={y + 20} width={40} height={30} fill="#030305" />
          {flashes[i] < lt && <circle cx={x + (x < 540 ? 40 : -40)} cy={y + 30} r={220} fill="url(#glowWhite)" opacity={Math.exp(-(lt - flashes[i]) * 10)} />}
        </g>
      ))}
      {/* model bagfra */}
      <g transform={`translate(${540 + sway},${1900 - u * 160}) scale(${0.95 - u * 0.15})`}>
        <path d={`M-70,-560 L-90,0 L-30,0 L-10,-420 L10,-420 L30,0 L90,0 L70,-560 Z`} fill="#0c0c10" />
        <path d="M-200,-1100 Q-230,-1080 -235,-1000 L-240,-560 L240,-560 L235,-1000 Q230,-1080 200,-1100 Q100,-1140 0,-1140 Q-100,-1140 -200,-1100 Z" fill="url(#pufferGrad)" />
        <path d="M-235,-1050 Q-300,-900 -290,-640 L-240,-640 L-230,-980 Z M235,-1050 Q300,-900 290,-640 L240,-640 L230,-980 Z" fill="#0b0c12" />
        <rect x={-240} y={-600} width={480} height={50} fill="#16171d" />
        <text x={0} y={-830} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={150} letterSpacing={14} fill="#f2f2f2">
          DIOR
        </text>
        <path d="M-60,-1140 L-56,-1200 L56,-1200 L60,-1140 Z" fill="#5b3a2a" />
        <ellipse cx={0} cy={-1290} rx={92} ry={110} fill="#5b3a2a" />
        <path d="M-92,-1300 Q-96,-1410 0,-1410 Q96,-1410 92,-1300 Q80,-1350 0,-1352 Q-80,-1350 -92,-1300 Z" fill="#0b0705" />
        <path d="M-200,-1100 Q0,-1150 200,-1100" stroke="#fff" strokeWidth={6} opacity={0.4} fill="none" />
      </g>
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#fff" opacity={fl * 0.45} />
    </Stage>
  );
};

/** "men slår": set indefra en sportsbutik – maskeret mand slår ruden ind med hammer. Glas splintres mod kameraet. */
export const Robbery: React.FC<{ start: number; dur: number; line: number }> = ({ start, line }) => {
  const { lt, t } = useTimes(start);
  const hit = wordTimes(line, "slår")[0] ?? start + 1.2;
  const k = t - hit;
  const raise = k < 0 ? easeOut(lt / Math.max(0.3, hit - start - 0.15)) : 1;
  const swing = k < 0 ? 0 : easeOut(k / 0.08);
  const alarm = k > 0 ? (Math.floor(t * 6) % 2 === 0 ? 1 : 0) : 0;
  const cracks: React.ReactNode[] = [];
  if (k > 0) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + random(`ca${i}`) * 0.3;
      let x = 560, y = 860;
      const pts = [`${x},${y}`];
      for (let s = 0; s < 8; s++) {
        x += Math.cos(a + (random(`cs${i}${s}`) - 0.5) * 0.5) * 110;
        y += Math.sin(a + (random(`cs${i}${s}`) - 0.5) * 0.5) * 110;
        pts.push(`${x},${y}`);
      }
      cracks.push(<polyline key={i} points={pts.join(" ")} fill="none" stroke="#fff" strokeWidth={3} opacity={0.9} />);
    }
    for (let r = 1; r < 5; r++) cracks.push(<circle key={`r${r}`} cx={560} cy={860} r={r * 120 + random(`cr${r}`) * 30} fill="none" stroke="#fff" strokeWidth={2} opacity={0.6} strokeDasharray="40 30" />);
  }
  const shards: React.ReactNode[] = [];
  if (k > 0)
    for (let i = 0; i < 40; i++) {
      const a = random(`sa${i}`) * Math.PI * 2, v = 600 + random(`sv${i}`) * 1400;
      const x = 560 + Math.cos(a) * v * k, y = 860 + Math.sin(a) * v * k + 900 * k * k;
      const sz = 20 + random(`sz${i}`) * 60 + k * 80;
      shards.push(<polygon key={i} points={`${x},${y} ${x + sz},${y + sz * 0.3} ${x + sz * 0.4},${y + sz}`} fill="#dfe9ff" opacity={Math.max(0, 0.8 - k)} transform={`rotate(${k * 400 * (random(`sr${i}`) - 0.5)},${x},${y})`} />);
    }
  return (
    <Stage cam={[1.0 + (k > 0 ? 0.08 * Math.exp(-k * 5) : lt * 0.02), 0, 0]}>
      {/* udenfor: Strøget om natten (sløret) */}
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#0b0e18" />
      <circle cx={200} cy={300} r={500} fill="url(#glowAmber)" opacity={0.4} />
      <circle cx={900} cy={500} r={400} fill="url(#glowAmber)" opacity={0.3} />
      {/* maskeret mand udenfor ruden med hammer */}
      <MaskedBust x={520} y={2100} s={0.9} t={t} look={-0.3} />
      <g transform={`rotate(${-60 + raise * -40 + swing * 110},760,1250)`}>
        <rect x={750} y={700} width={22} height={560} rx={8} fill="#3a2a1a" />
        <rect x={700} y={660} width={130} height={70} rx={8} fill="#5a6070" stroke="#9aa3c0" strokeWidth={3} />
        <ellipse cx={760} cy={1180} rx={46} ry={60} fill="#050507" />
      </g>
      {/* butiksrude (vi står indenfor): skilt bagfra + glasrefleks */}
      <rect x={-300} y={-300} width={W + 600} height={180} fill="#0d0f16" />
      <text x={540} y={-160} textAnchor="middle" fontFamily="Anton" fontSize={90} fill="#e8e8ee" opacity={0.5} transform="scale(-1,1) translate(-1080,0)">
        SPORT
      </text>
      <rect x={-300} y={-120} width={W + 600} height={2200} fill="#c8d6ff" opacity={0.05} />
      <polygon points="-100,-120 200,-120 -100,1500" fill="#ffffff" opacity={0.05} />
      {/* sneakers på hylden forrest (indenfor) */}
      <rect x={-300} y={1700} width={W + 600} height={400} fill="#121520" />
      {[100, 330, 560, 790, 1000].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 90},1700 L${x - 90},1650 Q${x - 40},1610 ${x + 30},1625 L${x + 100},1660 L${x + 100},1700 Z`} fill={["#f2f2f2", "#c41a28", "#1b1d26", "#e8e1cf", "#2a62d8"][i]} />
          <rect x={x - 90} y={1690} width={190} height={14} fill="#ddd" />
        </g>
      ))}
      {cracks}
      {k > 0 && <circle cx={560} cy={860} r={260 * (1 - Math.exp(-k * 8))} fill="url(#glowWhite)" opacity={Math.max(0, 0.9 - k * 2)} />}
      {shards}
      {/* alarmlys */}
      <rect x={-300} y={-300} width={W + 600} height={2600} fill={alarm ? PAL.red : "#2a62d8"} opacity={k > 0 ? 0.18 : 0} />
    </Stage>
  );
};

/** "Jeg gi'r hva' jeg får": tæt på to hænder der bytter et seddelbundt ved bilruden. */
export const Give2: React.FC<{ start: number; line: number }> = ({ start, line }) => {
  const { t } = useTimes(start);
  const gir = wordTimes(line, "gi'r")[0] ?? start + 0.3;
  const r = easeOut((t - gir + 0.15) / 0.45);
  return (
    <Stage cam={[1.0, 0, 0]} bg="#05060a">
      <rect x={-300} y={-300} width={W + 600} height={2600} fill="#0a0c14" />
      <circle cx={300} cy={400} r={700} fill="url(#glowAmber)" opacity={0.35} />
      <circle cx={900} cy={600} r={500} fill="url(#glowCyan)" opacity={0.2} />
      {/* bilens dør/rude-kant */}
      <path d="M-300,1150 L700,1150 Q760,1150 760,1210 L760,2300 L-300,2300 Z" fill="url(#gPaint)" />
      <rect x={-300} y={1130} width={1060} height={26} fill="url(#chrome)" opacity={0.6} />
      {/* hånd fra bilen (handske) med bundt */}
      <g transform={`translate(${-120 + r * 330},${1100 - r * 60}) rotate(${-8 + r * 6})`}>
        <path d="M-400,-50 L60,-60 L60,60 L-400,70 Z" fill="#0a0b10" />
        <rect x={40} y={-70} width={170} height={150} rx={36} fill="#050507" />
        <g transform="translate(240,0)">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={-110} y={-40 + i * 6} width={240} height={110} rx={4} fill={i % 2 ? "#b9c4a6" : "#a8b494"} />
          ))}
          <rect x={-10} y={-44} width={44} height={170} fill="#c9542f" />
          <text x={10} y={-50} textAnchor="middle" fontFamily="Anton" fontSize={34} fill="#d8e0c8">
            1000
          </text>
        </g>
      </g>
      {/* modtagende hånd */}
      <g transform={`translate(${1300 - r * 300},${1060}) scale(-1,1)`}>
        <path d="M-500,-40 L40,-50 L40,60 L-500,70 Z" fill="#141826" />
        <path d="M40,-50 Q120,-90 200,-60 L240,-20 Q250,10 220,30 L120,40 Q60,70 40,60 Z" fill="#6a4532" />
        <path d="M200,-60 Q230,-110 260,-100" stroke="#6a4532" strokeWidth={30} strokeLinecap="round" />
      </g>
      <Dust t={t} n={40} />
    </Stage>
  );
};
