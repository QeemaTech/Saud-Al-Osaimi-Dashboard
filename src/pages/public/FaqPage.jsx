import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { FadeIn } from '@/components/motion/FadeIn';

const FAQ_KEYS = ['q1', 'q2', 'q3'];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-start font-medium text-white"
        onClick={() => setOpen((o) => !o)}
      >
        {question}
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-xl text-brand-400">
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="border-t border-white/10 px-5 pb-4 pt-2 text-sm text-slate-300">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <FadeIn>
        <h1 className="mb-6 text-3xl font-bold text-white">{t('public.faq_title')}</h1>
      </FadeIn>
      {FAQ_KEYS.map((key) => (
        <FaqItem key={key} question={t(`public.faq_${key}`)} answer={t(`public.faq_${key}_a`)} />
      ))}
    </section>
  );
}
