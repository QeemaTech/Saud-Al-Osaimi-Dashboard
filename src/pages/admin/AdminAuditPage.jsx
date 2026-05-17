import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '@/api/admin';
import { Card, CardTitle } from '@/components/ui/card';

export default function AdminAuditPage() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ['admin', 'audit'], queryFn: () => fetchAuditLogs() });
  const items = q.data?.data?.items ?? [];

  return (
    <Card>
      <CardTitle className="mb-3">{t('admin.audit')}</CardTitle>
      <ul className="max-h-[32rem] overflow-auto text-xs text-slate-700">
        {items.map((a) => (
          <li key={a.id} className="border-b border-slate-100 py-2">
            <strong>{a.action}</strong> · {a.entityType} · {a.createdAt}
          </li>
        ))}
      </ul>
    </Card>
  );
}
