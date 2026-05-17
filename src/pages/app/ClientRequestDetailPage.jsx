import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchRequest,
  patchRequestValues,
  submitRequest,
  uploadAttachment,
  downloadDocument,
} from '@/api/statements';
import StatementForm from '@/components/statements/StatementForm';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

export default function ClientRequestDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const fileRef = useRef();
  const [msg, setMsg] = useState('');

  const q = useQuery({
    queryKey: ['request', id],
    queryFn: () => fetchRequest(id),
    enabled: Boolean(id),
  });

  const request = q.data?.data?.request;
  const editable = request && ['DRAFT', 'REQUIRES_CHANGES'].includes(request.status);

  const saveMutation = useMutation({
    mutationFn: (values) => patchRequestValues(id, values),
    onSuccess: () => {
      setMsg(t('app.saved'));
      qc.invalidateQueries({ queryKey: ['request', id] });
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitRequest(id),
    onSuccess: () => {
      setMsg(t('app.submitted'));
      qc.invalidateQueries({ queryKey: ['request', id] });
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadAttachment(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['request', id] }),
  });

  async function handleDownload(documentId) {
    const blob = await downloadDocument(documentId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (q.isLoading) return <p className="text-sm text-slate-600">{t('common.loading')}</p>;
  if (q.isError || !request) return <p className="text-sm text-red-600">{t('common.load_error')}</p>;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/app/requests" className="text-sm text-slate-600 underline">
        ← {t('app.requests_title')}
      </Link>
      <Card>
        <CardTitle className="mb-2">{request.period?.label || request.id}</CardTitle>
        <p className="text-sm text-slate-600">
          {t('app.status')}: <strong>{request.status}</strong>
        </p>
        {msg ? <p className="mt-2 text-sm">{msg}</p> : null}
        {editable ? (
          <div className="mt-3 flex gap-2">
            <Button type="button" variant="outline" onClick={() => submitMutation.mutate()}>
              {t('app.submit')}
            </Button>
          </div>
        ) : null}
        {(request.finalDocuments ?? []).map((d) => (
          <Button key={d.id} type="button" className="mt-2" onClick={() => handleDownload(d.id)}>
            {t('app.download')} ({d.type})
          </Button>
        ))}
      </Card>
      {request.comments?.length ? (
        <Card>
          <CardTitle className="mb-2">{t('app.comments')}</CardTitle>
          <ul className="text-sm text-slate-700">
            {request.comments.map((c) => (
              <li key={c.id} className="border-b border-slate-100 py-1">
                {c.body}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Card>
        <CardTitle className="mb-2">{t('app.attachments')}</CardTitle>
        <input
          ref={fileRef}
          type="file"
          className="text-sm"
          disabled={!editable}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadMutation.mutate(f);
          }}
        />
        <ul className="mt-2 text-sm">
          {(request.attachments ?? []).map((a) => (
            <li key={a.id}>{a.mimeType}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <CardTitle className="mb-3">{t('app.fields')}</CardTitle>
        <StatementForm
          request={request}
          editable={editable}
          saving={saveMutation.isPending}
          onSave={(values) => saveMutation.mutate(values)}
        />
      </Card>
    </div>
  );
}
