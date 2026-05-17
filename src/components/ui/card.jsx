import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const MotionDiv = motion.div;

export const Card = forwardRef(function Card({ className, hover = true, ...props }, ref) {
  return (
    <MotionDiv
      ref={ref}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur-sm transition-shadow duration-300',
        hover && 'hover:border-brand-200/60 hover:shadow-card-hover',
        className,
      )}
      {...props}
    />
  );
});

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('text-lg font-semibold tracking-tight text-slate-900', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-slate-500', className)} {...props} />;
}
