import React from "react";
import { NeonDefs, NeonStreet, PALS } from "./world/Neon";
import { Roofs } from "./world/Roofs";
import { Branco, BrancoDefs, bPt } from "./world/Branco";
import { SUV, Hood, Flashes, NeonText, King, FamilyWindow, Polaroids, Eyes, Bubbles, Corner, MomPhone, Bills, GPS, Rent, Heart, Block, ap, win } from "./world/Pieces";
import { wordTimes, LINES } from "./data/timing";
import { clamp, easeOut, lerp } from "./lib";

const w0 = (l: number, w: string, i = 0) => wordTimes(l, w)[i];
const st = (l: number) => LINES[l][0].t;
const en = (l: number) => LINES[l][LINES[l].length - 1].t + 0.6;

/** Én hook (linje-offset o: 0 eller 8) – sæt-stykker bag og foran Branco. */
const HookBack: React.FC<{ t: number; o: number; pal: (typeof PALS)["purple"] }> = ({ t, o, pal }) => {
  const fire = wordTimes(o, "fire");
  const brodre = w0(o, "brødre") ?? 0;
  const nine = w0(o + 1, "9ere") ?? 0;
  const a15 = wordTimes(o + 2, "15");
  const hvem = w0(o + 3, "hvem") ?? 0;
  const stille = w0(o + 4, "stille") ?? 0;
  const fam = w0(o + 5, "familien") ?? 0;
  const glem = w0(o + 5, "glemmer") ?? 0;
  const fryg = w0(o + 6, "frygten") ?? 0;
  const fuck = w0(o + 7, "fuck") ?? 0;
  // 4x4 kører ind og bliver stående bag ham
  const suvIn = easeOut((t - (st(o) - 0.3)) / 1.0);
  const suvOn = win(t, st(o) - 0.3, en(o + 1), 0.2, 0.5);
  const bro = clamp((t - (fire[1] ?? brodre) + 0.1) / 0.4);
  const broOn = win(t, (fire[1] ?? brodre) - 0.2, en(o + 3) + 0.4, 0.3, 0.5);
  const back = ap(t, nine - 0.05, 0.3) * (1 - clamp((t - en(o + 1)) / 0.4));
  const crowd = win(t, st(o + 3) - 0.5, hvem + 0.2, 0.4, 0.6);
  const calm = win(t, stille - 0.2, en(o + 4), 0.5, 0.4);
  const famOn = win(t, st(o + 5), en(o + 5) + 0.2, 0.4, 0.4);
  const eyes = win(t, fryg - 0.2, en(o + 6), 0.3, 0.3);
  return (
    <g>
      {suvOn > 0 && <SUV x={540} y={lerp(1000, 1180, suvIn)} s={lerp(0.25, 0.95, suvIn)} open={ap(t, fire[0] ?? 0, 0.4)} lights={suvOn} />}
      {/* publikum der forsvinder – kun de fire bliver */}
      {crowd > 0 &&
        Array.from({ length: 10 }).map((_, i) => (
          <Hood key={i} x={60 + i * 106} y={1120 + (i % 2) * 30} s={0.45} rim={pal.b} op={crowd * 0.8} />
        ))}
      {broOn > 0 &&
        [[150, pal.a], [300, pal.b], [780, pal.b], [930, pal.a]].map(([x, c], i) => (
          <Hood key={i} x={x as number} y={lerp(1480, 1360, bro)} s={lerp(0.6, 0.95, bro)} rim={c as string} back={back} op={broOn * clamp(bro * 1.5 - i * 0.12)} />
        ))}
      {back > 0 && <NeonText txt="9" x={540} y={860} size={360} color={pal.a} on={back} />}
      {/* 15 år */}
      {t > st(o + 2) - 0.2 && t < (a15[1] ?? 99) + 0.7 && <NeonText txt="15 ÅR" x={540} y={820} size={200} color={pal.c} on={ap(t, a15[0], 0.2) * (1 - clamp((t - (a15[1] ?? 99)) / 0.2) * 0.6)} />}
      {calm > 0 && <King x={880} y={1120} s={1.4} color={pal.b} on={calm} />}
      {famOn > 0 && <FamilyWindow x={190} y={860} on={famOn * ap(t, fam - 0.1, 0.4)} />}
      {eyes > 0 && <Eyes t={t} on={eyes} color={pal.a} />}
      {t > fuck - 1.4 && t < fuck + 1.2 && <Bubbles t={t} t0={st(o + 7) - 1.0} shatter={fuck} />}
      {t > glem - 0.2 && t < glem + 1.4 && <g opacity={1 - clamp((t - glem - 0.9) / 0.5)}><Polaroids t={t} t0={glem} /></g>}
    </g>
  );
};

