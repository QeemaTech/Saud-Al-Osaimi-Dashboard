import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { register } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [formError, setFormError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      register({
        email,
        password,
        companyName: companyName.trim() || undefined,
        preferredLocale: i18n.language === 'ar' ? 'ar' : 'en',
      }),
    onSuccess: (envelope) => {
      if (!envelope?.success) {
        setFormError(envelope?.message || t('auth.register_failed'));
        return;
      }
      navigate('/auth/login', { replace: true });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err.message || t('auth.register_failed');
      setFormError(msg);
    },
  });

  return (
    <Card className="shadow-card-hover">
      <CardTitle className="mb-1">{t('auth.register_title')}</CardTitle>
      <CardDescription className="mb-5">{t('app.setup_company_hint')}</CardDescription>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setFormError('');
          mutation.mutate();
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          {t('auth.email')}
          <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          {t('auth.password')}
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          {t('app.company_name')}
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </label>
        <AnimatePresence>
          {formError ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-600"
            >
              {formError}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? t('auth.working') : t('auth.submit_register')}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        {t('auth.have_account')}{' '}
        <Link className="font-medium text-brand-600 hover:text-brand-700" to="/auth/login">
          {t('auth.login_link')}
        </Link>
      </p>
    </Card>
  );
}
