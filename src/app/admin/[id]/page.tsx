import { notFound } from 'next/navigation';
import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import ReviewForm from './review-form';

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
      <h1 className="text-2xl font-semibold mb-1">
        {timesheet.user.firstName} {timesheet.user.lastName} &mdash; week of{' '}
        {timesheet.weekStartDate.toISOString().slice(0, 10)}
      </h1>
      <p className="text-gray-600 mb-6">{timesheet.user.company?.name}</p>

      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="py-2">Date</th>
            <th className="py-2">Hours</th>
            <th className="py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {timesheet.entries.map((entry) => (
            <tr key={entry.id} className="border-b border-gray-200">
              <td className="py-2">{entry.date.toISOString().slice(0, 10)}</td>
              <td className="py-2">{Number(entry.hours)}</td>
              <td className="py-2">{entry.description}</td>
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

      {timesheet.status === 'SUBMITTED' ? (
        <ReviewForm timesheetId={timesheet.id} />
      ) : (
        <p className="text-sm text-gray-500">
          This timesheet has already been reviewed ({timesheet.status.toLowerCase()}).
        </p>
      )}
    </div>
  );
}
