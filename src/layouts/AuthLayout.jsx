import { Link, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { AnimatedOrbs } from '@/components/motion/AnimatedBackground';
import { FadeIn } from '@/components/motion/FadeIn';

export default function AuthLayout() {
  return (
    <div className="mesh-bg-light relative flex min-h-full flex-col">
      <AnimatedOrbs variant="light" />
      <header className="relative z-10 p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-600"
        >
          <span aria-hidden>←</span> Home
        </Link>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 pb-12">
        <FadeIn>
          <Outlet />
        </FadeIn>
      </main>
    </div>
  );
}
