import { httpClient } from '@/services/httpClient';

export async function fetchClientSummary() {
  const { data } = await httpClient.get('/analytics/client/summary');
  return data;
}
