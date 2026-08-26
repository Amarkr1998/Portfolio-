"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Instance, Instances, Lightformer, MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";

type CrystalGeometry = "icosahedron" | "octahedron" | "tetrahedron";

type CrystalConfig = {
  position: [number, number, number];
  scale: number;
  geometry: CrystalGeometry;
  color: string;
  speed: number;
  rotationOffset: [number, number, number];
  // Static phase offset so each crystal's float/rotation isn't in lockstep —
  // fixed per-crystal rather than randomized at render time (impure).
  seed: number;
};

// Positioned to occupy the right side of the hero viewport — the wrapper's
// CSS mask additionally fades out anything that drifts toward the text
// column, so the composition never fights the headline/CTAs for legibility.
const CRYSTALS: CrystalConfig[] = [
  { position: [2.9, 0.6, -0.8], scale: 1.05, geometry: "icosahedron", color: "#8b5cf6", speed: 0.4, rotationOffset: [0.4, 0.2, 0], seed: 12 },
  { position: [1.3, 1.9, -1.6], scale: 0.6, geometry: "octahedron", color: "#38bdf8", speed: 0.6, rotationOffset: [0.1, 0.8, 0.2], seed: 47 },
  { position: [4.1, 1.6, -1.2], scale: 0.5, geometry: "tetrahedron", color: "#f472b6", speed: 0.7, rotationOffset: [0.6, 0.1, 0.3], seed: 83 },
  { position: [1.8, -1.3, -1], scale: 0.42, geometry: "octahedron", color: "#38bdf8", speed: 0.5, rotationOffset: [0.2, 0.5, 0.6], seed: 29 },
  { position: [4.2, -0.6, -1.8], scale: 0.55, geometry: "icosahedron", color: "#8b5cf6", speed: 0.45, rotationOffset: [0.3, 0.4, 0.1], seed: 61 },
];

// A faceted, jagged mountain range silhouette — cones with few radial
// segments read as angular peaks, echoing the crystals' low-poly language.
type PeakConfig = { position: [number, number, number]; radius: number; height: number; segments: number; color: string };

// y = -2.8 (lake shoreline) + height / 2, so every peak's base sits at the
// waterline regardless of its height.
const SHORE_Y = -2.8;
const PEAKS: PeakConfig[] = [
  { position: [2.5, SHORE_Y + 2.6, -8], radius: 3.4, height: 5.2, segments: 5, color: "#1a1740" },
  { position: [4.8, SHORE_Y + 2.1, -9.5], radius: 2.8, height: 4.2, segments: 6, color: "#211d4d" },
  { position: [0.5, SHORE_Y + 1.8, -8.5], radius: 2.6, height: 3.6, segments: 5, color: "#161339" },
  { position: [-1.5, SHORE_Y + 2, -7.5], radius: 3, height: 4, segments: 6, color: "#1c1846" },
  { position: [6.5, SHORE_Y + 1.7, -9], radius: 2.4, height: 3.4, segments: 5, color: "#181538" },
];

// Simple silhouette pines lining the shore, batched into one draw call.
const TREES = Array.from({ length: 22 }, (_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const spread = ((i * 37) % 100) / 100;
  return {
    position: [side * (2 + spread * 7), SHORE_Y + 0.75, -3 - spread * 6] as [number, number, number],
    scale: 0.5 + spread * 0.6,
  };
});

// True see-through glass: meshPhysicalMaterial's native `transmission`
// (not drei's MeshTransmissionMaterial). Three.js renders the opaque scene
// behind transmissive objects into a single shared background render
// target once per frame and every transmissive material samples from it —
// one extra pass total, not one per mesh — so this stays cheap even with
// five instances, unlike the per-object multi-pass technique.
function Crystal({ position, scale, geometry, color, speed, rotationOffset, seed }: CrystalConfig) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime + seed;
    mesh.rotation.x = rotationOffset[0] + t * speed * 0.15;
    mesh.rotation.y = rotationOffset[1] + t * speed * 0.2;
    mesh.position.y = position[1] + Math.sin(t * speed) * 0.25;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
      {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
      {geometry === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
      <meshPhysicalMaterial
        color="#f5f3ff"
        metalness={0}
        roughness={0.04}
        transmission={0.95}
        thickness={scale * 1.1}
        ior={1.5}
        attenuationColor={color}
        attenuationDistance={2.5}
        clearcoat={1}
        clearcoatRoughness={0.05}
        emissive={color}
        emissiveIntensity={0.06}
        flatShading
      />
    </mesh>
  );
}

function Mountains() {
  return (
    <>
      {PEAKS.map((p, i) => (
        <mesh key={i} position={p.position} rotation={[0, i * 0.4, 0]}>
          <coneGeometry args={[p.radius, p.height, p.segments]} />
          <meshStandardMaterial color={p.color} roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

function TreeLine() {
  return (
    <Instances limit={TREES.length}>
      <coneGeometry args={[0.35, 1.6, 5]} />
      <meshStandardMaterial color="#0a0a18" roughness={1} flatShading />
      {TREES.map((t, i) => (
        <Instance key={i} position={t.position} scale={t.scale} />
      ))}
    </Instances>
  );
}

// A still, dark lake bed with a soft reflection of the crystals/mountains
// above it — grounds the composition the way the reference's water does.
function Lake() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, SHORE_Y, -4]}>
      <planeGeometry args={[30, 20]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={256}
        mixBlur={1}
        mixStrength={35}
        roughness={1}
        depthScale={1}
        minDepthThreshold={0.85}
        color="#0a0b16"
        metalness={0.4}
      />
    </mesh>
  );
}

// Subtle camera parallax following the pointer — small, damped, non-intrusive.
function PointerRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function CrystalScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <fog attach="fog" args={["#0d0c1f", 6, 17]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#8b5cf6" />
      <pointLight position={[-5, -3, 3]} intensity={45} color="#38bdf8" />
      <pointLight position={[0, 4, -3]} intensity={35} color="#f472b6" />
      {/* Low warm rim light grazing the peaks — a hint of dusk without
          pulling the palette away from the site's violet/blue accents. */}
      <pointLight position={[7, 1, -10]} intensity={80} color="#fb923c" distance={20} />
      {/* Self-contained studio environment (no external HDR fetch) — the
          glass crystals need something to reflect or they read flat/dark. */}
      <Environment resolution={64}>
        <group>
          <Lightformer form="rect" intensity={3} color="#8b5cf6" position={[-4, 3, 2]} scale={[4, 3, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#38bdf8" position={[4, -2, 3]} scale={[3, 4, 1]} />
          <Lightformer form="rect" intensity={2} color="#fde68a" position={[3, 3, 4]} scale={[3, 2, 1]} />
          <Lightformer form="ring" intensity={2.5} color="#ffffff" position={[0, 0, -6]} scale={8} />
        </group>
      </Environment>

      <Mountains />
      <TreeLine />
      <Lake />

      {CRYSTALS.map((c, i) => (
        <Crystal key={i} {...c} />
      ))}
      {/* Cool violet dust near the crystals + a few warm fireflies drifting
          low over the water, echoing the reference's scattered glow points. */}
      <Sparkles count={24} position={[2, 0.5, 0]} scale={[6, 4.5, 4]} size={1.6} speed={0.15} color="#c4b5fd" opacity={0.45} />
      <Sparkles count={12} position={[2.5, -1.8, -2]} scale={[7, 1.5, 4]} size={2.2} speed={0.08} color="#fde68a" opacity={0.55} />
      <PointerRig />
    </Canvas>
  );
}
