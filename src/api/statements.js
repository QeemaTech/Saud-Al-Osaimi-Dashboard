import { httpClient } from '@/services/httpClient';

export async function createRequest(companyId, body) {
  const { data } = await httpClient.post(`/companies/${companyId}/requests`, body);
  return data;
}

export async function fetchRequest(requestId) {
  const { data } = await httpClient.get(`/requests/${requestId}`);
  return data;
}

export async function patchRequestValues(requestId, values) {
  const { data } = await httpClient.patch(`/requests/${requestId}/values`, { values });
  return data;
}

export async function submitRequest(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/submit`);
  return data;
}

export async function approveRequest(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/approve`);
  return data;
}

export async function rejectRequest(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/reject`);
  return data;
}

export async function requestChanges(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/request-changes`);
  return data;
}

export async function generateDocument(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/generate`);
  return data;
}

export async function generateExcel(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/generate-excel`);
  return data;
}

export async function previewRequest(requestId) {
  const { data } = await httpClient.post(`/requests/${requestId}/preview`);
  return data;
}

export async function uploadAttachment(requestId, file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await httpClient.post(`/requests/${requestId}/attachments`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function downloadDocument(documentId) {
  const res = await httpClient.get(`/documents/${documentId}/download`, { responseType: 'blob' });
  return res.data;
}
