import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchClientSummary } from '@/api/analytics';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';
import { PageLoader } from '@/components/ui/spinner';
import { FadeIn } from '@/components/motion/FadeIn';

function StatCard({ title, value, hint }) {
  return (
    <StaggerItem>
      <Card className="h-full">
        <CardTitle className="mb-1 text-base">{title}</CardTitle>
        <p className="text-3xl font-bold tracking-tight text-brand-700">{value}</p>
        {hint ? <CardDescription className="mt-2">{hint}</CardDescription> : null}
      </Card>
    </StaggerItem>
  );
}

export default function ClientDashboardPage() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ['client', 'summary'], queryFn: fetchClientSummary });

  if (q.isLoading) return <PageLoader label={t('common.loading')} />;
  if (q.isError) return <p className="text-sm text-red-600">{t('common.load_error')}</p>;

  const s = q.data?.data ?? {};

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t('app.dashboard_title')}</h1>
        <p className="text-slate-500">{s.company?.name}</p>
      </FadeIn>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t('app.stats_requests')} value={s.requests ?? 0} />
        <StatCard
          title={t('app.in_progress')}
          value={s.inProgress ?? 0}
          hint={`${t('app.completed')}: ${s.completed ?? 0}`}
        />
        <StaggerItem>
          <Card className="h-full">
            <CardTitle className="mb-1 text-base">{t('app.subscription_card')}</CardTitle>
            <p className="text-sm font-medium text-slate-800">
              {s.subscription?.package?.name ?? t('app.no_subscription')}
            </p>
            <Link
              className="mt-3 inline-flex text-sm font-medium text-brand-600 transition hover:text-brand-700"
              to="/app/subscription"
            >
              {t('app.manage_subscription')} →
            </Link>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card className="h-full bg-gradient-to-br from-brand-50 to-white">
            <CardTitle className="mb-3 text-base">{t('app.quick_links')}</CardTitle>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                ['/app/requests', t('app.requests_title')],
                ['/app/company', t('app.company_profile')],
                ['/app/notifications', t('app.notifications')],
                ['/app/archive', t('app.archive')],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link className="font-medium text-brand-700 transition hover:text-brand-800" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
