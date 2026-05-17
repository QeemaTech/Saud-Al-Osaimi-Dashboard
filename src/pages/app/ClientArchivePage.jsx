import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchMyCompany, fetchCompanyRequests } from '@/api/companies';
import { Card, CardTitle } from '@/components/ui/card';

export default function ClientArchivePage() {
  const { t } = useTranslation();
  const me = useQuery({ queryKey: ['company', 'me'], queryFn: fetchMyCompany });
  const companyId = me.data?.data?.company?.id;
  const requests = useQuery({
    queryKey: ['requests', companyId, 'archived'],
    queryFn: () => fetchCompanyRequests(companyId, { status: 'archived' }),
    enabled: Boolean(companyId),
  });

  const items = requests.data?.data?.items ?? [];

  return (
    <Card>
      <CardTitle className="mb-3">{t('app.archive')}</CardTitle>
      {items.length === 0 ? (
        <p className="text-sm text-slate-600">{t('app.no_requests')}</p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {items.map((r) => (
            <li key={r.id} className="py-2 text-sm">
              <Link className="underline" to={`/app/requests/${r.id}`}>
                {r.period?.label || r.id}
              </Link>
              <span className="mx-2 text-slate-400">·</span>
              {r.status}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
