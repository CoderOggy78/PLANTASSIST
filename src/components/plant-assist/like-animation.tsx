
'use client';

import { motion } from 'framer-motion';

const EMOJI_COUNT = 10;

interface LikeAnimationProps {
    onComplete: () => void;
}

export default function LikeAnimation({ onComplete }: LikeAnimationProps) {
    return (
        <>
            {Array.from({ length: EMOJI_COUNT }).map((_, i) => {
                const delay = Math.random() * 0.5;
                const duration = 0.6 + Math.random() * 0.6;
                const x = (Math.random() - 0.5) * 120;
                const y = -60 - Math.random() * 50;

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: y, x: x, scale: 1.5 }}
                        transition={{ duration, delay, ease: 'easeOut' }}
                        onAnimationComplete={i === EMOJI_COUNT - 1 ? onComplete : undefined}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <span className="text-xl">👍</span>
                    </motion.div>
                );
            })}
        </>
    );
}
