import React from "react";
import { AbsoluteFill, Interactive } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { Artist, ArtistDefs } from "../components/Artist";
import { Rain } from "../components/City";
import { PAL, clamp, easeOut, smooth } from "../lib";

const Row: React.FC<{ icon: string; big: string; small: string; d: number }> = ({ icon, big, small, d }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 24, opacity: clamp(d * 3), translate: `${(1 - easeOut(d)) * 60}px 0px`, marginBottom: 22 }}>
    <span style={{ fontFamily: "Anton", fontSize: 80, color: PAL.amber, width: 84, textAlign: "center", textShadow: "0 0 30px rgba(255,170,70,.7)" }}>{icon}</span>
    <span style={{ fontFamily: "Anton", fontSize: 112, color: PAL.white, textShadow: "0 0 26px rgba(255,190,110,.5), 0 8px 20px #000" }}>{big}</span>
    <span style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 48, color: "#e2e4ee", textShadow: "0 4px 12px #000" }}>{small}</span>
  </div>
);

/** Outro: Node & Gilli på Strøget, titel og LIKE / FØLG / SKRIV */
export const Outro2: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  return (
    <>
      <Stage cam={[1.06 - lt * 0.015, 0, 0]}>
        <ArtistDefs />
        <g filter="url(#blur6)">
          <Stroget t={t} camZ={4} people={false} />
        </g>
        <rect x={-300} y={-300} width={1680} height={2520} fill="#000" opacity={0.45} />
        <Artist who="node" x={310} y={1930} h={820} rim="rimWarm" t={t} opacity={easeOut(lt / 0.5)} />
        <Artist who="gilli" x={790} y={1930} h={880} rim="rimCool" t={t + 1} opacity={easeOut((lt - 0.15) / 0.5)} />
        <rect x={-300} y={1500} width={1680} height={600} fill="url(#facadeShade)" opacity={0.6} />
        <Rain t={t} opacity={0.15} />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <Interactive.Div name="Titel" style={{ textAlign: "center", opacity: easeOut(lt / 0.4), scale: String(1.12 - easeOut(lt / 0.6) * 0.12) }}>
          <div style={{ fontFamily: "Anton", fontSize: 190, letterSpacing: "0.1em", backgroundImage: "linear-gradient(180deg,#ffffff 0%,#c9d3ea 40%,#5d6784 52%,#e9eefb 60%,#8b95b3 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(255,200,130,.45)) drop-shadow(0 12px 18px rgba(0,0,0,.8))" }}>NODE</div>
          <div style={{ width: 140, height: 6, backgroundColor: PAL.amber, margin: "6px auto 14px", boxShadow: "0 0 20px rgba(255,170,70,.8)" }} />
          <div style={{ fontFamily: "Anton", fontSize: 120, color: PAL.amber, letterSpacing: "0.18em", textShadow: "0 0 40px rgba(255,150,60,.7)" }}>PULL UP</div>
        </Interactive.Div>
        <Interactive.Div name="Opfordringer" style={{ alignSelf: "flex-start", marginLeft: 100, marginTop: 70 }}>
          <Row icon="♥" big="LIKE" small="hvis den ramte" d={(lt - 0.5) / 0.4} />
          <Row icon="+" big="FØLG" small="for mere" d={(lt - 0.75) / 0.4} />
          <Row icon="✎" big="SKRIV" small="hvad du synes" d={(lt - 1.0) / 0.4} />
          <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 44, color: "#d9dcea", marginLeft: 108, opacity: clamp((lt - 1.3) * 3), textShadow: "0 4px 12px #000" }}>og ønsk det næste nummer</div>
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: smooth((lt - (dur - 0.6)) / 0.6) }} />
    </>
  );
};
