import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { fetchReviewQueue } from '@/api/review';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/spinner';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';

export default function ReviewQueuePage() {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ['review', 'queue'],
    queryFn: fetchReviewQueue,
  });

  if (q.isLoading) return <PageLoader label={t('common.loading')} />;
  if (q.isError) return <p className="text-sm text-red-600">{t('common.load_error')}</p>;

  const items = q.data?.data?.items ?? [];

  return (
    <FadeIn>
      <Card>
        <CardTitle className="mb-4">{t('review.queue_title')}</CardTitle>
        {items.length === 0 ? (
          <p className="text-sm text-slate-600">{t('review.empty')}</p>
        ) : (
          <StaggerContainer className="space-y-2">
            {items.map((r) => (
              <StaggerItem key={r.id}>
                <motion.div
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3"
                  whileHover={{ scale: 1.01, borderColor: 'rgba(16,185,129,0.3)' }}
                >
                  <Link
                    className="font-semibold text-slate-900 transition hover:text-brand-600"
                    to={`/review/requests/${r.id}`}
                  >
                    {r.company?.name || r.id}
                  </Link>
                  <StatusBadge status={r.status} />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Card>
    </FadeIn>
  );
}
