import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';

export default function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-md">
      <FadeIn>
        <h1 className="mb-6 text-3xl font-bold text-white">{t('public.contact_title')}</h1>
      </FadeIn>
      {sent ? (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-brand-400/30 bg-brand-500/10 p-6 text-center text-brand-200"
        >
          {t('public.contact_sent')}
        </motion.p>
      ) : (
        <FadeIn delay={0.1}>
          <Card className="border-white/10 !bg-white/10 backdrop-blur-md">
            <CardTitle className="!text-white">{t('public.contact_title')}</CardTitle>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="text-sm text-slate-200">
                {t('public.contact_name')}
                <Input name="name" required className="mt-1.5 border-white/20 bg-white/10 text-white" />
              </label>
              <label className="text-sm text-slate-200">
                {t('public.contact_email')}
                <Input
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 border-white/20 bg-white/10 text-white"
                />
              </label>
              <label className="text-sm text-slate-200">
                {t('public.contact_message')}
                <textarea
                  name="message"
                  required
                  className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 p-3 text-sm text-white outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                  rows={4}
                />
              </label>
              <Button type="submit">{t('public.contact_send')}</Button>
            </form>
          </Card>
        </FadeIn>
      )}
    </section>
  );
}
