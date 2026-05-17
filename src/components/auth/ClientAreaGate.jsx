import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

/**
 * Client portal is for users with CLIENT role. Other authenticated users are
 * routed to the first area they are allowed to use.
 */
export default function ClientAreaGate({ children }) {
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  if (roles.includes('CLIENT')) {
    return children;
  }
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
    return <Navigate to="/admin" replace />;
  }
  if (roles.includes('REVIEWER')) {
    return <Navigate to="/review" replace />;
  }
  if (roles.includes('MARKETING')) {
    return <Navigate to="/marketing" replace />;
  }
  return <Navigate to="/" replace />;
}
