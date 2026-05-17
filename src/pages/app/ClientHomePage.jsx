import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchMyCompany } from '@/api/companies';
import ClientCompanySetup from './ClientCompanySetup.jsx';
import { Card, CardTitle } from '@/components/ui/card';

export default function ClientHomePage() {
  const { t } = useTranslation();
  const q = useQuery({
    queryKey: ['company', 'me'],
    queryFn: fetchMyCompany,
  });

  if (q.isLoading) {
    return <p className="text-sm text-slate-600">{t('common.loading')}</p>;
  }
  if (q.isError) {
    return <p className="text-sm text-red-600">{t('common.load_error')}</p>;
  }

  const company = q.data?.data?.company;
  if (!company) {
    return <ClientCompanySetup />;
  }

  return (
    <Card>
      <CardTitle className="mb-2">{t('app.company_card')}</CardTitle>
      <dl className="grid gap-2 text-sm text-slate-800">
        <div>
          <dt className="font-medium text-slate-500">{t('app.name')}</dt>
          <dd>{company.name}</dd>
        </div>
        {company.legalName ? (
          <div>
            <dt className="font-medium text-slate-500">{t('app.legal_name')}</dt>
            <dd>{company.legalName}</dd>
          </div>
        ) : null}
      </dl>
    </Card>
  );
}
