import { httpClient } from '@/services/httpClient';

export async function fetchReviewQueue() {
  const { data } = await httpClient.get('/review/requests');
  return data;
}

export async function postComment(requestId, body, visibility = 'CLIENT') {
  const { data } = await httpClient.post(`/requests/${requestId}/comments`, { body, visibility });
  return data;
}

export async function assignReviewer(requestId, reviewerId) {
  const { data } = await httpClient.post(`/requests/${requestId}/assign`, { reviewerId });
  return data;
}
