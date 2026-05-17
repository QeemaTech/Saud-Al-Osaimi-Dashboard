import { httpClient } from '@/services/httpClient';

export async function fetchMyCompany() {
  const { data } = await httpClient.get('/companies/me');
  return data;
}

export async function createMyCompany(body) {
  const { data } = await httpClient.post('/companies/me', body);
  return data;
}

export async function fetchPeriods(companyId) {
  const { data } = await httpClient.get(`/companies/${companyId}/periods`);
  return data;
}

export async function updateCompany(companyId, body) {
  const { data } = await httpClient.patch(`/companies/${companyId}`, body);
  return data;
}

export async function fetchCompanyRequests(companyId, params = {}) {
  const { data } = await httpClient.get(`/companies/${companyId}/requests`, { params });
  return data;
}
