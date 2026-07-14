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
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="tracking-label text-xs text-brand mb-2">Overview</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">My Timesheets</h1>
        </div>
        <Link
          href="/timesheets/new"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium tracking-label text-white hover:bg-brand-dark transition-colors"
        >
          New Timesheet
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-[11px] tracking-label text-gray-500">
              <th className="px-6 py-3 font-medium">Week starting</th>
              <th className="px-6 py-3 font-medium">Total hours</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timesheets.map((t) => {
              const total = t.entries.reduce((sum, e) => sum + Number(e.hours), 0);
              return (
                <tr key={t.id} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-6 py-4 font-medium text-ink">{t.weekStartDate.toISOString().slice(0, 10)}</td>
                  <td className="px-6 py-4 text-ink-soft">{total}h</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/timesheets/${t.id}`} className="text-sm font-medium text-brand hover:text-brand-dark">
                      Open →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {timesheets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                  No timesheets yet — create your first one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
