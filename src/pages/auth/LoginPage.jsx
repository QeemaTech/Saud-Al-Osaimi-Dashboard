import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const mutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: (envelope) => {
      if (!envelope?.success || !envelope.data) {
        setFormError(t('auth.invalid'));
        return;
      }
      const { accessToken, refreshToken, user } = envelope.data;
      setSession({ accessToken, refreshToken, user });
      const target = location.state?.from || '/app';
      navigate(target, { replace: true });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err.message || t('auth.invalid');
      setFormError(msg);
    },
  });

  return (
    <Card className="shadow-card-hover">
      <CardTitle className="mb-1">{t('auth.login_title')}</CardTitle>
      <CardDescription className="mb-5">{t('home.subtitle')}</CardDescription>
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
            autoComplete="current-password"
            required
          />
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
          {mutation.isPending ? t('auth.working') : t('auth.submit_login')}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        {t('auth.no_account')}{' '}
        <Link className="font-medium text-brand-600 hover:text-brand-700" to="/auth/register">
          {t('auth.register_link')}
        </Link>
      </p>
    </Card>
  );
}
