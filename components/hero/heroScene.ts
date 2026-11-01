// WebGL hero scene: a conceptual stack of application layers (data →
// services → APIs → interface) with an AI core feeding the services layer.
// Plain Three.js, loaded on demand by HeroCanvas — never in the initial bundle.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export type LayerId = "interface" | "apis" | "services" | "data" | "ai";

export type HeroSceneOptions = {
  reducedMotion: boolean;
  lowPower: boolean;
  onHover?: (id: LayerId | null) => void;
  onFirstFrame?: () => void;
  // Screen positions (CSS px within the canvas) of each layer's label anchor,
  // reported every rendered frame so HTML labels can track the 3D layers.
  onProject?: (points: Record<LayerId, { x: number; y: number; o: number }>) => void;
};

export type HeroScene = {
  setHighlight: (id: LayerId | null) => void;
  setPointer: (x: number, y: number) => void; // -1..1, from the hero section
  setActive: (active: boolean) => void;
  dispose: () => void;
};

// Brand palette (matches --accent, --accent-2, --teal in globals.css).
const BG = new THREE.Color("#070b16");
const LAYERS: { id: Exclude<LayerId, "ai">; tint: string }[] = [
  { id: "data", tint: "#46d7c3" },
  { id: "services", tint: "#9a84f6" },
  { id: "apis", tint: "#7790ff" },
  { id: "interface", tint: "#5b9cff" },
];
const AI_TINT = "#a78bfa";

const SIZE = 4.2;
const THICK = 0.16;
const GAP = 1.05;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

// Bright, non-tone-mapped colour so edges cross the bloom threshold.
function glow(hex: string, boost: number) {
  return new THREE.Color(hex).multiplyScalar(boost);
}

