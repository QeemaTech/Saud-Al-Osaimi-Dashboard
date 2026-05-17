import { httpClient } from '@/services/httpClient';

export async function fetchMarketingReport() {
  const { data } = await httpClient.get('/marketing/report');
  return data;
}