const HookFront: React.FC<{ t: number; o: number; pal: (typeof PALS)["purple"] }> = ({ t, o }) => {
  const skud = w0(o + 2, "15", 1) ?? 0;
  const fryg = w0(o + 6, "frygten") ?? 0;
  const eyes = win(t, fryg - 0.2, en(o + 6), 0.3, 0.3);
  // øjne spejlet i hans rosa briller
  const L = bPt(548, 395, t), R = bPt(662, 391, t);
  return (
    <g>
      {t > skud - 0.1 && t < skud + 2.2 && <Flashes t={t} t0={skud - 0.05} n={15} dur={1.0} />}
      {eyes > 0 &&
        [L, R].map(([x, y], i) => (
          <g key={i} opacity={eyes}>
            {[-9, 9].map((dx) => (
              <ellipse key={dx} cx={x + dx} cy={y} rx={4.5} ry={2.2} fill="#ff3dc8" />
            ))}
            <ellipse cx={x} cy={y} rx={30} ry={14} fill="#ff3dc8" opacity={0.25} />
          </g>
        ))}
    </g>
  );
};

const VerseBack: React.FC<{ t: number; pal: (typeof PALS)["purple"] }> = ({ t, pal }) => {
  const b = 16;
  const mama = w0(b + 1, "mama") ?? 0;
  const dag = w0(b + 2, "dag") ?? 0;
  const nat = w0(b + 2, "nat") ?? 0;
  const skejs = w0(b + 4, "skejs") ?? 0;
  const vejen = w0(b + 4, "vejen") ?? 0;
  const fjorten = w0(b + 5, "14") ?? 0;
  const husleje = w0(b + 5, "husleje") ?? 0;
  const hjerte = w0(b + 6, "hjerte") ?? 0;
  const liv = w0(b + 7, "liv") ?? 0;
  const blok = w0(b + 7, "blok") ?? 0;
  const kaer = w0(b + 7, "kærlighed") ?? 0;
  const penge = w0(b + 8, "penge") ?? 0;
  // dag/nat-cyklus: sol op på "dag", måne på "nat"
  const sun = win(t, dag - 0.4, nat - 0.1, 0.3, 0.2);
  const moon = win(t, nat - 0.1, en(b + 2) + 0.3, 0.2, 0.4);
  return (
    <g>
      <Corner t={t} on={win(t, st(b) - 0.2, en(b), 0.3, 0.3)} />
      <MomPhone t={t} on={win(t, st(b + 1) - 0.1, en(b + 1) + 0.1, 0.3, 0.3)} n={Math.min(12, 1 + Math.floor(Math.max(0, t - mama) * 8))} />
      {sun > 0 && (
        <g opacity={sun}>
          <rect x={0} y={0} width={1080} height={1100} fill="#ffb347" opacity={0.25} style={{ mixBlendMode: "screen" }} />
          <circle cx={lerp(160, 540, clamp((t - dag + 0.4) / 0.8))} cy={lerp(1000, 700, clamp((t - dag + 0.4) / 0.8))} r={110} fill="#ffe0a0" filter="url(#nGlow)" />
        </g>
      )}
      {moon > 0 && <circle cx={lerp(540, 900, clamp((t - nat) / 1))} cy={720} r={80} fill="#f4efe0" opacity={moon} filter="url(#nGlow)" />}
      {t > skejs - 0.3 && t < en(b + 4) + 0.5 && <Bills t={t} t0={skejs - 0.25} />}
      <GPS t={t} on={win(t, vejen - 0.3, en(b + 4) + 0.2, 0.3, 0.3)} />
      {t > st(b + 5) - 0.2 && t < en(b + 5) + 0.3 && <NeonText txt="14" x={200} y={900} size={280} color={pal.c} on={ap(t, fjorten, 0.2)} />}
      <Rent on={win(t, husleje - 0.3, en(b + 5) + 0.2, 0.3, 0.3)} open={ap(t, w0(b + 5, "penge") ?? 99, 0.4)} />
      {t > hjerte - 0.3 && t < en(b + 7) + 0.4 && (
        <Heart x={540} y={760} s={1.6} color={pal.a} on={t > kaer ? (Math.floor(t * 14) % 3 === 0 ? 0.2 : 1 - clamp((t - kaer) / 0.8) * 0.8) : ap(t, hjerte, 0.2) * (t > liv ? 0.7 : 1)} broken={ap(t, kaer, 0.5)} />
      )}
      <Block t={t} t0={blok} on={win(t, st(b + 7) - 0.2, en(b + 7) + 0.2, 0.3, 0.3)} />
      {t > penge - 0.4 && <Bills t={t} t0={penge - 0.8} burn={penge} n={16} />}
      {/* brødrene vender ryggen til hinanden */}
      {t > st(b + 8) - 0.2 &&
        [[200, pal.b, -1], [880, pal.a, 1]].map(([x, c], i) => (
          <Hood key={i} x={x as number} y={1400} s={0.9} rim={c as string} back={1} num="" op={win(t, st(b + 8) - 0.2, 52, 0.4, 0.4)} />
        ))}
    </g>
  );
};

