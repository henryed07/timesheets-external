import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/status-badge';
import ReviewForm from './review-form';

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });

export default async function AdminReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const timesheet = await prisma.timesheet.findUnique({
    where: { id },
    include: { entries: { orderBy: { date: 'asc' } }, user: { include: { company: true } } },
  });

  if (!timesheet) {
    notFound();
  }

  const total = timesheet.entries.reduce((sum, e) => sum + Number(e.hours), 0);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="tracking-label text-xs text-brand mb-2">Review</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {timesheet.user.firstName} {timesheet.user.lastName}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {timesheet.user.company?.name} &middot; week of {timesheet.weekStartDate.toISOString().slice(0, 10)}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={timesheet.status} />
          <p className="mt-3 text-2xl font-semibold text-ink">{total}h</p>
          <p className="text-xs tracking-label text-gray-400">Total</p>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-[11px] tracking-label text-gray-500">
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Hours</th>
              <th className="px-6 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timesheet.entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-3 text-ink-soft">
                  <span className="font-medium text-ink">{WEEKDAY_FORMAT.format(entry.date)}</span>{' '}
                  {entry.date.toISOString().slice(0, 10)}
                </td>
                <td className="px-6 py-3 text-ink-soft">{Number(entry.hours)}h</td>
                <td className="px-6 py-3 text-ink-soft">{entry.description}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50/70">
              <td className="px-6 py-3 text-xs tracking-label text-gray-500">Total</td>
              <td className="px-6 py-3 font-semibold text-ink">{total}h</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {timesheet.status === 'SUBMITTED' ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <ReviewForm timesheetId={timesheet.id} />
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          This timesheet has already been reviewed ({timesheet.status.toLowerCase()}).
        </p>
      )}
    </div>
  );
}
