import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WorldDefs } from "./world/Defs";
import { RoomDefs, Walls, Window, Entry, Sideboard, Wall2, Stove } from "./world/Room";
import { Her, Him } from "./world/Characters";
import { Table } from "./world/Table";

export const Lab: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const z = f === 0 ? 0.235 : f === 1 ? 1.3 : 3.2;
  const [cx, cy] = f === 0 ? [2300, 1250] : f === 1 ? [1850, 1150] : [2440, 1010];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <WorldDefs />
        <RoomDefs />
        <g transform={`translate(540,960) scale(${z}) translate(${-cx},${-cy})`}>
          <Walls t={t} />
          <Window t={t} />
          <Entry t={t} heart={0.3} />
          <Wall2 t={t} />
          <Sideboard />
          <Stove t={t} fire={0} />
          <Him t={t} />
          <Table />
          <Her t={t} eyeUp={f === 2 ? 1 : 0} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
