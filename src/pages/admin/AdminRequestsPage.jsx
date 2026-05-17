import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminRequests } from '@/api/admin';
import { Card, CardTitle } from '@/components/ui/card';

export default function AdminRequestsPage() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ['admin', 'requests'], queryFn: () => fetchAdminRequests() });
  const items = q.data?.data?.items ?? [];

  return (
    <Card>
      <CardTitle className="mb-3">{t('admin.all_requests')}</CardTitle>
      {q.isLoading ? (
        <p className="text-sm">{t('common.loading')}</p>
      ) : (
        <ul className="divide-y divide-slate-200 text-sm">
          {items.map((r) => (
            <li key={r.id} className="py-2">
              <Link className="font-medium underline" to={`/review/requests/${r.id}`}>
                {r.company?.name} — {r.period?.label}
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
