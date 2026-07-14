import Link from 'next/link';
import { requireStaff } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import StatusBadge from '@/components/status-badge';

const STATUSES = ['SUBMITTED', 'APPROVED', 'REJECTED'] as const;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; company?: string }>;
}) {
  await requireStaff();
  const { status, company } = await searchParams;

  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });

  const timesheets = await prisma.timesheet.findMany({
    where: {
      status: status ? (status as (typeof STATUSES)[number]) : { in: [...STATUSES] },
      ...(company ? { user: { companyId: company } } : {}),
    },
    include: { user: { include: { company: true } }, entries: true },
    orderBy: { weekStartDate: 'desc' },
  });
  const pendingCount = await prisma.timesheet.count({ where: { status: 'SUBMITTED' } });

  return (
    <div>
      <p className="tracking-label text-xs text-brand mb-2">Staff</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Review Dashboard</h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs tracking-label text-gray-500">Awaiting review</p>
          <p className="mt-2 text-3xl font-semibold text-brand">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs tracking-label text-gray-500">Companies</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{companies.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs tracking-label text-gray-500">Matching results</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{timesheets.length}</p>
        </div>
      </div>

      <form className="mb-4 flex gap-3" method="get">
        <select
          name="status"
          defaultValue={status ?? ''}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          name="company"
          defaultValue={company ?? ''}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium tracking-label text-ink hover:border-ink transition-colors"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-left text-[11px] tracking-label text-gray-500">
              <th className="px-6 py-3 font-medium">Employee</th>
              <th className="px-6 py-3 font-medium">Company/Supplier</th>
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
                  <td className="px-6 py-4 font-medium text-ink">
                    {t.user.firstName} {t.user.lastName}
                  </td>
                  <td className="px-6 py-4 text-ink-soft">{t.user.company?.name}</td>
                  <td className="px-6 py-4 text-ink-soft">{t.weekStartDate.toISOString().slice(0, 10)}</td>
                  <td className="px-6 py-4 text-ink-soft">{total}h</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/${t.id}`} className="text-sm font-medium text-brand hover:text-brand-dark">
                      Review →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {timesheets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                  No timesheets match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
