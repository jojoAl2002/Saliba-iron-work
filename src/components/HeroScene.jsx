import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ *
 * A fillet weld being laid around the foot of an I-beam column.
 * The torch travels the joint, the bead glows hot and cools to steel,
 * and sparks spray off the arc and bounce on the base beam.
 * ------------------------------------------------------------------ */

const ORANGE = '#f5922a'
const BLUE = '#2bb4f0'

const CYCLE = 9.5 // seconds for one full weld + cool-down
const WELD = 7 // seconds the arc is on
const BEADS = 280
const MAX_SPARKS = 520

// Column section (plan view): flange width B along x, depth D along z.
const COL = { b: 1.0, d: 0.95, tf: 0.13, tw: 0.1, h: 2.5 }
// Base beam section: flange width W (world z), height H.
const BASE = { w: 1.3, h: 0.9, tf: 0.13, tw: 0.11, len: 4.8 }

// Counter-clockwise outline of an I-section in (u, v).
function iOutline(b, d, tf, tw) {
  const hb = b / 2
  const hd = d / 2
  const ht = tw / 2
  return [
    [-hb, -hd], [hb, -hd], [hb, -hd + tf], [ht, -hd + tf], [ht, hd - tf], [hb, hd - tf],
    [hb, hd], [-hb, hd], [-hb, hd - tf], [-ht, hd - tf], [-ht, -hd + tf], [-hb, -hd + tf],
  ]
}

function shapeFrom(pts) {
  const s = new THREE.Shape()
  s.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1])
  s.closePath()
  return s
}

const extrude = (shape, depth) =>
  new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    bevelSegments: 2,
  })

// Evenly spaced samples along the column footprint, offset outward so
// the bead sits in the corner between column and base flange.
function weldPath() {
  const pts = iOutline(COL.b, COL.d, COL.tf, COL.tw)
  const edges = pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length]
    const dx = q[0] - p[0]
    const dy = q[1] - p[1]
    const len = Math.hypot(dx, dy)
    return { p, dx, dy, len, nx: dy / len, ny: -dx / len }
  })
  const total = edges.reduce((s, e) => s + e.len, 0)
  const samples = []
  for (let i = 0; i < BEADS; i++) {
    let d = (i / BEADS) * total
    let e = edges[0]
    for (const edge of edges) {
      e = edge
      if (d <= edge.len) break
      d -= edge.len
    }
    const f = d / e.len
    const u = e.p[0] + e.dx * f + e.nx * 0.035
    const v = e.p[1] + e.dy * f + e.ny * 0.035
    // plan (u, v) -> world (x = u, z = -v); outward normal likewise
    samples.push({ pos: new THREE.Vector3(u, 0.035, -v), normal: new THREE.Vector3(e.nx, 0, -e.ny) })
  }
  return samples
}

function glowTexture() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.18, 'rgba(255,255,255,0.85)')
  grd.addColorStop(0.45, 'rgba(255,255,255,0.22)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Steel({ geometry, ...props }) {
  return (
    <mesh geometry={geometry} castShadow receiveShadow {...props}>
      <meshStandardMaterial color="#8a949f" metalness={0.85} roughness={0.38} envMapIntensity={1.25} />
    </mesh>
  )
}

