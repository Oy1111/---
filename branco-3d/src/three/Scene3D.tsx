import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { random } from "remotion";
import { Character } from "./Character";
import { Street } from "./Street";
import { phoneScreen, textTex, billTex, bubbleTex, familyTex, photoTex, glowTex } from "./tex";
import { wordTimes, LINES } from "../data/timing";
import { clamp, easeOut, lerp, beatPulse } from "../lib";

const w0 = (l: number, w: string, i = 0) => wordTimes(l, w)[i];
const st = (l: number) => LINES[l][0].t;
const en = (l: number) => LINES[l][LINES[l].length - 1].t + 0.6;
const ap = (t: number, a: number | undefined, d = 0.3) => (a === undefined ? 0 : easeOut((t - a) / d));
const win = (t: number, a: number, b: number, fi = 0.3, fo = 0.4) => clamp((t - a) / fi) * (1 - clamp((t - b) / fo));

/* ---------------- kamera ---------------- */
const CameraRig: React.FC<{ t: number; pos: THREE.Vector3; look: THREE.Vector3; fov: number }> = ({ pos, look, fov }) => {
  const { camera } = useThree();
  camera.position.copy(pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  camera.lookAt(look);
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  return null;
};

/* ---------------- 4x4 ---------------- */
const SUV: React.FC<{ z: number; open: number; lights: number }> = ({ z, open, lights }) => {
  const paint = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#0c0d10", metalness: 0.6, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 }), []);
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d8dce6", metalness: 1, roughness: 0.12 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#05070c", metalness: 0.9, roughness: 0.05 }), []);
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 1.05, 0]} material={paint}><boxGeometry args={[2.0, 1.15, 4.7]} /></mesh>
      <mesh position={[0, 1.95, -0.2]} material={paint}><boxGeometry args={[1.9, 0.75, 3.2]} /></mesh>
      <mesh position={[0, 1.95, 1.42]} material={glass}><boxGeometry args={[1.72, 0.62, 0.04]} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.96, 1.95, -0.2]} material={glass}><boxGeometry args={[0.02, 0.6, 3.0]} /></mesh>
      ))}
      {/* grill + lygter */}
      <mesh position={[0, 0.95, 2.36]} material={paint}><boxGeometry args={[1.2, 0.5, 0.04]} /></mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-0.48 + i * 0.16, 0.95, 2.39]} material={chrome}><boxGeometry args={[0.05, 0.44, 0.02]} /></mesh>
      ))}
      {[-0.78, 0.78].map((x) => (
        <group key={x} position={[x, 1.0, 2.37]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={chrome}><cylinderGeometry args={[0.16, 0.16, 0.06, 32]} /></mesh>
          <mesh position={[0, 0, 0.035]}><circleGeometry args={[0.13, 32]} /><meshBasicMaterial color="#fff6dc" toneMapped={false} /></mesh>
          <spotLight position={[0, 0, 0.1]} target-position={[x * 2, 0.6, 10]} angle={0.5} penumbra={0.6} intensity={30 * lights} distance={14} decay={1.6} color="#fff2d8" />
        </group>
      ))}
      <mesh position={[0, 0.45, 2.42]} material={chrome}><boxGeometry args={[2.05, 0.2, 0.16]} /></mesh>
      <mesh position={[0, 2.38, -0.1]} material={chrome}><boxGeometry args={[1.5, 0.05, 2.6]} /></mesh>
      <mesh position={[0, 2.42, 1.0]}><boxGeometry args={[1.3, 0.08, 0.1]} /><meshBasicMaterial color={lights > 0.3 ? "#fff6dc" : "#333"} toneMapped={false} /></mesh>
      {[-1, 1].map((x) => [-1.5, 1.5].map((zz) => (
        <group key={`${x}${zz}`} position={[x * 1.02, 0.42, zz]}>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.42, 0.42, 0.32, 32]} /><meshStandardMaterial color="#060606" roughness={0.8} /></mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x * 0.17, 0, 0]} material={chrome}><cylinderGeometry args={[0.26, 0.26, 0.02, 24]} /></mesh>
        </group>
      )))}
      {/* fordøre slår op */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.0, 1.2, 1.0]} rotation={[0, s * open * 1.1, 0]}>
          <mesh position={[0, 0, -0.6]} material={paint}><boxGeometry args={[0.06, 1.3, 1.2]} /></mesh>
        </group>
      ))}
      <pointLight position={[0, 1.4, 0]} intensity={2 * open} distance={3} color="#ffd9a0" />
    </group>
  );
};