export const SceneLayer: React.FC<{ t: number }> = ({ t }) => {
  const h2 = st(8) - 0.15;
  const vs = st(16) - 0.15;
  const sect = t < h2 ? 0 : t < vs ? 1 : 2;
  const pal = sect === 0 ? PALS.purple : sect === 1 ? PALS.red : PALS.cyan;
  const glitch = w0(19, "selv") ?? 0;
  const g = win(t, (w0(19, "finde") ?? 0) - 0.1, glitch + 0.8, 0.1, 0.3);
  const dim = t > (w0(23, "liv") ?? 99) ? 0.55 : 1;
  return (
    <g>
      <NeonDefs pal={pal} />
      <BrancoDefs a={pal.a} b={pal.b} />
      {sect === 1 ? <Roofs t={t - h2} pal={pal} /> : <NeonStreet t={t} pal={pal} speed={sect === 2 ? 80 : 130} lights={dim} />}
      {sect === 0 && <HookBack t={t} o={0} pal={pal} />}
      {sect === 1 && <HookBack t={t} o={8} pal={pal} />}
      {sect === 2 && <VerseBack t={t} pal={pal} />}
      {/* glitch-dobbelt af Branco på "finde mig selv" */}
      {g > 0 && (
        <g opacity={g * 0.55}>
          <g transform={`translate(${-24 + Math.sin(t * 40) * 8},0)`} style={{ mixBlendMode: "screen" }} filter="url(#nSoft)"><Branco t={t} /></g>
          <g transform={`translate(${26 - Math.sin(t * 37) * 8},0)`} style={{ mixBlendMode: "screen" }} filter="url(#nSoft)"><Branco t={t} /></g>
        </g>
      )}
      <Branco t={t} />
      {sect === 0 && <HookFront t={t} o={0} pal={pal} />}
      {sect === 1 && <HookFront t={t} o={8} pal={pal} />}
      {/* sektionsskift: neon-glimt */}
      {[h2, vs].map((x, i) => (
        <rect key={i} x={0} y={0} width={1080} height={1920} fill="#fff" opacity={Math.max(0, 1 - Math.abs(t - x) / 0.18) * 0.85} />
      ))}
    </g>
  );
};
