import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Original rapper-karakter i 3D (ikke kunstnerens ansigt): mat satin-dynejakke med syede kamre og hætte op,
 * sort strik-balaclava, rosa pilotbriller i guld, tyk guldkæde med kors, læderhandsker og telefon med lysende skærm.
 * Enheder: meter. Fødder ved y=0 (benene er under billedkanten).
 */
export type CharLook = { jacket: string; inner: string; lens: string; glow: number; screen?: THREE.Texture | null };

/** Lathe-profil med dyne-kamre: r(y) = silhuet + bump pr. kammer. */
const torsoGeo = () => {
  const pts: THREE.Vector2[] = [];
  const y0 = 0.82, y1 = 1.5, n = 120;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const y = y0 + (y1 - y0) * u;
    const sil = 0.205 + 0.03 * Math.sin(u * Math.PI * 0.9) + (u > 0.86 ? -0.55 * (u - 0.86) : 0);
    const k = ((y - y0) / 0.082) % 1;
    const bump = 0.016 * Math.sin(k * Math.PI);
    pts.push(new THREE.Vector2(Math.max(0.06, sil + bump), y));
  }
  pts.push(new THREE.Vector2(0.06, y1 + 0.02));
  const g = new THREE.LatheGeometry(pts, 72);
  g.computeVertexNormals();
  return g;
};

/** Ærme-segment langs y (længde L) med kamre; placeres med quaternion. */
const sleeveGeo = (L: number, r0: number, r1: number, pitch = 0.075) => {
  const pts: THREE.Vector2[] = [];
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const y = u * L;
    const k = (y / pitch) % 1;
    pts.push(new THREE.Vector2(r0 + (r1 - r0) * u + 0.011 * Math.sin(k * Math.PI), y));
  }
  const g = new THREE.LatheGeometry(pts, 36);
  g.computeVertexNormals();
  return g;
};

const place = (a: THREE.Vector3, b: THREE.Vector3) => {
  const d = b.clone().sub(a);
  return { pos: a, q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()), len: d.length() };
};

