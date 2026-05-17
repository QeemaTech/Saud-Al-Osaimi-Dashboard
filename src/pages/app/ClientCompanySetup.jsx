import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMyCompany } from '@/api/companies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';

export default function ClientCompanySetup() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => createMyCompany({ name, activityType: 'COMMERCIAL' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company', 'me'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err.message);
    },
  });

  return (
    <Card>
      <CardTitle className="mb-3">{t('app.setup_company')}</CardTitle>
      <p className="mb-3 text-sm text-slate-600">{t('app.setup_company_hint')}</p>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError('');
          mutation.mutate();
        }}
      >
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          {t('app.company_name')}
          <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t('common.loading') : t('app.create_company')}
        </Button>
      </form>
    </Card>
  );
}
