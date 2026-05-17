import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, assignUserRoles, fetchRolesCatalog } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ['admin', 'users'], queryFn: () => fetchUsers() });
  const roles = useQuery({ queryKey: ['admin', 'roles'], queryFn: fetchRolesCatalog });
  const [selected, setSelected] = useState(null);
  const [roleKeys, setRoleKeys] = useState(['CLIENT']);

  const assign = useMutation({
    mutationFn: () => assignUserRoles(selected, roleKeys),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  const items = users.data?.data?.items ?? [];
  const roleItems = roles.data?.data?.items ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardTitle className="mb-3">{t('admin.users')}</CardTitle>
        <ul className="max-h-96 overflow-auto text-sm">
          {items.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                className="w-full border-b border-slate-100 py-2 text-start hover:bg-slate-50"
                onClick={() => setSelected(u.id)}
              >
                {u.email}
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <CardTitle className="mb-3">{t('admin.assign_roles')}</CardTitle>
        {selected ? (
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              assign.mutate();
            }}
          >
            {roleItems.map((r) => (
              <label key={r.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={roleKeys.includes(r.key)}
                  onChange={(e) => {
                    if (e.target.checked) setRoleKeys([...roleKeys, r.key]);
                    else setRoleKeys(roleKeys.filter((k) => k !== r.key));
                  }}
                />
                {r.key}
              </label>
            ))}
            <Button type="submit">{t('app.save')}</Button>
          </form>
        ) : (
          <p className="text-sm text-slate-600">{t('admin.select_user')}</p>
        )}
      </Card>
    </div>
  );
}
