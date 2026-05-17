import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function NavItem({ to, end, children, className }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn('nav-link', isActive && 'nav-link-active', className)
      }
    >
      {children}
    </NavLink>
  );
}
