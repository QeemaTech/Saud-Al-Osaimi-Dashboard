import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';

const STEPS = ['step1', 'step2', 'step3', 'step4'];

export default function HowItWorksPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl">
      <FadeIn>
        <h1 className="mb-6 text-3xl font-bold text-white">{t('public.how_title')}</h1>
      </FadeIn>
      <StaggerContainer className="space-y-4">
        {STEPS.map((key, i) => (
          <StaggerItem key={key}>
            <motion.div
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              whileHover={{ x: 4 }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/30 text-lg font-bold text-brand-200">
                {i + 1}
              </span>
              <p className="text-slate-200">{t(`public.${key}`)}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <FadeIn className="mt-8">
        <Link to="/auth/register">
          <Button type="button">{t('public.get_started')}</Button>
        </Link>
      </FadeIn>
    </section>
  );
}
