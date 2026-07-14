import Link from 'next/link';
import { requireUser } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/status-badge';

export default async function TimesheetListPage() {
  const user = await requireUser();
  const timesheets = await prisma.timesheet.findMany({
    where: { userId: user.id },
    include: { entries: true },
    orderBy: { weekStartDate: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Timesheets</h1>
        <Link href="/timesheets/new" className="rounded bg-gray-900 text-white px-4 py-2 text-sm font-medium">
          New Timesheet
        </Link>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="py-2">Week starting</th>
            <th className="py-2">Total hours</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((t) => {
            const total = t.entries.reduce((sum, e) => sum + Number(e.hours), 0);
            return (
              <tr key={t.id} className="border-b border-gray-200">
                <td className="py-2">{t.weekStartDate.toISOString().slice(0, 10)}</td>
                <td className="py-2">{total}</td>
                <td className="py-2">
                  <StatusBadge status={t.status} />
                </td>
                <td className="py-2 text-right">
                  <Link href={`/timesheets/${t.id}`} className="underline">
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
          {timesheets.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500">
                No timesheets yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
