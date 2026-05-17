import { cn } from '@/lib/utils';

const statusStyles = {
  DRAFT: 'bg-slate-100 text-slate-700 ring-slate-200',
  SUBMITTED: 'bg-blue-50 text-blue-700 ring-blue-200',
  UNDER_REVIEW: 'bg-amber-50 text-amber-800 ring-amber-200',
  REQUIRES_CHANGES: 'bg-orange-50 text-orange-800 ring-orange-200',
  APPROVED: 'bg-brand-50 text-brand-800 ring-brand-200',
  FINALIZED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  REJECTED: 'bg-red-50 text-red-700 ring-red-200',
  ARCHIVED: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        statusStyles[status] ?? statusStyles.DRAFT,
        className,
      )}
    >
      {status}
    </span>
  );
}
