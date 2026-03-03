'use client';

import { Float, Sphere, Text } from '@react-three/drei';
import { SceneFrame } from '@/components/three/SceneFrame';

export function RotatingKanjiOrb({ char = '語' }: { char?: string }) {
  return (
    <SceneFrame className="h-44 w-full">
      <ambientLight intensity={0.7} />
      <pointLight position={[2, 2, 4]} intensity={1.2} color="#ffafc4" />
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.2}>
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial color="#6cc6ff" emissive="#236d96" emissiveIntensity={0.7} transparent opacity={0.9} />
        </Sphere>
        <Text fontSize={1.4} color="#fef3c7" position={[0, 0, 1.7]} anchorX="center" anchorY="middle">
          {char}
        </Text>
      </Float>
    </SceneFrame>
  );
}
