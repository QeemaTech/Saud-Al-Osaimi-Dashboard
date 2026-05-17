import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approveRequest,
  fetchRequest,
  generateDocument,
  generateExcel,
  rejectRequest,
  requestChanges,
  downloadDocument,
} from '@/api/statements';
import { assignReviewer, postComment } from '@/api/review';
import { fetchUsers } from '@/api/admin';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';

export default function ReviewRequestDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');
  const [comment, setComment] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const roles = useAuthStore((s) => s.user?.roles ?? []);
  const isAdmin = roles.some((r) => ['ADMIN', 'SUPER_ADMIN'].includes(r));

  const q = useQuery({
    queryKey: ['request', id],
    queryFn: () => fetchRequest(id),
    enabled: Boolean(id),
  });

  const usersQ = useQuery({
    queryKey: ['admin', 'users', 'assign'],
    queryFn: () => fetchUsers(1),
    enabled: isAdmin,
  });

  const request = q.data?.data?.request;
  const canAct = request && ['SUBMITTED', 'UNDER_REVIEW', 'REQUIRES_CHANGES'].includes(request.status);
  const canGenerate = request?.status === 'APPROVED';

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['request', id] });
    qc.invalidateQueries({ queryKey: ['review', 'queue'] });
  };

  const approveMut = useMutation({
    mutationFn: () => approveRequest(id),
    onSuccess: () => {
      setMsg(t('review.approved'));
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const rejectMut = useMutation({
    mutationFn: () => rejectRequest(id),
    onSuccess: () => {
      setMsg(t('review.rejected'));
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const changesMut = useMutation({
    mutationFn: () => requestChanges(id),
    onSuccess: () => {
      setMsg(t('review.changes_requested'));
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const generateMut = useMutation({
    mutationFn: () => generateDocument(id),
    onSuccess: () => {
      setMsg(t('review.pdf_ready'));
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const excelMut = useMutation({
    mutationFn: () => generateExcel(id),
    onSuccess: () => {
      setMsg(t('review.excel_ready'));
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const commentMut = useMutation({
    mutationFn: () => postComment(id, comment),
    onSuccess: () => {
      setComment('');
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  const assignMut = useMutation({
    mutationFn: () => assignReviewer(id, reviewerId),
    onSuccess: () => {
      setMsg(t('review.assigned'));
      invalidate();
    },
    onError: (err) => setMsg(err?.response?.data?.message || err.message),
  });

  async function handleDownload(documentId) {
    const blob = await downloadDocument(documentId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${documentId}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (q.isLoading) return <p className="text-sm text-slate-600">{t('common.loading')}</p>;
  if (q.isError || !request) return <p className="text-sm text-red-600">{t('common.load_error')}</p>;

  const fields = request.template?.sections?.flatMap((s) => s.fields) ?? [];
  const reviewers = (usersQ.data?.data?.items ?? []).filter((u) => (u.roles ?? []).includes('REVIEWER'));

  return (
    <div className="flex flex-col gap-4">
      <Link to="/review" className="text-sm text-slate-600 underline">
        ← {t('review.queue_title')}
      </Link>
      <Card>
        <CardTitle className="mb-2">{request.company?.name || request.id}</CardTitle>
        <p className="text-sm text-slate-600">
          {t('app.status')}: <strong>{request.status}</strong>
        </p>
        {msg ? <p className="mt-2 text-sm text-slate-800">{msg}</p> : null}
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
        <CardTitle className="mb-2">{t('review.add_comment')}</CardTitle>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (comment.trim()) commentMut.mutate();
          }}
        >
          <Input value={comment} onChange={(e) => setComment(e.target.value)} className="flex-1" />
          <Button type="submit" disabled={commentMut.isPending}>
            {t('review.send_comment')}
          </Button>
        </form>
      </Card>
      {isAdmin ? (
        <Card>
          <CardTitle className="mb-2">{t('review.assign_reviewer')}</CardTitle>
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (reviewerId) assignMut.mutate();
            }}
          >
            <select
              className="rounded border border-slate-300 px-2 py-1 text-sm"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
            >
              <option value="">{t('review.select_reviewer')}</option>
              {reviewers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            <Button type="submit" disabled={assignMut.isPending}>
              {t('review.assign')}
            </Button>
          </form>
        </Card>
      ) : null}
      <Card>
        <CardTitle className="mb-3">{t('app.fields')}</CardTitle>
        <ul className="text-sm text-slate-800">
          {fields.map((f) => {
            const v = request.values?.find((x) => x.fieldId === f.id);
            let display = '—';
            if (v?.valueJson) {
              try {
                display = JSON.parse(v.valueJson);
              } catch {
                display = v.valueJson;
              }
            }
            return (
              <li key={f.id} className="border-b border-slate-100 py-1">
                <span className="text-slate-500">{f.key}:</span> {String(display)}
              </li>
            );
          })}
        </ul>
      </Card>
      {canAct ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => approveMut.mutate()} disabled={approveMut.isPending}>
            {t('review.approve')}
          </Button>
          <Button type="button" variant="outline" onClick={() => changesMut.mutate()} disabled={changesMut.isPending}>
            {t('review.request_changes')}
          </Button>
          <Button type="button" variant="outline" onClick={() => rejectMut.mutate()} disabled={rejectMut.isPending}>
            {t('review.reject')}
          </Button>
        </div>
      ) : null}
      {canGenerate ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => generateMut.mutate()} disabled={generateMut.isPending}>
            {t('review.generate_pdf')}
          </Button>
          <Button type="button" variant="outline" onClick={() => excelMut.mutate()} disabled={excelMut.isPending}>
            {t('review.generate_excel')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