function radialTexture(inner: string, outer = "rgba(0,0,0,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Abstract surface motifs per layer: positions are [x, z, w, d] on the slab top.
const MOTIFS: Record<Exclude<LayerId, "ai">, [number, number, number, number][]> = {
  interface: [
    [0, -1.45, 3.4, 0.32],
    [-0.95, 0.25, 1.5, 2.3],
    [0.85, -0.45, 1.7, 0.95],
    [0.45, 0.85, 0.85, 0.85],
    [1.32, 0.85, 0.75, 0.85],
  ],
  apis: [
    [-1.4, -0.9, 0.34, 0.34],
    [-0.7, -0.9, 0.34, 0.34],
    [0, -0.9, 0.34, 0.34],
    [0.7, -0.9, 0.34, 0.34],
    [1.4, -0.9, 0.34, 0.34],
    [0, 0.55, 3.2, 0.08],
  ],
  services: [
    [-0.8, -0.8, 1.35, 1.25],
    [0.8, -0.8, 1.35, 1.25],
    [-0.8, 0.75, 1.35, 1.25],
    [0.8, 0.75, 1.35, 1.25],
  ],
  data: [
    [0, -1.2, 3.3, 0.06],
    [0, -0.6, 3.3, 0.06],
    [0, 0, 3.3, 0.06],
    [0, 0.6, 3.3, 0.06],
    [0, 1.2, 3.3, 0.06],
  ],
};

// Conduit positions (x, z) running vertically through the stack.
const CONDUITS: [number, number][] = [
  [-1.55, 1.55],
  [1.55, 1.55],
  [1.55, -1.55],
  [-1.55, -1.55],
  [0.2, 1.75],
];

export function createHeroScene(canvas: HTMLCanvasElement, opts: HeroSceneOptions): HeroScene {
  const { reducedMotion, lowPower } = opts;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(BG, 1);

  const scene = new THREE.Scene();
  scene.background = BG;
  scene.fog = new THREE.Fog(BG, 16, 30);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const CAM_BASE = new THREE.Vector3(10.5, 8.4, 11.5);
  const LOOK = new THREE.Vector3(0.45, 1.95, -0.7);
  camera.position.copy(CAM_BASE);
  camera.lookAt(LOOK);

  // ---- Lights
  scene.add(new THREE.HemisphereLight("#9db8ff", "#0a1020", 0.55));
  const key = new THREE.DirectionalLight("#dfe8ff", 1.6);
  key.position.set(6, 12, 8);
  scene.add(key);
  const rimBlue = new THREE.PointLight("#5b9cff", 22, 14, 2);
  rimBlue.position.set(3, 5.5, -2.5);
  scene.add(rimBlue);
  const rimTeal = new THREE.PointLight("#46d7c3", 14, 10, 2);
  rimTeal.position.set(-1, -0.4, 2.5);
  scene.add(rimTeal);

  const root = new THREE.Group();
  scene.add(root);

  // ---- Floor: faint grid + glow pool under the stack
  const grid = new THREE.GridHelper(26, 52, "#1d2d4d", "#14203a");
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  grid.position.y = -0.55;
  root.add(grid);

  const poolTex = radialTexture("rgba(91,156,255,0.55)");
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(4.6, 48),
    new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = -0.53;
  root.add(pool);

  // ---- Layers
  type Layer = {
    id: Exclude<LayerId, "ai">;
    group: THREE.Group;
    slab: THREE.Mesh;
    slabMat: THREE.MeshPhysicalMaterial;
    edgeMat: THREE.LineBasicMaterial;
    motifMats: THREE.MeshStandardMaterial[];
    baseY: number;
    lift: number;
  };
  const layers: Layer[] = [];
  const slabGeo = new RoundedBoxGeometry(SIZE, THICK, SIZE, 4, 0.12);
  const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE - 0.02, THICK, SIZE - 0.02));

  LAYERS.forEach((l, i) => {
    const group = new THREE.Group();
    const tint = new THREE.Color(l.tint);

    const slabMat = new THREE.MeshPhysicalMaterial({
      color: tint.clone().lerp(new THREE.Color("#0b1326"), 0.6),
      roughness: 0.28,
      metalness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.25,
      transparent: true,
      opacity: 0.78,
      emissive: tint,
      emissiveIntensity: 0.07,
    });
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.userData.layer = l.id;
    group.add(slab);

    const edgeMat = new THREE.LineBasicMaterial({ color: glow(l.tint, 1.25), transparent: true, opacity: 0.95, toneMapped: false });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    const motifMats: THREE.MeshStandardMaterial[] = [];
    for (const [x, z, w, d] of MOTIFS[l.id]) {
      const mat = new THREE.MeshStandardMaterial({
        color: tint,
        emissive: tint,
        emissiveIntensity: l.id === "data" ? 0.9 : 0.55,
        transparent: true,
        opacity: l.id === "data" ? 0.9 : 0.55,
        roughness: 0.4,
      });
      motifMats.push(mat);
      const h = l.id === "apis" && w < 0.5 ? 0.14 : 0.04;
      const geo = l.id === "apis" && w < 0.5 ? new THREE.CylinderGeometry(w / 2, w / 2, h, 24) : new RoundedBoxGeometry(w, h, d, 2, Math.min(0.06, w / 4, d / 2));
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, THICK / 2 + h / 2 + 0.005, z);
      group.add(m);
      // Thin bright outline on panels for a crisp UI read.
      if (l.id !== "data" && !(l.id === "apis" && w < 0.5)) {
        const outline = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
          new THREE.LineBasicMaterial({ color: glow(l.tint, 1.05), transparent: true, opacity: 0.5, toneMapped: false })
        );
        outline.position.copy(m.position);
        group.add(outline);
      }
    }

    const baseY = i * GAP;
    group.position.y = baseY;
    root.add(group);
    layers.push({ id: l.id, group, slab, slabMat, edgeMat, motifMats, baseY, lift: 0 });
  });

  // ---- Conduits + data packets travelling upward
  const conduitMat = new THREE.MeshBasicMaterial({ color: glow("#5b9cff", 0.9), transparent: true, opacity: 0.35, toneMapped: false });
  const conduitHeight = GAP * 3;
  for (const [x, z] of CONDUITS) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, conduitHeight, 6), conduitMat);
    c.position.set(x, conduitHeight / 2, z);
    root.add(c);
  }
  const PACKETS_PER = lowPower ? 2 : 3;
  const packetGeo = new THREE.SphereGeometry(0.055, 12, 12);
  const packetMat = new THREE.MeshBasicMaterial({ color: glow("#7fe7d8", 2), toneMapped: false });
  const packets = new THREE.InstancedMesh(packetGeo, packetMat, CONDUITS.length * PACKETS_PER);
  root.add(packets);
  const packetPhase = Array.from({ length: CONDUITS.length * PACKETS_PER }, (_, i) => (i % PACKETS_PER) / PACKETS_PER + Math.floor(i / PACKETS_PER) * 0.17);

  // ---- AI core
  const ai = new THREE.Group();
  const AI_POS = new THREE.Vector3(-2.75, 4.35, 1.55);
  ai.position.copy(AI_POS);
  root.add(ai);

  const aiShell = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.62, 1)),
    new THREE.LineBasicMaterial({ color: glow(AI_TINT, 1.2), transparent: true, opacity: 0.8, toneMapped: false })
  );
  ai.add(aiShell);
  const aiCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 2), new THREE.MeshBasicMaterial({ color: glow(AI_TINT, 1.5), toneMapped: false }));
  aiCore.userData.layer = "ai";
  ai.add(aiCore);
  const aiHit = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
  aiHit.userData.layer = "ai";
  ai.add(aiHit);
  const ringMat = new THREE.MeshBasicMaterial({ color: glow(AI_TINT, 1.1), transparent: true, opacity: 0.7, toneMapped: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.012, 8, 96), ringMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.008, 8, 96), ringMat);
  ring1.rotation.set(Math.PI / 2.4, 0, 0);
  ring2.rotation.set(Math.PI / 1.8, Math.PI / 5, 0);
  ai.add(ring1, ring2);
  const aiHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture("rgba(167,139,250,0.32)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  aiHalo.scale.setScalar(2.8);
  ai.add(aiHalo);
  const aiLight = new THREE.PointLight(AI_TINT, 12, 7, 2);
  ai.add(aiLight);

  // Beam: AI core → services layer, with packets flowing down it.
  const beamCurve = new THREE.CatmullRomCurve3([
    AI_POS.clone(),
    new THREE.Vector3(-2.75, 2.75, 2.1),
    new THREE.Vector3(-2.05, GAP * 1 + THICK + 0.1, 1.85),
    new THREE.Vector3(-1.3, GAP * 1 + THICK / 2 + 0.02, 1.3),
  ]);
  const beam = new THREE.Mesh(
    new THREE.TubeGeometry(beamCurve, 80, 0.014, 6, false),
    new THREE.MeshBasicMaterial({ color: glow(AI_TINT, 1.4), transparent: true, opacity: 0.6, toneMapped: false })
  );
  root.add(beam);
  const BEAM_PACKETS = 4;
  const beamPackets = new THREE.InstancedMesh(packetGeo, new THREE.MeshBasicMaterial({ color: glow("#d6c8ff", 2), toneMapped: false }), BEAM_PACKETS);
  root.add(beamPackets);

  // ---- Ambient dust for depth
  const DUST = lowPower ? 50 : 110;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 12;
    dustPos[i * 3 + 1] = Math.random() * 7 - 0.5;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: "#8fb4ff", size: 0.035, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  root.add(dust);

  // ---- Post-processing
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  if (!lowPower) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.7, 0.5, 0.72);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // ---- Sizing
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderOnce();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // ---- Interaction state
  let highlight: LayerId | null = null;
  let hovered: LayerId | null = null;
  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hitTargets: THREE.Object3D[] = [...layers.map((l) => l.slab), aiHit];

  const onCanvasMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    const id = (hit?.object.userData.layer as LayerId | undefined) ?? null;
    if (id !== hovered) {
      hovered = id;
      opts.onHover?.(id);
    }
  };
  const onCanvasLeave = () => {
    if (hovered !== null) {
      hovered = null;
      opts.onHover?.(null);
    }
  };
  if (!reducedMotion) {
    canvas.addEventListener("pointermove", onCanvasMove);
    canvas.addEventListener("pointerleave", onCanvasLeave);
  }

  // ---- Animation
  const ASSEMBLE = 1.6;
  let raf = 0;
  let active = true;
  let firstFrame = false;
  const dummy = new THREE.Object3D();

  function update(t: number, dt: number) {
    const assembling = !reducedMotion;
    const focus = highlight ?? hovered;

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);

    const sway = reducedMotion ? 0 : Math.sin(t * 0.18) * 0.1;
    root.rotation.y = -0.12 + sway + pointer.x * 0.22;
    camera.position.set(CAM_BASE.x - pointer.x * 0.9, CAM_BASE.y + pointer.y * 0.7, CAM_BASE.z + pointer.x * 0.6);
    camera.lookAt(LOOK);

    const breath = reducedMotion ? 0 : Math.sin(t * 0.55) * 0.06;
    layers.forEach((l, i) => {
      const k = assembling ? easeOutCubic((t - 0.15 - i * 0.14) / ASSEMBLE) : 1;
      const isFocus = focus === l.id;
      const targetLift = isFocus ? 0.32 : 0;
      l.lift += (targetLift - l.lift) * Math.min(1, dt * 8);
      const float = reducedMotion ? 0 : Math.sin(t * 0.8 + i * 0.7) * 0.035;
      l.group.position.y = (l.baseY + i * breath) * k + (1 - k) * -2.2 + float + l.lift;
      l.group.rotation.y = (1 - k) * -0.6;
      l.slabMat.opacity = 0.78 * k;
      const dim = focus && !isFocus ? 0.45 : 1;
      l.edgeMat.opacity = 0.95 * k * dim;
      l.slabMat.emissiveIntensity = isFocus ? 0.22 : 0.07;
      for (const m of l.motifMats) m.opacity = (l.id === "data" ? 0.9 : 0.55) * k * dim;
    });

    // AI core
    const ka = assembling ? easeOutCubic((t - 0.9) / 1.2) : 1;
    const aiFocus = focus === "ai";
    ai.scale.setScalar(ka * (aiFocus ? 1.15 : 1));
    ai.position.y = AI_POS.y + (reducedMotion ? 0 : Math.sin(t * 1.1) * 0.12);
    aiShell.rotation.y = t * 0.35;
    aiShell.rotation.x = t * 0.18;
    ring1.rotation.z = t * 0.6;
    ring2.rotation.z = -t * 0.45;
    aiLight.intensity = 7 + Math.sin(t * 2.2) * 3 + (aiFocus ? 8 : 0);

    // Conduit packets rise through the stack.
    const n = CONDUITS.length * PACKETS_PER;
    for (let i = 0; i < n; i++) {
      const [x, z] = CONDUITS[Math.floor(i / PACKETS_PER)];
      const p = (packetPhase[i] + t * 0.22) % 1;
      const fade = Math.sin(p * Math.PI);
      dummy.position.set(x, p * conduitHeight, z);
      dummy.scale.setScalar(reducedMotion ? 0.8 : fade * ka);
      dummy.updateMatrix();
      packets.setMatrixAt(i, dummy.matrix);
    }
    packets.instanceMatrix.needsUpdate = true;

    // Beam packets flow from the AI core into the services layer.
    for (let i = 0; i < BEAM_PACKETS; i++) {
      const p = (i / BEAM_PACKETS + t * 0.28) % 1;
      beamCurve.getPointAt(p, dummy.position);
      dummy.scale.setScalar((reducedMotion ? 0.9 : Math.sin(p * Math.PI)) * ka);
      dummy.updateMatrix();
      beamPackets.setMatrixAt(i, dummy.matrix);
    }
    beamPackets.instanceMatrix.needsUpdate = true;
    (beam.material as THREE.MeshBasicMaterial).opacity = 0.6 * ka;

    if (!reducedMotion) {
      const pos = dustGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < DUST; i++) {
        let y = pos.getY(i) + dt * 0.12;
        if (y > 6.5) y = -0.5;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  }

  // Label anchors: each slab's right-hand corner, and beside the AI core.
  const anchor = new THREE.Vector3();
  const projected = {} as Record<LayerId, { x: number; y: number; o: number }>;
  function project() {
    if (!opts.onProject) return;
    root.updateMatrixWorld();
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const toScreen = (v: THREE.Vector3) => {
      v.project(camera);
      return { x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h };
    };
    for (const l of layers) {
      anchor.set(SIZE / 2, 0, -SIZE / 2);
      l.group.localToWorld(anchor);
      projected[l.id] = { ...toScreen(anchor), o: l.slabMat.opacity / 0.78 };
    }
    anchor.set(1.05, 0.25, -0.6);
    ai.localToWorld(anchor);
    projected.ai = { ...toScreen(anchor), o: Math.min(1, ai.scale.x) };
    opts.onProject(projected);
  }

  function draw() {
    project();
    if (composer) composer.render();
    else renderer.render(scene, camera);
    if (!firstFrame) {
      firstFrame = true;
      opts.onFirstFrame?.();
    }
  }

  // Scene time only advances while running, so pausing offscreen doesn't
  // skip ahead or replay the assembly on resume.
  let time = 0;
  let lastNow = 0;

  function renderOnce() {
    // Static composition (reduced motion) shows the final assembled state.
    update(reducedMotion ? 4 : time, 0.016);
    draw();
  }

  function loop(now = performance.now()) {
    raf = requestAnimationFrame(loop);
    // rAF timestamps are frame-start times and can precede an earlier
    // performance.now(), so clamp: time must never run backwards.
    const dt = lastNow ? Math.min(0.05, Math.max(0, (now - lastNow) / 1000)) : 0.016;
    lastNow = now;
    time += dt;
    update(time, dt);
    draw();
  }

  resize();
  if (reducedMotion) renderOnce();
  else loop();

  return {
    setHighlight(id) {
      highlight = id;
      if (reducedMotion) {
        // Snap the lift so a single frame shows it.
        layers.forEach((l) => (l.lift = id === l.id ? 0.32 : 0));
        renderOnce();
      }
    },
    setPointer(x, y) {
      if (reducedMotion) return;
      pointer.tx = x;
      pointer.ty = y;
    },
    setActive(next) {
      if (reducedMotion || next === active) return;
      active = next;
      if (active) {
        lastNow = 0;
        loop();
      } else {
        cancelAnimationFrame(raf);
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onCanvasMove);
      canvas.removeEventListener("pointerleave", onCanvasLeave);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      poolTex.dispose();
      bloom?.dispose();
      composer?.dispose();
      renderer.dispose();
    },
  };
}
