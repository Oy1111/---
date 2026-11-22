import React from "react";
import { AbsoluteFill } from "remotion";
import { WorldDefs } from "./world/Defs";
import { Person, LOOKS, PPose } from "./world/Person";

const poses: [string, PPose][] = [["smoker", "smoke"], ["q1", "phone"], ["bouncer", "crossed"], ["g1", "talk"], ["g3", "stand"], ["fa", "dap"], ["fb", "shake"], ["runner", "walk"], ["sitter", "sit"]];
export const Lab: React.FC = () => (
  <AbsoluteFill style={{ background: "#2a2430" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <WorldDefs />
      {poses.map(([l, p], i) => (
        <Person key={i} id={`lab${i}`} x={150 + (i % 3) * 380} y={560 + Math.floor(i / 3) * 620} s={2.2} pose={p} look={LOOKS[l]} t={1} k={1} light={i % 2 ? 1 : -1} />
      ))}
    </svg>
  </AbsoluteFill>
);
