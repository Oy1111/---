import React from "react";
import { AbsoluteFill } from "remotion";
import { Stage, useTimes } from "../components/Stage";
import { Stroget } from "../components/Stroget";
import { Rain } from "../components/City";
import { easeOut, smooth, PAL } from "../lib";

/** Intro: kameraet glider ned ad Strøget om natten. Titel i krom. */
export const IntroS: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt, t } = useTimes(start);
  const u = smooth(lt / dur);
  return (
    <>
      <Stage cam={[1.02 + u * 0.05, 0, 0]}>
        <Stroget t={t} camZ={-0.3 + u * 1.2} />
        <Rain t={t} opacity={0.22} />
      </Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: easeOut(lt / 0.4) * (1 - smooth((lt - (dur - 0.45)) / 0.4)) }}>
        <div
          style={{
            fontFamily: "Anton",
            fontSize: 260,
            letterSpacing: "0.1em",
            backgroundImage: "linear-gradient(180deg,#ffffff 0%,#c9d3ea 40%,#5d6784 52%,#e9eefb 60%,#8b95b3 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 30px rgba(255,200,130,.45)) drop-shadow(0 12px 18px rgba(0,0,0,.8))",
            scale: String(1.08 - easeOut(lt / 1.5) * 0.08),
            translate: "0px -160px",
          }}
        >
          NODE
        </div>
        <div style={{ fontFamily: "Anton", fontSize: 100, color: PAL.amber, letterSpacing: "0.34em", textShadow: "0 0 30px rgba(255,150,60,.7)", translate: "0px -150px" }}>PULL UP</div>
        <div style={{ fontFamily: "Playfair", fontStyle: "italic", fontSize: 46, color: "#e4dccd", translate: "0px -130px", opacity: 0.85 }}>Strøget · København</div>
      </AbsoluteFill>
    </>
  );
};
