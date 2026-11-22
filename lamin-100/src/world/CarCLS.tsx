import React from "react";

/**
 * Lav firedørs coupé i CLS-stil (side, front mod +x), hjul på y=0, længde ~660, højde ~182.
 * Frameless ruder, faldende skulderlinje, lange LED-lygter, multi-eger-fælge med røde kalibre,
 * lakrefleksioner fra gadelyset. roll = 0..1 hvor langt fordøren er rullet ned.
 */
export const CLS_WIN_FRONT = "M138,-121 C120,-140 92,-166 66,-176 C44,-182 14,-182 -6,-180 L-14,-121Z";
export const CLS_WIN_REAR = "M-26,-121 L-20,-179 C-70,-176 -130,-164 -168,-146 C-180,-140 -186,-132 -188,-124 L-26,-121Z";
export const CLS_BODY =
  "M332,-44 C336,-60 334,-78 322,-90 C290,-104 240,-112 176,-118 L150,-121 C120,-142 90,-168 62,-178 C30,-188 -40,-186 -96,-174 C-150,-162 -196,-142 -236,-126 C-270,-122 -300,-120 -320,-114 C-332,-104 -336,-80 -334,-46 L-310,-34 L-258,-34 A54,54 0 0 0 -150,-34 L150,-34 A54,54 0 0 0 258,-34 L318,-34Z";

const Wheel: React.FC<{ x: number; rot: number }> = ({ x, rot }) => (
  <g transform={`translate(${x},-46)`}>
    <circle r={47} fill="#060608" />
    <circle r={47} fill="none" stroke="#1c1d22" strokeWidth={3} />
    <circle r={44} fill="none" stroke="#25262c" strokeWidth={1.5} opacity={0.7} />
    {/* bremseskive + kaliber */}
    <circle r={30} fill="#3a3c44" />
    <circle r={30} fill="none" stroke="#5a5e68" strokeWidth={1} strokeDasharray="2 3" />
    <path d="M-12,-29 Q0,-34 12,-29 L10,-21 Q0,-24 -10,-21Z" fill="#c8102e" transform="rotate(-35)" />
    {/* fælg: 10 dobbelt-eger */}
    <circle r={36} fill="none" stroke="url(#gRim)" strokeWidth={4} />
    <g transform={`rotate(${rot})`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d="M-2.4,-8 L-3.4,-34 L3.4,-34 L2.4,-8Z" fill="url(#gRim)" transform={`rotate(${i * 36})`} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={`h${i}`} d="M-0.6,-9 L-1,-33 L0.4,-33 L0.6,-9Z" fill="#fff" opacity={0.5} transform={`rotate(${i * 36})`} />
      ))}
    </g>
    <circle r={9} fill="url(#gRim)" />
    <circle r={6} fill="#14151a" />
    <circle r={3.2} fill="none" stroke="#c9ccd6" strokeWidth={0.8} />
    {/* dæk-sidevæg-refleks */}
    <path d="M-40,-22 A46,46 0 0 1 -18,-42" stroke="#3a3c44" strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);

