import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationRead } from '@/api/notifications';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['notifications'], queryFn: () => fetchNotifications() });
  const mark = useMutation({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const items = q.data?.data?.items ?? [];

  return (
    <Card>
      <CardTitle className="mb-3">{t('app.notifications')}</CardTitle>
      {items.length === 0 ? (
        <p className="text-sm text-slate-600">{t('app.no_notifications')}</p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {items.map((n) => (
            <li key={n.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                {n.titleKey} {!n.readAt ? '•' : ''}
              </span>
              {!n.readAt ? (
                <Button type="button" variant="outline" size="sm" onClick={() => mark.mutate(n.id)}>
                  {t('app.mark_read')}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
