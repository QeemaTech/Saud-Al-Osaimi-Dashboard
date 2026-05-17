import { httpClient } from '@/services/httpClient';

export async function fetchRolesCatalog() {
  const { data } = await httpClient.get('/admin/roles');
  return data;
}

export async function fetchAdminOverview() {
  const { data } = await httpClient.get('/analytics/admin/overview');
  return data;
}

export async function fetchUsers(page = 1) {
  const { data } = await httpClient.get('/admin/users', { params: { page, pageSize: 20 } });
  return data;
}

export async function assignUserRoles(userId, roleKeys) {
  const { data } = await httpClient.post(`/admin/users/${userId}/roles`, { roleKeys });
  return data;
}

export async function fetchAuditLogs(page = 1) {
  const { data } = await httpClient.get('/admin/audit-logs', { params: { page, pageSize: 20 } });
  return data;
}

export async function fetchAdminRequests(page = 1, status) {
  const { data } = await httpClient.get('/admin/requests', {
    params: { page, pageSize: 20, status },
  });
  return data;
}
