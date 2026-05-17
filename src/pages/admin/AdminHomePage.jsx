import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminOverview, fetchRolesCatalog } from '@/api/admin';
import { Card, CardTitle } from '@/components/ui/card';

export default function AdminHomePage() {
  const { t } = useTranslation();
  const overview = useQuery({ queryKey: ['admin', 'overview'], queryFn: fetchAdminOverview });
  const roles = useQuery({ queryKey: ['admin', 'roles'], queryFn: fetchRolesCatalog });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardTitle className="mb-2">{t('admin.overview')}</CardTitle>
        {overview.isLoading ? (
          <p className="text-sm text-slate-600">{t('common.loading')}</p>
        ) : overview.isError ? (
          <p className="text-sm text-red-600">{t('common.load_error')}</p>
        ) : (
          <pre className="overflow-auto text-xs text-slate-800">{JSON.stringify(overview.data?.data, null, 2)}</pre>
        )}
      </Card>
      <Card>
        <CardTitle className="mb-2">{t('admin.roles')}</CardTitle>
        {roles.isLoading ? (
          <p className="text-sm text-slate-600">{t('common.loading')}</p>
        ) : roles.isError ? (
          <p className="text-sm text-red-600">{t('common.load_error')}</p>
        ) : (
          <ul className="max-h-64 overflow-auto text-sm text-slate-800">
            {(roles.data?.data?.items ?? []).map((role) => (
              <li key={role.id || role.key} className="border-b border-slate-100 py-1">
                {role.key}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
