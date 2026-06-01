'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shapes
function FloatingGeometry({ position, shape, color, speed = 1 }: {
  position: [number, number, number];
  shape: 'box' | 'octahedron' | 'tetrahedron' | 'torus';
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 * speed;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'box': return new THREE.BoxGeometry(0.6, 0.6, 0.6);
      case 'octahedron': return new THREE.OctahedronGeometry(0.5);
      case 'tetrahedron': return new THREE.TetrahedronGeometry(0.55);
      case 'torus': return new THREE.TorusGeometry(0.35, 0.15, 16, 32);
    }
  }, [shape]);

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.35}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={position} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.06}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

// Central orb with distortion
function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#4c1d95"
          emissiveIntensity={0.5}
          distort={0.45}
          speed={2.5}
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0.5, 0]}>
        <torusGeometry args={[2.1, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  );
}

// Particle field
function ParticleField() {
  const count = 180;
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color('#7c3aed');
    const cyan = new THREE.Color('#06b6d4');
    const violet = new THREE.Color('#a855f7');

    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = [purple, cyan, violet][Math.floor(Math.random() * 3)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.04;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.025) * 0.15;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// Grid floor
function GridPlane() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (!ref.current) return;
    (ref.current.material as THREE.Material & { opacity: number }).opacity =
      0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
  });

  return (
    <gridHelper
      ref={ref}
      args={[20, 20, '#7c3aed', '#4c1d95']}
      position={[0, -2.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

// Mouse-reactive camera
function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x += (state.pointer.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (state.pointer.y * 0.4 - camera.position.y) * 0.05;
    camera.position.z = 6 + Math.sin(t * 0.1) * 0.3;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// DNA-like helix lines
function HelixLines() {
  const groupRef = useRef<THREE.Group>(null);

  const [points1, points2] = useMemo(() => {
    const p1: THREE.Vector3[] = [];
    const p2: THREE.Vector3[] = [];
    for (let i = 0; i < 80; i++) {
      const t = (i / 79) * Math.PI * 4 - Math.PI * 2;
      const r = 2.2;
      p1.push(new THREE.Vector3(Math.cos(t) * r, t * 0.35, Math.sin(t) * r));
      p2.push(new THREE.Vector3(Math.cos(t + Math.PI) * r, t * 0.35, Math.sin(t + Math.PI) * r));
    }
    return [p1, p2];
  }, []);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  const geo1 = useMemo(() => new THREE.BufferGeometry().setFromPoints(points1), [points1]);
  const geo2 = useMemo(() => new THREE.BufferGeometry().setFromPoints(points2), [points2]);
  const mat1 = useMemo(() => new THREE.LineBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.3 }), []);
  const mat2 = useMemo(() => new THREE.LineBasicMaterial({ color: '#06b6d4', transparent: true, opacity: 0.3 }), []);

  return (
    <group ref={groupRef}>
      <primitive object={new THREE.Line(geo1, mat1)} />
      <primitive object={new THREE.Line(geo2, mat2)} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[4, 4, 4]} intensity={2} color="#a855f7" />
          <pointLight position={[-4, -4, 4]} intensity={1.5} color="#06b6d4" />
          <pointLight position={[0, 4, -4]} intensity={1} color="#7c3aed" />

          <Stars radius={50} depth={20} count={800} factor={2} fade speed={0.5} />
          <CameraRig />
          <CentralOrb />
          <ParticleField />
          <HelixLines />
          <GridPlane />

          <FloatingGeometry position={[-3.5, 1.5, -1]} shape="octahedron" color="#a855f7" speed={0.7} />
          <FloatingGeometry position={[3.8, -1, -2]} shape="tetrahedron" color="#06b6d4" speed={0.9} />
          <FloatingGeometry position={[-3, -2, -1]} shape="box" color="#7c3aed" speed={0.6} />
          <FloatingGeometry position={[3.2, 2, -1]} shape="torus" color="#a855f7" speed={0.8} />
          <FloatingGeometry position={[0.5, 2.8, -2]} shape="octahedron" color="#06b6d4" speed={1.1} />
          <FloatingGeometry position={[-1.5, -2.5, -1.5]} shape="tetrahedron" color="#7c3aed" speed={0.75} />
        </Suspense>
      </Canvas>
    </div>
  );
}
