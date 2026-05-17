import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { fetchPackages } from '@/api/billing';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';
import { PageLoader } from '@/components/ui/spinner';

export default function PackagesPage() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ['packages', 'public'], queryFn: fetchPackages });
  const items = q.data?.data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-white">{t('public.packages_title')}</h1>
        <p className="mb-8 text-slate-400">Choose the plan that fits your reporting needs.</p>
      </FadeIn>
      {q.isLoading ? <PageLoader label={t('common.loading')} /> : null}
      <StaggerContainer className="grid gap-4">
        {items.map((p) => (
          <StaggerItem key={p.id}>
            <motion.div whileHover={{ scale: 1.01 }}>
              <Card className="border-white/10 !bg-white/10 !text-white backdrop-blur-md">
                <CardTitle className="!text-white">{p.name}</CardTitle>
                <p className="mt-2 text-sm text-slate-300">
                  {p.priceAmount} {p.currency} · {p.maxRequests} {t('public.requests')}
                </p>
                <Link to="/auth/register" className="mt-4 inline-block">
                  <Button type="button">{t('public.get_started')}</Button>
                </Link>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
