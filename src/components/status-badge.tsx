const STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-200 text-gray-800',
  SUBMITTED: 'bg-amber-200 text-amber-900',
  APPROVED: 'bg-green-200 text-green-900',
  REJECTED: 'bg-red-200 text-red-900',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STYLES[status] ?? ''}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
