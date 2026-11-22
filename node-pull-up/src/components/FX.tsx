import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FLASHES, DIPS } from "../data/timing";
import { FPS, H, W } from "../lib";

/** Tegneserie-render: korn/scanlines slås fra (efterbehandlingen tilføjer papir + raster) */
const COMIC = false;

/** Efterbehandling: flash på hits, sorte dips ved klip, vignette, korn, scanlines. */
export const FX: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let flash = 0;
  for (const [ft, s, dec] of FLASHES) {
    const k = t - ft;
    if (k >= 0 && k < dec) flash = Math.max(flash, s * (1 - k / dec));
  }
  let dip = 0;
  for (const [dt, d] of DIPS) {
    const k = Math.abs(t - dt);
    if (k < d) dip = Math.max(dip, 1 - k / d);
  }
  const seed = frame % 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.72) 100%)" }} />
      {!COMIC && <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.22 }}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#grain${seed})`} />
      </svg>}
      {!COMIC && <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.12) 0px, rgba(0,0,0,.12) 1px, transparent 2px, transparent 4px)",
          opacity: 0.35,
        }}
      />}
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: "#fff4e0", opacity: flash, mixBlendMode: "screen" }} />}
      {dip > 0 && <AbsoluteFill style={{ backgroundColor: "#000", opacity: dip * 0.9 }} />}
    </AbsoluteFill>
  );
};
