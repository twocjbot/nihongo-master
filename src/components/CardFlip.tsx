'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

export function CardFlip({ front, back }: { front: ReactNode; back: ReactNode }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1200px]" onClick={() => setFlipped((f) => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="card relative h-[72vh] min-h-[480px] w-full cursor-pointer overflow-hidden [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 flex items-center justify-center p-8 [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 flex items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </motion.div>
    </div>
  );
}
