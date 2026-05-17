import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { FadeIn, FadeInWhenVisible } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';

const features = [
  { key: 'how', to: '/how-it-works' },
  { key: 'faq', to: '/faq' },
  { key: 'contact', to: '/contact' },
];

export default function HomePage() {
  const { t } = useTranslation();

  const labels = {
    how: t('public.how_title'),
    faq: t('public.faq_title'),
    contact: t('public.contact_title'),
  };

  return (
    <section className="space-y-16 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-14 md:px-12 md:py-20">
        <motion.div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <FadeIn className="relative max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            SaaS · Financial Statements
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            {t('home.title')}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">{t('home.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth/register">
              <Button type="button" className="min-w-[140px]">
                {t('public.get_started')}
              </Button>
            </Link>
            <Link to="/packages">
              <Button
                type="button"
                variant="outline"
                className="border-white/20 !bg-white/5 !text-white hover:!bg-white/10"
              >
                {t('public.packages_title')}
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <StaggerItem key={f.key}>
            <Link to={f.to}>
              <motion.div
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-brand-400/40 hover:bg-white/10"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-lg text-brand-300">
                  →
                </span>
                <p className="font-semibold text-white">{labels[f.key]}</p>
                <p className="mt-1 text-sm text-slate-400 group-hover:text-slate-300">Explore</p>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeInWhenVisible className="rounded-2xl border border-white/10 bg-gradient-to-r from-brand-600/20 to-indigo-600/20 p-8 text-center">
        <p className="text-lg font-medium text-white">{t('public.step4')}</p>
        <Link to="/auth/register" className="mt-4 inline-block">
          <Button type="button">{t('public.get_started')}</Button>
        </Link>
      </FadeInWhenVisible>
    </section>
  );
}
