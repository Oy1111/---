import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NeonDefs, NeonStreet, PALS } from "./world/Neon";
import { Branco, BrancoDefs } from "./world/Branco";
export const Lab: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const pal = PALS.purple;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <NeonDefs pal={pal} />
        <BrancoDefs a={pal.a} b={pal.b} />
        <NeonStreet t={t} pal={pal} />
        <Branco t={t} />
      </svg>
    </AbsoluteFill>
  );
};
