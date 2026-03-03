'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

export function CardFlip({ front, back }: { front: ReactNode; back: ReactNode }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1000px]" onClick={() => setFlipped((f) => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-64 w-full cursor-pointer rounded-2xl border border-white/20 bg-white/5 [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 flex items-center justify-center p-4 [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 flex items-center justify-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </motion.div>
    </div>
  );
}
