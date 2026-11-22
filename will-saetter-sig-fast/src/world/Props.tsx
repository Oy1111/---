import React from "react";
import { random } from "remotion";
import { clamp, easeOut, lerp } from "../lib";
import { TABLE } from "./Characters";

const SQ = 0.4;
const plane = (x: number, y: number, rot: number) => `translate(${x},${y}) scale(1,${SQ}) rotate(${rot})`;

/* ---------- telefon fladt på bordet med chat ---------- */
export const PHONE = { x: 1610, y: TABLE.y - 30 };
export const Phone: React.FC<{ t: number; sent?: number; typing?: [number, number][]; reply?: string; replyT?: [number, number]; lit?: number }> = ({
  t, sent = 99, typing = [], reply = "", replyT = [99, 100], lit = 1,
}) => {
  const typingOn = typing.some(([a, b]) => t > a && t < b);
  const nRep = Math.floor(clamp((t - replyT[0]) / Math.max(0.1, replyT[1] - replyT[0])) * reply.length);
  const replySent = t > replyT[1] + 0.25;
  return (
    <g>
      <ellipse cx={PHONE.x} cy={PHONE.y} rx={140} ry={140 * SQ} fill="url(#rBlue)" opacity={lit * 0.6} style={{ mixBlendMode: "screen" }} />
      <g transform={plane(PHONE.x + 2, PHONE.y + 4, -14)}>
        <rect x={-38} y={-76} width={76} height={152} rx={14} fill="#000" opacity={0.6} filter="url(#fBlur6)" />
      </g>
      <g transform={`translate(0,3.5) ${plane(PHONE.x, PHONE.y, -14)}`}>
        <rect x={-34} y={-70} width={68} height={140} rx={12} fill="#2a2c34" />
      </g>
      <g transform={plane(PHONE.x, PHONE.y, -14)}>
        <rect x={-34} y={-70} width={68} height={140} rx={12} fill="#0b0b0e" stroke="#5a5e6a" strokeWidth={1.2} />
        <rect x={-31} y={-67} width={62} height={134} rx={10} fill="#0e1322" opacity={lit} />
        <g opacity={lit}>
          <rect x={-31} y={-67} width={62} height={20} rx={10} fill="#171d30" />
          <circle cx={-20} cy={-57} r={5} fill="#b85a7a" />
          <text x={-12} y={-54} fontFamily="Anton" fontSize={7} fill="#fff">hende ♡</text>
          {/* hans besked */}
          <g opacity={clamp((t - sent) * 5)}>
            <rect x={-6} y={-40} width={34} height={14} rx={6} fill="#2f7cf6" />
            <text x={-3} y={-30} fontFamily="SpaceMonoB" fontSize={5.4} fill="#fff">sig noget</text>
          </g>
          {/* hun skriver ... */}
          {typingOn && (
            <g>
              <rect x={-28} y={-18} width={24} height={12} rx={6} fill="#2b2f3d" />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={-22 + i * 6} cy={-12} r={1.8} fill="#cfd6e8" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 6 - i * 0.8))} />
              ))}
            </g>
          )}
          {/* hans svar skrives bogstav for bogstav */}
          {nRep > 0 && (
            <g>
              <rect x={replySent ? -12 : -28} y={replySent ? 4 : 50} width={replySent ? 40 : 56} height={14} rx={6} fill={replySent ? "#2f7cf6" : "#1f2436"} />
              <text x={replySent ? -9 : -25} y={replySent ? 14 : 60} fontFamily="SpaceMonoB" fontSize={5.4} fill="#fff">
                {reply.slice(0, nRep)}{!replySent && Math.floor(t * 4) % 2 ? "|" : ""}
              </text>
            </g>
          )}
          {!replySent && <rect x={-28} y={48} width={56} height={18} rx={8} fill="none" stroke="#2a3048" strokeWidth={1} />}
        </g>
        <path d="M-31,-20 L-8,-67 L4,-67 L-31,4Z" fill="#fff" opacity={0.07} />
      </g>
    </g>
  );
};

