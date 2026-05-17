import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const MotionButton = motion.button;

const variants = {
  default:
    'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/30 hover:from-brand-500 hover:to-brand-400 hover:shadow-glow',
  outline:
    'border border-slate-200/80 bg-white/80 text-slate-800 backdrop-blur-sm hover:border-brand-300 hover:bg-brand-50/50',
  ghost: 'text-slate-700 hover:bg-slate-100/80',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md',
};

export const Button = forwardRef(function Button(
  { className, variant = 'default', type = 'button', disabled, children, ...props },
  ref,
) {
  return (
    <MotionButton
      ref={ref}
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',
        variants[variant] ?? variants.default,
        className,
      )}
      {...props}
    >
      {children}
    </MotionButton>
  );
});