function WeldRig({ reducedMotion }) {
  const path = useMemo(weldPath, [])
  const glowTex = useMemo(glowTexture, [])

  const geo = useMemo(() => {
    const col = extrude(shapeFrom(iOutline(COL.b, COL.d, COL.tf, COL.tw)), COL.h)
    col.rotateX(-Math.PI / 2) // extrude up +y; plan v -> world -z

    const base = extrude(shapeFrom(iOutline(BASE.w, BASE.h, BASE.tf, BASE.tw)), BASE.len)
    base.translate(0, 0, -BASE.len / 2)
    base.rotateY(Math.PI / 2) // length along x
    base.translate(0, -BASE.h / 2 - 0.012, 0)

    const plate = new THREE.BoxGeometry(COL.b + 0.35, 0.08, COL.d + 0.35)
    plate.translate(0, COL.h + 0.04, 0)
    return { col, base, plate }
  }, [])

  const beads = useRef()
  const arcCore = useRef()
  const arcGlow = useRef()
  const arcLight = useRef()
  const heatLight = useRef()
  const torch = useRef()
  const sparks = useRef()

  const beadMaterial = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#8a8f96', metalness: 0.75, roughness: 0.45 })
    // Use the per-instance colour as emissive heat instead of diffuse tint.
    m.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <color_fragment>', '')
        .replace('#include <emissivemap_fragment>', 'totalEmissiveRadiance = vColor.rgb;')
    }
    return m
  }, [])

  const spark = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(MAX_SPARKS * 6)
    const colors = new Float32Array(MAX_SPARKS * 6)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage))
    return {
      geometry,
      pos: new Float32Array(MAX_SPARKS * 3),
      vel: new Float32Array(MAX_SPARKS * 3),
      life: new Float32Array(MAX_SPARKS),
      maxLife: new Float32Array(MAX_SPARKS).fill(1),
      next: 0,
      carry: 0,
    }
  }, [])

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      s: new THREE.Vector3(),
      c: new THREE.Color(),
      up: new THREE.Vector3(0, 1, 0),
      dir: new THREE.Vector3(),
      arc: new THREE.Vector3(),
      tq: new THREE.Quaternion(),
    }),
    []
  )

  useLayoutEffect(() => {
    const mesh = beads.current
    for (let i = 0; i < BEADS; i++) {
      tmp.m.makeScale(0, 0, 0)
      mesh.setMatrixAt(i, tmp.m)
      mesh.setColorAt(i, tmp.c.setRGB(0, 0, 0))
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true
  }, [tmp])

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose())
      spark.geometry.dispose()
      beadMaterial.dispose()
      glowTex.dispose()
    },
    [geo, spark, beadMaterial, glowTex]
  )

  const emit = (origin, normal, count) => {
    const { pos, vel, life, maxLife } = spark
    for (let n = 0; n < count; n++) {
      const i = spark.next
      spark.next = (spark.next + 1) % MAX_SPARKS
      pos[i * 3] = origin.x
      pos[i * 3 + 1] = origin.y + 0.02
      pos[i * 3 + 2] = origin.z
      const a = Math.random() * Math.PI * 2
      const up = 0.35 + Math.random() * 0.9
      const speed = 1.2 + Math.random() * 3.6
      vel[i * 3] = (Math.cos(a) * 0.8 + normal.x * 0.9) * speed
      vel[i * 3 + 1] = up * speed
      vel[i * 3 + 2] = (Math.sin(a) * 0.8 + normal.z * 0.9) * speed
      maxLife[i] = life[i] = 0.35 + Math.random() * 0.9
    }
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const time = reducedMotion ? WELD * 0.62 : state.clock.elapsedTime
    const phase = time % CYCLE
    const welding = phase < WELD
    const t = welding ? phase / WELD : 1
    const head = t * BEADS

    // --- bead: deposit + cool ------------------------------------------
    const mesh = beads.current
    for (let i = 0; i < BEADS; i++) {
      const p = path[i]
      if (i > head) {
        tmp.m.makeScale(0, 0, 0)
        mesh.setMatrixAt(i, tmp.m)
        continue
      }
      const age = welding ? ((head - i) / BEADS) * WELD : ((BEADS - i) / BEADS) * WELD + (phase - WELD)
      const grow = Math.min(1, (head - i) / 3 + 0.35)
      const wobble = 1 + Math.sin(i * 2.3) * 0.06
      tmp.s.set(0.062 * wobble * grow, 0.05 * grow, 0.062 * wobble * grow)
      tmp.m.compose(p.pos, tmp.q.identity(), tmp.s)
      mesh.setMatrixAt(i, tmp.m)
      const heat = Math.max(0, 1 - age / 1.8)
      const h = heat * heat
      // white-hot -> orange -> dull red -> steel (0 emissive)
      mesh.setColorAt(i, tmp.c.setRGB(5.5 * h + 0.5 * heat, 2.2 * h * h + 0.12 * heat, 0.5 * h * h))
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true

    // --- arc + torch ------------------------------------------------------
    const idx = Math.min(BEADS - 1, Math.floor(head))
    const cur = path[idx]
    tmp.arc.copy(cur.pos)
    tmp.arc.y += 0.03
    const flicker = welding ? 0.75 + Math.random() * 0.5 : 0
    arcCore.current.position.copy(tmp.arc)
    arcGlow.current.position.copy(tmp.arc)
    arcCore.current.scale.setScalar(0.28 * flicker + 0.001)
    arcGlow.current.scale.setScalar(1.6 * flicker + 0.001)
    arcLight.current.position.copy(tmp.arc).addScaledVector(cur.normal, 0.25)
    arcLight.current.intensity = welding ? 14 + Math.random() * 16 : 0
    heatLight.current.position.copy(tmp.arc)
    heatLight.current.position.y += 0.15
    heatLight.current.intensity = THREE.MathUtils.lerp(heatLight.current.intensity, welding ? 5 : 0, 0.1)

    // Torch at ~45 degrees to the joint, leaning out along the normal.
    tmp.dir.copy(cur.normal).multiplyScalar(0.85).add(tmp.up).normalize()
    tmp.tq.setFromUnitVectors(tmp.up, tmp.dir)
    const tg = torch.current
    tg.quaternion.slerp(tmp.tq, reducedMotion ? 1 : 0.12)
    const lift = welding ? 0.06 : 0.55
    tg.userData.lift = THREE.MathUtils.lerp(tg.userData.lift ?? lift, lift, 0.06)
    tg.position.copy(tmp.arc).addScaledVector(tmp.dir, tg.userData.lift)

    // --- sparks -------------------------------------------------------------
    if (welding && !reducedMotion) {
      spark.carry += dt * (180 + Math.random() * 220)
      const n = Math.floor(spark.carry)
      spark.carry -= n
      if (Math.random() < 0.04) emit(tmp.arc, cur.normal, 18) // occasional burst
      emit(tmp.arc, cur.normal, n)
    }
    const { pos, vel, life, maxLife, geometry } = spark
    const P = geometry.attributes.position.array
    const C = geometry.attributes.color.array
    const halfW = BASE.w / 2
    for (let i = 0; i < MAX_SPARKS; i++) {
      const i3 = i * 3
      const i6 = i * 6
      if (life[i] <= 0) {
        C[i6] = C[i6 + 1] = C[i6 + 2] = C[i6 + 3] = C[i6 + 4] = C[i6 + 5] = 0
        continue
      }
      life[i] -= dt
      vel[i3 + 1] -= 9.2 * dt
      pos[i3] += vel[i3] * dt
      pos[i3 + 1] += vel[i3 + 1] * dt
      pos[i3 + 2] += vel[i3 + 2] * dt
      // bounce on the top flange of the base beam
      if (pos[i3 + 1] < 0 && vel[i3 + 1] < 0 && Math.abs(pos[i3 + 2]) < halfW && Math.abs(pos[i3]) < BASE.len / 2) {
        pos[i3 + 1] = 0
        vel[i3 + 1] *= -0.38
        vel[i3] *= 0.7
        vel[i3 + 2] *= 0.7
      }
      const k = Math.max(0, life[i] / maxLife[i])
      P[i6] = pos[i3]
      P[i6 + 1] = pos[i3 + 1]
      P[i6 + 2] = pos[i3 + 2]
      P[i6 + 3] = pos[i3] - vel[i3] * 0.035
      P[i6 + 4] = pos[i3 + 1] - vel[i3 + 1] * 0.035
      P[i6 + 5] = pos[i3 + 2] - vel[i3 + 2] * 0.035
      const r = 1.6 * k + 0.25
      const g = 1.25 * k * k + 0.05 * k
      const b = 0.55 * k * k * k
      C[i6] = r * k
      C[i6 + 1] = g * k
      C[i6 + 2] = b * k
      C[i6 + 3] = r * k * 0.2
      C[i6 + 4] = g * k * 0.12
      C[i6 + 5] = 0
    }
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
  })

  return (
    <group>
      <Steel geometry={geo.base} />
      <Steel geometry={geo.col} />
      <Steel geometry={geo.plate} />

      <instancedMesh ref={beads} args={[undefined, undefined, BEADS]} material={beadMaterial} castShadow>
        <sphereGeometry args={[1, 10, 8]} />
      </instancedMesh>

      {/* MIG torch */}
      <group ref={torch}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.055, 0.075, 0.34, 24]} />
          <meshStandardMaterial color="#c9824a" metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
          <meshStandardMaterial color="#d9d9d9" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.085, 0.07, 0.72, 24]} />
          <meshStandardMaterial color="#1d2227" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.9, 0.085]}>
          <boxGeometry args={[0.05, 0.16, 0.05]} />
          <meshStandardMaterial color={ORANGE} metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.7, 16]} />
          <meshStandardMaterial color="#111418" roughness={0.8} />
        </mesh>
      </group>

      {/* arc */}
      <mesh ref={arcCore}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshBasicMaterial color={[6, 8, 10]} toneMapped={false} />
      </mesh>
      <sprite ref={arcGlow}>
        <spriteMaterial map={glowTex} color={[0.6, 1.4, 2.4]} blending={THREE.AdditiveBlending} depthWrite={false} transparent toneMapped={false} />
      </sprite>
      <pointLight ref={arcLight} color={BLUE} distance={7} decay={1.6} />
      <pointLight ref={heatLight} color="#ff7a1a" distance={2.4} decay={2} intensity={0} />

      <lineSegments geometry={spark.geometry} frustumCulled={false}>
        <lineBasicMaterial vertexColors blending={THREE.AdditiveBlending} transparent depthWrite={false} toneMapped={false} />
      </lineSegments>
    </group>
  )
}