/* ---------- stearinlys på bordet ---------- */
export const CANDLE = { x: 2110, y: TABLE.y - 40 };
export const Candle: React.FC<{ t: number; out: number; relight: number; burn: number }> = ({ t, out, relight, burn }) => {
  const h = lerp(150, 40, burn);
  const lit = (1 - out) + relight > 0.5 ? Math.max(1 - out, relight) : 0;
  const f = lit * (1 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05);
  const top = CANDLE.y - h;
  return (
    <g>
      <ellipse cx={CANDLE.x} cy={CANDLE.y + 4} rx={46} ry={14} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <ellipse cx={CANDLE.x} cy={CANDLE.y} rx={44} ry={13} fill="#c9a45a" />
      <ellipse cx={CANDLE.x} cy={CANDLE.y - 3} rx={36} ry={10} fill="#e8cc8a" />
      <rect x={CANDLE.x - 18} y={top} width={36} height={h} fill="#f2ead8" />
      <rect x={CANDLE.x + 4} y={top} width={14} height={h} fill="#000" opacity={0.15} />
      <path d={`M${CANDLE.x - 18},${top + 6} q4,20 0,34`} stroke="#fff8e8" strokeWidth={5} opacity={0.8} />
      <ellipse cx={CANDLE.x} cy={top} rx={18} ry={5} fill="#efe4c8" />
      <line x1={CANDLE.x} y1={top} x2={CANDLE.x + 1} y2={top - 12} stroke="#1a1410" strokeWidth={2} />
      {f > 0.02 && (
        <g>
          <circle cx={CANDLE.x} cy={top - 30} r={240 * f} fill="url(#rWarm)" opacity={0.75} style={{ mixBlendMode: "screen" }} />
          <path d={`M${CANDLE.x - 7 * f},${top - 10} Q${CANDLE.x - 9 * f},${top - 30 * f} ${CANDLE.x + Math.sin(t * 9) * 3},${top - 50 * f} Q${CANDLE.x + 9 * f},${top - 30 * f} ${CANDLE.x + 7 * f},${top - 10}Z`} fill="url(#gFire)" />
          <ellipse cx={CANDLE.x} cy={top - 16} rx={3} ry={7} fill="#4a7aff" opacity={0.6 * f} />
        </g>
      )}
      {/* røg efter slukning */}
      {out > 0.5 && relight < 0.5 &&
        Array.from({ length: 10 }).map((_, i) => {
          const age = ((t * 0.5 + i / 10) % 1);
          return <circle key={i} cx={CANDLE.x + Math.sin(age * 7 + i) * 12 * age} cy={top - 14 - age * 200} r={3 + age * 14} fill="#c8c4bc" opacity={(1 - age) * 0.3 * Math.min(1, out)} />;
        })}
    </g>
  );
};

/* ---------- kaffekopper ---------- */
export const Mug: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = "#e9e2d2" }) => (
  <g>
    <ellipse cx={x} cy={y + 3} rx={34} ry={10} fill="#000" opacity={0.35} filter="url(#fBlur2)" />
    <path d={`M${x - 28},${y - 66} L${x + 28},${y - 66} L${x + 24},${y} Q${x},${y + 8} ${x - 24},${y}Z`} fill={c} />
    <path d={`M${x + 28},${y - 56} q22,4 2,30`} stroke={c} strokeWidth={7} fill="none" />
    <ellipse cx={x} cy={y - 66} rx={28} ry={8} fill="#3a2010" />
    <rect x={x + 8} y={y - 64} width={14} height={60} fill="#000" opacity={0.12} />
  </g>
);

