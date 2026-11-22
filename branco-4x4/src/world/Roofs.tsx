import React from "react";
import { random } from "remotion";
import { Pal } from "./Neon";

/** København over tagene om natten (som på Brancos foto): spir, tegltage, skorstene, kviste, rækværk bag ham. */
export const Roofs: React.FC<{ t: number; pal: Pal }> = ({ t, pal }) => {
  const pan = t * 6;
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2400} fill="url(#nSky)" />
      {Array.from({ length: 70 }).map((_, i) => (
        <circle key={i} cx={random(`rs${i}`) * 1080} cy={random(`ry${i}`) * 700} r={1 + random(`rr${i}`) * 2} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t + i))} />
      ))}
      <circle cx={820} cy={300} r={60} fill="#f4efe0" />
      <circle cx={820} cy={300} r={260} fill="url(#nHaze)" opacity={0.4} />
      {/* fjern by */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = -100 + i * 44 - (pan * 0.3) % 44;
        const h = 60 + random(`fh${i}`) * 140;
        return <rect key={i} x={x} y={820 - h} width={42} height={h + 200} fill="#24183a" />;
      })}
      {/* spir med kobbertag og guld-ur */}
      <g transform={`translate(${220 - pan * 0.5},0)`}>
        <rect x={-50} y={460} width={100} height={420} fill="#2a2440" />
        <path d="M-60,470 L0,240 L60,470Z" fill="#3a8a72" />
        <path d="M-60,470 L0,240 L0,470Z" fill="#2a6a58" />
        <path d="M-14,330 L0,120 L14,330Z" fill="#3a8a72" />
        <line x1={0} y1={120} x2={0} y2={60} stroke="#ffc861" strokeWidth={4} />
        <circle cx={0} cy={56} r={8} fill="#ffc861" />
        <circle cx={0} cy={540} r={28} fill="#ffc861" />
        <circle cx={0} cy={540} r={22} fill="#f4ead0" />
        <path d="M0,540 L0,524 M0,540 L12,546" stroke="#2a1a10" strokeWidth={3} />
        <circle cx={0} cy={540} r={90} fill="url(#rWarm)" opacity={0.6} />
      </g>
      {/* tagrække med tegl, skorstene, kviste */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -150 + i * 170 - (pan % 170);
        const top = 820 + random(`tt${i}`) * 80;
        const lit = random(`tl${i}`) < 0.6;
        return (
          <g key={i}>
            <path d={`M${x},${top + 120} L${x + 40},${top} L${x + 150},${top} L${x + 190},${top + 120}Z`} fill={i % 2 ? "#5a2a20" : "#4a2a2a"} />
            {Array.from({ length: 5 }).map((__, r) => (
              <line key={r} x1={x + 40 - r * 8} y1={top + r * 24} x2={x + 150 + r * 8} y2={top + r * 24} stroke="#2a1410" strokeWidth={2} opacity={0.6} />
            ))}
            <rect x={x + 60} y={top - 70} width={28} height={80} fill="#3a2020" />
            <rect x={x + 56} y={top - 76} width={36} height={10} fill="#2a1414" />
            <rect x={x + 100} y={top + 30} width={40} height={50} fill={lit ? pal.win : "#1a1626"} />
            <path d={`M${x + 94},${top + 32} L${x + 120},${top + 10} L${x + 146},${top + 32}Z`} fill="#3a2020" />
            {lit && <circle cx={x + 120} cy={top + 55} r={60} fill="url(#rWarm)" opacity={0.5} />}
            <rect x={x - 10} y={top + 120} width={210} height={400} fill="#e8e2d6" opacity={0.18} />
            {Array.from({ length: 6 }).map((__, w) => (
              <rect key={w} x={x + 10 + (w % 3) * 60} y={top + 150 + Math.floor(w / 3) * 90} width={34} height={54} fill={random(`tw${i}${w}`) < 0.5 ? pal.win : "#2a2436"} opacity={0.8} />
            ))}
          </g>
        );
      })}
      {/* rækværk bag Branco */}
      <rect x={-100} y={1240} width={1280} height={12} fill="#6a6e7a" />
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i} x={-90 + i * 44} y={1250} width={6} height={200} fill="#4a4e5a" />
      ))}
      <rect x={-100} y={1440} width={1280} height={500} fill="#1a1622" />
      {/* lyskæde på rækværket */}
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={-60 + i * 56} cy={1236 + Math.sin(i * 0.9) * 8} r={6} fill={i % 2 ? pal.a : pal.win} filter="url(#nGlow)" />
      ))}
    </g>
  );
};
