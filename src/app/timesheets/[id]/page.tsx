import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/status-badge';
import { saveTimesheetDraft, submitTimesheet } from '@/lib/actions/timesheets';
import { primaryButton, secondaryButton } from '@/components/form-styles';

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });

export default async function TimesheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const timesheet = await prisma.timesheet.findUnique({
    where: { id },
    include: { entries: { orderBy: { date: 'asc' } }, user: { include: { company: true } }, reviewedBy: true },
  });

  if (!timesheet || timesheet.userId !== user.id) {
    notFound();
  }

  const isEditable = timesheet.status === 'DRAFT' || timesheet.status === 'REJECTED';
  const total = timesheet.entries.reduce((sum, e) => sum + Number(e.hours), 0);

  const saveAction = saveTimesheetDraft.bind(null, timesheet.id);
  const submitAction = submitTimesheet.bind(null, timesheet.id);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="tracking-label text-xs text-brand mb-2">Timesheet</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Week of {timesheet.weekStartDate.toISOString().slice(0, 10)}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {timesheet.user.firstName} {timesheet.user.lastName} &middot; {timesheet.user.company?.name}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={timesheet.status} />
          <p className="mt-3 text-2xl font-semibold text-ink">{total}h</p>
          <p className="text-xs tracking-label text-gray-400">Total</p>
        </div>
      </div>

      {timesheet.status === 'REJECTED' && timesheet.reviewComment && (
        <div className="mb-6 rounded-xl border border-ink/10 bg-ink px-4 py-3 text-sm text-white">
          <span className="tracking-label text-xs text-white/60">Rejected</span>
          <p className="mt-1">{timesheet.reviewComment}</p>
        </div>
      )}

      <form action={saveAction}>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-[11px] tracking-label text-gray-500">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="w-28 px-6 py-3 font-medium">Hours</th>
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
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="24"
                      name={`hours_${entry.id}`}
                      defaultValue={Number(entry.hours)}
                      disabled={!isEditable}
                      className="w-20 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      name={`description_${entry.id}`}
                      defaultValue={entry.description ?? ''}
                      disabled={!isEditable}
                      placeholder="What did you work on?"
                      className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                    />
                  </td>
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

        {isEditable && (
          <div className="mt-6 flex gap-3">
            <button type="submit" formAction={saveAction} className={secondaryButton}>
              Save draft
            </button>
            <button type="submit" formAction={submitAction} className={`${primaryButton} w-auto`}>
              Submit for approval
            </button>
          </div>
        )}
      </form>

      {(timesheet.status === 'APPROVED' || timesheet.status === 'REJECTED') && timesheet.reviewedBy && (
        <p className="mt-6 text-sm text-gray-400">
          Reviewed by {timesheet.reviewedBy.firstName} {timesheet.reviewedBy.lastName} on{' '}
          {timesheet.reviewedAt?.toISOString().slice(0, 10)}
        </p>
      )}
    </div>
  );
}
