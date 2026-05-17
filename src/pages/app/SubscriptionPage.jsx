import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPackages, fetchSubscriptionMe, subscribe, cancelSubscription } from '@/api/billing';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const pkgs = useQuery({ queryKey: ['packages'], queryFn: fetchPackages });
  const sub = useQuery({ queryKey: ['subscription', 'me'], queryFn: fetchSubscriptionMe });

  const subscribeMut = useMutation({
    mutationFn: (packageId) => subscribe(packageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription', 'me'] }),
  });
  const cancelMut = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscription', 'me'] }),
  });

  const current = sub.data?.data?.subscription;
  const items = pkgs.data?.data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle className="mb-2">{t('app.current_subscription')}</CardTitle>
        {current ? (
          <>
            <p className="text-sm">{current.package?.name}</p>
            <p className="text-xs text-slate-500">{current.status}</p>
            <Button type="button" variant="outline" className="mt-2" onClick={() => cancelMut.mutate()}>
              {t('app.cancel_subscription')}
            </Button>
          </>
        ) : (
          <p className="text-sm text-slate-600">{t('app.no_subscription')}</p>
        )}
      </Card>
      <Card>
        <CardTitle className="mb-3">{t('app.available_packages')}</CardTitle>
        <ul className="flex flex-col gap-2">
          {items.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded border border-slate-200 p-3 text-sm">
              <span>
                {p.name} — {p.priceAmount} {p.currency}
              </span>
              <Button type="button" size="sm" onClick={() => subscribeMut.mutate(p.id)}>
                {t('app.subscribe')}
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
