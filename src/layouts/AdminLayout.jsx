import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutApi } from '@/api/auth';
import { AnimatedOrbs } from '@/components/motion/AnimatedBackground';
import NavItem from '@/components/layout/NavItem';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  async function onLogout() {
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      /* ignore */
    }
    clearSession();
    navigate('/auth/login', { replace: true });
  }

  return (
    <div className="mesh-bg-light flex min-h-full flex-col">
      <AnimatedOrbs variant="light" />
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              A
            </span>
            <strong className="text-slate-900">FSG · Admin</strong>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavItem to="/admin" end>
              {t('admin.overview')}
            </NavItem>
            <NavItem to="/admin/users">{t('admin.users')}</NavItem>
            <NavItem to="/admin/requests">{t('admin.all_requests')}</NavItem>
            <NavItem to="/admin/audit">{t('admin.audit')}</NavItem>
          </nav>
          <Button type="button" variant="outline" onClick={onLogout}>
            {t('app.logout')}
          </Button>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