export const CarCLS: React.FC<{ x: number; y: number; roll?: number; t?: number; lights?: number; children?: React.ReactNode }> = ({ x, y, roll = 0, lights = 0, children }) => (
  <g transform={`translate(${x},${y})`}>
    <defs>
      <clipPath id="clsBody"><path d={`${CLS_BODY} ${CLS_WIN_FRONT} ${CLS_WIN_REAR}`} clipRule="evenodd" /></clipPath>
      <clipPath id="clsWinF"><path d={CLS_WIN_FRONT} /></clipPath>
      <linearGradient id="gPaint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6a7390" />
        <stop offset="0.12" stopColor="#2a3046" />
        <stop offset="0.32" stopColor="#0c0e16" />
        <stop offset="0.52" stopColor="#1e2436" />
        <stop offset="0.6" stopColor="#5a6480" />
        <stop offset="0.66" stopColor="#141824" />
        <stop offset="1" stopColor="#05060a" />
      </linearGradient>
      <linearGradient id="gWinGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3a4a7a" stopOpacity="0.85" />
        <stop offset="0.35" stopColor="#0a0e1e" stopOpacity="0.9" />
        <stop offset="0.45" stopColor="#5a6a9a" stopOpacity="0.7" />
        <stop offset="0.52" stopColor="#0a0e1e" stopOpacity="0.9" />
        <stop offset="1" stopColor="#141a34" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gRim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f2f4fa" />
        <stop offset="0.45" stopColor="#8a90a0" />
        <stop offset="0.6" stopColor="#d8dce6" />
        <stop offset="1" stopColor="#4a4e5a" />
      </linearGradient>
    </defs>
    {/* skygge under bilen */}
    <ellipse cx={0} cy={2} rx={340} ry={14} fill="#000" opacity={0.85} />
    <ellipse cx={0} cy={6} rx={380} ry={26} fill="#000" opacity={0.4} filter="url(#fBlur6)" />
    {/* interiør (tegnes bag ruden) */}
    {children}
    {/* bagrude-glas (mørk tonet) */}
    <path d={CLS_WIN_REAR} fill="url(#gWinGlass)" />
    {/* fordør-rude: ruller ned */}
    <g clipPath="url(#clsWinF)">
      <g transform={`translate(0,${roll * 62})`}>
        <path d={CLS_WIN_FRONT} fill="url(#gWinGlass)" opacity={0.92} />
        <path d="M60,-176 L20,-121 L34,-121 L74,-172Z" fill="#fff" opacity={0.12} />
      </g>
    </g>
    {/* karrosseri */}
    <path d={`${CLS_BODY} ${CLS_WIN_FRONT} ${CLS_WIN_REAR}`} fill="url(#gPaint)" fillRule="evenodd" />
    {/* "hul" til ruderne: karrosseriet ligger rundt om glasset */}
    <g clipPath="url(#clsBody)">
      {/* lakrefleksioner af gadelys (varme striber) */}
      <path d="M-300,-108 C-150,-118 60,-118 300,-100" stroke="#ffd59a" strokeWidth={3} opacity={0.55} fill="none" />
      <path d="M-280,-104 C-120,-112 80,-112 290,-96" stroke="#ffd59a" strokeWidth={10} opacity={0.12} fill="none" filter="url(#fBlur2)" />
      <ellipse cx={-60} cy={-112} rx={70} ry={6} fill="#fff6dc" opacity={0.5} filter="url(#fBlur2)" />
      <ellipse cx={220} cy={-108} rx={40} ry={4} fill="#fff6dc" opacity={0.4} filter="url(#fBlur2)" />
      {/* skulderlinje (faldende karakterlinje) */}
      <path d="M300,-92 C200,-98 60,-98 -60,-94 C-160,-90 -250,-96 -322,-104" stroke="#9aa6c8" strokeWidth={1.8} fill="none" opacity={0.8} />
      <path d="M300,-90 C200,-96 60,-96 -60,-92 C-160,-88 -250,-94 -322,-102" stroke="#000" strokeWidth={2} fill="none" opacity={0.6} />
      {/* nedre linje + sidepanel */}
      <path d="M150,-56 C60,-60 -60,-60 -150,-54" stroke="#7a86a8" strokeWidth={1.4} fill="none" opacity={0.6} />
      <path d="M-150,-40 L150,-40 L150,-34 L-150,-34Z" fill="#05060a" />
      {/* bykulisse spejlet i lakken */}
      {[-260, -180, -90, 20, 120, 230].map((bx, i) => (
        <rect key={i} x={bx} y={-82 + (i % 2) * 6} width={36} height={22} fill="#ffb867" opacity={0.08 + (i % 3) * 0.04} />
      ))}
    </g>
    {/* ruderamme: krom-liste langs taglinje og bælte */}
    <path d="M150,-121 C120,-142 92,-168 62,-178 C30,-188 -40,-186 -96,-174 C-150,-162 -184,-146 -190,-124" stroke="url(#gChrome)" strokeWidth={3} fill="none" />
    <path d="M150,-121 L-190,-123" stroke="url(#gChrome)" strokeWidth={3.2} />
    {/* B-søjle */}
    <path d="M-14,-121 L-6,-180 L-20,-179 L-26,-121Z" fill="#050508" />
    {/* dørfuger */}
    <path d="M148,-118 L146,-42 M-20,-119 C-22,-90 -22,-60 -18,-36 M-190,-122 C-196,-100 -196,-70 -150,-36" stroke="#000" strokeWidth={1.6} fill="none" opacity={0.85} />
    {/* flush dørhåndtag */}
    {[60, -110].map((hx) => (
      <g key={hx}>
        <rect x={hx} y={-108} width={40} height={6} rx={3} fill="url(#gChrome)" />
        <rect x={hx} y={-103} width={40} height={2} fill="#000" opacity={0.5} />
      </g>
    ))}
    {/* sidespejl */}
    <path d="M150,-122 C156,-136 176,-140 190,-134 C196,-128 190,-120 176,-118 L156,-118Z" fill="url(#gPaint)" />
    <path d="M158,-121 L188,-127" stroke="#ffb347" strokeWidth={1.4} opacity={0.8} />
    {/* LED-forlygte + kørelys */}
    <path d="M296,-102 C312,-100 326,-94 332,-86 L322,-84 C312,-90 300,-94 290,-96Z" fill="#dfe8ff" opacity={0.85 + lights * 0.15} />
    <path d="M292,-98 C306,-96 318,-92 326,-86" stroke="#fff" strokeWidth={1.4} opacity={0.9} />
    {/* front: luftindtag + gitter-prikker */}
    <path d="M324,-66 L336,-60 L334,-44 L320,-44Z" fill="#050508" />
    {Array.from({ length: 4 }).map((_, i) => (
      <circle key={i} cx={327} cy={-60 + i * 4.5} r={0.9} fill="#c9ccd6" />
    ))}
    {/* LED-baglygte */}
    <path d="M-318,-116 C-326,-112 -332,-106 -334,-98 L-322,-100 C-318,-106 -312,-110 -304,-112Z" fill="#ff1a2e" />
    <path d="M-326,-108 L-310,-112" stroke="#ff8a8a" strokeWidth={1.2} />
    <circle cx={-322} cy={-106} r={30} fill="url(#rRed)" opacity={0.5} />
    {/* bagspoiler-læbe og diffuser */}
    <path d="M-236,-126 C-260,-128 -300,-124 -322,-118" stroke="#1a1d26" strokeWidth={3} fill="none" />
    <path d="M-330,-48 L-300,-42 L-300,-36 L-334,-44Z" fill="#0a0b0f" />
    <rect x={-322} y={-50} width={14} height={4} rx={2} fill="url(#gChrome)" />
    {/* hjulkasser + hjul */}
    <Wheel x={-204} rot={0} />
    <Wheel x={204} rot={18} />
    <path d="M-262,-40 A58,58 0 0 1 -146,-40" stroke="#05060a" strokeWidth={6} fill="none" />
    <path d="M146,-40 A58,58 0 0 1 262,-40" stroke="#05060a" strokeWidth={6} fill="none" />
    {lights > 0 && <polygon points="330,-90 1200,-260 1200,60 330,-82" fill="url(#gHeadlight)" opacity={0.5 * lights} />}
  </g>
);
