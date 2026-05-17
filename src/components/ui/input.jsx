import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-sm shadow-sm outline-none transition-all duration-200',
        'placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20',
        className,
      )}
      {...props}
    />
  );
});