export const Character: React.FC<{ t: number; look: CharLook; nod?: number; turn?: number; phoneUp?: number; down?: boolean; chain?: boolean; back?: THREE.Texture | null; heart?: number; lights?: boolean }> = ({ t, look, nod = 0, turn = 0, phoneUp = 0, down = false, chain: showChain = true, back = null, heart = 0, lights = false }) => {
  const mats = useMemo(
    () => ({
      jacket: new THREE.MeshPhysicalMaterial({ color: look.jacket, roughness: 0.52, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#9aa88a"), sheenRoughness: 0.6 }),
      seam: new THREE.MeshStandardMaterial({ color: "#14160f", roughness: 0.9 }),
      inner: new THREE.MeshStandardMaterial({ color: look.inner, roughness: 0.95 }),
      knit: new THREE.MeshStandardMaterial({ color: "#0e0e11", roughness: 1 }),
      gold: new THREE.MeshStandardMaterial({ color: "#e2b04a", metalness: 1, roughness: 0.2 }),
      lens: new THREE.MeshPhysicalMaterial({ color: look.lens, roughness: 0.04, metalness: 0.3, transparent: true, opacity: 0.82, clearcoat: 1, emissive: new THREE.Color(look.lens), emissiveIntensity: 0.08 }),
      leather: new THREE.MeshPhysicalMaterial({ color: "#0c0c0e", roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 }),
      zip: new THREE.MeshStandardMaterial({ color: "#2a2a2e", metalness: 0.9, roughness: 0.3 }),
      phone: new THREE.MeshPhysicalMaterial({ color: "#121216", metalness: 0.7, roughness: 0.22, clearcoat: 1 }),
      pants: new THREE.MeshStandardMaterial({ color: "#121218", roughness: 0.9 }),
    }),
    [look.jacket, look.inner, look.lens],
  );
  const torso = useMemo(() => torsoGeo(), []);
  const ph = phoneUp;
  const arms = useMemo(
    () =>
      [-1, 1].map((s) => {
        const sh = new THREE.Vector3(0.235 * s, 1.41, 0);
        const el = down ? new THREE.Vector3(0.265 * s, 1.12, 0.0) : new THREE.Vector3(0.26 * s, 1.1, 0.08);
        const ha = down ? new THREE.Vector3(0.25 * s, 0.86, 0.06) : new THREE.Vector3(0.065 * s, 1.08 + ph * 0.25, 0.27);
        const up = place(sh, el), lo = place(el, ha);
        return { s, sh, el, ha, up, lo, upG: sleeveGeo(up.len, 0.064, 0.058), loG: sleeveGeo(lo.len, 0.056, 0.048) };
      }),
    [ph, down],
  );
  const chain = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.085, 1.47, 0.06), new THREE.Vector3(-0.06, 1.34, 0.15), new THREE.Vector3(0, 1.29, 0.175), new THREE.Vector3(0.06, 1.34, 0.15), new THREE.Vector3(0.085, 1.47, 0.06)]);
    return Array.from({ length: 48 }).map((_, i) => {
      const u = i / 47;
      const p = curve.getPointAt(u);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), curve.getTangentAt(u));
      q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (i % 2) * Math.PI * 0.5));
      return { p, q };
    });
  }, []);
  const breath = Math.sin(t * 1.6) * 0.006;
  return (
    <group position={[Math.sin(t * 0.7) * 0.012, breath, 0]} rotation={[0, turn + Math.sin(t * 0.45) * 0.035, 0]}>
      {/* hofte/bukser (skjult af billedkanten) */}
      <mesh position={[0, 0.7, 0]} scale={[1, 1, 0.7]} material={mats.pants}>
        <cylinderGeometry args={[0.19, 0.2, 0.3, 40]} />
      </mesh>
      {/* torso */}
      <mesh geometry={torso} scale={[1, 1, 0.66]} material={mats.jacket} castShadow />
      {/* syninger mellem kamrene */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 0.82 + (i + 1) * 0.082;
        const u = (y - 0.82) / 0.68;
        const r = 0.205 + 0.03 * Math.sin(u * Math.PI * 0.9) + (u > 0.86 ? -0.55 * (u - 0.86) : 0);
        return (
          <mesh key={i} position={[0, y, 0]} scale={[1, 1, 0.66]} rotation={[Math.PI / 2, 0, 0]} material={mats.seam}>
            <torusGeometry args={[r + 0.001, 0.0025, 6, 72]} />
          </mesh>
        );
      })}
      {/* lynlås */}
      <mesh position={[0, 1.15, 0.157]} material={mats.zip}>
        <boxGeometry args={[0.012, 0.62, 0.008]} />
      </mesh>
      <mesh position={[0, 1.44, 0.15]} material={mats.zip}>
        <boxGeometry args={[0.02, 0.04, 0.012]} />
      </mesh>
      {/* høj krave + hættetrøje under */}
      <mesh position={[0, 1.52, 0.0]} scale={[1, 1, 0.8]} material={mats.jacket}>
        <cylinderGeometry args={[0.105, 0.13, 0.11, 48, 1, true]} />
      </mesh>
      <mesh position={[0, 1.5, 0.02]} material={mats.inner}>
        <cylinderGeometry args={[0.07, 0.085, 0.09, 24]} />
      </mesh>
      {/* skuldre */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.2 * s, 1.41, 0]} scale={[0.085, 0.068, 0.088]} material={mats.jacket}>
          <sphereGeometry args={[1, 32, 16]} />
        </mesh>
      ))}
      {/* arme med kamre */}
      {arms.map((a) => (
        <group key={a.s}>
          <mesh geometry={a.upG} position={a.up.pos} quaternion={a.up.q} material={mats.jacket} />
          <mesh position={a.el} scale={0.06} material={mats.jacket}><sphereGeometry args={[1, 24, 12]} /></mesh>
          <mesh geometry={a.loG} position={a.lo.pos} quaternion={a.lo.q} material={mats.jacket} />
          {/* manchet + handske */}
          <mesh position={a.ha.clone().add(new THREE.Vector3(0.012 * a.s, 0, -0.035))} quaternion={a.lo.q} material={mats.seam}>
            <cylinderGeometry args={[0.052, 0.052, 0.03, 24]} />
          </mesh>
          <mesh position={a.ha} scale={[0.042, 0.036, 0.052]} material={mats.leather}>
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
          {[0, 1, 2, 3].map((f) => (
            <mesh key={f} position={[a.ha.x - a.s * 0.028, a.ha.y + 0.024 - f * 0.016, a.ha.z + 0.028]} rotation={[0, 0, Math.PI / 2]} material={mats.leather}>
              <capsuleGeometry args={[0.009, 0.026, 4, 10]} />
            </mesh>
          ))}
          <mesh position={[a.ha.x - a.s * 0.012, a.ha.y + 0.03, a.ha.z + 0.04]} rotation={[0.6, 0, a.s * 0.5]} material={mats.leather}>
            <capsuleGeometry args={[0.01, 0.03, 4, 10]} />
          </mesh>
        </group>
      ))}
      {/* telefon */}
      {!down && <group position={[0, 1.105 + ph * 0.25, 0.305]} rotation={[-0.8 + ph * 0.6, 0, 0]}>
        <mesh material={mats.phone}><boxGeometry args={[0.074, 0.152, 0.009]} /></mesh>
        <mesh position={[0, 0, 0.0047]}>
          <planeGeometry args={[0.068, 0.145]} />
          <meshBasicMaterial color="#ffffff" map={look.screen ?? null} toneMapped={false} />
        </mesh>
      </group>}
      {lights && <pointLight position={[0, 1.2 + ph * 0.2, 0.38]} intensity={0.35 * look.glow} distance={0.7} decay={2} color="#bcd0ff" />}
      {/* hoved */}
      <group position={[0, 1.66, 0.015]} rotation={[0.14 - ph * 0.12 + nod * 0.2, 0, 0]}>
        <mesh scale={[0.083, 0.112, 0.098]} material={mats.knit}><sphereGeometry args={[1, 48, 32]} /></mesh>
        <mesh position={[0, -0.012, 0.088]} scale={[0.018, 0.028, 0.024]} material={mats.knit}><sphereGeometry args={[1, 20, 14]} /></mesh>
        <mesh position={[0, -0.07, 0.045]} scale={[0.062, 0.045, 0.06]} material={mats.knit}><sphereGeometry args={[1, 24, 16]} /></mesh>
        {/* strik-ribber */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, -0.1 + i * 0.006, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[0.07, 0.075, 1]} material={mats.knit}>
            <torusGeometry args={[1, 0.0018, 4, 40]} />
          </mesh>
        ))}
        {/* briller */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.036 * s, 0.018, 0.094]} rotation={[0, 0.2 * s, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.84]} material={mats.lens}><cylinderGeometry args={[0.028, 0.028, 0.003, 40]} /></mesh>
            <mesh scale={[1, 0.84, 1]} material={mats.gold}><torusGeometry args={[0.0285, 0.0022, 10, 48]} /></mesh>
          </group>
        ))}
        <mesh position={[0, 0.03, 0.098]} rotation={[0, 0, Math.PI / 2]} material={mats.gold}><cylinderGeometry args={[0.0018, 0.0018, 0.02, 8]} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.07 * s, 0.024, 0.045]} rotation={[0, Math.PI / 2 - 0.35 * s, 0]} material={mats.gold}><cylinderGeometry args={[0.0018, 0.0018, 0.1, 8]} /></mesh>
        ))}
        {/* hætte: tynd skal + blød kant */}
        <mesh position={[0, 0.018, -0.018]} scale={[0.122, 0.142, 0.135]} material={mats.jacket}>
          <sphereGeometry args={[1, 56, 36, Math.PI * 0.64, Math.PI * 1.72]} />
        </mesh>
        <mesh position={[0, 0.006, 0.07]} rotation={[0.1, 0, 0]} scale={[1, 1.18, 1]} material={mats.jacket}>
          <torusGeometry args={[0.1, 0.016, 16, 56]} />
        </mesh>
        <mesh position={[0, 0.006, 0.066]} rotation={[0.1, 0, 0]} scale={[1, 1.18, 1]} material={mats.seam}>
          <torusGeometry args={[0.086, 0.004, 8, 56]} />
        </mesh>
      </group>
      {/* guldkæde + kors */}
      {showChain && chain.map((c, i) => (
        <mesh key={i} position={c.p} quaternion={c.q} material={mats.gold}><torusGeometry args={[0.0075, 0.0029, 8, 16]} /></mesh>
      ))}
      {back && (
        <mesh position={[0, 1.15, -0.142]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.3, 0.36]} />
          <meshBasicMaterial map={back} transparent toneMapped={false} />
        </mesh>
      )}
      {lights && (
        <group position={[-0.06, 1.3, 0.16]}>
          <pointLight intensity={1.2 * heart} distance={1.2} decay={2} color="#ff2a3a" />
          <mesh scale={0.06 + heart * 0.03} visible={heart > 0}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#ff3a4a" transparent opacity={0.35 * heart} toneMapped={false} /></mesh>
        </group>
      )}
      {showChain && <group position={[0, 1.245, 0.178]} rotation={[0.25, 0, Math.sin(t * 2) * 0.05]}>
        <mesh material={mats.gold}><boxGeometry args={[0.016, 0.062, 0.007]} /></mesh>
        <mesh position={[0, 0.011, 0]} material={mats.gold}><boxGeometry args={[0.044, 0.014, 0.007]} /></mesh>
      </group>}
    </group>
  );
};
