import React from "react";
import { Stage, useTimes } from "../components/Stage";
import { CarTop } from "../components/Car";
import { Lamp } from "../components/City";
import { Smoke } from "../components/Props";
import { PAL, W, H, easeOut } from "../lib";

/** Fugleperspektiv: bilen drifter rundt om et gadehjørne og efterlader dækspor. */
export const Drift: React.FC<{ start: number; dur: number }> = ({ start, dur }) => {
  const { lt } = useTimes(start);
  const u = 0.1 + easeOut(lt / dur) * 0.8;
  // bane: kommer ind nedefra, drejer 90° mod højre
  // bane: kommer ind nede fra venstre og drejer op mod højre (kvartcirkel)
  const R = 560;
  const cx = 940, cy = 1380;
  const pos = (uu: number) => {
    const a = ((180 + uu * 90) * Math.PI) / 180;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R] as const;
  };
  const [x, y] = pos(u);
  const [x2, y2] = pos(Math.min(1, u + 0.01));
  const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI + 28 * Math.sin(Math.min(1, u * 1.4) * Math.PI);
  const trail = [];
  for (let i = 0; i < 40; i++) {
    const [tx, ty] = pos(Math.max(0, u - i * 0.012));
    trail.push(`${tx},${ty}`);
  }
  return (
    <Stage cam={[1.0, 0, 0]} bg="#04060c">
      {/* asfalt + fortov + vejmarkering */}
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#080b16" />
      <rect x={-200} y={-200} width={360} height={H + 400} fill="#0f1426" />
      <rect x={-200} y={1580} width={W + 400} height={600} fill="#0f1426" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={i * 120} y={1520} width={60} height={70} fill="#e9edf6" opacity={0.25} />
      ))}
      <rect x={560} y={-200} width={14} height={1600} fill={PAL.sodium} opacity={0.35} />
      {/* dækspor */}
      <polyline points={trail.join(" ")} fill="none" stroke="#000" strokeWidth={70} opacity={0.55} transform="translate(0,-40)" />
      <polyline points={trail.join(" ")} fill="none" stroke="#000" strokeWidth={70} opacity={0.55} transform="translate(0,40)" />
      {/* lygter set oppefra (lyspøler) */}
      {[300, 900, 1500].map((yy, i) => (
        <g key={i}>
          <circle cx={150} cy={yy} r={320} fill="url(#glowAmber)" opacity={0.35} />
          <circle cx={150} cy={yy} r={16} fill="#fff4d6" />
        </g>
      ))}
      <Smoke t={lt} x={x} y={y + 100} n={24} spread={0.7} seed="drift" color="#9aa7c9" />
      <CarTop x={x} y={y} rot={ang + Math.sin(lt * 6) * 3} scale={1.0} brake={0.6} />
      <Lamp x={-1000} y={0} h={1} on={0} cone={false} />
    </Stage>
  );
};
