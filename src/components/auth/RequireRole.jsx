import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function RequireRole({ anyOf, redirectTo = '/', children }) {
  const user = useAuthStore((s) => s.user);
  const roles = user?.roles ?? [];
  const ok = anyOf.some((r) => roles.includes(r));
  if (!ok) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
