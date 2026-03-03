'use client';

import { ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Loader } from '@react-three/drei';

export function SceneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className ?? 'h-[420px] w-full'}>
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }} style={{ background: 'transparent' }}>
        <Suspense
          fallback={
            <Html center>
              <div className="rounded bg-black/60 px-3 py-2 text-xs text-white/80">Loading 3D scene...</div>
            </Html>
          }
        >
          {children}
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
