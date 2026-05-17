import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutApi } from '@/api/auth';

export default function MarketingLayout() {
  const { i18n } = useTranslation();
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
    <div className="flex min-h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <strong className="text-slate-900">FSG · Marketing</strong>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link className="text-slate-700 underline" to="/marketing">
              Report
            </Link>
            <button type="button" className="text-slate-700 underline" onClick={onLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
