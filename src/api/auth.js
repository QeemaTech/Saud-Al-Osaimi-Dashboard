import { httpClient } from '@/services/httpClient';

export async function login({ email, password }) {
  const { data } = await httpClient.post('/auth/login', { email, password });
  return data;
}

export async function register({ email, password, preferredLocale, companyName }) {
  const { data } = await httpClient.post('/auth/register', {
    email,
    password,
    preferredLocale,
    companyName,
  });
  return data;
}

export async function logout(refreshToken) {
  const { data } = await httpClient.post('/auth/logout', { refreshToken });
  return data;
}
