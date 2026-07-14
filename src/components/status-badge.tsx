const STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-300',
  SUBMITTED: 'bg-brand-tint text-brand ring-1 ring-inset ring-brand/20',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  REJECTED: 'bg-ink text-white ring-1 ring-inset ring-ink',
};

const DOT_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-400',
  SUBMITTED: 'bg-brand',
  APPROVED: 'bg-emerald-500',
  REJECTED: 'bg-white',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-label ${STYLES[status] ?? ''}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status] ?? 'bg-gray-400'}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
