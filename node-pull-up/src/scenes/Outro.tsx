import React from "react";
import { AbsoluteFill, Interactive } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Sky, Skyline, Rain } from "../components/City";
import { PAL, clamp, easeOut, smooth } from "../lib";

const Row: React.FC<{ icon: string; big: string; small: string; d: number }> = ({ icon, big, small, d }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 26, opacity: clamp(d * 3), translate: `${(1 - easeOut(d)) * 60}px 0px`, marginBottom: 34 }}>
    <span style={{ fontFamily: "Anton", fontSize: 88, color: PAL.amber, width: 90, textAlign: "center", textShadow: "0 0 30px rgba(255,170,70,.7)" }}>{icon}</span>
    <span style={{ fontFamily: "Anton", fontSize: 120, color: PAL.white, textShadow: "0 0 26px rgba(255,190,110,.5), 0 8px 20px #000" }}>{big}</span>
    <span style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 50, color: "#d9dcea" }}>{small}</span>
  </div>
);

/** Outro: titel + kunstner og LIKE / FØLG / SKRIV */
export const Outro: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  return (
    <>
      <Stage cam={[1.1 - lt * 0.02, 0, 0]}>
        <Sky t={t} moon={[540, 380]} />
        <Skyline seed="out" base={1920} depth={0.4} maxH={900} t={t} offset={lt * 20} />
        <rect x={-300} y={-300} width={1680} height={2520} fill="#000" opacity={0.45} />
        <Rain t={t} opacity={0.15} />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <Interactive.Div name="Titel" style={{ textAlign: "center", opacity: easeOut(lt / 0.4), scale: String(1.15 - easeOut(lt / 0.6) * 0.15) }}>
          <div style={{ fontFamily: "Anton", fontSize: 200, color: PAL.white, letterSpacing: "0.12em", textShadow: "0 0 50px rgba(255,180,80,.55), 0 12px 30px #000" }}>NODE</div>
          <div style={{ width: 140, height: 6, backgroundColor: PAL.amber, margin: "10px auto 18px", boxShadow: "0 0 20px rgba(255,170,70,.8)" }} />
          <div style={{ fontFamily: "Anton", fontSize: 130, color: PAL.amber, letterSpacing: "0.18em", textShadow: "0 0 40px rgba(255,150,60,.7)" }}>PULL UP</div>
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", paddingLeft: 110, paddingBottom: 330 }}>
        <Interactive.Div name="Opfordringer">
          <Row icon="♥" big="LIKE" small="hvis den ramte" d={(lt - 0.5) / 0.4} />
          <Row icon="+" big="FØLG" small="for mere" d={(lt - 0.75) / 0.4} />
          <Row icon="✎" big="SKRIV" small="hvad du synes" d={(lt - 1.0) / 0.4} />
          <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 46, color: "#c9cde0", marginLeft: 116, opacity: clamp((lt - 1.3) * 3) }}>og ønsk det næste nummer</div>
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: smooth((lt - (dur - 0.7)) / 0.7) }} />
    </>
  );
};
