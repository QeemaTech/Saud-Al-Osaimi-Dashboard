import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function Spinner({ className }) {
  return (
    <motion.div
      className={cn('h-8 w-8 rounded-full border-2 border-brand-200 border-t-brand-600', className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function PageLoader({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-16"
    >
      <Spinner />
      {label ? <p className="text-sm text-slate-500">{label}</p> : null}
    </motion.div>
  );
}
