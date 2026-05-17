import { httpClient } from '@/services/httpClient';

export async function fetchNotifications(page = 1) {
  const { data } = await httpClient.get('/notifications', { params: { page, pageSize: 20 } });
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await httpClient.post(`/notifications/${id}/read`);
  return data;
}