/* ---------------- sprites ---------------- */
const Glow: React.FC<{ pos: [number, number, number]; s: number; tex: THREE.Texture; op: number }> = ({ pos, s, tex, op }) => (
  <sprite position={pos} scale={[s, s, s]}>
    <spriteMaterial map={tex} transparent opacity={op} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  </sprite>
);
const Panel: React.FC<{ pos: [number, number, number]; w: number; h: number; tex: THREE.Texture; op?: number; rot?: [number, number, number]; emissive?: boolean }> = ({ pos, w, h, tex, op = 1, rot = [0, 0, 0], emissive = true }) => (
  <mesh position={pos} rotation={rot}>
    <planeGeometry args={[w, h]} />
    {emissive ? <meshBasicMaterial map={tex} transparent opacity={op} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} /> : <meshStandardMaterial map={tex} transparent opacity={op} side={THREE.DoubleSide} roughness={0.6} />}
  </mesh>
);

/* ---------------- regn ---------------- */
const Rain: React.FC<{ t: number; amount: number }> = ({ t, amount }) => {
  const N = 380;
  const geo = useMemo(() => new THREE.BoxGeometry(0.006, 0.32, 0.006), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#aac4ff", transparent: true, opacity: 0.45 }), []);
  const ref = useMemo(() => new THREE.InstancedMesh(geo, mat, N), [geo, mat]);
  const m = new THREE.Matrix4();
  for (let i = 0; i < N; i++) {
    const x = (random(`rx${i}`) - 0.5) * 9;
    const z = -random(`rz${i}`) * 14 + 1.6;
    const y = 8 - (((random(`ry${i}`) * 8 + t * (9 + random(`rs${i}`) * 4)) % 8));
    m.makeTranslation(x, i < N * amount ? y : -50, z);
    ref.setMatrixAt(i, m);
  }
  ref.instanceMatrix.needsUpdate = true;
  return <primitive object={ref} />;
};

/* ---------------- sedler ---------------- */
const Bills: React.FC<{ t: number; t0: number; burn?: number; n?: number }> = ({ t, t0, burn = 99, n = 40 }) => {
  const tex = useMemo(() => billTex(), []);
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const k = t - t0 - random(`bd${i}`) * 0.8;
        if (k < 0) return null;
        const x = (random(`bx${i}`) - 0.5) * 2.0 + Math.sin(k * 2 + i) * 0.15;
        const z = 0.6 - random(`bz${i}`) * 2.2;
        const y = 3.4 - ((k * (0.8 + random(`bs${i}`) * 0.6)) % 4);
        const b = clamp((t - burn - random(`bb${i}`) * 0.5) / 0.9);
        return (
          <group key={i} position={[x, y, z]} rotation={[k * 3 * (random(`r1${i}`) - 0.5) + 1, k * 2 + i, k * 2.4 * (random(`r2${i}`) - 0.5)]}>
            <mesh scale={1 - b * 0.4}>
              <planeGeometry args={[0.24, 0.12]} />
              <meshStandardMaterial map={tex} side={THREE.DoubleSide} color={b > 0 ? new THREE.Color().setHSL(0.08, 0.6, 0.5 - b * 0.45) : "#ffffff"} emissive={b > 0 ? "#ff5a10" : "#000000"} emissiveIntensity={b > 0 ? (1 - b) * 2 : 0} transparent opacity={1 - b} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/* ---------------- hovedscene ---------------- */
export const Scene3D: React.FC<{ t: number }> = ({ t }) => {
  const tx = useMemo(
    () => ({
      lock: phoneScreen("lock"), mom: phoneScreen("mom"), gps: phoneScreen("gps"), rent: phoneScreen("rent"),
      nine: textTex("9", "#f4f1ea", 256, 320, "bold 260px Anton, sans-serif"),
      flash: glowTex("#ffffff"), eye: glowTex("#ff5a4a"), warm: glowTex("#ffb867"), red: glowTex("#ff2a3a"), moon: glowTex("#e8eeff"),
      fam: familyTex(), bubbles: ["bla bla", "hva så?", "han er færdig", "snak snak", "ha ha"].map((b) => bubbleTex(b)),
      photos: Array.from({ length: 6 }).map((_, i) => photoTex(i)),
      fifteen: textTex("15 ÅR", "#ffd27a", 512, 200, "bold 150px Anton, sans-serif"),
      fourteen: textTex("14", "#ffd27a", 256, 256, "bold 220px Anton, sans-serif"),
      sign: textTex("HJØRNET", "#f4f1ea", 512, 128, "bold 90px Anton, sans-serif", "#1a5a3a"),
    }),
    [],
  );
  const H2 = st(8) - 0.15, V = st(16) - 0.15;
  const sect = t < H2 ? 0 : t < V ? 1 : 2;
  const o = sect === 1 ? 8 : 0;
  const tt = sect === 1 ? t - (H2 - (st(0) - 0.15)) : t; // hook 2 genspiller hook 1-koreografien

  // --- hook-hændelser (begge hooks) ---
  const fire = wordTimes(o, "fire");
  const nine = w0(o + 1, "9ere") ?? 0;
  const a15 = wordTimes(o + 2, "15");
  const hvem = w0(o + 3, "hvem") ?? 0;
  const stille = w0(o + 4, "stille") ?? 0;
  const fam = w0(o + 5, "familien") ?? 0;
  const glem = w0(o + 5, "glemmer") ?? 0;
  const fryg = w0(o + 6, "frygten") ?? 0;
  const fuck = w0(o + 7, "fuck") ?? 0;
  const inHook = sect < 2;
  const suvIn = inHook ? easeOut((t - (st(o) - 0.4)) / 1.3) : 0;
  const suvOn = inHook ? win(t, st(o) - 0.4, en(o + 2), 0.1, 0.6) : 0;
  const bro = inHook ? clamp((t - (fire[1] ?? 99) + 0.05) / 0.6) : 0;
  const broOn = inHook ? win(t, (fire[1] ?? 99) - 0.1, en(o + 3) + 0.3, 0.2, 0.6) : 0;
  const backT = inHook ? ap(t, nine - 0.1, 0.35) * (1 - clamp((t - en(o + 1)) / 0.4)) : 0;
  const crowd = inHook ? win(t, st(o + 3) - 0.4, hvem + 0.15, 0.3, 0.6) : 0;
  const calm = inHook ? win(t, stille - 0.3, en(o + 4), 0.4, 0.4) : 0;
  const famOn = inHook ? win(t, fam - 0.25, en(o + 5), 0.3, 0.4) : 0;
  const eyes = inHook ? win(t, fryg - 0.2, en(o + 6), 0.25, 0.3) : 0;
  const skud = a15[1] ?? 99;

  // --- vers-hændelser ---
  const b = 16;
  const dag = w0(b + 2, "dag") ?? 99;
  const nat = w0(b + 2, "nat") ?? 99;
  const selv = w0(b + 3, "selv") ?? 99;
  const finde = w0(b + 3, "finde") ?? 99;
  const skejs = w0(b + 4, "skejs") ?? 99;
  const vejen = w0(b + 4, "vejen") ?? 99;
  const fjorten = w0(b + 5, "14") ?? 99;
  const hus = w0(b + 5, "husleje") ?? 99;
  const hjerte = w0(b + 6, "hjerte") ?? 99;
  const liv = w0(b + 7, "liv") ?? 99;
  const blok = w0(b + 7, "blok") ?? 99;
  const kaer = w0(b + 7, "kærlighed") ?? 99;
  const penge = w0(b + 8, "penge") ?? 99;

  const screen = t > hus - 0.3 && t < en(b + 5) ? tx.rent : t > vejen - 0.3 && t < en(b + 4) ? tx.gps : t > st(b + 1) - 0.2 && t < en(b + 1) ? tx.mom : tx.lock;
  const phoneUp = win(t, st(b + 1) - 0.3, en(b + 1), 0.4, 0.5) + win(t, hus - 0.4, en(b + 5), 0.4, 0.4) * 0.6;
  const day = win(t, dag - 0.4, nat - 0.1, 0.35, 0.3);
  const ghost = win(t, finde - 0.1, selv + 0.9, 0.1, 0.4);
  const heart = win(t, hjerte - 0.1, kaer + 0.6, 0.25, 0.4) * (t > kaer ? (Math.floor(t * 14) % 3 ? 0.4 : 1) : 1);
  const off = t > blok ? clamp((t - blok) / 1.4) : 0;
  const glow = sect === 2 ? (t > liv ? lerp(1, 0.35, clamp((t - liv) / 1)) : 1) : 1;
  const lamps = eyes > 0.5 ? 0.15 : t > kaer ? (Math.floor(t * 9) % 4 ? 0.2 : 1) : 1;
  const wet = sect === 1 ? 1 : 0;

  // baggrund/tåge pr. sektion
  const bg = sect === 0 ? "#07081a" : sect === 1 ? "#0a0610" : day > 0 ? "#3a5a8a" : "#060c1a";
  const fogC = sect === 0 ? "#1c1430" : sect === 1 ? "#1a0e18" : day > 0.5 ? "#8aa0c0" : "#0e1a2e";

  // kamera: let push-in, langsom bane på "stille og roligt", lavere på 4x4
  const push = (t % 7) / 7;
  const orbit = calm * Math.sin((t - stille) * 0.6) * 0.5;
  const camPos = new THREE.Vector3(orbit + Math.sin(t * 0.3) * 0.06, 1.5 + Math.sin(t * 0.8) * 0.01, 3.35 - push * 0.2 - eyes * 0.5);
  const look = new THREE.Vector3(0, 1.62, 0);

  return (
    <group>
      <CameraRig t={t} pos={camPos} look={look} fov={42} />
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[fogC, 7, sect === 1 ? 45 : 75]} />
      <hemisphereLight args={[day > 0 ? "#cfe0ff" : "#5a6aaa", "#3a2a1e", 0.9 + day * 1.2]} />
      <ambientLight intensity={0.2 + day * 0.4} />
      <pointLight position={[0, 3.2, -2.5]} intensity={10} distance={9} decay={2} color="#ffd2a0" />
      <spotLight position={[-2.2, 3.2, 2.4]} angle={0.6} penumbra={0.8} intensity={5 * (1 - eyes * 0.8)} distance={10} decay={2} color="#ffc58a" />
      <spotLight position={[2.2, 2.6, -2.2]} angle={0.7} penumbra={0.6} intensity={14} distance={8} decay={2} color={sect === 1 ? "#ff4a5a" : "#7aa8ff"} />
      <spotLight position={[-2.0, 2.4, -2.0]} angle={0.7} penumbra={0.6} intensity={9} distance={8} decay={2} color={sect === 1 ? "#4a8aff" : "#ffb070"} />
      {/* måne */}
      {day < 0.5 && <Glow pos={[6, 18, -50]} s={10} tex={tx.moon} op={0.9} />}
      {day > 0 && <Glow pos={[lerp(-14, 6, clamp((t - dag + 0.4) / 1.2)), lerp(4, 16, clamp((t - dag + 0.4) / 1.2)), -50]} s={22} tex={tx.warm} op={day} />}

      <Street t={t} speed={sect === 2 ? 0.9 : 1.3} glow={glow * (1 - eyes * 0.7)} off={off} lamps={lamps} wet={wet} lampHue={sect === 1 ? "#ffd0a0" : "#ffb766"} />
      {sect === 1 && <Rain t={t} amount={1} />}

      {/* ---- HOOK ---- */}
      <SUV z={suvOn > 0 ? lerp(-30, -4.2, suvIn) : -200} open={ap(t, fire[0], 0.5)} lights={suvOn} />
      {crowd > 0 &&
        Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[-3 + i * 0.75, 0.9, -3.4 - (i % 3) * 0.5]}>
            <capsuleGeometry args={[0.22, 1.1, 6, 12]} />
            <meshStandardMaterial color="#0a0a10" transparent opacity={crowd * 0.9} />
          </mesh>
        ))}
      {broOn > 0 &&
        [[-0.95, -0.9], [-0.5, -2.0], [0.5, -2.0], [0.95, -0.9]].map(([x, z], i) => (
          <group key={i} position={[x, 0, lerp(z - 1.6, z, bro)]} rotation={[0, backT * Math.PI, 0]} scale={0.98}>
            <Character t={tt + i} look={{ jacket: ["#141418", "#1a1a22", "#22140e", "#101418"][i], inner: "#0a0a10", lens: "#1a1a1a", glow: 0 }} down chain={false} back={tx.nine} />
          </group>
        ))}
      {a15[0] !== undefined && t > a15[0] - 0.1 && t < skud + 0.9 && <Panel pos={[0, 2.62, -2.4]} w={1.3} h={0.5} tex={tx.fifteen} op={ap(t, a15[0], 0.2) * (1 - clamp((t - skud - 0.4) / 0.5))} />}
      {/* 15 kamerablitz */}
      {t > skud - 0.1 && t < skud + 1.3 &&
        Array.from({ length: 15 }).map((_, i) => {
          const ft = skud - 0.05 + i * 0.065;
          const k = t - ft;
          if (k < 0 || k > 0.3) return null;
          const p: [number, number, number] = [(random(`fx${i}`) - 0.5) * 1.9, 1.1 + random(`fy${i}`) * 1.5, -1.0 - random(`fz${i}`) * 1.6];
          return (
            <group key={i}>
              <Glow pos={p} s={1.6} tex={tx.flash} op={1 - k / 0.3} />
            </group>
          );
        })}
      {(() => {
        let fi = 0, fk = 0;
        for (let i = 0; i < 15; i++) { const k = t - (skud - 0.05 + i * 0.065); if (k >= 0 && k < 0.3) { fi = i; fk = 1 - k / 0.3; } }
        return <pointLight position={[(random(`fx${fi}`) - 0.5) * 1.9, 1.1 + random(`fy${fi}`) * 1.5, -1.0 - random(`fz${fi}`) * 1.6]} intensity={6 * fk} distance={4} color="#ffffff" />;
      })()}
      {/* stille og roligt: regn/støv fryser + varm lampe-glød */}
      {calm > 0 && <Glow pos={[0, 2.4, -0.6]} s={2.4} tex={tx.warm} op={calm * 0.5} />}
      {/* familien i et vindue */}
      {famOn > 0 && <Panel pos={[-0.62, 2.45, -1.9]} w={0.7} h={0.88} tex={tx.fam} op={famOn} rot={[0, 0.2, 0]} />}
      <pointLight position={[-0.6, 2.4, -1.4]} intensity={3 * famOn} distance={3} color="#ffc070" />
      {t > glem - 0.2 && t < glem + 1.6 &&
        tx.photos.map((p, i) => {
          const k = t - glem - i * 0.1;
          if (k < 0) return null;
          return <Panel key={i} pos={[(i - 2.5) * 0.45, 2.6 - k * 0.9, 0.3 - (i % 2) * 0.4]} w={0.2} h={0.24} tex={p} rot={[0.2, Math.sin(k + i) * 0.5, Math.sin(k * 2 + i) * 0.4]} op={clamp(k * 4) * (1 - clamp((k - 1.1) / 0.4))} emissive={false} />;
        })}
      {/* øjne i mørket + i hans brilleglas */}
      {eyes > 0 &&
        Array.from({ length: 14 }).map((_, i) => {
          const x = (random(`ex${i}`) - 0.5) * 6;
          const y = 1.2 + random(`ey${i}`) * 2;
          const z = -3 - random(`ez${i}`) * 6;
          const bl = Math.sin(t * 3 + i * 2.1) > 0.96 ? 0 : 1;
          return [-0.06, 0.06].map((dx) => <Glow key={`${i}${dx}`} pos={[x + dx, y, z]} s={0.16} tex={tx.eye} op={eyes * bl * clamp((eyes - random(`eo${i}`) * 0.5) * 2)} />);
        })}
      {eyes > 0 && [-0.036, 0.036].map((x) => [-0.008, 0.008].map((dx) => <Glow key={`${x}${dx}`} pos={[x + dx, 1.69, 0.12]} s={0.012} tex={tx.eye} op={eyes} />))}
      {/* talebobler der splintres */}
      {t > fuck - 1.4 && t < fuck + 0.9 &&
        tx.bubbles.map((bt, i) => {
          const k = t - (fuck - 1.4) - i * 0.12;
          if (k < 0) return null;
          const sh = Math.max(0, t - fuck);
          const p: [number, number, number] = [(i % 2 ? 1 : -1) * (0.45 + (i % 3) * 0.1), 2.0 + Math.floor(i / 2) * 0.3, -0.5 - (i % 3) * 0.3];
          if (sh > 0)
            return Array.from({ length: 8 }).map((_, j) => (
              <mesh key={`${i}${j}`} position={[p[0] + (j - 3.5) * 0.04 + sh * (j - 3.5) * 0.5, p[1] - sh * sh * 3 * (0.5 + random(`s${i}${j}`)), p[2]]} rotation={[sh * 6 * random(`a${i}${j}`), sh * 5, sh * 7 * random(`b${i}${j}`)]}>
                <planeGeometry args={[0.07, 0.12]} />
                <meshBasicMaterial color="#f4f1ea" transparent opacity={1 - sh / 0.9} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            ));
          return <Panel key={i} pos={p} w={0.5} h={0.2} tex={bt} op={Math.min(1, k * 6)} />;
        })}

      {/* ---- VERS ---- */}
      {sect === 2 && (
        <group>
          {/* hjørnet: vejskilt + tom gynge */}
          {win(t, st(b) - 0.3, en(b), 0.3, 0.4) > 0 && (
            <group>
              <mesh position={[-0.85, 1.4, -1.6]}><cylinderGeometry args={[0.03, 0.03, 2.8, 10]} /><meshStandardMaterial color="#2a2e38" metalness={0.6} roughness={0.4} /></mesh>
              <Panel pos={[-0.55, 2.65, -1.6]} w={0.7} h={0.18} tex={tx.sign} emissive={false} />
              <group position={[0.95, 0, -2.8]}>
                {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 1.1, 0]} rotation={[0, 0, x * 0.15]}><cylinderGeometry args={[0.04, 0.04, 2.3, 10]} /><meshStandardMaterial color="#3a3e4a" metalness={0.5} /></mesh>)}
                <mesh position={[0, 2.22, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.04, 0.04, 1.4, 10]} /><meshStandardMaterial color="#3a3e4a" metalness={0.5} /></mesh>
                <group position={[0, 2.2, 0]} rotation={[Math.sin(t * 2.2) * 0.25, 0, 0]}>
                  {[-0.2, 0.2].map((x) => <mesh key={x} position={[x, -0.6, 0]}><cylinderGeometry args={[0.006, 0.006, 1.2, 6]} /><meshStandardMaterial color="#8a8e98" metalness={0.8} /></mesh>)}
                  <mesh position={[0, -1.2, 0]}><boxGeometry args={[0.5, 0.04, 0.18]} /><meshStandardMaterial color="#2a1a12" /></mesh>
                </group>
              </group>
            </group>
          )}
          {/* skejs: sedler regner / brænder */}
          {t > skejs - 0.3 && t < en(b + 4) + 0.3 && <Bills t={t} t0={skejs - 0.3} />}
          {t > penge - 0.6 && <Bills t={t} t0={penge - 0.9} burn={penge} n={30} />}
          {t > fjorten - 0.2 && t < en(b + 5) && <Panel pos={[-0.6, 2.45, -1.8]} w={0.75} h={0.75} tex={tx.fourteen} op={ap(t, fjorten, 0.2)} />}
        </group>
      )}

      {/* hovedpersonen + spøgelses-kopier */}
      {ghost > 0 &&
        [-0.22, 0.22].map((x) => (
          <group key={x} position={[x + Math.sin(t * 40) * 0.02, 0, -0.1]}>
            <Character t={t + x} look={{ jacket: x < 0 ? "#3a6a8a" : "#8a3a5a", inner: "#1a2238", lens: "#ff8aa8", glow: 0.3, screen: tx.lock }} />
          </group>
        ))}
      <Character t={t} look={{ jacket: "#3b4232", inner: "#1a2238", lens: "#ff8aa8", glow: 1, screen }} phoneUp={phoneUp} heart={heart} nod={beatPulse(t) * 0.25} lights />
    </group>
  );
};
