"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
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
  { position: [2.6, 0.3, 0], scale: 1.35, geometry: "icosahedron", color: "#8b5cf6", speed: 0.4, rotationOffset: [0.4, 0.2, 0], seed: 12 },
  { position: [1.1, 1.6, -1.2], scale: 0.65, geometry: "octahedron", color: "#38bdf8", speed: 0.6, rotationOffset: [0.1, 0.8, 0.2], seed: 47 },
  { position: [3.9, 1.3, -0.8], scale: 0.55, geometry: "tetrahedron", color: "#f472b6", speed: 0.7, rotationOffset: [0.6, 0.1, 0.3], seed: 83 },
  { position: [1.6, -1.6, -0.5], scale: 0.45, geometry: "octahedron", color: "#38bdf8", speed: 0.5, rotationOffset: [0.2, 0.5, 0.6], seed: 29 },
  { position: [4, -1, -1.4], scale: 0.6, geometry: "icosahedron", color: "#8b5cf6", speed: 0.45, rotationOffset: [0.3, 0.4, 0.1], seed: 61 },
];

// Faceted low-poly gems lit by colored point lights + a low-intensity
// emissive glow of their own color, with a glossy clearcoat highlight.
// Deliberately avoids meshPhysicalMaterial's `transmission`/env-map-heavy
// path — true refractive glass needs an extra full-scene render pass per
// object (drei's MeshTransmissionMaterial does one per mesh), which is
// expensive enough to visibly stall a frame with more than one or two
// instances on screen. This keeps the same faceted-glass read at a fraction
// of the cost.
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
        color={color}
        metalness={0.1}
        roughness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.15}
        emissive={color}
        emissiveIntensity={0.35}
        flatShading
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
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#8b5cf6" />
      <pointLight position={[-5, -3, 3]} intensity={45} color="#38bdf8" />
      <pointLight position={[0, 4, -3]} intensity={35} color="#f472b6" />
      {CRYSTALS.map((c, i) => (
        <Crystal key={i} {...c} />
      ))}
      <Sparkles count={30} position={[2, 0, 0]} scale={[6, 4.5, 4]} size={2} speed={0.25} color="#c4b5fd" opacity={0.5} />
      <PointerRig />
    </Canvas>
  );
}
