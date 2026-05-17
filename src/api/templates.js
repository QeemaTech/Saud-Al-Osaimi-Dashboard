import { httpClient } from '@/services/httpClient';

export async function fetchTemplates(activityType) {
  const params = activityType ? { activityType } : {};
  const { data } = await httpClient.get('/templates', { params });
  return data;
}
