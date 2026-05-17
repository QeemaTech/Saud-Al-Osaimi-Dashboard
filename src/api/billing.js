import { httpClient } from '@/services/httpClient';

export async function fetchPackages() {
  const { data } = await httpClient.get('/packages');
  return data;
}

export async function fetchSubscriptionMe() {
  const { data } = await httpClient.get('/subscriptions/me');
  return data;
}

export async function subscribe(packageId) {
  const { data } = await httpClient.post('/subscriptions', { packageId });
  return data;
}

export async function cancelSubscription() {
  const { data } = await httpClient.post('/subscriptions/cancel');
  return data;
}
