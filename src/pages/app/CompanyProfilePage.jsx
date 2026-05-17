import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMyCompany, updateCompany } from '@/api/companies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';

export default function CompanyProfilePage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['company', 'me'], queryFn: fetchMyCompany });
  const company = q.data?.data?.company;
  const [form, setForm] = useState(null);

  const mutation = useMutation({
    mutationFn: () => updateCompany(company.id, form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['company', 'me'] }),
  });

  if (q.isLoading) return <p className="text-sm text-slate-600">{t('common.loading')}</p>;
  if (!company) return <p className="text-sm text-slate-600">{t('app.no_company')}</p>;

  const data = form ?? company;

  return (
    <Card>
      <CardTitle className="mb-3">{t('app.company_profile')}</CardTitle>
      <form
        className="grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setForm(data);
          mutation.mutate();
        }}
      >
        {['name', 'legalName', 'taxId', 'country', 'city', 'phone'].map((key) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            {key}
            <Input
              value={data[key] ?? ''}
              onChange={(e) => setForm({ ...data, [key]: e.target.value })}
            />
          </label>
        ))}
        <Button type="submit" className="md:col-span-2" disabled={mutation.isPending}>
          {t('app.save')}
        </Button>
      </form>
    </Card>
  );
}
