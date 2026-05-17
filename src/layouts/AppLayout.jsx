import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutApi } from '@/api/auth';
import { AnimatedOrbs } from '@/components/motion/AnimatedBackground';
import NavItem from '@/components/layout/NavItem';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
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
          <Link to="/app" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-md">
              F
            </span>
            <strong className="text-slate-900">FSG</strong>
          </Link>
          <nav className="flex max-w-full flex-wrap items-center gap-1">
            <NavItem to="/app" end>
              {t('app.nav_dashboard')}
            </NavItem>
            <NavItem to="/app/requests">{t('app.requests_title')}</NavItem>
            <NavItem to="/app/company">{t('app.company_profile')}</NavItem>
            <NavItem to="/app/subscription">{t('app.subscription_card')}</NavItem>
            <NavItem to="/app/notifications">{t('app.notifications')}</NavItem>
            <NavItem to="/app/archive">{t('app.archive')}</NavItem>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              onClick={() => i18n.changeLanguage('ar')}
            >
              AR
            </button>
            <Button type="button" variant="outline" onClick={onLogout}>
              {t('app.logout')}
            </Button>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
