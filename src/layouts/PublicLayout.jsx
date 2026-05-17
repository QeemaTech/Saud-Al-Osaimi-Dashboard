import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AnimatedOrbs } from '@/components/motion/AnimatedBackground';
import NavItem from '@/components/layout/NavItem';
import { Button } from '@/components/ui/button';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <div className="mesh-bg min-h-full text-white">
      <AnimatedOrbs />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <Link to="/" className="group flex items-center gap-2">
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-glow"
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              F
            </motion.span>
            <span className="text-lg font-bold tracking-tight">FSG</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavItem to="/packages" className="!text-slate-300 hover:!bg-white/10 hover:!text-white [&.nav-link-active]:!bg-brand-600">
              {t('public.packages_title')}
            </NavItem>
            <NavItem to="/how-it-works" className="!text-slate-300 hover:!bg-white/10 hover:!text-white [&.nav-link-active]:!bg-brand-600">
              {t('public.how_title')}
            </NavItem>
            <NavItem to="/faq" className="!text-slate-300 hover:!bg-white/10 hover:!text-white [&.nav-link-active]:!bg-brand-600">
              {t('public.faq_title')}
            </NavItem>
            <NavItem to="/contact" className="!text-slate-300 hover:!bg-white/10 hover:!text-white [&.nav-link-active]:!bg-brand-600">
              {t('public.contact_title')}
            </NavItem>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:text-white"
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:text-white"
              onClick={() => i18n.changeLanguage('ar')}
            >
              AR
            </button>
            <Link to="/auth/login">
              <Button variant="ghost" className="!text-slate-200 hover:!bg-white/10">
                {t('auth.login_link')}
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button>{t('public.get_started')}</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
