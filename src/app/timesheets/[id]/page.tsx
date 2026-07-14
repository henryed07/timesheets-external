import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/status-badge';
import { saveTimesheetDraft, submitTimesheet } from '@/lib/actions/timesheets';

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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">
          Week of {timesheet.weekStartDate.toISOString().slice(0, 10)}
        </h1>
        <StatusBadge status={timesheet.status} />
      </div>
      <p className="text-gray-600 mb-6">
        {timesheet.user.firstName} {timesheet.user.lastName} &middot; {timesheet.user.company?.name}
      </p>

      {timesheet.status === 'REJECTED' && timesheet.reviewComment && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <strong>Rejected:</strong> {timesheet.reviewComment}
        </div>
      )}

      <form action={saveAction}>
        <table className="w-full text-sm border-collapse mb-4">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="py-2">Date</th>
              <th className="py-2 w-24">Hours</th>
              <th className="py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {timesheet.entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-200">
                <td className="py-2">{entry.date.toISOString().slice(0, 10)}</td>
                <td className="py-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="24"
                    name={`hours_${entry.id}`}
                    defaultValue={Number(entry.hours)}
                    disabled={!isEditable}
                    className="w-20 rounded border border-gray-300 px-2 py-1 disabled:bg-gray-100"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="text"
                    name={`description_${entry.id}`}
                    defaultValue={entry.description ?? ''}
                    disabled={!isEditable}
                    placeholder="What did you work on?"
                    className="w-full rounded border border-gray-300 px-2 py-1 disabled:bg-gray-100"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-2 font-medium">Total</td>
              <td className="py-2 font-medium">{total}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        {isEditable && (
          <div className="flex gap-3">
            <button
              type="submit"
              formAction={saveAction}
              className="rounded border border-gray-400 px-4 py-2 text-sm font-medium"
            >
              Save draft
            </button>
            <button
              type="submit"
              formAction={submitAction}
              className="rounded bg-gray-900 text-white px-4 py-2 text-sm font-medium"
            >
              Submit for approval
            </button>
          </div>
        )}
      </form>

      {(timesheet.status === 'APPROVED' || timesheet.status === 'REJECTED') && timesheet.reviewedBy && (
        <p className="text-sm text-gray-500 mt-4">
          Reviewed by {timesheet.reviewedBy.firstName} {timesheet.reviewedBy.lastName} on{' '}
          {timesheet.reviewedAt?.toISOString().slice(0, 10)}
        </p>
      )}
    </div>
  );
}
