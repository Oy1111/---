import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Defs } from "./City";
import { FPS, H, W } from "../lib";

/** Tid i sekunder: lt = lokal (scene), t = global videotid */
export const useTimes = (start: number) => {
  const f = useCurrentFrame();
  const lt = f / FPS;
  return { lt, t: lt + start };
};

/** SVG-lærred 1080x1920 med fælles defs. cam = [zoom, dx, dy] (zoom omkring midten) */
export const Stage: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; bg?: string }> = ({ children, cam = [1, 0, 0], bg = "#03050d" }) => {
  const [z, dx, dy] = cam;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <g transform={`translate(${W / 2 + dx},${H / 2 + dy}) scale(${z}) translate(${-W / 2},${-H / 2})`}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};
