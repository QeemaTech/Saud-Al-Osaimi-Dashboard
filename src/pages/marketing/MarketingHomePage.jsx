import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketingReport } from '@/api/marketing';
import { Card, CardTitle } from '@/components/ui/card';

export default function MarketingHomePage() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ['marketing', 'report'], queryFn: fetchMarketingReport });

  return (
    <Card>
      <CardTitle className="mb-2">{t('marketing.report_title')}</CardTitle>
      {q.isLoading ? (
        <p className="text-sm text-slate-600">{t('common.loading')}</p>
      ) : q.isError ? (
        <p className="text-sm text-red-600">{t('common.load_error')}</p>
      ) : (
        <pre className="overflow-auto text-xs text-slate-800">{JSON.stringify(q.data?.data, null, 2)}</pre>
      )}
    </Card>
  );
}
