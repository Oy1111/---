import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";

/** Procedurale facade-teksturer (farve + selvlysende vinduer). */
const facadeTex = (seed: number, kind: "brick" | "plaster" | "concrete", shop: string) => {
  const W = 512, H = 1024;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const e = document.createElement("canvas"); e.width = W; e.height = H;
  const g = c.getContext("2d")!, ge = e.getContext("2d")!;
  const base = kind === "brick" ? "#5a2e22" : kind === "plaster" ? ["#b8a07a", "#8e9aa6", "#a87a5a", "#9aa890"][seed % 4] : "#6a6a70";
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  ge.fillStyle = "#000"; ge.fillRect(0, 0, W, H);
  // tekstur
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(${random(`n${seed}${i}`) < 0.5 ? "0,0,0" : "255,255,255"},${0.03 + random(`a${seed}${i}`) * 0.05})`;
    g.fillRect(random(`x${seed}${i}`) * W, random(`y${seed}${i}`) * H, 2 + random(`w${seed}${i}`) * 6, 2);
  }
  if (kind === "brick") {
    for (let y = 0; y < H; y += 12) {
      for (let x = ((y / 12) % 2) * 14; x < W; x += 28) {
        g.fillStyle = `rgba(${90 + random(`b${seed}${x}${y}`) * 40},${40 + random(`c${seed}${x}${y}`) * 20},30,0.5)`;
        g.fillRect(x, y, 26, 10);
      }
    }
  }
  // gesimser
  for (let f = 0; f < 6; f++) {
    g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, 180 + f * 140, W, 6);
    g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(0, 186 + f * 140, W, 8);
  }
  // vinduer
  for (let f = 0; f < 5; f++)
    for (let k = 0; k < 4; k++) {
      const x = 40 + k * 118, y = 40 + f * 140, w = 70, h = 100;
      const lit = random(`l${seed}${f}${k}`) < 0.42;
      g.fillStyle = "#e8e2d6"; g.fillRect(x - 6, y - 6, w + 12, h + 12);
      g.fillStyle = lit ? "#ffcf86" : "#1a2238"; g.fillRect(x, y, w, h);
      if (lit) {
        const warm = random(`w${seed}${f}${k}`) < 0.85;
        ge.fillStyle = warm ? "#ffb85a" : "#9cc4ff"; ge.fillRect(x, y, w, h);
        if (random(`cu${seed}${f}${k}`) < 0.5) { g.fillStyle = "#8a3d1f"; g.fillRect(x, y, 18, h); g.fillRect(x + w - 18, y, 18, h); ge.fillStyle = "#3a1a08"; ge.fillRect(x, y, 18, h); ge.fillRect(x + w - 18, y, 18, h); }
      } else {
        const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, "#2a3a5a"); gr.addColorStop(0.5, "#0a1020"); gr.addColorStop(0.55, "#3a4a6a"); gr.addColorStop(1, "#0a1020");
        g.fillStyle = gr; g.fillRect(x, y, w, h);
      }
      g.fillStyle = "#e8e2d6"; g.fillRect(x + w / 2 - 2, y, 4, h); g.fillRect(x, y + h * 0.35, w, 4);
      ge.fillStyle = "#000"; ge.fillRect(x + w / 2 - 2, y, 4, h); ge.fillRect(x, y + h * 0.35, w, 4);
      g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(x - 8, y + h + 6, w + 16, 6);
    }
  // butik i stueetagen
  g.fillStyle = "#14110e"; g.fillRect(0, 760, W, 264);
  g.fillStyle = "#ffd59a"; g.fillRect(30, 830, W - 60, 170);
  ge.fillStyle = "#c88a40"; ge.fillRect(30, 830, W - 60, 170);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 9; j++) { const col = ["#c23a2a", "#2a5a8a", "#e8d6a0", "#3a7a3a"][(i + j) % 4]; g.fillStyle = col; ge.fillStyle = col; g.fillRect(50 + j * 48, 860 + i * 50, 36, 30); ge.globalAlpha = 0.4; ge.fillRect(50 + j * 48, 860 + i * 50, 36, 30); ge.globalAlpha = 1; }
  g.fillStyle = "#101418"; g.fillRect(20, 772, W - 40, 50);
  g.font = "bold 40px Anton, sans-serif"; g.textAlign = "center"; g.fillStyle = "#f2dca6"; g.fillText(shop, W / 2, 812);
  ge.font = "bold 40px Anton, sans-serif"; ge.textAlign = "center"; ge.fillStyle = "#ffcf86"; ge.fillText(shop, W / 2, 812);
  const t1 = new THREE.CanvasTexture(c); t1.colorSpace = THREE.SRGBColorSpace; t1.anisotropy = 4;
  const t2 = new THREE.CanvasTexture(e); t2.colorSpace = THREE.SRGBColorSpace;
  return { map: t1, emissive: t2 };
};

const SHOPS = ["KIOSK", "GRILL", "FRISØR", "BAGERI", "CAFÉ", "VASKERI", "PIZZA", "BAR"];
export const BLEN = 7; // bygningslængde langs z
const NB = 12;

export const Street: React.FC<{ t: number; speed: number; lampHue?: string; glow?: number; off?: number; lamps?: number; wet?: number }> = ({ t, speed, lampHue = "#ffb766", glow = 1, off = 0, lamps = 1, wet = 0 }) => {
  const texes = useMemo(() => Array.from({ length: 8 }).map((_, i) => facadeTex(i, i % 3 === 0 ? "brick" : i % 3 === 1 ? "plaster" : "concrete", SHOPS[i])), []);
  const mats = useMemo(() => Array.from({ length: NB * 2 }).map((_, i) => new THREE.MeshStandardMaterial({ map: texes[i % 8].map, emissiveMap: texes[i % 8].emissive, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 1.1, roughness: 0.85 })), [texes]);
  const road = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0d0e12", roughness: 0.18, metalness: 0.3 }), []);
  road.roughness = 0.2 - wet * 0.15;
  mats.forEach((m, i) => { m.emissiveIntensity = 1.1 * glow * (random(`off${i}`) < off ? 0.04 : 1); });
  const walk = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2a30", roughness: 0.6 }), []);
  const span = BLEN * NB;
  const dz = t * speed;
  const wrap = (z: number) => (((z % span) + span) % span) - span + 8;
  const items: React.ReactNode[] = [];
  for (let i = 0; i < NB; i++) {
    for (const side of [-1, 1]) {
      const zz = wrap(-i * BLEN - dz);
      const k = i * 2 + (side > 0 ? 1 : 0);
      const h = 14 + random(`h${i}${side}`) * 8;
      items.push(
        <mesh key={`b${i}${side}`} position={[side * 7.5, h / 2, zz]} material={[mats[k], mats[k], mats[k], mats[k], mats[k], mats[k]]}>
          <boxGeometry args={[3, h, BLEN - 0.2]} />
        </mesh>,
      );
      // gadelygte
      if (i % 2 === 0) {
        items.push(
          <group key={`l${i}${side}`} position={[side * 4.8, 0, zz]}>
            <mesh position={[0, 2.6, 0]}><cylinderGeometry args={[0.05, 0.08, 5.2, 10]} /><meshStandardMaterial color="#121418" metalness={0.6} roughness={0.4} /></mesh>
            <mesh position={[-side * 0.5, 5.2, 0]}><boxGeometry args={[1.1, 0.06, 0.06]} /><meshStandardMaterial color="#121418" /></mesh>
            <mesh position={[-side * 1.0, 5.1, 0]}><sphereGeometry args={[0.16, 16, 12]} /><meshBasicMaterial color={lamps > 0.5 ? lampHue : "#2a2420"} toneMapped={false} /></mesh>
          </group>,
        );
      }
      // parkerede biler
      if (random(`car${i}${side}`) < 0.55) {
        const cc = ["#0e1018", "#3a0e12", "#d8d8dc", "#1a2a3a"][Math.floor(random(`cc${i}${side}`) * 4)];
        items.push(
          <group key={`c${i}${side}`} position={[side * 3.6, 0, zz + 1.5]}>
            <mesh position={[0, 0.55, 0]}><boxGeometry args={[1.8, 0.7, 4.3]} /><meshPhysicalMaterial color={cc} metalness={0.5} roughness={0.25} clearcoat={1} /></mesh>
            <mesh position={[0, 1.05, -0.2]}><boxGeometry args={[1.6, 0.5, 2.3]} /><meshPhysicalMaterial color="#05070c" metalness={0.8} roughness={0.08} /></mesh>
            {[-0.9, 0.9].map((x) => [-1.4, 1.4].map((z2) => (
              <mesh key={`${x}${z2}`} position={[x, 0.33, z2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.33, 0.33, 0.25, 20]} /><meshStandardMaterial color="#050505" /></mesh>
            )))}
            <mesh position={[0, 0.6, 2.16]}><boxGeometry args={[1.5, 0.12, 0.02]} /><meshBasicMaterial color="#ff2a3a" toneMapped={false} /></mesh>
          </group>,
        );
      }
    }
  }
  // et par rigtige lys tæt på kameraet (resten er glød)
  const lightZ = [wrap(-dz) , wrap(-dz - BLEN * 2), wrap(-dz - BLEN * 4)];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} material={road}>
        <planeGeometry args={[9, 140]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 5.3, 0.08, -40]} material={walk}>
          <boxGeometry args={[1.6, 0.16, 140]} />
        </mesh>
      ))}
      {/* vejstriber */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, ((((-i * 5 - dz) % 120) + 120) % 120) - 112]}>
          <planeGeometry args={[0.12, 2.2]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.5} />
        </mesh>
      ))}
      {items}
      {lightZ.map((z, i) => (
        <pointLight key={i} position={[i % 2 ? 3.8 : -3.8, 5, z]} intensity={18 * lamps} distance={16} decay={1.6} color={lampHue} />
      ))}
    </group>
  );
};
