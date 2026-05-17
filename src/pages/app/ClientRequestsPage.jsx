import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { fetchMyCompany, fetchCompanyRequests, fetchPeriods } from '@/api/companies';
import { createRequest } from '@/api/statements';
import { fetchTemplates } from '@/api/templates';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { PageLoader } from '@/components/ui/spinner';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';

export default function ClientRequestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [periodId, setPeriodId] = useState('');
  const [templateId, setTemplateId] = useState('');

  const me = useQuery({ queryKey: ['company', 'me'], queryFn: fetchMyCompany });
  const companyId = me.data?.data?.company?.id;

  const requests = useQuery({
    queryKey: ['requests', companyId],
    queryFn: () => fetchCompanyRequests(companyId),
    enabled: Boolean(companyId),
  });

  const periods = useQuery({
    queryKey: ['periods', companyId],
    queryFn: () => fetchPeriods(companyId),
    enabled: Boolean(companyId) && showCreate,
  });

  const templates = useQuery({
    queryKey: ['templates'],
    queryFn: () => fetchTemplates('COMMERCIAL'),
    enabled: showCreate,
  });

  const createMut = useMutation({
    mutationFn: () => createRequest(companyId, { periodId, templateId }),
    onSuccess: (envelope) => {
      const rid = envelope?.data?.request?.id;
      qc.invalidateQueries({ queryKey: ['requests', companyId] });
      setShowCreate(false);
      if (rid) navigate(`/app/requests/${rid}`);
    },
  });

  if (me.isLoading) return <PageLoader label={t('common.loading')} />;
  if (!companyId) return <p className="text-sm text-slate-600">{t('app.no_company')}</p>;

  const items = requests.data?.data?.items ?? [];
  const periodItems = periods.data?.data?.items ?? [];
  const templateItems = templates.data?.data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <FadeIn>
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <CardTitle>{t('app.requests_title')}</CardTitle>
            <Button type="button" onClick={() => setShowCreate((v) => !v)}>
              {t('app.new_request')}
            </Button>
          </div>
          <AnimatePresence>
            {showCreate ? (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex flex-col gap-3 overflow-hidden border-b border-slate-100 pb-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createMut.mutate();
                }}
              >
                <label className="text-sm font-medium text-slate-700">
                  {t('app.period')}
                  <select
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={periodId}
                    onChange={(e) => setPeriodId(e.target.value)}
                    required
                  >
                    <option value="">—</option>
                    {periodItems.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  {t('app.template')}
                  <select
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    required
                  >
                    <option value="">—</option>
                    {templateItems.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit" disabled={createMut.isPending}>
                  {t('app.create_request')}
                </Button>
              </motion.form>
            ) : null}
          </AnimatePresence>
          {requests.isLoading ? (
            <PageLoader label={t('common.loading')} />
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-600">{t('app.no_requests')}</p>
          ) : (
            <StaggerContainer className="divide-y divide-slate-100">
              {items.map((r) => (
                <StaggerItem key={r.id}>
                  <motion.div
                    className="flex flex-wrap items-center justify-between gap-2 py-3"
                    whileHover={{ x: 4 }}
                  >
                    <Link
                      className="font-semibold text-slate-900 transition hover:text-brand-600"
                      to={`/app/requests/${r.id}`}
                    >
                      {r.period?.label || r.id}
                    </Link>
                    <StatusBadge status={r.status} />
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