/* ---------- pladespiller (kan hakke og skilles ad) ---------- */
export const TT = { x: 3100, y: 1338 };
export const Turntable: React.FC<{ t: number; stuck: number; apart: number }> = ({ t, stuck, apart }) => {
  const { x, y } = TT;
  // når pladen hakker, springer rotationen tilbage hvert halve beat
  const spinT = stuck > 0 ? (t % 0.255) : t;
  const rot = spinT * 200;
  const a = easeOut(apart);
  const off = (k: number) => -a * k;
  const needleJump = stuck > 0 ? Math.abs(Math.sin(t * Math.PI / 0.255)) * 4 : 0;
  return (
    <g>
      {/* base */}
      <g transform={`translate(0,${off(0)})`}>
        <rect x={x - 230} y={y - 70} width={460} height={70} rx={8} fill="#3a2414" />
        <rect x={x - 230} y={y - 70} width={460} height={10} rx={4} fill="#6a4428" />
        <rect x={x - 230} y={y - 20} width={460} height={20} fill="#1a1008" />
        {[x - 190, x + 190].map((fx) => (
          <rect key={fx} x={fx - 14} y={y} width={28} height={8} fill="#0b0806" />
        ))}
        <circle cx={x + 170} cy={y - 34} r={10} fill="url(#gChrome)" />
        <circle cx={x - 190} cy={y - 36} r={4} fill={stuck > 0 ? "#ff3a3a" : "#3aff7a"} />
      </g>
      {/* tallerken */}
      <g transform={`translate(0,${off(120)})`}>
        <ellipse cx={x - 30} cy={y - 76} rx={180} ry={44} fill="#1a1a1e" />
        <ellipse cx={x - 30} cy={y - 82} rx={180} ry={44} fill="url(#gChrome)" opacity={0.6} />
      </g>
      {/* plade */}
      <g transform={`translate(0,${off(240)})`}>
        <ellipse cx={x - 30} cy={y - 88} rx={170} ry={41} fill="#0a0a0c" />
        {[150, 130, 110, 90, 70].map((r) => (
          <ellipse key={r} cx={x - 30} cy={y - 88} rx={r} ry={r * 0.24} fill="none" stroke="#24242a" strokeWidth={1.5} />
        ))}
        <ellipse cx={x - 30} cy={y - 88} rx={170} ry={41} fill="none" stroke="#3a3a44" strokeWidth={2} />
        {/* lysrefleks der roterer */}
        <path d={`M${x - 30},${y - 88} L${x - 30 + Math.cos((rot * Math.PI) / 180) * 160},${y - 88 + Math.sin((rot * Math.PI) / 180) * 38}`} stroke="#8a90a8" strokeWidth={6} opacity={0.35} />
        <ellipse cx={x - 30} cy={y - 88} rx={50} ry={12} fill="#a8203a" />
        <path d={`M${x - 30},${y - 88} L${x - 30 + Math.cos((rot * Math.PI) / 180) * 46},${y - 88 + Math.sin((rot * Math.PI) / 180) * 11}`} stroke="#f2d8a0" strokeWidth={4} />
        <ellipse cx={x - 30} cy={y - 90} rx={5} ry={2} fill="url(#gChrome)" />
      </g>
      {/* tonearm */}
      <g transform={`translate(${a * 60},${off(330)}) rotate(${-a * 25} ${x + 160} ${y - 100})`}>
        <circle cx={x + 160} cy={y - 100} r={18} fill="url(#gChrome)" />
        <path d={`M${x + 160},${y - 100} L${x + 60},${y - 120 - needleJump} L${x + 10},${y - 106 - needleJump}`} stroke="url(#gChrome)" strokeWidth={6} fill="none" strokeLinecap="round" />
        <rect x={x - 6} y={y - 114 - needleJump} width={24} height={12} rx={3} fill="#1a1a1e" />
        <rect x={x + 170} y={y - 110} width={34} height={20} rx={4} fill="#2a2a30" />
      </g>
      {stuck > 0 && (
        <g>
          <circle cx={x} cy={y - 108} r={30 + Math.abs(Math.sin(t * 12.3)) * 30} fill="url(#rHot)" opacity={0.5} />
          {[0, 1, 2].map((i) => {
            const k = ((t * 2 + i / 3) % 1);
            return <ellipse key={i} cx={x - 30} cy={y - 88} rx={60 + k * 260} ry={(60 + k * 260) * 0.24} fill="none" stroke="#ffc861" strokeWidth={3} opacity={(1 - k) * 0.7} />;
          })}
        </g>
      )}
      {/* eksploderet visning: hjælpelinjer */}
      {a > 0.05 && (
        <g stroke="#ffc861" strokeWidth={2} strokeDasharray="8 8" opacity={a * 0.7}>
          <line x1={x - 30} y1={y - 80} x2={x - 30} y2={y - 90 - 240 * a} />
          <line x1={x + 160} y1={y - 100} x2={x + 160 + 60 * a} y2={y - 100 - 330 * a} />
        </g>
      )}
    </g>
  );
};

/* ---------- skrift i duggen på ruden ---------- */
export const FogWrite: React.FC<{ t: number; items: { txt: string; x: number; y: number; t0: number; t1?: number; size?: number; strike?: number }[] }> = ({ t, items }) => (
  <g>
    {items.map((it, i) => {
      if (t < it.t0) return null;
      const k = clamp((t - it.t0) / 0.35);
      const gone = it.t1 !== undefined ? clamp((t - it.t1) / 0.4) : 0;
      return (
        <g key={i} opacity={1 - gone}>
          <clipPath id={`fw${i}`}><rect x={it.x - 400} y={it.y - 200} width={800 * k} height={300} /></clipPath>
          <g clipPath={`url(#fw${i})`}>
            <text x={it.x} y={it.y} textAnchor="middle" fontFamily="Playfair" fontStyle="italic" fontSize={it.size ?? 150} fill="none" stroke="#0a0e22" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
              {it.txt}
            </text>
            {/* dråber der løber fra bogstaverne */}
            {Array.from({ length: 4 }).map((_, j) => (
              <rect key={j} x={it.x - 120 + random(`fd${i}${j}`) * 240} y={it.y + 6} width={4} height={20 + Math.min(80, (t - it.t0) * 40) * random(`fl${i}${j}`)} rx={2} fill="#0a0e22" opacity={0.7} />
            ))}
          </g>
          {it.strike !== undefined && t > it.strike && (
            <line x1={it.x - 160} y1={it.y - 40} x2={it.x - 160 + 320 * clamp((t - it.strike) / 0.25)} y2={it.y - 60} stroke="#0a0e22" strokeWidth={16} strokeLinecap="round" />
          )}
        </g>
      );
    })}
  </g>
);
