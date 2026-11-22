import React from "react";
import { staticFile } from "remotion";

/** Fælles teksturer, gradienter og filtre for hele verdenen (world units). */
export const WorldDefs: React.FC = () => (
  <defs>
    <pattern id="pBrick" patternUnits="userSpaceOnUse" width={256} height={256}>
      <image href={staticFile("tex/brick.png")} width={256} height={256} />
    </pattern>
    <pattern id="pBrickDark" patternUnits="userSpaceOnUse" width={256} height={256}>
      <image href={staticFile("tex/brick.png")} width={256} height={256} style={{ filter: "brightness(.55) saturate(.7)" }} />
    </pattern>
    <pattern id="pStucco" patternUnits="userSpaceOnUse" width={360} height={360}>
      <image href={staticFile("tex/stucco.png")} width={360} height={360} />
    </pattern>
    <pattern id="pCobble" patternUnits="userSpaceOnUse" width={180} height={120}>
      <image href={staticFile("tex/cobble.png")} width={180} height={120} preserveAspectRatio="none" />
    </pattern>
    <pattern id="pAsphalt" patternUnits="userSpaceOnUse" width={400} height={400}>
      <image href={staticFile("tex/asphalt.png")} width={400} height={400} />
    </pattern>
    <pattern id="pZinc" patternUnits="userSpaceOnUse" width={120} height={120}>
      <image href={staticFile("tex/zinc.png")} width={120} height={120} />
    </pattern>
    <pattern id="pTiles" patternUnits="userSpaceOnUse" width={80} height={80}>
      <image href={staticFile("tex/tiles.png")} width={80} height={80} />
    </pattern>
    <pattern id="pSlab" patternUnits="userSpaceOnUse" width={120} height={60}>
      <rect width={120} height={60} fill="#3a3640" />
      <rect x={2} y={2} width={116} height={56} fill="#45404a" />
      <rect x={2} y={2} width={116} height={6} fill="#56505a" />
    </pattern>

    <linearGradient id="gNightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#03050f" />
      <stop offset="0.45" stopColor="#0b1430" />
      <stop offset="0.8" stopColor="#24264a" />
      <stop offset="1" stopColor="#4a3550" />
    </linearGradient>
    <linearGradient id="gFacadeNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#050814" stopOpacity="0.78" />
      <stop offset="0.5" stopColor="#0a0c1c" stopOpacity="0.55" />
      <stop offset="0.85" stopColor="#1a0f0a" stopOpacity="0.25" />
      <stop offset="1" stopColor="#2a160a" stopOpacity="0.1" />
    </linearGradient>
    <linearGradient id="gWinLit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffe7b0" />
      <stop offset="0.55" stopColor="#ffbd63" />
      <stop offset="1" stopColor="#c9762c" />
    </linearGradient>
    <linearGradient id="gWinLitCool" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#dfe8ff" />
      <stop offset="1" stopColor="#7d92c9" />
    </linearGradient>
    <linearGradient id="gWinDark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#1d2748" />
      <stop offset="0.42" stopColor="#0b1026" />
      <stop offset="0.48" stopColor="#24305a" />
      <stop offset="0.56" stopColor="#0b1026" />
      <stop offset="1" stopColor="#060914" />
    </linearGradient>
    <linearGradient id="gShop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff1cf" />
      <stop offset="0.6" stopColor="#ffc777" />
      <stop offset="1" stopColor="#a8622a" />
    </linearGradient>
    <linearGradient id="gCornice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
      <stop offset="0.35" stopColor="#fff" stopOpacity="0.05" />
      <stop offset="1" stopColor="#000" stopOpacity="0.45" />
    </linearGradient>
    <linearGradient id="gShadowDown" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0.55" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="gShadowUp" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity="0.5" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="gCurtain" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8a3d1f" />
      <stop offset="0.3" stopColor="#b8582a" />
      <stop offset="0.6" stopColor="#7a3218" />
      <stop offset="1" stopColor="#a14a22" />
    </linearGradient>
    <linearGradient id="gSheer" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff6e0" stopOpacity="0.55" />
      <stop offset="0.5" stopColor="#fff6e0" stopOpacity="0.25" />
      <stop offset="1" stopColor="#fff6e0" stopOpacity="0.5" />
    </linearGradient>
    <linearGradient id="gMetalCar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5d6680" />
      <stop offset="0.2" stopColor="#1c2130" />
      <stop offset="0.55" stopColor="#0a0c14" />
      <stop offset="0.75" stopColor="#262c40" />
      <stop offset="1" stopColor="#05060a" />
    </linearGradient>
    <linearGradient id="gGlassCar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#2b3a66" />
      <stop offset="0.4" stopColor="#080b18" />
      <stop offset="0.47" stopColor="#3a4a80" />
      <stop offset="0.55" stopColor="#080b18" />
      <stop offset="1" stopColor="#101630" />
    </linearGradient>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff3c9" />
      <stop offset="0.45" stopColor="#ffc861" />
      <stop offset="1" stopColor="#9a5e15" />
    </linearGradient>
    <linearGradient id="gChrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.5" stopColor="#7d8aa8" />
      <stop offset="1" stopColor="#d9e2f5" />
    </linearGradient>
    <linearGradient id="gLampCone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffd590" stopOpacity="0.5" />
      <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="gHeadlight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fffbe8" stopOpacity="0.75" />
      <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="rWarm">
      <stop offset="0" stopColor="#ffd28a" stopOpacity="0.75" />
      <stop offset="0.4" stopColor="#ffa94d" stopOpacity="0.25" />
      <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rHot">
      <stop offset="0" stopColor="#fffaf0" stopOpacity="1" />
      <stop offset="0.2" stopColor="#ffd28a" stopOpacity="0.7" />
      <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rEmber">
      <stop offset="0" stopColor="#fff2c0" stopOpacity="1" />
      <stop offset="0.25" stopColor="#ff7a1a" stopOpacity="0.9" />
      <stop offset="1" stopColor="#ff3a00" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rBlue">
      <stop offset="0" stopColor="#bcd4ff" stopOpacity="0.7" />
      <stop offset="1" stopColor="#5a7cff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rRed">
      <stop offset="0" stopColor="#ffd0d4" stopOpacity="1" />
      <stop offset="0.3" stopColor="#ff2a3c" stopOpacity="0.6" />
      <stop offset="1" stopColor="#ff2a3c" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rMagenta">
      <stop offset="0" stopColor="#ffe0f4" stopOpacity="1" />
      <stop offset="0.3" stopColor="#ff3dc8" stopOpacity="0.55" />
      <stop offset="1" stopColor="#ff3dc8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rCyan">
      <stop offset="0" stopColor="#e8fbff" stopOpacity="1" />
      <stop offset="0.3" stopColor="#3de0ff" stopOpacity="0.55" />
      <stop offset="1" stopColor="#3de0ff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rShadow">
      <stop offset="0" stopColor="#000" stopOpacity="0.8" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rSmoke">
      <stop offset="0" stopColor="#d8d4cc" stopOpacity="0.55" />
      <stop offset="0.6" stopColor="#b9b4ac" stopOpacity="0.2" />
      <stop offset="1" stopColor="#a9a49c" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="rMoon">
      <stop offset="0" stopColor="#fffbea" stopOpacity="0.5" />
      <stop offset="1" stopColor="#c8d4ff" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="gShadeR" x1="0" y1="0" x2="1" y2="0.15">
      <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
      <stop offset="0.32" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.6" stopColor="#000" stopOpacity="0.12" />
      <stop offset="1" stopColor="#000" stopOpacity="0.6" />
    </linearGradient>
    <linearGradient id="gShadeL" x1="1" y1="0" x2="0" y2="0.15">
      <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
      <stop offset="0.32" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.6" stopColor="#000" stopOpacity="0.12" />
      <stop offset="1" stopColor="#000" stopOpacity="0.6" />
    </linearGradient>
    <linearGradient id="gHaze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6a6a9a" stopOpacity="0" />
      <stop offset="0.6" stopColor="#6a6a9a" stopOpacity="0.12" />
      <stop offset="1" stopColor="#6a6a9a" stopOpacity="0" />
    </linearGradient>
    <filter id="fBlur2"><feGaussianBlur stdDeviation="2" /></filter>
    <filter id="fBlur6"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="fBlur14"><feGaussianBlur stdDeviation="14" /></filter>
    <filter id="fBlur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30" /></filter>
    <filter id="fNeon" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b2" />
      <feMerge>
        <feMergeNode in="b2" />
        <feMergeNode in="b1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);