function Nut({ color = '#8c96a1', ...props }) {
  const geometry = useMemo(() => {
    const s = new THREE.Shape()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 0.3, Math.sin(a) * 0.3)
    }
    const hole = new THREE.Path()
    hole.absarc(0, 0, 0.14, 0, Math.PI * 2, true)
    s.holes.push(hole)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3, curveSegments: 24 })
    g.center()
    return g
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} {...props}>
      <meshStandardMaterial color={color} metalness={0.95} roughness={0.28} />
    </mesh>
  )
}

function Rig({ reducedMotion }) {
  const group = useRef()
  useFrame((state) => {
    const g = group.current
    const px = reducedMotion ? 0 : state.pointer.x
    const py = reducedMotion ? 0 : state.pointer.y
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.55 + px * 0.28, 0.05)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, py * -0.06, 0.05)
  })
  const floatProps = reducedMotion ? { speed: 0 } : { speed: 1.6, rotationIntensity: 1.2, floatIntensity: 1.4 }
  return (
    <group ref={group} position={[0.2, -0.9, 0]}>
      <WeldRig reducedMotion={reducedMotion} />
      <Float {...floatProps}>
        <Nut position={[-2.1, 2.2, 0.6]} rotation={[0.6, 0.4, 0]} />
      </Float>
      <Float {...floatProps} speed={reducedMotion ? 0 : 1.2}>
        <Nut position={[2.0, 2.6, -0.8]} rotation={[-0.4, 0.9, 0.2]} color={ORANGE} scale={0.8} />
      </Float>
      <Float {...floatProps} speed={reducedMotion ? 0 : 2}>
        <Nut position={[2.5, 0.9, 1.3]} rotation={[1.2, 0.2, 0.4]} scale={0.6} />
      </Float>
      <Float {...floatProps} speed={reducedMotion ? 0 : 1.4}>
        <Nut position={[-1.9, 0.5, 1.8]} rotation={[0.2, -0.6, 1]} scale={0.5} color="#b8c0c8" />
      </Float>
      <ContactShadows position={[0, -0.93, 0]} opacity={0.65} scale={10} blur={2.6} far={3} resolution={512} color="#000000" />
    </group>
  )
}

export default function HeroScene({ active = true, reducedMotion = false }) {
  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [5.4, 3.3, 7.9], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      eventSource={typeof document !== 'undefined' ? document.getElementById('root') : undefined}
      eventPrefix="client"
      onCreated={({ camera }) => camera.lookAt(0, 0.1, 0)}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 7, 5]} intensity={1.4} color="#dfe6ee" />
      <directionalLight position={[-6, 2, -4]} intensity={0.8} color={BLUE} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <Lightformer intensity={3} color={BLUE} rotation-y={Math.PI / 2} position={[-6, 1, -1]} scale={[20, 0.6, 1]} />
        <Lightformer intensity={2.2} color={ORANGE} rotation-y={-Math.PI / 2} position={[8, 1, 0]} scale={[20, 1, 1]} />
        <Lightformer intensity={1.4} color="#dfe6ee" position={[3, 2, 10]} scale={[12, 6, 1]} />
        <Lightformer form="ring" color="#ffffff" intensity={1.2} scale={4} position={[-2, 4, 5]} target={[0, 0, 0]} />
      </Environment>
      <Rig reducedMotion={reducedMotion} />
    </Canvas>
  )
}
