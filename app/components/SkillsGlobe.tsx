'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS_FLAT = [
  'Java', 'Spring Boot', 'Next.js', 'React', 'TypeScript',
  'PostgreSQL', 'Redis', 'MongoDB', 'Docker', 'AWS',
  'OAuth2', 'JWT', 'WebSockets', 'Jenkins', 'Git',
  'Hibernate', 'MySQL', 'CI/CD', 'Tailwind', 'REST',
  'Linux', 'Postman', 'JMeter', 'Agile', 'Microservices',
];

function SkillLabel({
  text, position, color
}: { text: string; position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    // Always face camera (billboard)
    ref.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={ref} position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <Text
        fontSize={hovered ? 0.19 : 0.15}
        color={hovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPw.woff2"
      >
        {text}
      </Text>
    </group>
  );
}

function SkillSphere() {
  const groupRef = useRef<THREE.Group>(null);

  const skillPositions = useMemo(() => {
    return SKILLS_FLAT.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / SKILLS_FLAT.length);
      const theta = Math.sqrt(SKILLS_FLAT.length * Math.PI) * phi;
      const r = 2.8;
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ] as [number, number, number];
    });
  }, []);

  const colors = ['#a855f7', '#06b6d4', '#7c3aed', '#818cf8', '#67e8f9'];

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Faint sphere wireframe */}
      <mesh>
        <sphereGeometry args={[2.8, 24, 24]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.04} />
      </mesh>

      {SKILLS_FLAT.map((skill, i) => (
        <SkillLabel
          key={skill}
          text={skill}
          position={skillPositions[i]}
          color={colors[i % colors.length]}
        />
      ))}
    </group>
  );
}

// Orbiting ring
function OrbitRing({ radius, color, speed, tilt }: { radius: number; color: string; speed: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

export default function SkillsGlobe() {
  return (
    <div style={{ width: '100%', height: 520, cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#a855f7" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#06b6d4" />

        <Float speed={0.5} floatIntensity={0.2}>
          <SkillSphere />
        </Float>

        <OrbitRing radius={3.4} color="#7c3aed" speed={0.15} tilt={0.4} />
        <OrbitRing radius={3.2} color="#06b6d4" speed={-0.1} tilt={1.1} />
        <OrbitRing radius={3.6} color="#a855f7" speed={0.08} tilt={0.8} />
      </Canvas>
    </div>
  );
}
