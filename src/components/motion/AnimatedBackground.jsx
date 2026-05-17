import { motion } from 'motion/react';

export function AnimatedOrbs({ variant = 'dark' }) {
  const light = variant === 'light';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className={
          light
            ? 'absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl'
            : 'absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl'
        }
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={
          light
            ? 'absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl'
            : 'absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl'
        }
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className={
          light
            ? 'absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-teal-300/25 blur-3xl'
            : 'absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl'
        }
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
